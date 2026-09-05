import { describe, it, expect } from 'vitest';
import { calculateFileHash } from '../lib/security/hash';
import { encryptSensitiveData, decryptSensitiveData } from '../lib/security/crypto';
import { ExtractedLabResultSchema } from '../lib/validation/schemas';

describe('MedLens Clinical Intelligence Pipeline Integration Tests', () => {
  it('SHA-256 File Deduplication Hashing is deterministic', () => {
    const buffer1 = Buffer.from('PDF_SAMPLE_DATA_REPORT_101');
    const buffer2 = Buffer.from('PDF_SAMPLE_DATA_REPORT_101');
    const buffer3 = Buffer.from('PDF_DIFFERENT_DATA_REPORT_102');

    const hash1 = calculateFileHash(buffer1);
    const hash2 = calculateFileHash(buffer2);
    const hash3 = calculateFileHash(buffer3);

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1.length).toBe(64);
  });

  it('AES-256-GCM Encryption preserves sensitive patient data privacy', () => {
    const sensitiveName = 'Sarah Jenkins';
    const encrypted = encryptSensitiveData(sensitiveName);
    const decrypted = decryptSensitiveData(encrypted);

    expect(encrypted).not.toBe(sensitiveName);
    expect(decrypted).toBe(sensitiveName);
  });

  it('Zod Medical Lab Result Schema enforces reference range awareness', () => {
    const validMetric = {
      testName: 'Hemoglobin',
      value: '12.4',
      numericValue: 12.4,
      unit: 'g/dL',
      referenceRange: '12.0 - 15.5 g/dL',
      status: 'WITHIN_PROVIDED_RANGE' as const,
      sourcePage: 1,
      sourceSnippet: 'Hemoglobin: 12.4 g/dL (Ref: 12.0-15.5 g/dL)',
      confidence: 95,
    };

    const parseResult = ExtractedLabResultSchema.safeParse(validMetric);
    expect(parseResult.success).toBe(true);
  });

  it('Schema rejects missing critical fields', () => {
    const invalidMetric = {
      testName: 'WBC',
    };

    const invalidParse = ExtractedLabResultSchema.safeParse(invalidMetric);
    expect(invalidParse.success).toBe(false);
  });
});
