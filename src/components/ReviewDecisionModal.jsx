/**
 * MediGuard AI - Clinician Review Decision Modal
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function ReviewDecisionModal({ 
  isOpen, 
  onClose, 
  reviewResult, 
  patientInfo, 
  onSubmitDecision 
}) {
  const { t } = useTranslation();
  const [actionChoice, setActionChoice] = useState("Flagged for Attending Review");
  const [clinicianNotes, setClinicianNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const actionOptions = [
    {
      value: "Flagged for Attending Review",
      label: "Flag for Attending Physician / Specialist Review",
      desc: "Escalate high-severity alerts for specialized clinical consensus."
    },
    {
      value: "Regimen Modified (Demo)",
      label: "Regimen Modified / Discontinued Offending Drug (Demo)",
      desc: "Record synthetic adjustment of offending dosage or combination."
    },
    {
      value: "Acknowledged - Benefit Outweighs Risk (Demo)",
      label: "Acknowledged Demo Alert - Benefit Outweighs Risk",
      desc: "Document clinical justification (e.g. strict monitoring protocol active)."
    },
    {
      value: "Verified Clear in Demo Rules",
      label: "Verified Clear in Available Demo Rules",
      desc: "Confirm absence of flagged interactions within the demo catalogue."
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const decisionRecord = {
      id: `AUD-DEMO-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleString(),
      patientId: patientInfo.id || patientInfo.patientId || "SYN-DEMO-RECORD",
      patientName: patientInfo.name || patientInfo.patientName || "Synthetic Patient",
      medicinesReviewed: (reviewResult.resolvedMedications || []).map(m => `${m.resolvedGeneric} ${m.dose || m.strength || ''}`.trim()),
      alertsRaisedCount: reviewResult.totalAlerts || 0,
      highestSeverity: reviewResult.hasCriticalAlerts ? "Critical" : reviewResult.hasHighAlerts ? "High" : (reviewResult.totalAlerts > 0 ? "Moderate" : "None"),
      reviewerAction: actionChoice,
      reviewerNotes: clinicianNotes || "Demo review recorded during hackathon evaluation session.",
      status: "Reviewed (Demo)",
      triggeredRules: (reviewResult.alerts || []).map(a => `${a.matchedRule || a.ruleCode}`),
      clinicalSnapshot: {
        age: reviewResult.clinicalContext?.age || patientInfo.age,
        eGfr: reviewResult.clinicalContext?.eGfr || patientInfo.eGfr,
        pregnancyStatus: reviewResult.clinicalContext?.pregnancyStatus || patientInfo.pregnancyStatus,
        diagnoses: reviewResult.clinicalContext?.diagnoses || patientInfo.diagnoses || []
      },
      sessionHash: `SHA256-DEMO-${Math.random().toString(16).substring(2, 10)}`
    };

    setTimeout(() => {
      onSubmitDecision(decisionRecord);
      setIsSubmitting(false);
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 no-print">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">{t('decisionModal.title')}</h2>
              <p className="text-xs text-slate-500">{t('decisionModal.subtitle')}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          
          {/* Important Notice */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
            <p className="font-semibold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Hackathon Prototype Compliance Notice</span>
            </p>
            <p className="mt-1 text-[11px] leading-relaxed">
              Marking this record updates the <strong>demo review state</strong>. This does not claim that an actual medical clinician performed an official legal sign-off.
            </p>
          </div>

          {/* Action Radio Group */}
          <div>
            <label className="block font-bold text-slate-800 mb-2">
              Select Review Outcome:
            </label>
            <div className="space-y-2">
              {actionOptions.map((opt) => (
                <label 
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    actionChoice === opt.value 
                      ? 'bg-teal-50 border-teal-300 ring-1 ring-teal-400' 
                      : 'hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="actionChoice"
                    value={opt.value}
                    checked={actionChoice === opt.value}
                    onChange={(e) => setActionChoice(e.target.value)}
                    className="mt-0.5 text-teal-600 focus:ring-teal-500"
                  />
                  <div>
                    <span className="font-semibold text-slate-900 block">{opt.label}</span>
                    <span className="text-[11px] text-slate-500 block mt-0.5">{opt.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Clinician Rationale Notes */}
          <div>
            <label className="block font-bold text-slate-800 mb-1">
              Reviewer Justification / Clinical Notes:
            </label>
            <textarea
              rows={3}
              value={clinicianNotes}
              onChange={(e) => setClinicianNotes(e.target.value)}
              placeholder="e.g., Warfarin + Aspirin combination flagged. Attending cardiologist notified to discontinue Aspirin or add PPI gastroprotection."
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100 text-xs text-slate-800 outline-none resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-xs"
              id="confirm-review-decision-btn"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Recording..." : "Save Review to Audit Log"}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
