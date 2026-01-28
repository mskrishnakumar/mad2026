'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Phone, Calendar, MessageSquare, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

// Mock data for demo
const mockStats = {
  assignedStudents: 5,
  recentActivities: 12,
  pendingFollowups: 3,
};

const mockRecentStudents = [
  { id: 'STU001', name: 'Rahul Kumar', company: 'TCS', lastContact: '2 days ago', status: 'On Track' },
  { id: 'STU002', name: 'Priya Singh', company: 'Infosys', lastContact: '5 days ago', status: 'Needs Attention' },
  { id: 'STU003', name: 'Amit Patel', company: 'Wipro', lastContact: '1 week ago', status: 'On Track' },
];

export default function VolunteerDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Volunteer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your mentoring activities.</p>
      </div>

      {/* Welcome Card */}
      <Card className="bg-gradient-to-r from-purple-500 to-violet-600 text-white">
        <CardContent className="py-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Heart className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Thank you for volunteering!</h2>
              <p className="text-purple-100">Your mentorship makes a real difference in students' lives.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.assignedStudents}</p>
                <p className="text-sm text-muted-foreground">Assigned Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.recentActivities}</p>
                <p className="text-sm text-muted-foreground">Activities Logged</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Phone className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{mockStats.pendingFollowups}</p>
                <p className="text-sm text-muted-foreground">Pending Follow-ups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Students */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Assigned Students</CardTitle>
              <CardDescription>Students you are mentoring post-placement</CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/volunteer/students">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 rounded-xl border hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{student.name}</p>
                    <p className="text-sm text-muted-foreground">Placed at {student.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      student.status === 'On Track'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {student.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1">Last contact: {student.lastContact}</p>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/volunteer/students/${student.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2" asChild>
              <Link href="/volunteer/students">
                <Users className="h-5 w-5" />
                <span>View All Students</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Schedule Follow-up</span>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span>Log Activity</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
