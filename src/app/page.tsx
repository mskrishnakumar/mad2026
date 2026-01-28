'use client';

import { useState, useEffect } from 'react';
import { Container } from '@/components/layout/Container';
import { RoleCard } from '@/components/landing/RoleCard';
import { LanguageSelector } from '@/components/translation/LanguageSelector';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { GraduationCap, Heart, Quote, Phone, Mail, MapPin, ChevronDown, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const testimonials = [
  {
    name: 'Priya Sharma',
    location: 'Mumbai',
    programme: 'Retail Management',
    quote: 'The Lifeskills programme changed my life. I went from being unsure about my future to landing a job at a leading retail chain. The mentors believed in me when I didn\'t believe in myself.',
    year: '2024'
  },
  {
    name: 'Rahul Kumar',
    location: 'Delhi',
    programme: 'Hospitality Training',
    quote: 'I never thought I could work in a 5-star hotel. Magic Bus gave me the skills and confidence to dream big. Today, I\'m supporting my entire family with my job.',
    year: '2024'
  },
  {
    name: 'Anjali Patel',
    location: 'Pune',
    programme: 'IT Fundamentals',
    quote: 'From a small village to working in tech - this journey seemed impossible until I joined the programme. The communication skills and technical training opened doors I never knew existed.',
    year: '2023'
  }
];

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { currentLanguage, changeLanguage, translateText } = useTranslation();

  const [translations, setTranslations] = useState({
    title: 'Mission Possible',
    subtitle: 'Revolutionizing youth mobilization through Skilling and Job Placements for India\'s underserved communities',
    studentTitle: 'I\'m a Student',
    studentDesc: 'Sign up for Upskilling Programmes and discover job opportunities that match your career aspirations.',
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
        const originalTexts: Record<string, string> = {
          title: 'Mission Possible',
          subtitle: 'Revolutionizing youth mobilization through Skilling and Job Placements for India\'s underserved communities',
          studentTitle: 'I\'m a Student',
          studentDesc: 'Sign up for Upskilling Programmes and discover job opportunities that match your career aspirations.',
          volunteerTitle: 'I\'m a Volunteer',
          volunteerDesc: 'Support students post-placement as a mentor and help them succeed in their new careers.',
          tagline: 'Transforming lives, one match at a time',
          initiative: 'A Magic Bus Initiative',
          builtBy: 'Built by Barclays volunteers for Hack-a-Difference 2026',
        };
        const translatedEntries = await Promise.all(
          keys.map(async (key) => {
            const translated = await translateText(originalTexts[key], currentLanguage);
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
        volunteerTitle: 'I\'m a Volunteer',
        volunteerDesc: 'Support students post-placement as a mentor and help them succeed in their new careers.',
        tagline: 'Transforming lives, one match at a time',
        initiative: 'A Magic Bus Initiative',
        builtBy: 'Built by Barclays volunteers for Hack-a-Difference 2026',
      });
    }
  }, [currentLanguage, translateText]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Top Navigation Bar */}
      <div className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg overflow-hidden shadow-sm">
              <Image
                src="/images/logo-hands.jpg"
                alt="Mission Possible - Hands Together"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700">Mission Possible</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Selector */}
            <LanguageSelector currentLanguage={currentLanguage} onLanguageChange={changeLanguage} />

            {/* Admin Login Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 150)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Staff Login</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <Link
                    href="/counsellor/dashboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors"
                  >
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    Magic Bus Admin
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Container className="py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* Mission Possible Logo - Hands Together */}
          <div className="flex justify-center mb-6">
            <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/logo-hands.jpg"
                alt="Mission Possible - Hands Together"
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-gray-900">
            {translations.title.split(' ')[0]} <span className="text-primary">{translations.title.split(' ')[1]}</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            {translations.subtitle}
          </p>
        </div>

        {/* Role Selection Cards - 2 columns for Student and Volunteer */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <RoleCard
            title={translations.studentTitle}
            description={translations.studentDesc}
            icon={GraduationCap}
            href="/student/register"
            colorScheme="blue"
          />
          <RoleCard
            title={translations.volunteerTitle}
            description={translations.volunteerDesc}
            icon={Heart}
            href="/volunteer/signup"
            colorScheme="purple"
          />
        </div>

        {/* Testimonials Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Success Stories</h2>
            <p className="text-muted-foreground">Hear from students who transformed their lives through Lifeskills</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <Quote className="w-8 h-8 text-teal-500/30 mb-3" />
                <p className="text-sm text-gray-600 italic mb-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {testimonial.programme} • {testimonial.location} • {testimonial.year}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Get in Touch</h2>
            <p className="text-sm text-muted-foreground">Have questions? We're here to help you on your journey</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <Phone className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Toll-Free Helpline</p>
              <p className="text-lg font-bold text-teal-600">1800-102-1400</p>
              <p className="text-xs text-muted-foreground">Mon-Sat, 9 AM - 6 PM</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <Mail className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Email Us</p>
              <a href="mailto:connect@magicbus.org" className="text-teal-600 hover:underline">
                connect@magicbus.org
              </a>
              <p className="text-xs text-muted-foreground">We respond within 24 hours</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Head Office</p>
              <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
              <a
                href="https://www.magicbus.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-teal-600 hover:underline"
              >
                www.magicbus.org
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
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
