'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckSquare, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Edit3, 
  Search, 
  FileText, 
  User, 
  RefreshCw,
  Info
} from 'lucide-react';
import ProvenanceBadge from '@/components/ProvenanceBadge';
import { StatusBadge } from '@/components/StatusBadge';

interface LabResultItem {
  id: string;
  patientId: string;
  reportId: string;
  category: string;
  testName: string;
  value: string;
  numericValue?: number;
  unit: string;
  referenceRange: string | null;
  status: 'WITHIN_PROVIDED_RANGE' | 'ABOVE_PROVIDED_RANGE' | 'BELOW_PROVIDED_RANGE' | 'REFERENCE_RANGE_UNAVAILABLE';
  observation: string;
  source: {
    fileName: string;
    pageNumber: number;
    textSnippet: string;
  };
  confidence: number;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'CORRECTED' | 'REJECTED';
  originalAIValue?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  patientName: string;
  patientCode: string;
  patientAge: number;
  patientSex: string;
}

export default function VerificationPage() {
  const [results, setResults] = useState<LabResultItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'ALL' | 'PENDING' | 'VERIFIED' | 'CORRECTED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState<LabResultItem | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editUnit, setEditUnit] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/verification');
      const data = await res.json();
      if (data.success && data.data?.results) {
        setResults(data.data.results);
      }
    } catch {
      console.error('Failed to load verification queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (resultId: string, action: 'VERIFY' | 'EDIT' | 'REJECT', newValue?: string, newUnit?: string) => {
    setActionLoading(resultId);
    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resultId,
          action,
          ...(newValue !== undefined ? { newValue } : {}),
          ...(newUnit !== undefined ? { newUnit } : {})
        })
      });

      const data = await res.json();
      if (data.success) {
        setResults(prev => prev.map(item => item.id === resultId ? { ...item, ...data.data } : item));
        setEditingItem(null);
      }
    } catch {
      alert('Failed to update verification status.');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredResults = results.filter(item => {
    const matchesTab = 
      filterTab === 'ALL' ? true :
      filterTab === 'PENDING' ? item.verificationStatus === 'PENDING' :
      filterTab === 'VERIFIED' ? item.verificationStatus === 'VERIFIED' :
      filterTab === 'CORRECTED' ? item.verificationStatus === 'CORRECTED' :
      item.verificationStatus === 'REJECTED';

    const matchesSearch = 
      item.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.patientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.fileName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const pendingCount = results.filter(r => r.verificationStatus === 'PENDING').length;
  const verifiedCount = results.filter(r => r.verificationStatus === 'VERIFIED').length;
  const correctedCount = results.filter(r => r.verificationStatus === 'CORRECTED').length;
  const rejectedCount = results.filter(r => r.verificationStatus === 'REJECTED').length;

  return (
    <div className="space-y-6 font-sans antialiased text-slate-800">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-2xs">
        <div>
          <div className="flex items-center space-x-2 text-xs uppercase font-bold text-blue-600 tracking-wider">
            <CheckSquare className="w-4 h-4" />
            <span>Human-in-the-Loop Governance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">Central Verification Queue</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Review, verify, correct, or reject AI-extracted laboratory measurements with full audit provenance.
          </p>
        </div>

        <button
          onClick={fetchQueue}
          disabled={loading}
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200/80 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          <button
            onClick={() => setFilterTab('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              filterTab === 'PENDING' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>Pending Review</span>
            <span className="bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded-full font-mono text-[10px]">{pendingCount}</span>
          </button>

          <button
            onClick={() => setFilterTab('VERIFIED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              filterTab === 'VERIFIED' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>Verified</span>
            <span className="bg-emerald-200/80 text-emerald-950 px-1.5 py-0.2 rounded-full font-mono text-[10px]">{verifiedCount}</span>
          </button>

          <button
            onClick={() => setFilterTab('CORRECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              filterTab === 'CORRECTED' ? 'bg-blue-100 text-blue-900 border border-blue-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>Corrected</span>
            <span className="bg-blue-200/80 text-blue-950 px-1.5 py-0.2 rounded-full font-mono text-[10px]">{correctedCount}</span>
          </button>

          <button
            onClick={() => setFilterTab('REJECTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
              filterTab === 'REJECTED' ? 'bg-rose-100 text-rose-900 border border-rose-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>Rejected</span>
            <span className="bg-rose-200/80 text-rose-950 px-1.5 py-0.2 rounded-full font-mono text-[10px]">{rejectedCount}</span>
          </button>

          <button
            onClick={() => setFilterTab('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterTab === 'ALL' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>All Items ({results.length})</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search test, patient, document..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 placeholder-slate-400 bg-white"
          />
        </div>
      </div>

      {/* Verification Queue Items List */}
      {loading ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200/80 text-slate-500">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-sm font-medium">Loading verification queue from MongoDB...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200/80 text-slate-500">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Items Match Current Filter</h3>
          <p className="text-xs text-slate-500 mt-1">All extracted measurements for this selection have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map(item => (
            <div 
              key={item.id}
              className={`bg-white rounded-xl border p-5 shadow-2xs transition-all ${
                item.verificationStatus === 'PENDING' ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300' :
                item.verificationStatus === 'VERIFIED' ? 'border-emerald-200 hover:border-emerald-300' :
                item.verificationStatus === 'CORRECTED' ? 'border-blue-200 hover:border-blue-300' :
                'border-rose-200 bg-rose-50/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                
                {/* Left: Patient Info & Category */}
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0 mt-0.5">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <Link 
                        href={`/patients/${item.patientId}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center space-x-1.5"
                      >
                        <span>{item.patientName}</span>
                        <span className="text-xs font-mono font-semibold bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">{item.patientCode}</span>
                      </Link>
                      <span className="text-xs text-slate-400">• {item.patientAge}y {item.patientSex}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{item.category}</span>
                  </div>
                </div>

                {/* Right: Status Badges & Provenance */}
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.status} />
                  <ProvenanceBadge type="DOCUMENT_EXTRACTED" source={item.source} />
                  
                  {item.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Verified
                    </span>
                  )}
                  {item.verificationStatus === 'CORRECTED' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                      <Edit3 className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      Corrected by Clinician
                    </span>
                  )}
                  {item.verificationStatus === 'REJECTED' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                      <XCircle className="w-3.5 h-3.5 mr-1 text-rose-600" />
                      Rejected
                    </span>
                  )}
                  {item.verificationStatus === 'PENDING' && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      Pending Clinician Review
                    </span>
                  )}
                </div>
              </div>

              {/* Metric Details Body */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                
                {/* Measurement Display */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Test Name</div>
                  <div className="text-base font-bold text-slate-900 mt-0.5">{item.testName}</div>
                  
                  <div className="flex items-baseline space-x-1.5 mt-2">
                    <span className="text-2xl font-extrabold text-slate-900">{item.value}</span>
                    <span className="text-xs font-semibold text-slate-600">{item.unit}</span>
                  </div>

                  {item.originalAIValue && item.originalAIValue !== item.value && (
                    <div className="mt-2 text-[11px] font-mono text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded">
                      Original AI Extracted: {item.originalAIValue} {item.unit}
                    </div>
                  )}
                </div>

                {/* Reference Range & Observation */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">Reference Range</div>
                  <div className="text-sm font-semibold text-slate-800 mt-0.5">
                    {item.referenceRange ? item.referenceRange : <span className="text-amber-800 italic font-normal">REFERENCE_RANGE_UNAVAILABLE</span>}
                  </div>
                  
                  <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mt-3">Observation</div>
                  <div className="text-xs text-slate-600 mt-0.5 leading-relaxed">{item.observation}</div>
                </div>

                {/* Source Snippet Citation */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200/80 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                      <span>Source Report Citation</span>
                      <span className="font-mono text-blue-700 font-semibold">Page {item.source.pageNumber}</span>
                    </div>
                    <div className="text-xs font-mono text-slate-700 bg-white p-2 rounded border border-slate-200/80 mt-1.5 italic">
                      &quot;{item.source.textSnippet}&quot;
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{item.source.fileName}</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  {item.verifiedBy && (
                    <span>Reviewed by <strong className="text-slate-800">{item.verifiedBy}</strong> on {new Date(item.verifiedAt || '').toLocaleDateString()}</span>
                  )}
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleAction(item.id, 'VERIFY')}
                    disabled={actionLoading === item.id || item.verificationStatus === 'VERIFIED'}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>

                  <button
                    onClick={() => {
                      setEditingItem(item);
                      setEditValue(item.value);
                      setEditUnit(item.unit);
                    }}
                    disabled={actionLoading === item.id}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Correct</span>
                  </button>

                  <button
                    onClick={() => handleAction(item.id, 'REJECT')}
                    disabled={actionLoading === item.id || item.verificationStatus === 'REJECTED'}
                    className="flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center space-x-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Correction Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg border border-slate-200 animate-in fade-in zoom-in duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs font-bold uppercase text-blue-600 tracking-wider">Clinician Correction</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">Correct {editingItem.testName}</h3>
                <p className="text-xs text-slate-500">Patient: {editingItem.patientName} ({editingItem.patientCode})</p>
              </div>
              <button 
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 mb-4 flex items-start space-x-2">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Provenance Preservation</span>
                <span>The original AI-extracted value (<code className="font-mono">{editingItem.value} {editingItem.unit}</code>) will be preserved in the record provenance audit log.</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Corrected Numeric / String Value
                </label>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Measurement Unit
                </label>
                <input
                  type="text"
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAction(editingItem.id, 'EDIT', editValue, editUnit)}
                disabled={actionLoading === editingItem.id}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                Save Correction
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
