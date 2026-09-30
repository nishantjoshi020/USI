/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Bot,
  Calendar,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import {
  AIActionCentreItem,
  AIActionStatus,
  AIAuditTrailRecord,
  AIAutomationAuditEvent,
  AICopilotActionButton,
  AICopilotMessage,
  AIDataFreshnessItem,
  AIEvidenceBundle,
  AIInsight,
  AIRecommendation,
  AIRiskSignalCard,
  AITrainingModificationItem,
  AIWorkflowAutomationRule,
  AppNotification,
  AssessmentProgram,
  Athlete,
  BodyComposition,
  BodyRegionId,
  CoachProfile,
  DailyAnalyticsPoint,
  HierarchyContext,
  HydrationLog,
  Injury,
  Meal,
  MedicalNoteRecord,
  MedicalOperationalAlert,
  MedicalRiskAlertItem,
  NavItemId,
  NutritionPlan,
  RehabPlanRecord,
  RehabSessionRecord,
  Report,
  Supplement,
  TalentProfile,
  TalentScoringWeights,
  Test,
  TestResult,
  TrainingSession,
  UserRole,
  WellnessProfile,
} from './types/usi';
import {
  ANALYTICS_14D_SERIES,
  ASSESSMENTS_LIST,
  ATHLETES,
  INITIAL_CONTEXT,
  INITIAL_NOTIFICATIONS,
  INITIAL_RECOMMENDATIONS,
  ROLE_DESCRIPTIONS,
  TRAINING_SESSIONS,
} from './data/mockData';
import {
  ARJUN_WELLNESS_PROFILE,
  INITIAL_MEDICAL_ALERTS,
  INITIAL_MEDICAL_INJURIES,
  INITIAL_MEDICAL_RISK_ALERTS,
  INITIAL_REHAB_PLANS,
} from './data/medicalMockData';
import { Sidebar } from './components/navigation/Sidebar';
import { TopContextBar, ViewportMode } from './components/navigation/TopContextBar';
import { KpiFilterKey, KpiGrid } from './components/command-center/KpiGrid';
import { RoleDashboardBanner } from './components/command-center/RoleDashboardBanner';
import { RoleSpecificAnalyticsView } from './components/command-center/RoleSpecificAnalyticsView';
import { PersonaSpecializedSections } from './components/command-center/PersonaSpecializedSections';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ReadinessAndAlertSection } from './components/command-center/ReadinessAndAlertSection';
import { TrainingAndInjurySection } from './components/command-center/TrainingAndInjurySection';
import { AthleteAttentionTable } from './components/command-center/AthleteAttentionTable';
import { AiRecommendationsAndAnalytics } from './components/command-center/AiRecommendationsAndAnalytics';
import { AthleteDetailDrawer } from './components/drawers/AthleteDetailDrawer';
import { SessionDetailDrawer } from './components/drawers/SessionDetailDrawer';
import { MorningSquadTriageDrawer } from './components/drawers/MorningSquadTriageDrawer';
import {
  GlobalSearchModal,
  NotificationPanel,
  RiskFactorsModal,
  SystemGuideModal,
} from './components/modals/GlobalOverlays';
import { ConnectedModuleView } from './components/modules/ConnectedModuleView';
import { AthleteRegistryPage } from './components/athletes/AthleteRegistryPage';
import { EnrollmentApplicationsPage } from './components/athletes/EnrollmentApplicationsPage';
import {
  AiAssistanceMode,
  Athlete360Page,
} from './components/athletes/Athlete360Page';
import { AthleteOnboardingModal } from './components/athletes/AthleteOnboardingModal';
import { AthleteLifecycleHub } from './components/athletes/AthleteLifecycleHub';
import { SessionAssignmentModal, CoachWorkflowPanel } from './components/training/CoachWorkflowComponents';
import {
  AiAthleteAssistanceDrawer,
  AthleteApprovalModal,
  CoachAssignmentModal,
  EditAthleteProfileModal,
} from './components/athletes/AthleteOperationsModals';
import {
  MedicalSubTab,
  MedicalWorkspace,
} from './components/medical/MedicalWorkspace';
import {
  CreateRehabSessionModal,
  InjuryDetailDrawer,
  ReportInjuryModal,
  RTPGateModal,
} from './components/medical/MedicalDrawersAndModals';
import {
  AI_ANALYTICS_INSIGHTS,
  ARJUN_DAILY_MEALS,
  INITIAL_ASSESSMENT_PROGRAMS,
  INITIAL_BODY_COMPOSITION,
  INITIAL_HYDRATION_LOGS,
  INITIAL_NUTRITION_PLANS,
  INITIAL_REPORTS,
  INITIAL_SUPPLEMENTS,
  INITIAL_TALENT_PROFILES,
  INITIAL_TALENT_WEIGHTS,
  INITIAL_TESTS_LIBRARY,
  INITIAL_TEST_RESULTS,
} from './data/intelligenceMockData';
import {
  NutritionSubTab,
  NutritionWorkspace,
} from './components/nutrition/NutritionWorkspace';
import {
  AssessmentsSubTab,
  AssessmentsWorkspace,
} from './components/assessments/AssessmentsWorkspace';
import {
  AnalyticsSubTab,
  AnalyticsWorkspace,
} from './components/analytics/AnalyticsWorkspace';
import {
  TrainingSubTab,
  TrainingWorkspace,
} from './components/training/TrainingWorkspace';
import {
  SportsScienceSubTab,
  SportsScienceWorkspace,
} from './components/sports-science/SportsScienceWorkspace';
import {
  OperationsSubTab,
  OperationsWorkspace,
} from './components/operations/OperationsWorkspace';
import {
  ARJUN_EVIDENCE_BUNDLE,
  buildCopilotResponse,
  getPersonaInitialMessages,
  INITIAL_AI_ACTION_CENTRE,
  INITIAL_AI_AUDIT_TRAIL,
  INITIAL_AI_RISK_SIGNALS,
  INITIAL_AUTOMATION_AUDIT_EVENTS,
  INITIAL_AUTOMATION_RULES,
  INITIAL_COPILOT_MESSAGES,
  INITIAL_DATA_FRESHNESS,
  INITIAL_TRAINING_MODIFICATIONS,
} from './data/aiCopilotMockData';
import {
  AICopilotSubTab,
  AICopilotWorkspace,
} from './components/ai/AICopilotWorkspace';
import {
  AIEvidenceDrawer,
  GlobalAICopilotSlideOver,
  ProposedTrainingModificationsModal,
} from './components/ai/AICopilotOverlays';
import {
  exportAthletesRoster,
  exportToJSON,
  triggerFallbackExportForToast,
} from './utils/exportEngine';
import { generateContextDataset } from './utils/contextDataGenerator';

const INITIAL_DATASET = generateContextDataset(INITIAL_CONTEXT);

const RTP_STAGE_NAMES: Record<number, string> = {
  1: 'Pain Reduction',
  2: 'Strength Restoration',
  3: 'Sport-Specific Training',
  4: 'Full Training',
  5: 'Return to Competition',
};

export default function App() {
  // Navigation & Global Context State
  const [activeNav, setActiveNav] = useState<NavItemId>('command-center');
  const [context, setContext] = useState<HierarchyContext>(INITIAL_CONTEXT);
  const [selectedRole, setSelectedRole] = useState<UserRole>('Performance Director');
  const [isSidebarCompact, setIsSidebarCompact] = useState<boolean>(false);
  const [viewportMode, setViewportMode] = useState<ViewportMode>('desktop');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // Iteration 5: AI Copilot & AI-Native Operations Shared State
  const [aiMessages, setAiMessages] = useState<AICopilotMessage[]>(
    INITIAL_COPILOT_MESSAGES
  );
  const [aiActionItems, setAiActionItems] = useState<AIActionCentreItem[]>(
    INITIAL_DATASET.aiActionItems
  );
  const [aiRiskSignals, setAiRiskSignals] = useState<AIRiskSignalCard[]>(
    INITIAL_DATASET.aiRiskSignals
  );
  const [aiAutomationRules, setAiAutomationRules] = useState<
    AIWorkflowAutomationRule[]
  >(INITIAL_AUTOMATION_RULES);
  const [aiAutomationAuditEvents, setAiAutomationAuditEvents] = useState<
    AIAutomationAuditEvent[]
  >(INITIAL_AUTOMATION_AUDIT_EVENTS);
  const [aiAuditTrail, setAiAuditTrail] = useState<AIAuditTrailRecord[]>(
    INITIAL_AI_AUDIT_TRAIL
  );
  const [aiDataFreshness] = useState<AIDataFreshnessItem[]>(
    INITIAL_DATA_FRESHNESS
  );
  const [aiTrainingModifications, setAiTrainingModifications] = useState<
    AITrainingModificationItem[]
  >(INITIAL_DATASET.aiTrainingModifications);
  const [activeEvidenceBundle, setActiveEvidenceBundle] =
    useState<AIEvidenceBundle | null>(null);
  const [isTrainingModModalOpen, setIsTrainingModModalOpen] = useState(false);
  const [isGlobalCopilotOpen, setIsGlobalCopilotOpen] = useState(false);
  const [sessionMemoryTopic, setSessionMemoryTopic] = useState<
    'low-readiness' | 'senior-low-readiness' | null
  >(null);
  const [isCopilotThinking, setIsCopilotThinking] = useState<boolean>(false);
  const [copilotModel, setCopilotModel] = useState<string>('gemini-3.8-flash');

  // Connected Data State (Synchronized across all 300 permutations)
  const [athletes, setAthletes] = useState<Athlete[]>(INITIAL_DATASET.athletes);
  const [sessions, setSessions] = useState<TrainingSession[]>(INITIAL_DATASET.sessions);
  const [injuries, setInjuries] = useState<Injury[]>(INITIAL_DATASET.injuries);
  const [rehabPlans, setRehabPlans] =
    useState<RehabPlanRecord[]>(INITIAL_DATASET.rehabPlans);
  const [medicalRiskAlerts, setMedicalRiskAlerts] = useState<
    MedicalRiskAlertItem[]
  >(INITIAL_DATASET.medicalRiskAlerts);
  const [medicalAlerts, setMedicalAlerts] = useState<MedicalOperationalAlert[]>(
    INITIAL_DATASET.medicalAlerts
  );
  const [wellnessProfile, setWellnessProfile] = useState<WellnessProfile>(
    INITIAL_DATASET.wellnessProfile
  );
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    INITIAL_DATASET.recommendations
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS
  );

  // Iteration 4: Nutrition, Assessments & TID, and Analytics & BI Shared State
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(
    INITIAL_DATASET.nutritionPlans
  );
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLog[]>(
    INITIAL_DATASET.hydrationLogs
  );
  const [supplements, setSupplements] =
    useState<Supplement[]>(INITIAL_DATASET.supplements);
  const [bodyComposition, setBodyComposition] = useState<BodyComposition>(
    INITIAL_DATASET.bodyComposition
  );
  const [assessmentPrograms, setAssessmentPrograms] = useState<
    AssessmentProgram[]
  >(INITIAL_DATASET.assessmentPrograms);
  const [tests, setTests] = useState<Test[]>(INITIAL_DATASET.tests);
  const [testResults, setTestResults] =
    useState<TestResult[]>(INITIAL_DATASET.testResults);
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>(
    INITIAL_DATASET.talentProfiles
  );
  const [talentWeights, setTalentWeights] = useState<TalentScoringWeights>(
    INITIAL_TALENT_WEIGHTS
  );
  const [reports, setReports] = useState<Report[]>(INITIAL_DATASET.reports);
  const [analyticsSeries, setAnalyticsSeries] = useState<DailyAnalyticsPoint[]>(
    INITIAL_DATASET.analyticsSeries
  );

  // Active Athlete 360 Profile State
  const [activeAthlete360Id, setActiveAthlete360Id] = useState<string>(
    INITIAL_DATASET.athletes[0]?.id || 'ath-1042'
  );

  // Command Center Interactive Filter & Selection State
  const [activeKpi, setActiveKpi] = useState<KpiFilterKey | null>(null);
  const [selectedReadinessTier, setSelectedReadinessTier] = useState<string | null>(
    null
  );
  const [tableStatusFilter, setTableStatusFilter] = useState<string>('All');

  // Drawers & Modals State
  const [drawerAthleteId, setDrawerAthleteId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(
    null
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Iteration 2 Athlete Workflow Modals State
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [coachModalAthleteId, setCoachModalAthleteId] = useState<string | null>(
    null
  );
  const [approvalModalAthleteId, setApprovalModalAthleteId] = useState<
    string | null
  >(null);
  const [editProfileAthleteId, setEditProfileAthleteId] = useState<
    string | null
  >(null);
  const [aiAssistanceMode, setAiAssistanceMode] =
    useState<AiAssistanceMode | null>(null);

  // Iteration 3 Medical & Injury Intelligence Drawers & Modals State
  const [selectedInjuryDrawerId, setSelectedInjuryDrawerId] = useState<
    string | null
  >(null);
  const [isReportInjuryOpen, setIsReportInjuryOpen] = useState(false);
  const [reportInjuryInitialRegion, setReportInjuryInitialRegion] =
    useState<BodyRegionId>('Hamstring — Left');
  const [reportInjuryInitialAthleteId, setReportInjuryInitialAthleteId] =
    useState<string | null>(null);
  const [rehabSessionModalInjuryId, setRehabSessionModalInjuryId] = useState<
    string | null
  >(null);
  const [rtpGateModalInjuryId, setRtpGateModalInjuryId] = useState<
    string | null
  >(null);
  const [isMorningTriageOpen, setIsMorningTriageOpen] = useState(false);
  const [isSessionAssignmentOpen, setIsSessionAssignmentOpen] = useState(false);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    triggerFallbackExportForToast(msg, {
      role: selectedRole,
      context,
      activeAthlete:
        athletes.find((a) => a.id === activeAthlete360Id) || athletes[0],
      athletes,
      injuries,
      sessions,
      nutritionPlans,
      testResults,
      aiAuditTrail,
    });
  };

  const handleGlobalExport = (format: 'PDF' | 'CSV' | 'Excel' | 'JSON') => {
    if (format === 'JSON') {
      const file = exportToJSON(`usi_system_snapshot_${activeNav}`, {
        exportedAt: '28 Sep 2026',
        exportedByRole: selectedRole,
        activeModule: activeNav,
        hierarchyContext: context,
        focusAthlete: activeAthlete360,
        athletes,
        injuries,
        sessions,
        nutritionPlans,
        testResults,
        aiAuditTrail,
      });
      triggerToast(`Exported complete USI telemetry JSON (${file}) ✓`);
      return;
    }

    const file = exportAthletesRoster(
      format,
      athletes,
      selectedRole,
      `${context.federation} — ${context.squad} (${activeNav.toUpperCase()})`
    );
    triggerToast(`Exported ${format} Dossier (${file}) ✓`);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), 3800);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // Derived active references (always fresh from state)
  const drawerAthlete =
    athletes.find((a) => a.id === drawerAthleteId) || null;
  const activeAthlete360 =
    athletes.find((a) => a.id === activeAthlete360Id) || athletes[0];
  const coachModalAthlete =
    athletes.find((a) => a.id === coachModalAthleteId) || null;
  const approvalModalAthlete =
    athletes.find((a) => a.id === approvalModalAthleteId) || null;
  const editProfileAthlete =
    athletes.find((a) => a.id === editProfileAthleteId) || null;

  const selectedInjuryDrawer =
    injuries.find((i) => i.id === selectedInjuryDrawerId) || null;
  const rehabSessionModalInjury =
    injuries.find((i) => i.id === rehabSessionModalInjuryId) || null;
  const rtpGateModalInjury =
    injuries.find((i) => i.id === rtpGateModalInjuryId) || null;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsNotificationsOpen(false);
        setIsRiskModalOpen(false);
        setIsHelpModalOpen(false);
        setDrawerAthleteId(null);
        setSelectedSession(null);
        setAiAssistanceMode(null);
        setSelectedInjuryDrawerId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper to update a single athlete + log audit trail & timeline
  const updateAthleteWithAudit = (
    athleteId: string,
    updates: Partial<Athlete>,
    auditAction: string,
    toastMsg?: string,
    timelineEvent?: {
      title: string;
      description: string;
      category: Athlete['timeline'][0]['category'];
      detailNotes: string;
    }
  ) => {
    setAthletes((prev) =>
      prev.map((a) => {
        if (a.id !== athleteId) return a;
        const newAudit = {
          id: `aud-${Date.now()}`,
          timestamp: 'Today · Just now',
          role: selectedRole,
          action: auditAction,
        };
        const nextTimeline = timelineEvent
          ? [
              {
                id: `tl-${Date.now()}`,
                date: '28 Sep',
                time: 'Just now',
                title: timelineEvent.title,
                description: timelineEvent.description,
                category: timelineEvent.category,
                actor: selectedRole,
                detailNotes: timelineEvent.detailNotes,
              },
              ...a.timeline,
            ]
          : a.timeline;

        return {
          ...a,
          ...updates,
          lastUpdated: 'Today',
          auditTrail: [newAudit, ...a.auditTrail],
          timeline: nextTimeline,
        };
      })
    );
    if (toastMsg) triggerToast(toastMsg);
  };

  // Medical Handlers
  const handleUpdateInjury = (
    injuryId: string,
    updates: Partial<Injury>,
    auditAction: string,
    toastMsg: string
  ) => {
    const targetInj = injuries.find((i) => i.id === injuryId);
    setInjuries((prev) =>
      prev.map((inj) =>
        inj.id === injuryId
          ? { ...inj, ...updates, lastUpdated: 'Just now' }
          : inj
      )
    );
    if (targetInj) {
      updateAthleteWithAudit(
        targetInj.athleteId,
        {},
        auditAction,
        toastMsg,
        {
          title: auditAction,
          description: `${targetInj.diagnosis} (${targetInj.bodyRegionDisplay})`,
          category: 'Medical',
          detailNotes: auditAction,
        }
      );
    } else {
      triggerToast(toastMsg);
    }
  };

  const handleAddMedicalNote = (
    injuryId: string,
    noteData: Omit<MedicalNoteRecord, 'id'>
  ) => {
    const newNote: MedicalNoteRecord = {
      ...noteData,
      id: `mn-${Date.now()}`,
    };
    setInjuries((prev) =>
      prev.map((inj) =>
        inj.id === injuryId
          ? {
              ...inj,
              lastUpdated: 'Just now',
              medicalNotes: [newNote, ...inj.medicalNotes],
            }
          : inj
      )
    );
    updateAthleteWithAudit(
      noteData.athleteId,
      { medicalNote: noteData.note },
      `Added ${noteData.noteType} clinical note: "${noteData.note}"`,
      `Medical note logged by ${noteData.author}`,
      {
        title: `Medical Note (${noteData.noteType})`,
        description: noteData.note,
        category: 'Medical',
        detailNotes: `Author: ${noteData.author} (${noteData.authorRole}) — "${noteData.note}"`,
      }
    );
  };

  const handleSubmitNewInjury = (newInjury: Injury) => {
    setInjuries((prev) => [newInjury, ...prev]);

    // Auto-create clinical 5-stage rehabilitation plan for this injury
    const newRehabPlan: RehabPlanRecord = {
      id: `rehab-${newInjury.id}`,
      injuryId: newInjury.id,
      athleteId: newInjury.athleteId,
      athleteName: newInjury.athleteName,
      title: `${newInjury.injuryTitle} Clinical Rehabilitation Protocol`,
      currentStage: 1,
      totalStages: 5,
      progressPct: 15,
      trackStatus: 'On Track',
      currentFocus: 'Pain reduction & acute tissue off-loading',
      nextMilestone: 'Clinical re-assessment & isometric force tolerance',
      targetDate: '14 Oct 2026',
      stages: [
        {
          stageNumber: 1,
          title: 'Pain Reduction',
          status: 'Current',
          objectives: [
            `Resolve acute symptoms and resting discomfort in ${newInjury.bodyRegionDisplay}`,
            'Establish pain-free active range of motion',
          ],
          exercises: ['Isometric Holds (sub-maximal)', 'Cryotherapy & Compression', 'Gentle Mobility'],
          tests: ['Zero resting pain', 'Pain ≤ 2/10 during light isometric activation'],
          completionCriteria: ['Pain score ≤ 2/10', 'Resting swelling resolved'],
          assignedProfessional: 'Dr. S. Patel (Physiotherapist)',
        },
        {
          stageNumber: 2,
          title: 'Strength Restoration',
          status: 'Pending',
          objectives: ['Restore bilateral force symmetry > 85%', 'Neuromuscular activation'],
          exercises: ['Targeted Resistance Protocol', 'Eccentric Control Drills'],
          tests: ['Force plate / dynamometer symmetry > 85%'],
          completionCriteria: ['Limb symmetry index ≥ 85%'],
          assignedProfessional: 'Dr. S. Patel (Physiotherapist)',
        },
        {
          stageNumber: 3,
          title: 'Sport-Specific Training',
          status: 'Pending',
          objectives: ['Progressive running & tactical drill re-introduction', 'Deceleration mechanics'],
          exercises: ['Linear Acceleration Drills', 'Change of Direction Mechanics'],
          tests: ['GPS sprint tolerance up to 85% Vmax'],
          completionCriteria: ['Running tolerance verified via GPS'],
          assignedProfessional: 'Dr. S. Patel & Coach',
        },
        {
          stageNumber: 4,
          title: 'Full Training',
          status: 'Pending',
          objectives: ['Unrestricted team tactical drill participation'],
          exercises: ['Full Squad Tactical Grids', 'Match-speed Sprints'],
          tests: ['Full training exposure with zero flare-up'],
          completionCriteria: ['Team training clearance signed'],
          assignedProfessional: 'Dr. S. Patel & Coach',
        },
        {
          stageNumber: 5,
          title: 'Return to Competition',
          status: 'Pending',
          objectives: ['Full competitive match availability'],
          exercises: ['Match Play Conditioning', 'Championship Drills'],
          tests: ['Chief Medical Officer sign-off'],
          completionCriteria: ['Clinical clearance verified'],
          assignedProfessional: 'Chief Medical Officer',
        },
      ],
      sessions: [
        {
          id: `rs-init-${Date.now()}`,
          date: '28 Sep',
          focus: 'Acute assessment & baseline protection',
          painBefore: newInjury.painScore,
          painAfter: Math.max(1, newInjury.painScore - 1),
          exercises: ['Isometric Holds', 'Cryotherapy', 'Lymphatic Compression'],
          rpe: 3,
          notes: `Initial clinical assessment logged. Restricted: ${newInjury.restrictions}`,
          athleteId: newInjury.athleteId,
          athleteName: newInjury.athleteName,
        },
      ],
    };
    setRehabPlans((prev) => [newRehabPlan, ...prev]);

    setMedicalAlerts((prev) => [
      {
        id: `ma-${Date.now()}`,
        type: 'New injury reported',
        title: 'New injury reported',
        detail: `${newInjury.athleteName} — ${newInjury.diagnosis} (${newInjury.bodyRegionDisplay})`,
        timestamp: 'Just now',
        severity: 'high',
        athleteId: newInjury.athleteId,
        injuryId: newInjury.id,
        acknowledged: false,
      },
      ...prev,
    ]);

    setNotifications((prev) => [
      {
        id: `notif-inj-${Date.now()}`,
        timestamp: 'Just now',
        read: false,
        category: 'Medical',
        title: `Injury Alert: ${newInjury.athleteName}`,
        description: `Diagnosed with ${newInjury.diagnosis} (${newInjury.bodyRegionDisplay}). Status: Restricted. Pain: ${newInjury.painScore}/10.`,
        severity: 'High',
        linkedAthleteId: newInjury.athleteId,
        targetNav: 'injury-intelligence',
      },
      ...prev,
    ]);

    const targetAth = athletes.find((a) => a.id === newInjury.athleteId);
    updateAthleteWithAudit(
      newInjury.athleteId,
      {
        trainingStatus: 'INJURED',
        medicalStatus: 'Restricted',
        status: 'Attention',
        injuryRisk: 'High',
        readiness: Math.max(48, (targetAth?.readiness || 80) - 26),
        sorenessScore: newInjury.painScore,
      },
      `Reported new injury: ${newInjury.diagnosis} (${newInjury.bodyRegionDisplay})`,
      `New Injury Reported: ${newInjury.athleteName} — ${newInjury.bodyRegionDisplay}`,
      {
        title: `Injury reported: ${newInjury.injuryTitle}`,
        description: `${newInjury.bodyRegionDisplay} · ${newInjury.severity} · Pain ${newInjury.painScore}/10`,
        category: 'Medical',
        detailNotes: `Mechanism: ${newInjury.mechanism}. Restrictions: ${newInjury.restrictions}`,
      }
    );
  };

  const handleSaveRehabSession = (
    injuryId: string,
    session: RehabSessionRecord
  ) => {
    setRehabPlans((prev) =>
      prev.map((p) => {
        if (p.injuryId !== injuryId) return p;
        const nextPct = Math.min(100, p.progressPct + 7);
        return {
          ...p,
          progressPct: nextPct,
          sessions: [session, ...p.sessions],
        };
      })
    );
    setInjuries((prev) =>
      prev.map((inj) =>
        inj.id === injuryId
          ? {
              ...inj,
              painScore: session.painAfter,
              rehabProgressPct: Math.min(100, inj.rehabProgressPct + 7),
              lastUpdated: 'Just now',
            }
          : inj
      )
    );
    updateAthleteWithAudit(
      session.athleteId,
      { trainingStatus: 'IN REHAB' },
      `Logged completed rehab session: ${session.focus} (Pain ${session.painBefore}/10 → ${session.painAfter}/10)`,
      `Rehab Session Logged ✓ — Progress updated`,
      {
        title: 'Rehabilitation session completed',
        description: `${session.focus} · Exercises: ${session.exercises.join(', ')}`,
        category: 'Medical',
        detailNotes: session.notes,
      }
    );
  };

  const handleToggleGateCriterion = (
    injuryId: string,
    key: keyof Injury['gateCriteria']
  ) => {
    setInjuries((prev) =>
      prev.map((inj) => {
        if (inj.id !== injuryId) return inj;
        const nextVal = !inj.gateCriteria[key];
        return {
          ...inj,
          gateCriteria: {
            ...inj.gateCriteria,
            [key]: nextVal,
          },
          medicalStatus:
            key === 'medicalClearanceMet' && nextVal
              ? 'Cleared'
              : inj.medicalStatus,
        };
      })
    );
  };

  const handleAdvanceRtpStage = (
    injuryId: string,
    overrideDetails?: {
      reason: string;
      authorisedBy: string;
      timestamp: string;
    }
  ) => {
    const targetInj = injuries.find((i) => i.id === injuryId);
    if (!targetInj) return;
    const nextStage = Math.min(5, targetInj.rtpStage + 1);
    const nextStageName = RTP_STAGE_NAMES[nextStage] || 'Return to Competition';
    const nextPct = nextStage === 5 ? 100 : Math.min(95, targetInj.rehabProgressPct + 16);

    setInjuries((prev) =>
      prev.map((inj) =>
        inj.id === injuryId
          ? {
              ...inj,
              rtpStage: nextStage,
              rtpStageName: nextStageName,
              rehabProgressPct: nextPct,
              stage: nextStage >= 4 ? 'Return-to-Play' : inj.stage,
              medicalStatus: nextStage === 5 ? 'Cleared' : inj.medicalStatus,
              overrideApproved: Boolean(overrideDetails),
              overrideDetails: overrideDetails || inj.overrideDetails,
              lastUpdated: 'Just now',
            }
          : inj
      )
    );

    setRehabPlans((prev) =>
      prev.map((p) => {
        if (p.injuryId !== injuryId) return p;
        return {
          ...p,
          currentStage: nextStage,
          progressPct: nextPct,
          stages: p.stages.map((st) => ({
            ...st,
            status:
              st.stageNumber < nextStage
                ? 'Complete'
                : st.stageNumber === nextStage
                  ? 'Current'
                  : 'Pending',
          })),
        };
      })
    );

    if (nextStage === 5) {
      setNotifications((prev) => [
        {
          id: `notif-rtp-cleared-${Date.now()}`,
          timestamp: 'Just now',
          read: false,
          category: 'Medical',
          title: `Full Match Clearance: ${targetInj.athleteName}`,
          description: `Stage 5/5 Return-to-Competition approved by ${selectedRole}. Athlete is now FULLY AVAILABLE for senior selection.`,
          severity: 'Low',
          linkedAthleteId: targetInj.athleteId,
          targetNav: 'injury-intelligence',
        },
        ...prev,
      ]);
    }

    const auditMsg = overrideDetails
      ? `RTP Gate Override Approved by ${overrideDetails.authorisedBy}: Advanced ${targetInj.athleteName} to Stage ${nextStage}/5 (${nextStageName}). Reason: "${overrideDetails.reason}"`
      : `Advanced ${targetInj.athleteName} to RTP Stage ${nextStage}/5 (${nextStageName})`;

    updateAthleteWithAudit(
      targetInj.athleteId,
      {
        trainingStatus: nextStage >= 5 ? 'ACTIVE' : nextStage >= 4 ? 'RETURN TO PLAY' : 'IN REHAB',
        medicalStatus: nextStage === 5 ? 'Cleared' : targetInj.medicalStatus,
      },
      auditMsg,
      overrideDetails
        ? `Override Logged in Audit Trail ✓ — Advanced to Stage ${nextStage}/5`
        : `Advanced ${targetInj.athleteName} to Stage ${nextStage}/5 (${nextStageName})`,
      {
        title: `Advanced to RTP Stage ${nextStage}/5: ${nextStageName}`,
        description: overrideDetails
          ? `Override by ${overrideDetails.authorisedBy}`
          : 'All clinical gate criteria verified',
        category: 'Medical',
        detailNotes: auditMsg,
      }
    );
  };

  // Navigation handler
  const handleSelectNav = (nav: NavItemId) => {
    if (nav === 'enrollment' || nav === 'verification') {
      setActiveNav(nav);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveNav(nav);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFullAthlete360 = (athlete: Athlete) => {
    setDrawerAthleteId(null);
    setActiveAthlete360Id(athlete.id);
    setActiveNav('athlete-360');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateContext = (partial: Partial<HierarchyContext>) => {
    const next = { ...context, ...partial };
    setContext(next);
    const dataset = generateContextDataset(next);
    setAthletes(dataset.athletes);
    setInjuries(dataset.injuries);
    setSessions(dataset.sessions);
    setNutritionPlans(dataset.nutritionPlans);
    setRehabPlans(dataset.rehabPlans);
    setMedicalAlerts(dataset.medicalAlerts);
    setMedicalRiskAlerts(dataset.medicalRiskAlerts);
    setWellnessProfile(dataset.wellnessProfile);
    setTests(dataset.tests);
    setAssessmentPrograms(dataset.assessmentPrograms);
    setTestResults(dataset.testResults);
    setTalentProfiles(dataset.talentProfiles);
    setHydrationLogs(dataset.hydrationLogs);
    setSupplements(dataset.supplements);
    setBodyComposition(dataset.bodyComposition);
    setReports(dataset.reports);
    setAnalyticsSeries(dataset.analyticsSeries);
    setRecommendations(dataset.recommendations);
    setAiActionItems(dataset.aiActionItems);
    setAiRiskSignals(dataset.aiRiskSignals);
    setAiTrainingModifications(dataset.aiTrainingModifications);
    if (dataset.athletes[0]) {
      setActiveAthlete360Id(dataset.athletes[0].id);
    }
    const changedKey = Object.keys(partial)[0];
    const changedVal = Object.values(partial)[0];
    triggerToast(
      `Context updated: ${changedKey?.toUpperCase()} → ${changedVal} (${dataset.athletes.length} athletes loaded for ${dataset.athletes[0]?.sport || 'sport'})`
    );
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setAiMessages(getPersonaInitialMessages(role));
    setSessionMemoryTopic(null);
    triggerToast(`Switched operational view to ${role}`);
  };

  const handleSelectKpi = (kpi: KpiFilterKey) => {
    setActiveKpi((prev) => (prev === kpi ? null : kpi));

    if (
      kpi === 'total-athletes' ||
      kpi === 'registered-athletes' ||
      kpi === 'total-registered' ||
      kpi === 'matchday-available'
    ) {
      setActiveNav('athlete-registry');
    } else if (kpi === 'active-athletes' || kpi === 'squad-availability') {
      setTableStatusFilter('Ready');
      setSelectedReadinessTier('Ready');
      triggerToast('Filtered Attention Table to Ready / Active clearance athletes');
    } else if (
      kpi === 'attention' ||
      kpi === 'high-priority-flags' ||
      kpi === 'restricted-minutes' ||
      kpi === 'modified-load' ||
      kpi === 'tactical-flags'
    ) {
      setTableStatusFilter('Attention');
      setIsMorningTriageOpen(true);
      triggerToast('Opened Morning Squad Triage for high-priority / load-capped athletes');
    } else if (
      kpi === 'injuries' ||
      kpi === 'injury-incidence' ||
      kpi === 'msk-screening-rate' ||
      kpi === 'mean-pain-score' ||
      kpi === 'medical-clearances'
    ) {
      setActiveNav('injury-intelligence');
    } else if (
      kpi === 'active-clinical-cases' ||
      kpi === 'active-injuries' ||
      kpi === 'reinjury-rate'
    ) {
      setActiveNav('injury-register');
    } else if (
      kpi === 'rtp-progression' ||
      kpi === 'return-to-play' ||
      kpi === 'clearance-due' ||
      kpi === 'mean-days-to-play'
    ) {
      setActiveNav('return-to-play');
    } else if (
      kpi === 'rehab-adherence' ||
      kpi === 'in-rehabilitation' ||
      kpi === 'compliance'
    ) {
      setActiveNav('rehabilitation');
    } else if (kpi === 'olympic-pathway') {
      setActiveNav('assessments-talent');
    } else if (
      kpi === 'acwr-stability' ||
      kpi === 'acwr-tactical' ||
      kpi === 'acwr-squad' ||
      kpi === 'acwr-spikes' ||
      kpi === 'acute-chronic-ratio' ||
      kpi === 'training-load'
    ) {
      setActiveNav('workload');
    } else if (
      kpi === 'interdisciplinary-sync' ||
      kpi === 'governance-compliance'
    ) {
      setActiveNav('analytics-federation');
    } else if (kpi === 'session-attendance') {
      setActiveNav('attendance-rpe');
    } else if (
      kpi === 'tactical-load-adherence' ||
      kpi === 'daily-sessions' ||
      kpi === 'my-training-rpe-target'
    ) {
      setActiveNav('sessions');
    } else if (
      kpi === 'tactical-readiness' ||
      kpi === 'squad-mean-hrv' ||
      kpi === 'mean-readiness' ||
      kpi === 'hrv-recovery' ||
      kpi === 'recovery-hrv' ||
      kpi === 'my-readiness' ||
      kpi === 'my-readiness-score' ||
      kpi === 'my-hrv-baseline'
    ) {
      setActiveNav('readiness');
    } else if (
      kpi === 'force-plate-asymmetry' ||
      kpi === 'neuromuscular-fatigue' ||
      kpi === 'biomarker-flags'
    ) {
      setActiveNav('fatigue');
    } else if (
      kpi === 'high-speed-exposure' ||
      kpi === 'high-speed-volume' ||
      kpi === 'data-freshness' ||
      kpi === 'gps-fleet-pods'
    ) {
      setActiveNav('gps-wearables');
    } else if (
      kpi === 'sleep-recovery-mean' ||
      kpi === 'sleep-duration' ||
      kpi === 'my-sleep-score'
    ) {
      setActiveNav('recovery');
    } else if (
      kpi === 'hydration-optimal' ||
      kpi === 'hydration-risk' ||
      kpi === 'dehydration-flags' ||
      kpi === 'my-hydration-status'
    ) {
      setActiveNav('nutrition-hydration');
    } else if (
      kpi === 'caloric-target-compliance' ||
      kpi === 'fueling-compliance' ||
      kpi === 'active-plans' ||
      kpi === 'protein-target-met'
    ) {
      setActiveNav('nutrition-plans');
    } else if (kpi === 'body-comp-goals' || kpi === 'body-comp-stable') {
      setActiveNav('nutrition-body-composition');
    } else if (
      kpi === 'supplement-audit' ||
      kpi === 'wada-audit' ||
      kpi === 'wada-whereabouts' ||
      kpi === 'anti-doping-cleared'
    ) {
      setActiveNav('nutrition-supplements');
    } else if (kpi === 'energy-availability') {
      setActiveNav('nutrition');
    } else if (
      kpi === 'eligibility-rate' ||
      kpi === 'pending-approvals' ||
      kpi === 'pending-verification' ||
      kpi === 'verified-passports'
    ) {
      setActiveNav('verification');
    } else if (
      kpi === 'international-sanctions' ||
      kpi === 'logistics-manifests' ||
      kpi === 'urgent-travel-flags' ||
      kpi === 'transport-routes'
    ) {
      setActiveNav('manifests');
    } else if (kpi === 'my-recovery-status' || kpi === 'medical-status') {
      setActiveNav('athlete-360');
    } else if (
      kpi === 'facility-utilization' ||
      kpi === 'facility-bookings' ||
      kpi === 'pitch-readiness' ||
      kpi === 'turf-quality-score' ||
      kpi === 'maintenance-tickets' ||
      kpi === 'active-work-orders'
    ) {
      setActiveNav('facilities');
    } else if (kpi === 'equipment-calibrated') {
      setActiveNav('cargo');
    } else if (kpi === 'incident-safety' || kpi === 'facility-budget') {
      setActiveNav('operations');
    } else if (kpi === 'readiness') {
      setSelectedReadinessTier('Monitor');
      setTableStatusFilter('Monitor');
      triggerToast('Highlighting Monitor readiness tier (65–79%)');
    } else if (kpi === 'attendance') {
      setSelectedSession(sessions[0]);
    } else {
      triggerToast(`Focused KPI metric: ${kpi.replace(/-/g, ' ').toUpperCase()}`);
    }
  };

  const handleSelectReadinessTier = (tier: string | null) => {
    setSelectedReadinessTier(tier);
    if (tier === 'Ready') {
      setTableStatusFilter('Ready');
      triggerToast('Filtered Athlete Table to Ready tier (80–100%)');
    } else if (tier === 'Monitor') {
      setTableStatusFilter('Monitor');
      triggerToast('Filtered Athlete Table to Monitor tier (65–79%)');
    } else if (tier === 'Restricted' || tier === 'Unavailable') {
      setTableStatusFilter('Attention');
      triggerToast(`Filtered Athlete Table to ${tier} / Attention cohort`);
    } else {
      setTableStatusFilter('All');
    }
  };

  const handleReviewRiskAthletes = () => {
    setIsMorningTriageOpen(true);
    setTableStatusFilter('Attention');
    document
      .getElementById('athlete-attention-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    triggerToast(
      'Morning Squad Triage Console opened for elevated injury-risk cohort'
    );
  };

  const handleApplyMorningTriageModification = (
    athleteId: string,
    modification: string,
    trainingStatus: Athlete['trainingStatus'],
    notes: string
  ) => {
    const target = athletes.find((a) => a.id === athleteId);
    updateAthleteWithAudit(
      athleteId,
      { trainingStatus },
      `Morning Triage: ${modification} (${trainingStatus})`,
      `Applied morning modification to ${target?.name || 'athlete'}: ${modification}`,
      {
        title: `Morning Squad Triage: ${modification}`,
        description: notes,
        category: 'Training',
        detailNotes: `Prescribed by ${selectedRole}: ${modification}. Training status set to ${trainingStatus}.`,
      }
    );

    // Update today's primary session notes & load
    setSessions((prev) =>
      prev.map((s, idx) =>
        idx === 0
          ? {
              ...s,
              notes: `${s.notes || ''} · [Triage: ${target?.name || 'Athlete'} → ${modification}]`,
            }
          : s
      )
    );
  };

  const handleAthleteWellnessSurveySubmit = (scores: {
    sleep: number;
    fatigue: number;
    soreness: number;
    stress: number;
    readiness: number;
  }) => {
    const targetAthId = 'ath-01'; // Default active athlete Ananya Sen
    const target = athletes.find((a) => a.id === targetAthId) || athletes[0];
    if (!target) return;

    updateAthleteWithAudit(
      target.id,
      {
        readiness: scores.readiness,
        sorenessScore: scores.soreness,
        wellnessScore: Math.round(
          (scores.sleep + (10 - scores.fatigue) * 10 + (10 - scores.stress) * 10) / 3
        ),
        sleepHours: Number((scores.sleep / 10).toFixed(1)),
      },
      `Logged morning wellness check-in: Readiness ${scores.readiness}%, Soreness ${scores.soreness}/10`,
      `Morning wellness check-in submitted ✓ Readiness computed at ${scores.readiness}%`,
      {
        title: 'Daily Hooper-Mackinnon Wellness Logged',
        description: `Sleep: ${scores.sleep}/100 · Soreness: ${scores.soreness}/10 · Fatigue: ${scores.fatigue}/10 · Stress: ${scores.stress}/10`,
        category: 'Training',
        detailNotes: `Calculated readiness score ${scores.readiness}%. Synced with coaching staff & sports science triage.`,
      }
    );
  };

  const handleApplyRecommendation = (id: string) => {
    setRecommendations((prev) =>
      prev.map((rec) => {
        if (rec.id !== id) return rec;
        const nextApplied = !rec.applied;
        if (nextApplied) {
          triggerToast(`Recommendation Applied ✓ — Logged by ${selectedRole}`);
        } else {
          triggerToast('Recommendation reverted to pending review');
        }
        return {
          ...rec,
          applied: nextApplied,
          appliedAt: nextApplied ? '06:14' : undefined,
          appliedBy: nextApplied ? selectedRole : undefined,
        };
      })
    );
  };

  const handleReviewRecommendation = (rec: AIRecommendation) => {
    if (rec.linkedAthleteId) {
      const target = athletes.find((a) => a.id === rec.linkedAthleteId);
      if (target) {
        setDrawerAthleteId(target.id);
        return;
      }
    }
    setIsRiskModalOpen(true);
  };

  // Session Assignment Handler
  const handleAssignAthleteToSession = (sessionId: string, athleteId: string, athleteName: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    const sessionTitle = session?.title || sessionId;

    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? {
              ...s,
              attendedAthletes: s.attendedAthletes?.includes(athleteId)
                ? s.attendedAthletes
                : [...(s.attendedAthletes || []), athleteId],
            }
          : s
      )
    );

    const target = athletes.find((a) => a.id === athleteId);
    if (target) {
      const updatedBreakdown = {
        ...target.profileCompletionBreakdown,
        trainingPlan: true,
      };
      const completedCount =
        Object.values(updatedBreakdown).filter(Boolean).length;
      const newPct = Math.min(100, Math.round((completedCount / 6) * 100));

      updateAthleteWithAudit(
        athleteId,
        {
          trainingStatus:
            target.trainingStatus === 'PENDING' ? 'ACTIVE' : target.trainingStatus,
          profileCompletionBreakdown: updatedBreakdown,
          profileCompletion: Math.max(target.profileCompletion, newPct),
        },
        `Assigned to training session: ${sessionTitle}`,
        `Assigned ${athleteName || target.name} to ${sessionTitle} ✓`,
        {
          title: 'Assigned to training session',
          description: sessionTitle,
          category: 'Training',
          detailNotes: `Scheduled session assigned by ${selectedRole} (${session?.day || 'Today'} · ${session?.time || '08:00 AM'}).`,
        }
      );

      // Create high-visibility coaching notification
      setNotifications((prev) => [
        {
          id: `notif-sess-assign-${Date.now()}`,
          timestamp: 'Just now',
          read: false,
          category: 'Training',
          title: `Training Scheduled: ${athleteName || target.name}`,
          description: `Assigned to session "${sessionTitle}" (${session?.intensity || 'High'} intensity, ${session?.plannedLoadAu || 450} AU).`,
          severity: 'Low',
          linkedAthleteId: athleteId,
          targetNav: 'sessions',
        },
        ...prev,
      ]);
    }
  };

  const handleCompleteSessionAction = (sessionId: string, msg: string) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === sessionId
          ? { ...s, status: 'Completed', actualLoadAu: s.actualLoadAu || s.plannedLoadAu }
          : s
      )
    );
    setSelectedSession((prev) =>
      prev && prev.id === sessionId
        ? { ...prev, status: 'Completed', actualLoadAu: prev.actualLoadAu || prev.plannedLoadAu }
        : prev
    );
    triggerToast(msg);
  };

  const handleSelectNotification = (notif: AppNotification) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setIsNotificationsOpen(false);

    if (notif.targetNav) {
      setActiveNav(notif.targetNav);
    }
    if (notif.linkedSessionId) {
      const sess = sessions.find((s) => s.id === notif.linkedSessionId);
      if (sess) setSelectedSession(sess);
    } else if (notif.linkedAthleteId) {
      const ath = athletes.find((a) => a.id === notif.linkedAthleteId);
      if (ath) {
        if (notif.targetNav === 'athlete-360') {
          setActiveAthlete360Id(ath.id);
        } else {
          setDrawerAthleteId(ath.id);
        }
      }
    }
  };

  // Coach Assignment Handler
  const handleConfirmAssignCoach = (
    athleteId: string,
    coach: CoachProfile,
    roleLabel: string,
    startDate: string
  ) => {
    const target = athletes.find((a) => a.id === athleteId);
    if (!target) return;

    const updatedBreakdown = {
      ...target.profileCompletionBreakdown,
      coachAssignment: true,
    };
    const completedCount =
      Object.values(updatedBreakdown).filter(Boolean).length;
    const newPct = Math.min(100, Math.round((completedCount / 6) * 100));

    updateAthleteWithAudit(
      athleteId,
      {
        coach: coach.name,
        coachRole: roleLabel,
        profileCompletionBreakdown: updatedBreakdown,
        profileCompletion: newPct,
        trainingStatus:
          target.verificationStatus === 'Verified' && target.trainingStatus === 'PENDING'
            ? 'ACTIVE'
            : target.trainingStatus,
      },
      `Assigned ${coach.name} as ${roleLabel} (Start: ${startDate})`,
      `Coach Assigned ✓ — ${coach.name} assigned to ${target.name}`,
      {
        title: `Coach assigned: ${coach.name}`,
        description: `${roleLabel} · Effective ${startDate}`,
        category: 'Administrative',
        detailNotes: `${coach.name} (${coach.role}, ${coach.squad}) assigned as ${roleLabel}.`,
      }
    );

    // Create staff notification
    setNotifications((prev) => [
      {
        id: `notif-coach-assign-${Date.now()}`,
        timestamp: 'Just now',
        read: false,
        category: 'Administrative',
        title: `Coach Assigned: ${target.name}`,
        description: `${coach.name} has been assigned as ${roleLabel} for ${target.name}.`,
        severity: 'Low',
        linkedAthleteId: athleteId,
        targetNav: 'athlete-registry',
      },
      ...prev,
    ]);
  };

  // Approval Workflow Handlers
  const handleApproveAthlete = (athleteId: string) => {
    const target = athletes.find((a) => a.id === athleteId);
    if (!target) return;
    updateAthleteWithAudit(
      athleteId,
      {
        verificationStatus: 'Verified',
        trainingStatus:
          target.trainingStatus === 'PENDING' ? 'ACTIVE' : target.trainingStatus,
      },
      'Approved athlete federation verification',
      `Approved ${target.name} (${target.athleteId}) — Status updated to Verified`,
      {
        title: 'Federation verification approved',
        description: 'Applicant profile and documents verified',
        category: 'Administrative',
        detailNotes: `Verification status changed from Pending to Verified by ${selectedRole}.`,
      }
    );
  };

  const handleRequestChangesAthlete = (athleteId: string, reason: string) => {
    const target = athletes.find((a) => a.id === athleteId);
    if (!target) return;
    updateAthleteWithAudit(
      athleteId,
      {
        verificationStatus: 'Changes Requested',
        verificationNotes: reason,
      },
      `Requested verification changes: "${reason}"`,
      `Changes Requested for ${target.name}: "${reason}"`,
      {
        title: 'Verification changes requested',
        description: `Reason: ${reason}`,
        category: 'Administrative',
        detailNotes: `Application flagged with Changes Requested by ${selectedRole}: "${reason}"`,
      }
    );
  };

  const handleRejectAthlete = (athleteId: string, reason: string) => {
    const target = athletes.find((a) => a.id === athleteId);
    if (!target) return;
    updateAthleteWithAudit(
      athleteId,
      {
        verificationStatus: 'Rejected',
        trainingStatus: 'INACTIVE',
        verificationNotes: reason,
      },
      `Rejected verification application: "${reason}"`,
      `Application rejected for ${target.name}`,
      {
        title: 'Verification application rejected',
        description: `Reason: ${reason}`,
        category: 'Administrative',
        detailNotes: `Application rejected by ${selectedRole}: "${reason}"`,
      }
    );
  };

  // Bulk Update Handler
  const handleBulkUpdateAthletes = (
    athleteIds: string[],
    updates: Partial<Athlete>,
    actionDescription: string
  ) => {
    setAthletes((prev) =>
      prev.map((a) => {
        if (!athleteIds.includes(a.id)) return a;
        return {
          ...a,
          ...updates,
          auditTrail: [
            {
              id: `aud-bulk-${Date.now()}-${a.id}`,
              timestamp: 'Today · Just now',
              role: selectedRole,
              action: actionDescription,
            },
            ...a.auditTrail,
          ],
        };
      })
    );
    triggerToast(`${actionDescription} ✓`);
  };

  // Iteration 5: AI Copilot & Consequential Workflow Handlers (Powered by Gemini)
  const handleSendAICopilotQuery = async (query: string) => {
    const nowTime = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const userMsg: AICopilotMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      timestamp: nowTime,
      queryText: query,
      contextSnapshot: {
        athleteName: activeAthlete360.name,
        sport: context.sport,
        squad: context.squad,
        role: selectedRole,
        moduleName: activeNav,
      },
    };

    // Deterministic local enrichment/fallback (provides cohort tables & report previews when applicable)
    const { message: localReply, nextFilterTopic } = buildCopilotResponse(
      query,
      {
        athlete: activeAthlete360,
        allAthletes: athletes,
        squad: context.squad,
        sport: context.sport,
        role: selectedRole,
        moduleName: activeNav,
        lastFilterTopic: sessionMemoryTopic,
      }
    );

    setSessionMemoryTopic(nextFilterTopic);
    setAiMessages((prev) => [...prev, userMsg]);
    setIsCopilotThinking(true);

    // Build multi-turn conversation history for Gemini
    const historyPayload = aiMessages.slice(-10).map((m) => ({
      role: m.sender === 'user' ? ('user' as const) : ('model' as const),
      content:
        m.sender === 'user'
          ? m.queryText || ''
          : `${m.answerTitle ? m.answerTitle + ': ' : ''}${
              m.answerStatement || ''
            } ${m.interpretation || ''} ${
              m.recommendation ? 'Recommendation: ' + m.recommendation : ''
            }`.trim(),
    }));

    // Build comprehensive live app & data context
    const focusAthleteDetail = `${activeAthlete360.name} (${activeAthlete360.athleteId}, ${activeAthlete360.position} #${activeAthlete360.jerseyNumber}, Squad: ${activeAthlete360.squad}, Readiness: ${activeAthlete360.readiness}% [${activeAthlete360.readinessDelta >= 0 ? '+' : ''}${activeAthlete360.readinessDelta}% vs 7d], Status: ${activeAthlete360.status}, Training Status: ${activeAthlete360.trainingStatus}, Medical: ${activeAthlete360.medicalStatus}, Injury Risk: ${activeAthlete360.injuryRisk}, ACWR: ${activeAthlete360.acwr}, Acute Load: ${activeAthlete360.acuteLoadAu} AU, Chronic Load: ${activeAthlete360.chronicLoadAu} AU, HRV: ${activeAthlete360.hrvMs}ms [Baseline ${activeAthlete360.hrvBaselineMs}ms], Sleep: ${activeAthlete360.sleepFormatted}, Wellness: ${activeAthlete360.wellnessScore}/10, Soreness: ${activeAthlete360.sorenessScore}/10, Nutrition Compliance: ${activeAthlete360.nutritionCompliancePct}%, Hydration: ${activeAthlete360.hydrationStatus}, Medical Note: ${activeAthlete360.medicalNote})`;

    const athletesSummary = athletes
      .map(
        (a) =>
          `${a.name} (ID: ${a.id}, ${a.squad}, ${a.position}, Readiness ${a.readiness}%, ACWR ${a.acwr}, HRV ${a.hrvMs}ms/${a.hrvBaselineMs}ms, Sleep ${a.sleepFormatted}, Risk ${a.injuryRisk}, TrainingStatus ${a.trainingStatus}, Medical ${a.medicalStatus}, Nutrition ${a.nutritionCompliancePct}%, Hydration ${a.hydrationStatus})`
      )
      .join(' | ');

    const injuriesSummary = injuries
      .map(
        (inj) =>
          `${inj.athleteName}: ${inj.diagnosis} (${inj.bodyRegionDisplay}, ${inj.severity}, Pain ${inj.painScore}/10, Stage ${inj.stage}, RTP Stage ${inj.rtpStage}/5 ${inj.rtpStageName}, Rehab Progress ${inj.rehabProgressPct}%, Restrictions: ${inj.restrictions})`
      )
      .join(' | ');

    const sessionsSummary = sessions
      .slice(0, 6)
      .map(
        (s) =>
          `${s.title} (${s.day || 'Today'} ${s.time}, ${s.pitchOrVenue}, ${s.intensity} Intensity, Planned Load ${s.plannedLoadAu} AU, Status ${s.status}, Modified: ${
            s.modifiedAthletes
              .map((m) => `${m.athleteName} [${m.modification}]`)
              .join(', ') || 'None'
          })`
      )
      .join(' | ');

    const nutritionSummary = nutritionPlans
      .slice(0, 6)
      .map(
        (np) =>
          `${np.athleteName} (${np.planName}, Goal: ${np.goal}, Calories ${np.currentCalories}/${np.targetCalories} kcal, Protein ${np.currentProteinG}/${np.targetProteinG}g, Carbs ${np.currentCarbsG}/${np.targetCarbsG}g, Hydration ${np.currentHydrationL}/${np.targetHydrationL}L [${np.hydrationCompliancePct}%], Compliance ${np.compliancePct}%, Status ${np.status})`
      )
      .join(' | ');

    const assessmentsSummary = talentProfiles
      .slice(0, 6)
      .map(
        (tp) =>
          `${tp.athleteName} (${tp.squad}, Base Performance Index ${tp.basePerformanceIndex}, Alignment ${tp.benchmarkAlignment}, Priority ${tp.developmentPriority}, Status ${tp.status})`
      )
      .join(' | ');

    const pendingActionsSummary = aiActionItems
      .filter((i) => i.status === 'Pending Review')
      .map(
        (i) =>
          `${i.affectedAthleteName}: ${i.recommendation} (${i.priority} Priority, ${i.safetyClass})`
      )
      .join(' | ');

    try {
      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          model: copilotModel,
          context: {
            role: selectedRole,
            hierarchy: context,
            activeModule: activeNav,
            selectedAthleteName: activeAthlete360.name,
            focusAthleteDetail,
            athletesSummary,
            injuriesSummary,
            sessionsSummary,
            nutritionSummary,
            assessmentsSummary,
            pendingActionsSummary,
          },
          history: historyPayload,
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini endpoint returned ${response.status}`);
      }

      const data = await response.json();

      const validDomains = [
        'Training',
        'Recovery',
        'HRV',
        'Sleep',
        'Medical',
        'Nutrition',
        'Assessments',
      ];
      const validTones = ['emerald', 'amber', 'rose', 'sky'];

      const geminiEvidenceBundle: AIEvidenceBundle =
        Array.isArray(data.evidenceMetrics) && data.evidenceMetrics.length > 0
          ? {
              id: `ev-gem-${Date.now()}`,
              title: data.answerTitle || 'GEMINI MULTI-SIGNAL EVIDENCE BUNDLE',
              subjectLabel: `${activeAthlete360.name} · ${context.squad} (${selectedRole})`,
              confidence: data.confidence || 'High',
              generatedAt: `Today · ${nowTime} (${data.model || copilotModel})`,
              metrics: data.evidenceMetrics.map((m: any) => ({
                domain: validDomains.includes(m.domain) ? m.domain : 'Training',
                label: m.label || 'Telemetry Signal',
                deltaOrValue: m.deltaOrValue || 'Evaluated',
                detail: m.detail || 'Live USI telemetry stream',
                tone: validTones.includes(m.tone) ? m.tone : 'sky',
              })),
              clinicalDisclaimer:
                'Generated by USI Gemini Copilot using live connected athlete, medical, workload, and nutrition state. Consequential actions require human sign-off.',
            }
          : localReply.evidenceBundle || ARJUN_EVIDENCE_BUNDLE;

      const geminiActions: AICopilotActionButton[] =
        Array.isArray(data.suggestedActions) && data.suggestedActions.length > 0
          ? data.suggestedActions.map((act: any, idx: number) => ({
              id: `gem-act-${Date.now()}-${idx}`,
              label: act.label || 'Open Operational View',
              safetyClass:
                act.safetyClass === 'CONSEQUENTIAL' ||
                act.safetyClass === 'RECOMMENDATION'
                  ? act.safetyClass
                  : 'INFORMATIONAL',
              actionType: act.actionType || 'open-athlete-360',
              targetAthleteId: act.targetAthleteId || activeAthlete360.id,
            }))
          : localReply.actions || [];

      const geminiReply: AICopilotMessage = {
        id: `ai-gem-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle:
          data.answerTitle ||
          localReply.answerTitle ||
          'GEMINI OPERATIONAL ANALYSIS',
        answerStatement:
          data.answerStatement ||
          localReply.answerStatement ||
          ' Operational telemetry evaluated.',
        confidence: data.confidence || localReply.confidence || 'High',
        safetyClass:
          data.safetyClass || localReply.safetyClass || 'RECOMMENDATION',
        evidenceSummary:
          Array.isArray(data.evidenceSummary) && data.evidenceSummary.length > 0
            ? data.evidenceSummary.map((es: any) => ({
                label: es.label,
                value: es.value,
                tone: validTones.includes(es.tone) ? es.tone : 'sky',
              }))
            : localReply.evidenceSummary,
        evidenceBundle: geminiEvidenceBundle,
        interpretation: data.interpretation || localReply.interpretation,
        recommendation: data.recommendation || localReply.recommendation,
        isUncertaintyState:
          Boolean(data.isUncertaintyState) ||
          Boolean(localReply.isUncertaintyState),
        uncertaintyAlternative:
          data.uncertaintyAlternative || localReply.uncertaintyAlternative,
        tableHeaders: localReply.tableHeaders,
        tableRows: localReply.tableRows,
        generatedReportPreview: localReply.generatedReportPreview,
        actions: geminiActions,
        followUpSuggestions:
          Array.isArray(data.followUpSuggestions) &&
          data.followUpSuggestions.length > 0
            ? data.followUpSuggestions
            : localReply.followUpSuggestions,
      };

      setAiMessages((prev) => [...prev, geminiReply]);
      setAiAuditTrail((prev) => [
        {
          id: `aiaud-${Date.now()}`,
          query,
          recommendation:
            geminiReply.recommendation ||
            geminiReply.answerStatement ||
            'Advisory response',
          evidenceAccessed: [
            `Gemini (${data.model || copilotModel})`,
            'Connected Athlete Telemetry',
            `${context.squad} Workload & Medical State`,
          ],
          reviewedBy: selectedRole,
          reviewerRole: selectedRole,
          decision: 'Advisory Reviewed',
          actionTaken: 'Displayed in USI Copilot',
          timestamp: nowTime,
          safetyClass: geminiReply.safetyClass || 'INFORMATIONAL',
        },
        ...prev,
      ]);
    } catch (err) {
      console.warn('Gemini Copilot fallback to local engine:', err);
      setAiMessages((prev) => [...prev, localReply]);
      setAiAuditTrail((prev) => [
        {
          id: `aiaud-${Date.now()}`,
          query,
          recommendation:
            localReply.recommendation ||
            localReply.answerStatement ||
            'Advisory response',
          evidenceAccessed: [
            'Connected Athlete Telemetry',
            `${context.squad} Workload & Recovery`,
          ],
          reviewedBy: selectedRole,
          reviewerRole: selectedRole,
          decision: 'Advisory Reviewed',
          actionTaken: 'Displayed in USI Copilot',
          timestamp: nowTime,
          safetyClass: localReply.safetyClass || 'INFORMATIONAL',
        },
        ...prev,
      ]);
    } finally {
      setIsCopilotThinking(false);
    }
  };

  const handleExecuteCopilotAction = (action: AICopilotActionButton) => {
    if (action.actionType === 'open-training-mod-modal') {
      setIsTrainingModModalOpen(true);
    } else if (action.actionType === 'open-athlete-360') {
      const targetId = action.targetAthleteId || activeAthlete360.id;
      setActiveAthlete360Id(targetId);
      setActiveNav('athlete-360');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-training-module') {
      setActiveNav('sessions');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-medical-module') {
      setActiveNav('injury-intelligence');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-sports-science') {
      setActiveNav('readiness');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-nutrition') {
      setActiveNav('nutrition');
      setIsGlobalCopilotOpen(false);
    } else if (
      action.actionType === 'open-assessments-module' ||
      action.actionType === 'open-assessments'
    ) {
      setActiveNav('assessments-tid');
      setIsGlobalCopilotOpen(false);
    } else if (
      action.actionType === 'open-analytics-module' ||
      action.actionType === 'open-analytics'
    ) {
      setActiveNav('analytics-federation');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-action-centre') {
      setActiveNav('ai-action-centre');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-risk-centre') {
      setActiveNav('ai-risk-centre');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-automation') {
      setActiveNav('ai-automation');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-evidence-drawer') {
      setActiveEvidenceBundle(ARJUN_EVIDENCE_BUNDLE);
    } else if (action.actionType === 'open-coach-brief') {
      setAiAssistanceMode('coach-brief');
    } else if (action.actionType === 'open-ai-summary') {
      setAiAssistanceMode('summary');
    } else {
      triggerToast(`Executed operational workflow: ${action.label}`);
    }
  };

  const handleApproveTrainingModifications = (
    approvedItems: AITrainingModificationItem[]
  ) => {
    const approvedIds = approvedItems.map((i) => i.athleteId);
    setAthletes((prev) =>
      prev.map((ath) => {
        const mod = approvedItems.find((m) => m.athleteId === ath.id);
        if (!mod) return ath;
        return {
          ...ath,
          trainingStatus: 'RESTRICTED',
          lastUpdated: 'Just now',
          auditTrail: [
            {
              id: `aud-aimod-${Date.now()}-${ath.id}`,
              timestamp: 'Today · Just now',
              role: selectedRole,
              action: `Approved AI training modification: ${mod.currentPrescription} → ${mod.proposedPrescription} (${mod.expectedLoadImpact})`,
            },
            ...ath.auditTrail,
          ],
          timeline: [
            {
              id: `tl-aimod-${Date.now()}-${ath.id}`,
              date: '28 Sep',
              time: 'Just now',
              title: `AI Training Modification Approved (${selectedRole})`,
              description: `${mod.currentPrescription} → ${mod.proposedPrescription}`,
              category: 'Training',
              actor: selectedRole,
              detailNotes: `${mod.reason} Expected impact: ${mod.expectedLoadImpact}`,
            },
            ...ath.timeline,
          ],
        };
      })
    );

    setSessions((prev) =>
      prev.map((s, idx) =>
        idx === 0
          ? {
              ...s,
              plannedLoadAu: Math.max(480, s.plannedLoadAu - 140),
              notes: `${s.notes || ''} · [AI Modified for ${approvedItems.length} athletes by ${selectedRole}]`,
            }
          : s
      )
    );

    setAiActionItems((prev) =>
      prev.map((item) =>
        item.id === 'ai-act-01' ||
        (item.affectedAthleteId && approvedIds.includes(item.affectedAthleteId))
          ? { ...item, status: 'Applied' }
          : item
      )
    );

    setAiAuditTrail((prev) => [
      {
        id: `aiaud-app-${Date.now()}`,
        query: 'Proposed Training Modifications Approval',
        recommendation: `Modify high-intensity session for ${approvedItems.map((a) => a.athleteName).join(', ')}`,
        evidenceAccessed: [
          'Acute Load (+22%)',
          'HRV (-14%)',
          'Medical Restriction (Stage 3/5)',
        ],
        reviewedBy: selectedRole,
        reviewerRole: selectedRole,
        decision: 'Approved',
        actionTaken: `Training session modified for ${approvedItems.length} athletes (-140 AU expected load)`,
        timestamp: 'Just now',
        safetyClass: 'CONSEQUENTIAL',
      },
      ...prev,
    ]);

    triggerToast(
      `Approved Training Modifications for ${approvedItems.length} athletes ✓ — Updated Training, Athlete 360 & Audit Trail`
    );
  };

  const handleResetDemoState = () => {
    const base = generateContextDataset(INITIAL_CONTEXT);
    setAthletes(base.athletes);
    setSessions(base.sessions);
    setInjuries(base.injuries);
    setRehabPlans(base.rehabPlans);
    setMedicalRiskAlerts(base.medicalRiskAlerts);
    setMedicalAlerts(base.medicalAlerts);
    setWellnessProfile(base.wellnessProfile);
    setNutritionPlans(base.nutritionPlans);
    setHydrationLogs(base.hydrationLogs);
    setSupplements(base.supplements);
    setBodyComposition(base.bodyComposition);
    setAssessmentPrograms(base.assessmentPrograms);
    setTests(base.tests);
    setTestResults(base.testResults);
    setTalentProfiles(base.talentProfiles);
    setReports(base.reports);
    setAnalyticsSeries(base.analyticsSeries);
    setRecommendations(base.recommendations);
    setAiMessages(INITIAL_COPILOT_MESSAGES);
    setAiActionItems(base.aiActionItems);
    setAiRiskSignals(base.aiRiskSignals);
    setAiTrainingModifications(base.aiTrainingModifications);
    setAiAutomationRules(INITIAL_AUTOMATION_RULES);
    setAiAuditTrail(INITIAL_AI_AUDIT_TRAIL);
    setContext(INITIAL_CONTEXT);
    setSelectedRole('Performance Director');
    if (base.athletes[0]) {
      setActiveAthlete360Id(base.athletes[0].id);
    }
    triggerToast('Reset all USI modules & telemetry to initial demo baseline ✓');
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;
  const pendingAIActionsCount = aiActionItems.filter(
    (a) => a.status === 'Pending Review'
  ).length;

  const isAICopilotRoute =
    activeNav === 'ai-copilot' ||
    activeNav === 'ai-action-centre' ||
    activeNav === 'ai-risk-centre' ||
    activeNav === 'ai-automation' ||
    activeNav === 'ai-audit';

  const isMedicalRoute =
    activeNav === 'injury-intelligence' ||
    activeNav === 'injury-register' ||
    activeNav === 'rehabilitation' ||
    activeNav === 'return-to-play';

  const isNutritionRoute =
    activeNav === 'nutrition' ||
    activeNav === 'nutrition-plans' ||
    activeNav === 'nutrition-hydration' ||
    activeNav === 'nutrition-supplements' ||
    activeNav === 'nutrition-body-composition';

  const isAssessmentsRoute =
    activeNav === 'assessments-tid' ||
    activeNav === 'assessments-tests' ||
    activeNav === 'assessments-benchmarks' ||
    activeNav === 'assessments-talent' ||
    activeNav === 'assessments-field-testing';

  const isAnalyticsRoute =
    activeNav === 'analytics-bi' ||
    activeNav === 'analytics-federation' ||
    activeNav === 'analytics-sport' ||
    activeNav === 'analytics-program' ||
    activeNav === 'analytics-squad' ||
    activeNav === 'analytics-athlete' ||
    activeNav === 'analytics-reports';

  const isTrainingRoute =
    activeNav === 'periodisation' ||
    activeNav === 'sessions' ||
    activeNav === 'builder' ||
    activeNav === 'live-pitchside' ||
    activeNav === 'exercises' ||
    activeNav === 'workload' ||
    activeNav === 'attendance-rpe';

  const isLifecycleHubRoute = activeNav === 'athlete-lifecycle';
  const isSportsScienceRoute =
    activeNav === 'readiness' ||
    activeNav === 'fatigue' ||
    activeNav === 'gps-wearables' ||
    activeNav === 'recovery';

  const isOperationsRoute =
    activeNav === 'operations' ||
    activeNav === 'camps' ||
    activeNav === 'manifests' ||
    activeNav === 'cargo' ||
    activeNav === 'facilities';

  return (
    <div
      className={`min-h-screen text-[#F8FAFC] ${
        viewportMode === 'desktop'
          ? 'bg-[#090D16] flex'
          : 'bg-[#05080F] flex justify-center'
      }`}
    >
      <div
        className={
          viewportMode === 'desktop'
            ? 'flex w-full min-h-screen'
            : viewportMode === 'tablet'
              ? 'viewport-tablet flex w-full max-w-[834px] min-h-screen bg-[#090D16] border-x border-slate-800/90 shadow-2xl relative'
              : 'viewport-mobile flex w-full max-w-[430px] min-h-screen bg-[#090D16] border-x border-slate-800/90 shadow-2xl relative'
        }
      >
        {/* Persistent Left Sidebar */}
        <Sidebar
          activeNav={
            activeNav === 'athlete-360' ? 'athlete-registry' : activeNav
          }
          onSelectNav={handleSelectNav}
          attentionCount={18}
          activeInjuryCount={injuries.length}
          selectedRole={selectedRole}
          viewportMode={viewportMode}
          isMobileDrawerOpen={isMobileDrawerOpen}
          onCloseMobileDrawer={() => setIsMobileDrawerOpen(false)}
          isCompact={isSidebarCompact}
          onToggleCompact={setIsSidebarCompact}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Persistent Top Global Hierarchy Context Bar */}
          <TopContextBar
            context={context}
            onUpdateContext={handleUpdateContext}
            selectedRole={selectedRole}
            onSelectRole={handleSelectRole}
            unreadNotificationsCount={unreadNotificationsCount}
            onOpenSearch={() => setIsSearchOpen(true)}
            onToggleNotifications={() =>
              setIsNotificationsOpen((prev) => !prev)
            }
            onOpenHelpModal={() => setIsHelpModalOpen(true)}
            onOpenAICopilot={() => setIsGlobalCopilotOpen(true)}
            pendingAIActionsCount={pendingAIActionsCount}
            onResetDemoState={handleResetDemoState}
            viewportMode={viewportMode}
            onChangeViewportMode={(mode) => {
              setViewportMode(mode);
              setIsMobileDrawerOpen(false);
            }}
            onToggleMobileSidebar={() => {
              if (viewportMode === 'mobile') {
                setIsMobileDrawerOpen((prev) => !prev);
              } else {
                setIsSidebarCompact((prev) => !prev);
              }
            }}
            isSidebarOpen={!isSidebarCompact}
            activeAthlete={activeAthlete360}
            athletes={athletes}
            onSelectActiveAthlete={(athId) => setActiveAthlete360Id(athId)}
            onOpenOnboarding={() => setIsOnboardingOpen(true)}
            onGlobalExport={handleGlobalExport}
          />

        {/* Workspace Viewport */}
        <main className="flex-1 p-5 lg:p-6 max-w-[1600px] w-full mx-auto space-y-5">
          <ErrorBoundary fallbackTitle="Workspace Viewport Encountered an Issue">
          {activeNav === 'command-center' ? (
            <>
              {/* Dynamic 8-Persona Role Dashboard Banner */}
              <RoleDashboardBanner
                selectedRole={selectedRole}
                onTriggerQuickAction={(id, label) => {
                  if (id === 'qa-pd-1') setActiveNav('return-to-play');
                  else if (id === 'qa-pd-2') setActiveNav('assessments-talent');
                  else if (id === 'qa-pd-3') setActiveNav('athlete-registry');
                  else if (id === 'qa-co-1') setIsSessionAssignmentOpen(true);
                  else if (id === 'qa-co-2') setActiveNav('attendance-rpe');
                  else if (id === 'qa-co-3' || id === 'qa-ss-1') setActiveNav('gps-wearables');
                  else if (id === 'qa-ss-2') setActiveNav('fatigue');
                  else if (id === 'qa-ss-3') setActiveNav('analytics-reports');
                  else if (id === 'qa-pt-1') {
                    if (injuries[0]) setSelectedInjuryDrawerId(injuries[0].id);
                    else setActiveNav('injury-register');
                  } else if (id === 'qa-pt-2') {
                    if (injuries[0]) setRtpGateModalInjuryId(injuries[0].id);
                    else setActiveNav('return-to-play');
                  } else if (id === 'qa-pt-3') setIsReportInjuryOpen(true);
                  else if (id === 'qa-nu-1' || id === 'qa-ath-2') setActiveNav('nutrition-hydration');
                  else if (id === 'qa-nu-2') setActiveNav('nutrition-plans');
                  else if (id === 'qa-nu-3' || id === 'qa-fa-2') setActiveNav('nutrition-supplements');
                  else if (id === 'qa-fa-1') setActiveNav('verification');
                  else if (id === 'qa-fa-3' || id === 'qa-op-3') setActiveNav('manifests');
                  else if (id === 'qa-ath-1') setActiveNav('readiness');
                  else if (id === 'qa-ath-3') setIsGlobalCopilotOpen(true);
                  else if (id === 'qa-op-1') setActiveNav('facilities');
                  else if (id === 'qa-op-2') setActiveNav('camps');
                  triggerToast(`[${selectedRole}] Opened workflow: ${label}`);
                }}
              />

              {/* Dynamic Role-Aware KPI Cards */}
              <KpiGrid
                activeKpi={activeKpi}
                onSelectKpi={handleSelectKpi}
                selectedRole={selectedRole}
                athletes={athletes}
                injuries={injuries}
                sessions={sessions}
                nutritionPlans={nutritionPlans}
                activeAthlete={activeAthlete360}
              />

              {/* Dynamic Role-Specific Analytics & Priority Queue */}
              <RoleSpecificAnalyticsView
                selectedRole={selectedRole}
                onOpenActionItem={(item) => {
                  if (item.id === 'pd-1' || item.id === 'pa-01' || item.id === 'physio-pa-01' || item.id === 'pt-1' || item.id === 'physio-pa-03') {
                    if (injuries[0]) setRtpGateModalInjuryId(injuries[0].id);
                    else setActiveNav('return-to-play');
                  } else if (item.id === 'pa-02' || item.id === 'pt-2' || item.id === 'physio-pa-02') {
                    const devInj = injuries.find((i) => i.athleteId === 'ath-devansh-kulkarni') || injuries[0];
                    if (devInj) setSelectedInjuryDrawerId(devInj.id);
                    else setActiveNav('injury-register');
                  } else if (item.id === 'pa-03' || item.id === 'fa-1' || item.id === 'fed-pa-02' || item.id === 'fed-pa-03') {
                    setActiveNav('verification');
                  } else if (item.id === 'pd-2') setActiveNav('assessments-talent');
                  else if (item.id === 'pd-3') setIsMorningTriageOpen(true);
                  else if (item.id === 'co-1' || item.id === 'coach-pa-01') setIsTrainingModModalOpen(true);
                  else if (item.id === 'co-2') setActiveNav('builder');
                  else if (item.id === 'co-3' || item.id === 'coach-pa-02' || item.id === 'coach-pa-03') setIsSessionAssignmentOpen(true);
                  else if (item.id === 'ss-1' || item.id === 'ss-pa-01' || item.id === 'ss-pa-02') setActiveNav('fatigue');
                  else if (item.id === 'ss-2' || item.id === 'ss-pa-03') setActiveNav('gps-wearables');
                  else if (item.id === 'ss-3') setActiveNav('workload');
                  else if (item.id === 'pt-3') setActiveNav('rehabilitation');
                  else if (item.id === 'nu-1' || item.id === 'nutri-pa-01') setActiveNav('nutrition-hydration');
                  else if (item.id === 'nu-2') setActiveNav('nutrition-body-composition');
                  else if (item.id === 'nutri-pa-02' || item.id === 'ath-2' || item.id === 'ath-pa-02') setActiveNav('nutrition-plans');
                  else if (item.id === 'nu-3' || item.id === 'fa-2' || item.id === 'nutri-pa-03') setActiveNav('nutrition-supplements');
                  else if (item.id === 'fa-3' || item.id === 'op-3' || item.id === 'fed-pa-01' || item.id === 'ops-pa-03') setActiveNav('manifests');
                  else if (item.id === 'ath-1' || item.id === 'ath-pa-01') setActiveNav('sessions');
                  else if (item.id === 'ath-3') setActiveNav('injury-intelligence');
                  else if (item.id === 'op-1' || item.id === 'ops-pa-01' || item.id === 'ops-pa-02') setActiveNav('facilities');
                  else if (item.id === 'op-2') setActiveNav('cargo');
                  triggerToast(`[${item.badge}] Opened action: ${item.title}`);
                }}
                onNavigateSection={(sec) => setActiveNav(sec as any)}
                onSelectKpi={(id) => handleSelectKpi(id as KpiFilterKey)}
                athletes={athletes}
                injuries={injuries}
                sessions={sessions}
                nutritionPlans={nutritionPlans}
                activeAthlete={activeAthlete360}
              />

              {/* Specialized Persona Hubs for All 8 Personas */}
              <ErrorBoundary fallbackTitle={`${selectedRole} Specialized Dashboard View`}>
                <PersonaSpecializedSections
                  selectedRole={selectedRole}
                  activeAthlete={activeAthlete360}
                  allAthletes={athletes}
                  sessions={sessions}
                  injuries={injuries}
                  onSelectActiveAthlete={(athId) => setActiveAthlete360Id(athId)}
                  onOpenOnboarding={() => setIsOnboardingOpen(true)}
                  onOpenApproval={(ath) => setApprovalModalAthleteId(ath.id)}
                  onOpenCoachAssignment={(ath) => setCoachModalAthleteId(ath.id)}
                  onOpenSessionAssignment={() => setIsSessionAssignmentOpen(true)}
                  onOpenReportInjury={(athId) => {
                    if (athId) setReportInjuryInitialAthleteId(athId);
                    setIsReportInjuryOpen(true);
                  }}
                  onOpenCreateRehab={(inj) => setRehabSessionModalInjuryId(inj.id)}
                  onOpenAdvanceRtp={(inj) => setRtpGateModalInjuryId(inj.id)}
                  onTriggerToast={triggerToast}
                  onNavigateSection={(sec) => setActiveNav(sec as any)}
                  onUpdateAthleteWellness={handleAthleteWellnessSurveySubmit}
                />
              </ErrorBoundary>

              {/* Standard Tactical & Clinical Squad Sections (Hidden for Athlete, Nutritionist, Operations, Federation Admin) */}
              {['Performance Director', 'Coach', 'Sports Scientist', 'Physiotherapist'].includes(selectedRole) && (
                <>
                  {/* 7. ATHLETE READINESS SECTION & 8. AI OPERATIONAL ALERT */}
                  <ReadinessAndAlertSection
                    athletes={athletes}
                    selectedReadinessTier={selectedReadinessTier}
                    onSelectReadinessTier={handleSelectReadinessTier}
                    onViewAthletesRegistry={() => setActiveNav('athlete-registry')}
                    onReviewRiskAthletes={handleReviewRiskAthletes}
                    onOpenRiskFactorsModal={() => setIsRiskModalOpen(true)}
                  />

                  {/* 9. TODAY'S TRAINING OPERATIONS & 10. INJURY INTELLIGENCE */}
                  <TrainingAndInjurySection
                    sessions={sessions}
                    injuries={injuries}
                    onSelectSession={(sess) => setSelectedSession(sess)}
                    onSelectInjuryAthlete={(athleteId) => {
                      const foundInj = injuries.find(
                        (i) => i.athleteId === athleteId
                      );
                      if (foundInj) {
                        setSelectedInjuryDrawerId(foundInj.id);
                      } else {
                        setDrawerAthleteId(athleteId);
                      }
                    }}
                    onViewInjuryIntelligence={() =>
                      setActiveNav('injury-intelligence')
                    }
                  />

                  {/* 11. ATHLETES REQUIRING ATTENTION TABLE */}
                  <AthleteAttentionTable
                    athletes={athletes}
                    selectedAthleteId={drawerAthleteId}
                    onSelectAthlete={(athlete) => setDrawerAthleteId(athlete.id)}
                    statusFilter={tableStatusFilter}
                    onChangeStatusFilter={setTableStatusFilter}
                  />

                  {/* 12. AI RECOMMENDATIONS & 13. ANALYTICS PREVIEW */}
                  <AiRecommendationsAndAnalytics
                    recommendations={recommendations}
                    onApplyRecommendation={handleApplyRecommendation}
                    onReviewRecommendation={handleReviewRecommendation}
                    analyticsSeries={ANALYTICS_14D_SERIES}
                    onOpenAnalyticsModule={() => setActiveNav('analytics-bi')}
                  />
                </>
              )}
            </>
          ) : isLifecycleHubRoute ? (
            <AthleteLifecycleHub
              athletes={athletes}
              injuries={injuries}
              sessions={sessions}
              selectedRole={selectedRole}
              onOpenOnboarding={() => setIsOnboardingOpen(true)}
              onOpenApproval={(ath) => setApprovalModalAthleteId(ath.id)}
              onOpenCoachAssignment={(ath) => setCoachModalAthleteId(ath.id)}
              onOpenAthlete360={handleOpenFullAthlete360}
              onOpenReportInjury={(reg, athId) => {
                if (reg) setReportInjuryInitialRegion(reg);
                if (athId) setReportInjuryInitialAthleteId(athId);
                setIsReportInjuryOpen(true);
              }}
              onOpenSessionAssignment={(athId) => {
                setIsSessionAssignmentOpen(true);
              }}
              onOpenCreateRehab={(inj) => setRehabSessionModalInjuryId(inj.id)}
              onOpenAdvanceRtp={(inj) => setRtpGateModalInjuryId(inj.id)}
              onNavigate={(nav) => setActiveNav(nav as any)}
              onTriggerToast={triggerToast}
            />
          ) : activeNav === 'athlete-registry' ? (
            <AthleteRegistryPage
              athletes={athletes}
              selectedRole={selectedRole}
              onOpenAthlete360={handleOpenFullAthlete360}
              onOpenQuickDrawer={(ath) => setDrawerAthleteId(ath.id)}
              onOpenAddAthleteModal={() => setIsOnboardingOpen(true)}
              onOpenAssignCoachModal={(ath) => setCoachModalAthleteId(ath.id)}
              onOpenReviewApplicationModal={(ath) =>
                setApprovalModalAthleteId(ath.id)
              }
              onBulkUpdateAthletes={handleBulkUpdateAthletes}
              onTriggerToast={triggerToast}
            />
          ) : activeNav === 'enrollment' || activeNav === 'verification' ? (
            <EnrollmentApplicationsPage
              athletes={athletes}
              selectedRole={selectedRole}
              onOpenReviewApplication={(ath) => setApprovalModalAthleteId(ath.id)}
              onOpenAthlete360={handleOpenFullAthlete360}
              onOpenAssignCoach={(ath) => setCoachModalAthleteId(ath.id)}
              onOpenNewApplication={() => setIsOnboardingOpen(true)}
              onTriggerToast={triggerToast}
            />
          ) : activeNav === 'athlete-360' ? (
            <Athlete360Page
              athlete={activeAthlete360}
              allAthletes={athletes}
              injuries={injuries}
              selectedRole={selectedRole}
              onSwitchAthlete={(ath) => setActiveAthlete360Id(ath.id)}
              onBackToRegistry={() => setActiveNav('athlete-registry')}
              onOpenAssignCoach={(ath) => setCoachModalAthleteId(ath.id)}
              onOpenReviewApplication={(ath) =>
                setApprovalModalAthleteId(ath.id)
              }
              onOpenEditProfile={(ath) => setEditProfileAthleteId(ath.id)}
              onOpenAiAssistance={(mode) => setAiAssistanceMode(mode)}
              onSelectInjuryDrawer={(inj) => setSelectedInjuryDrawerId(inj.id)}
              onOpenCreateRehabSession={(inj) =>
                setRehabSessionModalInjuryId(inj.id)
              }
              onOpenAdvanceRtpModal={(inj) => setRtpGateModalInjuryId(inj.id)}
              onOpenReportInjuryModal={(reg) => {
                if (reg) setReportInjuryInitialRegion(reg);
                setIsReportInjuryOpen(true);
              }}
              onOpenMedicalModule={() => setActiveNav('injury-intelligence')}
              onUpdateAthlete={(id, updates, auditAction, toastMsg) =>
                updateAthleteWithAudit(id, updates, auditAction, toastMsg)
              }
              onTriggerToast={triggerToast}
              nutritionPlans={nutritionPlans}
              supplements={supplements}
              bodyComposition={bodyComposition}
              testResults={testResults}
              onNavigateModule={(navId) => setActiveNav(navId)}
            />
          ) : isNutritionRoute ? (
            <NutritionWorkspace
              activeSubTab={activeNav as NutritionSubTab}
              onSelectSubTab={(tab) => setActiveNav(tab)}
              selectedRole={selectedRole}
              athletes={athletes}
              plans={nutritionPlans}
              hydrationLogs={hydrationLogs}
              supplements={supplements}
              bodyComposition={bodyComposition}
              onToggleMealConsumed={(planId, mealId) => {
                setNutritionPlans((prev) =>
                  prev.map((p) => {
                    if (p.id !== planId) return p;
                    const updatedMeals = p.meals.map((m) =>
                      m.id === mealId ? { ...m, consumed: !m.consumed } : m
                    );
                    const curCal = updatedMeals
                      .filter((m) => m.consumed)
                      .reduce((s, m) => s + m.calories, 0);
                    const curProt = updatedMeals
                      .filter((m) => m.consumed)
                      .reduce((s, m) => s + m.proteinG, 0);
                    const curCarbs = updatedMeals
                      .filter((m) => m.consumed)
                      .reduce((s, m) => s + m.carbsG, 0);
                    const curFat = updatedMeals
                      .filter((m) => m.consumed)
                      .reduce((s, m) => s + m.fatG, 0);
                    const comp = Math.min(
                      100,
                      Math.round((curCal / p.targetCalories) * 100)
                    );
                    updateAthleteWithAudit(
                      p.athleteId,
                      {
                        nutritionCompliancePct: comp,
                      },
                      `Updated daily meal adherence (${curCal} / ${p.targetCalories} kcal · ${comp}% compliance)`
                    );
                    return {
                      ...p,
                      meals: updatedMeals,
                      currentCalories: curCal,
                      currentProteinG: curProt,
                      currentCarbsG: curCarbs,
                      currentFatG: curFat,
                      compliancePct: comp,
                    };
                  })
                );
              }}
              onCreateNutritionPlan={(newPlan) => {
                setNutritionPlans((prev) => {
                  const exists = prev.some(
                    (p) => p.athleteId === newPlan.athleteId
                  );
                  if (exists) {
                    return prev.map((p) =>
                      p.athleteId === newPlan.athleteId ? newPlan : p
                    );
                  }
                  return [newPlan, ...prev];
                });
                updateAthleteWithAudit(
                  newPlan.athleteId,
                  {
                    nutritionCompliancePct: newPlan.compliancePct,
                  },
                  `Assigned Nutrition Plan: ${newPlan.planName} (${newPlan.targetCalories} kcal)`
                );
              }}
              onAddHydrationIntake={(log) => {
                const newEntry: HydrationLog = {
                  ...log,
                  id: `hlog-${Date.now()}`,
                };
                setHydrationLogs((prev) => [...prev, newEntry]);
                setNutritionPlans((prev) =>
                  prev.map((p) => {
                    if (p.athleteId !== log.athleteId) return p;
                    const nextL = Number(
                      (p.currentHydrationL + log.amountMl / 1000).toFixed(2)
                    );
                    const nextHydPct = Math.min(
                      100,
                      Math.round((nextL / p.targetHydrationL) * 100)
                    );
                    return {
                      ...p,
                      currentHydrationL: nextL,
                      hydrationCompliancePct: nextHydPct,
                    };
                  })
                );
                updateAthleteWithAudit(
                  log.athleteId,
                  {},
                  `Logged hydration intake: +${log.amountMl}ml (${log.beverageType})`
                );
              }}
              onAddSupplement={(supp) => {
                const newSupp: Supplement = {
                  ...supp,
                  id: `supp-${Date.now()}`,
                };
                setSupplements((prev) => [...prev, newSupp]);
                updateAthleteWithAudit(
                  supp.athleteId,
                  {},
                  `Added supplement protocol: ${supp.name} (${supp.dosage} · ${supp.schedule})`
                );
              }}
              onToggleSupplementLogged={(suppId) => {
                setSupplements((prev) =>
                  prev.map((s) =>
                    s.id === suppId
                      ? {
                          ...s,
                          compliancePct: Math.min(100, s.compliancePct + 2),
                        }
                      : s
                  )
                );
              }}
              onOpenAthlete360={(athleteId) => {
                setActiveAthlete360Id(athleteId);
                setActiveNav('athlete-360');
              }}
              onNavigateModule={(navId) => setActiveNav(navId)}
              onTriggerToast={triggerToast}
            />
          ) : isAssessmentsRoute ? (
            <AssessmentsWorkspace
              activeSubTab={activeNav as AssessmentsSubTab}
              onSelectSubTab={(tab) => setActiveNav(tab)}
              selectedRole={selectedRole}
              athletes={athletes}
              tests={tests}
              programs={assessmentPrograms}
              testResults={testResults}
              talentProfiles={talentProfiles}
              talentWeights={talentWeights}
              onUpdateTalentWeights={(weights) => {
                setTalentWeights(weights);
              }}
              onCreateProgram={(prog) => {
                setAssessmentPrograms((prev) => [prog, ...prev]);
              }}
              onSaveTestResult={(res) => {
                setTestResults((prev) =>
                  prev.map((r) => (r.id === res.id ? res : r))
                );
                updateAthleteWithAudit(
                  res.athleteId,
                  {},
                  `Validated Assessment Result: ${res.testName} (${res.currentResult} ${res.unit})`
                );
              }}
              onOpenAthlete360={(athleteId) => {
                setActiveAthlete360Id(athleteId);
                setActiveNav('athlete-360');
              }}
              onTriggerToast={triggerToast}
              onPromoteTalentAthlete={(profileId, athleteId) => {
                setTalentProfiles((prev) =>
                  prev.map((tp) =>
                    tp.id === profileId
                      ? {
                          ...tp,
                          squad: 'Senior Squad',
                          status: 'Promoted to Senior Squad',
                          pathwayStage: 'Tier 1 — Senior National',
                        }
                      : tp
                  )
                );
                const ath = athletes.find((a) => a.id === athleteId);
                if (ath) {
                  updateAthleteWithAudit(
                    ath.id,
                    {
                      squad: 'Senior Squad',
                      coach: 'Vikram Sharma',
                      coachRole: 'Head Coach',
                    },
                    'Promoted from TID Academy to Senior Squad (TID Pathway)',
                    `Promoted ${ath.name} to Senior Squad ✓ Assigned to Coach Vikram Sharma`,
                    {
                      title: 'Promoted to Senior National Squad',
                      description: 'Talent identification benchmark alignment >= 90%',
                      category: 'Administrative',
                      detailNotes: `Promoted from Development Squad by ${selectedRole}. Reassigned to Vikram Sharma.`,
                    }
                  );
                }
              }}
            />
          ) : isAnalyticsRoute ? (
            <AnalyticsWorkspace
              activeSubTab={activeNav as AnalyticsSubTab}
              onSelectSubTab={(tab) => setActiveNav(tab)}
              selectedRole={selectedRole}
              athletes={athletes}
              injuries={injuries}
              nutritionPlans={nutritionPlans}
              testResults={testResults}
              analyticsSeries={ANALYTICS_14D_SERIES}
              reports={reports}
              onCreateReport={(rep) => {
                setReports((prev) => [rep, ...prev]);
              }}
              onNavigateModule={(navId) => setActiveNav(navId)}
              onOpenAthlete360={(athleteId) => {
                setActiveAthlete360Id(athleteId);
                setActiveNav('athlete-360');
              }}
              onTriggerToast={triggerToast}
            />
          ) : isMedicalRoute ? (
            <MedicalWorkspace
              activeSubTab={activeNav as MedicalSubTab}
              onSelectSubTab={(tab) => setActiveNav(tab)}
              selectedRole={selectedRole}
              athletes={athletes}
              injuries={injuries}
              rehabPlans={rehabPlans}
              riskAlerts={medicalRiskAlerts}
              medicalAlerts={medicalAlerts}
              wellnessProfile={wellnessProfile}
              activeAthleteId={drawerAthleteId || activeAthlete360Id || athletes[0]?.id}
              onSelectInjuryDrawer={(inj) => setSelectedInjuryDrawerId(inj.id)}
              onOpenReportInjuryModal={(reg) => {
                if (reg) setReportInjuryInitialRegion(reg);
                setIsReportInjuryOpen(true);
              }}
              onOpenCreateRehabSession={(inj) =>
                setRehabSessionModalInjuryId(inj.id)
              }
              onOpenAdvanceRtpModal={(inj) => setRtpGateModalInjuryId(inj.id)}
              onUpdateInjury={handleUpdateInjury}
              onUpdateRehabProgress={(planId, newPct, toastMsg) => {
                setRehabPlans((prev) =>
                  prev.map((p) =>
                    p.id === planId ? { ...p, progressPct: newPct } : p
                  )
                );
                triggerToast(toastMsg);
              }}
              onUpdateRiskAlert={(alertId, updates, toastMsg) => {
                setMedicalRiskAlerts((prev) =>
                  prev.map((a) =>
                    a.id === alertId ? { ...a, ...updates } : a
                  )
                );
                triggerToast(toastMsg);
              }}
              onAcknowledgeMedicalAlert={(alert) => {
                setMedicalAlerts((prev) =>
                  prev.map((m) =>
                    m.id === alert.id ? { ...m, acknowledged: true } : m
                  )
                );
                if (alert.injuryId) {
                  setSelectedInjuryDrawerId(alert.injuryId);
                } else {
                  const ath = athletes.find((a) => a.id === alert.athleteId);
                  if (ath) handleOpenFullAthlete360(ath);
                }
              }}
              onUpdateWellness={(updates) => {
                setWellnessProfile((prev) => ({ ...prev, ...updates }));
                triggerToast(
                  'Updated daily wellness & tissue soreness telemetry for Arjun Mehta'
                );
              }}
              onOpenAthlete360={(athleteId) => {
                const ath = athletes.find((a) => a.id === athleteId);
                if (ath) handleOpenFullAthlete360(ath);
              }}
              onTriggerToast={triggerToast}
            />
          ) : isAICopilotRoute ? (
            <AICopilotWorkspace
              activeSubTab={activeNav as AICopilotSubTab}
              onSelectSubTab={(tab) => setActiveNav(tab)}
              context={context}
              selectedRole={selectedRole}
              athletes={athletes}
              activeAthleteId={activeAthlete360Id}
              onSelectContextAthlete={(id) => setActiveAthlete360Id(id)}
              messages={aiMessages}
              onSendQuery={handleSendAICopilotQuery}
              onClearConversation={() => {
                setAiMessages(getPersonaInitialMessages(selectedRole));
                setSessionMemoryTopic(null);
                triggerToast('Reset AI Copilot conversation session memory');
              }}
              isThinking={isCopilotThinking}
              selectedModel={copilotModel}
              onSelectModel={(m) => {
                setCopilotModel(m);
                triggerToast(`Switched Copilot model to ${m}`);
              }}
              actionItems={aiActionItems}
              riskSignals={aiRiskSignals}
              automationRules={aiAutomationRules}
              automationAuditEvents={aiAutomationAuditEvents}
              aiAuditTrail={aiAuditTrail}
              dataFreshness={aiDataFreshness}
              onUpdateActionStatus={(id, nextStatus) => {
                setAiActionItems((prev) =>
                  prev.map((item) =>
                    item.id === id ? { ...item, status: nextStatus } : item
                  )
                );
                triggerToast(
                  `Updated AI Action status to ${nextStatus} ✓ — Logged in AI Audit Trail`
                );
              }}
              onOpenTrainingModModal={() => setIsTrainingModModalOpen(true)}
              onOpenEvidence={(bundle) => setActiveEvidenceBundle(bundle)}
              onFeedbackRiskSignal={(id, feedback, reason) => {
                setAiRiskSignals((prev) =>
                  prev.map((sig) =>
                    sig.id === id
                      ? {
                          ...sig,
                          feedbackStatus: feedback,
                          dismissReason: reason,
                        }
                      : sig
                  )
                );
                triggerToast(
                  reason
                    ? `Risk Signal Dismissed (${reason}) — Recorded in AI Feedback Loop`
                    : `Risk Signal Marked ${feedback} — Recorded in AI Feedback Loop`
                );
              }}
              onToggleAutomationRule={(id) => {
                setAiAutomationRules((prev) =>
                  prev.map((r) =>
                    r.id === id ? { ...r, enabled: !r.enabled } : r
                  )
                );
                triggerToast('Updated AI Workflow Automation Rule status');
              }}
              onUpdateAutomationRule={(updatedRule) => {
                setAiAutomationRules((prev) =>
                  prev.map((r) => (r.id === updatedRule.id ? updatedRule : r))
                );
                triggerToast(
                  `Saved AI Automation Rule: ${updatedRule.name}`
                );
              }}
              onExecuteCopilotAction={handleExecuteCopilotAction}
              onNavigateModule={(nav) => setActiveNav(nav)}
              onOpenAthlete360={(athleteId) => {
                setActiveAthlete360Id(athleteId);
                setActiveNav('athlete-360');
              }}
              onShowToast={triggerToast}
            />
          ) : isTrainingRoute ? (
            <TrainingWorkspace
              activeSubTab={activeNav as TrainingSubTab}
              onSelectSubTab={(tab) => setActiveNav(tab as any)}
              selectedRole={selectedRole}
              sessions={sessions}
              athletes={athletes}
              onOpenSessionAssignment={() => setIsSessionAssignmentOpen(true)}
              onSelectSession={(sess) => setSelectedSession(sess)}
              onCreateSession={(newSess) => {
                setSessions((prev) => [newSess, ...prev]);
              }}
              onRecordAttendanceAndRpe={(sessionId, records) => {
                setSessions((prev) =>
                  prev.map((s) =>
                    s.id === sessionId
                      ? {
                          ...s,
                          status: 'Completed',
                          attendedCount: records.filter(
                            (r) =>
                              r.attendance === 'Present' ||
                              r.attendance === 'Late'
                          ).length,
                        }
                      : s
                  )
                );
                records.forEach((rec) => {
                  if (rec.attendance === 'Present' || rec.attendance === 'Late') {
                    const addedLoad = rec.rpe * 75;
                    updateAthleteWithAudit(
                      rec.athleteId,
                      {
                        acuteLoadAu: Math.round(
                          addedLoad * 0.2 +
                            (athletes.find((a) => a.id === rec.athleteId)
                              ?.acuteLoadAu || 500) *
                              0.8
                        ),
                      },
                      `Recorded training attendance (${rec.attendance}) & sRPE ${rec.rpe}/10 (+${addedLoad} AU)`
                    );
                  }
                });
              }}
              onOpenAthlete360={(ath) => handleOpenFullAthlete360(ath)}
              onTriggerToast={triggerToast}
            />
          ) : isSportsScienceRoute ? (
            <SportsScienceWorkspace
              activeSubTab={activeNav as SportsScienceSubTab}
              onSelectSubTab={(tab) => setActiveNav(tab)}
              selectedRole={selectedRole}
              athletes={athletes}
              onOpenAthlete360={(ath) => handleOpenFullAthlete360(ath)}
              onTriggerToast={triggerToast}
            />
          ) : isOperationsRoute ? (
            <OperationsWorkspace
              activeSubTab={
                (['operations', 'camps', 'manifests', 'cargo', 'facilities'].includes(activeNav)
                  ? activeNav
                  : 'operations') as OperationsSubTab
              }
              onSelectSubTab={(tab) => setActiveNav(tab)}
              selectedRole={selectedRole}
              onTriggerToast={triggerToast}
            />
          ) : (
            <ConnectedModuleView
              activeNav={activeNav}
              selectedRole={selectedRole}
              onReturnToCommandCenter={() => setActiveNav('command-center')}
              onNavigateModule={(nav) => handleSelectNav(nav)}
              onOpenHelpModal={() => setIsHelpModalOpen(true)}
              athletes={athletes}
              sessions={sessions}
              injuries={injuries}
              assessments={ASSESSMENTS_LIST}
              analyticsSeries={ANALYTICS_14D_SERIES}
              onSelectAthlete={(ath) => handleOpenFullAthlete360(ath)}
              onSelectSession={(sess) => setSelectedSession(sess)}
            />
          )}
          </ErrorBoundary>
        </main>

        {viewportMode === 'mobile' && (
          <nav className="sticky bottom-0 inset-x-0 z-30 h-14 bg-[#090D16]/95 backdrop-blur-md border-t border-slate-800/90 px-2 flex items-center justify-around">
            {[
              {
                id: 'command-center' as NavItemId,
                label: 'Command',
                icon: LayoutDashboard,
              },
              {
                id: 'athlete-registry' as NavItemId,
                label: 'Athletes',
                icon: Users,
              },
              {
                id: 'sessions' as NavItemId,
                label: 'Training',
                icon: Dumbbell,
              },
              {
                id: 'injury-intelligence' as NavItemId,
                label: 'Medical',
                icon: HeartPulse,
              },
              {
                id: 'ai-copilot' as NavItemId,
                label: 'Copilot',
                icon: Bot,
              },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    active
                      ? 'text-sky-400 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}
      </div>
      </div>

      {/* Athlete Detail Drawer (With [Open Full Profile] navigation to Athlete 360) */}
      <AthleteDetailDrawer
        athlete={drawerAthlete}
        onClose={() => setDrawerAthleteId(null)}
        onOpenFullProfile={handleOpenFullAthlete360}
        onNavigateModuleWithAthlete={(module, ath) => {
          setDrawerAthleteId(null);
          setActiveNav(module);
          triggerToast(`Opened ${module} with athlete context: ${ath.name}`);
        }}
        onUpdateAthleteLoadOrStatus={(athleteId, updates, msg) =>
          updateAthleteWithAudit(
            athleteId,
            updates,
            msg,
            msg,
            {
              title: 'Training load & status updated',
              description: msg,
              category: 'Training',
              detailNotes: msg,
            }
          )
        }
      />

      {/* Training Session Detail Drawer */}
      <SessionDetailDrawer
        session={selectedSession}
        onClose={() => setSelectedSession(null)}
        onSelectAthleteById={(athleteId) => {
          setSelectedSession(null);
          setDrawerAthleteId(athleteId);
        }}
        onCompleteSessionAction={handleCompleteSessionAction}
      />

      {/* Morning Squad Triage Drawer */}
      <MorningSquadTriageDrawer
        isOpen={isMorningTriageOpen}
        onClose={() => setIsMorningTriageOpen(false)}
        athletes={athletes}
        selectedRole={selectedRole}
        onApplyModification={handleApplyMorningTriageModification}
        onOpenAthlete360={handleOpenFullAthlete360}
        onTriggerToast={triggerToast}
      />

      {/* Iteration 3: Clinical Injury Detail Drawer */}
      <InjuryDetailDrawer
        injury={selectedInjuryDrawer}
        selectedRole={selectedRole}
        onClose={() => setSelectedInjuryDrawerId(null)}
        onAddMedicalNote={handleAddMedicalNote}
        onUpdateInjury={handleUpdateInjury}
        onOpenCreateRehabSession={(inj) => {
          setSelectedInjuryDrawerId(null);
          setRehabSessionModalInjuryId(inj.id);
        }}
        onOpenAdvanceRtp={(inj) => {
          setSelectedInjuryDrawerId(null);
          setRtpGateModalInjuryId(inj.id);
        }}
        onOpenAthlete360={(athleteId) => {
          const ath = athletes.find((a) => a.id === athleteId);
          if (ath) handleOpenFullAthlete360(ath);
        }}
      />

      {/* Iteration 3: 6-Step Injury Reporting Workflow Modal */}
      <ReportInjuryModal
        isOpen={isReportInjuryOpen}
        initialRegion={reportInjuryInitialRegion}
        initialAthleteId={reportInjuryInitialAthleteId || undefined}
        athletes={athletes}
        existingInjuries={injuries}
        onClose={() => {
          setIsReportInjuryOpen(false);
          setReportInjuryInitialAthleteId(null);
        }}
        onSubmitNewInjury={handleSubmitNewInjury}
      />

      {/* Iteration 3: Create Rehab Session Modal */}
      <CreateRehabSessionModal
        injury={rehabSessionModalInjury}
        onClose={() => setRehabSessionModalInjuryId(null)}
        onSaveSession={handleSaveRehabSession}
      />

      {/* Iteration 3: Return-to-Play (RTP) Gate & Override Modal */}
      <RTPGateModal
        injury={rtpGateModalInjury}
        selectedRole={selectedRole}
        onClose={() => setRtpGateModalInjuryId(null)}
        onToggleCriterion={handleToggleGateCriterion}
        onAdvanceStage={handleAdvanceRtpStage}
        onRequestMedicalReview={(injuryId) => {
          const inj = injuries.find((i) => i.id === injuryId);
          triggerToast(
            `Requested formal Chief Medical Officer review for ${inj?.athleteName || 'athlete'}`
          );
        }}
      />

      {/* 11. 6-Step Athlete Onboarding Modal ([+ Add Athlete]) */}
      <AthleteOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onCreateAthlete={(newAth) => {
          setAthletes((prev) => [newAth, ...prev]);
          setActiveAthlete360Id(newAth.id);
          triggerToast(
            `Athlete Profile Created: ${newAth.name} (${newAth.athleteId})`
          );
        }}
        onViewCreatedAthlete={(ath) => handleOpenFullAthlete360(ath)}
        onOpenAssignCoachForCreated={(ath) => {
          setActiveAthlete360Id(ath.id);
          setActiveNav('athlete-360');
          setCoachModalAthleteId(ath.id);
        }}
        onOpenSessionAssignmentForCreated={(ath) => {
          setActiveAthlete360Id(ath.id);
          setIsSessionAssignmentOpen(true);
        }}
        onNavigateLifecycle={() => setActiveNav('athlete-lifecycle')}
      />

      {/* Session Assignment Modal — Coach/Director assigns athletes to training sessions */}
      <SessionAssignmentModal
        isOpen={isSessionAssignmentOpen}
        onClose={() => setIsSessionAssignmentOpen(false)}
        sessions={sessions}
        athletes={athletes}
        selectedRole={selectedRole}
        onAssignAthlete={handleAssignAthleteToSession}
        onTriggerToast={triggerToast}
      />

      {/* 13. Coach Assignment Workflow Modal */}
      <CoachAssignmentModal
        athlete={coachModalAthlete}
        onClose={() => setCoachModalAthleteId(null)}
        onConfirmAssignCoach={handleConfirmAssignCoach}
      />

      {/* 14. Athlete Approval Workflow Modal ([Review Application]) */}
      <AthleteApprovalModal
        athlete={approvalModalAthlete}
        onClose={() => setApprovalModalAthleteId(null)}
        onApproveAthlete={handleApproveAthlete}
        onRequestChanges={handleRequestChangesAthlete}
        onRejectAthlete={handleRejectAthlete}
      />

      {/* Edit Athlete Profile Modal */}
      <EditAthleteProfileModal
        athlete={editProfileAthlete}
        onClose={() => setEditProfileAthleteId(null)}
        onSaveProfile={(athleteId, updates, auditAction) =>
          updateAthleteWithAudit(
            athleteId,
            updates,
            auditAction,
            `Profile updated for ${editProfileAthlete?.name}`
          )
        }
      />

      {/* 16. AI Athlete Assistance Drawer */}
      <AiAthleteAssistanceDrawer
        athlete={activeAthlete360}
        mode={aiAssistanceMode}
        onSwitchMode={(m) => setAiAssistanceMode(m)}
        onClose={() => setAiAssistanceMode(null)}
        onApplySuggestedAction={(actionLabel) =>
          updateAthleteWithAudit(
            activeAthlete360.id,
            { trainingStatus: 'RESTRICTED', lastUpdated: 'Just now' },
            actionLabel,
            actionLabel,
            {
              title: 'AI operational recommendation logged',
              description: actionLabel,
              category: 'AI',
              detailNotes: actionLabel,
            }
          )
        }
      />

      {/* Global Search Modal (⌘K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        athletes={athletes}
        sessions={sessions}
        injuries={injuries}
        assessments={ASSESSMENTS_LIST}
        onSelectAthlete={(ath) => setDrawerAthleteId(ath.id)}
        onSelectSession={(sess) => setSelectedSession(sess)}
        onSelectNav={(nav) => handleSelectNav(nav)}
      />

      {/* Notifications Panel */}
      <NotificationPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        selectedRole={selectedRole}
        notifications={notifications}
        onMarkRead={(id) =>
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          )
        }
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          triggerToast('All operational notifications marked as read');
        }}
        onSelectNotification={handleSelectNotification}
      />

      {/* AI Risk Factors Breakdown Modal */}
      <RiskFactorsModal
        isOpen={isRiskModalOpen}
        onClose={() => setIsRiskModalOpen(false)}
        athletes={athletes}
        onSelectAthlete={(ath) => setDrawerAthleteId(ath.id)}
      />

      {/* System Architecture & Help Modal */}
      <SystemGuideModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />

      {/* Global Contextual AI Copilot Slide-Over Panel */}
      <GlobalAICopilotSlideOver
        isOpen={isGlobalCopilotOpen}
        onClose={() => setIsGlobalCopilotOpen(false)}
        activeNav={activeNav}
        selectedRole={selectedRole}
        context={context}
        activeAthlete={activeAthlete360}
        messages={aiMessages}
        onSendQuery={handleSendAICopilotQuery}
        onClearConversation={() => {
          setAiMessages(getPersonaInitialMessages(selectedRole));
          setSessionMemoryTopic(null);
          triggerToast('Reset AI Copilot conversation session memory');
        }}
        isThinking={isCopilotThinking}
        selectedModel={copilotModel}
        onSelectModel={(m) => {
          setCopilotModel(m);
          triggerToast(`Switched Copilot model to ${m}`);
        }}
        onExecuteAction={handleExecuteCopilotAction}
        onOpenEvidence={(bundle) => setActiveEvidenceBundle(bundle)}
        onExpandFullWorkspace={() => {
          setIsGlobalCopilotOpen(false);
          setActiveNav('ai-copilot');
        }}
      />

      {/* AI Explainability & Source Telemetry Drawer */}
      <AIEvidenceDrawer
        evidence={activeEvidenceBundle}
        onClose={() => setActiveEvidenceBundle(null)}
        onOpenTrainingModModal={() => setIsTrainingModModalOpen(true)}
      />

      {/* Consequential AI Training Modifications Approval Modal */}
      <ProposedTrainingModificationsModal
        isOpen={isTrainingModModalOpen}
        onClose={() => setIsTrainingModModalOpen(false)}
        modifications={aiTrainingModifications}
        selectedRole={selectedRole}
        onApproveModifications={handleApproveTrainingModifications}
      />

      {/* Toast Notification Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-md bg-[#131C2E] border border-sky-500/50 text-xs font-medium text-slate-100 shadow-2xl">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-200 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
