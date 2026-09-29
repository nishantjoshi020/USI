import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  MapPin,
  Users,
  X,
  AlertTriangle,
} from 'lucide-react';
import { TrainingSession } from '../../types/usi';
import { LoadBadge, StatusBadge } from '../ui/Badges';

interface SessionDetailDrawerProps {
  session: TrainingSession | null;
  onClose: () => void;
  onSelectAthleteById: (athleteId: string) => void;
  onCompleteSessionAction: (sessionId: string, toastMessage: string) => void;
}

export const SessionDetailDrawer: React.FC<SessionDetailDrawerProps> = ({
  session,
  onClose,
  onSelectAthleteById,
  onCompleteSessionAction,
}) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-[1px] transition-opacity"
      />

      <aside className="relative w-full max-w-xl bg-[#0F1623] border-l border-slate-800 h-full flex flex-col justify-between z-10 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono text-sky-400 font-semibold">
                {session.category.toUpperCase()}
              </span>
              <span className="text-slate-600">·</span>
              <StatusBadge status={session.status} />
            </div>
            <h2 className="text-base font-bold text-slate-100 mt-1">
              {session.title}
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {session.time} ({session.durationMin}m)
              </span>
              <span>·</span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                {session.pitchOrVenue}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* 4 Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Attendance</div>
              <div className="mt-1 font-mono text-base font-bold text-slate-100 tabular-nums">
                {session.attendance}%
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                {session.attendedCount}/{session.scheduledCount} athletes
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Intensity</div>
              <div className="mt-1.5">
                <LoadBadge load={session.intensity} />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Prescribed tier
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Session Load (AU)</div>
              <div className="mt-1 font-mono text-sm font-bold text-sky-400 tabular-nums">
                {session.actualLoadAu ? `${session.actualLoadAu} AU` : `${session.plannedLoadAu} AU`}
              </div>
              <div className="text-[10px] font-mono text-slate-400">
                Planned: {session.plannedLoadAu} AU
              </div>
            </div>

            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800">
              <div className="text-[11px] text-slate-400">Lead Coach</div>
              <div className="mt-1 text-xs font-semibold text-slate-100 truncate">
                {session.coach}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {session.coachRole}
              </div>
            </div>
          </div>

          {/* Session Objectives */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
            <div className="text-xs font-bold tracking-wide text-slate-200 mb-2">
              PHYSIOLOGICAL & TACTICAL OBJECTIVES
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {session.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="font-mono text-sky-400">0{idx + 1}.</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Periodised Drill Blocks */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
            <div className="flex items-center justify-between text-xs mb-3">
              <span className="font-bold tracking-wide text-slate-200">
                SESSION DRILL BLOCKS & INTENSITY ZONES
              </span>
              <span className="font-mono text-slate-400">
                HSR Target: {session.targetHighSpeedM}m
              </span>
            </div>
            <div className="space-y-2">
              {session.drills.map((drill, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded bg-[#0F1623] border border-slate-800/90 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="font-semibold text-slate-200">{drill.name}</div>
                    <div className="text-[11px] text-slate-400">{drill.targetZone}</div>
                  </div>
                  <span className="font-mono text-xs text-sky-300 tabular-nums">
                    {drill.duration}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Load Modifications */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
            <div className="text-xs font-bold tracking-wide text-slate-200 mb-2.5">
              INDIVIDUAL LOAD MODIFICATIONS & EXEMPTIONS
            </div>
            {session.modifiedAthletes.length === 0 ? (
              <p className="text-xs text-slate-400">
                All participating squad members cleared for standard session prescription.
              </p>
            ) : (
              <div className="space-y-2">
                {session.modifiedAthletes.map((mod) => (
                  <button
                    key={mod.athleteId}
                    onClick={() => onSelectAthleteById(mod.athleteId)}
                    className="w-full text-left p-2.5 rounded bg-[#0F1623] hover:bg-[#151E2E] border border-amber-500/30 flex items-center justify-between gap-2 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>{mod.athleteName}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-0.5">
                        {mod.modification}
                      </div>
                    </div>
                    <span className="text-[11px] text-sky-400 shrink-0 font-medium">
                      Inspect Athlete →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sports Science & Coaching Notes */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-slate-800">
            <div className="text-xs font-bold tracking-wide text-slate-200 mb-1">
              POST-SESSION TELEMETRY NOTE
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{session.notes}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between gap-2.5">
          <button
            onClick={() =>
              onCompleteSessionAction(
                session.id,
                `Synced GPS & sRPE telemetry for "${session.title}"`
              )
            }
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>
              {session.status === 'Completed'
                ? 'Verify Session Load & RPE'
                : 'Mark Session Completed'}
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
};
