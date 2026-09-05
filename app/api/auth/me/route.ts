import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, user: null }, { status: 401 });
  }
  return NextResponse.json({ success: true, data: { user } });
}
