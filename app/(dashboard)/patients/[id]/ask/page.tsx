'use client';

import React, { useState } from 'react';
import PatientSubNav from '@/components/PatientSubNav';
import { RAGAnswer } from '@/lib/types';
import { Sparkles, Send, FileText, ShieldCheck, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';

export default function AskMedLensPage({ params }: { params: { id: string } }) {
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState<RAGAnswer[]>([]);

  const exampleQuestions = [
    'What changed between my January and September reports?',
    'Show me the recorded Hemoglobin values.',
    'Which laboratory results still require verification?',
    'Where did the Ferritin value originate?'
  ];

  const handleAsk = async (queryToAsk?: string) => {
    const q = queryToAsk || question;
    if (!q.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch('/api/rag/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: params.id, question: q })
      });

      const json = await res.json();
      if (json.success) {
        setAnswers(prev => [json.data, ...prev]);
        setQuestion('');
      }
    } catch (err) {
      console.error('Ask MedLens error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PatientSubNav 
        patientId={params.id} 
        patientName="Sarah Jenkins" 
        patientCode="MED-8921" 
      />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header & Prompt Box */}
        <div className="bg-surface border border-borderSubtle rounded-lg p-6 shadow-xs">
          <div className="flex items-center space-x-3 pb-4 border-b border-borderSubtle mb-5">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-primaryText">Ask MedLens — Source-Grounded RAG</h2>
              <p className="text-xs text-secondaryText">
                Query patient workspace records. Every answer is grounded with mandatory source document citations.
              </p>
            </div>
          </div>

          {/* Quick Question Chips */}
          <div className="mb-4">
            <span className="text-[11px] font-semibold text-secondaryText block mb-2 uppercase tracking-wider">
              Suggested Questions
            </span>
            <div className="flex flex-wrap gap-2">
              {exampleQuestions.map((eq, i) => (
                <button
                  key={i}
                  onClick={() => handleAsk(eq)}
                  className="text-xs bg-slate-100 hover:bg-medical-50 hover:text-medical-700 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 transition-colors font-medium text-left"
                >
                  "{eq}"
                </button>
              ))}
            </div>
          </div>

          {/* Query Form */}
          <form onSubmit={(e) => { e.preventDefault(); handleAsk(); }} className="flex items-center space-x-3">
            <input
              type="text"
              placeholder="Ask a question about this patient's records..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="flex-1 px-4 py-2.5 border border-borderSubtle rounded-md text-xs focus:outline-none focus:border-medical-600 shadow-2xs"
            />
            <button
              type="submit"
              disabled={!question.trim() || loading}
              className="inline-flex items-center space-x-1.5 bg-medical-600 hover:bg-medical-700 disabled:bg-slate-300 text-white font-semibold text-xs px-5 py-2.5 rounded-md shadow-xs transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Retrieving Context...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Ask MedLens</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Answer Feed */}
        <div className="space-y-4">
          {answers.map((ans, idx) => (
            <div key={idx} className="bg-surface border border-borderSubtle rounded-lg p-5 shadow-xs space-y-4">
              <div className="flex items-center space-x-2 text-xs font-bold text-primaryText pb-2 border-b border-borderSubtle">
                <MessageSquare className="w-4 h-4 text-medical-600" />
                <span>Q: {ans.question}</span>
              </div>

              <div className="text-xs text-slate-800 leading-relaxed font-medium bg-slate-50 p-4 rounded-md border border-borderSubtle whitespace-pre-wrap">
                {ans.answer}
              </div>

              {/* Source Citations */}
              <div>
                <span className="text-[11px] font-semibold text-secondaryText block mb-2 uppercase tracking-wider">
                  Verified Record Sources
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ans.sources.map((src, i) => (
                    <div key={i} className="p-2.5 bg-medical-50/60 border border-medical-200 rounded text-xs">
                      <div className="flex items-center space-x-1.5 font-bold text-medical-800">
                        <FileText className="w-3.5 h-3.5 text-medical-600" />
                        <span>{src.fileName} (Page {src.pageNumber})</span>
                      </div>
                      <p className="text-[11px] font-mono text-slate-700 mt-1 italic">"{src.snippet}"</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
