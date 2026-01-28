import { NextResponse } from 'next/server';
import * as tableService from '@/services/studentTableService';
import * as csvService from '@/services/studentService';
import * as dashboardService from '@/services/dashboardService';
import type { PipelineStage } from '@/lib/types/data';

const DATA_SOURCE = process.env.DATA_SOURCE || 'local';

// Use table service for Azure Tables, otherwise use CSV service
const useTableStorage = DATA_SOURCE === 'azure-table';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const stats = searchParams.get('stats');
  const extended = searchParams.get('extended');
  const atRisk = searchParams.get('atRisk');
  const pipelineStage = searchParams.get('pipelineStage');
  const limit = searchParams.get('limit');

  try {
    // Extended dashboard stats
    if (stats === 'extended') {
      const extendedStats = await dashboardService.getDashboardStats();
      return NextResponse.json(extendedStats);
    }

    // Regular stats (existing)
    if (stats === 'true') {
      const studentStats = useTableStorage
        ? await tableService.getStudentStats()
        : await csvService.getStudentStats();
      return NextResponse.json(studentStats);
    }

    // At-risk students only
    if (atRisk === 'true') {
      const limitNum = limit ? parseInt(limit, 10) : undefined;
      const atRiskStudents = await dashboardService.getAtRiskStudents(limitNum);
      return NextResponse.json(atRiskStudents);
    }

    // Filter by pipeline stage
    if (pipelineStage) {
      const stageStudents = await dashboardService.getStudentsByPipelineStage(
        pipelineStage as PipelineStage
      );
      return NextResponse.json(stageStudents);
    }

    // Extended student data with risk scores
    if (extended === 'true') {
      if (search) {
        const students = await dashboardService.searchStudents(search);
        return NextResponse.json(students);
      }
      const extendedStudents = await dashboardService.getExtendedStudents();
      return NextResponse.json(extendedStudents);
    }

    // Regular search (existing)
    if (search) {
      const students = useTableStorage
        ? await tableService.searchStudents(search)
        : await csvService.searchStudents(search);
      return NextResponse.json(students);
    }

    // Default: return all students
    const students = useTableStorage
      ? await tableService.getAllStudents()
      : await csvService.getStudents();
    return NextResponse.json(students);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch students';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!useTableStorage) {
    return NextResponse.json(
      { error: 'Write operations require Azure Table Storage. Set DATA_SOURCE=azure-table' },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();

    // Generate ID if not provided
    if (!body.id) {
      body.id = await tableService.generateStudentId();
    }

    const student = await tableService.createStudent(body);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create student';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
