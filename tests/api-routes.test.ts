import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getPatients, POST as createPatient } from '@/app/api/patients/route';
import { GET as getPatientById, DELETE as deletePatient } from '@/app/api/patients/[id]/route';
import { GET as exportPatientReport } from '@/app/api/patients/[id]/export/route';
import { GET as seedDatabase } from '@/app/api/seed/route';

describe('Next.js API Route Handlers Integration Tests', () => {
  let createdPatientId: string;

  it('POST /api/patients - successfully creates a new patient record with input sanitization', async () => {
    const payload = {
      name: '<script>alert("XSS")</script>Test Patient',
      age: 45,
      sex: 'Male',
      symptoms: 'Chest pain & fatigue',
      existingConditions: ['Hypertension'],
      allergies: ['Penicillin'],
      currentMedications: ['Lisinopril 10mg'],
      medicalHistory: 'No prior surgeries'
    };

    const req = new NextRequest('http://localhost:3000/api/patients', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });

    const res = await createPatient(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data).toBeDefined();
    expect(json.data.name).not.toContain('<script>');
    createdPatientId = json.data.id;
  });

  it('POST /api/patients - rejects invalid payload schema with HTTP 400', async () => {
    const invalidPayload = {
      name: 'A', // Too short
      age: -5, // Invalid age
      sex: 'Unknown' // Invalid enum
    };

    const req = new NextRequest('http://localhost:3000/api/patients', {
      method: 'POST',
      body: JSON.stringify(invalidPayload),
      headers: { 'Content-Type': 'application/json' }
    });

    const res = await createPatient(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.success).toBe(false);
    expect(json.error).toBe('Validation failed');
  });

  it('GET /api/patients - fetches patient list for authenticated user', async () => {
    const req = new NextRequest('http://localhost:3000/api/patients', {
      method: 'GET'
    });

    const res = await getPatients(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(Array.isArray(json.data)).toBe(true);
  });

  it('GET /api/patients/[id] - fetches patient workspace detail and associated lab results', async () => {
    const req = new NextRequest(`http://localhost:3000/api/patients/${createdPatientId}`, {
      method: 'GET'
    });

    const res = await getPatientById(req, { params: { id: createdPatientId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.data.patient.id).toBe(createdPatientId);
    expect(Array.isArray(json.data.labResults)).toBe(true);
    expect(Array.isArray(json.data.reports)).toBe(true);
  });

  it('GET /api/patients/[id] - returns HTTP 404 for non-existent patient ID', async () => {
    const req = new NextRequest('http://localhost:3000/api/patients/non-existent-id-999', {
      method: 'GET'
    });

    const res = await getPatientById(req, { params: { id: 'non-existent-id-999' } });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json.success).toBe(false);
  });

  it('GET /api/patients/[id]/export - exports sanitized HTML patient summary report', async () => {
    const req = new NextRequest(`http://localhost:3000/api/patients/${createdPatientId}/export`, {
      method: 'GET'
    });

    const res = await exportPatientReport(req, { params: { id: createdPatientId } });
    const htmlText = await res.text();

    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toContain('text/html');
    expect(htmlText).toContain('MedLens Clinical Patient Summary');
    expect(htmlText).not.toContain('<script>');
  });

  it('GET /api/seed - forbids non-admin users with HTTP 403 Forbidden', async () => {
    const req = new NextRequest('http://localhost:3000/api/seed', {
      method: 'GET'
    });

    const res = await seedDatabase(req);
    const json = await res.json();

    expect(res.status).toBe(403);
    expect(json.success).toBe(false);
    expect(json.error).toContain('Forbidden');
  });

  it('DELETE /api/patients/[id] - deletes patient record', async () => {
    const req = new NextRequest(`http://localhost:3000/api/patients/${createdPatientId}`, {
      method: 'DELETE'
    });

    const res = await deletePatient(req, { params: { id: createdPatientId } });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
  });
});
