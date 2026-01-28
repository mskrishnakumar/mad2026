import { NextResponse } from 'next/server';
import * as tableService from '@/services/studentTableService';
import * as csvService from '@/services/studentService';

const DATA_SOURCE = process.env.DATA_SOURCE || 'local';

// Use table service for Azure Tables, otherwise use CSV service
const useTableStorage = DATA_SOURCE === 'azure-table';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const stats = searchParams.get('stats');

  try {
    if (stats === 'true') {
      const studentStats = useTableStorage
        ? await tableService.getStudentStats()
        : await csvService.getStudentStats();
      return NextResponse.json(studentStats);
    }

    if (search) {
      const students = useTableStorage
        ? await tableService.searchStudents(search)
        : await csvService.searchStudents(search);
      return NextResponse.json(students);
    }

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
