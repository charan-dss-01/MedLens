'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  ShieldCheck, 
  History, 
  FileText,
  Activity,
  AlertTriangle
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [pendingCount, setPendingCount] = useState<number>(0);

  useEffect(() => {
    fetch('/api/verification')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setPendingCount(data.data.pendingCount || 0);
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
    { name: 'Verification Queue', href: '/verification', icon: CheckSquare, badge: pendingCount > 0 ? pendingCount : undefined },
    { name: 'Trust & Safety', href: '/trust', icon: ShieldCheck },
    { name: 'Audit Trail', href: '/audit', icon: History },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col justify-between h-[calc(100vh-4rem)] sticky top-16 z-20 font-sans antialiased text-slate-800">
      <div className="py-4 px-3">
        <div className="px-3 mb-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Clinical Workspace
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href) && !pathname.includes('/patients/'));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span className="bg-amber-100 text-amber-900 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-amber-200">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200/80 bg-slate-50/70">
        <div className="flex items-start space-x-2 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-slate-900 text-xs">Responsible AI Guardrails Active</p>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              No diagnostic claims. All evidence traceable to report text.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
