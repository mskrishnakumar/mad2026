'use client';

import { useState, useEffect, useMemo } from 'react';
import { Search, Filter, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { PipelineStageBadge } from './PipelineStageBadge';
import type { StudentExtended, PipelineStage } from '@/lib/types/data';

type SortField = 'name' | 'pipelineStage' | 'riskScore' | 'lastLoginDate';
type SortDirection = 'asc' | 'desc';

export function DashboardTable() {
  const [students, setStudents] = useState<StudentExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'all'>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('riskScore');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  useEffect(() => {
    async function fetchStudents() {
      try {
        const res = await fetch('/api/students?extended=true');
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch students:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, []);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = [...students];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        s => s.name.toLowerCase().includes(query) || s.id.toLowerCase().includes(query)
      );
    }

    // Apply stage filter
    if (stageFilter !== 'all') {
      filtered = filtered.filter(s => s.pipelineStage === stageFilter);
    }

    // Apply risk filter
    if (riskFilter !== 'all') {
      filtered = filtered.filter(s => s.riskScore.riskLevel === riskFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'pipelineStage':
          comparison = a.pipelineStage.localeCompare(b.pipelineStage);
          break;
        case 'riskScore':
          comparison = a.riskScore.totalScore - b.riskScore.totalScore;
          break;
        case 'lastLoginDate':
          comparison = new Date(a.lastLoginDate || 0).getTime() - new Date(b.lastLoginDate || 0).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [students, searchQuery, stageFilter, riskFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white">
        <div className="animate-pulse p-6">
          <div className="mb-4 h-10 w-64 rounded bg-gray-200" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 rounded bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 border-b border-gray-100 p-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as PipelineStage | 'all')}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="all">All Stages</option>
            <option value="Student Onboarding">Student Onboarding</option>
            <option value="Counselling">Counselling</option>
            <option value="Enrollment">Enrollment</option>
            <option value="Training">Training</option>
            <option value="Pre-placement">Pre-placement</option>
            <option value="Post Placement">Post Placement</option>
          </select>
        </div>

        {/* Risk Filter */}
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          <option value="all">All Risk Levels</option>
          <option value="low">Low Risk</option>
          <option value="medium">Medium Risk</option>
          <option value="high">High Risk</option>
          <option value="critical">Critical</option>
        </select>

        {/* Result count */}
        <span className="text-sm text-gray-500">
          {filteredAndSortedStudents.length} of {students.length} students
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Student
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => handleSort('pipelineStage')}
              >
                <div className="flex items-center gap-1">
                  Pipeline Stage
                  <SortIcon field="pipelineStage" />
                </div>
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => handleSort('riskScore')}
              >
                <div className="flex items-center gap-1">
                  Risk Score
                  <SortIcon field="riskScore" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Centre
              </th>
              <th
                className="cursor-pointer px-4 py-3 text-left text-sm font-medium text-gray-600 hover:text-gray-900"
                onClick={() => handleSort('lastLoginDate')}
              >
                <div className="flex items-center gap-1">
                  Last Login
                  <SortIcon field="lastLoginDate" />
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredAndSortedStudents.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  No students found matching your filters
                </td>
              </tr>
            ) : (
              filteredAndSortedStudents.map((student) => (
                <tr
                  key={student.id}
                  className="transition-colors hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">{student.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <PipelineStageBadge stage={student.pipelineStage} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge
                      score={student.riskScore.totalScore}
                      level={student.riskScore.riskLevel}
                      size="sm"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{student.centreName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">
                      {formatDate(student.lastLoginDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <a
                      href={`/counsellor/students/${student.id}`}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
