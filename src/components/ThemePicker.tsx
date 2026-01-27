'use client';

import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const palettes = [
  {
    name: 'Zinc',
    value: 'zinc',
    primary: 'oklch(0.205 0 0)',
    colors: ['#18181b', '#71717a', '#f4f4f5'],
  },
  {
    name: 'Blue',
    value: 'blue',
    primary: 'oklch(0.546 0.245 262.881)',
    colors: ['#2563eb', '#60a5fa', '#dbeafe'],
  },
  {
    name: 'Green',
    value: 'green',
    primary: 'oklch(0.627 0.194 149.214)',
    colors: ['#16a34a', '#4ade80', '#dcfce7'],
  },
  {
    name: 'Orange',
    value: 'orange',
    primary: 'oklch(0.705 0.213 47.604)',
    colors: ['#ea580c', '#fb923c', '#ffedd5'],
  },
  {
    name: 'Rose',
    value: 'rose',
    primary: 'oklch(0.645 0.246 16.439)',
    colors: ['#e11d48', '#fb7185', '#ffe4e6'],
  },
  {
    name: 'Violet',
    value: 'violet',
    primary: 'oklch(0.606 0.25 292.717)',
    colors: ['#7c3aed', '#a78bfa', '#ede9fe'],
  },
];

export function ThemePicker() {
  const [selected, setSelected] = useState('zinc');

  useEffect(() => {
    const saved = localStorage.getItem('color-palette');
    if (saved) {
      setSelected(saved);
      document.documentElement.setAttribute('data-palette', saved);
    }
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem('color-palette', value);
    document.documentElement.setAttribute('data-palette', value);
  };

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {palettes.map((palette) => (
        <button
          key={palette.value}
          onClick={() => handleSelect(palette.value)}
          className={cn(
            'group relative flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all',
            selected === palette.value
              ? 'border-primary bg-primary/5'
              : 'border-transparent hover:border-muted-foreground/20 hover:bg-muted/50'
          )}
        >
          <div className="flex gap-1">
            {palette.colors.map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-black/10"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="text-xs font-medium">{palette.name}</span>
          {selected === palette.value && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-primary-foreground" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
