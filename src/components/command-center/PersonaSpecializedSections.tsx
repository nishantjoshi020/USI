import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Apple,
  Award,
  BarChart2,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Droplets,
  FileCheck,
  FileText,
  Flame,
  Globe,
  HeartPulse,
  MapPin,
  Moon,
  PlusSquare,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Sparkles,
  Trophy,
  Truck,
  Upload,
  User,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  Wrench,
  Radio,
  Zap,
  Gauge,
  Info,
  ChevronRight,
  Dumbbell,
  RotateCcw,
  Send,
} from 'lucide-react';
import {
  Athlete,
  Injury,
  TrainingSession,
  UserRole,
  WearableTelemetry,
  PersonalDrillOrder,
} from '../../types/usi';

interface PersonaSpecializedSectionsProps {
  selectedRole: UserRole;
  activeAthlete?: Athlete;
  allAthletes?: Athlete[];
  sessions?: TrainingSession[];
  injuries?: Injury[];
  onSelectActiveAthlete?: (athleteId: string) => void;
  onOpenOnboarding?: () => void;
  onOpenApproval?: (athlete: Athlete) => void;
  onOpenCoachAssignment?: (athlete: Athlete) => void;
  onOpenSessionAssignment?: () => void;
  onOpenReportInjury?: (athleteId?: string) => void;
  onTriggerToast: (message: string) => void;
  onNavigateSection?: (navId: string) => void;
  onOpenCreateRehab?: (injury: Injury) => void;
  onOpenAdvanceRtp?: (injury: Injury) => void;
  onUpdateAthleteWellness?: (scores: {
    sleep: number;
    fatigue: number;
    soreness: number;
    stress: number;
    readiness: number;
  }) => void;
  onResetPersona?: () => void;
}

export const PersonaSpecializedSections: React.FC<PersonaSpecializedSectionsProps> = ({
  selectedRole,
  activeAthlete,
  allAthletes = [],
  sessions = [],
  injuries = [],
  onSelectActiveAthlete,
  onOpenOnboarding,
  onOpenApproval,
  onOpenCoachAssignment,
  onOpenSessionAssignment,
  onOpenReportInjury,
  onOpenCreateRehab,
  onOpenAdvanceRtp,
  onTriggerToast,
  onNavigateSection,
  onUpdateAthleteWellness,
  onResetPersona,
}) => {
  // Athlete Wellness State
  const [wellnessLogged, setWellnessLogged] = useState(false);
  const [sorenessLevel, setSorenessLevel] = useState(activeAthlete?.sorenessScore || 2);
  const [fatigueLevel, setFatigueLevel] = useState(3);
  const [stressLevel, setStressLevel] = useState(2);
  const [sleepScore, setSleepScore] = useState(88);
  const [wellnessEntryMode, setWellnessEntryMode] = useState<'3tap' | 'sliders'>('3tap');

  // Coach Tactical Load Slider State
  const [squadIntensityPct, setSquadIntensityPct] = useState(95);

  // Operations Work Orders State
  const [workOrders, setWorkOrders] = useState([
    { id: 'WO-101', title: 'Pitch 1 Sprinkler Valve Calibration', zone: 'Zone A Turf', status: 'IN_PROGRESS', priority: 'HIGH', time: '11:45 IST' },
    { id: 'WO-102', title: 'Cryo-Chamber Liquid Nitrogen Refill', zone: 'Medical Wing', status: 'COMPLETED', priority: 'MEDIUM', time: '09:15 IST' },
    { id: 'WO-103', title: 'Gym Cable Pulley Friction Inspection', zone: 'Olympic Gym', status: 'PENDING', priority: 'LOW', time: '14:00 IST' },
  ]);

  // Nutrition Hydration Queue State - Real System Athletes
  const [hydrationQueue, setHydrationQueue] = useState([
    { id: 'ath-arjun-mehta', name: 'Arjun Mehta', squad: 'Senior Squad', usg: 1.024, status: 'MONITOR', action: '500ml Hypotonic Bolus' },
    { id: 'ath-vikram-nair', name: 'Vikramaditya Nair', squad: 'Senior Squad', usg: 1.026, status: 'CRITICAL', action: '750ml Electrolyte + Carbs' },
    { id: 'ath-kabir-rao', name: 'Kabir Rao', squad: 'National U-23', usg: 1.018, status: 'NORMAL', action: 'Standard Electrolyte' },
    { id: 'ath-devansh-kulkarni', name: 'Devansh Kulkarni', squad: 'Senior Squad', usg: 1.019, status: 'NORMAL', action: 'Collagen Recovery Shake' },
    { id: 'ath-rahul-singh', name: 'Rahul Singh', squad: 'Senior Squad', usg: 1.012, status: 'OPTIMAL', action: 'Pre-Hydrated' },
  ]);

  // Federation Registry Queue - Real System Athletes
  const [registryQueue, setRegistryQueue] = useState([
    { id: 'ath-zorawar-gill', name: 'Zorawar Gill', sport: 'Football (Midfield)', state: 'Punjab', docs: 'National Camp Call-up · Insurance Pending', status: 'Review Required' },
    { id: 'ath-pranav-sundaram', name: 'Pranav Sundaram', sport: 'Football (Forward)', state: 'Tamil Nadu', docs: 'U-23 Contract · NOC Cleared', status: 'Awaiting Seal' },
    { id: 'ath-vikram-nair', name: 'Vikramaditya Nair', sport: 'Football (Forward)', state: 'Kerala', docs: 'Senior Passport · Biometrics Cleared', status: 'Approved' },
    { id: 'ath-arjun-mehta', name: 'Arjun Mehta', sport: 'Football (Forward)', state: 'Maharashtra', docs: 'Passport 48d Expiry · Tatkal Dispatched', status: 'Urgent Flag' },
  ]);

  const handleResetPersonaHub = () => {
    setWellnessLogged(false);
    setSorenessLevel(activeAthlete?.sorenessScore || 2);
    setFatigueLevel(3);
    setStressLevel(2);
    setSleepScore(88);
    setWellnessEntryMode('3tap');
    setSquadIntensityPct(95);
    setWorkOrders([
      { id: 'WO-101', title: 'Pitch 1 Sprinkler Valve Calibration', zone: 'Zone A Turf', status: 'IN_PROGRESS', priority: 'HIGH', time: '11:45 IST' },
      { id: 'WO-102', title: 'Cryo-Chamber Liquid Nitrogen Refill', zone: 'Medical Wing', status: 'COMPLETED', priority: 'MEDIUM', time: '09:15 IST' },
      { id: 'WO-103', title: 'Gym Cable Pulley Friction Inspection', zone: 'Olympic Gym', status: 'PENDING', priority: 'LOW', time: '14:00 IST' },
    ]);
    setHydrationQueue([
      { id: 'ath-arjun-mehta', name: 'Arjun Mehta', squad: 'Senior Squad', usg: 1.024, status: 'MONITOR', action: '500ml Hypotonic Bolus' },
      { id: 'ath-vikram-nair', name: 'Vikramaditya Nair', squad: 'Senior Squad', usg: 1.026, status: 'CRITICAL', action: '750ml Electrolyte + Carbs' },
      { id: 'ath-kabir-rao', name: 'Kabir Rao', squad: 'National U-23', usg: 1.018, status: 'NORMAL', action: 'Standard Electrolyte' },
      { id: 'ath-devansh-kulkarni', name: 'Devansh Kulkarni', squad: 'Senior Squad', usg: 1.019, status: 'NORMAL', action: 'Collagen Recovery Shake' },
      { id: 'ath-rahul-singh', name: 'Rahul Singh', squad: 'Senior Squad', usg: 1.012, status: 'OPTIMAL', action: 'Pre-Hydrated' },
    ]);
    setRegistryQueue([
      { id: 'ath-zorawar-gill', name: 'Zorawar Gill', sport: 'Football (Midfield)', state: 'Punjab', docs: 'National Camp Call-up · Insurance Pending', status: 'Review Required' },
      { id: 'ath-pranav-sundaram', name: 'Pranav Sundaram', sport: 'Football (Forward)', state: 'Tamil Nadu', docs: 'U-23 Contract · NOC Cleared', status: 'Awaiting Seal' },
      { id: 'ath-vikram-nair', name: 'Vikramaditya Nair', sport: 'Football (Forward)', state: 'Kerala', docs: 'Senior Passport · Biometrics Cleared', status: 'Approved' },
      { id: 'ath-arjun-mehta', name: 'Arjun Mehta', sport: 'Football (Forward)', state: 'Maharashtra', docs: 'Passport 48d Expiry · Tatkal Dispatched', status: 'Urgent Flag' },
    ]);
    if (onResetPersona) {
      onResetPersona();
    } else {
      onTriggerToast(`Reset ${selectedRole} persona state to baseline ✓`);
    }
  };

  /* =========================================================================
     1. ATHLETE PORTAL SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Athlete') {
    const currentAth = activeAthlete || allAthletes[0];
    const athSessions = sessions.filter(
      (s) => (currentAth && s.attendedAthletes?.includes(currentAth.id)) || s.squad === currentAth?.squad
    ).slice(0, 4);
    const athInjuries = injuries.filter((i) => i.athleteId === currentAth?.id);

    return (
      <div className="space-y-4">
        {/* Active Athlete Banner & Selector */}
        {currentAth && (
          <div className="bg-[#0b111e]/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 font-mono text-sm">
                {currentAth.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{currentAth.name}</h3>
                  <span className="font-mono text-xs text-sky-400">({currentAth.athleteId})</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                    currentAth.trainingStatus === 'INJURED' ? 'bg-rose-500/15 border-rose-500/30 text-rose-300' :
                    currentAth.trainingStatus === 'RESTRICTED' ? 'bg-orange-500/15 border-orange-500/30 text-orange-300' :
                    currentAth.trainingStatus === 'PENDING' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' :
                    'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  }`}>
                    {currentAth.trainingStatus}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>{currentAth.sport} · {currentAth.position}</span>
                  <span className="text-slate-600">·</span>
                  <span>Squad: <strong className="text-slate-300">{currentAth.squad}</strong></span>
                  <span className="text-slate-600">·</span>
                  <span>Coach: <strong className="text-slate-300">{currentAth.coach || 'Unassigned'}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetPersonaHub}
                className="px-2.5 py-1.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
                <span>Reset Athlete View</span>
              </button>
              <button
                onClick={() => onNavigateSection?.('athlete-360')}
                className="px-3 py-1.5 rounded bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 font-semibold text-xs flex items-center gap-1 transition-colors"
              >
                <span>Open My Athlete 360</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Active Medical Alert Notice if Injured */}
        {currentAth && athInjuries.length > 0 && (
          <div className="p-3.5 rounded-lg bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                <strong>Clinical Restriction:</strong> Active injury recorded: {athInjuries[0].diagnosis} ({athInjuries[0].bodyRegionDisplay}) · RTP Stage {athInjuries[0].rtpStage}/5 ({athInjuries[0].rtpStageName}).
              </span>
            </div>
            <button
              onClick={() => onNavigateSection?.('injury-intelligence')}
              className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-100 font-semibold shrink-0"
            >
              View Body Map & RTP →
            </button>
          </div>
        )}

        {/* 1. Personal Drill Focus Orders & Constraints Card */}
        <div className="bg-[#0b111e]/90 border border-slate-800 rounded-xl p-4.5 backdrop-blur-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                My Personalized Drill Focus Orders & GPS Speed Ceilings
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300 font-semibold">
              Coach & Physio Synchronized
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Speed Cap (GPS Vmax)</span>
                <Gauge className="w-3.5 h-3.5 text-sky-400" />
              </div>
              <div className="text-sm font-bold font-mono text-sky-300">
                {currentAth?.trainingStatus === 'RESTRICTED' || (athInjuries.length > 0 && athInjuries[0].rtpStage < 5)
                  ? '≤ 80% Vmax (24.0 km/h)'
                  : '≤ 92% Vmax (29.5 km/h)'}
              </div>
              <p className="text-[10px] text-slate-500">
                Controlled acceleration corridor; avoid maximal deceleration shocks
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Prescribed Hydration Target</span>
                <Droplets className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-sm font-bold font-mono text-emerald-300">
                500ml Isotonic Electrolyte + 150mg Na+
              </div>
              <p className="text-[10px] text-slate-500">
                Consume at minute 45 interval; based on morning USG profile
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-slate-400 text-[11px]">
                <span>Tactical Mechanical Directive</span>
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div className="text-xs font-semibold text-slate-200">
                {athInjuries.length > 0
                  ? `Protect ${athInjuries[0].bodyRegionDisplay}: zero slide-tackles`
                  : 'Focus on explosive low-angle turning transitions'}
              </div>
              <p className="text-[10px] text-slate-500">
                Coach note: Assigned to Unit 2 (Midfield Phase II pressing grid)
              </p>
            </div>
          </div>
        </div>

        {/* 2. IoT Wearable Telemetry & Discordance Detector */}
        <div className="bg-[#0b111e]/90 border border-slate-800 rounded-xl p-4.5 backdrop-blur-sm space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-sky-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Automated Wearable IoT Feed (Oura / Whoop Telemetry)
              </h3>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Synced at 06:15 IST (BLE Cloud Push)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-2.5 rounded bg-[#101827] border border-slate-800">
              <span className="text-[10px] text-slate-400 block">NIGHTLY HRV (rMSSD)</span>
              <div className="text-base font-bold text-rose-400 mt-0.5">44 ms</div>
              <span className="text-[10px] text-rose-300">-22% vs 30d Baseline</span>
            </div>
            <div className="p-2.5 rounded bg-[#101827] border border-slate-800">
              <span className="text-[10px] text-slate-400 block">RESTING HEART RATE</span>
              <div className="text-base font-bold text-sky-300 mt-0.5">52 bpm</div>
              <span className="text-[10px] text-slate-400">+3 bpm elevation</span>
            </div>
            <div className="p-2.5 rounded bg-[#101827] border border-slate-800">
              <span className="text-[10px] text-slate-400 block">DEEP SLEEP DURATION</span>
              <div className="text-base font-bold text-emerald-300 mt-0.5">1h 18m</div>
              <span className="text-[10px] text-emerald-400">18.4% of total sleep</span>
            </div>
            <div className="p-2.5 rounded bg-[#101827] border border-slate-800">
              <span className="text-[10px] text-slate-400 block">SLEEP EFFICIENCY</span>
              <div className="text-base font-bold text-slate-200 mt-0.5">82%</div>
              <span className="text-[10px] text-slate-400">7h 24m in bed</span>
            </div>
          </div>

          {/* Autonomic-Subjective Divergence Detector */}
          {sorenessLevel <= 2 && (
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300 font-semibold block">
                  ⚠️ Autonomic-Subjective Discordance Detected
                </strong>
                <span>
                  You self-reported feeling <strong>"Fresh" ({sorenessLevel}/10 soreness)</strong>, but overnight autonomic telemetry shows a <strong>-22% HRV depression</strong> (44ms vs 58ms baseline). The Sports Science unit has been notified to monitor your high-speed exposures during training.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* 3. Personal Schedule & Wellness Logging Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Today's Personal Schedule (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  My Today's Performance & Training Schedule
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                  {currentAth?.squad || 'National Squad'}
                </span>
                <button
                  onClick={() => onNavigateSection?.('sessions')}
                  className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
                >
                  <span>Full Schedule</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {athSessions.length > 0 ? (
                athSessions.map((sess) => (
                  <div key={sess.id} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {sess.time}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {sess.pitchOrVenue}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[11px] text-slate-400">Coach: {sess.coach}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white">{sess.title}</h4>
                      <p className="text-[11px] text-slate-400">Category: {sess.category} · Planned Load: {sess.plannedLoadAu} AU</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                      sess.status === 'Completed' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                      sess.status === 'In Progress' ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {sess.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  No sessions assigned for today yet. Use Coach workflow or Session Assignment to assign training blocks.
                </div>
              )}
            </div>
          </div>

          {/* Personal Wellness Check-in (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Daily Wellness Check-in
                  </h3>
                </div>
                {/* 3-Tap vs Sliders Toggle */}
                <div className="flex items-center gap-1 bg-[#101827] p-0.5 rounded-lg border border-slate-800 text-[10px]">
                  <button
                    onClick={() => setWellnessEntryMode('3tap')}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      wellnessEntryMode === '3tap'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⚡ 3-Tap Mode
                  </button>
                  <button
                    onClick={() => setWellnessEntryMode('sliders')}
                    className={`px-2 py-0.5 rounded font-semibold transition-colors ${
                      wellnessEntryMode === 'sliders'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🎛️ Sliders
                  </button>
                </div>
              </div>

              {/* 3-Tap Segmented Entry Mode */}
              {wellnessEntryMode === '3tap' ? (
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex justify-between">
                      <span>Sleep Quality (Last Night)</span>
                      <span className="font-mono text-sky-400 font-bold">{sleepScore}%</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: '😫 Restless', val: 65 },
                        { label: '😐 Adequate', val: 80 },
                        { label: '⚡ Restored', val: 95 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setSleepScore(item.val)}
                          className={`py-2 px-1 text-xs rounded-md border font-semibold text-center transition-all ${
                            sleepScore === item.val
                              ? 'bg-sky-500/20 border-sky-500 text-sky-200 ring-1 ring-sky-500/30'
                              : 'bg-[#101827] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex justify-between">
                      <span>Muscle Soreness</span>
                      <span className="font-mono text-emerald-400 font-bold">{sorenessLevel}/10</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: '🟢 Fresh', val: 1 },
                        { label: '🟡 Normal', val: 3 },
                        { label: '🟠 Sore', val: 6 },
                        { label: '🔴 Severe', val: 9 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setSorenessLevel(item.val)}
                          className={`py-2 px-1 text-xs rounded-md border font-semibold text-center transition-all ${
                            sorenessLevel === item.val
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/30'
                              : 'bg-[#101827] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-semibold text-slate-300 mb-1.5 flex justify-between">
                      <span>Perceived Fatigue / Energy</span>
                      <span className="font-mono text-amber-400 font-bold">{fatigueLevel}/10</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: '🔋 Energized', val: 2 },
                        { label: '⚖️ Moderate', val: 5 },
                        { label: '🪫 Exhausted', val: 8 },
                      ].map((item) => (
                        <button
                          key={item.val}
                          type="button"
                          onClick={() => setFatigueLevel(item.val)}
                          className={`py-2 px-1 text-xs rounded-md border font-semibold text-center transition-all ${
                            fatigueLevel === item.val
                              ? 'bg-amber-500/20 border-amber-500 text-amber-200 ring-1 ring-amber-500/30'
                              : 'bg-[#101827] border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Detailed Sliders Mode */
                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Muscle Soreness (0 = None, 10 = Severe)</span>
                      <span className="font-mono font-bold text-emerald-400">{sorenessLevel} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={sorenessLevel}
                      onChange={(e) => setSorenessLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>Fresh & Light</span>
                      <span>Moderate Fatigue</span>
                      <span>Severe Pain</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Sleep Recovery Score</span>
                      <span className="font-mono font-bold text-sky-400">{sleepScore}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="100"
                      value={sleepScore}
                      onChange={(e) => setSleepScore(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Fatigue</span>
                        <span className="font-mono font-bold text-amber-400">{fatigueLevel}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={fatigueLevel}
                        onChange={(e) => setFatigueLevel(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-300">Stress</span>
                        <span className="font-mono font-bold text-indigo-400">{stressLevel}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={stressLevel}
                        onChange={(e) => setStressLevel(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Computed Hooper-Mackinnon Readiness Preview */}
              <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-[11px] text-emerald-300 font-medium">Computed Hooper-Mackinnon Readiness</span>
                <span className="font-mono font-bold text-xs text-emerald-400">
                  {Math.min(100, Math.max(35, Math.round((sleepScore * 0.4) + ((10 - sorenessLevel) * 3) + ((10 - fatigueLevel) * 2) + 10)))}%
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setWellnessLogged(true);
                const computedReadiness = Math.min(100, Math.max(35, Math.round((sleepScore * 0.4) + ((10 - sorenessLevel) * 3) + ((10 - fatigueLevel) * 2) + 10)));
                onUpdateAthleteWellness?.({
                  sleep: sleepScore,
                  soreness: sorenessLevel,
                  fatigue: fatigueLevel,
                  stress: stressLevel,
                  readiness: computedReadiness,
                });
                onTriggerToast(`Morning wellness check-in logged ✓ Synced to Coach & Sport Science console (Readiness: ${computedReadiness}%)`);
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-200 transition-all flex items-center justify-center gap-2 mt-3"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{wellnessLogged ? 'Update Logged Wellness Survey' : 'Submit Morning Wellness Check-in'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. NUTRITIONIST SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Nutritionist') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Pre-Training Hydration & USG Testing Queue (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Pre-Session Urine Specific Gravity (USG) Hydration Testing
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetPersonaHub}
                  className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[11px] font-semibold text-amber-200 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>Reset</span>
                </button>
                <button
                  onClick={() => onTriggerToast('Hydration test batch refreshed with latest lab refractometer data')}
                  className="text-[11px] font-mono text-amber-400 hover:text-amber-300 font-semibold"
                >
                  + Log USG Batch
                </button>
                <button
                  onClick={() => onNavigateSection?.('nutrition-hydration')}
                  className="px-2 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-[11px] font-semibold text-sky-200 flex items-center gap-1"
                >
                  <span>Hydration Workspace</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">Athlete</th>
                    <th className="pb-2">Squad</th>
                    <th className="pb-2">USG Reading</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {hydrationQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 text-white font-semibold">{item.name}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{item.squad}</td>
                      <td className="py-2.5 font-mono font-bold text-white">{item.usg}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          item.status === 'MONITOR' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onTriggerToast(`Prescribed: ${item.action} for ${item.name}`)}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] text-amber-200"
                        >
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informed-Sport WADA Supplement Registry & DEXA (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Informed-Sport WADA Supplement Audit
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                100% WADA Safe
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Pure Whey Isolate Batch #49201', lab: 'LGC Informed Sport', cert: 'CERT-WADA-2026-09', status: 'Passed' },
                { name: 'Beta-Alanine CarnoSyn #8192', lab: 'Informed Choice UK', cert: 'CERT-WADA-2026-04', status: 'Passed' },
                { name: 'Electrolyte Hydration Salts #2201', lab: 'NSF Certified for Sport', cert: 'CERT-NSF-8819', status: 'Passed' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white">{item.name}</span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      <span>{item.lab}</span> · <span>{item.cert}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onTriggerToast('Exporting complete WADA Anti-Doping Supplement Dossier (PDF)...')}
              className="w-full py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Anti-Doping Audit Certificate</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3. OPERATIONS TEAM SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Operations Team') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Facility Hourly Schedule & Turf Management (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Facility Zone Allocation & Booking Timetable
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-300">
                  Main Stadium Complex
                </span>
                <button
                  onClick={() => onNavigateSection?.('facilities')}
                  className="px-2 py-1 rounded bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-[11px] font-semibold text-indigo-200 flex items-center gap-1"
                >
                  <span>Facilities Workspace</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { time: '09:00 - 11:30', zone: 'Natural Grass Pitch 1 (Zone A)', squad: 'Senior National Squad', tech: '24 GPS Pods Active', status: 'In Use', tone: 'emerald' },
                { time: '10:00 - 12:00', zone: 'Olympic S&C Center', squad: 'Development Squad Block', tech: 'Dual Force Plates #1 & #2', status: 'In Use', tone: 'emerald' },
                { time: '13:00 - 14:30', zone: 'Natural Grass Pitch 1 (Zone A)', squad: 'Groundskeeping Cut & Irrigation', tech: '22mm Cut Standard', status: 'Maintenance', tone: 'amber' },
                { time: '15:30 - 17:30', zone: 'Natural Grass Pitch 2 (Zone B)', squad: 'High-Press Tactical Drills', tech: 'Speed Gates & GPS Fleet', status: 'Booked', tone: 'sky' },
                { time: '17:30 - 19:30', zone: 'Contrast Pools & Hydrotherapy', squad: 'National Recovery Rotation', tech: 'Water pH 7.3 Checked', status: 'Reserved', tone: 'slate' },
              ].map((b, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-indigo-300">{b.time}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-semibold text-white">{b.zone}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-2">
                      <span>Squad: <strong>{b.squad}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-mono">{b.tech}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    b.tone === 'emerald' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                    b.tone === 'amber' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                    b.tone === 'sky' ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Facility Work Orders & Logistics (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Facility Work Orders & Maintenance
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {workOrders.filter(w => w.status !== 'COMPLETED').length} Active
                  </span>
                  <button
                    onClick={handleResetPersonaHub}
                    className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-mono font-semibold text-amber-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                {workOrders.map((wo) => (
                  <div key={wo.id} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">{wo.id} · {wo.zone}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold ${
                        wo.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        wo.status === 'IN_PROGRESS' ? 'bg-sky-500/20 text-sky-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {wo.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{wo.title}</h4>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Logged: {wo.time}</span>
                      <button
                        onClick={() => {
                          setWorkOrders(prev => prev.map(w => w.id === wo.id ? { ...w, status: 'COMPLETED' } : w));
                          onTriggerToast(`Work order ${wo.id} marked as completed.`);
                        }}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                      >
                        {wo.status === 'COMPLETED' ? '✓ Closed' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onTriggerToast('New facility maintenance order opened for engineering staff')}
              className="w-full py-2.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold text-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <PlusSquare className="w-4 h-4 text-indigo-400" />
              <span>Create Facility Work Order</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     4. FEDERATION ADMIN SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Federation Admin') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Athlete Licensing & Eligibility Audit (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  National Athlete Licensing & Eligibility Verification
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
                  {allAthletes.length} National Athletes
                </span>
                <button
                  onClick={handleResetPersonaHub}
                  className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-200 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="w-3 h-3 text-amber-400" />
                  <span>Reset</span>
                </button>
                {onOpenOnboarding && (
                  <button
                    onClick={onOpenOnboarding}
                    className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <UserPlus className="w-3 h-3" />
                    <span>Enroll Candidate</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigateSection?.('athlete-registry')}
                  className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <span>Open National Registry</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* 4-Tier Institutional Clearance Pipeline */}
            {allAthletes.filter((a) => a.verificationStatus === 'Pending').length > 0 && (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    <span>
                      4-Tier Institutional Clearance Pipeline ({allAthletes.filter((a) => a.verificationStatus === 'Pending').length} Pending)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 font-semibold">Federation Governance Gate</span>
                </div>

                <div className="space-y-3">
                  {allAthletes
                    .filter((a) => a.verificationStatus === 'Pending')
                    .map((ath) => (
                      <div
                        key={ath.id}
                        className="p-3.5 rounded-lg bg-[#090D16] border border-amber-500/20 space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="font-bold text-slate-100">{ath.name} ({ath.athleteId})</div>
                            <div className="text-[11px] text-slate-400">
                              {ath.sport} · {ath.position} · {ath.squad} · Coach: {ath.coach || 'Unassigned'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {onOpenApproval && (
                              <button
                                onClick={() => onOpenApproval(ath)}
                                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition-colors"
                              >
                                Review Documents
                              </button>
                            )}
                            {onOpenCoachAssignment && !ath.coach && (
                              <button
                                onClick={() => onOpenCoachAssignment(ath)}
                                className="px-2 py-1 rounded bg-violet-500/20 border border-violet-500/40 text-violet-300 text-[11px] font-semibold"
                              >
                                Assign Coach
                              </button>
                            )}
                          </div>
                        </div>

                        {/* 4-Stage Progressive Sign-off Badges */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-[10px] font-mono">
                          <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                            <span className="text-slate-400 block text-[9px]">STAGE 1: STATE NOC</span>
                            <strong>✓ NOC Issued (MH)</strong>
                          </div>
                          <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                            <span className="text-slate-400 block text-[9px]">STAGE 2: TECHNICAL</span>
                            <strong>✓ Age & Quota Cleared</strong>
                          </div>
                          <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300">
                            <span className="text-slate-400 block text-[9px]">STAGE 3: MEDICAL BD</span>
                            <strong>⏳ TUE Review Active</strong>
                          </div>
                          <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-500">
                            <span className="text-slate-500 block text-[9px]">STAGE 4: FED SEAL</span>
                            <span>Pending Stage 3</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Passport Expiry & International Travel Watchdog Card */}
            <div className="p-3.5 rounded-xl bg-[#090D16] border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-cyan-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Passport Expiry & Travel Visa Watchdog
                </span>
                <span className="text-[10px] font-mono text-slate-400">Next International Tour: 12 Oct 2026</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-semibold text-rose-200">Arjun Mehta (Senior Men's Squad)</span>
                    <div className="text-[10px] text-rose-300 font-mono">
                      Passport expires in 48 days (28 Nov 2026) — Violates 180-day European travel entry requirement!
                    </div>
                  </div>
                  <button
                    onClick={() => onTriggerToast('Dispatched urgent Tatkal passport renewal notice to athlete & ministry liaison ✓')}
                    className="px-2.5 py-1 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-[10px] shrink-0"
                  >
                    Flag Urgent Renewal
                  </button>
                </div>

                <div className="p-2 rounded bg-[#101827] border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                  <span>Sneha Deshmukh · Badminton</span>
                  <span className="font-mono text-emerald-400">✓ Valid (3.8 years remaining)</span>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Athlete</th>
                    <th className="pb-2">Discipline</th>
                    <th className="pb-2">Documentation</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {registryQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-mono text-slate-400 text-[11px]">{item.id}</td>
                      <td className="py-2.5 text-white font-semibold">{item.name}</td>
                      <td className="py-2.5 text-slate-300 text-[11px]">{item.sport}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{item.docs}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            setRegistryQueue(prev => prev.map(r => r.id === item.id ? { ...r, status: 'Approved' } : r));
                            onTriggerToast(`Federation License sealed and approved for ${item.name}`);
                          }}
                          className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[11px] font-semibold text-cyan-200"
                        >
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* WADA Whereabouts Pool & Government Sanctions (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Anti-Doping (NADA/WADA) & Travel Sanctions
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                100% Compliant
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Registered Testing Pool (RTP)</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">42 Tier-1 Athletes</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Whereabouts filings current for Q3. Zero missed tests, zero location filing failures.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Sports Ministry Sanction #USI-881</span>
                  <span className="text-[10px] font-mono text-sky-400 font-bold">International Cleared</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Government of India foreign travel and daily allowance sanction active for Asian Grand Prix.
                </p>
              </div>
            </div>

            <button
              onClick={() => onTriggerToast('Exporting official Federation Governance & Anti-Doping Audit Certificate...')}
              className="w-full py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-200 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Federation Governance Audit</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     5. COACH SPECIALIZED HUB: TACTICAL SQUAD AVAILABILITY & MATCHDAY LOAD
     ========================================================================= */
  if (selectedRole === 'Coach') {
    const unconstrainedFit = allAthletes.filter((a) => a.trainingStatus === 'ACTIVE');
    const loadCapped = allAthletes.filter((a) => a.trainingStatus === 'RESTRICTED' || a.trainingStatus === 'RETURN TO PLAY');
    const unavailableAthletes = allAthletes.filter((a) => a.trainingStatus === 'INJURED' || a.trainingStatus === 'IN REHAB');

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Squad Selection Board (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Matchday Squad Selection & Unconstrained Availability Board
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                {unconstrainedFit.length} Starters Ready · {loadCapped.length} Load Capped
              </span>
            </div>

            {/* Tactical Substitution Recommendation Alert */}
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start justify-between gap-3 text-xs">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 font-semibold block">
                    Tactical Substitution Alert: Arjun Mehta Speed Cap (≤ 24.0 km/h)
                  </strong>
                  <span className="text-amber-200/90 text-[11px]">
                    Arjun is restricted to 80% Vmax during Stage 3 Hamstring RTP. Recommended tactical swap: <strong>Promote Pranav Sundaram</strong> to starting 11v11 high-press transition unit; assign Arjun to controlled finishing grid.
                  </span>
                </div>
              </div>
              <button
                onClick={() => onTriggerToast('Tactical swap applied ✓ Pranav Sundaram promoted to high-press unit')}
                className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0 transition-colors"
              >
                Apply Swap ✓
              </button>
            </div>

            {/* Three Tiers of Availability */}
            <div className="space-y-3">
              {/* Starters / Ready */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider block">
                  ● 100% Match Fit Starters ({unconstrainedFit.length})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {unconstrainedFit.map((ath) => (
                    <div key={ath.id} className="p-2.5 rounded bg-[#101827] border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-slate-100">{ath.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">#{ath.jerseyNumber} · {ath.position}</div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-400">{ath.readiness}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Load-Capped Players */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider block">
                  ▲ Speed-Capped & Controlled Volume ({loadCapped.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {loadCapped.map((ath) => (
                    <div key={ath.id} className="p-2.5 rounded bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-amber-200">{ath.name}</div>
                        <div className="text-[10px] text-slate-400">
                          Cap: {ath.id === 'ath-arjun-mehta' ? '≤ 80% Vmax (24.0 km/h)' : '≤ 85% Vmax'} · {ath.position}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 font-bold">
                        {ath.trainingStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unavailable / Off-Feet */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider block">
                  ✕ Medically Unavailable ({unavailableAthletes.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {unavailableAthletes.map((ath) => (
                    <div key={ath.id} className="p-2.5 rounded bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-rose-200">{ath.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {ath.id === 'ath-devansh-kulkarni' ? 'Right Ankle Effusion · Off-Feet' : 'In Rehabilitation'}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 font-bold">
                        {ath.trainingStatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tactical Load Adjuster & Drill Assignment (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Live Tactical Training Load Controller
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    Senior Squad
                  </span>
                  <button
                    onClick={handleResetPersonaHub}
                    className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-mono font-semibold text-amber-300 flex items-center gap-1"
                  >
                    <RotateCcw className="w-2.5 h-2.5" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>

              {/* Intensity Slider */}
              <div className="p-3.5 rounded-xl bg-[#101827] border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Session Intensity Governor</span>
                  <span className="font-mono font-bold text-amber-400">{squadIntensityPct}% Intensity</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="115"
                  value={squadIntensityPct}
                  onChange={(e) => setSquadIntensityPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>70% Recovery Deload</span>
                  <span>100% Match Standard</span>
                  <span>115% High Overload</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-1">
                  Adjusting governor recalculates planned AU across today’s 11v11 transition drill ({Math.round(780 * (squadIntensityPct / 100))} AU).
                </p>
              </div>

              {/* Drill Quick Select */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300 block">Today's Tactical Drills</span>
                {[
                  { name: '11v11 High-Press Wave (Main Pitch)', duration: '35 min', load: '320 AU', target: 'Unconstrained XI' },
                  { name: 'Controlled Acceleration Finishing Grid', duration: '20 min', load: '180 AU', target: 'Arjun & Vikramaditya' },
                  { name: 'Positional Rondo & Transition Support', duration: '25 min', load: '210 AU', target: 'Midfield Group' },
                ].map((d, i) => (
                  <div key={i} className="p-2.5 rounded bg-[#101827] border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-semibold text-white">{d.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{d.duration} · {d.load} · Target: {d.target}</div>
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {onOpenSessionAssignment && (
                <button
                  onClick={onOpenSessionAssignment}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Assign Tactical Drills to Squad</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     6. SPORTS SCIENTIST SPECIALIZED HUB: FORCE-PLATE ASYMMETRY & SPRINT BANDS
     ========================================================================= */
  if (selectedRole === 'Sports Scientist') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Force-Plate Dual CMJ Asymmetry Console (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Dual Force-Plate Countermovement Jump (CMJ) Asymmetry Console
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono text-sky-300 font-bold">
                  Hawkin Dynamics / Vald Live Sync
                </span>
                <button
                  onClick={handleResetPersonaHub}
                  className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-mono font-semibold text-amber-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: 'Arjun Mehta',
                  id: 'ath-arjun-mehta',
                  asymmetry: '-14.2% Left Deficit',
                  metric: 'Eccentric Deceleration Impulse',
                  status: 'HIGH DEFICIT',
                  tone: 'rose',
                  note: 'Correlates with prior Biceps Femoris pathology; cap linear acceleration.',
                },
                {
                  name: 'Vikramaditya Nair',
                  id: 'ath-vikram-nair',
                  asymmetry: '-9.2% FT:CT Ratio Drop',
                  metric: 'Flight Time to Contraction Time',
                  status: 'NEUROMUSCULAR FATIGUE',
                  tone: 'amber',
                  note: 'Acute deceleration fatigue from matchplay simulation.',
                },
                {
                  name: 'Kabir Rao',
                  id: 'ath-kabir-rao',
                  asymmetry: '-14.0% Shoulder ER Torque',
                  metric: 'Isometric Rotator Cuff Dynamometry',
                  status: 'ROTATOR CUFF MONITOR',
                  tone: 'amber',
                  note: 'Symmetry improving (+4% this week) in Stage 2 rehab.',
                },
                {
                  name: 'Rohan Chhetri',
                  id: 'ath-rohan-chhetri',
                  asymmetry: '96.4% Bilateral Symmetry',
                  metric: 'NordBord Eccentric Hamstring Peak',
                  status: 'GATE MET',
                  tone: 'emerald',
                  note: 'Passed Stage 4 criteria threshold (≥ 90%).',
                },
              ].map((item) => (
                <div key={item.id} className="p-3.5 rounded-lg bg-[#101827] border border-slate-800/80 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{item.name}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold ${
                        item.tone === 'rose' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        item.tone === 'amber' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      <span>{item.metric}: </span>
                      <strong className={item.tone === 'rose' ? 'text-rose-400' : item.tone === 'amber' ? 'text-amber-400' : 'text-emerald-400'}>
                        {item.asymmetry}
                      </strong>
                    </div>
                    <p className="text-[10px] text-slate-500">{item.note}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectActiveAthlete) onSelectActiveAthlete(item.id);
                      onTriggerToast(`Force trace dossier loaded for ${item.name}`);
                    }}
                    className="px-2.5 py-1 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-300 shrink-0"
                  >
                    View Traces →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* GPS Sprint Exposure & Catapult Telemetry (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    GPS High-Speed Velocity Bands & Exposure
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  StatsSports Pods
                </span>
              </div>

              {/* Velocity Bands */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Sprint Exposures (&gt; 25.2 km/h)</span>
                    <span className="font-mono font-bold text-sky-400">540m / 600m target</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="bg-sky-500 h-full rounded-full" style={{ width: '90%' }} />
                  </div>
                  <div className="text-[10px] text-slate-500">Pranav Sundaram leads squad with 34.1 km/h top velocity.</div>
                </div>

                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">Maximal Decelerations (&gt; -3.5 m/s²)</span>
                    <span className="font-mono font-bold text-amber-400">42 Events (High Load)</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '84%' }} />
                  </div>
                  <div className="text-[10px] text-slate-500">Deceleration fatigue correlates with Vikramaditya's FT:CT drop.</div>
                </div>

                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-semibold">ACWR Danger Threshold (&gt; 1.35 AU)</span>
                    <span className="font-mono font-bold text-rose-400">3 Athletes in Red Zone</span>
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 pt-0.5">
                    Arjun Mehta (1.42), Vikramaditya (1.39), Devansh (1.37)
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTriggerToast('Dispatched sports science load alert to Head Coach Vikram Sharma ✓')}
              className="w-full py-2.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-xs font-bold text-sky-200 transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Send Load Alert to Coach</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     7. PHYSIOTHERAPIST SPECIALIZED HUB: 5-STAGE RTP PROTOCOL CONTROLLER
     ========================================================================= */
  if (selectedRole === 'Physiotherapist') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 5-Stage RTP Protocol Gate Controller (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  5-Stage Return-to-Play Protocol Gate Controller
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[10px] font-mono text-rose-300 font-bold">
                  {injuries.length} Active Clinical Cases
                </span>
                <button
                  onClick={handleResetPersonaHub}
                  className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-mono font-semibold text-amber-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {injuries.map((inj) => (
                <div key={inj.id} className="p-3.5 rounded-lg bg-[#101827] border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>{inj.athleteName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({inj.sport} · {inj.position})</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        {inj.diagnosis} ({inj.bodyRegionDisplay}) · Pain: <strong>{inj.painScore}/10</strong>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                        Stage {inj.rtpStage}/5: {inj.rtpStageName}
                      </span>
                      {onOpenAdvanceRtp && (
                        <button
                          onClick={() => onOpenAdvanceRtp(inj)}
                          className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[10px] transition-colors"
                        >
                          Advance Gate →
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 5 Objective Gate Criteria Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-1 text-[10px] font-mono">
                    <div className={`p-1.5 rounded border text-center ${inj.gateCriteria?.painThresholdMet ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      <span>Pain ≤ 2/10: <strong>{inj.gateCriteria?.painThresholdMet ? '✓' : '✗'}</strong></span>
                    </div>
                    <div className={`p-1.5 rounded border text-center ${inj.gateCriteria?.strengthSymmetryMet ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      <span>Symmetry ≥90%: <strong>{inj.gateCriteria?.strengthSymmetryMet ? '✓' : '✗'}</strong></span>
                    </div>
                    <div className={`p-1.5 rounded border text-center ${inj.gateCriteria?.runningToleranceMet ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      <span>Run Tolerance: <strong>{inj.gateCriteria?.runningToleranceMet ? '✓' : '✗'}</strong></span>
                    </div>
                    <div className={`p-1.5 rounded border text-center ${inj.gateCriteria?.functionalTestMet ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-900 text-slate-500 border-slate-800'}`}>
                      <span>Functional Test: <strong>{inj.gateCriteria?.functionalTestMet ? '✓' : '✗'}</strong></span>
                    </div>
                    <div className={`p-1.5 rounded border text-center ${inj.gateCriteria?.medicalClearanceMet ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/30' : 'bg-amber-950/20 text-amber-300 border-amber-500/30'}`}>
                      <span>CMO Clearance: <strong>{inj.gateCriteria?.medicalClearanceMet ? '✓' : '⏳'}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Physiotherapy Bay & Rehab Session Builder (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Physiotherapy Clinic & Rehab Protocols
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Medical Rehab Lab
                </span>
              </div>

              <div className="space-y-2">
                {[
                  { athlete: 'Arjun Mehta', focus: 'Stage 3 Controlled Accelerations & Nordic Hamstring', time: '10:00 IST', clinician: 'Dr. S. Patel' },
                  { athlete: 'Devansh Kulkarni', focus: 'Syndesmosis Effusion Lymphatic Drainage & Pool Walking', time: '11:15 IST', clinician: 'Dr. M. Raghavan' },
                  { athlete: 'Kabir Rao', focus: 'Isokinetic Rotator Cuff External Rotation @ 90°', time: '14:00 IST', clinician: 'A. Sen' },
                  { athlete: 'Aarav Fernandes', focus: 'Posterior Capsule Sleeper Stretch & Scapular Y/T/W', time: '15:30 IST', clinician: 'A. Sen' },
                ].map((r, i) => (
                  <div key={i} className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">{r.athlete}</span>
                      <span className="text-[10px] font-mono text-indigo-300">{r.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">{r.focus}</p>
                    <div className="text-[10px] text-slate-500 font-mono">Lead: {r.clinician}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              {onOpenReportInjury && (
                <button
                  onClick={() => onOpenReportInjury()}
                  className="flex-1 py-2.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
                >
                  <HeartPulse className="w-3.5 h-3.5" />
                  <span>Report New Injury</span>
                </button>
              )}
              {injuries.length > 0 && onOpenCreateRehab && (
                <button
                  onClick={() => onOpenCreateRehab(injuries[0])}
                  className="flex-1 py-2.5 rounded-lg bg-[#101827] hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Log Rehab Session</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     8. PERFORMANCE DIRECTOR SPECIALIZED HUB: LA 2028 OLYMPIC PATHWAY COMMAND
     ========================================================================= */
  if (selectedRole === 'Performance Director') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Multidisciplinary Squad Availability Matrix (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  LA 2028 Olympic Pathway Carding & Interdisciplinary Matrix
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-300 font-bold">
                  10 Carded Tier-1 Athletes
                </span>
                <button
                  onClick={handleResetPersonaHub}
                  className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-[10px] font-mono font-semibold text-amber-300 flex items-center gap-1"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">Athlete</th>
                    <th className="pb-2">Discipline</th>
                    <th className="pb-2">Technical</th>
                    <th className="pb-2">Medical</th>
                    <th className="pb-2">Autonomic</th>
                    <th className="pb-2 text-right">Pathway Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {allAthletes.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5">
                        <div className="font-semibold text-white">{a.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{a.athleteId}</div>
                      </td>
                      <td className="py-2.5 text-slate-300 text-[11px]">{a.sport} · {a.position}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          a.trainingStatus === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-300' :
                          a.trainingStatus === 'RESTRICTED' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-rose-500/20 text-rose-300'
                        }`}>
                          {a.trainingStatus}
                        </span>
                      </td>
                      <td className="py-2.5 font-mono text-[11px] text-slate-300">
                        {a.medicalStatus}
                      </td>
                      <td className="py-2.5 font-mono font-bold text-white">
                        {a.readiness}%
                      </td>
                      <td className="py-2.5 text-right">
                        <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[10px]">
                          Tier-1 Carded
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Executive Approvals & Governance Queue (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Executive Governance & Clearance Sign-Off
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Director Level
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">Arjun Mehta: Stage 3 Hamstring Clearance</span>
                    <span className="text-[10px] font-mono text-amber-400 font-bold">Awaiting CMO</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Chief Medical Officer sign-off required to advance to Stage 4 full matchplay training.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">Asian Grand Prix Travel Sanction #USI-881</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">Approved</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Ministry travel clearance and daily allowance budget locked for 28 athletes.
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-white">NADA / WADA Whereabouts Q4 Pool</span>
                    <span className="text-[10px] font-mono text-emerald-400 font-bold">100% Filed</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    All 10 athletes’ 60-minute daily testing windows locked with zero missed test strikes.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => onTriggerToast('Exporting complete LA 2028 Olympic Pathway Executive Briefing (PDF)...')}
              className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Executive Pathway Briefing</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
