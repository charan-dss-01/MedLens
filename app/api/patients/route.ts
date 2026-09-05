import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/security/auth';
import { fetchPatientsForUser, registerNewPatient } from '@/lib/services/patientService';
import { handleApiError, AuthenticationError } from '@/lib/errors/AppError';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      throw new AuthenticationError('Unauthorized');
    }

    const patients = await fetchPatientsForUser(user.id, user.role);
    return NextResponse.json({ success: true, data: patients });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      throw new AuthenticationError('Unauthorized');
    }

    const body = await req.json();
    const newPatient = await registerNewPatient(user.id, body);

    return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
