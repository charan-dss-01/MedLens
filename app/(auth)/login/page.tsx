'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldCheck, Activity, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get('from') || '/dashboard';

  const [email, setEmail] = useState('dr.miller@medlens.org');
  const [password, setPassword] = useState('MedLens2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid login credentials');
        setLoading(false);
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError('An error occurred connecting to the authentication service.');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-sm rounded-xl border border-slate-200/80 sm:px-8">
      {/* Quick Demo Credentials Info Badge */}
      <div className="mb-6 bg-blue-50/70 border border-blue-100 rounded-lg p-3 text-xs text-blue-900 flex items-start space-x-2.5">
        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-900 block">Competition Demo Account</span>
          <span className="text-blue-700">Email: <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded text-blue-900">dr.miller@medlens.org</code></span>
          <span className="text-blue-700 ml-2">Pass: <code className="font-mono bg-blue-100/80 px-1 py-0.5 rounded text-blue-900">MedLens2026!</code></span>
        </div>
      </div>

      {error && (
        <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Work Email Address
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Mail className="h-4 h-4" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@hospital.org"
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Password
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="h-4 h-4" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Authenticating...' : (
              <span className="flex items-center space-x-1.5">
                <span>Sign In to MedLens</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center">
        <p className="text-xs text-slate-600">
          Don&apos;t have a clinician account?{' '}
          <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans antialiased text-slate-800">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center space-x-2.5">
          <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">MedLens</span>
        </div>
        <h2 className="mt-4 text-center text-xl font-semibold text-slate-900 tracking-tight">
          Clinical Information Intelligence
        </h2>
        <p className="mt-1 text-center text-sm text-slate-500">
          Sign in to access patient records and review queues
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="bg-white p-8 rounded-xl text-center text-xs text-slate-400">Loading form...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 text-center text-xs text-slate-400 flex justify-center items-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
          <span>Source-grounded • Human verified • AES-256 Encrypted</span>
        </div>
      </div>
    </div>
  );
}
