'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Phone, MapPin, ChevronRight, Wifi, Smartphone } from 'lucide-react';
import { RiskBadge } from './RiskBadge';
import { PipelineStageBadge } from './PipelineStageBadge';
import type { StudentExtended } from '@/lib/types/data';

export function AtRiskStudentsPanel() {
  const [students, setStudents] = useState<StudentExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAtRiskStudents() {
      try {
        const res = await fetch('/api/students?atRisk=true&limit=5');
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error('Failed to fetch at-risk students:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAtRiskStudents();
  }, []);

  if (loading) {
    return (
      <div className="rounded-xl border-2 border-red-200 bg-red-50/50 p-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 animate-pulse rounded-full bg-red-200" />
          <div className="h-6 w-40 animate-pulse rounded bg-red-200" />
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-red-100" />
          ))}
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50/50 p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
            <AlertTriangle className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-green-900">No At-Risk Students</h2>
            <p className="text-sm text-green-700">All students are within acceptable risk levels</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-red-200 bg-red-50/30 p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-red-900">At-Risk Students</h2>
            <p className="text-sm text-red-700">
              {students.length} student{students.length !== 1 ? 's' : ''} with risk score above 70%
            </p>
          </div>
        </div>
        <a
          href="/counsellor/students?filter=atRisk"
          className="flex items-center gap-1 text-sm font-medium text-red-700 hover:text-red-900 hover:underline"
        >
          View All
          <ChevronRight className="h-4 w-4" />
        </a>
      </div>

      {/* Student Cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {students.map((student) => (
          <AtRiskStudentCard key={student.id} student={student} />
        ))}
      </div>
    </div>
  );
}

function AtRiskStudentCard({ student }: { student: StudentExtended }) {
  const { riskFactors, riskScore } = student;

  // Identify top risk factors with priority ordering
  const riskIndicators = [];

  // Distance from centre - geographic barrier
  if (riskFactors.distanceFromCentreKm > 20) {
    riskIndicators.push({ icon: '📍', label: `Far from centre (${riskFactors.distanceFromCentreKm}km)` });
  }

  // No mobile & internet - connectivity barrier
  if (!riskFactors.hasInternet && !riskFactors.hasMobile) {
    riskIndicators.push({ icon: '📵', label: 'No mobile & internet' });
  } else if (!riskFactors.hasInternet) {
    riskIndicators.push({ icon: '📶', label: 'No internet access' });
  } else if (!riskFactors.hasMobile) {
    riskIndicators.push({ icon: '📱', label: 'No mobile access' });
  } else if (riskFactors.mobileType === 'basic') {
    riskIndicators.push({ icon: '📱', label: 'Basic phone only' });
  }

  // Low first week attendance
  if (riskFactors.firstWeekAttendance < 50) {
    riskIndicators.push({ icon: '📅', label: `Low attendance (${riskFactors.firstWeekAttendance}%)` });
  }

  // Poor quiz scores (below 40%)
  if (riskFactors.quizScore < 40) {
    riskIndicators.push({ icon: '📝', label: `Poor quiz score (${riskFactors.quizScore}%)` });
  }

  // High counsellor contact attempts - student unresponsive
  if (riskFactors.counsellorContactAttempts >= 4) {
    riskIndicators.push({ icon: '📞', label: `Unresponsive (${riskFactors.counsellorContactAttempts} contact attempts)` });
  }

  // Low engagement (login attempts)
  if (riskFactors.loginAttempts < 3) {
    riskIndicators.push({ icon: '🔐', label: 'Low platform engagement' });
  }

  return (
    <a
      href={`/counsellor/students/${student.id}`}
      className="group block rounded-lg border border-red-200 bg-white p-4 shadow-sm transition-all hover:border-red-300 hover:shadow-md"
    >
      {/* Header with Score */}
      <div className="mb-3 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-medium text-gray-900 group-hover:text-primary">
            {student.name}
          </h3>
          <p className="text-xs text-gray-500">{student.id}</p>
        </div>
        <RiskBadge
          score={riskScore.totalScore}
          level={riskScore.riskLevel}
          size="sm"
          showScore={true}
        />
      </div>

      {/* Pipeline Stage */}
      <div className="mb-3">
        <PipelineStageBadge stage={student.pipelineStage} size="sm" />
      </div>

      {/* Risk Indicators */}
      <div className="space-y-1">
        {riskIndicators.slice(0, 3).map((indicator, index) => (
          <div key={index} className="flex items-center gap-1.5 text-xs text-gray-600">
            <span>{indicator.icon}</span>
            <span>{indicator.label}</span>
          </div>
        ))}
        {riskIndicators.length > 3 && (
          <p className="text-xs text-gray-400">
            +{riskIndicators.length - 3} more factors
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3" />
          <span>{riskFactors.distanceFromCentreKm}km</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{riskFactors.firstWeekAttendance}% att.</span>
        </div>
        <div className="flex items-center gap-1">
          <span>{riskFactors.quizScore}% quiz</span>
        </div>
      </div>
    </a>
  );
}
