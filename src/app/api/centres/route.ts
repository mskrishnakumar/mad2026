import { NextResponse } from 'next/server';
import { MAGIC_BUS_CENTRES } from '@/data/centres';

export async function GET() {
  try {
    return NextResponse.json(MAGIC_BUS_CENTRES);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch centres';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
