import React, { useState, useEffect } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  Calendar,
  Users,
} from 'lucide-react';
import { Athlete, MedicalClearanceStatus } from '../../types/usi';
import {
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
  onOpenSessionAssignmentForCreated?: (athlete: Athlete) => void;
  onNavigateLifecycle?: () => void;
}

const STEPS = [
  { num: 1, label: 'Basic Information' },
  { num: 2, label: 'Sport & Squad' },
  { num: 3, label: 'Documents' },
  { num: 4, label: 'Medical' },
  { num: 5, label: 'Verification' },
  { num: 6, label: 'Complete' },
];

const SPORT_POSITIONS: Record<string, { discipline: string; positions: string[] }> = {
  Football: {
    discipline: '11v11 Men',
    positions: ['Forward', 'Midfielder', 'Defender', 'Goalkeeper'],
  },
  Athletics: {
    discipline: 'Track & Field',
    positions: ['100m / 200m Sprint', '400m Hurdles', 'Javelin Throw', 'Long Jump', '800m / 1500m'],
  },
  'Field Hockey': {
    discipline: 'Men FIH Pro',
    positions: ['Drag Flicker', 'Center Half', 'Inside Forward', 'Fullback', 'Goalkeeper'],
  },
};

export const AthleteOnboardingModal: React.FC<AthleteOnboardingModalProps> = ({
  isOpen,
  onClose,
  onCreateAthlete,
  onViewCreatedAthlete,
  onOpenAssignCoachForCreated,
  onOpenSessionAssignmentForCreated,
  onNavigateLifecycle,
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
  const [heightCm, setHeightCm] = useState<number>(180);
  const [weightKg, setWeightKg] = useState<number>(74.5);

  // Step 2: Sport & Squad
  const [sport, setSport] = useState('Football');
  const [discipline, setDiscipline] = useState('11v11 Men');
  const [position, setPosition] = useState('Midfielder');
  const [program, setProgram] = useState("Senior Men's Program");
  const [squad, setSquad] = useState('Senior Squad');
  const [coach, setCoach] = useState('Vikram Sharma');
  const [jerseyNumber, setJerseyNumber] = useState<number>(18);
  const [initialReadiness, setInitialReadiness] = useState<number>(84);

  // Step 3: Documents
  const [docsUploaded, setDocsUploaded] = useState({
    identity: true,
    insurance: true,
    agreement: true,
  });

  // Step 4: Medical
  const [medicalStatus, setMedicalStatus] =
    useState<MedicalClearanceStatus>('Cleared');
  const [medicalNotes, setMedicalNotes] = useState(
    'Baseline pre-competition cardiac & musculoskeletal screening verified.'
  );

  // Created Athlete Reference for Step 6
  const [createdAthlete, setCreatedAthlete] = useState<Athlete | null>(null);

  useEffect(() => {
    if (isOpen && step === 6) {
      const randomNum = Math.floor(1200 + Math.random() * 700);
      setStep(1);
      setCreatedAthlete(null);
      setAthleteId(`ATH-${randomNum}`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSportChange = (nextSport: string) => {
    setSport(nextSport);
    const meta = SPORT_POSITIONS[nextSport] || SPORT_POSITIONS.Football;
    setDiscipline(meta.discipline);
    setPosition(meta.positions[0]);
    const matchingCoach = AVAILABLE_COACHES.find((c) => c.sport === nextSport);
    if (matchingCoach) {
      setCoach(matchingCoach.name);
    }
  };

  const resetFormForAnother = () => {
    const randomNum = Math.floor(1200 + Math.random() * 700);
    setFullName('');
    setContactEmail('');
    setAthleteId(`ATH-${randomNum}`);
    setStep(1);
    setCreatedAthlete(null);
  };

  const handleFinalizeOnboarding = () => {
    const allDocsDone =
      docsUploaded.identity && docsUploaded.insurance && docsUploaded.agreement;
    const cleanName = fullName.trim() || 'New Federation Athlete';
    const filePrefix = cleanName.replace(/\s+/g, '_');
    const birthYear = Number(dob.split('-')[0]) || 2003;
    const computedAge = Math.max(15, Math.min(45, 2026 - birthYear));
    const selectedCoachObj = AVAILABLE_COACHES.find((c) => c.name === coach);
    const cleanEmail =
      contactEmail.trim() ||
      `${cleanName.toLowerCase().replace(/\s+/g, '.')}@nhpp-sports.org`;

    const customDocs: Athlete['documents'] = [
      {
        id: `doc-id-${Date.now()}`,
        name: `Identity Document — ${filePrefix}_Passport_Verified.pdf`,
        category: 'Identity',
        status: docsUploaded.identity ? 'Verified' : 'Pending Review',
        uploadedBy: 'Federation Admin',
        lastUpdated: 'Today',
        expiry: '18 Apr 2032',
        fileSize: '1.8 MB PDF',
        notes: `National ID & Passport verified for ${cleanName}`,
      },
      {
        id: `doc-ins-${Date.now() + 1}`,
        name: `National Athlete Medical Insurance — ${filePrefix}.pdf`,
        category: 'Insurance',
        status: docsUploaded.insurance ? 'Verified' : 'Pending Review',
        uploadedBy: 'Operations Team',
        lastUpdated: 'Today',
        expiry: '31 Mar 2027',
        fileSize: '1.2 MB PDF',
        notes: 'Federation comprehensive sports injury coverage',
      },
      {
        id: `doc-agr-${Date.now() + 2}`,
        name: `NHPP Code of Conduct & Anti-Doping — ${filePrefix}.pdf`,
        category: 'Contracts',
        status: docsUploaded.agreement ? 'Verified' : 'Pending Review',
        uploadedBy: cleanName,
        lastUpdated: 'Today',
        expiry: '30 Sep 2027',
        fileSize: '940 KB PDF',
        notes: 'Signed athlete agreement and WADA compliance pledge',
      },
      {
        id: `doc-med-${Date.now() + 3}`,
        name: `Pre-Competition Cardiac & MSK Screening — ${filePrefix}.pdf`,
        category: 'Medical',
        status: medicalStatus === 'Cleared' ? 'Verified' : 'Pending Review',
        uploadedBy: 'Dr. S. Patel',
        lastUpdated: 'Today',
        expiry: '28 Sep 2027',
        fileSize: '2.1 MB PDF',
        notes: medicalNotes,
      },
    ];

    const newAthlete: Athlete = {
      id: `ath-${Date.now()}`,
      athleteId: athleteId || 'ATH-1194',
      name: cleanName,
      code: athleteId || 'ATH-1194',
      dob,
      gender,
      nationality,
      email: cleanEmail,
      phone: contactPhone,
      emergencyContact: `Verified Next-of-Kin (${contactPhone})`,
      sport,
      discipline,
      program,
      squad,
      subSquad: squad,
      position,
      jerseyNumber: Number(jerseyNumber) || 18,
      age: computedAge,
      heightCm: Number(heightCm) || 180,
      weightKg: Number(weightKg) || 74.5,
      coach,
      coachRole: selectedCoachObj?.role || 'Primary Coach',
      readiness: Number(initialReadiness) || 84,
      readinessDelta: +2,
      injuryRisk: medicalStatus === 'Restricted' ? 'Moderate' : 'Low',
      trainingLoad: medicalStatus === 'Restricted' ? 'Moderate' : 'Normal',
      trainingLoadPct: 76,
      acuteLoadAu: 540,
      chronicLoadAu: 525,
      acwr: 1.03,
      recovery: Math.min(98, (Number(initialReadiness) || 84) + 2),
      hrvMs: 71,
      hrvBaselineMs: 69,
      sleepHours: 7.9,
      sleepFormatted: '7h 54m',
      wellnessScore: 8.2,
      sorenessScore: medicalStatus === 'Restricted' ? 4 : 2,
      status:
        medicalStatus === 'Restricted'
          ? 'Restricted'
          : Number(initialReadiness) < 70
            ? 'Attention'
            : Number(initialReadiness) < 80
              ? 'Monitor'
              : 'Ready',
      trainingStatus:
        medicalStatus === 'Restricted'
          ? 'RESTRICTED'
          : medicalStatus === 'Cleared'
            ? 'ACTIVE'
            : 'PENDING',
      verificationStatus: allDocsDone ? 'Verified' : 'Pending',
      medicalStatus,
      profileCompletion:
        allDocsDone && medicalStatus === 'Cleared'
          ? 100
          : allDocsDone || medicalStatus === 'Cleared'
            ? 92
            : 84,
      profileCompletionBreakdown: {
        basicInfo: true,
        sportInfo: true,
        documents: allDocsDone,
        coachAssignment: Boolean(coach && coach !== 'Unassigned'),
        medicalClearance: medicalStatus === 'Cleared',
        emergencyContact: true,
      },
      lastUpdated: 'Just now',
      riskSignals: [
        `Enrolled in ${sport} · ${squad} (${position})`,
        `Initial readiness ${initialReadiness}/100 · Medical clearance: ${medicalStatus}`,
      ],
      previousInjuryHistory:
        medicalNotes || 'No prior injuries recorded at enrollment',
      nutritionCompliancePct: 92,
      hydrationStatus: 'Optimal',
      readinessHistory14d: Array.from({ length: 14 }, (_, i) =>
        Math.max(55, Math.min(99, (Number(initialReadiness) || 84) - 2 + (i % 4)))
      ),
      loadHistory14d: [
        480, 510, 0, 520, 535, 540, 310, 515, 525, 530, 545, 530, 535, 540,
      ],
      aiSummary: `${cleanName} (${athleteId}) is enrolled in ${sport} · ${squad} (${program}) as a ${position} under Coach ${coach}. Initial readiness is ${initialReadiness}/100 and medical clearance is ${medicalStatus}.`,
      keySignals: buildGenericSignals('7h 54m', 71, 540, 8.2),
      performanceScore: 84,
      aiPerformanceInsight: `${cleanName} completed initial ${sport} onboarding testing for ${squad}; baseline speed, power, and conditioning metrics are recorded.`,
      performanceMetrics: buildDefaultPerformanceMetrics(
        '4.22s',
        '48.5 cm',
        '19.4',
        '92%'
      ),
      documents: customDocs,
      timeline: [
        {
          id: `tl-onb-${Date.now()}`,
          date: 'Today',
          time: 'Just now',
          title: `Athlete profile enrolled: ${cleanName}`,
          description: `${sport} · ${position} · Assigned to ${squad} under Coach ${coach}`,
          category: 'Administrative',
          actor: 'Performance Director',
          detailNotes: `Completed 6-step federation onboarding workflow with ID ${athleteId}. Medical status: ${medicalStatus}. Note: ${medicalNotes}`,
        },
        {
          id: `tl-med-${Date.now() + 1}`,
          date: 'Today',
          time: 'Just now',
          title: `Initial medical intake (${medicalStatus})`,
          description: medicalNotes,
          category: 'Medical',
          actor: 'Dr. S. Patel',
          detailNotes: `Initial onboarding medical status set to ${medicalStatus}.`,
        },
      ],
      auditTrail: [
        {
          id: `aud-onb-${Date.now()}`,
          timestamp: 'Today · Just now',
          role: 'Performance Director',
          action: `Created athlete profile for ${cleanName} (${athleteId}) in ${sport} · ${squad}`,
        },
      ],
      recentSessions: [
        {
          sessionId: `sess-init-${Date.now()}`,
          title: `${sport} ${squad} Onboarding Baseline Session`,
          rpe: 6,
          loadAu: 540,
          highSpeedMeters: 420,
        },
      ],
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
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-lg bg-sky-500/10 border border-sky-500/30">
                <div className="flex items-center gap-2 text-sky-300">
                  <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
                  <span className="font-semibold text-xs">Testing candidate workflow? Pre-populate a fresh candidate:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const num = Math.floor(1200 + Math.random() * 800);
                      setFullName('Karanveer Deshmukh');
                      setAthleteId(`ATH-${num}`);
                      setPosition('Midfielder');
                      setDob('2003-04-18');
                      setContactEmail(`karanveer.${num}@nhpp-sports.org`);
                      setContactPhone('+91 98204 55190');
                      setCoach('Vikram Sharma');
                    }}
                    className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition-colors"
                  >
                    ⚡ Footballer (Karanveer)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const num = Math.floor(1200 + Math.random() * 800);
                      setFullName('Siddharth Malhotra');
                      setAthleteId(`ATH-${num}`);
                      setPosition('Center Back');
                      setDob('2004-08-22');
                      setContactEmail(`siddharth.${num}@nhpp-sports.org`);
                      setContactPhone('+91 98111 23456');
                      setCoach('Rahul Roy');
                    }}
                    className="px-2.5 py-1 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-[11px] transition-colors"
                  >
                    ⚡ Defender (Siddharth)
                  </button>
                </div>
              </div>

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
                    Contact Email
                  </label>
                  <input
                    type="text"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                    />
                  </div>
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
                    onChange={(e) => handleSportChange(e.target.value)}
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
                    {(SPORT_POSITIONS[sport]?.positions || SPORT_POSITIONS.Football.positions).map(
                      (pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      )
                    )}
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
                <div>
                  <label className="block text-slate-400 mb-1">
                    Jersey / Bib Number
                  </label>
                  <input
                    type="number"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(Number(e.target.value))}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Initial Readiness Baseline (0–100)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={initialReadiness}
                    onChange={(e) => setInitialReadiness(Number(e.target.value))}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 font-mono text-sky-400"
                  />
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

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
                <button
                  onClick={() => {
                    onViewCreatedAthlete(createdAthlete);
                    onClose();
                  }}
                  className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                >
                  View Athlete 360 →
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAssignCoachForCreated(createdAthlete);
                  }}
                  className="px-3.5 py-2 rounded-md bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs flex items-center gap-1.5"
                >
                  <Users className="w-3.5 h-3.5" />
                  Assign Coach
                </button>
                {onOpenSessionAssignmentForCreated && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSessionAssignmentForCreated(createdAthlete);
                    }}
                    className="px-3.5 py-2 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Assign to Training Session
                  </button>
                )}
                {onNavigateLifecycle && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateLifecycle();
                    }}
                    className="px-3.5 py-2 rounded-md bg-[#0B101B] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs"
                  >
                    Go to Lifecycle Hub
                  </button>
                )}
                <button
                  onClick={resetFormForAnother}
                  className="px-3 py-2 rounded-md bg-transparent hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs"
                >
                  + Add Another
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
