'use client';

import { LayoutGrid, Table2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ViewMode = 'cards' | 'table';

interface ViewToggleProps {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 p-1',
        className
      )}
    >
      <button
        onClick={() => onChange('cards')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          value === 'cards'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        )}
        aria-pressed={value === 'cards'}
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="hidden sm:inline">Cards</span>
      </button>
      <button
        onClick={() => onChange('table')}
        className={cn(
          'flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          value === 'table'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'
        )}
        aria-pressed={value === 'table'}
      >
        <Table2 className="h-4 w-4" />
        <span className="hidden sm:inline">Table</span>
      </button>
    </div>
  );
}
