import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  ShieldCheck,
  Upload,
  UserPlus,
  X,
} from 'lucide-react';
import { Athlete, MedicalClearanceStatus } from '../../types/usi';
import {
  ARJUN_AUDIT_TRAIL,
  ARJUN_DOCUMENTS,
  ARJUN_TIMELINE,
  AVAILABLE_COACHES,
  buildDefaultPerformanceMetrics,
  buildGenericSignals,
} from '../../data/athlete360Defaults';

interface AthleteOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateAthlete: (newAthlete: Athlete) => void;
  onViewCreatedAthlete: (athlete: Athlete) => void;
  onOpenAssignCoachForCreated: (athlete: Athlete) => void;
}

const STEPS = [
  { num: 1, label: 'Basic Information' },
  { num: 2, label: 'Sport & Squad' },
  { num: 3, label: 'Documents' },
  { num: 4, label: 'Medical' },
  { num: 5, label: 'Verification' },
  { num: 6, label: 'Complete' },
];

export const AthleteOnboardingModal: React.FC<AthleteOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCreateAthlete,
  onViewCreatedAthlete,
  onOpenAssignCoachForCreated,
}) => {
  const [step, setStep] = useState<number>(1);

  // Step 1: Basic Information
  const [fullName, setFullName] = useState('Karanveer Deshmukh');
  const [dob, setDob] = useState('2003-04-18');
  const [gender, setGender] = useState('Male');
  const [nationality, setNationality] = useState('India');
  const [athleteId, setAthleteId] = useState('ATH-1194');
  const [contactEmail, setContactEmail] = useState('karanveer.d@nhpp-sports.org');
  const [contactPhone, setContactPhone] = useState('+91 98204 55190');

  // Step 2: Sport & Squad
  const [sport, setSport] = useState('Football');
  const [discipline, setDiscipline] = useState('11v11 Men');
  const [position, setPosition] = useState('Midfielder');
  const [program, setProgram] = useState("Senior Men's Program");
  const [squad, setSquad] = useState('Senior Squad');
  const [coach, setCoach] = useState('Vikram Sharma');

  // Step 3: Documents
  const [docsUploaded, setDocsUploaded] = useState({
    identity: true,
    insurance: true,
    agreement: true,
  });

  // Step 4: Medical
  const [medicalStatus, setMedicalStatus] =
    useState<MedicalClearanceStatus>('Pending');
  const [medicalNotes, setMedicalNotes] = useState(
    'Baseline pre-competition cardiac & musculoskeletal screening scheduled.'
  );

  // Created Athlete Reference for Step 6
  const [createdAthlete, setCreatedAthlete] = useState<Athlete | null>(null);

  if (!isOpen) return null;

  const resetFormForAnother = () => {
    const randomNum = Math.floor(1200 + Math.random() * 700);
    setFullName('');
    setAthleteId(`ATH-${randomNum}`);
    setStep(1);
    setCreatedAthlete(null);
  };

  const handleFinalizeOnboarding = () => {
    const allDocsDone =
      docsUploaded.identity && docsUploaded.insurance && docsUploaded.agreement;

    const newAthlete: Athlete = {
      id: `ath-${Date.now()}`,
      athleteId: athleteId || 'ATH-1194',
      name: fullName.trim() || 'New Federation Athlete',
      code: athleteId || 'ATH-1194',
      dob,
      gender,
      nationality,
      email: contactEmail,
      phone: contactPhone,
      emergencyContact: 'Verified Next-of-Kin (+91 98200 00001)',
      sport,
      discipline,
      program,
      squad,
      subSquad: squad,
      position,
      jerseyNumber: 18,
      age: 23,
      heightCm: 180,
      weightKg: 74.5,
      coach,
      coachRole: 'Primary Coach',
      readiness: 82,
      readinessDelta: +2,
      injuryRisk: 'Low',
      trainingLoad: 'Normal',
      trainingLoadPct: 72,
      acuteLoadAu: 540,
      chronicLoadAu: 520,
      acwr: 1.04,
      recovery: 84,
      hrvMs: 70,
      hrvBaselineMs: 68,
      sleepHours: 7.8,
      sleepFormatted: '7h 48m',
      wellnessScore: 8.1,
      sorenessScore: 2,
      status: 'Ready',
      trainingStatus: medicalStatus === 'Cleared' ? 'ACTIVE' : 'PENDING',
      verificationStatus: allDocsDone ? 'Verified' : 'Pending',
      medicalStatus,
      profileCompletion: medicalStatus === 'Cleared' ? 100 : 92,
      profileCompletionBreakdown: {
        basicInfo: true,
        sportInfo: true,
        documents: allDocsDone,
        coachAssignment: Boolean(coach && coach !== 'Unassigned'),
        medicalClearance: medicalStatus === 'Cleared',
        emergencyContact: true,
      },
      lastUpdated: 'Just now',
      riskSignals: ['Initial onboarding physiological baseline recorded'],
      previousInjuryHistory: 'No prior injuries recorded at enrollment',
      nutritionCompliancePct: 92,
      hydrationStatus: 'Optimal',
      readinessHistory14d: [80, 80, 81, 81, 82, 81, 82, 82, 83, 82, 81, 82, 82, 82],
      loadHistory14d: [480, 500, 0, 510, 520, 530, 300, 510, 520, 530, 540, 530, 535, 540],
      aiSummary: `${fullName || 'Athlete'} was enrolled into ${squad} (${program}). Initial readiness baseline is 82/100; medical clearance is currently ${medicalStatus}.`,
      keySignals: buildGenericSignals('7h 48m', 70, 540, 8.1),
      performanceScore: 81,
      aiPerformanceInsight:
        'Initial onboarding testing battery complete; acceleration and CMJ metrics meet Senior Squad entry standards.',
      performanceMetrics: buildDefaultPerformanceMetrics('4.25s', '48 cm', '19.5', '90%'),
      documents: ARJUN_DOCUMENTS.slice(0, 4),
      timeline: [
        {
          id: `tl-onb-${Date.now()}`,
          date: '28 Sep',
          time: 'Just now',
          title: 'Athlete profile enrolled in USI',
          description: `Assigned to ${squad} under Coach ${coach}`,
          category: 'Administrative',
          actor: 'Performance Director',
          detailNotes: `Completed 6-step federation onboarding workflow with ID ${athleteId}.`,
        },
        ...ARJUN_TIMELINE.slice(2, 4),
      ],
      auditTrail: [
        {
          id: `aud-onb-${Date.now()}`,
          timestamp: 'Today · Just now',
          role: 'Performance Director',
          action: `Created athlete profile (${athleteId}) via Onboarding Workflow`,
        },
        ...ARJUN_AUDIT_TRAIL,
      ],
      recentSessions: [],
      medicalNote: medicalNotes,
    };

    onCreateAthlete(newAthlete);
    setCreatedAthlete(newAthlete);
    setStep(6);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-3xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-sky-400">
              FEDERATION ENROLLMENT WORKFLOW
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">
              Add New Athlete to Unified Sports Interface
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 6-Step Indicator Bar */}
        <div className="px-5 py-3 bg-[#0B101B] border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[540px]">
            {STEPS.map((s, idx) => {
              const isCompleted = step > s.num;
              const isCurrent = step === s.num;
              return (
                <React.Fragment key={s.num}>
                  <button
                    onClick={() => {
                      if (s.num < 6 && step < 6) setStep(s.num);
                    }}
                    className="flex items-center gap-2 text-left focus:outline-none"
                  >
                    <div
                      className={`w-6 h-6 rounded-full font-mono text-xs font-bold flex items-center justify-center ${
                        isCompleted
                          ? 'bg-emerald-500 text-slate-950'
                          : isCurrent
                            ? 'bg-sky-500 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <span
                      className={`text-xs font-medium whitespace-nowrap ${
                        isCurrent
                          ? 'text-sky-300 font-semibold'
                          : isCompleted
                            ? 'text-slate-200'
                            : 'text-slate-500'
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div className="flex-1 h-px bg-slate-800 mx-2" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Step Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {/* STEP 1: BASIC INFORMATION */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                1. Basic Information
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter athlete full legal name"
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Athlete ID (Auto-assigned)
                  </label>
                  <input
                    type="text"
                    value={athleteId}
                    onChange={(e) => setAthleteId(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 font-mono text-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Contact Information (Email / Phone)
                  </label>
                  <input
                    type="text"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SPORT & SQUAD */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                2. Sport & Squad Assignment
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="block text-slate-400 mb-1">Discipline</label>
                  <input
                    type="text"
                    value={discipline}
                    onChange={(e) => setDiscipline(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Position / Event</label>
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
                  <label className="block text-slate-400 mb-1">Program</label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  >
                    <option value="Senior Men's Program">Senior Men's Program</option>
                    <option value="U-23 Olympic Development Program">
                      U-23 Olympic Development Program
                    </option>
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
                  <label className="block text-slate-400 mb-1">Assigned Coach</label>
                  <select
                    value={coach}
                    onChange={(e) => setCoach(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  >
                    {AVAILABLE_COACHES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.role} · {c.squad})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: DOCUMENTS */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                3. Required Compliance Documents
              </div>
              <p className="text-slate-400">
                Verify or attach required onboarding compliance documents.
              </p>

              <div className="space-y-2.5">
                {(
                  [
                    {
                      key: 'identity',
                      title: 'Identity Document (Passport / National ID)',
                      file: 'Passport_Verified_Scan.pdf',
                    },
                    {
                      key: 'insurance',
                      title: 'Insurance Certificate',
                      file: 'Federation_Medical_Policy_2026.pdf',
                    },
                    {
                      key: 'agreement',
                      title: 'Athlete Agreement',
                      file: 'NHPP_Code_of_Conduct_Signed.pdf',
                    },
                  ] as const
                ).map((item) => {
                  const uploaded = docsUploaded[item.key];
                  return (
                    <div
                      key={item.key}
                      className="p-3.5 rounded-md bg-[#0B101B] border border-slate-800 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-semibold text-slate-100">
                          {item.title}
                        </div>
                        <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                          {uploaded ? `Attached: ${item.file}` : 'Not attached'}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setDocsUploaded((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                        className={`px-3 py-1.5 rounded text-xs font-semibold ${
                          uploaded
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-sky-500 text-slate-950'
                        }`}
                      >
                        {uploaded ? '✓ Uploaded' : 'Upload File'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: MEDICAL */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                4. Initial Medical Clearance Status
              </div>
              <p className="text-slate-400">
                Record operational medical clearance status. Detailed clinical records are managed separately by licensed medical staff in the Medical module.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Pending', 'Cleared', 'Restricted'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setMedicalStatus(st)}
                    className={`p-3.5 rounded-md border text-left transition-colors ${
                      medicalStatus === st
                        ? 'bg-sky-500/15 border-sky-500 text-sky-300 font-semibold'
                        : 'bg-[#0B101B] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{st}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      {st === 'Pending' && 'Awaiting initial physio intake'}
                      {st === 'Cleared' && 'Full training eligibility confirmed'}
                      {st === 'Restricted' && 'Modified training load required'}
                    </div>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  Operational Intake Note (Non-sensitive)
                </label>
                <input
                  type="text"
                  value={medicalNotes}
                  onChange={(e) => setMedicalNotes(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
            </div>
          )}

          {/* STEP 5: VERIFICATION REVIEW */}
          {step === 5 && (
            <div className="space-y-4">
              <div className="text-sm font-bold text-slate-100">
                5. Verification Review
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <div className="text-slate-400">Profile</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">
                    ✓ Complete
                  </div>
                </div>
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <div className="text-slate-400">Documents</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">
                    ✓ Complete
                  </div>
                </div>
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <div className="text-slate-400">Medical</div>
                  <div className="text-sm font-bold text-amber-400 mt-1">
                    {medicalStatus}
                  </div>
                </div>
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <div className="text-slate-400">Coach</div>
                  <div className="text-sm font-bold text-sky-400 mt-1">
                    Assigned ({coach})
                  </div>
                </div>
              </div>

              <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-1.5 font-mono">
                <div>Name: {fullName}</div>
                <div>Generated Athlete ID: {athleteId}</div>
                <div>
                  Assignment: {sport} · {position} · {squad} ({program})
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: COMPLETE */}
          {step === 6 && createdAthlete && (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                  ATHLETE PROFILE CREATED
                </div>
                <h3 className="text-lg font-bold text-slate-100 mt-1">
                  {createdAthlete.name}
                </h3>
                <div className="text-xs font-mono text-sky-400 mt-1">
                  Generated Athlete ID: {createdAthlete.athleteId}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={() => {
                    onViewCreatedAthlete(createdAthlete);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
                >
                  View Athlete
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAssignCoachForCreated(createdAthlete);
                  }}
                  className="px-4 py-2 rounded-md bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs"
                >
                  Assign Coach
                </button>
                <button
                  onClick={resetFormForAnother}
                  className="px-4 py-2 rounded-md bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs"
                >
                  Add Another Athlete
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step < 6 && (
          <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between">
            <button
              onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
              className="inline-flex items-center gap-1 px-3.5 py-2 rounded bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{step === 1 ? 'Cancel' : 'Previous Step'}</span>
            </button>

            {step < 5 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="inline-flex items-center gap-1 px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
              >
                <span>Continue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinalizeOnboarding}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Create Athlete Profile</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
