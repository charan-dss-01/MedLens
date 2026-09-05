import { NextRequest, NextResponse } from 'next/server';
import { getPatientById, getLabResultsByPatientId } from '@/lib/db/store';
import { getCurrentUser } from '@/lib/security/auth';
import { generateFHIRBundle } from '@/lib/export/fhir';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const patientId = params.id;
    const patient = await getPatientById(patientId);

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient workspace not found' }, { status: 404 });
    }

    // Ownership Authorization Check
    if (patient.userId && patient.userId !== user.id && user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Forbidden: Access denied to requested patient record' }, { status: 403 });
    }

    const labResults = await getLabResultsByPatientId(patient.id);
    const fhirBundle = generateFHIRBundle(patient, labResults);

    return new NextResponse(JSON.stringify(fhirBundle, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/fhir+json; charset=utf-8',
        'Content-Disposition': `attachment; filename="MedLens_FHIR_${patient.patientCode}.json"`
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate FHIR R4 bundle' }, { status: 500 });
  }
}
