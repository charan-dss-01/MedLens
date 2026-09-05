import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medlens';

export const seedPatients = [
  {
    id: 'pat-101',
    userId: 'usr-1',
    patientCode: 'MED-8921',
    name: 'Sarah Jenkins',
    age: 42,
    sex: 'Female',
    symptoms: 'Persistent fatigue, mild joint stiffness, unexplained weight loss over 3 months.',
    existingConditions: ['Hypothyroidism', 'Mild Hypertension'],
    allergies: ['Penicillin', 'Sulfa Drugs'],
    currentMedications: ['Levothyroxine 50mcg', 'Lisinopril 10mg'],
    medicalHistory: 'History of iron deficiency anemia in 2024. No prior major surgeries.',
    createdAt: '2026-01-15T09:00:00Z',
    updatedAt: '2026-09-01T14:30:00Z'
  },
  {
    id: 'pat-102',
    userId: 'usr-1',
    patientCode: 'MED-4402',
    name: 'Robert Chen',
    age: 58,
    sex: 'Male',
    symptoms: 'Shortness of breath on exertion, chest tightness.',
    existingConditions: ['Type 2 Diabetes', 'Hyperlipidemia'],
    allergies: ['No known allergies'],
    currentMedications: ['Metformin 500mg', 'Atorvastatin 20mg'],
    medicalHistory: 'Coronary artery stent placed in 2022.',
    createdAt: '2026-03-10T11:15:00Z',
    updatedAt: '2026-08-28T16:00:00Z'
  },
  {
    id: 'pat-103',
    userId: 'usr-1',
    patientCode: 'MED-5510',
    name: 'Ananya Sharma',
    age: 32,
    sex: 'Female',
    symptoms: 'Headache, mild fever, fatigue, sore throat for 2 days.',
    existingConditions: ['None reported'],
    allergies: ['No known drug allergies'],
    currentMedications: ['None'],
    medicalHistory: 'Baseline general health report.',
    createdAt: '2026-09-05T08:00:00Z',
    updatedAt: '2026-09-05T12:00:00Z'
  }
];

export const seedReports = [
  {
    id: 'rep-201',
    patientId: 'pat-101',
    fileName: 'CBC_January_2026.pdf',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    fileSize: 245000,
    mimeType: 'application/pdf',
    extractedText: 'COMPLETE BLOOD COUNT (CBC)\nPatient: Sarah Jenkins\nDate: 15-Jan-2026\nHemoglobin: 13.4 g/dL (Ref: 12.0-15.5 g/dL)\nWBC: 6.8 x10^3/uL (Ref: 4.5-11.0 x10^3/uL)\nPlatelets: 230 x10^3/uL (Ref: 150-450 x10^3/uL)\nFasting Glucose: 95 mg/dL (Ref: 70-99 mg/dL)',
    extractedResultsCount: 4,
    status: 'COMPLETED',
    uploadedAt: '2026-01-15T09:30:00Z'
  },
  {
    id: 'rep-202',
    patientId: 'pat-101',
    fileName: 'CBC_September_2026.pdf',
    fileHash: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb',
    fileSize: 260000,
    mimeType: 'application/pdf',
    extractedText: 'COMPLETE BLOOD COUNT (CBC) & METABOLIC PANEL\nPatient: Sarah Jenkins\nDate: 01-Sep-2026\nHemoglobin: 10.2 g/dL (Ref: 12.0-15.5 g/dL)\nWBC: 11.8 x10^3/uL (Ref: 4.5-11.0 x10^3/uL)\nPlatelets: 240 x10^3/uL (Ref: 150-450 x10^3/uL)\nTSH: 6.4 uIU/mL (Ref: 0.4-4.0 uIU/mL)\nFerritin: 11 ng/mL',
    extractedResultsCount: 5,
    status: 'COMPLETED',
    uploadedAt: '2026-09-01T10:15:00Z'
  },
  {
    id: 'rep-203',
    patientId: 'pat-103',
    fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
    fileHash: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    fileSize: 215000,
    mimeType: 'application/pdf',
    extractedText: 'Patient Name: Ananya Sharma\nAge: 32 years\nSex: Female\nReport Date: September 5, 2026\nComplete Blood Count (CBC)\nHemoglobin 12.8 g/dL 12.0–15.5 g/dL\nWBC Count 7,400 /μL 4,000–11,000 /μL\nPlatelets 245,000 /μL 150,000–450,000 /μL\nRBC Count 4.45 million/μL 3.8–5.2 million/μL\nBasic Metabolic Panel\nGlucose 94 mg/dL 70–99 mg/dL\nCreatinine 0.8 mg/dL 0.6–1.1 mg/dL\nSodium 139 mmol/L 135–145 mmol/L\nPotassium 4.2 mmol/L 3.5–5.1 mmol/L',
    extractedResultsCount: 8,
    status: 'COMPLETED',
    uploadedAt: '2026-09-05T09:00:00Z'
  }
];

export const seedResults = [
  {
    id: 'res-301',
    patientId: 'pat-101',
    reportId: 'rep-201',
    category: 'Complete Blood Count (CBC)',
    testName: 'Hemoglobin',
    value: '13.4',
    numericValue: 13.4,
    unit: 'g/dL',
    referenceRange: '12.0 - 15.5 g/dL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Normal hemoglobin level recorded in January baseline report.',
    source: {
      fileName: 'CBC_January_2026.pdf',
      pageNumber: 1,
      textSnippet: 'Hemoglobin: 13.4 g/dL (Ref: 12.0-15.5 g/dL)'
    },
    confidence: 98,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Miller',
    verifiedAt: '2026-01-15T10:00:00Z',
    createdAt: '2026-01-15T09:30:00Z'
  },
  {
    id: 'res-302',
    patientId: 'pat-101',
    reportId: 'rep-201',
    category: 'Complete Blood Count (CBC)',
    testName: 'WBC Count',
    value: '6.8',
    numericValue: 6.8,
    unit: 'x10³/µL',
    referenceRange: '4.5 - 11.0 x10³/µL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Leukocyte count within expected report reference range.',
    source: {
      fileName: 'CBC_January_2026.pdf',
      pageNumber: 1,
      textSnippet: 'WBC: 6.8 x10^3/uL (Ref: 4.5-11.0 x10^3/uL)'
    },
    confidence: 96,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Miller',
    verifiedAt: '2026-01-15T10:00:00Z',
    createdAt: '2026-01-15T09:30:00Z'
  },
  {
    id: 'res-303',
    patientId: 'pat-101',
    reportId: 'rep-202',
    category: 'Complete Blood Count (CBC)',
    testName: 'Hemoglobin',
    value: '10.2',
    numericValue: 10.2,
    unit: 'g/dL',
    referenceRange: '12.0 - 15.5 g/dL',
    status: 'BELOW_PROVIDED_RANGE',
    observation: 'Value decreased by 3.2 g/dL compared to January report.',
    source: {
      fileName: 'CBC_September_2026.pdf',
      pageNumber: 1,
      textSnippet: 'Hemoglobin: 10.2 g/dL (Ref: 12.0-15.5 g/dL)'
    },
    confidence: 97,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Miller',
    verifiedAt: '2026-09-01T11:00:00Z',
    createdAt: '2026-09-01T10:15:00Z'
  },
  {
    id: 'res-304',
    patientId: 'pat-101',
    reportId: 'rep-202',
    category: 'Complete Blood Count (CBC)',
    testName: 'WBC Count',
    value: '11.8',
    numericValue: 11.8,
    unit: 'x10³/µL',
    referenceRange: '4.5 - 11.0 x10³/µL',
    status: 'ABOVE_PROVIDED_RANGE',
    observation: 'Leukocyte count elevated above provided report upper limit.',
    source: {
      fileName: 'CBC_September_2026.pdf',
      pageNumber: 1,
      textSnippet: 'WBC: 11.8 x10^3/uL (Ref: 4.5-11.0 x10^3/uL)'
    },
    confidence: 95,
    verificationStatus: 'PENDING',
    createdAt: '2026-09-01T10:15:00Z'
  },
  {
    id: 'res-305',
    patientId: 'pat-101',
    reportId: 'rep-202',
    category: 'Endocrine & Biomarkers',
    testName: 'Ferritin',
    value: '11',
    numericValue: 11,
    unit: 'ng/mL',
    referenceRange: null,
    status: 'REFERENCE_RANGE_UNAVAILABLE',
    observation: 'Source report did not specify a reference range for Ferritin.',
    source: {
      fileName: 'CBC_September_2026.pdf',
      pageNumber: 1,
      textSnippet: 'Ferritin: 11 ng/mL'
    },
    confidence: 89,
    verificationStatus: 'PENDING',
    createdAt: '2026-09-01T10:15:00Z'
  },
  // Ananya Sharma Results
  {
    id: 'res-310',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Complete Blood Count (CBC)',
    testName: 'Hemoglobin',
    value: '12.8',
    numericValue: 12.8,
    unit: 'g/dL',
    referenceRange: '12.0–15.5 g/dL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Hemoglobin level is normal.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'Hemoglobin 12.8 g/dL 12.0–15.5 g/dL'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'res-311',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Complete Blood Count (CBC)',
    testName: 'WBC Count',
    value: '7,400',
    numericValue: 7400,
    unit: '/μL',
    referenceRange: '4,000–11,000 /μL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'White blood cell count within normal range.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'WBC Count 7,400 /μL 4,000–11,000 /μL'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'res-312',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Complete Blood Count (CBC)',
    testName: 'Platelets',
    value: '245,000',
    numericValue: 245000,
    unit: '/μL',
    referenceRange: '150,000–450,000 /μL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Platelet count normal.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'Platelets 245,000 /μL 150,000–450,000 /μL'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'res-313',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Complete Blood Count (CBC)',
    testName: 'RBC Count',
    value: '4.45',
    numericValue: 4.45,
    unit: 'million/μL',
    referenceRange: '3.8–5.2 million/μL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Red blood cell count normal.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'RBC Count 4.45 million/μL 3.8–5.2 million/μL'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'res-314',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Basic Metabolic Panel (BMP)',
    testName: 'Glucose',
    value: '94',
    numericValue: 94,
    unit: 'mg/dL',
    referenceRange: '70–99 mg/dL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Fasting glucose normal.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'Glucose 94 mg/dL 70–99 mg/dL'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'res-315',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Basic Metabolic Panel (BMP)',
    testName: 'Creatinine',
    value: '0.8',
    numericValue: 0.8,
    unit: 'mg/dL',
    referenceRange: '0.6–1.1 mg/dL',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Kidney function marker normal.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'Creatinine 0.8 mg/dL 0.6–1.1 mg/dL'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'res-316',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Basic Metabolic Panel (BMP)',
    testName: 'Sodium',
    value: '139',
    numericValue: 139,
    unit: 'mmol/L',
    referenceRange: '135–145 mmol/L',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Electrolyte balance normal.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'Sodium 139 mmol/L 135–145 mmol/L'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  },
  {
    id: 'res-317',
    patientId: 'pat-103',
    reportId: 'rep-203',
    category: 'Basic Metabolic Panel (BMP)',
    testName: 'Potassium',
    value: '4.2',
    numericValue: 4.2,
    unit: 'mmol/L',
    referenceRange: '3.5–5.1 mmol/L',
    status: 'WITHIN_PROVIDED_RANGE',
    observation: 'Electrolyte balance normal.',
    source: {
      fileName: 'Ananya_Sharma_CBC_BMP_Sep2026.pdf',
      pageNumber: 1,
      textSnippet: 'Potassium 4.2 mmol/L 3.5–5.1 mmol/L'
    },
    confidence: 99,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Clinician',
    verifiedAt: '2026-09-05T09:30:00Z',
    createdAt: '2026-09-05T09:00:00Z'
  }
];

export const seedSignals = [
  {
    id: 'sig-401',
    patientId: 'pat-101',
    signalType: 'OUTSIDE_RANGE',
    title: 'Hemoglobin Below Provided Reference Range',
    description: 'September Hemoglobin (10.2 g/dL) is below the report-provided range of 12.0–15.5 g/dL.',
    severity: 'attention',
    relatedResultId: 'res-303',
    sourceDocument: 'CBC_September_2026.pdf',
    createdAt: '2026-09-01T10:15:00Z'
  },
  {
    id: 'sig-402',
    patientId: 'pat-101',
    signalType: 'CHANGE_DETECTED',
    title: 'Hemoglobin Decrease Across Reports',
    description: 'Hemoglobin dropped from 13.4 g/dL (Jan 2026) to 10.2 g/dL (Sep 2026).',
    severity: 'info',
    relatedResultId: 'res-303',
    sourceDocument: 'CBC_September_2026.pdf',
    createdAt: '2026-09-01T10:15:00Z'
  },
  {
    id: 'sig-403',
    patientId: 'pat-101',
    signalType: 'VERIFICATION_REQUIRED',
    title: 'Human Verification Required',
    description: 'WBC (11.8 x10³/µL) and Ferritin (11 ng/mL) pending clinician verification.',
    severity: 'warning',
    relatedResultId: 'res-304',
    sourceDocument: 'CBC_September_2026.pdf',
    createdAt: '2026-09-01T10:15:00Z'
  },
  {
    id: 'sig-404',
    patientId: 'pat-101',
    signalType: 'CONFLICT_DETECTED',
    title: 'Allergy Information Conflict',
    description: 'Patient intake notes Penicillin allergy, but historical referral note lists no known drug allergies.',
    severity: 'warning',
    createdAt: '2026-09-01T10:20:00Z'
  }
];

export const seedConflicts = [
  {
    id: 'cnf-501',
    patientId: 'pat-101',
    field: 'Allergies',
    valueA: 'Penicillin, Sulfa Drugs',
    sourceA: 'Patient Intake Form (User Provided)',
    valueB: 'No Known Drug Allergies (NKDA)',
    sourceB: 'Historical Clinic Referral Note (2024)',
    status: 'UNRESOLVED',
    createdAt: '2026-09-01T10:20:00Z'
  }
];

export const seedTimeline = [
  {
    id: 'tml-601',
    patientId: 'pat-101',
    eventType: 'PATIENT_CREATED',
    title: 'Patient Record Created',
    description: 'Record initialized with baseline symptoms and medical history.',
    timestamp: '2026-01-15T09:00:00Z'
  },
  {
    id: 'tml-602',
    patientId: 'pat-101',
    eventType: 'REPORT_UPLOADED',
    title: 'Report Uploaded: CBC_January_2026.pdf',
    description: '4 laboratory metrics extracted with provenance.',
    timestamp: '2026-01-15T09:30:00Z'
  },
  {
    id: 'tml-603',
    patientId: 'pat-101',
    eventType: 'REPORT_UPLOADED',
    title: 'Report Uploaded: CBC_September_2026.pdf',
    description: '5 laboratory metrics extracted. 2 signals flagged.',
    timestamp: '2026-09-01T10:15:00Z'
  },
  {
    id: 'tml-604',
    patientId: 'pat-101',
    eventType: 'CONFLICT_DETECTED',
    title: 'Allergy Conflict Flagged',
    description: 'System identified discrepancy between intake form and historical note.',
    timestamp: '2026-09-01T10:20:00Z'
  },
  {
    id: 'tml-605',
    patientId: 'pat-103',
    eventType: 'PATIENT_CREATED',
    title: 'Patient Record Created',
    description: 'Ananya Sharma (MED-5510) added to patient registry.',
    timestamp: '2026-09-05T08:00:00Z'
  },
  {
    id: 'tml-606',
    patientId: 'pat-103',
    eventType: 'REPORT_UPLOADED',
    title: 'Report Ingested: CBC & BMP Report',
    description: '8 lab metrics extracted across Complete Blood Count and Basic Metabolic Panel.',
    timestamp: '2026-09-05T09:00:00Z'
  }
];

export const seedAudits = [
  {
    id: 'aud-701',
    userId: 'usr-1',
    patientId: 'pat-101',
    action: 'PATIENT_CREATED',
    details: 'Created patient record MED-8921 (Sarah Jenkins)',
    timestamp: '2026-01-15T09:00:00Z',
    userEmail: 'dr.miller@medlens.org'
  },
  {
    id: 'aud-702',
    userId: 'usr-1',
    patientId: 'pat-101',
    action: 'REPORT_PROCESSED',
    details: 'Processed report CBC_September_2026.pdf via Gemini API',
    timestamp: '2026-09-01T10:15:00Z',
    userEmail: 'dr.miller@medlens.org'
  },
  {
    id: 'aud-703',
    userId: 'usr-1',
    patientId: 'pat-101',
    action: 'LAB_RESULT_VERIFIED',
    details: 'Verified Hemoglobin result (10.2 g/dL)',
    timestamp: '2026-09-01T11:00:00Z',
    userEmail: 'dr.miller@medlens.org'
  },
  {
    id: 'aud-704',
    userId: 'usr-1',
    patientId: 'pat-103',
    action: 'PATIENT_CREATED',
    details: 'Created patient record MED-5510 (Ananya Sharma)',
    timestamp: '2026-09-05T08:00:00Z',
    userEmail: 'dr.clinician@medlens.org'
  }
];

export async function runSeed() {
  console.log('Connecting to MongoDB at:', MONGODB_URI);
  const client = new MongoClient(MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();

    console.log('Clearing existing MongoDB collections...');
    await db.collection('patients').deleteMany({});
    await db.collection('reports').deleteMany({});
    await db.collection('labResults').deleteMany({});
    await db.collection('signals').deleteMany({});
    await db.collection('conflicts').deleteMany({});
    await db.collection('timeline').deleteMany({});
    await db.collection('auditLogs').deleteMany({});

    console.log('Seeding patients...');
    await db.collection('patients').insertMany(seedPatients);

    console.log('Seeding reports...');
    await db.collection('reports').insertMany(seedReports);

    console.log('Seeding labResults...');
    await db.collection('labResults').insertMany(seedResults);

    console.log('Seeding signals...');
    await db.collection('signals').insertMany(seedSignals);

    console.log('Seeding conflicts...');
    await db.collection('conflicts').insertMany(seedConflicts);

    console.log('Seeding timeline...');
    await db.collection('timeline').insertMany(seedTimeline);

    console.log('Seeding auditLogs...');
    await db.collection('auditLogs').insertMany(seedAudits);

    console.log('MongoDB Seed completed successfully!');
    return { success: true, message: 'MongoDB seeded with sample patients, reports, lab results, signals, and audit logs.' };
  } catch (err: any) {
    console.error('Error seeding MongoDB:', err);
    throw err;
  } finally {
    await client.close();
  }
}

if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(() => process.exit(1));
}
