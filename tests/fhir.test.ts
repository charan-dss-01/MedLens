import { describe, it, expect } from 'vitest';
import { generateFHIRBundle, convertPatientToFHIR, convertLabResultToFHIRObservation } from '@/lib/export/fhir';
import { Patient, LabResult } from '@/lib/types';

describe('HL7 FHIR R4 Interoperability Converter Tests', () => {
  const mockPatient: Patient = {
    id: 'pat-test-1',
    userId: 'usr-1',
    patientCode: 'MED-9999',
    name: 'Eleanor Vance',
    age: 38,
    sex: 'Female',
    symptoms: 'Fatigue',
    existingConditions: ['Anemia'],
    allergies: ['Penicillin'],
    currentMedications: ['Iron Supplement'],
    medicalHistory: 'None',
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z'
  };

  const mockLabResult: LabResult = {
    id: 'res-test-1',
    patientId: 'pat-test-1',
    reportId: 'rep-test-1',
    category: 'Complete Blood Count (CBC)',
    testName: 'Hemoglobin',
    value: '10.5',
    numericValue: 10.5,
    unit: 'g/dL',
    referenceRange: '12.0 - 15.5 g/dL',
    status: 'BELOW_PROVIDED_RANGE',
    observation: 'Mild anemia indicated',
    source: {
      fileName: 'CBC_Report.pdf',
      pageNumber: 1,
      textSnippet: 'Hemoglobin: 10.5 g/dL (Ref: 12.0 - 15.5 g/dL)'
    },
    confidence: 96,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Smith',
    verifiedAt: '2026-01-02T10:00:00Z',
    createdAt: '2026-01-01T12:00:00Z'
  };

  it('converts MedLens Patient to valid HL7 FHIR R4 Patient Resource', () => {
    const fhirPatient = convertPatientToFHIR(mockPatient);

    expect(fhirPatient.resourceType).toBe('Patient');
    expect(fhirPatient.id).toBe('pat-test-1');
    expect(fhirPatient.gender).toBe('female');
    expect(fhirPatient.name[0].text).toBe('Eleanor Vance');
    expect(fhirPatient.identifier[0].value).toBe('MED-9999');
  });

  it('converts MedLens LabResult to valid HL7 FHIR R4 Observation Resource', () => {
    const fhirObs = convertLabResultToFHIRObservation(mockLabResult, mockPatient.patientCode);

    expect(fhirObs.resourceType).toBe('Observation');
    expect(fhirObs.id).toBe('res-test-1');
    expect(fhirObs.status).toBe('final');
    expect(fhirObs.code.text).toBe('Hemoglobin');
    expect(fhirObs.valueQuantity?.value).toBe(10.5);
    expect(fhirObs.valueQuantity?.unit).toBe('g/dL');
    expect(fhirObs.referenceRange?.[0].text).toBe('12.0 - 15.5 g/dL');
  });

  it('generates a complete HL7 FHIR R4 Bundle containing Patient and Observations', () => {
    const bundle = generateFHIRBundle(mockPatient, [mockLabResult]);

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.type).toBe('collection');
    expect(bundle.total).toBe(2);
    expect(bundle.entry[0].resource.resourceType).toBe('Patient');
    expect(bundle.entry[1].resource.resourceType).toBe('Observation');
  });
});
