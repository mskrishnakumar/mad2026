export interface Student {
  id: string;
  name: string;
  age: string;
  gender: string;
  school: string;
  grade: string;
  contact_phone: string;
  contact_email: string;
  education_level: string;
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
