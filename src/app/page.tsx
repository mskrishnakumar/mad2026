'use client';

import { Container } from '@/components/layout/Container';
import { RoleCard } from '@/components/landing/RoleCard';
import { LanguageSelector } from '@/components/translation/LanguageSelector';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { ClipboardList, GraduationCap, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Home() {
  const { currentLanguage, changeLanguage, translateText, isTranslating } = useTranslation();

  const [translations, setTranslations] = useState({
    title: 'Mission Possible',
    subtitle: 'Revolutionizing youth mobilization through Skilling and Job Placements for India\'s underserved communities',
    studentTitle: 'I\'m a Student',
    studentDesc: 'Sign up for Upskilling Programmes and discover job opportunities that match your career aspirations.',
    adminTitle: 'I\'m an Admin',
    adminDesc: 'Onboard students, assess their skills, match them to programmes, and manage volunteer assignments.',
    volunteerTitle: 'I\'m a Volunteer',
    volunteerDesc: 'Support students post-placement as a mentor and help them succeed in their new careers.',
    tagline: 'Transforming lives, one match at a time',
    initiative: 'A Magic Bus Initiative',
    builtBy: 'Built by Barclays volunteers for Hack-a-Difference 2026',
  });

  useEffect(() => {
    if (currentLanguage !== 'en') {
      const translateAll = async () => {
        const keys = Object.keys(translations) as Array<keyof typeof translations>;
        const translatedEntries = await Promise.all(
          keys.map(async (key) => {
            const originalText = {
              title: 'Mission Possible',
              subtitle: 'Revolutionizing youth mobilization through Skilling and Job Placements for India\'s underserved communities',
              studentTitle: 'I\'m a Student',
              studentDesc: 'Sign up for Upskilling Programmes and discover job opportunities that match your career aspirations.',
              adminTitle: 'I\'m an Admin',
              adminDesc: 'Onboard students, assess their skills, match them to programmes, and manage volunteer assignments.',
              volunteerTitle: 'I\'m a Volunteer',
              volunteerDesc: 'Support students post-placement as a mentor and help them succeed in their new careers.',
              tagline: 'Transforming lives, one match at a time',
              initiative: 'A Magic Bus Initiative',
              builtBy: 'Built by Barclays volunteers for Hack-a-Difference 2026',
            }[key];
            const translated = await translateText(originalText, currentLanguage);
            return [key, translated];
          })
        );
        setTranslations(Object.fromEntries(translatedEntries) as typeof translations);
      };
      translateAll();
    } else {
      // Reset to English
      setTranslations({
        title: 'Mission Possible',
        subtitle: 'Revolutionizing youth mobilization through Skilling and Job Placements for India\'s underserved communities',
        studentTitle: 'I\'m a Student',
        studentDesc: 'Sign up for Upskilling Programmes and discover job opportunities that match your career aspirations.',
        adminTitle: 'I\'m an Admin',
        adminDesc: 'Onboard students, assess their skills, match them to programmes, and manage volunteer assignments.',
        volunteerTitle: 'I\'m a Volunteer',
        volunteerDesc: 'Support students post-placement as a mentor and help them succeed in their new careers.',
        tagline: 'Transforming lives, one match at a time',
        initiative: 'A Magic Bus Initiative',
        builtBy: 'Built by Barclays volunteers for Hack-a-Difference 2026',
      });
    }
  }, [currentLanguage, translateText]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <Container className="py-16">
        {/* Language Selector */}
        <div className="absolute top-4 right-4">
          <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* MP Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tight">MP</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-gray-900">
            {translations.title.split(' ')[0]} <span className="text-primary">{translations.title.split(' ')[1]}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            {translations.subtitle}
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <RoleCard
            title={translations.studentTitle}
            description={translations.studentDesc}
            icon={GraduationCap}
            href="/student/register"
            colorScheme="blue"
          />
          <RoleCard
            title={translations.adminTitle}
            description={translations.adminDesc}
            icon={ClipboardList}
            href="/counsellor/dashboard"
            colorScheme="teal"
          />
          <RoleCard
            title={translations.volunteerTitle}
            description={translations.volunteerDesc}
            icon={Heart}
            href="/volunteer/signup"
            colorScheme="purple"
          />
        </div>

        {/* Footer Tagline */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {translations.tagline}
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground/70">{translations.initiative}</span>
            <span className="text-xs text-muted-foreground/50">|</span>
            <span className="text-xs text-muted-foreground/70">{translations.builtBy}</span>
          </div>
        </div>
      </Container>
    </main>
  );
}
