'use client';

import React, { useState } from 'react';
import { LabResult, MedicalReport } from '@/lib/types';
import { StatusBadge, VerificationBadge } from './StatusBadge';
import ProvenanceBadge from './ProvenanceBadge';
import { FileText, Check, Edit2, X, Eye, Stethoscope } from 'lucide-react';

interface SideBySideViewProps {
  reports: MedicalReport[];
  labResults: LabResult[];
  onVerifyResult?: (resultId: string, action: 'VERIFY' | 'EDIT' | 'REJECT', newValue?: string, newUnit?: string) => Promise<void>;
}

export default function SideBySideView({ reports, labResults, onVerifyResult }: SideBySideViewProps) {
  const [selectedResultId, setSelectedResultId] = useState<string | null>(labResults[0]?.id || null);
  const [activeReportId, setActiveReportId] = useState<string | null>(reports[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [editingResultId, setEditingResultId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedResult = labResults.find(r => r.id === selectedResultId) || labResults[0];
  const activeReport = reports.find(r => r.id === activeReportId) || 
                       reports.find(r => r.id === selectedResult?.reportId || r.fileName === selectedResult?.source?.fileName) || 
                       reports[0];

  const handleSelectResult = (res: LabResult) => {
    setSelectedResultId(res.id);
    const matchingRep = reports.find(r => r.id === res.reportId || r.fileName === res.source.fileName);
    if (matchingRep) {
      setActiveReportId(matchingRep.id);
    }
  };

  const handleStartEdit = (res: LabResult) => {
    setEditingResultId(res.id);
    setEditValue(res.value);
    setEditUnit(res.unit);
  };

  const handleSaveEdit = async (resultId: string) => {
    if (!onVerifyResult) return;
    setIsSubmitting(true);
    try {
      await onVerifyResult(resultId, 'EDIT', editValue, editUnit);
      setEditingResultId(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerify = async (resultId: string) => {
    if (!onVerifyResult) return;
    setIsSubmitting(true);
    try {
      await onVerifyResult(resultId, 'VERIFY');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Group lab results by Category (Medical Panels)
  const categoriesList = Array.from(new Set(labResults.map(r => r.category || 'General Diagnostic Panel')));

  const filteredLabResults = selectedCategory === 'ALL' 
    ? labResults 
    : labResults.filter(r => (r.category || 'General Diagnostic Panel') === selectedCategory);

  // Map category groups
  const groupedResults: Record<string, LabResult[]> = {};
  filteredLabResults.forEach(r => {
    const cat = r.category || 'General Diagnostic Panel';
    if (!groupedResults[cat]) groupedResults[cat] = [];
    groupedResults[cat].push(r);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* LEFT PANE: Original Document & Snippet Context (5 Cols) */}
      <div className="lg:col-span-5 bg-surface border border-borderSubtle rounded-lg p-5 flex flex-col h-full shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-borderSubtle mb-4">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-medical-600" />
            <h3 className="font-semibold text-sm text-primaryText">Original Report Viewer</h3>
          </div>

          {reports.length > 1 ? (
            <div className="relative">
              <select
                value={activeReport?.id || ''}
                onChange={(e) => {
                  const newReportId = e.target.value;
                  setActiveReportId(newReportId);
                  const targetRep = reports.find(r => r.id === newReportId);
                  const firstRes = labResults.find(r => r.reportId === newReportId || (targetRep && r.source?.fileName === targetRep.fileName));
                  if (firstRes) {
                    setSelectedResultId(firstRes.id);
                  }
                }}
                className="text-xs bg-slate-100 font-mono text-slate-800 border border-slate-300 rounded px-2 py-1 pr-6 focus:outline-none cursor-pointer font-semibold"
              >
                {reports.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    📄 {rep.fileName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <span className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono text-slate-600 border border-slate-200">
              {activeReport?.fileName || 'Medical_Report.pdf'}
            </span>
          )}
        </div>

        {selectedResult && (
          <div className="mb-4 bg-medical-50/70 border border-medical-200 rounded-md p-3.5">
            <div className="flex items-center justify-between text-xs text-medical-800 font-semibold mb-1">
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-medical-600" />
                <span>Extracted Text Highlight (Page {selectedResult.source.pageNumber})</span>
              </span>
              <span className="font-mono text-[11px] text-medical-600 bg-white px-1.5 py-0.5 rounded border border-medical-100">
                Confidence: {selectedResult.confidence}%
              </span>
            </div>
            <p className="text-xs font-mono text-slate-800 bg-white p-2.5 rounded border border-medical-100 leading-relaxed font-medium">
              &quot;{selectedResult.source.textSnippet}&quot;
            </p>
          </div>
        )}

        <div className="flex-1 bg-slate-900 rounded-md p-4 overflow-y-auto max-h-[420px] font-mono text-xs text-slate-300 leading-relaxed border border-slate-800">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2 pb-1 border-b border-slate-800 flex justify-between items-center">
            <span>Raw Document Text</span>
            <span className="text-slate-400 font-normal">{activeReport?.fileName}</span>
          </div>
          <pre className="whitespace-pre-wrap font-sans text-xs">
            {activeReport?.extractedText || 'No text extracted.'}
          </pre>
        </div>
      </div>

      {/* RIGHT PANE: Structured Medical Information & Segregated Panels (7 Cols) */}
      <div className="lg:col-span-7 bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-borderSubtle gap-2">
          <div>
            <h3 className="font-semibold text-sm text-primaryText">Structured Medical Record</h3>
            <p className="text-xs text-secondaryText">Organized into clinical panels rather than raw AI text</p>
          </div>

          <span className="text-xs font-semibold text-medical-700 bg-medical-50 border border-medical-200 px-3 py-1 rounded">
            {labResults.length} Metrics Segregated
          </span>
        </div>

        {/* Category Panel Selector Chips */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs" role="tablist" aria-label="Clinical Panel Filter Options">
          <span className="text-secondaryText font-medium text-[11px] uppercase tracking-wider font-mono">Panels:</span>
          <button
            role="tab"
            aria-selected={selectedCategory === 'ALL'}
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1 rounded-md font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none ${
              selectedCategory === 'ALL' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Panels ({labResults.length})
          </button>
          {categoriesList.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-md font-semibold transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none ${
                selectedCategory === cat ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat} ({labResults.filter(r => (r.category || 'General Diagnostic Panel') === cat).length})
            </button>
          ))}
        </div>

        {/* Segregated Clinical Panels */}
        <div className="space-y-5">
          {Object.entries(groupedResults).map(([catName, results]) => (
            <div key={catName} className="border border-borderSubtle rounded-lg overflow-hidden bg-white shadow-2xs">
              {/* Category Panel Header */}
              <div className="bg-slate-50 px-4 py-2.5 border-b border-borderSubtle flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" aria-hidden="true" />
                  <h4 className="font-bold text-xs text-primaryText uppercase tracking-wider">{catName}</h4>
                </div>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {results.length} tests
                </span>
              </div>

              {/* Panel Results Table */}
              <div className="overflow-x-auto" tabIndex={0} aria-label={`${catName} results table`}>
                <table className="w-full text-left text-xs border-collapse min-w-[680px]" role="table">
                  <thead>
                    <tr className="border-b border-borderSubtle bg-slate-50/80 text-slate-500 font-semibold text-[11px] tracking-wider uppercase">
                      <th scope="col" className="py-2.5 px-3.5 min-w-[180px]">Test Name</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[110px] whitespace-nowrap">Extracted Value</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[140px] whitespace-nowrap">Report Ref Range</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[120px] whitespace-nowrap">Signal Status</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[110px] whitespace-nowrap">Verification</th>
                      <th scope="col" className="py-2.5 px-3 min-w-[90px] text-right whitespace-nowrap">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderSubtle">
                    {results.map((res) => {
                      const isSelected = res.id === selectedResultId;
                      const isEditing = res.id === editingResultId;

                      return (
                        <tr
                          key={res.id}
                          tabIndex={0}
                          role="row"
                          aria-selected={isSelected}
                          onClick={() => handleSelectResult(res)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleSelectResult(res);
                            }
                          }}
                          className={`cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-inset focus:outline-none ${
                            isSelected ? 'bg-blue-50/70 font-medium border-l-4 border-l-blue-600' : 'hover:bg-slate-50/80'
                          }`}
                        >
                          <td className="py-2.5 px-3.5 align-middle">
                            <div className="font-semibold text-slate-900 text-[13px]">{res.testName}</div>
                            <div className="mt-0.5">
                              <ProvenanceBadge type="DOCUMENT_EXTRACTED" source={res.source} className="text-[10px] py-0 px-1.5 max-w-[200px] truncate" />
                            </div>
                          </td>

                          <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                            {isEditing ? (
                              <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="text"
                                  aria-label={`Edit ${res.testName} value`}
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="w-16 px-1.5 py-1 border border-blue-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                                <input
                                  type="text"
                                  aria-label={`Edit ${res.testName} unit`}
                                  value={editUnit}
                                  onChange={(e) => setEditUnit(e.target.value)}
                                  className="w-12 px-1.5 py-1 border border-blue-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                              </div>
                            ) : (
                              <div>
                                <span className="font-bold text-slate-900 text-[13px]">{res.value}</span>{' '}
                                <span className="text-slate-500 font-mono text-xs">{res.unit}</span>
                                {res.originalAIValue && res.originalAIValue !== res.value && (
                                  <div className="text-[10px] text-slate-400 line-through">AI: {res.originalAIValue}</div>
                                )}
                              </div>
                            )}
                          </td>

                          <td className="py-2.5 px-3 align-middle whitespace-nowrap font-mono text-slate-700 text-xs font-medium">
                            {res.referenceRange ? (
                              <span>{res.referenceRange}</span>
                            ) : (
                              <span className="text-slate-400 italic font-sans text-[11px]">Not Provided</span>
                            )}
                          </td>

                          <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                            <StatusBadge status={res.status} />
                          </td>

                          <td className="py-2.5 px-3 align-middle whitespace-nowrap">
                            <VerificationBadge status={res.verificationStatus} />
                          </td>

                          <td className="py-2.5 px-3 align-middle text-right whitespace-nowrap">
                            {isEditing ? (
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  disabled={isSubmitting}
                                  onClick={(e) => { e.stopPropagation(); handleSaveEdit(res.id); }}
                                  className="p-1 text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded transition-colors focus-visible:ring-2 focus-visible:ring-emerald-600 focus:outline-none"
                                  title="Save Correction"
                                  aria-label={`Save correction for ${res.testName}`}
                                >
                                  <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setEditingResultId(null); }}
                                  className="p-1 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded transition-colors focus-visible:ring-2 focus-visible:ring-slate-400 focus:outline-none"
                                  title="Cancel"
                                  aria-label="Cancel editing"
                                >
                                  <X className="w-3.5 h-3.5" aria-hidden="true" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center justify-end space-x-1">
                                {res.verificationStatus === 'PENDING' && onVerifyResult && (
                                  <button
                                    disabled={isSubmitting}
                                    onClick={(e) => { e.stopPropagation(); handleVerify(res.id); }}
                                    className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold transition-colors shadow-2xs focus-visible:ring-2 focus-visible:ring-emerald-600 focus:outline-none"
                                    aria-label={`Verify ${res.testName} result`}
                                  >
                                    Verify
                                  </button>
                                )}
                                {onVerifyResult && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleStartEdit(res); }}
                                    className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none"
                                    title="Edit Value"
                                    aria-label={`Edit ${res.testName} value`}
                                  >
                                    <Edit2 className="w-3.5 h-3.5" aria-hidden="true" />
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
