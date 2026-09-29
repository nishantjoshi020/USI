import React from 'react';
import {
  ArrowLeft,
  BarChart3,
  Bot,
  ClipboardCheck,
  Dumbbell,
  HeartPulse,
  Settings,
  Users,
  Utensils,
  Activity,
} from 'lucide-react';
import {
  AssessmentRecord,
  Athlete,
  DailyAnalyticsPoint,
  Injury,
  NavItemId,
  TrainingSession,
  UserRole,
} from '../../types/usi';
import {
  AthleteAvatar,
  LoadBadge,
  ReadinessScoreIndicator,
  RiskBadge,
  StatusBadge,
} from '../ui/Badges';

interface ConnectedModuleViewProps {
  activeNav: NavItemId;
  onReturnToCommandCenter: () => void;
  athletes: Athlete[];
  sessions: TrainingSession[];
  injuries: Injury[];
  assessments: AssessmentRecord[];
  analyticsSeries: DailyAnalyticsPoint[];
  selectedRole?: UserRole;
  onSelectAthlete: (athlete: Athlete) => void;
  onSelectSession: (session: TrainingSession) => void;
}

const MODULE_META: Partial<
  Record<
    NavItemId,
    { title: string; category: string; description: string }
  >
> = {
  'command-center': {
    title: 'Command Center',
    category: 'Executive Operations',
    description: 'Unified operating layer for athlete readiness, workload, and AI intelligence.',
  },
  'athlete-registry': {
    title: 'Athlete Registry',
    category: 'Athletes Module',
    description: 'Master federation roster, readiness status, positional cohorts, and physiological baselines.',
  },
  'athlete-360': {
    title: 'Athlete 360 Profile',
    category: 'Athletes Module',
    description: 'Unified longitudinal athlete profile, telemetry, performance benchmarks, and governance.',
  },
  enrollment: {
    title: 'Athlete Enrollment',
    category: 'Athletes Module',
    description: 'Onboarding workflows for national camp intake, biometric baseline capture, and squad assignment.',
  },
  verification: {
    title: 'Eligibility & Medical Verification',
    category: 'Athletes Module',
    description: 'WADA anti-doping whereabouts compliance, cardiac screening, and federation passport status.',
  },
  periodisation: {
    title: 'Macrocycle Periodisation',
    category: 'Training Module',
    description: 'Mesocycle load planning, tactical peaking blocks, and competition taper architecture.',
  },
  sessions: {
    title: 'Training Sessions',
    category: 'Training Module',
    description: 'Daily pitch, gym, and recovery session operations, attendance, and drill prescriptions.',
  },
  exercises: {
    title: 'Exercise & Drill Library',
    category: 'Training Module',
    description: 'Standardized S&C velocity-based exercises, Nordic protocols, and tactical possession grids.',
  },
  workload: {
    title: 'Workload & ACWR Monitoring',
    category: 'Training Module',
    description: 'Acute:Chronic Workload Ratio modeling, internal sRPE vs external GPS load balance.',
  },
  'injury-intelligence': {
    title: 'Injury Intelligence',
    category: 'Medical Module',
    description: 'Active clinical caseload, tissue pathology distribution, and predictive overload alerts.',
  },
  'injury-register': {
    title: 'Clinical Injury Register',
    category: 'Medical Module',
    description: 'Longitudinal OSICS-coded injury records, diagnostic imaging logs, and time-loss auditing.',
  },
  rehabilitation: {
    title: 'Rehabilitation Operations',
    category: 'Medical Module',
    description: 'Stage-gated rehabilitation prescriptions, daily clinician notes, and compliance tracking.',
  },
  'return-to-play': {
    title: 'Return to Play (RTP) Gates',
    category: 'Medical Module',
    description: 'Objective clinical, isokinetic symmetry, and GPS high-speed velocity clearance gates.',
  },
  readiness: {
    title: 'Readiness & Wellness Telemetry',
    category: 'Sports Science Module',
    description: 'Morning composite readiness screening across autonomic HRV, sleep, soreness, and CMJ.',
  },
  fatigue: {
    title: 'Neuromuscular Fatigue',
    category: 'Sports Science Module',
    description: 'Force-plate countermovement jump (CMJ) flight-to-contraction ratio and creatine kinase tracking.',
  },
  'gps-wearables': {
    title: 'GPS & Wearable Telemetry',
    category: 'Sports Science Module',
    description: 'High-speed running (>19.8 km/h), sprint distance (>25.2 km/h), and metabolic power streams.',
  },
  recovery: {
    title: 'Recovery Protocols',
    category: 'Sports Science Module',
    description: 'Hydrotherapy, cryotherapy, pneumatic compression, and sleep hygiene compliance.',
  },
  nutrition: {
    title: 'Performance Nutrition & Hydration',
    category: 'Nutrition Module',
    description: 'Match-day glycogen periodisation, morning urine osmolality, and individualized supplementation.',
  },
  'assessments-tid': {
    title: 'Assessments & Talent Identification (TID)',
    category: 'Assessments & TID',
    description: 'Standardized physical testing batteries, percentile benchmarking, and pathway progression.',
  },
  'analytics-bi': {
    title: 'Performance Analytics & BI',
    category: 'Analytics & BI',
    description: 'Longitudinal multi-variable longitudinal trends across readiness, workload, and injury incidence.',
  },
  'ai-copilot': {
    title: 'AI Operational Intelligence Engine',
    category: 'AI Copilot',
    description: 'Contextual decision-support models translating multi-modal athlete telemetry into squad actions.',
  },
  settings: {
    title: 'Federation & Platform Settings',
    category: 'System Administration',
    description: 'Role-based access control, wearable API integrations, and threshold calibration.',
  },
};

export const ConnectedModuleView: React.FC<ConnectedModuleViewProps> = ({
  activeNav,
  onReturnToCommandCenter,
  athletes,
  sessions,
  injuries,
  assessments,
  analyticsSeries,
  selectedRole = 'Performance Director',
  onSelectAthlete,
  onSelectSession,
}) => {
  const isAthlete = selectedRole === 'Athlete';
  const visibleAthletes = isAthlete ? athletes.slice(0, 1) : athletes;
  const visibleSessions = isAthlete ? sessions.slice(0, 2) : sessions;
  const visibleInjuries = isAthlete
    ? injuries.filter(
        (inj) =>
          inj.athleteId === 'ath-1042' ||
          inj.athleteName.toLowerCase().includes('arjun') ||
          inj.athleteId === athletes[0]?.id
      )
    : injuries;

  const meta = MODULE_META[activeNav] ||
    MODULE_META['athlete-registry'] || {
      title: 'Athlete Registry',
      category: 'Athletes Module',
      description: 'Master federation roster and operational status.',
    };

  return (
    <div className="space-y-5">
      {/* Module Breadcrumb & Header */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
            <span>{meta.category}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">Connected Operational Workspace</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 mt-1">{meta.title}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{meta.description}</p>
        </div>

        <button
          onClick={onReturnToCommandCenter}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-xs font-semibold text-sky-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Command Center</span>
        </button>
      </div>

      {/* Contextual Connected Data Table based on active module */}
      {(activeNav === 'athlete-registry' ||
        activeNav === 'enrollment' ||
        activeNav === 'verification' ||
        activeNav === 'readiness' ||
        activeNav === 'fatigue' ||
        activeNav === 'gps-wearables' ||
        activeNav === 'recovery' ||
        activeNav === 'nutrition') && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-slate-100">
                {isAthlete
                  ? 'MY ATHLETE BIOMETRIC & TELEMETRY STREAM'
                  : 'SENIOR NATIONAL SQUAD — CONNECTED ATHLETE COHORT'}
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {isAthlete ? 'Verified Personal Athlete Stream' : 'Click any athlete to open detail drawer'}
            </span>
          </div>

          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-semibold">
                  <th className="py-2.5 pr-3">Athlete</th>
                  <th className="py-2.5 px-2">Position</th>
                  <th className="py-2.5 px-2">Readiness</th>
                  <th className="py-2.5 px-2">HRV / Sleep</th>
                  <th className="py-2.5 px-2">Load (ACWR)</th>
                  <th className="py-2.5 px-2">Nutrition / Hydration</th>
                  <th className="py-2.5 pl-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visibleAthletes.map((ath) => (
                  <tr
                    key={ath.id}
                    onClick={() => onSelectAthlete(ath)}
                    className="hover:bg-[#151E2E] cursor-pointer transition-colors"
                  >
                    <td className="py-3 pr-3">
                      <div className="flex items-center gap-2.5">
                        <AthleteAvatar
                          name={ath.name}
                          jerseyNumber={ath.jerseyNumber}
                          status={ath.status}
                          size="sm"
                        />
                        <div>
                          <div className="font-semibold text-slate-100">
                            {ath.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {ath.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{ath.position}</td>
                    <td className="py-3 px-2">
                      <ReadinessScoreIndicator
                        score={ath.readiness}
                        delta={ath.readinessDelta}
                      />
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-300 tabular-nums">
                      {ath.hrvMs} ms · {ath.sleepHours}h
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-300 tabular-nums">
                      {ath.acuteLoadAu} AU ({ath.acwr.toFixed(2)})
                    </td>
                    <td className="py-3 px-2 font-mono text-slate-300 tabular-nums">
                      {ath.nutritionCompliancePct}% · {ath.hydrationStatus}
                    </td>
                    <td className="py-3 pl-2 text-right">
                      <StatusBadge status={ath.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(activeNav === 'sessions' ||
        activeNav === 'periodisation' ||
        activeNav === 'exercises' ||
        activeNav === 'workload') && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-slate-100">
                TRAINING & WORKLOAD OPERATIONS SCHEDULE
              </h2>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleSessions.map((sess) => (
              <div
                key={sess.id}
                onClick={() => onSelectSession(sess)}
                className="p-4 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">
                    {sess.title}
                  </span>
                  <StatusBadge status={sess.status} />
                </div>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  {sess.time} · Coach {sess.coach} · {sess.pitchOrVenue}
                </div>
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-300">
                    Attendance: {sess.attendance}% ({sess.attendedCount}/{sess.scheduledCount})
                  </span>
                  <LoadBadge load={sess.intensity} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(activeNav === 'injury-intelligence' ||
        activeNav === 'injury-register' ||
        activeNav === 'rehabilitation' ||
        activeNav === 'return-to-play') && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-rose-400" />
              <h2 className="text-sm font-bold text-slate-100">
                ACTIVE CLINICAL CASELOAD & RTP GATES
              </h2>
            </div>
          </div>
          <div className="mt-3 space-y-2.5">
            {visibleInjuries.map((inj) => {
              const ath = athletes.find((a) => a.id === inj.athleteId);
              return (
                <div
                  key={inj.id}
                  onClick={() => ath && onSelectAthlete(ath)}
                  className="p-4 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 cursor-pointer transition-colors flex flex-wrap items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-100">
                        {inj.athleteName}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({inj.position})
                      </span>
                      <StatusBadge status={inj.stage} />
                    </div>
                    <div className="text-xs text-slate-300 mt-1">
                      <strong>{inj.bodyPart} ({inj.side}):</strong> {inj.diagnosis}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Protocol: {inj.currentProtocol}
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <div className="text-slate-200 font-semibold">
                      Est. RTP: {inj.estimatedRtpDate} ({inj.daysToRtp}d)
                    </div>
                    <div className="text-emerald-400 mt-0.5">
                      Compliance: {inj.rehabCompliancePct}% · {inj.leadClinician}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(activeNav === 'assessments-tid' ||
        activeNav === 'analytics-bi' ||
        activeNav === 'ai-copilot' ||
        activeNav === 'settings') && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-slate-100">
                SCHEDULED PERFORMANCE BATTERIES & SYSTEM TELEMETRY
              </h2>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            {assessments.map((as) => (
              <div
                key={as.id}
                className="p-4 rounded-md bg-[#0B101B] border border-slate-800"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-100">
                    {as.title}
                  </span>
                  <span className="text-xs font-mono text-sky-400">
                    {as.completedCount}/{as.totalCount} Tested
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Category: {as.category} · Lead: {as.leadScientist}
                </div>
                <div className="mt-2.5 w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{
                      width: `${(as.completedCount / as.totalCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
