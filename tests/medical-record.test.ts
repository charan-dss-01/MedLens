import { calculateFileHash } from '../lib/security/hash';
import { encryptSensitiveData, decryptSensitiveData } from '../lib/security/crypto';
import { ExtractedLabResultSchema, PatientIntakeSchema } from '../lib/validation/schemas';

export function runPipelineVerificationSuite() {
  // Test 1: SHA-256 File Deduplication Hashing is deterministic
  const buffer1 = Buffer.from('PDF_SAMPLE_DATA_REPORT_101');
  const buffer2 = Buffer.from('PDF_SAMPLE_DATA_REPORT_101');
  const buffer3 = Buffer.from('PDF_DIFFERENT_DATA_REPORT_102');

  const hash1 = calculateFileHash(buffer1);
  const hash2 = calculateFileHash(buffer2);
  const hash3 = calculateFileHash(buffer3);

  if (hash1 !== hash2) throw new Error('SHA-256 Hash failed determinism test');
  if (hash1 === hash3) throw new Error('SHA-256 Hash failed collision test');
  if (hash1.length !== 64) throw new Error('Invalid SHA-256 string length');

  // Test 2: AES-256-GCM Encryption preserves sensitive patient data privacy
  const sensitiveName = 'Sarah Jenkins';
  const encrypted = encryptSensitiveData(sensitiveName);
  const decrypted = decryptSensitiveData(encrypted);

  if (encrypted === sensitiveName) throw new Error('AES-256 Encryption failed');
  if (decrypted !== sensitiveName) throw new Error('AES-256 Decryption failed');

  // Test 3: Zod Medical Lab Result Schema enforces reference range awareness
  const validMetric = {
    testName: 'Hemoglobin',
    value: '12.4',
    numericValue: 12.4,
    unit: 'g/dL',
    referenceRange: '12.0 - 15.5 g/dL',
    status: 'WITHIN_PROVIDED_RANGE' as const,
    sourcePage: 1,
    sourceSnippet: 'Hemoglobin: 12.4 g/dL (Ref: 12.0-15.5 g/dL)',
    confidence: 95
  };

  const parseResult = ExtractedLabResultSchema.safeParse(validMetric);
  if (!parseResult.success) throw new Error('Zod Schema rejected valid clinical metric');

  // Test 4: Schema rejects missing critical fields
  const invalidMetric = {
    testName: 'WBC',
  };

  const invalidParse = ExtractedLabResultSchema.safeParse(invalidMetric);
  if (invalidParse.success) throw new Error('Zod Schema accepted invalid metric without required value');

  console.log('✅ MedLens Pipeline Automated Test Suite: All 4 Tests Passed Cleanly!');
  return true;
}
