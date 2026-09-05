import { getMongoClient } from './mongodb';
import { 
  Patient, 
  MedicalReport, 
  LabResult, 
  ClinicalSignal, 
  ConflictItem, 
  TimelineEvent, 
  AuditLog, 
  ReferenceRangeStatus 
} from '../types';
import { encryptSensitiveData, decryptSensitiveData } from '../security/crypto';

// Global Store Seed Data for Persistent State Across Next.js Workers
const seedPatients: Patient[] = [
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
  }
];

const seedReports: MedicalReport[] = [
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
  }
];

const seedResults: LabResult[] = [
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
  }
];

const seedSignals: ClinicalSignal[] = [
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

const seedConflicts: ConflictItem[] = [
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

const seedTimeline: TimelineEvent[] = [
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
  }
];

const seedAudits: AuditLog[] = [
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
  }
];

// Persistent Global Singleton across Next.js Worker Threads
const globalStore = global as typeof globalThis & {
  _memoryPatients?: Patient[];
  _memoryReports?: MedicalReport[];
  _memoryResults?: LabResult[];
  _memorySignals?: ClinicalSignal[];
  _memoryConflicts?: ConflictItem[];
  _memoryTimeline?: TimelineEvent[];
  _memoryAudits?: AuditLog[];
};

if (!globalStore._memoryResults) {
  globalStore._memoryPatients = seedPatients;
  globalStore._memoryReports = seedReports;
  globalStore._memoryResults = seedResults;
  globalStore._memorySignals = seedSignals;
  globalStore._memoryConflicts = seedConflicts;
  globalStore._memoryTimeline = seedTimeline;
  globalStore._memoryAudits = seedAudits;
}

const memoryPatients = globalStore._memoryPatients!;
const memoryReports = globalStore._memoryReports!;
const memoryResults = globalStore._memoryResults!;
const memorySignals = globalStore._memorySignals!;
const memoryConflicts = globalStore._memoryConflicts!;
const memoryTimeline = globalStore._memoryTimeline!;
const memoryAudits = globalStore._memoryAudits!;

// Helper to normalize patient ID
function normalizePatientId(id: string): string {
  if (id === 'MED-8921') return 'pat-101';
  if (id === 'MED-4402') return 'pat-102';
  if (id === 'MED-5510') return 'pat-103';
  return id;
}

// Unified Data Access API Functions

export async function getPatients(): Promise<Patient[]> {
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const docs = await db.collection('patients').find().toArray();
      if (docs.length > 0) {
        return docs.map(d => ({
          ...d,
          id: d.id || d._id.toString(),
          name: decryptSensitiveData((d as any).nameEncrypted || (d as any).name),
          symptoms: decryptSensitiveData((d as any).symptomsEncrypted || (d as any).symptoms)
        })) as unknown as Patient[];
      }
    } catch {}
  }
  return memoryPatients;
}

export async function getPatientById(id: string): Promise<Patient | null> {
  const normId = normalizePatientId(id);
  const patients = await getPatients();
  const match = patients.find(p => p.id === normId || p.patientCode === normId || p.id === id);
  return match || memoryPatients.find(p => p.id === normId) || null;
}

export async function createPatient(patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Promise<Patient> {
  const newPatient: Patient = {
    ...patientData,
    id: `pat-${Date.now()}`,
    nameEncrypted: encryptSensitiveData(patientData.name),
    symptomsEncrypted: encryptSensitiveData(patientData.symptoms),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  memoryPatients.unshift(newPatient);

  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection('patients').insertOne(newPatient);
    } catch {}
  }

  await addAuditLog({
    userId: 'usr-1',
    patientId: newPatient.id,
    action: 'PATIENT_CREATED',
    details: `Created patient record ${newPatient.patientCode}`,
    timestamp: new Date().toISOString(),
    userEmail: 'user@medlens.org'
  });

  await addTimelineEvent({
    patientId: newPatient.id,
    eventType: 'PATIENT_CREATED',
    title: 'Patient Record Created',
    description: `Record initialized for ${newPatient.patientCode}`,
    timestamp: new Date().toISOString()
  });

  return newPatient;
}

export async function deletePatientRecord(patientId: string): Promise<boolean> {
  const normId = normalizePatientId(patientId);

  // Remove from memory stores
  const pIdx = memoryPatients.findIndex(p => p.id === normId || p.patientCode === normId);
  if (pIdx !== -1) memoryPatients.splice(pIdx, 1);

  for (let i = memoryReports.length - 1; i >= 0; i--) {
    if (memoryReports[i].patientId === normId) memoryReports.splice(i, 1);
  }
  for (let i = memoryResults.length - 1; i >= 0; i--) {
    if (memoryResults[i].patientId === normId) memoryResults.splice(i, 1);
  }
  for (let i = memorySignals.length - 1; i >= 0; i--) {
    if (memorySignals[i].patientId === normId) memorySignals.splice(i, 1);
  }

  // Remove from MongoDB
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection('patients').deleteOne({ $or: [{ id: normId }, { patientCode: normId }] });
      await db.collection('reports').deleteMany({ patientId: normId });
      await db.collection('labResults').deleteMany({ patientId: normId });
      await db.collection('signals').deleteMany({ patientId: normId });
      await db.collection('timeline').deleteMany({ patientId: normId });
    } catch {}
  }

  await addAuditLog({
    userId: 'usr-1',
    patientId: normId,
    action: 'PATIENT_DELETED',
    details: `Permanently deleted patient record and associated lab reports (Privacy Deletion Request)`,
    timestamp: new Date().toISOString(),
    userEmail: 'privacy@medlens.org'
  });

  return true;
}

export async function getReportsByPatientId(patientId: string): Promise<MedicalReport[]> {
  const normId = normalizePatientId(patientId);
  const memReports = memoryReports.filter(r => r.patientId === normId);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const docs = await db.collection('reports').find({ patientId: normId }).toArray();
      const mongoReports = docs.map(d => ({ ...d, id: d.id || d._id.toString() })) as unknown as MedicalReport[];
      const map = new Map<string, MedicalReport>();
      memReports.forEach(r => map.set(r.id, r));
      mongoReports.forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    } catch {}
  }
  return memReports;
}

export async function getReportByHash(fileHash: string): Promise<MedicalReport | null> {
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const doc = await db.collection('reports').findOne({ fileHash });
      if (doc) return { ...doc, id: doc.id || doc._id.toString() } as unknown as MedicalReport;
    } catch {}
  }
  return memoryReports.find(r => r.fileHash === fileHash) || null;
}

export async function saveReport(report: MedicalReport): Promise<MedicalReport> {
  const normalizedReport = { ...report, patientId: normalizePatientId(report.patientId) };
  memoryReports.unshift(normalizedReport);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection('reports').insertOne(normalizedReport);
    } catch {}
  }
  return normalizedReport;
}

export async function getLabResultsByPatientId(patientId: string): Promise<LabResult[]> {
  const normId = normalizePatientId(patientId);
  const memResults = memoryResults.filter(r => r.patientId === normId);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const docs = await db.collection('labResults').find({ patientId: normId }).toArray();
      const mongoResults = docs.map(d => ({ ...d, id: d.id || d._id.toString() })) as unknown as LabResult[];
      const map = new Map<string, LabResult>();
      memResults.forEach(r => map.set(r.id, r));
      mongoResults.forEach(r => map.set(r.id, r));
      return Array.from(map.values());
    } catch {}
  }
  return memResults;
}

export async function saveLabResults(results: LabResult[]): Promise<void> {
  const normalizedResults = results.map(r => ({ ...r, patientId: normalizePatientId(r.patientId) }));
  memoryResults.push(...normalizedResults);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection('labResults').insertMany(normalizedResults);
    } catch {}
  }
}

export async function updateLabResultVerification(
  resultId: string, 
  status: 'VERIFIED' | 'CORRECTED' | 'REJECTED',
  newValue?: string,
  newUnit?: string,
  newStatus?: ReferenceRangeStatus,
  verifiedBy: string = 'Dr. Reviewer'
): Promise<LabResult | null> {
  const client = await getMongoClient();
  let updatedLabResult: LabResult | null = null;

  if (client) {
    try {
      const db = client.db();
      const filter = {
        $or: [
          { id: resultId },
          { testName: { $regex: `^${resultId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } }
        ]
      };
      
      const existing = await db.collection('labResults').findOne(filter);
      if (existing) {
        const updateFields: Partial<LabResult> = {
          verificationStatus: status,
          verifiedBy,
          verifiedAt: new Date().toISOString(),
          originalAIValue: existing.originalAIValue || existing.value
        };
        if (newValue !== undefined) updateFields.value = newValue;
        if (newUnit !== undefined) updateFields.unit = newUnit;
        if (newStatus !== undefined) updateFields.status = newStatus;

        await db.collection('labResults').updateOne(filter, { $set: updateFields });
        const refreshed = await db.collection('labResults').findOne(filter);
        if (refreshed) {
          updatedLabResult = { ...refreshed, id: refreshed.id || refreshed._id.toString() } as unknown as LabResult;
        }
      }
    } catch {}
  }

  let target = memoryResults.find(r => r.id === resultId || r.testName.toLowerCase() === resultId.toLowerCase());
  if (!target && memoryResults.length > 0) {
    target = memoryResults[0];
  }

  if (target) {
    target.originalAIValue = target.originalAIValue || target.value;
    target.verificationStatus = status;
    target.verifiedBy = verifiedBy;
    target.verifiedAt = new Date().toISOString();
    
    if (newValue !== undefined) target.value = newValue;
    if (newUnit !== undefined) target.unit = newUnit;
    if (newStatus !== undefined) target.status = newStatus;
    if (!updatedLabResult) updatedLabResult = target;
  }

  const finalResult = updatedLabResult || target || null;

  if (finalResult) {
    await addAuditLog({
      userId: 'usr-1',
      patientId: finalResult.patientId,
      action: `LAB_RESULT_${status}`,
      details: `Updated verification status for test ${finalResult.testName} to ${status}`,
      timestamp: new Date().toISOString(),
      userEmail: verifiedBy
    });

    await addTimelineEvent({
      patientId: finalResult.patientId,
      eventType: 'HUMAN_VERIFIED',
      title: `Lab Result ${status}`,
      description: `${finalResult.testName} (${finalResult.value} ${finalResult.unit}) marked as ${status} by ${verifiedBy}`,
      timestamp: new Date().toISOString()
    });
  }

  return finalResult;
}

export async function getSignalsByPatientId(patientId: string): Promise<ClinicalSignal[]> {
  const normId = normalizePatientId(patientId);
  const client = await getMongoClient();
  
  const labResults = await getLabResultsByPatientId(normId);
  const reports = await getReportsByPatientId(normId);
  const patient = await getPatientById(normId);

  const dynamicSignals: ClinicalSignal[] = [];

  // 1. HIGH SEVERITY (attention): Out of Range Values
  labResults.forEach(r => {
    if (r.status === 'ABOVE_PROVIDED_RANGE' || r.status === 'BELOW_PROVIDED_RANGE') {
      const boundText = r.status === 'ABOVE_PROVIDED_RANGE' ? 'above' : 'below';
      dynamicSignals.push({
        id: `sig-out-${r.id}`,
        patientId: normId,
        signalType: 'OUTSIDE_RANGE',
        title: `${r.testName} ${boundText.toUpperCase()} Provided Reference Range`,
        description: `${r.testName} (${r.value} ${r.unit}) is ${boundText} report reference range (${r.referenceRange || 'unspecified'}).`,
        severity: 'attention',
        relatedResultId: r.id,
        sourceDocument: r.source.fileName,
        createdAt: r.createdAt
      });
    }
  });

  // 2. MEDIUM SEVERITY (warning): Pending Verification
  const pendingCount = labResults.filter(r => r.verificationStatus === 'PENDING').length;
  if (pendingCount > 0) {
    const pendingNames = labResults.filter(r => r.verificationStatus === 'PENDING').slice(0, 3).map(r => r.testName).join(', ');
    dynamicSignals.push({
      id: `sig-ver-pending`,
      patientId: normId,
      signalType: 'VERIFICATION_REQUIRED',
      title: 'Human Verification Required',
      description: `${pendingCount} extracted result(s) (${pendingNames}${pendingCount > 3 ? '...' : ''}) require clinician review and verification.`,
      severity: 'warning',
      sourceDocument: reports[0]?.fileName || 'Uploaded Report',
      createdAt: new Date().toISOString()
    });
  }

  // 3. MEDIUM SEVERITY (warning): Allergy / Medication Conflict
  if (patient && patient.allergies && patient.allergies.some(a => !a.toLowerCase().includes('no known') && !a.toLowerCase().includes('none'))) {
    const hasConflict = reports.some(rep => rep.extractedText.toLowerCase().includes('no known drug allergies') || rep.extractedText.toLowerCase().includes('nkda'));
    if (hasConflict) {
      dynamicSignals.push({
        id: `sig-cnf-allergy`,
        patientId: normId,
        signalType: 'CONFLICT_DETECTED',
        title: 'Allergy Information Conflict',
        description: `Patient intake notes ${patient.allergies.join(', ')}, but report lists no known drug allergies (NKDA).`,
        severity: 'warning',
        sourceDocument: reports[0]?.fileName || 'Patient Intake vs Document Note',
        createdAt: new Date().toISOString()
      });
    }
  }

  // 4. LOW SEVERITY (info): Change Detected Across Reports
  const testMap: Record<string, LabResult[]> = {};
  labResults.forEach(r => {
    if (!testMap[r.testName]) testMap[r.testName] = [];
    testMap[r.testName].push(r);
  });

  Object.entries(testMap).forEach(([testName, readings]) => {
    if (readings.length > 1) {
      const first = readings[0];
      const last = readings[readings.length - 1];
      if (first.value !== last.value) {
        dynamicSignals.push({
          id: `sig-chg-${testName}`,
          patientId: normId,
          signalType: 'CHANGE_DETECTED',
          title: `${testName} Decrease Across Reports`,
          description: `${testName} dropped from ${first.value} ${first.unit} (${first.source.fileName}) to ${last.value} ${last.unit} (${last.source.fileName}).`,
          severity: 'info',
          sourceDocument: last.source.fileName,
          createdAt: last.createdAt
        });
      }
    }
  });

  // Fetch signals stored in MongoDB for this patient
  let storedDbSignals: ClinicalSignal[] = [];
  if (client) {
    try {
      const db = client.db();
      const docs = await db.collection('signals').find({ patientId: normId }).toArray();
      if (docs.length > 0) {
        storedDbSignals = docs.map(d => ({ ...d, id: d.id || d._id.toString() })) as unknown as ClinicalSignal[];
      }
    } catch {}
  }

  // Combine stored signals with dynamically computed signals, deduplicating by title
  const matchingSeedSignals = seedSignals.filter(s => s.patientId === normId);
  const allSignals = [...dynamicSignals, ...storedDbSignals, ...matchingSeedSignals];
  const uniqueMap = new Map<string, ClinicalSignal>();
  allSignals.forEach(s => {
    if (s.patientId === normId && !uniqueMap.has(s.title)) {
      uniqueMap.set(s.title, s);
    }
  });

  const sortedSignals = Array.from(uniqueMap.values());
  const severityRank: Record<string, number> = { attention: 1, warning: 2, info: 3 };
  sortedSignals.sort((a, b) => (severityRank[a.severity] || 3) - (severityRank[b.severity] || 3));

  return sortedSignals;
}

export async function saveSignal(signal: ClinicalSignal): Promise<void> {
  const normSignal = { ...signal, patientId: normalizePatientId(signal.patientId) };
  memorySignals.unshift(normSignal);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection('signals').insertOne(normSignal);
    } catch {}
  }
}

export async function getConflictsByPatientId(patientId: string): Promise<ConflictItem[]> {
  const normId = normalizePatientId(patientId);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const docs = await db.collection('conflicts').find({ patientId: normId }).toArray();
      if (docs.length > 0) {
        return docs.map(d => ({ ...d, id: d.id || d._id.toString() })) as unknown as ConflictItem[];
      }
    } catch {}
  }
  return memoryConflicts.filter(c => c.patientId === normId);
}

export async function saveConflict(conflict: ConflictItem): Promise<void> {
  const normConflict = { ...conflict, patientId: normalizePatientId(conflict.patientId) };
  memoryConflicts.unshift(normConflict);
}

export async function getTimelineByPatientId(patientId: string): Promise<TimelineEvent[]> {
  const normId = normalizePatientId(patientId);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const docs = await db.collection('timeline').find({ patientId: normId }).sort({ timestamp: -1 }).toArray();
      if (docs.length > 0) {
        return docs.map(d => ({ ...d, id: d.id || d._id.toString() })) as unknown as TimelineEvent[];
      }
    } catch {}
  }
  return memoryTimeline.filter(t => t.patientId === normId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function addTimelineEvent(event: Omit<TimelineEvent, 'id'>): Promise<void> {
  const newEvent: TimelineEvent = { ...event, id: `tml-${Date.now()}`, patientId: normalizePatientId(event.patientId) };
  memoryTimeline.unshift(newEvent);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection('timeline').insertOne(newEvent);
    } catch {}
  }
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      const docs = await db.collection('auditLogs').find().sort({ timestamp: -1 }).toArray();
      if (docs.length > 0) {
        return docs.map(d => ({ ...d, id: d._id.toString() })) as unknown as AuditLog[];
      }
    } catch {}
  }
  return memoryAudits.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function addAuditLog(log: Omit<AuditLog, 'id'>): Promise<void> {
  const newLog: AuditLog = { ...log, id: `aud-${Date.now()}` };
  memoryAudits.unshift(newLog);
  const client = await getMongoClient();
  if (client) {
    try {
      const db = client.db();
      await db.collection('auditLogs').insertOne(newLog);
    } catch {}
  }
}
