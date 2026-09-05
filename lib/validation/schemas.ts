import { z } from 'zod';
import { sanitizeInputText } from '../utils/debounce';

export const PatientIntakeSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').transform(sanitizeInputText),
  age: z.coerce.number().min(0, 'Age must be 0 or greater').max(150, 'Invalid age'),
  sex: z.enum(['Male', 'Female', 'Other'], { required_error: 'Sex is required' }),
  symptoms: z.string().optional().default('').transform(sanitizeInputText),
  existingConditions: z.string().or(z.array(z.string())).transform(val => 
    typeof val === 'string' 
      ? val.split(',').map(s => sanitizeInputText(s.trim())).filter(Boolean) 
      : val.map(s => sanitizeInputText(s))
  ).default([]),
  allergies: z.string().or(z.array(z.string())).transform(val => 
    typeof val === 'string' 
      ? val.split(',').map(s => sanitizeInputText(s.trim())).filter(Boolean) 
      : val.map(s => sanitizeInputText(s))
  ).default([]),
  currentMedications: z.string().or(z.array(z.string())).transform(val => 
    typeof val === 'string' 
      ? val.split(',').map(s => sanitizeInputText(s.trim())).filter(Boolean) 
      : val.map(s => sanitizeInputText(s))
  ).default([]),
  medicalHistory: z.string().optional().default('').transform(sanitizeInputText),
});

export const ExtractedLabResultSchema = z.object({
  testName: z.string().transform(sanitizeInputText),
  value: z.string().transform(sanitizeInputText),
  numericValue: z.number().optional(),
  unit: z.string().default('').transform(sanitizeInputText),
  referenceRange: z.string().nullable().default(null).transform(val => val ? sanitizeInputText(val) : null),
  status: z.enum([
    'WITHIN_PROVIDED_RANGE',
    'ABOVE_PROVIDED_RANGE',
    'BELOW_PROVIDED_RANGE',
    'REFERENCE_RANGE_UNAVAILABLE'
  ]),
  observation: z.string().optional().transform(val => val ? sanitizeInputText(val) : ''),
  sourcePage: z.number().default(1),
  sourceSnippet: z.string().default('').transform(sanitizeInputText),
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
  newValue: z.string().optional().transform(val => val ? sanitizeInputText(val) : undefined),
  newUnit: z.string().optional().transform(val => val ? sanitizeInputText(val) : undefined),
  newStatus: z.enum([
    'WITHIN_PROVIDED_RANGE',
    'ABOVE_PROVIDED_RANGE',
    'BELOW_PROVIDED_RANGE',
    'REFERENCE_RANGE_UNAVAILABLE'
  ]).optional(),
});
