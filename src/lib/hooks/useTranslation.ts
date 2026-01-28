'use client';

import { useState, useCallback, useEffect } from 'react';

interface TranslationCache {
  [key: string]: {
    [targetLang: string]: string;
  };
}

export function useTranslation() {
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');
  const [cache, setCache] = useState<TranslationCache>({});
  const [isTranslating, setIsTranslating] = useState(false);

  // Load saved language preference from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const translateText = useCallback(
    async (text: string, targetLanguage: string = currentLanguage): Promise<string> => {
      // If target language is English, return original text
      if (targetLanguage === 'en') {
        return text;
      }

      // Check cache first
      if (cache[text]?.[targetLanguage]) {
        return cache[text][targetLanguage];
      }

      try {
        setIsTranslating(true);
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text,
            targetLanguage,
          }),
        });

        if (!response.ok) {
          return text; // Fallback to original text
        }

        const data = await response.json();
        const translatedText = data.translatedText;

        // Update cache
        setCache((prev) => ({
          ...prev,
          [text]: {
            ...prev[text],
            [targetLanguage]: translatedText,
          },
        }));

        return translatedText;
      } catch {
        return text; // Fallback to original text
      } finally {
        setIsTranslating(false);
      }
    },
    [currentLanguage, cache]
  );

  const changeLanguage = useCallback((languageCode: string) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('preferredLanguage', languageCode);
  }, []);

  return {
    currentLanguage,
    changeLanguage,
    translateText,
    isTranslating,
  };
}
