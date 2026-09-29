import React, { useState } from 'react';
import {
  ArrowRight,
  Clock,
  Dumbbell,
  HeartPulse,
  UserCheck,
} from 'lucide-react';
import { ACTIVE_INJURIES, TRAINING_SESSIONS } from '../../data/mockData';
import { Injury, TrainingSession } from '../../types/usi';
import { LoadBadge, StatusBadge } from '../ui/Badges';

interface TrainingAndInjurySectionProps {
  sessions?: TrainingSession[];
  injuries?: Injury[];
  onSelectSession: (session: TrainingSession) => void;
  onSelectInjuryAthlete: (athleteId: string) => void;
  onViewInjuryIntelligence: () => void;
}

export const TrainingAndInjurySection: React.FC<TrainingAndInjurySectionProps> = ({
  onSelectSession,
  onSelectInjuryAthlete,
  onViewInjuryIntelligence,
}) => {
  const [sessionFilter, setSessionFilter] = useState<'All' | 'Completed' | 'Upcoming'>('All');

  const filteredSessions = TRAINING_SESSIONS.filter((s) =>
    sessionFilter === 'All' ? true : s.status === sessionFilter
  );

  const injuryDistribution = [
    { part: 'Hamstring', count: 2, pct: 50, color: 'bg-rose-500' },
    { part: 'Ankle', count: 1, pct: 25, color: 'bg-amber-500' },
    { part: 'Shoulder', count: 1, pct: 25, color: 'bg-sky-500' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left 7 Cols: TODAY'S TRAINING OPERATIONS */}
      <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold tracking-wide text-slate-100">
                  TODAY'S TRAINING OPERATIONS
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1 font-mono tabular-nums">
                <span className="text-slate-200 font-semibold">8 Sessions Scheduled</span>
                <span>·</span>
                <span className="text-emerald-400">6 Completed</span>
                <span>·</span>
                <span className="text-sky-400">2 Upcoming</span>
                <span>·</span>
                <span>Attendance: <strong className="text-slate-200">94%</strong></span>
                <span>·</span>
                <span>Training Load: <strong className="text-emerald-400">Normal</strong></span>
              </div>
            </div>

            {/* Interactive Filter Control */}
            <div className="flex items-center gap-1 p-1 bg-[#090D16] border border-slate-800 rounded-md">
              {(['All', 'Completed', 'Upcoming'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSessionFilter(tab)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                    sessionFilter === tab
                      ? 'bg-slate-800 text-slate-100'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Sessions Compact Operational Table */}
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] font-semibold text-slate-400">
                  <th className="py-2 pr-3">Session</th>
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">Coach</th>
                  <th className="py-2 px-2 hidden sm:table-cell">Squad</th>
                  <th className="py-2 px-2 text-right">Attendance</th>
                  <th className="py-2 px-2">Intensity</th>
                  <th className="py-2 pl-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => onSelectSession(session)}
                    className="group hover:bg-[#151E2E] cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 pr-3">
                      <div className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                        {session.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                        {session.pitchOrVenue}
                      </div>
                    </td>
                    <td className="py-2.5 px-2 font-mono text-[11px] text-slate-300 whitespace-nowrap tabular-nums">
                      {session.time}
                    </td>
                    <td className="py-2.5 px-2 text-slate-300 whitespace-nowrap">
                      {session.coach}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400 hidden sm:table-cell truncate max-w-[140px]">
                      {session.squad}
                    </td>
                    <td className="py-2.5 px-2 text-right font-mono tabular-nums">
                      <span className="text-slate-200 font-semibold">
                        {session.attendance}%
                      </span>
                      <span className="text-[11px] text-slate-500 ml-1">
                        ({session.attendedCount}/{session.scheduledCount})
                      </span>
                    </td>
                    <td className="py-2.5 px-2">
                      <LoadBadge load={session.intensity} />
                    </td>
                    <td className="py-2.5 pl-2 text-right">
                      <StatusBadge status={session.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-sky-400" />
            <span>Next Session: <strong className="text-slate-200">Recovery Session (18:00)</strong> · Hydrotherapy Suite</span>
          </div>
          <span className="text-[11px] text-sky-400 font-medium">
            Click any session to inspect drills & GPS load
          </span>
        </div>
      </div>

      {/* Right 5 Cols: INJURY INTELLIGENCE */}
      <div className="lg:col-span-5 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold tracking-wide text-slate-100">
                  INJURY INTELLIGENCE
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Active medical caseload, RTP progression & clinical escalations
              </p>
            </div>

            <button
              onClick={onViewInjuryIntelligence}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-medium text-sky-300 hover:text-sky-200 transition-colors whitespace-nowrap"
            >
              <span>View Injury Intelligence</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Summary Metrics */}
          <div className="grid grid-cols-4 gap-2 mt-3.5">
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800/80">
              <div className="text-[11px] text-slate-400">Active Injuries</div>
              <div className="text-xl font-mono font-bold text-slate-100 mt-0.5 tabular-nums">
                4
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800/80">
              <div className="text-[11px] text-slate-400">In Rehab</div>
              <div className="text-xl font-mono font-bold text-amber-400 mt-0.5 tabular-nums">
                2
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800/80">
              <div className="text-[11px] text-slate-400">Return-to-Play</div>
              <div className="text-xl font-mono font-bold text-emerald-400 mt-0.5 tabular-nums">
                1
              </div>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800/80">
              <div className="text-[11px] text-slate-400">Escalated</div>
              <div className="text-xl font-mono font-bold text-rose-400 mt-0.5 tabular-nums">
                1
              </div>
            </div>
          </div>

          {/* Injury Distribution Visualization */}
          <div className="mt-4 p-3 rounded-md bg-[#0B101B] border border-slate-800/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-300">
                Anatomical Site Distribution
              </span>
              <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                4 Active Cases
              </span>
            </div>

            <div className="space-y-2">
              {injuryDistribution.map((item) => (
                <div key={item.part} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-medium">
                      {item.part} — <strong className="font-mono tabular-nums">{item.count}</strong>
                    </span>
                    <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                      {item.pct}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Injury Cases List */}
          <div className="mt-3.5 space-y-1.5">
            {ACTIVE_INJURIES.map((inj: Injury) => (
              <button
                key={inj.id}
                onClick={() => onSelectInjuryAthlete(inj.athleteId)}
                className="w-full text-left p-2.5 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800/80 transition-colors flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-100">
                      {inj.athleteName}
                    </span>
                    <span className="text-[11px] text-slate-500">·</span>
                    <span className="text-xs text-slate-300 font-medium">
                      {inj.bodyPart} ({inj.side})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {inj.diagnosis}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <StatusBadge status={inj.stage} />
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5 tabular-nums">
                    Est. RTP: {inj.daysToRtp}d
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Rehab Protocol Compliance: <strong className="font-mono text-slate-200">95.8%</strong></span>
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Lead: Dr. S. Patel
          </span>
        </div>
      </div>
    </div>
  );
};
