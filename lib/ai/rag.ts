import { GoogleGenerativeAI } from '@google/generative-ai';
import { getPatientById, getLabResultsByPatientId, getReportsByPatientId, getSignalsByPatientId } from '../db/store';
import { RAGAnswer } from '../types';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function askMedLensRAG(patientId: string, question: string): Promise<RAGAnswer> {
  const patient = await getPatientById(patientId);
  const labResults = await getLabResultsByPatientId(patientId);
  const reports = await getReportsByPatientId(patientId);
  const signals = await getSignalsByPatientId(patientId);

  if (!patient) {
    return {
      question,
      answer: 'Patient record could not be found.',
      sources: [],
      disclaimer: 'MedLens RAG retrieves information strictly from uploaded patient records.'
    };
  }

  // Build Context Sandbox with Full Document Text & Provenance
  const reportsTextSnippet = reports.map(rep => `- File: ${rep.fileName}\n  Extracted Clinical Text: "${rep.extractedText.substring(0, 1500)}"`).join('\n');

  const contextSnippet = `
PATIENT WORKSPACE DATA CONTEXT:
Patient Code: ${patient.patientCode}
Name: ${patient.name}
Age: ${patient.age}, Sex: ${patient.sex}
Intake Symptoms: "${patient.symptoms || 'None reported'}"
Allergies: ${patient.allergies.join(', ') || 'None reported'}
Existing Conditions: ${patient.existingConditions.join(', ') || 'None reported'}
Current Medications: ${patient.currentMedications.join(', ') || 'None reported'}
Medical History: "${patient.medicalHistory || 'None recorded'}"

EXTRACTED LAB RESULTS (PROVENANCE GROUNDED):
${labResults.map((r, i) => `[Item ${i+1}] Test: ${r.testName} | Value: ${r.value} ${r.unit} | Reference Range: ${r.referenceRange || 'Unavailable'} | Status: ${r.status} | Source File: ${r.source.fileName} (Page ${r.source.pageNumber}) | Snippet: "${r.source.textSnippet}"`).join('\n')}

UPLOADED REPORTS & CLINICAL NOTES:
${reportsTextSnippet}

CLINICAL INFORMATION SIGNALS:
${signals.map(s => `- ${s.title}: ${s.description}`).join('\n')}
`;

  const sourcesMap: Array<{ fileName: string; pageNumber: number; snippet: string }> = [];
  const lowerQ = question.toLowerCase();

  // Search reports for text matching question (e.g. fever, headache, fatigue, symptoms)
  reports.forEach(rep => {
    const lines = rep.extractedText.split(/\r?\n/);
    lines.forEach(line => {
      const lowerLine = line.toLowerCase();
      if (
        (lowerQ.includes('fever') && lowerLine.includes('fever')) ||
        (lowerQ.includes('symptom') && (lowerLine.includes('patient') || lowerLine.includes('symptom') || lowerLine.includes('notes'))) ||
        (lowerQ.includes('headache') && lowerLine.includes('headache')) ||
        (lowerQ.includes('throat') && lowerLine.includes('throat')) ||
        (lowerQ.includes('fatigue') && lowerLine.includes('fatigue')) ||
        (lowerQ.includes('pain') && lowerLine.includes('pain')) ||
        (lowerQ.includes('notes') && lowerLine.includes('notes'))
      ) {
        if (!sourcesMap.some(s => s.snippet === line.trim())) {
          sourcesMap.push({
            fileName: rep.fileName,
            pageNumber: 1,
            snippet: line.trim()
          });
        }
      }
    });
  });

  // Identify matching lab results for provenance citation
  labResults.forEach(r => {
    if (
      lowerQ.includes(r.testName.toLowerCase()) || 
      lowerQ.includes('change') || 
      lowerQ.includes('hemoglobin') || 
      lowerQ.includes('wbc') || 
      lowerQ.includes('verification') || 
      lowerQ.includes('value') ||
      lowerQ.includes('compare')
    ) {
      if (!sourcesMap.some(s => s.fileName === r.source.fileName && s.snippet === r.source.textSnippet)) {
        sourcesMap.push({
          fileName: r.source.fileName,
          pageNumber: r.source.pageNumber,
          snippet: r.source.textSnippet
        });
      }
    }
  });

  if (sourcesMap.length === 0 && reports.length > 0) {
    sourcesMap.push({
      fileName: reports[0].fileName,
      pageNumber: 1,
      snippet: reports[0].extractedText.substring(0, 150) || `Record document ${reports[0].fileName}`
    });
  }

  const DISCLAIMER = 'This response describes information present in the available patient records and does not provide a medical diagnosis or treatment recommendation.';

  if (!apiKey || apiKey === 'AIzaSy_demo_placeholder_or_real_key') {
    return buildOfflineRAGAnswer(question, patient, labResults, reports, signals, sourcesMap, DISCLAIMER);
  }

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: `You are Ask MedLens, an AI medical record RAG assistant. 
You MUST answer questions strictly using the provided PATIENT WORKSPACE DATA CONTEXT.
Rules:
1. Do NOT answer from general medical knowledge if not present in records.
2. Do NOT diagnose conditions or recommend treatment.
3. If asked about symptoms or clinical notes (such as fever, headache, fatigue), check both patient intake symptoms and uploaded clinical report notes and quote the exact recorded statement.
4. Explicitly cite report names when mentioning test values or clinical notes.
5. End response with the required safety disclaimer.`
    });

    const prompt = `QUESTION: ${question}\n\n${contextSnippet}`;
    const result = await model.generateContent(prompt);
    const answerText = result.response.text();

    return {
      question,
      answer: answerText,
      sources: sourcesMap,
      disclaimer: DISCLAIMER
    };
  } catch (error) {
    return buildOfflineRAGAnswer(question, patient, labResults, reports, signals, sourcesMap, DISCLAIMER);
  }
}

function buildOfflineRAGAnswer(
  question: string,
  patient: any,
  labResults: any[],
  reports: any[],
  signals: any[],
  sourcesMap: any[],
  disclaimer: string
): RAGAnswer {
  const q = question.toLowerCase();
  let answer = '';

  // Check for symptom / fever / clinical notes query
  if (q.includes('fever') || q.includes('symptom') || q.includes('headache') || q.includes('fatigue') || q.includes('throat') || q.includes('notes')) {
    let reportClinicalNote = '';
    let foundReportName = '';

    for (const rep of reports) {
      const lines = rep.extractedText.split(/\r?\n/);
      for (const line of lines) {
        if (line.toLowerCase().includes('fever') || line.toLowerCase().includes('headache') || line.toLowerCase().includes('throat') || line.toLowerCase().includes('fatigue') || line.toLowerCase().includes('patient reports')) {
          reportClinicalNote = line.trim();
          foundReportName = rep.fileName;
          break;
        }
      }
      if (reportClinicalNote) break;
    }

    if (reportClinicalNote) {
      answer = `Yes. According to the Clinical Notes in ${foundReportName}, the record states: "${reportClinicalNote}".`;
    } else if (patient.symptoms && (patient.symptoms.toLowerCase().includes('fever') || patient.symptoms.toLowerCase().includes('headache') || patient.symptoms.toLowerCase().includes('fatigue'))) {
      answer = `Yes. According to the patient intake records for ${patient.name || patient.patientCode}, the patient reported: "${patient.symptoms}".`;
    } else if (patient.symptoms) {
      answer = `According to the patient records for ${patient.name || patient.patientCode}, the intake symptoms state: "${patient.symptoms}". No specific fever indication was noted in clinical notes.`;
    } else {
      answer = `No indication of fever was recorded in the available patient intake records or clinical notes for ${patient.name || patient.patientCode}.`;
    }
  } else if (q.includes('change') || q.includes('hemoglobin') || q.includes('compare')) {
    const hbResults = labResults.filter(r => r.testName.toLowerCase().includes('hemoglobin'));
    if (hbResults.length >= 2) {
      answer = `According to the uploaded reports for ${patient.name || patient.patientCode}, Hemoglobin changed from ${hbResults[0].value} ${hbResults[0].unit} in ${hbResults[0].source.fileName} to ${hbResults[1].value} ${hbResults[1].unit} in ${hbResults[1].source.fileName}.`;
    } else if (hbResults.length === 1) {
      answer = `According to ${hbResults[0].source.fileName}, the recorded Hemoglobin value is ${hbResults[0].value} ${hbResults[0].unit} with reference range ${hbResults[0].referenceRange || 'unavailable'}.`;
    } else {
      answer = `The available records contain ${labResults.length} extracted laboratory results across ${reports.length} reports.`;
    }
  } else if (q.includes('verification') || q.includes('verify') || q.includes('pending')) {
    const pending = labResults.filter(r => r.verificationStatus === 'PENDING');
    answer = `Currently, there are ${pending.length} laboratory result(s) pending human clinician verification, including ${pending.map(p => p.testName).join(', ') || 'none'}.`;
  } else if (q.includes('source') || q.includes('where')) {
    answer = `Extracted data points originate from ${labResults.map(r => r.source.fileName).filter((v, i, a) => a.indexOf(v) === i).join(', ')}. Each value maintains traceability to its document page and original snippet.`;
  } else {
    answer = `Based on the records for ${patient.name || patient.patientCode}, there are ${labResults.length} extracted laboratory test results across ${signals.length} active clinical information signals. Intake symptoms: "${patient.symptoms || 'None reported'}".`;
  }

  return {
    question,
    answer: `${answer}\n\n${disclaimer}`,
    sources: sourcesMap,
    disclaimer
  };
}
