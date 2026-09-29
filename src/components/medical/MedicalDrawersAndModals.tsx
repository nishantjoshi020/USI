import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Lock,
  Plus,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import {
  Athlete,
  BodyRegionId,
  Injury,
  InjurySeverity,
  MedicalNoteRecord,
  RehabSessionRecord,
  UserRole,
} from '../../types/usi';
import { ALL_BODY_REGIONS } from '../../data/medicalMockData';
import { InteractiveBodyMap } from './InteractiveBodyMap';

/* =========================================================
 * 8. INJURY DETAIL DRAWER & 10. MEDICAL NOTES
 * ========================================================= */
interface InjuryDetailDrawerProps {
  injury: Injury | null;
  selectedRole: UserRole;
  onClose: () => void;
  onAddMedicalNote: (injuryId: string, note: Omit<MedicalNoteRecord, 'id'>) => void;
  onUpdateInjury: (
    injuryId: string,
    updates: Partial<Injury>,
    auditAction: string,
    toastMsg: string
  ) => void;
  onOpenCreateRehabSession: (injury: Injury) => void;
  onOpenAdvanceRtp: (injury: Injury) => void;
  onOpenAthlete360?: (athleteId: string) => void;
}

export const InjuryDetailDrawer: React.FC<InjuryDetailDrawerProps> = ({
  injury,
  selectedRole,
  onClose,
  onAddMedicalNote,
  onUpdateInjury,
  onOpenCreateRehabSession,
  onOpenAdvanceRtp,
  onOpenAthlete360,
}) => {
  const [activeActionForm, setActiveActionForm] = useState<
    'note' | 'pain' | 'restriction' | null
  >(null);

  // Add Medical Note state
  const [noteType, setNoteType] =
    useState<MedicalNoteRecord['noteType']>('Progress');
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Physiotherapist');
  const [noteDate, setNoteDate] = useState('28 Sep 2026');

  // Update Pain / Restriction state
  const [newPain, setNewPain] = useState<number>(injury?.painScore ?? 3);
  const [newRestriction, setNewRestriction] = useState<string>(
    injury?.restrictions ?? 'No maximal sprinting'
  );

  if (!injury) return null;

  const isRestrictedRole = selectedRole === 'Federation Admin';

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-[1px]"
      />

      <aside className="relative w-full max-w-xl bg-[#0F1623] border-l border-slate-800 h-full flex flex-col justify-between z-10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-rose-400">
              <span>CLINICAL INJURY RECORD</span>
              <span>·</span>
              <span>{injury.bodyRegionDisplay.toUpperCase()}</span>
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              {injury.athleteName} — {injury.diagnosis}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              {injury.sport} · {injury.squad} Squad · Lead Clinician: {injury.leadClinician}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAthlete360 && (
              <button
                onClick={() => {
                  onOpenAthlete360(injury.athleteId);
                  onClose();
                }}
                className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs text-sky-300 font-medium"
              >
                Athlete 360 →
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
          {/* Section 1: INJURY SUMMARY */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
            <div className="text-xs font-bold tracking-wider text-slate-200 pb-2.5 mb-3 border-b border-slate-800">
              INJURY SUMMARY
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 block text-[11px]">Athlete</span>
                <strong className="text-slate-100">{injury.athleteName}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Diagnosis</span>
                <strong className="text-slate-100">{injury.diagnosis}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Body Region</span>
                <strong className="text-sky-300">{injury.bodyRegionDisplay}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Severity</span>
                <strong className="text-amber-400 font-mono">{injury.severity}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Pain</span>
                <strong className="text-slate-100 font-mono tabular-nums">
                  {injury.painScore}/10
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Reported</span>
                <strong className="text-slate-200 font-mono">{injury.onsetDate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Status</span>
                <strong className="text-emerald-400">{injury.stage}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Medical Status</span>
                <strong className="text-amber-300">{injury.medicalStatus}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: CLINICAL INFORMATION */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-2.5">
            <div className="text-xs font-bold tracking-wider text-slate-200 pb-2 border-b border-slate-800">
              CLINICAL INFORMATION
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Mechanism</span>
                <strong className="text-slate-200 mt-0.5 block">
                  {injury.mechanism}
                </strong>
              </div>
              <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">
                  Initial Assessment
                </span>
                <strong className="text-slate-200 mt-0.5 block">
                  {injury.initialAssessment}
                </strong>
              </div>
              <div className="p-2.5 rounded bg-[#0F1623] border border-amber-500/30">
                <span className="text-amber-400 block text-[10px]">
                  Active Restrictions
                </span>
                <strong className="text-amber-200 mt-0.5 block">
                  {injury.restrictions}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 3: CURRENT RTP STAGE */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-mono text-sky-400 uppercase">
                  CURRENT RTP STAGE
                </span>
                <div className="text-sm font-bold text-slate-100">
                  Stage {injury.rtpStage} — {injury.rtpStageName}
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-slate-400 text-[11px] block">Progress</span>
                <strong className="text-base text-emerald-400 tabular-nums">
                  {injury.rehabProgressPct}%
                </strong>
              </div>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 rounded-full transition-all"
                style={{ width: `${injury.rehabProgressPct}%` }}
              />
            </div>
            {injury.overrideApproved && injury.overrideDetails && (
              <div className="mt-2.5 p-2 rounded bg-amber-950/30 border border-amber-500/40 text-[11px] text-amber-200 font-mono">
                RTP Gate Override Approved by {injury.overrideDetails.authorisedBy} ({injury.overrideDetails.timestamp}): "{injury.overrideDetails.reason}"
              </div>
            )}
          </div>

          {/* Section 4: QUICK ACTIONS */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-3">
            <div className="text-xs font-bold tracking-wider text-slate-200">
              QUICK ACTIONS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setActiveActionForm(
                    activeActionForm === 'note' ? null : 'note'
                  );
                }}
                className="px-3 py-2 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-center"
              >
                Add Medical Note
              </button>
              <button
                onClick={() => {
                  setNewPain(injury.painScore);
                  setActiveActionForm(
                    activeActionForm === 'pain' ? null : 'pain'
                  );
                }}
                className="px-3 py-2 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-center"
              >
                Update Pain
              </button>
              <button
                onClick={() => {
                  setNewRestriction(injury.restrictions);
                  setActiveActionForm(
                    activeActionForm === 'restriction' ? null : 'restriction'
                  );
                }}
                className="px-3 py-2 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-center"
              >
                Update Restriction
              </button>
              <button
                onClick={() => onOpenCreateRehabSession(injury)}
                className="px-3 py-2 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-sky-300 font-medium text-center"
              >
                Create Rehab Session
              </button>
              <button
                onClick={() => onOpenAdvanceRtp(injury)}
                className="px-3 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-center"
              >
                Advance RTP
              </button>
              <button
                onClick={() =>
                  onUpdateInjury(
                    injury.id,
                    {
                      stage: 'Escalated',
                      severity: 'Severe',
                      lastUpdated: 'Just now',
                    },
                    `Escalated injury case for ${injury.athleteName} (${injury.bodyRegionDisplay})`,
                    `Case escalated for ${injury.athleteName} — Chief Medical Officer notified`
                  )
                }
                className="px-3 py-2 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold text-center"
              >
                Escalate Case
              </button>
            </div>

            {/* Inline Quick Action Forms */}
            {activeActionForm === 'note' && (
              <div className="p-3.5 rounded bg-[#090D16] border border-sky-500/40 space-y-2.5 mt-2">
                <div className="font-bold text-sky-300">
                  Add Restricted Clinical Note
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <select
                    value={noteType}
                    onChange={(e) =>
                      setNoteType(
                        e.target.value as MedicalNoteRecord['noteType']
                      )
                    }
                    className="p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100"
                  >
                    <option value="Assessment">Assessment</option>
                    <option value="Treatment">Treatment</option>
                    <option value="Progress">Progress</option>
                    <option value="Restriction">Restriction</option>
                    <option value="Clearance">Clearance</option>
                  </select>
                  <input
                    type="text"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                    placeholder="Author"
                    className="p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100"
                  />
                  <input
                    type="text"
                    value={noteDate}
                    onChange={(e) => setNoteDate(e.target.value)}
                    className="p-2 rounded bg-[#0F1623] border border-slate-700 font-mono text-slate-100"
                  />
                </div>
                <textarea
                  rows={2}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter clinical progress, assessment, or clearance note..."
                  className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveActionForm(null)}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!noteText.trim()) return;
                      onAddMedicalNote(injury.id, {
                        injuryId: injury.id,
                        athleteId: injury.athleteId,
                        noteType,
                        note: noteText.trim(),
                        author: noteAuthor,
                        authorRole: selectedRole,
                        date: noteDate,
                      });
                      setNoteText('');
                      setActiveActionForm(null);
                    }}
                    className="px-3 py-1 rounded bg-sky-500 text-slate-950 font-semibold"
                  >
                    Save Medical Note
                  </button>
                </div>
              </div>
            )}

            {activeActionForm === 'pain' && (
              <div className="p-3.5 rounded bg-[#090D16] border border-sky-500/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200">
                    Update Subjective Pain Score (0–10 VAS)
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-400">
                    {newPain} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={newPain}
                  onChange={(e) => setNewPain(Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveActionForm(null)}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onUpdateInjury(
                        injury.id,
                        {
                          painScore: newPain,
                          gateCriteria: {
                            ...injury.gateCriteria,
                            painThresholdMet: newPain <= 2,
                          },
                        },
                        `Updated pain score to ${newPain}/10 for ${injury.athleteName}`,
                        `Updated pain score to ${newPain}/10`
                      );
                      setActiveActionForm(null);
                    }}
                    className="px-3 py-1 rounded bg-sky-500 text-slate-950 font-semibold"
                  >
                    Update Pain Score
                  </button>
                </div>
              </div>
            )}

            {activeActionForm === 'restriction' && (
              <div className="p-3.5 rounded bg-[#090D16] border border-sky-500/40 space-y-2.5">
                <div className="font-bold text-slate-200">
                  Update Operational Training Restriction
                </div>
                <input
                  type="text"
                  value={newRestriction}
                  onChange={(e) => setNewRestriction(e.target.value)}
                  className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setActiveActionForm(null)}
                    className="px-2.5 py-1 rounded bg-slate-800 text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onUpdateInjury(
                        injury.id,
                        { restrictions: newRestriction },
                        `Updated training restriction: "${newRestriction}"`,
                        `Restriction updated for ${injury.athleteName}`
                      );
                      setActiveActionForm(null);
                    }}
                    className="px-3 py-1 rounded bg-sky-500 text-slate-950 font-semibold"
                  >
                    Save Restriction
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: CHRONOLOGICAL MEDICAL NOTES (Restricted Governance Aware) */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold tracking-wider text-slate-200">
                  RESTRICTED CLINICAL NOTES ({injury.medicalNotes.length})
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Role: {selectedRole}
              </span>
            </div>

            {isRestrictedRole ? (
              <div className="p-3.5 rounded bg-[#0F1623] border border-amber-500/30 text-slate-300">
                Detailed clinical progress notes are restricted for{' '}
                <strong>Federation Admin</strong> role. Switch role to{' '}
                <strong>Physiotherapist</strong> or <strong>Performance Director</strong>{' '}
                in the top bar to view clinical narratives.
              </div>
            ) : (
              <div className="space-y-2.5">
                {injury.medicalNotes.map((mn) => (
                  <div
                    key={mn.id}
                    className="p-3 rounded bg-[#0F1623] border border-slate-800/90 space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-sky-400 font-semibold">
                        {mn.date} · {mn.noteType} Note
                      </span>
                      <span className="text-slate-400">
                        Author: {mn.authorRole} ({mn.author})
                      </span>
                    </div>
                    <p className="text-slate-200 leading-relaxed">
                      "{mn.note}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

/* =========================================================
 * 9. 6-STEP INJURY REPORTING WORKFLOW MODAL ([Report Injury])
 * ========================================================= */
interface ReportInjuryModalProps {
  isOpen: boolean;
  initialRegion?: BodyRegionId;
  athletes: Athlete[];
  existingInjuries: Injury[];
  onClose: () => void;
  onSubmitNewInjury: (newInjury: Injury) => void;
}

export const ReportInjuryModal: React.FC<ReportInjuryModalProps> = ({
  isOpen,
  initialRegion = 'Hamstring — Left',
  athletes,
  existingInjuries,
  onClose,
  onSubmitNewInjury,
}) => {
  const [step, setStep] = useState(1);
  const [selectedAthleteId, setSelectedAthleteId] = useState(
    athletes[0]?.id || 'ath-arjun-mehta'
  );
  const [selectedRegion, setSelectedRegion] =
    useState<BodyRegionId>(initialRegion);
  const [injuryTitle, setInjuryTitle] = useState('Hamstring Strain');
  const [diagnosis, setDiagnosis] = useState('Grade II Hamstring Strain');
  const [mechanism, setMechanism] = useState(
    'High-speed sprint deceleration during tactical session'
  );
  const [severity, setSeverity] = useState<InjurySeverity>('Moderate');
  const [painScore, setPainScore] = useState<number>(4);
  const [restrictions, setRestrictions] = useState(
    'No maximal sprinting; off-feet conditioning & isometric rehab only'
  );

  if (!isOpen) return null;

  const selectedAthlete =
    athletes.find((a) => a.id === selectedAthleteId) || athletes[0];
  const regionMeta =
    ALL_BODY_REGIONS.find((r) => r.id === selectedRegion) || ALL_BODY_REGIONS[0];

  const handleSubmit = () => {
    const newInj: Injury = {
      id: `inj-${Date.now()}`,
      athleteId: selectedAthlete.id,
      athleteName: selectedAthlete.name,
      sport: selectedAthlete.sport,
      position: selectedAthlete.position,
      squad: selectedAthlete.squad.includes('U23') ? 'U23' : 'Senior',
      bodyPart: regionMeta.displayLabel.replace('Left ', '').replace('Right ', ''),
      bodyRegion: selectedRegion,
      bodyRegionDisplay: regionMeta.displayLabel,
      side: selectedRegion.includes('Left')
        ? 'Left'
        : selectedRegion.includes('Right')
          ? 'Right'
          : 'Bilateral',
      injuryTitle,
      diagnosis,
      grade: severity === 'Severe' ? 'Grade II-III' : 'Grade I-II',
      severity,
      painScore,
      stage: 'Assessment',
      rtpStage: 1,
      rtpStageName: 'Pain Reduction & Acute Management',
      rehabProgressPct: 15,
      medicalStatus: 'Restricted',
      onsetDate: '28 Sep 2026',
      estimatedRtpDate: '12 Oct 2026',
      daysToRtp: 14,
      leadClinician: 'Dr. S. Patel',
      rehabCompliancePct: 100,
      mechanism,
      initialAssessment: `Reported ${painScore}/10 pain in ${regionMeta.displayLabel}`,
      restrictions,
      currentProtocol: 'New injury reported — initial clinical assessment & acute protection.',
      lastUpdated: 'Just now',
      gateCriteria: {
        painThresholdMet: painScore <= 2,
        strengthSymmetryMet: false,
        runningToleranceMet: false,
        functionalTestMet: false,
        medicalClearanceMet: false,
      },
      medicalNotes: [
        {
          id: `mn-${Date.now()}`,
          injuryId: `inj-${Date.now()}`,
          athleteId: selectedAthlete.id,
          noteType: 'Assessment',
          note: `Initial injury report logged: ${diagnosis} (${regionMeta.displayLabel}). Restrictions: ${restrictions}`,
          author: 'Dr. S. Patel',
          authorRole: 'Physiotherapist',
          date: '28 Sep 2026',
        },
      ],
    };

    onSubmitNewInjury(newInj);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-4xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-rose-400">
              CLINICAL INJURY REPORTING WORKFLOW
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              Report New Athlete Injury (Step {step} of 6)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6-Step Progress Bar */}
        <div className="px-5 py-2.5 bg-[#0B101B] border-b border-slate-800 flex items-center justify-between overflow-x-auto text-xs">
          {[
            '1. Select Athlete',
            '2. Select Body Region',
            '3. Describe Injury',
            '4. Severity & Pain',
            '5. Initial Restrictions',
            '6. Submit Report',
          ].map((label, idx) => {
            const sNum = idx + 1;
            const active = step === sNum;
            const done = step > sNum;
            return (
              <button
                key={label}
                onClick={() => setStep(sNum)}
                className={`px-2.5 py-1 rounded font-medium whitespace-nowrap ${
                  active
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                    : done
                      ? 'text-emerald-400'
                      : 'text-slate-500'
                }`}
              >
                {done ? `✓ ${label}` : label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {step === 1 && (
            <div className="space-y-3">
              <div className="text-sm font-bold text-slate-100">
                Step 1: Select Athlete
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {athletes.map((ath) => (
                  <button
                    key={ath.id}
                    onClick={() => setSelectedAthleteId(ath.id)}
                    className={`p-3 rounded-md border text-left transition-colors flex items-center justify-between ${
                      selectedAthleteId === ath.id
                        ? 'bg-sky-500/15 border-sky-500 text-slate-100'
                        : 'bg-[#0B101B] border-slate-800 text-slate-300 hover:bg-[#151E2E]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-100">{ath.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {ath.athleteId} · {ath.position} · {ath.squad}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-sky-400">
                      Readiness {ath.readiness}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm font-bold text-slate-100">
                  Step 2: Select Anatomical Body Region
                </div>
                <div className="px-3 py-1 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 font-mono font-semibold">
                  Body Region: {regionMeta.displayLabel}
                </div>
              </div>
              <InteractiveBodyMap
                injuries={existingInjuries.filter(
                  (i) => i.athleteId === selectedAthleteId
                )}
                selectedRegion={selectedRegion}
                onSelectRegion={(reg) => setSelectedRegion(reg)}
                athleteFilterName={selectedAthlete.name}
                compactSelectionMode={true}
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                Step 3: Describe Injury ({regionMeta.displayLabel})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">
                    Injury Classification
                  </label>
                  <input
                    type="text"
                    value={injuryTitle}
                    onChange={(e) => setInjuryTitle(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Clinical Working Diagnosis
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 mb-1">
                    Mechanism of Injury
                  </label>
                  <input
                    type="text"
                    value={mechanism}
                    onChange={(e) => setMechanism(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                Step 4: Severity & Pain Assessment
              </div>
              <div>
                <label className="block text-slate-400 mb-2">
                  Clinical Severity Tier
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['Minor', 'Moderate', 'Severe'] as const).map((sev) => (
                    <button
                      key={sev}
                      onClick={() => setSeverity(sev)}
                      className={`p-3.5 rounded-md border text-center font-bold transition-colors ${
                        severity === sev
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                          : 'bg-[#0B101B] border-slate-800 text-slate-400'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">
                    Pain Score (0–10 Slider)
                  </span>
                  <span className="text-lg font-mono font-bold text-amber-400 tabular-nums">
                    {painScore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={10}
                  value={painScore}
                  onChange={(e) => setPainScore(Number(e.target.value))}
                  className="w-full accent-sky-400"
                />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                Step 5: Initial Training & Load Restrictions
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Operational Restriction Directive (Visible to Coaching Staff)
                </label>
                <textarea
                  rows={3}
                  value={restrictions}
                  onChange={(e) => setRestrictions(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                Step 6: Review & Submit Injury Report
              </div>
              <div className="p-4 rounded bg-[#0B101B] border border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-slate-400 block text-[10px]">Athlete</span>
                  <strong className="text-slate-100">{selectedAthlete.name}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Body Region</span>
                  <strong className="text-sky-400">{regionMeta.displayLabel}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Diagnosis</span>
                  <strong className="text-slate-100">{diagnosis}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Severity & Pain</span>
                  <strong className="text-amber-400 font-mono">
                    {severity} · {painScore}/10
                  </strong>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[10px]">Restrictions</span>
                  <strong className="text-slate-200">{restrictions}</strong>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between">
          <button
            onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
            className="px-3.5 py-2 rounded bg-slate-800 text-xs text-slate-300"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          {step < 6 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs"
            >
              Submit Report
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
 * 13. CREATE REHAB SESSION MODAL
 * ========================================================= */
interface CreateRehabSessionModalProps {
  injury: Injury | null;
  onClose: () => void;
  onSaveSession: (injuryId: string, session: RehabSessionRecord) => void;
}

const PRESET_EXERCISES = [
  'Nordic Hamstring',
  'Single-Leg Bridge',
  'Controlled Acceleration',
  'Change of Direction',
  'Deceleration Drill',
];

export const CreateRehabSessionModal: React.FC<CreateRehabSessionModalProps> = ({
  injury,
  onClose,
  onSaveSession,
}) => {
  const [date, setDate] = useState('28 Sep 2026');
  const [professional, setProfessional] = useState('Dr. S. Patel (Physiotherapist)');
  const [focus, setFocus] = useState('Sport-specific running & eccentric strength');
  const [selectedExercises, setSelectedExercises] = useState<string[]>([
    'Nordic Hamstring',
    'Single-Leg Bridge',
    'Controlled Acceleration',
  ]);
  const [targetLoad, setTargetLoad] = useState('410 AU (85% Vmax)');
  const [painBefore, setPainBefore] = useState(3);
  const [painAfter, setPainAfter] = useState(2);
  const [notes, setNotes] = useState(
    'Completed all prescribed eccentric and acceleration sets without pain escalation.'
  );

  if (!injury) return null;

  const toggleExercise = (ex: string) => {
    setSelectedExercises((prev) =>
      prev.includes(ex) ? prev.filter((x) => x !== ex) : [...prev, ex]
    );
  };

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
              REHABILITATION SESSION LOGGING
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              Create Rehab Session — {injury.athleteName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-3.5 text-xs max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 mb-1">Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Professional</label>
              <input
                type="text"
                value={professional}
                onChange={(e) => setProfessional(e.target.value)}
                className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Session Focus</label>
              <input
                type="text"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Target Load</label>
              <input
                type="text"
                value={targetLoad}
                onChange={(e) => setTargetLoad(e.target.value)}
                className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1.5">
              Prescribed Rehab Exercises
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_EXERCISES.map((ex) => {
                const active = selectedExercises.includes(ex);
                return (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => toggleExercise(ex)}
                    className={`px-2.5 py-1.5 rounded border text-xs font-medium transition-colors ${
                      active
                        ? 'bg-sky-500/20 border-sky-500 text-sky-300'
                        : 'bg-[#090D16] border-slate-800 text-slate-400'
                    }`}
                  >
                    {active ? `✓ ${ex}` : `+ ${ex}`}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Pain Before</span>
                <strong className="font-mono text-amber-400">
                  {painBefore}/10
                </strong>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={painBefore}
                onChange={(e) => setPainBefore(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>

            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <div className="flex justify-between mb-1">
                <span className="text-slate-400">Pain After</span>
                <strong className="font-mono text-emerald-400">
                  {painAfter}/10
                </strong>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                value={painAfter}
                onChange={(e) => setPainAfter(Number(e.target.value))}
                className="w-full accent-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Clinical Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
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
              onSaveSession(injury.id, {
                id: `rsess-${Date.now()}`,
                injuryId: injury.id,
                athleteId: injury.athleteId,
                date,
                professional,
                focus,
                exercises: selectedExercises,
                targetLoad,
                painBefore,
                painAfter,
                notes,
                status: 'Completed',
              });
              onClose();
            }}
            className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs"
          >
            Save Completed Rehab Session
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
 * 15 & 16. RTP GATE CHECK & AUTHORISED OVERRIDE MODAL
 * ========================================================= */
interface RTPGateModalProps {
  injury: Injury | null;
  selectedRole: UserRole;
  onClose: () => void;
  onToggleCriterion: (
    injuryId: string,
    key: keyof Injury['gateCriteria']
  ) => void;
  onAdvanceStage: (
    injuryId: string,
    overrideDetails?: {
      reason: string;
      authorisedBy: string;
      timestamp: string;
    }
  ) => void;
  onRequestMedicalReview: (injuryId: string) => void;
}

const STAGE_NAMES: Record<number, string> = {
  1: 'Pain Reduction',
  2: 'Strength Restoration',
  3: 'Sport-Specific Training',
  4: 'Full Training',
  5: 'Return to Competition',
};

export const RTPGateModal: React.FC<RTPGateModalProps> = ({
  injury,
  selectedRole,
  onClose,
  onToggleCriterion,
  onAdvanceStage,
  onRequestMedicalReview,
}) => {
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideReason, setOverrideReason] = useState(
    'Clinical field test passed at 92% Vmax; Chief Medical Officer verbal clearance logged prior to tactical session.'
  );
  const [authorisedBy, setAuthorisedBy] = useState(
    `Dr. M. Raghavan (${selectedRole})`
  );
  const [timestamp, setTimestamp] = useState('28 Sep 2026 · 07:15');

  if (!injury) return null;

  const currentStage = injury.rtpStage;
  const nextStage = Math.min(5, currentStage + 1);
  const g = injury.gateCriteria;
  const allMet =
    g.painThresholdMet &&
    g.strengthSymmetryMet &&
    g.runningToleranceMet &&
    g.functionalTestMet &&
    g.medicalClearanceMet;

  const isMedicalAuthorized =
    selectedRole === 'Physiotherapist' || selectedRole === 'Performance Director';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-sky-400">
              RETURN-TO-PLAY CLINICAL GATE VERIFICATION
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5 uppercase">
              ADVANCE RETURN-TO-PLAY — {injury.athleteName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs max-h-[78vh] overflow-y-auto">
          {/* Current vs Next Stage */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block text-[11px]">
                Current Stage ({currentStage}/5)
              </span>
              <strong className="text-slate-100 text-sm mt-0.5 block">
                {STAGE_NAMES[currentStage] || injury.rtpStageName}
              </strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-sky-500/40">
              <span className="text-sky-400 block text-[11px]">
                Next Stage ({nextStage}/5)
              </span>
              <strong className="text-sky-200 text-sm mt-0.5 block">
                {STAGE_NAMES[nextStage] || 'Return to Competition'}
              </strong>
            </div>
          </div>

          {/* Required Criteria Checklist */}
          <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-slate-200 uppercase">
                Required Clinical & Performance Gate Criteria
              </span>
              <span className="text-[11px] text-slate-400">
                Click any criterion to toggle verification
              </span>
            </div>

            {(
              [
                { key: 'painThresholdMet', label: 'Pain ≤ 2/10' },
                {
                  key: 'strengthSymmetryMet',
                  label: 'Strength Symmetry ≥ 90%',
                },
                { key: 'runningToleranceMet', label: 'Running Tolerance' },
                { key: 'functionalTestMet', label: 'Functional Test' },
                { key: 'medicalClearanceMet', label: 'Medical Clearance' },
              ] as const
            ).map((item) => {
              const met = g[item.key];
              return (
                <button
                  key={item.key}
                  onClick={() => onToggleCriterion(injury.id, item.key)}
                  className={`w-full text-left px-3 py-2 rounded border flex items-center justify-between transition-colors ${
                    met
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/25 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <span className="font-medium">{item.label}</span>
                  <span className="font-mono font-bold">
                    {met ? '✓ Complete' : '✗ Pending'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Gate Result & Advisory AI Recommendation */}
          <div
            className={`p-4 rounded border ${
              allMet
                ? 'bg-emerald-950/20 border-emerald-500/50'
                : 'bg-amber-950/25 border-amber-500/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase text-slate-300">
                Gate Evaluation Result:
              </span>
              <span
                className={`font-mono font-bold text-sm ${
                  allMet ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {allMet ? 'READY TO ADVANCE ✓' : 'NOT READY'}
              </span>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex items-start gap-2">
              <Bot className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-sky-300">
                  AI Recommendation (Advisory)
                </div>
                <p className="text-slate-100 font-medium mt-0.5">
                  {allMet
                    ? '"All clinical, symmetry, and clearance criteria verified. Eligible to advance to Stage 4 Full Training."'
                    : '"Do not advance until medical clearance is completed."'}
                </p>
              </div>
            </div>
          </div>

          {/* 16. RETURN-TO-PLAY OVERRIDE FORM */}
          {showOverrideForm && !allMet && (
            <div className="p-4 rounded bg-rose-950/20 border border-rose-500/40 space-y-3">
              <div className="flex items-center gap-2 text-rose-300 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Authorised Professional Gate Override</span>
              </div>
              <p className="text-[11px] text-amber-200 font-mono">
                Warning: "Override actions are recorded in the audit trail."
              </p>

              <div className="space-y-2.5">
                <div>
                  <label className="block text-slate-300 mb-1">
                    Clinical Justification / Reason (Required) *
                  </label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-slate-300 mb-1">
                      Authorised By *
                    </label>
                    <input
                      type="text"
                      value={authorisedBy}
                      onChange={(e) => setAuthorisedBy(e.target.value)}
                      className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 mb-1">
                      Timestamp *
                    </label>
                    <input
                      type="text"
                      value={timestamp}
                      onChange={(e) => setTimestamp(e.target.value)}
                      className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-3.5 py-2 rounded bg-slate-800 text-xs text-slate-300"
          >
            Cancel
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {nextStage >= 4 && !isMedicalAuthorized ? (
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-mono text-[11px]">
                  🔒 Stage {nextStage}/5 Requires Medical Officer Clearance
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onRequestMedicalReview(injury.id);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  Request Chief Medical Officer Review
                </button>
              </div>
            ) : (
              <>
                {!allMet && !showOverrideForm && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowOverrideForm(true)}
                      className="px-3 py-2 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold text-xs"
                    >
                      Override Requirement
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onRequestMedicalReview(injury.id);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
                    >
                      Request Medical Review
                    </button>
                  </>
                )}

                {showOverrideForm && !allMet && (
                  <button
                    type="button"
                    onClick={() => {
                      if (!overrideReason.trim() || !authorisedBy.trim()) return;
                      onAdvanceStage(injury.id, {
                        reason: overrideReason.trim(),
                        authorisedBy: authorisedBy.trim(),
                        timestamp,
                      });
                      onClose();
                    }}
                    className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs"
                  >
                    Confirm Override & Advance to Stage {nextStage}/5
                  </button>
                )}

                {allMet && (
                  <button
                    type="button"
                    onClick={() => {
                      onAdvanceStage(injury.id);
                      onClose();
                    }}
                    className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs"
                  >
                    Advance Stage (to Stage {nextStage}/5)
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
