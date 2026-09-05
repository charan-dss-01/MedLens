'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, Lock, LogOut, CheckCircle2 } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.user) {
          setUser(data.data.user);
        } else {
          setUser({ name: 'Dr. Sarah Miller', email: 'dr.miller@medlens.org', role: 'Clinician' });
        }
      })
      .catch(() => {
        setUser({ name: 'Dr. Sarah Miller', email: 'dr.miller@medlens.org', role: 'Clinician' });
      });
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-2xs font-sans antialiased text-slate-800">
      <div className="flex items-center space-x-3">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-2xs">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none block">MedLens</span>
            <span className="text-[10px] font-mono font-medium text-slate-400">Clinical Intelligence v1.0</span>
          </div>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        {/* Trust Badges in Header */}
        <div className="hidden md:flex items-center space-x-2.5 text-xs border-r border-slate-200 pr-4">
          <span className="flex items-center space-x-1.5 font-medium bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
            <Lock className="w-3.5 h-3.5 text-blue-600" />
            <span>AES-256 Encrypted</span>
          </span>
          <span className="flex items-center space-x-1.5 font-medium bg-slate-50 text-slate-700 px-2.5 py-1 rounded border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Source Grounded</span>
          </span>
        </div>

        {/* User Profile Badge & Logout */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-bold text-xs">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'MD'}
            </div>
            <div className="hidden sm:block text-left text-xs">
              <p className="font-semibold text-slate-900 leading-none">{user?.name || 'Dr. Sarah Miller'}</p>
              <p className="text-slate-500 text-[10px] leading-tight mt-0.5">{user?.role || 'Clinician'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out of MedLens"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
