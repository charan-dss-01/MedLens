import React from 'react';
import PatientSubNav from '@/components/PatientSubNav';
import { getPatientById, getReportsByPatientId, getLabResultsByPatientId } from '@/lib/db/store';
import { GitCompare, TrendingDown, TrendingUp, Minus, ArrowRight } from 'lucide-react';

export const revalidate = 0;

export default async function CompareReportsPage({ params }: { params: { id: string } }) {
  const patient = await getPatientById(params.id);
  const reports = await getReportsByPatientId(params.id);
  const labResults = await getLabResultsByPatientId(params.id);

  // Group lab results by test name across reports
  const testMap: Record<string, Array<{ reportName: string; value: string; numVal?: number; unit: string; date: string }>> = {};

  labResults.forEach(r => {
    if (!testMap[r.testName]) testMap[r.testName] = [];
    testMap[r.testName].push({
      reportName: r.source.fileName,
      value: r.value,
      numVal: r.numericValue,
      unit: r.unit,
      date: r.createdAt
    });
  });

  return (
    <div>
      <PatientSubNav 
        patientId={params.id} 
        patientName={patient?.name || 'Patient Workspace'} 
        patientCode={patient?.patientCode || 'MED-0000'} 
      />

      <div className="space-y-6">
        <div className="bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs">
          <div className="flex items-center space-x-3 pb-3 border-b border-borderSubtle mb-4">
            <GitCompare className="w-5 h-5 text-medical-600" />
            <div>
              <h2 className="font-bold text-base text-primaryText">Compare Medical Reports Across Dates</h2>
              <p className="text-xs text-secondaryText">Side-by-side metric comparison tracking changes across uploaded reports</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-borderSubtle bg-slate-50 text-secondaryText font-semibold">
                  <th className="py-3 px-4">Test Name</th>
                  {reports.map((rep) => (
                    <th key={rep.id} className="py-3 px-4 font-mono">
                      <div>{rep.fileName}</div>
                      <div className="text-[10px] text-slate-400 font-sans font-normal">
                        {new Date(rep.uploadedAt).toLocaleDateString()}
                      </div>
                    </th>
                  ))}
                  <th className="py-3 px-4 text-right">Trend / Change Signal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle">
                {Object.entries(testMap).map(([testName, readings]) => {
                  const first = readings[0];
                  const last = readings[readings.length - 1];
                  const hasMultiple = readings.length > 1;
                  
                  let changeSignal = 'Unchanged';
                  let icon = <Minus className="w-3.5 h-3.5 text-slate-400" />;

                  if (hasMultiple && first.numVal !== undefined && last.numVal !== undefined) {
                    const diff = last.numVal - first.numVal;
                    if (diff < 0) {
                      changeSignal = `Decreased by ${Math.abs(diff).toFixed(1)} ${last.unit}`;
                      icon = <TrendingDown className="w-3.5 h-3.5 text-amber-600" />;
                    } else if (diff > 0) {
                      changeSignal = `Increased by ${diff.toFixed(1)} ${last.unit}`;
                      icon = <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />;
                    }
                  }

                  return (
                    <tr key={testName} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-primaryText">
                        {testName}
                      </td>

                      {reports.map((rep) => {
                        const reading = readings.find(r => r.reportName === rep.fileName);
                        return (
                          <td key={rep.id} className="py-3.5 px-4 font-mono">
                            {reading ? (
                              <span className="font-semibold text-slate-900">
                                {reading.value} <span className="text-slate-500 font-normal">{reading.unit}</span>
                              </span>
                            ) : (
                              <span className="text-slate-400 italic text-[11px] font-sans">Not Tested</span>
                            )}
                          </td>
                        );
                      })}

                      <td className="py-3.5 px-4 text-right">
                        <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded text-xs font-semibold ${
                          hasMultiple && first.numVal !== last.numVal
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}>
                          {icon}
                          <span>{changeSignal}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
