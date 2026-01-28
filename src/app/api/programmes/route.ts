import { NextResponse } from 'next/server';
import * as tableService from '@/services/programmeTableService';
import * as csvService from '@/services/programmeService';

const DATA_SOURCE = process.env.DATA_SOURCE || 'local';
const useTableStorage = DATA_SOURCE === 'azure-table';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const skills = searchParams.get('skills');

  try {
    if (skills) {
      const skillList = skills.split(',').map(s => s.trim());
      const matches = useTableStorage
        ? await tableService.matchProgrammesForStudent(skillList)
        : await csvService.matchProgrammesForStudent(skillList);
      return NextResponse.json(matches);
    }

    if (category === 'list') {
      const categories = useTableStorage
        ? await tableService.getCategories()
        : await csvService.getCategories();
      return NextResponse.json(categories);
    }

    const programmes = useTableStorage
      ? await tableService.getAllProgrammes()
      : await csvService.getProgrammes();
    return NextResponse.json(programmes);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch programmes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
