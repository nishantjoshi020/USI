import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Calendar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Compass,
  Droplets,
  Dumbbell,
  FileCheck2,
  Flame,
  HeartPulse,
  MapPin,
  Mic,
  Plus,
  Shield,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Stethoscope,
  TrendingUp,
  User,
  UserCheck,
  Users,
  Utensils,
} from 'lucide-react';
import {
  AIActionCentreItem,
  AIRecommendation,
  AITrainingModificationItem,
  AssessmentProgram,
  Athlete,
  DailyAnalyticsPoint,
  HierarchyContext,
  HydrationLog,
  Injury,
  NavItemId,
  NutritionPlan,
  RehabPlanRecord,
  Supplement,
  TestResult,
  TrainingSession,
  UserRole,
  WellnessProfile,
} from '../../types/usi';
import { ROLE_DESCRIPTIONS } from '../../data/mockData';
import { KpiFilterKey, KpiGrid } from './KpiGrid';
import { ReadinessAndAlertSection } from './ReadinessAndAlertSection';
import { TrainingAndInjurySection } from './TrainingAndInjurySection';
import { AthleteAttentionTable } from './AthleteAttentionTable';
import { AiRecommendationsAndAnalytics } from './AiRecommendationsAndAnalytics';
import { LoadBadge, RiskBadge, StatusBadge } from '../ui/Badges';

export const ALL_USER_PERSONAS: {
  role: UserRole;
  pluralLabel: string;
  shortTag: string;
}[] = [
  { role: 'Athlete', pluralLabel: 'Athletes', shortTag: 'Personal Hub' },
  { role: 'Coach', pluralLabel: 'Coaches', shortTag: 'Tactical & Pitch' },
  {
    role: 'Sports Scientist',
    pluralLabel: 'Sports Scientists',
    shortTag: 'Load & Telemetry',
  },
  {
    role: 'Physiotherapist',
    pluralLabel: 'Physiotherapists',
    shortTag: 'Clinical & RTP',
  },
  {
    role: 'Nutritionist',
    pluralLabel: 'Nutritionists',
    shortTag: 'Fueling & Hydration',
  },
  {
    role: 'Federation Admin',
    pluralLabel: 'Federation Admins',
    shortTag: 'Governance & Registry',
  },
  {
    role: 'Performance Director',
    pluralLabel: 'Performance Directors',
    shortTag: 'Executive Command',
  },
  {
    role: 'Operations Team',
    pluralLabel: 'Operations Teams',
    shortTag: 'Venues & Logistics',
  },
];

interface RoleScopedDashboardProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  context: HierarchyContext;
  athletes: Athlete[];
  sessions: TrainingSession[];
  injuries: Injury[];
  rehabPlans: RehabPlanRecord[];
  nutritionPlans: NutritionPlan[];
  hydrationLogs: HydrationLog[];
  supplements: Supplement[];
  assessmentPrograms: AssessmentProgram[];
  testResults: TestResult[];
  aiActionItems: AIActionCentreItem[];
  aiTrainingModifications: AITrainingModificationItem[];
  recommendations: AIRecommendation[];
  analyticsSeries: DailyAnalyticsPoint[];
  wellnessProfile: WellnessProfile;
  // Executive Command Center props
  activeKpi: KpiFilterKey | null;
  onSelectKpi: (kpi: KpiFilterKey) => void;
  selectedReadinessTier: string | null;
  onSelectReadinessTier: (tier: string | null) => void;
  tableStatusFilter: string;
  onChangeTableStatusFilter: (status: string) => void;
  drawerAthleteId: string | null;
  // Interactive callbacks
  onSelectAthleteDrawer: (athlete: Athlete) => void;
  onOpenAthlete360: (athlete: Athlete) => void;
  onSelectSession: (session: TrainingSession) => void;
  onSelectInjuryDrawer: (injury: Injury) => void;
  onNavigate: (nav: NavItemId) => void;
  onOpenTrainingModModal: () => void;
  onOpenReportInjuryModal: () => void;
  onOpenCreateRehabSession: (injury: Injury) => void;
  onOpenAdvanceRtpModal: (injury: Injury) => void;
  onOpenOnboardingModal: () => void;
  onOpenApprovalModal: (athlete: Athlete) => void;
  onOpenAssignCoachModal: (athlete: Athlete) => void;
  onOpenRiskFactorsModal: () => void;
  onReviewRiskAthletes: () => void;
  onApplyRecommendation: (id: string) => void;
  onReviewRecommendation: (rec: AIRecommendation) => void;
  onToggleMealConsumed: (planId: string, mealId: string) => void;
  onQuickAddHydration: (athleteId: string, athleteName: string, amountMl: number) => void;
  onOpenAICopilot: () => void;
  onTriggerToast: (msg: string) => void;
}

export const RoleScopedDashboard: React.FC<RoleScopedDashboardProps> = ({
  selectedRole,
  onSelectRole,
  context,
  athletes,
  sessions,
  injuries,
  rehabPlans,
  nutritionPlans,
  supplements,
  assessmentPrograms,
  testResults,
  aiActionItems,
  aiTrainingModifications,
  recommendations,
  analyticsSeries,
  wellnessProfile,
  activeKpi,
  onSelectKpi,
  selectedReadinessTier,
  onSelectReadinessTier,
  tableStatusFilter,
  onChangeTableStatusFilter,
  drawerAthleteId,
  onSelectAthleteDrawer,
  onOpenAthlete360,
  onSelectSession,
  onSelectInjuryDrawer,
  onNavigate,
  onOpenTrainingModModal,
  onOpenReportInjuryModal,
  onOpenCreateRehabSession,
  onOpenAdvanceRtpModal,
  onOpenOnboardingModal,
  onOpenApprovalModal,
  onOpenAssignCoachModal,
  onOpenRiskFactorsModal,
  onReviewRiskAthletes,
  onApplyRecommendation,
  onReviewRecommendation,
  onToggleMealConsumed,
  onQuickAddHydration,
  onOpenAICopilot,
  onTriggerToast,
}) => {
  const primaryAthlete =
    athletes.find((a) => a.id === 'ath-arjun-mehta') || athletes[0];
  const primaryNutritionPlan =
    nutritionPlans.find((p) => p.athleteId === primaryAthlete.id) ||
    nutritionPlans[0];
  const primaryInjury =
    injuries.find((i) => i.athleteId === primaryAthlete.id) || injuries[0];
  const primaryRehab =
    rehabPlans.find((r) => r.athleteId === primaryAthlete.id) || rehabPlans[0];

  const roleMeta = ROLE_DESCRIPTIONS[selectedRole] || {
    focus: 'Role-scoped operational telemetry and workflows',
    clearance: 'Authorized Operational Access',
  };

  return (
    <div className="space-y-5">
      {/* =====================================================================
       * 1. COMMAND CENTER HEADER & ACTIVE ROLE VIEW PERSONA SWITCHER
       * ===================================================================== */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3.5 border-b border-slate-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-sky-400 font-medium">
              <span>{context.federation}</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-200">
                {context.sport} · {context.squad}
              </span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400 font-mono">{context.date}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1">
              {selectedRole === 'Athlete'
                ? `Welcome back, ${primaryAthlete.name} (${primaryAthlete.athleteId})`
                : `${selectedRole} Operational Command Center`}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              <strong className="text-slate-200">Role Priority Focus:</strong>{' '}
              {roleMeta.focus}
            </p>
          </div>

          {/* Quick Role Action Bar (AI Voice/Chat Copilot) */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenAICopilot}
              className="px-3 py-2 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-xs font-semibold text-sky-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <Bot className="w-3.5 h-3.5 text-sky-400" />
              <span>AI Copilot (Chat & Voice)</span>
            </button>
          </div>
        </div>

        {/* 8-Persona Active Role View Selector Strip */}
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Active Role View (8 User Personas)</span>
              <span className="text-slate-500 font-normal">
                — Dashboard dynamically filters to information strictly relevant to the selected persona
              </span>
            </div>
            <span className="font-mono text-[11px] text-sky-400">
              {roleMeta.clearance}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
            {ALL_USER_PERSONAS.map((persona) => {
              const isActive = selectedRole === persona.role;
              return (
                <button
                  key={persona.role}
                  onClick={() => onSelectRole(persona.role)}
                  className={`p-2.5 rounded-md border text-left transition-all ${
                    isActive
                      ? 'bg-sky-500/15 border-sky-500 text-slate-100 ring-1 ring-sky-500/30'
                      : 'bg-[#090D16] hover:bg-[#141D2E] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-xs font-bold truncate ${
                        isActive ? 'text-sky-300' : 'text-slate-200'
                      }`}
                    >
                      {persona.pluralLabel}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                    )}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    {persona.shortTag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================================
       * 2. ROLE-SCOPED DASHBOARD CONTENT
       * ===================================================================== */}

      {/* ---------------------------------------------------------------------
       * PERSONA 1: ATHLETE VIEW (Only Personal Readiness, Training, Rehab & Fueling)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Athlete' && (
        <div className="space-y-5">
          {/* Athlete Personal KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">My Readiness Today</div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {primaryAthlete.readiness}%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Modified Load Prescribed
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Morning HRV (rMSSD)</div>
              <div className="mt-2 text-2xl font-mono font-bold text-rose-400 tabular-nums">
                58 ms
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                -14% vs 67ms baseline
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Sleep Recovery</div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {primaryAthlete.sleepFormatted || `${wellnessProfile.sleep}/10`}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Target: 7.8h · Recovery {wellnessProfile.recovery}/10
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Medical & RTP Stage</div>
              <div className="mt-2 text-2xl font-mono font-bold text-sky-400 tabular-nums">
                Stage {primaryInjury?.rtpStage || 3}/5
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                {primaryInjury?.rtpStageName || 'Sport-Specific Training'}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Daily Calorie Target</div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                {primaryNutritionPlan.currentCalories} /{' '}
                {primaryNutritionPlan.targetCalories}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                {primaryNutritionPlan.compliancePct}% Meal Compliance
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Hydration Target</div>
              <div className="mt-2 text-2xl font-mono font-bold text-sky-400 tabular-nums">
                {primaryNutritionPlan.currentHydrationL}L /{' '}
                {primaryNutritionPlan.targetHydrationL}L
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                {primaryNutritionPlan.hydrationCompliancePct}% · Log +500ml below
              </div>
            </div>
          </div>

          {/* Athlete Main 2-Column Operational Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left 7 Cols: My Today's Training Schedule & Prescribed Modifications */}
            <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 uppercase">
                    MY TRAINING SCHEDULE & INDIVIDUAL PRESCRIPTION
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned sessions and medical/coaching load modifications for{' '}
                    {primaryAthlete.name}
                  </p>
                </div>
                <button
                  onClick={() => onOpenAthlete360(primaryAthlete)}
                  className="px-3 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-semibold text-sky-300 inline-flex items-center gap-1"
                >
                  <span>Open My Athlete 360</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Active Individual Training Modification Notice */}
              <div className="p-3.5 rounded-md bg-amber-950/20 border border-amber-500/40 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-amber-300 uppercase">
                    INDIVIDUAL DRILL MODIFICATION ACTIVE (STAGE 3 HAMSTRING PROTOCOL)
                  </span>
                  <span className="font-mono text-[11px] text-emerald-300">
                    Max Sprint Cap: ≤ 85% Vmax
                  </span>
                </div>
                <p className="text-slate-200">
                  High-speed block adjusted from{' '}
                  <span className="line-through text-rose-300 font-mono">
                    6 × 30m maximal sprint
                  </span>{' '}
                  to{' '}
                  <strong className="text-emerald-300 font-mono">
                    4 × 20m controlled acceleration
                  </strong>
                  .
                </p>
              </div>

              {/* Athlete's Sessions Today */}
              <div className="space-y-2.5">
                {sessions.slice(0, 4).map((sess) => (
                  <div
                    key={sess.id}
                    className="p-3.5 rounded-md bg-[#090D16] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sky-400 font-semibold">
                          {sess.time}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="font-bold text-slate-100">
                          {sess.title}
                        </span>
                        <StatusBadge status={sess.status} />
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          {sess.pitchOrVenue}
                        </span>
                        <span>·</span>
                        <span>Coach: {sess.coach}</span>
                        <span>·</span>
                        <span className="font-mono">
                          Planned: {sess.plannedLoadAu} AU
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => onSelectSession(sess)}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
                      >
                        Inspect Drills →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Cols: My Daily Fueling, Hydration & Rehab Check-In */}
            <div className="lg:col-span-5 space-y-4">
              {/* My Daily Nutrition & Hydration Checklist */}
              <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-3.5 text-xs">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                  <div>
                    <h3 className="font-bold text-slate-100 uppercase">
                      MY DAILY FUELING & HYDRATION LOG
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      {primaryNutritionPlan.planName}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      onQuickAddHydration(
                        primaryAthlete.id,
                        primaryAthlete.name,
                        500
                      )
                    }
                    className="px-2.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] inline-flex items-center gap-1"
                  >
                    <Droplets className="w-3 h-3" />
                    <span>+500ml Isotonic</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {primaryNutritionPlan.meals.map((meal) => (
                    <button
                      key={meal.id}
                      onClick={() =>
                        onToggleMealConsumed(primaryNutritionPlan.id, meal.id)
                      }
                      className={`w-full text-left p-2.5 rounded border flex items-center justify-between transition-colors ${
                        meal.consumed
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-100'
                          : 'bg-[#090D16] border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="font-semibold">
                          {meal.name}: {meal.menuSummary}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400">
                          {meal.time} · {meal.calories} kcal · P:{meal.proteinG}g C:
                          {meal.carbsG}g
                        </div>
                      </div>
                      <span
                        className={`font-mono text-[10px] font-bold ${
                          meal.consumed ? 'text-emerald-300' : 'text-amber-300'
                        }`}
                      >
                        {meal.consumed ? 'Logged ✓' : 'Mark Consumed'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* My Active Rehab Protocol */}
              {primaryInjury && (
                <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between pb-2.5 border-b border-slate-800">
                    <div>
                      <h3 className="font-bold text-slate-100 uppercase">
                        MY REHABILITATION PROTOCOL
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        {primaryInjury.diagnosis} · Lead:{' '}
                        {primaryInjury.leadClinician}
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenCreateRehabSession(primaryInjury)}
                      className="px-2.5 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px]"
                    >
                      Log Rehab Session
                    </button>
                  </div>
                  <div className="p-3 rounded bg-[#090D16] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-slate-400">
                        Stage {primaryInjury.rtpStage}/5:{' '}
                        {primaryInjury.rtpStageName}
                      </span>
                      <span className="text-sky-400 font-bold">
                        {primaryInjury.rehabProgressPct}% Complete
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      Prescribed Exercises:{' '}
                      {primaryRehab?.stages?.[2]?.exercises?.join(' · ') ||
                        'Nordic Eccentric Lowering · Single-Leg RDL · Isometric Bridge'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
       * PERSONA 2: COACH VIEW (Squad Availability, Tactical Sessions, AI Load Mods)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Coach' && (
        <div className="space-y-5">
          {/* Coach Tactical KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Squad Availability</div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                88.0% (162/184)
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                13 Modified · 5 Unavailable
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Today's Pitch Sessions</div>
              <div className="mt-2 text-2xl font-mono font-bold text-sky-400 tabular-nums">
                {sessions.length} Sessions
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                94% Squad Attendance Verified
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Pending AI Drill Modifications
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {aiTrainingModifications.length} Athletes
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Awaiting Coach Sign-off for MD-2
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Squad Mean Readiness</div>
              <div className="mt-2 text-2xl font-mono font-bold text-slate-100 tabular-nums">
                78%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                3 High-Risk Load Alerts Flagged
              </div>
            </div>
          </div>

          {/* Coach Consequential AI Training Modifications Banner */}
          <div className="p-4 rounded-lg bg-[#0F1623] border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300 font-bold">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>
                  COACH DECISION REQUIRED: TOMORROW HIGH-INTENSITY SPRINT MODIFICATIONS
                </span>
              </div>
              <p className="text-xs text-slate-300">
                USI AI recommends modifying drill prescriptions for{' '}
                <strong className="text-slate-100">
                  {aiTrainingModifications.map((m) => m.athleteName).join(', ')}
                </strong>{' '}
                due to acute workload spikes (+16% to +22%) and RTP sprint ceilings.
              </p>
            </div>
            <button
              onClick={onOpenTrainingModModal}
              className="px-4 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shrink-0"
            >
              Review & Approve Drill Changes ({aiTrainingModifications.length})
            </button>
          </div>

          <ReadinessAndAlertSection
            selectedReadinessTier={selectedReadinessTier}
            onSelectReadinessTier={onSelectReadinessTier}
            onViewAthletesRegistry={() => onNavigate('athlete-registry')}
            onReviewRiskAthletes={onReviewRiskAthletes}
            onOpenRiskFactorsModal={onOpenRiskFactorsModal}
          />

          <TrainingAndInjurySection
            sessions={sessions}
            injuries={injuries}
            onSelectSession={onSelectSession}
            onSelectInjuryAthlete={(athleteId) => {
              const foundInj = injuries.find((i) => i.athleteId === athleteId);
              if (foundInj) onSelectInjuryDrawer(foundInj);
            }}
            onViewInjuryIntelligence={() => onNavigate('injury-intelligence')}
          />

          <AthleteAttentionTable
            athletes={athletes}
            selectedAthleteId={drawerAthleteId}
            onSelectAthlete={onSelectAthleteDrawer}
            statusFilter={tableStatusFilter}
            onChangeStatusFilter={onChangeTableStatusFilter}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------------
       * PERSONA 3: SPORTS SCIENTIST VIEW (ACWR, HRV Telemetry, Force-Plate & Benchmarks)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Sports Scientist' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Squad Acute:Chronic Ratio (ACWR)
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                1.18
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                +18% 7-day acute workload spike
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Autonomic HRV Suppression
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-rose-400 tabular-nums">
                3 Athletes
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                rMSSD depressed &gt; 12% vs baseline
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Force-Plate & Field Testing
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-sky-400 tabular-nums">
                94% Complete
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                {assessmentPrograms.length} Active Testing Batteries
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                GPS High-Speed Exposure
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                685 AU Mean
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                10Hz Catapult Telemetry Synced
              </div>
            </div>
          </div>

          {/* Scientist Telemetry & Benchmark Table */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 uppercase">
                    HIGH WORKLOAD & AUTONOMIC SUPPRESSION COHORT
                  </h2>
                  <p className="text-xs text-slate-400">
                    Athletes exceeding ACWR thresholds or exhibiting neuromuscular fatigue
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('workload')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-medium"
                >
                  Open Workload Module →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                      <th className="py-2 pr-3">Athlete</th>
                      <th className="py-2 px-2">Readiness</th>
                      <th className="py-2 px-2">Fatigue</th>
                      <th className="py-2 px-2">Training Load</th>
                      <th className="py-2 px-2">Injury Risk</th>
                      <th className="py-2 pl-2 text-right">Telemetry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70">
                    {athletes.slice(0, 6).map((ath) => (
                      <tr
                        key={ath.id}
                        className="hover:bg-[#151E2E] transition-colors"
                      >
                        <td className="py-2.5 pr-3 font-semibold text-slate-100">
                          {ath.name}
                          <div className="text-[10px] font-mono text-slate-400">
                            {ath.position} · {ath.squad}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 font-mono font-bold text-amber-300 tabular-nums">
                          {ath.readiness}%
                        </td>
                        <td className="py-2.5 px-2 font-mono text-slate-200 tabular-nums">
                          {ath.acwr}
                        </td>
                        <td className="py-2.5 px-2">
                          <LoadBadge load={ath.trainingLoad} />
                        </td>
                        <td className="py-2.5 px-2">
                          <RiskBadge risk={ath.injuryRisk} />
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          <button
                            onClick={() => onOpenAthlete360(ath)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-sky-300"
                          >
                            Inspect 360 →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-3.5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 uppercase">
                    RECENT FORCE-PLATE & BENCHMARK RESULTS
                  </h2>
                  <p className="text-xs text-slate-400">
                    Validated physical assessment telemetry vs squad benchmarks
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('assessments-tid')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-medium"
                >
                  Assessments & TID →
                </button>
              </div>

              <div className="space-y-2.5">
                {testResults.slice(0, 5).map((tr) => (
                  <div
                    key={tr.id}
                    className="p-3 rounded bg-[#090D16] border border-slate-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-100">
                        {tr.testName} — {tr.athleteName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400">
                        Squad Avg: {tr.squadAverage} {tr.unit} · National Benchmark:{' '}
                        {tr.nationalBenchmark} {tr.unit}
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-sm font-bold text-sky-400 tabular-nums">
                        {tr.currentResult} {tr.unit}
                      </div>
                      <div
                        className={`text-[10px] ${
                          tr.progressionStatus === 'Improving'
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {tr.progressionStatus}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <AiRecommendationsAndAnalytics
            recommendations={recommendations}
            onApplyRecommendation={onApplyRecommendation}
            onReviewRecommendation={onReviewRecommendation}
            analyticsSeries={analyticsSeries}
            onOpenAnalyticsModule={() => onNavigate('analytics-bi')}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------------
       * PERSONA 4: PHYSIOTHERAPIST VIEW (Clinical Injury Register, Rehab & RTP Gates)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Physiotherapist' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Active Injury Caseload</div>
              <div className="mt-2 text-2xl font-mono font-bold text-rose-400 tabular-nums">
                {injuries.length} Cases
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                2 In Rehab · 1 RTP · 1 Escalated
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">RTP Gate Reviews Due</div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                2 Athletes
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Arjun Mehta (Stage 3/5) · Kabir Rao (Stage 2/5)
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">Mean Rehab Compliance</div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                68%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Daily clinical session logging active
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Medical Clearance Authority
              </div>
              <div className="mt-2 text-lg font-mono font-bold text-sky-400">
                Level 4 Clinical
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Full SOAP Notes & RTP Gate Sign-Off
              </div>
            </div>
          </div>

          <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  ACTIVE CLINICAL INJURY REGISTER & RETURN-TO-PLAY GATES
                </h2>
                <p className="text-xs text-slate-400">
                  Manage active diagnoses, log rehabilitation sessions, and verify 5-stage RTP clinical gates
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenReportInjuryModal}
                  className="px-3 py-1.5 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Report New Injury</span>
                </button>
                <button
                  onClick={() => onNavigate('injury-intelligence')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-medium"
                >
                  Open Full Medical Workspace →
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {injuries.map((inj) => (
                <div
                  key={inj.id}
                  className="p-4 rounded-md bg-[#090D16] border border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold text-sm text-slate-100">
                        {inj.athleteName}{' '}
                        <span className="text-slate-400 font-mono text-xs">
                          ({inj.squad})
                        </span>
                      </div>
                      <div className="text-sky-300 font-semibold mt-0.5">
                        {inj.diagnosis} · {inj.bodyRegionDisplay}
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-amber-300">
                      Stage {inj.rtpStage}/5 ({inj.rtpStageName})
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-[11px] p-2.5 rounded bg-[#0F1623] border border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        PAIN SCORE
                      </span>
                      <strong className="text-slate-100">
                        {inj.painScore}/10
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        REHAB PROGRESS
                      </span>
                      <strong className="text-emerald-400">
                        {inj.rehabProgressPct}%
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">
                        TARGET RTP
                      </span>
                      <strong className="text-sky-300">{inj.estimatedRtpDate}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    <strong className="text-slate-200">Restrictions:</strong>{' '}
                    {inj.restrictions}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => onSelectInjuryDrawer(inj)}
                      className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                    >
                      Clinical Notes & Case
                    </button>
                    <button
                      onClick={() => onOpenCreateRehabSession(inj)}
                      className="px-2.5 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-semibold"
                    >
                      + Log Rehab Session
                    </button>
                    <button
                      onClick={() => onOpenAdvanceRtpModal(inj)}
                      className="px-2.5 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold"
                    >
                      Review RTP Gate →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
       * PERSONA 5: NUTRITIONIST VIEW (Fueling Plans, Hydration Osmolality & Supplements)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Nutritionist' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Squad Caloric Compliance
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                84%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                MD-3 Glycogen Loading Active
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Hydration Compliance
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                76%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                12 Athletes Flagged for Electrolyte Reload
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                WADA Supplement Protocols
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-sky-400 tabular-nums">
                {supplements.length} Active
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                100% Batch-Tested & Verified
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                DEXA Body Comp Screening
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-slate-100 tabular-nums">
                9.8% Body Fat
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                65.2 kg Lean Mass (Arjun Mehta)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="lg:col-span-8 bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 uppercase">
                    ATHLETE FUELING & HYDRATION PERIODISATION PLANS
                  </h2>
                  <p className="text-xs text-slate-400">
                    Daily caloric intake, macronutrient targets, and post-session hydration compliance
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('nutrition')}
                  className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                >
                  Open Nutrition Workspace →
                </button>
              </div>

              <div className="space-y-3">
                {nutritionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    className="p-4 rounded-md bg-[#090D16] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-100">
                        {plan.athleteName} —{' '}
                        <span className="text-sky-300">{plan.planName}</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-1">
                        Calories: {plan.currentCalories}/{plan.targetCalories} kcal (
                        {plan.compliancePct}%) · Protein: {plan.currentProteinG}/
                        {plan.targetProteinG}g · Carbs: {plan.currentCarbsG}/
                        {plan.targetCarbsG}g
                      </div>
                      <div className="text-[11px] font-mono text-amber-300 mt-0.5">
                        Hydration: {plan.currentHydrationL}L / {plan.targetHydrationL}L (
                        {plan.hydrationCompliancePct}%)
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() =>
                          onQuickAddHydration(
                            plan.athleteId,
                            plan.athleteName,
                            500
                          )
                        }
                        className="px-2.5 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-semibold text-[11px]"
                      >
                        +500ml Electrolyte
                      </button>
                      <button
                        onClick={() => onNavigate('nutrition-plans')}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px]"
                      >
                        Edit Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-3.5">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  ACTIVE SUPPLEMENT PROTOCOLS
                </h2>
                <p className="text-xs text-slate-400">
                  Informed-Sport batch verified protocols
                </p>
              </div>
              <div className="space-y-2.5">
                {supplements.map((supp) => (
                  <div
                    key={supp.id}
                    className="p-3 rounded bg-[#090D16] border border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-100">
                      <span>{supp.name}</span>
                      <span className="font-mono text-emerald-400">
                        {supp.compliancePct}%
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {supp.purpose} · {supp.dosage} · {supp.schedule}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
       * PERSONA 6: FEDERATION ADMIN VIEW (Governance, Verification, Coach Assignment)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Federation Admin' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Total Enrolled Athletes
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-slate-100 tabular-nums">
                184
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Across 5 Federation Sports
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Verification Queue
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                {
                  athletes.filter((a) => a.verificationStatus !== 'Verified')
                    .length
                }{' '}
                Pending
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Awaiting Federation Admin Sign-Off
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                WADA & Document Compliance
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                96.4%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Identity, Insurance & TUE Verified
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                AI & Cloud Governance Audit
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-sky-400 tabular-nums">
                100% Logged
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Firestore Immutable Audit Trail
              </div>
            </div>
          </div>

          <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  FEDERATION ATHLETE VERIFICATION, ONBOARDING & COACH GOVERNANCE
                </h2>
                <p className="text-xs text-slate-400">
                  Review athlete eligibility applications, verify identity/medical documents, and assign licensed coaches
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenOnboardingModal}
                  className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Enroll New Athlete</span>
                </button>
                <button
                  onClick={() => onNavigate('athlete-registry')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200"
                >
                  Full Registry →
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="py-2 pr-3">Athlete / ID</th>
                    <th className="py-2 px-2">Sport & Squad</th>
                    <th className="py-2 px-2">Assigned Coach</th>
                    <th className="py-2 px-2">Profile Completion</th>
                    <th className="py-2 px-2">Verification Status</th>
                    <th className="py-2 pl-2 text-right">Governance Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {athletes.map((ath) => (
                    <tr
                      key={ath.id}
                      className="hover:bg-[#151E2E] transition-colors"
                    >
                      <td className="py-2.5 pr-3">
                        <div className="font-semibold text-slate-100">
                          {ath.name}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400">
                          {ath.athleteId}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-slate-300">
                        {ath.sport} · {ath.squad}
                      </td>
                      <td className="py-2.5 px-2 text-slate-300">
                        {ath.coach}
                      </td>
                      <td className="py-2.5 px-2 font-mono text-sky-400">
                        {ath.profileCompletion}%
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`font-mono text-[11px] font-semibold ${
                            ath.verificationStatus === 'Verified'
                              ? 'text-emerald-400'
                              : 'text-amber-400'
                          }`}
                        >
                          {ath.verificationStatus}
                        </span>
                      </td>
                      <td className="py-2.5 pl-2 text-right space-x-1.5">
                        <button
                          onClick={() => onOpenAssignCoachModal(ath)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
                        >
                          Assign Coach
                        </button>
                        <button
                          onClick={() => onOpenApprovalModal(ath)}
                          className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-[11px] font-semibold text-sky-300"
                        >
                          Review Verification
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------
       * PERSONA 7: PERFORMANCE DIRECTOR VIEW (Full Executive Command Center)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Performance Director' && (
        <div className="space-y-5">
          {/* Executive Departmental Protocol Breach & Non-Compliance Monitor */}
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/40 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-rose-500/30 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h3 className="text-xs font-bold text-rose-200 uppercase tracking-wider">
                    Executive Governance & Departmental Protocol Breach Monitor
                  </h3>
                  <span className="text-[11px] text-rose-300 font-mono">
                    1 Active High-Severity Cross-Department Violation Detected
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onTriggerToast('Summoned urgent Joint Clinical & Coaching Executive Review for Karanveer Singh ✓')}
                  className="px-3 py-1.5 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Summon Joint Review
                </button>
                <button
                  onClick={() => onTriggerToast('Executive Training Override logged in audit trail: Player stood down from pitch session ✓')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-rose-200 border border-rose-500/40 font-semibold text-xs transition-colors"
                >
                  Issue Executive Stop-Order
                </button>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-[#090D16] border border-rose-500/20 text-xs text-slate-300 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300">
                  Breach Incident #GOV-882: Clinical Restriction Velocity Exceeded
                </span>
                <span className="font-mono text-[10px] text-slate-400">Occurred: 10:45 IST Today</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Player <strong className="text-white">Karanveer Singh (Defender)</strong> clocked <strong className="text-rose-300 font-mono">28.4 km/h</strong> in High-Speed Running during Senior Pitch Tactical Block, directly violating Dr. Raghavan's signed medical restriction (<strong className="text-amber-300 font-mono">Capped at 22.0 km/h</strong>).
              </p>
            </div>
          </div>

          {/* Squad Availability Depreciation & Olympic Cycle Projection */}
          <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <div>
                  <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                    Macro Squad Availability Depreciation & Olympic Cycle Roster Depth
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    180-Day Historical Trend vs 90-Day Tournament Peaking Projection
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold">
                Projected Available Core: 82.4% (Target: ≥85%)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">CURRENT SQUAD AVAILABILITY</span>
                <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5">86.2%</div>
                <span className="text-[10px] text-slate-500">162 / 184 National Pool</span>
              </div>
              <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PROJECTED TOURNAMENT DEPRECIATION</span>
                <div className="text-xl font-mono font-bold text-amber-400 mt-0.5">-3.8%</div>
                <span className="text-[10px] text-slate-500">Based on 3-match weekly density</span>
              </div>
              <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PRIMARY INJURY EXPOSURE</span>
                <div className="text-xl font-mono font-bold text-rose-400 mt-0.5">Hamstrings (62%)</div>
                <span className="text-[10px] text-slate-500">Deceleration & HSR fatigue cascade</span>
              </div>
              <div className="p-3 rounded-lg bg-[#090D16] border border-slate-800">
                <span className="text-[10px] text-slate-400 block">OLYMPIC QUALIFICATION READINESS</span>
                <div className="text-xl font-mono font-bold text-sky-400 mt-0.5">TIER-1 READY</div>
                <span className="text-[10px] text-slate-500">Backup depth verified in 9 positions</span>
              </div>
            </div>
          </div>

          <KpiGrid activeKpi={activeKpi} onSelectKpi={onSelectKpi} />

          <ReadinessAndAlertSection
            selectedReadinessTier={selectedReadinessTier}
            onSelectReadinessTier={onSelectReadinessTier}
            onViewAthletesRegistry={() => onNavigate('athlete-registry')}
            onReviewRiskAthletes={onReviewRiskAthletes}
            onOpenRiskFactorsModal={onOpenRiskFactorsModal}
          />

          <TrainingAndInjurySection
            sessions={sessions}
            injuries={injuries}
            onSelectSession={onSelectSession}
            onSelectInjuryAthlete={(athleteId) => {
              const foundInj = injuries.find((i) => i.athleteId === athleteId);
              if (foundInj) {
                onSelectInjuryDrawer(foundInj);
              } else {
                const foundAth = athletes.find((a) => a.id === athleteId);
                if (foundAth) onSelectAthleteDrawer(foundAth);
              }
            }}
            onViewInjuryIntelligence={() => onNavigate('injury-intelligence')}
          />

          <AthleteAttentionTable
            athletes={athletes}
            selectedAthleteId={drawerAthleteId}
            onSelectAthlete={onSelectAthleteDrawer}
            statusFilter={tableStatusFilter}
            onChangeStatusFilter={onChangeTableStatusFilter}
          />

          <AiRecommendationsAndAnalytics
            recommendations={recommendations}
            onApplyRecommendation={onApplyRecommendation}
            onReviewRecommendation={onReviewRecommendation}
            analyticsSeries={analyticsSeries}
            onOpenAnalyticsModule={() => onNavigate('analytics-bi')}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------------
       * PERSONA 8: OPERATIONS TEAM VIEW (Facilities, Attendance & Session Logistics)
       * --------------------------------------------------------------------- */}
      {selectedRole === 'Operations Team' && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Scheduled Venue Allocations
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-emerald-400 tabular-nums">
                {sessions.length} Sessions
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                100% Pitches & Facilities Assigned
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Facility Readiness Status
              </div>
              <div className="mt-2 text-lg font-mono font-bold text-sky-400">
                All Venues Ready
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Main Pitch A, Pitch B & S&C Center
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Daily Squad Attendance
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-slate-100 tabular-nums">
                94.0%
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                6 Completed · 2 Upcoming Today
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <div className="text-xs text-slate-400">
                Field Testing Logistics
              </div>
              <div className="mt-2 text-2xl font-mono font-bold text-amber-400 tabular-nums">
                8 Athletes Due
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Biomechanics Lab & Pitch 1 Setup
              </div>
            </div>
          </div>

          {/* Operations Venue & Facility Allocation Table */}
          <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  TRAINING & COMPETITION FACILITY LOGISTICS
                </h2>
                <p className="text-xs text-slate-400">
                  Manage stadium pitches, S&C facilities, attendance check-ins, and squad session logistics
                </p>
              </div>
              <button
                onClick={() => onNavigate('sessions')}
                className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Calendar className="w-4 h-4" />
                <span>Open Full Session Schedule</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="py-2 pr-3">Session Title</th>
                    <th className="py-2 px-2">Time / Duration</th>
                    <th className="py-2 px-2">Assigned Venue / Facility</th>
                    <th className="py-2 px-2">Squad & Lead</th>
                    <th className="py-2 px-2">Attendance</th>
                    <th className="py-2 px-2">Status</th>
                    <th className="py-2 pl-2 text-right">Session Logistics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {sessions.map((sess) => (
                    <tr
                      key={sess.id}
                      className="hover:bg-[#151E2E] transition-colors"
                    >
                      <td className="py-3 pr-3 font-semibold text-slate-100">
                        {sess.title}
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-300 tabular-nums">
                        {sess.time} ({sess.durationMin}m)
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1.5 text-emerald-300 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{sess.pitchOrVenue}</span>
                        </span>
                      </td>
                      <td className="py-3 px-2 text-slate-300">
                        {sess.squad} · {sess.coach}
                      </td>
                      <td className="py-3 px-2 font-mono text-slate-200 tabular-nums">
                        {sess.attendance}% ({sess.attendedCount}/
                        {sess.scheduledCount})
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={sess.status} />
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <button
                          onClick={() => onSelectSession(sess)}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
                        >
                          Inspect Logistics →
                        </button>
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
  );
};
