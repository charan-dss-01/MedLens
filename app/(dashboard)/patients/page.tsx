'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Patient } from '@/lib/types';
import { Users, Plus, ArrowRight, ShieldCheck, Search, Filter } from 'lucide-react';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: 'Female',
    symptoms: '',
    existingConditions: '',
    allergies: '',
    currentMedications: '',
    medicalHistory: ''
  });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await fetch('/api/patients');
      const json = await res.json();
      if (json.success) {
        setPatients(json.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    if (!formData.name.trim()) {
      setFormError('Patient name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.age || Number(formData.age) < 0 || Number(formData.age) > 130) {
      setFormError('Valid age is required (0-130)');
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          age: Number(formData.age)
        })
      });

      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        setFormData({
          name: '',
          age: '',
          sex: 'Female',
          symptoms: '',
          existingConditions: '',
          allergies: '',
          currentMedications: '',
          medicalHistory: ''
        });
        fetchPatients();
      } else {
        setFormError(json.error || 'Failed to create patient record');
      }
    } catch {
      setFormError('Network error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.patientCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-borderSubtle">
        <div>
          <h1 className="text-xl font-bold text-primaryText tracking-tight">Patient Information Directory</h1>
          <p className="text-xs text-secondaryText mt-0.5">
            Secure, encrypted patient records with provenance tracking.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-medical-600 hover:bg-medical-700 text-white font-semibold text-xs px-4 py-2 rounded-md shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Patient Intake</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center space-x-3 bg-surface p-3 border border-borderSubtle rounded-lg shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search patients by name or patient code (e.g. MED-8921)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 border border-borderSubtle rounded-md text-xs focus:outline-none focus:border-medical-600"
          />
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="bg-surface border border-borderSubtle rounded-lg shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs text-secondaryText">Loading patient records...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-xs text-secondaryText">No patient records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-borderSubtle bg-slate-50 text-secondaryText font-semibold">
                  <th className="py-3 px-4">Patient Code</th>
                  <th className="py-3 px-4">Name (AES-256 Protected)</th>
                  <th className="py-3 px-4">Age / Sex</th>
                  <th className="py-3 px-4">Existing Conditions</th>
                  <th className="py-3 px-4">Allergies</th>
                  <th className="py-3 px-4 text-right">Workspace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-borderSubtle">
                {filteredPatients.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-medical-700">
                      {p.patientCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-primaryText">{p.name}</div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Encrypted Field</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-secondaryText font-medium">
                      {p.age} yrs · {p.sex}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.existingConditions.map((c, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px] font-medium border border-slate-200">
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1">
                        {p.allergies.map((a, i) => (
                          <span key={i} className="px-2 py-0.5 bg-rose-50 text-rose-800 rounded text-[11px] font-semibold border border-rose-200">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/patients/${p.id}`}
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-medical-600 hover:text-medical-700 bg-medical-50 border border-medical-100 px-3 py-1.5 rounded transition-colors"
                      >
                        <span>Open Record</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Patient Intake Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface border border-borderSubtle rounded-lg max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-borderSubtle mb-4">
              <div>
                <h3 className="font-bold text-base text-primaryText">New Patient Information Intake</h3>
                <p className="text-xs text-secondaryText">Strictly validated clinical intake entry</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-md mb-4 font-medium">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 45"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sex *</label>
                <select
                  value={formData.sex}
                  onChange={(e) => setFormData({ ...formData, sex: e.target.value })}
                  className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                >
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Symptoms</label>
                <textarea
                  rows={2}
                  placeholder="Describe patient reported symptoms..."
                  value={formData.symptoms}
                  onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                  className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Known Allergies (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Current Medications (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Levothyroxine 50mcg"
                    value={formData.currentMedications}
                    onChange={(e) => setFormData({ ...formData, currentMedications: e.target.value })}
                    className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Existing Conditions (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Hypothyroidism, Hypertension"
                  value={formData.existingConditions}
                  onChange={(e) => setFormData({ ...formData, existingConditions: e.target.value })}
                  className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Relevant Medical History</label>
                <textarea
                  rows={2}
                  placeholder="Prior surgeries, family history, etc."
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  className="w-full px-3 py-2 border border-borderSubtle rounded-md focus:outline-none focus:border-medical-600"
                />
              </div>

              <div className="pt-3 border-t border-borderSubtle flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-borderSubtle text-slate-600 hover:bg-slate-50 font-semibold rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-medical-600 hover:bg-medical-700 text-white font-semibold rounded-md shadow-xs transition-colors"
                >
                  {isSubmitting ? 'Encrypted Saving...' : 'Create Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
