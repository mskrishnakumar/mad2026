'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserPlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Onboarding</h1>
          <p className="text-muted-foreground">Register new students and track onboarding progress</p>
        </div>
        <Button asChild>
          <Link href="/counsellor/onboarding/new">
            <UserPlus className="mr-2 h-4 w-4" />
            New Student
          </Link>
        </Button>
      </div>

      {/* Onboarding Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-3xl font-bold mt-1">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold mt-1">28</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Completed Today</p>
            <p className="text-3xl font-bold mt-1">5</p>
          </CardContent>
        </Card>
      </div>

      {/* Start Onboarding Card */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <UserPlus className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Start New Onboarding</h3>
          <p className="text-muted-foreground text-center mb-4 max-w-md">
            Begin the 5-step onboarding process to register a new student into the system
          </p>
          <Button asChild>
            <Link href="/counsellor/onboarding/new">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
