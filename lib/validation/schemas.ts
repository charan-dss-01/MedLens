import { z } from 'zod';

export const PatientIntakeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  age: z.coerce.number().min(0, 'Age must be 0 or greater').max(150, 'Invalid age'),
  sex: z.enum(['Male', 'Female', 'Other'], { required_error: 'Sex is required' }),
  symptoms: z.string().optional().default(''),
  existingConditions: z.string().or(z.array(z.string())).transform(val => 
    typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val
  ).default([]),
  allergies: z.string().or(z.array(z.string())).transform(val => 
    typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val
  ).default([]),
  currentMedications: z.string().or(z.array(z.string())).transform(val => 
    typeof val === 'string' ? val.split(',').map(s => s.trim()).filter(Boolean) : val
  ).default([]),
  medicalHistory: z.string().optional().default(''),
});

export const ExtractedLabResultSchema = z.object({
  testName: z.string(),
  value: z.string(),
  numericValue: z.number().optional(),
  unit: z.string().default(''),
  referenceRange: z.string().nullable().default(null),
  status: z.enum([
    'WITHIN_PROVIDED_RANGE',
    'ABOVE_PROVIDED_RANGE',
    'BELOW_PROVIDED_RANGE',
    'REFERENCE_RANGE_UNAVAILABLE'
  ]),
  observation: z.string().optional(),
  sourcePage: z.number().default(1),
  sourceSnippet: z.string().default(''),
  confidence: z.number().min(0).max(100).default(90),
});

export const GeminiExtractionResponseSchema = z.object({
  extractedResults: z.array(ExtractedLabResultSchema),
  extractedAllergies: z.array(z.string()).default([]),
  extractedConditions: z.array(z.string()).default([]),
  reportSummary: z.string().optional(),
});

export const VerificationActionSchema = z.object({
  resultId: z.string(),
  action: z.enum(['VERIFY', 'EDIT', 'REJECT']),
  newValue: z.string().optional(),
  newUnit: z.string().optional(),
  newStatus: z.enum([
    'WITHIN_PROVIDED_RANGE',
    'ABOVE_PROVIDED_RANGE',
    'BELOW_PROVIDED_RANGE',
    'REFERENCE_RANGE_UNAVAILABLE'
  ]).optional(),
});
