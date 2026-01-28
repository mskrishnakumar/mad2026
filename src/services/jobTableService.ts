import { getTableClient, TABLES, JobEntity } from '@/lib/azure-tables';
import type { JobParsed } from '@/lib/types/data';

function entityToJob(entity: JobEntity): JobParsed {
  return {
    id: entity.rowKey,
    title: entity.title,
    company: entity.company,
    location: entity.location,
    industry: entity.partitionKey,
    job_type: entity.jobType,
    required_skills: JSON.parse(entity.requiredSkills || '[]'),
    education_level: entity.educationLevel,
    salary_min: entity.salaryMin,
    salary_max: entity.salaryMax,
    openings: entity.openings,
    posted_date: entity.postedDate,
    status: entity.status,
  };
}

function jobToEntity(job: JobParsed): JobEntity {
  return {
    partitionKey: job.industry,
    rowKey: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    jobType: job.job_type,
    requiredSkills: JSON.stringify(job.required_skills),
    educationLevel: job.education_level,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    openings: job.openings,
    postedDate: job.posted_date,
    status: job.status,
  };
}

export async function getAllJobs(): Promise<JobParsed[]> {
  const client = getTableClient(TABLES.JOBS);
  const jobs: JobParsed[] = [];

  const entities = client.listEntities<JobEntity>();

  for await (const entity of entities) {
    jobs.push(entityToJob(entity));
  }

  return jobs;
}

export async function getJobById(industry: string, id: string): Promise<JobParsed | null> {
  const client = getTableClient(TABLES.JOBS);

  try {
    const entity = await client.getEntity<JobEntity>(industry, id);
    return entityToJob(entity);
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error && error.statusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function createJob(job: JobParsed): Promise<JobParsed> {
  const client = getTableClient(TABLES.JOBS);
  const entity = jobToEntity(job);

  await client.createEntity(entity);
  return job;
}

export async function getIndustries(): Promise<string[]> {
  const jobs = await getAllJobs();
  return [...new Set(jobs.map(j => j.industry))];
}

export async function getLocations(): Promise<string[]> {
  const jobs = await getAllJobs();
  return [...new Set(jobs.map(j => j.location))];
}

export async function matchJobsForStudent(studentSkills: string[]): Promise<JobParsed[]> {
  const jobs = await getAllJobs();

  const scored = jobs.map(job => {
    const matchedSkills = job.required_skills.filter(skill =>
      studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) ||
                           skill.toLowerCase().includes(s.toLowerCase()))
    );
    const score = matchedSkills.length / job.required_skills.length;
    return { job, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.job);
}

export async function getJobStats() {
  const jobs = await getAllJobs();

  return {
    totalJobs: jobs.length,
    totalOpenings: jobs.reduce((sum, j) => sum + j.openings, 0),
    activeJobs: jobs.filter(j => j.status === 'Active').length,
    industries: [...new Set(jobs.map(j => j.industry))].length,
  };
}
