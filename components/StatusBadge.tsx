import React from 'react';
import { ReferenceRangeStatus, VerificationStatus } from '@/lib/types';
import { CheckCircle2, AlertCircle, AlertTriangle, HelpCircle, ShieldCheck, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: ReferenceRangeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'WITHIN_PROVIDED_RANGE':
      return (
        <span role="status" aria-label="Reference Range Status: Within Range" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Within Range</span>
        </span>
      );
    case 'ABOVE_PROVIDED_RANGE':
      return (
        <span role="status" aria-label="Reference Range Status: Above Range" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-800 border border-rose-200/80 whitespace-nowrap">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" aria-hidden="true" />
          <span>Above Range</span>
        </span>
      );
    case 'BELOW_PROVIDED_RANGE':
      return (
        <span role="status" aria-label="Reference Range Status: Below Range" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          <span>Below Range</span>
        </span>
      );
    case 'REFERENCE_RANGE_UNAVAILABLE':
    default:
      return (
        <span role="status" aria-label="Reference Range Status: Missing Range" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200/80 whitespace-nowrap">
          <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
          <span>Missing Range</span>
        </span>
      );
  }
}

export function VerificationBadge({ status }: { status: VerificationStatus }) {
  switch (status) {
    case 'VERIFIED':
      return (
        <span role="status" aria-label="Verification Governance Status: Verified" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" aria-hidden="true" />
          <span>Verified</span>
        </span>
      );
    case 'CORRECTED':
      return (
        <span role="status" aria-label="Verification Governance Status: Corrected" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200/80 whitespace-nowrap">
          <span>Corrected</span>
        </span>
      );
    case 'REJECTED':
      return (
        <span role="status" aria-label="Verification Governance Status: Rejected" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/80 whitespace-nowrap">
          <span>Rejected</span>
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span role="status" aria-label="Verification Governance Status: Pending Review" className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" aria-hidden="true" />
          <span>Pending</span>
        </span>
      );
  }
}
