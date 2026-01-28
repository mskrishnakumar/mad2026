'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Wifi,
  WifiOff,
  Smartphone,
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  PhoneCall,
  Target,
  Loader2,
  FileText,
  Users,
  TrendingUp,
  Shield,
} from 'lucide-react';
import { RiskBadge } from '../../dashboard/_components/RiskBadge';
import { PipelineStageBadge } from '../../dashboard/_components/PipelineStageBadge';
import type { StudentExtended } from '@/lib/types/data';

interface RecommendedAction {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: React.ElementType;
  category: string;
}

function getRecommendedActions(student: StudentExtended): RecommendedAction[] {
  const actions: RecommendedAction[] = [];
  const { riskFactors } = student;

  // Distance-based recommendations (10km+ is concerning)
  if (riskFactors.distanceFromCentreKm >= 10) {
    actions.push({
      id: 'transport',
      title: 'Arrange Transport Support',
      description: `Student is ${riskFactors.distanceFromCentreKm}km from centre. Consider transport allowance, carpool arrangements, or transfer to a closer centre.`,
      priority: riskFactors.distanceFromCentreKm >= 15 ? 'high' : 'medium',
      icon: MapPin,
      category: 'Geographic Barrier',
    });
  }

  // Connectivity-based recommendations
  if (!riskFactors.hasInternet && !riskFactors.hasMobile) {
    actions.push({
      id: 'connectivity',
      title: 'Address Connectivity Gap',
      description: 'Student lacks both internet and mobile access. Provide offline learning materials and schedule in-person check-ins.',
      priority: 'high',
      icon: WifiOff,
      category: 'Digital Divide',
    });
  } else if (!riskFactors.hasInternet) {
    actions.push({
      id: 'internet',
      title: 'Provide Internet Access Support',
      description: 'Student lacks home internet. Consider data recharge support or provide offline content via USB.',
      priority: 'medium',
      icon: Wifi,
      category: 'Digital Divide',
    });
  } else if (!riskFactors.hasMobile) {
    actions.push({
      id: 'mobile',
      title: 'Ensure Communication Channel',
      description: 'Student has no mobile access. Use alternative contact methods (family phone, email) or consider device loan program.',
      priority: 'medium',
      icon: Smartphone,
      category: 'Digital Divide',
    });
  } else if (riskFactors.mobileType === 'basic') {
    actions.push({
      id: 'basicphone',
      title: 'Optimize for Basic Phone',
      description: 'Student uses a basic phone. Send SMS-based content and avoid app-dependent communications.',
      priority: 'low',
      icon: Smartphone,
      category: 'Digital Divide',
    });
  }

  // Attendance-based recommendations
  if (riskFactors.firstWeekAttendance < 50) {
    actions.push({
      id: 'attendance',
      title: 'Urgent Attendance Intervention',
      description: `First week attendance is only ${riskFactors.firstWeekAttendance}%. Schedule immediate counselling call to understand barriers.`,
      priority: 'high',
      icon: Calendar,
      category: 'Engagement',
    });
  } else if (riskFactors.firstWeekAttendance < 75) {
    actions.push({
      id: 'attendance-followup',
      title: 'Follow Up on Attendance',
      description: `Attendance at ${riskFactors.firstWeekAttendance}%. Check for scheduling conflicts or personal challenges.`,
      priority: 'medium',
      icon: Calendar,
      category: 'Engagement',
    });
  }

  // Quiz score recommendations
  if (riskFactors.quizScore < 40) {
    actions.push({
      id: 'academic',
      title: 'Provide Academic Support',
      description: `Quiz score of ${riskFactors.quizScore}% indicates learning gaps. Arrange peer tutoring or remedial sessions.`,
      priority: 'high',
      icon: GraduationCap,
      category: 'Academic',
    });
  } else if (riskFactors.quizScore < 60) {
    actions.push({
      id: 'academic-moderate',
      title: 'Monitor Academic Progress',
      description: `Quiz score at ${riskFactors.quizScore}%. Schedule study group participation and provide additional resources.`,
      priority: 'medium',
      icon: GraduationCap,
      category: 'Academic',
    });
  }

  // Contact attempts recommendations (student unresponsive)
  if (riskFactors.counsellorContactAttempts >= 4) {
    actions.push({
      id: 'unresponsive',
      title: 'Alternative Contact Strategy',
      description: `${riskFactors.counsellorContactAttempts} contact attempts without response. Try emergency contact, home visit, or peer outreach.`,
      priority: 'high',
      icon: PhoneCall,
      category: 'Reachability',
    });
  } else if (riskFactors.counsellorContactAttempts >= 2) {
    actions.push({
      id: 'contact-followup',
      title: 'Increase Contact Frequency',
      description: 'Student has been difficult to reach. Try different times and communication channels.',
      priority: 'medium',
      icon: MessageSquare,
      category: 'Reachability',
    });
  }

  // Low engagement recommendations
  if (riskFactors.loginAttempts < 3) {
    actions.push({
      id: 'engagement',
      title: 'Boost Platform Engagement',
      description: 'Very low platform usage. Send personalized content notifications and simplify login process.',
      priority: 'medium',
      icon: Target,
      category: 'Engagement',
    });
  }

  // First generation graduate support
  if (riskFactors.isFirstGenGraduate) {
    actions.push({
      id: 'firstgen',
      title: 'First-Gen Graduate Support',
      description: 'Connect with mentor who can provide guidance on educational pathway and family communication.',
      priority: 'medium',
      icon: Users,
      category: 'Support Network',
    });
  }

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  return actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

const priorityColors = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentExtended | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStudent() {
      try {
        const res = await fetch(`/api/students/${params.id}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Student not found');
          } else {
            throw new Error('Failed to fetch student');
          }
          return;
        }
        const data = await res.json();
        setStudent(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }
    fetchStudent();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
          <h2 className="text-lg font-semibold mb-2">{error || 'Student not found'}</h2>
          <p className="text-sm">The student record could not be loaded.</p>
          <Button className="mt-4" onClick={() => router.push('/counsellor/students')}>
            Return to Students List
          </Button>
        </div>
      </div>
    );
  }

  const recommendedActions = getRecommendedActions(student);
  const { riskFactors, riskScore } = student;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
          <p className="text-muted-foreground">{student.id}</p>
        </div>
        <RiskBadge
          score={riskScore.totalScore}
          level={riskScore.riskLevel}
          size="lg"
          showScore={true}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Student Info */}
        <div className="space-y-6 lg:col-span-1">
          {/* Basic Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                Student Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{student.name}</p>
                  <p className="text-sm text-muted-foreground">{student.age} years, {student.gender}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{student.contact_phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">{student.contact_email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{student.education_level}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{student.centreName}</span>
                </div>
              </div>

              <div className="pt-2">
                <PipelineStageBadge stage={student.pipelineStage} size="md" />
              </div>
            </CardContent>
          </Card>

          {/* Risk Factors Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Shield className="h-4 w-4" />
                Risk Factors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    Distance from Centre
                  </span>
                  <span className={riskFactors.distanceFromCentreKm >= 10 ? 'text-red-600 font-medium' : ''}>
                    {riskFactors.distanceFromCentreKm}km
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    First Week Attendance
                  </span>
                  <span className={riskFactors.firstWeekAttendance < 50 ? 'text-red-600 font-medium' : ''}>
                    {riskFactors.firstWeekAttendance}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    Quiz Score
                  </span>
                  <span className={riskFactors.quizScore < 40 ? 'text-red-600 font-medium' : ''}>
                    {riskFactors.quizScore}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Wifi className="h-4 w-4 text-muted-foreground" />
                    Internet Access
                  </span>
                  <span className={!riskFactors.hasInternet ? 'text-red-600 font-medium' : 'text-green-600'}>
                    {riskFactors.hasInternet ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    Mobile Access
                  </span>
                  <span className={!riskFactors.hasMobile ? 'text-red-600 font-medium' : ''}>
                    {riskFactors.hasMobile ? (riskFactors.mobileType === 'smartphone' ? 'Smartphone' : 'Basic') : 'None'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    Platform Logins
                  </span>
                  <span className={riskFactors.loginAttempts < 3 ? 'text-amber-600 font-medium' : ''}>
                    {riskFactors.loginAttempts} times
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-muted-foreground" />
                    Contact Attempts
                  </span>
                  <span className={riskFactors.counsellorContactAttempts >= 4 ? 'text-red-600 font-medium' : ''}>
                    {riskFactors.counsellorContactAttempts}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    First-Gen Graduate
                  </span>
                  <span>{riskFactors.isFirstGenGraduate ? 'Yes' : 'No'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recommended Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Recommended Actions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Personalized interventions based on student's risk factors
              </p>
            </CardHeader>
            <CardContent>
              {recommendedActions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mb-4" />
                  <h3 className="font-medium text-gray-900">No Critical Actions Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    This student is within acceptable risk levels. Continue regular monitoring.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recommendedActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <div
                        key={action.id}
                        className="flex gap-4 rounded-lg border p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${priorityColors[action.priority]}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{action.title}</h4>
                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${priorityColors[action.priority]}`}>
                              {action.priority}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{action.description}</p>
                          <p className="text-xs text-gray-400 mt-1">{action.category}</p>
                        </div>
                        <Button variant="outline" size="sm" className="shrink-0">
                          Take Action
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" size="sm">
                  <Phone className="mr-2 h-4 w-4" />
                  Call Student
                </Button>
                <Button variant="outline" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </Button>
                <Button variant="outline" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Assign Mentor
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
