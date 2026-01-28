'use client';

import { cn } from '@/lib/utils';
import type { RiskScore } from '@/lib/types/data';

interface RiskBadgeProps {
  score: number;
  level: RiskScore['riskLevel'];
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const levelColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const levelLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

const sizeClasses = {
  sm: 'px-1.5 py-0.5 text-xs',
  md: 'px-2 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function RiskBadge({
  score,
  level,
  showScore = true,
  size = 'md',
  className,
}: RiskBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        levelColors[level],
        sizeClasses[size],
        className
      )}
    >
      {showScore && (
        <span className="font-semibold">{score}%</span>
      )}
      <span>{levelLabels[level]}</span>
    </span>
  );
}

// Compact version showing just the score as a colored dot with number
export function RiskScoreIndicator({
  score,
  level,
  className,
}: {
  score: number;
  level: RiskScore['riskLevel'];
  className?: string;
}) {
  const dotColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className={cn('h-2.5 w-2.5 rounded-full', dotColors[level])} />
      <span className="text-sm font-medium">{score}%</span>
    </div>
  );
}
