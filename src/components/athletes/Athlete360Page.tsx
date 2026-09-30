import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Download,
  Dumbbell,
  Edit3,
  Eye,
  FileText,
  HeartPulse,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Sparkles,
  Upload,
  UserCheck,
  UserPlus,
  Utensils,
  X,
} from 'lucide-react';
import {
  Athlete,
  AthleteDocument,
  AthleteTimelineEvent,
  BodyComposition,
  BodyRegionId,
  DocumentCategory,
  Injury,
  KeySignalItem,
  NavItemId,
  NutritionPlan,
  Supplement,
  TestResult,
  UserRole,
} from '../../types/usi';
import {
  AthleteAvatar,
  DocumentStatusBadge,
  LoadBadge,
  MedicalStatusBadge,
  RiskBadge,
  TrainingStatusBadge,
  VerificationStatusBadge,
} from '../ui/Badges';
import { InteractiveBodyMap } from '../medical/InteractiveBodyMap';
import {
  exportSingleAthlete360Dossier,
  exportToPDF,
} from '../../utils/exportEngine';

export type Athlete360TabId =
  | 'Overview'
  | 'Performance'
  | 'Training'
  | 'Medical'
  | 'Sports Science'
  | 'Nutrition'
  | 'Assessments'
  | 'Anti-Doping & Governance'
  | 'Documents';

export type AiAssistanceMode =
  | 'summary'
  | 'readiness'
  | 'risk'
  | 'coach-brief';

interface Athlete360PageProps {
  athlete: Athlete;
  allAthletes: Athlete[];
  injuries?: Injury[];
  nutritionPlans?: NutritionPlan[];
  supplements?: Supplement[];
  bodyComposition?: BodyComposition;
  testResults?: TestResult[];
  selectedRole?: UserRole;
  onSwitchAthlete: (athlete: Athlete) => void;
  onBackToRegistry: () => void;
  onOpenAssignCoach: (athlete: Athlete) => void;
  onOpenReviewApplication: (athlete: Athlete) => void;
  onOpenEditProfile: (athlete: Athlete) => void;
  onOpenAiAssistance: (mode: AiAssistanceMode) => void;
  onSelectInjuryDrawer?: (injury: Injury) => void;
  onOpenCreateRehabSession?: (injury: Injury) => void;
  onOpenAdvanceRtpModal?: (injury: Injury) => void;
  onOpenReportInjuryModal?: (region?: BodyRegionId) => void;
  onOpenMedicalModule?: () => void;
  onNavigateModule?: (nav: NavItemId) => void;
  onUpdateAthlete: (
    athleteId: string,
    updates: Partial<Athlete>,
    auditAction: string,
    toastMsg: string
  ) => void;
  onTriggerToast: (msg: string) => void;
}

export const Athlete360Page: React.FC<Athlete360PageProps> = ({
  athlete,
  allAthletes,
  injuries = [],
  nutritionPlans = [],
  supplements = [],
  bodyComposition,
  testResults = [],
  selectedRole = 'Performance Director',
  onSwitchAthlete,
  onBackToRegistry,
  onOpenAssignCoach,
  onOpenReviewApplication,
  onOpenEditProfile,
  onOpenAiAssistance,
  onSelectInjuryDrawer,
  onOpenCreateRehabSession,
  onOpenAdvanceRtpModal,
  onOpenReportInjuryModal,
  onOpenMedicalModule,
  onNavigateModule,
  onUpdateAthlete,
  onTriggerToast,
}) => {
  const [activeTab, setActiveTab] = useState<Athlete360TabId>('Overview');
  const [medicalRegion, setMedicalRegion] =
    useState<BodyRegionId>('Hamstring — Left');
  const [docCategoryFilter, setDocCategoryFilter] = useState<
    'All' | DocumentCategory
  >('All');

  // Contextual Drawers inside Athlete 360
  const [activeMetricDrawer, setCompleteMetricDrawer] = useState<
    'risk' | 'workload' | 'recovery' | 'medical' | null
  >(null);
  const [selectedSignal, setSelectedSignal] = useState<KeySignalItem | null>(
    null
  );
  const [selectedTimelineEvent, setSelectedTimelineEvent] =
    useState<AthleteTimelineEvent | null>(null);
  const [selectedDocument, setSelectedDocument] =
    useState<AthleteDocument | null>(null);
  const [showAssessmentDetailModal, setShowAssessmentDetailModal] =
    useState(false);
  const [isWhereaboutsModalOpen, setIsWhereaboutsModalOpen] = useState(false);
  const [isTueApplicationModalOpen, setIsTueApplicationModalOpen] = useState(false);
  const [whereaboutsWindow, setWhereaboutsWindow] = useState(
    athlete.wadaWhereabouts?.dailyWindowTime || '06:00 - 07:00 AM'
  );
  const [whereaboutsLocation, setWhereaboutsLocation] = useState(
    athlete.wadaWhereabouts?.dailyLocation || 'National High Performance Centre, Hostel Wing B, Room 302'
  );
  const [loggedMeals, setLoggedMeals] = useState<Record<string, boolean>>({
    'meal-1': true,
    'meal-2': true,
    'meal-3': false,
    'meal-4': false,
    'meal-5': false,
  });
  const [loggedHydrationMl, setLoggedHydrationMl] = useState(2600);

  const getTabsForRole = (role: UserRole): Athlete360TabId[] => {
    switch (role) {
      case 'Athlete':
        return [
          'Overview',
          'Performance',
          'Training',
          'Sports Science',
          'Nutrition',
          'Anti-Doping & Governance',
          'Documents',
        ];
      case 'Coach':
        return [
          'Overview',
          'Performance',
          'Training',
          'Sports Science',
          'Assessments',
          'Anti-Doping & Governance',
          'Documents',
        ];
      case 'Physiotherapist':
        return ['Overview', 'Medical', 'Training', 'Sports Science', 'Assessments', 'Documents'];
      case 'Nutritionist':
        return ['Overview', 'Nutrition', 'Performance', 'Sports Science', 'Documents'];
      case 'Operations Team':
        return ['Overview', 'Training', 'Documents'];
      case 'Federation Admin':
        return [
          'Overview',
          'Anti-Doping & Governance',
          'Documents',
          'Assessments',
          'Performance',
        ];
      case 'Sports Scientist':
        return ['Overview', 'Sports Science', 'Performance', 'Training', 'Nutrition', 'Assessments'];
      case 'Performance Director':
      default:
        return [
          'Overview',
          'Performance',
          'Training',
          'Medical',
          'Sports Science',
          'Nutrition',
          'Assessments',
          'Anti-Doping & Governance',
          'Documents',
        ];
    }
  };

  const tabs: Athlete360TabId[] = getTabsForRole(selectedRole);

  React.useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab(tabs[0] || 'Overview');
    }
  }, [selectedRole, tabs, activeTab]);

  const handleGenerateUpdatedAiSummary = () => {
    const updatedText = `${athlete.name}'s composite readiness is ${athlete.readiness}/100 (updated 28 Sep 2026). Acute workload (${athlete.acuteLoadAu} AU, ACWR ${athlete.acwr.toFixed(2)}), morning HRV (${athlete.hrvMs} ms), and sleep consistency (${athlete.sleepFormatted}) have been cross-checked against ${athlete.medicalStatus.toLowerCase()} medical status. Review high-speed running exposure prior to next pitch block.`;
    onUpdateAthlete(
      athlete.id,
      { aiSummary: updatedText, lastUpdated: 'Just now' },
      'Generated updated AI Athlete Summary',
      `Refreshed AI operational summary for ${athlete.name}`
    );
  };

  const handleCompleteProfileItem = (
    key: keyof Athlete['profileCompletionBreakdown'],
    label: string
  ) => {
    if (selectedRole === 'Athlete') {
      onTriggerToast(
        'Profile details and completion status are read-only for the Athlete persona.'
      );
      return;
    }

    if (athlete.profileCompletionBreakdown[key]) {
      if (key === 'documents') setActiveTab('Documents');
      if (key === 'coachAssignment') {
        onOpenAssignCoach(athlete);
      }
      return;
    }

    const updatedBreakdown = {
      ...athlete.profileCompletionBreakdown,
      [key]: true,
    };
    const totalTrue = Object.values(updatedBreakdown).filter(Boolean).length;
    const newPct = Math.min(100, Math.round((totalTrue / 6) * 100));

    const extraUpdates: Partial<Athlete> = {};
    if (key === 'medicalClearance') {
      extraUpdates.medicalStatus = 'Cleared';
      extraUpdates.trainingStatus = 'ACTIVE';
    }

    onUpdateAthlete(
      athlete.id,
      {
        profileCompletionBreakdown: updatedBreakdown,
        profileCompletion: newPct,
        lastUpdated: 'Just now',
        ...extraUpdates,
      },
      `Completed profile requirement: ${label} (${newPct}% complete)`,
      `Completed "${label}" — Profile Completion increased to ${newPct}%`
    );
  };

  const handleReplaceDocument = (doc: AthleteDocument) => {
    const updatedDocs = athlete.documents.map((d) =>
      d.id === doc.id
        ? {
            ...d,
            status: 'Verified' as const,
            lastUpdated: '28 Sep 2026',
            expiry: '28 Sep 2027',
          }
        : d
    );
    onUpdateAthlete(
      athlete.id,
      { documents: updatedDocs, lastUpdated: 'Just now' },
      `Replaced and verified document: ${doc.name}`,
      `Uploaded replacement for "${doc.name}" — Status updated to Verified`
    );
  };

  const filteredDocs = athlete.documents.filter((d) =>
    docCategoryFilter === 'All' ? true : d.category === docCategoryFilter
  );

  const expiringDocsCount = athlete.documents.filter(
    (d) => d.status === 'Expiring Soon' || d.status === 'Expired'
  ).length;

  return (
    <div className="space-y-5">
      {/* Top Breadcrumb & Quick Athlete Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={onBackToRegistry}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
            <span>{selectedRole === 'Athlete' ? 'Personal Portal' : 'Athlete Registry'}</span>
          </button>
          <span className="text-slate-600">/</span>
          <span className="font-mono text-sky-400">
            {selectedRole === 'Athlete' ? '/my-profile' : `/athletes/${athlete.athleteId}`}
          </span>
        </div>

        {selectedRole !== 'Athlete' && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Switch Athlete:</span>
            <select
              value={athlete.id}
              onChange={(e) => {
                const target = allAthletes.find((a) => a.id === e.target.value);
                if (target) onSwitchAthlete(target);
              }}
              className="px-2.5 py-1 bg-[#0F1623] border border-slate-800 rounded text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              {allAthletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.athleteId} · {a.position})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4. ATHLETE 360 HEADER */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <AthleteAvatar
              name={athlete.name}
              jerseyNumber={athlete.jerseyNumber}
              status={athlete.status}
              size="lg"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 uppercase">
                  {athlete.name}
                </h1>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Status:</span>
                  <TrainingStatusBadge status={athlete.trainingStatus} />
                </div>
                <VerificationStatusBadge status={athlete.verificationStatus} />
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1.5">
                <span className="font-mono font-semibold text-sky-400">
                  {athlete.athleteId}
                </span>
                <span className="text-slate-600">·</span>
                <span>
                  {athlete.sport} · {athlete.position}
                </span>
                <span className="text-slate-600">·</span>
                <span>{athlete.subSquad || athlete.squad}</span>
                <span className="text-slate-600">·</span>
                <span className="text-slate-400">
                  Coach: <strong className="text-slate-200">{athlete.coach}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Header Actions: Role-scoped actions */}
          <div className="flex flex-wrap items-center gap-2">
            {(athlete.verificationStatus === 'Pending' ||
              athlete.verificationStatus === 'Changes Requested') &&
              ['Federation Admin', 'Performance Director'].includes(selectedRole) && (
              <button
                onClick={() => onOpenReviewApplication(athlete)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Review Application</span>
              </button>
            )}

            <button
              onClick={() => {
                if (selectedRole === 'Athlete') return;
                onOpenEditProfile(athlete);
              }}
              disabled={selectedRole === 'Athlete'}
              title={
                selectedRole === 'Athlete'
                  ? 'Editing profile details is disabled for Athlete persona'
                  : 'Edit Athlete Profile'
              }
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap ${
                selectedRole === 'Athlete'
                  ? 'bg-[#090D16]/50 border-slate-800/70 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-slate-200'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedRole === 'Athlete' ? 'Edit My Details' : 'Edit Profile'}</span>
            </button>

            {['Coach', 'Federation Admin', 'Performance Director'].includes(selectedRole) && (
              <button
                onClick={() => onOpenAssignCoach(athlete)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5 text-sky-400" />
                <span>Assign Coach</span>
              </button>
            )}

            <button
              onClick={() => {
                const file = exportSingleAthlete360Dossier(
                  'PDF',
                  athlete,
                  injuries,
                  selectedRole
                );
                onTriggerToast(
                  `Exported ${athlete.name} Athlete 360 Official Dossier (${file}) ✓`
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
              title="Export complete Athlete 360 Dossier as PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export PDF</span>
            </button>

            <button
              onClick={() => {
                const file = exportSingleAthlete360Dossier(
                  'CSV',
                  athlete,
                  injuries,
                  selectedRole
                );
                onTriggerToast(
                  `Exported ${athlete.name} telemetry summary (${file}) ✓`
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
              title="Export Athlete 360 telemetry as CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => onOpenAiAssistance('summary')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Summary</span>
            </button>
          </div>
        </div>

        {/* 5. ATHLETE 360 HEADER METRICS (6 Clickable Prominent Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          {/* 1. Readiness */}
          <button
            onClick={() => onOpenAiAssistance('readiness')}
            className="text-left p-3 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Readiness</span>
              <span className="text-[10px] text-sky-400">Explain →</span>
            </div>
            <div
              className={`text-xl font-mono font-bold mt-1 tabular-nums ${
                athlete.readiness >= 80
                  ? 'text-emerald-400'
                  : athlete.readiness >= 65
                    ? 'text-amber-400'
                    : 'text-rose-400'
              }`}
            >
              {athlete.readiness} <span className="text-xs text-slate-500">/ 100</span>
            </div>
          </button>

          {/* 2. Injury Risk */}
          <button
            onClick={() => setCompleteMetricDrawer('risk')}
            className="text-left p-3 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Injury Risk</span>
              <span className="text-[10px] text-sky-400">Inspect →</span>
            </div>
            <div className="mt-1.5 uppercase font-mono font-bold">
              <RiskBadge risk={athlete.injuryRisk} />
            </div>
          </button>

          {/* 3. Training Load */}
          <button
            onClick={() => setCompleteMetricDrawer('workload')}
            className="text-left p-3 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Training Load</span>
              <span className="text-[10px] text-sky-400">Detail →</span>
            </div>
            <div className="text-xl font-mono font-bold text-amber-300 mt-1 tabular-nums">
              {athlete.trainingLoadPct}%
            </div>
          </button>

          {/* 4. Recovery */}
          <button
            onClick={() => setCompleteMetricDrawer('recovery')}
            className="text-left p-3 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Recovery</span>
              <span className="text-[10px] text-sky-400">Telemetry →</span>
            </div>
            <div className="text-xl font-mono font-bold text-slate-100 mt-1 tabular-nums">
              {athlete.recovery}%
            </div>
          </button>

          {/* 5. Medical Status */}
          <button
            onClick={() => setCompleteMetricDrawer('medical')}
            className="text-left p-3 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Medical Status</span>
              <span className="text-[10px] text-sky-400">
                {selectedRole === 'Athlete' ? 'Status →' : 'Update →'}
              </span>
            </div>
            <div className="mt-1.5 font-mono font-bold uppercase">
              <span
                className={`text-xs font-bold ${
                  athlete.medicalStatus === 'Cleared'
                    ? 'text-emerald-400'
                    : 'text-amber-400'
                }`}
              >
                {athlete.trainingStatus === 'RESTRICTED'
                  ? 'RESTRICTED'
                  : athlete.medicalStatus.toUpperCase()}
              </span>
            </div>
          </button>

          {/* 6. Profile Completion */}
          <button
            onClick={() => {
              setActiveTab('Overview');
              document
                .getElementById('profile-completion-card')
                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            className="text-left p-3 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 hover:border-slate-700 transition-colors"
          >
            <div className="text-[11px] text-slate-400 flex items-center justify-between">
              <span>Profile Completion</span>
              <span className="text-[10px] text-sky-400">Checklist →</span>
            </div>
            <div className="text-xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
              {athlete.profileCompletion}%
            </div>
          </button>
        </div>
      </div>

      {/* 6. ATHLETE 360 TABS BAR */}
      <div className="border-b border-slate-800 flex items-center gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                active
                  ? 'border-sky-400 text-sky-300 bg-sky-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab}</span>
              {tab === 'Documents' && expiringDocsCount > 0 && (
                <span className="ml-1.5 font-mono text-[10px] text-amber-400">
                  ({expiringDocsCount}!)
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* TAB 1: OVERVIEW TAB (Fully Implemented)                   */}
      {/* ========================================================= */}
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left 8 Columns: Current Status, AI Summary, Key Signals, Timeline */}
          <div className="lg:col-span-8 space-y-5">
            {/* Section 1: CURRENT STATUS */}
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-xs font-bold tracking-wider text-slate-200">
                  CURRENT STATUS
                </h2>
                <span className="text-[11px] font-mono text-slate-400">
                  Last Synced: {athlete.lastUpdated}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-3.5 text-xs">
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800/90">
                  <span className="text-slate-400 block text-[11px]">Readiness</span>
                  <span className="text-base font-mono font-bold text-slate-100 mt-1 block tabular-nums">
                    {athlete.readiness}
                  </span>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800/90">
                  <span className="text-slate-400 block text-[11px]">Training Load</span>
                  <div className="mt-1">
                    <LoadBadge load={athlete.trainingLoad} />
                  </div>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800/90">
                  <span className="text-slate-400 block text-[11px]">Recovery</span>
                  <span className="text-base font-mono font-bold text-slate-100 mt-1 block tabular-nums">
                    {athlete.recovery}%
                  </span>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800/90">
                  <span className="text-slate-400 block text-[11px]">Injury Risk</span>
                  <div className="mt-1">
                    <RiskBadge risk={athlete.injuryRisk} />
                  </div>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800/90">
                  <span className="text-slate-400 block text-[11px]">Medical Clearance</span>
                  <div className="mt-1">
                    <MedicalStatusBadge status={athlete.medicalStatus} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: AI ATHLETE SUMMARY & AI ATHLETE ASSISTANCE */}
            <div className="bg-[#0F1623] border border-sky-500/40 rounded-lg p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <h2 className="text-xs font-bold tracking-wider text-sky-300">
                    AI ATHLETE SUMMARY
                  </h2>
                </div>
                <span className="text-[11px] text-slate-400">
                  Operational Intelligence · Non-Diagnostic Decision Support
                </span>
              </div>

              <p className="mt-3.5 text-sm text-slate-100 leading-relaxed font-medium">
                "{athlete.aiSummary}"
              </p>

              <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleGenerateUpdatedAiSummary}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-sky-400" />
                    <span>Generate Updated Summary</span>
                  </button>
                </div>

                {/* Section 16: AI Athlete Assistance Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => onOpenAiAssistance('readiness')}
                    className="px-2.5 py-1 rounded bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300"
                  >
                    Explain Readiness
                  </button>
                  <button
                    onClick={() => onOpenAiAssistance('risk')}
                    className="px-2.5 py-1 rounded bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300"
                  >
                    Identify Risk Factors
                  </button>
                  {selectedRole !== 'Athlete' && (
                    <button
                      onClick={() => onOpenAiAssistance('coach-brief')}
                      className="px-2.5 py-1 rounded bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-[11px] text-slate-300"
                    >
                      Prepare Coach Brief
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Section 3: KEY SIGNALS (Clickable) */}
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h2 className="text-xs font-bold tracking-wider text-slate-200">
                  KEY SIGNALS
                </h2>
                <span className="text-[11px] text-slate-400">
                  Click any signal to inspect baseline & telemetry context
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3.5">
                {athlete.keySignals.map((sig) => (
                  <button
                    key={sig.id}
                    onClick={() => setSelectedSignal(sig)}
                    className="text-left p-3.5 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="text-xs font-medium text-slate-400">
                      {sig.label}
                    </div>
                    <div className="text-lg font-mono font-bold text-slate-100 mt-1 tabular-nums">
                      {sig.value}
                    </div>
                    <div
                      className={`text-xs font-mono font-semibold mt-1 tabular-nums ${
                        sig.isNegativeSignal
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {sig.delta}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Section 8: ATHLETE TIMELINE */}
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div>
                  <h2 className="text-xs font-bold tracking-wider text-slate-200">
                    CHRONOLOGICAL ATHLETE TIMELINE
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click any timeline event to inspect clinical, workload, or AI evidence
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400">
                  {athlete.timeline.length} Events
                </span>
              </div>

              <div className="mt-4 space-y-2.5">
                {athlete.timeline.map((ev) => {
                  const categoryColor =
                    ev.category === 'AI'
                      ? 'text-amber-400 border-amber-500/30 bg-amber-500/10'
                      : ev.category === 'Medical'
                        ? 'text-rose-400 border-rose-500/30 bg-rose-500/10'
                        : ev.category === 'Training'
                          ? 'text-sky-400 border-sky-500/30 bg-sky-500/10'
                          : 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';

                  return (
                    <button
                      key={ev.id}
                      onClick={() => setSelectedTimelineEvent(ev)}
                      className="w-full text-left p-3.5 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800/90 transition-colors flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5">
                        <div className="w-14 shrink-0 font-mono text-xs font-bold text-slate-300 pt-0.5 tabular-nums">
                          {ev.date}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-100">
                              {ev.title}
                            </span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${categoryColor}`}
                            >
                              {ev.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {ev.description}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-sky-400 shrink-0 font-medium">
                        Details →
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Profile Completion & Activity Audit Trail */}
          <div className="lg:col-span-4 space-y-5">
            {/* Section 12: PROFILE COMPLETION */}
            <div
              id="profile-completion-card"
              className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xs font-bold tracking-wider text-slate-200">
                    PROFILE COMPLETION
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click any incomplete item to verify or resolve
                  </p>
                </div>
                <span className="text-lg font-mono font-bold text-emerald-400 tabular-nums">
                  {athlete.profileCompletion}%
                </span>
              </div>

              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mt-3">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                  style={{ width: `${athlete.profileCompletion}%` }}
                />
              </div>

              <div className="mt-4 space-y-2">
                {(
                  [
                    { key: 'basicInfo', label: 'Basic Information' },
                    { key: 'sportInfo', label: 'Sport Information' },
                    { key: 'documents', label: 'Documents' },
                    { key: 'coachAssignment', label: 'Coach Assignment' },
                    { key: 'medicalClearance', label: 'Medical Clearance' },
                    { key: 'emergencyContact', label: 'Emergency Contact' },
                  ] as const
                ).map((item) => {
                  const isDone = athlete.profileCompletionBreakdown[item.key];
                  return (
                    <button
                      key={item.key}
                      disabled={selectedRole === 'Athlete'}
                      onClick={() =>
                        handleCompleteProfileItem(item.key, item.label)
                      }
                      className={`w-full text-left px-3 py-2 rounded-md border flex items-center justify-between text-xs transition-colors ${
                        selectedRole === 'Athlete'
                          ? 'bg-[#0B101B] border-slate-800/80 text-slate-400 cursor-not-allowed opacity-75'
                          : isDone
                            ? 'bg-[#0B101B] border-slate-800/80 text-slate-200 hover:bg-slate-800/50'
                            : 'bg-amber-950/20 border-amber-500/40 text-amber-200 hover:bg-amber-950/30'
                      }`}
                    >
                      <span>{item.label}</span>
                      {isDone ? (
                        <span className="font-mono text-emerald-400 font-bold">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-amber-400 font-semibold text-[11px]">
                          <span>⚠ Resolve</span>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Section: WADA ANTI-DOPING & WHEREABOUTS CARD */}
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                    WADA ANTI-DOPING & WHEREABOUTS
                  </h2>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {athlete.wadaWhereabouts?.filingStatus || 'Compliant ✓'}
                </span>
              </div>

              <div className="p-3 rounded bg-[#0B101B] border border-slate-800/80 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Testing Pool:</span>
                  <span className="font-mono font-bold text-sky-400">
                    {athlete.wadaWhereabouts?.poolTier || 'National RTP'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">60-Min Daily Window:</span>
                  <span className="font-mono font-bold text-slate-200">
                    {whereaboutsWindow}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-slate-400 shrink-0">Location:</span>
                  <span className="text-right text-[11px] text-slate-300 line-clamp-1">
                    {whereaboutsLocation}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
                  <span className="text-slate-400">Active TUE:</span>
                  <span className="font-mono font-semibold text-emerald-400">
                    {athlete.wadaWhereabouts?.tueActive
                      ? 'Approved (Formoterol)'
                      : 'None Required'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  disabled={selectedRole === 'Athlete'}
                  onClick={() => {
                    if (selectedRole === 'Athlete') return;
                    setIsWhereaboutsModalOpen(true);
                  }}
                  className={
                    selectedRole === 'Athlete'
                      ? 'text-slate-500 cursor-not-allowed opacity-50 font-semibold'
                      : 'text-sky-400 hover:text-sky-300 font-semibold'
                  }
                >
                  Edit 60-min Window ✎
                </button>
                <button
                  onClick={() => setActiveTab('Anti-Doping & Governance')}
                  className="text-slate-400 hover:text-white"
                >
                  Full Anti-Doping Dossier →
                </button>
              </div>
            </div>

            {/* Section 17: ACTIVITY AUDIT TRAIL */}
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-xs font-bold tracking-wider text-slate-200">
                    ACTIVITY AUDIT TRAIL
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Enterprise governance log of profile actions
                  </p>
                </div>
              </div>

              <div className="mt-3.5 space-y-3">
                {athlete.auditTrail.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded bg-[#0B101B] border border-slate-800/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                      <span>{entry.timestamp}</span>
                      <span className="text-sky-400 font-semibold">
                        {entry.role}
                      </span>
                    </div>
                    <div className="text-slate-200 font-medium">
                      {entry.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: PERFORMANCE TAB (Fully Implemented)                */}
      {/* ========================================================= */}
      {activeTab === 'Performance' && (
        <div className="space-y-5">
          {/* Top Performance Score & AI Performance Insight */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-4 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold tracking-wider text-slate-400">
                  COMPOSITE PERFORMANCE SCORE
                </div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-4xl font-mono font-bold text-emerald-400 tabular-nums">
                    {athlete.performanceScore}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    / 100 · Senior Squad Benchmark: 76
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-4 gap-2 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[10px]">30m Sprint</span>
                  <strong className="text-slate-100">
                    {athlete.performanceMetrics.sprint30m.current}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">CMJ</span>
                  <strong className="text-slate-100">
                    {athlete.performanceMetrics.cmj.current}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Yo-Yo Test</span>
                  <strong className="text-slate-100">
                    {athlete.performanceMetrics.yoYo.current}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Strength</span>
                  <strong className="text-slate-100">
                    {athlete.performanceMetrics.strength.current}
                  </strong>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 bg-[#0F1623] border border-sky-500/40 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold tracking-wider text-sky-300">
                      AI PERFORMANCE INSIGHT
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Last 4 Assessment Cycles
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-slate-100 leading-relaxed">
                  "{athlete.aiPerformanceInsight}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Next scheduled testing battery: <strong className="text-slate-200">05 Oct 2026</strong>
                </span>
                <button
                  onClick={() => setShowAssessmentDetailModal(true)}
                  className="px-3.5 py-1.5 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors"
                >
                  View Assessment Details
                </button>
              </div>
            </div>
          </div>

          {/* 4 Assessment Cycle Trend Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(
              [
                athlete.performanceMetrics.sprint30m,
                athlete.performanceMetrics.cmj,
                athlete.performanceMetrics.yoYo,
                athlete.performanceMetrics.strength,
              ] as const
            ).map((metric) => (
              <div
                key={metric.label}
                className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      {metric.label}
                    </h3>
                    <span className="text-[11px] text-slate-400">
                      4-Cycle Longitudinal Assessment Trend
                    </span>
                  </div>
                  <span className="text-xl font-mono font-bold text-sky-400 tabular-nums">
                    {metric.current}
                  </span>
                </div>

                {/* Comparison Benchmarks */}
                <div className="grid grid-cols-4 gap-2 text-xs font-mono tabular-nums">
                  <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Current</span>
                    <strong className="text-sky-400">{metric.current}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Squad Avg</span>
                    <strong className="text-slate-200">{metric.squadAvg}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Benchmark</span>
                    <strong className="text-emerald-400">{metric.benchmark}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Personal Best</span>
                    <strong className="text-amber-300">{metric.personalBest}</strong>
                  </div>
                </div>

                {/* Cycle Bars */}
                <div className="pt-2">
                  <div className="grid grid-cols-4 gap-3 items-end h-24 pt-4 px-2 bg-[#0B101B] rounded border border-slate-800/80 pb-2">
                    {metric.cycles.map((c, idx) => {
                      const isLast = idx === metric.cycles.length - 1;
                      return (
                        <div
                          key={c.cycle}
                          className="h-full flex flex-col justify-end items-center gap-1"
                        >
                          <span className="text-[10px] font-mono text-slate-300 tabular-nums">
                            {c.value}
                          </span>
                          <div
                            style={{ height: `${55 + idx * 12}%` }}
                            className={`w-full max-w-[36px] rounded-t ${
                              isLast ? 'bg-sky-400' : 'bg-slate-700'
                            }`}
                          />
                          <span className="text-[10px] font-mono text-slate-400">
                            {c.cycle}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 8: DOCUMENTS TAB (Fully Implemented)                  */}
      {/* ========================================================= */}
      {activeTab === 'Documents' && (
        <div className="space-y-4">
          {/* Expiring Soon Warning Banner */}
          {expiringDocsCount > 0 && (
            <div className="p-4 rounded-lg bg-amber-950/25 border border-amber-500/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Compliance Alert:</strong> {expiringDocsCount} document(s) for{' '}
                  {athlete.name} are marked as <strong>Expiring Soon</strong> or{' '}
                  <strong>Expired</strong>. Replace before international travel clearance.
                </span>
              </div>
              <button
                disabled={selectedRole === 'Athlete'}
                onClick={() => {
                  if (selectedRole === 'Athlete') return;
                  const targetDoc = athlete.documents.find(
                    (d) => d.status === 'Expiring Soon' || d.status === 'Expired'
                  );
                  if (targetDoc) handleReplaceDocument(targetDoc);
                }}
                className={`px-3 py-1.5 rounded font-semibold text-xs whitespace-nowrap ${
                  selectedRole === 'Athlete'
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                Renew Expiring Certificate
              </button>
            </div>
          )}

          {/* Document Category Filter Bar */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  'All',
                  'Identity',
                  'Medical',
                  'Insurance',
                  'Contracts',
                  'Certifications',
                  'Performance',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setDocCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    docCategoryFilter === cat
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-[#090D16] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              disabled={selectedRole === 'Athlete'}
              onClick={() => {
                if (selectedRole === 'Athlete') return;
                const newDoc: AthleteDocument = {
                  id: `doc-${Date.now()}`,
                  name: 'Supplemental ECG & Blood Panel Clearance',
                  category: 'Medical',
                  status: 'Verified',
                  expiry: '28 Sep 2027',
                  uploadedBy: 'Performance Director',
                  lastUpdated: 'Today',
                  fileSize: '1.6 MB PDF',
                };
                onUpdateAthlete(
                  athlete.id,
                  {
                    documents: [newDoc, ...athlete.documents],
                    lastUpdated: 'Just now',
                  },
                  'Uploaded new Medical Clearance document',
                  'Uploaded and verified new athlete document'
                );
              }}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md font-semibold text-xs ${
                selectedRole === 'Athlete'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                  : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>+ Upload Document</span>
            </button>
          </div>

          {/* Documents Table */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] font-semibold text-slate-400">
                    <th className="py-3 px-4">Document</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Expiry</th>
                    <th className="py-3 px-3">Uploaded By</th>
                    <th className="py-3 px-3">Last Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#151E2E]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                          <div>
                            <div className="font-semibold text-slate-100">
                              {doc.name}
                            </div>
                            <div className="text-[11px] font-mono text-slate-500">
                              {doc.fileSize}
                              {doc.notes ? ` · ${doc.notes}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {doc.category}
                      </td>
                      <td className="py-3 px-3">
                        <DocumentStatusBadge status={doc.status} />
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 tabular-nums">
                        {doc.expiry}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {doc.uploadedBy}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-400 tabular-nums">
                        {doc.lastUpdated}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedDocument(doc)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              const file = exportToPDF(
                                `${athlete.name}_${doc.name}`,
                                {
                                  title: `OFFICIAL ATHLETE DOCUMENT: ${doc.name.toUpperCase()}`,
                                  subtitle: `${athlete.name} (${athlete.athleteId}) | Category: ${doc.category} | Status: ${doc.status}`,
                                  metadataPairs: [
                                    { label: 'Athlete Name', value: `${athlete.name} (${athlete.athleteId})` },
                                    { label: 'Document Category', value: doc.category },
                                    { label: 'Verification Status', value: doc.status },
                                    { label: 'Valid Until / Expiry', value: doc.expiry },
                                    { label: 'Uploaded By', value: doc.uploadedBy },
                                    { label: 'Original File Size', value: doc.fileSize },
                                  ],
                                  sections: [
                                    {
                                      heading: 'Document Certification & Institutional Record',
                                      lines: [
                                        `Official verified copy of "${doc.name}" stored in the Unified Sports Interface (USI) National Athlete Repository.`,
                                        `Athlete Context: ${athlete.sport} - ${athlete.squad} (${athlete.position}). Medical Clearance: ${athlete.medicalStatus}.`,
                                        doc.notes
                                          ? `Clinical / Administrative Notes: ${doc.notes}`
                                          : 'All biometric and regulatory signatures validated by Federation Governance.',
                                      ],
                                    },
                                  ],
                                }
                              );
                              onTriggerToast(
                                `Downloaded ${doc.name} (${file}) ✓`
                              );
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium inline-flex items-center gap-1"
                          >
                            <Download className="w-3 h-3 text-sky-400" />
                            <span>Download</span>
                          </button>
                          <button
                            disabled={selectedRole === 'Athlete'}
                            onClick={() => {
                              if (selectedRole === 'Athlete') return;
                              handleReplaceDocument(doc);
                            }}
                            className={`px-2.5 py-1 rounded border font-medium ${
                              selectedRole === 'Athlete'
                                ? 'bg-slate-900 border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                                : 'bg-sky-500/15 hover:bg-sky-500/25 border-sky-500/30 text-sky-300'
                            }`}
                          >
                            Replace
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STRUCTURED CONTEXTUAL PREVIEWS FOR FUTURE TABS            */}
      {/* (Training, Medical, Sports Science, Nutrition, Assessments)*/}
      {/* ========================================================= */}
      {(activeTab === 'Training' ||
        activeTab === 'Medical' ||
        activeTab === 'Sports Science' ||
        activeTab === 'Nutrition' ||
        activeTab === 'Assessments' ||
        activeTab === 'Anti-Doping & Governance') && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="text-xs font-mono text-sky-400 uppercase">
                ATHLETE 360 · {activeTab.toUpperCase()} MODULE CONTEXT
              </div>
              <h2 className="text-base font-bold text-slate-100 mt-1">
                {athlete.name} — {activeTab} Operational Profile
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Athlete ID: {athlete.athleteId}
            </span>
          </div>

          {activeTab === 'Training' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Current Training Status</span>
                  <div className="mt-1.5">
                    <TrainingStatusBadge status={athlete.trainingStatus} />
                  </div>
                </div>
                <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Acute / Chronic Workload</span>
                  <span className="text-base font-mono font-bold text-slate-100 mt-1 block">
                    {athlete.acuteLoadAu} AU / {athlete.chronicLoadAu} AU (ACWR {athlete.acwr.toFixed(2)})
                  </span>
                </div>
                <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Assigned Lead Coach</span>
                  <span className="text-base font-semibold text-slate-100 mt-1 block">
                    {athlete.coach} ({athlete.coachRole})
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <p className="text-slate-400 leading-relaxed">
                  This module connects {athlete.name}'s individual microcycle periodisation, prescribed pitch/gym sessions, velocity-based strength progression, and sRPE workload caps.
                </p>
                {onNavigateModule && (
                  <button
                    onClick={() => onNavigateModule('sessions')}
                    className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors shrink-0"
                  >
                    Open Full Training Workspace →
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Medical' && (
            <div className="space-y-5 text-xs">
              {(() => {
                const athleteInjuries = injuries.filter(
                  (i) => i.athleteId === athlete.id
                );
                const primaryInj = athleteInjuries[0] || null;
                const isRestrictedAdmin = selectedRole === 'Federation Admin';

                return (
                  <>
                    {/* Top Summary Strip: Active Injuries, Rehab Status, RTP Stage, Medical Clearance */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">
                          Active Injuries
                        </span>
                        <strong className="text-sm text-rose-400 font-bold mt-1 block">
                          {primaryInj
                            ? `${primaryInj.diagnosis} (${primaryInj.bodyRegionDisplay})`
                            : '0 Active Injuries'}
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">
                          Rehabilitation Status
                        </span>
                        <strong className="text-sm text-emerald-400 font-mono font-bold mt-1 block">
                          {primaryInj
                            ? `${primaryInj.stage} (${primaryInj.rehabProgressPct}%)`
                            : 'No Rehab Required'}
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">
                          Return-to-Play Stage
                        </span>
                        <strong className="text-sm text-sky-400 font-mono font-bold mt-1 block">
                          {primaryInj
                            ? `Stage ${primaryInj.rtpStage}/5 — ${primaryInj.rtpStageName}`
                            : 'Full Competition Cleared'}
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[11px]">
                          Medical Clearance Status
                        </span>
                        <div className="mt-1.5 flex items-center justify-between">
                          <MedicalStatusBadge status={athlete.medicalStatus} />
                          {onOpenMedicalModule && (
                            <button
                              onClick={onOpenMedicalModule}
                              className="text-[11px] text-sky-400 hover:underline font-medium"
                            >
                              Medical Command →
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Athlete-Specific Body Map */}
                    <InteractiveBodyMap
                      injuries={athleteInjuries}
                      selectedRegion={medicalRegion}
                      onSelectRegion={(reg) => setMedicalRegion(reg)}
                      athleteFilterName={athlete.name}
                      onViewInjury={(inj) =>
                        onSelectInjuryDrawer && onSelectInjuryDrawer(inj)
                      }
                      onUpdateAssessment={(inj) =>
                        onSelectInjuryDrawer && onSelectInjuryDrawer(inj)
                      }
                      onCreateRehabSession={(inj) =>
                        onOpenCreateRehabSession && onOpenCreateRehabSession(inj)
                      }
                      onAdvanceRtp={(inj) =>
                        onOpenAdvanceRtpModal && onOpenAdvanceRtpModal(inj)
                      }
                      onReportNewInjuryAtRegion={(reg) =>
                        onOpenReportInjuryModal && onOpenReportInjuryModal(reg)
                      }
                    />

                    {/* 3-Column Clinical Details: Injury History | Restricted Medical Notes | AI Risk Explanation */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Active & Historical Injuries */}
                      <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-2.5">
                        <div className="font-bold text-slate-200 uppercase">
                          Active & Historical Injury Log
                        </div>
                        {primaryInj && (
                          <div className="p-3 rounded bg-[#0F1623] border border-amber-500/40 space-y-1">
                            <div className="flex justify-between font-mono text-[11px]">
                              <span className="text-amber-300 font-bold">
                                ACTIVE · {primaryInj.onsetDate}
                              </span>
                              <span className="text-sky-400">
                                Stage {primaryInj.rtpStage}/5 RTP
                              </span>
                            </div>
                            <div className="font-semibold text-slate-100">
                              {primaryInj.bodyRegionDisplay} — {primaryInj.severity} ({primaryInj.diagnosis})
                            </div>
                            <div className="text-slate-400 text-[11px]">
                              Restriction: {primaryInj.restrictions}
                            </div>
                          </div>
                        )}
                        <div className="p-3 rounded bg-[#0F1623] border border-slate-800 space-y-1">
                          <div className="flex justify-between font-mono text-[11px]">
                            <span className="text-emerald-400 font-bold">
                              RESOLVED · Prior Record
                            </span>
                            <span className="text-slate-400">Cleared</span>
                          </div>
                          <div className="font-semibold text-slate-200">
                            {athlete.id === 'ath-arjun-mehta'
                              ? 'Right Ankle — Minor — Resolved'
                              : athlete.previousInjuryHistory}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {athlete.previousInjuryHistory}
                          </div>
                        </div>
                      </div>

                      {/* Restricted Medical Notes */}
                      <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200 uppercase">
                            Restricted Medical Notes
                          </span>
                          <span className="text-[10px] font-mono text-amber-400">
                            Role: {selectedRole}
                          </span>
                        </div>
                        {isRestrictedAdmin ? (
                          <div className="p-3 rounded bg-[#0F1623] border border-amber-500/30 text-slate-300">
                            Detailed clinical notes are restricted for Admin role.
                          </div>
                        ) : primaryInj && primaryInj.medicalNotes.length > 0 ? (
                          primaryInj.medicalNotes.map((mn) => (
                            <div
                              key={mn.id}
                              className="p-2.5 rounded bg-[#0F1623] border border-slate-800 space-y-1"
                            >
                              <div className="flex justify-between font-mono text-[10px] text-sky-400">
                                <span>
                                  {mn.date} · {mn.noteType}
                                </span>
                                <span>{mn.author}</span>
                              </div>
                              <p className="text-slate-200">"{mn.note}"</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-3 rounded bg-[#0F1623] border border-slate-800 text-slate-300">
                            {athlete.medicalNote}
                          </div>
                        )}
                      </div>

                      {/* AI Risk Explanation */}
                      <div className="p-4 rounded bg-[#0B101B] border border-sky-500/30 space-y-2.5">
                        <div className="flex items-center gap-2 font-bold text-sky-300 uppercase">
                          <Bot className="w-4 h-4 text-sky-400" />
                          <span>AI Injury Risk Explanation</span>
                        </div>
                        <p className="text-slate-200 leading-relaxed">
                          {athlete.aiSummary}
                        </p>
                        <div className="space-y-1 pt-2 border-t border-slate-800">
                          {athlete.riskSignals.map((sig, idx) => (
                            <div
                              key={idx}
                              className="text-[11px] font-mono text-amber-300"
                            >
                              • {sig}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'Sports Science' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Morning HRV (rMSSD)</span>
                  <span className="text-lg font-mono font-bold text-slate-100 mt-1 block">
                    {athlete.hrvMs} ms (Baseline {athlete.hrvBaselineMs} ms)
                  </span>
                </div>
                <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Sleep Consistency</span>
                  <span className="text-lg font-mono font-bold text-slate-100 mt-1 block">
                    {athlete.sleepFormatted}
                  </span>
                </div>
                <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Subjective Wellness</span>
                  <span className="text-lg font-mono font-bold text-slate-100 mt-1 block">
                    {athlete.wellnessScore} / 10
                  </span>
                </div>
              </div>
              {onNavigateModule && (
                <div className="flex justify-end">
                  <button
                    onClick={() => onNavigateModule('readiness')}
                    className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors"
                  >
                    Open Full Sports Science Workspace →
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'Nutrition' && (
            <div className="space-y-4 text-xs">
              {(() => {
                const plan =
                  nutritionPlans.find((p) => p.athleteId === athlete.id) ||
                  nutritionPlans[0];
                return (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">
                          Nutrition Plan
                        </span>
                        <strong className="text-sky-300 font-bold mt-1 block">
                          {plan ? `${plan.planName} (${plan.goal})` : 'Performance Plan'}
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">
                          Daily Targets
                        </span>
                        <strong className="font-mono text-slate-100 mt-1 block">
                          {plan
                            ? `${plan.targetCalories} kcal · ${plan.targetProteinG}g P`
                            : '2,850 kcal · 165g P'}
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">
                          Compliance
                        </span>
                        <strong className="font-mono text-emerald-400 text-sm mt-1 block">
                          {plan ? `${plan.compliancePct}%` : `${athlete.nutritionCompliancePct}%`}
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">
                          Hydration
                        </span>
                        <strong className="font-mono text-amber-300 text-sm mt-1 block">
                          {plan
                            ? `${plan.currentHydrationL}L / ${plan.targetHydrationL}L (${plan.hydrationCompliancePct}%)`
                            : '2.8L / 3.5L (74%)'}
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">
                          Supplements
                        </span>
                        <strong className="font-mono text-emerald-300 mt-1 block">
                          {plan ? `${plan.supplementCompliancePct}%` : '96%'} ({supplements.length} Active)
                        </strong>
                      </div>
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                        <span className="text-slate-400 block text-[10px]">
                          Body Composition
                        </span>
                        <strong className="font-mono text-slate-100 mt-1 block">
                          {bodyComposition
                            ? `${bodyComposition.weightKg}kg · ${bodyComposition.bodyFatPct}% BF (${bodyComposition.statusLabel})`
                            : `${athlete.weightKg}kg · Stable`}
                        </strong>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      {onNavigateModule && (
                        <button
                          onClick={() => onNavigateModule('nutrition')}
                          className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors"
                        >
                          Open Full Nutrition Workspace →
                        </button>
                      )}
                    </div>

                    {/* Interactive Daily Intake & Hydration Protocol */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                      {/* Left 8 Cols: Prescribed Fueling Protocol */}
                      <div className="lg:col-span-8 p-4 rounded-lg bg-[#0F1623] border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                          <div className="flex items-center gap-2">
                            <Utensils className="w-4 h-4 text-emerald-400" />
                            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                              Today's Prescribed Fueling & Recovery Protocol
                            </h4>
                          </div>
                          <span className="font-mono text-[11px] text-emerald-400">
                            {Object.values(loggedMeals).filter(Boolean).length}/5 Completed (
                            {Math.round((Object.values(loggedMeals).filter(Boolean).length / 5) * 100)}%)
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[
                            {
                              id: 'meal-1',
                              time: '07:30 IST',
                              label: 'Pre-Training Carbohydrate Fueling',
                              menu: 'Rolled Oats (80g) + 35g Whey Isolate + Banana + Tart Cherry (75g CHO, 35g PRO)',
                            },
                            {
                              id: 'meal-2',
                              time: '10:00 IST',
                              label: 'Hydration Bolus & Electrolyte Priming',
                              menu: '500ml Hypotonic Drink + 450mg Sodium + 200mg Potassium',
                            },
                            {
                              id: 'meal-3',
                              time: '11:45 IST',
                              label: 'Intra-Session High-Intensity Fuel',
                              menu: 'Dual-Source Maltodextrin:Fructose Hydrogel (60g CHO/hr)',
                            },
                            {
                              id: 'meal-4',
                              time: '13:15 IST',
                              label: 'Post-Session Anabolic Window Shake',
                              menu: '4:1 CHO:PRO Recovery Bolus + 5g Informed-Sport Creapure® Creatine',
                            },
                            {
                              id: 'meal-5',
                              time: '20:30 IST',
                              label: 'Dinner & Slow-Digesting Night Protein',
                              menu: 'Grilled Salmon + Quinoa + Steamed Asparagus + 30g Micellar Casein',
                            },
                          ].map((item) => {
                            const isDone = Boolean(loggedMeals[item.id]);
                            return (
                              <div
                                key={item.id}
                                className={`p-2.5 rounded border transition-colors flex items-center justify-between gap-3 ${
                                  isDone
                                    ? 'bg-[#091515] border-emerald-500/30'
                                    : 'bg-[#0B101B] border-slate-800'
                                }`}
                              >
                                <div className="space-y-0.5">
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[10px] text-slate-400 font-semibold">{item.time}</span>
                                    <span className="text-slate-600">·</span>
                                    <span className={`text-xs font-semibold ${isDone ? 'text-emerald-300' : 'text-slate-200'}`}>
                                      {item.label}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-slate-400">{item.menu}</p>
                                </div>

                                <button
                                  onClick={() => {
                                    setLoggedMeals((prev) => ({ ...prev, [item.id]: !isDone }));
                                    onUpdateAthlete(
                                      athlete.id,
                                      {
                                        nutritionCompliancePct: Math.min(
                                          100,
                                          Math.round(((Object.values(loggedMeals).filter(Boolean).length + (isDone ? -1 : 1)) / 5) * 100)
                                        ),
                                      },
                                      `${isDone ? 'Unchecked' : 'Logged'} fueling meal: ${item.label}`,
                                      `${isDone ? 'Unchecked' : 'Logged'} ${item.label} ✓ Updated daily compliance`
                                    );
                                  }}
                                  className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-colors ${
                                    isDone
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                      : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
                                  }`}
                                >
                                  {isDone ? '✓ Consumed' : 'Mark Consumed'}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Right 4 Cols: Rapid Hydration Bolus Logger */}
                      <div className="lg:col-span-4 p-4 rounded-lg bg-[#0F1623] border border-slate-800 space-y-3 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                            <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
                              Live Fluid Intake
                            </span>
                            <span className="font-mono text-xs font-bold text-amber-400">
                              {(loggedHydrationMl / 1000).toFixed(1)}L / 3.5L
                            </span>
                          </div>

                          <div className="mt-3 space-y-2">
                            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-400 h-full rounded-full transition-all"
                                style={{ width: `${Math.min(100, Math.round((loggedHydrationMl / 3500) * 100))}%` }}
                              />
                            </div>
                            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                              <span>Current: {loggedHydrationMl}ml</span>
                              <span>Target: 3,500ml</span>
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <span className="text-[11px] text-slate-400 font-medium block">
                              Log Hydration Bolus:
                            </span>
                            <div className="grid grid-cols-2 gap-2">
                              {[
                                { label: '+250ml Water', amount: 250 },
                                { label: '+500ml Water', amount: 500 },
                                { label: '+500ml Hypotonic', amount: 500 },
                                { label: '+750ml Bottle', amount: 750 },
                              ].map((btn) => (
                                <button
                                  key={btn.label}
                                  onClick={() => {
                                    const next = Math.min(5000, loggedHydrationMl + btn.amount);
                                    setLoggedHydrationMl(next);
                                    onUpdateAthlete(
                                      athlete.id,
                                      {},
                                      `Logged ${btn.amount}ml fluid intake (Total: ${(next / 1000).toFixed(1)}L)`,
                                      `Added ${btn.amount}ml to daily fluid total (${(next / 1000).toFixed(1)}L logged) ✓`
                                    );
                                  }}
                                  className="p-2 rounded bg-[#090D16] hover:bg-[#131B2A] border border-slate-800 text-[11px] font-mono text-amber-300 font-semibold transition-colors"
                                >
                                  {btn.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                          Pre-session USG: <strong>1.018 (Nominal)</strong> · Sweat rate modeled at <strong>1.2 L/hr</strong>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {activeTab === 'Assessments' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {testResults
                  .filter((r) => r.athleteId === athlete.id)
                  .map((res) => (
                    <div
                      key={res.id}
                      className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1"
                    >
                      <div className="flex justify-between">
                        <strong className="text-slate-100">{res.testName}</strong>
                        <span className="font-mono text-emerald-400">
                          ▲ {res.progressionStatus}
                        </span>
                      </div>
                      <div className="font-mono text-base font-bold text-sky-400">
                        {res.currentResult} {res.unit}
                      </div>
                      <div className="font-mono text-[11px] text-slate-400">
                        Benchmark: {res.programBenchmark} {res.unit} · Squad Avg:{' '}
                        {res.squadAverage} {res.unit}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('Performance')}
                  className="px-3.5 py-1.5 rounded bg-slate-800 text-slate-200 font-semibold"
                >
                  View Performance Trends
                </button>
                {onNavigateModule && (
                  <button
                    onClick={() => onNavigateModule('assessments-tid')}
                    className="px-3.5 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
                  >
                    Open Assessments & TID Module →
                  </button>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Anti-Doping & Governance' && (
            <div className="space-y-5 text-xs">
              {/* Header Overview Card */}
              <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <h2 className="text-base font-bold text-slate-100 tracking-tight uppercase">
                        WADA & NADA ANTI-DOPING COMPLIANCE DOSSIER
                      </h2>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">
                      World Anti-Doping Code (ADAMS) Testing Pool, 60-Minute Whereabouts Window & TUE Governance
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                      ADAMS STATUS: {athlete.wadaWhereabouts?.filingStatus || 'COMPLIANT ✓'}
                    </span>
                    <button
                      disabled={selectedRole === 'Athlete'}
                      onClick={() => {
                        if (selectedRole === 'Athlete') return;
                        setIsWhereaboutsModalOpen(true);
                      }}
                      className={`px-3.5 py-1.5 rounded font-semibold transition-colors ${
                        selectedRole === 'Athlete'
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                          : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                      }`}
                    >
                      Update 60-min Window
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                  <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Testing Pool Tier</span>
                    <strong className="text-sky-300 font-bold mt-1 block">
                      {athlete.wadaWhereabouts?.poolTier || 'International RTP'}
                    </strong>
                  </div>
                  <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Quarterly Filing</span>
                    <strong className="text-slate-100 font-mono mt-1 block">
                      {athlete.wadaWhereabouts?.filingQuarter || 'Q4 2026'} Filed ✓
                    </strong>
                  </div>
                  <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Missed Tests (12m)</span>
                    <strong className="text-emerald-400 font-mono font-bold mt-1 block">
                      0 / 3 (Clean Record)
                    </strong>
                  </div>
                  <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Next Filing Deadline</span>
                    <strong className="text-amber-300 font-mono mt-1 block">
                      {athlete.wadaWhereabouts?.nextDeadline || '15 Dec 2026'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* 3 Detail Cards: Whereabouts Window | Active TUE | Anti-Doping Education */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Daily 60-Min Testing Window */}
                <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 uppercase">
                        60-Minute Daily Window
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        Active Today
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1.5">
                      <div className="text-xs text-slate-400">Designated Hour:</div>
                      <div className="text-lg font-mono font-bold text-sky-400">
                        {whereaboutsWindow}
                      </div>
                      <div className="text-xs text-slate-400 pt-1 border-t border-slate-800/70">
                        Designated Location:
                      </div>
                      <div className="text-xs text-slate-200 font-medium">
                        {whereaboutsLocation}
                      </div>
                    </div>
                  </div>
                  <button
                    disabled={selectedRole === 'Athlete'}
                    onClick={() => {
                      if (selectedRole === 'Athlete') return;
                      setIsWhereaboutsModalOpen(true);
                    }}
                    className={`w-full py-2 rounded font-medium text-center transition-colors ${
                      selectedRole === 'Athlete'
                        ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    Modify Schedule / Travel Location →
                  </button>
                </div>

                {/* 2. Therapeutic Use Exemption (TUE) Portal */}
                <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 uppercase">
                        Active TUE Certificates
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        WADA Validated
                      </span>
                    </div>
                    {athlete.wadaWhereabouts?.tueCertificate ? (
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1.5">
                        <div className="flex justify-between font-mono text-[11px] text-sky-400">
                          <span>{athlete.wadaWhereabouts.tueCertificate.certificateNumber}</span>
                          <span>Exp: {athlete.wadaWhereabouts.tueCertificate.approvedUntil}</span>
                        </div>
                        <div className="font-semibold text-slate-100 text-xs">
                          {athlete.wadaWhereabouts.tueCertificate.substance}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Granting Authority: {athlete.wadaWhereabouts.tueCertificate.grantingBody}
                        </div>
                      </div>
                    ) : (
                      <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 text-slate-400">
                        No active Therapeutic Use Exemptions on record. All prescribed therapies comply with standard limits.
                      </div>
                    )}
                  </div>
                  <button
                    disabled={selectedRole === 'Athlete'}
                    onClick={() => {
                      if (selectedRole === 'Athlete') return;
                      setIsTueApplicationModalOpen(true);
                    }}
                    className={`w-full py-2 rounded font-medium text-center transition-colors ${
                      selectedRole === 'Athlete'
                        ? 'bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                    }`}
                  >
                    Submit New TUE Medical Dossier →
                  </button>
                </div>

                {/* 3. WADA ADEL Anti-Doping Passport */}
                <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100 uppercase">
                        Clean Sport Education
                      </span>
                      <span className="text-[10px] font-mono text-sky-400">
                        ADEL Verified
                      </span>
                    </div>
                    <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">International Athlete Module</span>
                        <span className="font-mono text-emerald-400 font-bold">100% Passed</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-full" />
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1">
                        Certificate ID: <span className="font-mono text-slate-300">ADEL-2026-90412</span> · Valid through Nov 2027
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-medium">
                    ✓ Clean Sport Athlete Charter signed on file.
                  </div>
                </div>
              </div>

              {/* Doping Control History & Chain-of-Custody Log */}
              <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 uppercase">
                      DOPING CONTROL SAMPLES & CHAIN OF CUSTODY (12-MONTH LOG)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verified laboratory results from WADA-accredited analytical laboratories
                    </p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    3 Controls Registered
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0B101B] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Sample Code</th>
                        <th className="py-2.5 px-3">Testing Type</th>
                        <th className="py-2.5 px-3">Testing Authority</th>
                        <th className="py-2.5 px-3">Laboratory</th>
                        <th className="py-2.5 px-3">Analytical Result</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {[
                        {
                          date: '14 Aug 2026',
                          code: 'WADA-SAMP-91048',
                          type: 'Out-of-Competition (Urine + Blood ABP)',
                          authority: 'National Anti-Doping Agency (NADA)',
                          lab: 'NDTL New Delhi (WADA-Accredited)',
                          result: 'Negative / Normal (Cleared)',
                        },
                        {
                          date: '28 Jun 2026',
                          code: 'WADA-SAMP-84912',
                          type: 'In-Competition (Post-Final Urine)',
                          authority: 'International Testing Agency (ITA)',
                          lab: 'Lausanne Laboratory for Analysis',
                          result: 'Negative / Normal (Cleared)',
                        },
                        {
                          date: '12 Mar 2026',
                          code: 'WADA-SAMP-77319',
                          type: 'Out-of-Competition (Blood ABP)',
                          authority: 'WADA Independent Testing',
                          lab: 'Cologne Analytical Center',
                          result: 'Negative / Normal (Cleared)',
                        },
                      ].map((test) => (
                        <tr key={test.code} className="hover:bg-[#141D2E]">
                          <td className="py-3 px-3 font-mono text-slate-300">{test.date}</td>
                          <td className="py-3 px-3 font-mono font-bold text-sky-400">{test.code}</td>
                          <td className="py-3 px-3 text-slate-200">{test.type}</td>
                          <td className="py-3 px-3 text-slate-300">{test.authority}</td>
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{test.lab}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[11px] font-bold">
                              {test.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* CONTEXTUAL DRAWERS FOR HEADER METRICS, SIGNALS & TIMELINE */}
      {/* ========================================================= */}
      {(activeMetricDrawer || selectedSignal || selectedTimelineEvent || selectedDocument || showAssessmentDetailModal) && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => {
              setCompleteMetricDrawer(null);
              setSelectedSignal(null);
              setSelectedTimelineEvent(null);
              setSelectedDocument(null);
              setShowAssessmentDetailModal(false);
            }}
            className="fixed inset-0 bg-black/65 backdrop-blur-[1px]"
          />

          <aside className="relative w-full max-w-md bg-[#0F1623] border-l border-slate-800 h-full p-5 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100 uppercase">
                  {activeMetricDrawer === 'risk' && 'Injury Risk Telemetry Detail'}
                  {activeMetricDrawer === 'workload' && 'Training Workload Detail'}
                  {activeMetricDrawer === 'recovery' && 'Recovery & Autonomic Detail'}
                  {activeMetricDrawer === 'medical' && 'Medical Clearance Control'}
                  {selectedSignal && `Signal Detail: ${selectedSignal.label}`}
                  {selectedTimelineEvent && `Timeline Event: ${selectedTimelineEvent.date}`}
                  {selectedDocument && `Document Preview: ${selectedDocument.name}`}
                  {showAssessmentDetailModal && 'Assessment Cycle Breakdown'}
                </h3>
                <button
                  onClick={() => {
                    setCompleteMetricDrawer(null);
                    setSelectedSignal(null);
                    setSelectedTimelineEvent(null);
                    setSelectedDocument(null);
                    setShowAssessmentDetailModal(false);
                  }}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {activeMetricDrawer === 'risk' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                    <div className="text-slate-400">Current Risk Classification</div>
                    <div className="mt-1">
                      <RiskBadge risk={athlete.injuryRisk} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="font-semibold text-slate-200">Contributing Signals:</div>
                    {athlete.riskSignals.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded bg-[#0B101B] border border-slate-800 text-slate-300"
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeMetricDrawer === 'workload' && (
                <div className="space-y-3 text-xs font-mono">
                  <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                    <div className="text-slate-400">Training Load Ratio</div>
                    <div className="text-lg font-bold text-amber-400 mt-1">
                      {athlete.trainingLoadPct}% · ACWR {athlete.acwr.toFixed(2)}
                    </div>
                    <div className="text-slate-400 mt-1">
                      Acute: {athlete.acuteLoadAu} AU · Chronic: {athlete.chronicLoadAu} AU
                    </div>
                  </div>
                </div>
              )}

              {activeMetricDrawer === 'recovery' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 font-mono">
                    <div>Composite Recovery: {athlete.recovery}%</div>
                    <div className="mt-1">Morning HRV: {athlete.hrvMs} ms (Baseline {athlete.hrvBaselineMs} ms)</div>
                    <div className="mt-1">Sleep: {athlete.sleepFormatted}</div>
                  </div>
                </div>
              )}

              {activeMetricDrawer === 'medical' && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-300">{athlete.medicalNote}</p>
                  {['Physiotherapist', 'Performance Director'].includes(selectedRole) ? (
                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => {
                          onUpdateAthlete(
                            athlete.id,
                            {
                              medicalStatus: 'Cleared',
                              trainingStatus: 'ACTIVE',
                              status: 'Ready',
                              profileCompletion: 100,
                              profileCompletionBreakdown: {
                                ...athlete.profileCompletionBreakdown,
                                medicalClearance: true,
                              },
                            },
                            'Updated Medical Status to Cleared',
                            `${athlete.name} medical status updated to Cleared`
                          );
                          setCompleteMetricDrawer(null);
                        }}
                        className="px-3 py-2 rounded bg-emerald-500 text-slate-950 font-semibold"
                      >
                        Mark Medical Cleared
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800 text-slate-400 text-[11px]">
                      Medical clearance updates require Chief Medical Officer or Physiotherapist sign-off.
                    </div>
                  )}
                </div>
              )}

              {selectedSignal && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
                    <div className="text-slate-400">{selectedSignal.label}</div>
                    <div className="text-2xl font-mono font-bold text-slate-100 mt-1">
                      {selectedSignal.value}{' '}
                      <span className="text-sm text-amber-400">
                        ({selectedSignal.delta})
                      </span>
                    </div>
                    <div className="text-slate-400 font-mono mt-1">
                      Baseline: {selectedSignal.baseline}
                    </div>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {selectedSignal.explanation}
                  </p>
                </div>
              )}

              {selectedTimelineEvent && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                    <div className="font-mono text-sky-400">
                      {selectedTimelineEvent.date} · {selectedTimelineEvent.time || '09:00'} ·{' '}
                      {selectedTimelineEvent.category}
                    </div>
                    <div className="text-sm font-bold text-slate-100 mt-1">
                      {selectedTimelineEvent.title}
                    </div>
                    <div className="text-slate-400 mt-0.5">
                      Logged by: {selectedTimelineEvent.actor}
                    </div>
                  </div>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedTimelineEvent.detailNotes}
                  </p>
                </div>
              )}

              {selectedDocument && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                    <div className="font-bold text-slate-100 text-sm">
                      {selectedDocument.name}
                    </div>
                    <div>Category: {selectedDocument.category}</div>
                    <div>Expiry: {selectedDocument.expiry}</div>
                    <div>Uploaded By: {selectedDocument.uploadedBy}</div>
                    <div>Status: {selectedDocument.status}</div>
                  </div>
                  <button
                    onClick={() => {
                      const file = exportToPDF(
                        `${athlete.name}_${selectedDocument.name}`,
                        {
                          title: `OFFICIAL ATHLETE DOCUMENT: ${selectedDocument.name.toUpperCase()}`,
                          subtitle: `${athlete.name} (${athlete.athleteId}) | Category: ${selectedDocument.category}`,
                          metadataPairs: [
                            { label: 'Athlete Name', value: athlete.name },
                            { label: 'Category', value: selectedDocument.category },
                            { label: 'Verification', value: selectedDocument.status },
                            { label: 'Expiry Date', value: selectedDocument.expiry },
                          ],
                          sections: [
                            {
                              heading: 'Verified Institutional Copy',
                              lines: [
                                `Certified extract for ${selectedDocument.name} (${selectedDocument.fileSize}).`,
                                `Uploaded by ${selectedDocument.uploadedBy}.`,
                              ],
                            },
                          ],
                        }
                      );
                      onTriggerToast(`Downloaded ${selectedDocument.name} (${file}) ✓`);
                    }}
                    className="w-full py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold inline-flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Official PDF Copy</span>
                  </button>
                </div>
              )}

              {showAssessmentDetailModal && (
                <div className="space-y-3 text-xs">
                  <p className="text-slate-300">
                    Full force-plate, timing-gate, and metabolic testing logs for{' '}
                    <strong>{athlete.name}</strong> verified by Dr. R. Subramanian.
                  </p>
                  <div className="p-3 rounded bg-[#0B101B] border border-slate-800 font-mono space-y-1">
                    <div>10m Split: 1.68s (Squad Avg: 1.73s)</div>
                    <div>30m Sprint: {athlete.performanceMetrics.sprint30m.current}</div>
                    <div>CMJ Peak Power: 58.4 W/kg</div>
                    <div>Nordic Eccentric Mean Force: 412 N</div>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* WADA Whereabouts 60-Minute Window Update Modal */}
      {isWhereaboutsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsWhereaboutsModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-lg bg-[#0F1623] border border-slate-800 rounded-xl p-6 z-10 shadow-2xl space-y-5 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase">
                  UPDATE WADA 60-MINUTE WHEREABOUTS WINDOW
                </h3>
              </div>
              <button
                onClick={() => setIsWhereaboutsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] leading-relaxed">
                <strong>Mandatory Anti-Doping Regulation:</strong> Registered Testing Pool (RTP) athletes must specify a 60-minute daily time window between 05:00 and 23:00 during which they are available and accessible for testing at a specified location. Failure to be available may result in a Filing Failure / Missed Test strike.
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  60-Minute Daily Availability Window
                </label>
                <select
                  value={whereaboutsWindow}
                  onChange={(e) => setWhereaboutsWindow(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded text-slate-100 font-mono text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="05:00 - 06:00 AM">05:00 - 06:00 AM</option>
                  <option value="06:00 - 07:00 AM">06:00 - 07:00 AM (Default Training Camp)</option>
                  <option value="07:00 - 08:00 AM">07:00 - 08:00 AM</option>
                  <option value="12:00 - 01:00 PM">12:00 - 01:00 PM (Midday Rest)</option>
                  <option value="20:00 - 21:00 PM">20:00 - 21:00 PM (Evening Village)</option>
                  <option value="21:00 - 22:00 PM">21:00 - 22:00 PM</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold block">
                  Overnight / Specific Location Address
                </label>
                <input
                  type="text"
                  value={whereaboutsLocation}
                  onChange={(e) => setWhereaboutsLocation(e.target.value)}
                  placeholder="Street, Building, Room / Hotel number, City"
                  className="w-full px-3 py-2 bg-[#090D16] border border-slate-800 rounded text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="p-3 rounded bg-[#0B101B] border border-slate-800 space-y-1 text-[11px] font-mono text-slate-400">
                <div>Athlete: {athlete.name} ({athlete.athleteId})</div>
                <div>Filing Quarter: Q4 2026 · Anti-Doping Authority: WADA / NADA ADAMS</div>
                <div className="text-emerald-400">Submission will automatically sync to WADA ADAMS 4.0 API</div>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsWhereaboutsModalOpen(false)}
                className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateAthlete(
                    athlete.id,
                    {
                      wadaWhereabouts: {
                        poolTier: athlete.wadaWhereabouts?.poolTier || 'International RTP',
                        filingQuarter: athlete.wadaWhereabouts?.filingQuarter || 'Q4 2026',
                        filingStatus: 'Compliant',
                        dailyWindowTime: whereaboutsWindow,
                        dailyLocation: whereaboutsLocation,
                        nextDeadline: '15 Dec 2026',
                        missedTestsCount12m: athlete.wadaWhereabouts?.missedTestsCount12m || 0,
                        tueActive: athlete.wadaWhereabouts?.tueActive ?? true,
                        tueCertificate: athlete.wadaWhereabouts?.tueCertificate,
                      },
                    },
                    `Updated WADA Whereabouts 60-min window to ${whereaboutsWindow} at ${whereaboutsLocation}`,
                    `WADA ADAMS Whereabouts updated successfully ✓`
                  );
                  setIsWhereaboutsModalOpen(false);
                }}
                className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
              >
                Save & Transmit to WADA ADAMS ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit TUE Medical Dossier Modal */}
      {isTueApplicationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsTueApplicationModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-lg bg-[#0F1623] border border-slate-800 rounded-xl p-6 z-10 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h3 className="text-sm font-bold text-slate-100 uppercase">
                  THERAPEUTIC USE EXEMPTION (TUE) APPLICATION
                </h3>
              </div>
              <button
                onClick={() => setIsTueApplicationModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-slate-300 leading-relaxed">
              Submit a formal clinical application to the National Anti-Doping Agency (NADA) TUE Committee in accordance with Article 4.4 of the World Anti-Doping Code.
            </p>

            <div className="space-y-3">
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Prohibited Substance Requested:</span>
                <strong className="text-slate-100 font-mono">Formoterol Fumarate (Inhaled)</strong>
                <span className="text-slate-400 block text-[11px] pt-1">Medical Diagnosis: Exercise-Induced Asthma / Bronchospasm (FEV1 drop &gt; 10%)</span>
              </div>
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800 space-y-1">
                <span className="text-slate-400 block text-[11px]">Certifying Physician:</span>
                <span className="text-slate-200">Dr. K. Nair, MD (Chief Medical Officer · Team Physician)</span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsTueApplicationModalOpen(false)}
                className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onTriggerToast('TUE Medical Dossier Transmitted to NADA TUE Committee ✓');
                  setIsTueApplicationModalOpen(false);
                }}
                className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
              >
                Submit TUE Dossier to NADA
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
