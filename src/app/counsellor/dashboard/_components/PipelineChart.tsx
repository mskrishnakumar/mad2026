'use client';

import type { PipelineStage } from '@/lib/types/data';

interface PipelineChartProps {
  data: Record<PipelineStage, number>;
  total: number;
}

const stageConfig: { stage: PipelineStage; label: string; shortLabel: string; color: string; bgColor: string; borderColor: string }[] = [
  { stage: 'Student Onboarding', label: 'Onboarding', shortLabel: '1', color: '#8B5CF6', bgColor: 'bg-violet-50', borderColor: 'border-violet-200' },
  { stage: 'Counselling', label: 'Counselling', shortLabel: '2', color: '#3B82F6', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
  { stage: 'Enrollment', label: 'Enrollment', shortLabel: '3', color: '#06B6D4', bgColor: 'bg-cyan-50', borderColor: 'border-cyan-200' },
  { stage: 'Training', label: 'Training', shortLabel: '4', color: '#14B8A6', bgColor: 'bg-teal-50', borderColor: 'border-teal-200' },
  { stage: 'Pre-placement', label: 'Pre-placement', shortLabel: '5', color: '#F59E0B', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  { stage: 'Post Placement', label: 'Placed', shortLabel: '6', color: '#10B981', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
];

export function PipelineChart({ data, total }: PipelineChartProps) {
  const maxCount = Math.max(...Object.values(data), 1);

  // Calculate segments for the donut chart
  const segments = stageConfig.map(config => ({
    ...config,
    count: data[config.stage],
    percentage: total > 0 ? (data[config.stage] / total) * 100 : 0,
  }));

  // SVG donut chart calculations
  const size = 180;
  const strokeWidth = 28;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Pipeline Distribution
        </h3>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
          {total} Total
        </span>
      </div>

      {/* Donut Chart with Stats */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
        {/* Donut Chart */}
        <div className="relative mx-auto lg:mx-0">
          <svg width={size} height={size} className="-rotate-90">
            {/* Background circle */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth={strokeWidth}
            />
            {/* Data segments */}
            {segments.map((segment) => {
              const strokeDasharray = `${(segment.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -currentOffset;
              currentOffset += (segment.percentage / 100) * circumference;

              return (
                <circle
                  key={segment.stage}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
                />
              );
            })}
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900">
              {total > 0 ? Math.round((data['Post Placement'] / total) * 100) : 0}%
            </span>
            <span className="text-xs font-medium text-gray-500">Placed</span>
          </div>
        </div>

        {/* Stage Cards Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {segments.map((segment, index) => (
            <div
              key={segment.stage}
              className={`relative rounded-lg border ${segment.borderColor} ${segment.bgColor} p-3 transition-all hover:shadow-md`}
            >
              {/* Stage number badge */}
              <div
                className="absolute -top-2 -left-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow-sm"
                style={{ backgroundColor: segment.color }}
              >
                {index + 1}
              </div>

              <div className="pt-1">
                <p className="text-xs font-medium text-gray-500 truncate">{segment.label}</p>
                <p className="text-xl font-bold" style={{ color: segment.color }}>
                  {segment.count}
                </p>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(segment.count / maxCount) * 100}%`,
                      backgroundColor: segment.color
                    }}
                  />
                </div>
                <p className="mt-1 text-[10px] text-gray-400">
                  {segment.percentage.toFixed(0)}% of total
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Flow Visualization */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">Student Journey</p>
        <div className="flex items-center gap-1">
          {segments.map((segment, index) => (
            <div key={segment.stage} className="flex items-center flex-1">
              <div
                className="flex-1 h-8 flex items-center justify-center rounded-md relative overflow-hidden"
                style={{ backgroundColor: `${segment.color}15` }}
              >
                <div
                  className="absolute left-0 top-0 h-full transition-all duration-500"
                  style={{
                    width: `${segment.percentage}%`,
                    backgroundColor: segment.color,
                    opacity: 0.3
                  }}
                />
                <span
                  className="relative z-10 text-xs font-semibold"
                  style={{ color: segment.color }}
                >
                  {segment.count}
                </span>
              </div>
              {index < segments.length - 1 && (
                <svg className="w-3 h-3 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-400">
          <span>Start</span>
          <span>Completion</span>
        </div>
      </div>
    </div>
  );
}
