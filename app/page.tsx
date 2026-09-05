import React from 'react';
import Link from 'next/link';
import { 
  Activity, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Layers, 
  Search, 
  Clock, 
  Lock, 
  Database, 
  CheckSquare, 
  Cpu, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">MedLens</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 mt-0.5">Clinical Information Intelligence</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#product-preview" className="hover:text-blue-600 transition-colors">Workspace Preview</a>
            <a href="#core-values" className="hover:text-blue-600 transition-colors">Core Capabilities</a>
            <a href="#workflow" className="hover:text-blue-600 transition-colors">Clinical Workflow</a>
            <a href="#trust-security" className="hover:text-blue-600 transition-colors">Trust & Security</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
            >
              <span>Explore Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-28 border-b border-slate-200/60 bg-gradient-to-b from-white to-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Trust Statement Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-semibold mb-8 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Source-grounded • Human verified • Responsible AI</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 leading-[1.12]">
            Turn fragmented medical records into <span className="text-blue-600">trusted clinical insight</span>.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-normal">
            MedLens organizes patient information, extracts structured data from medical lab reports, highlights information signals, and preserves every piece of evidence with traceable source provenance.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2"
            >
              <span>Explore MedLens</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-7 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl shadow-2xs transition-all flex items-center justify-center space-x-2"
            >
              <span>Sign In to Workspace</span>
            </Link>
          </div>

          <div className="mt-12 text-xs text-slate-500 flex items-center justify-center space-x-6">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>AES-256 Encrypted</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero Hallucination Limits</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>MongoDB Enterprise Storage</span>
            </span>
          </div>
        </div>
      </section>

      {/* Product Preview Section */}
      <section id="product-preview" className="py-16 md:py-24 bg-slate-100/60 border-b border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Live Workspace Preview</h2>
            <p className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">Traceable Source Provenance & Human Verification</p>
          </div>

          {/* MedLens Product Preview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-md overflow-hidden">
            {/* Window Header */}
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                <span className="ml-2 text-xs font-mono text-slate-500">medlens.hospital.org/patients/pat-101/record</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 bg-slate-200/60 px-2.5 py-1 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Audited Clinical Workspace</span>
              </div>
            </div>

            {/* Patient Header Box */}
            <div className="p-6 bg-slate-50/50 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-bold text-slate-900">Sarah Jenkins</h3>
                  <span className="px-2.5 py-0.5 rounded text-xs font-mono font-semibold bg-blue-100 text-blue-800">MED-8921</span>
                </div>
                <p className="text-sm text-slate-600 mt-1">42 years • Female • Ref: Hematology Review</p>
              </div>

              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                  Source Verified
                </span>
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
                  1 Attention Signal
                </span>
              </div>
            </div>

            {/* Extracted Metrics Grid */}
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Hemoglobin Metric Card */}
              <div className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs hover:border-slate-300 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Metric</span>
                    <h4 className="text-lg font-bold text-slate-900">Hemoglobin</h4>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Human Verified
                  </span>
                </div>

                <div className="flex items-baseline space-x-2 my-2">
                  <span className="text-3xl font-extrabold text-slate-900">12.4</span>
                  <span className="text-sm font-semibold text-slate-500">g/dL</span>
                </div>

                <p className="text-xs text-slate-500 mb-4">Ref Range: 12.0 – 15.5 g/dL (Within Provided Range)</p>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>CBC_September.pdf · Page 1</span>
                  </span>
                  <span className="text-emerald-700 font-sans font-medium">Dr. Miller • 09:30 AM</span>
                </div>
              </div>

              {/* WBC Count Metric Card */}
              <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Metric</span>
                    <h4 className="text-lg font-bold text-slate-900">WBC Count</h4>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-700" />
                    Above Provided Range
                  </span>
                </div>

                <div className="flex items-baseline space-x-2 my-2">
                  <span className="text-3xl font-extrabold text-amber-900">11.8</span>
                  <span className="text-sm font-semibold text-amber-700">x10³/µL</span>
                </div>

                <p className="text-xs text-amber-800 mb-4">Provided Ref: 4.5 – 11.0 x10³/µL</p>

                <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-600 font-mono">
                  <span className="flex items-center space-x-1">
                    <FileText className="w-3.5 h-3.5 text-amber-700" />
                    <span>CBC_September.pdf · Page 1</span>
                  </span>
                  <span className="text-amber-800 font-sans font-medium">Pending Review</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Core Value Section */}
      <section id="core-values" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Platform Core Values</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">Built for Clinical Integrity & Safety</p>
            <p className="mt-3 text-base text-slate-600">MedLens bridges the gap between raw document PDFs and actionable clinical insights while respecting strict medical safety boundaries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-xl border border-slate-200/90 bg-[#F8FAFC] hover:border-blue-200 hover:bg-white transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Structured Records</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Turns unstructured, scanned PDF lab reports into clean, categorized medical panels (CBC, BMP, Endocrine, Lipid) for instant comparison.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/90 bg-[#F8FAFC] hover:border-blue-200 hover:bg-white transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Search className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Traceable Evidence</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every extracted measurement remains anchored to its original source report filename, text snippet, and page citation for instant auditability.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/90 bg-[#F8FAFC] hover:border-blue-200 hover:bg-white transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Human Verification</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                AI extraction is never final. Clinicians maintain explicit approval control to verify, edit value corrections, or reject extracted results.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/90 bg-[#F8FAFC] hover:border-blue-200 hover:bg-white transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Clinical Signals</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Automatically flags out-of-range metrics, allergy discrepancies between intake forms and document text, and longitudinal drops.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/90 bg-[#F8FAFC] hover:border-blue-200 hover:bg-white transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Responsible AI Guardrails</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Strictly zero diagnostic claims, zero treatment recommendations, and zero invented reference ranges. Preserves missing range status.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200/90 bg-[#F8FAFC] hover:border-blue-200 hover:bg-white transition-all">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Enterprise Storage & Crypto</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                MongoDB persistence with AES-256-GCM sensitive field encryption, SHA-256 document deduplication, and complete immutable audit logs.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-16 md:py-24 bg-[#F8FAFC] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">End-to-End Pipeline</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">How MedLens Processes Medical Records</p>
          </div>

          {/* Workflow Steps Horizontal Desktop / Vertical Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            
            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-blue-200">1</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Upload Report</h4>
              <p className="text-xs text-slate-500">PDF text & SHA-256 deduplication</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-blue-200">2</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Extract Info</h4>
              <p className="text-xs text-slate-500">Gemini structured JSON parser</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-blue-200">3</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Validate</h4>
              <p className="text-xs text-slate-500">Zod schemas & reference check</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-blue-200">4</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Verify</h4>
              <p className="text-xs text-slate-500">Clinician review & correction queue</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center mx-auto mb-3 border border-blue-200">5</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Review Signals</h4>
              <p className="text-xs text-slate-500">Attention, Warning & Info flags</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-blue-200 bg-blue-50/20 text-center relative">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto mb-3">6</div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Understand</h4>
              <p className="text-xs text-slate-500">Traceable longitudinal summary</p>
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Safeguards Section */}
      <section id="trust-security" className="py-16 md:py-24 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Enterprise Security</span>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight mt-2 mb-4">Genuinely Implemented Safeguards</h2>
              <p className="text-slate-600 mb-6 text-sm leading-relaxed">
                MedLens is engineered to hospital security standards with multi-layered data protection, strict authorization, and complete operational transparency.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">AES-256-GCM Sensitive Field Encryption</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Encrypted patient names and clinical notes stored in MongoDB.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Source Provenance Guarantee</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Every extracted data point is tied to the exact source report and text snippet.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Full Human Verification Queue</h4>
                    <p className="text-xs text-slate-500 mt-0.5">No AI output is persisted without review options and clinician audit logging.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Reference-Range Protection</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Missing ranges are never fabricated; explicitly flagged for human oversight.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8FAFC] p-8 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-200/80 pb-3 flex items-center justify-between">
                <span>Trust Center Metrics</span>
                <Lock className="w-4 h-4 text-slate-400" />
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Encryption</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">AES-256-GCM</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Auth Cookie</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">HttpOnly JWT</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Deduplication</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">SHA-256 Hash</div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <div className="text-xs text-slate-400 font-semibold uppercase">Audit Logging</div>
                  <div className="text-lg font-bold text-slate-900 mt-1">100% Immutable</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-white to-blue-50/40 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Bring clarity to clinical information.</h2>
          <p className="mt-3 text-slate-600 max-w-xl mx-auto text-sm">
            Experience structured lab results, explainable signals, and traceable medical records in a hospital-grade interface.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-3.5 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm transition-all flex items-center space-x-2"
            >
              <span>Open MedLens Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <span className="font-bold text-slate-900">MedLens Clinical Information Platform</span>
            <span>© 2026</span>
          </div>

          <p className="text-slate-400 text-center md:text-right">
            MedLens organizes patient information and preserves source provenance. Not a diagnosis or treatment recommendation system.
          </p>
        </div>
      </footer>
    </div>
  );
}
