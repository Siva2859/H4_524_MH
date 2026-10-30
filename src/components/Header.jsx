/**
 * MediGuard AI - Clinical Top Bar / Header Component
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Bell, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  CheckCircle2, 
  Menu,
  Database,
  FlaskConical,
  Activity,
  UserCheck,
  LogOut,
  User,
  Shield,
  Globe,
  Check
} from 'lucide-react';
import { DEMO_CASES } from '../data/demoCases.js';
import { NAV_ITEMS } from '../data/navItems.js';
import MemberLoginModal, { DEFAULT_MEMBER, getInitials } from './MemberLoginModal.jsx';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function Header({ 
  activeTab,
  activeDemoCaseId, 
  onSelectDemoCase, 
  onResetDemo, 
  notificationsCount = 0,
  onOpenNotifications,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  backendOnline = false,
  appMode = 'demo',
  onToggleAppMode,
  currentMember: propMember,
  onUpdateMember: propOnUpdateMember
}) {
  const { t, language, setLanguage, languages, currentLanguage } = useTranslation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCaseDropdownOpen, setIsCaseDropdownOpen] = useState(false);
  const [isModeDropdownOpen, setIsModeDropdownOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Local state if not passed from parent
  const [localMember, setLocalMember] = useState(() => {
    try {
      const saved = localStorage.getItem("mediguard_active_member");
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && parsed.name) ? parsed : DEFAULT_MEMBER;
    } catch {
      return DEFAULT_MEMBER;
    }
  });

  const currentMember = propMember || localMember || DEFAULT_MEMBER;

  const handleSaveMember = (newMember) => {
    setLocalMember(newMember);
    try {
      localStorage.setItem("mediguard_active_member", JSON.stringify(newMember));
    } catch (e) {
      console.error(e);
    }
    if (propOnUpdateMember) {
      propOnUpdateMember(newMember);
    }
  };

  const currentCase = DEMO_CASES.find(c => c.id === activeDemoCaseId);
  const currentNav = NAV_ITEMS.find(n => n.id === activeTab);
  const isOfficialMode = appMode === 'official';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-2xs no-print">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile hamburger & Active Context */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle-btn"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile-only compact logo */}
            <div className="flex lg:hidden items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-slate-900 text-sm tracking-tight">
                MediGuard <span className="text-teal-600">AI</span>
              </span>
            </div>

            {/* Desktop module title & mode indicator */}
            <div className="hidden lg:flex items-center gap-3">
              <span className="text-sm font-bold text-slate-900 tracking-tight">
                {currentNav ? t(`nav.${currentNav.id}`, {}, currentNav.label) : t('common.appName')}
              </span>

              <span className="text-slate-300">•</span>

              {/* Interactive Mode Selector (Part 8) */}
              <div className="relative">
                <button
                  onClick={() => setIsModeDropdownOpen(!isModeDropdownOpen)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                    isOfficialMode 
                      ? 'bg-indigo-50 text-indigo-800 border-indigo-200 hover:bg-indigo-100' 
                      : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                  }`}
                  id="app-mode-selector-btn"
                  title="Click to toggle between Synthetic Demo and Official H4 Evaluation Mode"
                >
                  {isOfficialMode ? (
                    <Database className="w-3 h-3 text-indigo-600" />
                  ) : (
                    <FlaskConical className="w-3 h-3 text-amber-600" />
                  )}
                  <span>{isOfficialMode ? t('header.officialMode') : t('header.demoMode')}</span>
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>

                {isModeDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3.5 py-1.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{t('header.dataProvenance')}</p>
                      <p className="text-[11px] text-slate-500">{t('header.dataProvenanceSub')}</p>
                    </div>

                    <div className="p-1.5 space-y-1">
                      {/* Option A: Synthetic Demo Mode */}
                      <button
                        onClick={() => {
                          if (onToggleAppMode) onToggleAppMode('demo');
                          setIsModeDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          !isOfficialMode ? 'bg-amber-50 border border-amber-200 text-amber-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <FlaskConical className="w-3.5 h-3.5 text-amber-600" />
                            <span>{t('header.demoMode')}</span>
                          </span>
                          {!isOfficialMode && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
                        </div>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                          {t('header.demoModeDesc')}
                        </p>
                      </button>

                      {/* Option B: Official H4 Evaluation Mode */}
                      <button
                        onClick={() => {
                          if (onToggleAppMode) onToggleAppMode('official');
                          setIsModeDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isOfficialMode ? 'bg-indigo-50 border border-indigo-200 text-indigo-950 font-bold' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Database className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{t('header.officialMode')}</span>
                          </span>
                          {isOfficialMode && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />}
                        </div>
                        <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                          {t('header.officialModeDesc')}
                        </p>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Backend Connectivity Status */}
              {backendOnline ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-semibold text-emerald-800" title="Connected to FastAPI backend on port 8000">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>FastAPI Online (:8000)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600" title="Local JavaScript Decision-Support Engine Active">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span>Local Engine</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions, Demo Case Selector & Clinician Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Demo Case Selector (shown in demo mode) */}
            {!isOfficialMode && (
              <div className="relative">
                <button
                  onClick={() => setIsCaseDropdownOpen(!isCaseDropdownOpen)}
                  className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  id="demo-case-selector-btn"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span className="hidden sm:inline">Demo:</span>
                  <strong>{currentCase ? currentCase.title.split(":")[0] : t('header.selectScenario')}</strong>
                  <ChevronDown className={`w-3.5 h-3.5 text-teal-600 transition-transform ${isCaseDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCaseDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800">{t('header.loadScenario')}</p>
                      <p className="text-[11px] text-slate-500">{t('header.loadScenarioSub')}</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto p-1 space-y-1">
                      {DEMO_CASES.map(c => {
                        const isSelected = c.id === activeDemoCaseId;
                        return (
                          <button
                            key={c.id}
                            onClick={() => {
                              onSelectDemoCase(c.id);
                              setIsCaseDropdownOpen(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              isSelected 
                                ? 'bg-teal-50 border border-teal-200 text-teal-900 font-bold' 
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold">
                              <span>{c.title}</span>
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{c.subtitle}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                id="header-language-selector-btn"
                aria-label={t('common.selectLanguage')}
                title={t('common.selectLanguage')}
              >
                <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="text-xs">{currentLanguage?.flag}</span>
                <span className="hidden sm:inline font-semibold">{currentLanguage?.nativeName || 'English'}</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLangDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-3 py-1.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{t('common.selectLanguage')}</p>
                    </div>
                    <div className="p-1 space-y-1">
                      {languages.map((lang) => {
                        const isSelected = lang.code === language;
                        return (
                          <button
                            key={lang.code}
                            onClick={() => {
                              setLanguage(lang.code);
                              setIsLangDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-teal-50 border border-teal-200 text-teal-900 font-bold'
                                : 'hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="text-base">{lang.flag}</span>
                              <div>
                                <p className="font-semibold text-slate-900">{lang.nativeName}</p>
                                <p className="text-[10px] text-slate-400">{lang.name}</p>
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 text-teal-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Reset Demo State Button */}
            <button
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              title={t('header.resetDemoTitle')}
              id="reset-demo-button"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">{t('common.reset')}</span>
            </button>

            {/* Notifications Trigger */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={t('header.viewNotifications')}
              id="notifications-button"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              {notificationsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                  {notificationsCount}
                </span>
              )}
            </button>

            {/* Clinical Member Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                id="profile-menu-button"
                aria-label="Member profile menu"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {currentMember.initials || getInitials(currentMember.name)}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="text-xs font-bold text-slate-800 leading-none">{currentMember.name}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-1">{currentMember.role}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Backdrop to close dropdown on click outside */}
              {isProfileOpen && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileOpen(false)} 
                />
              )}

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-76 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150 divide-y divide-slate-100">
                  
                  {/* Member Identity Header */}
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                      {currentMember.initials || getInitials(currentMember.name)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-bold text-slate-900 truncate">{currentMember.name}</p>
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          {t('common.online')}
                        </span>
                      </div>
                      <p className="text-[11px] text-teal-700 font-semibold truncate mt-0.5">{currentMember.role}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentMember.email}</p>
                    </div>
                  </div>

                  {/* Member Meta Details */}
                  <div className="px-4 py-2.5 text-[11px] text-slate-600 space-y-1.5 bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">{t('header.department')}</span>
                      <span className="font-semibold text-slate-800">{currentMember.department || "Medication Safety"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">{t('header.staffId')}</span>
                      <span className="font-mono text-slate-700 font-semibold">{currentMember.staffId || "MED-8842"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">{t('header.accessLevel')}</span>
                      <span className="font-semibold text-teal-700">{t('header.clinicalReviewer')}</span>
                    </div>
                  </div>

                  {/* Member Actions */}
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                      id="switch-member-btn"
                    >
                      <UserCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>{t('header.switchMember')}</span>
                    </button>

                    <button
                      onClick={() => {
                        onResetDemo();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors flex items-center gap-2 cursor-pointer"
                      id="reset-browser-state-btn"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t('header.resetBrowserState')}</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsLoginModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer"
                      id="sign-out-btn"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-500" />
                      <span>{t('header.signOut')}</span>
                    </button>
                  </div>

                </div>
              )}
            </div>

          </div>

        </div>
      </div>

      {/* Member Login & Profile Switcher Modal */}
      <MemberLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentMember={currentMember}
        onSaveMember={handleSaveMember}
      />
    </header>
  );
}
