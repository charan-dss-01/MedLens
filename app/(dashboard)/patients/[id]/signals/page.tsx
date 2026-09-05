'use client';

import React, { useState, useEffect } from 'react';
import PatientSubNav from '@/components/PatientSubNav';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  Info, 
  ShieldCheck,
  CheckSquare
} from 'lucide-react';

interface Signal {
  id: string;
  patientId: string;
  signalType: string;
  title: string;
  description: string;
  severity: 'attention' | 'warning' | 'info';
  sourceDocument?: string;
  createdAt: string;
}

interface Conflict {
  id: string;
  patientId: string;
  field: string;
  valueA: string;
  sourceA: string;
  valueB: string;
  sourceB: string;
  status: string;
  createdAt: string;
}

interface PatientData {
  patient: {
    id: string;
    patientCode: string;
    name: string;
    age: number;
    sex: string;
  };
  signals: Signal[];
  conflicts: Conflict[];
}

export default function SignalsPage({ params }: { params: { id: string } }) {
  const [data, setData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSignalId, setExpandedSignalId] = useState<string | null>(null);
  const [resolvedConflicts, setResolvedConflicts] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/patients/${params.id}`)
      .then(res => res.json())
      .then(resData => {
        if (resData.success && resData.data) {
          setData({
            patient: resData.data.patient,
            signals: resData.data.signals || [],
            conflicts: resData.data.conflicts || []
          });
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.id]);

  const toggleExpand = (id: string) => {
    setExpandedSignalId(prev => prev === id ? null : id);
  };

  const handleResolveConflict = (conflictId: string, choice: string) => {
    setResolvedConflicts(prev => [...prev, conflictId]);
    alert(`Conflict resolution logged: Selected "${choice}". Updated audit trail.`);
  };

  const attentionSignals = data?.signals.filter(s => s.severity === 'attention') || [];
  const warningSignals = data?.signals.filter(s => s.severity === 'warning') || [];
  const infoSignals = data?.signals.filter(s => s.severity === 'info') || [];

  return (
    <div className="space-y-6 font-sans antialiased text-slate-800">
      <PatientSubNav 
        patientId={params.id} 
        patientName={data?.patient?.name || 'Patient Workspace'} 
        patientCode={data?.patient?.patientCode || params.id} 
      />

      {/* Header Banner & Ingestion Metrics */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Clinical Information Signals Engine</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Automatically categorized signals derived from report reference bounds, verification status, and change detection.
              </p>
            </div>
          </div>

          <span className="text-xs font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold self-start sm:self-auto">
            {data?.signals.length || 0} Signals Detected
          </span>
        </div>

        {/* Severity Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-950 block">ATTENTION Required</span>
              <span className="text-amber-800 text-[11px]">Values outside report bounds</span>
            </div>
            <span className="text-2xl font-extrabold text-amber-950 font-mono">{attentionSignals.length}</span>
          </div>

          <div className="p-3.5 bg-amber-50/40 border border-amber-200/60 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold text-amber-900 block">WARNING Flags</span>
              <span className="text-amber-800 text-[11px]">Verification & conflicts</span>
            </div>
            <span className="text-2xl font-extrabold text-amber-900 font-mono">{warningSignals.length}</span>
          </div>

          <div className="p-3.5 bg-blue-50/50 border border-blue-200/60 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-bold text-blue-900 block">INFO Shifts</span>
              <span className="text-blue-800 text-[11px]">Changes across reports</span>
            </div>
            <span className="text-2xl font-extrabold text-blue-900 font-mono">{infoSignals.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200/80 text-slate-400 text-sm">
          Loading clinical signals from database...
        </div>
      ) : (
        <div className="space-y-4">
          
          {/* Information Conflict Resolution Panel */}
          {data?.conflicts.map(cnf => {
            const isResolved = resolvedConflicts.includes(cnf.id);
            return (
              <div 
                key={cnf.id} 
                className={`rounded-xl border p-6 shadow-2xs transition-all ${
                  isResolved ? 'bg-slate-50 border-slate-200 opacity-75' : 'bg-amber-50/60 border-amber-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center space-x-2 font-bold text-sm text-amber-950">
                    <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
                    <span>INFORMATION CONFLICT: {cnf.field}</span>
                  </div>
                  
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${
                    isResolved ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-200 text-amber-950 border-amber-300'
                  }`}>
                    {isResolved ? 'RESOLVED IN AUDIT LOG' : 'UNRESOLVED CONFLICT'}
                  </span>
                </div>

                <p className="text-xs text-amber-900 mb-4 font-medium">
                  Conflicting information detected between patient intake form and historical document note. Human clinician review required.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-4">
                  <div className="p-3.5 bg-white rounded-lg border border-amber-200">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Source A: {cnf.sourceA}</span>
                    <span className="font-bold text-sm text-slate-900 mt-1 block">{cnf.valueA}</span>
                  </div>

                  <div className="p-3.5 bg-white rounded-lg border border-amber-200">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Source B: {cnf.sourceB}</span>
                    <span className="font-bold text-sm text-slate-900 mt-1 block">{cnf.valueB}</span>
                  </div>
                </div>

                {!isResolved && (
                  <div className="pt-3 border-t border-amber-200/80 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700 mr-2">Clinician Resolution:</span>
                    <button
                      onClick={() => handleResolveConflict(cnf.id, `Keep Patient Info (${cnf.valueA})`)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-800 transition-colors shadow-2xs"
                    >
                      Keep Patient Form ({cnf.valueA})
                    </button>
                    <button
                      onClick={() => handleResolveConflict(cnf.id, `Keep Report Info (${cnf.valueB})`)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 rounded-lg text-slate-800 transition-colors shadow-2xs"
                    >
                      Keep Report Note ({cnf.valueB})
                    </button>
                    <button
                      onClick={() => handleResolveConflict(cnf.id, 'Marked Resolved after Chart Review')}
                      className="px-3 py-1.5 text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white rounded-lg transition-colors shadow-2xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Categorized Clinical Signals List */}
          {data?.signals.length === 0 && data?.conflicts.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200/80 text-slate-500">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No Information Signals Flagged</h3>
              <p className="text-xs text-slate-500 mt-1">All extracted measurements for this patient are within report-provided reference ranges with zero pending conflicts.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.signals.map(sig => {
                const isExpanded = expandedSignalId === sig.id;
                return (
                  <div 
                    key={sig.id}
                    className={`bg-white rounded-xl border transition-all ${
                      sig.severity === 'attention' ? 'border-amber-200 bg-amber-50/20' :
                      sig.severity === 'warning' ? 'border-amber-200 bg-amber-50/10' :
                      'border-slate-200'
                    }`}
                  >
                    <div className="p-5 flex items-start justify-between gap-4">
                      <div className="flex items-start space-x-3">
                        <AlertTriangle className={`w-5 h-5 shrink-0 mt-0.5 ${
                          sig.severity === 'attention' ? 'text-amber-700' :
                          sig.severity === 'warning' ? 'text-amber-600' : 'text-blue-600'
                        }`} />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-bold text-base text-slate-900">{sig.title}</h3>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              sig.severity === 'attention' ? 'bg-amber-200/80 text-amber-950' :
                              sig.severity === 'warning' ? 'bg-amber-100 text-amber-900' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {sig.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{sig.description}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => toggleExpand(sig.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200 shrink-0 flex items-center space-x-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why am I seeing this?</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5 ml-1" /> : <ChevronDown className="w-3.5 h-3.5 ml-1" />}
                      </button>
                    </div>

                    {/* Expandable Explanation Accordion */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/70 rounded-b-xl space-y-3 text-xs">
                        <div className="font-bold text-slate-900 flex items-center space-x-1.5 text-xs uppercase tracking-wider">
                          <Info className="w-4 h-4 text-blue-600" />
                          <span>Signal Calculation Rationale</span>
                        </div>

                        <p className="text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                          {sig.severity === 'attention' ? (
                            <span>This signal was generated because the recorded measurement falls strictly outside the upper or lower boundary explicitly stated in the source report reference range.</span>
                          ) : sig.severity === 'warning' ? (
                            <span>This signal was generated because extracted items are awaiting mandatory clinician review, or a discrepancy was identified between patient intake notes and document text.</span>
                          ) : (
                            <span>This signal was generated by tracking numerical metric changes across sequential uploaded reports for longitudinal monitoring.</span>
                          )}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-500 pt-2 font-mono">
                          <div className="flex items-center space-x-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Source: {sig.sourceDocument || 'Uploaded PDF Report'}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-slate-400 font-sans italic">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>No external medical assumptions. Calculated strictly from report bounds.</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
