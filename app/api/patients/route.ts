import { NextRequest, NextResponse } from 'next/server';
import { getPatients, createPatient } from '@/lib/db/store';
import { PatientIntakeSchema } from '@/lib/validation/schemas';
import { getCurrentUser } from '@/lib/security/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const patients = await getPatients();
    // Filter patients by user unless admin
    const userPatients = user.role === 'admin' 
      ? patients 
      : patients.filter(p => p.userId === user.id || p.userId === 'usr-1');

    return NextResponse.json({ success: true, data: userPatients });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch patients' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validated = PatientIntakeSchema.safeParse(body);
    
    if (!validated.success) {
      return NextResponse.json({ 
        success: false, 
        error: 'Validation failed', 
        details: validated.error.flatten() 
      }, { status: 400 });
    }

    const data = validated.data;
    const patientCode = `MED-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPatient = await createPatient({
      userId: user.id,
      patientCode,
      name: data.name,
      age: data.age,
      sex: data.sex,
      symptoms: data.symptoms || '',
      existingConditions: data.existingConditions,
      allergies: data.allergies,
      currentMedications: data.currentMedications,
      medicalHistory: data.medicalHistory || ''
    });

    return NextResponse.json({ success: true, data: newPatient }, { status: 201 });
  } catch (error) {
    console.error('Patient intake error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create patient record' }, { status: 500 });
  }
}
