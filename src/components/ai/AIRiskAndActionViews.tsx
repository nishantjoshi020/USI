import React, { useState } from 'react';
import {
   Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Cpu,
  Download,
  Eye,
  Filter,
  Layers,
  Lock,
  Play,
  Plus,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from 'lucide-react';
import {
  AIActionCentreItem,
  AIActionStatus,
  AIAuditTrailRecord,
  AIAutomationAuditEvent,
  AIDataFreshnessItem,
  AIEvidenceBundle,
  AIRiskCategory,
  AIRiskSignalCard,
  AIWorkflowAutomationRule,
  NavItemId,
  UserRole,
} from '../../types/usi';
import {
  exportAuditTrailReport,
  exportToCSV,
  exportToPDF,
} from '../../utils/exportEngine';

interface AIRiskAndActionViewsProps {
  mode: 'ai-action-centre' | 'ai-risk-centre' | 'ai-automation' | 'ai-audit';
  selectedRole: UserRole;
  actionItems: AIActionCentreItem[];
  riskSignals: AIRiskSignalCard[];
  automationRules: AIWorkflowAutomationRule[];
  automationAuditEvents: AIAutomationAuditEvent[];
  aiAuditTrail: AIAuditTrailRecord[];
  dataFreshness: AIDataFreshnessItem[];
  onUpdateActionStatus: (id: string, nextStatus: AIActionStatus) => void;
  onOpenTrainingModModal: () => void;
  onOpenEvidence: (bundle: AIEvidenceBundle) => void;
  onFeedbackRiskSignal: (
    id: string,
    feedback: 'Helpful' | 'Not Relevant' | 'Dismissed',
    reason?: 'Not relevant' | 'Already addressed' | 'Incorrect data' | 'Other'
  ) => void;
  onToggleAutomationRule: (id: string) => void;
  onUpdateAutomationRule: (rule: AIWorkflowAutomationRule) => void;
  onNavigateModule: (nav: NavItemId) => void;
  onOpenAthlete360: (athleteId: string) => void;
}

export const AIRiskAndActionViews: React.FC<AIRiskAndActionViewsProps> = ({
  mode,
  selectedRole,
  actionItems,
  riskSignals,
  automationRules,
  automationAuditEvents,
  aiAuditTrail,
  dataFreshness,
  onUpdateActionStatus,
  onOpenTrainingModModal,
  onOpenEvidence,
  onFeedbackRiskSignal,
  onToggleAutomationRule,
  onUpdateAutomationRule,
  onNavigateModule,
  onOpenAthlete360,
}) => {
  // Risk Centre Filter & Dismiss Modal State (Sections 12 & 13)
  const [selectedRiskCategory, setSelectedRiskCategory] = useState<
    'All' | AIRiskCategory
  >('All');
  const [dismissModalSignalId, setDismissModalSignalId] = useState<
    string | null
  >(null);
  const [dismissReason, setDismissReason] = useState<
    'Not relevant' | 'Already addressed' | 'Incorrect data' | 'Other'
  >('Already addressed');

  // Action Centre Filter
  const [actionStatusFilter, setActionStatusFilter] = useState<
    'All' | AIActionStatus
  >('All');
  const [roleScopeFilter, setRoleScopeFilter] = useState<'role' | 'all'>('role');

  // Edit Automation Rule Modal State (Section 19)
  const [editingRule, setEditingRule] =
    useState<AIWorkflowAutomationRule | null>(null);

  const riskCategories: ('All' | AIRiskCategory)[] = [
    'All',
    'Injury Risk Signals',
    'Workload Risk',
    'Recovery Risk',
    'Performance Decline',
    'Operational Risk',
  ];

  /* =========================================================
   * VIEW 1: AI ACTION CENTRE (SECTION 18)
   * ========================================================= */
  if (mode === 'ai-action-centre') {
    const filteredActions = actionItems.filter((item) => {
      const matchesStatus =
        actionStatusFilter === 'All' || item.status === actionStatusFilter;
      if (selectedRole === 'Athlete') {
        const isOwnAthleteAction =
          item.affectedAthleteId === 'ath-arjun-mehta' ||
          item.affectedAthleteName.includes('Arjun Mehta') ||
          item.targetRoles?.includes('Athlete');
        return matchesStatus && isOwnAthleteAction;
      }
      const matchesRole =
        roleScopeFilter === 'all' ||
        !item.targetRoles ||
        item.targetRoles.includes(selectedRole);
      return matchesStatus && matchesRole;
    });

    return (
      <div className="space-y-5 text-xs">
        <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-sky-400 uppercase">
              {selectedRole === 'Athlete'
                ? 'PERSONAL ATHLETE AI GUIDANCE QUEUE'
                : `HUMAN-IN-THE-LOOP GOVERNANCE QUEUE · ${selectedRole.toUpperCase()}`}
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              {selectedRole === 'Athlete'
                ? 'MY AI ACTION ITEMS & ADVISORY GUIDANCE'
                : `AI ACTION CENTRE — ${
                    roleScopeFilter === 'role'
                      ? `${selectedRole.toUpperCase()} RECOMMENDATIONS`
                      : 'ALL FEDERATION RECOMMENDATIONS'
                  }`}
            </h2>
            <p className="text-slate-400 mt-0.5">
              {selectedRole === 'Athlete'
                ? 'Personalised readiness, recovery, and fueling recommendations linked to your athlete profile.'
                : `Consequential and advisory AI recommendations requiring ${selectedRole} review and approval.`}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {selectedRole !== 'Athlete' && (
              <div className="flex items-center rounded bg-[#090D16] border border-slate-800 p-0.5">
                <button
                  type="button"
                  onClick={() => setRoleScopeFilter('role')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    roleScopeFilter === 'role'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {selectedRole} Queue
                </button>
                <button
                  type="button"
                  onClick={() => setRoleScopeFilter('all')}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    roleScopeFilter === 'all'
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  All Roles ({actionItems.length})
                </button>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  'All',
                  'Pending Review',
                  'Approved',
                  'Applied',
                  'Rejected',
                  'Expired',
                ] as const
              ).map((st) => (
                <button
                  key={st}
                  onClick={() => setActionStatusFilter(st)}
                  className={`px-2.5 py-1.5 rounded border font-medium transition-colors ${
                    actionStatusFilter === st
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                      : 'bg-[#0B101B] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredActions.map((act, idx) => (
            <div
              key={act.id}
              className="bg-[#0F1623] border border-slate-800 rounded-lg p-4 space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs text-slate-500 font-bold">
                    #{idx + 1}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      act.priority === 'High'
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {act.priority} Priority
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      act.safetyClass === 'CONSEQUENTIAL'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                    }`}
                  >
                    {act.safetyClass}
                  </span>
                  <span className="text-sm font-bold text-slate-100">
                    {act.recommendation}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-slate-400">
                    {act.approverRole}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold border ${
                      act.status === 'Pending Review'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : act.status === 'Approved' || act.status === 'Applied'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {act.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[11px]">
                <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">
                    Affected Athlete
                  </span>
                  <strong className="text-slate-100 mt-0.5 block">
                    {act.affectedAthleteName} ({act.squad})
                  </strong>
                </div>
                <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">
                    AI Source Engine
                  </span>
                  <strong className="text-sky-300 mt-0.5 block">
                    {act.source}
                  </strong>
                </div>
                <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">
                    Confidence
                  </span>
                  <strong className="text-emerald-300 font-mono mt-0.5 block">
                    {act.confidence}
                  </strong>
                </div>
                <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block text-[10px] font-mono uppercase">
                    Created
                  </span>
                  <strong className="text-slate-300 font-mono mt-0.5 block">
                    {act.createdAt}
                  </strong>
                </div>
              </div>

              <p className="text-slate-300 leading-relaxed">{act.detail}</p>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onOpenEvidence(act.evidenceBundle)}
                  className="px-3 py-1.5 rounded bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-sky-300 font-medium inline-flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Why am I seeing this? (View Evidence)</span>
                </button>

                <div className="flex items-center gap-2">
                  {selectedRole === 'Athlete' ? (
                    <span className="px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>Coach / Staff Sign-Off Required ({act.approverRole})</span>
                    </span>
                  ) : (
                    <>
                      {act.id === 'ai-act-01' && (
                        <button
                          onClick={onOpenTrainingModModal}
                          className="px-3.5 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold"
                        >
                          Review Proposed Changes
                        </button>
                      )}
                      {act.status === 'Pending Review' && (
                        <>
                          <button
                            disabled={['Federation Admin', 'Athlete'].includes(selectedRole)}
                            onClick={() => onUpdateActionStatus(act.id, 'Approved')}
                            className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold disabled:opacity-45 disabled:cursor-not-allowed"
                          >
                            Approve & Apply
                          </button>
                          <button
                            disabled={['Federation Admin', 'Athlete'].includes(selectedRole)}
                            onClick={() => onUpdateActionStatus(act.id, 'Rejected')}
                            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-45 disabled:cursor-not-allowed"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* =========================================================
   * VIEW 2: AI RISK CENTRE & FEEDBACK LOOP (SECTIONS 12 & 13)
   * ========================================================= */
  if (mode === 'ai-risk-centre') {
    const visibleSignals = riskSignals.filter(
      (s) =>
        s.feedbackStatus !== 'Dismissed' &&
        (selectedRiskCategory === 'All' || s.category === selectedRiskCategory) &&
        (roleScopeFilter === 'all' ||
          !s.targetRoles ||
          s.targetRoles.includes(selectedRole))
    );

    return (
      <div className="space-y-5 text-xs">
        <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] font-mono text-amber-400 uppercase">
              MULTI-DOMAIN EARLY WARNING SYSTEM · {selectedRole.toUpperCase()} LENS
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              AI RISK CENTRE — {roleScopeFilter === 'role' ? `${selectedRole.toUpperCase()} RISK SIGNALS` : 'ALL FEDERATION RISK SIGNALS'}
            </h2>
            <p className="text-slate-400 mt-0.5">
              Qualitative confidence scoring with human feedback signals (Helpful / Not Relevant / Dismiss with reason).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center rounded bg-[#090D16] border border-slate-800 p-0.5">
              <button
                type="button"
                onClick={() => setRoleScopeFilter('role')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  roleScopeFilter === 'role'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {selectedRole} Risks
              </button>
              <button
                type="button"
                onClick={() => setRoleScopeFilter('all')}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  roleScopeFilter === 'all'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All Federation
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {riskCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedRiskCategory(cat)}
                  className={`px-2.5 py-1.5 rounded border font-medium transition-colors ${
                    selectedRiskCategory === cat
                      ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                      : 'bg-[#0B101B] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {visibleSignals.map((sig) => (
            <div
              key={sig.id}
              className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 uppercase block">
                      {sig.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 mt-0.5">
                      {sig.athleteName}{' '}
                      <span className="text-slate-400 font-normal">
                        ({sig.squad})
                      </span>
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-bold border ${
                        sig.riskLevel === 'Elevated' || sig.riskLevel === 'High'
                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      Risk: {sig.riskLevel}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#0B101B] border border-slate-700 font-mono text-[11px] text-slate-300">
                      Confidence: {sig.confidence}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                    DETECTED SIGNALS
                  </span>
                  <div className="space-y-1">
                    {sig.signals.map((item, i) => (
                      <div
                        key={i}
                        className="px-2.5 py-1.5 rounded bg-[#0B101B] border border-slate-800/80 font-mono text-slate-200 flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0B101B] border border-amber-500/30">
                  <span className="text-[10px] font-mono text-amber-300 uppercase block">
                    RECOMMENDED ACTION
                  </span>
                  <p className="text-slate-100 font-semibold mt-0.5">
                    {sig.recommendedAction}
                  </p>
                </div>
              </div>

              {/* Action & Feedback Loop Bar (Section 13) */}
              <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onFeedbackRiskSignal(sig.id, 'Helpful')}
                    className={`px-2.5 py-1 rounded border text-[11px] inline-flex items-center gap-1 ${
                      sig.feedbackStatus === 'Helpful'
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-semibold'
                        : 'bg-[#0B101B] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>Helpful</span>
                  </button>
                  <button
                    onClick={() => onFeedbackRiskSignal(sig.id, 'Not Relevant')}
                    className={`px-2.5 py-1 rounded border text-[11px] inline-flex items-center gap-1 ${
                      sig.feedbackStatus === 'Not Relevant'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-semibold'
                        : 'bg-[#0B101B] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                    <span>Not Relevant</span>
                  </button>
                  <button
                    onClick={() => setDismissModalSignalId(sig.id)}
                    className="px-2.5 py-1 rounded bg-[#0B101B] hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Dismiss
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenEvidence(sig.evidenceBundle)}
                    className="px-2.5 py-1.5 rounded bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-sky-300"
                  >
                    View Evidence
                  </button>
                  <button
                    onClick={() => {
                      if (sig.id === 'risk-sig-01') {
                        onOpenTrainingModModal();
                      } else if (sig.athleteId) {
                        onOpenAthlete360(sig.athleteId);
                      } else {
                        onNavigateModule(sig.targetNav);
                      }
                    }}
                    className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
                  >
                    Review
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dismiss Signal Reason Modal (Section 13) */}
        {dismissModalSignalId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setDismissModalSignalId(null)}
              className="fixed inset-0 bg-black/75"
            />
            <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100">
                  Dismiss AI Risk Signal — Record Operational Feedback
                </h3>
                <button
                  onClick={() => setDismissModalSignalId(null)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-slate-400 text-xs">
                Select a reason to log this dismissal as an operational feedback signal (does not autonomously retrain the model):
              </p>

              <div className="space-y-2">
                {(
                  [
                    'Not relevant',
                    'Already addressed',
                    'Incorrect data',
                    'Other',
                  ] as const
                ).map((r) => (
                  <label
                    key={r}
                    className="flex items-center gap-2.5 p-2.5 rounded bg-[#0B101B] border border-slate-800 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="dismissReason"
                      checked={dismissReason === r}
                      onChange={() => setDismissReason(r)}
                    />
                    <span className="text-slate-200">{r}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDismissModalSignalId(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onFeedbackRiskSignal(
                      dismissModalSignalId,
                      'Dismissed',
                      dismissReason
                    );
                    setDismissModalSignalId(null);
                  }}
                  className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
                >
                  Confirm Dismissal
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
   * VIEW 3: AI WORKFLOW AUTOMATION & AUTOMATION AUDIT (SECTIONS 19 & 20)
   * ========================================================= */
  if (mode === 'ai-automation') {
    return (
      <div className="space-y-5 text-xs">
        <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5">
          <div className="text-[11px] font-mono text-sky-400 uppercase">
            ADVISORY RULE ENGINE · HUMAN APPROVAL REQUIRED
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-0.5">
            AI WORKFLOW AUTOMATION & AUTOMATION AUDIT
          </h2>
          <p className="text-slate-400 mt-0.5">
            Simulated WHEN / AND / THEN operational triggers that stage tasks and review flags for human specialists without autonomous execution.
          </p>
        </div>

        {/* Automation Rule Cards (Section 19) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {automationRules.map((rule) => (
            <div
              key={rule.id}
              className={`bg-[#0F1623] border rounded-lg p-5 flex flex-col justify-between space-y-4 ${
                rule.enabled ? 'border-slate-800' : 'border-slate-800/50 opacity-65'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-bold text-slate-100 text-sm">
                    {rule.name}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                      rule.enabled
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    {rule.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>

                <div className="space-y-2 font-mono text-[11px]">
                  <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-sky-400 font-bold block text-[10px]">
                      WHEN:
                    </span>
                    <span className="text-slate-100">{rule.whenCondition1}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
                    <span className="text-amber-400 font-bold block text-[10px]">
                      AND:
                    </span>
                    <span className="text-slate-100">{rule.andCondition2}</span>
                  </div>
                  <div className="p-2.5 rounded bg-[#0B101B] border border-emerald-500/30">
                    <span className="text-emerald-400 font-bold block text-[10px]">
                      THEN:
                    </span>
                    <span className="text-emerald-200 font-semibold">
                      {rule.thenAction}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
                  <span>Last: {rule.lastTriggered}</span>
                  <span className="font-mono text-slate-300">
                    {rule.triggerCount7d}x (7d)
                  </span>
                </div>
              </div>

              {/* [Enable] [Edit] [Disable] */}
              <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (!rule.enabled) onToggleAutomationRule(rule.id);
                  }}
                  disabled={rule.enabled || !['Performance Director', 'Sports Scientist', 'Coach'].includes(selectedRole)}
                  className="flex-1 py-1.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed border border-emerald-500/30 text-emerald-300 font-semibold"
                >
                  Enable
                </button>
                <button
                  disabled={!['Performance Director', 'Sports Scientist', 'Coach'].includes(selectedRole)}
                  onClick={() => setEditingRule(rule)}
                  className="flex-1 py-1.5 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-200 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (rule.enabled) onToggleAutomationRule(rule.id);
                  }}
                  disabled={!rule.enabled || !['Performance Director', 'Sports Scientist', 'Coach'].includes(selectedRole)}
                  className="flex-1 py-1.5 rounded bg-rose-500/20 hover:bg-rose-500/30 disabled:opacity-40 disabled:cursor-not-allowed border border-rose-500/30 text-rose-300 font-semibold"
                >
                  Disable
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Automation Audit Table (Section 20) */}
        <div className="bg-[#0F1623] border border-slate-800 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase">
                AI AUTOMATION AUDIT LOG
              </h3>
              <p className="text-[11px] text-slate-400">
                Every automated recommendation records Trigger, Data Used, Recommendation, Human Review, Action, and Timestamp.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#090D16] border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                  <th className="p-3">Trigger</th>
                  <th className="p-3">Athlete / Cohort</th>
                  <th className="p-3">Data Used</th>
                  <th className="p-3">Recommendation</th>
                  <th className="p-3">Human Review</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {automationAuditEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-[#141D2E]">
                    <td className="p-3 font-mono text-amber-300 font-semibold">
                      {ev.trigger}
                    </td>
                    <td className="p-3 font-semibold text-slate-100">
                      {ev.athleteName}
                    </td>
                    <td className="p-3 font-mono text-[11px] text-slate-300">
                      {ev.dataUsed.join(' · ')}
                    </td>
                    <td className="p-3 text-slate-200">{ev.recommendation}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-[10px] text-amber-300">
                        {ev.humanReviewStatus}
                      </span>
                    </td>
                    <td className="p-3 text-sky-300">{ev.action}</td>
                    <td className="p-3 font-mono text-slate-400">
                      {ev.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Rule Modal */}
        {editingRule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              onClick={() => setEditingRule(null)}
              className="fixed inset-0 bg-black/75"
            />
            <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-3.5 z-10">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="text-sm font-bold text-slate-100">
                  Edit Automation Rule — {editingRule.name}
                </h3>
                <button onClick={() => setEditingRule(null)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">WHEN Condition</label>
                <input
                  type="text"
                  value={editingRule.whenCondition1}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      whenCondition1: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">AND Condition</label>
                <input
                  type="text"
                  value={editingRule.andCondition2}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      andCondition2: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">THEN Action</label>
                <input
                  type="text"
                  value={editingRule.thenAction}
                  onChange={(e) =>
                    setEditingRule({
                      ...editingRule,
                      thenAction: e.target.value,
                    })
                  }
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setEditingRule(null)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onUpdateAutomationRule(editingRule);
                    setEditingRule(null);
                  }}
                  className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
                >
                  Save Rule
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* =========================================================
   * VIEW 4: AI AUDIT TRAIL & SHARED AI DATA ARCHITECTURE (SECTIONS 30, 31, 32)
   * ========================================================= */
  return (
    <div className="space-y-5 text-xs">
      {/* Shared AI Context Layer & Action Safety Classification (Sections 30 & 31) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-3">
          <div className="text-[11px] font-mono text-sky-400 uppercase">
            SHARED AI CONTEXT LAYER (SECTION 30)
          </div>
          <h3 className="text-sm font-bold text-slate-100">
            Permission-Governed Cross-Module Reasoning Architecture
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] pt-1">
            {[
              'User Context',
              'Permission Context',
              'Organisational Context',
              'Athlete Data (Training · Medical · Science · Nutrition · Assessments · Analytics)',
              'AI Reasoning Layer',
              'Recommendation',
              'Human Approval',
              'Action',
              'Audit',
            ].map((step, i, arr) => (
              <React.Fragment key={step}>
                <span className="px-2.5 py-1 rounded bg-[#0B101B] border border-slate-800 text-slate-200">
                  {step}
                </span>
                {i < arr.length - 1 && (
                  <span className="text-sky-400 font-bold">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-2.5">
          <div className="text-[11px] font-mono text-amber-400 uppercase">
            AI ACTION SAFETY CLASSIFICATION (SECTION 31)
          </div>
          <div className="space-y-2 text-[11px]">
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
              <strong className="text-sky-300 font-mono">INFORMATIONAL:</strong>{' '}
              <span className="text-slate-300">
                Executes immediately (show data, summarize, compare, explain).
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
              <strong className="text-amber-300 font-mono">RECOMMENDATION:</strong>{' '}
              <span className="text-slate-300">
                Requires specialist review (training modification proposal, risk flag, assessment scheduling).
              </span>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-amber-500/30">
              <strong className="text-rose-300 font-mono">CONSEQUENTIAL:</strong>{' '}
              <span className="text-slate-300">
                Requires explicit human approval (changing training assignment, advancing RTP, modifying athlete status).
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Audit Trail Table (Section 32) */}
      <div className="bg-[#0F1623] border border-slate-800 rounded-lg overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              AI AUDIT TRAIL (IMMUTABLE GOVERNANCE LOG)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Records AI query, AI recommendation, Evidence accessed, User reviewing recommendation, User decision, Action taken, and Timestamp.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                exportAuditTrailReport('CSV', aiAuditTrail, selectedRole)
              }
              className="px-3 py-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() =>
                exportAuditTrailReport('PDF', aiAuditTrail, selectedRole)
              }
              className="px-3 py-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#090D16] border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                <th className="p-3">AI Query / Trigger</th>
                <th className="p-3">AI Recommendation</th>
                <th className="p-3">Evidence Accessed</th>
                <th className="p-3">Reviewed By</th>
                <th className="p-3">Decision</th>
                <th className="p-3">Action Taken</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {aiAuditTrail.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#141D2E]">
                  <td className="p-3 font-medium text-slate-200">{rec.query}</td>
                  <td className="p-3 text-sky-300 font-semibold">
                    {rec.recommendation}
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">
                    {rec.evidenceAccessed.join(' · ')}
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-100">
                      {rec.reviewedBy}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      {rec.reviewerRole}
                    </div>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                        rec.decision === 'Approved'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {rec.decision}
                    </span>
                  </td>
                  <td className="p-3 text-slate-200">{rec.actionTaken}</td>
                  <td className="p-3 font-mono text-slate-400">
                    {rec.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
