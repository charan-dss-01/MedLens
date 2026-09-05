/**
 * MedLens Clinical Information Signals Constants
 */

export const SIGNAL_TYPES = {
  OUTSIDE_RANGE: 'OUTSIDE_RANGE',
  VERIFICATION_REQUIRED: 'VERIFICATION_REQUIRED',
  CONFLICT_DETECTED: 'CONFLICT_DETECTED',
  CHANGE_DETECTED: 'CHANGE_DETECTED',
  MISSING_INFO: 'MISSING_INFO'
} as const;

export const SIGNAL_SEVERITIES = {
  ATTENTION: 'attention',
  WARNING: 'warning',
  INFO: 'info'
} as const;
