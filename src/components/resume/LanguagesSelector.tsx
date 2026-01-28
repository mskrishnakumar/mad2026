'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

const LANGUAGES = [
  'Hindi',
  'English',
  'Bengali',
  'Telugu',
  'Marathi',
  'Tamil',
  'Gujarati',
  'Kannada',
];

interface LanguagesSelectorProps {
  value: string[];
  onChange: (languages: string[]) => void;
}

export default function LanguagesSelector({ value, onChange }: LanguagesSelectorProps) {
  const [customLanguage, setCustomLanguage] = useState('');

  const toggleLanguage = (language: string) => {
    if (value.includes(language)) {
      onChange(value.filter((l) => l !== language));
    } else {
      onChange([...value, language]);
    }
  };

  const addCustomLanguage = () => {
    const trimmed = customLanguage.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setCustomLanguage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomLanguage();
    }
  };

  const customLanguages = value.filter((l) => !LANGUAGES.includes(l));

  return (
    <div>
      <h3 className="font-medium mb-3 text-gray-900">Select languages you know</h3>

      <div className="grid grid-cols-2 gap-3">
        {LANGUAGES.map((language) => {
          const isSelected = value.includes(language);
          return (
            <label
              key={language}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border-2 transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                  : 'border-gray-100 hover:border-blue-200 bg-white text-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                }`}
              >
                {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={isSelected}
                onChange={() => toggleLanguage(language)}
              />
              <span className="text-sm">{language}</span>
            </label>
          );
        })}
      </div>

      {customLanguages.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-2">Other languages:</p>
          <div className="flex flex-wrap gap-2">
            {customLanguages.map((language) => (
              <span
                key={language}
                className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm"
              >
                {language}
                <button
                  type="button"
                  onClick={() => toggleLanguage(language)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add another language
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customLanguage}
            onChange={(e) => setCustomLanguage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. Urdu, Punjabi"
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
          />
          <button
            type="button"
            onClick={addCustomLanguage}
            disabled={!customLanguage.trim()}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
