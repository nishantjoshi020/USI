import React, { useState, useEffect } from 'react';
import {
  Bot,
  Check,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Athlete, CoachProfile } from '../../types/usi';
import { AVAILABLE_COACHES } from '../../data/athlete360Defaults';
import { AiAssistanceMode } from './Athlete360Page';

/* =========================================================
 * 13. COACH ASSIGNMENT WORKFLOW MODAL
 * ========================================================= */
interface CoachAssignmentModalProps {
  athlete: Athlete | null;
  onClose: () => void;
  onConfirmAssignCoach: (
    athleteId: string,
    coach: CoachProfile,
    roleLabel: string,
    startDate: string
  ) => void;
}

export const CoachAssignmentModal: React.FC<CoachAssignmentModalProps> = ({
  athlete,
  onClose,
  onConfirmAssignCoach,
}) => {
  const [selectedCoach, setSelectedCoach] = useState<CoachProfile>(
    AVAILABLE_COACHES[0]
  );
  const [assignmentRole, setAssignmentRole] = useState('Primary Coach');
  const [startDate, setStartDate] = useState('28 Sep 2026');
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  useEffect(() => {
    if (athlete) {
      const currentMatch =
        AVAILABLE_COACHES.find((c) => c.name === athlete.coach) ||
        AVAILABLE_COACHES.find((c) => c.sport === athlete.sport) ||
        AVAILABLE_COACHES[0];
      setSelectedCoach(currentMatch);
      setAssignmentRole(athlete.coachRole || 'Primary Coach');
      setAssignedSuccess(false);
    }
  }, [athlete]);

  if (!athlete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10">
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-sky-400">
              COACH ASSIGNMENT WORKFLOW
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              Assign Coach — {athlete.name} ({athlete.athleteId})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* Available Coaches List */}
          <div>
            <div className="font-semibold text-slate-300 mb-2">
              Select Available Federation Coach
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_COACHES.map((c) => {
                const isSelected = selectedCoach.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      setSelectedCoach(c);
                      setAssignedSuccess(false);
                    }}
                    className={`p-3 rounded-md border text-left transition-colors ${
                      isSelected
                        ? 'bg-sky-500/15 border-sky-500 text-slate-100'
                        : 'bg-[#0B101B] border-slate-800 text-slate-300 hover:bg-[#151E2E]'
                    }`}
                  >
                    <div className="font-bold text-slate-100">{c.name}</div>
                    <div className="text-[11px] text-sky-400 mt-0.5">
                      {c.role} · {c.sport} · {c.squad}
                    </div>
                    <div className="text-[11px] font-mono text-slate-300 mt-1 flex items-center justify-between">
                      <span>Caseload: <strong>{c.currentAthletesCount}</strong>/20</span>
                      <span className={`text-[10px] font-bold ${
                        c.currentAthletesCount >= 20 ? 'text-rose-400' : c.currentAthletesCount >= 18 ? 'text-amber-400' : 'text-emerald-400'
                      }`}>
                        {c.currentAthletesCount >= 20 ? 'Capacity Full' : c.currentAthletesCount >= 18 ? 'Near Cap' : 'Available'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coach Caseload Capacity Banner */}
          <div className="p-3 rounded-md bg-[#090D16] border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Selected Coach Workload:</span>
              <strong className="text-sky-300">{selectedCoach.name}</strong>
              <span className="text-slate-500 font-mono">({selectedCoach.currentAthletesCount} / 20 athletes)</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold">
              Recommended Cap: 20
            </span>
          </div>

          {/* Assignment Confirmation Summary Box */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Coach Assignment Summary</span>
              <span className="text-[10px] font-mono text-sky-400">Admin assigns → Coach accepts → Athlete notified</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Athlete</span>
                <strong className="text-slate-100">{athlete.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Coach</span>
                <strong className="text-sky-300">{selectedCoach.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Role</span>
                <input
                  type="text"
                  value={assignmentRole}
                  onChange={(e) => setAssignmentRole(e.target.value)}
                  className="mt-0.5 w-full px-2 py-1 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Start Date</span>
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-0.5 w-full px-2 py-1 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>
          </div>

          {assignedSuccess && (
            <div className="p-3 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Coach Assigned ✓ — {selectedCoach.name} is now {assignmentRole} for{' '}
                {athlete.name}.
              </span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirmAssignCoach(
                athlete.id,
                selectedCoach,
                assignmentRole,
                startDate
              );
              setAssignedSuccess(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
          >
            {assignedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Coach Assigned ✓</span>
              </>
            ) : (
              <span>Assign Coach</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
 * 14. ATHLETE APPROVAL WORKFLOW MODAL ([Review Application])
 * ========================================================= */
interface AthleteApprovalModalProps {
  athlete: Athlete | null;
  onClose: () => void;
  onApproveAthlete: (athleteId: string) => void;
  onRequestChanges: (athleteId: string, reason: string) => void;
  onRejectAthlete: (athleteId: string, reason: string) => void;
}

export const AthleteApprovalModal: React.FC<AthleteApprovalModalProps> = ({
  athlete,
  onClose,
  onApproveAthlete,
  onRequestChanges,
  onRejectAthlete,
}) => {
  const [activeTier, setActiveTier] = useState<1 | 2 | 3>(1);
  const [tierStatus, setTierStatus] = useState<{
    admin: 'pending' | 'approved' | 'changes';
    coach: 'pending' | 'approved' | 'changes';
    medical: 'pending' | 'cleared' | 'restricted' | 'rejected';
  }>({
    admin: 'approved',
    coach: 'pending',
    medical: 'pending',
  });
  const [mode, setMode] = useState<'review' | 'request-changes' | 'reject'>('review');
  const [reason, setReason] = useState('Sports registration document is expired.');

  useEffect(() => {
    if (athlete) {
      setMode('review');
      setReason(athlete.verificationNotes || 'Sports registration document is expired.');
    }
  }, [athlete]);

  if (!athlete) return null;

  const isAllApproved = tierStatus.admin === 'approved' && tierStatus.coach === 'approved' && (tierStatus.medical === 'cleared' || tierStatus.medical === 'restricted');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-2xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10">
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-amber-400">
              MULTI-DISCIPLINARY 3-TIER APPROVAL FLOW
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              Review Application — {athlete.name} ({athlete.athleteId})
            </h2>
            <p className="text-[11px] text-slate-400">The athlete cannot approve their own data. Requires Admin, Coach, and Medical clearances.</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Tier Navigation Strip */}
        <div className="grid grid-cols-3 border-b border-slate-800 bg-[#0B101B] text-xs">
          <button
            onClick={() => setActiveTier(1)}
            className={`p-3 text-left border-r border-slate-800 transition-colors ${
              activeTier === 1 ? 'bg-sky-500/15 border-b-2 border-b-sky-500 text-sky-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="font-mono text-[10px] text-slate-500">LEVEL 1</div>
            <div className="font-semibold text-slate-200">Admin Verification</div>
            <div className={`text-[10px] font-mono mt-0.5 ${tierStatus.admin === 'approved' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              {tierStatus.admin === 'approved' ? '✓ Approved' : 'Pending Review'}
            </div>
          </button>

          <button
            onClick={() => setActiveTier(2)}
            className={`p-3 text-left border-r border-slate-800 transition-colors ${
              activeTier === 2 ? 'bg-sky-500/15 border-b-2 border-b-sky-500 text-sky-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="font-mono text-[10px] text-slate-500">LEVEL 2</div>
            <div className="font-semibold text-slate-200">Coach Sporting</div>
            <div className={`text-[10px] font-mono mt-0.5 ${tierStatus.coach === 'approved' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              {tierStatus.coach === 'approved' ? '✓ Approved' : 'Pending Review'}
            </div>
          </button>

          <button
            onClick={() => setActiveTier(3)}
            className={`p-3 text-left transition-colors ${
              activeTier === 3 ? 'bg-sky-500/15 border-b-2 border-b-sky-500 text-sky-300' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="font-mono text-[10px] text-slate-500">LEVEL 3</div>
            <div className="font-semibold text-slate-200">Medical Clearance</div>
            <div className={`text-[10px] font-mono mt-0.5 ${
              tierStatus.medical === 'cleared' ? 'text-emerald-400 font-bold' :
              tierStatus.medical === 'restricted' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}>
              {tierStatus.medical === 'cleared' ? '✓ Cleared' : tierStatus.medical === 'restricted' ? '⚠ Restricted' : 'Pending Review'}
            </div>
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          {/* LEVEL 1: ADMIN */}
          {activeTier === 1 && (
            <div className="space-y-3">
              <div className="font-bold text-slate-200 text-sm">Level 1 — Administrative Verification Checklist</div>
              <p className="text-slate-400 text-xs">Verifies identity, date of birth, national federation registration, team eligibility, and anti-doping consent.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Identity & DOB</span>
                  <strong className="text-slate-100">{athlete.name} · {athlete.dob || '2004-06-12'}</strong>
                </div>
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Registration State</span>
                  <strong className="text-slate-100">{athlete.documents.length} Valid Docs Attached</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setTierStatus({ ...tierStatus, admin: 'approved' })}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Approve Admin Verification ✓
                </button>
                <button
                  onClick={() => setMode('request-changes')}
                  className="px-3 py-2 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs"
                >
                  Request Changes
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 2: COACH */}
          {activeTier === 2 && (
            <div className="space-y-3">
              <div className="font-bold text-slate-200 text-sm">Level 2 — Coach Sporting Profile Verification</div>
              <p className="text-slate-400 text-xs">Coach reviews sporting discipline, position, playing level, ranking, and baseline targets.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Sport & Discipline</span>
                  <strong className="text-slate-100">{athlete.sport} · {athlete.position}</strong>
                </div>
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Squad Category</span>
                  <strong className="text-sky-300">{athlete.squad}</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setTierStatus({ ...tierStatus, coach: 'approved' })}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Approve Sporting Profile ✓
                </button>
                <button
                  onClick={() => setMode('request-changes')}
                  className="px-3 py-2 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs"
                >
                  Request Sporting Changes
                </button>
              </div>
            </div>
          )}

          {/* LEVEL 3: MEDICAL */}
          {activeTier === 3 && (
            <div className="space-y-3">
              <div className="font-bold text-slate-200 text-sm">Level 3 — Medical Clearance Assessment</div>
              <p className="text-slate-400 text-xs">Chief Medical Officer reviews pre-competition medical history, previous surgeries, and current restrictions.</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Cardiac & Musculoskeletal</span>
                  <strong className="text-emerald-400">ECG & Echo Screen Passed</strong>
                </div>
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">WADA Anti-Doping TUE</span>
                  <strong className="text-slate-100">0 Therapeutic Exemptions Needed</strong>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setTierStatus({ ...tierStatus, medical: 'cleared' })}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Issue Medical Clearance ✓
                </button>
                <button
                  onClick={() => setTierStatus({ ...tierStatus, medical: 'restricted' })}
                  className="px-3 py-2 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs"
                >
                  Clear with Restrictions
                </button>
              </div>
            </div>
          )}

          {/* Request Changes / Reject Sub-Form */}
          {mode !== 'review' && (
            <div className="p-4 rounded bg-[#0B101B] border border-amber-500/40 space-y-2">
              <label className="block font-semibold text-amber-300">
                {mode === 'request-changes'
                  ? 'Reason for Requesting Changes (Dispatched to Athlete Task Inbox):'
                  : 'Reason for Rejection (Required):'}
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Sports registration document is expired."
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>
          )}

          {/* Final Activated Banner */}
          {isAllApproved && (
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-sm">🟢</div>
                <div>
                  <div className="font-bold text-emerald-300 text-xs">Athlete Activated Ready</div>
                  <div className="text-[11px] text-slate-300">Admin: Approved · Sporting: Approved · Medical: Cleared</div>
                </div>
              </div>
              <button
                onClick={() => {
                  onApproveAthlete(athlete.id);
                  onClose();
                }}
                className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Confirm Full Activation</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between">
          <button onClick={onClose} className="px-3.5 py-2 rounded bg-slate-800 text-slate-300 hover:text-white text-xs">
            Close
          </button>
          {mode !== 'review' ? (
            <button
              onClick={() => {
                if (mode === 'request-changes') onRequestChanges(athlete.id, reason);
                else onRejectAthlete(athlete.id, reason);
                onClose();
              }}
              className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
            >
              Submit Feedback
            </button>
          ) : (
            <button
              onClick={() => {
                setTierStatus({ admin: 'approved', coach: 'approved', medical: 'cleared' });
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
            >
              Simulate All 3 Approvals
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
 * 16. AI ATHLETE ASSISTANCE DRAWER
 * ========================================================= */
interface AiAthleteAssistanceDrawerProps {
  athlete: Athlete | null;
  mode: AiAssistanceMode | null;
  onSwitchMode: (mode: AiAssistanceMode) => void;
  onClose: () => void;
  onApplySuggestedAction: (actionLabel: string) => void;
}

export const AiAthleteAssistanceDrawer: React.FC<
  AiAthleteAssistanceDrawerProps
> = ({ athlete, mode, onSwitchMode, onClose, onApplySuggestedAction }) => {
  if (!athlete || !mode) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-[1px]"
      />

      <aside className="relative w-full max-w-lg bg-[#0F1623] border-l border-slate-800 h-full flex flex-col justify-between z-10 shadow-2xl">
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Bot className="w-5 h-5 text-sky-400" />
            <div>
              <div className="text-xs font-mono text-sky-400">
                AI ATHLETE ASSISTANCE · {athlete.athleteId}
              </div>
              <h2 className="text-sm font-bold text-slate-100 uppercase mt-0.5">
                {mode === 'readiness' && 'EXPLAIN READINESS'}
                {mode === 'summary' && 'GENERATE AI SUMMARY'}
                {mode === 'risk' && 'IDENTIFY RISK FACTORS'}
                {mode === 'coach-brief' && 'PREPARE COACH BRIEF'}
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

        {/* Mode Switcher Tabs */}
        <div className="px-5 py-2.5 bg-[#0B101B] border-b border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          {(
            [
              { id: 'readiness', label: 'Explain Readiness' },
              { id: 'summary', label: 'AI Summary' },
              { id: 'risk', label: 'Identify Risk Factors' },
              { id: 'coach-brief', label: 'Prepare Coach Brief' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => onSwitchMode(tab.id)}
              className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
                mode === tab.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-slate-400">Readiness Score</div>
              <div className="text-2xl font-mono font-bold text-amber-400 mt-0.5">
                {athlete.readiness} <span className="text-xs text-slate-500">/ 100</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-slate-400">Confidence</div>
              <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
                High
              </div>
            </div>
          </div>

          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-2.5">
            <div className="font-bold text-slate-100 uppercase tracking-wide">
              Primary Contributing Factors ({athlete.name})
            </div>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>
                <strong>Autonomic & HRV status:</strong> Morning HRV rMSSD ({athlete.hrvMs} ms vs {athlete.hrvBaselineMs} ms baseline) with {athlete.recovery}% recovery index.
              </li>
              <li>
                <strong>Acute workload profile:</strong> Acute load ({athlete.acuteLoadAu} AU vs {athlete.chronicLoadAu} AU chronic, ACWR {athlete.acwr.toFixed(2)}).
              </li>
              <li>
                <strong>Sleep & subjective wellness:</strong> Averaging {athlete.sleepFormatted} sleep (Wellness {athlete.wellnessScore}/10, Soreness {athlete.sorenessScore}/10).
              </li>
              <li>
                <strong>Clinical & clearance context:</strong> Medical clearance is <strong>{athlete.medicalStatus}</strong> — {athlete.medicalNote || 'Cleared for full squad operations.'}
              </li>
            </ol>
          </div>

          {mode === 'coach-brief' && (
            <div className="p-4 rounded-md bg-[#0B101B] border border-sky-500/30 space-y-2">
              <div className="font-bold text-sky-300">
                READY-TO-SEND BRIEF FOR COACH {athlete.coach.toUpperCase()}
              </div>
              <p className="text-slate-200 leading-relaxed">
                "{athlete.name} ({athlete.athleteId} · {athlete.position}) is currently at Readiness {athlete.readiness}/100 ({athlete.trainingStatus}, Medical: {athlete.medicalStatus}). {athlete.readiness < 75 || athlete.medicalStatus !== 'Cleared' ? 'Recommend capping high-speed running at 75–85% volume and monitoring post-session soreness.' : 'Cleared for full tactical and physical training intensity today.'}"
              </p>
            </div>
          )}

          <div className="p-4 rounded-md bg-amber-950/20 border border-amber-500/40 space-y-1.5">
            <div className="text-[11px] font-bold text-amber-300 uppercase">
              Suggested Operational Action
            </div>
            <p className="text-sm font-semibold text-slate-100">
              {athlete.readiness < 75 || athlete.medicalStatus !== 'Cleared'
                ? `"Review tomorrow's high-intensity training exposure for ${athlete.name}."`
                : `"Maintain prescribed ${athlete.squad} training progression and post-session fueling for ${athlete.name}."`}
            </p>
            <p className="text-[11px] text-slate-400 pt-1">
              Note: AI insights synthesize telemetry signals to support human decision-makers and do not constitute a clinical diagnosis.
            </p>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded bg-slate-800 text-xs text-slate-300"
          >
            Close
          </button>
          <button
            onClick={() => {
              onApplySuggestedAction(
                `Logged AI readiness review & operational directive for ${athlete.name}`
              );
              onClose();
            }}
            className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
          >
            Log Decision to Timeline
          </button>
        </div>
      </aside>
    </div>
  );
};

interface EditAthleteProfileModalProps {
  athlete: Athlete | null;
  onClose: () => void;
  onSaveProfile: (
    athleteId: string,
    updates: Partial<Athlete>,
    auditAction: string
  ) => void;
}

export const EditAthleteProfileModal: React.FC<
  EditAthleteProfileModalProps
> = ({ athlete, onClose, onSaveProfile }) => {
  const [name, setName] = useState(athlete?.name || '');
  const [sport, setSport] = useState(athlete?.sport || 'Football');
  const [position, setPosition] = useState(athlete?.position || 'Forward');
  const [squad, setSquad] = useState(athlete?.squad || 'Senior Squad');
  const [trainingStatus, setTrainingStatus] = useState<Athlete['trainingStatus']>(
    athlete?.trainingStatus || 'ACTIVE'
  );
  const [readiness, setReadiness] = useState<number>(athlete?.readiness || 80);
  const [emergencyContact, setEmergencyContact] = useState(
    athlete?.emergencyContact || ''
  );
  const [medicalStatus, setMedicalStatus] = useState<Athlete['medicalStatus']>(
    athlete?.medicalStatus || 'Cleared'
  );
  const [medicalNote, setMedicalNote] = useState(athlete?.medicalNote || '');

  useEffect(() => {
    if (athlete) {
      setName(athlete.name);
      setSport(athlete.sport);
      setPosition(athlete.position);
      setSquad(athlete.squad);
      setTrainingStatus(athlete.trainingStatus);
      setReadiness(athlete.readiness);
      setEmergencyContact(athlete.emergencyContact);
      setMedicalStatus(athlete.medicalStatus);
      setMedicalNote(athlete.medicalNote || '');
    }
  }, [athlete]);

  if (!athlete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-lg bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-sky-400">
              ATHLETE PROFILE EDITOR
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              Edit Profile — {athlete.name} ({athlete.athleteId})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs overflow-y-auto flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Sport</label>
              <select
                value={sport}
                onChange={(e) => setSport(e.target.value)}
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              >
                <option value="Football">Football</option>
                <option value="Athletics">Athletics</option>
                <option value="Field Hockey">Field Hockey</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Position / Event</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Squad</label>
              <select
                value={squad}
                onChange={(e) => setSquad(e.target.value)}
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              >
                <option value="Senior Squad">Senior Squad</option>
                <option value="U23">U23</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Training Status</label>
              <select
                value={trainingStatus}
                onChange={(e) =>
                  setTrainingStatus(e.target.value as Athlete['trainingStatus'])
                }
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="RESTRICTED">RESTRICTED</option>
                <option value="INJURED">INJURED</option>
                <option value="IN REHAB">IN REHAB</option>
                <option value="RETURN TO PLAY">RETURN TO PLAY</option>
                <option value="PENDING">PENDING</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Medical Clearance</label>
              <select
                value={medicalStatus}
                onChange={(e) =>
                  setMedicalStatus(e.target.value as Athlete['medicalStatus'])
                }
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              >
                <option value="Cleared">Cleared</option>
                <option value="Pending">Pending</option>
                <option value="Restricted">Restricted</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Readiness Score (0–100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={readiness}
                onChange={(e) => setReadiness(Number(e.target.value))}
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 font-mono text-sky-400"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">
                Emergency Contact
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">
              Operational Medical / Readiness Note
            </label>
            <input
              type="text"
              value={medicalNote}
              onChange={(e) => setMedicalNote(e.target.value)}
              className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded bg-slate-800 text-xs text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const updatedBreakdown = {
                ...athlete.profileCompletionBreakdown,
                medicalClearance: medicalStatus === 'Cleared',
                emergencyContact: Boolean(
                  emergencyContact && emergencyContact !== 'unassigned'
                ),
              };
              const completedCount =
                Object.values(updatedBreakdown).filter(Boolean).length;
              const newPct = Math.min(
                100,
                Math.round((completedCount / 6) * 100)
              );
              const clampedReadiness = Math.max(
                1,
                Math.min(100, Number(readiness) || athlete.readiness)
              );
              const nextStatus: Athlete['status'] =
                medicalStatus === 'Restricted' || trainingStatus === 'RESTRICTED'
                  ? 'Restricted'
                  : clampedReadiness < 68 || trainingStatus === 'INJURED'
                    ? 'Attention'
                    : clampedReadiness < 80
                      ? 'Monitor'
                      : 'Ready';

              onSaveProfile(
                athlete.id,
                {
                  name: name.trim() || athlete.name,
                  sport,
                  position,
                  squad,
                  trainingStatus,
                  medicalStatus,
                  readiness: clampedReadiness,
                  status: nextStatus,
                  emergencyContact,
                  medicalNote,
                  aiSummary: `${name.trim() || athlete.name} (${athlete.athleteId}) in ${sport} · ${squad} (${position}) is currently ${trainingStatus} with Readiness ${clampedReadiness}/100 and ${medicalStatus} medical clearance. ${medicalNote}`,
                  profileCompletionBreakdown: updatedBreakdown,
                  profileCompletion: newPct,
                  lastUpdated: 'Just now',
                },
                `Updated athlete profile for ${name.trim() || athlete.name}: ${sport} · ${position} · ${squad} · Readiness ${clampedReadiness} · Medical ${medicalStatus} (${newPct}% complete)`
              );
              onClose();
            }}
            className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
          >
            Save Profile Changes
          </button>
        </div>
      </div>
    </div>
  );
};
