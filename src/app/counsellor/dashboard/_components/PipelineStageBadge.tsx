'use client';

import { cn } from '@/lib/utils';
import type { PipelineStage } from '@/lib/types/data';

interface PipelineStageBadgeProps {
  stage: PipelineStage;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const stageColors: Record<PipelineStage, string> = {
  'Student Onboarding': 'bg-violet-100 text-violet-700 border-violet-200',
  'Counselling': 'bg-blue-100 text-blue-700 border-blue-200',
  'Enrollment': 'bg-cyan-100 text-cyan-700 border-cyan-200',
  'Training': 'bg-teal-100 text-teal-700 border-teal-200',
  'Pre-placement': 'bg-amber-100 text-amber-700 border-amber-200',
  'Post Placement': 'bg-green-100 text-green-700 border-green-200',
};

const stageIcons: Record<PipelineStage, string> = {
  'Student Onboarding': '1',
  'Counselling': '2',
  'Enrollment': '3',
  'Training': '4',
  'Pre-placement': '5',
  'Post Placement': '6',
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function PipelineStageBadge({
  stage,
  size = 'md',
  className,
}: PipelineStageBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        stageColors[stage],
        sizeClasses[size],
        className
      )}
    >
      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-current/20 text-[10px] font-bold">
        {stageIcons[stage]}
      </span>
      <span>{stage}</span>
    </span>
  );
}

// Get the order/position of a stage (1-6)
export function getStageOrder(stage: PipelineStage): number {
  const order: Record<PipelineStage, number> = {
    'Student Onboarding': 1,
    'Counselling': 2,
    'Enrollment': 3,
    'Training': 4,
    'Pre-placement': 5,
    'Post Placement': 6,
  };
  return order[stage];
}

// Get color classes for a stage
export function getStageColor(stage: PipelineStage): string {
  return stageColors[stage];
}
