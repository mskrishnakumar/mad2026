import { NextResponse } from 'next/server';
import { StudentProgress } from '@/lib/types/data';

// In-memory storage for demo
const progressNotes: StudentProgress[] = [];
let nextId = 1;

function generateProgressId(): string {
  const id = `PRG${String(nextId++).padStart(4, '0')}`;
  return id;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const volunteerId = searchParams.get('volunteerId');

  try {
    let result = progressNotes;

    if (studentId) {
      result = result.filter(p => p.studentId === studentId);
    }
    if (volunteerId) {
      result = result.filter(p => p.volunteerId === volunteerId);
    }

    // Sort by date descending
    result = result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch progress notes';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newProgress: StudentProgress = {
      id: generateProgressId(),
      studentId: body.studentId,
      volunteerId: body.volunteerId,
      date: new Date().toISOString(),
      activityType: body.activityType,
      notes: body.notes,
    };

    progressNotes.push(newProgress);

    return NextResponse.json(newProgress, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create progress note';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
