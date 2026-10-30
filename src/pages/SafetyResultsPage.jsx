/**
 * MediGuard AI - Explainable Safety Results Page (Page 4)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, 
  Download, 
  Printer, 
  CheckCircle2, 
  Filter, 
  Info, 
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  ChevronDown,
  Check,
  FileText
} from 'lucide-react';
import { exportReviewAsText, exportReviewAsCSV, printReviewReport } from '../services/reportExporter.js';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function SafetyResultsPage({ 
  reviewResult, 
  patientInfo,
  onOpenAlertDetail, 
  onOpenDecisionModal,
  onNavigateToWizard,
  initialSeverityFilter = "ALL"
}) {
  const { t, translateAlert } = useTranslation();
  const [severityFilter, setSeverityFilter] = useState(initialSeverityFilter);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showResolvedMeds, setShowResolvedMeds] = useState(false);
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [acknowledgedAlerts, setAcknowledgedAlerts] = useState({});

  React.useEffect(() => {
    if (initialSeverityFilter) {
      setSeverityFilter(initialSeverityFilter);
    }
  }, [initialSeverityFilter]);

  // Filter and sort alerts by official clinical severity order
  const filteredAlerts = useMemo(() => {
    if (!reviewResult?.alerts) return [];
    
    const severityRank = { Critical: 0, High: 1, Moderate: 2, Low: 3 };
    return reviewResult.alerts
      .filter(a => {
        if (severityFilter !== "ALL" && a.severity !== severityFilter) return false;
        if (categoryFilter !== "ALL" && a.category !== categoryFilter) return false;
        return true;
      })
      .sort((a, b) => (severityRank[a.severity] ?? 99) - (severityRank[b.severity] ?? 99));
  }, [reviewResult, severityFilter, categoryFilter]);

  // Toggle evidence expansion for a specific card
  const toggleEvidence = (id) => {
    setExpandedAlerts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle acknowledgment
  const toggleAcknowledge = (id) => {
    setAcknowledgedAlerts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Empty State: No active review executed (Part 11)
  if (!reviewResult) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4 shadow-2xs max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-800">
          No active medication review
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Select a patient or load a demo case to begin a medication safety review.
        </p>
        <button
          onClick={onNavigateToWizard}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold text-xs hover:bg-teal-700 transition-colors shadow-2xs cursor-pointer"
        >
          <span>Go to Medication Review Wizard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const hasNoAlerts = reviewResult.totalAlerts === 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Clinical Context Banner (Answers the 5 core questions) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('alerts.title')}</h1>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                H4 Dataset-Driven Rule Engine
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mt-1">
              Patient: <strong className="text-slate-800">{patientInfo?.name || reviewResult.clinicalContext?.patientName || "Patient Record"}</strong> • 
              Evaluated: {new Date(reviewResult.evaluatedAt || Date.now()).toLocaleTimeString()} • 
              <strong>{reviewResult.medicationsCount}</strong> medicines checked
            </p>
          </div>

          {/* Action Buttons: Export Text, CSV, Print, Record Decision */}
          <div className="flex flex-wrap items-center gap-2 no-print">
            <button
              onClick={() => exportReviewAsText(reviewResult, patientInfo)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              title="Download review report as plain text"
              id="export-text-btn"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('alerts.exportTxt')}</span>
            </button>

            <button
              onClick={() => exportReviewAsCSV(reviewResult, patientInfo)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              title="Download alert items as CSV"
              id="export-csv-btn"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('alerts.exportCsv')}</span>
            </button>

            <button
              onClick={printReviewReport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              title="Print clean review report"
              id="print-report-btn"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>{t('alerts.printReport')}</span>
            </button>

            <button
              onClick={onOpenDecisionModal}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              id="record-clinician-decision-btn"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t('alerts.recordDecisionBtn')}</span>
            </button>
          </div>
        </div>

        {/* Clinical Parameters Snapshot Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-4">
            <div>Age: <strong className="text-slate-900">{reviewResult.clinicalContext?.age}y</strong></div>
            <div>Weight: <strong className="text-slate-900">{reviewResult.clinicalContext?.weight} kg</strong></div>
            <div>
              eGFR:{' '}
              <strong className={reviewResult.clinicalContext?.eGfr < 30 ? "text-rose-600 font-bold" : "text-slate-900"}>
                {reviewResult.clinicalContext?.eGfr} mL/min
              </strong>
            </div>
            <div>Pregnancy: <strong className="text-slate-900">{reviewResult.clinicalContext?.pregnancyStatus}</strong></div>
            <div>Diagnoses: <strong className="text-slate-900">{reviewResult.clinicalContext?.diagnoses?.join(", ") || "None"}</strong></div>
          </div>

          <button
            onClick={() => setShowResolvedMeds(!showResolvedMeds)}
            className="text-teal-700 hover:text-teal-900 font-bold text-xs hover:underline cursor-pointer"
          >
            {showResolvedMeds ? "Hide Resolved Formularies" : "Inspect Resolved Formularies &rarr;"}
          </button>
        </div>

        {/* Resolved Medications Expansion Drawer */}
        {showResolvedMeds && (
          <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 animate-in fade-in duration-150">
            {(reviewResult.resolvedMedications || []).map((m, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-bold text-slate-900">{m.rawInput}</div>
                <div className={`text-[11px] mt-0.5 ${m.resolvedGeneric ? 'text-teal-800 font-semibold' : 'text-amber-800 font-bold'}`}>
                  &rarr; Mapped: {m.resolvedGeneric || "(Unresolved / Ambiguous)"} {m.drugClass ? `(${m.drugClass})` : ""}
                </div>
                {m.isCombination && m.combinationIngredients && m.combinationIngredients.length > 0 && (
                  <div className="text-[10px] text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded mt-1 font-semibold">
                    Combination: {m.combinationIngredients.join(" + ")}
                  </div>
                )}
                <div className="text-[10px] text-slate-400 mt-1 flex justify-between">
                  <span>Match: {m.confidence}% ({m.matchType})</span>
                  <span>RxNorm: {m.rxNormId || "N/A"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Severity Metric Tiers Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 no-print">
        
        {/* Critical */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-700 uppercase">
            <span>Critical Severity</span>
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-rose-600">{reviewResult.severityCounts.Critical}</div>
          <p className="text-[10px] text-slate-400">Immediate intervention urged</p>
        </div>

        {/* High */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-amber-700 uppercase">
            <span>High Severity</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-600">{reviewResult.severityCounts.High}</div>
          <p className="text-[10px] text-slate-400">Clinical adjustment recommended</p>
        </div>

        {/* Moderate */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-yellow-800 uppercase">
            <span>Moderate Severity</span>
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-600" />
          </div>
          <div className="text-2xl font-black text-yellow-700">{reviewResult.severityCounts.Moderate}</div>
          <p className="text-[10px] text-slate-400">Dose & interval monitoring</p>
        </div>

        {/* Low / Advisory */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-[11px] font-bold text-sky-700 uppercase">
            <span>Low / Advisory</span>
            <Info className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-700">{reviewResult.severityCounts.Low}</div>
          <p className="text-[10px] text-slate-400">Informational guidance note</p>
        </div>

      </div>

      {/* Filter and Prioritization Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold text-slate-700">Filter Alerts:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Severity selector */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-500"
            id="results-severity-filter"
          >
            <option value="ALL">All Severities ({reviewResult.totalAlerts})</option>
            <option value="Critical">Critical Only ({reviewResult.severityCounts.Critical})</option>
            <option value="High">High Only ({reviewResult.severityCounts.High})</option>
            <option value="Moderate">Moderate Only ({reviewResult.severityCounts.Moderate})</option>
            <option value="Low">Low Only ({reviewResult.severityCounts.Low})</option>
          </select>

          {/* Category selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-500"
            id="results-category-filter"
          >
            <option value="ALL">All Issue Categories</option>
            <option value="Drug-Drug Interaction">Drug-Drug Interactions</option>
            <option value="Duplicate Therapy">Duplicate Therapies</option>
            <option value="Kidney-Related Dose Concern">Kidney / Renal Concerns</option>
            <option value="Contraindication Flag">Contraindications</option>
            <option value="Uncertain Medication Identity">Uncertain Drug Name</option>
          </select>
        </div>
      </div>

      {/* ALERTS CONTAINER */}
      <div className="space-y-4">
        
        {/* CASE: NO ALERTS TRIGGERED (Part 11) */}
        {hasNoAlerts && (
          <div className="p-8 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-2xs">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-950">
                No supported safety alerts were detected by the current rules.
              </h3>
              <p className="text-xs text-emerald-800 max-w-xl mx-auto mt-1 leading-relaxed">
                MediGuard AI screened this regimen against interaction, duplication, renal cutoffs, and contraindication catalogue rules. 
                No matching safety conflicts were found.
              </p>
            </div>
            <div className="max-w-xl mx-auto p-3.5 rounded-xl bg-white/80 border border-emerald-300 text-[11px] text-emerald-950 leading-snug">
              <strong>Mandatory Safety Guard:</strong> This does not guarantee that the medication list is safe or complete. MediGuardAI is a decision-support prototype and does not replace a qualified clinician's judgment.
            </div>
          </div>
        )}

        {/* CASE: FILTER RETURNED ZERO */}
        {!hasNoAlerts && filteredAlerts.length === 0 && (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No safety alerts match the current filter selection ({severityFilter} / {categoryFilter}).
          </div>
        )}

        {/* RENDER REDESIGNED ALERT CARDS (Part 6) */}
        {filteredAlerts.map((alert) => {
          const localized = translateAlert(alert);
          const isCrit = alert.severity === 'Critical';
          const isHigh = alert.severity === 'High';
          const isMod = alert.severity === 'Moderate';

          const cardStyle = isCrit
            ? { border: 'border-rose-300', bg: 'bg-rose-50/40', badge: 'bg-rose-600 text-white', icon: AlertCircle, text: 'text-rose-950' }
            : isHigh
            ? { border: 'border-amber-300', bg: 'bg-amber-50/40', badge: 'bg-amber-600 text-white', icon: AlertTriangle, text: 'text-amber-950' }
            : isMod
            ? { border: 'border-yellow-300', bg: 'bg-yellow-50/40', badge: 'bg-yellow-500 text-slate-900', icon: AlertTriangle, text: 'text-yellow-950' }
            : { border: 'border-sky-300', bg: 'bg-sky-50/40', badge: 'bg-sky-600 text-white', icon: Info, text: 'text-sky-950' };

          const IconComp = cardStyle.icon;
          const isExpanded = !!expandedAlerts[alert.id];
          const isAck = !!acknowledgedAlerts[alert.id];

          return (
            <div 
              key={alert.id}
              className={`p-5 rounded-2xl border ${cardStyle.border} ${cardStyle.bg} shadow-2xs space-y-3.5 transition-all hover:shadow-xs`}
            >
              {/* Row A: Severity, Issue Category, Matched Rule Code */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${cardStyle.badge}`}>
                    <IconComp className="w-3 h-3" />
                    <span>{alert.severity} Priority</span>
                  </span>

                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-white border border-slate-200 text-slate-700">
                    {localized.category || alert.category}
                  </span>

                  {alert.matchedRule && (
                    <span className="text-[11px] font-mono text-slate-500 bg-white/70 px-2 py-0.5 rounded border border-slate-200">
                      Rule ID: {alert.matchedRule}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>{t('alerts.confidence')} <strong>{alert.confidence}</strong></span>
                  {isAck && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3 h-3 text-emerald-600" /> {t('alerts.acknowledged')}
                    </span>
                  )}
                </div>
              </div>

              {/* Row B & C: Short Alert Title & Medicines Involved */}
              <div>
                <h3 className={`text-base font-bold ${cardStyle.text}`}>
                  {localized.title}
                </h3>

                {/* Medicines Involved - protected from translation */}
                {alert.involvedMedicines && alert.involvedMedicines.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-500 mr-1">{t('alerts.involvedDrugs')}</span>
                    {alert.involvedMedicines.map((med, i) => (
                      <span 
                        key={i}
                        className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Row D: Clinical Explanation in Selected Language */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('alerts.clinicalRationale')}:</span>
                </div>
                <p className="leading-relaxed">
                  {localized.whyFlagged}
                </p>
              </div>

              {/* Row I: Suggested Clinician Review Action */}
              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-teal-900">{t('alerts.recommendedAction')}:</span>{" "}
                  <span>{localized.suggestedAction}</span>
                </div>
              </div>

              {/* Expandable Section: View Evidence and Rule Details (Part 6) */}
              <div className="pt-1">
                <button
                  onClick={() => toggleEvidence(alert.id)}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 inline-flex items-center gap-1 cursor-pointer"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  <span>{isExpanded ? t('alerts.hideEvidence') : t('alerts.viewEvidence')}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2.5 p-3.5 rounded-xl bg-white border border-slate-200 text-xs space-y-2 text-slate-700 animate-in fade-in duration-150">
                    {alert.evidence && (
                      <div>
                        <strong className="text-slate-900 block font-semibold mb-0.5">{t('alerts.evidenceAndReference')}:</strong>
                        <p className="text-[11px] leading-relaxed text-slate-600">{alert.evidence}</p>
                      </div>
                    )}

                    {alert.limitations && (
                      <div className="pt-2 border-t border-slate-100">
                        <strong className="text-slate-900 block font-semibold mb-0.5">{t('alerts.limitations')}</strong>
                        <p className="text-[11px] leading-relaxed text-slate-600">{alert.limitations}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Row Action Buttons: Acknowledge, Record Decision, View Details (Part 6) */}
              <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-[11px] text-slate-400 font-mono">
                  Priority Rank: {alert.severity}
                </span>

                <div className="flex items-center gap-2">
                  {/* Action 1: Acknowledge Alert */}
                  <button
                    onClick={() => toggleAcknowledge(alert.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      isAck 
                        ? 'bg-emerald-600 text-white border-emerald-600' 
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isAck ? t('alerts.acknowledged') : t('alerts.acknowledge')}</span>
                  </button>

                  {/* Action 2: Record Review Decision */}
                  <button
                    onClick={onOpenDecisionModal}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>Record Decision</span>
                  </button>

                  {/* Action 3: View Full Rule Details */}
                  <button
                    onClick={() => onOpenAlertDetail(alert)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    <span>View Rule Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}
