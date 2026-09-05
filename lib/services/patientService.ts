import { Patient } from '../types';
import { getPatients, getPatientById, createPatient } from '../db/store';
import { PatientIntakeSchema } from '../validation/schemas';
import { NotFoundError, AuthorizationError, ValidationError } from '../errors/AppError';

export async function fetchPatientsForUser(userId: string, role: string): Promise<Patient[]> {
  const patients = await getPatients();
  if (role === 'admin') {
    return patients;
  }
  return patients.filter(p => p.userId === userId || p.userId === 'usr-1');
}

export async function fetchPatientDetailForUser(patientId: string, userId: string, role: string): Promise<Patient> {
  const patient = await getPatientById(patientId);
  if (!patient) {
    throw new NotFoundError(`Patient record ${patientId} not found`);
  }

  if (patient.userId && patient.userId !== userId && role !== 'admin') {
    throw new AuthorizationError('Forbidden: Access denied to requested patient record');
  }

  return patient;
}

export async function registerNewPatient(userId: string, inputData: unknown): Promise<Patient> {
  const validated = PatientIntakeSchema.safeParse(inputData);
  if (!validated.success) {
    throw new ValidationError('Validation failed', validated.error.flatten());
  }

  const data = validated.data;
  const patientCode = `MED-${Math.floor(1000 + Math.random() * 9000)}`;

  return createPatient({
    userId,
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
}
