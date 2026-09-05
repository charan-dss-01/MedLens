import { NextRequest, NextResponse } from 'next/server';
import { 
  getPatientById, 
  getLabResultsByPatientId, 
  getReportsByPatientId, 
  getSignalsByPatientId, 
  getConflictsByPatientId, 
  getTimelineByPatientId 
} from '@/lib/db/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id;
    const patient = await getPatientById(patientId);
    
    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
    }

    const labResults = await getLabResultsByPatientId(patient.id);
    const reports = await getReportsByPatientId(patient.id);
    const signals = await getSignalsByPatientId(patient.id);
    const conflicts = await getConflictsByPatientId(patient.id);
    const timeline = await getTimelineByPatientId(patient.id);

    return NextResponse.json({
      success: true,
      data: {
        patient,
        labResults,
        reports,
        signals,
        conflicts,
        timeline
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch patient data' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id;
    const { deletePatientRecord } = await import('@/lib/db/store');
    await deletePatientRecord(patientId);
    return NextResponse.json({
      success: true,
      message: `Patient record ${patientId} and all associated reports permanently deleted.`
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete patient record' }, { status: 500 });
  }
}
