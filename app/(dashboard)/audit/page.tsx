import React from 'react';
import { getAuditLogs } from '@/lib/db/store';
import { History, ShieldCheck, Server, UserCheck } from 'lucide-react';

export const revalidate = 0;

export default async function AuditPage() {
  const auditLogs = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-borderSubtle">
        <h1 className="text-xl font-bold text-primaryText tracking-tight">System Audit Trail Log</h1>
        <p className="text-xs text-secondaryText mt-0.5">
          Immutable event log tracking intake, report extractions, human verifications, and security events.
        </p>
      </div>

      <div className="bg-surface border border-borderSubtle rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-borderSubtle bg-slate-50 text-secondaryText font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-borderSubtle">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors font-mono">
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-800">
                    {log.userEmail || 'user@medlens.org'}
                  </td>
                  <td className="py-3 px-4 font-bold text-medical-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-700 font-medium">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
