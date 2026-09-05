import React from 'react';
import { ProvenanceType, DocumentSource } from '@/lib/types';
import { User, FileText, Bot, CheckCircle } from 'lucide-react';

interface ProvenanceBadgeProps {
  type: ProvenanceType;
  source?: DocumentSource;
  className?: string;
}

export default function ProvenanceBadge({ type, source, className = '' }: ProvenanceBadgeProps) {
  switch (type) {
    case 'USER_PROVIDED':
      return (
        <span role="status" aria-label="Data Provenance: User provided intake" className={`inline-flex items-center space-x-1 text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 ${className}`}>
          <User className="w-3 h-3 text-slate-500" aria-hidden="true" />
          <span>User provided</span>
        </span>
      );
    case 'DOCUMENT_EXTRACTED':
      return (
        <span role="status" aria-label={`Data Provenance: Document Extracted from ${source?.fileName || 'Document'} Page ${source?.pageNumber || 1}`} className={`inline-flex items-center space-x-1 text-xs font-medium text-medical-700 bg-medical-50 px-2 py-0.5 rounded border border-medical-200 ${className}`}>
          <FileText className="w-3 h-3 text-medical-600" aria-hidden="true" />
          <span>{source?.fileName || 'Document Extracted'} · Page {source?.pageNumber || 1}</span>
        </span>
      );
    case 'AI_GENERATED':
      return (
        <span role="status" aria-label="Data Provenance: AI generated interpretation" className={`inline-flex items-center space-x-1 text-xs font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 ${className}`}>
          <Bot className="w-3 h-3 text-indigo-600" aria-hidden="true" />
          <span>AI generated</span>
        </span>
      );
    case 'HUMAN_VERIFIED':
      return (
        <span role="status" aria-label="Data Provenance: Clinician Human Verified" className={`inline-flex items-center space-x-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 ${className}`}>
          <CheckCircle className="w-3 h-3 text-emerald-600" aria-hidden="true" />
          <span>Human verified</span>
        </span>
      );
  }
}
