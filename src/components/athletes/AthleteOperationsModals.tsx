import React, { useState } from 'react';
import {
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
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
                    <div className="text-[11px] font-mono text-slate-400 mt-1">
                      Current Athletes: {c.currentAthletesCount}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assignment Confirmation Summary Box */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2">
              Coach Assignment Summary
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
  const [mode, setMode] = useState<'review' | 'request-changes' | 'reject'>(
    'review'
  );
  const [reason, setReason] = useState('Missing proof of insurance.');

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
            <div className="text-xs font-mono text-amber-400">
              FEDERATION VERIFICATION & APPROVAL WORKFLOW
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              Review Athlete Application — {athlete.name}
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Applicant</span>
              <strong className="text-slate-100">
                {athlete.name} ({athlete.athleteId})
              </strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Sport / Squad</span>
              <strong className="text-slate-100">
                {athlete.sport} · {athlete.squad}
              </strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block text-[11px]">
                Profile Completion
              </span>
              <strong className="font-mono text-emerald-400">
                {athlete.profileCompletion}%
              </strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Medical Status</span>
              <strong className="text-amber-300">{athlete.medicalStatus}</strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Documents</span>
              <strong className="text-slate-200">
                {athlete.documents.length} Attached
              </strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Current State</span>
              <strong className="text-amber-400">
                {athlete.verificationStatus}
              </strong>
            </div>
          </div>

          {mode !== 'review' && (
            <div className="p-4 rounded bg-[#0B101B] border border-amber-500/40 space-y-2">
              <label className="block font-semibold text-amber-300">
                {mode === 'request-changes'
                  ? 'Reason for Requesting Changes (Required):'
                  : 'Reason for Rejection (Required):'}
              </label>
              <input
                type="text"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Missing proof of insurance."
                className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex flex-wrap items-center justify-between gap-2">
          {mode === 'review' ? (
            <>
              <button
                onClick={() => setMode('reject')}
                className="px-3.5 py-2 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold text-xs"
              >
                Reject
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode('request-changes')}
                  className="px-3.5 py-2 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs"
                >
                  Request Changes
                </button>

                <button
                  onClick={() => {
                    onApproveAthlete(athlete.id);
                    onClose();
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Athlete</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-end gap-2 w-full">
              <button
                onClick={() => setMode('review')}
                className="px-3 py-1.5 rounded bg-slate-800 text-xs text-slate-300"
              >
                Back
              </button>
              <button
                onClick={() => {
                  if (!reason.trim()) return;
                  if (mode === 'request-changes') {
                    onRequestChanges(athlete.id, reason.trim());
                  } else {
                    onRejectAthlete(athlete.id, reason.trim());
                  }
                  onClose();
                }}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs"
              >
                {mode === 'request-changes'
                  ? 'Submit Changes Requested'
                  : 'Confirm Rejection'}
              </button>
            </div>
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
              Primary Contributing Factors
            </div>
            <ol className="space-y-2 text-slate-300 list-decimal list-inside">
              <li>
                <strong>Recovery decline:</strong> Morning HRV rMSSD ({athlete.hrvMs} ms) is depressed -14% below rolling baseline.
              </li>
              <li>
                <strong>Increased acute workload:</strong> Acute load ({athlete.acuteLoadAu} AU) spiked +22% over the last 72 hours.
              </li>
              <li>
                <strong>Reduced sleep consistency:</strong> Averaging {athlete.sleepFormatted} over 3 nights (↓ 11%).
              </li>
              <li>
                <strong>Recent hamstring complaint:</strong> Discomfort reported on 24 Sep (Pain 4/10) with prior injury history.
              </li>
            </ol>
          </div>

          {mode === 'coach-brief' && (
            <div className="p-4 rounded-md bg-[#0B101B] border border-sky-500/30 space-y-2">
              <div className="font-bold text-sky-300">
                READY-TO-SEND BRIEF FOR COACH {athlete.coach.toUpperCase()}
              </div>
              <p className="text-slate-200 leading-relaxed">
                "{athlete.name} ({athlete.athleteId}) is cleared for tactical walk-through and low-impact technical drills today, but high-speed running (&gt;21 km/h) should be capped at 75% volume pending afternoon physio review."
              </p>
            </div>
          )}

          <div className="p-4 rounded-md bg-amber-950/20 border border-amber-500/40 space-y-1.5">
            <div className="text-[11px] font-bold text-amber-300 uppercase">
              Suggested Operational Action
            </div>
            <p className="text-sm font-semibold text-slate-100">
              "Review tomorrow's high-intensity training exposure."
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
                `Logged AI readiness review & capped tomorrow's high-intensity exposure for ${athlete.name}`
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
  if (!athlete) return null;

  const [position, setPosition] = useState(athlete.position);
  const [squad, setSquad] = useState(athlete.squad);
  const [emergencyContact, setEmergencyContact] = useState(
    athlete.emergencyContact
  );
  const [medicalStatus, setMedicalStatus] = useState(athlete.medicalStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-lg bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10">
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

        <div className="p-5 space-y-3.5 text-xs">
          <div>
            <label className="block text-slate-400 mb-1">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
            >
              <option value="Forward">Forward</option>
              <option value="Midfielder">Midfielder</option>
              <option value="Defender">Defender</option>
              <option value="Goalkeeper">Goalkeeper</option>
            </select>
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

              onSaveProfile(
                athlete.id,
                {
                  position,
                  squad,
                  medicalStatus,
                  emergencyContact,
                  profileCompletionBreakdown: updatedBreakdown,
                  profileCompletion: newPct,
                  lastUpdated: 'Just now',
                },
                `Updated athlete profile & medical status (${newPct}% complete)`
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
