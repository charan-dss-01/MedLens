'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import PatientSubNav from '@/components/PatientSubNav';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';

export default function ReportUploadPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');
  const [extractedResults, setExtractedResults] = useState<any[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus('IDLE');
      setErrorMessage('');
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadStatus('IDLE');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('patientId', params.id);

    try {
      const res = await fetch('/api/reports/upload', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (json.success) {
        setUploadStatus('SUCCESS');
        setExtractedResults(json.data?.results || []);
      } else {
        setUploadStatus('ERROR');
        setErrorMessage(json.message || json.error || 'Failed to process medical report');
      }
    } catch {
      setUploadStatus('ERROR');
      setErrorMessage('Network connection failure during report processing.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6 font-sans antialiased text-slate-800">
      <PatientSubNav patientId={params.id} patientName="Patient Workspace" patientCode={params.id} />

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Upload Container */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-6 sm:p-8 shadow-2xs">
          
          <div className="flex items-center space-x-3 pb-5 border-b border-slate-100 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shrink-0">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg text-slate-900">Ingest PDF Medical Report</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Files are validated, hashed for SHA-256 deduplication, and extracted via Gemini API schemas.
              </p>
            </div>
          </div>

          {/* Ingestion Pipeline Stepper */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 mb-6">
            <div className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-3">Processing Pipeline</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-mono">
              
              <div className={`p-2 rounded border ${uploadStatus === 'SUCCESS' || isUploading ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">1. Upload</div>
                <div className="text-[9px] text-slate-400">PDF Received</div>
              </div>

              <div className={`p-2 rounded border ${uploadStatus === 'SUCCESS' || isUploading ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">2. SHA-256</div>
                <div className="text-[9px] text-slate-400">Deduplication</div>
              </div>

              <div className={`p-2 rounded border ${uploadStatus === 'SUCCESS' || isUploading ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">3. Parse</div>
                <div className="text-[9px] text-slate-400">Text Extract</div>
              </div>

              <div className={`p-2 rounded border ${uploadStatus === 'SUCCESS' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">4. Gemini</div>
                <div className="text-[9px] text-slate-400">JSON Ingest</div>
              </div>

              <div className={`p-2 rounded border ${uploadStatus === 'SUCCESS' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">5. Zod</div>
                <div className="text-[9px] text-slate-400">Schema Check</div>
              </div>

              <div className={`p-2 rounded border ${uploadStatus === 'SUCCESS' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">6. Safety</div>
                <div className="text-[9px] text-slate-400">Range Protect</div>
              </div>

              <div className={`p-2 rounded border ${uploadStatus === 'SUCCESS' ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-white border-slate-200 text-slate-600'}`}>
                <div className="font-bold">7. Queue</div>
                <div className="text-[9px] text-amber-700">Verification</div>
              </div>

            </div>
          </div>

          {/* Error State */}
          {uploadStatus === 'ERROR' && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start space-x-3 mb-6">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-rose-900">Processing Error</p>
                <p className="mt-1">{errorMessage}</p>
                <p className="mt-2 text-[11px] text-rose-700">
                  Original file preserved. You can safely retry or re-upload another PDF document.
                </p>
              </div>
            </div>
          )}

          {/* Success State with AI Processing Metrics */}
          {uploadStatus === 'SUCCESS' && (
            <div className="p-6 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-4 mb-6">
              <div className="flex items-center space-x-2 font-bold text-base text-emerald-900">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>AI Report Processing Completed Successfully</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-white p-4 rounded-lg border border-emerald-200">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Model Used</span>
                  <span className="font-bold text-slate-900 block mt-0.5">Google Gemini</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Extracted Metrics</span>
                  <span className="font-bold text-emerald-700 block mt-0.5">{extractedResults.length} Lab Metrics</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Schema Validation</span>
                  <span className="font-bold text-emerald-700 block mt-0.5">Passed (Zod)</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Safety Check</span>
                  <span className="font-bold text-emerald-700 block mt-0.5">Passed (No Diagnostic assumptions)</span>
                </div>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  onClick={() => router.push(`/patients/${params.id}/record`)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs shadow-sm transition-colors flex items-center space-x-2"
                >
                  <span>Open Structured Record Viewer</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Upload Drop Zone Form */}
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-8 sm:p-12 text-center bg-slate-50/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                accept=".pdf,.txt,image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-bold text-base text-slate-900">
                  {file ? file.name : 'Select or drag patient medical report (PDF)'}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                  Supported: PDF, Scanned Laboratory Documents • Max 15MB
                </span>
                {file && (
                  <span className="mt-3 text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </label>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>SHA-256 Deduplication & Security Sandbox Active</span>
              </span>

              <button
                type="submit"
                disabled={!file || isUploading}
                className={`px-6 py-2.5 rounded-lg font-semibold text-xs text-white transition-all shadow-xs flex items-center space-x-2 ${
                  !file || isUploading
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing with Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Process Report</span>
                  </>
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
