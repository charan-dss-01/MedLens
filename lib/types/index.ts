export type ProvenanceType = 
  | 'USER_PROVIDED' 
  | 'DOCUMENT_EXTRACTED' 
  | 'AI_GENERATED' 
  | 'HUMAN_VERIFIED';

export type ReferenceRangeStatus = 
  | 'WITHIN_PROVIDED_RANGE' 
  | 'ABOVE_PROVIDED_RANGE' 
  | 'BELOW_PROVIDED_RANGE' 
  | 'REFERENCE_RANGE_UNAVAILABLE';

export type VerificationStatus = 
  | 'PENDING' 
  | 'VERIFIED' 
  | 'CORRECTED' 
  | 'REJECTED';

export type SignalType = 
  | 'OUTSIDE_RANGE' 
  | 'VERIFICATION_REQUIRED' 
  | 'CONFLICT_DETECTED' 
  | 'CHANGE_DETECTED' 
  | 'MISSING_INFO';

export type SignalSeverity = 'info' | 'warning' | 'attention';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'doctor' | 'admin' | 'reviewer';
  createdAt: string;
}

export interface Patient {
  id: string;
  userId: string;
  patientCode: string; // e.g. PAT-9283
  name: string; // decrypted in app
  nameEncrypted?: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  symptoms: string;
  symptomsEncrypted?: string;
  existingConditions: string[];
  allergies: string[];
  currentMedications: string[];
  medicalHistory: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSource {
  fileName: string;
  pageNumber: number;
  textSnippet: string;
}

export interface LabResult {
  id: string;
  patientId: string;
  reportId: string;
  category?: string; // Structured category e.g. "Complete Blood Count (CBC)", "Basic Metabolic Panel (BMP)", etc.
  testName: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string | null; // Null if not in document
  status: ReferenceRangeStatus;
  observation?: string;
  source: DocumentSource;
  confidence: number; // 0 - 100
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  originalAIValue?: string;
  isSimulatedFallback?: boolean;
  createdAt: string;
}

export interface MedicalReport {
  id: string;
  patientId: string;
  fileName: string;
  fileHash: string;
  fileSize: number;
  mimeType: string;
  extractedText: string;
  extractedResultsCount: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  isSimulatedFallback?: boolean;
  uploadedAt: string;
}

export interface ClinicalSignal {
  id: string;
  patientId: string;
  signalType: SignalType;
  title: string;
  description: string;
  severity: SignalSeverity;
  relatedResultId?: string;
  sourceDocument?: string;
  createdAt: string;
}

export interface ConflictItem {
  id: string;
  patientId: string;
  field: string;
  valueA: string;
  sourceA: string;
  valueB: string;
  sourceB: string;
  status: 'UNRESOLVED' | 'RESOLVED';
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  eventType: 
    | 'PATIENT_CREATED'
    | 'REPORT_UPLOADED'
    | 'AI_EXTRACTED'
    | 'HUMAN_VERIFIED'
    | 'CONFLICT_DETECTED'
    | 'SUMMARY_GENERATED';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface AISummary {
  id: string;
  patientId: string;
  summaryText: string;
  disclaimer: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  patientId?: string;
  action: string;
  details: string;
  timestamp: string;
  userEmail?: string;
}

export interface RAGAnswer {
  question: string;
  answer: string;
  sources: Array<{
    fileName: string;
    pageNumber: number;
    snippet: string;
  }>;
  disclaimer: string;
}
