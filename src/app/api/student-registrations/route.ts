import { NextResponse } from 'next/server';
import { StudentRegistration } from '@/lib/types/data';

// In-memory storage for demo (in production, use Azure Table Storage)
const registrations: StudentRegistration[] = [];
let nextId = 1;

function generateRegistrationId(): string {
  const id = `REG${String(nextId++).padStart(4, '0')}`;
  return id;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  try {
    let result = registrations;

    if (status) {
      result = result.filter(r => r.status === status);
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch registrations';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newRegistration: StudentRegistration = {
      id: generateRegistrationId(),
      name: body.name,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      phone: body.phone,
      email: body.email || '',
      address: body.address || '',
      pinCode: body.pinCode,
      educationLevel: body.educationLevel,
      annualFamilyIncome: body.annualFamilyIncome,
      isEligible: true, // Already validated on frontend
      aadhaarUploaded: body.aadhaarUploaded || false,
      aadhaarVerified: false, // Will be verified by admin
      bplCardUploaded: body.bplCardUploaded || false,
      rationCardUploaded: body.rationCardUploaded || false,
      documentValidationStatus: 'pending',
      selectedCentreId: body.selectedCentreId,
      selectedCentreName: body.selectedCentreName,
      status: 'pending_verification',
      registrationDate: new Date().toISOString(),
    };

    registrations.push(newRegistration);

    return NextResponse.json(newRegistration, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create registration';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
