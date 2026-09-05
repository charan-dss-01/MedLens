import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import PatientSubNav from '@/components/PatientSubNav';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import { 
  getPatientById, 
  getLabResultsByPatientId, 
  getReportsByPatientId, 
  getSignalsByPatientId, 
  getConflictsByPatientId 
} from '@/lib/db/store';
import { generateSafePatientSummary } from '@/lib/ai/gemini';
import { ShieldCheck, FileText, AlertTriangle, ArrowRight, Activity, Bot, User } from 'lucide-react';

export const revalidate = 0;

export default async function PatientOverviewPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);

  if (!patient) {
    notFound();
  }

  const reports = await getReportsByPatientId(patient.id);
  const labResults = await getLabResultsByPatientId(patient.id);
  const signals = await getSignalsByPatientId(patient.id);
  const conflicts = await getConflictsByPatientId(patient.id);

  // Generate safe non-diagnostic summary
  const safeSummaryText = await generateSafePatientSummary(patient.name, labResults, signals);

  return (
    <div>
      <PatientSubNav 
        patientId={patient.id} 
        patientName={patient.name} 
        patientCode={patient.patientCode} 
      />

      <div className="space-y-6">
        {/* Top Grid: Patient Intake Profile & AI Safe Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Patient Intake Information (6 cols) */}
          <div className="lg:col-span-6 bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-borderSubtle mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-medical-600" />
                <h2 className="font-semibold text-sm text-primaryText">Patient Intake Profile</h2>
              </div>
              <ProvenanceBadge type="USER_PROVIDED" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-secondaryText block font-medium">Age / Sex</span>
                <span className="font-bold text-primaryText">{patient.age} years · {patient.sex}</span>
              </div>
              <div>
                <span className="text-secondaryText block font-medium">Security Standard</span>
                <span className="inline-flex items-center space-x-1 font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>AES-256 Encrypted</span>
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-secondaryText block font-medium mb-1">Reported Symptoms</span>
                <p className="bg-slate-50 p-2.5 rounded border border-borderSubtle text-slate-800 leading-relaxed font-medium">
                  {patient.symptoms || 'No specific symptoms reported at intake.'}
                </p>
              </div>

              <div>
                <span className="text-secondaryText block font-medium mb-1">Known Allergies</span>
                <div className="flex flex-wrap gap-1">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((a, i) => (
                      <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 font-semibold rounded text-[11px] border border-rose-200">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">No known drug allergies</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-secondaryText block font-medium mb-1">Current Medications</span>
                <div className="flex flex-wrap gap-1">
                  {patient.currentMedications.length > 0 ? (
                    patient.currentMedications.map((m, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-800 font-medium rounded text-[11px] border border-slate-200">
                        {m}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 italic">None listed</span>
                  )}
                </div>
              </div>

              <div className="col-span-2">
                <span className="text-secondaryText block font-medium mb-1">Existing Conditions & History</span>
                <p className="text-slate-700 leading-normal">
                  {patient.existingConditions.join(', ') || 'None listed'} · {patient.medicalHistory || 'No prior history recorded.'}
                </p>
              </div>
            </div>
          </div>

          {/* AI Responsible Patient Summary (6 cols) */}
          <div className="lg:col-span-6 bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-borderSubtle mb-4">
                <div className="flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-indigo-600" />
                  <h2 className="font-semibold text-sm text-primaryText">AI Information Summary</h2>
                </div>
                <ProvenanceBadge type="AI_GENERATED" />
              </div>

              <div className="text-xs text-slate-800 bg-indigo-50/40 border border-indigo-100 rounded-md p-4 leading-relaxed whitespace-pre-wrap font-medium">
                {safeSummaryText}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-borderSubtle text-[11px] text-slate-500 font-medium">
              <span className="text-medical-700 font-semibold">Responsible AI Policy:</span> MedLens strictly organizes structured record data and does not render diagnostic judgments.
            </div>
          </div>
        </div>

        {/* Bottom Grid: Extracted Reports & Clinical Signals Quick Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Medical Reports List (7 cols) */}
          <div className="lg:col-span-7 bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-borderSubtle mb-4">
              <div>
                <h3 className="font-semibold text-sm text-primaryText">Uploaded Medical Reports</h3>
                <p className="text-xs text-secondaryText">Traceable source PDF documents</p>
              </div>
              <div className="flex items-center space-x-3">
                <a
                  href={`/api/patients/${patient.id}/export`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 px-3 py-1.5 rounded border border-slate-200 transition-colors flex items-center space-x-1"
                >
                  <span>🖨️ Export Summary (PDF)</span>
                </a>
                <Link
                  href={`/patients/${patient.id}/upload`}
                  className="text-xs font-semibold text-medical-600 hover:text-medical-700 bg-blue-50 px-3 py-1.5 rounded border border-blue-200"
                >
                  + Upload New PDF
                </Link>
              </div>
            </div>

            {reports.length === 0 ? (
              <div className="p-6 text-center text-xs text-secondaryText">
                No medical reports uploaded yet for this patient.
              </div>
            ) : (
              <div className="space-y-2.5">
                {reports.map((rep) => (
                  <div key={rep.id} className="p-3 bg-slate-50 border border-borderSubtle rounded-md flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-medical-600 shrink-0" />
                      <div className="text-xs">
                        <div className="font-bold text-primaryText">{rep.fileName}</div>
                        <div className="text-[11px] text-secondaryText mt-0.5 font-mono">
                          {rep.extractedResultsCount} values extracted · Hash: {rep.fileHash.substring(0, 12)}...
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/patients/${patient.id}/record`}
                      className="inline-flex items-center space-x-1 text-xs font-semibold text-medical-600 hover:text-medical-700 bg-white border border-medical-200 px-3 py-1.5 rounded transition-colors shadow-2xs"
                    >
                      <span>View Provenance</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Signals & Conflicts (5 cols) */}
          <div className="lg:col-span-5 bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-borderSubtle mb-4">
              <div>
                <h3 className="font-semibold text-sm text-primaryText">Active Signals & Conflicts</h3>
                <p className="text-xs text-secondaryText">Attention items surfaced across records</p>
              </div>
              <Activity className="w-4 h-4 text-medical-600" />
            </div>

            <div className="space-y-2.5">
              {signals.slice(0, 3).map((sig) => (
                <div key={sig.id} className="p-3 bg-slate-50 border border-borderSubtle rounded-md text-xs">
                  <div className="flex items-center space-x-1.5 font-semibold text-slate-900 mb-0.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{sig.title}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-normal">{sig.description}</p>
                </div>
              ))}

              {conflicts.map((cnf) => (
                <div key={cnf.id} className="p-3 bg-amber-50/60 border border-amber-200 rounded-md text-xs">
                  <div className="font-semibold text-amber-900 flex items-center space-x-1.5 mb-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    <span>Conflict: {cnf.field}</span>
                  </div>
                  <div className="text-[11px] space-y-1 text-amber-950 font-medium">
                    <div>• {cnf.sourceA}: <span className="font-bold">{cnf.valueA}</span></div>
                    <div>• {cnf.sourceB}: <span className="font-bold">{cnf.valueB}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
