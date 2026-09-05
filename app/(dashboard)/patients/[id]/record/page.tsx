'use client';

import React, { useState, useEffect } from 'react';
import PatientSubNav from '@/components/PatientSubNav';
import SideBySideView from '@/components/SideBySideView';
import { LabResult, MedicalReport, Patient } from '@/lib/types';
import { Search, Filter, ShieldCheck, RefreshCw, Download } from 'lucide-react';

export default function StructuredRecordPage({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/patients/${params.id}`);
      const json = await res.json();
      if (json.success) {
        setPatient(json.data.patient);
        setReports(json.data.reports);
        setLabResults(json.data.labResults);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handleVerifyResult = async (
    resultId: string, 
    action: 'VERIFY' | 'EDIT' | 'REJECT', 
    newValue?: string, 
    newUnit?: string
  ) => {
    // Optimistic UI state update
    const statusMap = {
      'VERIFY': 'VERIFIED' as const,
      'EDIT': 'CORRECTED' as const,
      'REJECT': 'REJECTED' as const,
    };
    
    setLabResults(prev => prev.map(item => {
      if (item.id === resultId) {
        return {
          ...item,
          verificationStatus: statusMap[action],
          value: newValue !== undefined ? newValue : item.value,
          unit: newUnit !== undefined ? newUnit : item.unit,
          verifiedBy: 'Dr. Clinician Reviewer',
          verifiedAt: new Date().toISOString()
        };
      }
      return item;
    }));

    try {
      await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resultId, action, newValue, newUnit })
      });
      fetchData();
    } catch (err) {
      console.error('Verification error:', err);
    }
  };

  const filteredResults = labResults.filter((r) => {
    const matchesSearch = r.testName.toLowerCase().includes(searchQuery.toLowerCase()) || r.value.includes(searchQuery);
    if (!matchesSearch) return false;

    if (filterStatus === 'VERIFIED') return r.verificationStatus === 'VERIFIED';
    if (filterStatus === 'PENDING') return r.verificationStatus === 'PENDING';
    if (filterStatus === 'FLAGS') return r.status === 'ABOVE_PROVIDED_RANGE' || r.status === 'BELOW_PROVIDED_RANGE';
    return true;
  });

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-secondaryText flex items-center justify-center space-x-2">
        <RefreshCw className="w-4 h-4 animate-spin text-medical-600" />
        <span>Loading structured medical records...</span>
      </div>
    );
  }

  return (
    <div>
      <PatientSubNav 
        patientId={params.id} 
        patientName={patient?.name || 'Patient Workspace'} 
        patientCode={patient?.patientCode || 'MED-0000'} 
      />

      <div className="space-y-4">
        {/* Filter & Provenance Header Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3.5 border border-borderSubtle rounded-lg shadow-xs">
          <div className="flex items-center space-x-2 flex-1">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search extracted tests (e.g. Hemoglobin, WBC, Ferritin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full max-w-sm px-3 py-1.5 border border-borderSubtle rounded-md text-xs focus:outline-none focus:border-medical-600"
            />
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto text-xs">
            <span className="text-secondaryText font-medium mr-1 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter:</span>
            </span>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-semibold text-xs transition-colors flex items-center space-x-1.5 shadow-xs focus-visible:ring-2 focus-visible:ring-slate-900 focus:outline-none"
              aria-label="Export structured medical record as PDF"
            >
              <Download className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus:outline-none ${
                filterStatus === 'ALL' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All ({labResults.length})
            </button>
            <button
              onClick={() => setFilterStatus('PENDING')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterStatus === 'PENDING' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Pending ({labResults.filter(r => r.verificationStatus === 'PENDING').length})
            </button>
            <button
              onClick={() => setFilterStatus('VERIFIED')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterStatus === 'VERIFIED' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Verified ({labResults.filter(r => r.verificationStatus === 'VERIFIED').length})
            </button>
            <button
              onClick={() => setFilterStatus('FLAGS')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterStatus === 'FLAGS' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Outside Range ({labResults.filter(r => r.status === 'ABOVE_PROVIDED_RANGE' || r.status === 'BELOW_PROVIDED_RANGE').length})
            </button>
          </div>
        </div>

        {/* Side-by-Side Provenance & Verification View */}
        <SideBySideView 
          reports={reports} 
          labResults={filteredResults} 
          onVerifyResult={handleVerifyResult} 
        />
      </div>
    </div>
  );
}
