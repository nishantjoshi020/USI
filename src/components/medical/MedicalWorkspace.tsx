import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Dumbbell,
  Eye,
  Filter,
  HeartPulse,
  Lock,
  Plus,
  Search,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import {
  Athlete,
  BodyRegionId,
  Injury,
  MedicalOperationalAlert,
  MedicalRiskAlertItem,
  NavItemId,
  RehabPlanRecord,
  UserRole,
  WellnessProfile,
} from '../../types/usi';
import {
  ALL_BODY_REGIONS,
  INJURY_30D_TREND,
} from '../../data/medicalMockData';
import { InteractiveBodyMap } from './InteractiveBodyMap';
import { MedicalStatusBadge } from '../ui/Badges';

export type MedicalSubTab =
  | 'injury-intelligence'
  | 'injury-register'
  | 'rehabilitation'
  | 'return-to-play';

export type AiMedicalCopilotMode =
  | 'explain-risk'
  | 'summarize-rehab'
  | 'evaluate-rtp'
  | 'suggest-modification';

interface MedicalWorkspaceProps {
  activeSubTab: MedicalSubTab;
  onSelectSubTab: (tab: MedicalSubTab) => void;
  selectedRole: UserRole;
  athletes: Athlete[];
  injuries: Injury[];
  rehabPlans: RehabPlanRecord[];
  riskAlerts: MedicalRiskAlertItem[];
  medicalAlerts: MedicalOperationalAlert[];
  wellnessProfile: WellnessProfile;
  activeAthleteId?: string;
  onSelectInjuryDrawer: (injury: Injury) => void;
  onOpenReportInjuryModal: (initialRegion?: BodyRegionId) => void;
  onOpenCreateRehabSession: (injury: Injury) => void;
  onOpenAdvanceRtpModal: (injury: Injury) => void;
  onUpdateInjury: (
    injuryId: string,
    updates: Partial<Injury>,
    auditAction: string,
    toastMsg: string
  ) => void;
  onUpdateRehabProgress: (
    planId: string,
    newPct: number,
    toastMsg: string
  ) => void;
  onUpdateRiskAlert: (
    alertId: string,
    updates: Partial<MedicalRiskAlertItem>,
    toastMsg: string
  ) => void;
  onAcknowledgeMedicalAlert: (alert: MedicalOperationalAlert) => void;
  onUpdateWellness: (updates: Partial<WellnessProfile>) => void;
  onOpenAthlete360: (athleteId: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const MedicalWorkspace: React.FC<MedicalWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  selectedRole,
  athletes,
  injuries,
  rehabPlans,
  riskAlerts,
  medicalAlerts,
  wellnessProfile,
  activeAthleteId,
  onSelectInjuryDrawer,
  onOpenReportInjuryModal,
  onOpenCreateRehabSession,
  onOpenAdvanceRtpModal,
  onUpdateInjury,
  onUpdateRehabProgress,
  onUpdateRiskAlert,
  onAcknowledgeMedicalAlert,
  onUpdateWellness,
  onOpenAthlete360,
  onTriggerToast,
}) => {
  // Interactive Body Map state
  const [selectedRegion, setSelectedRegion] =
    useState<BodyRegionId>('Hamstring — Left');
  const [bodyMapScope, setBodyMapScope] = useState<'squad' | 'athlete'>('squad');
  const [bodyMapAthleteId, setBodyMapAthleteId] =
    useState<string>(activeAthleteId || athletes[0]?.id || 'ath-arjun-mehta');

  useEffect(() => {
    if (activeAthleteId) {
      setBodyMapAthleteId(activeAthleteId);
    }
  }, [activeAthleteId]);

  // Top KPI Filter State (Clicking a KPI filters the Injury Register)
  const [activeKpiFilter, setActiveKpiFilter] = useState<string | null>(null);

  // Section 3 & 7 Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [squadFilter, setSquadFilter] = useState('All');
  const [injuryTypeFilter, setInjuryTypeFilter] = useState('All');
  const [bodyRegionFilter, setBodyRegionFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateRangeFilter, setDateRangeFilter] = useState('Last 30 Days');

  // Rehab Selected Plan & Stage Inspector State
  const [selectedRehabPlanId, setSelectedRehabPlanId] =
    useState<string>('rehab-arjun');
  const [selectedRehabStageNum, setSelectedRehabStageNum] = useState<number>(3);

  // Dismiss Risk Alert Modal State
  const [dismissModalAlertId, setDismissModalAlertId] = useState<string | null>(
    null
  );
  const [dismissReasonText, setDismissReasonText] = useState(
    'Cleared by morning force-plate isometric symmetry test (93%) and clinician palpation.'
  );

  // AI Copilot in Medical Context State
  const [activeCopilotMode, setActiveCopilotMode] =
    useState<AiMedicalCopilotMode>('summarize-rehab');

  // Filtered Injuries for Landscape & Register
  const filteredInjuries = useMemo(() => {
    let sourceInjuries = injuries;
    if (selectedRole === 'Athlete') {
      sourceInjuries = injuries.filter(
        (inj) =>
          inj.athleteId === 'ath-1042' ||
          inj.athleteName.toLowerCase().includes('arjun') ||
          inj.athleteId === athletes[0]?.id
      );
    }

    return sourceInjuries.filter((inj) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          inj.athleteName.toLowerCase().includes(q) ||
          inj.injuryTitle.toLowerCase().includes(q) ||
          inj.diagnosis.toLowerCase().includes(q) ||
          inj.bodyRegionDisplay.toLowerCase().includes(q);
        if (!match) return false;
      }
      if (sportFilter !== 'All' && inj.sport !== sportFilter) return false;
      if (squadFilter !== 'All' && inj.squad !== squadFilter) return false;
      if (injuryTypeFilter !== 'All' && inj.bodyPart !== injuryTypeFilter)
        return false;
      if (bodyRegionFilter !== 'All' && inj.bodyRegion !== bodyRegionFilter)
        return false;
      if (severityFilter !== 'All' && inj.severity !== severityFilter)
        return false;
      if (statusFilter !== 'All' && inj.stage !== statusFilter) return false;

      // Top KPI filter
      if (activeKpiFilter === 'in-rehab') {
        return (
          inj.stage === 'Rehabilitation' || inj.stage === 'In Rehabilitation'
        );
      }
      if (activeKpiFilter === 'rtp') {
        return inj.rtpStage >= 3 || inj.stage === 'Recovery';
      }
      if (activeKpiFilter === 'clearance-pending') {
        return inj.medicalStatus !== 'Cleared';
      }
      if (activeKpiFilter === 'escalated') {
        return inj.severity === 'Severe' || inj.stage === 'Escalated';
      }
      return true;
    });
  }, [
    injuries,
    searchQuery,
    sportFilter,
    squadFilter,
    injuryTypeFilter,
    bodyRegionFilter,
    severityFilter,
    statusFilter,
    activeKpiFilter,
  ]);

  // Body map injuries (Squad vs Athlete-Specific)
  const bodyMapInjuries = useMemo(() => {
    if (bodyMapScope === 'squad') return filteredInjuries;
    return injuries.filter((i) => i.athleteId === bodyMapAthleteId);
  }, [bodyMapScope, filteredInjuries, injuries, bodyMapAthleteId]);

  const bodyMapAthlete =
    athletes.find((a) => a.id === bodyMapAthleteId) || athletes[0];

  const activeRehabPlan =
    rehabPlans.find((p) => p.id === selectedRehabPlanId) || rehabPlans[0];
  const activeRehabInjury =
    injuries.find((i) => i.id === activeRehabPlan?.injuryId) || injuries[0];

  const handleKpiClick = (kpiId: string, label: string) => {
    if (activeKpiFilter === kpiId) {
      setActiveKpiFilter(null);
      onTriggerToast('Cleared Medical KPI filter — Showing all 4 cases');
    } else {
      setActiveKpiFilter(kpiId);
      onTriggerToast(`Filtered Injury Register to: ${label}`);
      document
        .getElementById('medical-injury-register-section')
        ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  // Role-Based Governance Banner (Section 21)
  const getRoleGovernanceMeta = (role: UserRole) => {
    switch (role) {
      case 'Physiotherapist':
      case 'Performance Director':
        return {
          badge: 'Physiotherapist / Doctor Authority',
          access: 'Full medical access · Clinical notes, RTP Gate & Override unlocked',
          color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
        };
      case 'Coach':
        return {
          badge: 'Coach View',
          access: 'Injury status, training restrictions & RTP stage visibility',
          color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
        };
      case 'Sports Scientist':
        return {
          badge: 'Sports Scientist View',
          access: 'Workload + recovery + injury risk correlation access',
          color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
        };
      case 'Federation Admin':
        return {
          badge: 'Admin Summary Governance',
          access: 'Summary only — Confidential clinical notes masked',
          color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
        };
      default:
        return {
          badge: `${role} View`,
          access: 'Operational injury status & recovery coordination',
          color: 'text-sky-400 border-sky-500/30 bg-sky-500/10',
        };
    }
  };

  const roleGov = getRoleGovernanceMeta(selectedRole);

  // AI Copilot Content Generator (Section 22)
  const getCopilotNarrative = (mode: AiMedicalCopilotMode) => {
    switch (mode) {
      case 'summarize-rehab':
        return {
          title: 'Rehabilitation Progression Summary — Arjun Mehta',
          output:
            '"Arjun Mehta is progressing well through Stage 3 rehabilitation (68%). Pain remains controlled at 3/10, and strength symmetry has reached 91%. Recommend completing full-speed running tolerance testing and final medical review before advancing to full training."',
          metrics: [
            'Current Stage: Stage 3/5 (Sport-Specific Training)',
            'Pain VAS: 3/10 (Controlled during linear acceleration)',
            'Nordic Eccentric Force Symmetry: 91% (Target ≥ 90%)',
          ],
          actionLabel: 'Open Arjun Mehta RTP Gate Check',
        };
      case 'explain-risk':
        return {
          title: 'Injury Risk Explanation — Senior & U23 Squads',
          output:
            '"Elevated posterior-chain risk detected in Arjun Mehta (High Risk) driven by a +22% acute workload spike, -14% HRV suppression, 5/10 subjective soreness, and prior left hamstring Grade II history. Kabir Rao (Moderate Risk) shows 4 consecutive sessions of elevated shoulder contact load."',
          metrics: [
            'Arjun Mehta ACWR: 1.24 · Sleep: 6/10 · Fatigue: 7/10',
            'Kabir Rao: 4 consecutive upper-body contact sessions',
            'Neeraj Patel: Escalated right hamstring tightness (5/10 pain)',
          ],
          actionLabel: 'Apply High-Speed Running Cap for Arjun Mehta',
        };
      case 'evaluate-rtp':
        return {
          title: 'Return-to-Play Gate Readiness Evaluation',
          output:
            '"Arjun Mehta has satisfied 4 of 5 Stage 3 exit gates (Pain ≤ 2/10 post-session, Strength Symmetry 91%, Running Tolerance verified, Functional Test complete). Only formal Chief Medical Officer Clearance remains pending. Rahul Singh (Right Ankle) has met 5/5 gates and is ready for Stage 5 Return to Competition."',
          metrics: [
            'Arjun Mehta: 4/5 Gates Complete (Medical Clearance Pending)',
            'Rahul Singh: 5/5 Gates Complete (Ready to Advance)',
            'Kabir Rao: 1/5 Gates Complete (Stage 2 Strength Restoration)',
          ],
          actionLabel: 'Evaluate RTP Gate Criteria',
        };
      case 'suggest-modification':
        return {
          title: 'AI Training Modification Prescription (Advisory)',
          output:
            '"Recommend capping Arjun Mehta at 85% Vmax during tomorrow\'s speed exposure and substituting the final 2 flying 30m reps with assisted Nordic eccentric lowers. For Kabir Rao, substitute contested overhead grapple drills with closed-chain scapular stability work."',
          metrics: [
            'Arjun Mehta: Cap velocity ≤ 85% Vmax · Zero maximal sprinting',
            'Kabir Rao: Non-contact tactical channels only',
            'Projected Tissue Overload Reduction: -34% over next 72h',
          ],
          actionLabel: 'Log Training Modification to Athlete Records',
        };
    }
  };

  const copilotData = getCopilotNarrative(activeCopilotMode);

  // Reusable Injury Register Table Component
  const renderInjuryRegisterTable = () => (
    <div
      id="medical-injury-register-section"
      className="bg-[#0F1623] border border-slate-800/90 rounded-lg overflow-hidden"
    >
      <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
              INJURY REGISTER
            </h3>
            <span className="px-2 py-0.5 rounded bg-slate-800 text-xs font-mono text-sky-400">
              {filteredInjuries.length} Cases
            </span>
            {activeKpiFilter && (
              <button
                onClick={() => setActiveKpiFilter(null)}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/20 border border-sky-500/40 text-[11px] text-sky-300"
              >
                <span>KPI Filter: {activeKpiFilter}</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Track reported injuries, clinical assessments, rehabilitation progress and medical clearance. Click any row to open the Injury Detail Drawer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search athlete, diagnosis, region..."
              className="pl-8 pr-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-xs text-slate-100 w-56"
            />
          </div>
          <button
            onClick={() => onOpenReportInjuryModal(selectedRegion)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Report Injury</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-[#0B101B] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Athlete</th>
              <th className="py-2.5 px-2.5">Sport</th>
              <th className="py-2.5 px-2.5">Position</th>
              <th className="py-2.5 px-2.5">Squad</th>
              <th className="py-2.5 px-3">Injury</th>
              <th className="py-2.5 px-3">Body Region</th>
              <th className="py-2.5 px-2">Side</th>
              <th className="py-2.5 px-2.5">Severity</th>
              <th className="py-2.5 px-2">Pain</th>
              <th className="py-2.5 px-2.5">Status</th>
              <th className="py-2.5 px-2.5">RTP Stage</th>
              <th className="py-2.5 px-2.5">Medical Status</th>
              <th className="py-2.5 px-2.5">Last Updated</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {filteredInjuries.map((inj) => (
              <tr
                key={inj.id}
                onClick={() => onSelectInjuryDrawer(inj)}
                className="hover:bg-[#141D2E] cursor-pointer transition-colors"
              >
                <td className="py-3 px-3 font-semibold text-slate-100 whitespace-nowrap">
                  {inj.athleteName}
                </td>
                <td className="py-3 px-2.5 text-slate-300">{inj.sport}</td>
                <td className="py-3 px-2.5 text-slate-300">{inj.position}</td>
                <td className="py-3 px-2.5 text-slate-300">{inj.squad}</td>
                <td className="py-3 px-3 font-medium text-slate-100">
                  {inj.injuryTitle}
                </td>
                <td className="py-3 px-3 text-sky-300 font-medium">
                  {inj.bodyRegionDisplay}
                </td>
                <td className="py-3 px-2 font-mono text-slate-300">
                  {inj.side}
                </td>
                <td className="py-3 px-2.5">
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold border ${
                      inj.severity === 'Severe' || inj.severity === 'Critical'
                        ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                        : inj.severity === 'Moderate'
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                          : 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                    }`}
                  >
                    {inj.severity}
                  </span>
                </td>
                <td className="py-3 px-2 font-mono font-bold text-slate-100 tabular-nums">
                  {inj.painScore}/10
                </td>
                <td className="py-3 px-2.5">
                  <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-medium">
                    {inj.stage}
                  </span>
                </td>
                <td className="py-3 px-2.5 font-mono text-sky-400 whitespace-nowrap">
                  Stage {inj.rtpStage}/5
                </td>
                <td className="py-3 px-2.5">
                  <MedicalStatusBadge status={inj.medicalStatus} />
                </td>
                <td className="py-3 px-2.5 font-mono text-slate-400 whitespace-nowrap">
                  {inj.lastUpdated}
                </td>
                <td
                  className="py-3 px-3 text-right whitespace-nowrap"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectInjuryDrawer(inj)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                    >
                      Clinical File
                    </button>
                    <button
                      onClick={() => onOpenAdvanceRtpModal(inj)}
                      className="px-2 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-semibold"
                    >
                      RTP Gate
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* 2. MEDICAL COMMAND CENTER HEADER & SUB-NAVIGATION */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
              <HeartPulse className="w-4 h-4" />
              <span>USI HIGH-PERFORMANCE MEDICAL & INJURY OPERATIONS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1 uppercase">
              {activeSubTab === 'injury-intelligence'
                ? 'MEDICAL & INJURY INTELLIGENCE'
                : activeSubTab === 'injury-register'
                  ? 'INJURY REGISTER'
                  : activeSubTab === 'rehabilitation'
                    ? 'REHABILITATION'
                    : 'RETURN TO PLAY'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeSubTab === 'injury-intelligence'
                ? 'Monitor athlete health status, injuries, rehabilitation and return-to-play progression.'
                : activeSubTab === 'injury-register'
                  ? 'Track reported injuries, clinical assessments, rehabilitation progress and medical clearance.'
                  : activeSubTab === 'rehabilitation'
                    ? 'Manage structured rehabilitation plans, exercises, milestones and recovery progression.'
                    : 'Track readiness criteria, functional testing and medical clearance before full return.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* 21. ROLE-BASED GOVERNANCE BADGE */}
            <div
              className={`px-3 py-1.5 rounded-md border text-xs flex items-center gap-2 ${roleGov.color}`}
            >
              <Lock className="w-3.5 h-3.5 shrink-0" />
              <div>
                <div className="font-bold leading-tight">{roleGov.badge}</div>
                <div className="text-[10px] opacity-90">{roleGov.access}</div>
              </div>
            </div>

            <button
              onClick={() => onOpenReportInjuryModal(selectedRegion)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Report Injury</span>
            </button>
          </div>
        </div>

        {/* 1. MEDICAL MODULE SUB-NAVIGATION TABS */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                {
                  id: 'injury-intelligence',
                  label: 'Injury Intelligence',
                  route: '/medical/injury-intelligence',
                },
                {
                  id: 'injury-register',
                  label: 'Injury Register',
                  route: '/medical/injuries',
                  badge: injuries.length,
                },
                {
                  id: 'rehabilitation',
                  label: 'Rehabilitation',
                  route: '/medical/rehab',
                  badge: rehabPlans.length,
                },
                {
                  id: 'return-to-play',
                  label: 'Return to Play',
                  route: '/medical/return-to-play',
                  badge: injuries.filter(
                    (i) => i.rtpStage >= 3 || i.stage === 'Recovery'
                  ).length,
                },
              ] as const
            ).map((tab) => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectSubTab(tab.id)}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold flex items-center gap-2 transition-colors ${
                    active
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-[#090D16] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  {'badge' in tab && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-200">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>Clinical Workflow:</span>
            <span className="text-slate-300">
              Detection → Reporting → Assessment → Rehab → Testing → RTP Gate → Clearance
            </span>
          </div>
        </div>
      </div>

      {/* 2. TOP 6 CLICKABLE MEDICAL KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {(() => {
          const inRehabList = injuries.filter(
            (i) =>
              i.stage === 'Rehabilitation' ||
              i.stage === 'In Rehabilitation' ||
              rehabPlans.some((p) => p.injuryId === i.id)
          );
          const rtpList = injuries.filter(
            (i) => i.rtpStage >= 3 || i.stage === 'Recovery'
          );
          const clearancePendingList = injuries.filter(
            (i) => i.medicalStatus !== 'Cleared'
          );
          const escalatedList = injuries.filter(
            (i) =>
              i.severity === 'Severe' ||
              i.severity === 'Critical' ||
              i.stage === 'Escalated'
          );
          const avgProgress =
            rehabPlans.length > 0
              ? Math.round(
                  rehabPlans.reduce((acc, p) => acc + p.progressPct, 0) /
                    rehabPlans.length
                )
              : 68;
          const bodyPartSummary = Array.from(
            new Set(injuries.map((i) => i.bodyPart))
          )
            .map(
              (bp) =>
                `${bp} (${injuries.filter((i) => i.bodyPart === bp).length})`
            )
            .join(', ');

          return [
            {
              id: 'active',
              label: 'Active Injuries',
              value: String(injuries.length),
              sub: bodyPartSummary || 'No active injuries',
              accent: 'text-rose-400',
            },
            {
              id: 'in-rehab',
              label: 'In Rehabilitation',
              value: String(inRehabList.length),
              sub:
                inRehabList.map((i) => i.athleteName).join(' · ') ||
                'None active',
              accent: 'text-amber-400',
            },
            {
              id: 'rtp',
              label: 'Return-to-Play',
              value: String(rtpList.length),
              sub:
                rtpList
                  .map((i) => `${i.athleteName} (Stage ${i.rtpStage}/5)`)
                  .join(' · ') || 'None in RTP',
              accent: 'text-sky-400',
            },
            {
              id: 'clearance-pending',
              label: 'Medical Clearance Pending',
              value: String(clearancePendingList.length),
              sub:
                clearancePendingList.map((i) => i.athleteName).join(' · ') ||
                'All cleared',
              accent: 'text-amber-300',
            },
            {
              id: 'escalated',
              label: 'Escalated Cases',
              value: String(escalatedList.length),
              sub:
                escalatedList
                  .map((i) => `${i.athleteName} (${i.severity})`)
                  .join(' · ') || 'Zero escalated',
              accent: 'text-rose-400',
            },
            {
              id: 'avg-progress',
              label: 'Average Rehab Progress',
              value: `${avgProgress}%`,
              sub: `${rehabPlans.length} active rehab plans`,
              accent: 'text-emerald-400',
            },
          ];
        })().map((kpi) => {
          const isSelected = activeKpiFilter === kpi.id;
          return (
            <button
              key={kpi.id}
              onClick={() => handleKpiClick(kpi.id, kpi.label)}
              className={`p-4 rounded-lg border text-left transition-all ${
                isSelected
                  ? 'bg-sky-500/15 border-sky-400 shadow-md'
                  : 'bg-[#0F1623] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div className="text-[11px] font-medium text-slate-400 flex items-center justify-between">
                <span>{kpi.label}</span>
                {isSelected && (
                  <span className="text-[10px] font-mono text-sky-400">
                    Filtered
                  </span>
                )}
              </div>
              <div
                className={`text-2xl font-bold font-mono tabular-nums mt-1 ${kpi.accent}`}
              >
                {kpi.value}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 truncate">
                {kpi.sub}
              </div>
            </button>
          );
        })}
      </div>

      {/* =========================================================
       * TAB 1: INJURY INTELLIGENCE (DEFAULT MEDICAL COMMAND CENTER)
       * ========================================================= */}
      {activeSubTab === 'injury-intelligence' && (
        <>
          {/* 3. CURRENT INJURY LANDSCAPE + FILTERS */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                  CURRENT INJURY LANDSCAPE
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Interactive pathology distribution, severity breakdown, and 30-day incidence telemetry
                </p>
              </div>

              {/* 7 Interactive Filters matching Section 3 */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Sport: All</option>
                  <option value="Football">Football</option>
                </select>

                <select
                  value={squadFilter}
                  onChange={(e) => setSquadFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Squad: All</option>
                  <option value="Senior">Senior</option>
                  <option value="U23">U23</option>
                </select>

                <select
                  value={injuryTypeFilter}
                  onChange={(e) => setInjuryTypeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Injury Type: All</option>
                  <option value="Hamstring">Hamstring</option>
                  <option value="Ankle">Ankle</option>
                  <option value="Shoulder">Shoulder</option>
                </select>

                <select
                  value={bodyRegionFilter}
                  onChange={(e) => setBodyRegionFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Body Region: All</option>
                  <option value="Hamstring — Left">Left Hamstring</option>
                  <option value="Hamstring — Right">Right Hamstring</option>
                  <option value="Ankle — Right">Right Ankle</option>
                  <option value="Shoulder — Right">Right Shoulder</option>
                </select>

                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Severity: All</option>
                  <option value="Critical">Critical</option>
                  <option value="Severe">Severe</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Minor">Minor</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Status: All</option>
                  <option value="Rehabilitation">Rehabilitation</option>
                  <option value="Recovery">Recovery</option>
                  <option value="Assessment">Assessment</option>
                  <option value="Monitoring">Monitoring</option>
                </select>

                <select
                  value={dateRangeFilter}
                  onChange={(e) => setDateRangeFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="Last 30 Days">Date Range: 30 Days</option>
                  <option value="Last 14 Days">Last 14 Days</option>
                  <option value="Season to Date">Season to Date</option>
                </select>
              </div>
            </div>

            {/* 3-Column Landscape Breakdown: Injury Distribution | Severity | 30-Day Trend */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Injury Distribution */}
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200 uppercase">
                  Injury Distribution (By Pathology)
                </div>
                {Array.from(
                  new Set([
                    'Hamstring',
                    'Ankle',
                    'Shoulder',
                    ...filteredInjuries.map((i) => i.bodyPart),
                  ])
                ).map((bodyPart, idx) => {
                  const count = filteredInjuries.filter(
                    (i) => i.bodyPart === bodyPart
                  ).length;
                  const total = Math.max(1, filteredInjuries.length);
                  const pct = Math.round((count / total) * 100);
                  const colors = [
                    'bg-rose-500',
                    'bg-sky-400',
                    'bg-amber-400',
                    'bg-emerald-400',
                    'bg-indigo-400',
                  ];
                  return (
                    <div key={bodyPart} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-200">{bodyPart}</span>
                        <span className="font-mono font-bold text-slate-100">
                          {bodyPart} — {count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full ${colors[idx % colors.length]}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Severity Distribution */}
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-200 uppercase">
                  Clinical Severity Breakdown
                </div>
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {[
                    {
                      label: 'Critical',
                      count: filteredInjuries.filter(
                        (i) => i.severity === 'Critical'
                      ).length,
                      style: 'border-slate-800 text-slate-400',
                    },
                    {
                      label: 'Severe',
                      count: filteredInjuries.filter(
                        (i) => i.severity === 'Severe'
                      ).length,
                      style: 'border-rose-500/40 text-rose-300 bg-rose-500/10',
                    },
                    {
                      label: 'Moderate',
                      count: filteredInjuries.filter(
                        (i) => i.severity === 'Moderate'
                      ).length,
                      style:
                        'border-amber-500/40 text-amber-300 bg-amber-500/10',
                    },
                    {
                      label: 'Minor',
                      count: filteredInjuries.filter(
                        (i) => i.severity === 'Minor'
                      ).length,
                      style: 'border-sky-500/40 text-sky-300 bg-sky-500/10',
                    },
                  ].map((s) => (
                    <button
                      key={s.label}
                      onClick={() =>
                        setSeverityFilter(
                          severityFilter === s.label ? 'All' : s.label
                        )
                      }
                      className={`p-3 rounded border text-left transition-colors ${s.style}`}
                    >
                      <div className="text-[11px] opacity-80">{s.label}</div>
                      <div className="text-base font-mono font-bold mt-0.5">
                        {s.label} — {s.count}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 30-Day Injury Trend Chart */}
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 uppercase">
                    30-Day Injury Incidence Trend
                  </span>
                  <span className="text-[11px] font-mono text-sky-400">
                    {dateRangeFilter}
                  </span>
                </div>

                <div className="grid grid-cols-7 gap-2 items-end h-28 pt-4">
                  {INJURY_30D_TREND.map((pt) => (
                    <div
                      key={pt.day}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-mono text-slate-300">
                        {pt.active}
                      </span>
                      <div className="w-full bg-slate-800/70 rounded-t h-16 flex items-end p-0.5">
                        <div
                          className="w-full bg-rose-500/80 rounded-t transition-all"
                          style={{ height: `${(pt.active / 5) * 100}%` }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {pt.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4, 5, 6. INTERACTIVE BODY MAP WITH SQUAD VS ATHLETE-SPECIFIC MODE */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F1623] border border-slate-800/90 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-200 uppercase">
                  Body Map Mode:
                </span>
                <button
                  onClick={() => setBodyMapScope('squad')}
                  className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                    bodyMapScope === 'squad'
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-[#090D16] text-slate-300 border border-slate-800'
                  }`}
                >
                  Squad Body Map (Aggregate)
                </button>
                <button
                  onClick={() => setBodyMapScope('athlete')}
                  className={`px-3 py-1.5 rounded font-semibold transition-colors ${
                    bodyMapScope === 'athlete'
                      ? 'bg-sky-500 text-slate-950'
                      : 'bg-[#090D16] text-slate-300 border border-slate-800'
                  }`}
                >
                  Athlete Body Map (Individual)
                </button>
              </div>

              {bodyMapScope === 'athlete' && (
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-slate-400">Select Athlete:</span>
                  <select
                    value={bodyMapAthleteId}
                    onChange={(e) => setBodyMapAthleteId(e.target.value)}
                    className="px-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-semibold"
                  >
                    {athletes.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.athleteId})
                      </option>
                    ))}
                  </select>
                  {bodyMapInjuries.length > 0 ? (
                    <span className="text-[11px] font-mono text-amber-300">
                      {bodyMapInjuries
                        .map(
                          (i) =>
                            `${i.bodyRegion} (${i.severity}) — Stage ${i.rtpStage}/5 RTP [${i.stage}]`
                        )
                        .join(' · ')}
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono text-emerald-400">
                      No active injuries · Full training clearance
                    </span>
                  )}
                </div>
              )}
            </div>

            <InteractiveBodyMap
              injuries={bodyMapInjuries}
              selectedRegion={selectedRegion}
              onSelectRegion={(reg) => setSelectedRegion(reg)}
              athleteFilterName={
                bodyMapScope === 'athlete' ? bodyMapAthlete.name : undefined
              }
              onViewInjury={(inj) => onSelectInjuryDrawer(inj)}
              onUpdateAssessment={(inj) => onSelectInjuryDrawer(inj)}
              onCreateRehabSession={(inj) => onOpenCreateRehabSession(inj)}
              onAdvanceRtp={(inj) => onOpenAdvanceRtpModal(inj)}
              onReportNewInjuryAtRegion={(reg) => onOpenReportInjuryModal(reg)}
            />
          </div>

          {/* 17. INJURY RISK INTELLIGENCE & 22. AI COPILOT IN MEDICAL CONTEXT */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* 17. INJURY RISK ALERTS */}
            <div className="xl:col-span-7 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                    INJURY RISK ALERTS
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  Human-in-the-Loop Advisory
                </span>
              </div>

              <div className="space-y-3">
                {riskAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 rounded-md border ${
                      alert.tier === 'ELEVATED RISK'
                        ? 'bg-rose-950/15 border-rose-500/40'
                        : 'bg-amber-950/15 border-amber-500/40'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            alert.tier === 'ELEVATED RISK'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {alert.tier}
                        </span>
                        <strong className="text-sm text-slate-100">
                          {alert.athleteName}
                        </strong>
                        <span className="text-xs font-mono text-slate-400">
                          Risk: {alert.risk}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-sky-400">
                        Status: {alert.status}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-200 space-y-1">
                      <div>
                        <span className="text-slate-400">Reason: </span>
                        <strong>{alert.reason}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">
                          Suggested Action:{' '}
                        </span>
                        <span className="text-sky-300 font-medium">
                          {alert.suggestedAction}
                        </span>
                      </div>
                      {alert.dismissReason && (
                        <div className="text-[11px] font-mono text-slate-400">
                          Dismissed Reason: "{alert.dismissReason}"
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-3 pt-2.5 border-t border-slate-800/80 text-xs">
                      <button
                        onClick={() => onOpenAthlete360(alert.athleteId)}
                        className="px-2.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
                      >
                        Review Athlete
                      </button>
                      <button
                        onClick={() =>
                          onUpdateRiskAlert(
                            alert.id,
                            { status: 'Reviewed' },
                            `Adjusted training load & capped high-speed running for ${alert.athleteName}`
                          )
                        }
                        className="px-2.5 py-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        Adjust Load
                      </button>
                      <button
                        onClick={() =>
                          onUpdateRiskAlert(
                            alert.id,
                            {
                              status: 'Follow-up Assigned',
                              assignedTo: 'Dr. S. Patel',
                            },
                            `Assigned medical follow-up for ${alert.athleteName} to Dr. S. Patel`
                          )
                        }
                        className="px-2.5 py-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        Assign Medical Follow-up
                      </button>
                      <button
                        onClick={() => setDismissModalAlertId(alert.id)}
                        className="px-2.5 py-1.5 rounded bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                      >
                        Dismiss Alert
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 22. AI COPILOT IN MEDICAL CONTEXT */}
            <div className="xl:col-span-5 bg-[#0F1623] border border-sky-500/30 rounded-lg p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Bot className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                      AI COPILOT IN MEDICAL CONTEXT
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-sky-500/15 text-[10px] font-mono text-sky-300">
                    Advisory Mode
                  </span>
                </div>

                {/* 4 Contextual AI Actions */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {(
                    [
                      { id: 'explain-risk', label: 'Explain Injury Risk' },
                      {
                        id: 'summarize-rehab',
                        label: 'Summarize Rehab Progress',
                      },
                      { id: 'evaluate-rtp', label: 'Evaluate RTP Readiness' },
                      {
                        id: 'suggest-modification',
                        label: 'Suggest Training Modification',
                      },
                    ] as const
                  ).map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => setActiveCopilotMode(btn.id)}
                      className={`px-2.5 py-2 rounded border text-left font-medium transition-colors ${
                        activeCopilotMode === btn.id
                          ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-semibold'
                          : 'bg-[#090D16] border-slate-800 text-slate-300 hover:bg-slate-800/70'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>

                {/* AI Output Card */}
                <div className="p-4 rounded-md bg-[#090D16] border border-slate-800 space-y-2.5 text-xs">
                  <div className="font-bold text-sky-300">
                    {copilotData.title}
                  </div>
                  <p className="text-slate-100 leading-relaxed font-medium">
                    {copilotData.output}
                  </p>
                  <div className="pt-2 border-t border-slate-800/80 space-y-1">
                    {copilotData.metrics.map((m) => (
                      <div
                        key={m}
                        className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5"
                      >
                        <span className="text-sky-400">•</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  if (activeCopilotMode === 'evaluate-rtp' || activeCopilotMode === 'summarize-rehab') {
                    onOpenAdvanceRtpModal(injuries[0]);
                  } else {
                    onTriggerToast(
                      `Logged AI Medical Advisory Action: ${copilotData.actionLabel}`
                    );
                  }
                }}
                className="w-full py-2.5 px-4 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs text-center transition-colors"
              >
                {copilotData.actionLabel} →
              </button>
            </div>
          </div>

          {/* 18. WELLNESS & SORENESS INTEGRATION & 19. MEDICAL OPERATIONAL ALERTS */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* 18. WELLNESS & SORENESS INTEGRATION */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                    WELLNESS & SORENESS INTEGRATION — {wellnessProfile.athleteName.toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Daily subjective psychometric & tissue soreness telemetry (1–10 scale)
                  </p>
                </div>
                <button
                  onClick={() => onOpenAthlete360(wellnessProfile.athleteId)}
                  className="text-xs text-sky-400 hover:underline font-medium"
                >
                  Open Profile →
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {(
                  [
                    { key: 'sleep', label: 'Sleep', val: wellnessProfile.sleep },
                    {
                      key: 'stress',
                      label: 'Stress',
                      val: wellnessProfile.stress,
                    },
                    {
                      key: 'soreness',
                      label: 'Soreness',
                      val: wellnessProfile.soreness,
                    },
                    {
                      key: 'fatigue',
                      label: 'Fatigue',
                      val: wellnessProfile.fatigue,
                    },
                    { key: 'mood', label: 'Mood', val: wellnessProfile.mood },
                    {
                      key: 'recovery',
                      label: 'Recovery',
                      val: wellnessProfile.recovery,
                    },
                  ] as const
                ).map((metric) => (
                  <div
                    key={metric.key}
                    className="p-3 rounded bg-[#0B101B] border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">{metric.label}</span>
                      <strong className="font-mono text-sm text-slate-100 tabular-nums">
                        {metric.val}/10
                      </strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      value={metric.val}
                      onChange={(e) =>
                        onUpdateWellness({
                          [metric.key]: Number(e.target.value),
                        })
                      }
                      className="w-full accent-sky-400"
                    />
                  </div>
                ))}
              </div>

              {/* Required Highlight Correlation Banner */}
              <div className="p-3.5 rounded-md bg-amber-950/25 border border-amber-500/40 flex items-start gap-2.5 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-amber-300">
                    Biometric & Tissue Risk Correlation Detected
                  </div>
                  <p className="text-slate-200 mt-0.5">
                    "Elevated soreness + high fatigue + recent hamstring history increases injury risk."
                  </p>
                </div>
              </div>
            </div>

            {/* 19. MEDICAL ALERTS */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                  MEDICAL OPERATIONAL ALERTS ({medicalAlerts.length})
                </h3>
                <span className="text-[11px] text-slate-400">
                  Click any alert to inspect athlete or injury record
                </span>
              </div>

              <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                {medicalAlerts.map((ma) => (
                  <div
                    key={ma.id}
                    onClick={() => onAcknowledgeMedicalAlert(ma)}
                    className={`p-3 rounded-md border cursor-pointer transition-colors flex items-start justify-between gap-3 text-xs ${
                      ma.acknowledged
                        ? 'bg-[#0B101B] border-slate-800/80 opacity-75'
                        : 'bg-[#0B101B] border-slate-700 hover:border-sky-500/50'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                            ma.severity === 'high'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {ma.type}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {ma.timestamp}
                        </span>
                      </div>
                      <div className="text-slate-200 font-medium mt-1">
                        {ma.detail}
                      </div>
                    </div>
                    <span className="text-sky-400 font-mono text-[11px] shrink-0">
                      Inspect →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 7. INJURY REGISTER AT BOTTOM OF INTELLIGENCE DASHBOARD */}
          {renderInjuryRegisterTable()}
        </>
      )}

      {/* =========================================================
       * TAB 2: INJURY REGISTER (/medical/injuries)
       * ========================================================= */}
      {activeSubTab === 'injury-register' && renderInjuryRegisterTable()}

      {/* =========================================================
       * TAB 3: REHABILITATION MANAGEMENT (/medical/rehab)
       * ========================================================= */}
      {activeSubTab === 'rehabilitation' && (
        <div className="space-y-5">
          {/* Active Rehab Plan Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {rehabPlans.map((plan) => {
              const linkedInj =
                injuries.find((i) => i.id === plan.injuryId) || injuries[0];
              const isSelected = plan.id === activeRehabPlan.id;
              return (
                <div
                  key={plan.id}
                  className={`p-5 rounded-lg border transition-all space-y-4 ${
                    isSelected
                      ? 'bg-[#0F1623] border-sky-500/60 shadow-lg'
                      : 'bg-[#0F1623] border-slate-800/90'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-mono text-sky-400 uppercase">
                        STRUCTURED REHABILITATION PROGRAM
                      </div>
                      <h3 className="text-base font-bold text-slate-100 mt-0.5">
                        {plan.athleteName} — {plan.title}
                      </h3>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold ${
                        plan.trackStatus === 'On Track'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {plan.trackStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Stage
                      </span>
                      <strong className="font-mono text-slate-100 text-sm">
                        {plan.currentStage} / {plan.totalStages}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Progress
                      </span>
                      <strong className="font-mono text-emerald-400 text-sm tabular-nums">
                        {plan.progressPct}%
                      </strong>
                    </div>
                    <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Target Date
                      </span>
                      <strong className="font-mono text-slate-200">
                        {plan.targetDate}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Current Focus
                      </span>
                      <strong className="text-slate-100">
                        {plan.currentFocus}
                      </strong>
                    </div>
                    <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800 sm:col-span-2">
                      <span className="text-slate-400 block text-[10px]">
                        Next Milestone
                      </span>
                      <strong className="text-sky-300">
                        {plan.nextMilestone}
                      </strong>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sky-500 rounded-full transition-all"
                      style={{ width: `${plan.progressPct}%` }}
                    />
                  </div>

                  {/* 4 Required Actions */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                    <button
                      onClick={() => {
                        setSelectedRehabPlanId(plan.id);
                        setSelectedRehabStageNum(plan.currentStage);
                      }}
                      className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
                    >
                      View Rehab Plan
                    </button>
                    <button
                      onClick={() => onOpenCreateRehabSession(linkedInj)}
                      className="px-3 py-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium"
                    >
                      Log Session
                    </button>
                    <button
                      onClick={() =>
                        onUpdateRehabProgress(
                          plan.id,
                          Math.min(100, plan.progressPct + 6),
                          `Updated rehabilitation progress for ${plan.athleteName} to ${Math.min(100, plan.progressPct + 6)}%`
                        )
                      }
                      className="px-3 py-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium"
                    >
                      Update Progress (+6%)
                    </button>
                    <button
                      onClick={() => onOpenAdvanceRtpModal(linkedInj)}
                      className="px-3 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold"
                    >
                      Advance Stage
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 12. 5-STAGE REHABILITATION PROTOCOL INSPECTOR */}
          {activeRehabPlan && (
            <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                    5-STAGE REHABILITATION PROTOCOL — {activeRehabPlan.athleteName.toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select any stage below to inspect clinical objectives, prescribed exercises, required tests, and completion criteria
                  </p>
                </div>
                <button
                  onClick={() => onOpenCreateRehabSession(activeRehabInjury)}
                  className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
                >
                  + Create Rehab Session
                </button>
              </div>

              {/* 5 Stage Stepper */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
                {activeRehabPlan.stages.map((st) => {
                  const isSelected = selectedRehabStageNum === st.stageNumber;
                  return (
                    <button
                      key={st.stageNumber}
                      onClick={() => setSelectedRehabStageNum(st.stageNumber)}
                      className={`p-3 rounded-md border text-left transition-all ${
                        isSelected
                          ? 'bg-sky-500/20 border-sky-400'
                          : st.status === 'Complete'
                            ? 'bg-emerald-950/15 border-emerald-500/30'
                            : st.status === 'Current'
                              ? 'bg-amber-950/15 border-amber-500/40'
                              : 'bg-[#0B101B] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-300 font-bold">
                          Stage {st.stageNumber}
                        </span>
                        <span
                          className={
                            st.status === 'Complete'
                              ? 'text-emerald-400'
                              : st.status === 'Current'
                                ? 'text-sky-400 font-bold'
                                : 'text-slate-500'
                          }
                        >
                          {st.status === 'Complete'
                            ? '✓ Complete'
                            : st.status === 'Current'
                              ? '● Current'
                              : 'Pending'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-100 mt-1">
                        {st.title}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Stage Detail Breakdown */}
              {(() => {
                const stageObj =
                  activeRehabPlan.stages.find(
                    (s) => s.stageNumber === selectedRehabStageNum
                  ) || activeRehabPlan.stages[0];
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs pt-2">
                    <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                      <div className="font-bold text-sky-400 uppercase">
                        Clinical Objectives
                      </div>
                      <ul className="space-y-1.5 text-slate-200">
                        {stageObj.objectives.map((o) => (
                          <li key={o}>• {o}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                      <div className="font-bold text-emerald-400 uppercase">
                        Prescribed Exercises
                      </div>
                      <ul className="space-y-1.5 text-slate-200">
                        {stageObj.exercises.map((ex) => (
                          <li key={ex}>• {ex}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                      <div className="font-bold text-amber-400 uppercase">
                        Required Clinical Tests
                      </div>
                      <ul className="space-y-1.5 text-slate-200">
                        {stageObj.tests.map((t) => (
                          <li key={t}>• {t}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                      <div className="font-bold text-slate-200 uppercase">
                        Exit Criteria & Lead
                      </div>
                      <ul className="space-y-1.5 text-slate-200">
                        {stageObj.completionCriteria.map((c) => (
                          <li key={c}>✓ {c}</li>
                        ))}
                      </ul>
                      <div className="pt-2 mt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                        Assigned: {stageObj.assignedProfessional}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Logged Rehab Sessions List */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-200 uppercase">
                  Completed Rehabilitation Sessions ({activeRehabPlan.sessions.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {activeRehabPlan.sessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3 rounded bg-[#0B101B] border border-slate-800 space-y-1"
                    >
                      <div className="flex justify-between font-mono text-[11px]">
                        <span className="text-sky-400 font-bold">
                          {sess.date} · {sess.focus}
                        </span>
                        <span className="text-emerald-400">
                          Pain: {sess.painBefore}/10 → {sess.painAfter}/10
                        </span>
                      </div>
                      <div className="text-slate-300">
                        Exercises: {sess.exercises.join(', ')}
                      </div>
                      <div className="text-slate-400 text-[11px]">
                        "{sess.notes}" — {sess.professional}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================
       * TAB 4: RETURN-TO-PLAY (RTP) WORKFLOW (/medical/return-to-play)
       * ========================================================= */}
      {activeSubTab === 'return-to-play' && (
        <div className="space-y-5">
          {injuries.map((inj) => {
            const g = inj.gateCriteria;
            const criteriaList = [
              { label: 'Pain ≤ 2/10', met: g.painThresholdMet },
              {
                label: 'Strength Symmetry ≥ 90%',
                met: g.strengthSymmetryMet,
              },
              { label: 'Running Tolerance', met: g.runningToleranceMet },
              { label: 'Functional Test', met: g.functionalTestMet },
              { label: 'Medical Clearance', met: g.medicalClearanceMet },
            ];
            return (
              <div
                key={inj.id}
                className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-3 border-b border-slate-800">
                  <div>
                    <div className="text-xs font-mono text-sky-400">
                      RETURN-TO-PLAY PROGRESSION PIPELINE
                    </div>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">
                      {inj.athleteName} — {inj.diagnosis} ({inj.bodyRegionDisplay})
                    </h3>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Current Stage: Stage {inj.rtpStage}/5 ({inj.rtpStageName}) ·{' '}
                      {inj.rehabProgressPct}% Complete · Est. RTP: {inj.estimatedRtpDate}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectInjuryDrawer(inj)}
                      className="px-3 py-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium"
                    >
                      View Clinical File
                    </button>
                    <button
                      onClick={() => onOpenAdvanceRtpModal(inj)}
                      className="px-4 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
                    >
                      Advance Stage / Gate Check →
                    </button>
                  </div>
                </div>

                {/* 5-Stage RTP Progression Pipeline matching Section 14 */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                  {[
                    { num: 1, name: 'Pain Reduction' },
                    { num: 2, name: 'Strength Restoration' },
                    { num: 3, name: 'Sport-Specific Training' },
                    { num: 4, name: 'Full Training' },
                    { num: 5, name: 'Return to Competition' },
                  ].map((st) => {
                    const isComplete = st.num < inj.rtpStage;
                    const isCurrent = st.num === inj.rtpStage;
                    return (
                      <div
                        key={st.num}
                        className={`p-3 rounded-md border ${
                          isComplete
                            ? 'bg-emerald-950/15 border-emerald-500/30'
                            : isCurrent
                              ? 'bg-sky-500/15 border-sky-400'
                              : 'bg-[#0B101B] border-slate-800 opacity-75'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span>Stage {st.num}</span>
                          <span
                            className={
                              isComplete
                                ? 'text-emerald-400 font-bold'
                                : isCurrent
                                  ? 'text-sky-300 font-bold'
                                  : 'text-slate-500'
                            }
                          >
                            {isComplete
                              ? '✓ Complete'
                              : isCurrent
                                ? `Current (${inj.rehabProgressPct}%)`
                                : 'Pending'}
                          </span>
                        </div>
                        <div className="font-bold text-slate-100 mt-1">
                          {st.name}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Gate Criteria Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {criteriaList.map((c) => (
                    <div
                      key={c.label}
                      className={`px-3 py-2 rounded border flex items-center justify-between ${
                        c.met
                          ? 'bg-emerald-950/15 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
                      }`}
                    >
                      <span>{c.label}</span>
                      <span className="font-mono font-bold">
                        {c.met ? '✓' : '✗'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dismiss Risk Alert Modal (Requires Reason per Section 17) */}
      {dismissModalAlertId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setDismissModalAlertId(null)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-100">
                Dismiss Injury Risk Alert (Reason Required)
              </span>
              <button
                onClick={() => setDismissModalAlertId(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-slate-400 mb-1">
                Clinical Justification for Dismissing Alert *
              </label>
              <textarea
                rows={3}
                value={dismissReasonText}
                onChange={(e) => setDismissReasonText(e.target.value)}
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDismissModalAlertId(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!dismissReasonText.trim()) return;
                  onUpdateRiskAlert(
                    dismissModalAlertId,
                    {
                      status: 'Dismissed',
                      dismissReason: dismissReasonText.trim(),
                    },
                    `Risk alert dismissed with audit reason: "${dismissReasonText.trim()}"`
                  );
                  setDismissModalAlertId(null);
                }}
                className="px-3.5 py-1.5 rounded bg-rose-500 text-white font-semibold"
              >
                Confirm Dismiss Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
