import { NextResponse } from 'next/server';
import { runSeed } from '@/lib/db/seed';

export async function GET() {
  try {
    const result = await runSeed();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
