'use client';

import { useState } from 'react';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (languageCode: string) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLanguage = LANGUAGES.find((lang) => lang.code === currentLanguage) || LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/80 hover:bg-white shadow-sm border border-gray-200 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">{selectedLanguage.nativeName}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 z-20">
            <div className="py-1">
              {LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    onLanguageChange(language.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    currentLanguage === language.code
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{language.nativeName}</span>
                    <span className="text-xs text-gray-500">{language.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
