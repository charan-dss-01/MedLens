import { Patient, LabResult } from '../types';

/**
 * HL7 FHIR R4 Interoperability Converter
 * Transforms MedLens structured patient records and lab results into official HL7 FHIR R4 JSON resources.
 */

export interface FHIRResource {
  resourceType: string;
  id: string;
  meta?: {
    profile?: string[];
    lastUpdated?: string;
  };
}

export interface FHIRPatientResource extends FHIRResource {
  resourceType: 'Patient';
  identifier: Array<{ system: string; value: string; use?: string }>;
  name: Array<{ use?: string; text: string; family?: string; given?: string[] }>;
  gender: string;
  active?: boolean;
  extension?: Array<{ url: string; valueInteger: number }>;
}

export interface FHIRObservationResource extends FHIRResource {
  resourceType: 'Observation';
  status: string;
  code: { coding: Array<{ system: string; code: string; display: string }>; text: string };
  subject: { reference: string; display: string };
  effectiveDateTime: string;
  issued: string;
  valueQuantity?: { value: number; unit: string; system: string; code: string };
  valueString?: string;
  referenceRange?: Array<{ text: string }>;
  category?: Array<{ coding: Array<{ system: string; code: string; display: string }>; text: string }>;
  note?: Array<{ text: string }>;
  extension?: Array<{ url: string; valueString?: string; valueInteger?: number }>;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  id: string;
  type: 'collection';
  timestamp: string;
  total: number;
  entry: Array<{
    fullUrl: string;
    resource: FHIRResource;
  }>;
}

/**
 * Converts a MedLens Patient model to FHIR R4 Patient Resource
 */
export function convertPatientToFHIR(patient: Patient): FHIRPatientResource {
  const nameParts = patient.name.split(' ');
  const familyName = nameParts.length > 1 ? nameParts.pop() : '';
  const givenName = nameParts.join(' ');

  const genderMap: Record<string, 'male' | 'female' | 'other' | 'unknown'> = {
    Male: 'male',
    Female: 'female',
    Other: 'other'
  };

  return {
    resourceType: 'Patient',
    id: patient.id,
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/Patient'],
      lastUpdated: patient.updatedAt || new Date().toISOString()
    },
    identifier: [
      {
        system: 'urn:oid:2.16.840.1.113883.2.4.6.3',
        value: patient.patientCode,
        use: 'official'
      }
    ],
    active: true,
    name: [
      {
        use: 'official',
        text: patient.name,
        family: familyName,
        given: givenName ? [givenName] : [patient.name]
      }
    ],
    gender: genderMap[patient.sex] || 'unknown',
    extension: [
      {
        url: 'http://hl7.org/fhir/StructureDefinition/patient-age',
        valueInteger: patient.age
      }
    ]
  };
}

/**
 * Converts a MedLens LabResult model to FHIR R4 Observation Resource
 */
export function convertLabResultToFHIRObservation(result: LabResult, patientCode: string): FHIRObservationResource {
  const isNumeric = result.numericValue !== undefined && !isNaN(result.numericValue);

  const observation: FHIRObservationResource = {
    resourceType: 'Observation',
    id: result.id,
    meta: {
      profile: ['http://hl7.org/fhir/StructureDefinition/Observation'],
      lastUpdated: result.createdAt
    },
    status: 'final',
    category: [
      {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/observation-category',
            code: 'laboratory',
            display: 'Laboratory'
          }
        ],
        text: result.category || 'Laboratory'
      }
    ],
    code: {
      coding: [
        {
          system: 'http://loinc.org',
          code: '2951-2', // Generic laboratory test LOINC code
          display: result.testName
        }
      ],
      text: result.testName
    },
    subject: {
      reference: `Patient/${result.patientId}`,
      display: patientCode
    },
    effectiveDateTime: result.createdAt,
    issued: result.createdAt,
    note: [
      {
        text: result.observation || `SourceSnippet: ${result.source.textSnippet} (File: ${result.source.fileName}, p.${result.source.pageNumber})`
      }
    ]
  };

  if (isNumeric) {
    observation.valueQuantity = {
      value: result.numericValue!,
      unit: result.unit,
      system: 'http://unitsofmeasure.org',
      code: result.unit
    };
  } else {
    observation.valueString = result.value;
  }

  if (result.referenceRange) {
    observation.referenceRange = [
      {
        text: result.referenceRange
      }
    ];
  }

  // Verification provenance extension
  observation.extension = [
    {
      url: 'http://medlens.org/fhir/StructureDefinition/verification-status',
      valueString: result.verificationStatus
    },
    {
      url: 'http://medlens.org/fhir/StructureDefinition/confidence-score',
      valueInteger: result.confidence
    }
  ];

  return observation;
}

/**
 * Exports complete Patient & Lab Results as an HL7 FHIR R4 Bundle
 */
export function generateFHIRBundle(patient: Patient, labResults: LabResult[]): FHIRBundle {
  const fhirPatient = convertPatientToFHIR(patient);
  const fhirObservations = labResults.map(res => convertLabResultToFHIRObservation(res, patient.patientCode));

  const entries = [
    {
      fullUrl: `urn:uuid:${patient.id}`,
      resource: fhirPatient
    },
    ...fhirObservations.map(obs => ({
      fullUrl: `urn:uuid:${obs.id}`,
      resource: obs
    }))
  ];

  return {
    resourceType: 'Bundle',
    id: `bundle-${patient.id}-${Date.now()}`,
    type: 'collection',
    timestamp: new Date().toISOString(),
    total: entries.length,
    entry: entries
  };
}
