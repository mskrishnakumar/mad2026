'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Briefcase } from 'lucide-react';

export default function JobMatchingPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Job Matching</h1>
        <p className="text-muted-foreground">Match students to employment opportunities</p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle>Find a Student</CardTitle>
          <CardDescription>Search for a student to view job recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or student code..." className="pl-10" />
            </div>
            <Button>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Results */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Select a Student</h3>
          <p className="text-muted-foreground text-center max-w-md">
            Search and select a student above to see AI-powered job recommendations based on their skills and career interests
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
