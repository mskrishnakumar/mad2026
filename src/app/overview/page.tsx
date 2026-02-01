'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Brain,
  Zap,
  Megaphone,
  TrendingUp,
  GraduationCap,
  Shield,
  Heart,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Server,
  Database,
  Globe,
  Smartphone,
  Layers,
  Rocket,
  MessageSquare,
  FileText,
  Map,
  Languages,
  Users,
  Box,
} from 'lucide-react';

const sections = [
  { id: 'problem', label: 'Problem' },
  { id: 'digital-first', label: 'Our Approach' },
  { id: 'goals', label: '4 Goals' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'portals', label: 'Portals' },
  { id: 'roadmap', label: 'Looking Ahead' },
];

const goals = [
  {
    id: 'predict',
    icon: Brain,
    color: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-700',
    badgeColor: 'bg-violet-100 text-violet-700',
    title: 'Predict & Identify',
    subtitle: 'Data-driven identification and insight',
    solutions: [
      'AI-powered risk scoring engine that flags at-risk students early',
      'Dashboard analytics with dropout prediction indicators',
      'Smart programme matching based on student profile & aptitude',
      'Data-driven insights on student demographics and centre performance',
    ],
    features: ['Risk Score Engine', 'Analytics Dashboard', 'Smart Matching'],
  },
  {
    id: 'automate',
    icon: Zap,
    color: 'from-amber-500 to-orange-600',
    bgLight: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    badgeColor: 'bg-amber-100 text-amber-700',
    title: 'Automate Onboarding',
    subtitle: 'Reduce time and effort in sign-up',
    solutions: [
      'Digital registration with guided multi-step forms',
      'Aadhar card validation with AI document verification',
      'AI chatbot assistant for guided onboarding support',
      'Automated programme eligibility checks and recommendations',
    ],
    features: ['Digital First Onboarding', 'Aadhar Validation', 'AI Chat Assistant'],
  },
  {
    id: 'optimise',
    icon: Megaphone,
    color: 'from-cyan-500 to-teal-600',
    bgLight: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    textColor: 'text-cyan-700',
    badgeColor: 'bg-cyan-100 text-cyan-700',
    title: 'Optimise Channels',
    subtitle: 'Maximum reach and impact',
    solutions: [
      'Progressive Web App (PWA) for mobile-first access without app store',
      'Multi-language support (Hindi, Marathi, Tamil, Telugu + more)',
      'AI-powered chat interface for natural conversational engagement',
      'Responsive design works on any device - phone, tablet, desktop',
      'Interactive centre map showing locations and distances — helping students choose the nearest community centre',
    ],
    features: ['PWA Mobile App', 'Multi-Language', 'AI Chat', 'Centre Map'],
  },
  {
    id: 'improve',
    icon: TrendingUp,
    color: 'from-emerald-500 to-green-600',
    bgLight: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    title: 'Improve Outcomes',
    subtitle: 'Intelligent recommendations for retention',
    solutions: [
      'Hybrid scoring algorithm for job-to-student matching',
      'Volunteer mentor assignment with availability tracking',
      'Post-placement student progress monitoring',
      'Resume Builder service — students create professional resumes tailored to their skills and target roles',
    ],
    features: ['Job Matching', 'Mentor Assignment', 'Resume Builder'],
  },
];

const techStack = [
  { name: 'Next.js 16', category: 'Frontend', icon: Globe, desc: 'App Router, SSR' },
  { name: 'React 19', category: 'Frontend', icon: Layers, desc: 'Latest with Server Components' },
  { name: 'TypeScript', category: 'Frontend', icon: FileText, desc: 'Full type safety' },
  { name: 'Tailwind CSS', category: 'Styling', icon: Layers, desc: 'Utility-first CSS' },
  { name: 'shadcn/ui', category: 'Components', icon: Layers, desc: 'Accessible components' },
  { name: 'Azure Tables', category: 'Backend', icon: Database, desc: 'Cloud data storage' },
  { name: 'Azure Blob', category: 'Backend', icon: Server, desc: 'File/document storage' },
  { name: 'Azure Containers', category: 'Hosting', icon: Box, desc: 'Container deployment' },
  { name: 'Foundry Models (OpenAI)', category: 'AI/ML', icon: Brain, desc: 'Chat, embeddings, scoring' },
  { name: 'Leaflet', category: 'Maps', icon: Map, desc: 'Centre location mapping' },
  { name: 'PWA', category: 'Mobile', icon: Smartphone, desc: 'Installable mobile app' },
  { name: 'Lucide + shadcn', category: 'UI', icon: Layers, desc: 'Icon system & design' },
];


const roadmap = [
  {
    phase: 'Phase 1',
    title: 'Production Readiness & Pilot Launch',
    items: ['Review solution design with Magic Bus leads and technology teams', 'Extensive end-to-end and integration testing across all portals', 'Full authentication system with role-based access, email verification and password recovery', 'Fine-tuning AI smart matching with real programme and job outcome data', 'SMS/WhatsApp notification integration'],
    status: 'next',
  },
  {
    phase: 'Phase 2',
    title: 'Advanced Analytics & AI',
    items: ['AI Interview Coach — mock interview practice with feedback', 'A/B testing for engagement channels', 'ML model training on real student data', 'Predictive churn/dropout modelling'],
    status: 'planned',
  },
  {
    phase: 'Phase 3',
    title: 'Scale & Expand',
    items: ['Multi-centre deployment across India', 'Employer integration — direct job posting portal and placement pipeline', 'Integration with government skill databases', 'Operational transfer and handover to Magic Bus technology team'],
    status: 'future',
  },
];


export default function OverviewPage() {
  const [activeSection, setActiveSection] = useState('problem');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120;
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image src="/images/logo-hands.jpg" alt="Mission Possible" width={32} height={32} className="w-full h-full object-cover" />
              </div>
              <span className="text-sm font-bold text-gray-800 hidden sm:inline">Blueprint</span>
            </Link>

            {/* Section Anchors */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all ${
                    activeSection === section.id
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>

            {/* Back to app */}
            <Link href="/" className="text-sm text-teal-600 hover:text-teal-800 font-medium shrink-0 hidden sm:flex items-center gap-1">
              Home <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - matching landing page style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-lg ring-4 ring-teal-100">
              <Image src="/images/logo-hands.jpg" alt="Mission Possible" width={96} height={96} className="w-full h-full object-cover" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-3 text-gray-900">
            Mission{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-600">
              Possible
            </span>
          </h1>

          <p className="text-lg sm:text-xl font-medium text-teal-700 mb-4 italic">
            &quot;Solution Blueprint&quot;
          </p>

          <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto mb-3 px-4">
            A digital-first, AI-powered platform revolutionising youth mobilisation for skilling and job placements across India&apos;s underserved communities
          </p>

          <p className="text-sm text-gray-500 font-medium">
            Built by Barclays volunteers for Make a Difference 2026, in partnership with Magic Bus
          </p>

          <div className="mt-4 inline-flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5">
            <Brain className="w-3.5 h-3.5 text-gray-400" />
            <p className="text-xs text-gray-400">Built with AI coding agents for faster time to market</p>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">

        {/* ─── PROBLEM SECTION ─── */}
        <section id="problem" className="py-16 border-b border-gray-100">
          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why This Matters</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Magic Bus empowers young people aged 18-25 through skilling and job placement programmes, but today&apos;s process faces critical bottlenecks.
            </p>
          </div>

          {/* Problem stat cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { stat: '60 days', label: 'Current onboarding time', sublabel: 'Target: under 7 days' },
              { stat: 'Manual', label: 'Screening & engagement', sublabel: 'Fragmented processes' },
              { stat: 'Low', label: 'Channel visibility', sublabel: 'Resources misallocated' },
              { stat: 'High', label: 'Dropout risk', sublabel: 'During mobilisation & post-placement' },
            ].map((item, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 border border-gray-100 text-center">
                <p className="text-2xl font-bold text-red-500 mb-1">{item.stat}</p>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-1">{item.sublabel}</p>
              </div>
            ))}
          </div>

        </section>

        {/* ─── OUR APPROACH SECTION ─── */}
        <section id="digital-first" className="py-16 border-b border-gray-100">
          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Be Useful, Not Just Impressive</h2>
            <p className="text-gray-500 max-w-2xl mx-auto mb-2">
              Our mission: predict the right candidates, automate onboarding, optimise engagement channels, and improve retention and job placement outcomes — transforming a 60-day process into a seamless digital experience.
            </p>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We chose to ship something real and useful over something that only looks good in a demo. Every feature here is functional end-to-end, powered by seeded sample data. What you see is what works — imperfections included.
            </p>
          </div>

          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Why Digital First?</h3>
            <p className="text-gray-500 max-w-2xl mx-auto">
              India&apos;s youth are already digital. Our approach meets them where they are — on their smartphones.
            </p>
          </div>

          {/* Key stats from PIB India */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { stat: '97.1%', label: 'Youth use mobile phones', sublabel: 'Ages 15-29, up from 94.2% in 2022-23' },
              { stat: '95.5%', label: 'Own smartphones', sublabel: 'Among rural phone owners aged 15-29' },
              { stat: '94.3%', label: 'Internet access', sublabel: 'Youth accessed internet in last 3 months' },
              { stat: '85.1%', label: 'Digitally literate', sublabel: 'Can send messages with attachments' },
            ].map((item, i) => (
              <div key={i} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-5 border border-teal-100 text-center">
                <p className="text-2xl font-bold text-teal-600 mb-1">{item.stat}</p>
                <p className="text-sm font-medium text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 mt-1">{item.sublabel}</p>
              </div>
            ))}
          </div>

          {/* Digital First rationale */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">Digital First means we can:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: Smartphone, text: 'Reach youth on the devices they already use — mobile-first, accessible from any browser' },
                { icon: Languages, text: 'Engage in their preferred language with real-time AI translation across 8+ languages' },
                { icon: Zap, text: 'Automate the 60-day onboarding process into a guided digital journey' },
                { icon: Brain, text: 'Use AI to predict outcomes, score risk, and match candidates intelligently' },
                { icon: Globe, text: 'Scale across centres and geographies without proportional staffing increases' },
                { icon: MessageSquare, text: 'Provide 24/7 AI chat support instead of relying on office-hours-only counsellors' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-teal-600" />
                  </div>
                  <p className="text-sm text-gray-700">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Source citation */}
          <p className="text-xs text-gray-400 text-center">
            Source: Ministry of Statistics &amp; Programme Implementation — Comprehensive Modular Survey: Telecom (Jan-Mar 2025),{' '}
            <a
              href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2132330&reg=3&lang=2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-500 hover:underline"
            >
              PIB India
            </a>
          </p>
        </section>

        {/* ─── 4 GOALS SECTION ─── */}
        <section id="goals" className="py-16 border-b border-gray-100">
          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Mapping Solutions to Goals</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Every feature we built ties directly back to one of the four hackathon goals. Here&apos;s how.
            </p>
          </div>

          {/* Goal cards - outline style */}
          <div className="grid md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="rounded-xl border border-gray-200 overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
                  <goal.icon className={`w-5 h-5 ${goal.textColor}`} />
                  <div>
                    <h3 className="font-bold text-gray-900">{goal.title}</h3>
                    <p className="text-xs text-gray-500">{goal.subtitle}</p>
                  </div>
                </div>

                {/* What we built */}
                <div className="px-5 py-4 space-y-2.5">
                  {goal.solutions.map((solution, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                      <p className="text-sm text-gray-700">{solution}</p>
                    </div>
                  ))}

                  {/* Feature badges */}
                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-gray-100 mt-3">
                    {goal.features.map((f) => (
                      <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{f}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ARCHITECTURE SECTION ─── */}
        <section id="architecture" className="py-16 border-b border-gray-100">
          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tech Stack & Architecture</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Modern, cloud-native, mobile-first — built to scale.
            </p>
          </div>

          {/* Why these choices */}
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4 text-blue-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">React 19 + Next.js 16</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Server Components reduce bundle size for low-bandwidth areas. App Router enables fast page transitions critical for mobile users on 3G/4G networks.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
                <Box className="w-4 h-4 text-purple-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Azure Containers</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Containerised deployment ensures consistent environments from dev to production. Scales horizontally to handle spikes during mobilisation drives across centres.</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center mb-3">
                <Database className="w-4 h-4 text-teal-600" />
              </div>
              <h4 className="font-bold text-gray-900 text-sm mb-1">Azure Tables + Blob</h4>
              <p className="text-sm text-gray-500 leading-relaxed">Cost-effective serverless storage that scales with demand. Table Storage handles structured student data; Blob Storage manages documents like Aadhar scans and resumes.</p>
            </div>
          </div>

          {/* Tech badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {techStack.map((tech) => (
              <div key={tech.name} className="bg-white rounded-lg border border-gray-200 p-3 text-center hover:shadow-md transition-shadow">
                <tech.icon className="w-5 h-5 text-gray-600 mx-auto mb-1.5" />
                <p className="text-sm font-semibold text-gray-900">{tech.name}</p>
                <p className="text-xs text-gray-400">{tech.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── PORTALS SECTION ─── */}
        <section id="portals" className="py-16 border-b border-gray-100">
          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Three Portals, One Platform</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Student Portal */}
            <div className="rounded-xl border-2 border-blue-200 overflow-hidden bg-white">
              <div className="p-5 border-b border-blue-100">
                <div className="flex items-center gap-3 mb-1">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-bold text-gray-900">Student Portal</h3>
                </div>
                <p className="text-sm text-gray-500 ml-9">For youth aged 18-25</p>
              </div>
              <div className="p-5 space-y-2">
                {['Register & complete profile', 'Browse upskilling programmes', 'Explore job opportunities', 'Build professional resume', 'Track progress & notifications'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    {item}
                  </div>
                ))}
                <Link href="/student/login" className="mt-4 flex items-center justify-center gap-2 w-full border-2 border-blue-600 text-blue-600 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
                  Try Student Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Counsellor Portal */}
            <div className="rounded-xl border-2 border-teal-200 overflow-hidden bg-white">
              <div className="p-5 border-b border-teal-100">
                <div className="flex items-center gap-3 mb-1">
                  <Shield className="w-6 h-6 text-teal-600" />
                  <h3 className="text-lg font-bold text-gray-900">Counsellor Portal</h3>
                </div>
                <p className="text-sm text-gray-500 ml-9">For Magic Bus staff</p>
              </div>
              <div className="p-5 space-y-2">
                {['Dashboard with live analytics', 'Onboard students digitally', 'Match to programmes & jobs', 'Assign volunteer mentors', 'Monitor at-risk students'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    {item}
                  </div>
                ))}
                <Link href="/counsellor/dashboard" className="mt-4 flex items-center justify-center gap-2 w-full border-2 border-teal-600 text-teal-600 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-50 transition-colors">
                  Try Counsellor Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Volunteer Portal */}
            <div className="rounded-xl border-2 border-purple-200 overflow-hidden bg-white">
              <div className="p-5 border-b border-purple-100">
                <div className="flex items-center gap-3 mb-1">
                  <Heart className="w-6 h-6 text-purple-600" />
                  <h3 className="text-lg font-bold text-gray-900">Volunteer Portal</h3>
                </div>
                <p className="text-sm text-gray-500 ml-9">For Barclays mentors</p>
              </div>
              <div className="p-5 space-y-2">
                {['Sign up as a mentor', 'Set availability schedule', 'View assigned students', 'Track mentee progress', 'Post-placement support'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    {item}
                  </div>
                ))}
                <Link href="/volunteer/signup" className="mt-4 flex items-center justify-center gap-2 w-full border-2 border-purple-600 text-purple-600 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                  Try Volunteer Portal <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Volunteer centralisation - game changer callout */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-teal-50 rounded-xl p-6 border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shrink-0 shadow-sm">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Volunteer Support: A Game Changer</h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-3">
                  By enrolling volunteers centrally through a single platform, we unlock a dual impact for Magic Bus:
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="bg-white/70 rounded-lg p-3 border border-purple-100">
                    <p className="text-xs font-semibold text-purple-700 uppercase tracking-wide mb-1">Mobilisation</p>
                    <p className="text-sm text-gray-600">
                      Volunteers become a trusted referral channel — reaching eligible youth in their own communities and networks, amplifying outreach without additional field staff.
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-teal-100">
                    <p className="text-xs font-semibold text-teal-700 uppercase tracking-wide mb-1">Post-Placement Support</p>
                    <p className="text-sm text-gray-600">
                      Matched mentors provide ongoing guidance after job placement — reducing dropout, building confidence, and improving long-term retention outcomes.
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3 border border-emerald-100">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">Alumni as Volunteers</p>
                    <p className="text-sm text-gray-600">
                      Successfully placed alumni return as volunteer mentors — guiding the next generation through the same journey they completed, creating a self-sustaining cycle of impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* ─── ROADMAP SECTION ─── */}
        <section id="roadmap" className="py-16">
          <div className="text-center mb-10">

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Looking Ahead</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Our roadmap for taking Mission Possible from hackathon prototype to production platform.
            </p>
          </div>

          {/* AI-built callout */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 mb-8">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm mb-1">Built with AI Coding Agents</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  This solution was largely developed using AI coding agents for faster time to market. This approach enabled rapid prototyping across three portals and 15+ API endpoints. As a critical next step, <strong className="text-gray-800">extensive end-to-end testing, integration testing, and security audits</strong> are required before production deployment to ensure reliability and data safety.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {roadmap.map((phase) => (
              <div key={phase.phase} className="relative rounded-xl border border-gray-200 overflow-hidden">
                <div className={`px-5 py-3 ${
                  phase.status === 'next'
                    ? 'bg-teal-600 text-white'
                    : phase.status === 'planned'
                    ? 'bg-gray-100 text-gray-800'
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider">{phase.phase}</span>
                    {phase.status === 'next' && (
                      <span className="flex items-center gap-1 text-xs"><Rocket className="w-3 h-3" /> Up Next</span>
                    )}
                  </div>
                  <h3 className="font-bold mt-1">{phase.title}</h3>
                </div>
                <div className="p-5 space-y-2.5">
                  {phase.items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        phase.status === 'next' ? 'bg-teal-500' : 'bg-gray-300'
                      }`} />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer - matching landing page style */}
      <footer className="w-full bg-gradient-to-r from-slate-100 to-gray-100 text-gray-600 py-8 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            Built by Barclays volunteers for <strong className="text-gray-800">Make a Difference 2026</strong>
          </p>
          <p className="text-xs text-gray-500">
            In partnership with Magic Bus India Foundation
          </p>
          <div className="mt-4 flex justify-center gap-4">
            <Link href="/" className="text-sm text-teal-600 hover:text-teal-800 font-medium">
              Back to Home
            </Link>
            <Link href="/counsellor/dashboard" className="text-sm text-teal-600 hover:text-teal-800 font-medium">
              View Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
