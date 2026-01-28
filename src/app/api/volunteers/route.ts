import { NextResponse } from 'next/server';
import { Volunteer } from '@/lib/types/data';

// In-memory storage for demo (in production, use Azure Table Storage)
const volunteers: Volunteer[] = [];
let nextId = 1;

function generateVolunteerId(): string {
  const id = `VOL${String(nextId++).padStart(4, '0')}`;
  return id;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    let result = volunteers;

    if (status) {
      result = result.filter(v => v.status === status);
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch volunteers';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newVolunteer: Volunteer = {
      id: generateVolunteerId(),
      name: body.name,
      phone: body.phone,
      email: body.email,
      organization: body.organization,
      supportTypes: body.supportTypes || [],
      status: 'pending',
      registrationDate: new Date().toISOString(),
      assignedStudents: [],
    };

    volunteers.push(newVolunteer);

    return NextResponse.json(newVolunteer, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create volunteer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = volunteers.findIndex(v => v.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Volunteer not found' }, { status: 404 });
    }

    volunteers[index] = { ...volunteers[index], ...updates };

    return NextResponse.json(volunteers[index]);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update volunteer';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
