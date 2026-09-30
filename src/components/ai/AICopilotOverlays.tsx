import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Cpu,
  Dumbbell,
  ExternalLink,
  Eye,
  FileText,
  Layers,
  Lock,
  Maximize2,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react';
import {
  AICopilotActionButton,
  AICopilotMessage,
  AIEvidenceBundle,
  AITrainingModificationItem,
  Athlete,
  HierarchyContext,
  NavItemId,
  UserRole,
} from '../../types/usi';
import { AI_ROLE_BEHAVIOR_MATRIX } from '../../data/aiCopilotMockData';

/* =========================================================
 * 1. AI EVIDENCE DRAWER (SECTION 22: "Why am I seeing this?" / "View Evidence")
 * ========================================================= */
interface AIEvidenceDrawerProps {
  evidence: AIEvidenceBundle | null;
  onClose: () => void;
  onOpenTrainingModModal?: () => void;
}

export const AIEvidenceDrawer: React.FC<AIEvidenceDrawerProps> = ({
  evidence,
  onClose,
  onOpenTrainingModModal,
}) => {
  if (!evidence) return null;

  const toneBadge = {
    rose: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    amber: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    sky: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
      />
      <aside className="relative w-full max-w-lg bg-[#0F1623] border-l border-slate-800 h-dvh max-h-dvh overflow-hidden flex flex-col justify-between z-10 shadow-2xl">
        {/* Header */}
        <div className="shrink-0 p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-sky-500/15 border border-sky-500/40 flex items-center justify-center">
              <Eye className="w-4 h-4 text-sky-400" />
            </div>
            <div>
              <div className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">
                AI EXPLAINABILITY & SOURCE TELEMETRY
              </div>
              <h2 className="text-sm font-bold text-slate-100 mt-0.5">
                EVIDENCE — {evidence.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-4 text-xs">
          {/* Subject & Qualitative Confidence (Section 21) */}
          <div className="p-3.5 rounded-md bg-[#0B101B] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                EVALUATED ENTITY
              </div>
              <div className="text-xs font-bold text-slate-100 mt-0.5">
                {evidence.subjectLabel}
              </div>
              <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                Telemetry Freshness: {evidence.generatedAt}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400 uppercase">
                AI CONFIDENCE
              </div>
              <span
                className={`inline-block mt-1 px-2.5 py-0.5 rounded border font-mono text-xs font-bold ${
                  evidence.confidence === 'High'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : evidence.confidence === 'Moderate'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                {evidence.confidence}
              </span>
            </div>
          </div>

          {/* Evidence Signals List */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
              MULTI-DOMAIN EVIDENCE SIGNALS ACCESSED
            </div>
            {evidence.metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-md bg-[#0B101B] border border-slate-800/90 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    {m.domain}: <span className="text-slate-400 font-normal">{m.label}</span>
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded border font-mono text-xs font-bold ${
                      toneBadge[m.tone]
                    }`}
                  >
                    {m.deltaOrValue}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {m.detail}
                </p>
              </div>
            ))}
          </div>

          {/* Shared AI Reasoning Architecture Pipeline */}
          <div className="p-3.5 rounded-md bg-[#0B101B] border border-slate-800 space-y-2">
            <div className="text-[10px] font-mono text-sky-400 uppercase">
              SHARED AI CONTEXT & GOVERNANCE PIPELINE
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-slate-300">
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                User & Role Context
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Connected Telemetry
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Advisory Reasoning
              </span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/30 text-amber-300">
                Human Approval Gate
              </span>
            </div>
          </div>

          {evidence.clinicalDisclaimer && (
            <div className="p-3.5 rounded-md bg-amber-950/20 border border-amber-500/30 text-[11px] text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300 block mb-0.5">
                Clinical & Operational Boundary:
              </strong>
              {evidence.clinicalDisclaimer}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium"
          >
            Close Evidence
          </button>
          {onOpenTrainingModModal && (
            <button
              onClick={() => {
                onClose();
                onOpenTrainingModModal();
              }}
              className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
            >
              Review Proposed Training Changes →
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

/* =========================================================
 * 2. PROPOSED TRAINING MODIFICATIONS & APPROVAL WORKFLOW MODAL (SECTIONS 7, 8, 35)
 * ========================================================= */
interface ProposedTrainingModificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  modifications: AITrainingModificationItem[];
  selectedRole: UserRole;
  onApproveModifications: (approvedItems: AITrainingModificationItem[]) => void;
}

export const ProposedTrainingModificationsModal: React.FC<
  ProposedTrainingModificationsModalProps
> = ({
  isOpen,
  onClose,
  modifications,
  selectedRole,
  onApproveModifications,
}) => {
  const [items, setItems] = useState<AITrainingModificationItem[]>(modifications);
  const [reviewIndividually, setReviewIndividually] = useState(false);
  const [confirmingApproval, setConfirmingApproval] = useState(false);

  if (!isOpen) return null;

  const selectedItems = items.filter((i) => i.approved);

  const toggleItemSelection = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: !item.approved } : item
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-3xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-[10px] font-bold">
                CONSEQUENTIAL ACTION · HUMAN APPROVAL REQUIRED
              </span>
              <span className="text-xs font-mono text-slate-400">
                Approver Lens: {selectedRole}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              {confirmingApproval
                ? 'APPROVE TRAINING MODIFICATIONS?'
                : 'PROPOSED TRAINING MODIFICATIONS'}
            </h2>
          </div>
          <button
            onClick={() => {
              setConfirmingApproval(false);
              onClose();
            }}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: Review Modifications OR Step 2: Explicit Confirmation */}
        {!confirmingApproval ? (
          <>
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-3.5 text-xs">
              <div className="p-3.5 rounded-md bg-[#0B101B] border border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-slate-400 block text-[11px]">
                    Target Session:
                  </span>
                  <strong className="text-slate-100 text-xs">
                    Tomorrow · High-Intensity Tactical & Maximal Sprint Block (09:30)
                  </strong>
                </div>
                <div className="text-right font-mono">
                  <span className="text-slate-400 block text-[10px]">
                    AFFECTED ATHLETES
                  </span>
                  <span className="text-sky-400 font-bold">
                    {selectedItems.length} of {items.length} Selected
                  </span>
                </div>
              </div>

              {items.map((mod) => (
                <div
                  key={mod.id}
                  className={`p-4 rounded-md border transition-colors ${
                    mod.approved
                      ? 'bg-[#0B101B] border-sky-500/40'
                      : 'bg-[#0B101B]/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-slate-800/80">
                    <div className="flex items-center gap-2.5">
                      {reviewIndividually && (
                        <input
                          type="checkbox"
                          checked={mod.approved}
                          onChange={() => toggleItemSelection(mod.id)}
                          className="rounded border-slate-700 bg-slate-900 text-sky-500"
                        />
                      )}
                      <span className="text-sm font-bold text-slate-100">
                        {mod.athleteName}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({mod.squad})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold border ${
                          mod.riskLevel === 'High'
                            ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {mod.riskLevel} Risk
                      </span>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="text-slate-300">
                        Readiness:{' '}
                        <strong className="text-amber-300">{mod.readiness}</strong>
                      </span>
                      <span className="text-slate-300">
                        Load:{' '}
                        <strong className="text-rose-400">{mod.loadChange}</strong>
                      </span>
                    </div>
                  </div>

                  {/* Prescription Change Box */}
                  <div className="mt-3 p-3 rounded bg-[#0F1623] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase block">
                        CURRENT PRESCRIPTION
                      </span>
                      <span className="text-xs font-mono text-rose-300 line-through">
                        {mod.currentPrescription}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-sky-400 shrink-0 hidden sm:block" />
                    <div className="sm:text-right">
                      <span className="text-[10px] font-mono text-emerald-400 uppercase block">
                        AI PROPOSED MODIFICATION
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-300">
                        {mod.proposedPrescription}
                      </span>
                    </div>
                  </div>

                  {/* Reason, Expected Load Impact, Medical/Training Context */}
                  <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                    <div className="p-2.5 rounded bg-[#090D16] border border-slate-800/80">
                      <span className="font-mono text-[10px] text-slate-400 uppercase block">
                        Reason
                      </span>
                      <p className="text-slate-200 mt-0.5 leading-relaxed">
                        {mod.reason}
                      </p>
                    </div>
                    <div className="p-2.5 rounded bg-[#090D16] border border-slate-800/80">
                      <span className="font-mono text-[10px] text-slate-400 uppercase block">
                        Expected Load Impact
                      </span>
                      <p className="text-emerald-300 font-mono font-semibold mt-0.5">
                        {mod.expectedLoadImpact}
                      </p>
                    </div>
                    <div className="p-2.5 rounded bg-[#090D16] border border-slate-800/80">
                      <span className="font-mono text-[10px] text-slate-400 uppercase block">
                        Medical / Training Context
                      </span>
                      <p className="text-amber-200/90 mt-0.5 leading-relaxed">
                        {mod.medicalTrainingContext}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Buttons: [Approve All] [Review Individually] [Cancel] */}
            <div className="shrink-0 p-4 border-t border-slate-800 bg-[#090D16] flex flex-wrap items-center justify-between gap-2">
              <button
                onClick={() => setReviewIndividually((prev) => !prev)}
                className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200"
              >
                {reviewIndividually
                  ? 'Hide Individual Selection'
                  : 'Review Individually'}
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setConfirmingApproval(true)}
                  disabled={
                    selectedItems.length === 0 ||
                    ['Federation Admin', 'Nutritionist', 'Athlete'].includes(selectedRole)
                  }
                  className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-45 disabled:cursor-not-allowed text-slate-950 font-semibold text-xs"
                >
                  {reviewIndividually
                    ? `Approve Selected (${selectedItems.length})`
                    : 'Approve All'}
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Step 2: Explicit Confirmation Dialog (Section 8) */
          <div className="p-6 space-y-5 text-xs overflow-y-auto min-h-0 flex-1">
            <div className="p-4 rounded-md bg-amber-950/20 border border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>APPROVE TRAINING MODIFICATIONS?</span>
              </div>
              <p className="text-slate-200 text-xs">
                <strong>{selectedItems.length} athlete assignments</strong> will be
                changed for tomorrow’s High-Intensity Tactical & Sprint Session.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1.5">
                <div className="font-mono text-[10px] text-sky-400 uppercase font-bold">
                  AUDIT EVENTS TO BE RECORDED
                </div>
                <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                  <li>• AI recommendation reviewed</li>
                  <li>• {selectedRole} approved</li>
                  <li>• Training session modified</li>
                </ul>
              </div>
              <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1.5">
                <div className="font-mono text-[10px] text-emerald-400 uppercase font-bold">
                  DOWNSTREAM MODULES UPDATED
                </div>
                <ul className="space-y-1 text-slate-300 font-mono text-[11px]">
                  <li>• Training Session & Athlete assignment</li>
                  <li>• Expected workload (-90 to -160 AU)</li>
                  <li>• Athlete timeline & Activity log</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setConfirmingApproval(false)}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onApproveModifications(selectedItems);
                  setConfirmingApproval(false);
                  onClose();
                }}
                className="px-5 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Approve</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* =========================================================
 * 3. GLOBAL CONTEXT-AWARE AI COPILOT SLIDE-OVER PANEL (SECTIONS 1, 3, 25, 35)
 * ========================================================= */
interface GlobalAICopilotSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  activeNav: NavItemId;
  selectedRole: UserRole;
  context: HierarchyContext;
  activeAthlete: Athlete;
  messages: AICopilotMessage[];
  onSendQuery: (query: string) => void;
  onClearConversation?: () => void;
  isThinking?: boolean;
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
  onExecuteAction: (action: AICopilotActionButton) => void;
  onOpenEvidence: (bundle: AIEvidenceBundle) => void;
  onExpandFullWorkspace: () => void;
}

export const GlobalAICopilotSlideOver: React.FC<
  GlobalAICopilotSlideOverProps
> = ({
  isOpen,
  onClose,
  activeNav,
  selectedRole,
  context,
  activeAthlete,
  messages,
  onSendQuery,
  onClearConversation,
  isThinking = false,
  selectedModel = 'gemini-3.8-flash',
  onSelectModel,
  onExecuteAction,
  onOpenEvidence,
  onExpandFullWorkspace,
}) => {
  const [inputVal, setInputVal] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const prevMsgCountRef = useRef<number>(messages.length);
  const prevRoleRef = useRef<UserRole>(selectedRole);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior,
      });
    }
  };

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTo({
        top: 0,
        behavior,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    if (prevRoleRef.current !== selectedRole) {
      prevRoleRef.current = selectedRole;
      prevMsgCountRef.current = messages.length;
      scrollToTop('smooth');
      return;
    }

    if (messages.length > prevMsgCountRef.current || isThinking) {
      const timer = setTimeout(() => {
        scrollToBottom('smooth');
      }, 40);
      prevMsgCountRef.current = messages.length;
      return () => clearTimeout(timer);
    } else if (messages.length === 1 && prevMsgCountRef.current > 1) {
      scrollToTop('smooth');
    }
    prevMsgCountRef.current = messages.length;
  }, [messages.length, selectedRole, isOpen, isThinking]);

  if (!isOpen) return null;

  const roleBehavior =
    AI_ROLE_BEHAVIOR_MATRIX[selectedRole] ||
    AI_ROLE_BEHAVIOR_MATRIX['Performance Director'];

  // Contextual Module Suggestion (Section 25) + Persona Fallback
  const moduleShortcutMap: Record<string, string> = {
    'command-center':
      roleBehavior.promptChips[0] || 'Why are these athletes at risk?',
    'athlete-360':
      selectedRole === 'Athlete'
        ? 'Explain my morning recovery telemetry and HRV baseline.'
        : 'Why is his readiness low?',
    periodisation: 'Review high-risk athlete assignments.',
    sessions: 'Review high-risk athlete assignments.',
    workload: 'Show me athletes with high workload and declining recovery.',
    'injury-intelligence': 'Summarize active rehabilitation cases and RTP gate criteria.',
    'injury-register': 'Summarize active rehabilitation cases and RTP gate criteria.',
    rehabilitation: 'Why is Arjun restricted?',
    'return-to-play': 'Who needs RTP review today?',
    readiness:
      'Analyze HRV suppression and CMJ neuromuscular fatigue across Senior Squad.',
    recovery: "Explain today's readiness changes.",
    nutrition:
      'Identify athletes with declining nutrition and hydration compliance.',
    'assessments-tid': 'Which 8 athletes are pending September assessment tests?',
    'analytics-bi': 'Give me a performance overview of the federation.',
    'analytics-federation': 'Give me a performance overview of the federation.',
  };

  const contextualPrompt =
    moduleShortcutMap[activeNav] ||
    roleBehavior.promptChips[0] ||
    "Should we modify tomorrow's high-intensity session for athletes at elevated risk?";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSendQuery(inputVal.trim());
    setInputVal('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-[1px]"
      />
      <aside className="relative w-full max-w-xl bg-[#0F1623] border-l border-slate-800 h-dvh max-h-dvh overflow-hidden flex flex-col z-10 shadow-2xl">
        {/* Header */}
        <div className="shrink-0 p-4 border-b border-slate-800 bg-[#090D16] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded bg-sky-500/15 border border-sky-500/40 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-sky-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-slate-100">
                  USI COPILOT
                </span>
                <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-[10px] text-sky-300 truncate">
                  {selectedRole}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {roleBehavior.personaTitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onSelectModel && (
              <select
                value={selectedModel}
                onChange={(e) => onSelectModel(e.target.value)}
                aria-label="Select Gemini Copilot Model"
                className="px-2 py-1 rounded bg-[#0F1623] border border-sky-500/40 text-[10px] font-mono text-sky-300 focus:outline-none focus:border-sky-400 hidden sm:block"
              >
                <option value="gemini-3.8-flash">Gemini 3.8 Flash</option>
                <option value="gemini-3.1-flash-lite">Gemini 3.1 Lite</option>
                <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro</option>
              </select>
            )}
            <button
              type="button"
              onClick={() => scrollToTop('smooth')}
              title="Scroll to Top of Conversation"
              className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => scrollToBottom('smooth')}
              title="Scroll to Latest Message"
              className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            {onClearConversation && (
              <button
                type="button"
                onClick={onClearConversation}
                title="Reset Persona Conversation Thread"
                className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => {
                onClose();
                onExpandFullWorkspace();
              }}
              title="Open Full USI Copilot Workspace"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-medium text-sky-300"
            >
              <Maximize2 className="w-3 h-3" />
              <span className="hidden sm:inline">Full Workspace</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Conversation Feed */}
        <div
          ref={chatScrollRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain scroll-smooth p-4 space-y-4 text-xs"
        >
          {messages.map((msg) =>
            msg.sender === 'user' ? (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] p-3 rounded-md bg-sky-500/15 border border-sky-500/30 text-slate-100">
                  <div className="text-[10px] font-mono text-sky-400 mb-1">
                    {msg.contextSnapshot?.role || selectedRole} · {msg.timestamp}
                  </div>
                  <div className="font-medium">{msg.queryText}</div>
                </div>
              </div>
            ) : (
              <div
                key={msg.id}
                className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <span className="font-mono text-[10px] font-bold text-sky-400 uppercase">
                    {msg.answerTitle || 'AI OPERATIONAL ANALYSIS'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {msg.confidence && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 font-mono text-[10px] text-slate-300">
                        Confidence: {msg.confidence}
                      </span>
                    )}
                    {msg.evidenceBundle && (
                      <button
                        onClick={() => onOpenEvidence(msg.evidenceBundle!)}
                        className="px-2 py-0.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 font-mono text-[10px]"
                      >
                        View Evidence
                      </button>
                    )}
                  </div>
                </div>

                {/* ANSWER */}
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase block">
                    ANSWER
                  </span>
                  <p className="text-slate-100 font-semibold mt-0.5 leading-relaxed">
                    {msg.answerStatement}
                  </p>
                </div>

                {/* EVIDENCE CHIPS */}
                {msg.evidenceSummary && msg.evidenceSummary.length > 0 && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block mb-1.5">
                      EVIDENCE
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {msg.evidenceSummary.map((ev, i) => (
                        <div
                          key={i}
                          className="p-2 rounded bg-[#0F1623] border border-slate-800/90 flex items-center justify-between gap-1"
                        >
                          <span className="text-slate-400 text-[11px] truncate">
                            {ev.label}
                          </span>
                          <span className="font-mono font-bold text-slate-100 text-[11px] shrink-0">
                            {ev.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* INTERPRETATION & RECOMMENDATION */}
                {msg.interpretation && (
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      INTERPRETATION
                    </span>
                    <p className="text-slate-300 mt-0.5 leading-relaxed">
                      {msg.interpretation}
                    </p>
                  </div>
                )}

                {msg.recommendation && (
                  <div className="p-2.5 rounded bg-[#0F1623] border border-amber-500/30">
                    <span className="text-[10px] font-mono text-amber-300 uppercase block">
                      RECOMMENDATION
                    </span>
                    <p className="text-slate-100 font-medium mt-0.5">
                      {msg.recommendation}
                    </p>
                  </div>
                )}

                {/* ACTIONS */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    {msg.actions.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => onExecuteAction(act)}
                        className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                          act.safetyClass === 'CONSEQUENTIAL'
                            ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                            : 'bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300'
                        }`}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}

                {/* Follow-up suggestions */}
                {msg.followUpSuggestions && msg.followUpSuggestions.length > 0 && (
                  <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5">
                    {msg.followUpSuggestions.map((sug, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSendQuery(sug)}
                        className="px-2 py-1 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 text-left"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {isThinking && (
            <div className="p-3.5 rounded-md bg-[#0B101B] border border-sky-500/40 flex items-center justify-between gap-2.5 animate-pulse">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-spin shrink-0" />
                <div>
                  <div className="font-mono text-[10px] font-bold text-sky-400 uppercase">
                    GEMINI ANALYSING LIVE CONTEXT
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Evaluating {selectedRole} view, {activeAthlete?.name || 'squad'}{' '}
                    telemetry & RTP gates...
                  </p>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-[9px] text-sky-300 shrink-0">
                {selectedModel}
              </span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSubmit}
          className="shrink-0 p-3.5 border-t border-slate-800 bg-[#090D16] space-y-2"
        >
          {/* Persona Prompt Chips & Slash Commands Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(roleBehavior.slashCommands || []).map((sc) => (
              <button
                key={sc.command}
                type="button"
                onClick={() => onSendQuery(sc.sampleQuery)}
                title={sc.label}
                className="px-2 py-0.5 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-800 font-mono text-[10px] text-sky-400 whitespace-nowrap shrink-0"
              >
                {sc.command}
              </button>
            ))}
            {(roleBehavior.promptChips || []).slice(0, 4).map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => onSendQuery(chip)}
                title={chip}
                className="px-2 py-0.5 rounded bg-[#0B101B] hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 whitespace-nowrap shrink-0 max-w-[220px] truncate"
              >
                {chip}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Ask USI Copilot as ${selectedRole}...`}
              className="flex-1 px-3 py-2 rounded bg-[#0F1623] border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
            <button
              type="submit"
              disabled={isThinking}
              className="px-3.5 py-2 rounded bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-semibold text-xs inline-flex items-center gap-1 shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isThinking ? 'Thinking...' : 'Ask'}</span>
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
};
