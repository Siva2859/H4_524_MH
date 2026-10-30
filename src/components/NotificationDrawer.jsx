/**
 * MediGuard AI - Notifications Drawer
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function NotificationDrawer({ isOpen, onClose, onNavigate }) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const demoNotifications = [
    {
      id: "notif-1",
      title: "Critical DDI Alert on Patient SYN-PT-1042",
      description: "Concurrent Warfarin and Aspirin detected without recorded PPI gastroprotection.",
      time: "10 mins ago",
      type: "critical",
      targetTab: "review"
    },
    {
      id: "notif-2",
      title: "Uncertain Medication Match Flagged",
      description: "Prescription query 'Metfornin' requires clinician human confirmation before mapping.",
      time: "45 mins ago",
      type: "warning",
      targetTab: "brand-generic"
    },
    {
      id: "notif-3",
      title: "Duplicate RAAS Blockade Resolved",
      description: "Dr. Sarah Jenkins discontinued Losartan for patient SYN-PT-1088. Audit log updated.",
      time: "2 hours ago",
      type: "success",
      targetTab: "audit"
    },
    {
      id: "notif-4",
      title: "Demo Reference Catalogue v1.2 Active",
      description: "25 essential synthetic demo medicines and rule sets loaded into local engine.",
      time: "Session start",
      type: "info",
      targetTab: "drug-reference"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end no-print">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Clinical Alerts & Notifications</h2>
              <p className="text-xs text-slate-500">Real-time session updates</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notification list */}
        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          {demoNotifications.map(n => {
            const iconConfig = {
              critical: { bg: "bg-rose-50 border-rose-200 text-rose-800", icon: AlertTriangle, iconColor: "text-rose-600" },
              warning: { bg: "bg-amber-50 border-amber-200 text-amber-800", icon: AlertTriangle, iconColor: "text-amber-600" },
              success: { bg: "bg-emerald-50 border-emerald-200 text-emerald-800", icon: CheckCircle2, iconColor: "text-emerald-600" },
              info: { bg: "bg-sky-50 border-sky-200 text-sky-800", icon: Info, iconColor: "text-sky-600" },
            }[n.type];

            const Icon = iconConfig.icon;

            return (
              <div 
                key={n.id}
                className={`p-3.5 rounded-xl border text-xs transition-all ${iconConfig.bg}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconConfig.iconColor}`} />
                    <div>
                      <h3 className="font-semibold">{n.title}</h3>
                      <p className="text-slate-600 mt-1 leading-relaxed">{n.description}</p>
                      <span className="text-[10px] text-slate-400 mt-2 block font-medium">{n.time}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-200/60 flex justify-end">
                  <button
                    onClick={() => {
                      onNavigate(n.targetTab);
                      onClose();
                    }}
                    className="inline-flex items-center gap-1 font-semibold text-teal-700 hover:text-teal-900 text-[11px]"
                  >
                    <span>View Module</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-center">
          <p className="text-[11px] text-slate-500">
            Synthetic notifications generated for demonstration purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
