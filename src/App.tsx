/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
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
import { TopContextBar } from './components/navigation/TopContextBar';
import { KpiFilterKey, KpiGrid } from './components/command-center/KpiGrid';
import { RoleDashboardBanner } from './components/command-center/RoleDashboardBanner';
import { RoleSpecificAnalyticsView } from './components/command-center/RoleSpecificAnalyticsView';
import { PersonaSpecializedSections } from './components/command-center/PersonaSpecializedSections';
import { ReadinessAndAlertSection } from './components/command-center/ReadinessAndAlertSection';
import { TrainingAndInjurySection } from './components/command-center/TrainingAndInjurySection';
import { AthleteAttentionTable } from './components/command-center/AthleteAttentionTable';
import { AiRecommendationsAndAnalytics } from './components/command-center/AiRecommendationsAndAnalytics';
import { AthleteDetailDrawer } from './components/drawers/AthleteDetailDrawer';
import { SessionDetailDrawer } from './components/drawers/SessionDetailDrawer';
import {
  GlobalSearchModal,
  NotificationPanel,
  RiskFactorsModal,
  SystemGuideModal,
} from './components/modals/GlobalOverlays';
import { ConnectedModuleView } from './components/modules/ConnectedModuleView';
import { AthleteRegistryPage } from './components/athletes/AthleteRegistryPage';
import {
  AiAssistanceMode,
  Athlete360Page,
} from './components/athletes/Athlete360Page';
import { AthleteOnboardingModal } from './components/athletes/AthleteOnboardingModal';
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
  ARJUN_EVIDENCE_BUNDLE,
  buildCopilotResponse,
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

  // Iteration 5: AI Copilot & AI-Native Operations Shared State
  const [aiMessages, setAiMessages] = useState<AICopilotMessage[]>(
    INITIAL_COPILOT_MESSAGES
  );
  const [aiActionItems, setAiActionItems] = useState<AIActionCentreItem[]>(
    INITIAL_AI_ACTION_CENTRE
  );
  const [aiRiskSignals, setAiRiskSignals] = useState<AIRiskSignalCard[]>(
    INITIAL_AI_RISK_SIGNALS
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
  >(INITIAL_TRAINING_MODIFICATIONS);
  const [activeEvidenceBundle, setActiveEvidenceBundle] =
    useState<AIEvidenceBundle | null>(null);
  const [isTrainingModModalOpen, setIsTrainingModModalOpen] = useState(false);
  const [isGlobalCopilotOpen, setIsGlobalCopilotOpen] = useState(false);
  const [sessionMemoryTopic, setSessionMemoryTopic] = useState<
    'low-readiness' | 'senior-low-readiness' | null
  >(null);

  // Connected Data State
  const [athletes, setAthletes] = useState<Athlete[]>(ATHLETES);
  const [sessions, setSessions] = useState<TrainingSession[]>(TRAINING_SESSIONS);
  const [injuries, setInjuries] = useState<Injury[]>(INITIAL_MEDICAL_INJURIES);
  const [rehabPlans, setRehabPlans] =
    useState<RehabPlanRecord[]>(INITIAL_REHAB_PLANS);
  const [medicalRiskAlerts, setMedicalRiskAlerts] = useState<
    MedicalRiskAlertItem[]
  >(INITIAL_MEDICAL_RISK_ALERTS);
  const [medicalAlerts, setMedicalAlerts] = useState<MedicalOperationalAlert[]>(
    INITIAL_MEDICAL_ALERTS
  );
  const [wellnessProfile, setWellnessProfile] = useState<WellnessProfile>(
    ARJUN_WELLNESS_PROFILE
  );
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(
    INITIAL_RECOMMENDATIONS
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(
    INITIAL_NOTIFICATIONS
  );

  // Iteration 4: Nutrition, Assessments & TID, and Analytics & BI Shared State
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>(
    INITIAL_NUTRITION_PLANS
  );
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLog[]>(
    INITIAL_HYDRATION_LOGS
  );
  const [supplements, setSupplements] =
    useState<Supplement[]>(INITIAL_SUPPLEMENTS);
  const [bodyComposition, setBodyComposition] = useState<BodyComposition>(
    INITIAL_BODY_COMPOSITION
  );
  const [assessmentPrograms, setAssessmentPrograms] = useState<
    AssessmentProgram[]
  >(INITIAL_ASSESSMENT_PROGRAMS);
  const [tests, setTests] = useState<Test[]>(INITIAL_TESTS_LIBRARY);
  const [testResults, setTestResults] =
    useState<TestResult[]>(INITIAL_TEST_RESULTS);
  const [talentProfiles, setTalentProfiles] = useState<TalentProfile[]>(
    INITIAL_TALENT_PROFILES
  );
  const [talentWeights, setTalentWeights] = useState<TalentScoringWeights>(
    INITIAL_TALENT_WEIGHTS
  );
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  // Active Athlete 360 Profile State
  const [activeAthlete360Id, setActiveAthlete360Id] =
    useState<string>('ath-arjun-mehta');

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
  const [rehabSessionModalInjuryId, setRehabSessionModalInjuryId] = useState<
    string | null
  >(null);
  const [rtpGateModalInjuryId, setRtpGateModalInjuryId] = useState<
    string | null
  >(null);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
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
    updateAthleteWithAudit(
      newInjury.athleteId,
      {
        trainingStatus: 'INJURED',
        medicalStatus: 'Restricted',
        status: 'Attention',
        injuryRisk: 'High',
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

    const auditMsg = overrideDetails
      ? `RTP Gate Override Approved by ${overrideDetails.authorisedBy}: Advanced ${targetInj.athleteName} to Stage ${nextStage}/5 (${nextStageName}). Reason: "${overrideDetails.reason}"`
      : `Advanced ${targetInj.athleteName} to RTP Stage ${nextStage}/5 (${nextStageName})`;

    updateAthleteWithAudit(
      targetInj.athleteId,
      {
        trainingStatus: nextStage >= 4 ? 'RETURN TO PLAY' : 'IN REHAB',
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
    if (nav === 'enrollment') {
      setActiveNav('athlete-registry');
      setIsOnboardingOpen(true);
      return;
    }
    if (nav === 'verification') {
      setActiveNav('athlete-registry');
      triggerToast('Opened Athlete Registry — Use Verification filter or Review Application');
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
    setContext((prev) => {
      const next = { ...prev, ...partial };
      const changedKey = Object.keys(partial)[0];
      const changedVal = Object.values(partial)[0];
      triggerToast(`Global context updated: ${changedKey?.toUpperCase()} → ${changedVal}`);
      return next;
    });
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    triggerToast(`Switched operational view to ${role}`);
  };

  const handleSelectKpi = (kpi: KpiFilterKey) => {
    setActiveKpi((prev) => (prev === kpi ? null : kpi));

    if (kpi === 'total-athletes') {
      setActiveNav('athlete-registry');
    } else if (kpi === 'active-athletes') {
      setTableStatusFilter('Ready');
      triggerToast('Filtered Attention Table to Ready / Active clearance athletes');
    } else if (kpi === 'attention') {
      setTableStatusFilter('Attention');
      document
        .getElementById('athlete-attention-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      triggerToast('Filtered to High-Priority Attention athletes');
    } else if (kpi === 'injuries') {
      setActiveNav('injury-intelligence');
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
    setTableStatusFilter('Attention');
    document
      .getElementById('athlete-attention-section')
      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    triggerToast(
      'AI Operational Alert: Filtered table to 3 athletes with elevated injury-risk patterns'
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

    if (notif.linkedAthleteId) {
      const ath = athletes.find((a) => a.id === notif.linkedAthleteId);
      if (ath) setDrawerAthleteId(ath.id);
    } else if (notif.linkedSessionId) {
      const sess = sessions.find((s) => s.id === notif.linkedSessionId);
      if (sess) setSelectedSession(sess);
    } else if (notif.targetNav) {
      setActiveNav(notif.targetNav);
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

  // Iteration 5: AI Copilot & Consequential Workflow Handlers
  const handleSendAICopilotQuery = (query: string) => {
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

    const { message: aiReply, nextFilterTopic } = buildCopilotResponse(query, {
      athlete: activeAthlete360,
      squad: context.squad,
      sport: context.sport,
      role: selectedRole,
      moduleName: activeNav,
      lastFilterTopic: sessionMemoryTopic,
    });

    setSessionMemoryTopic(nextFilterTopic);
    setAiMessages((prev) => [...prev, userMsg, aiReply]);
    setAiAuditTrail((prev) => [
      {
        id: `aiaud-${Date.now()}`,
        query,
        recommendation:
          aiReply.recommendation || aiReply.answerStatement || 'Advisory response',
        evidenceAccessed: [
          'Connected Athlete Telemetry',
          `${context.squad} Workload & Recovery`,
        ],
        reviewedBy: selectedRole,
        reviewerRole: selectedRole,
        decision: 'Advisory Reviewed',
        actionTaken: 'Displayed in USI Copilot',
        timestamp: nowTime,
        safetyClass: aiReply.safetyClass || 'INFORMATIONAL',
      },
      ...prev,
    ]);
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
    } else if (action.actionType === 'open-assessments-module') {
      setActiveNav('assessments-tid');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-analytics-module') {
      setActiveNav('analytics-federation');
      setIsGlobalCopilotOpen(false);
    } else if (action.actionType === 'open-risk-centre') {
      setActiveNav('ai-risk-centre');
      setIsGlobalCopilotOpen(false);
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
    setAthletes(ATHLETES);
    setSessions(TRAINING_SESSIONS);
    setInjuries(INITIAL_MEDICAL_INJURIES);
    setRehabPlans(INITIAL_REHAB_PLANS);
    setMedicalRiskAlerts(INITIAL_MEDICAL_RISK_ALERTS);
    setMedicalAlerts(INITIAL_MEDICAL_ALERTS);
    setNutritionPlans(INITIAL_NUTRITION_PLANS);
    setHydrationLogs(INITIAL_HYDRATION_LOGS);
    setSupplements(INITIAL_SUPPLEMENTS);
    setTestResults(INITIAL_TEST_RESULTS);
    setAiMessages(INITIAL_COPILOT_MESSAGES);
    setAiActionItems(INITIAL_AI_ACTION_CENTRE);
    setAiRiskSignals(INITIAL_AI_RISK_SIGNALS);
    setAiAutomationRules(INITIAL_AUTOMATION_RULES);
    setAiAuditTrail(INITIAL_AI_AUDIT_TRAIL);
    setContext(INITIAL_CONTEXT);
    setSelectedRole('Performance Director');
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

  return (
    <div className="min-h-screen bg-[#090D16] text-[#F8FAFC] flex">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activeNav={
          activeNav === 'athlete-360' ? 'athlete-registry' : activeNav
        }
        onSelectNav={handleSelectNav}
        attentionCount={18}
        activeInjuryCount={injuries.length}
        selectedRole={selectedRole}
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
        />

        {/* Workspace Viewport */}
        <main className="flex-1 p-5 lg:p-6 max-w-[1600px] w-full mx-auto space-y-5">
          {activeNav === 'command-center' ? (
            <>
              {/* 6. COMMAND CENTER HEADER */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-slate-800/80">
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-sky-400 font-medium">
                    <span>{context.federation}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-200">
                      {context.sport} · Senior Men's Squad
                    </span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1">
                    Good morning, Performance Team
                  </h1>
                </div>

                {/* Compact Date / Role Context Indicator */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0F1623] border border-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Role Lens:</span>
                    <strong className="text-slate-200 font-semibold">
                      {selectedRole}
                    </strong>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0F1623] border border-slate-800 font-mono tabular-nums">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-slate-200">{context.date}</span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">MD-3 Pre-Competition</span>
                  </div>
                </div>
              </div>

              {/* Dynamic 8-Persona Role Dashboard Banner */}
              <RoleDashboardBanner
                selectedRole={selectedRole}
                onSelectRole={handleSelectRole}
                onTriggerQuickAction={(id, label) =>
                  triggerToast(`[${selectedRole}] Quick action triggered: ${label}`)
                }
              />

              {/* Dynamic Role-Aware KPI Cards */}
              <KpiGrid
                activeKpi={activeKpi}
                onSelectKpi={handleSelectKpi}
                selectedRole={selectedRole}
              />

              {/* Dynamic Role-Specific Analytics & Priority Queue */}
              <RoleSpecificAnalyticsView
                selectedRole={selectedRole}
                onOpenActionItem={(item) =>
                  triggerToast(`[${item.badge}] Action queue opened: ${item.title}`)
                }
                onNavigateSection={(sec) => setActiveNav(sec as any)}
              />

              {/* Specialized Persona Hubs for Athlete, Nutritionist, Operations, Federation Admin */}
              <PersonaSpecializedSections
                selectedRole={selectedRole}
                onTriggerToast={triggerToast}
                onNavigateSection={(sec) => setActiveNav(sec as any)}
              />

              {/* Standard Tactical & Clinical Squad Sections (Hidden for Athlete, Nutritionist, Operations, Federation Admin) */}
              {['Performance Director', 'Coach', 'Sports Scientist', 'Physiotherapist'].includes(selectedRole) && (
                <>
                  {/* 7. ATHLETE READINESS SECTION & 8. AI OPERATIONAL ALERT */}
                  <ReadinessAndAlertSection
                    selectedReadinessTier={selectedReadinessTier}
                    onSelectReadinessTier={handleSelectReadinessTier}
                    onViewAthletesRegistry={() => setActiveNav('athlete-registry')}
                    onReviewRiskAthletes={handleReviewRiskAthletes}
                    onOpenRiskFactorsModal={() => setIsRiskModalOpen(true)}
                  />

                  {/* 9. TODAY'S TRAINING OPERATIONS & 10. INJURY INTELLIGENCE */}
                  <TrainingAndInjurySection
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
                setAiMessages(INITIAL_COPILOT_MESSAGES);
                setSessionMemoryTopic(null);
                triggerToast('Reset AI Copilot conversation session memory');
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
          ) : (
            <ConnectedModuleView
              activeNav={activeNav}
              selectedRole={selectedRole}
              onReturnToCommandCenter={() => setActiveNav('command-center')}
              athletes={athletes}
              sessions={sessions}
              injuries={injuries}
              assessments={ASSESSMENTS_LIST}
              analyticsSeries={ANALYTICS_14D_SERIES}
              onSelectAthlete={(ath) => handleOpenFullAthlete360(ath)}
              onSelectSession={(sess) => setSelectedSession(sess)}
            />
          )}
        </main>
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
        athletes={athletes}
        existingInjuries={injuries}
        onClose={() => setIsReportInjuryOpen(false)}
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
