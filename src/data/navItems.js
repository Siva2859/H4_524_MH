/**
 * MediGuard AI - Navigation Items Configuration
 * 
 * Part of Talent AP Mega Hackathon 2026 - Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team: Logic Legends | Team Leader: Achanta Siva Rama Krishna
 */

import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  AlertTriangle, 
  Search, 
  BookOpen, 
  History, 
  Settings,
  BarChart3
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, badge: null },
  { id: 'patients', label: 'Patient Records', icon: Users, badge: null },
  { id: 'review', label: 'Medication Review', icon: ClipboardCheck, badge: 'Wizard' },
  { id: 'alerts', label: 'Safety Alerts', icon: AlertTriangle, badge: null },
  { id: 'brand-generic', label: 'Medication Matching', icon: Search, badge: null },
  { id: 'drug-reference', label: 'Drug Reference', icon: BookOpen, badge: null },
  { id: 'evaluation', label: 'Evaluation & Metrics', icon: BarChart3, badge: null },
  { id: 'audit', label: 'Audit History', icon: History, badge: null },
  { id: 'settings', label: 'Settings & Information', icon: Settings, badge: null },
];
