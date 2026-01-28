import { NextResponse } from 'next/server';
import * as dashboardService from '@/services/dashboardService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await dashboardService.getStudentById(id);

    if (!student) {
      return NextResponse.json(
        { error: 'Student not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(student);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch student';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
