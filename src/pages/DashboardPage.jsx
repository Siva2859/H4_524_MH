/**
 * MediGuard AI - Clinical Overview Dashboard (Page 1)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React from 'react';
import { 
  Users, 
  AlertTriangle, 
  AlertCircle,
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Info,
  Sparkles,
  Zap,
  ExternalLink
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function DashboardPage({ 
  patients = [], 
  auditLogs = [], 
  activeReview, 
  onSelectPatient, 
  onNavigate,
  onLoadDemoCase,
  appMode = 'demo'
}) {
  const { t, translateAlert } = useTranslation();
  // Compute metrics from actual state
  const isOfficialMode = appMode === 'official';
  const reviewedCount = patients.filter(p => p.reviewStatus === "Reviewed (Demo)" || p.reviewStatus === "Reviewed").length + auditLogs.length;
  const pendingReviews = patients.filter(p => p.reviewStatus === "Pending Review" || !p.reviewStatus).length;

  const activeAlerts = activeReview?.alerts || [];
  const criticalCount = activeReview?.severityCounts?.Critical || 0;
  const highCount = activeReview?.severityCounts?.High || 0;
  const moderateCount = activeReview?.severityCounts?.Moderate || 0;
  const lowCount = activeReview?.severityCounts?.Low || 0;
  const highPriorityAlertsCount = criticalCount + highCount;

  // Top unresolved alerts sorted by severity priority
  const severityOrder = { Critical: 0, High: 1, Moderate: 2, Low: 3 };
  const sortedAlerts = [...activeAlerts].sort((a, b) => {
    return (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99);
  });
  const topAlerts = sortedAlerts.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Welcome & Primary Actions Section (Part 4) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-tight mb-2.5 border bg-teal-50 text-teal-800 border-teal-200">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>{t('common.h4Badge')}</span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {t('dashboard.title')}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
              {t('dashboard.subtitle')}
            </p>
          </div>

          {/* Primary & Secondary Actions */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('review')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
              id="dashboard-start-review-btn"
            >
              <span>{t('common.startReview')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onLoadDemoCase && onLoadDemoCase('case-1')}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
              id="dashboard-demo-case-btn"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('common.exploreDemoCase')}</span>
            </button>
          </div>
        </div>

        {/* Active Inspection Strip */}
        {activeReview && (
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-bold text-slate-800">{t('common.currentlyEvaluated')}</span>
              <span className="font-semibold text-slate-900">{activeReview.clinicalContext?.patientName || "Patient"}</span>
              <span className="text-slate-400">•</span>
              <span>{t('common.medicinesChecked', { count: activeReview.medicationsCount || 0 })}</span>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1 text-slate-700 font-medium">
                {activeReview.totalAlerts === 0 ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> {t('common.noIssuesDetected')}
                  </span>
                ) : (
                  <span>
                    <strong className="text-rose-600">{criticalCount} Critical</strong>,{' '}
                    <strong className="text-amber-600">{highCount} High</strong>,{' '}
                    <strong className="text-yellow-700">{moderateCount} Moderate</strong>
                  </span>
                )}
              </span>
            </div>

            <button
              onClick={() => onNavigate('alerts')}
              className="inline-flex items-center gap-1 text-teal-700 font-bold hover:underline shrink-0"
            >
              <span>{t('common.viewFullReport')}</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Three Main Summary Cards (Part 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Card 1: Patients Reviewed */}
        <button
          type="button"
          onClick={() => onNavigate('patients', { statusFilter: 'Reviewed' })}
          className="w-full text-left bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 transition-all duration-200 hover:border-teal-400 hover:shadow-md hover:-translate-y-0.5 hover:bg-teal-50/20 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500/40 relative overflow-hidden"
          id="dashboard-stat-patients-reviewed"
          title="Click to open Patient Records dashboard filtered to Reviewed Patients"
          aria-label="View Reviewed Patients"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 group-hover:text-teal-700 transition-colors">
              {t('dashboard.patientsReviewed')}
            </span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-2xs">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 group-hover:text-teal-800 transition-colors">
              {reviewedCount}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isOfficialMode 
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {isOfficialMode ? 'H4 Dataset' : 'Synthetic Demo'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            {isOfficialMode 
              ? 'Official H4 cohort records screened through safety engine.'
              : t('dashboard.patientsReviewedSub')}
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-teal-700 group-hover:text-teal-800">
            <span>{t('dashboard.openPatients')}</span>
            <div className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>

        {/* Card 2: High-Priority Alerts */}
        <button
          type="button"
          onClick={() => onNavigate('alerts')}
          className="w-full text-left bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 transition-all duration-200 hover:border-rose-400 hover:shadow-md hover:-translate-y-0.5 hover:bg-rose-50/20 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/40 relative overflow-hidden"
          id="dashboard-stat-high-priority-alerts"
          title="Click to open Safety Alerts dashboard"
          aria-label="View High-Priority Alerts"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 group-hover:text-rose-700 transition-colors">
              {t('dashboard.highPriorityAlerts')}
            </span>
            <div className="p-1.5 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-all shadow-2xs">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-rose-600 group-hover:text-rose-700 transition-colors">
              {highPriorityAlertsCount}
            </span>
            <span className="text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded-full">
              {t('dashboard.actionRequired')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            {t('dashboard.highPriorityAlertsSub')}
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-rose-700 group-hover:text-rose-800">
            <span>{t('dashboard.openAlerts')}</span>
            <div className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>

        {/* Card 3: Pending Reviews */}
        <button
          type="button"
          onClick={() => onNavigate('patients', { statusFilter: 'Pending Review' })}
          className="w-full text-left bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2.5 transition-all duration-200 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5 hover:bg-amber-50/20 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 relative overflow-hidden"
          id="dashboard-stat-pending-reviews"
          title="Click to open Patient Records dashboard filtered to Pending Reviews"
          aria-label="View Pending Reviews"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs">
            <span className="font-bold uppercase tracking-wider text-[11px] text-slate-400 group-hover:text-amber-700 transition-colors">
              {t('dashboard.pendingReviews')}
            </span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-2xs">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 group-hover:text-amber-800 transition-colors">
              {pendingReviews}
            </span>
            <span className="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
              {t('dashboard.awaitingReview')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            {t('dashboard.pendingReviewsSub')}
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-amber-700 group-hover:text-amber-800">
            <span>{t('dashboard.reviewPending')}</span>
            <div className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </button>

      </div>

      {/* Main Operational Split: Alerts (Left) and Patient Reviews + Activity (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (7 Cols): Highest-Priority Unresolved Alerts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {t('dashboard.highestPriorityAlerts')}
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {t('dashboard.totalDetected', { count: activeAlerts.length })}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {topAlerts.length > 0 ? (
                topAlerts.map((alert) => {
                  const localized = translateAlert(alert);
                  const isCrit = alert.severity === 'Critical';
                  const isHigh = alert.severity === 'High';
                  const isMod = alert.severity === 'Moderate';

                  const badgeClass = isCrit
                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                    : isHigh
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : isMod
                    ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                    : 'bg-sky-50 text-sky-800 border-sky-200';

                  const IconComponent = isCrit ? AlertCircle : isHigh ? AlertTriangle : isMod ? AlertTriangle : Info;

                  return (
                    <div 
                      key={alert.id} 
                      onClick={() => onNavigate('alerts')}
                      className="p-4 hover:bg-slate-50/80 transition-colors space-y-2 cursor-pointer group"
                      title="Click to view alert in Safety Alerts report"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold border ${badgeClass}`}>
                            <IconComponent className="w-3 h-3" />
                            <span>{alert.severity} Priority</span>
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {localized.category || alert.category}
                          </span>
                        </div>

                        {alert.matchedRule && (
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                            Rule: {alert.matchedRule}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-teal-900 transition-colors">
                        {localized.title}
                      </h3>

                      {/* Drugs involved - NEVER translate drug names */}
                      {alert.involvedMedicines && alert.involvedMedicines.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                          <span className="text-slate-400 text-[11px]">{t('dashboard.drugsLabel')}</span>
                          {alert.involvedMedicines.map((m, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-semibold">
                              {m}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Localized clinical rationale */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {localized.whyFlagged}
                      </p>

                      {/* Action */}
                      <div className="pt-1 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-teal-800 font-medium">
                          {t('dashboard.promptLabel')} {localized.suggestedAction}
                        </span>
                        <span className="text-teal-700 group-hover:text-teal-900 font-bold inline-flex items-center gap-1 shrink-0 ml-2">
                          <span>{t('dashboard.reviewAlert')}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-8 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">{t('dashboard.noAlertsHeadline')}</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    {t('dashboard.noAlertsSub')}
                  </p>
                </div>
              )}
            </div>

            {topAlerts.length > 0 && (
              <div className="p-3 bg-slate-50/70 border-t border-slate-100 text-center">
                <button
                  onClick={() => onNavigate('alerts')}
                  className="text-xs font-bold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t('dashboard.viewAllAlerts', { count: activeAlerts.length })}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 Cols): Recent Patient Reviews & Recent Activity */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Recent Patient Reviews (Part 4) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t('dashboard.recentReviews')}
              </h2>
              <button
                onClick={() => onNavigate('patients')}
                className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
              >
                {t('dashboard.allPatients', { count: patients.length })}
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {patients.slice(0, 4).map((pt) => (
                <div 
                  key={pt.id} 
                  onClick={() => onSelectPatient && onSelectPatient(pt)}
                  className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer group"
                  title={`Click to inspect ${pt.name}`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 group-hover:text-teal-900 transition-colors truncate">{pt.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ID: {pt.id} &bull; {pt.age}y &bull; eGFR: {pt.eGfr ?? pt.eGFR ?? 'N/A'} mL/min
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {pt.currentMedications?.length || 0} medications prescribed
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      pt.reviewStatus === 'Reviewed (Demo)' || pt.reviewStatus === 'Reviewed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {pt.reviewStatus || 'Pending'}
                    </span>
                    <span className="block text-[11px] font-semibold text-teal-700 group-hover:underline mt-1">
                      {t('dashboard.inspectProfile')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Trail (Part 4) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{t('dashboard.recentActivity')}</span>
              </h2>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
              >
                {t('dashboard.fullAudit', { count: auditLogs.length })}
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {patients.slice(0, 4).map((pt) => (
                <div 
                  key={pt.id} 
                  onClick={() => onSelectPatient && onSelectPatient(pt)}
                  className="p-3.5 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3 text-xs cursor-pointer group"
                  title={`Click to inspect ${pt.name}`}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-slate-900 group-hover:text-teal-900 transition-colors truncate">{pt.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      ID: {pt.id} &bull; {pt.age}y &bull; eGFR: {pt.eGfr ?? pt.eGFR ?? 'N/A'} mL/min
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {pt.currentMedications?.length || 0} medications prescribed
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                      pt.reviewStatus === 'Reviewed (Demo)' || pt.reviewStatus === 'Reviewed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {pt.reviewStatus || 'Pending'}
                    </span>
                    <span className="block text-[11px] font-semibold text-teal-700 group-hover:underline mt-1">
                      Inspect Profile &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity Trail (Part 4) */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Clinician Activity</span>
              </h2>
              <button
                onClick={() => onNavigate('audit')}
                className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
              >
                Full Audit ({auditLogs.length})
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {auditLogs.slice(0, 3).map((log) => (
                <div 
                  key={log.id} 
                  onClick={() => onNavigate('audit')}
                  className="p-3.5 text-xs space-y-1 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  title="Click to view full Clinical Audit History dashboard"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-800 group-hover:text-teal-900 transition-colors">{log.patientName || log.patientId}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-snug">
                    <strong className="text-slate-900">{log.action}:</strong> {log.summary || log.rationale}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>Decision: <strong className="text-teal-700">{log.decision}</strong></span>
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 font-medium group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                      View Audit Trail &rarr;
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
