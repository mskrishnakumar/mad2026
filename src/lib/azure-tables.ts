import { TableClient, TableServiceClient } from '@azure/data-tables';

let tableServiceClient: TableServiceClient | null = null;

function getConnectionString(): string {
  const connectionString = process.env.AZURE_TABLE_STORAGE_CONNECTION_STRING;
  if (!connectionString) {
    throw new Error('AZURE_TABLE_STORAGE_CONNECTION_STRING is not configured');
  }
  return connectionString;
}

export function getTableServiceClient(): TableServiceClient {
  if (!tableServiceClient) {
    tableServiceClient = TableServiceClient.fromConnectionString(getConnectionString());
  }
  return tableServiceClient;
}

export function getTableClient(tableName: string): TableClient {
  return TableClient.fromConnectionString(getConnectionString(), tableName);
}

// Table names
export const TABLES = {
  STUDENTS: 'Students',
  PROGRAMMES: 'Programmes',
  JOBS: 'Jobs',
} as const;

// Entity interfaces for Azure Table Storage
export interface StudentEntity {
  partitionKey: string; // Use 'STUDENT' for all students
  rowKey: string; // Student ID (e.g., STU001)
  name: string;
  age: number;
  gender: string;
  contactPhone: string;
  contactEmail: string;
  educationLevel: string; // 'Below 10th' | '10th Pass' | '12th Pass' | 'ITI/Diploma' | 'Graduate' | 'Post Graduate'
  status: string;
  skills: string; // JSON array stored as string
  aspirations: string; // JSON array stored as string
  enrolledDate: string;
  counsellorId: string;
}

export interface ProgrammeEntity {
  partitionKey: string; // Use category (e.g., 'IT & Technology')
  rowKey: string; // Programme ID (e.g., PRG001)
  name: string;
  description: string;
  requiredSkills: string; // JSON array stored as string
  educationLevel: string;
  durationMonths: number;
  certification: string;
  employmentRate: number;
  avgSalary: number;
}

export interface JobEntity {
  partitionKey: string; // Use industry (e.g., 'IT & Technology')
  rowKey: string; // Job ID (e.g., JOB001)
  title: string;
  company: string;
  location: string;
  jobType: string;
  requiredSkills: string; // JSON array stored as string
  educationLevel: string;
  salaryMin: number;
  salaryMax: number;
  openings: number;
  postedDate: string;
  status: string;
}
