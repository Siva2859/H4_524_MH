/**
 * MediGuard AI - Root Application Component
 * 
 * Talent AP Mega Hackathon 2026 - Healthcare Problem Statement H4:
 * The Medication Safety Second Pair of Eyes
 * Team Name: Logic Legends
 * Team Leader: Achanta Siva Rama Krishna
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DisclaimerBanner from './components/DisclaimerBanner';
import NotificationDrawer from './components/NotificationDrawer';
import PatientDetailDrawer from './components/PatientDetailDrawer';
import AlertDetailModal from './components/AlertDetailModal';
import ReviewDecisionModal from './components/ReviewDecisionModal';

import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import MedicationReviewPage from './pages/MedicationReviewPage';
import SafetyResultsPage from './pages/SafetyResultsPage';
import BrandGenericPage from './pages/BrandGenericPage';
import DrugReferencePage from './pages/DrugReferencePage';
import EvaluationPage from './pages/EvaluationPage';
import AuditHistoryPage from './pages/AuditHistoryPage';
import SettingsPage from './pages/SettingsPage';

import { SYNTHETIC_PATIENTS } from './data/syntheticPatients';
import { INITIAL_AUDIT_LOGS } from './data/initialAuditLogs';
import { DEMO_CASES } from './data/demoCases';
import { runSafetyReview } from './services/safetyEngine';
import { runSafetyReviewAPI, checkBackendHealth, fetchPatients } from './services/apiClient';
import { DEFAULT_MEMBER } from './components/MemberLoginModal';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appMode, setAppMode] = useState('demo'); // 'demo' | 'official'
  const [patients, setPatients] = useState(SYNTHETIC_PATIENTS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [activeDemoCaseId, setActiveDemoCaseId] = useState('case-1');
  const [backendOnline, setBackendOnline] = useState(false);

  // Active Logged-in Clinical Member
  const [currentMember, setCurrentMember] = useState(() => {
    try {
      const saved = localStorage.getItem("mediguard_active_member");
      const parsed = saved ? JSON.parse(saved) : null;
      return (parsed && parsed.name) ? parsed : DEFAULT_MEMBER;
    } catch {
      return DEFAULT_MEMBER;
    }
  });

  const handleUpdateMember = (newMember) => {
    setCurrentMember(newMember);
    try {
      localStorage.setItem("mediguard_active_member", JSON.stringify(newMember));
    } catch (e) {
      console.error(e);
    }
  };

  // Currently inspected patient for drawer
  const [inspectedPatient, setInspectedPatient] = useState(null);
  const [isPatientDrawerOpen, setIsPatientDrawerOpen] = useState(false);

  // Review state
  const [reviewPatient, setReviewPatient] = useState(SYNTHETIC_PATIENTS[0]);
  const [reviewMedications, setReviewMedications] = useState(SYNTHETIC_PATIENTS[0].currentMedications);
  
  // Initial safety review initialized with Case 1
  const [activeReviewResult, setActiveReviewResult] = useState(() => {
    const defaultCase = DEMO_CASES[0];
    return runSafetyReview(defaultCase.clinicalContext, defaultCase.medications);
  });

  // Filters for navigating between dashboards
  const [patientStatusFilter, setPatientStatusFilter] = useState('ALL');
  const [patientSeverityFilter, setPatientSeverityFilter] = useState('ALL');
  const [alertSeverityFilter, setAlertSeverityFilter] = useState('ALL');

  // Unified navigation handler with option support
  const handleNavigate = (tab, options = {}) => {
    if (tab === 'patients') {
      if (options.statusFilter !== undefined) {
        setPatientStatusFilter(options.statusFilter);
      } else if (!options.preserveFilters) {
        setPatientStatusFilter('ALL');
      }
      if (options.severityFilter !== undefined) {
        setPatientSeverityFilter(options.severityFilter);
      } else if (!options.preserveFilters) {
        setPatientSeverityFilter('ALL');
      }
    }
    if (tab === 'alerts') {
      if (options.severityFilter !== undefined) {
        setAlertSeverityFilter(options.severityFilter);
      } else if (!options.preserveFilters) {
        setAlertSeverityFilter('ALL');
      }
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Modals
  const [activeAlertItem, setActiveAlertItem] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check FastAPI backend connection on mount & periodically
  useEffect(() => {
    const checkStatus = async () => {
      const res = await checkBackendHealth();
      setBackendOnline(res.online);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  // Load a demo scenario
  const handleSelectDemoCase = async (caseId) => {
    const targetCase = DEMO_CASES.find(c => c.id === caseId);
    if (!targetCase) return;

    setActiveDemoCaseId(caseId);

    // Find or construct patient
    const existingPt = patients.find(p => p.id === targetCase.patientId) || {
      id: targetCase.patientId,
      name: targetCase.patientName,
      age: targetCase.clinicalContext.age,
      sex: targetCase.clinicalContext.sex,
      weightKg: targetCase.clinicalContext.weight,
      eGfr: targetCase.clinicalContext.eGfr,
      creatinineMgDl: 1.8,
      pregnancyStatus: targetCase.clinicalContext.pregnancyStatus,
      diagnoses: targetCase.clinicalContext.diagnoses,
      knownAllergies: [],
      currentMedications: targetCase.medications,
      highestAlertSeverity: "Critical",
      reviewStatus: "Pending Review"
    };

    setReviewPatient(existingPt);
    setReviewMedications(targetCase.medications);

    // Immediate preview via rule engine
    const immediateRes = runSafetyReview(targetCase.clinicalContext, targetCase.medications);
    setActiveReviewResult(immediateRes);

    // Execute via FastAPI API client
    const apiRes = await runSafetyReviewAPI(targetCase.clinicalContext, targetCase.medications);
    if (apiRes) {
      setActiveReviewResult(apiRes);
    }
  };

  // Run Safety Review from guided wizard
  const handleRunReview = async (context, medications) => {
    setReviewMedications(medications);
    // Instant preliminary review
    const immediate = runSafetyReview(context, medications);
    setActiveReviewResult(immediate);
    setActiveTab('alerts'); // Switch to results view automatically

    // Full review via FastAPI
    const apiRes = await runSafetyReviewAPI(context, medications);
    if (apiRes) {
      setActiveReviewResult(apiRes);
    }
  };

  // Select patient to inspect details
  const handleSelectPatient = (patient) => {
    setInspectedPatient(patient);
    setIsPatientDrawerOpen(true);
  };

  // Start review from patient table or drawer
  const handleStartReviewForPatient = async (patient) => {
    setReviewPatient(patient);
    setReviewMedications(patient.currentMedications || []);
    const context = {
      patientId: patient.id,
      patientName: patient.name,
      age: patient.age,
      sex: patient.sex,
      weight: patient.weightKg,
      eGfr: patient.eGfr,
      pregnancyStatus: patient.pregnancyStatus,
      diagnoses: patient.diagnoses
    };
    const immediate = runSafetyReview(context, patient.currentMedications || []);
    setActiveReviewResult(immediate);
    setIsPatientDrawerOpen(false);
    setActiveTab('review');

    const apiRes = await runSafetyReviewAPI(context, patient.currentMedications || []);
    if (apiRes) {
      setActiveReviewResult(apiRes);
    }
  };

  // Open alert detail modal
  const handleOpenAlertDetail = (alert) => {
    setActiveAlertItem(alert);
    setIsAlertModalOpen(true);
  };

  // Submit clinician review decision
  const handleSubmitDecision = (decisionRecord) => {
    const recordWithProvenance = {
      ...decisionRecord,
      reviewerName: currentMember?.name || "Dr. Sarah Jenkins",
      reviewerRole: currentMember?.role || "Clinical Pharmacist",
      isDemoSeed: false
    };
    setAuditLogs([recordWithProvenance, ...auditLogs]);

    // Update patient status in table
    setPatients(prev => prev.map(p => {
      if (p.id === decisionRecord.patientId) {
        return {
          ...p,
          reviewStatus: "Reviewed",
          lastReviewedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return p;
    }));
  };

  // Toggle between Synthetic Demo Mode and Official H4 Evaluation Mode (Part 8)
  const handleToggleAppMode = async (newMode) => {
    setAppMode(newMode);
    if (newMode === 'official') {
      const res = await fetchPatients('official');
      const officialList = Array.isArray(res) ? res : res?.patients;
      if (officialList && officialList.length > 0) {
        setPatients(officialList);
        const pt = officialList[0];
        setReviewPatient(pt);
        setReviewMedications(pt.currentMedications || []);
        const context = {
          patientId: pt.id,
          patientName: pt.name,
          age: pt.age,
          sex: pt.sex,
          weight: pt.weightKg,
          eGfr: pt.eGfr,
          pregnancyStatus: pt.pregnancyStatus,
          diagnoses: pt.diagnoses
        };
        const immediate = runSafetyReview(context, pt.currentMedications || []);
        setActiveReviewResult(immediate);
        const apiRes = await runSafetyReviewAPI(context, pt.currentMedications || []);
        if (apiRes) setActiveReviewResult(apiRes);
      }
    } else {
      setPatients(SYNTHETIC_PATIENTS);
      const defaultCase = DEMO_CASES[0];
      setReviewPatient(SYNTHETIC_PATIENTS[0]);
      setReviewMedications(SYNTHETIC_PATIENTS[0].currentMedications);
      const immediate = runSafetyReview(defaultCase.clinicalContext, defaultCase.medications);
      setActiveReviewResult(immediate);
    }
  };

  // Reset demo environment
  const handleResetDemo = () => {
    setAppMode('demo');
    setPatients(SYNTHETIC_PATIENTS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setActiveDemoCaseId('case-1');
    const defaultCase = DEMO_CASES[0];
    setReviewPatient(SYNTHETIC_PATIENTS[0]);
    setReviewMedications(defaultCase.medications);
    setActiveReviewResult(runSafetyReview(defaultCase.clinicalContext, defaultCase.medications));
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      
      {/* Persistent Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Main Layout Container with Dedicated Sidebar Column */}
      <div className="flex-1 flex w-full">
        
        {/* Left Navigation Sidebar (Dedicated layout column on desktop) */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          alertCount={activeReviewResult?.totalAlerts || 0}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        {/* Right Content Column: Header at top, Main Page Content below */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            activeTab={activeTab}
            activeDemoCaseId={activeDemoCaseId}
            onSelectDemoCase={handleSelectDemoCase}
            onResetDemo={handleResetDemo}
            notificationsCount={activeReviewResult?.totalAlerts || 3}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            backendOnline={backendOnline}
            appMode={appMode}
            onToggleAppMode={handleToggleAppMode}
            currentMember={currentMember}
            onUpdateMember={handleUpdateMember}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            
            {/* Tab 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <DashboardPage
                patients={patients}
                auditLogs={auditLogs}
                activeReview={activeReviewResult}
                onSelectPatient={handleSelectPatient}
                onNavigate={handleNavigate}
                onLoadDemoCase={handleSelectDemoCase}
                appMode={appMode}
              />
            )}

            {/* Tab 2: Patient Records */}
            {activeTab === 'patients' && (
              <PatientsPage
                patients={patients}
                auditLogs={auditLogs}
                onSelectPatient={handleSelectPatient}
                onStartReview={handleStartReviewForPatient}
                appMode={appMode}
                initialStatusFilter={patientStatusFilter}
                initialSeverityFilter={patientSeverityFilter}
                onNavigate={handleNavigate}
              />
            )}

            {/* Tab 3: Medication Review Wizard */}
            {activeTab === 'review' && (
              <MedicationReviewPage
                patients={patients}
                initialPatient={reviewPatient}
                initialMedications={reviewMedications}
                onRunReview={handleRunReview}
                onLoadDemoCase={handleSelectDemoCase}
                appMode={appMode}
              />
            )}

            {/* Tab 4: Safety Alerts Results */}
            {activeTab === 'alerts' && (
              <SafetyResultsPage
                reviewResult={activeReviewResult}
                patientInfo={reviewPatient}
                onOpenAlertDetail={handleOpenAlertDetail}
                onOpenDecisionModal={() => setIsDecisionModalOpen(true)}
                onNavigateToWizard={() => handleNavigate('review')}
                initialSeverityFilter={alertSeverityFilter}
                appMode={appMode}
              />
            )}

            {/* Tab 5: Brand / Generic Matching */}
            {activeTab === 'brand-generic' && (
              <BrandGenericPage appMode={appMode} />
            )}

            {/* Tab 6: Drug Reference Formulary */}
            {activeTab === 'drug-reference' && (
              <DrugReferencePage appMode={appMode} />
            )}

            {/* Tab 7: Evaluation & Benchmark Dashboard (H4 Protocol) */}
            {activeTab === 'evaluation' && (
              <EvaluationPage appMode={appMode} />
            )}

            {/* Tab 8: Audit History */}
            {activeTab === 'audit' && (
              <AuditHistoryPage auditLogs={auditLogs} appMode={appMode} />
            )}

            {/* Tab 9: Settings & Hackathon Info */}
            {activeTab === 'settings' && (
              <SettingsPage 
                onResetDemo={handleResetDemo} 
                currentMember={currentMember}
              />
            )}

          </main>
        </div>
      </div>

      {/* Slide-over Patient Detail Drawer */}
      <PatientDetailDrawer
        patient={inspectedPatient}
        isOpen={isPatientDrawerOpen}
        onClose={() => setIsPatientDrawerOpen(false)}
        onStartReview={handleStartReviewForPatient}
      />

      {/* Explainable Alert Detail Modal */}
      <AlertDetailModal
        alert={activeAlertItem}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onTakeAction={() => setIsDecisionModalOpen(true)}
      />

      {/* Clinician Review Decision Modal */}
      <ReviewDecisionModal
        isOpen={isDecisionModalOpen}
        onClose={() => setIsDecisionModalOpen(false)}
        reviewResult={activeReviewResult}
        patientInfo={reviewPatient}
        onSubmitDecision={handleSubmitDecision}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />

    </div>
  );
}
