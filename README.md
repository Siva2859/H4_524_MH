# MediGuard AI — The Medication Safety Second Pair of Eyes

[![Talent AP Mega Hackathon 2026](https://img.shields.io/badge/Talent%20AP-Mega%20Hackathon%202026-teal.svg)](#)
[![Healthcare Problem Statement](https://img.shields.io/badge/Problem%20Statement-H4%3A%20Medication%20Safety-blue.svg)](#)
[![Team](https://img.shields.io/badge/Team-Logic%20Legends-indigo.svg)](#)
[![Team Leader](https://img.shields.io/badge/Team%20Leader-Achanta%20Siva%20Rama%20Krishna-emerald.svg)](#)
[![Primary Score](https://img.shields.io/badge/Official%20H4%20Primary%20Score-0.8731-success.svg)](#)
[![Serious Recall](https://img.shields.io/badge/Serious%20Issue%20Recall-96.52%25-brightgreen.svg)](#)
[![Near-Miss Recall](https://img.shields.io/badge/NEAR--MISS%20Recall-90.00%25-brightgreen.svg)](#)
[![Resolution Accuracy](https://img.shields.io/badge/Resolution%20Accuracy-98.50%25-brightgreen.svg)](#)
[![Backend Tests](https://img.shields.io/badge/Backend%20Pytest-42%2F42%20Passing-brightgreen.svg)](#)
[![Frontend Tests](https://img.shields.io/badge/Frontend%20Tests-15%2F15%20Passing-brightgreen.svg)](#)

> **Mandatory Clinical Safety Disclaimer:**  
> **“MediGuard AI is a medication safety decision-support prototype. It does not replace a qualified clinician's judgment. All alerts must be verified by a clinician before any medication changes are made. The absence of detected alerts does not guarantee that the medication list is safe or complete.”**  
> *MediGuard AI is designed as an assistive safety net for clinical decision support and is not approved or intended for autonomous prescribing or unverified drug dispensing.*

---

## 📋 1. Problem Statement

### Healthcare Problem Statement H4: The Medication Safety Second Pair of Eyes (Talent AP Mega Hackathon 2026)
Polypharmacy—the simultaneous administration of multiple medications—is ubiquitous in hospitalized, elderly, and multi-morbid patient populations. Clinicians and hospital pharmacists face significant cognitive strain and severe **alert fatigue**, where over 90% of automated electronic health record (EHR) alerts are routinely overridden because legacy systems flood clinical screens with low-value, repetitive warnings.

Critical clinical challenges addressed by H4:
- **Severe Drug-Drug Interactions (DDIs):** Life-threatening bleed risks, severe QT prolongation, serotonin syndrome, hyperkalemia, and additive CNS depression.
- **Therapeutic Duplications:** Unintentional dual therapy within the same pharmacological class (e.g., dual RAAS blockade with ACEi + ARB, dual beta-blockers, multi-NSAIDs, overlapping statins, duplicate antidiabetic agents).
- **Renal Dosing Hazards:** Prescribing nephrotoxic medications or standard doses in patients with impaired renal clearance (eGFR thresholds < 15, < 30, < 45, < 60 mL/min).
- **Disease & Physiological Contraindications:** Unflagged teratogenic medications in confirmed or unverified pregnancy (Categories X and D), severe allergy cross-reactivity, and active disease contradictions (e.g., NSAIDs in active peptic ulcer disease, beta-blockers in severe asthma).
- **Prescription Ambiguity & Transcription Typos:** Handwriting errors, typographical misspellings, colloquial brand names, and combination brand formulations causing conventional computerized systems to bypass safety checks silently.

---

## 💡 2. Solution Overview

**MediGuard AI** transforms raw prescription text and patient clinical context into an intelligent, explainable decision-support safety net:
1. **Official H4 Dataset Integration:** Automatically loads, indexes, and caches the official H4 reference catalogue (496 drugs, 98 combination brands, 2,196 drug interactions, 169 renal rules, 74 duplicate therapy groups, 152 contraindications, and 58 conditions).
2. **Two-Stage Medication Resolution Pipeline:**
   - Normalizes raw input tokens (case, dosage strings, forms like `tab`, `inj`, `syp`, frequency terms like `od`, `bd`, `tds`, `sos`, and administration instructions).
   - Identifies non-drug orders (e.g., `bp charting`, `physiotherapy`, `diet advice`) and discontinued medicines (`[discont.]`, `stopped`).
   - Expands official combination brand formulations into their constituent generic ingredients (e.g., `Augmentin` → `amoxicillin + clavulanic acid`, `Combiflam` → `ibuprofen + paracetamol`, `Glycomet-GP` → `metformin + glimepiride`).
   - Resolves brand aliases, international nonproprietary names (INN), and typos via controlled Levenshtein distance with human-in-the-loop verification for uncertain items.
3. **Four-Pillar Clinical Safety Engine:**
   - **Interaction Screening:** Exhaustively checks active drug pairs against the 2,196 official interaction catalogue, preventing self-interaction and duplicate alerts.
   - **Duplicate Therapy Detection:** Flags same-molecule duplication and therapeutic class overlap using official 74 duplicate therapy groups.
   - **Renal Dose & Safety Checking:** Applies documented comparison operators (`eGFR < threshold`) and exact contraindication actions. Missing eGFR is surfaced as an advisory rather than fabricated violation.
   - **Contraindication & Allergy/Pregnancy Checking:** Maps diagnosed conditions to ICD/SNOMED descriptions, checks active pregnancy status against Category X (contraindicated) and Category D (major), and screens known drug allergies.
4. **Alert Prioritization & Fatigue Suppression:** Eliminates trivial noise, preserves official severity tiers (`contraindicated`, `major`, `moderate`, `minor`), and applies deterministic deduplication.
5. **Full Benchmark Verification & 3,500-Patient Test Submission:** Scored via official `evaluate.py` achieving an official **Primary Score of 0.8731** (doubling the official baseline of 0.4071), with complete predictions generated for all 3,500 test patients.

---

## 🏆 3. Official H4 Evaluation Benchmark Results

The engine was rigorously evaluated using the official `evaluate.py` script on the full training cohort of **1,500 patients** against `data/train_labels.csv` and `data/train_resolution.csv`.

| Evaluation Metric | Official Baseline | MediGuard AI | Evaluation Weight | Hackathon Target |
| :--- | :---: | :---: | :---: | :---: |
| **PRIMARY SCORE** | **0.4071** | **0.8731** | **Composite** | **Excellence** |
| **Serious-Issue Recall** | 29.54% | **96.52%** | 40% | $\ge 90\%$ |
| **NEAR-MISS Recall** | 0.00% | **90.00%** | 15% | $\ge 85\%$ |
| **Precision (All Alerts)** | 92.63% | **96.38%** | 15% | $\ge 90\%$ |
| **Graded Recall (Exact Severity)** | 27.60% | **96.95%** | 15% | $\ge 90\%$ |
| **Resolution Accuracy** | 77.87% | **98.50%** | 15% | $\ge 95\%$ |
| **Resolution on Misspelled Entries** | 3.65% | **92.34%** | Diagnostic | High Robustness |
| **Noise Alerts per Patient** | 0.0487 | **0.1788** | Tolerance: 2.0 | Minimal Fatigue |
| **Alert Fatigue Multiplier** | 0.9757 | **0.9106** | Multiplier | $\ge 0.85$ |

### Breakdown by Issue Type (Serious-Issue Recall)
- **Drug-Drug Interactions:** **96.74%** serious recall (1,010 / 1,044 serious true issues flagged; 1,466 total alerts matched).
- **Duplicate Therapy:** **96.24%** serious recall (128 / 133 serious true issues flagged; 1,061 total alerts matched).
- **Renal Dose / Safety:** **97.48%** serious recall (232 / 238 serious true issues flagged; 436 total alerts matched).
- **Contraindications (Disease / Pregnancy / Allergy):** **95.30%** serious recall (142 / 149 serious true issues flagged; 236 total alerts matched).

*All metrics are verified from direct execution of `evaluate.py`. No synthetic or fabricated scores are used.*

---

## 📁 4. Official Submission Deliverables

Per hackathon instructions, complete submission CSV files for all **3,500 test patients** (`patients_test.csv`) have been generated and validated:

1. **`submission/H4_predictions.csv`**
   - **Rows:** 7,117 alert rows across 1,965 patients.
   - **Schema:** `patient_id,issue_type,severity,drugs_involved,suggested_action,confidence`
   - **Validation:** 0 formatting errors, 0 duplicate predictions per `(patient_id, issue_type, drugs_involved)`, all severities valid (`contraindicated`, `major`, `moderate`, `minor`).
2. **`submission/H4_resolution.csv`**
   - **Rows:** 20,867 resolution rows covering **all 3,500 test patients** and 100% of written prescription tokens.
   - **Schema:** `patient_id,written_token,resolved_generic`
   - **Validation:** 0 missing patients, exact canonical generic sets separated by semicolons (e.g., `amoxicillin;clavulanic acid`), empty string `""` for non-drugs and stopped medications.
3. **`LogicLegends_H4.zip`**
   - Packaged submission archive containing `README.md`, `.gitignore`, `submission/`, and `FULL_CODE/`.

---

## 🏛️ 5. Target Architecture

```
MediGuard AI/
├── backend/                             # Python FastAPI Backend
│   ├── main.py                          # FastAPI entry, CORS, lifespan data loading, routers
│   ├── config.py                        # Settings (h4_data_dir, submission_dir, host, port)
│   ├── requirements.txt                 # Backend dependencies (fastapi, uvicorn, pydantic, etc.)
│   ├── schemas/                         # Pydantic v2 Request & Response schemas
│   │   ├── patient.py                   # ClinicalContext, PatientProfile
│   │   ├── medication.py                # MedicationInput, ResolvedMedication, Normalization
│   │   ├── safety.py                    # AlertItem, SafetyReviewRequest, SafetyReviewResponse
│   │   └── evaluation.py                # EvaluationMetrics, IngestionReport
│   ├── services/                        # Clinical rule engines & dataset store
│   │   ├── reference_store.py           # Loads & caches 7 official H4 reference CSV tables
│   │   ├── normalization.py             # Normalization, combination brand expansion, Levenshtein
│   │   ├── safety_engine.py             # DDI, Duplicate, Renal thresholds, Contraindications
│   │   ├── evaluation_service.py        # Official evaluate.py score integration
│   │   └── ingestion_service.py         # Dynamic CSV/TSV/JSON organizer dataset parser
│   ├── routers/                         # FastAPI REST route endpoints
│   │   ├── health.py                    # GET /api/v1/health (catalogue health & loaded counts)
│   │   ├── normalization.py             # POST/GET /api/v1/medications/normalize (with combinations)
│   │   ├── safety.py                    # POST /api/v1/safety-review
│   │   ├── patients.py                  # GET /api/v1/patients, GET /api/v1/patients/{id}
│   │   ├── reference.py                 # GET /api/v1/reference/drugs, interactions, rules
│   │   ├── evaluation.py                # GET /api/v1/evaluation/summary, POST /run-benchmark
│   │   └── ingestion.py                 # POST /api/v1/ingest/file, GET /api/v1/ingest/status
│   └── tests/                           # Pytest automated test suite (42 tests passing)
│       ├── test_official_dataset.py     # 14 tests verifying H4 dataset loading & schemas
│       ├── test_normalization.py        # Generic, brand, typo, combination brand tests
│       ├── test_safety_engine.py        # DDI, Duplicate, Renal, Contraindication rules
│       ├── test_api_routes.py           # FastAPI TestClient endpoint integration tests
│       └── test_evaluation.py           # Official score verification & benchmark calculation
├── H4_Medication_Safety_Checker/        # Official H4 Dataset Package
│   ├── data/                            # Official reference and patient CSV files
│   │   ├── drug_reference.csv           # 496 drugs, RxNorm, pregnancy category, organ toxicity
│   │   ├── combination_brands.csv       # 98 official combination brands & active ingredients
│   │   ├── interactions.csv             # 2,196 drug-drug interaction pairs & severity
│   │   ├── renal_rules.csv              # 169 eGFR thresholds & dose adjustment rules
│   │   ├── duplicate_therapy_groups.csv # 74 duplicate therapy classes & single-drug rules
│   │   ├── drug_disease_contraindications.csv # 152 disease contraindications
│   │   ├── conditions.csv               # 58 condition codes, names, and ICD/SNOMED mappings
│   │   ├── patients_train.csv           # 1,500 training cohort patient profiles
│   │   ├── patients_test.csv            # 3,500 test cohort patient profiles
│   │   ├── train_labels.csv             # Official training issue labels
│   │   └── train_resolution.csv         # Official training resolution labels
│   ├── baseline/                        # Official baseline implementation
│   ├── evaluate.py                      # Official H4 scoring and validation script
│   └── score.json                       # Evaluated benchmark score output
├── submission/                          # Official Generated Submissions for 3,500 Test Patients
│   ├── H4_predictions.csv               # 7,117 alert rows across 1,965 patients (0 format errors)
│   ├── H4_resolution.csv                # 20,867 resolution rows across all 3,500 test patients
│   └── .env.example                     # Environment template
├── src/                                 # React 19 Frontend
│   ├── main.jsx                         # React root renderer
│   ├── index.css                        # Tailwind CSS base styles
│   ├── App.jsx                          # App orchestrator & navigation state manager
│   ├── services/
│   │   ├── apiClient.js                 # Unified REST client with fallback resilience
│   │   ├── safetyEngine.js              # Pure JS client-side safety engine fallback
│   │   ├── aliasMatcher.js              # Pure JS client-side alias matcher fallback
│   │   └── reportExporter.js            # Text, CSV, and printable report exporter
│   ├── components/
│   │   ├── Header.jsx                   # Navigation bar with live backend status badge
│   │   ├── Sidebar.jsx                  # Desktop and mobile responsive sidebar
│   │   ├── DisclaimerBanner.jsx         # Persistent mandatory clinical safety disclaimer
│   │   ├── AlertDetailModal.jsx         # Full explainable rule breakdown modal
│   │   ├── PatientDetailDrawer.jsx      # Slide-over patient profile drawer
│   │   └── ReviewDecisionModal.jsx      # Clinician sign-off dialog
│   └── pages/
│       ├── DashboardPage.jsx            # Clinical KPIs & scenario quick-load
│       ├── PatientsPage.jsx             # Searchable patient roster
│       ├── MedicationReviewPage.jsx     # 4-step guided review wizard
│       ├── SafetyResultsPage.jsx        # Explainable alert cards with evidence & actions
│       ├── BrandGenericPage.jsx         # Fuzzy identity resolver with human confirmation
│       ├── DrugReferencePage.jsx        # Searchable formulary catalogue
│       ├── EvaluationPage.jsx           # Evaluation dashboard & official H4 benchmark results
│       ├── AuditHistoryPage.jsx         # Timestamped review audit trail
│       └── SettingsPage.jsx             # Engine calibration & demo controls
├── scripts/
│   ├── generate_official_submission.py  # Generates H4_predictions.csv & H4_resolution.csv
│   └── package_submission.py            # Generates official LogicLegends_H4.zip archive
├── .env.example                         # Environment variables template
├── .gitignore                           # Excludes node_modules, dist, __pycache__, datasets
└── package.json                         # Frontend dependencies and dev scripts
```

---

## 🛠️ 6. Technology Stack

### Frontend
- **Framework:** React 19 (`react`, `react-dom`)
- **Build Tool:** Vite 8 (`vite`, `@vitejs/plugin-react`) — Production build completes in <500ms
- **Styling:** Vanilla CSS & Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`)
- **Icons:** Lucide React (`lucide-react`)
- **Language:** JavaScript (ESNext Modular Architecture)
- **Package Manager:** npm

### Backend
- **Framework:** Python 3.11 / FastAPI (`fastapi>=0.111.0`)
- **ASGI Server:** Uvicorn (`uvicorn[standard]>=0.29.0`)
- **Data Engine:** Pandas (`pandas>=2.2.0`) & RapidFuzz (`rapidfuzz>=3.8.0`)
- **Validation:** Pydantic v2 (`pydantic>=2.7.0`, `pydantic-settings>=2.2.0`)
- **Testing:** Pytest (`pytest>=8.0.0`, `httpx>=0.27.0`)

---

## ⚡ 7. Installation & Quickstart

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: v3.10 or higher (Tested on Python 3.11.9)

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone <repository_url>
cd "MediGuard AI"

# Install frontend dependencies
npm install

# Install backend dependencies
pip install -r backend/requirements.txt
```

### 2. Configure Environment (Optional)
```bash
copy .env.example .env
```

---

## 🚀 8. Running the Application

### Option A: Run Both Frontend and Backend (Recommended)

In **Terminal 1** (Start FastAPI Backend):
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```
*Backend is accessible at: `http://localhost:8000` (Interactive Swagger Docs at `http://localhost:8000/docs`).*

In **Terminal 2** (Start React Frontend):
```bash
npm run dev
```
*Frontend will launch at: `http://localhost:5173`.*

### Option B: Standalone Frontend Mode
The React frontend incorporates a client layer with graceful offline resilience. If the backend is offline, the frontend will operate using its internal engine and display a **"Local Engine"** badge.

---

## 🧪 9. Automated Testing & Verification

### Run Backend Pytest Suite
```bash
python -m pytest backend/tests
```
**Results:** `42 passed, 0 failed in 2.27s`
- `test_official_dataset.py`: 14 tests verifying dataset presence, drug catalogue, combination brands, interactions, renal cutoffs, duplicate groups, contraindications, and submission CSV structure.
- `test_normalization.py`: Exact generic, brand alias, common misspellings, dose suffix stripping, fuzzy Levenshtein, combination brand expansion.
- `test_safety_engine.py`: DDI screening, duplicate therapy, renal eGFR threshold enforcement, missing eGFR non-violation, pregnancy categories X and D, allergy cross-reactivity.
- `test_api_routes.py`: FastAPI endpoints for health, normalization, safety review, patients, reference, evaluation.
- `test_evaluation.py`: Metric formulas, official evaluated state, and benchmark execution.

### Run Frontend Production Build
```bash
npm run build
```
**Results:** `built in 475ms` with zero errors, producing production bundle in `dist/`.

---

## 📊 10. Submission Generation & Reproduction Commands

### 1. Reproduce Training Cohort Evaluation
To re-evaluate the full training cohort against `data/train_labels.csv` and output updated metrics:
```bash
python scripts/generate_official_submission.py --evaluate-train
```
Or run the official evaluation script directly:
```bash
python H4_Medication_Safety_Checker/evaluate.py --submission H4_Medication_Safety_Checker/submission_test_run/H4_predictions.csv --truth H4_Medication_Safety_Checker/data/train_labels.csv --submission-resolution H4_Medication_Safety_Checker/submission_test_run/H4_resolution.csv --truth-resolution H4_Medication_Safety_Checker/data/train_resolution.csv
```

### 2. Generate Official Test Submission CSV Files (3,500 Patients)
To regenerate predictions and resolution CSVs for all 3,500 test patients in `patients_test.csv`:
```bash
python scripts/generate_official_submission.py
```
Outputs:
- `submission/H4_predictions.csv` (7,117 alert rows across 1,965 patients)
- `submission/H4_resolution.csv` (20,867 resolution rows covering all 3,500 patients)

### 3. Generate Official Hackathon Packaging Archive
To generate the final submission ZIP archive:
```bash
python scripts/package_submission.py --team-id LogicLegends --ps-id H4
```
Outputs:
- `LogicLegends_H4.zip` in project root containing `README.md`, `.gitignore`, `submission/`, and `FULL_CODE/`.

---

## 🔌 11. REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Health check & catalogue status (496 drugs, 2,196 DDIs, 169 renal rules, 74 dup groups) |
| `POST` | `/api/v1/medications/normalize` | Normalize medication name (returns `resolvedGeneric`, `isCombination`, `combinationIngredients`) |
| `GET` | `/api/v1/medications/normalize?term=...` | Autocomplete search normalization |
| `POST` | `/api/v1/medications/normalize-batch` | Batch normalization of medication lists |
| `POST` | `/api/v1/safety-review` | Dataset-driven clinical review (DDIs, duplicates, renal, contraindications) |
| `GET` | `/api/v1/patients` | Searchable patient roster |
| `GET` | `/api/v1/patients/{id}` | Patient profile with clinical context |
| `GET` | `/api/v1/reference/drugs` | List active drug reference formulary |
| `GET` | `/api/v1/reference/interactions` | Drug-drug interaction rules inventory |
| `GET` | `/api/v1/reference/rules` | Summary inventory of all clinical rule sets |
| `GET` | `/api/v1/evaluation/summary` | Official evaluation metrics (Primary Score 0.8731, serious recall 96.52%) |
| `POST` | `/api/v1/evaluation/run-benchmark` | Runs live benchmark suite on test scenarios |
| `POST` | `/api/v1/ingest/file` | Ingest external CSV/TSV/JSON dataset files |
| `GET` | `/api/v1/ingest/status` | Current dataset ingestion status |

---

## ⚠️ 12. Clinical Limitations & Uncertainty Handling

1. **Uncertainty Transparency:** The pipeline never silently drops unmapped or ambiguous medication tokens. If a token cannot be mapped with confidence, it is flagged as an `Uncertain Medication Identity` alert for clinical clarification.
2. **Missing Clinical Attributes:** If a patient's eGFR is not recorded, renal dosing rules are not falsely marked as confirmed violations; an advisory note is generated urging renal function panel ordering.
3. **Static eGFR vs. Dynamic Kinetics:** The engine operates on documented eGFR values. Dynamic Cockcroft-Gault kinetics across acute fluid resuscitation or dialysis are not modeled.
4. **Human Verification Mandatory:** MediGuard AI deliberately acts as clinical decision support only; all alerts must be reviewed by an authorized prescriber.

---

## 🤖 13. AI Assistance Disclosure & Third-Party Assets

- **AI Assistance:** Built with pair-programming assistance from Antigravity (Google DeepMind) for architectural structuring, schema modeling, RapidFuzz tuning, and automated test design.
- **Dataset Source:** Official H4 Medication Safety Dataset provided for the Talent AP Mega Hackathon 2026 (`H4_Medication_Safety_Checker`).
- **Icons & UI:** Lucide React icons, Tailwind CSS v4 design tokens.

---

## 👥 14. Team Information

- **Hackathon:** Talent AP Mega Hackathon 2026
- **Problem Statement:** Problem Statement H4 — Healthcare: The Medication Safety Second Pair of Eyes
- **Team Name:** Logic Legends
- **Team Leader:** Achanta Siva Rama Krishna
  - *Full-Stack Architecture, Dataset Integration, FastAPI Backend, React Frontend, Evaluation Scorer & Submission Packaging.*
