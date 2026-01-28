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
