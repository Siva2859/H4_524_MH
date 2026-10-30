/**
 * MediGuard AI - Patient Detail Drawer
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React from 'react';
import { 
  X, 
  Pill, 
  AlertCircle, 
  Play, 
  Heart, 
  Droplet
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function PatientDetailDrawer({ 
  patient, 
  isOpen, 
  onClose, 
  onStartReview 
}) {
  const { t } = useTranslation();
  if (!isOpen || !patient) return null;

  // Determine CKD stage from eGFR
  const getCkdStage = (egfr) => {
    if (egfr >= 90) return { stage: "Stage 1 (Normal / High)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (egfr >= 60) return { stage: "Stage 2 (Mild Reduction)", color: "text-teal-700 bg-teal-50 border-teal-200" };
    if (egfr >= 45) return { stage: "Stage 3a (Mild-Moderate)", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (egfr >= 30) return { stage: "Stage 3b (Moderate-Severe)", color: "text-orange-700 bg-orange-50 border-orange-200" };
    if (egfr >= 15) return { stage: "Stage 4 (Severe CKD)", color: "text-rose-700 bg-rose-50 border-rose-200" };
    return { stage: "Stage 5 (Kidney Failure)", color: "text-rose-900 bg-rose-100 border-rose-300" };
  };

  const ckd = getCkdStage(patient.eGfr);

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{patient.name}</h2>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-200 text-slate-700">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {patient.age}y • {patient.sex} • Weight: {patient.weightKg} kg
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 space-y-5 overflow-y-auto flex-1">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Renal Function Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <Droplet className="w-3.5 h-3.5 text-teal-600" />
                <span>Renal Function</span>
              </div>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-slate-900">{patient.eGfr}</span>
                <span className="text-[11px] text-slate-500 font-medium">mL/min/1.73m²</span>
              </div>
              <div className={`mt-2 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${ckd.color}`}>
                {ckd.stage}
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Serum Cr: {patient.creatinineMgDl} mg/dL</p>
            </div>

            {/* Pregnancy / Alert Status */}
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Pregnancy Status</span>
              </div>
              <div className="mt-2">
                <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${
                  patient.pregnancyStatus === "Positive"
                    ? "bg-rose-50 text-rose-700 border-rose-300"
                    : "bg-slate-100 text-slate-700 border-slate-200"
                }`}>
                  {patient.pregnancyStatus}
                </span>
              </div>
              <div className="mt-3">
                <span className="text-[10px] text-slate-400 block font-medium">Recorded Severity</span>
                <span className={`inline-block mt-0.5 text-xs font-semibold ${
                  patient.highestAlertSeverity === "Critical" ? "text-rose-600" :
                  patient.highestAlertSeverity === "High" ? "text-amber-600" : "text-emerald-600"
                }`}>
                  {patient.highestAlertSeverity} Alert Level
                </span>
              </div>
            </div>
          </div>

          {/* Clinical Diagnoses */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Recorded Diagnoses & Conditions
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {patient.diagnoses.map((diag, i) => (
                <span 
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 border border-slate-200 text-slate-800"
                >
                  {diag}
                </span>
              ))}
            </div>
          </div>

          {/* Known Allergies */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Known Drug Allergies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {patient.knownAllergies.map((all, i) => (
                <span 
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                  <span>{all}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Active Regimen */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Medication Regimen ({patient.currentMedications.length})
              </h3>
              <span className="text-[11px] text-teal-600 font-semibold">Formulary Verified</span>
            </div>

            <div className="space-y-2">
              {patient.currentMedications.map((med, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                      <Pill className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{med.genericName}</p>
                      <p className="text-[11px] text-slate-500">
                        {med.strength} • {med.route} • {med.frequency}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-600">
                    Dose: {med.dose}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center gap-3">
          <button
            onClick={() => {
              onStartReview(patient);
              onClose();
            }}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-xs"
            id="launch-patient-review-btn"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Load into Medication Safety Review</span>
          </button>
        </div>

      </div>
    </div>
  );
}
