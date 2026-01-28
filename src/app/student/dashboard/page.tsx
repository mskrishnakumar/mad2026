'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Briefcase, Star, Clock } from 'lucide-react';

export default function StudentDashboard() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, Student!</h1>
        <p className="text-muted-foreground">Track your progress and explore opportunities</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-8 w-8 mx-auto mb-2 text-amber-500" />
            <p className="text-2xl font-bold">85%</p>
            <p className="text-xs text-muted-foreground">Profile Complete</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <GraduationCap className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Matched Programmes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Briefcase className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-muted-foreground">Job Opportunities</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 mx-auto mb-2 text-purple-500" />
            <p className="text-2xl font-bold">2</p>
            <p className="text-xs text-muted-foreground">Pending Actions</p>
          </CardContent>
        </Card>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-dashed border-2">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Student Portal Coming Soon</h3>
          <p className="text-muted-foreground text-center max-w-md">
            The full student experience is being developed. Soon you'll be able to view your profile,
            explore matched programmes, and track your career journey.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
