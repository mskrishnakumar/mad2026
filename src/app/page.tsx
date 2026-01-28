'use client';

import { Container } from '@/components/layout/Container';
import { RoleCard } from '@/components/landing/RoleCard';
import { ClipboardList, GraduationCap } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
      <Container className="py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          {/* MP Logo */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 rounded-2xl shadow-lg flex items-center justify-center">
              <span className="text-4xl font-black text-white tracking-tight">MP</span>
            </div>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4 text-gray-900">
            Mission <span className="text-primary">Possible</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            Revolutionizing youth mobilization through Skilling and Job Placements for India's underserved communities
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
          <RoleCard
            title="I'm a Counsellor"
            description="Onboard students, assess their skills, and match them to the right programmes and job opportunities."
            icon={ClipboardList}
            href="/counsellor/dashboard"
            colorScheme="teal"
          />
          <RoleCard
            title="I'm a Student"
            description="Discover programmes and job opportunities that match your skills and career aspirations."
            icon={GraduationCap}
            href="/student/dashboard"
            colorScheme="blue"
          />
        </div>

        {/* Footer Tagline */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Transforming lives, one match at a time
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="text-xs text-muted-foreground/70">A Magic Bus Initiative</span>
            <span className="text-xs text-muted-foreground/50">|</span>
            <span className="text-xs text-muted-foreground/70">Built by Barclays volunteers for Hack-a-Difference 2026</span>
          </div>
        </div>
      </Container>
    </main>
  );
}
