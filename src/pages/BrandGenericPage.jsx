/**
 * MediGuard AI - Medication Matching & Identity Resolver (Page 5)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info, 
  Server, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Layers 
} from 'lucide-react';
import { normalizeMedication } from '../services/apiClient.js';
import { resolveMedicineName as resolveLocal } from '../services/aliasMatcher.js';
import { SAMPLE_SEARCH_PRESETS } from '../data/aliasMap.js';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function BrandGenericPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("Metfornin");
  const [resolution, setResolution] = useState(() => resolveLocal("Metfornin"));
  const [loading, setLoading] = useState(false);
  const [confirmedMappings, setConfirmedMappings] = useState({});
  const [rejectedMappings, setRejectedMappings] = useState({});

  useEffect(() => {
    let isCancelled = false;
    if (!searchTerm || !searchTerm.trim()) {
      setResolution(null);
      return;
    }

    setLoading(true);
    normalizeMedication(searchTerm).then(res => {
      if (!isCancelled) {
        setResolution(res);
        setLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [searchTerm]);

  const handleConfirm = (term, generic) => {
    setConfirmedMappings(prev => ({ ...prev, [term.toLowerCase()]: generic }));
    setRejectedMappings(prev => {
      const copy = { ...prev };
      delete copy[term.toLowerCase()];
      return copy;
    });
  };

  const handleReject = (term) => {
    setRejectedMappings(prev => ({ ...prev, [term.toLowerCase()]: true }));
    setConfirmedMappings(prev => {
      const copy = { ...prev };
      delete copy[term.toLowerCase()];
      return copy;
    });
  };

  const isConfirmed = resolution && confirmedMappings[resolution.enteredTerm?.toLowerCase()];
  const isRejected = resolution && rejectedMappings[resolution.enteredTerm?.toLowerCase()];
  const isAmbiguousOrUnresolved = resolution && (resolution.matchType === "Unresolved" || !resolution.genericName || resolution.confidence < 70);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('brandGeneric.title')}</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              5-Tier Resolution Engine
            </span>
          </div>

          {resolution?.source && (
            <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1.5 w-fit">
              <Server className="w-3.5 h-3.5 text-teal-600" />
              <span>Engine: {resolution.source}</span>
            </span>
          )}
        </div>

        <p className="text-xs text-slate-500 mt-1">
          {t('brandGeneric.subtitle')}
        </p>

        {/* 5-Tier Matching Hierarchy Visual Bar */}
        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
          <div className="p-1.5 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">1. Exact Generic</span>
            <span className="text-[10px] text-slate-400">Canonical INN match</span>
          </div>
          <div className="p-1.5 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">2. Exact Brand</span>
            <span className="text-[10px] text-slate-400">Official trade name</span>
          </div>
          <div className="p-1.5 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">3. Combination</span>
            <span className="text-[10px] text-slate-400">Expands ingredients</span>
          </div>
          <div className="p-1.5 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">4. Fuzzy Levenshtein</span>
            <span className="text-[10px] text-slate-400">Controlled typo check</span>
          </div>
          <div className="p-1.5 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-700 block">5. Ambiguous / Flag</span>
            <span className="text-[10px] text-slate-400">Clinician verification</span>
          </div>
        </div>

        {/* Clinical Safety Directive */}
        <div className="mt-4 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong>{t('brandGeneric.safetyDirective')}</strong> {t('brandGeneric.safetyDirectiveText')}
          </div>
        </div>
      </div>

      {/* Interactive Search Tool */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Test Medicine Search (Brand, Generic, or Misspelling):
          </label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type any medicine name or misspelling (e.g. Metfornin, Coumadin, Lipitor, Augmentin, Paracetmol)..."
              className="w-full pl-10 pr-24 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              id="brand-generic-search-input"
            />
            {loading && (
              <span className="text-[11px] text-teal-600 font-semibold absolute right-3.5 top-1/2 -translate-y-1/2">
                Resolving...
              </span>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
            Try Sample Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_SEARCH_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => setSearchTerm(p.query)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  searchTerm.toLowerCase() === p.query.toLowerCase()
                    ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title={p.note}
              >
                <span>{p.query}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resolution Output Card */}
      {resolution && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Identity Match Output:
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              resolution.confidence >= 90 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : resolution.confidence >= 70 
                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
            }`}>
              {resolution.confidence}% Confidence ({resolution.matchType})
            </span>
          </div>

          <div className="p-6 space-y-4">
            
            {/* Unresolved / Ambiguous Alert Banner (Part 11) */}
            {isAmbiguousOrUnresolved && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <strong>Unresolved Medicine Identity:</strong> Medicine identity requires confirmation. Safety evaluation may be incomplete until the medicine is resolved.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Entered Term Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Entered Prescription Term
                </span>
                <div className="text-lg font-black text-slate-900 mt-1">
                  "{resolution.enteredTerm}"
                </div>
                <p className="text-xs text-slate-500 mt-1">Raw input as transcribed in prescription</p>
              </div>

              {/* Resolved Target Card */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Suggested Formulary Target
                </span>
                <div className="text-lg font-black text-teal-950 mt-1">
                  {resolution.genericName || "Unresolved"}
                </div>
                {resolution.isCombination && resolution.combinationIngredients && resolution.combinationIngredients.length > 0 && (
                  <div className="text-xs text-indigo-900 bg-indigo-50 border border-indigo-200 p-2 rounded-lg mt-2 font-medium">
                    <span className="font-bold">Official Combination Ingredients:</span> {resolution.combinationIngredients.join(" + ")}
                  </div>
                )}
                <div className="text-xs text-teal-800 mt-1 flex items-center justify-between">
                  <span>Class: {resolution.drugClass}</span>
                  <span className="font-mono text-[11px]">RxNorm: {resolution.rxNormId}</span>
                </div>
              </div>

            </div>

            {/* Explainable Rationale */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-teal-600" />
                <span>Mapping Rationale:</span>
              </div>
              <p className="leading-relaxed">
                {resolution.reasoning}
              </p>
            </div>

            {/* Candidate Alternatives Considered */}
            {resolution.suggestedAlternatives && resolution.suggestedAlternatives.length > 0 && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Candidate Alternatives Considered by Engine:</span>
                </span>
                <div className="flex flex-wrap gap-2">
                  {resolution.suggestedAlternatives.map((alt, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs text-slate-700 font-medium">
                      {alt.genericName} &bull; <strong className="text-teal-700">{alt.confidence}%</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Human Confirmation Section (Part 7) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {resolution.requiresConfirmation 
                    ? "⚠️ Human Confirmation Mandatory" 
                    : "Formulary Mapping Status"}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {isConfirmed 
                    ? `Mapping confirmed by clinician as '${resolution.genericName}'. Active for review.` 
                    : isRejected 
                      ? `Mapping rejected by clinician. Term will remain unmapped.` 
                      : resolution.requiresConfirmation 
                        ? `Confidence is below safety threshold or typo detected. Clinician must verify before safety engine accepts this drug.` 
                        : "High confidence reference match."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleReject(resolution.enteredTerm)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isRejected 
                      ? 'bg-rose-600 text-white' 
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                  id="reject-mapping-btn"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>{isRejected ? "Rejected (Unmapped)" : "Reject Match"}</span>
                </button>

                <button
                  onClick={() => handleConfirm(resolution.enteredTerm, resolution.genericName)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer ${
                    isConfirmed 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-teal-600 hover:bg-teal-700 text-white'
                  }`}
                  id="confirm-mapping-btn"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isConfirmed ? "Confirmed (Active)" : "Confirm Identity"}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
