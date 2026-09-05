import { NextRequest, NextResponse } from 'next/server';
import { runSeed } from '@/lib/db/seed';
import { getCurrentUser } from '@/lib/security/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin authorization required to seed database' },
        { status: 403 }
      );
    }

    const result = await runSeed();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to seed database' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
