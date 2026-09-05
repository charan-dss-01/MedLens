import { LabResult, ReferenceRangeStatus, VerificationStatus } from '../types';
import { updateLabResultVerification, addAuditLog, addTimelineEvent } from '../db/store';
import { VerificationActionSchema } from '../validation/schemas';
import { ValidationError, NotFoundError } from '../errors/AppError';
import { AUDIT_ACTIONS } from '../constants/audit';

export async function processLabResultVerification(
  inputData: unknown,
  reviewerEmail = 'user@medlens.org'
): Promise<LabResult> {
  const validated = VerificationActionSchema.safeParse(inputData);
  if (!validated.success) {
    throw new ValidationError('Validation failed for verification payload', validated.error.flatten());
  }

  const { resultId, action, newValue, newUnit, newStatus } = validated.data;

  const statusMap: Record<string, 'VERIFIED' | 'CORRECTED' | 'REJECTED'> = {
    VERIFY: 'VERIFIED',
    EDIT: 'CORRECTED',
    REJECT: 'REJECTED'
  };
  const targetStatus = statusMap[action] || 'VERIFIED';

  const updatedResult = await updateLabResultVerification(
    resultId,
    targetStatus,
    newValue,
    newUnit,
    newStatus as ReferenceRangeStatus,
    'Dr. Reviewer'
  );

  if (!updatedResult) {
    throw new NotFoundError(`Lab result record ${resultId} not found`);
  }

  const patientId = updatedResult.patientId;

  // Audit trail event logging
  await addAuditLog({
    userId: 'usr-1',
    patientId,
    action: AUDIT_ACTIONS.HUMAN_VERIFIED,
    details: `Clinician verified lab result ${updatedResult.testName}: set to ${targetStatus}${newValue ? ` (Corrected value: ${newValue} ${newUnit || ''})` : ''}`,
    timestamp: new Date().toISOString(),
    userEmail: reviewerEmail
  });

  await addTimelineEvent({
    patientId,
    eventType: 'HUMAN_VERIFIED',
    title: `Clinician Verification: ${updatedResult.testName}`,
    description: `Result state set to ${targetStatus} by clinician reviewer.`,
    timestamp: new Date().toISOString()
  });

  return updatedResult;
}
