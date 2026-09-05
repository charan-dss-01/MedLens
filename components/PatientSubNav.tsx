'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  User, 
  Upload, 
  Table, 
  AlertTriangle, 
  Clock, 
  GitCompare, 
  Sparkles 
} from 'lucide-react';

interface PatientSubNavProps {
  patientId: string;
  patientName: string;
  patientCode: string;
}

export default function PatientSubNav({ patientId, patientName, patientCode }: PatientSubNavProps) {
  const pathname = usePathname();

  const tabs = [
    { name: 'Patient Overview', href: `/patients/${patientId}`, icon: User },
    { name: 'Upload Report', href: `/patients/${patientId}/upload`, icon: Upload },
    { name: 'Structured Record', href: `/patients/${patientId}/record`, icon: Table },
    { name: 'Clinical Signals', href: `/patients/${patientId}/signals`, icon: AlertTriangle },
    { name: 'Timeline', href: `/patients/${patientId}/timeline`, icon: Clock },
    { name: 'Compare Reports', href: `/patients/${patientId}/compare`, icon: GitCompare },
    { name: 'Ask MedLens', href: `/patients/${patientId}/ask`, icon: Sparkles },
  ];

  return (
    <div className="bg-surface border-b border-borderSubtle px-6 pt-4 pb-0 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl font-bold text-primaryText tracking-tight">{patientName}</h1>
            <span className="bg-slate-100 text-slate-700 font-mono text-xs px-2 py-0.5 rounded border border-borderSubtle font-semibold">
              {patientCode}
            </span>
          </div>
          <p className="text-xs text-secondaryText mt-0.5">Patient Information & Intelligence Workspace</p>
        </div>

        <Link
          href={`/patients/${patientId}/upload`}
          className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus:outline-none"
          aria-label="Upload new medical report PDF"
        >
          <Upload className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Upload Medical Report</span>
        </Link>
      </div>

      <nav className="flex space-x-6 overflow-x-auto border-b border-transparent" role="tablist" aria-label="Patient workspace sub-navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.name}
              href={tab.href}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              className={`flex items-center space-x-2 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus:outline-none ${
                isActive
                  ? 'border-blue-600 text-blue-600 font-bold'
                  : 'border-transparent text-secondaryText hover:text-primaryText hover:border-slate-300'
              }`}
            >
              <Icon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{tab.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
