/**
 * MediGuard AI - Clinical Navigation Sidebar
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React from 'react';
import { 
  Shield,
  ShieldCheck,
  X
} from 'lucide-react';
import { NAV_ITEMS } from '../data/navItems.js';
import { useTranslation } from '../i18n/LanguageContext.jsx';
export { NAV_ITEMS };


export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  alertCount = 0, 
  isMobileMenuOpen, 
  setIsMobileMenuOpen 
}) {
  const { t } = useTranslation();

  const handleSelect = (id) => {
    setActiveTab(id);
    if (setIsMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  // Reusable navigation content
  const navContent = (
    <>
      {/* Top Sidebar Brand Header */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-sm shadow-teal-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight leading-tight">
                  MediGuard <span className="text-teal-600">AI</span>
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-teal-50 text-teal-700 border border-teal-200 uppercase tracking-wider">
                  H4
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">{t('common.tagline')}</p>
            </div>
          </div>

          {/* Mobile Close Button */}
          {isMobileMenuOpen && (
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Navigation List */}
      <div className="p-3 space-y-1 overflow-y-auto flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {t('nav.modules')}
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          const hasAlertBadge = item.id === 'alerts' && alertCount > 0;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item.id)}
              id={`nav-item-${item.id}`}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group
                ${isActive 
                  ? 'bg-teal-50 text-teal-900 shadow-2xs border border-teal-200/90' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg transition-colors ${
                  isActive ? 'bg-teal-600 text-white' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span>{t(`nav.${item.id}`, {}, item.label)}</span>
              </div>

              {/* Badges */}
              {hasAlertBadge ? (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                  {alertCount}
                </span>
              ) : item.badge === 'Wizard' ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                  {t('nav.wizardBadge')}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Bottom Clinical Safety Badge & Hackathon Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70">
        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/70 mb-3">
          <div className="flex items-center gap-2 text-teal-800 font-bold text-xs">
            <Shield className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t('common.appName')}</span>
          </div>
          <p className="text-[11px] text-teal-700 mt-1 leading-snug">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="text-[11px] text-slate-500 space-y-0.5">
          <p className="font-semibold text-slate-700">{t('common.appName')} Clinical Suite</p>
          <p className="text-[10px] text-slate-500">{t('common.h4Badge')}</p>
          <p className="text-[10px] text-slate-400 font-mono">v1.2.0 • Inpatient CDS</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Column Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-slate-200 sticky top-0 h-screen flex-col justify-between no-print z-30">
        {navContent}
      </aside>

      {/* Mobile Backdrop & Slide-over Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white flex flex-col justify-between shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
