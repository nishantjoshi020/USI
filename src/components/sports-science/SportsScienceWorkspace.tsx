import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  ChevronRight,
  Cpu,
  Download,
  Filter,
  Flame,
  HeartPulse,
  Layers,
  Moon,
  RefreshCw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wifi,
  Zap,
  Upload,
  FileText,
  Check,
  Database,
  X,
} from 'lucide-react';
import { Athlete, NavItemId, UserRole } from '../../types/usi';
import { AthleteAvatar, ReadinessScoreIndicator, RiskBadge } from '../ui/Badges';
import {
  exportToCSV,
  exportToPDF,
} from '../../utils/exportEngine';

export type SportsScienceSubTab =
  | 'readiness'
  | 'fatigue'
  | 'gps-wearables'
  | 'recovery'
  | 'anomaly-matrix';

interface SportsScienceWorkspaceProps {
  activeSubTab: SportsScienceSubTab;
  onSelectSubTab: (tab: SportsScienceSubTab) => void;
  selectedRole?: UserRole;
  athletes: Athlete[];
  onOpenAthlete360: (athlete: Athlete) => void;
  onTriggerToast: (message: string) => void;
}

interface GPSMetricRecord {
  athleteId: string;
  athleteName: string;
  position: string;
  totalDistanceM: number;
  hsrDistanceM: number; // >19.8 km/h
  sprintDistanceM: number; // >25.2 km/h
  sprintCount: number;
  accelCount: number; // >3 m/s²
  decelCount: number; // >3 m/s²
  playerLoad: number;
  metabolicPowerAvgW: number;
  topSpeedKmh: number;
  capStatus: 'Normal' | 'Approaching Cap' | 'Capped';
}

const GPS_TELEMETRY_DATA: GPSMetricRecord[] = [
  {
    athleteId: 'ath-1042',
    athleteName: 'Arjun Mehta',
    position: 'Forward / Winger',
    totalDistanceM: 8420,
    hsrDistanceM: 680,
    sprintDistanceM: 240,
    sprintCount: 14,
    accelCount: 38,
    decelCount: 42,
    playerLoad: 680,
    metabolicPowerAvgW: 10.4,
    topSpeedKmh: 32.8,
    capStatus: 'Approaching Cap',
  },
  {
    athleteId: 'ath-1088',
    athleteName: 'Rohan Kapoor',
    position: 'Central Midfielder',
    totalDistanceM: 10650,
    hsrDistanceM: 890,
    sprintDistanceM: 190,
    sprintCount: 11,
    accelCount: 52,
    decelCount: 48,
    playerLoad: 810,
    metabolicPowerAvgW: 11.2,
    topSpeedKmh: 31.4,
    capStatus: 'Normal',
  },
  {
    athleteId: 'ath-1102',
    athleteName: 'Vikram Malhotra',
    position: 'Center Back',
    totalDistanceM: 7920,
    hsrDistanceM: 410,
    sprintDistanceM: 110,
    sprintCount: 6,
    accelCount: 24,
    decelCount: 30,
    playerLoad: 590,
    metabolicPowerAvgW: 9.1,
    topSpeedKmh: 29.8,
    capStatus: 'Normal',
  },
  {
    athleteId: 'ath-1145',
    athleteName: 'Devansh Joshi',
    position: 'Full Back',
    totalDistanceM: 9800,
    hsrDistanceM: 820,
    sprintDistanceM: 310,
    sprintCount: 18,
    accelCount: 44,
    decelCount: 41,
    playerLoad: 760,
    metabolicPowerAvgW: 10.8,
    topSpeedKmh: 33.6,
    capStatus: 'Normal',
  },
  {
    athleteId: 'ath-1178',
    athleteName: 'Kabir Verma',
    position: 'Attacking Midfielder',
    totalDistanceM: 6100,
    hsrDistanceM: 290,
    sprintDistanceM: 80,
    sprintCount: 4,
    accelCount: 18,
    decelCount: 22,
    playerLoad: 430,
    metabolicPowerAvgW: 8.6,
    topSpeedKmh: 28.5,
    capStatus: 'Capped',
  },
];

interface ForcePlateRecord {
  athleteId: string;
  athleteName: string;
  jumpHeightCm: number;
  flightToContractionRatio: number; // FT:CT (ideal >0.75)
  peakPropulsivePowerWKg: number;
  concentricRsiModified: number;
  eccentricDecelImpulseNs: number;
  takeoffAsymmetryPct: number; // Asymmetry L vs R
  asymmetrySide: 'Left' | 'Right' | 'Symmetric';
  fatigueIndex: 'Fresh' | 'Mild Neuromuscular Fatigue' | 'Substantial Fatigue';
}

const FORCE_PLATE_DATA: ForcePlateRecord[] = [
  {
    athleteId: 'ath-1042',
    athleteName: 'Arjun Mehta',
    jumpHeightCm: 48.2,
    flightToContractionRatio: 0.68,
    peakPropulsivePowerWKg: 52.4,
    concentricRsiModified: 0.44,
    eccentricDecelImpulseNs: 184,
    takeoffAsymmetryPct: 8.4,
    asymmetrySide: 'Right',
    fatigueIndex: 'Mild Neuromuscular Fatigue',
  },
  {
    athleteId: 'ath-1088',
    athleteName: 'Rohan Kapoor',
    jumpHeightCm: 51.5,
    flightToContractionRatio: 0.79,
    peakPropulsivePowerWKg: 56.1,
    concentricRsiModified: 0.51,
    eccentricDecelImpulseNs: 210,
    takeoffAsymmetryPct: 2.1,
    asymmetrySide: 'Symmetric',
    fatigueIndex: 'Fresh',
  },
  {
    athleteId: 'ath-1102',
    athleteName: 'Vikram Malhotra',
    jumpHeightCm: 44.8,
    flightToContractionRatio: 0.72,
    peakPropulsivePowerWKg: 49.8,
    concentricRsiModified: 0.46,
    eccentricDecelImpulseNs: 195,
    takeoffAsymmetryPct: 3.5,
    asymmetrySide: 'Symmetric',
    fatigueIndex: 'Fresh',
  },
  {
    athleteId: 'ath-1145',
    athleteName: 'Devansh Joshi',
    jumpHeightCm: 53.0,
    flightToContractionRatio: 0.81,
    peakPropulsivePowerWKg: 58.2,
    concentricRsiModified: 0.53,
    eccentricDecelImpulseNs: 225,
    takeoffAsymmetryPct: 1.8,
    asymmetrySide: 'Symmetric',
    fatigueIndex: 'Fresh',
  },
  {
    athleteId: 'ath-1178',
    athleteName: 'Kabir Verma',
    jumpHeightCm: 39.5,
    flightToContractionRatio: 0.59,
    peakPropulsivePowerWKg: 44.2,
    concentricRsiModified: 0.38,
    eccentricDecelImpulseNs: 148,
    takeoffAsymmetryPct: 11.2,
    asymmetrySide: 'Left',
    fatigueIndex: 'Substantial Fatigue',
  },
];

interface RecoveryProtocolItem {
  id: string;
  name: string;
  category: 'Hydrotherapy' | 'Compression' | 'Cryotherapy' | 'Sleep & Autonomic';
  protocol: string;
  targetAdaptation: string;
  completionRatePct: number;
  scheduledAthletes: number;
}

const RECOVERY_PROTOCOLS: RecoveryProtocolItem[] = [
  {
    id: 'rec-01',
    name: 'Cold Water Immersion (CWI)',
    category: 'Hydrotherapy',
    protocol: '12 minutes @ 10°C (submerged to iliac crest)',
    targetAdaptation: 'Vasoconstriction, edema reduction & delayed onset soreness blunting',
    completionRatePct: 94,
    scheduledAthletes: 18,
  },
  {
    id: 'rec-02',
    name: 'Pneumatic Compression Therapy (Normatec)',
    category: 'Compression',
    protocol: '30 minutes @ Level 5 sequential pulsing',
    targetAdaptation: 'Venous return acceleration and blood lactate clearance',
    completionRatePct: 88,
    scheduledAthletes: 16,
  },
  {
    id: 'rec-03',
    name: 'Full Body Cryo-Chamber Flush',
    category: 'Cryotherapy',
    protocol: '3 minutes @ -110°C (dry vapor)',
    targetAdaptation: 'Systemic parasympathetic reactivation & pro-inflammatory cytokine suppression',
    completionRatePct: 78,
    scheduledAthletes: 12,
  },
  {
    id: 'rec-04',
    name: 'Sleep Architecture & Sleep Hygiene Block',
    category: 'Sleep & Autonomic',
    protocol: 'Blue-light block at 21:30; room temperature 18.5°C; target 8.0h duration',
    targetAdaptation: 'Human Growth Hormone (HGH) release during slow-wave non-REM sleep',
    completionRatePct: 86,
    scheduledAthletes: 22,
  },
];

export const SportsScienceWorkspace: React.FC<SportsScienceWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  selectedRole = 'Sports Scientist',
  athletes,
  onOpenAthlete360,
  onTriggerToast,
}) => {
  const [liveStreamActive, setLiveStreamActive] = useState(true);
  const [selectedGpsAthleteId, setSelectedGpsAthleteId] = useState<string>('ath-1042');
  const [selectedRecoveryId, setSelectedRecoveryId] = useState<string>('rec-01');

  // Bulk Sensor Ingestion & Workload Engine State
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [ingestFileFormat, setIngestFileFormat] = useState<'catapult' | 'forcedecks' | 'oura'>('catapult');
  const [ingestProgress, setIngestProgress] = useState<number | null>(null);
  const [workloadEngineMode, setWorkloadEngineMode] = useState<'ewma' | 'rolling'>('ewma');

  const selectedGpsAthlete =
    GPS_TELEMETRY_DATA.find((g) => g.athleteId === selectedGpsAthleteId) || GPS_TELEMETRY_DATA[0];

  return (
    <div className="space-y-5">
      {/* 1. Header & Live Microtechnology Status Bar */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>SPORTS SCIENCE & LOAD MONITORING WORKSPACE</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Biomechanics & Physiological Analytics</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">
              Microtechnology, Fatigue Dynamics & Predictive Risk Center
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Live GNSS tracking (Catapult/StatsSports), dual force plate countermovement jump (CMJ) telemetry, autonomic HRV baselines, and multi-variable anomaly detection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#090D16] border border-slate-800 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${liveStreamActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              <span className="text-slate-300">
                {liveStreamActive ? 'GNSS Telemetry Live (10 Hz)' : 'Telemetry Paused'}
              </span>
            </div>
            <button
              onClick={() => {
                const file = exportToCSV(
                  'usi_gnss_and_neuromuscular_telemetry',
                  [
                    'Athlete ID',
                    'Athlete Name',
                    'Position',
                    'Total Distance (m)',
                    'HSR >19.8km/h (m)',
                    'Sprint >25.2km/h (m)',
                    'Max Velocity (km/h)',
                    'PlayerLoad (AU)',
                    'Mech/Metabolic Ratio',
                    'CMJ Peak Power (W/kg)',
                    'RSI-mod',
                  ],
                  GPS_TELEMETRY_DATA.map((g) => [
                    g.athleteId,
                    g.athleteName,
                    g.position,
                    g.totalDistanceM,
                    g.hsrDistanceM,
                    g.sprintDistanceM,
                    g.maxVelocityKmh,
                    g.playerLoadAu,
                    g.mechMetabolicRatio,
                    g.cmjPeakPowerWkg,
                    g.rsiMod,
                  ]),
                  ['USI Sports Science & GNSS Microtechnology Export (10 Hz Catapult + ForceDecks)']
                );
                onTriggerToast(`Exported GNSS & Force Plate Telemetry CSV (${file}) ✓`);
              }}
              className="px-3 py-1.5 rounded-md bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Export GNSS & Force Plate Telemetry as CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                const file = exportToPDF('usi_sports_science_telemetry_dossier', {
                  title: 'SPORTS SCIENCE, GNSS & NEUROMUSCULAR TELEMETRY DOSSIER',
                  subtitle: `10 Hz GNSS Tracking, Dual Force Plate CMJ & Autonomic HRV Report | Role: ${selectedRole}`,
                  metadataPairs: [
                    { label: 'Workload Model', value: workloadEngineMode.toUpperCase() },
                    { label: 'GNSS Stream', value: liveStreamActive ? '10 Hz Active' : 'Paused' },
                    { label: 'Monitored Squad', value: `${athletes.length} Athletes` },
                    { label: 'Focus Athlete', value: selectedGpsAthlete.athleteName },
                  ],
                  sections: [
                    {
                      heading: 'Neuromuscular & Autonomic Readiness Summary',
                      lines: athletes.map(
                        (a) =>
                          `${a.name} (${a.position}): Readiness ${a.readiness}%, ACWR ${a.acwr.toFixed(2)}, HRV ${a.hrvMs}ms (Base ${a.hrvBaselineMs}ms), Sleep ${a.sleepFormatted}, Risk: ${a.injuryRisk}`
                      ),
                    },
                  ],
                  tableHeaders: ['Athlete', 'Position', 'Dist (m)', 'HSR (m)', 'Sprint (m)', 'Vmax', 'Load (AU)', 'CMJ W/kg'],
                  tableRows: GPS_TELEMETRY_DATA.map((g) => [
                    g.athleteName,
                    g.position,
                    g.totalDistanceM,
                    g.hsrDistanceM,
                    g.sprintDistanceM,
                    `${g.maxVelocityKmh} km/h`,
                    `${g.playerLoadAu} AU`,
                    `${g.cmjPeakPowerWkg}`,
                  ]),
                });
                onTriggerToast(`Exported Sports Science Telemetry PDF Dossier (${file}) ✓`);
              }}
              className="px-3 py-1.5 rounded-md bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
              title="Export Sports Science Dossier as PDF"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => setIsIngestModalOpen(true)}
              className="px-3.5 py-1.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/10"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Ingest Sensor Telemetry</span>
            </button>
            <button
              onClick={() => {
                setLiveStreamActive((prev) => !prev);
                onTriggerToast(liveStreamActive ? 'Paused live GNSS pod stream' : 'Resumed live GNSS pod stream (10 Hz)');
              }}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
              <span>Sync Pods</span>
            </button>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="flex flex-wrap items-center gap-1 pt-3">
          {(
            [
              { id: 'readiness', label: 'Readiness & Autonomic HRV', icon: HeartPulse },
              { id: 'fatigue', label: 'Neuromuscular CMJ Force Plates', icon: Cpu },
              { id: 'gps-wearables', label: 'GPS Microtechnology Stream', icon: Zap },
              { id: 'recovery', label: 'Recovery Protocols', icon: Moon },
              { id: 'anomaly-matrix', label: 'Multi-Variable Anomaly Matrix', icon: AlertTriangle },
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
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
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

      {/* 2. SUBTAB: READINESS & AUTONOMIC HRV */}
      {activeSubTab === 'readiness' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">Squad Mean Readiness</span>
              <strong className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
                {athletes.length
                  ? (athletes.reduce((acc, a) => acc + a.readiness, 0) / athletes.length).toFixed(1)
                  : '81.4'}{' '}
                / 100
              </strong>
              <div className="text-[11px] text-slate-400 mt-1">
                Across {athletes.length} monitored athletes in selected context
              </div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">Autonomic HRV rMSSD Mean</span>
              <strong className="text-2xl font-bold text-cyan-400 font-mono mt-1 block">
                {athletes.length
                  ? (athletes.reduce((acc, a) => acc + a.hrvMs, 0) / athletes.length).toFixed(1)
                  : '72.8'}{' '}
                ms
              </strong>
              <div className="text-[11px] text-slate-400 mt-1">Normal Parasympathetic Balance</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">Mean Sleep Duration</span>
              <strong className="text-2xl font-bold text-slate-100 font-mono mt-1 block">
                {athletes.length
                  ? `${(athletes.reduce((acc, a) => acc + a.sleepHours, 0) / athletes.length).toFixed(1)}h`
                  : '7h 52m'}
              </strong>
              <div className="text-[11px] text-emerald-400 mt-1">21.5% Deep Non-REM Stage</div>
            </div>
            <div className="p-4 rounded-lg bg-[#0F1623] border border-slate-800">
              <span className="text-slate-400 block text-xs">Autonomic Suppression Flags</span>
              <strong className="text-2xl font-bold text-amber-400 font-mono mt-1 block">
                {athletes.filter((a) => a.hrvMs < a.hrvBaselineMs).length} Athletes
              </strong>
              <div className="text-[11px] text-amber-400 mt-1">HRV below individual rolling norm</div>
            </div>
          </div>

          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-100 uppercase mb-3">
              Senior Squad Morning Telemetry Register
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Readiness Score</th>
                    <th className="py-2.5 px-3">HRV rMSSD</th>
                    <th className="py-2.5 px-3">HRV Baseline Delta</th>
                    <th className="py-2.5 px-3">Sleep Duration</th>
                    <th className="py-2.5 px-3">Subjective Soreness</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {athletes.map((ath) => {
                    const hrvDelta = ath.hrvMs - ath.hrvBaselineMs;
                    return (
                      <tr key={ath.id} className="hover:bg-[#121927] transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <AthleteAvatar name={ath.name} jerseyNumber={ath.jerseyNumber} status={ath.status} size="sm" />
                            <div>
                              <div className="font-semibold text-slate-100">{ath.name}</div>
                              <div className="text-[11px] font-mono text-slate-500">{ath.athleteId}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{ath.position}</td>
                        <td className="py-3 px-3">
                          <ReadinessScoreIndicator score={ath.readiness} delta={ath.readinessDelta} showBar={true} />
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-cyan-400">{ath.hrvMs} ms</td>
                        <td className="py-3 px-3 font-mono">
                          <span className={hrvDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {hrvDelta >= 0 ? `+${hrvDelta}` : hrvDelta} ms ({hrvDelta >= 0 ? 'Optimal' : 'Suppressed'})
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-slate-200">{ath.sleepFormatted || `${ath.sleepHours}h`}</td>
                        <td className="py-3 px-3 font-mono">
                          <span className={ath.sorenessScore > 3 ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                            {ath.sorenessScore} / 10
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <RiskBadge risk={ath.injuryRisk} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. SUBTAB: NEUROMUSCULAR CMJ FORCE PLATES */}
      {activeSubTab === 'fatigue' && (
        <div className="space-y-4">
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  VALD FORCEDECKS DUAL-PLATE COUNTERMOVEMENT JUMP (CMJ) BATTERY
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Assessing stretch-shortening cycle (SSC) neuromuscular fatigue, eccentric deceleration impulse, and propulsive asymmetry.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400">Weekly Testing Battery (Validated 1000 Hz)</span>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Jump Height</th>
                    <th className="py-2.5 px-3">FT:CT Ratio</th>
                    <th className="py-2.5 px-3">Peak Power (W/kg)</th>
                    <th className="py-2.5 px-3">RSI-Modified</th>
                    <th className="py-2.5 px-3">Eccentric Decel Impulse</th>
                    <th className="py-2.5 px-3">Takeoff Asymmetry</th>
                    <th className="py-2.5 px-3 text-right">Neuromuscular State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {FORCE_PLATE_DATA.map((fp) => (
                    <tr key={fp.athleteId} className="hover:bg-[#121927]">
                      <td className="py-3 px-3 font-semibold text-slate-100">{fp.athleteName}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-200">{fp.jumpHeightCm} cm</td>
                      <td className="py-3 px-3 font-mono">
                        <span className={fp.flightToContractionRatio < 0.7 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                          {fp.flightToContractionRatio.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-1">(norm &gt;0.75)</span>
                      </td>
                      <td className="py-3 px-3 font-mono text-cyan-400">{fp.peakPropulsivePowerWKg} W/kg</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{fp.concentricRsiModified.toFixed(2)}</td>
                      <td className="py-3 px-3 font-mono text-slate-300">{fp.eccentricDecelImpulseNs} N·s</td>
                      <td className="py-3 px-3 font-mono">
                        <span className={fp.takeoffAsymmetryPct > 8 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                          {fp.takeoffAsymmetryPct}% ({fp.asymmetrySide})
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            fp.fatigueIndex === 'Fresh'
                              ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                              : fp.fatigueIndex === 'Mild Neuromuscular Fatigue'
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          {fp.fatigueIndex}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBTAB: GPS MICROTECHNOLOGY STREAM */}
      {activeSubTab === 'gps-wearables' && (
        <div className="space-y-4">
          {/* Athlete Focus Selector Card */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                  LIVE CATAPULT VECTOR GNSS MICROTECHNOLOGY STREAM
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  10 Hz high-frequency GPS, tri-axial 100 Hz accelerometry, and metabolic power metrics.
                </p>
              </div>

              <select
                value={selectedGpsAthleteId}
                onChange={(e) => setSelectedGpsAthleteId(e.target.value)}
                className="px-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-xs font-semibold text-cyan-300"
              >
                {GPS_TELEMETRY_DATA.map((g) => (
                  <option key={g.athleteId} value={g.athleteId}>
                    {g.athleteName} ({g.position})
                  </option>
                ))}
              </select>
            </div>

            {/* EWMA Scientific Workload Engine Banner */}
            <div className="p-4 rounded-lg bg-[#070D18] border border-cyan-500/40 space-y-3 mt-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-100 text-xs uppercase tracking-wider">
                    Scientific Workload Modeling: EWMA vs Rolling 7:28d Ratio
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-[#090D16] p-0.5 rounded border border-slate-800 text-[10px]">
                  <button
                    onClick={() => {
                      setWorkloadEngineMode('ewma');
                      onTriggerToast('Switched to EWMA Dynamic Decay (λ_acute=0.25, λ_chronic=0.069) ✓');
                    }}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                      workloadEngineMode === 'ewma'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⚡ EWMA Dynamic Decay
                  </button>
                  <button
                    onClick={() => {
                      setWorkloadEngineMode('rolling');
                      onTriggerToast('Switched to Unweighted 7:28d Rolling Average');
                    }}
                    className={`px-2.5 py-1 rounded font-semibold transition-colors ${
                      workloadEngineMode === 'rolling'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📊 Traditional Rolling 7:28d
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">COUPLED EWMA ACWR</span>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
                    {workloadEngineMode === 'ewma' ? '1.14 (Sweet Spot)' : '1.28 (+12% artifact)'}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    {workloadEngineMode === 'ewma' ? 'λ_a=0.25 (7d) · λ_c=0.069 (28d)' : 'Unweighted 7-day sum / 28-day mean'}
                  </span>
                </div>
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">ACUTE LOAD EWMA</span>
                  <div className="text-lg font-mono font-bold text-cyan-300 mt-0.5">
                    {workloadEngineMode === 'ewma' ? '642 AU' : '710 AU'}
                  </div>
                  <span className="text-[10px] text-slate-500">Decay weight emphasizes last 48h</span>
                </div>
                <div className="p-2.5 rounded bg-[#090D16] border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">SAFE WORKLOAD CORRIDOR</span>
                  <div className="text-lg font-mono font-bold text-slate-100 mt-0.5">0.80 – 1.30</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Z-Score: +0.42 SD (Low Risk)</span>
                </div>
              </div>
            </div>

            {/* Individual Telemetry Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
              <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TOTAL DISTANCE</span>
                <strong className="text-lg font-mono font-bold text-slate-100">
                  {selectedGpsAthlete.totalDistanceM} m
                </strong>
              </div>
              <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">HSR (&gt;19.8 KM/H)</span>
                <strong className="text-lg font-mono font-bold text-cyan-400">
                  {selectedGpsAthlete.hsrDistanceM} m
                </strong>
              </div>
              <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">SPRINT (&gt;25.2 KM/H)</span>
                <strong className="text-lg font-mono font-bold text-amber-400">
                  {selectedGpsAthlete.sprintDistanceM} m
                </strong>
              </div>
              <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">ACCEL / DECEL</span>
                <strong className="text-lg font-mono font-bold text-slate-200">
                  +{selectedGpsAthlete.accelCount} / -{selectedGpsAthlete.decelCount}
                </strong>
              </div>
              <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">PLAYERLOAD™</span>
                <strong className="text-lg font-mono font-bold text-emerald-400">
                  {selectedGpsAthlete.playerLoad} AU
                </strong>
              </div>
              <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TOP SPEED</span>
                <strong className="text-lg font-mono font-bold text-rose-400">
                  {selectedGpsAthlete.topSpeedKmh} km/h
                </strong>
              </div>
            </div>
          </div>

          {/* Full Squad GPS Grid */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <h3 className="text-sm font-bold text-slate-100 uppercase mb-3">
              Active Squad Pitch Telemetry Matrix
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3">Total Distance</th>
                    <th className="py-2.5 px-3">HSR (&gt;19.8 km/h)</th>
                    <th className="py-2.5 px-3">Sprint Distance</th>
                    <th className="py-2.5 px-3">Sprints</th>
                    <th className="py-2.5 px-3">Accels / Decels</th>
                    <th className="py-2.5 px-3">PlayerLoad™</th>
                    <th className="py-2.5 px-3 text-right">Cap Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {GPS_TELEMETRY_DATA.map((g) => (
                    <tr key={g.athleteId} className="hover:bg-[#121927]">
                      <td className="py-3 px-3 font-semibold text-slate-100">{g.athleteName}</td>
                      <td className="py-3 px-3 text-slate-300">{g.position}</td>
                      <td className="py-3 px-3 font-mono">{g.totalDistanceM} m</td>
                      <td className="py-3 px-3 font-mono font-bold text-cyan-400">{g.hsrDistanceM} m</td>
                      <td className="py-3 px-3 font-mono text-amber-400">{g.sprintDistanceM} m</td>
                      <td className="py-3 px-3 font-mono">{g.sprintCount} bouts</td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        +{g.accelCount} / -{g.decelCount}
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400 font-bold">{g.playerLoad}</td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            g.capStatus === 'Approaching Cap'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : g.capStatus === 'Capped'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {g.capStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. SUBTAB: RECOVERY PROTOCOLS */}
      {activeSubTab === 'recovery' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {RECOVERY_PROTOCOLS.map((rec) => (
              <div key={rec.id} className="p-5 rounded-lg bg-[#0F1623] border border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">{rec.category}</span>
                    <h3 className="text-base font-bold text-slate-100 mt-0.5">{rec.name}</h3>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-400">
                    {rec.completionRatePct}% Compliance
                  </span>
                </div>

                <div className="p-3 rounded bg-[#090D16] border border-slate-800/80 text-xs">
                  <span className="text-slate-500 block text-[10px]">PRESCRIPTION PROTOCOL</span>
                  <div className="text-slate-200 font-mono mt-0.5">{rec.protocol}</div>
                </div>

                <div className="text-xs text-slate-400">
                  <strong>Adaptation:</strong> {rec.targetAdaptation}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Scheduled: {rec.scheduledAthletes} Athletes</span>
                  <button
                    onClick={() => onTriggerToast(`Recorded recovery completion for ${rec.name} ✓`)}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold"
                  >
                    Log Compliance
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SUBTAB: MULTI-VARIABLE ANOMALY MATRIX */}
      {activeSubTab === 'anomaly-matrix' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                MULTI-VARIABLE RISK ANOMALY DETECTION ENGINE
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Algorithmically cross-referencing Autonomic HRV, Force Plate CMJ Asymmetries, and Acute Workload Spikes to identify concealed soft-tissue hazard.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                athleteName: 'Arjun Mehta',
                position: 'Forward',
                riskScore: 84,
                factors: [
                  'Acute Load Spike (+22% vs 28d baseline)',
                  'Autonomic HRV rMSSD Suppression (-14%)',
                  'CMJ Takeoff Asymmetry (8.4% Right Dominant)',
                  'Prior Left Hamstring Strain in Stage 3 RTP',
                ],
                recommendedAction: 'Cap HSR at 70%; isolate from maximal deceleration bouts; schedule manual release.',
              },
              {
                athleteName: 'Kabir Verma',
                position: 'Attacking Midfielder',
                riskScore: 78,
                factors: [
                  'Substantial Neuromuscular Fatigue (FT:CT 0.59)',
                  'CMJ Takeoff Asymmetry (11.2% Left Dominant)',
                  'Sleep Deprivation (5h 45m recorded)',
                ],
                recommendedAction: 'Full pitch deload; assign 30m Normatec + Hydrotherapy recovery protocol.',
              },
            ].map((anom, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-[#0B101B] border border-rose-500/30 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                    <h3 className="text-sm font-bold text-slate-100">{anom.athleteName} ({anom.position})</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold">
                    Risk Index: {anom.riskScore} / 100
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded bg-[#090D16] border border-slate-800">
                    <span className="text-slate-500 block text-[10px] font-semibold mb-1">CONVERGING RISK FACTORS</span>
                    <ul className="space-y-1 text-slate-300">
                      {anom.factors.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-rose-400 font-bold">●</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded bg-[#090D16] border border-slate-800 flex flex-col justify-between">
                    <div>
                      <span className="text-slate-500 block text-[10px] font-semibold mb-1">PRESCRIBED MITIGATION</span>
                      <p className="text-slate-200">{anom.recommendedAction}</p>
                    </div>
                    <button
                      onClick={() => onTriggerToast(`Transmitted operational mitigation to Coaching Staff for ${anom.athleteName} ✓`)}
                      className="mt-3 px-3 py-1.5 rounded bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold text-xs"
                    >
                      Broadcast Training Modification
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sensor Ingestion Hub Modal */}
      {isIngestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b111e] border border-cyan-500/40 rounded-xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Sensor Ingestion Hub</h3>
                  <span className="text-[11px] font-mono text-cyan-400">Bulk GPS, Force Plate & Wearable Parser</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsIngestModalOpen(false);
                  setIngestProgress(null);
                }}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <span className="text-slate-300 font-semibold block">1. Select Telemetry Feed Format:</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'catapult', label: 'Catapult Vector GPS', desc: '10Hz Raw Session CSV' },
                  { id: 'forcedecks', label: 'Vald ForceDecks', desc: 'CMJ Asymmetry JSON' },
                  { id: 'oura', label: 'Oura / Whoop 4.0', desc: 'Nightly HRV rMSSD' },
                ].map((feed) => (
                  <button
                    key={feed.id}
                    type="button"
                    onClick={() => setIngestFileFormat(feed.id as any)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      ingestFileFormat === feed.id
                        ? 'bg-cyan-500/15 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                        : 'bg-[#101827] border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold text-slate-200">{feed.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{feed.desc}</div>
                  </button>
                ))}
              </div>

              <div className="border-2 border-dashed border-slate-700 hover:border-cyan-500/50 rounded-xl p-6 text-center space-y-2 bg-[#090D16] transition-colors">
                <Upload className="w-8 h-8 text-cyan-400 mx-auto" />
                <div className="font-semibold text-slate-200">
                  Drag & Drop <span className="font-mono text-cyan-300">session_export_{ingestFileFormat}.csv</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Supports up to 32 squad athletes simultaneously with automated ID matching
                </p>
              </div>

              {ingestProgress !== null && (
                <div className="space-y-1.5 p-3 rounded-lg bg-[#101827] border border-cyan-500/30">
                  <div className="flex justify-between text-[11px] text-slate-300 font-mono">
                    <span>
                      {ingestProgress < 50
                        ? 'Reading payload bytes...'
                        : ingestProgress < 90
                        ? 'Validating schemas & matching IDs...'
                        : 'Updating EWMA workload models...'}
                    </span>
                    <span className="font-bold text-cyan-400">{ingestProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${ingestProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsIngestModalOpen(false);
                  setIngestProgress(null);
                }}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIngestProgress(25);
                  setTimeout(() => setIngestProgress(65), 400);
                  setTimeout(() => setIngestProgress(95), 800);
                  setTimeout(() => {
                    setIngestProgress(100);
                    onTriggerToast(`Successfully parsed and ingested ${ingestFileFormat.toUpperCase()} telemetry for 28 athletes ✓`);
                    setIsIngestModalOpen(false);
                    setIngestProgress(null);
                  }, 1200);
                }}
                disabled={ingestProgress !== null}
                className="px-4 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Parse & Ingest Feed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
