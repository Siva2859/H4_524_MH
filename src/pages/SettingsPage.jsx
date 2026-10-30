/**
 * MediGuard AI - Settings & Hackathon System Specifications (Page 8)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState } from 'react';
import { 
  RotateCcw, 
  Server, 
  Cpu, 
  Sparkles,
  Globe,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function SettingsPage({ onResetDemo, currentMember }) {
  const { t, language, setLanguage, languages } = useTranslation();
  const [sensitivityMode, setSensitivityMode] = useState("Standard");
  const [suppressTrivial, setSuppressTrivial] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    onResetDemo();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">{t('settings.title')}</h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            {t('settings.systemSpecs')}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Language & Regional Localization Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-sm border-b border-slate-100 pb-3">
          <Globe className="w-4 h-4 text-teal-600" />
          <span>{t('settings.cardLangTitle')}</span>
        </div>

        <p className="text-xs text-slate-600">
          {t('settings.cardLangSub')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {languages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 text-teal-950 font-bold'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{lang.flag}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{lang.nativeName}</div>
                  <div className="text-xs text-slate-500">{lang.name}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-[11px] text-amber-900">
          <strong>Safety Protection Directive:</strong> Generic medicine names, brand names, active ingredients, dosages, and rule codes remain untouched to safeguard clinical accuracy.
        </div>
      </div>

      {/* Project & Team Metadata Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-teal-800 font-bold text-sm border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-teal-600" />
          <span>{t('settings.cardMemberTitle')}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Problem Statement:</span>
              <span className="font-bold text-slate-900">H4: The Medication Safety Second Pair of Eyes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Project Name:</span>
              <span className="font-bold text-teal-700">MediGuard AI</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('settings.activeMember')}</span>
              <span className="font-bold text-slate-900">{currentMember?.name || "Dr. Sarah Jenkins"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{t('settings.clinicalRole')}</span>
              <span className="font-bold text-teal-700">{currentMember?.role || "Clinical Pharmacist"}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Frontend Architecture:</span>
              <span className="font-semibold text-slate-800">React 19 + Vite 8 + Tailwind CSS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Decision Engine:</span>
              <span className="font-semibold text-slate-800">Deterministic Explainable Client Rule Engine</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Multilingual Support:</span>
              <span className="font-semibold text-teal-700">English, Telugu (తెలుగు), Hindi (हिन्दी)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Regulatory Status:</span>
              <span className="font-semibold text-slate-700">Pre-clinical Hackathon Prototype</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Integration Blueprint */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <Server className="w-4 h-4 text-teal-600" />
          <span>{t('settings.backendTitle')}</span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t('settings.backendDesc')}
        </p>

        <div className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto space-y-1">
          <div className="text-slate-500"># Future FastAPI integration endpoint</div>
          <div className="text-emerald-400">POST http://localhost:8000/api/v1/safety-review</div>
          <div className="text-slate-400">Content-Type: application/json</div>
          <div className="text-amber-300">
            {`{ "patient_id": "SYN-PT-1042", "egfr": 28, "medications": [{ "name": "Warfarin", "dose": "4mg" }] }`}
          </div>
        </div>
      </div>

      {/* Engine Calibration & Demo Reset */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-slate-100 pb-3">
          <Cpu className="w-4 h-4 text-teal-600" />
          <span>Engine Calibration & State Controls</span>
        </div>

        <div className="space-y-3 text-xs">
          {/* Sensitivity Setting */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-900">Rule Engine Sensitivity</p>
              <p className="text-slate-500 text-[11px]">Control how aggressively borderline pharmacokinetic interactions are tiered</p>
            </div>
            <select
              value={sensitivityMode}
              onChange={(e) => setSensitivityMode(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-800"
            >
              <option value="Standard">Standard Clinical Screening</option>
              <option value="Strict">Strict / Inpatient ICU Sensitivity</option>
            </select>
          </div>

          {/* Alert Fatigue Suppressor */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold text-slate-900">Alert Fatigue Filter</p>
              <p className="text-slate-500 text-[11px]">Suppress low-priority informational popups to avoid EHR clinician desensitization</p>
            </div>
            <input
              type="checkbox"
              checked={suppressTrivial}
              onChange={(e) => setSuppressTrivial(e.target.checked)}
              className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 cursor-pointer"
            />
          </div>

          {/* Reset Demo State */}
          <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-rose-900">{t('settings.resetSessionTitle')}</p>
              <p className="text-rose-700 text-[11px]">
                {t('settings.resetSessionDesc')}
              </p>
            </div>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0 cursor-pointer"
              id="reset-demo-action-btn"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{resetSuccess ? "Reset Applied!" : t('settings.resetBtn')}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
