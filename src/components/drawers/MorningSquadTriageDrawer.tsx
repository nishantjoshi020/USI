import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  CheckCircle2,
  ChevronRight,
  Clock,
  Dumbbell,
  HeartPulse,
  ShieldAlert,
  Sparkles,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Athlete, UserRole } from '../../types/usi';
import { RiskBadge, TrainingStatusBadge } from '../ui/Badges';

interface MorningSquadTriageDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  athletes: Athlete[];
  selectedRole?: UserRole;
  onApplyModification: (
    athleteId: string,
    modification: string,
    trainingStatus: Athlete['trainingStatus'],
    notes: string
  ) => void;
  onOpenAthlete360: (athlete: Athlete) => void;
  onTriggerToast: (msg: string) => void;
}

export const MorningSquadTriageDrawer: React.FC<MorningSquadTriageDrawerProps> = ({
  isOpen,
  onClose,
  athletes,
  selectedRole = 'Coach',
  onApplyModification,
  onOpenAthlete360,
  onTriggerToast,
}) => {
  // Flagged athletes who need morning review (Readiness < 75 or High Risk or Soreness > 3)
  const flaggedAthletes = athletes.filter(
    (a) => a.readiness < 75 || a.injuryRisk === 'High' || a.sorenessScore >= 4 || a.status === 'Attention'
  );

  const [appliedActions, setAppliedActions] = useState<Record<string, string>>({
    'ath-arjun-mehta': 'Volume reduced: 45 min cap',
  });

  if (!isOpen) return null;

  const handleApplySingle = (
    athlete: Athlete,
    mod: string,
    newStatus: Athlete['trainingStatus'] = 'RESTRICTED'
  ) => {
    setAppliedActions((prev) => ({
      ...prev,
      [athlete.id]: mod,
    }));
    onApplyModification(
      athlete.id,
      mod,
      newStatus,
      `Morning Triage by ${selectedRole}: ${mod}`
    );
    onTriggerToast(`Applied triage modification for ${athlete.name}: ${mod} ✓`);
  };

  const handleApplyAllDefault = () => {
    flaggedAthletes.forEach((ath) => {
      const defaultMod =
        ath.injuryRisk === 'High'
          ? 'Capped at 45m · Offload sprint drills'
          : 'Low-intensity recovery protocol';
      handleApplySingle(ath, defaultMod, 'RESTRICTED');
    });
    onTriggerToast(`Signed off morning triage for all ${flaggedAthletes.length} flagged athletes ✓`);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-[2px] transition-opacity"
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-xl bg-[#0F1623] border-l border-slate-800 h-full p-6 flex flex-col justify-between z-10 shadow-2xl overflow-y-auto">
        <div className="space-y-5 text-xs">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-slate-100 uppercase tracking-tight">
                  MORNING SQUAD READINESS TRIAGE
                </h2>
              </div>
              <p className="text-slate-400 mt-1">
                Multi-disciplinary morning decision gate: Review flagged autonomic & neuromuscular anomalies before pitch sessions.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] uppercase">Flagged Athletes</span>
              <strong className="text-lg font-mono font-bold text-amber-400 mt-0.5 block">
                {flaggedAthletes.length}
              </strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] uppercase">Mean Squad HRV</span>
              <strong className="text-lg font-mono font-bold text-emerald-400 mt-0.5 block">
                68 ms
              </strong>
            </div>
            <div className="p-3 rounded bg-[#0B101B] border border-slate-800 text-center">
              <span className="text-slate-400 block text-[10px] uppercase">Decisions Applied</span>
              <strong className="text-lg font-mono font-bold text-sky-400 mt-0.5 block">
                {Object.keys(appliedActions).length} / {flaggedAthletes.length}
              </strong>
            </div>
          </div>

          {/* Batch Action Banner */}
          <div className="p-3 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="text-slate-200 font-medium">
                AI Morning Recommendation: Apply conservative load caps to 3 high-workload athletes.
              </span>
            </div>
            <button
              onClick={handleApplyAllDefault}
              className="px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shrink-0 whitespace-nowrap transition-colors"
            >
              Apply All Recommendations ✓
            </button>
          </div>

          {/* Flagged Athletes List */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
              Athletes Requiring Morning Load Adjustments ({flaggedAthletes.length})
            </div>

            {flaggedAthletes.map((athlete) => {
              const currentAction = appliedActions[athlete.id];

              return (
                <div
                  key={athlete.id}
                  className="p-4 rounded-lg bg-[#0B101B] border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-100 text-sm">{athlete.name}</span>
                        <span className="font-mono text-slate-400 text-[11px]">
                          {athlete.athleteId} · {athlete.position}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Coach: {athlete.coach} · Squad: {athlete.squad}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="text-right">
                        <div
                          className={`font-mono font-bold text-sm ${
                            athlete.readiness >= 75
                              ? 'text-emerald-400'
                              : athlete.readiness >= 65
                                ? 'text-amber-400'
                                : 'text-rose-400'
                          }`}
                        >
                          {athlete.readiness} / 100
                        </div>
                        <span className="text-[10px] text-slate-500">Readiness</span>
                      </div>
                      <RiskBadge risk={athlete.injuryRisk} />
                    </div>
                  </div>

                  {/* Physiological Risk Signals */}
                  <div className="space-y-1">
                    {athlete.riskSignals.slice(0, 2).map((sig, idx) => (
                      <div
                        key={idx}
                        className="text-[11px] font-mono text-amber-300 flex items-start gap-1.5"
                      >
                        <span className="text-amber-400 mt-0.5">•</span>
                        <span>{sig}</span>
                      </div>
                    ))}
                  </div>

                  {/* Applied Decision Chip */}
                  {currentAction && (
                    <div className="p-2 rounded bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-[11px] flex items-center justify-between">
                      <span>Decision: {currentAction}</span>
                      <span className="text-emerald-400 font-bold">Active ✓</span>
                    </div>
                  )}

                  {/* 1-Click Operational Triage Actions */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Execute Training Modification:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() =>
                          handleApplySingle(
                            athlete,
                            'Cap volume to 45m · Offload max velocity sprint drills',
                            'RESTRICTED'
                          )
                        }
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium transition-colors"
                      >
                        Cap 45m & Offload Sprints
                      </button>
                      <button
                        onClick={() =>
                          handleApplySingle(
                            athlete,
                            'Refer to Lead Physio for Pre-Training MSK & Isometric Screen',
                            'RESTRICTED'
                          )
                        }
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium transition-colors"
                      >
                        Refer to Physio (MSK)
                      </button>
                      <button
                        onClick={() =>
                          handleApplySingle(
                            athlete,
                            'Gym-only low-impact aerobic & core session',
                            'RESTRICTED'
                          )
                        }
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium transition-colors"
                      >
                        Gym Only (Low Impact)
                      </button>
                      <button
                        onClick={() =>
                          handleApplySingle(
                            athlete,
                            'Full Rest · Hydrotherapy & recovery boots session',
                            'RESTRICTED'
                          )
                        }
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-left font-medium transition-colors"
                      >
                        Full Rest / Hydrotherapy
                      </button>
                    </div>
                  </div>

                  {/* Drill down to full 360 */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => onOpenAthlete360(athlete)}
                      className="text-xs text-sky-400 hover:text-sky-300 font-semibold inline-flex items-center gap-1"
                    >
                      <span>Open Full Athlete 360</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400">
            Signed off decisions automatically update training rosters
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold transition-colors"
          >
            Complete Morning Triage ✓
          </button>
        </div>
      </aside>
    </div>
  );
};
