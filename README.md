# MedLens — AI-Powered Clinical Information Intelligence

> **Transforming Fragmented Medical Records into a Structured, Traceable, and Reviewable Patient Intelligence Layer.**

---

## 1. Problem & Vision

### Problem
Patient health information is routinely fragmented across handwritten intake notes, laboratory PDF reports, previous diagnostic records, and prescriptions. When reviewing patient history:
* Clinicians waste critical time searching through raw, unstructured PDFs.
* Key laboratory metric trends and out-of-range indicators get missed.
* Critical allergy conflicts between intake forms and past laboratory notes go undetected.
* Standard generic LLM summaries risk hallucinations, invented laboratory reference ranges, and dangerous diagnostic assumptions.

### Vision
**MedLens** is an AI-assisted clinical information intelligence platform designed to improve the organization, traceability, and understandability of patient-provided medical information. 

MedLens does **not** replace medical professionals, nor does it diagnose diseases. Instead, it equips clinicians and patients with deterministic reference-range validation, page-level document provenance, human verification workflows, and responsible AI summaries.

---

## 2. Core Capabilities

* **Patient Information Intake**: Securely captures patient demographics, active symptoms, known allergies, current medications, existing conditions, and medical history with `USER_INPUT` provenance attribution.
* **Medical Report Ingestion & Deduplication**: Parses laboratory PDF reports, extracts raw text, and computes SHA-256 cryptographic hashes to prevent duplicate report ingestion.
* **Structured Medical Record**: Organizes extracted information into clear, segregated clinical panels rather than raw AI text.
* **Reference-Range Awareness**: Identifies whether reported values are low, normal, or high using reference ranges provided in the source report. Never invents reference ranges.
* **Source & Provenance**: Clearly distinguishes between user-provided information, PDF-extracted data, AI summaries, and human-verified records.
* **Human-in-the-Loop Verification**: Enables clinicians to `VERIFY`, `EDIT`, or `REJECT` extracted lab results before finalizing structured records.
* **Clinical Information Signal Engine**: Converts out-of-range metrics, pending verifications, and discrepancies into structured signals (`ATTENTION`, `WARNING`, `INFO`).
* **Information Conflict Detection**: Detects discrepancies between intake forms (e.g. Penicillin allergy) and report notes.
* **Longitudinal Patient Record**: Maintains a chronological timeline and visualizes metric trends across historical reports.
* **Grounded Ask MedLens**: Patient-scoped, source-grounded question answering with document page citations.
* **Privacy & Security**: AES-256-GCM encryption for patient PII, JWT authentication, and a `DELETE` API for GDPR/HIPAA privacy compliance.
* **Structured PDF Export**: Generates printable, audit-ready PDF records of structured patient data.

---

## 3. Human-in-the-Loop Verification

Every AI-extracted clinical data point is assigned a verification state:
* `PENDING`
* `VERIFIED`
* `CORRECTED`
* `REJECTED`

Clinicians can review extracted values before relying on them.

When a value is corrected, MedLens preserves the original AI-extracted value (`originalAIValue`) and records the correction, reviewer, timestamp, and audit event.

AI extraction is therefore treated as an assistive process rather than an unquestioned source of truth.

---

## 4. Clinical Information Signal Engine

MedLens converts changes, conflicts, and review requirements into structured Clinical Information Signals.

Signals include:
* `OUTSIDE_RANGE`
* `VERIFICATION_REQUIRED`
* `CONFLICT_DETECTED`
* `CHANGE_DETECTED`
* `MISSING_INFO`

Signals are categorized as:
* **ATTENTION** — information requires review
* **WARNING** — verification or conflict detected
* **INFO** — information change detected

Signals do not represent diagnoses or medical risk scores.

For example, if a laboratory report provides a reference range of 4.5–11.0 and the extracted WBC value is 11.8, MedLens flags the value as `ABOVE_PROVIDED_RANGE`.

The system does not determine whether the result represents a disease or medical emergency.

---

## 5. Information Conflict Detection

MedLens identifies conflicting information across different sources.

Examples include:
* Patient intake vs. medical report
* Current medication list vs. historical record
* Allergy information across reports
* Different values for the same clinical measurement

Conflicts are surfaced for human review rather than automatically deciding which source is medically correct.

Each conflict preserves:
* Field
* Value A & Source A
* Value B & Source B
* Resolution status
* Timestamp

---

## 6. Longitudinal Patient Record

MedLens maintains a chronological information timeline containing:
* Patient creation
* Report uploads
* AI extraction
* Verification & Corrections
* Conflict detection
* Summary generation

Historical reports can be compared to identify:
* Changed values
* Unchanged values
* Newly available measurements
* Missing measurements

The comparison describes recorded information changes and does not provide medical interpretation.

---

## 7. Grounded Ask MedLens

Ask MedLens provides patient-scoped, source-grounded question answering.

The retrieval layer uses information already available in the patient's structured record and source documents.

Responses include source references such as:
`CBC_September.pdf — Page 1`

The system does not use unrestricted web knowledge to answer patient record questions.

If sufficient evidence is unavailable, MedLens explicitly states that the available records do not contain enough information to answer the question.

RAG is an assistive retrieval component of MedLens rather than the core identity of the platform.

---

## 8. System Architecture

```text
                    MedLens
                       |
        +--------------+--------------+
        |                             |
 Patient Information             Medical Reports
        |                             |
        |                         PDF Upload
        |                             |
        |                       SHA-256 Hash
        |                             |
        |                       Text Extraction
        |                             |
        |                           Gemini
        |                             |
        |                       Zod Validation
        |                             |
        +-------------+---------------+
                      |
              Structured Record
                      |
        +-------------+-------------+
        |             |             |
   Provenance      Signals      Conflicts
        |             |             |
        +-------------+-------------+
                      |
              Human Verification
                      |
              MongoDB Persistence
                      |
        +-------------+-------------+
        |             |             |
     Timeline      Audit       Ask MedLens
```

---

## 9. Responsible AI Architecture

MedLens does not treat the LLM as the source of truth.

AI-generated output passes through multiple validation layers before becoming part of the structured patient record:

```text
Untrusted Medical Document
          ↓
Server-Side Text Extraction
          ↓
Gemini Structured Extraction
          ↓
Zod Schema Validation
          ↓
Application Validation
          ↓
Deterministic Reference-Range Evaluation
          ↓
Provenance Assignment
          ↓
MongoDB Persistence
          ↓
Human Verification
```

### AI Safety Rules

MedLens:
* **Does not diagnose diseases.**
* **Does not prescribe treatments.**
* **Does not recommend medication dosage changes.**
* **Does not invent laboratory reference ranges.**
* **Does not present unsupported AI assumptions as medical facts.**
* **Does not automatically resolve conflicting patient information.**
* **Does not treat AI extraction as verified clinical information.**
* **Provides source references for grounded AI responses.**
* **Explicitly communicates when available evidence is insufficient.**

---

## 10. Security & Privacy

MedLens follows a defense-in-depth approach for sensitive clinical information.

### Data Protection
* **AES-256-GCM Encryption**: Encrypts sensitive patient fields (`nameEncrypted`, `symptomsEncrypted`).
* **SHA-256 Hashing**: Prevents duplicate document uploads (`409 DUPLICATE_REPORT`).
* **Password Hashing**: Authenticates users securely with bcrypt.
* **HttpOnly Authentication Cookies**: Validated via server-side JWT handlers.
* **Server-Side Authorization**: Protected route handlers.
* **Input Validation**: Enforced via Zod schemas.
* **Privacy Deletion API**: Implements `DELETE /api/patients/[id]` for permanent record purging.

### Data Minimization
Sensitive information is not unnecessarily exposed in JWT payloads, client-side code, audit logs, or AI prompts.

---

## 11. Data Provenance

MedLens distinguishes information according to its origin:

| Provenance | Meaning |
|:---|:---|
| `USER_INPUT` | Entered by the patient/clinician during intake |
| `DOCUMENT_EXTRACTED` | Extracted from an uploaded medical report |
| `AI_GENERATED` | Generated by an AI process grounded in extracted facts |
| `HUMAN_VERIFIED` | Reviewed and confirmed by an authorized human |

Each extracted laboratory result retains:
* Source document & Page number
* Extracted text snippet
* Extraction confidence score
* Original AI value
* Verification status, Reviewer & Timestamp

---

## 12. Technology Stack

| Layer | Technology |
|:---|:---|
| **Frontend** | Next.js 14 + React 18 + TypeScript |
| **Backend** | Next.js App Router / Server Route Handlers |
| **Styling** | Tailwind CSS |
| **Database** | MongoDB (with in-memory fallback) |
| **AI Engine** | Google Gemini API |
| **Validation** | Zod Schemas |
| **Authentication** | JWT (`jose`) + HttpOnly Cookies |
| **Password Security** | bcryptjs |
| **Cryptography** | AES-256-GCM |
| **File Integrity** | SHA-256 |
| **Icons** | Lucide React |

---

## 13. Application Modules

* `/` — Landing page & product overview
* `/patients` — Patient directory and intake
* `/patients/[id]` — Patient workspace overview
* `/patients/[id]/record` — Structured medical record viewer & PDF export
* `/patients/[id]/upload` — Medical report ingestion & SHA-256 deduplication
* `/patients/[id]/signals` — Clinical Information Signal engine
* `/patients/[id]/timeline` — Patient information chronological timeline
* `/patients/[id]/compare` — Historical report comparison
* `/patients/[id]/ask` — Source-grounded Ask MedLens
* `/trust` — Security & Responsible AI Center
* `/audit` — Cryptographic system audit trail

---

## 14. Demonstration Workflow

A complete MedLens workflow can be demonstrated as follows:
1. Select or create a patient record (**Sarah Jenkins - `MED-8921`**).
2. Review patient-provided intake information.
3. Upload a laboratory PDF report (`CBC_September_2026.pdf`).
4. Calculate the document SHA-256 hash to verify deduplication.
5. Extract document text and process via Gemini API.
6. Validate Gemini output against Zod schema (`GeminiExtractionResponseSchema`).
7. Store extracted laboratory information with page citations.
8. Evaluate provided reference ranges deterministically (`10.2 g/dL` vs `12.0-15.5 g/dL` -> `BELOW_PROVIDED_RANGE`).
9. Generate Clinical Information Signals (Outside Range, Pending Verification).
10. Surface allergy conflicts between intake (`Penicillin`) and report notes (`NKDA`).
11. Review extracted metrics in the **SideBySide Viewer**.
12. Click **Verify** or **Edit** to confirm AI extraction accuracy.
13. View historical trends in **Compare Reports**.
14. Inspect chronological events in **Timeline**.
15. Ask a source-grounded question in **Ask MedLens**.
16. Inspect the audit log in **Audit Trail**.

---

## 15. What Makes MedLens Different?

MedLens is not a generic medical chatbot.

Instead of sending an entire medical record to an LLM and asking it to produce an unrestricted medical interpretation, MedLens creates a structured information layer between source documents and AI.

The platform follows five core principles:

### Evidence Before Interpretation
Information is first extracted and structured before AI summarization.

### Source Before Assumption
Every extracted value maintains a connection to its source.

### Deterministic Validation
Rules such as reference-range comparison are handled by application logic rather than model interpretation.

### Human Before Clinical Reliance
AI-extracted information remains reviewable and verifiable.

### Transparency Over False Certainty
When information is missing, conflicting, or uncertain, MedLens exposes that uncertainty instead of inventing an answer.

---

## 16. Limitations

MedLens is an information organization and review-support system.

It is not:
* A diagnostic system
* A treatment recommendation system
* A prescription system
* A replacement for a clinician
* A medical emergency assessment system

AI-generated summaries and extracted information must be reviewed by an appropriately qualified human before being used for clinical decision-making.

---

## 17. Running MedLens Locally

### Requirements
* Node.js 18.x+
* MongoDB
* Google Gemini API Key

### Installation

```bash
# Clone repository
git clone https://github.com/medlens/medlens.git
cd medlens

# Install dependencies
npm install
```

### Environment Variables
Create `.env.local` in root:
```env
GEMINI_API_KEY=your_gemini_api_key
MONGODB_URI=mongodb://localhost:27017/medlens
JWT_SECRET=your_jwt_secret_key
ENCRYPTION_KEY=your_32_byte_hex_encryption_key
```

### Execution
```bash
# Start development server
npm run dev

# Run automated tests
npm test

# Build production app
npm run build
```

Open `http://localhost:3000` in your browser.

---

## 18. Validation & Testing

MedLens includes automated validation for:
* TypeScript compilation (`npx tsc --noEmit`)
* Gemini structured output schema compliance
* Zod input & output validation
* AES-256-GCM encryption/decryption
* SHA-256 duplicate report detection
* Reference-range evaluation logic
* Human verification audit logging

Run tests with:
```bash
npm test
```

---

## 19. Future Enhancements

* OCR engine integration for low-resolution scanned documents.
* Multi-language laboratory report translation.
* FHIR / HL7 clinical data export format.
