/**
 * MediGuard AI - Clinical Audit History & Compliance Trail (Page 7)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState } from 'react';
import { 
  Download, 
  Clock, 
  X
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function AuditHistoryPage({ auditLogs }) {
  const { t } = useTranslation();
  const [selectedAuditLog, setSelectedAuditLog] = useState(null);

  // Export full audit history as CSV
  const handleExportAuditCSV = () => {
    const headers = [
      "Audit_ID",
      "Timestamp",
      "Patient_ID",
      "Patient_Name",
      "Medications_Reviewed",
      "Alerts_Raised_Count",
      "Highest_Severity",
      "Reviewer_Action",
      "Reviewer_Notes",
      "Triggered_Rules",
      "Session_Hash"
    ];

    const rows = auditLogs.map(log => [
      `"${log.id}"`,
      `"${log.timestamp}"`,
      `"${log.patientId}"`,
      `"${log.patientName}"`,
      `"${(log.medicinesReviewed || []).join("; ")}"`,
      log.alertsRaisedCount,
      `"${log.highestSeverity}"`,
      `"${log.reviewerAction}"`,
      `"${(log.reviewerNotes || '').replace(/"/g, '""')}"`,
      `"${(log.triggeredRules || []).join("; ")}"`,
      `"${log.sessionHash || 'DEMO'}"`
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MediGuard_Audit_History_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">{t('audit.title')}</h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              {t('audit.browserSessionTrail')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t('audit.subtitle')}
          </p>
        </div>

        <button
          onClick={handleExportAuditCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-2xs shrink-0 cursor-pointer"
          id="export-audit-csv-btn"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('audit.exportCsv')}</span>
        </button>
      </div>

      {/* Session Storage Notice */}
      <div className="p-3.5 rounded-xl bg-slate-100/90 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Records are persisted in local browser session memory for hackathon demonstration.</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Total Entries: {auditLogs.length}</span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Audit ID & Time</th>
                <th className="py-3 px-3">Event Provenance</th>
                <th className="py-3 px-3">Patient Record</th>
                <th className="py-3 px-3">Medications Reviewed</th>
                <th className="py-3 px-3">Alerts Raised</th>
                <th className="py-3 px-3">Reviewer Action</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Inspection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {auditLogs.map((log) => {
                const isDemoSeed = log.isDemoSeed ?? (log.sessionHash?.includes("DEMO") || log.id?.startsWith("AUD-2026-00"));
                const severityBadge = {
                  Critical: "bg-rose-50 text-rose-700 border-rose-200",
                  High: "bg-amber-50 text-amber-700 border-amber-200",
                  Moderate: "bg-yellow-50 text-yellow-800 border-yellow-200",
                  None: "bg-emerald-50 text-emerald-700 border-emerald-200",
                }[log.highestSeverity] || "bg-slate-50 text-slate-700 border-slate-200";

                return (
                  <tr 
                    key={log.id} 
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => setSelectedAuditLog(log)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 group-hover:text-teal-700">
                        {log.id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{log.timestamp}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${
                        isDemoSeed 
                          ? 'bg-amber-50 text-amber-800 border-amber-200' 
                          : 'bg-teal-50 text-teal-800 border-teal-200'
                      }`}>
                        {isDemoSeed ? '🧪 Demo Fixture Event' : '📝 Recorded Review'}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-800">{log.patientName}</div>
                      <div className="text-[10px] font-mono text-slate-400">{log.patientId}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-slate-700 line-clamp-1 max-w-[200px]">
                        {(log.medicinesReviewed || []).join(", ")}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {log.medicinesReviewed?.length || 0} drugs evaluated
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{log.alertsRaisedCount}</span>
                        <span className={`px-2 py-0.2 rounded text-[10px] font-bold border ${severityBadge}`}>
                          {log.highestSeverity}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="font-medium text-slate-800 block line-clamp-1">
                        {log.reviewerAction}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{log.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedAuditLog(log)}
                        className="px-2.5 py-1.5 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Detail Drawer / Modal */}
      {selectedAuditLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          <div 
            onClick={() => setSelectedAuditLog(null)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                  {selectedAuditLog.id}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">Audit Record Snapshot</h3>
                <p className="text-xs text-slate-500">{selectedAuditLog.timestamp}</p>
              </div>
              <button 
                onClick={() => setSelectedAuditLog(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto text-xs text-slate-700 flex-1">
              {/* Patient and session */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient:</span>
                  <span className="font-bold text-slate-900">{selectedAuditLog.patientName} ({selectedAuditLog.patientId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Clinical Parameters:</span>
                  <span>Age: {selectedAuditLog.clinicalSnapshot?.age}y • eGFR: {selectedAuditLog.clinicalSnapshot?.eGfr} mL/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Session Integrity:</span>
                  <span className="font-mono text-teal-700">{selectedAuditLog.sessionHash}</span>
                </div>
              </div>

              {/* Reviewed Medicines */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Evaluated Regimen:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedAuditLog.medicinesReviewed || []).map((m, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 font-semibold text-slate-800">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {/* Triggered Rules */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Triggered Safety Rule Codes:
                </span>
                <div className="space-y-1">
                  {(selectedAuditLog.triggeredRules || []).map((rule, i) => (
                    <div key={i} className="p-2 rounded-lg bg-rose-50 border border-rose-200 font-mono text-rose-800 text-[11px]">
                      {rule}
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviewer Action & Notes */}
              <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 space-y-1">
                <span className="font-bold text-teal-950 block">Clinician Review Decision:</span>
                <p className="font-semibold text-teal-800">{selectedAuditLog.reviewerAction}</p>
                <p className="text-slate-700 mt-1 italic">
                  "{selectedAuditLog.reviewerNotes}"
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedAuditLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-xs transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
