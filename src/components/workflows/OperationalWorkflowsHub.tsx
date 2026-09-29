import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Award,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock,
  Dumbbell,
  Eye,
  FileCheck,
  FileText,
  HeartPulse,
  Info,
  Layers,
  Lock,
  MapPin,
  RefreshCw,
  RotateCcw,
  Scale,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Athlete, BodyRegionId, Injury, TrainingSession, UserRole } from '../../types/usi';
import { InteractiveBodyMap } from '../medical/InteractiveBodyMap';

interface OperationalWorkflowsHubProps {
  athletes: Athlete[];
  injuries: Injury[];
  sessions: TrainingSession[];
  selectedRole: UserRole;
  onOpenOnboarding: () => void;
  onOpenApproval: (athlete: Athlete) => void;
  onOpenCoachAssignment: (athlete: Athlete) => void;
  onOpenAthlete360: (athlete: Athlete) => void;
  onOpenReportInjury: (region?: BodyRegionId, athleteId?: string) => void;
  onOpenSessionAssignment: (athleteId?: string) => void;
  onOpenCreateRehab: (injury: Injury) => void;
  onOpenAdvanceRtp: (injury: Injury) => void;
  onNavigate: (nav: string) => void;
  onTriggerToast: (msg: string) => void;
  onUpdateAthlete?: (athleteId: string, updates: Partial<Athlete>) => void;
}

type MainWorkflowTab = 'athlete-mgmt' | 'training-periodisation' | 'medical-intelligence' | 'connected-ecosystem';

export const OperationalWorkflowsHub: React.FC<OperationalWorkflowsHubProps> = ({
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
  onUpdateAthlete,
}) => {
  const [activeWorkflow, setActiveWorkflow] = useState<MainWorkflowTab>('athlete-mgmt');

  // ==========================================
  // WORKFLOW 1: ATHLETE MANAGEMENT STATE
  // ==========================================
  const [onboardingStage, setOnboardingStage] = useState<'invite' | 'profile' | 'validation' | 'approval' | 'assignment'>('approval');
  const [invitationForm, setInvitationForm] = useState({
    name: 'Rohit Kulkarni',
    email: 'rohit.k@nhpp-sports.org',
    athleteId: 'ATH-1205',
    sport: 'Athletics',
    discipline: '100m Sprint',
    squad: 'Senior Sprint Squad',
    dob: '2004-06-12',
    state: 'Maharashtra',
    joiningDate: '2026-10-01',
    initialCoach: 'Coach Rajesh (Sprints)',
  });
  const [isInviteGenerated, setIsInviteGenerated] = useState(false);
  const [aiValidationIssues, setAiValidationIssues] = useState<string[]>([
    'Emergency contact number missing country code (+91)',
    'Sports registration certificate expired on 15 Aug 2026',
    'Dominant foot not specified for track block start setting',
  ]);
  const [approvalLevels, setApprovalLevels] = useState<{
    admin: 'pending' | 'approved' | 'changes_requested';
    coach: 'pending' | 'approved' | 'changes_requested';
    medical: 'pending' | 'cleared' | 'cleared_restricted' | 'not_cleared';
  }>({
    admin: 'approved',
    coach: 'pending',
    medical: 'pending',
  });
  const [changeRequestReason, setChangeRequestReason] = useState('Sports registration document is expired. Please upload valid AFI credentials.');
  const [coachWorkloadState, setCoachWorkloadState] = useState<{
    selectedCoach: string;
    currentLoad: number;
    maxCapacity: number;
    assignedState: 'idle' | 'assigned' | 'accepted' | 'declined';
  }>({
    selectedCoach: 'Coach A (Sprints)',
    currentLoad: 18,
    maxCapacity: 20,
    assignedState: 'idle',
  });

  // ==========================================
  // WORKFLOW 2: TRAINING & PERIODISATION STATE
  // ==========================================
  const [trainingWorkflowStep, setTrainingWorkflowStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(6);
  const [triageAthletes, setTriageAthletes] = useState([
    {
      id: 'ath-1',
      name: 'Rahul Sharma',
      readiness: 8,
      readinessTier: 'Ready',
      session: 'Acceleration 6x30m (90% Vmax)',
      status: 'Ready',
      details: 'Well rested, sleep 8.2h, no pain.',
      modified: false,
    },
    {
      id: 'ath-2',
      name: 'Arjun Mehta',
      readiness: 5,
      readinessTier: 'Warning',
      session: 'Max Sprint 8x60m (95% Vmax)',
      status: 'Modify',
      details: 'Readiness 5/10, Sleep 5h, Knee Pain 4/10, Previous injury: Knee.',
      modified: false,
    },
    {
      id: 'ath-3',
      name: 'Aman Verma',
      readiness: 3,
      readinessTier: 'Critical',
      session: 'Max Lower Body Power Clean',
      status: 'Review',
      details: 'Adductor soreness 6/10, ACWR 1.48 (Elevated).',
      modified: false,
    },
  ]);
  const [athletePreCheckData, setAthletePreCheckData] = useState({
    readiness: 7,
    sleepHours: 7.5,
    fatigue: 3,
    muscleSoreness: 3,
    pain: 2,
    availability: 'Available',
  });
  const [sessionReviewState, setSessionReviewState] = useState<{
    plannedLoad: number;
    actualLoad: number;
    rpe: number;
    painPost: number;
    athleteNotes: string;
    coachStatus: 'pending' | 'approved' | 'flagged';
    coachNotes: string;
  }>({
    plannedLoad: 80,
    actualLoad: 92,
    rpe: 8,
    painPost: 1,
    athleteNotes: 'Felt strong during acceleration drive phase, slight tightness on rep 5.',
    coachStatus: 'pending',
    coachNotes: 'Exceeded target AU volume by +15%. Schedule cold immersion recovery before tomorrow.',
  });

  // ==========================================
  // WORKFLOW 3: MEDICAL & INJURY INTELLIGENCE STATE
  // ==========================================
  const [medicalWorkflowStep, setMedicalWorkflowStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>(2);
  const [selectedBodyRegion, setSelectedBodyRegion] = useState<BodyRegionId>('Hamstring — Right');
  const [bodyMapPathologyState, setBodyMapPathologyState] = useState<'Normal' | 'Pain' | 'Suspected' | 'Confirmed' | 'Recovering' | 'Cleared'>('Confirmed');
  const [injuryReportForm, setInjuryReportForm] = useState({
    athleteName: 'Rahul Sharma',
    dateTime: '28 Sep 2026, 16:30',
    activity: 'Max sprint acceleration drill (rep 4)',
    painLevel: 6,
    painType: 'Sharp pull on deceleration',
    symptoms: ['Sharp pain', 'Localized stiffness', 'Reduced knee flexion'],
    mechanism: 'High-speed eccentric knee extension during terminal swing',
    immediateTreatment: 'Ice + compression bandage applied pitchside by physio',
    canContinueTraining: 'No — Immediate withdrawal',
  });
  const [clinicalAssessment, setClinicalAssessment] = useState({
    diagnosis: 'Grade I Biceps Femoris Strain',
    severity: 'Moderate (Grade 1b)',
    mechanism: 'Eccentric deceleration strain at myotendinous junction',
    imaging: '1.5T MRI confirms focal hyperintensity without tendon avulsion',
    referral: 'In-house Sports Physio Protocol',
    estimatedRecovery: '7–14 days',
    clearanceStatus: 'Restricted (RTP Stage 2)',
  });
  const [rehabActivePhase, setRehabActivePhase] = useState<'Protection' | 'Strength' | 'Return to Sport'>('Strength');
  const [athleteRehabLog, setAthleteRehabLog] = useState({
    completed: true,
    painBefore: 4,
    painAfter: 2,
    rpe: 6,
    notes: 'Hamstring activation felt stable, no pinching on isometric bridges.',
  });
  const [rtpClearanceChecklist, setRtpClearanceChecklist] = useState({
    painFreeLoading: true,
    fullRomRestored: true,
    strengthLsiPassed: true,
    functionalJumpPassed: true,
    sportSpecificSprintPassed: false,
  });
  const [rtpClearanceVerdict, setRtpClearanceVerdict] = useState<'Cleared' | 'Cleared with Restrictions' | 'Not Cleared'>('Cleared with Restrictions');
  const [restrictionAppliedToSession, setRestrictionAppliedToSession] = useState(false);

  // ==========================================
  // WORKFLOW 4: CONNECTED ECOSYSTEM STATE
  // ==========================================
  const [simulationStepIndex, setSimulationStepIndex] = useState(0);
  const SIMULATION_STAGES = [
    {
      id: 'profile',
      title: '1. Athlete Profile & Clearance',
      owner: 'Admin & Medical',
      status: 'Active Athlete 100%',
      desc: 'Identity verified, medical history screened, anti-doping consent secured.',
    },
    {
      id: 'medical-status',
      title: '2. Medical Status & Body Map',
      owner: 'Physiotherapist',
      status: 'Grade I Hamstring Strain (Moderate)',
      desc: 'Right hamstring flagged on body map. Movement restrictions generated.',
    },
    {
      id: 'training-eligibility',
      title: '3. Training Eligibility & Filter',
      owner: 'System / AI',
      status: 'Restricted Eligibility (≤70% Vmax)',
      desc: 'Algorithm prevents coach from allocating high-speed sprint drills.',
    },
    {
      id: 'session-assignment',
      title: '4. Session Assignment & Adaptation',
      owner: 'Coach',
      status: 'Technical Drills Prescribed',
      desc: 'Coach assigns adapted low-intensity movement session.',
    },
    {
      id: 'training-data',
      title: '5. Training Telemetry Ingestion',
      owner: 'Sports Scientist & GPS',
      status: 'Speed Capped at 21.2 km/h (Pass)',
      desc: 'Wearable telemetry verifies player obeyed medical velocity ceiling.',
    },
    {
      id: 'injury-detection',
      title: '6. Live Risk & Fatigue Detection',
      owner: 'AI Engine',
      status: 'No Pain Flare-up Detected',
      desc: 'Post-session pain 1/10 confirmed. ACWR maintained at 1.08.',
    },
    {
      id: 'rehab-completion',
      title: '7. Rehabilitation Progress',
      owner: 'Physiotherapist & Athlete',
      status: 'Rehab Phase 2 Complete (85%)',
      desc: 'Isometric hamstring bridges and Nordics executed with 0 pain.',
    },
    {
      id: 'medical-clearance',
      title: '8. RTP Medical Clearance Board',
      owner: 'Chief Medical Officer',
      status: 'Cleared for Full Competition',
      desc: 'Force plate LSI 94% passed. Official sign-off issued.',
    },
    {
      id: 'training-modification',
      title: '9. Unrestricted Training Restoration',
      owner: 'Coach & Performance Director',
      status: 'Full Squad Selection Re-enabled',
      desc: 'Athlete restored to Starting XI selection pool for national trials.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Master Operational Workflow Switcher */}
      <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-sky-500/10 via-emerald-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider">
              <ClipboardCheck className="w-4 h-4 text-sky-400" />
              <span>HIGH-PERFORMANCE OPERATING SYSTEM</span>
              <span className="text-slate-600">·</span>
              <span className="text-emerald-400">ROLE-BASED OPERATIONAL WORKFLOWS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              End-to-End Operational Lifecycle & Multi-Disciplinary Governance
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              Transparent role-based workflows establishing who creates information, who reviews/approves it, what data is entered, and how states cascade downstream.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Active Viewing Role:</span>
            <span className="px-3 py-1.5 rounded-md bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/40">
              {selectedRole}
            </span>
          </div>
        </div>

        {/* 4 Main Operational Workflow Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-5">
          {[
            {
              id: 'athlete-mgmt' as const,
              title: '1. Athlete Management',
              subtitle: 'Onboarding · 3-Tier Approval · Coach Assignment',
              icon: UserCheck,
              accent: 'from-sky-500/20 to-sky-600/10 border-sky-500/40 text-sky-300',
              activeRing: 'ring-sky-500',
            },
            {
              id: 'training-periodisation' as const,
              title: '2. Training & Periodisation',
              subtitle: 'Director Obj · Periodisation · Triage & Review',
              icon: Dumbbell,
              accent: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/40 text-emerald-300',
              activeRing: 'ring-emerald-500',
            },
            {
              id: 'medical-intelligence' as const,
              title: '3. Medical & Injury Intel',
              subtitle: 'Report · Interactive Body Map · Rehab · RTP',
              icon: HeartPulse,
              accent: 'from-rose-500/20 to-rose-600/10 border-rose-500/40 text-rose-300',
              activeRing: 'ring-rose-500',
            },
            {
              id: 'connected-ecosystem' as const,
              title: '4. Connected Ecosystem',
              subtitle: 'Live Causal Simulator · Profile → RTP → Pitch',
              icon: Layers,
              accent: 'from-violet-500/20 to-violet-600/10 border-violet-500/40 text-violet-300',
              activeRing: 'ring-violet-500',
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeWorkflow === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkflow(tab.id)}
                className={`p-3.5 rounded-lg border text-left transition-all ${
                  isActive
                    ? `bg-gradient-to-br ${tab.accent} ring-2 ${tab.activeRing} shadow-lg`
                    : 'bg-[#090D16] border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-[#121826]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-current' : 'text-slate-400'}`} />
                  <span className="text-xs font-bold text-slate-100">{tab.title}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">{tab.subtitle}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          WORKFLOW 1: ATHLETE MANAGEMENT
          ========================================================================= */}
      {activeWorkflow === 'athlete-mgmt' && (
        <div className="space-y-6">
          {/* Workflow Chain Visualizer Bar */}
          <div className="bg-[#0B101B] border border-slate-800 rounded-lg p-4">
            <div className="text-[11px] font-mono text-sky-400 uppercase font-semibold mb-2">
              ATHLETE MANAGEMENT PIPELINE (GOVERNANCE & APPROVAL CHAIN)
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-sky-300 font-bold">Admin Creates Invite</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-200">Athlete Completes Profile</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">AI / System Validation</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold">3-Tier Verification (Admin → Coach → Medical)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">Active Athlete (100%)</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 font-bold">Coach Assignment & Acceptance</span>
            </div>
          </div>

          {/* Sub-Workflow Step Switcher */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'invite', label: 'Step 1 — Admin Invitation' },
              { id: 'profile', label: 'Step 2 — Athlete Profile Entry' },
              { id: 'validation', label: 'Step 3 — AI Validation Engine' },
              { id: 'approval', label: 'Step 4 — 3-Tier Approval Flow' },
              { id: 'assignment', label: 'Step 5 — Coach Assignment & Capacity' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setOnboardingStage(st.id as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  onboardingStage === st.id
                    ? 'bg-sky-500 text-slate-950 font-bold shadow'
                    : 'bg-[#0F1623] border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* STEP 1: ADMIN INVITATION */}
          {onboardingStage === 'invite' && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 1 — Admin Creates Athlete Invitation</h3>
                  <p className="text-xs text-slate-400">Who creates: <strong>Federation Admin</strong> · What happens next: System generates account and 0% profile with status = Invited</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">Status: {isInviteGenerated ? 'Invited' : 'Draft'}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Athlete Full Name</label>
                  <input
                    type="text"
                    value={invitationForm.name}
                    onChange={(e) => setInvitationForm({ ...invitationForm, name: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Email / Phone</label>
                  <input
                    type="text"
                    value={invitationForm.email}
                    onChange={(e) => setInvitationForm({ ...invitationForm, email: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">System Athlete ID</label>
                  <input
                    type="text"
                    value={invitationForm.athleteId}
                    onChange={(e) => setInvitationForm({ ...invitationForm, athleteId: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Sport</label>
                  <input
                    type="text"
                    value={invitationForm.sport}
                    onChange={(e) => setInvitationForm({ ...invitationForm, sport: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Discipline / Event</label>
                  <input
                    type="text"
                    value={invitationForm.discipline}
                    onChange={(e) => setInvitationForm({ ...invitationForm, discipline: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Team / Squad</label>
                  <input
                    type="text"
                    value={invitationForm.squad}
                    onChange={(e) => setInvitationForm({ ...invitationForm, squad: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={invitationForm.dob}
                    onChange={(e) => setInvitationForm({ ...invitationForm, dob: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Country / State</label>
                  <input
                    type="text"
                    value={invitationForm.state}
                    onChange={(e) => setInvitationForm({ ...invitationForm, state: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Initial Coach (Optional)</label>
                  <input
                    type="text"
                    value={invitationForm.initialCoach}
                    onChange={(e) => setInvitationForm({ ...invitationForm, initialCoach: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400 flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400" />
                  <span>On submit: Generates credential dispatch link + sets completion to 0% with status: Invited</span>
                </div>
                <button
                  onClick={() => {
                    setIsInviteGenerated(true);
                    onTriggerToast(`✓ Invitation generated for ${invitationForm.name} (${invitationForm.athleteId}) — Account created`);
                    setOnboardingStage('profile');
                  }}
                  className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Invitation & Account</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ATHLETE PROFILE ENTRY */}
          {onboardingStage === 'profile' && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 2 — Athlete Completes Personal Profile</h3>
                  <p className="text-xs text-slate-400">Who enters: <strong>Athlete</strong> · System calculates completion percentage and displays missing items</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">Profile Completion:</span>
                  <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/40">72%</span>
                </div>
              </div>

              {/* Ongoing Profile Status Table */}
              <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
                <div className="bg-[#090D16] p-3 grid grid-cols-12 font-bold text-slate-300 border-b border-slate-800">
                  <div className="col-span-3">Section</div>
                  <div className="col-span-4">Information Included</div>
                  <div className="col-span-3">Status</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>
                {[
                  { section: 'Identity', info: 'Full Name, DOB, Gender, Photo, Nationality, Contact', status: 'Complete', ok: true },
                  { section: 'Sporting', info: 'Sport, Discipline, Position, Level, Ranking, Personal Best', status: '⚠ Missing Dominant Foot', ok: false },
                  { section: 'Physical', info: 'Height (180cm), Weight (74.5kg), Preferred Location', status: 'Complete', ok: true },
                  { section: 'Emergency', info: 'Emergency Contact, Relationship, Phone', status: '⚠ Missing Contact Number', ok: false },
                  { section: 'Documents', info: 'ID Proof, Sports Registration, Consent Forms, Insurance', status: '⚠ Expired Registration Certificate', ok: false },
                  { section: 'Performance', info: 'Coach Assessment, Strengths, Targets (Staff Only)', status: '⚠ Coach Input Required', ok: false, staff: true },
                ].map((row, i) => (
                  <div key={i} className="p-3 grid grid-cols-12 items-center border-b border-slate-800/60 hover:bg-[#131B2B]">
                    <div className="col-span-3 font-semibold text-slate-100">{row.section}</div>
                    <div className="col-span-4 text-slate-400">{row.info}</div>
                    <div className="col-span-3">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        row.ok ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                        row.staff ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30' :
                        'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {row.ok ? '✓ Complete' : row.status}
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      {!row.ok && !row.staff ? (
                        <button
                          onClick={() => onTriggerToast(`Opening direct field editor for ${row.section}...`)}
                          className="px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-[11px] font-semibold"
                        >
                          Complete Field →
                        </button>
                      ) : row.staff ? (
                        <span className="text-[10px] text-slate-500 font-mono">Coach Owned</span>
                      ) : (
                        <span className="text-emerald-400 font-bold text-[11px]">✓ Verified</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-xs text-slate-400">
                  Athlete submits once initial sections are completed. Data passes automatically to AI validation.
                </div>
                <button
                  onClick={() => setOnboardingStage('validation')}
                  className="px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Pass to AI / System Validation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI VALIDATION ENGINE */}
          {onboardingStage === 'validation' && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 3 — System & AI Automated Validation</h3>
                  <p className="text-xs text-slate-400">AI checks for missing mandatory fields, duplicate athlete records, expired documents, and conflicting sporting categories.</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/40">
                  {aiValidationIssues.length} Items Require Attention
                </span>
              </div>

              <div className="bg-amber-950/20 border border-amber-500/40 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Validation Warning Flagged by System Copilot</span>
                </div>
                <div className="space-y-2">
                  {aiValidationIssues.map((issue, idx) => (
                    <div key={idx} className="flex items-start justify-between gap-3 text-xs bg-[#090D16] p-2.5 rounded border border-slate-800">
                      <div className="flex items-center gap-2 text-slate-200">
                        <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold flex items-center justify-center">!</span>
                        <span>{issue}</span>
                      </div>
                      <button
                        onClick={() => {
                          const next = aiValidationIssues.filter((_, i) => i !== idx);
                          setAiValidationIssues(next);
                          onTriggerToast(`✓ Resolved: ${issue}`);
                        }}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-mono"
                      >
                        Auto-Resolve ✓
                      </button>
                    </div>
                  ))}
                  {aiValidationIssues.length === 0 && (
                    <div className="text-emerald-400 text-xs font-semibold py-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>All validation checks passed! Athlete ready for Multi-Tier Approval pipeline.</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    setAiValidationIssues([]);
                    onTriggerToast('All validation warnings resolved.');
                  }}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Resolve All Warnings
                </button>
                <button
                  onClick={() => {
                    setOnboardingStage('approval');
                    onTriggerToast('Status updated: Submitted for Review — Dispatched to Admin, Coach, and Medical');
                  }}
                  className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Submit for Review (Status: Submitted for Review)</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 3-TIER APPROVAL FLOW */}
          {onboardingStage === 'approval' && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 4 — Multi-Disciplinary 3-Tier Approval Flow</h3>
                  <p className="text-xs text-slate-400">
                    <strong className="text-amber-300">Crucial Rule:</strong> The athlete cannot approve their own information. Activation requires sequential verification across Admin, Coach, and Medical.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">Candidate:</span>
                  <strong className="text-slate-100 text-xs font-mono">Rahul Sharma (ATH-1092)</strong>
                </div>
              </div>

              {/* 3 Tier Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Level 1: Admin */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between ${
                  approvalLevels.admin === 'approved' ? 'bg-emerald-950/15 border-emerald-500/40' :
                  approvalLevels.admin === 'changes_requested' ? 'bg-amber-950/20 border-amber-500/40' :
                  'bg-[#090D16] border-slate-800'
                }`}>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-sky-400 font-bold uppercase">LEVEL 1</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        approvalLevels.admin === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {approvalLevels.admin === 'approved' ? '✓ APPROVED' : 'PENDING'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-100 text-sm">Administrative Verification</div>
                    <p className="text-xs text-slate-400">Verifies Identity, DOB, Documents, Registration, Team Eligibility, and Consent Forms.</p>
                    <div className="text-[11px] text-slate-300 bg-[#0F1623] p-2 rounded border border-slate-800 space-y-1">
                      <div>✓ Passport / Govt ID Verified</div>
                      <div>✓ Anti-Doping Consent Signed</div>
                      <div>✓ State Federation NOC on file</div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setApprovalLevels({ ...approvalLevels, admin: 'approved' });
                        onTriggerToast('✓ Level 1: Administrative Verification Approved');
                      }}
                      className="flex-1 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        setApprovalLevels({ ...approvalLevels, admin: 'changes_requested' });
                        onTriggerToast(`Changes requested from athlete: ${changeRequestReason}`);
                      }}
                      className="px-2.5 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs"
                    >
                      Req Changes
                    </button>
                  </div>
                </div>

                {/* Level 2: Coach */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between ${
                  approvalLevels.coach === 'approved' ? 'bg-emerald-950/15 border-emerald-500/40' :
                  'bg-[#090D16] border-slate-800'
                }`}>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">LEVEL 2</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        approvalLevels.coach === 'approved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {approvalLevels.coach === 'approved' ? '✓ APPROVED' : 'PENDING'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-100 text-sm">Coach Sporting Verification</div>
                    <p className="text-xs text-slate-400">Coach reviews sport, discipline, position, playing level, experience, ranking, and baseline targets.</p>
                    <div className="text-[11px] text-slate-300 bg-[#0F1623] p-2 rounded border border-slate-800 space-y-1">
                      <div>• Category: Senior 100m Sprint</div>
                      <div>• Personal Best: 10.42s (AFI National)</div>
                      <div>• Starting Block Setup: Left dominant</div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setApprovalLevels({ ...approvalLevels, coach: 'approved' });
                        onTriggerToast('✓ Level 2: Coach Sporting Profile Approved');
                      }}
                      className="flex-1 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Approve Sporting Profile
                    </button>
                    <button
                      onClick={() => {
                        setApprovalLevels({ ...approvalLevels, coach: 'changes_requested' });
                        onTriggerToast('Coach requested modification of event discipline.');
                      }}
                      className="px-2.5 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs"
                    >
                      Req Changes
                    </button>
                  </div>
                </div>

                {/* Level 3: Medical */}
                <div className={`p-4 rounded-lg border flex flex-col justify-between ${
                  approvalLevels.medical === 'cleared' ? 'bg-emerald-950/15 border-emerald-500/40' :
                  approvalLevels.medical === 'cleared_restricted' ? 'bg-amber-950/20 border-amber-500/40' :
                  'bg-[#090D16] border-slate-800'
                }`}>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-rose-400 font-bold uppercase">LEVEL 3</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        approvalLevels.medical === 'cleared' ? 'bg-emerald-500/20 text-emerald-300' :
                        approvalLevels.medical === 'cleared_restricted' ? 'bg-amber-500/20 text-amber-300' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {approvalLevels.medical === 'cleared' ? '✓ CLEARED' :
                         approvalLevels.medical === 'cleared_restricted' ? 'RESTRICTED' : 'PENDING'}
                      </span>
                    </div>
                    <div className="font-bold text-slate-100 text-sm">Medical Clearance</div>
                    <p className="text-xs text-slate-400">Medical staff reviews history, existing injuries, surgeries, allergies, and restrictions. Does not alter basic identity.</p>
                    <div className="text-[11px] text-slate-300 bg-[#0F1623] p-2 rounded border border-slate-800 space-y-1">
                      <div>• Cardiac ECG & Echo: Normal Sinus</div>
                      <div>• Musculoskeletal Screen: 0 acute pain</div>
                      <div>• WADA TUE Status: None Required</div>
                    </div>
                  </div>

                  <div className="pt-4 flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setApprovalLevels({ ...approvalLevels, medical: 'cleared' });
                        onTriggerToast('✓ Level 3: Medical Clearance Issued — Athlete Cleared for Full Training');
                      }}
                      className="flex-1 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Clear Athlete
                    </button>
                    <button
                      onClick={() => {
                        setApprovalLevels({ ...approvalLevels, medical: 'cleared_restricted' });
                        onTriggerToast('Medical Clearance Issued with Restrictions: Cap training volume at 70%');
                      }}
                      className="px-2 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold text-xs"
                    >
                      With Restrictions
                    </button>
                  </div>
                </div>
              </div>

              {/* Final Activation Status Banner */}
              {approvalLevels.admin === 'approved' && approvalLevels.coach === 'approved' && approvalLevels.medical === 'cleared' && (
                <div className="bg-emerald-950/20 border border-emerald-500/50 rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
                      🟢
                    </div>
                    <div>
                      <div className="font-bold text-emerald-300 text-sm">Athlete Activated ✓</div>
                      <div className="text-xs text-slate-300">
                        Profile 100% Complete · Administrative: Approved · Sporting: Approved · Medical: Cleared
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setOnboardingStage('assignment');
                      onTriggerToast('Proceeding to Step 5: Coach Assignment');
                    }}
                    className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <span>Proceed to Coach Assignment →</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: COACH ASSIGNMENT & CAPACITY */}
          {onboardingStage === 'assignment' && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 5 — Coach Assignment & Capacity Management</h3>
                  <p className="text-xs text-slate-400">Admin selects Primary & Secondary Coach. System checks coach caseload capacity. Coach reviews and formally accepts.</p>
                </div>
                <span className="text-xs font-mono text-sky-400">Capacity Rule: Max 20 Athletes / Coach</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Admin Assignment Panel */}
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-slate-200">Admin Assignment Selection</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Athlete</span>
                      <strong className="text-slate-100">Rahul Sharma</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Sport / Squad</span>
                      <strong className="text-slate-100">Athletics · Senior Squad</strong>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 font-semibold block mb-1">Primary Coach Selection</label>
                    <select
                      value={coachWorkloadState.selectedCoach}
                      onChange={(e) => setCoachWorkloadState({ ...coachWorkloadState, selectedCoach: e.target.value })}
                      className="w-full p-2.5 rounded bg-[#0F1623] border border-slate-700 text-slate-100"
                    >
                      <option>Coach A (Sprints)</option>
                      <option>Coach B (Strength & Power)</option>
                      <option>Coach C (Technical & Blocks)</option>
                    </select>
                  </div>

                  {/* Capacity Meter */}
                  <div className="p-3 rounded bg-[#0F1623] border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-300">Coach A Current Caseload</span>
                      <span className="font-mono font-bold text-sky-400">18 / 20 Athletes</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: '90%' }} />
                    </div>
                    <div className="text-[10px] text-emerald-400">✓ Within safe capacity corridor (&lt;20 athletes)</div>
                  </div>

                  <button
                    onClick={() => {
                      setCoachWorkloadState({ ...coachWorkloadState, assignedState: 'assigned' });
                      onTriggerToast('Assignment dispatched to Coach A inbox for formal acceptance.');
                    }}
                    className="w-full py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                  >
                    Submit Assignment to Coach
                  </button>
                </div>

                {/* Coach Acceptance Flow */}
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3 text-xs">
                  <div className="font-bold text-slate-200">Coach Assignment Approval (Coach A Inbox)</div>
                  <p className="text-slate-400">Coach reviews athlete profile, injury history, and baseline load before accepting responsibility.</p>

                  <div className="p-3 rounded bg-[#0F1623] border border-slate-800 space-y-1.5">
                    <div className="font-semibold text-slate-200">New Athlete Assignment Request:</div>
                    <div className="text-slate-300">• Candidate: Rahul Sharma (100m Sprint)</div>
                    <div className="text-slate-300">• Current Performance Level: Intermediate National</div>
                    <div className="text-slate-300">• Medical Clearance: Fully Cleared (0 active restrictions)</div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setCoachWorkloadState({ ...coachWorkloadState, assignedState: 'accepted' });
                        onTriggerToast('✓ Coach A accepted Rahul Sharma. Dashboard updated: Primary Coach = Coach A');
                      }}
                      className="flex-1 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Accept Assignment
                    </button>
                    <button
                      onClick={() => {
                        setCoachWorkloadState({ ...coachWorkloadState, assignedState: 'declined' });
                        onTriggerToast('Assignment declined: Caseload reallocation required.');
                      }}
                      className="px-3 py-2 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 font-semibold text-xs"
                    >
                      Decline
                    </button>
                  </div>

                  {coachWorkloadState.assignedState === 'accepted' && (
                    <div className="p-2.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-center">
                      Final State: Admin Assigned → Coach Accepted → Athlete Notified ✓
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          WORKFLOW 2: TRAINING & PERIODISATION
          ========================================================================= */}
      {activeWorkflow === 'training-periodisation' && (
        <div className="space-y-6">
          {/* Workflow Chain Visualizer */}
          <div className="bg-[#0B101B] border border-slate-800 rounded-lg p-4">
            <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold mb-2">
              TRAINING & PERIODISATION VALUE CHAIN
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-sky-300 font-bold">1. Director Defines Objective</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-purple-300 font-bold">2. Sports Scientist Periodisation</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-300 font-bold">3. Coach Converts to Weekly Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">4. Session Assignment</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-rose-300 font-bold">5. Athlete Readiness & Execution</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">6. Coach Review & Triage</span>
            </div>
          </div>

          {/* Sub-step selector */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { num: 1, label: '1. Director Objective' },
              { num: 2, label: '2. Periodisation Macrocycle' },
              { num: 3, label: '3. Weekly Microcycle Plan' },
              { num: 4, label: '4. Session Assignment' },
              { num: 5, label: '5. Athlete Pre/Post Session' },
              { num: 6, label: '6. Coach Operational Triage' },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setTrainingWorkflowStep(st.num as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  trainingWorkflowStep === st.num
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'bg-[#0F1623] border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* STEP 1: PERFORMANCE DIRECTOR OBJECTIVE */}
          {trainingWorkflowStep === 1 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Step 1 — Performance Director Defines Season Objective</h3>
                <p className="text-xs text-slate-400">Who creates: <strong>Performance Director / Head Coach</strong> · Establishes macro targets for Sports Scientists and Coaches</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Target Competition</span>
                  <strong className="text-slate-100 text-sm">National Championships 2026</strong>
                </div>
                <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Competition Date</span>
                  <strong className="text-sky-400 text-sm font-mono">15 December 2026</strong>
                </div>
                <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Target Event / Squad</span>
                  <strong className="text-slate-100 text-sm">Senior Sprint Squad (100m / 200m)</strong>
                </div>
                <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Performance Objective</span>
                  <strong className="text-amber-300 text-sm">Peak Velocity & Sub-10.20s Qualification</strong>
                </div>
                <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Season Phase</span>
                  <strong className="text-purple-300 text-sm font-mono">Development Phase (Macrocycle 2)</strong>
                </div>
                <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Target Outcome</span>
                  <strong className="text-emerald-400 text-sm">Podium Gold + Relay National Record</strong>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setTrainingWorkflowStep(2)}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Pass to Sports Scientist (Periodisation) →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: SPORTS SCIENTIST PERIODISATION */}
          {trainingWorkflowStep === 2 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Step 2 — Sports Scientist Creates Macrocycle Periodisation</h3>
                <p className="text-xs text-slate-400">Who creates: <strong>Sports Scientist</strong> · Breaks seasonal objectives into scientific loading blocks</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs">
                {[
                  { phase: 'Preparation', dur: '6 Weeks', vol: 'Very High', int: 'Low–Moderate', rec: 'High', active: false },
                  { phase: 'Development', dur: '4 Weeks', vol: 'High', int: 'Moderate–High', rec: 'Moderate', active: true },
                  { phase: 'Competition', dur: '3 Weeks', vol: 'Moderate', int: 'Very High (100%)', rec: 'High', active: false },
                  { phase: 'Taper', dur: '10 Days', vol: 'Low (-40%)', int: 'High (Speed)', rec: 'Very High', active: false },
                  { phase: 'Recovery', dur: '2 Weeks', vol: 'Very Low', int: 'Low', rec: 'Maximum', active: false },
                ].map((ph, idx) => (
                  <div key={idx} className={`p-3 rounded-lg border text-left space-y-1.5 ${
                    ph.active ? 'bg-purple-950/20 border-purple-500/50 ring-1 ring-purple-500' : 'bg-[#090D16] border-slate-800'
                  }`}>
                    <div className="font-bold text-slate-100">{ph.phase}</div>
                    <div className="text-[11px] font-mono text-slate-400">{ph.dur}</div>
                    <div className="text-[10px] text-slate-300">Volume: <strong className="text-sky-300">{ph.vol}</strong></div>
                    <div className="text-[10px] text-slate-300">Intensity: <strong className="text-amber-300">{ph.int}</strong></div>
                    <div className="text-[10px] text-slate-300">Recovery: <strong className="text-emerald-300">{ph.rec}</strong></div>
                    {ph.active && <span className="inline-block px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">CURRENT PHASE</span>}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setTrainingWorkflowStep(3)}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Pass to Coach (Weekly Microcycle) →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: COACH WEEKLY PLAN */}
          {trainingWorkflowStep === 3 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Step 3 — Coach Converts Periodisation into Weekly Microcycle (Week 3)</h3>
                <p className="text-xs text-slate-400">Who creates: <strong>Lead Coach</strong> · Maps scientific volume/intensity targets into concrete day-by-day pitch sessions</p>
              </div>

              <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
                <div className="bg-[#090D16] p-3 grid grid-cols-12 font-bold text-slate-300 border-b border-slate-800">
                  <div className="col-span-2">Day</div>
                  <div className="col-span-3">Session Type</div>
                  <div className="col-span-4">Focus & Drill Details</div>
                  <div className="col-span-3 text-right">Target Intensity</div>
                </div>
                {[
                  { day: 'Mon', type: 'Sprint Acceleration', focus: '6 × 30m block acceleration with 3 min recovery', int: 'High (90% Vmax)', color: 'text-amber-300' },
                  { day: 'Tue', type: 'Strength (Lower Body)', focus: 'Trap bar deadlifts + eccentric hamstring eccentrics', int: 'Medium (75% 1RM)', color: 'text-sky-300' },
                  { day: 'Wed', type: 'Active Recovery', focus: 'Pool mobility + myofascial release & stretching', int: 'Low (Active Regen)', color: 'text-emerald-300' },
                  { day: 'Thu', type: 'Max Velocity', focus: '5 × 60m fly sprints + wicket runs', int: 'Maximum (95–100% Vmax)', color: 'text-rose-400' },
                  { day: 'Fri', type: 'Strength (Power)', focus: 'Hang cleans + box jumps & ballistic throws', int: 'Medium–High', color: 'text-amber-300' },
                  { day: 'Sat', type: 'Conditioning', focus: 'Tempo running drills 10 × 100m at 65% Vmax', int: 'Medium (Aerobic)', color: 'text-sky-300' },
                  { day: 'Sun', type: 'Rest Day', focus: 'Full passive recovery & physiological regeneration', int: 'Rest', color: 'text-slate-400' },
                ].map((row, i) => (
                  <div key={i} className="p-3 grid grid-cols-12 items-center border-b border-slate-800/60 hover:bg-[#131B2B]">
                    <div className="col-span-2 font-mono font-bold text-slate-200">{row.day}</div>
                    <div className="col-span-3 font-semibold text-slate-100">{row.type}</div>
                    <div className="col-span-4 text-slate-400">{row.focus}</div>
                    <div className={`col-span-3 text-right font-mono font-bold ${row.color}`}>{row.int}</div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setTrainingWorkflowStep(4)}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Assign Monday Session →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: SESSION ASSIGNMENT */}
          {trainingWorkflowStep === 4 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Step 4 — Coach Assigns Session to Athletes</h3>
                <p className="text-xs text-slate-400">Coach opens acceleration session · Sets volume & intensity · Assigns to Rahul Sharma + squad</p>
              </div>

              <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Session Name</span>
                    <strong className="text-slate-100">Acceleration Development</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Scheduled Time</span>
                    <strong className="text-slate-100 font-mono">Today — 17:00 IST</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Track / Venue</span>
                    <strong className="text-slate-100">Track 1 (Synthetic)</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Prescribed Volume</span>
                    <strong className="text-emerald-400 font-mono">6 × 30m @ 90% (3 min rec)</strong>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#0F1623] border border-slate-800">
                  <span className="text-slate-400 block text-[11px] mb-1">Roster Assigned (10 Athletes):</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['Rahul Sharma', 'Arjun Mehta', 'Aman Verma', 'Karanveer D.', 'Devendra S.', 'Vikram P.', 'Sanjay R.', 'Naveen K.', 'Pradeep M.', 'Aditya B.'].map((n) => (
                      <span key={n} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 font-medium text-[11px]">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Athlete Notification Card Preview */}
                <div className="p-3 rounded-lg bg-sky-950/20 border border-sky-500/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sky-300">Athlete View — Notification Card Dispatched</span>
                    <span className="text-[10px] font-mono text-slate-400">Incoming to Rahul Sharma</span>
                  </div>
                  <div className="text-slate-300">
                    "New Training Session: Acceleration Development · Today 17:00 · Coach: Coach A · Location: Track 1"
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <button onClick={() => onTriggerToast('Athlete Rahul Sharma accepted training session assignment.')} className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px]">
                      Accept Session
                    </button>
                    <button onClick={() => onTriggerToast('Athlete requested modification due to travel fatigue.')} className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px]">
                      Request Change
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setTrainingWorkflowStep(5)}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Proceed to Athlete Session Execution →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: ATHLETE PRE/POST SESSION */}
          {trainingWorkflowStep === 5 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-100">Step 5 — Athlete Pre-Training Check & Post-Session Log</h3>
                <p className="text-xs text-slate-400">Pre-training readiness check flags potential training modification if pain/fatigue exceed safe thresholds</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* Pre-Training Check */}
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3">
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>1. Pre-Training Check (Athlete Enters)</span>
                    <span className="font-mono text-sky-400">Readiness: {athletePreCheckData.readiness}/10</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-slate-400 block mb-1">Sleep (Hours)</label>
                      <input
                        type="number"
                        value={athletePreCheckData.sleepHours}
                        onChange={(e) => setAthletePreCheckData({ ...athletePreCheckData, sleepHours: Number(e.target.value) })}
                        className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Fatigue (1-10)</label>
                      <input
                        type="number"
                        value={athletePreCheckData.fatigue}
                        onChange={(e) => setAthletePreCheckData({ ...athletePreCheckData, fatigue: Number(e.target.value) })}
                        className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Muscle Soreness (1-10)</label>
                      <input
                        type="number"
                        value={athletePreCheckData.muscleSoreness}
                        onChange={(e) => setAthletePreCheckData({ ...athletePreCheckData, muscleSoreness: Number(e.target.value) })}
                        className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Pain Level (1-10)</label>
                      <input
                        type="number"
                        value={athletePreCheckData.pain}
                        onChange={(e) => setAthletePreCheckData({ ...athletePreCheckData, pain: Number(e.target.value) })}
                        className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 font-mono"
                      />
                    </div>
                  </div>

                  {athletePreCheckData.pain > 3 && (
                    <div className="p-2.5 rounded bg-amber-950/20 border border-amber-500/40 text-amber-300 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>⚠️ Pain &gt; Threshold! Potential training modification flagged to Coach.</span>
                    </div>
                  )}
                </div>

                {/* Post-Training Log */}
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3">
                  <div className="font-bold text-slate-200 flex items-center justify-between">
                    <span>2. Post-Session Submission (Actual Load)</span>
                    <span className="font-mono text-emerald-400">RPE: {sessionReviewState.rpe}/10</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Planned Workload</span>
                      <strong className="text-slate-100 font-mono">80 AU</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">Actual Completed Workload</span>
                      <strong className="text-amber-300 font-mono">92 AU (+15%)</strong>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 block mb-1">Athlete Subjective Notes</label>
                    <textarea
                      rows={2}
                      value={sessionReviewState.athleteNotes}
                      onChange={(e) => setSessionReviewState({ ...sessionReviewState, athleteNotes: e.target.value })}
                      className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => onTriggerToast('✓ Post-session log submitted — Dispatched to Coach for Planned vs Actual review')}
                      className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Submit Post-Training Log
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setTrainingWorkflowStep(6)}
                  className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Open Coach Operational Triage Board →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: COACH OPERATIONAL TRIAGE & REVIEW */}
          {trainingWorkflowStep === 6 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-5">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 6 — Coach Operational Triage Dashboard</h3>
                  <p className="text-xs text-slate-400">Coach follows: <strong>Assigned → Prepare → Deliver → Monitor → Review → Adjust</strong></p>
                </div>
                <span className="text-xs font-mono text-emerald-400">Live Squad Morning Triage</span>
              </div>

              {/* Today's Athletes Triage Table */}
              <div className="border border-slate-800 rounded-lg overflow-hidden text-xs">
                <div className="bg-[#090D16] p-3 grid grid-cols-12 font-bold text-slate-300 border-b border-slate-800">
                  <div className="col-span-3">Athlete</div>
                  <div className="col-span-2">Readiness</div>
                  <div className="col-span-3">Session Scheduled</div>
                  <div className="col-span-2">Operational Status</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {triageAthletes.map((ath) => (
                  <div key={ath.id} className="p-3 grid grid-cols-12 items-center border-b border-slate-800/60 hover:bg-[#131B2B]">
                    <div className="col-span-3">
                      <div className="font-semibold text-slate-100">{ath.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{ath.details}</div>
                    </div>
                    <div className="col-span-2 font-mono font-bold text-sm text-slate-200">
                      {ath.readiness}/10
                    </div>
                    <div className="col-span-3 text-slate-300">
                      {ath.modified ? (
                        <span className="text-emerald-300 font-semibold">{ath.session} (Modified ✓)</span>
                      ) : (
                        <span>{ath.session}</span>
                      )}
                    </div>
                    <div className="col-span-2">
                      <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                        ath.status === 'Ready' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                        ath.status === 'Modify' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}>
                        {ath.modified ? '✓ MODIFIED' : ath.status === 'Modify' ? '⚠ MODIFY' : ath.status === 'Review' ? '🔴 REVIEW' : 'READY'}
                      </span>
                    </div>
                    <div className="col-span-2 text-right">
                      {ath.status === 'Modify' && !ath.modified ? (
                        <button
                          onClick={() => {
                            setTriageAthletes(triageAthletes.map(a => a.id === ath.id ? { ...a, session: 'Technical drills + low-intensity running', modified: true } : a));
                            onTriggerToast('✓ Coach adjusted Arjun Mehta session: Changed Max sprint to Technical drills + low-intensity running');
                          }}
                          className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px]"
                        >
                          Modify Session
                        </button>
                      ) : ath.status === 'Review' ? (
                        <button
                          onClick={() => onTriggerToast('Summoning Joint Medical & Sports Science Review for Aman Verma')}
                          className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-semibold"
                        >
                          Joint Review
                        </button>
                      ) : (
                        <span className="text-emerald-400 font-semibold text-[11px]">✓ Cleared</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Coach Planned vs Actual Load Approval Box */}
              <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200">Coach Planned vs Actual Load Review (Post-Session)</div>
                  <span className="font-mono text-amber-400">Exceeded Target by +15% AU</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Planned Workload</span>
                    <strong className="text-slate-100 font-mono text-sm">80 AU</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Actual Workload</span>
                    <strong className="text-amber-300 font-mono text-sm">92 AU</strong>
                  </div>
                  <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Athlete Reported RPE</span>
                    <strong className="text-slate-100 font-mono text-sm">8 / 10</strong>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Coach Assessment Notes</label>
                  <input
                    type="text"
                    value={sessionReviewState.coachNotes}
                    onChange={(e) => setSessionReviewState({ ...sessionReviewState, coachNotes: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#0F1623] border border-slate-700 text-slate-100"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      setSessionReviewState({ ...sessionReviewState, coachStatus: 'flagged' });
                      onTriggerToast('Session flagged for Sports Science load calibration review.');
                    }}
                    className="px-3 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 font-semibold"
                  >
                    Flag for Review
                  </button>
                  <button
                    onClick={() => {
                      setSessionReviewState({ ...sessionReviewState, coachStatus: 'approved' });
                      onTriggerToast('✓ Coach Approved Session & Recorded Load Adjustment into EWMA Workload Model');
                    }}
                    className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold"
                  >
                    Approve Session
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          WORKFLOW 3: MEDICAL & INJURY INTELLIGENCE
          ========================================================================= */}
      {activeWorkflow === 'medical-intelligence' && (
        <div className="space-y-6">
          {/* Workflow Chain Visualizer */}
          <div className="bg-[#0B101B] border border-slate-800 rounded-lg p-4">
            <div className="text-[11px] font-mono text-rose-400 uppercase font-semibold mb-2">
              MEDICAL & INJURY INTELLIGENCE OPERATIONAL CHAIN
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-rose-300 font-bold">1. Athlete Reports Injury</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">2. Interactive Body Map</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-sky-300 font-bold">3. Medical Clinical Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-purple-300 font-bold">4. 4-Tab Injury Overlay</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-emerald-300 font-bold">5. Physio Rehab Plan</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-amber-300 font-bold">6. Daily Rehab Logging</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-sky-300 font-bold">7. RTP Clearance Criteria</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">8. Coach Receives Restrictions</span>
            </div>
          </div>

          {/* Sub-step selector */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { num: 1, label: '1. Athlete Injury Report' },
              { num: 2, label: '2. Interactive Body Map & State' },
              { num: 3, label: '3. Clinical Assessment' },
              { num: 4, label: '4. 4-Tab Injury Overlay' },
              { num: 5, label: '5. Physio 3-Phase Rehab' },
              { num: 6, label: '6. Athlete Daily Rehab Log' },
              { num: 7, label: '7. Medical Clearance Checklist' },
              { num: 8, label: '8. Coach Medical Restriction' },
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setMedicalWorkflowStep(st.num as any)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  medicalWorkflowStep === st.num
                    ? 'bg-rose-500 text-slate-950 font-bold shadow'
                    : 'bg-[#0F1623] border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* STEP 1: ATHLETE INJURY REPORT */}
          {medicalWorkflowStep === 1 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 1 — Athlete Reports Incident</h3>
                  <p className="text-xs text-slate-400">Athlete registers acute pain or incident · Affects body map state and alerts medical staff immediately</p>
                </div>
                <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-xs border border-rose-500/40">
                  🔴 New Injury Report
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Athlete</label>
                  <input type="text" value={injuryReportForm.athleteName} readOnly className="w-full p-2.5 rounded bg-[#090D16] border border-slate-800 text-slate-100" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Date / Time of Incident</label>
                  <input type="text" value={injuryReportForm.dateTime} onChange={(e) => setInjuryReportForm({ ...injuryReportForm, dateTime: e.target.value })} className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Activity When Occurred</label>
                  <input type="text" value={injuryReportForm.activity} onChange={(e) => setInjuryReportForm({ ...injuryReportForm, activity: e.target.value })} className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pain Level (1–10): {injuryReportForm.painLevel}</label>
                  <input type="range" min="1" max="10" value={injuryReportForm.painLevel} onChange={(e) => setInjuryReportForm({ ...injuryReportForm, painLevel: Number(e.target.value) })} className="w-full" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Pain Type</label>
                  <input type="text" value={injuryReportForm.painType} onChange={(e) => setInjuryReportForm({ ...injuryReportForm, painType: e.target.value })} className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100" />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Can Continue Training?</label>
                  <select value={injuryReportForm.canContinueTraining} onChange={(e) => setInjuryReportForm({ ...injuryReportForm, canContinueTraining: e.target.value })} className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100">
                    <option>No — Immediate withdrawal</option>
                    <option>Yes — With load reduction</option>
                    <option>Yes — Normal</option>
                  </select>
                </div>
                <div className="col-span-full">
                  <label className="text-slate-400 block mb-1">Mechanism of Injury (How did it happen?)</label>
                  <input type="text" value={injuryReportForm.mechanism} onChange={(e) => setInjuryReportForm({ ...injuryReportForm, mechanism: e.target.value })} className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100" />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => {
                    setBodyMapPathologyState('Suspected');
                    setMedicalWorkflowStep(2);
                    onTriggerToast('Incident recorded: Dispatched to Interactive Body Map for Anatomical Localization');
                  }}
                  className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Select Region on Interactive Body Map →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: INTERACTIVE BODY MAP & STATE */}
          {medicalWorkflowStep === 2 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 2 — Interactive Body Map & Dynamic Pathology State Machine</h3>
                  <p className="text-xs text-slate-400">
                    Dynamic anatomical state sequence: <strong className="text-sky-300">Normal → Pain → Suspected → Confirmed → Recovering → Cleared</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">Current Region State:</span>
                  <span className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-300 font-mono font-bold text-xs border border-rose-500/40">
                    {bodyMapPathologyState.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* State Machine Transition Strip */}
              <div className="flex flex-wrap items-center gap-2 p-3 bg-[#090D16] rounded-lg border border-slate-800 text-xs">
                {(['Normal', 'Pain', 'Suspected', 'Confirmed', 'Recovering', 'Cleared'] as const).map((st, i, arr) => (
                  <React.Fragment key={st}>
                    <button
                      onClick={() => {
                        setBodyMapPathologyState(st);
                        onTriggerToast(`Body Map state transitioned to: ${st}`);
                      }}
                      className={`px-3 py-1.5 rounded font-mono font-bold transition-all ${
                        bodyMapPathologyState === st
                          ? 'bg-rose-500 text-slate-950 shadow-md ring-2 ring-rose-400'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      {st}
                    </button>
                    {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-slate-600" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Render Existing InteractiveBodyMap */}
              <div className="border border-slate-800/80 rounded-lg p-3 bg-[#090D16]">
                <InteractiveBodyMap
                  injuries={injuries}
                  selectedRegion={selectedBodyRegion}
                  onSelectRegion={(reg) => {
                    setSelectedBodyRegion(reg);
                    onTriggerToast(`Selected anatomical region: ${reg}`);
                  }}
                  onViewInjury={(inj) => onTriggerToast(`Viewing clinical details for ${inj.diagnosis}`)}
                  onCreateRehabSession={(inj) => onOpenCreateRehab(inj)}
                  onAdvanceRtp={(inj) => onOpenAdvanceRtp(inj)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setMedicalWorkflowStep(3)}
                  className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Proceed to Medical Staff Clinical Assessment →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: CLINICAL ASSESSMENT */}
          {medicalWorkflowStep === 3 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 3 — Medical Staff Clinical Assessment</h3>
                  <p className="text-xs text-slate-400">Who creates: <strong>Physiotherapist / Team Physician</strong> · Records formal diagnosis, mechanism, imaging confirmation & timeline</p>
                </div>
                <span className="text-xs font-mono text-amber-300">Confidential Medical Record</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Clinical Diagnosis</label>
                  <input
                    type="text"
                    value={clinicalAssessment.diagnosis}
                    onChange={(e) => setClinicalAssessment({ ...clinicalAssessment, diagnosis: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Severity Grading</label>
                  <input
                    type="text"
                    value={clinicalAssessment.severity}
                    onChange={(e) => setClinicalAssessment({ ...clinicalAssessment, severity: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Estimated Recovery Time</label>
                  <input
                    type="text"
                    value={clinicalAssessment.estimatedRecovery}
                    onChange={(e) => setClinicalAssessment({ ...clinicalAssessment, estimatedRecovery: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-emerald-300 font-mono font-bold"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-slate-400 block mb-1">Imaging & MRI Confirmation</label>
                  <input
                    type="text"
                    value={clinicalAssessment.imaging}
                    onChange={(e) => setClinicalAssessment({ ...clinicalAssessment, imaging: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Referral / Care Pathway</label>
                  <input
                    type="text"
                    value={clinicalAssessment.referral}
                    onChange={(e) => setClinicalAssessment({ ...clinicalAssessment, referral: e.target.value })}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setMedicalWorkflowStep(4)}
                  className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Open 4-Tab Injury Overlay →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 4-TAB INJURY OVERLAY */}
          {medicalWorkflowStep === 4 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 4 — 4-Tab Injury Overlay (Multi-Disciplinary View)</h3>
                  <p className="text-xs text-slate-400">Separates Clinical Pathology from Coach-Facing Training Impact and Recovery Milestones</p>
                </div>
                <span className="font-mono text-xs text-sky-400">{selectedBodyRegion}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                {/* Overlay 1: Injury */}
                <div className="p-3.5 rounded-lg bg-[#090D16] border border-slate-800 space-y-2">
                  <div className="font-bold text-rose-300 uppercase text-[11px]">1. INJURY OVERLAY</div>
                  <div><span className="text-slate-400 block text-[10px]">Location:</span><strong>Right Biceps Femoris</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Type:</span><strong>Grade 1b Strain</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Severity:</span><strong className="text-amber-300">Moderate</strong></div>
                </div>

                {/* Overlay 2: Training Impact */}
                <div className="p-3.5 rounded-lg bg-[#090D16] border border-amber-500/30 space-y-2">
                  <div className="font-bold text-amber-300 uppercase text-[11px]">2. TRAINING IMPACT</div>
                  <div><span className="text-slate-400 block text-[10px]">Restricted Movements:</span><strong>No explosive sprint decel</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Restricted Exercises:</span><strong>Heavy deadlifts, 100m flies</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Max Speed Cap:</span><strong className="text-rose-400">≤ 70% Vmax (22 km/h)</strong></div>
                </div>

                {/* Overlay 3: Medical */}
                <div className="p-3.5 rounded-lg bg-[#090D16] border border-slate-800 space-y-2">
                  <div className="font-bold text-sky-300 uppercase text-[11px]">3. MEDICAL PROTOCOL</div>
                  <div><span className="text-slate-400 block text-[10px]">Treatment:</span><strong>Cryotherapy + Soft Tissue</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Medication:</span><strong>NSAIDs contraindicated</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Physio Sessions:</span><strong>Daily 45m rehab</strong></div>
                </div>

                {/* Overlay 4: Recovery */}
                <div className="p-3.5 rounded-lg bg-[#090D16] border border-emerald-500/30 space-y-2">
                  <div className="font-bold text-emerald-300 uppercase text-[11px]">4. RECOVERY PROGRESS</div>
                  <div><span className="text-slate-400 block text-[10px]">Recovery Progress:</span><strong className="text-emerald-400 font-mono">65% Restored</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Expected Return Date:</span><strong className="font-mono">08 Oct 2026</strong></div>
                  <div><span className="text-slate-400 block text-[10px]">Current Rehab Phase:</span><strong className="text-sky-300 font-mono">Phase 2: Strength</strong></div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setMedicalWorkflowStep(5)}
                  className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Create 3-Phase Rehab Plan →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: PHYSIO 3-PHASE REHAB PLAN */}
          {medicalWorkflowStep === 5 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 5 — Physiotherapist Creates 3-Phase Rehab Plan</h3>
                  <p className="text-xs text-slate-400">Structured rehabilitation protocol with explicit completion criteria for each phase</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">Protocol: Hamstring Reconditioning</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Phase 1 */}
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Phase 1 — Protection</span>
                    <span className="text-emerald-400 font-mono font-bold text-[10px]">✓ PASSED</span>
                  </div>
                  <div className="text-slate-400">• Mobility exercises & low-load movement</div>
                  <div className="text-slate-400">• Frequency: 2x daily · Duration: 15 min</div>
                  <div className="text-slate-400">• Completion criteria: Pain-free walking & active knee extension &lt;15° deficit</div>
                </div>

                {/* Phase 2 */}
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/50 space-y-2.5 ring-1 ring-emerald-500/40">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-emerald-300">Phase 2 — Strength</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold text-[10px]">ACTIVE PHASE</span>
                  </div>
                  <div className="text-slate-300">• Hamstring activation & isometric bridges (3 × 30s)</div>
                  <div className="text-slate-300">• Nordic curls & progressive eccentric loading</div>
                  <div className="text-slate-300">• Completion criteria: LSI ≥ 85% on isometric dynamometry</div>
                </div>

                {/* Phase 3 */}
                <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-2.5 opacity-75">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-400">Phase 3 — Return to Sport</span>
                    <span className="text-slate-500 font-mono text-[10px]">LOCKED</span>
                  </div>
                  <div className="text-slate-400">• Running progression & sprint mechanics</div>
                  <div className="text-slate-400">• High-speed deceleration & sport-specific agility</div>
                  <div className="text-slate-400">• Completion criteria: 100% Vmax sprint without apprehension</div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setMedicalWorkflowStep(6)}
                  className="px-4 py-2 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <span>Athlete Today's Rehab Logging →</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: ATHLETE DAILY REHAB LOG */}
          {medicalWorkflowStep === 6 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 6 — Athlete Completes "Today's Rehab"</h3>
                  <p className="text-xs text-slate-400">Athlete executes assigned exercises, logging pain delta (before vs after) and RPE</p>
                </div>
                <span className="text-xs font-mono text-sky-400 font-bold">Prescribed by Physio</span>
              </div>

              <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-slate-200">Today's Assigned Exercises:</div>
                <div className="space-y-1.5 text-slate-300">
                  <div className="p-2 rounded bg-[#0F1623] border border-slate-800 flex items-center justify-between">
                    <span>1. Hamstring Mobility & Active Flossing</span>
                    <span className="font-mono text-slate-400">10 min</span>
                  </div>
                  <div className="p-2 rounded bg-[#0F1623] border border-slate-800 flex items-center justify-between">
                    <span>2. Sub-Maximal Isometric Hamstring Contraction</span>
                    <span className="font-mono text-slate-400">3 × 30 sec</span>
                  </div>
                  <div className="p-2 rounded bg-[#0F1623] border border-slate-800 flex items-center justify-between">
                    <span>3. Controlled Incline Treadmill Walking (6% grade)</span>
                    <span className="font-mono text-slate-400">15 min</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Pain Before (1–10)</label>
                    <input
                      type="number"
                      value={athleteRehabLog.painBefore}
                      onChange={(e) => setAthleteRehabLog({ ...athleteRehabLog, painBefore: Number(e.target.value) })}
                      className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Pain After (1–10)</label>
                    <input
                      type="number"
                      value={athleteRehabLog.painAfter}
                      onChange={(e) => setAthleteRehabLog({ ...athleteRehabLog, painAfter: Number(e.target.value) })}
                      className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Session RPE (1–10)</label>
                    <input
                      type="number"
                      value={athleteRehabLog.rpe}
                      onChange={(e) => setAthleteRehabLog({ ...athleteRehabLog, rpe: Number(e.target.value) })}
                      className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 text-slate-100 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-1">Pain Delta</span>
                    <strong className="text-emerald-400 font-mono text-base block pt-1.5">
                      {athleteRehabLog.painBefore - athleteRehabLog.painAfter > 0 ? `-${athleteRehabLog.painBefore - athleteRehabLog.painAfter} (Improved)` : 'Unchanged'}
                    </strong>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onTriggerToast('✓ Today\'s Rehab submitted — Physio notified: Progress = 65%');
                    setMedicalWorkflowStep(7);
                  }}
                  className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  Submit Rehab Log (Send to Physio)
                </button>
              </div>
            </div>
          )}

          {/* STEP 7: MEDICAL CLEARANCE CHECKLIST */}
          {medicalWorkflowStep === 7 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 7 — Return-to-Play Medical Clearance Assessment</h3>
                  <p className="text-xs text-slate-400">
                    <strong className="text-rose-400">Rule:</strong> Requires Medical approval, not Coach approval. All criteria must be verified objectively.
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 font-bold">Medical Board Review</span>
              </div>

              <div className="p-4 rounded-lg bg-[#090D16] border border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-slate-200">Return-to-Play Criteria Checklist:</div>

                <div className="space-y-2">
                  {[
                    { key: 'painFreeLoading', label: '1. Pain-free during sport-specific eccentric loading?' },
                    { key: 'fullRomRestored', label: '2. Full active range of motion restored (&lt;5° bilateral deficit)?' },
                    { key: 'strengthLsiPassed', label: '3. Isometric hamstring strength test passed (LSI ≥ 90%)?' },
                    { key: 'functionalJumpPassed', label: '4. Triple hop functional asymmetry test passed (&lt;8% difference)?' },
                    { key: 'sportSpecificSprintPassed', label: '5. High-speed running test passed (100% Vmax acceleration)?' },
                  ].map((item) => (
                    <label key={item.key} className="flex items-center gap-2 p-2.5 rounded bg-[#0F1623] border border-slate-800 cursor-pointer hover:bg-[#131B2B]">
                      <input
                        type="checkbox"
                        checked={(rtpClearanceChecklist as any)[item.key]}
                        onChange={(e) => setRtpClearanceChecklist({ ...rtpClearanceChecklist, [item.key]: e.target.checked })}
                        className="rounded border-slate-700 text-emerald-500"
                      />
                      <span className="text-slate-200 font-medium">{item.label}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Current Clearance Verdict:{' '}
                    <strong className="text-amber-300">{rtpClearanceVerdict}</strong>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setRtpClearanceVerdict('Cleared with Restrictions');
                        onTriggerToast('Medical Board issued: Cleared with Restrictions');
                        setMedicalWorkflowStep(8);
                      }}
                      className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                    >
                      Clear with Restrictions
                    </button>
                    <button
                      onClick={() => {
                        setRtpClearanceVerdict('Cleared');
                        onTriggerToast('✓ Medical Board issued FULL CLEARANCE without restrictions');
                        setMedicalWorkflowStep(8);
                      }}
                      className="px-4 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                    >
                      Full Clearance
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: COACH MEDICAL RESTRICTION */}
          {medicalWorkflowStep === 8 && (
            <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">Step 8 — Coach Receives Medical Restriction Notice</h3>
                  <p className="text-xs text-slate-400">
                    Coach does <strong className="text-amber-300">not</strong> see confidential clinical records. Instead, actionable movement restrictions are injected into session planning.
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded bg-amber-500/20 text-amber-300 font-mono font-bold text-xs border border-amber-500/40">
                  ⚠️ Training Restriction Notice
                </span>
              </div>

              {/* Restriction Card */}
              <div className="p-4 rounded-lg bg-amber-950/20 border border-amber-500/40 space-y-3 text-xs">
                <div className="flex items-center justify-between border-b border-amber-500/30 pb-2">
                  <div className="font-bold text-amber-300 text-sm">Official Medical Restriction Notice</div>
                  <span className="text-[11px] font-mono text-slate-400">Athlete: Rahul Sharma · Status: Cleared with Restrictions</span>
                </div>

                <div className="space-y-1.5 text-slate-200">
                  <div className="font-semibold text-amber-200">Prescribed Training Restrictions:</div>
                  <div className="flex items-center gap-2 text-rose-300">
                    <span>⛔ No maximal sprinting (&gt;80% Vmax prohibited)</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300">
                    <span>⚠️ Running intensity capped at ≤ 70%</span>
                  </div>
                  <div className="flex items-center gap-2 text-rose-300">
                    <span>⛔ No explosive eccentric hamstring loading / fly runs</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-300">
                    <span>✅ Mandatory 20-min pitchside rehab session before drill entry</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="text-[11px] text-slate-400">
                    Coach 1-click action automatically adjusts today's training assignment to comply with restrictions.
                  </div>
                  <button
                    onClick={() => {
                      setRestrictionAppliedToSession(true);
                      onTriggerToast('✓ Medical restrictions applied to Rahul Sharma training session: Sprint volume modified to 70% intensity drills');
                    }}
                    className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{restrictionAppliedToSession ? 'Restrictions Applied ✓' : 'Apply Restriction to Training Session'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          WORKFLOW 4: CONNECTED ECOSYSTEM SIMULATOR
          ========================================================================= */}
      {activeWorkflow === 'connected-ecosystem' && (
        <div className="space-y-6">
          <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-100">Live Interconnected Ecosystem Simulator</h3>
                <p className="text-xs text-slate-400">
                  Observe how one event cascades across all 8 personas in real time:
                  <br />
                  <strong className="text-sky-300">Athlete Profile → Medical Status → Training Eligibility → Session Assignment → Training Data → Injury Detection → Rehab → Medical Clearance → Training Modification</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const next = (simulationStepIndex + 1) % SIMULATION_STAGES.length;
                    setSimulationStepIndex(next);
                    onTriggerToast(`Cascading step ${next + 1}: ${SIMULATION_STAGES[next].title}`);
                  }}
                  className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Step Forward ({simulationStepIndex + 1}/9)</span>
                </button>
                <button
                  onClick={() => {
                    setSimulationStepIndex(0);
                    onTriggerToast('Simulation reset to Step 1: Athlete Profile & Clearance');
                  }}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                  title="Reset Simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-2">
              {SIMULATION_STAGES.map((st, i) => {
                const isActive = simulationStepIndex === i;
                const isPast = simulationStepIndex > i;
                return (
                  <button
                    key={st.id}
                    onClick={() => {
                      setSimulationStepIndex(i);
                      onTriggerToast(`Inspecting Step ${i + 1}: ${st.title}`);
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'bg-sky-500/20 border-sky-500 text-sky-200 ring-2 ring-sky-500 shadow'
                        : isPast
                        ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-[#090D16] border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold">{i + 1}. {st.owner}</div>
                    <div className="font-semibold text-xs text-slate-100 mt-1 line-clamp-1">{st.title.split('. ')[1]}</div>
                    <div className="text-[10px] mt-1 text-slate-400 line-clamp-1">{st.status}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Simulation Step Detail Card */}
            <div className="p-5 rounded-lg bg-[#090D16] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-bold">
                    STEP {simulationStepIndex + 1} OF 9 · {SIMULATION_STAGES[simulationStepIndex].owner}
                  </span>
                  <h4 className="text-lg font-bold text-slate-100 mt-0.5">
                    {SIMULATION_STAGES[simulationStepIndex].title}
                  </h4>
                </div>
                <span className="px-3 py-1 rounded bg-sky-500/20 text-sky-300 font-mono font-bold text-xs border border-sky-500/40">
                  {SIMULATION_STAGES[simulationStepIndex].status}
                </span>
              </div>

              <p className="text-sm text-slate-300">{SIMULATION_STAGES[simulationStepIndex].desc}</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3 rounded bg-[#0F1623] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Who Creates Data:</span>
                  <strong className="text-slate-100">{SIMULATION_STAGES[simulationStepIndex].owner}</strong>
                </div>
                <div className="p-3 rounded bg-[#0F1623] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Who Reviews / Approves:</span>
                  <strong className="text-sky-300">
                    {simulationStepIndex < 3 ? 'Admin & Medical Board' : simulationStepIndex < 6 ? 'Head Coach & Sports Scientist' : 'Chief Medical Officer'}
                  </strong>
                </div>
                <div className="p-3 rounded bg-[#0F1623] border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Downstream Impact:</span>
                  <strong className="text-emerald-300">
                    {simulationStepIndex < 2 ? 'Propagates to Squad Selection' : simulationStepIndex < 5 ? 'Caps GPS Target Speeds' : 'Updates Olympic Cycle Roster'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
