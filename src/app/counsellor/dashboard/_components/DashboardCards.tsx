'use client';

import { Users, AlertTriangle, TrendingUp, Bell, UserCheck, GraduationCap } from 'lucide-react';
import { StatsCard, StatsCardSkeleton } from './StatsCard';
import { PipelineChart } from './PipelineChart';
import { RiskDistributionChart } from './RiskDistributionChart';
import { ReferralSourceChart } from './ReferralSourceChart';
import type { DashboardStatsExtended } from '@/lib/types/data';

interface DashboardCardsProps {
  stats: DashboardStatsExtended | null;
  loading: boolean;
}

export function DashboardCards({ stats, loading }: DashboardCardsProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>
        {/* Charts Skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
          <div className="h-80 animate-pulse rounded-xl border border-gray-200 bg-gray-50" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-gray-500">Failed to load dashboard stats</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Students"
          value={stats.total}
          subtitle="Across all stages"
          icon={Users}
          color="primary"
        />
        <StatsCard
          title="At Risk"
          value={stats.atRiskCount}
          subtitle="Score above 70%"
          icon={AlertTriangle}
          color="danger"
        />
        <StatsCard
          title="Active Alerts"
          value={stats.activeAlerts}
          subtitle="Requiring attention"
          icon={Bell}
          color="warning"
        />
        <StatsCard
          title="Placement Rate"
          value={`${stats.placementRate}%`}
          subtitle="Students placed"
          icon={TrendingUp}
          color="success"
        />
      </div>

      {/* Pipeline Stage Cards */}
      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(stats.byPipelineStage).map(([stage, count]) => (
          <div
            key={stage}
            className="rounded-xl border border-gray-200 bg-white p-4 text-center"
          >
            <div className="mb-2 flex justify-center">
              {getPipelineIcon(stage)}
            </div>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500 truncate" title={stage}>
              {stage}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PipelineChart data={stats.byPipelineStage} total={stats.total} />
        <RiskDistributionChart data={stats.byRiskLevel} total={stats.total} />
      </div>

      {/* Referral Source Analytics */}
      {stats.byReferralSource && stats.byReferralSource.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-1">
          <ReferralSourceChart data={stats.byReferralSource} total={stats.total} />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickActionCard
          title="Review At-Risk Students"
          description="View students with high dropout risk scores"
          href="/counsellor/students?filter=atRisk"
          icon={AlertTriangle}
          color="danger"
        />
        <QuickActionCard
          title="New Student Onboarding"
          description="Register a new student in the system"
          href="/counsellor/onboarding/new"
          icon={UserCheck}
          color="primary"
        />
        <QuickActionCard
          title="Programme Matching"
          description="Match students to training programmes"
          href="/counsellor/programme-matching"
          icon={GraduationCap}
          color="success"
        />
      </div>
    </div>
  );
}

function getPipelineIcon(stage: string) {
  const stageColors: Record<string, string> = {
    'Student Onboarding': 'bg-violet-100 text-violet-600',
    'Counselling': 'bg-blue-100 text-blue-600',
    'Enrollment': 'bg-cyan-100 text-cyan-600',
    'Training': 'bg-teal-100 text-teal-600',
    'Pre-placement': 'bg-amber-100 text-amber-600',
    'Post Placement': 'bg-green-100 text-green-600',
  };

  const color = stageColors[stage] || 'bg-gray-100 text-gray-600';
  const stageNumber = ['Student Onboarding', 'Counselling', 'Enrollment', 'Training', 'Pre-placement', 'Post Placement'].indexOf(stage) + 1;

  return (
    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${color} font-bold`}>
      {stageNumber}
    </span>
  );
}

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: typeof AlertTriangle;
  color: 'primary' | 'success' | 'danger';
}

function QuickActionCard({ title, description, href, icon: Icon, color }: QuickActionCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary hover:bg-primary/20',
    success: 'bg-green-100 text-green-600 hover:bg-green-200',
    danger: 'bg-red-100 text-red-600 hover:bg-red-200',
  };

  return (
    <a
      href={href}
      className="group flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-5 transition-all hover:border-gray-300 hover:shadow-md"
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg transition-colors ${colorClasses[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-primary">
          {title}
        </h3>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </a>
  );
}
