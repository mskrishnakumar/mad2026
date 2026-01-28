'use client';

import type { PipelineStage } from '@/lib/types/data';

interface PipelineChartProps {
  data: Record<PipelineStage, number>;
  total: number;
}

const stageColors: Record<PipelineStage, { bg: string; fill: string }> = {
  'Student Onboarding': { bg: 'bg-violet-500', fill: '#8B5CF6' },
  'Counselling': { bg: 'bg-blue-500', fill: '#3B82F6' },
  'Enrollment': { bg: 'bg-cyan-500', fill: '#06B6D4' },
  'Training': { bg: 'bg-teal-500', fill: '#14B8A6' },
  'Pre-placement': { bg: 'bg-amber-500', fill: '#F59E0B' },
  'Post Placement': { bg: 'bg-green-500', fill: '#10B981' },
};

const stageOrder: PipelineStage[] = [
  'Student Onboarding',
  'Counselling',
  'Enrollment',
  'Training',
  'Pre-placement',
  'Post Placement',
];

export function PipelineChart({ data, total }: PipelineChartProps) {
  // Calculate percentages for the donut chart
  const segments = stageOrder.map(stage => ({
    stage,
    count: data[stage],
    percentage: total > 0 ? (data[stage] / total) * 100 : 0,
    color: stageColors[stage],
  }));

  // SVG donut chart calculations
  const size = 200;
  const strokeWidth = 35;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let currentOffset = 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Pipeline Distribution
      </h3>

      <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Donut Chart */}
        <div className="relative">
          <svg width={size} height={size} className="-rotate-90">
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
                  stroke={segment.color.fill}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-gray-900">{total}</span>
            <span className="text-sm text-gray-500">Students</span>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {segments.map((segment) => (
            <div key={segment.stage} className="flex items-center gap-2">
              <span
                className={`h-3 w-3 rounded-full ${segment.color.bg}`}
              />
              <span className="text-sm text-gray-600">
                {segment.stage}
              </span>
              <span className="ml-auto text-sm font-medium text-gray-900">
                {segment.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
