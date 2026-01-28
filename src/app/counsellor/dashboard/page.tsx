'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  UserPlus,
  CheckCircle,
  Clock,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

interface StudentStats {
  total: number;
  active: number;
  matched: number;
  placed: number;
  onboarding: number;
}

interface JobStats {
  totalJobs: number;
  totalOpenings: number;
  activeJobs: number;
  industries: number;
}

export default function CounsellorDashboard() {
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [jobStats, setJobStats] = useState<JobStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [studentsRes, jobsRes] = await Promise.all([
          fetch('/api/students?stats=true'),
          fetch('/api/jobs?stats=true')
        ]);

        if (studentsRes.ok) {
          setStudentStats(await studentsRes.json());
        }
        if (jobsRes.ok) {
          setJobStats(await jobsRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  const stats = [
    {
      title: 'Total Students',
      value: loading ? '-' : studentStats?.total.toString() || '0',
      change: `${studentStats?.active || 0} active`,
      changeType: 'neutral' as const,
      icon: Users,
    },
    {
      title: 'Pending Onboarding',
      value: loading ? '-' : studentStats?.onboarding.toString() || '0',
      change: 'Awaiting completion',
      changeType: 'neutral' as const,
      icon: Clock,
    },
    {
      title: 'Students Matched',
      value: loading ? '-' : studentStats?.matched.toString() || '0',
      change: `${studentStats?.placed || 0} placed`,
      changeType: 'positive' as const,
      icon: CheckCircle,
    },
    {
      title: 'Job Openings',
      value: loading ? '-' : jobStats?.totalOpenings.toString() || '0',
      change: `${jobStats?.activeJobs || 0} active jobs`,
      changeType: 'positive' as const,
      icon: Briefcase,
    },
  ];

  const quickActions = [
    {
      title: 'New Student',
      description: 'Start onboarding a new student',
      href: '/counsellor/onboarding/new',
      color: 'bg-teal-500 hover:bg-teal-600',
      icon: UserPlus,
    },
    {
      title: 'Match Programme',
      description: 'Find programmes for students',
      href: '/counsellor/programme-matching',
      color: 'bg-blue-500 hover:bg-blue-600',
      icon: GraduationCap,
    },
    {
      title: 'Match Jobs',
      description: 'Find job opportunities',
      href: '/counsellor/job-matching',
      color: 'bg-purple-500 hover:bg-purple-600',
      icon: Briefcase,
    },
    {
      title: 'View Students',
      description: 'Browse all students',
      href: '/counsellor/students',
      color: 'bg-amber-500 hover:bg-amber-600',
      icon: Users,
    },
  ];

  const recentActivity = [
    { action: 'Onboarded', student: 'Priya Sharma', time: '2 hours ago' },
    { action: 'Matched to IT Programme', student: 'Rahul Kumar', time: '3 hours ago' },
    { action: 'Placed at TCS', student: 'Anita Patel', time: '5 hours ago' },
    { action: 'Onboarded', student: 'Vikram Singh', time: '1 day ago' },
    { action: 'Matched to Healthcare Programme', student: 'Meera Reddy', time: '1 day ago' },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {loading ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                      ) : (
                        stat.value
                      )}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {stat.change}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link key={action.title} href={action.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div
                      className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3`}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/counsellor/students">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div>
                  <p className="font-medium text-gray-900">{activity.student}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
