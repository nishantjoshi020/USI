import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Dumbbell,
  HeartPulse,
  ShieldAlert,
  User,
  X,
  ExternalLink,
} from 'lucide-react';
import { Athlete, NavItemId, UserRole } from '../../types/usi';
import {
  AthleteAvatar,
  LoadBadge,
  MedicalStatusBadge,
  ReadinessScoreIndicator,
  RiskBadge,
  TrainingStatusBadge,
} from '../ui/Badges';

interface AthleteDetailDrawerProps {
  athlete: Athlete | null;
  selectedRole?: UserRole;
  onClose: () => void;
  onOpenFullProfile: (athlete: Athlete) => void;
  onNavigateModuleWithAthlete: (module: NavItemId, athlete: Athlete) => void;
  onUpdateAthleteLoadOrStatus: (
    athleteId: string,
    updates: Partial<Athlete>,
    toastMessage: string
  ) => void;
}

export const AthleteDetailDrawer: React.FC<AthleteDetailDrawerProps> = ({
  athlete,
  selectedRole = 'Performance Director',
  onClose,
  onOpenFullProfile,
  onNavigateModuleWithAthlete,
  onUpdateAthleteLoadOrStatus,
}) => {
  const [activeQuickTab, setActiveQuickTab] = useState<
    'overview' | 'medical' | 'training' | 'performance'
  >('overview');

  if (!athlete) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-[1px] transition-opacity"
      />

      {/* Drawer Panel */}
      <aside className="relative w-full max-w-xl bg-[#0F1623] border-l border-slate-800 h-full flex flex-col justify-between z-10 overflow-hidden shadow-2xl">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <AthleteAvatar
              name={athlete.name}
              jerseyNumber={athlete.jerseyNumber}
              status={athlete.status}
              size="lg"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-slate-100">
                  {athlete.name}
                </h2>
                <TrainingStatusBadge status={athlete.trainingStatus} />
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="font-mono text-sky-400 font-semibold">
                  {athlete.athleteId}
                </span>
                <span>·</span>
                <span>{athlete.sport}</span>
                <span>·</span>
                <span className="text-slate-200 font-medium">{athlete.position}</span>
                <span>·</span>
                <span>{athlete.squad}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenFullProfile(athlete)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap"
            >
              <span>Open Full Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-5 py-3 bg-[#0B101B] border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'overview', label: 'View Athlete', icon: User },
              ...(selectedRole !== 'Athlete'
                ? [{ id: 'medical', label: 'Medical', icon: HeartPulse }]
                : []),
              { id: 'training', label: 'Training', icon: Dumbbell },
              { id: 'performance', label: 'Performance', icon: Activity },
            ].map((btn) => {
              const Icon = btn.icon;
              const isActive = activeQuickTab === btn.id;
              return (
                <button
                  key={btn.id}
                  onClick={() =>
                    setActiveQuickTab(
                      btn.id as 'overview' | 'medical' | 'training' | 'performance'
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-[#0F1623] hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => onOpenFullProfile(athlete)}
            className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 hover:text-sky-300 whitespace-nowrap shrink-0"
          >
            <span>/athletes/{athlete.athleteId}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Core 4 Telemetry Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Readiness</div>
              <div className="mt-1">
                <ReadinessScoreIndicator
                  score={athlete.readiness}
                  delta={athlete.readinessDelta}
                  showBar={false}
                />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                / 100 composite
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Injury Risk</div>
              <div className="mt-1.5">
                <RiskBadge risk={athlete.injuryRisk} />
              </div>
              <div className="text-[10px] text-slate-500 mt-1 font-mono">
                Multi-signal model
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Training Load</div>
              <div className="mt-1.5 flex items-center gap-1.5">
                <LoadBadge load={athlete.trainingLoad} />
                <span className="text-xs font-mono text-slate-300">
                  ({athlete.trainingLoadPct}%)
                </span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono tabular-nums">
                {athlete.acuteLoadAu} AU · ACWR {athlete.acwr.toFixed(2)}
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Recovery</div>
              <div className="mt-1 font-mono text-sm font-bold text-slate-100 tabular-nums">
                {athlete.recovery}%
              </div>
              <div className="text-[10px] text-slate-400 mt-1 font-mono tabular-nums">
                HRV {athlete.hrvMs} ms · {athlete.sleepFormatted}
              </div>
            </div>
          </div>

          {activeQuickTab === 'overview' && (
            <>
              {/* AI Athlete Summary Preview */}
              <div className="p-4 rounded-md bg-[#0B101B] border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-300 tracking-wide">
                    AI ATHLETE SUMMARY
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">
                    Contextual Intelligence
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  "{athlete.aiSummary}"
                </p>
              </div>

              {/* Active Risk Signals */}
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-wide text-slate-200">
                    DETECTED PHYSIOLOGICAL & WORKLOAD SIGNALS
                  </span>
                  <MedicalStatusBadge status={athlete.medicalStatus} />
                </div>
                <ul className="space-y-1.5">
                  {athlete.riskSignals.map((sig, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-slate-300"
                    >
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 14-Day Readiness Trend Sparkline */}
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold text-slate-200">
                    14-Day Individual Readiness Trajectory
                  </span>
                  <span className="font-mono text-slate-400 tabular-nums">
                    Range: {Math.min(...athlete.readinessHistory14d)}% –{' '}
                    {Math.max(...athlete.readinessHistory14d)}%
                  </span>
                </div>
                <div className="h-16 flex items-end gap-1.5">
                  {athlete.readinessHistory14d.map((val, idx) => (
                    <div
                      key={idx}
                      className="flex-1 h-full flex flex-col justify-end items-center"
                    >
                      <div
                        style={{ height: `${val}%` }}
                        className={`w-full rounded-t-sm ${
                          val >= 80
                            ? 'bg-emerald-500/75'
                            : val >= 68
                              ? 'bg-amber-500/75'
                              : 'bg-rose-500/80'
                        }`}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1.5">
                  <span>15 Sep</span>
                  <span>21 Sep</span>
                  <span>28 Sep (Today: {athlete.readiness}%)</span>
                </div>
              </div>
            </>
          )}

          {activeQuickTab === 'medical' && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-200">
                  CLINICAL ASSESSMENT & TISSUE STATUS
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {athlete.medicalNote}
                </p>
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Prior Injury History:</span>
                  <span className="text-amber-300 font-medium">
                    {athlete.previousInjuryHistory}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeQuickTab === 'training' && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
                <div className="text-xs font-bold text-slate-200 mb-3">
                  TODAY'S SESSION EXPOSURES (28 SEP 2026)
                </div>
                <div className="space-y-2">
                  {athlete.recentSessions.map((sess) => (
                    <div
                      key={sess.sessionId}
                      className="p-2.5 rounded bg-[#0F1623] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-200">{sess.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">
                          sRPE: {sess.rpe}/10 · Load: {sess.loadAu} AU
                        </div>
                      </div>
                      <div className="text-right font-mono text-xs text-sky-400 tabular-nums">
                        {sess.highSpeedMeters}m HSR
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeQuickTab === 'performance' && (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-200">
                  RECENT PERFORMANCE BENCHMARKS
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded bg-[#0F1623] border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">30m Sprint</span>
                    <span className="text-sm font-bold text-emerald-400 mt-1 block">
                      {athlete.performanceMetrics.sprint30m.current}
                    </span>
                  </div>
                  <div className="p-3 rounded bg-[#0F1623] border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Countermovement Jump</span>
                    <span className="text-sm font-bold text-sky-400 mt-1 block">
                      {athlete.performanceMetrics.cmj.current}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Operational Decision Footer inside Drawer */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex flex-wrap items-center justify-between gap-2">
          {selectedRole !== 'Athlete' && (
            <button
              onClick={() =>
                onUpdateAthleteLoadOrStatus(
                  athlete.id,
                  {
                    trainingLoad: 'Moderate',
                    status: 'Restricted',
                    trainingStatus: 'RESTRICTED',
                  },
                  `Applied -25% high-speed running cap for ${athlete.name}`
                )
              }
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Apply Modified Load Cap</span>
            </button>
          )}

          <button
            onClick={() => onOpenFullProfile(athlete)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{selectedRole === 'Athlete' ? 'Open My Full Profile' : 'Open Full Athlete 360'}</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
