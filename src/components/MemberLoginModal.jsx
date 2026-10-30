/**
 * MediGuard AI - Member Login & Profile Switcher Modal
 */

import React, { useState, useEffect } from 'react';
import { 
  X, 
  UserCheck, 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  Check, 
  KeyRound
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export const DEFAULT_MEMBER = {
  name: "Dr. Sarah Jenkins",
  role: "Clinical Pharmacist",
  email: "s.jenkins@hospital.org",
  initials: "SJ",
  department: "Medication Safety Unit",
  staffId: "MED-8842"
};

export const PRESET_MEMBERS = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Clinical Pharmacist",
    email: "s.jenkins@hospital.org",
    initials: "SJ",
    department: "Medication Safety Unit",
    staffId: "MED-8842"
  },
  {
    name: "Dr. Alex Morgan",
    role: "Attending Physician",
    email: "a.morgan@hospital.org",
    initials: "AM",
    department: "Internal Medicine",
    staffId: "MED-6219"
  },
  {
    name: "Dr. Michael Chang",
    role: "Clinical Specialist",
    email: "m.chang@hospital.org",
    initials: "MC",
    department: "Clinical Pharmacology",
    staffId: "MED-3051"
  },
  {
    name: "Elena Rostova",
    role: "Lead Pharmacy Specialist",
    email: "e.rostova@hospital.org",
    initials: "ER",
    department: "Inpatient Pharmacy",
    staffId: "MED-4108"
  }
];

export function getInitials(name = "") {
  const safeName = typeof name === 'string' ? name : "";
  const cleaned = safeName.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, "").trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "MB";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function MemberLoginModal({ 
  isOpen, 
  onClose, 
  currentMember = DEFAULT_MEMBER, 
  onSaveMember 
}) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: currentMember?.name || DEFAULT_MEMBER.name,
    role: currentMember?.role || DEFAULT_MEMBER.role,
    email: currentMember?.email || DEFAULT_MEMBER.email,
    department: currentMember?.department || DEFAULT_MEMBER.department,
    staffId: currentMember?.staffId || DEFAULT_MEMBER.staffId
  });

  useEffect(() => {
    if (currentMember) {
      setFormData({
        name: currentMember.name || DEFAULT_MEMBER.name,
        role: currentMember.role || DEFAULT_MEMBER.role,
        email: currentMember.email || DEFAULT_MEMBER.email,
        department: currentMember.department || DEFAULT_MEMBER.department,
        staffId: currentMember.staffId || DEFAULT_MEMBER.staffId
      });
    }
  }, [currentMember, isOpen]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset) => {
    setFormData(preset);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const initials = getInitials(formData.name);
    onSaveMember({
      ...formData,
      initials
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-200 shadow-2xs">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{t('loginModal.title')}</h2>
              <p className="text-xs text-slate-500">{t('loginModal.subtitle')}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Quick Preset Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              {t('loginModal.selectAccount')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_MEMBERS.map((preset) => {
                const isSelected = formData.name === preset.name;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-teal-500 bg-teal-50/60 ring-2 ring-teal-200' 
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-6 h-6 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                        {preset.initials}
                      </div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-teal-600" />}
                    </div>
                    <div className="font-bold text-xs text-slate-900 mt-1 truncate">{preset.name}</div>
                    <div className="text-[10px] text-slate-500 truncate">{preset.role}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative py-1">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-[11px] text-slate-400 font-medium">{t('loginModal.customDetails')}</span>
            </div>
          </div>

          {/* Member Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t('loginModal.fullName')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Dr. Alex Morgan"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>

          {/* Role and Staff ID in grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('loginModal.role')}
              </label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="e.g. Clinical Pharmacist"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('loginModal.staffId')}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  placeholder="e.g. MED-8842"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Email & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('loginModal.email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="e.g. member@hospital.org"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {t('loginModal.department')}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Inpatient Pharmacy"
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors cursor-pointer"
            >
              {t('loginModal.cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{t('loginModal.signIn')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

