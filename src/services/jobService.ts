import { fetchData } from '@/lib/data-source';
import type { Job, JobParsed } from '@/lib/types/data';

export async function getJobs(): Promise<JobParsed[]> {
  const rawJobs = await fetchData<Job>('jobs.csv');

  return rawJobs.map(job => ({
    ...job,
    required_skills: job.required_skills.split(',').map(s => s.trim()),
    salary_min: parseInt(job.salary_min) || 0,
    salary_max: parseInt(job.salary_max) || 0,
    openings: parseInt(job.openings) || 0,
  }));
}

export async function getJobById(id: string): Promise<JobParsed | null> {
  const jobs = await getJobs();
  return jobs.find(j => j.id === id) || null;
}

export async function getJobsByIndustry(industry: string): Promise<JobParsed[]> {
  const jobs = await getJobs();
  return jobs.filter(j => j.industry === industry);
}

export async function getIndustries(): Promise<string[]> {
  const jobs = await getJobs();
  return [...new Set(jobs.map(j => j.industry))];
}

export async function getLocations(): Promise<string[]> {
  const jobs = await getJobs();
  return [...new Set(jobs.map(j => j.location))];
}

export async function matchJobsForStudent(studentSkills: string[]): Promise<JobParsed[]> {
  const jobs = await getJobs();

  // Score jobs based on skill match
  const scored = jobs.map(job => {
    const matchedSkills = job.required_skills.filter(skill =>
      studentSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()) ||
                           skill.toLowerCase().includes(s.toLowerCase()))
    );
    const score = matchedSkills.length / job.required_skills.length;
    return { job, score, matchedSkills };
  });

  // Return sorted by match score
  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(s => s.job);
}

export async function getJobStats() {
  const jobs = await getJobs();

  return {
    totalJobs: jobs.length,
    totalOpenings: jobs.reduce((sum, j) => sum + j.openings, 0),
    activeJobs: jobs.filter(j => j.status === 'Active').length,
    industries: [...new Set(jobs.map(j => j.industry))].length,
  };
}
