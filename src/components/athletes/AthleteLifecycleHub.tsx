import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Download,
  Dumbbell,
  FileCheck,
  FileText,
  Flame,
  HeartPulse,
  Lock,
  MapPin,
  Plus,
  RefreshCw,
  Shield,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Athlete, Injury, TrainingSession, UserRole, BodyRegionId } from '../../types/usi';
import { OperationalWorkflowsHub } from '../workflows/OperationalWorkflowsHub';
import { exportToCSV, exportToPDF } from '../../utils/exportEngine';

/* ==========================================================================
   LIFECYCLE EVENT BUS — Cross-Persona Notification System
   ========================================================================== */

export type LifecycleStage =
  | 'REGISTRATION_PENDING'
  | 'PENDING_APPROVAL'
  | 'PROFILE_INCOMPLETE'
  | 'COACH_UNASSIGNED'
  | 'ACTIVE_TRAINING'
  | 'LOAD_WARNING'
  | 'INJURED'
  | 'IN_REHABILITATION'
  | 'RTP_ACTIVE'
  | 'CLEARED';

export interface LifecycleEvent {
  id: string;
  timestamp: string;
  stage: LifecycleStage;
  actorRole: UserRole;
  actorName: string;
  action: string;
  detail: string;
  notifiedRoles: UserRole[];
  requiresActionFrom?: UserRole[];
  isRead: Record<UserRole, boolean>;
}

export interface AthleteLifecycleState {
  athleteId: string;
  currentStage: LifecycleStage;
  stageLabel: string;
  events: LifecycleEvent[];
  pendingActions: { role: UserRole; action: string; urgency: 'high' | 'medium' | 'low' }[];
}

const STAGE_META: Record<LifecycleStage, { label: string; color: string; icon: React.ReactNode; description: string }> = {
  REGISTRATION_PENDING:  { label: 'Registration Pending',  color: 'text-slate-400 bg-slate-800/50 border-slate-700',   icon: <UserPlus className="w-3.5 h-3.5" />,    description: 'Athlete has been submitted for federation enrollment' },
  PENDING_APPROVAL:      { label: 'Pending Admin Approval', color: 'text-amber-300 bg-amber-900/30 border-amber-600/40',  icon: <Shield className="w-3.5 h-3.5" />,      description: 'Federation Admin review and document verification required' },
  PROFILE_INCOMPLETE:    { label: 'Profile Incomplete',     color: 'text-sky-300 bg-sky-900/30 border-sky-600/40',        icon: <FileText className="w-3.5 h-3.5" />,    description: 'Athlete profile requires additional information' },
  COACH_UNASSIGNED:      { label: 'Coach Unassigned',       color: 'text-violet-300 bg-violet-900/30 border-violet-600/40', icon: <UserCheck className="w-3.5 h-3.5" />, description: 'Awaiting licensed coach assignment by Federation Admin' },
  ACTIVE_TRAINING:       { label: 'Active & Training',      color: 'text-emerald-300 bg-emerald-900/30 border-emerald-600/40', icon: <Activity className="w-3.5 h-3.5" />, description: 'Athlete is fully cleared and participating in all training' },
  LOAD_WARNING:          { label: 'Load Warning',           color: 'text-orange-300 bg-orange-900/30 border-orange-600/40', icon: <AlertTriangle className="w-3.5 h-3.5" />, description: 'ACWR exceeding safe envelope — monitoring required' },
  INJURED:               { label: 'Injured',                color: 'text-rose-300 bg-rose-900/30 border-rose-600/40',      icon: <AlertTriangle className="w-3.5 h-3.5" />, description: 'Active injury reported — training suspended' },
  IN_REHABILITATION:     { label: 'In Rehabilitation',      color: 'text-amber-300 bg-amber-900/30 border-amber-600/40',   icon: <Dumbbell className="w-3.5 h-3.5" />,    description: 'Athlete is in active rehabilitation protocol' },
  RTP_ACTIVE:            { label: 'RTP Protocol Active',    color: 'text-sky-300 bg-sky-900/30 border-sky-600/40',         icon: <TrendingUp className="w-3.5 h-3.5" />,  description: 'Return-to-Play gates in progress — stage clearance required' },
  CLEARED:               { label: 'Medically Cleared',      color: 'text-emerald-300 bg-emerald-900/30 border-emerald-600/40', icon: <CheckCircle2 className="w-3.5 h-3.5" />, description: 'All RTP gates passed — athlete cleared for full competition' },
};

/* ==========================================================================
   CROSS-PERSONA NOTIFICATION INBOX PANEL
   ========================================================================== */

interface NotificationInboxProps {
  selectedRole: UserRole;
  athleteLifecycleStates: AthleteLifecycleState[];
  athletes: Athlete[];
  onNavigateToAthlete: (athleteId: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const CrossPersonaNotificationInbox: React.FC<NotificationInboxProps> = ({
  selectedRole,
  athleteLifecycleStates,
  athletes,
  onNavigateToAthlete,
  onTriggerToast,
}) => {
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  // Filter pending actions relevant to this role
  const roleActions = useMemo(() => {
    const actions: { state: AthleteLifecycleState; athlete: Athlete | undefined; action: { role: UserRole; action: string; urgency: 'high' | 'medium' | 'low' } }[] = [];
    athleteLifecycleStates.forEach((state) => {
      state.pendingActions
        .filter((a) => a.role === selectedRole && !dismissed.has(`${state.athleteId}-${a.action}`))
        .forEach((action) => {
          actions.push({ state, athlete: athletes.find((a) => a.id === state.athleteId), action });
        });
    });
    return actions.sort((a, b) => (a.action.urgency === 'high' ? -1 : 1));
  }, [athleteLifecycleStates, selectedRole, athletes, dismissed]);

  if (roleActions.length === 0) return null;

  return (
    <div className="bg-[#0F1623] border border-amber-500/30 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-amber-300 uppercase tracking-wide">
            {selectedRole} Action Queue — {roleActions.length} Pending
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-500">Lifecycle Notifications</span>
      </div>

      <div className="space-y-2">
        {roleActions.slice(0, 5).map(({ state, athlete, action }, idx) => {
          const stageMeta = STAGE_META[state.currentStage];
          return (
            <div
              key={idx}
              className={`p-3 rounded-md border flex items-start justify-between gap-3 text-xs ${
                action.urgency === 'high'
                  ? 'bg-rose-950/20 border-rose-600/30'
                  : action.urgency === 'medium'
                  ? 'bg-amber-950/20 border-amber-600/30'
                  : 'bg-slate-900/60 border-slate-700/50'
              }`}
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold border ${stageMeta.color}`}>
                    {stageMeta.label}
                  </span>
                  {action.urgency === 'high' && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                      URGENT
                    </span>
                  )}
                </div>
                <div className="font-semibold text-slate-100">
                  {athlete?.name || 'Unknown Athlete'}
                  <span className="font-mono text-slate-400 ml-1.5 font-normal">({athlete?.athleteId})</span>
                </div>
                <p className="text-slate-400">{action.action}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => { onNavigateToAthlete(state.athleteId); onTriggerToast(`Opening ${athlete?.name}'s profile…`); }}
                  className="px-2.5 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-semibold text-[11px]"
                >
                  Act Now →
                </button>
                <button
                  onClick={() => {
                    setDismissed((prev) => new Set(prev).add(`${state.athleteId}-${action.action}`));
                    onTriggerToast('Notification dismissed');
                  }}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ==========================================================================
   ATHLETE LIFECYCLE TIMELINE — Full event history for a single athlete
   ========================================================================== */

interface AthleteLifecycleTimelineProps {
  lifecycleState: AthleteLifecycleState;
  athlete: Athlete;
  injuries: Injury[];
  sessions: TrainingSession[];
  selectedRole: UserRole;
  onOpenReportInjury: (region?: BodyRegionId, athleteId?: string) => void;
  onOpenSessionAssignment?: (athleteId?: string) => void;
  onOpenCreateRehab: (injury: Injury) => void;
  onOpenAdvanceRtp: (injury: Injury) => void;
  onTriggerToast: (msg: string) => void;
}

export const AthleteLifecycleTimeline: React.FC<AthleteLifecycleTimelineProps> = ({
  lifecycleState,
  athlete,
  injuries,
  sessions,
  selectedRole,
  onOpenReportInjury,
  onOpenSessionAssignment,
  onOpenCreateRehab,
  onOpenAdvanceRtp,
  onTriggerToast,
}) => {
  const stageMeta = STAGE_META[lifecycleState.currentStage];
  const activeInjuries = injuries.filter((i) => i.athleteId === athlete.id);
  const athleteSessions = sessions.filter((s) =>
    s.attendedAthletes?.includes(athlete.id) || s.squad === athlete.squad
  ).slice(0, 3);

  const canReportInjury = ['Physiotherapist', 'Performance Director', 'Sports Scientist'].includes(selectedRole);
  const canAdvanceRtp = ['Physiotherapist', 'Performance Director'].includes(selectedRole);
  const canManageRehab = ['Physiotherapist', 'Performance Director'].includes(selectedRole);

  return (
    <div className="space-y-4">
      {/* Current Stage Hero Banner */}
      <div className={`p-4 rounded-lg border flex items-center justify-between gap-4 ${stageMeta.color}`}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-full border ${stageMeta.color}`}>
            {stageMeta.icon}
          </div>
          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider opacity-70">Current Lifecycle Stage</div>
            <div className="text-sm font-bold">{stageMeta.label}</div>
            <div className="text-[11px] opacity-75 mt-0.5">{stageMeta.description}</div>
          </div>
        </div>
        <div className="text-right text-[11px] font-mono opacity-60 shrink-0">
          <div>Profile: {athlete.profileCompletion}% Complete</div>
          <div>Status: {athlete.trainingStatus}</div>
        </div>
      </div>

      {/* Profile Completion Checklist */}
      <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <FileCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 uppercase">Profile Completion Checklist</span>
          <span className="ml-auto font-mono text-xs text-sky-400">{athlete.profileCompletion}%</span>
        </div>
        <div className="space-y-2">
          {([
            { key: 'basicInfo',         label: 'Basic Information',          actor: 'Federation Admin' },
            { key: 'sportInfo',         label: 'Sport & Squad Assignment',   actor: 'Federation Admin' },
            { key: 'documents',         label: 'Compliance Documents',       actor: 'Federation Admin' },
            { key: 'coachAssignment',   label: 'Coach Assignment',           actor: 'Federation Admin' },
            { key: 'medicalClearance',  label: 'Medical Clearance (Physio)', actor: 'Physiotherapist' },
            { key: 'emergencyContact',  label: 'Emergency Contact',          actor: 'Athlete / Admin' },
          ] as const).map((item) => {
            const done = athlete.profileCompletionBreakdown?.[item.key] ?? false;
            return (
              <div key={item.key} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  {done
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    : <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />}
                  <span className={done ? 'text-slate-200' : 'text-slate-500'}>{item.label}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{item.actor}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Sessions Assigned */}
      {athleteSessions.length > 0 && (
        <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200 uppercase">Assigned Sessions</span>
          </div>
          <div className="space-y-2">
            {athleteSessions.map((sess) => (
              <div key={sess.id} className="flex items-center justify-between text-xs p-2.5 rounded bg-[#0F1623] border border-slate-800/80">
                <div>
                  <span className="font-semibold text-slate-100">{sess.title}</span>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3" />{sess.time}
                    <span className="text-slate-600">·</span>
                    <MapPin className="w-3 h-3 text-emerald-400" />{sess.pitchOrVenue}
                  </div>
                </div>
                <span className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                  sess.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' :
                  sess.status === 'In Progress' ? 'bg-sky-500/10 text-sky-300 border-sky-500/30' :
                  'bg-slate-800 text-slate-400 border-slate-700'
                }`}>{sess.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Injuries & Medical Actions */}
      {activeInjuries.length > 0 && (
        <div className="bg-[#090D16] border border-rose-500/20 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-xs font-bold text-rose-300 uppercase">Active Injury Cases</span>
          </div>
          {activeInjuries.map((inj) => (
            <div key={inj.id} className="p-3 rounded-md bg-[#0F1623] border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="font-bold text-slate-100">{inj.diagnosis}</span>
                  <span className="text-slate-400 ml-2">· {inj.bodyRegionDisplay}</span>
                </div>
                <span className="font-mono text-[10px] text-amber-300 shrink-0">Stage {inj.rtpStage}/5</span>
              </div>
              <div className="flex items-center gap-2">
                {/* RTP Progress */}
                <div className="flex-1 bg-slate-800 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all"
                    style={{ width: `${inj.rehabProgressPct}%` }}
                  />
                </div>
                <span className="font-mono text-[11px] text-sky-400">{inj.rehabProgressPct}%</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {canManageRehab && (
                  <button
                    onClick={() => onOpenCreateRehab(inj)}
                    className="px-2.5 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-semibold text-[11px]"
                  >
                    Log Rehab Session
                  </button>
                )}
                {canAdvanceRtp && inj.rtpStage < 5 && (
                  <button
                    onClick={() => onOpenAdvanceRtp(inj)}
                    className="px-2.5 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px]"
                  >
                    Advance RTP Gate →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Role-Gated Actions */}
      <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-xs font-bold text-slate-200 uppercase">Available Actions ({selectedRole})</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {canReportInjury && (
            <button
              onClick={() => onOpenReportInjury(undefined, athlete.id)}
              className="p-2.5 rounded-md border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/30 text-rose-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />Report Injury
            </button>
          )}
          {['Coach', 'Performance Director'].includes(selectedRole) && (
            <button
              onClick={() => {
                if (onOpenSessionAssignment) {
                  onOpenSessionAssignment(athlete.id);
                } else {
                  onTriggerToast(`Assigning session for ${athlete.name}`);
                }
              }}
              className="p-2.5 rounded-md border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/30 text-emerald-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />Assign Session
            </button>
          )}
          {selectedRole === 'Sports Scientist' && (
            <button
              onClick={() => onTriggerToast(`Load monitoring updated for ${athlete.name}`)}
              className="p-2.5 rounded-md border border-violet-500/30 bg-violet-950/20 hover:bg-violet-950/30 text-violet-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5" />Update Load
            </button>
          )}
          {selectedRole === 'Nutritionist' && (
            <button
              onClick={() => onTriggerToast(`Nutrition plan updated for ${athlete.name}`)}
              className="p-2.5 rounded-md border border-amber-500/30 bg-amber-950/20 hover:bg-amber-950/30 text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Flame className="w-3.5 h-3.5" />Update Nutrition
            </button>
          )}
          {selectedRole === 'Athlete' && (
            <button
              onClick={() => onTriggerToast('Wellness check-in submitted')}
              className="p-2.5 rounded-md border border-teal-500/30 bg-teal-950/20 hover:bg-teal-950/30 text-teal-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />Log Wellness
            </button>
          )}
          {selectedRole === 'Federation Admin' && (
            <button
              onClick={() => onTriggerToast(`Admin verification updated for ${athlete.name}`)}
              className="p-2.5 rounded-md border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/30 text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />Verify Status
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   MAIN ATHLETE LIFECYCLE HUB — Full orchestration view
   ========================================================================== */

interface AthleteLifecycleHubProps {
  athletes: Athlete[];
  injuries: Injury[];
  sessions: TrainingSession[];
  selectedRole: UserRole;
  onOpenOnboarding: () => void;
  onOpenApproval: (athlete: Athlete) => void;
  onOpenCoachAssignment: (athlete: Athlete) => void;
  onOpenAthlete360: (athlete: Athlete) => void;
  onOpenReportInjury: (region?: BodyRegionId, athleteId?: string) => void;
  onOpenSessionAssignment?: (athleteId?: string) => void;
  onOpenCreateRehab: (injury: Injury) => void;
  onOpenAdvanceRtp: (injury: Injury) => void;
  onNavigate: (nav: string) => void;
  onTriggerToast: (msg: string) => void;
}

const deriveLifecycleStage = (athlete: Athlete, injuries: Injury[]): LifecycleStage => {
  const activeInjuries = injuries.filter(
    (i) => i.athleteId === athlete.id && i.rtpStage < 5
  );

  if (activeInjuries.length > 0) {
    const maxStage = Math.max(...activeInjuries.map((i) => i.rtpStage));
    if (maxStage >= 3) return 'RTP_ACTIVE';
    if (maxStage >= 1) return 'IN_REHABILITATION';
    return 'INJURED';
  }

  if (athlete.trainingStatus === 'INJURED') return 'INJURED';
  if (athlete.trainingStatus === 'IN REHAB') return 'IN_REHABILITATION';

  if (athlete.verificationStatus === 'Pending') return 'PENDING_APPROVAL';
  if (!athlete.coach || athlete.coach === 'Unassigned') return 'COACH_UNASSIGNED';
  if ((athlete.profileCompletion || 0) < 100) return 'PROFILE_INCOMPLETE';
  if (athlete.acwr > 1.5) return 'LOAD_WARNING';

  return 'ACTIVE_TRAINING';
};

const buildPendingActions = (
  athlete: Athlete,
  stage: LifecycleStage
): { role: UserRole; action: string; urgency: 'high' | 'medium' | 'low' }[] => {
  const actions: { role: UserRole; action: string; urgency: 'high' | 'medium' | 'low' }[] = [];

  switch (stage) {
    case 'PENDING_APPROVAL':
      actions.push({ role: 'Federation Admin', action: `Review & approve registration for ${athlete.name}`, urgency: 'high' });
      actions.push({ role: 'Performance Director', action: `Sign off on ${athlete.name}'s enrollment`, urgency: 'medium' });
      break;
    case 'PROFILE_INCOMPLETE':
      actions.push({ role: 'Federation Admin', action: `Complete profile for ${athlete.name} (${athlete.profileCompletion}% done)`, urgency: 'medium' });
      if (!athlete.profileCompletionBreakdown?.medicalClearance) {
        actions.push({ role: 'Physiotherapist', action: `Perform initial medical screening for ${athlete.name}`, urgency: 'high' });
      }
      break;
    case 'COACH_UNASSIGNED':
      actions.push({ role: 'Federation Admin', action: `Assign a licensed coach to ${athlete.name}`, urgency: 'high' });
      break;
    case 'LOAD_WARNING':
      actions.push({ role: 'Sports Scientist', action: `${athlete.name} ACWR ${athlete.acwr} — review and reduce load`, urgency: 'high' });
      actions.push({ role: 'Coach', action: `Modify ${athlete.name}'s session load — ACWR spike detected`, urgency: 'high' });
      break;
    case 'INJURED':
      actions.push({ role: 'Physiotherapist', action: `Diagnose and document ${athlete.name}'s injury`, urgency: 'high' });
      actions.push({ role: 'Coach', action: `Remove ${athlete.name} from active training roster`, urgency: 'high' });
      actions.push({ role: 'Performance Director', action: `Review squad availability — ${athlete.name} unavailable`, urgency: 'medium' });
      break;
    case 'IN_REHABILITATION':
      actions.push({ role: 'Physiotherapist', action: `Log today's rehab session for ${athlete.name}`, urgency: 'medium' });
      actions.push({ role: 'Sports Scientist', action: `Monitor ${athlete.name}'s neuromuscular readiness`, urgency: 'medium' });
      break;
    case 'RTP_ACTIVE':
      actions.push({ role: 'Physiotherapist', action: `Review RTP gate criteria for ${athlete.name}`, urgency: 'high' });
      actions.push({ role: 'Performance Director', action: `Sign off on ${athlete.name}'s RTP clearance`, urgency: 'medium' });
      actions.push({ role: 'Coach', action: `Prepare modified reintegration plan for ${athlete.name}`, urgency: 'low' });
      break;
  }

  return actions;
};

export const AthleteLifecycleHub: React.FC<AthleteLifecycleHubProps> = ({
  athletes,
  injuries,
  sessions,
  selectedRole,
  onOpenOnboarding,
  onOpenApproval,
  onOpenCoachAssignment,
  onOpenAthlete360,
  onOpenReportInjury,
  onOpenSessionAssignment,
  onOpenCreateRehab,
  onOpenAdvanceRtp,
  onNavigate,
  onTriggerToast,
}) => {
  const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<LifecycleStage | 'ALL'>('ALL');
  const [activeTab, setActiveTab] = useState<'workflows' | 'overview' | 'lifecycle' | 'notifications'>('workflows');

  // Derive lifecycle state for all athletes
  const allLifecycleStates: AthleteLifecycleState[] = useMemo(() =>
    athletes.map((ath) => {
      const stage = deriveLifecycleStage(ath, injuries);
      return {
        athleteId: ath.id,
        currentStage: stage,
        stageLabel: STAGE_META[stage].label,
        events: [],
        pendingActions: buildPendingActions(ath, stage),
      };
    }),
    [athletes, injuries]
  );

  const filteredAthletes = useMemo(() => {
    return athletes.filter((ath) => {
      const matchSearch = !searchQuery || ath.name.toLowerCase().includes(searchQuery.toLowerCase()) || ath.athleteId.toLowerCase().includes(searchQuery.toLowerCase());
      const lifecycleState = allLifecycleStates.find((s) => s.athleteId === ath.id);
      const matchStage = stageFilter === 'ALL' || lifecycleState?.currentStage === stageFilter;
      return matchSearch && matchStage;
    });
  }, [athletes, searchQuery, stageFilter, allLifecycleStates]);

  const selectedAthlete = athletes.find((a) => a.id === selectedAthleteId) || null;
  const selectedLifecycleState = allLifecycleStates.find((s) => s.athleteId === selectedAthleteId) || null;
  const selectedAthleteInjuries = injuries.filter((i) => i.athleteId === selectedAthleteId);

  // Stage distribution summary
  const stageDistribution = useMemo(() => {
    const counts: Partial<Record<LifecycleStage, number>> = {};
    allLifecycleStates.forEach((s) => {
      counts[s.currentStage] = (counts[s.currentStage] || 0) + 1;
    });
    return counts;
  }, [allLifecycleStates]);

  // My notification count
  const myPendingCount = useMemo(() =>
    allLifecycleStates.reduce((acc, s) => acc + s.pendingActions.filter((a) => a.role === selectedRole).length, 0),
    [allLifecycleStates, selectedRole]
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <Users className="w-3.5 h-3.5" />
              <span>ATHLETE LIFECYCLE MANAGEMENT HUB</span>
            </div>
            <h1 className="text-lg font-bold text-slate-100 mt-1">
              End-to-End Athlete Journey — Registration to Competition
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Cross-persona orchestration: onboarding → approval → coach assignment → training → injury → RTP → clearance
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                const file = exportToCSV(
                  'usi_athlete_lifecycle_orchestration',
                  [
                    'Athlete ID',
                    'Name',
                    'Squad',
                    'Position',
                    'Lifecycle Stage',
                    'Readiness',
                    'ACWR',
                    'Medical Clearance',
                    'Pending Actions',
                  ],
                  allLifecycleStates.map((st) => {
                    const ath = athletes.find((a) => a.id === st.athleteId)!;
                    return [
                      ath.athleteId,
                      ath.name,
                      ath.squad,
                      ath.position,
                      st.stageLabel,
                      `${ath.readiness}%`,
                      ath.acwr.toFixed(2),
                      ath.medicalStatus,
                      st.pendingActions.map((p) => `${p.role}: ${p.action}`).join(' | ') || 'None',
                    ];
                  }),
                  [`USI End-to-End Athlete Lifecycle Matrix — Exported by ${selectedRole}`]
                );
                onTriggerToast(`Exported Athlete Lifecycle Matrix CSV (${file}) ✓`);
              }}
              className="px-3 py-1.5 rounded-md bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                const file = exportToPDF('usi_athlete_lifecycle_dossier', {
                  title: 'END-TO-END ATHLETE LIFECYCLE ORCHESTRATION DOSSIER',
                  subtitle: `Onboarding -> Approval -> Coach Assignment -> Training -> Injury -> RTP -> Clearance (${athletes.length} Athletes)`,
                  metadataPairs: [
                    { label: 'Exported By', value: selectedRole },
                    { label: 'Total Athletes', value: `${athletes.length} Profiles` },
                    { label: 'Pending Role Actions', value: `${myPendingCount} Actions for ${selectedRole}` },
                    { label: 'Active Injuries', value: `${injuries.length} Clinical Cases` },
                  ],
                  tableHeaders: ['ID', 'Athlete', 'Squad', 'Lifecycle Stage', 'Readiness', 'ACWR', 'Medical'],
                  tableRows: allLifecycleStates.map((st) => {
                    const ath = athletes.find((a) => a.id === st.athleteId)!;
                    return [
                      ath.athleteId,
                      ath.name,
                      ath.squad,
                      st.stageLabel,
                      `${ath.readiness}%`,
                      ath.acwr.toFixed(2),
                      ath.medicalStatus,
                    ];
                  }),
                });
                onTriggerToast(`Exported Athlete Lifecycle PDF Dossier (${file}) ✓`);
              }}
              className="px-3 py-1.5 rounded-md bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export PDF</span>
            </button>
            {myPendingCount > 0 && (
              <div className="px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                {myPendingCount} Action{myPendingCount !== 1 ? 's' : ''} Required
              </div>
            )}
            {['Federation Admin', 'Performance Director'].includes(selectedRole) && (
              <button
                onClick={onOpenOnboarding}
                className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Enroll New Athlete
              </button>
            )}
          </div>
        </div>

        {/* Stage Distribution Strip */}
        <div className="mt-4 grid grid-cols-3 sm:grid-cols-5 xl:grid-cols-10 gap-2">
          {(Object.entries(stageDistribution) as [LifecycleStage, number][]).map(([stage, count]) => {
            const meta = STAGE_META[stage];
            return (
              <button
                key={stage}
                onClick={() => setStageFilter(stageFilter === stage ? 'ALL' : stage)}
                className={`p-2 rounded-md border text-left transition-all ${
                  stageFilter === stage
                    ? meta.color + ' ring-1 ring-current'
                    : 'bg-[#090D16] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-lg font-mono font-bold text-slate-100">{count}</div>
                <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">{meta.label}</div>
              </button>
            );
          })}
          <button
            onClick={() => setStageFilter('ALL')}
            className={`p-2 rounded-md border text-left transition-all ${
              stageFilter === 'ALL'
                ? 'bg-sky-500/15 border-sky-500 text-sky-300'
                : 'bg-[#090D16] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-lg font-mono font-bold text-slate-100">{athletes.length}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">All Athletes</div>
          </button>
        </div>

        {/* Tab Nav */}
        <div className="flex items-center gap-1 mt-4 border-b border-slate-800">
          {([
            { id: 'workflows', label: '⚡ Role-Based Operational Workflows' },
            { id: 'overview', label: 'Squad Overview' },
            { id: 'lifecycle', label: 'Lifecycle Detail' },
            { id: 'notifications', label: `My Actions ${myPendingCount > 0 ? `(${myPendingCount})` : ''}` },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB: ROLE-BASED OPERATIONAL WORKFLOWS */}
      {activeTab === 'workflows' && (
        <OperationalWorkflowsHub
          athletes={athletes}
          injuries={injuries}
          sessions={sessions}
          selectedRole={selectedRole}
          onOpenOnboarding={onOpenOnboarding}
          onOpenApproval={onOpenApproval}
          onOpenCoachAssignment={onOpenCoachAssignment}
          onOpenAthlete360={onOpenAthlete360}
          onOpenReportInjury={onOpenReportInjury}
          onOpenSessionAssignment={onOpenSessionAssignment || (() => {})}
          onOpenCreateRehab={onOpenCreateRehab}
          onOpenAdvanceRtp={onOpenAdvanceRtp}
          onNavigate={onNavigate}
          onTriggerToast={onTriggerToast}
        />
      )}

      {/* TAB: SQUAD OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Athlete List */}
          <div className="lg:col-span-5 bg-[#0F1623] border border-slate-800 rounded-lg flex flex-col">
            <div className="p-4 border-b border-slate-800 space-y-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or ID…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded bg-[#090D16] border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500"
                />
                <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-800/70" style={{ maxHeight: '520px' }}>
              {filteredAthletes.map((ath) => {
                const ls = allLifecycleStates.find((s) => s.athleteId === ath.id);
                const stageMeta = ls ? STAGE_META[ls.currentStage] : null;
                const pendingForMe = ls?.pendingActions.filter((a) => a.role === selectedRole).length || 0;
                const isSelected = selectedAthleteId === ath.id;

                return (
                  <button
                    key={ath.id}
                    onClick={() => { setSelectedAthleteId(ath.id); setActiveTab('lifecycle'); }}
                    className={`w-full p-3.5 text-left transition-colors flex items-center justify-between gap-3 ${
                      isSelected ? 'bg-sky-500/10' : 'hover:bg-[#151E2E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        ls?.currentStage === 'INJURED' || ls?.currentStage === 'IN_REHABILITATION' ? 'bg-rose-500/20 text-rose-300' :
                        ls?.currentStage === 'ACTIVE_TRAINING' ? 'bg-emerald-500/20 text-emerald-300' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {ath.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-100">{ath.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{ath.athleteId} · {ath.position}</div>
                        {stageMeta && (
                          <div className={`text-[10px] font-mono font-bold mt-0.5 ${stageMeta.color.split(' ')[0]}`}>
                            {stageMeta.label}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {pendingForMe > 0 && (
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                          {pendingForMe}
                        </span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                    </div>
                  </button>
                );
              })}
              {filteredAthletes.length === 0 && (
                <div className="p-8 text-center text-slate-500 text-xs">No athletes match current filter</div>
              )}
            </div>
          </div>

          {/* Right: Quick Stats */}
          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Active & Training', value: stageDistribution['ACTIVE_TRAINING'] || 0, color: 'text-emerald-400' },
                { label: 'Injured / Rehab', value: (stageDistribution['INJURED'] || 0) + (stageDistribution['IN_REHABILITATION'] || 0), color: 'text-rose-400' },
                { label: 'RTP Active', value: stageDistribution['RTP_ACTIVE'] || 0, color: 'text-sky-400' },
                { label: 'Pending Admin', value: (stageDistribution['PENDING_APPROVAL'] || 0) + (stageDistribution['COACH_UNASSIGNED'] || 0), color: 'text-amber-400' },
              ].map((s, i) => (
                <div key={i} className="p-4 bg-[#0F1623] border border-slate-800 rounded-lg">
                  <div className="text-xs text-slate-400">{s.label}</div>
                  <div className={`text-2xl font-mono font-bold mt-1 ${s.color}`}>{s.value}</div>
                  <div className="text-[11px] text-slate-500 mt-1">of {athletes.length} athletes</div>
                </div>
              ))}
            </div>

            {/* Lifecycle Flow Diagram */}
            <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase">Lifecycle Flow</div>
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {([
                  'REGISTRATION_PENDING',
                  'PENDING_APPROVAL',
                  'PROFILE_INCOMPLETE',
                  'COACH_UNASSIGNED',
                  'ACTIVE_TRAINING',
                  'LOAD_WARNING',
                  'INJURED',
                  'IN_REHABILITATION',
                  'RTP_ACTIVE',
                  'CLEARED',
                ] as LifecycleStage[]).map((stage, idx, arr) => {
                  const meta = STAGE_META[stage];
                  return (
                    <React.Fragment key={stage}>
                      <div className={`px-2 py-1 rounded border font-mono font-bold ${meta.color}`}>
                        {meta.label}
                      </div>
                      {idx < arr.length - 1 && (
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400">
                Each stage triggers role-specific notifications and required actions across Federation Admin, Coach, Sports Scientist, Physiotherapist, Nutritionist, and Performance Director.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB: LIFECYCLE DETAIL */}
      {activeTab === 'lifecycle' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Athlete selector */}
          <div className="lg:col-span-4 bg-[#0F1623] border border-slate-800 rounded-lg overflow-hidden">
            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search athlete…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-7 pr-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500"
                />
                <Users className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              </div>
            </div>
            <div className="overflow-y-auto divide-y divide-slate-800/60" style={{ maxHeight: '560px' }}>
              {filteredAthletes.map((ath) => {
                const ls = allLifecycleStates.find((s) => s.athleteId === ath.id);
                const meta = ls ? STAGE_META[ls.currentStage] : null;
                const pending = ls?.pendingActions.filter((a) => a.role === selectedRole).length || 0;
                return (
                  <button
                    key={ath.id}
                    onClick={() => setSelectedAthleteId(ath.id)}
                    className={`w-full px-3.5 py-3 text-left transition-colors ${
                      selectedAthleteId === ath.id ? 'bg-sky-500/10 border-l-2 border-sky-500' : 'hover:bg-[#151E2E] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-100">{ath.name}</span>
                      {pending > 0 && (
                        <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">{pending}</span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{ath.athleteId} · {ath.squad}</div>
                    {meta && (
                      <div className={`text-[10px] font-mono font-bold mt-1 ${meta.color.split(' ')[0]}`}>{meta.label}</div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Detail */}
          <div className="lg:col-span-8">
            {selectedAthlete && selectedLifecycleState ? (
              <div className="space-y-4">
                {/* Athlete Header */}
                <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sm font-bold text-sky-300">
                      {selectedAthlete.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-100">{selectedAthlete.name}</div>
                      <div className="text-xs font-mono text-slate-400">{selectedAthlete.athleteId} · {selectedAthlete.sport} · {selectedAthlete.position}</div>
                      <div className="text-[11px] text-slate-500">Coach: {selectedAthlete.coach || 'Unassigned'}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onOpenAthlete360(selectedAthlete)}
                      className="px-3 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold"
                    >
                      Open Athlete 360 →
                    </button>
                    {['Federation Admin', 'Performance Director'].includes(selectedRole) && (
                      <>
                        {selectedAthlete.verificationStatus !== 'Verified' && (
                          <button
                            onClick={() => onOpenApproval(selectedAthlete)}
                            className="px-3 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-semibold"
                          >
                            Review Approval
                          </button>
                        )}
                        <button
                          onClick={() => onOpenCoachAssignment(selectedAthlete)}
                          className="px-3 py-1.5 rounded bg-violet-500/15 hover:bg-violet-500/25 border border-violet-500/30 text-violet-300 text-xs font-semibold"
                        >
                          Assign Coach
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <AthleteLifecycleTimeline
                  lifecycleState={selectedLifecycleState}
                  athlete={selectedAthlete}
                  injuries={injuries}
                  sessions={sessions}
                  selectedRole={selectedRole}
                  onOpenReportInjury={onOpenReportInjury}
                  onOpenSessionAssignment={onOpenSessionAssignment}
                  onOpenCreateRehab={onOpenCreateRehab}
                  onOpenAdvanceRtp={onOpenAdvanceRtp}
                  onTriggerToast={onTriggerToast}
                />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-[#0F1623] border border-slate-800 rounded-lg p-12 text-center">
                <div className="space-y-2">
                  <Users className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-slate-400 text-sm">Select an athlete to view their lifecycle detail</p>
                  <p className="text-slate-500 text-xs">Registration → Approval → Training → Injury → RTP</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB: MY NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="space-y-4">
          <CrossPersonaNotificationInbox
            selectedRole={selectedRole}
            athleteLifecycleStates={allLifecycleStates}
            athletes={athletes}
            onNavigateToAthlete={(athleteId) => {
              setSelectedAthleteId(athleteId);
              setActiveTab('lifecycle');
            }}
            onTriggerToast={onTriggerToast}
          />
          {myPendingCount === 0 && (
            <div className="text-center py-12 text-slate-500 text-sm">
              <CheckCircle2 className="w-8 h-8 text-emerald-500/50 mx-auto mb-2" />
              No pending actions for {selectedRole}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
