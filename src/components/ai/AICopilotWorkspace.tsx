import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Download,
  Eye,
  FileText,
  Filter,
  HelpCircle,
  Layers,
  Lock,
  RefreshCw,
  Send,
  Share2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  UserCheck,
  Users,
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
  AIRiskSignalCard,
  AIWorkflowAutomationRule,
  Athlete,
  HierarchyContext,
  NavItemId,
  UserRole,
} from '../../types/usi';
import {
  AI_COPILOT_PROMPT_CHIPS,
  AI_ROLE_BEHAVIOR_MATRIX,
  AI_SLASH_COMMANDS,
} from '../../data/aiCopilotMockData';
import { AIRiskAndActionViews } from './AIRiskAndActionViews';

export type AICopilotSubTab =
  | 'ai-copilot'
  | 'ai-action-centre'
  | 'ai-risk-centre'
  | 'ai-automation'
  | 'ai-audit';

interface AICopilotWorkspaceProps {
  activeSubTab: AICopilotSubTab;
  onSelectSubTab: (tab: AICopilotSubTab) => void;
  context: HierarchyContext;
  selectedRole: UserRole;
  athletes: Athlete[];
  activeAthleteId: string;
  onSelectContextAthlete: (athleteId: string) => void;
  messages: AICopilotMessage[];
  onSendQuery: (query: string) => void;
  onClearConversation: () => void;
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
  onExecuteCopilotAction: (action: AICopilotActionButton) => void;
  onNavigateModule: (nav: NavItemId) => void;
  onOpenAthlete360: (athleteId: string) => void;
  onShowToast: (msg: string) => void;
}

export const AICopilotWorkspace: React.FC<AICopilotWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  context,
  selectedRole,
  athletes,
  activeAthleteId,
  onSelectContextAthlete,
  messages,
  onSendQuery,
  onClearConversation,
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
  onExecuteCopilotAction,
  onNavigateModule,
  onOpenAthlete360,
  onShowToast,
}) => {
  const [queryInput, setQueryInput] = useState('');
  const [scopeMode, setScopeMode] = useState<
    'Athlete Focus' | 'Squad Operations' | 'Federation Oversight'
  >('Athlete Focus');
  const [showStaleSimulation, setShowStaleSimulation] = useState(false);

  const activeAthlete =
    athletes.find((a) => a.id === activeAthleteId) || athletes[0];

  const pendingActionsCount = actionItems.filter(
    (a) => a.status === 'Pending Review'
  ).length;
  const activeRiskCount = riskSignals.filter(
    (r) => r.feedbackStatus !== 'Dismissed'
  ).length;
  const activeRulesCount = automationRules.filter((r) => r.enabled).length;

  const roleBehavior = AI_ROLE_BEHAVIOR_MATRIX[selectedRole];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    onSendQuery(queryInput.trim());
    setQueryInput('');
  };

  const subTabs: {
    id: AICopilotSubTab;
    label: string;
    badge?: number | string;
  }[] = [
    { id: 'ai-copilot', label: 'USI Copilot Workspace', badge: 'Live' },
    {
      id: 'ai-action-centre',
      label: 'AI Action Centre',
      badge: pendingActionsCount,
    },
    { id: 'ai-risk-centre', label: 'AI Risk Centre', badge: activeRiskCount },
    {
      id: 'ai-automation',
      label: 'Workflow Automation',
      badge: `${activeRulesCount} Active`,
    },
    {
      id: 'ai-audit',
      label: 'AI Audit & Governance',
      badge: aiAuditTrail.length,
    },
  ];

  return (
    <div className="space-y-5">
      {/* Top Module Header & Sub-Navigation */}
      <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-sky-500/15 border border-sky-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-slate-100">
                  USI COPILOT
                </h1>
                <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-[10px] font-semibold text-sky-300">
                  AI-NATIVE OPERATIONS LAYER
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 font-mono text-[10px] font-semibold text-amber-300">
                  HUMAN-IN-THE-LOOP GOVERNED
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Context-aware performance, medical, training and operational
                intelligence. Principle: Ask → Understand Context → Analyse Data
                → Explain → Recommend → Execute → Verify → Audit.
              </p>
            </div>
          </div>

          {/* Right Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenTrainingModModal}
              className="px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Review Training Modifications (2)</span>
            </button>
            <button
              onClick={() =>
                onSendQuery(
                  'Generate weekly performance report for Senior Squad'
                )
              }
              className="px-3.5 py-2 rounded-md bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-sky-400" />
              <span>Generate Weekly Report</span>
            </button>
          </div>
        </div>

        {/* Context Indicator & Context Switcher Bar (Section 3) */}
        <div className="p-3.5 rounded-md bg-[#090D16] border border-slate-800/90 flex flex-col xl:flex-row xl:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                Current Context:
              </span>
              <span className="font-bold text-slate-100">
                {activeAthlete.name}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{context.sport}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{context.squad}</span>
            </div>

            <span className="hidden sm:inline text-slate-700">|</span>

            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase">
                Active Role Lens:
              </span>
              <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-[11px] font-semibold text-sky-300">
                {selectedRole}
              </span>
            </div>
          </div>

          {/* Context Switchers */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0F1623] border border-slate-800 rounded px-2.5 py-1">
              <span className="text-[10px] font-mono text-slate-400">
                Athlete:
              </span>
              <select
                value={activeAthlete.id}
                onChange={(e) => onSelectContextAthlete(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none"
              >
                {athletes.slice(0, 12).map((ath) => (
                  <option
                    key={ath.id}
                    value={ath.id}
                    className="bg-[#0F1623] text-slate-100"
                  >
                    {ath.name} ({ath.squad})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0F1623] border border-slate-800 rounded px-2.5 py-1">
              <span className="text-[10px] font-mono text-slate-400">
                Scope:
              </span>
              <select
                value={scopeMode}
                onChange={(e) => setScopeMode(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-slate-100 focus:outline-none"
              >
                <option value="Athlete Focus" className="bg-[#0F1623]">
                  Athlete Focus ({activeAthlete.name})
                </option>
                <option value="Squad Operations" className="bg-[#0F1623]">
                  Squad Operations ({context.squad})
                </option>
                <option value="Federation Oversight" className="bg-[#0F1623]">
                  Federation Oversight ({context.federation})
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Freshness Telemetry Bar (Section 23) */}
        <div className="px-3.5 py-2 rounded bg-[#0B101B] border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-2 font-mono">
            <span className="text-slate-400 uppercase text-[10px] flex items-center gap-1">
              <Clock className="w-3 h-3 text-sky-400" />
              <span>Telemetry Freshness:</span>
            </span>
            {dataFreshness.map((df, index) => (
              <React.Fragment key={df.id}>
                <span className="text-slate-300">
                  {df.domain} updated{' '}
                  <strong className="text-slate-100">{df.lastUpdated}</strong>
                </span>
                {index < dataFreshness.length - 1 && (
                  <span className="text-slate-600">·</span>
                )}
              </React.Fragment>
            ))}
            {showStaleSimulation && (
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-semibold flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                <span>⚠️ Recovery data is 4 days old (U19 Cohort)</span>
              </span>
            )}
          </div>

          <button
            onClick={() => setShowStaleSimulation((prev) => !prev)}
            className="text-[10px] font-mono text-slate-400 hover:text-sky-300 underline"
          >
            {showStaleSimulation
              ? 'Hide Stale Data Alert'
              : 'Simulate Stale Data Warning'}
          </button>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 border-t border-slate-800/80">
          {subTabs.map((tab) => {
            const active = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectSubTab(tab.id)}
                className={`px-3.5 py-2 rounded-md text-xs font-medium flex items-center gap-2 transition-colors whitespace-nowrap ${
                  active
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono text-[10px] ${
                      active
                        ? 'bg-sky-500/25 text-sky-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Delegate Action Centre, Risk Centre, Automation, or Audit views */}
      {activeSubTab !== 'ai-copilot' ? (
        <AIRiskAndActionViews
          mode={activeSubTab}
          selectedRole={selectedRole}
          actionItems={actionItems}
          riskSignals={riskSignals}
          automationRules={automationRules}
          automationAuditEvents={automationAuditEvents}
          aiAuditTrail={aiAuditTrail}
          dataFreshness={dataFreshness}
          onUpdateActionStatus={onUpdateActionStatus}
          onOpenTrainingModModal={onOpenTrainingModModal}
          onOpenEvidence={onOpenEvidence}
          onFeedbackRiskSignal={onFeedbackRiskSignal}
          onToggleAutomationRule={onToggleAutomationRule}
          onUpdateAutomationRule={onUpdateAutomationRule}
          onNavigateModule={onNavigateModule}
          onOpenAthlete360={onOpenAthlete360}
        />
      ) : (
        /* =========================================================
         * MAIN USI COPILOT INTERACTIVE WORKSPACE (SECTIONS 2-10, 14-18, 21-24)
         * ========================================================= */
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Left 8 Columns: Multi-Turn Operational Conversation & Prompt Console */}
          <div className="xl:col-span-8 space-y-4">
            {/* Prompt Input & Quick Slash Commands Card (Section 4) */}
            <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-4 space-y-3.5">
              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-sky-400 uppercase font-semibold flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    <span>OPERATIONAL INTELLIGENCE PROMPT</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        onSendQuery(
                          'Predict exact minute of next non-contact tear'
                        )
                      }
                      className="text-[10px] font-mono text-amber-300 hover:underline"
                    >
                      Test Uncertainty Guardrail
                    </button>
                    <span className="text-slate-700">·</span>
                    <button
                      type="button"
                      onClick={onClearConversation}
                      className="text-[10px] font-mono text-slate-400 hover:text-slate-200"
                    >
                      Reset Session Thread
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={queryInput}
                    onChange={(e) => setQueryInput(e.target.value)}
                    placeholder="Ask USI anything about your athletes, squads or operations..."
                    className="flex-1 px-3.5 py-2.5 rounded-md bg-[#090D16] border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 transition-colors shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Analyse & Explain</span>
                  </button>
                </div>

                {/* Quick Slash Commands */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                  <span className="text-[10px] font-mono text-slate-400 mr-1">
                    Slash Commands:
                  </span>
                  {AI_SLASH_COMMANDS.map((sc) => (
                    <button
                      key={sc.command}
                      type="button"
                      onClick={() => onSendQuery(sc.sampleQuery)}
                      title={`${sc.label}: ${sc.sampleQuery}`}
                      className="px-2 py-0.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-800 font-mono text-[11px] text-sky-400 transition-colors"
                    >
                      {sc.command}
                    </button>
                  ))}
                </div>
              </form>

              {/* Prompt Suggestion Chips */}
              <div className="pt-2.5 border-t border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-400 uppercase mb-2">
                  CONTEXTUAL OPERATIONAL QUERIES (CLICK TO RUN)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {AI_COPILOT_PROMPT_CHIPS.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => onSendQuery(chip)}
                      className="px-2.5 py-1.5 rounded bg-[#090D16] hover:bg-[#141D2E] border border-slate-800 hover:border-sky-500/40 text-xs text-slate-200 transition-colors text-left"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Multi-Turn Conversation Feed (Sections 5, 6, 15, 21, 22, 24) */}
            <div className="space-y-4">
              {messages.map((msg) =>
                msg.sender === 'user' ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-2xl p-3.5 rounded-lg bg-sky-500/15 border border-sky-500/30 text-xs text-slate-100">
                      <div className="flex items-center justify-between gap-4 text-[10px] font-mono text-sky-300 mb-1">
                        <span>
                          {msg.contextSnapshot?.role || selectedRole} · Context:{' '}
                          {msg.contextSnapshot?.athleteName ||
                            activeAthlete.name}{' '}
                          ({msg.contextSnapshot?.squad || context.squad})
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="font-semibold text-sm">{msg.queryText}</p>
                    </div>
                  </div>
                ) : (
                  <div
                    key={msg.id}
                    className={`bg-[#0F1623] border rounded-lg p-5 space-y-4 text-xs ${
                      msg.isUncertaintyState
                        ? 'border-amber-500/40'
                        : 'border-slate-800'
                    }`}
                  >
                    {/* Top Explanation Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded bg-sky-500/15 border border-sky-500/40 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-100 uppercase tracking-wide">
                          {msg.answerTitle || 'AI OPERATIONAL ANALYSIS'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Safety Class Pill */}
                        {msg.safetyClass && (
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                              msg.safetyClass === 'CONSEQUENTIAL'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : msg.safetyClass === 'RECOMMENDATION'
                                ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            {msg.safetyClass}
                          </span>
                        )}

                        {/* Qualitative Confidence (Section 21) */}
                        {msg.confidence && (
                          <span
                            className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                              msg.confidence === 'High'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : msg.confidence === 'Moderate'
                                ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            }`}
                          >
                            CONFIDENCE: {msg.confidence.toUpperCase()}
                          </span>
                        )}

                        {/* Why am I seeing this / View Evidence (Section 22) */}
                        {msg.evidenceBundle && (
                          <button
                            onClick={() => onOpenEvidence(msg.evidenceBundle!)}
                            className="px-2.5 py-1 rounded bg-[#090D16] hover:bg-slate-800 border border-sky-500/40 text-sky-300 font-mono text-[10px] inline-flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Why am I seeing this? · View Evidence</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 1. ANSWER */}
                    <div>
                      <div className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                        ANSWER
                      </div>
                      <p className="text-sm font-semibold text-slate-100 mt-1 leading-relaxed">
                        {msg.answerStatement}
                      </p>
                    </div>

                    {/* 2. EVIDENCE SUMMARY GRID */}
                    {msg.evidenceSummary && msg.evidenceSummary.length > 0 && (
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase font-bold mb-2">
                          EVIDENCE SIGNALS
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {msg.evidenceSummary.map((item, idx) => {
                            const toneColor =
                              item.tone === 'rose'
                                ? 'text-rose-300 border-rose-500/30 bg-rose-500/10'
                                : item.tone === 'amber'
                                ? 'text-amber-300 border-amber-500/30 bg-amber-500/10'
                                : item.tone === 'emerald'
                                ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
                                : 'text-sky-300 border-slate-800 bg-[#090D16]';
                            return (
                              <div
                                key={idx}
                                className={`p-2.5 rounded border flex items-center justify-between ${toneColor}`}
                              >
                                <span className="text-[11px] text-slate-300">
                                  {item.label}
                                </span>
                                <span className="font-mono font-bold text-xs">
                                  {item.value}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* OPTIONAL STRUCTURED TABLE (e.g. ATHLETES REQUIRING ATTENTION) */}
                    {msg.tableRows && msg.tableRows.length > 0 && (
                      <div className="rounded-md border border-slate-800 overflow-hidden">
                        <div className="bg-[#090D16] px-3.5 py-2 border-b border-slate-800 font-mono text-[10px] text-slate-400 uppercase font-bold">
                          OPERATIONAL COHORT BREAKDOWN
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="bg-[#0B101B] border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                                <th className="p-2.5">
                                  {msg.tableHeaders?.[0] || 'Athlete'}
                                </th>
                                <th className="p-2.5">
                                  {msg.tableHeaders?.[1] || 'Squad'}
                                </th>
                                <th className="p-2.5">
                                  {msg.tableHeaders?.[2] || 'Readiness / Metric'}
                                </th>
                                <th className="p-2.5">
                                  {msg.tableHeaders?.[3] || 'Key Driver'}
                                </th>
                                <th className="p-2.5">
                                  {msg.tableHeaders?.[4] || 'Status / Risk'}
                                </th>
                                <th className="p-2.5 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/80 bg-[#090D16]/60">
                              {msg.tableRows.map((row) => (
                                <tr
                                  key={row.id}
                                  className="hover:bg-[#141D2E] transition-colors"
                                >
                                  <td className="p-2.5 font-bold text-slate-100">
                                    {row.athleteName}
                                  </td>
                                  <td className="p-2.5 text-slate-400">
                                    {row.squad}
                                  </td>
                                  <td className="p-2.5 font-mono text-slate-200">
                                    <span className="text-slate-400 text-[10px] mr-1">
                                      {row.col1Label}:
                                    </span>
                                    <strong>{row.col1Value}</strong>
                                  </td>
                                  <td className="p-2.5 font-mono text-slate-200">
                                    <span className="text-slate-400 text-[10px] mr-1">
                                      {row.col2Label}:
                                    </span>
                                    <strong>{row.col2Value}</strong>
                                  </td>
                                  <td className="p-2.5">
                                    <span
                                      className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                                        row.riskTone === 'rose'
                                          ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                                          : row.riskTone === 'amber'
                                          ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                          : 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                      }`}
                                    >
                                      {row.riskOrStatus}
                                    </span>
                                  </td>
                                  <td className="p-2.5 text-right">
                                    {row.athleteId && (
                                      <button
                                        onClick={() =>
                                          onOpenAthlete360(row.athleteId!)
                                        }
                                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[10px]"
                                      >
                                        Open 360 →
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* OPTIONAL AI REPORT PREVIEW (Section 15) */}
                    {msg.generatedReportPreview && (
                      <div className="p-4 rounded-md bg-[#090D16] border border-sky-500/30 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                          <div>
                            <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                              AI-GENERATED EXECUTIVE BRIEFING
                            </span>
                            <h4 className="text-sm font-bold text-slate-100">
                              {msg.generatedReportPreview.title}
                            </h4>
                          </div>
                          <span className="text-[11px] font-mono text-slate-400">
                            Scope: {msg.generatedReportPreview.scope}
                          </span>
                        </div>

                        <p className="text-slate-300 leading-relaxed">
                          {msg.generatedReportPreview.executiveSummary}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {msg.generatedReportPreview.sections.map((sec, i) => (
                            <div
                              key={i}
                              className="p-2.5 rounded bg-[#0F1623] border border-slate-800"
                            >
                              <div className="font-mono text-[10px] text-sky-300 uppercase font-bold">
                                {sec.heading}
                              </div>
                              <p className="text-[11px] text-slate-300 mt-1">
                                {sec.summary}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-2">
                          <button
                            onClick={() =>
                              onNavigateModule('analytics-reports')
                            }
                            className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>Open Report in Analytics</span>
                          </button>
                          <button
                            onClick={() =>
                              onShowToast(
                                'Exported Weekly Senior Squad Performance Report (PDF)'
                              )
                            }
                            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs inline-flex items-center gap-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export PDF</span>
                          </button>
                          <button
                            onClick={() =>
                              onShowToast(
                                'Report shared with Performance Director & Coaching Staff'
                              )
                            }
                            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs inline-flex items-center gap-1"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 3. INTERPRETATION */}
                    {msg.interpretation && (
                      <div>
                        <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">
                          INTERPRETATION
                        </div>
                        <p className="text-slate-300 mt-1 leading-relaxed">
                          {msg.interpretation}
                        </p>
                      </div>
                    )}

                    {/* 4. RECOMMENDATION OR UNCERTAINTY ALTERNATIVE */}
                    {msg.isUncertaintyState ? (
                      <div className="p-3.5 rounded-md bg-amber-950/20 border border-amber-500/40 space-y-1.5">
                        <div className="text-[10px] font-mono text-amber-300 uppercase font-bold flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                          <span>
                            AI UNCERTAINTY & GUARDRAIL BOUNDARY (SECTION 24)
                          </span>
                        </div>
                        <p className="text-slate-200 font-medium">
                          {msg.uncertaintyAlternative}
                        </p>
                      </div>
                    ) : (
                      msg.recommendation && (
                        <div className="p-3.5 rounded-md bg-[#090D16] border border-amber-500/30">
                          <div className="text-[10px] font-mono text-amber-300 uppercase font-bold">
                            RECOMMENDATION (ADVISORY · HUMAN REVIEW)
                          </div>
                          <p className="text-slate-100 font-semibold mt-1">
                            {msg.recommendation}
                          </p>
                        </div>
                      )
                    )}

                    {/* 5. EXECUTABLE OPERATIONAL ACTIONS */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {msg.actions.map((act) => (
                            <button
                              key={act.id}
                              onClick={() => onExecuteCopilotAction(act)}
                              className={`px-3.5 py-2 rounded-md font-semibold text-xs inline-flex items-center gap-1.5 transition-colors ${
                                act.safetyClass === 'CONSEQUENTIAL'
                                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                                  : act.safetyClass === 'RECOMMENDATION'
                                  ? 'bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300'
                                  : 'bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200'
                              }`}
                            >
                              <span>{act.label}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Multi-Turn Follow-up Suggestions (Section 6) */}
                    {msg.followUpSuggestions &&
                      msg.followUpSuggestions.length > 0 && (
                        <div className="pt-2.5 border-t border-slate-800/70 flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-mono text-slate-400 mr-1">
                            Follow-up:
                          </span>
                          {msg.followUpSuggestions.map((followUp, i) => (
                            <button
                              key={i}
                              onClick={() => onSendQuery(followUp)}
                              className="px-2.5 py-1 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-800 text-[11px] text-sky-300 transition-colors"
                            >
                              "{followUp}"
                            </button>
                          ))}
                        </div>
                      )}
                  </div>
                )
              )}
            </div>
          </div>

          {/* Right 4 Columns: Role-Aware AI Lens, Medical Safety Boundaries & Live Pending Approvals */}
          <div className="xl:col-span-4 space-y-4">
            {/* Role-Aware AI Behavior Card (Section 16) */}
            <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-sky-400" />
                  <h3 className="font-bold text-slate-100 uppercase">
                    ROLE-AWARE AI LENS
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-[10px] text-sky-300 font-semibold">
                  {selectedRole}
                </span>
              </div>

              <div>
                <div className="text-[10px] font-mono text-slate-400 uppercase">
                  Primary Operational Focus
                </div>
                <p className="text-slate-200 font-medium mt-0.5">
                  {roleBehavior.focus}
                </p>
              </div>

              <div>
                <div className="text-[10px] font-mono text-emerald-400 uppercase">
                  Permitted AI-Assisted Approvals
                </div>
                <ul className="mt-1 space-y-1 text-[11px] text-slate-300">
                  {roleBehavior.allowedApprovals.map((app, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{app}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                <div className="text-[10px] font-mono text-amber-300 uppercase">
                  Role Permission Boundary
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {roleBehavior.restrictedScope}
                </p>
              </div>
            </div>

            {/* Medical Safety Boundaries (Section 18) */}
            <div className="bg-[#0F1623] border border-amber-500/30 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-slate-100 uppercase">
                  MEDICAL & CLINICAL AI GUARDRAILS
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <div className="font-mono text-[10px] text-emerald-400 uppercase font-bold">
                    AI MAY ASSIST WITH:
                  </div>
                  <p className="text-slate-300 mt-0.5">
                    • Flagging multi-signal risk · Summarizing clinical notes ·
                    Explaining workload/recovery trends · Highlighting RTP test
                    readiness
                  </p>
                </div>

                <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30">
                  <div className="font-mono text-[10px] text-rose-300 uppercase font-bold">
                    AI MUST NEVER AUTOMATICALLY:
                  </div>
                  <p className="text-rose-200/90 mt-0.5">
                    • Diagnose injuries · Clear athletes for competition ·
                    Override medical restrictions without clinician sign-off
                  </p>
                </div>
              </div>
            </div>

            {/* Pending Consequential Actions Queue Preview */}
            <div className="bg-[#0F1623] border border-slate-800 rounded-lg p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div>
                  <h3 className="font-bold text-slate-100 uppercase">
                    PENDING HUMAN APPROVALS ({pendingActionsCount})
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Consequential AI recommendations awaiting sign-off
                  </p>
                </div>
                <button
                  onClick={() => onSelectSubTab('ai-action-centre')}
                  className="text-[11px] font-mono text-sky-400 hover:underline"
                >
                  Open Queue →
                </button>
              </div>

              <div className="space-y-2.5">
                {actionItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded bg-[#090D16] border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-100">
                        {item.affectedAthleteName}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded font-mono text-[10px] font-bold ${
                          item.status === 'Applied' ||
                          item.status === 'Approved'
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-amber-500/15 text-amber-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {item.recommendation}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-[10px] text-slate-400">
                        Approver: {item.approverRole}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenEvidence(item.evidenceBundle)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300"
                        >
                          Evidence
                        </button>
                        {item.status === 'Pending Review' && (
                          <button
                            onClick={onOpenTrainingModModal}
                            className="px-2 py-0.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px]"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
