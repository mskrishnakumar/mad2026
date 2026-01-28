'use client';

import { Users, GraduationCap, Building, Share2, Handshake, Landmark, UserPlus, Search } from 'lucide-react';
import type { ReferralSourceStats, ReferralSource } from '@/lib/types/data';

interface ReferralSourceChartProps {
  data: ReferralSourceStats[];
  total: number;
}

const sourceConfig: Record<ReferralSource, {
  label: string;
  icon: typeof Users;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  alumni: {
    label: 'Alumni Referral',
    icon: GraduationCap,
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
  },
  community: {
    label: 'Community Outreach',
    icon: Users,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
  },
  school: {
    label: 'School/College',
    icon: Building,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
    textColor: 'text-indigo-700',
  },
  social_media: {
    label: 'Social Media',
    icon: Share2,
    color: 'bg-pink-500',
    bgColor: 'bg-pink-50',
    textColor: 'text-pink-700',
  },
  ngo_partner: {
    label: 'NGO Partner',
    icon: Handshake,
    color: 'bg-teal-500',
    bgColor: 'bg-teal-50',
    textColor: 'text-teal-700',
  },
  government: {
    label: 'Govt. Scheme',
    icon: Landmark,
    color: 'bg-amber-500',
    bgColor: 'bg-amber-50',
    textColor: 'text-amber-700',
  },
  word_of_mouth: {
    label: 'Referred by Friend',
    icon: UserPlus,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
  },
  self_discovery: {
    label: 'Self Discovery',
    icon: Search,
    color: 'bg-gray-500',
    bgColor: 'bg-gray-50',
    textColor: 'text-gray-700',
  },
};

export function ReferralSourceChart({ data, total }: ReferralSourceChartProps) {
  // Filter to show only sources with students and sort by retention rate
  const sortedData = data
    .filter(d => d.totalStudents > 0)
    .sort((a, b) => b.retentionRate - a.retentionRate);

  const maxRetention = Math.max(...sortedData.map(d => d.retentionRate), 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Referral Sources by Retention
          </h3>
          <p className="text-sm text-gray-500">Which sources bring students who stay in the program</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          {total} students
        </span>
      </div>

      {/* Sources List */}
      <div className="space-y-3">
        {sortedData.map((stat) => {
          const config = sourceConfig[stat.source];
          const Icon = config.icon;
          const barWidth = maxRetention > 0 ? (stat.retentionRate / maxRetention) * 100 : 0;

          return (
            <div key={stat.source} className="group rounded-lg border border-gray-100 p-3 hover:border-gray-200 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                {/* Icon */}
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${config.bgColor}`}>
                  <Icon className={`h-5 w-5 ${config.textColor}`} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {config.label}
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-gray-400">{stat.totalStudents} students</span>
                      <span className={`font-bold ${config.textColor}`}>{stat.retentionRate}%</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${config.color}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Total placements from all sources</span>
          <span className="font-bold text-gray-900">
            {data.reduce((sum, d) => sum + d.placedCount, 0)} students
          </span>
        </div>
      </div>
    </div>
  );
}
