import { NextResponse } from 'next/server';
import { MentorAssignment } from '@/lib/types/data';

// In-memory storage for demo
const assignments: MentorAssignment[] = [];
let nextId = 1;

function generateAssignmentId(): string {
  const id = `ASN${String(nextId++).padStart(4, '0')}`;
  return id;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const volunteerId = searchParams.get('volunteerId');
  const studentId = searchParams.get('studentId');

  try {
    let result = assignments;

    if (volunteerId) {
      result = result.filter(a => a.volunteerId === volunteerId);
    }
    if (studentId) {
      result = result.filter(a => a.studentId === studentId);
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch assignments';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if student already has an active assignment
    const existingAssignment = assignments.find(
      a => a.studentId === body.studentId && a.status === 'active'
    );

    if (existingAssignment) {
      // Update existing assignment to completed
      existingAssignment.status = 'completed';
    }

    const newAssignment: MentorAssignment = {
      id: generateAssignmentId(),
      volunteerId: body.volunteerId,
      volunteerName: body.volunteerName,
      studentId: body.studentId,
      studentName: body.studentName,
      assignedDate: new Date().toISOString(),
      status: 'active',
    };

    assignments.push(newAssignment);

    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create assignment';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
