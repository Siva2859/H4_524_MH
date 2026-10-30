/**
 * MediGuard AI - 4-Step Guided Medication Review Wizard (Page 3)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  User, 
  Activity, 
  Pill, 
  ShieldAlert, 
  ArrowRight, 
  ArrowLeft, 
  Search, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Sparkles, 
  Loader2,
  HelpCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { DRUG_CATALOGUE } from '../data/drugReferenceCatalogue.js';
import { DEMO_CASES } from '../data/demoCases.js';
import { normalizeMedication } from '../services/apiClient.js';
import { useTranslation } from '../i18n/LanguageContext.jsx';
import { resolveMultipleDiagnoses, applyDiagnosisConfirmation } from '../services/diagnosisMatcher.js';

export default function MedicationReviewPage({ 
  patients = [], 
  initialPatient, 
  initialMedications,
  onRunReview,
  onLoadDemoCase,
  appMode = 'demo'
}) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [patientSearch, setPatientSearch] = useState("");
  
  // Selected patient ID
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatient?.id || "SYN-PT-1042");

  // Clinical Context State (Step 2)
  const [clinicalContext, setClinicalContext] = useState({
    patientId: initialPatient?.id || "SYN-PT-1042",
    patientName: initialPatient?.name || "Arthur Vance (Synthetic)",
    age: initialPatient?.age || 72,
    sex: initialPatient?.sex || initialPatient?.gender || "Male",
    weight: initialPatient?.weightKg || 78,
    eGfr: initialPatient?.eGfr ?? initialPatient?.eGFR ?? 28,
    pregnancyStatus: initialPatient?.pregnancyStatus || "Not Applicable",
    diagnoses: initialPatient?.diagnoses?.join(", ") || "Type 2 Diabetes Mellitus, Hypertension, Chronic Kidney Disease Stage 4",
    knownAllergies: initialPatient?.knownAllergies?.join(", ") || initialPatient?.allergies?.join(", ") || "Penicillin (Rash)"
  });

  // Medication rows (Step 3)
  const [medications, setMedications] = useState(
    initialMedications || initialPatient?.currentMedications || [
      { genericName: "Warfarin", strength: "4 mg", dose: "4 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Aspirin", strength: "81 mg", dose: "81 mg", route: "Oral", frequency: "Once daily" },
      { genericName: "Metformin", strength: "500 mg", dose: "500 mg", route: "Oral", frequency: "Twice daily" }
    ]
  );

  // Live normalization cache for entered medicines: { [name]: { resolvedGeneric, isCombination, combinationIngredients, confidence, matchType } }
  const [normCache, setNormCache] = useState({});
  const [resolvingMeds, setResolvingMeds] = useState(false);

  // Wizard status
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  // Diagnosis normalization suggestion management
  const [rejectedDiagnosisSuggestions, setRejectedDiagnosisSuggestions] = useState(new Set());

  const resolvedDiagnoses = useMemo(() => {
    return resolveMultipleDiagnoses(clinicalContext.diagnoses);
  }, [clinicalContext.diagnoses]);

  const handleConfirmDiagnosis = (index, canonicalName) => {
    const updated = applyDiagnosisConfirmation(clinicalContext.diagnoses, index, canonicalName);
    setClinicalContext(prev => ({ ...prev, diagnoses: updated }));
  };

  const handleRejectDiagnosisSuggestion = (rawInput) => {
    setRejectedDiagnosisSuggestions(prev => {
      const next = new Set(prev);
      next.add(rawInput);
      return next;
    });
  };

  const prevPatientIdRef = useRef(initialPatient?.id);

  // Sync when initial patient changes
  useEffect(() => {
    if (initialPatient && initialPatient.id !== prevPatientIdRef.current) {
      prevPatientIdRef.current = initialPatient.id;
      setSelectedPatientId(initialPatient.id);
      setClinicalContext({
        patientId: initialPatient.id,
        patientName: initialPatient.name,
        age: initialPatient.age || 50,
        sex: initialPatient.sex || initialPatient.gender || "Male",
        weight: initialPatient.weightKg || 70,
        eGfr: initialPatient.eGfr ?? initialPatient.eGFR ?? 60,
        pregnancyStatus: initialPatient.pregnancyStatus || "Negative",
        diagnoses: Array.isArray(initialPatient.diagnoses) ? initialPatient.diagnoses.join(", ") : (initialPatient.diagnoses || ""),
        knownAllergies: Array.isArray(initialPatient.knownAllergies) ? initialPatient.knownAllergies.join(", ") : (initialPatient.allergies?.join(", ") || "")
      });
      if (initialPatient.currentMedications && initialPatient.currentMedications.length > 0) {
        setMedications(initialPatient.currentMedications.map(m => ({
          genericName: m.genericName || m.name || "",
          strength: m.strength || "",
          dose: m.dose || "1 tab",
          route: m.route || "Oral",
          frequency: m.frequency || "Once daily"
        })));
      }
    }
  }, [initialPatient]);

  // Live resolve medications when in Step 3
  useEffect(() => {
    let isCancelled = false;
    const toResolve = medications
      .map(m => m.genericName?.trim())
      .filter(name => name && !normCache[name.toLowerCase()]);

    if (toResolve.length > 0) {
      setResolvingMeds(true);
      Promise.all(toResolve.map(name => normalizeMedication(name))).then(results => {
        if (!isCancelled) {
          const updates = {};
          results.forEach(res => {
            if (res && res.enteredTerm) {
              updates[res.enteredTerm.toLowerCase()] = res;
            }
          });
          setNormCache(prev => ({ ...prev, ...updates }));
          setResolvingMeds(false);
        }
      }).catch(() => {
        if (!isCancelled) setResolvingMeds(false);
      });
    }

    return () => { isCancelled = true; };
  }, [medications]);

  // Handle patient card selection
  const handleSelectPatient = (p) => {
    setSelectedPatientId(p.id);
    setClinicalContext({
      patientId: p.id,
      patientName: p.name,
      age: p.age || 50,
      sex: p.sex || p.gender || "Male",
      weight: p.weightKg || 70,
      eGfr: p.eGfr ?? p.eGFR ?? 60,
      pregnancyStatus: p.pregnancyStatus || "Negative",
      diagnoses: Array.isArray(p.diagnoses) ? p.diagnoses.join(", ") : (p.diagnoses || ""),
      knownAllergies: Array.isArray(p.knownAllergies) ? p.knownAllergies.join(", ") : (p.allergies?.join(", ") || "")
    });
    if (p.currentMedications && p.currentMedications.length > 0) {
      setMedications(p.currentMedications.map(m => ({
        genericName: m.genericName || m.name || "",
        strength: m.strength || "",
        dose: m.dose || "1 tab",
        route: m.route || "Oral",
        frequency: m.frequency || "Once daily"
      })));
    }
    if (errors.patient) setErrors({ ...errors, patient: null });
  };

  // Add medication row
  const addMedicationRow = () => {
    setMedications([
      ...medications,
      { genericName: "", strength: "", dose: "1 tab", route: "Oral", frequency: "Once daily" }
    ]);
  };

  // Remove medication row
  const removeMedicationRow = (index) => {
    if (medications.length <= 1) {
      setErrors({ medications: "At least one medication is required for review." });
      return;
    }
    setMedications(medications.filter((_, i) => i !== index));
  };

  // Update medication row
  const updateMedication = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
    if (errors.medications) {
      setErrors({ ...errors, medications: null });
    }
  };

  // Step 1 Validation
  const handleContinueFromStep1 = () => {
    if (!selectedPatientId) {
      setErrors({ patient: "Please select a patient to review." });
      return;
    }
    setErrors({});
    setCurrentStep(2);
  };

  // Step 2 Validation
  const handleContinueFromStep2 = () => {
    const newErrors = {};
    if (!clinicalContext.age || isNaN(clinicalContext.age) || clinicalContext.age < 0 || clinicalContext.age > 120) {
      newErrors.age = "Valid patient age (0-120 years) is required for age-adjusted safety screening.";
    }
    if (clinicalContext.eGfr === "" || isNaN(clinicalContext.eGfr) || clinicalContext.eGfr < 0 || clinicalContext.eGfr > 200) {
      newErrors.eGfr = "Valid eGFR (0-200 mL/min) is required for kidney threshold evaluation.";
    }
    if (!clinicalContext.weight || isNaN(clinicalContext.weight) || clinicalContext.weight <= 0) {
      newErrors.weight = "Valid weight in kg is required for dose checks.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCurrentStep(3);
  };

  // Step 3 Validation
  const handleContinueFromStep3 = () => {
    const validMeds = medications.filter(m => m.genericName && m.genericName.trim());
    if (validMeds.length === 0) {
      setErrors({ medications: "Please enter at least one medication name to review." });
      return;
    }
    setErrors({});
    setCurrentStep(4);
  };

  // Step 4 Execution
  const handleExecuteSafetyReview = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError(null);

    const validMeds = medications.filter(m => m.genericName && m.genericName.trim());
    const normalizedContext = {
      ...clinicalContext,
      age: Number(clinicalContext.age),
      weight: Number(clinicalContext.weight),
      eGfr: Number(clinicalContext.eGfr),
      diagnoses: clinicalContext.diagnoses 
        ? clinicalContext.diagnoses.split(",").map(d => d.trim()).filter(Boolean)
        : [],
      knownAllergies: clinicalContext.knownAllergies
        ? clinicalContext.knownAllergies.split(",").map(a => a.trim()).filter(Boolean)
        : []
    };

    try {
      await onRunReview(normalizedContext, validMeds);
    } catch (err) {
      setSubmissionError(err.message || "Failed to execute medication safety review. Please verify backend connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter patients in Step 1
  const filteredPatients = patients.filter(p => {
    if (!patientSearch) return true;
    const term = patientSearch.toLowerCase();
    return (
      p.id?.toLowerCase().includes(term) ||
      p.name?.toLowerCase().includes(term) ||
      (Array.isArray(p.diagnoses) ? p.diagnoses.join(" ").toLowerCase() : p.diagnoses?.toLowerCase())?.includes(term)
    );
  });

  const selectedPatientObj = patients.find(p => p.id === selectedPatientId) || {
    id: clinicalContext.patientId,
    name: clinicalContext.patientName,
    age: clinicalContext.age,
    sex: clinicalContext.sex,
    eGfr: clinicalContext.eGfr,
    dataSource: appMode === 'official' ? "Official H4 Dataset Patient" : "Synthetic Demo Patient"
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Wizard Progress & Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('review.title')}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('review.subtitle')}
            </p>
          </div>

          {/* Quick Preset Scenarios */}
          {appMode !== 'official' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Preset Demo:</span>
              </span>
              {DEMO_CASES.map(c => (
                <button
                  key={c.id}
                  onClick={() => onLoadDemoCase && onLoadDemoCase(c.id)}
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors cursor-pointer"
                  title={c.subtitle}
                >
                  {c.title.split(":")[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4-Step Progress Indicator Bar */}
        <div className="mt-5 grid grid-cols-4 gap-2">
          {[
            { num: 1, title: t('review.step1'), icon: User },
            { num: 2, title: t('review.step2'), icon: Activity },
            { num: 3, title: t('review.step3'), icon: Pill },
            { num: 4, title: t('review.step4'), icon: ShieldAlert }
          ].map(s => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;
            const Icon = s.icon;

            return (
              <button
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isCurrent 
                    ? 'border-teal-500 bg-teal-50/70 ring-1 ring-teal-400' 
                    : isCompleted 
                      ? 'border-emerald-300 bg-emerald-50/50 text-slate-700' 
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                    isCurrent ? 'bg-teal-600 text-white' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isCompleted ? <Check className="w-3 h-3" /> : s.num}
                  </div>
                  <span className="text-xs font-semibold truncate hidden sm:inline">{s.title}</span>
                  <span className="text-xs font-semibold truncate sm:hidden">Step {s.num}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SELECT PATIENT */}
      {currentStep === 1 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 1: Select Patient for Review</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Search patients by ID or name and inspect their essential demographics and data source.
              </p>
            </div>
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient ID, name, diagnosis..."
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {errors.patient && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.patient}</span>
            </div>
          )}

          {/* Selected Patient Spotlight Banner */}
          {selectedPatientObj && (
            <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800">Selected Active Patient:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-teal-700 border border-teal-200">
                    {selectedPatientObj.dataSource || (appMode === 'official' ? "Official H4 Dataset" : "Synthetic Demo Patient")}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{selectedPatientObj.name}</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  ID: <strong className="font-mono text-slate-900">{selectedPatientObj.id}</strong> • 
                  Age: <strong>{selectedPatientObj.age}y</strong> • 
                  Sex: <strong>{selectedPatientObj.sex || selectedPatientObj.gender}</strong> • 
                  eGFR: <strong className={selectedPatientObj.eGfr < 30 ? "text-rose-600 font-bold" : ""}>{selectedPatientObj.eGfr ?? 'N/A'} mL/min</strong>
                </p>
              </div>

              <button
                onClick={handleContinueFromStep1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs shrink-0 cursor-pointer"
              >
                <span>Continue to Clinical Context</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Patient Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredPatients.map(p => {
              const isSelected = p.id === selectedPatientId;
              const isSevere = p.highestAlertSeverity === "Critical" || p.eGfr < 30;

              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-400/40 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{p.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isSevere ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {p.highestAlertSeverity || 'Standard'}
                    </span>
                  </div>

                  <div className="font-bold text-slate-900 text-sm mt-1">{p.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {p.age}y &bull; {p.sex || p.gender} &bull; eGFR: <strong className={p.eGfr < 30 ? "text-rose-600 font-bold" : ""}>{p.eGfr ?? 'N/A'}</strong> mL/min
                  </div>

                  <div className="text-[11px] text-slate-600 mt-2 line-clamp-1">
                    {Array.isArray(p.diagnoses) ? p.diagnoses.join(", ") : (p.diagnoses || "No diagnoses listed")}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">{p.currentMedications?.length || 0} meds recorded</span>
                    <span className={`font-semibold ${isSelected ? 'text-teal-700' : 'text-slate-500'}`}>
                      {isSelected ? "Selected ✓" : "Select &rarr;"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Bar */}
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleContinueFromStep1}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <span>Continue to Step 2: Clinical Context</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: CLINICAL CONTEXT */}
      {currentStep === 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Step 2: Patient Clinical Context</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Enter physiological parameters and diagnoses. All thresholds are checked strictly against official reference rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age (years) *
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={clinicalContext.age}
                onChange={(e) => setClinicalContext({ ...clinicalContext, age: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  errors.age ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-teal-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Used for age-adjusted safety rules</span>
              {errors.age && <p className="text-[10px] text-rose-600 mt-0.5">{errors.age}</p>}
            </div>

            {/* Weight */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Weight (kg) *
              </label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="300"
                value={clinicalContext.weight}
                onChange={(e) => setClinicalContext({ ...clinicalContext, weight: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none ${
                  errors.weight ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-teal-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Weight-based dose safety</span>
              {errors.weight && <p className="text-[10px] text-rose-600 mt-0.5">{errors.weight}</p>}
            </div>

            {/* eGFR */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>eGFR (mL/min) *</span>
                <span className="text-[10px] font-mono text-teal-700">Kidney Clearance</span>
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="200"
                value={clinicalContext.eGfr}
                onChange={(e) => setClinicalContext({ ...clinicalContext, eGfr: e.target.value })}
                className={`w-full px-3 py-2 rounded-xl border text-xs font-bold focus:outline-none ${
                  clinicalContext.eGfr < 30 ? 'text-rose-600 bg-rose-50/50' : 'text-slate-900'
                } ${errors.eGfr ? 'border-rose-500 ring-2 ring-rose-100' : 'border-slate-200 focus:border-teal-500'}`}
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Official cutoffs: &lt;15, &lt;30, &lt;45, &lt;60</span>
              {errors.eGfr && <p className="text-[10px] text-rose-600 mt-0.5">{errors.eGfr}</p>}
            </div>

            {/* Pregnancy Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Pregnancy Status
              </label>
              <select
                value={clinicalContext.pregnancyStatus}
                onChange={(e) => setClinicalContext({ ...clinicalContext, pregnancyStatus: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="Negative">Negative (Not Pregnant)</option>
                <option value="Positive">Positive (Active Pregnancy - Screen Cat X/D)</option>
                <option value="Not Applicable">Not Applicable</option>
                <option value="Unrecorded">Unrecorded / Missing Detail</option>
              </select>
              <span className="text-[10px] text-slate-400 mt-1 block">Checked against Category X & D</span>
            </div>

          </div>

          {/* Diagnoses Comma-Separated with Intelligent Diagnosis Normalization */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                {t("review.diagnosesLabel")}
              </label>
              <span className="text-[11px] font-medium text-teal-700 flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                <Sparkles className="w-3 h-3 text-teal-600" />
                {t("review.diagnosisRecognitionTitle")}
              </span>
            </div>

            <input
              type="text"
              value={clinicalContext.diagnoses}
              onChange={(e) => setClinicalContext({ ...clinicalContext, diagnoses: e.target.value })}
              placeholder={t("review.diagnosesPlaceholder")}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            
            <p className="text-[11px] text-slate-400">
              {t("review.diagnosesSubtext")}
            </p>

            {/* Diagnosis Normalization Chips & Suggestion Cards */}
            {resolvedDiagnoses.length > 0 && (
              <div className="mt-3 space-y-2">
                {/* Active Suggestion Cards (Requires Confirmation) */}
                {resolvedDiagnoses
                  .filter(d => d.requiresConfirmation && !rejectedDiagnosisSuggestions.has(d.rawInput))
                  .map((item, idx) => (
                    <div 
                      key={`suggestion-${idx}-${item.rawInput}`}
                      className="p-3 bg-amber-50/80 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-slate-500 font-medium">
                            {t("review.suggestedCondition")}
                          </span>
                          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300">
                            {item.canonicalName}
                          </span>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full">
                            {item.matchType === "synonym_alias" ? t("review.synonymCorrection") : t("review.typoCorrection")} ({item.confidence}%)
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 flex items-center gap-2">
                          <span>{t("common.details")}: <span className="line-through text-slate-400 font-mono">{item.rawInput}</span></span>
                          <span>•</span>
                          <span className="text-amber-800 italic">{item.reason}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleConfirmDiagnosis(item.index, item.canonicalName)}
                          className="px-2.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {t("review.confirmSuggestion")}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectDiagnosisSuggestion(item.rawInput)}
                          className="px-2.5 py-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                        >
                          {t("review.keepOriginal")}
                        </button>
                      </div>
                    </div>
                  ))}

                {/* Confirmed / Canonical & Custom Status Pills */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {resolvedDiagnoses.map((item, idx) => {
                    const isRejected = rejectedDiagnosisSuggestions.has(item.rawInput);
                    if (item.isCanonical) {
                      return (
                        <span 
                          key={`canonical-${idx}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{item.canonicalName}</span>
                          <span className="text-[9px] uppercase tracking-wider text-emerald-600 bg-emerald-100/60 px-1 rounded ml-0.5">
                            {t("review.canonicalBadge")}
                          </span>
                        </span>
                      );
                    }
                    if (isRejected || !item.isKnown) {
                      return (
                        <span 
                          key={`custom-${idx}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200"
                          title="Custom / Unmapped condition - preserved in patient context"
                        >
                          <Info className="w-3 h-3 text-slate-400" />
                          <span>{item.rawInput}</span>
                          <span className="text-[9px] uppercase tracking-wider text-slate-500 bg-slate-200/60 px-1 rounded ml-0.5">
                            {t("review.customBadge")}
                          </span>
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Known Allergies */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Known Drug Allergies / Hypersensitivities (comma-separated)
            </label>
            <input
              type="text"
              value={clinicalContext.knownAllergies}
              onChange={(e) => setClinicalContext({ ...clinicalContext, knownAllergies: e.target.value })}
              placeholder="e.g. Penicillin, Sulfa, Aspirin, or NKDA"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Screened against prescribed medications to detect life-threatening allergic reactions.
            </p>
          </div>

          {/* Navigation Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Patient Selection</span>
            </button>

            <button
              onClick={handleContinueFromStep2}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <span>Continue to Step 3: Medication List</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: MEDICATION REGIMEN LIST */}
      {currentStep === 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Step 3: Medication Regimen Builder</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Add prescribed medications by generic or brand name. Brand names and combination products are resolved via the official dataset.
              </p>
            </div>

            <button
              type="button"
              onClick={addMedicationRow}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs transition-colors border border-teal-200 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
          </div>

          {errors.medications && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errors.medications}</span>
            </div>
          )}

          {/* List of Medications with Live Normalization Badges */}
          <div className="space-y-3">
            {medications.map((med, index) => {
              const enteredKey = med.genericName?.trim().toLowerCase();
              const normResult = enteredKey ? normCache[enteredKey] : null;
              const isUnresolved = normResult && normResult.matchType === "Unresolved";

              return (
                <div 
                  key={index}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-2.5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                    
                    {/* Medicine Name Input */}
                    <div className="sm:col-span-5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Prescribed Medicine Name (Generic or Brand)
                      </label>
                      <input
                        type="text"
                        list="drug-reference-suggestions"
                        placeholder="e.g. Warfarin, Lipitor, Augmentin, Metfornin"
                        value={med.genericName}
                        onChange={(e) => updateMedication(index, "genericName", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Dose / Strength */}
                    <div className="sm:col-span-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Dose / Strength
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 500 mg, 1 tab"
                        value={med.dose}
                        onChange={(e) => updateMedication(index, "dose", e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                      />
                    </div>

                    {/* Route */}
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                        Route
                      </label>
                      <select
                        value={med.route || "Oral"}
                        onChange={(e) => updateMedication(index, "route", e.target.value)}
                        className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                      >
                        <option value="Oral">Oral</option>
                        <option value="IV">IV</option>
                        <option value="SC">SC</option>
                        <option value="Inhalation">Inhalation</option>
                        <option value="Topical">Topical</option>
                      </select>
                    </div>

                    {/* Frequency */}
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                          Frequency
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Once daily, BID"
                          value={med.frequency || "Once daily"}
                          onChange={(e) => updateMedication(index, "frequency", e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeMedicationRow(index)}
                        className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors mt-4 cursor-pointer"
                        title="Remove medicine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Live Normalization Feedback Strip */}
                  {normResult && (
                    <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-slate-500">Identity Status:</span>
                      
                      {isUnresolved ? (
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                          ⚠️ Ambiguous / Unresolved: Medicine identity requires confirmation.
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
                          ✓ Mapped: <strong className="text-teal-950">{normResult.genericName}</strong> ({normResult.matchType})
                        </span>
                      )}

                      {normResult.isCombination && normResult.combinationIngredients?.length > 0 && (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 font-medium">
                          Active Ingredients: {normResult.combinationIngredients.join(" + ")}
                        </span>
                      )}

                      <span className="text-slate-400 text-[10px] font-mono">
                        Certainty: {normResult.confidence}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Datalist suggestions */}
          <datalist id="drug-reference-suggestions">
            {DRUG_CATALOGUE.map(d => (
              <option key={d.id} value={d.genericName}>
                {d.drugClass} (Brands: {d.brandAliases?.join(", ")})
              </option>
            ))}
            <option value="Augmentin">Amoxicillin + Clavulanic Acid</option>
            <option value="Combiflam">Ibuprofen + Paracetamol</option>
            <option value="Glycomet-GP">Metformin + Glimepiride</option>
            <option value="Metfornin">Common Misspelling for Metformin</option>
            <option value="Lipitor">Brand for Atorvastatin</option>
            <option value="Coumadin">Brand for Warfarin</option>
          </datalist>

          {/* Navigation Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Clinical Context</span>
            </button>

            <button
              onClick={handleContinueFromStep3}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
            >
              <span>Continue to Step 4: Safety Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW SUMMARY & EXECUTE */}
      {currentStep === 4 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Step 4: Execute Medication Safety Screening</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify the patient context and medication list before submitting to the FastAPI clinical safety engine.
            </p>
          </div>

          {submissionError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Safety Engine Submission Error:</strong>
                <span>{submissionError}</span>
              </div>
            </div>
          )}

          {/* Review Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Patient Context Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Patient Physiological Profile
              </span>
              <div className="font-bold text-slate-900 text-base">{clinicalContext.patientName}</div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>Age: <strong>{clinicalContext.age}y</strong> • Sex: <strong>{clinicalContext.sex}</strong> • Weight: <strong>{clinicalContext.weight} kg</strong></div>
                <div>eGFR: <strong className={clinicalContext.eGfr < 30 ? "text-rose-600 font-bold" : ""}>{clinicalContext.eGfr} mL/min</strong></div>
                <div>Pregnancy: <strong>{clinicalContext.pregnancyStatus}</strong></div>
                <div>Diagnoses: <strong>{clinicalContext.diagnoses || "None listed"}</strong></div>
                <div>Allergies: <strong>{clinicalContext.knownAllergies || "None documented"}</strong></div>
              </div>
            </div>

            {/* Prescribed Medications Summary */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Prescription List ({medications.filter(m => m.genericName?.trim()).length} Meds)
                </span>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-semibold text-teal-600 hover:underline"
                >
                  Edit Medications
                </button>
              </div>

              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 text-xs">
                {medications.filter(m => m.genericName?.trim()).map((m, idx) => {
                  const norm = normCache[m.genericName.trim().toLowerCase()];
                  return (
                    <div key={idx} className="p-2 rounded-lg bg-white border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-800">{m.genericName}</span>
                        {norm && norm.genericName !== m.genericName && (
                          <span className="text-[10px] text-teal-700 ml-1.5 font-medium">
                            &rarr; {norm.genericName}
                          </span>
                        )}
                        {norm?.isCombination && norm?.combinationIngredients && (
                          <div className="text-[10px] text-indigo-700 font-semibold">
                            {norm.combinationIngredients.join(" + ")}
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {m.dose} &bull; {m.frequency}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Clinical Disclaimer Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Mandatory Safety Guard:</strong> MediGuard AI evaluates regimens against deterministic safety rules. 
              The system <em>does not automatically alter doses or prescribe medications</em>. All recommendations are decision-support prompts for qualified clinician verification.
            </div>
          </div>

          {/* Execute CTA */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(3)}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Medications</span>
            </button>

            <button
              onClick={handleExecuteSafetyReview}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              id="execute-review-final-btn"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating Dataset Rules...</span>
                </>
              ) : (
                <>
                  <ShieldAlert className="w-4 h-4" />
                  <span>Execute Safety Review</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
