import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  Filter,
  Flame,
  Layers,
  Play,
  Plus,
  RefreshCw,
  Search,
  Sliders,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
  Radio,
  Video,
  ShieldCheck,
  PlayCircle,
  Eye,
} from 'lucide-react';
import {
  Athlete,
  LoadLevel,
  NavItemId,
  SessionIntensity,
  SessionStatus,
  TrainingSession,
  UserRole,
} from '../../types/usi';
import { AthleteAvatar, LoadBadge, StatusBadge } from '../ui/Badges';

export type TrainingSubTab =
  | 'periodisation'
  | 'sessions'
  | 'builder'
  | 'attendance-rpe'
  | 'exercises'
  | 'workload'
  | 'live-pitchside';

interface ExerciseItem {
  id: string;
  name: string;
  category: 'Velocity Based' | 'Plyometric' | 'Strength & Power' | 'Hamstring / Eccentric' | 'Tactical Grids' | 'Movement Prep';
  primaryMuscle: string;
  targetAdaptation: string;
  recommendedSets: string;
  recommendedReps: string;
  intensityZone: string;
  loadCoefficientAu: number;
}

const EXERCISE_LIBRARY: ExerciseItem[] = [
  {
    id: 'ex-01',
    name: 'Nordic Hamstring Curl (Eccentric Overload)',
    category: 'Hamstring / Eccentric',
    primaryMuscle: 'Biceps Femoris & Semitendinosus',
    targetAdaptation: 'Fascicle length elongation & eccentric peak torque',
    recommendedSets: '4 sets',
    recommendedReps: '5-6 reps',
    intensityZone: 'Maximal Eccentric (>90%)',
    loadCoefficientAu: 85,
  },
  {
    id: 'ex-02',
    name: 'Trap Bar Deadlift (Peak Velocity VBT)',
    category: 'Velocity Based',
    primaryMuscle: 'Posterior Chain / Gluteal Complex',
    targetAdaptation: 'Mean propulsive velocity >0.75 m/s at 75% 1RM',
    recommendedSets: '5 sets',
    recommendedReps: '3 reps',
    intensityZone: 'Velocity Threshold (0.75 - 0.90 m/s)',
    loadCoefficientAu: 120,
  },
  {
    id: 'ex-03',
    name: 'Repeated Sprint Ability (RSA) 6 x 30m Shuttle',
    category: 'Velocity Based',
    primaryMuscle: 'Cardiorespiratory / Quads & Calves',
    targetAdaptation: 'High-speed running capacity >24 km/h under fatigue',
    recommendedSets: '2 blocks',
    recommendedReps: '6 reps (30s rest)',
    intensityZone: 'Supra-maximal High-Speed Running',
    loadCoefficientAu: 160,
  },
  {
    id: 'ex-04',
    name: 'Depth Jump to Reactive Hurdle Hop',
    category: 'Plyometric',
    primaryMuscle: 'Plantar Flexors & Stretch-Shortening Cycle',
    targetAdaptation: 'Ground contact time <160ms, Reactive Strength Index >2.4',
    recommendedSets: '4 sets',
    recommendedReps: '4 jumps',
    intensityZone: 'High Neuromuscular Impact',
    loadCoefficientAu: 75,
  },
  {
    id: 'ex-05',
    name: 'Tactical Positional Possession (7v7 + 3 Floaters)',
    category: 'Tactical Grids',
    primaryMuscle: 'Full Body Aerobic / Agility',
    targetAdaptation: 'Accelerations (>3 m/s²), Decelerations (>3 m/s²), Spatial Decision Speed',
    recommendedSets: '4 periods',
    recommendedReps: '6 min sets',
    intensityZone: 'Metabolic Power 18–24 W/kg',
    loadCoefficientAu: 210,
  },
  {
    id: 'ex-06',
    name: 'Isokinetic Knee Extension & Flexion (Hamstring:Quad Ratio)',
    category: 'Strength & Power',
    primaryMuscle: 'Quadriceps / Hamstrings (Symmetry)',
    targetAdaptation: 'H:Q strength ratio >0.65; Limb symmetry index >92%',
    recommendedSets: '3 sets',
    recommendedReps: '8 reps @ 60°/s',
    intensityZone: 'Targeted Clinical Loading',
    loadCoefficientAu: 90,
  },
  {
    id: 'ex-07',
    name: 'Banded Lateral Ankle Pre-Hab & Proprioception',
    category: 'Movement Prep',
    primaryMuscle: 'Peroneal Longus & Brevis',
    targetAdaptation: 'Inversion protection & joint position sense',
    recommendedSets: '3 sets',
    recommendedReps: '15 reps each side',
    intensityZone: 'Low Load / Activation',
    loadCoefficientAu: 40,
  },
];

interface MacrocyclePhase {
  id: string;
  name: string;
  dateRange: string;
  durationWeeks: number;
  objective: string;
  volumeTier: 'High' | 'Moderate' | 'Low';
  intensityTier: 'High' | 'Moderate' | 'Low';
  targetAcwrRange: string;
  status: 'Completed' | 'Active' | 'Upcoming';
}

const MACROCYCLE_PLAN: MacrocyclePhase[] = [
  {
    id: 'phase-01',
    name: 'General Physical Preparation (GPP)',
    dateRange: '01 Jul – 15 Aug 2026',
    durationWeeks: 6,
    objective: 'Build aerobic capacity, tissue resilience, and neuromuscular foundation.',
    volumeTier: 'High',
    intensityTier: 'Moderate',
    targetAcwrRange: '1.05 – 1.25',
    status: 'Completed',
  },
  {
    id: 'phase-02',
    name: 'Specific Physical Preparation (SPP)',
    dateRange: '16 Aug – 20 Sep 2026',
    durationWeeks: 5,
    objective: 'Elevate high-speed running tolerance, sport-specific power, and tactical density.',
    volumeTier: 'Moderate',
    intensityTier: 'High',
    targetAcwrRange: '1.10 – 1.30',
    status: 'Completed',
  },
  {
    id: 'phase-03',
    name: 'Competition Phase I — National Qualifiers',
    dateRange: '21 Sep – 25 Oct 2026',
    durationWeeks: 5,
    objective: 'Peak competitive readiness, optimize taper-load balance, and preserve low injury incidence.',
    volumeTier: 'Low',
    intensityTier: 'High',
    targetAcwrRange: '0.90 – 1.15',
    status: 'Active',
  },
  {
    id: 'phase-04',
    name: 'Regeneration & Mid-Season Reset Block',
    dateRange: '26 Oct – 08 Nov 2026',
    durationWeeks: 2,
    objective: 'Restore glycogen depletion, deload joints, and reassess baseline neuromuscular fatigue.',
    volumeTier: 'Low',
    intensityTier: 'Low',
    targetAcwrRange: '0.70 – 0.90',
    status: 'Upcoming',
  },
  {
    id: 'phase-05',
    name: 'Peak Championship Peaking Block',
    dateRange: '09 Nov – 20 Dec 2026',
    durationWeeks: 6,
    objective: 'Maximum tactical speed, micro-tapering, and championship match execution.',
    volumeTier: 'Low',
    intensityTier: 'High',
    targetAcwrRange: '0.85 – 1.10',
    status: 'Upcoming',
  },
];

interface TrainingWorkspaceProps {
  activeSubTab: TrainingSubTab;
  onSelectSubTab: (tab: TrainingSubTab) => void;
  selectedRole?: UserRole;
  sessions: TrainingSession[];
  athletes: Athlete[];
  onOpenSessionAssignment?: () => void;
  onSelectSession: (session: TrainingSession) => void;
  onCreateSession: (newSession: TrainingSession) => void;
  onRecordAttendanceAndRpe: (
    sessionId: string,
    records: { athleteId: string; attendance: 'Present' | 'Late' | 'Excused' | 'Injured'; rpe: number }[]
  ) => void;
  onOpenAthlete360: (athlete: Athlete) => void;
  onTriggerToast: (message: string) => void;
}

export const TrainingWorkspace: React.FC<TrainingWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  selectedRole = 'Coach',
  sessions,
  athletes,
  onOpenSessionAssignment,
  onSelectSession,
  onCreateSession,
  onRecordAttendanceAndRpe,
  onOpenAthlete360,
  onTriggerToast,
}) => {
  // Session Builder Form State
  const [newTitle, setNewTitle] = useState('High-Intensity Tactical Pressing & Speed Endurance');
  const [newCategory, setNewCategory] = useState<'Conditioning' | 'Strength' | 'Tactical' | 'Recovery' | 'Speed' | 'Technical'>('Tactical');
  const [newTime, setNewTime] = useState('10:00 AM');
  const [newDuration, setNewDuration] = useState(75);
  const [newIntensity, setNewIntensity] = useState<SessionIntensity>('High');
  const [newVenue, setNewVenue] = useState('Pitch 1 (National Stadium)');
  const [newSquad, setNewSquad] = useState('Senior Squad');
  const [newCoach, setNewCoach] = useState('Vikram Sharma');
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>(['ex-01', 'ex-03', 'ex-05']);
  const [builderSuccess, setBuilderSuccess] = useState(false);

  // Coach Attendance & sRPE Workflow State
  const [activeAttendanceSessionId, setActiveAttendanceSessionId] = useState<string>(sessions[0]?.id || 'sess-101');
  const activeSession = sessions.find((s) => s.id === activeAttendanceSessionId) || sessions[0];
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, { attendance: 'Present' | 'Late' | 'Excused' | 'Injured'; rpe: number }>
  >(() => {
    const init: Record<string, { attendance: 'Present' | 'Late' | 'Excused' | 'Injured'; rpe: number }> = {};
    athletes.forEach((ath, idx) => {
      init[ath.id] = {
        attendance: ath.trainingStatus === 'INJURED' ? 'Injured' : 'Present',
        rpe: idx === 0 ? 8 : idx === 1 ? 7 : 6,
      };
    });
    return init;
  });

  // ACWR Interactive Simulator State
  const [simulatedSessionLoad, setSimulatedSessionLoad] = useState<number>(550);
  const [selectedSimAthleteId, setSelectedSimAthleteId] = useState<string>(athletes[0]?.id || '');
  const simAthlete = athletes.find((a) => a.id === selectedSimAthleteId) || athletes[0];

  // Exercise Library Filters
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [exerciseCategoryFilter, setExerciseCategoryFilter] = useState('All');

  // Live Pitchside Swaps State
  const [pitchsideRoster, setPitchsideRoster] = useState<{ [athleteId: string]: 'pitch' | 'off-feet' | 'rehab' }>({
    'ath-arjun-mehta': 'off-feet',
    'ath-kabir-rao': 'pitch',
    'ath-vikram-malhotra': 'pitch',
    'ath-rohan-kapoor': 'pitch',
  });
  const [selectedDrillClip, setSelectedDrillClip] = useState<{
    title: string;
    duration: string;
    diagram: string;
    focus: string;
  } | null>(null);

  const handleSwapZone = (athleteId: string, athleteName: string, newZone: 'pitch' | 'off-feet' | 'rehab') => {
    setPitchsideRoster(prev => ({ ...prev, [athleteId]: newZone }));
    const zoneLabels = {
      'pitch': 'Full Pitch Drill Grid (100% Load)',
      'off-feet': 'Off-Feet Conditioning (-40% Mechanical Load)',
      'rehab': 'Dugout Observation / Ice Hydration (-85% Load)'
    };
    onTriggerToast(`Pitchside Swap: ${athleteName} moved to ${zoneLabels[newZone]} ✓ Load model updated`);
  };

  // Handle Session Builder Submit
  const handleBuildSession = (e: React.FormEvent) => {
    e.preventDefault();
    const plannedLoad = selectedExerciseIds.reduce((sum, id) => {
      const ex = EXERCISE_LIBRARY.find((e) => e.id === id);
      return sum + (ex ? ex.loadCoefficientAu * 2.2 : 120);
    }, 180);

    const drills = selectedExerciseIds.map((id) => {
      const ex = EXERCISE_LIBRARY.find((e) => e.id === id);
      return {
        name: ex ? ex.name : 'Tactical Phase Drill',
        duration: '20 min',
        targetZone: ex ? ex.intensityZone : 'Aerobic Zone 4',
      };
    });

    const newSess: TrainingSession = {
      id: `sess-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      time: newTime,
      durationMin: newDuration,
      coach: newCoach,
      coachRole: 'Lead S&C Coach',
      squad: newSquad,
      pitchOrVenue: newVenue,
      attendance: 95,
      attendedCount: athletes.length - 1,
      scheduledCount: athletes.length,
      intensity: newIntensity,
      status: 'Upcoming',
      plannedLoadAu: Math.round(plannedLoad),
      targetHighSpeedM: 1400,
      objectives: [
        'Tactical high block press coordination',
        'Velocity sprint threshold maintenance',
        'Post-activation potentiation recovery',
      ],
      drills,
      modifiedAthletes: [
        {
          athleteId: 'ath-1042',
          athleteName: 'Arjun Mehta',
          modification: 'Cap HSR at 70%; isolate from maximal deceleration bouts',
        },
      ],
      notes: `Built by ${selectedRole} via USI Session Builder. Target Load: ${Math.round(plannedLoad)} AU.`,
    };

    onCreateSession(newSess);
    setBuilderSuccess(true);
    onTriggerToast(`Created Training Session: "${newTitle}" with ${drills.length} drill protocols ✓`);
    setTimeout(() => {
      setBuilderSuccess(false);
      onSelectSubTab('sessions');
    }, 1200);
  };

  // Handle Record Attendance & sRPE
  const handleSubmitAttendanceAndRpe = () => {
    const records = Object.entries(attendanceRecords).map(([athleteId, rec]) => ({
      athleteId,
      attendance: rec.attendance,
      rpe: rec.rpe,
    }));

    onRecordAttendanceAndRpe(activeAttendanceSessionId, records);
    onTriggerToast(
      `Logged Attendance & sRPE for ${records.length} athletes on "${activeSession?.title || 'Session'}" ✓ — ACWR and Acute Loads Updated`
    );
  };

  const filteredExercises = EXERCISE_LIBRARY.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.primaryMuscle.toLowerCase().includes(exerciseSearch.toLowerCase()) ||
      ex.targetAdaptation.toLowerCase().includes(exerciseSearch.toLowerCase());
    const matchesCat = exerciseCategoryFilter === 'All' || ex.category === exerciseCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-5">
      {/* 1. Header & Navigation Subtabs */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <Dumbbell className="w-4 h-4 text-sky-400" />
              <span>TRAINING & PERIODISATION WORKSPACE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Operational Coach & S&C Module</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">
              National Training Architecture & Periodisation Engine
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-cycle periodisation planning, dynamic session builder, live coach attendance & sRPE collection, and ACWR load modeling.
            </p>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="flex flex-wrap items-center gap-1 pt-3">
          {(
            [
              { id: 'periodisation', label: 'Macro/Meso/Micro Cycles', icon: Calendar },
              { id: 'sessions', label: 'Operational Sessions', icon: Dumbbell },
              { id: 'live-pitchside', label: '⚡ Live Pitchside Swaps', icon: Radio },
              { id: 'builder', label: 'Session Builder', icon: Plus },
              { id: 'attendance-rpe', label: 'Coach Attendance & sRPE Log', icon: UserCheck },
              { id: 'exercises', label: 'Exercise & Drill Library', icon: Layers },
              { id: 'workload', label: 'Workload & ACWR Monitor', icon: Activity },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectSubTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUBTAB: MACRO/MESO/MICRO PERIODISATION */}
      {activeSubTab === 'periodisation' && (
        <div className="space-y-5">
          {/* Active Cycle KPI Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">Current Active Phase</span>
              <strong className="text-sm font-bold text-sky-400 mt-1 block">
                Competition Phase I — National Qualifiers
              </strong>
              <div className="text-[11px] font-mono text-slate-500 mt-1">Week 2 of 5 · Taper Index: 0.88</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">Target Squad ACWR Corridor</span>
              <strong className="text-base font-bold text-emerald-400 mt-1 block font-mono">
                0.90 – 1.15 (Safe Zone)
              </strong>
              <div className="text-[11px] text-slate-400 mt-1">Current Squad Median: 1.08</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">Target Planned Volume</span>
              <strong className="text-base font-bold text-slate-200 mt-1 block font-mono">
                3,450 AU / Week
              </strong>
              <div className="text-[11px] text-amber-400 mt-1">Moderate-to-Low Volume · High Intensity</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">National Competition Date</span>
              <strong className="text-base font-bold text-rose-400 mt-1 block font-mono">
                24 Oct 2026 (26 Days)
              </strong>
              <div className="text-[11px] text-slate-400 mt-1">Olympic Pathway Qualifier</div>
            </div>
          </div>

          {/* Macrocycle Timeline Gantt */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  52-WEEK FEDERATION MACROCYCLE PERIODISATION TIMELINE
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Strategic volume-intensity wave periodisation aligned to major tournament cycles.
                </p>
              </div>
              <span className="text-xs font-mono text-sky-400">Senior Men's Squad Architecture</span>
            </div>

            <div className="mt-4 space-y-3">
              {MACROCYCLE_PLAN.map((phase, idx) => {
                const isActive = phase.status === 'Active';
                return (
                  <div
                    key={phase.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isActive
                        ? 'bg-sky-500/10 border-sky-500/50 shadow-lg shadow-sky-950/20'
                        : 'bg-[#0B101B] border-slate-800/80 hover:bg-[#121927]'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                            phase.status === 'Completed'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : isActive
                                ? 'bg-sky-500 text-slate-950 font-bold'
                                : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-100">{phase.name}</h4>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold uppercase ${
                                phase.status === 'Completed'
                                  ? 'bg-emerald-500/15 text-emerald-300'
                                  : isActive
                                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                                    : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {phase.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">{phase.objective}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block text-[10px]">TIMEFRAME</span>
                          <span className="text-slate-300 font-semibold">{phase.dateRange}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">VOLUME / INTENSITY</span>
                          <span className="text-slate-200">
                            Vol: <strong className="text-sky-300">{phase.volumeTier}</strong> · Int:{' '}
                            <strong className="text-rose-300">{phase.intensityTier}</strong>
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">TARGET ACWR</span>
                          <span className="text-emerald-400 font-bold">{phase.targetAcwrRange}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBTAB: OPERATIONAL SESSIONS */}
      {activeSubTab === 'sessions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0F1623] border border-slate-800 p-4 rounded-lg">
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                ACTIVE SQUAD TRAINING SESSIONS & SCHEDULE
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any session card to open the operational detail drawer, drill blueprints, and athlete modifications.
              </p>
            </div>
            <div className="flex items-center gap-2">
              {onOpenSessionAssignment && (
                <button
                  onClick={onOpenSessionAssignment}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Assign Athletes</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess)}
                className="p-5 rounded-lg bg-[#0F1623] hover:bg-[#141C2B] border border-slate-800/90 cursor-pointer transition-all space-y-3.5 group shadow-sm hover:border-sky-500/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                        {sess.category}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs text-slate-400 font-mono">{sess.time}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-100 group-hover:text-sky-300 transition-colors mt-0.5">
                      {sess.title}
                    </h3>
                  </div>
                  <StatusBadge status={sess.status} />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-2 px-3 rounded bg-[#090D16] border border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-slate-500 block text-[10px]">VENUE</span>
                    <span className="text-slate-300 truncate block">{sess.pitchOrVenue}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">LEAD COACH</span>
                    <span className="text-slate-200 truncate block">{sess.coach}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">PLANNED LOAD</span>
                    <span className="text-sky-400 font-bold">{sess.plannedLoadAu} AU</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/70">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-300 font-mono">
                      Attendance: {sess.attendance}% ({sess.attendedCount}/{sess.scheduledCount})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LoadBadge load={sess.intensity} />
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-sky-300 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SUBTAB: SESSION BUILDER */}
      {activeSubTab === 'builder' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-base font-bold text-slate-100">
              Interactive Training Session Builder
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Design and prescribe training blocks, link standardized exercise library protocols, and configure squad load targets.
            </p>
          </div>

          {builderSuccess && (
            <div className="my-4 p-4 rounded-md bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Session Successfully Created & Broadcast to Squad Operations ✓</span>
            </div>
          )}

          <form onSubmit={handleBuildSession} className="mt-4 space-y-5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Session Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  <option value="Tactical">Tactical</option>
                  <option value="Conditioning">Conditioning</option>
                  <option value="Strength">Strength</option>
                  <option value="Speed">Speed</option>
                  <option value="Recovery">Recovery</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Scheduled Time</label>
                <input
                  type="text"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Duration (Minutes)</label>
                <input
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Intensity</label>
                <select
                  value={newIntensity}
                  onChange={(e) => setNewIntensity(e.target.value as SessionIntensity)}
                  className="w-full px-3 py-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  <option value="High">High (Match Intensity / Overload)</option>
                  <option value="Moderate">Moderate (Tactical Aerobic)</option>
                  <option value="Low">Low (Active Recovery / Deload)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Pitch / Training Venue</label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
            </div>

            {/* Drill Protocol Selection from Exercise Library */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-200">
                  Select Exercises & Drill Protocols from Library ({selectedExerciseIds.length} Selected)
                </span>
                <span className="text-[11px] font-mono text-sky-400">
                  Estimated Session Volume: ~{selectedExerciseIds.length * 160} AU
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {EXERCISE_LIBRARY.map((ex) => {
                  const isSelected = selectedExerciseIds.includes(ex.id);
                  return (
                    <div
                      key={ex.id}
                      onClick={() => {
                        setSelectedExerciseIds((prev) =>
                          isSelected ? prev.filter((id) => id !== ex.id) : [...prev, ex.id]
                        );
                      }}
                      className={`p-3 rounded-md border cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-500/15 border-sky-500 text-slate-100'
                          : 'bg-[#090D16] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-100">{ex.name}</span>
                        {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                      </div>
                      <div className="text-[11px] text-sky-400 font-mono mt-0.5">{ex.category}</div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {ex.recommendedSets} · {ex.recommendedReps}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => onSelectSubTab('sessions')}
                className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Training Session</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. SUBTAB: COACH ATTENDANCE & sRPE WORKFLOW */}
      {activeSubTab === 'attendance-rpe' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <div className="text-xs font-mono text-sky-400">COACH OPERATIONAL WORKFLOW</div>
              <h2 className="text-base font-bold text-slate-100 mt-0.5">
                Session Attendance Register & Live sRPE Collection
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Mark pitch attendance, collect subjective Rating of Perceived Exertion (Borg CR-10), and compute internal training load (sRPE × Duration).
              </p>
            </div>

            {/* Session Switcher Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Active Session:</span>
              <select
                value={activeAttendanceSessionId}
                onChange={(e) => setActiveAttendanceSessionId(e.target.value)}
                className="px-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-xs font-semibold text-sky-300"
              >
                {sessions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.time})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeSession && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 rounded-lg bg-[#0B101B] border border-slate-800 text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">VENUE</span>
                <strong className="text-slate-200">{activeSession.pitchOrVenue}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">LEAD COACH</span>
                <strong className="text-slate-200">{activeSession.coach}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DURATION</span>
                <strong className="font-mono text-sky-400">{activeSession.durationMin} min</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PLANNED LOAD</span>
                <strong className="font-mono text-emerald-400">{activeSession.plannedLoadAu} AU</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">INTENSITY TIER</span>
                <strong className="font-mono text-amber-300">{activeSession.intensity}</strong>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Athlete</th>
                  <th className="py-2.5 px-3">Position</th>
                  <th className="py-2.5 px-3">Attendance Status</th>
                  <th className="py-2.5 px-3">sRPE (Borg CR-10)</th>
                  <th className="py-2.5 px-3">Calculated Internal Load</th>
                  <th className="py-2.5 px-3 text-right">Current ACWR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {athletes.map((ath) => {
                  const rec = attendanceRecords[ath.id] || { attendance: 'Present', rpe: 7 };
                  const duration = activeSession?.durationMin || 75;
                  const calculatedAu = rec.attendance === 'Present' || rec.attendance === 'Late' ? rec.rpe * duration : 0;

                  return (
                    <tr key={ath.id} className="hover:bg-[#121927] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <AthleteAvatar
                            name={ath.name}
                            jerseyNumber={ath.jerseyNumber}
                            status={ath.status}
                            size="sm"
                          />
                          <div>
                            <div className="font-semibold text-slate-100">{ath.name}</div>
                            <div className="text-[11px] font-mono text-slate-500">{ath.athleteId}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-slate-300">{ath.position}</td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {(['Present', 'Late', 'Excused', 'Injured'] as const).map((stat) => (
                            <button
                              key={stat}
                              onClick={() => {
                                setAttendanceRecords((prev) => ({
                                  ...prev,
                                  [ath.id]: { ...rec, attendance: stat },
                                }));
                              }}
                              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                                rec.attendance === stat
                                  ? stat === 'Present'
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                    : stat === 'Late'
                                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                      : stat === 'Injured'
                                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                        : 'bg-slate-700 text-slate-200'
                                  : 'bg-[#090D16] text-slate-400 hover:text-slate-200 border border-slate-800'
                              }`}
                            >
                              {stat}
                            </button>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={rec.rpe}
                            disabled={rec.attendance === 'Excused' || rec.attendance === 'Injured'}
                            onChange={(e) => {
                              const nextRpe = Number(e.target.value);
                              setAttendanceRecords((prev) => ({
                                ...prev,
                                [ath.id]: { ...rec, rpe: nextRpe },
                              }));
                            }}
                            className="w-24 accent-sky-500 cursor-pointer"
                          />
                          <span className="font-mono font-bold text-sky-400 tabular-nums w-6">
                            {rec.attendance === 'Injured' || rec.attendance === 'Excused' ? '-' : `${rec.rpe}/10`}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono">
                        <span className="text-slate-100 font-bold">{calculatedAu} AU</span>
                        <span className="text-[11px] text-slate-500 ml-1.5">
                          ({rec.rpe} × {duration}m)
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-300">
                        {ath.acwr.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              Formula: Internal Training Load (AU) = Borg CR-10 sRPE × Session Duration (Minutes)
            </span>
            <button
              onClick={handleSubmitAttendanceAndRpe}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Submit & Apply Session Load</span>
            </button>
          </div>
        </div>
      )}

      {/* 6. SUBTAB: EXERCISE LIBRARY */}
      {activeSubTab === 'exercises' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                STANDARDIZED EXERCISE & DRILL LIBRARY
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Evidence-based strength & conditioning, velocity-based training (VBT), and injury mitigation protocols.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(['All', 'Velocity Based', 'Plyometric', 'Strength & Power', 'Hamstring / Eccentric', 'Tactical Grids'] as const).map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setExerciseCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded font-medium transition-colors ${
                      exerciseCategoryFilter === cat
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'bg-[#090D16] text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredExercises.map((ex) => (
              <div
                key={ex.id}
                className="p-4 rounded-lg bg-[#0B101B] border border-slate-800 space-y-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-bold text-slate-100">{ex.name}</h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30 whitespace-nowrap">
                    {ex.category}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  <strong>Target Muscle:</strong> {ex.primaryMuscle}
                </div>

                <div className="text-[11px] text-slate-300 bg-[#090D16] p-2 rounded border border-slate-800/80">
                  <span className="text-slate-400 block text-[10px]">PHYSIOLOGICAL ADAPTATION</span>
                  {ex.targetAdaptation}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    {ex.recommendedSets} · {ex.recommendedReps}
                  </span>
                  <span className="text-emerald-400 font-bold">{ex.loadCoefficientAu} AU / set</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SUBTAB: WORKLOAD & ACWR CALCULATIONS */}
      {activeSubTab === 'workload' && (
        <div className="space-y-5">
          {/* Interactive ACWR Simulator Card */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <div className="pb-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                    ACUTE:CHRONIC WORKLOAD RATIO (ACWR) INTERACTIVE SIMULATOR
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Simulate tomorrow's planned training session load to predict ACWR shifts and detect injury risk spikes before prescribing.
                </p>
              </div>

              {/* Select Athlete for Simulation */}
              <select
                value={selectedSimAthleteId}
                onChange={(e) => setSelectedSimAthleteId(e.target.value)}
                className="px-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-xs font-semibold text-sky-300"
              >
                {athletes.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.position} · Current ACWR: {a.acwr.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {/* Simulator Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4 items-center">
              {/* Slider Controls */}
              <div className="lg:col-span-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">
                      Simulate Planned Session Load (AU)
                    </span>
                    <span className="font-mono font-bold text-sky-400 text-sm">
                      {simulatedSessionLoad} AU
                    </span>
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="1000"
                    step="25"
                    value={simulatedSessionLoad}
                    onChange={(e) => setSimulatedSessionLoad(Number(e.target.value))}
                    className="w-full accent-sky-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>100 AU (Recovery)</span>
                    <span>500 AU (Standard)</span>
                    <span>1000 AU (Extreme Overload)</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-[#0B101B] border border-slate-800 text-xs space-y-2">
                  <div className="text-slate-300 font-semibold">Simulated Athlete Telemetry:</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
                    <div>Current Acute (7d): <strong className="text-slate-200">{simAthlete.acuteLoadAu} AU</strong></div>
                    <div>Chronic Baseline (28d): <strong className="text-slate-200">{simAthlete.chronicLoadAu} AU</strong></div>
                  </div>
                </div>
              </div>

              {/* Simulated Output Card */}
              {(() => {
                const simulatedAcute = Math.round(simAthlete.acuteLoadAu * 0.85 + simulatedSessionLoad * 0.15);
                const simulatedAcwr = Number((simulatedAcute / (simAthlete.chronicLoadAu || 500)).toFixed(2));
                const isDangerous = simulatedAcwr > 1.45;
                const isUnderTraining = simulatedAcwr < 0.8;

                return (
                  <div className="lg:col-span-6 p-5 rounded-lg bg-[#0B101B] border border-slate-800 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">PROJECTED POST-SESSION ACWR</span>
                      <span
                        className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                          isDangerous
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : isUnderTraining
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {isDangerous ? 'SPIKE RISK DANGER' : isUnderTraining ? 'UNDERTRAINING' : 'OPTIMAL SWEET SPOT'}
                      </span>
                    </div>

                    <div className="my-3 flex items-baseline gap-3">
                      <span className="text-3xl font-mono font-black text-slate-100">{simulatedAcwr}</span>
                      <span className="text-xs font-mono text-slate-400">
                        (Baseline: {simAthlete.acwr.toFixed(2)} → Delta: {simulatedAcwr >= simAthlete.acwr ? '+' : ''}
                        {(simulatedAcwr - simAthlete.acwr).toFixed(2)})
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {isDangerous
                        ? '⚠️ Load spike exceeds 1.45. High risk of soft-tissue hamstring or groin strain over the next 48-72 hours. Recommended: Cap session duration or substitute low-impact recovery.'
                        : isUnderTraining
                          ? 'Notice: Workload is below 0.80. Chronic fitness erosion risk over prolonged deloading.'
                          : '✓ Workload falls inside the evidence-based sweet spot (0.80 – 1.30). Fitness gains achieved without excessive tissue injury hazard.'}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Squad Workload Table */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-100 uppercase mb-3">
              Squad Longitudinal ACWR Register
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Acute Load (7d)</th>
                    <th className="py-2.5 px-3">Chronic Load (28d)</th>
                    <th className="py-2.5 px-3">Current ACWR</th>
                    <th className="py-2.5 px-3">Risk Tier</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {athletes.map((ath) => (
                    <tr key={ath.id} className="hover:bg-[#121927]">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-100">{ath.name}</div>
                        <div className="text-[11px] font-mono text-slate-500">{ath.athleteId}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-300">{ath.position}</td>
                      <td className="py-3 px-3 font-mono text-slate-100">{ath.acuteLoadAu} AU</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{ath.chronicLoadAu} AU</td>
                      <td className="py-3 px-3 font-mono font-bold text-sky-400">{ath.acwr.toFixed(2)}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            ath.acwr > 1.4
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                              : ath.acwr < 0.8
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}
                        >
                          {ath.acwr > 1.4 ? 'SPIKE DANGER' : ath.acwr < 0.8 ? 'MONITOR DELOAD' : 'OPTIMAL'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onOpenAthlete360(ath)}
                          className="px-2.5 py-1 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-sky-300 font-medium text-[11px]"
                        >
                          View 360
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. SUBTAB: LIVE PITCHSIDE SWAPS & TACTICAL BLUEPRINTS */}
      {activeSubTab === 'live-pitchside' && (
        <div className="space-y-5">
          {/* Active Pitchside Live Session Banner */}
          <div className="bg-[#0b111e]/90 border border-emerald-500/30 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                      LIVE IN PROGRESS — MINUTE 38 / 75
                    </span>
                    <span className="text-xs font-mono text-slate-400">Natural Grass Pitch 1 (Zone A)</span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    {sessions[0]?.title || 'Matchday -2 High-Intensity Tactical Pressing & Transition Grids'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedDrillClip({
                    title: '4v4+3 High-Press Rest-Defence Schematic',
                    duration: '18 min block',
                    diagram: 'Pitch Zone A: 32m x 28m grid with 4 neutral playmakers and rapid counter-press cues.',
                    focus: 'Forces sub-2.5s regains. Max velocity bursts capped at 24 km/h for modified athletes.'
                  })}
                  className="px-3 py-1.5 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-xs font-semibold text-sky-300 flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Preview Tactical Video Blueprint</span>
                </button>
              </div>
            </div>

            {/* 3-Zone Live Pitchside Drag & Swap Board */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Zone 1: Main Pitch Drill */}
              <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <h3 className="text-xs font-bold text-slate-200 uppercase">
                      1. Main Pitch Drill Grid (Full Load)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {athletes.filter(a => (pitchsideRoster[a.id] || 'pitch') === 'pitch').length} Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Full mechanical contact, high-speed sprints, 100% intended sRPE stress.
                </p>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {athletes.filter(a => (pitchsideRoster[a.id] || 'pitch') === 'pitch').slice(0, 6).map((ath) => (
                    <div key={ath.id} className="p-2.5 rounded bg-[#0F1623] border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{ath.name}</div>
                        <div className="text-[10px] font-mono text-slate-400">{ath.position} · Load: {ath.trainingLoad}</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSwapZone(ath.id, ath.name, 'off-feet')}
                          className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-semibold text-amber-300"
                          title="Swap to stationary bike / upper body ergometer"
                        >
                          → Off-Feet
                        </button>
                        <button
                          onClick={() => handleSwapZone(ath.id, ath.name, 'rehab')}
                          className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[10px] font-semibold text-rose-300"
                          title="Pull to dugout for physio check"
                        >
                          → Dugout
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone 2: Off-Feet Conditioning Station */}
              <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <h3 className="text-xs font-bold text-slate-200 uppercase">
                      2. Off-Feet Conditioning (-40% Load)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">
                    {athletes.filter(a => pitchsideRoster[a.id] === 'off-feet').length} Modified
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Stationary WattBike, skiergometer, and non-impact aerobic capacity maintenance.
                </p>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {athletes.filter(a => pitchsideRoster[a.id] === 'off-feet').map((ath) => (
                    <div key={ath.id} className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-amber-200">{ath.name}</div>
                        <div className="text-[10px] font-mono text-amber-400">WattBike Zone 3 · Load Capped</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSwapZone(ath.id, ath.name, 'pitch')}
                          className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300"
                        >
                          → Pitch
                        </button>
                        <button
                          onClick={() => handleSwapZone(ath.id, ath.name, 'rehab')}
                          className="px-2 py-1 rounded bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-[10px] font-semibold text-rose-300"
                        >
                          → Dugout
                        </button>
                      </div>
                    </div>
                  ))}
                  {athletes.filter(a => pitchsideRoster[a.id] === 'off-feet').length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      No athletes currently swapped to off-feet conditioning.
                    </div>
                  )}
                </div>
              </div>

              {/* Zone 3: Dugout Rehab & Hydration */}
              <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                    <h3 className="text-xs font-bold text-slate-200 uppercase">
                      3. Dugout / Physio Check (-85% Load)
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-rose-400 font-bold">
                    {athletes.filter(a => pitchsideRoster[a.id] === 'rehab').length} Resting
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Ice bath rotation, manual therapy check, or immediate hydration reload station.
                </p>

                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {athletes.filter(a => pitchsideRoster[a.id] === 'rehab').map((ath) => (
                    <div key={ath.id} className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-rose-200">{ath.name}</div>
                        <div className="text-[10px] font-mono text-rose-400">Under Physio Review</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleSwapZone(ath.id, ath.name, 'pitch')}
                          className="px-2 py-1 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-[10px] font-semibold text-emerald-300"
                        >
                          → Pitch
                        </button>
                        <button
                          onClick={() => handleSwapZone(ath.id, ath.name, 'off-feet')}
                          className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-semibold text-amber-300"
                        >
                          → Off-Feet
                        </button>
                      </div>
                    </div>
                  ))}
                  {athletes.filter(a => pitchsideRoster[a.id] === 'rehab').length === 0 && (
                    <div className="p-4 text-center text-slate-500 text-xs">
                      Zero athletes currently in dugout recovery.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tactical Video Blueprint Preview Modal */}
          {selectedDrillClip && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#0b111e] border border-sky-500/40 rounded-xl max-w-xl w-full p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Video className="w-5 h-5 text-sky-400" />
                    <div>
                      <h3 className="text-sm font-bold text-white">{selectedDrillClip.title}</h3>
                      <span className="text-[11px] font-mono text-sky-400">{selectedDrillClip.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDrillClip(null)}
                    className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Animated Pitch Tactical Grid Blueprint */}
                <div className="aspect-video rounded-lg bg-emerald-950/40 border border-emerald-500/30 p-4 relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#10b981_1px,transparent_1px),linear-gradient(to_bottom,#10b981_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                  <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                    <span>ZONE A: HIGH PRESSING TRAP</span>
                    <span>32m x 28m</span>
                  </div>

                  <div className="relative z-10 my-auto text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-sky-500/30 border border-sky-400 mx-auto flex items-center justify-center text-sky-300">
                      <PlayCircle className="w-7 h-7" />
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      Simulated 4v4+3 Possession & Counter-Press Sequence
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Tactical Video Blueprint Feed #TC-8819
                    </div>
                  </div>

                  <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>Target: Sub-3.0s Transition</span>
                    <span>Cones: 8 Neon + 4 Poles</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 text-xs space-y-1">
                  <span className="font-semibold text-slate-200">Tactical Constraints & Objectives:</span>
                  <p className="text-[11px] text-slate-400">{selectedDrillClip.diagram}</p>
                  <p className="text-[11px] text-amber-300">{selectedDrillClip.focus}</p>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setSelectedDrillClip(null)}
                    className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs"
                  >
                    Done Pitchside Review
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
