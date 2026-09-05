import { NextRequest, NextResponse } from 'next/server';
import { getPatients, getLabResultsByPatientId } from '@/lib/db/store';
import { processLabResultVerification } from '@/lib/services/verificationService';
import { handleApiError } from '@/lib/errors/AppError';

export async function GET() {
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
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await processLabResultVerification(body);

    return NextResponse.json({
      success: true,
      message: `Result successfully verified/updated.`,
      data: updated
    });
  } catch (error) {
    return handleApiError(error);
  }
}
