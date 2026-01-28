'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GraduationCap, Clock, Award, TrendingUp, ChevronRight } from 'lucide-react';

const enrolledProgrammes = [
  {
    id: 1,
    name: 'Digital Skills Foundation',
    category: 'Technology',
    progress: 45,
    duration: '3 months',
    startDate: '25 Jan 2026',
    status: 'In Progress',
  },
];

const recommendedProgrammes = [
  {
    id: 2,
    name: 'Customer Service Excellence',
    category: 'Soft Skills',
    duration: '2 months',
    employmentRate: '85%',
    description: 'Learn professional communication and customer handling skills.',
  },
  {
    id: 3,
    name: 'Basic Accounting',
    category: 'Finance',
    duration: '3 months',
    employmentRate: '78%',
    description: 'Fundamental accounting principles and practical bookkeeping.',
  },
  {
    id: 4,
    name: 'Retail Management',
    category: 'Business',
    duration: '2 months',
    employmentRate: '82%',
    description: 'Skills for managing retail operations and inventory.',
  },
];

export default function ProgrammesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Programmes</h1>
        <p className="text-muted-foreground">Track your enrolled programmes and explore new opportunities</p>
      </div>

      {/* Enrolled Programmes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Enrolled Programmes
          </CardTitle>
          <CardDescription>Your current learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          {enrolledProgrammes.length > 0 ? (
            <div className="space-y-4">
              {enrolledProgrammes.map((programme) => (
                <div key={programme.id} className="p-4 border rounded-xl bg-gradient-to-r from-blue-50 to-white">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        {programme.category}
                      </span>
                      <h3 className="font-semibold text-lg mt-2">{programme.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {programme.duration}
                        </span>
                        <span>Started: {programme.startDate}</span>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {programme.status}
                    </span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{programme.progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${programme.progress}%` }}
                      />
                    </div>
                  </div>
                  <Button className="mt-4" size="sm">
                    Continue Learning
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>You haven't enrolled in any programmes yet.</p>
              <p className="text-sm">Explore recommended programmes below!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommended Programmes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recommended For You
          </CardTitle>
          <CardDescription>Programmes matched to your profile and aspirations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedProgrammes.map((programme) => (
              <div key={programme.id} className="p-4 border rounded-xl hover:border-primary/50 transition-colors">
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                  {programme.category}
                </span>
                <h3 className="font-semibold mt-2">{programme.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{programme.description}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {programme.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    {programme.employmentRate} placement
                  </span>
                </div>
                <Button variant="outline" size="sm" className="mt-3 w-full">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
