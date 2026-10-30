/**
 * MediGuard AI - Persistent Clinical Safety Disclaimer Banner
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState } from 'react';
import { ShieldAlert, Info, X } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext.jsx';

export default function DisclaimerBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { t } = useTranslation();

  if (isDismissed) {
    return (
      <div className="bg-amber-100/90 text-amber-900 border-b border-amber-200 text-xs py-1.5 px-4 flex items-center justify-between no-print shadow-2xs">
        <span className="flex items-center gap-1.5 font-medium">
          <Info className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>
            <strong>{t('common.h4Badge')}:</strong> {t('common.disclaimerBanner')}
          </span>
        </span>
        <button 
          onClick={() => setIsDismissed(false)}
          className="text-amber-900 underline hover:text-amber-950 text-[11px] font-semibold cursor-pointer ml-2 shrink-0"
        >
          {t('common.details')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 text-white shadow-sm border-b border-amber-900 text-xs py-2 px-4 flex items-center justify-between no-print transition-all">
      <div className="flex items-center gap-2.5 max-w-6xl">
        <ShieldAlert className="w-4 h-4 text-amber-200 shrink-0" />
        <p className="leading-snug text-[11.5px]">
          <strong className="font-bold uppercase tracking-wider text-amber-100 mr-1.5">{t('common.h4Badge')}:</strong>
          {t('common.disclaimerBanner')}
        </p>
      </div>
      <button 
        onClick={() => setIsDismissed(true)}
        className="p-1 rounded hover:bg-amber-800/80 text-amber-200 hover:text-white transition-colors shrink-0 ml-3 cursor-pointer"
        title="Minimize disclaimer"
        aria-label="Minimize disclaimer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
