/**
 * MediGuard AI - Explainable Alert Detail Modal
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React from 'react';
import { 
  X, 
  AlertTriangle, 
  ShieldAlert, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function AlertDetailModal({ alert, isOpen, onClose, onTakeAction }) {
  const { t, translateAlert } = useTranslation();
  if (!isOpen || !alert) return null;

  const localized = translateAlert(alert);

  const severityStyles = {
    Critical: {
      badge: "bg-rose-600 text-white",
      border: "border-rose-300",
      bgLight: "bg-rose-50",
      textColor: "text-rose-900",
      iconColor: "text-rose-600"
    },
    High: {
      badge: "bg-amber-600 text-white",
      border: "border-amber-300",
      bgLight: "bg-amber-50",
      textColor: "text-amber-900",
      iconColor: "text-amber-600"
    },
    Moderate: {
      badge: "bg-yellow-500 text-slate-900",
      border: "border-yellow-300",
      bgLight: "bg-yellow-50",
      textColor: "text-yellow-900",
      iconColor: "text-yellow-600"
    },
    Low: {
      badge: "bg-sky-600 text-white",
      border: "border-sky-300",
      bgLight: "bg-sky-50",
      textColor: "text-sky-900",
      iconColor: "text-sky-600"
    }
  }[alert.severity] || {
    badge: "bg-slate-600 text-white",
    border: "border-slate-300",
    bgLight: "bg-slate-50",
    textColor: "text-slate-900",
    iconColor: "text-slate-600"
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 no-print">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className={`p-5 border-b flex items-start justify-between ${severityStyles.bgLight} ${severityStyles.border}`}>
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-xl bg-white shadow-2xs ${severityStyles.iconColor}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${severityStyles.badge}`}>
                  {alert.severity} Severity
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-slate-300 text-slate-700">
                  {localized.category || alert.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  {t('alerts.ruleCode')} {alert.matchedRule || alert.ruleCode}
                </span>
              </div>
              <h2 className={`text-base font-bold leading-snug ${severityStyles.textColor}`}>
                {localized.title}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs leading-relaxed text-slate-700">
          
          {/* Involved Medicines - protected drug names */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              {t('alerts.involvedDrugs')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {(alert.involvedMedicines || []).map((med, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 rounded-lg font-semibold bg-slate-100 border border-slate-200 text-slate-800 flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <span>{med}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Clinical Rationale: Why Flagged */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>{t('alerts.clinicalRationale')}</span>
            </div>
            <p className="text-slate-700 mt-1">
              {localized.whyFlagged}
            </p>
            {alert.mechanism && (
              <p className="text-slate-500 mt-2 text-[11px] border-t border-slate-200 pt-2 italic">
                <strong>Mechanism:</strong> {alert.mechanism}
              </p>
            )}
          </div>

          {/* Evidence Available & Match Certainty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-teal-600" />
                <span>{t('alerts.evidenceAndReference')}</span>
              </div>
              <p className="text-slate-600 text-[11px]">
                {alert.evidence || "Demo Reference (Illustrative consensus model)"}
              </p>
              <span className="inline-block mt-2 text-[10px] text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded">
                Ref: {alert.sourceReference || "SYNTH-H4-REF"}
              </span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>Match Certainty & Confidence</span>
              </div>
              <p className="text-slate-800 font-semibold text-sm">
                {alert.confidence}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Deterministic matching against synthetic formulary
              </p>
            </div>
          </div>

          {/* Suggested Prescriber Action */}
          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
            <div className="flex items-center gap-1.5 font-bold text-teal-950 mb-1">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <span>{t('alerts.recommendedAction')}</span>
            </div>
            <p className="text-teal-900 font-medium">
              {localized.suggestedAction}
            </p>
          </div>

          {/* Known Limitations */}
          <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900">
            <p>
              <strong>Demo Rule Limitations:</strong> {alert.limitations}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 italic">
            Illustrative rule: Not for real medical decisions.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              {t('common.close')}
            </button>
            <button
              onClick={() => {
                onTakeAction(alert);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-xs"
            >
              <span>{t('alerts.recordDecisionBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
