'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ArrowLeft, Building2, Calendar, Phone, Mail, MapPin,
  MessageSquare, PhoneCall, Users, FileText, CheckCircle, Loader2
} from 'lucide-react';
import Link from 'next/link';

// Mock student data
const mockStudentData: Record<string, {
  id: string;
  name: string;
  company: string;
  position: string;
  placementDate: string;
  phone: string;
  email: string;
  address: string;
  status: string;
  skills: string[];
  activities: Array<{
    id: string;
    date: string;
    type: string;
    notes: string;
  }>;
}> = {
  'STU001': {
    id: 'STU001',
    name: 'Rahul Kumar',
    company: 'TCS',
    position: 'Junior Developer',
    placementDate: '15 Dec 2025',
    phone: '+91-9876543210',
    email: 'rahul.kumar@email.com',
    address: 'Chennai, Tamil Nadu',
    status: 'On Track',
    skills: ['Programming', 'Communication', 'Problem Solving'],
    activities: [
      { id: '1', date: '26 Jan 2026', type: 'call', notes: 'Discussed first month experience. Rahul is adapting well to the team.' },
      { id: '2', date: '19 Jan 2026', type: 'followup', notes: 'Checked in on project assignment. He was assigned to a web development project.' },
      { id: '3', date: '10 Jan 2026', type: 'meeting', notes: 'Initial onboarding check-in. Discussed workplace expectations.' },
    ],
  },
  'STU002': {
    id: 'STU002',
    name: 'Priya Singh',
    company: 'Infosys',
    position: 'Customer Support',
    placementDate: '20 Dec 2025',
    phone: '+91-9876543211',
    email: 'priya.singh@email.com',
    address: 'Chennai, Tamil Nadu',
    status: 'Needs Attention',
    skills: ['Customer Service', 'English', 'Computer Basics'],
    activities: [
      { id: '1', date: '23 Jan 2026', type: 'call', notes: 'Priya mentioned some challenges with shift timings. Need to follow up.' },
      { id: '2', date: '15 Jan 2026', type: 'followup', notes: 'Training completion confirmed.' },
    ],
  },
};

const ACTIVITY_TYPES = [
  { id: 'call', label: 'Phone Call', icon: PhoneCall },
  { id: 'meeting', label: 'Meeting', icon: Users },
  { id: 'followup', label: 'Follow-up', icon: MessageSquare },
  { id: 'note', label: 'General Note', icon: FileText },
];

export default function StudentDetailPage() {
  const params = useParams();
  const studentId = params.id as string;
  const student = mockStudentData[studentId] || mockStudentData['STU001'];

  const [selectedActivityType, setSelectedActivityType] = useState('call');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activities, setActivities] = useState(student.activities);

  async function handleSubmitActivity() {
    if (!notes.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newActivity = {
      id: String(activities.length + 1),
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      type: selectedActivityType,
      notes: notes.trim(),
    };

    setActivities([newActivity, ...activities]);
    setNotes('');
    setIsSubmitting(false);
  }

  const getActivityIcon = (type: string) => {
    const activity = ACTIVITY_TYPES.find(a => a.id === type);
    return activity ? activity.icon : MessageSquare;
  };

  const getActivityLabel = (type: string) => {
    const activity = ACTIVITY_TYPES.find(a => a.id === type);
    return activity ? activity.label : 'Note';
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/volunteer/students">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-muted-foreground">Student Progress & Updates</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-xl">
                  {student.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    student.status === 'On Track'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {student.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t">
                <div className="flex items-center gap-3 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{student.position}</p>
                    <p className="text-muted-foreground">{student.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Placed on {student.placementDate}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{student.address}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium mb-2">Skills</p>
                <div className="flex flex-wrap gap-2">
                  {student.skills.map((skill) => (
                    <span key={skill} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`tel:${student.phone}`}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Student
                </a>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`mailto:${student.email}`}>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity Log */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add New Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Log New Activity</CardTitle>
              <CardDescription>Record your interactions with this student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Activity Type Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Activity Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {ACTIVITY_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setSelectedActivityType(type.id)}
                        className={`
                          p-3 rounded-lg border-2 text-center transition-all
                          ${selectedActivityType === type.id
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                          }
                        `}
                      >
                        <Icon className={`h-5 w-5 mx-auto mb-1 ${
                          selectedActivityType === type.id ? 'text-purple-600' : 'text-gray-500'
                        }`} />
                        <span className="text-xs font-medium">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">Notes</label>
                <Textarea
                  placeholder="Describe your interaction or add notes about the student's progress..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleSubmitActivity}
                disabled={!notes.trim() || isSubmitting}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Save Activity
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>{activities.length} activities logged</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type);
                  return (
                    <div key={activity.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Icon className="h-5 w-5 text-gray-600" />
                        </div>
                        {index < activities.length - 1 && (
                          <div className="w-0.5 h-full bg-gray-200 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{getActivityLabel(activity.type)}</span>
                          <span className="text-xs text-muted-foreground">{activity.date}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.notes}</p>
                      </div>
                    </div>
                  );
                })}

                {activities.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No activities logged yet. Start by adding your first interaction!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
