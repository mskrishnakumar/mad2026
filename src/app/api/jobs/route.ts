import { NextResponse } from 'next/server';
import * as tableService from '@/services/jobTableService';
import * as csvService from '@/services/jobService';

const DATA_SOURCE = process.env.DATA_SOURCE || 'local';
const useTableStorage = DATA_SOURCE === 'azure-table';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stats = searchParams.get('stats');
  const industries = searchParams.get('industries');
  const skills = searchParams.get('skills');

  try {
    if (stats === 'true') {
      const jobStats = useTableStorage
        ? await tableService.getJobStats()
        : await csvService.getJobStats();
      return NextResponse.json(jobStats);
    }

    if (industries === 'list') {
      const industryList = useTableStorage
        ? await tableService.getIndustries()
        : await csvService.getIndustries();
      return NextResponse.json(industryList);
    }

    if (skills) {
      const skillList = skills.split(',').map(s => s.trim());
      const matches = useTableStorage
        ? await tableService.matchJobsForStudent(skillList)
        : await csvService.matchJobsForStudent(skillList);
      return NextResponse.json(matches);
    }

    const jobs = useTableStorage
      ? await tableService.getAllJobs()
      : await csvService.getJobs();
    return NextResponse.json(jobs);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch jobs';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
