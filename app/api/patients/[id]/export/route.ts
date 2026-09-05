import { NextRequest, NextResponse } from 'next/server';
import { getPatientById, getLabResultsByPatientId, getReportsByPatientId, getSignalsByPatientId } from '@/lib/db/store';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const patientId = params.id;
    const patient = await getPatientById(patientId);

    if (!patient) {
      return NextResponse.json({ success: false, error: 'Patient workspace not found' }, { status: 404 });
    }

    const labResults = await getLabResultsByPatientId(patient.id);
    const reports = await getReportsByPatientId(patient.id);
    const signals = await getSignalsByPatientId(patient.id);

    const verifiedCount = labResults.filter(r => r.verificationStatus === 'VERIFIED' || r.verificationStatus === 'CORRECTED').length;
    const pendingCount = labResults.filter(r => r.verificationStatus === 'PENDING').length;

    // Generate Printable HTML Summary Document
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MedLens Patient Clinical Summary - ${patient.name} (${patient.patientCode})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.5; }
    .header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .title { font-size: 24px; font-weight: bold; color: #0f172a; }
    .subtitle { font-size: 13px; color: #64748b; margin-top: 4px; }
    .badge { background: #eff6ff; color: #1d4ed8; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-family: monospace; font-weight: bold; border: 1px solid #bfdbfe; }
    .disclaimer { background: #fffbeb; border: 1px solid #fde68a; color: #92400e; padding: 12px 16px; border-radius: 8px; font-size: 12px; margin-bottom: 24px; font-weight: 500; }
    .section-title { font-size: 16px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 24px; margin-bottom: 12px; }
    .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
    .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 13px; }
    .card-label { text-transform: uppercase; font-size: 10px; font-weight: bold; color: #94a3b8; }
    .card-value { font-size: 14px; font-weight: bold; color: #0f172a; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 12px; }
    th { background: #f1f5f9; text-align: left; padding: 8px 12px; font-weight: bold; color: #475569; border: 1px solid #cbd5e1; uppercase; }
    td { padding: 8px 12px; border: 1px solid #e2e8f0; }
    tr:nth-child(even) { background: #f8fafc; }
    .verified { color: #15803d; font-weight: bold; }
    .pending { color: #b45309; font-weight: bold; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; pt: 16px; font-size: 11px; color: #94a3b8; text-align: center; }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div className="no-print" style="margin-bottom: 20px; text-align: right;">
    <button onclick="window.print()" style="background: #2563eb; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: bold; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <div>
      <div class="title">MedLens Clinical Patient Summary</div>
      <div class="subtitle">Structured Information & Provenance Audit Report</div>
    </div>
    <div>
      <span class="badge">${patient.patientCode}</span>
    </div>
  </div>

  <div class="disclaimer">
    ⚠️ <strong>RESPONSIBLE AI NOTICE:</strong> This document organizes information available in the patient record and preserves report source provenance. It is NOT a diagnostic or treatment recommendation.
  </div>

  <div class="section-title">Patient Overview</div>
  <div class="grid">
    <div class="card">
      <div class="card-label">Patient Name</div>
      <div class="card-value">${patient.name}</div>
    </div>
    <div class="card">
      <div class="card-label">Demographics</div>
      <div class="card-value">${patient.age} years • ${patient.sex}</div>
    </div>
    <div class="card">
      <div class="card-label">Report Count</div>
      <div class="card-value">${reports.length} PDF Document(s) Ingested</div>
    </div>
    <div class="card">
      <div class="card-label">Verification Governance</div>
      <div class="card-value">${verifiedCount} Verified / ${pendingCount} Pending</div>
    </div>
  </div>

  <div class="section-title">Categorized Laboratory Results & Provenance</div>
  <table>
    <thead>
      <tr>
        <th>Category</th>
        <th>Test Name</th>
        <th>Result Value</th>
        <th>Reference Range</th>
        <th>Source Document</th>
        <th>Verification</th>
      </tr>
    </thead>
    <tbody>
      ${labResults.map(r => `
        <tr>
          <td>${r.category}</td>
          <td><strong>${r.testName}</strong></td>
          <td><strong>${r.value}</strong> ${r.unit}</td>
          <td>${r.referenceRange || '<em>UNAVAILABLE</em>'}</td>
          <td><code>${r.source.fileName} (p.${r.source.pageNumber})</code></td>
          <td>
            <span class="${r.verificationStatus === 'VERIFIED' || r.verificationStatus === 'CORRECTED' ? 'verified' : 'pending'}">
              ${r.verificationStatus}
            </span>
          </td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="section-title">Clinical Information Signals Summary</div>
  <ul>
    ${signals.map(s => `
      <li style="margin-bottom: 8px; font-size: 12px;">
        <strong>[${s.severity.toUpperCase()}] ${s.title}:</strong> ${s.description}
        <br><span style="color: #64748b; font-size: 11px;">Source: ${s.sourceDocument || 'Uploaded PDF Report'}</span>
      </li>
    `).join('')}
  </ul>

  <div class="footer">
    MedLens Platform • AES-256 Encrypted • Source Grounded • Generated ${new Date().toLocaleString()}
  </div>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8'
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate summary export' }, { status: 500 });
  }
}
