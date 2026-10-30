/**
 * MediGuard AI - Drug Reference Formulary (Page 6)
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  X, 
  Info 
} from 'lucide-react';
import { DRUG_CATALOGUE, DRUG_CLASSES } from '../data/drugReferenceCatalogue.js';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function DrugReferencePage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("All Classes");
  const [activeDrugModal, setActiveDrugModal] = useState(null);

  // Filtered catalogue
  const filteredDrugs = useMemo(() => {
    return DRUG_CATALOGUE.filter((drug) => {
      const matchesSearch = 
        drug.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.brandAliases.some(b => b.toLowerCase().includes(searchTerm.toLowerCase())) ||
        drug.drugClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drug.rxNormId.includes(searchTerm);

      if (!matchesSearch) return false;

      if (selectedClass !== "All Classes" && drug.drugClass !== selectedClass) {
        return false;
      }

      return true;
    });
  }, [searchTerm, selectedClass]);

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-900">{t('drugReference.title')}</h2>
          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
            {t('drugReference.totalDrugs', { count: DRUG_CATALOGUE.length })}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {t('drugReference.subtitle')}
        </p>

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Catalogue Disclaimer:</strong> All records in this reference are <strong>synthetic and illustrative</strong> for hackathon evaluation. 
            Do not treat this catalogue as an exhaustive pharmacopeia or a substitute for official national formularies (e.g., FDA, BNF, CDSCO).
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={t('drugReference.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            id="drug-reference-search-input"
          />
        </div>

        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none focus:border-teal-500"
            id="drug-reference-class-filter"
          >
            {DRUG_CLASSES.map((cls, idx) => (
              <option key={idx} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalogue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Generic Name & RxNorm</th>
                <th className="py-3 px-3">Brand Aliases</th>
                <th className="py-3 px-3">Pharmacological Class</th>
                <th className="py-3 px-3">Renal Adjustment Guidance</th>
                <th className="py-3 px-3">Pregnancy Category</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDrugs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No medications match your search criteria.
                  </td>
                </tr>
              ) : (
                filteredDrugs.map((drug) => (
                  <tr 
                    key={drug.id} 
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                    onClick={() => setActiveDrugModal(drug)}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {drug.genericName}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">RxNorm: {drug.rxNormId}</div>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                        {drug.brandAliases.map((b, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium">
                      {drug.drugClass}
                    </td>

                    <td className="py-3.5 px-3 max-w-[220px]">
                      <div className="text-slate-600 line-clamp-2">
                        {drug.renalAdjustment}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        drug.pregnancyCategory.startsWith("X") || drug.pregnancyCategory.startsWith("D")
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {drug.pregnancyCategory.split(" ")[0]}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                        {drug.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setActiveDrugModal(drug)}
                        className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-800 font-semibold text-xs transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drug Inspect Modal */}
      {activeDrugModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 no-print">
          <div 
            onClick={() => setActiveDrugModal(null)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                  RxNorm: {activeDrugModal.rxNormId}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">{activeDrugModal.genericName}</h3>
                <p className="text-xs text-slate-500">{activeDrugModal.drugClass}</p>
              </div>
              <button 
                onClick={() => setActiveDrugModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Brand Aliases:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeDrugModal.brandAliases.map((b, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div>
                  <span className="font-bold text-slate-800">Typical Dosing:</span>{" "}
                  <span className="text-slate-600">{activeDrugModal.typicalDose}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">Renal Adjustment Reference:</span>{" "}
                  <span className="text-slate-600">{activeDrugModal.renalAdjustment}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-800">Pregnancy Profile:</span>{" "}
                  <span className="text-slate-600">Category {activeDrugModal.pregnancyCategory} (Risk: {activeDrugModal.pregnancyRisk})</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Required Clinical Monitoring Parameters:
                </span>
                <ul className="list-disc pl-4 space-y-1 text-slate-700">
                  {activeDrugModal.monitoringParameters.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setActiveDrugModal(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 hover:bg-slate-300 font-semibold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
