'use client';

import { Check } from 'lucide-react';

export interface ColorScheme {
  name: string;
  primary: string;
  accent: string;
  description: string;
}

export const COLOR_SCHEMES: ColorScheme[] = [
  { name: 'Classic', primary: '#1f2937', accent: '#4b5563', description: 'Professional dark gray' },
  { name: 'Ocean Blue', primary: '#1e40af', accent: '#3b82f6', description: 'Trust & reliability' },
  { name: 'Forest Green', primary: '#166534', accent: '#22c55e', description: 'Growth & balance' },
  { name: 'Royal Purple', primary: '#6b21a8', accent: '#a855f7', description: 'Creativity & wisdom' },
  { name: 'Teal', primary: '#0f766e', accent: '#14b8a6', description: 'Calm & sophisticated' },
  { name: 'Rose', primary: '#9f1239', accent: '#f43f5e', description: 'Bold & energetic' },
];

interface ColorSchemeSelectorProps {
  value: ColorScheme;
  onChange: (scheme: ColorScheme) => void;
}

export default function ColorSchemeSelector({ value, onChange }: ColorSchemeSelectorProps) {
  return (
    <div>
      <h3 className="font-medium mb-3 text-gray-900">Choose a color scheme</h3>
      <p className="text-sm text-gray-500 mb-4">
        Select a color theme for your resume to make it stand out.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {COLOR_SCHEMES.map((scheme) => {
          const isSelected = value.name === scheme.name;
          return (
            <button
              key={scheme.name}
              type="button"
              onClick={() => onChange(scheme)}
              className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-200 bg-white'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <div className="flex gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: scheme.primary }}
                />
                <div
                  className="w-6 h-6 rounded-full border border-gray-200"
                  style={{ backgroundColor: scheme.accent }}
                />
              </div>
              <p className="font-medium text-sm text-gray-900">{scheme.name}</p>
              <p className="text-xs text-gray-500">{scheme.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
