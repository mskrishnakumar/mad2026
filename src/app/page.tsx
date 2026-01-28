'use client';

import { useState, useEffect, useRef } from 'react';
import { Container } from '@/components/layout/Container';
import { RoleCard } from '@/components/landing/RoleCard';
import { LanguageSelector } from '@/components/translation/LanguageSelector';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { GraduationCap, Heart, Quote, Phone, Mail, MapPin, ChevronDown, LogIn, ChevronLeft, ChevronRight, Construction, X, Shield } from 'lucide-react';
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
  },
  {
    name: 'Vikram Singh',
    location: 'Bangalore',
    programme: 'Customer Service Excellence',
    quote: 'Coming from a rural background, I never imagined working in a corporate environment. The soft skills training and mock interviews prepared me perfectly. Now I lead a team of 5 at a BPO.',
    year: '2024'
  },
  {
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    programme: 'Healthcare Assistant',
    quote: 'My family couldn\'t afford higher education, but Magic Bus opened new doors. The healthcare training gave me a stable career at a multi-specialty hospital. I\'m now pursuing nursing part-time.',
    year: '2025'
  }
];

export default function Home() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { currentLanguage, changeLanguage, translateText } = useTranslation();

  const [translations, setTranslations] = useState({
    title: 'Mission Possible',
    subtitle: 'Revolutionizing youth mobilization through Skilling and Job Placements for India\'s underserved communities',
    studentTitle: 'I\'m a Student',
    studentDesc: 'Sign up for Upskilling Programmes and discover job opportunities that match your career aspirations.',
    volunteerTitle: 'I\'m a Volunteer',
    volunteerDesc: 'Support students post-placement as a mentor and help them succeed in their new careers.',
    tagline: 'Make a Difference, One Step at a Time',
    initiative: 'A Magic Bus Initiative',
    builtBy: 'Built by Barclays volunteers for Hack-a-Difference 2026',
  });

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Scroll to current testimonial
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 320; // Card width + gap
      scrollContainerRef.current.scrollTo({
        left: currentTestimonial * cardWidth,
        behavior: 'smooth'
      });
    }
  }, [currentTestimonial]);

  const scrollTestimonials = (direction: 'left' | 'right') => {
    if (direction === 'left') {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    } else {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }
  };

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
          tagline: 'Make a Difference, One Step at a Time',
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
        tagline: 'Make a Difference, One Step at a Time',
        initiative: 'A Magic Bus Initiative',
        builtBy: 'Built by Barclays volunteers for Hack-a-Difference 2026',
      });
    }
  }, [currentLanguage, translateText]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Barclays Hackathon Banner - Moved to top */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-2">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm font-medium flex items-center justify-center gap-2">
            <span className="hidden sm:inline">🏆</span>
            {translations.builtBy}
            <span className="hidden sm:inline">🏆</span>
          </p>
        </div>
      </div>

      {/* Top Navigation Bar */}
      <div className="w-full border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
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
                <span className="hidden sm:inline">Admin</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setShowAdminModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors w-full"
                  >
                    <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                    Magic Bus Admin
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Container className="py-12 sm:py-16">
        {/* Hero Section */}
        <div className="text-center mb-10 sm:mb-12">
          {/* Mission Possible Logo - Hands Together */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-lg ring-4 ring-teal-100">
              <Image
                src="/images/logo-hands.jpg"
                alt="Mission Possible - Hands Together"
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Large Title with Google Font style - optimized for mobile */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3 text-gray-900" style={{ fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            {translations.title.split(' ')[0]}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
              {translations.title.split(' ')[1]}
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-lg sm:text-xl font-medium text-teal-700 mb-4 italic">
            "{translations.tagline}"
          </p>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-2 px-4">
            {translations.subtitle}
          </p>
        </div>

        {/* Role Selection Cards - 2 columns for Student and Volunteer */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-14 sm:mb-16 px-4">
          <RoleCard
            title={translations.studentTitle}
            description={translations.studentDesc}
            icon={GraduationCap}
            href="/student/login"
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

        {/* Testimonials Section - Horizontal Scroll */}
        <div className="mb-14 sm:mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Success Stories</h2>
            <p className="text-muted-foreground">Hear from students who transformed their lives through Lifeskills</p>
          </div>

          {/* Carousel Container */}
          <div className="relative max-w-5xl mx-auto px-4">
            {/* Navigation Buttons */}
            <button
              onClick={() => scrollTestimonials('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors -ml-2 sm:-ml-4"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={() => scrollTestimonials('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors -mr-2 sm:-mr-4"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-[300px] bg-white rounded-xl p-6 shadow-sm border-2 transition-all duration-300 ${
                    index === currentTestimonial
                      ? 'border-teal-400 shadow-md scale-[1.02]'
                      : 'border-gray-100 hover:shadow-md'
                  }`}
                >
                  <Quote className="w-8 h-8 text-teal-500/30 mb-3" />
                  <p className="text-sm text-gray-600 italic mb-4 leading-relaxed line-clamp-4">
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

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'bg-teal-500 w-6'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 sm:p-8 mb-12 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Get in Touch</h2>
            <p className="text-sm text-muted-foreground">Have questions? We're here to help you on your journey</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <Phone className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Mobile</p>
              <a href="tel:+918976720830" className="text-xl font-bold text-teal-600 hover:underline">
                +91 8976720830
              </a>
              <p className="text-xs text-muted-foreground mt-1">Mon-Sat, 9 AM - 6 PM</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <Mail className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Email Us</p>
              <a href="mailto:connect@magicbus.org" className="text-teal-600 hover:underline font-medium">
                connect@magicbus.org
              </a>
              <p className="text-xs text-muted-foreground mt-1">We respond within 24 hours</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-teal-600" />
              </div>
              <p className="text-sm font-medium text-gray-900">Head Office</p>
              <p className="text-sm text-gray-600">Mumbai, Maharashtra</p>
              <a
                href="https://www.magicbus.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:underline mt-1"
              >
                www.magicbus.org
              </a>
            </div>
          </div>
        </div>

        {/* Footer with Tagline */}
        <div className="text-center mb-6">
          <p className="text-base font-medium text-gray-600">
            {translations.initiative}
          </p>
        </div>
      </Container>

      {/* Beta/Under Construction Banner */}
      <div className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <Construction className="w-5 h-5" />
            <p className="text-sm font-medium">
              Beta Version - Under Active Development
            </p>
            <Construction className="w-5 h-5" />
          </div>
          <p className="text-xs opacity-90 mt-1">
            We're continuously improving. Your feedback helps us serve students better!
          </p>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdminModal(false)}>
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-white" />
                <h3 className="text-lg font-semibold text-white">Admin Login</h3>
              </div>
              <button
                onClick={() => setShowAdminModal(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <form onSubmit={(e) => { e.preventDefault(); /* TODO: Implement login */ }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      placeholder="admin@magicbus.org"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter your password"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    type="submit"
                    onClick={() => {
                      setShowAdminModal(false);
                      window.location.href = '/counsellor/dashboard';
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-2.5 rounded-lg font-medium hover:from-teal-700 hover:to-cyan-700 transition-all shadow-md"
                  >
                    Sign In
                  </button>
                  <p className="text-xs text-center text-gray-500">
                    Authorized personnel only. Access is logged and monitored.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
