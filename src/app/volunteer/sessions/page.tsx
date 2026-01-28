'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Video,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

interface Session {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: 'online' | 'in-person';
  location?: string;
  meetingLink?: string;
  topic: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

// Mock data
const MOCK_SESSIONS: Session[] = [
  {
    id: '1',
    studentName: 'Rahul Kumar',
    studentEmail: 'rahul.kumar@student.magicbus.org',
    studentPhone: '+91 98765 43210',
    date: '2026-02-05',
    startTime: '10:00',
    endTime: '11:00',
    sessionType: 'online',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    topic: 'Career Guidance - IT Industry',
    status: 'upcoming',
    notes: 'Student is interested in learning about software development careers',
  },
  {
    id: '2',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@student.magicbus.org',
    studentPhone: '+91 98765 43211',
    date: '2026-02-07',
    startTime: '14:00',
    endTime: '15:30',
    sessionType: 'in-person',
    location: 'Magic Bus Centre, Andheri',
    topic: 'Resume Building Workshop',
    status: 'upcoming',
  },
  {
    id: '3',
    studentName: 'Amit Patel',
    studentEmail: 'amit.patel@student.magicbus.org',
    studentPhone: '+91 98765 43212',
    date: '2026-01-28',
    startTime: '16:00',
    endTime: '17:00',
    sessionType: 'online',
    meetingLink: 'https://meet.google.com/xyz-abcd-efg',
    topic: 'Interview Preparation',
    status: 'completed',
    notes: 'Session went well. Student is now confident for interviews.',
  },
  {
    id: '4',
    studentName: 'Sneha Reddy',
    studentEmail: 'sneha.reddy@student.magicbus.org',
    studentPhone: '+91 98765 43213',
    date: '2026-01-25',
    startTime: '11:00',
    endTime: '12:00',
    sessionType: 'online',
    meetingLink: 'https://meet.google.com/lmn-opqr-stu',
    topic: 'Communication Skills',
    status: 'cancelled',
    notes: 'Student had a family emergency',
  },
];

export default function AssignedSessionsPage() {
  const [sessions] = useState<Session[]>(MOCK_SESSIONS);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true;
    return session.status === filter;
  });

  const upcomingCount = sessions.filter(s => s.status === 'upcoming').length;
  const completedCount = sessions.filter(s => s.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assigned Sessions</h1>
        <p className="text-muted-foreground">
          View and manage your mentoring sessions with students
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Upcoming Sessions</p>
                <p className="text-3xl font-bold text-blue-600">{upcomingCount}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed Sessions</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">{sessions.length}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              All Sessions ({sessions.length})
            </Button>
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              onClick={() => setFilter('upcoming')}
              size="sm"
            >
              Upcoming ({upcomingCount})
            </Button>
            <Button
              variant={filter === 'completed' ? 'default' : 'outline'}
              onClick={() => setFilter('completed')}
              size="sm"
            >
              Completed ({completedCount})
            </Button>
            <Button
              variant={filter === 'cancelled' ? 'default' : 'outline'}
              onClick={() => setFilter('cancelled')}
              size="sm"
            >
              Cancelled ({sessions.filter(s => s.status === 'cancelled').length})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Sessions Found</h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'You have no sessions assigned yet'
                : `You have no ${filter} sessions`}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map(session => (
            <Card key={session.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{session.topic}</CardTitle>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                          session.status
                        )}`}
                      >
                        {getStatusIcon(session.status)}
                        {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                      </span>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(session.date)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column - Student & Time Info */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Student Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium">{session.studentName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${session.studentEmail}`} className="hover:underline">
                            {session.studentEmail}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <a href={`tel:${session.studentPhone}`} className="hover:underline">
                            {session.studentPhone}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Time</h4>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span>
                          {session.startTime} - {session.endTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Location & Actions */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        {session.sessionType === 'online' ? 'Meeting Details' : 'Location'}
                      </h4>
                      {session.sessionType === 'online' ? (
                        <div className="flex items-start gap-2 text-sm">
                          <Video className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-muted-foreground mb-1">Online Session</p>
                            {session.meetingLink && (
                              <a
                                href={session.meetingLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-xs break-all"
                              >
                                {session.meetingLink}
                              </a>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{session.location}</span>
                        </div>
                      )}
                    </div>

                    {session.notes && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Notes</h4>
                        <div className="flex items-start gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
                          <p className="text-muted-foreground">{session.notes}</p>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {session.status === 'upcoming' && (
                      <div className="flex gap-2 pt-2">
                        {session.sessionType === 'online' && session.meetingLink && (
                          <Button size="sm" asChild>
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Video className="h-4 w-4 mr-1" />
                              Join Meeting
                            </a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Student
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
