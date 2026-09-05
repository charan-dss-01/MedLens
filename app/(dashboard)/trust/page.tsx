import React from 'react';
import { ShieldCheck, Lock, Eye, Database, FileCheck, CheckCircle2, Server, Key } from 'lucide-react';

export default function TrustCenterPage() {
  const trustFeatures = [
    { title: 'Sensitive Data Encryption', desc: 'Patient names, symptoms, and medical notes encrypted via AES-256-GCM before MongoDB persistence.', icon: Lock, status: 'Active' },
    { title: 'Server-Side API Key Security', desc: 'Google Gemini API keys strictly reside server-side in environment variables and are never exposed to clients.', icon: Key, status: 'Active' },
    { title: 'Document Source Provenance', desc: 'Every extracted laboratory value retains page-level text snippet traceability to its original PDF.', icon: Eye, status: 'Active' },
    { title: 'AI Output Schema Validation', desc: 'Extracted Gemini outputs undergo strict Zod schema parsing and range boundary verification.', icon: FileCheck, status: 'Active' },
    { title: 'Human Clinician Verification', desc: 'AI outputs require human review (PENDING -> VERIFIED / CORRECTED) before final record approval.', icon: CheckCircle2, status: 'Active' },
    { title: 'Reference Range Safety Guardrail', desc: 'MedLens NEVER invents missing reference ranges. Tests without report ranges marked explicitly.', icon: ShieldCheck, status: 'Active' },
    { title: 'SHA-256 Duplicate Report Detection', desc: 'Files checked via SHA-256 hash prevention flow to eliminate accidental duplicate processing.', icon: Database, status: 'Active' },
    { title: 'System Audit Trail Logging', desc: 'All intake, report extraction, verification, and summary actions logged with timestamp and user ID.', icon: Server, status: 'Active' },
  ];

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-borderSubtle">
        <h1 className="text-xl font-bold text-primaryText tracking-tight">MedLens Trust Layer & Privacy Center</h1>
        <p className="text-xs text-secondaryText mt-0.5">
          Transparent clinical security, encryption standards, responsible AI guardrails, and privacy controls.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trustFeatures.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div key={idx} className="bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs flex items-start space-x-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between font-bold text-primaryText mb-1">
                  <span>{feat.title}</span>
                  <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                    ✓ {feat.status}
                  </span>
                </div>
                <p className="text-slate-600 leading-relaxed font-medium">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
