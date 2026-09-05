import React from 'react';
import PatientSubNav from '@/components/PatientSubNav';
import { getPatientById, getTimelineByPatientId } from '@/lib/db/store';
import { Clock, FileText, CheckCircle2, AlertTriangle, UserPlus, Sparkles } from 'lucide-react';

export const revalidate = 0;

export default async function TimelinePage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);
  const timelineEvents = await getTimelineByPatientId(params.id);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PATIENT_CREATED': return <UserPlus className="w-4 h-4 text-medical-600" />;
      case 'REPORT_UPLOADED': return <FileText className="w-4 h-4 text-medical-600" />;
      case 'HUMAN_VERIFIED': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'CONFLICT_DETECTED': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'SUMMARY_GENERATED': default: return <Sparkles className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div>
      <PatientSubNav 
        patientId={params.id} 
        patientName={patient?.name || 'Patient Workspace'} 
        patientCode={patient?.patientCode || 'MED-0000'} 
      />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs">
          <div className="flex items-center space-x-3 pb-3 border-b border-borderSubtle mb-5">
            <Clock className="w-5 h-5 text-medical-600" />
            <div>
              <h2 className="font-bold text-base text-primaryText">Patient Information Timeline</h2>
              <p className="text-xs text-secondaryText">Chronological history of patient intakes, report extractions, and verifications</p>
            </div>
          </div>

          <div className="relative pl-6 border-l-2 border-borderSubtle space-y-6 my-4">
            {timelineEvents.map((ev) => (
              <div key={ev.id} className="relative group">
                {/* Timeline Dot */}
                <div className="absolute -left-[31px] top-1.5 w-6 h-6 rounded-full bg-surface border-2 border-medical-600 flex items-center justify-center shadow-2xs">
                  {getEventIcon(ev.eventType)}
                </div>

                <div className="bg-slate-50 border border-borderSubtle rounded-md p-4 text-xs transition-colors hover:bg-slate-100/70">
                  <div className="flex items-center justify-between font-bold text-primaryText mb-1">
                    <span>{ev.title}</span>
                    <span className="font-mono text-[11px] text-secondaryText font-normal">
                      {new Date(ev.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
