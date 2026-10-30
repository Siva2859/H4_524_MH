/**
 * MediGuard AI - Patient Records (Page 2)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Droplet, 
  Play,
  User,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ArrowRight,
  Filter
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function PatientsPage({ 
  patients = [], 
  auditLogs = [],
  onSelectPatient, 
  onStartReview,
  appMode = 'demo',
  initialStatusFilter = "ALL",
  initialSeverityFilter = "ALL",
  onNavigate
}) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState(initialSeverityFilter);
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [ageFilter, setAgeFilter] = useState("ALL");

  const isOfficialMode = appMode === 'official';

  // Synchronize when parent navigation triggers specific filter views (e.g. from Dashboard cards)
  useEffect(() => {
    if (initialStatusFilter) {
      setStatusFilter(initialStatusFilter);
    }
  }, [initialStatusFilter]);

  useEffect(() => {
    if (initialSeverityFilter) {
      setSeverityFilter(initialSeverityFilter);
    }
  }, [initialSeverityFilter]);

  // Filter patients safely based on user controls
  const filteredPatients = useMemo(() => {
    return patients.filter((pt) => {
      const term = searchTerm.toLowerCase().trim();
      
      // Text search across ID, Name, Diagnoses, and Medications
      const name = pt.name?.toLowerCase() || "";
      const id = pt.id?.toLowerCase() || "";
      const diagStr = Array.isArray(pt.diagnoses) 
        ? pt.diagnoses.join(" ").toLowerCase() 
        : (pt.diagnoses?.toLowerCase() || "");
      const medsStr = (pt.currentMedications || [])
        .map(m => (m.genericName || m.name || "").toLowerCase())
        .join(" ");

      const matchesSearch = !term || name.includes(term) || id.includes(term) || diagStr.includes(term) || medsStr.includes(term);
      if (!matchesSearch) return false;

      // Severity filter
      const sev = (pt.highestAlertSeverity || "None").toLowerCase();
      if (severityFilter !== "ALL" && sev !== severityFilter.toLowerCase()) {
        return false;
      }

      // Status filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "Reviewed") {
          const isReviewed = pt.reviewStatus === "Reviewed" || pt.reviewStatus === "Reviewed (Demo)";
          if (!isReviewed) return false;
        } else if (statusFilter === "Pending Review") {
          const isPending = pt.reviewStatus === "Pending Review" || !pt.reviewStatus;
          if (!isPending) return false;
        } else if (statusFilter === "Reviewed (Demo)") {
          if (pt.reviewStatus !== "Reviewed (Demo)") return false;
        } else if (pt.reviewStatus !== statusFilter) {
          return false;
        }
      }

      // Age bracket filter
      const age = pt.age || 0;
      if (ageFilter === "ELDERLY" && age < 65) return false;
      if (ageFilter === "ADULT" && (age < 18 || age >= 65)) return false;
      if (ageFilter === "PED" && age >= 18) return false;

      return true;
    });
  }, [patients, searchTerm, severityFilter, statusFilter, ageFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Top Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('patients.title')}</h1>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
              isOfficialMode 
                ? 'bg-indigo-50 text-indigo-800 border-indigo-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {isOfficialMode ? t('patients.datasetBadgeOfficial') : t('patients.datasetBadgeDemo')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {t('patients.subtitle')}
          </p>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {t('patients.showingCount', { count: filteredPatients.length, total: patients.length })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('patients.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            id="patient-search-input"
          />
        </div>

        {/* Severity Filter */}
        <div>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-500"
            id="severity-filter-select"
          >
            <option value="ALL">{t('patients.allSeverities')}</option>
            <option value="Critical">{t('patients.criticalOnly')}</option>
            <option value="High">{t('patients.highOnly')}</option>
            <option value="Moderate">{t('patients.moderateOnly')}</option>
            <option value="None">{t('patients.noneOnly')}</option>
          </select>
        </div>

        {/* Review Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-500 font-medium"
            id="status-filter-select"
          >
            <option value="ALL">{t('patients.allStatuses')}</option>
            <option value="Reviewed">{t('patients.reviewedFilter')}</option>
            <option value="Pending Review">{t('patients.pendingFilter')}</option>
            <option value="Reviewed (Demo)">{t('patients.demoSeedFilter')}</option>
          </select>
        </div>

        {/* Age Bracket Filter */}
        <div>
          <select
            value={ageFilter}
            onChange={(e) => setAgeFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-500"
            id="age-filter-select"
          >
            <option value="ALL">{t('patients.allAges')}</option>
            <option value="ELDERLY">{t('patients.elderly')}</option>
            <option value="ADULT">{t('patients.adults')}</option>
            <option value="PED">{t('patients.pediatric')}</option>
          </select>
        </div>

      </div>

      {/* Active Filter Callout */}
      {(statusFilter !== "ALL" || severityFilter !== "ALL" || ageFilter !== "ALL" || searchTerm) && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-teal-50/70 border border-teal-200 rounded-xl text-xs text-teal-900">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-teal-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-teal-600" />
              <span>Active Filter:</span>
            </span>
            {statusFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-teal-300 font-bold text-teal-900 text-[11px] shadow-2xs">
                Status: {statusFilter === "Reviewed" ? "Reviewed Patients" : statusFilter}
              </span>
            )}
            {severityFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-teal-300 font-bold text-teal-900 text-[11px] shadow-2xs">
                Severity: {severityFilter}
              </span>
            )}
            {ageFilter !== "ALL" && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-teal-300 font-bold text-teal-900 text-[11px] shadow-2xs">
                Age: {ageFilter}
              </span>
            )}
            {searchTerm && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-white border border-teal-300 font-bold text-teal-900 text-[11px] shadow-2xs">
                Search: "{searchTerm}"
              </span>
            )}
            <span className="text-slate-500 text-[11px]">({filteredPatients.length} matching)</span>
          </div>
          <button
            onClick={() => {
              setStatusFilter("ALL");
              setSeverityFilter("ALL");
              setAgeFilter("ALL");
              setSearchTerm("");
            }}
            className="text-[11px] font-bold text-teal-700 hover:text-teal-900 underline cursor-pointer ml-auto"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Helpful shortcut if viewing reviewed patients */}
      {statusFilter === "Reviewed" && onNavigate && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>Looking for session audit history with decisions & rationale?</span>
          </div>
          <button
            onClick={() => onNavigate('audit')}
            className="font-bold text-indigo-700 hover:text-indigo-900 underline inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Open Audit History Dashboard ({auditLogs.length} events)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Patient Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="py-3.5 px-4">Patient ID & Name</th>
                <th className="py-3.5 px-4">Demographics</th>
                <th className="py-3.5 px-4">Kidney eGFR</th>
                <th className="py-3.5 px-4">Prescribed Medicines</th>
                <th className="py-3.5 px-4">Review Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPatients.length > 0 ? (
                filteredPatients.map((pt) => {
                  const egfr = pt.eGfr ?? pt.eGFR;
                  const isSevereRenal = egfr !== null && egfr !== undefined && egfr < 30;
                  const medCount = pt.currentMedications?.length || 0;
                  const provenance = pt.dataSource || (isOfficialMode ? "Official H4 Dataset" : "Synthetic Demo");

                  return (
                    <tr key={pt.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & ID */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{pt.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-500 font-semibold">{pt.id}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                            provenance.includes("Official") 
                              ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            {provenance}
                          </span>
                        </div>
                      </td>

                      {/* Demographics */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <div>{pt.age} years &bull; {pt.sex || pt.gender}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Weight: {pt.weightKg || 'N/A'} kg</div>
                      </td>

                      {/* eGFR */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <Droplet className={`w-3.5 h-3.5 ${isSevereRenal ? 'text-rose-600' : 'text-teal-600'}`} />
                          <span className={`font-bold ${isSevereRenal ? 'text-rose-600' : 'text-slate-800'}`}>
                            {egfr !== null && egfr !== undefined ? `${egfr} mL/min` : 'Unrecorded'}
                          </span>
                        </div>
                        {isSevereRenal && (
                          <span className="text-[10px] text-rose-600 font-semibold block mt-0.5">
                            Severe Impairment (&lt;30)
                          </span>
                        )}
                      </td>

                      {/* Prescribed Medicines */}
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="font-bold text-slate-900">{medCount} medicines</span>
                        <div className="text-[10px] text-slate-400 truncate max-w-xs mt-0.5">
                          {(pt.currentMedications || []).map(m => m.genericName || m.name).slice(0, 3).join(", ")}
                          {medCount > 3 && ` +${medCount - 3} more`}
                        </div>
                      </td>

                      {/* Review Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          pt.reviewStatus === 'Reviewed (Demo)' || pt.reviewStatus === 'Reviewed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {pt.reviewStatus || 'Pending Review'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectPatient && onSelectPatient(pt)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                            title="Inspect full patient profile and history"
                          >
                            Details
                          </button>

                          <button
                            onClick={() => onStartReview && onStartReview(pt)}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                            title="Start guided medication safety review"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Review</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No patients match your search criteria ({searchTerm || 'None'}).
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
