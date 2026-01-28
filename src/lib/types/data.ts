export interface Student {
  id: string;
  name: string;
  age: string;
  gender: string;
  contact_phone: string;
  contact_email: string;
  education_level: string;  // 'Below 10th' | '10th Pass' | '12th Pass' | 'ITI/Diploma' | 'Graduate' | 'Post Graduate'
  status: 'Active' | 'Matched' | 'Placed' | 'Onboarding';
  skills: string;
  aspirations: string;
  enrolled_date: string;
  counsellor_id: string;
}

export interface Programme {
  id: string;
  name: string;
  category: string;
  description: string;
  required_skills: string;
  education_level: string;
  duration_months: string;
  certification: string;
  employment_rate: string;
  avg_salary: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  job_type: string;
  required_skills: string;
  education_level: string;
  salary_min: string;
  salary_max: string;
  openings: string;
  posted_date: string;
  status: string;
}

// Parsed versions with proper types
export interface StudentParsed extends Omit<Student, 'skills' | 'aspirations'> {
  skills: string[];
  aspirations: string[];
}

export interface ProgrammeParsed extends Omit<Programme, 'required_skills' | 'duration_months' | 'employment_rate' | 'avg_salary'> {
  required_skills: string[];
  duration_months: number;
  employment_rate: number;
  avg_salary: number;
}

export interface JobParsed extends Omit<Job, 'required_skills' | 'salary_min' | 'salary_max' | 'openings'> {
  required_skills: string[];
  salary_min: number;
  salary_max: number;
  openings: number;
}

// Student Registration (self-signup flow)
export interface StudentRegistration {
  id: string;
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  pinCode: string;
  educationLevel: string;
  // Connectivity information
  hasInternet: boolean;
  hasMobile: boolean;
  mobileType: 'smartphone' | 'basic' | '';
  preferredCommunication: 'whatsapp' | 'sms' | 'email' | '';
  // Referral source
  referralSource: string;
  annualFamilyIncome: string;
  isEligible: boolean;
  aadhaarUploaded: boolean;
  aadhaarVerified: boolean;
  bplCardUploaded: boolean;
  rationCardUploaded: boolean;
  documentValidationStatus: 'pending' | 'verified' | 'failed';
  documentValidationError?: string;
  selectedCentreId: string;
  selectedCentreName: string;
  status: 'pending_verification' | 'verified' | 'rejected';
  registrationDate: string;
}

// Volunteer
export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  supportTypes: string[]; // ['mentor_post_placement', 'support_followups']
  status: 'pending' | 'approved' | 'active';
  registrationDate: string;
  assignedStudents?: string[];
}

// Magic Bus Centre
export interface MagicBusCentre {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  pinCodes: string[];
  capacity: number;
  currentEnrollment: number;
}

// Mentor Assignment
export interface MentorAssignment {
  id: string;
  volunteerId: string;
  volunteerName?: string;
  studentId: string;
  studentName?: string;
  assignedDate: string;
  status: 'active' | 'completed';
}

// Student Progress (volunteer tracking)
export interface StudentProgress {
  id: string;
  studentId: string;
  volunteerId: string;
  date: string;
  activityType: 'call' | 'meeting' | 'followup' | 'note';
  notes: string;
}

// ===== COUNSELLOR DASHBOARD TYPES =====

// Pipeline Stages for student journey tracking
export type PipelineStage =
  | 'Student Onboarding'
  | 'Counselling'
  | 'Enrollment'
  | 'Training'
  | 'Pre-placement'
  | 'Post Placement';

// Risk Factors tracked for dropout prediction
export interface RiskFactors {
  firstWeekAttendance: number;        // 0-100 percentage
  distanceFromCentreKm: number;       // in kilometers
  isFirstGenGraduate: boolean;        // true if first generation college student
  hasInternet: boolean;               // internet access at home
  hasMobile: boolean;                 // mobile phone access
  mobileType: 'smartphone' | 'basic' | '';
  loginAttempts: number;              // count in last 30 days
  counsellorContactAttempts: number;  // how many times counsellor tried to reach (student unresponsive)
  quizScore: number;                  // 0-100 percentage, below 40% = high risk
}

// Breakdown of risk score components
export interface RiskScoreBreakdown {
  attendanceRisk: number;             // 0-25 points
  distanceRisk: number;               // 0-15 points
  firstGenRisk: number;               // 0-10 points
  connectivityRisk: number;           // 0-20 points
  engagementRisk: number;             // 0-10 points
  contactRisk: number;                // 0-10 points
  quizRisk: number;                   // 0-10 points (below 40% = high risk)
}

// Computed Risk Score
export interface RiskScore {
  totalScore: number;                 // 0-100 (higher = more at risk)
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  breakdown: RiskScoreBreakdown;
  lastCalculated: string;             // ISO date
}

// Alert for counsellor about at-risk students
export interface StudentAlert {
  id: string;
  studentId: string;
  studentName: string;
  type: 'high_risk' | 'dropout_warning' | 'missed_session' | 'no_login';
  message: string;
  severity: 'warning' | 'critical';
  createdAt: string;
  isRead: boolean;
  acknowledgedAt?: string;
}

// Extended Student with pipeline stage and risk scoring
export interface StudentExtended extends Student {
  pipelineStage: PipelineStage;
  riskFactors: RiskFactors;
  riskScore: RiskScore;
  lastLoginDate?: string;
  lastCounsellorContact?: string;
  centreId: string;
  centreName: string;
  engagementData?: EngagementRecord[];  // engagement channel tracking
  preferredChannel?: EngagementChannel; // student's preferred contact method
}

// Engagement Channel types
export type EngagementChannel = 'whatsapp' | 'sms' | 'email' | 'phone' | 'in_person';

// Engagement tracking per student
export interface EngagementRecord {
  channel: EngagementChannel;
  successfulContacts: number;    // times student responded
  totalAttempts: number;         // total outreach attempts
  lastContactDate?: string;
  outcome: 'positive' | 'neutral' | 'no_response';
}

// Aggregated channel statistics for dashboard
export interface EngagementChannelStats {
  channel: EngagementChannel;
  totalStudents: number;         // students contacted via this channel
  responseRate: number;          // percentage who responded
  positiveOutcomes: number;      // students with positive progression
  averageResponseTime: number;   // avg days to respond
}

// Extended Dashboard Statistics
export interface DashboardStatsExtended {
  total: number;
  byPipelineStage: Record<PipelineStage, number>;
  byRiskLevel: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  atRiskCount: number;        // students with score > 70
  activeAlerts: number;
  placementRate: number;      // percentage of students placed
  byEngagementChannel?: EngagementChannelStats[];  // engagement channel breakdown
}
