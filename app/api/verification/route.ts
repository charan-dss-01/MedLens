import { NextRequest, NextResponse } from 'next/server';
import { updateLabResultVerification, getPatients, getLabResultsByPatientId } from '@/lib/db/store';
import { VerificationActionSchema } from '@/lib/validation/schemas';
import { getCurrentUser } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  try {
    const patients = await getPatients();
    const allResults = [];

    for (const patient of patients) {
      const results = await getLabResultsByPatientId(patient.id);
      for (const res of results) {
        allResults.push({
          ...res,
          patientName: patient.name,
          patientCode: patient.patientCode,
          patientAge: patient.age,
          patientSex: patient.sex
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        totalResultsCount: allResults.length,
        pendingCount: allResults.filter(r => r.verificationStatus === 'PENDING').length,
        verifiedCount: allResults.filter(r => r.verificationStatus === 'VERIFIED').length,
        correctedCount: allResults.filter(r => r.verificationStatus === 'CORRECTED').length,
        rejectedCount: allResults.filter(r => r.verificationStatus === 'REJECTED').length,
        results: allResults
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch verification queue' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    const reviewerName = user ? `${user.name} (${user.role})` : 'Dr. Clinician Reviewer';

    const body = await req.json();
    const validated = VerificationActionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ success: false, error: 'Invalid verification payload' }, { status: 400 });
    }

    const { resultId, action, newValue, newUnit, newStatus } = validated.data;
    const statusMap = {
      'VERIFY': 'VERIFIED' as const,
      'EDIT': 'CORRECTED' as const,
      'REJECT': 'REJECTED' as const,
    };

    const updated = await updateLabResultVerification(
      resultId,
      statusMap[action],
      newValue,
      newUnit,
      newStatus,
      reviewerName
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Result not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Result successfully marked as ${statusMap[action]}`,
      data: updated
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update verification status' }, { status: 500 });
  }
}
