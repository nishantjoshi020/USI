import React, { useState } from 'react';
import {
  AlertTriangle,
  Bell,
  Check,
  CheckCircle2,
  Cpu,
  Dumbbell,
  HeartPulse,
  Search,
  Shield,
  Users,
  X,
  ClipboardCheck,
} from 'lucide-react';
import {
  AppNotification,
  AssessmentRecord,
  Athlete,
  Injury,
  NavItemId,
  TrainingSession,
  UserRole,
} from '../../types/usi';
import { RiskBadge, StatusBadge } from '../ui/Badges';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  athletes: Athlete[];
  sessions: TrainingSession[];
  injuries: Injury[];
  assessments: AssessmentRecord[];
  onSelectAthlete: (athlete: Athlete) => void;
  onSelectSession: (session: TrainingSession) => void;
  onSelectNav: (nav: NavItemId) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  athletes,
  sessions,
  injuries,
  assessments,
  onSelectAthlete,
  onSelectSession,
  onSelectNav,
}) => {
  const [query, setQuery] = useState('Arjun Mehta');

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedAthletes = athletes.filter(
    (a) =>
      q === '' ||
      a.name.toLowerCase().includes(q) ||
      a.position.toLowerCase().includes(q) ||
      a.squad.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q)
  );

  const matchedSessions = sessions.filter(
    (s) =>
      q === '' ||
      s.title.toLowerCase().includes(q) ||
      s.coach.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
  );

  const matchedInjuries = injuries.filter(
    (inj) =>
      q === '' ||
      inj.athleteName.toLowerCase().includes(q) ||
      inj.bodyPart.toLowerCase().includes(q) ||
      inj.diagnosis.toLowerCase().includes(q)
  );

  const matchedAssessments = assessments.filter(
    (as) =>
      q === '' ||
      as.title.toLowerCase().includes(q) ||
      as.category.toLowerCase().includes(q)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-2xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-800 bg-[#090D16] flex items-center gap-3">
          <Search className="w-4 h-4 text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search athletes (e.g. Arjun Mehta), squads, sessions, injuries, assessments..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-200 px-1.5"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Presets */}
        <div className="px-4 py-2 bg-[#0B101B] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-slate-500 text-[11px]">Quick Queries:</span>
          {['Arjun Mehta', 'Rahul Singh', 'Kabir Rao', 'Hamstring', 'Tactical', 'CMJ'].map(
            (preset) => (
              <button
                key={preset}
                onClick={() => setQuery(preset)}
                className={`px-2 py-0.5 rounded border text-[11px] transition-colors whitespace-nowrap ${
                  query === preset
                    ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                    : 'bg-[#0F1623] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {preset}
              </button>
            )
          )}
        </div>

        {/* Results Container */}
        <div className="max-h-[420px] overflow-y-auto p-4 space-y-4">
          {/* Athletes */}
          {matchedAthletes.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span>ATHLETES ({matchedAthletes.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedAthletes.map((ath) => (
                  <button
                    key={ath.id}
                    onClick={() => {
                      onSelectAthlete(ath);
                      onClose();
                    }}
                    className="w-full text-left p-3 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 transition-colors flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-100">
                        {ath.name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {ath.sport} · Senior Squad · {ath.position} (#{ath.jerseyNumber})
                      </div>
                    </div>
                    <div className="text-right font-mono text-xs flex items-center gap-4">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Readiness</span>
                        <span
                          className={`font-bold ${
                            ath.readiness >= 80
                              ? 'text-emerald-400'
                              : ath.readiness >= 65
                                ? 'text-amber-400'
                                : 'text-rose-400'
                          }`}
                        >
                          {ath.readiness}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">Injury Risk</span>
                        <RiskBadge risk={ath.injuryRisk} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Training Sessions */}
          {matchedSessions.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                <span>TRAINING SESSIONS ({matchedSessions.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedSessions.slice(0, 3).map((sess) => (
                  <button
                    key={sess.id}
                    onClick={() => {
                      onSelectSession(sess);
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {sess.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {sess.time} · Coach {sess.coach} · {sess.squad}
                      </div>
                    </div>
                    <StatusBadge status={sess.status} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Injuries */}
          {matchedInjuries.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                <span>INJURY INTELLIGENCE CASES ({matchedInjuries.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedInjuries.map((inj) => {
                  const ath = athletes.find((a) => a.id === inj.athleteId);
                  return (
                    <button
                      key={inj.id}
                      onClick={() => {
                        if (ath) onSelectAthlete(ath);
                        onClose();
                      }}
                      className="w-full text-left p-2.5 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-semibold text-slate-200">
                          {inj.athleteName} — {inj.bodyPart} ({inj.side})
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {inj.diagnosis}
                        </div>
                      </div>
                      <StatusBadge status={inj.stage} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assessments */}
          {matchedAssessments.length > 0 && (
            <div>
              <div className="text-[11px] font-bold tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>ASSESSMENTS & PROTOCOLS ({matchedAssessments.length})</span>
              </div>
              <div className="space-y-1.5">
                {matchedAssessments.map((as) => (
                  <button
                    key={as.id}
                    onClick={() => {
                      onSelectNav('assessments-tid');
                      onClose();
                    }}
                    className="w-full text-left p-2.5 rounded-md bg-[#0B101B] hover:bg-[#151E2E] border border-slate-800 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-slate-200">
                        {as.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {as.category} · Lead: {as.leadScientist}
                      </div>
                    </div>
                    <span className="font-mono text-xs text-sky-400">
                      {as.completedCount}/{as.totalCount} Completed
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRole: UserRole;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: (role?: UserRole) => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
  selectedRole,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  const isNotificationForRole = (notif: AppNotification, role: UserRole) => {
    if (!notif.roles || notif.roles.length === 0) {
      return role !== 'Athlete';
    }
    return notif.roles.includes(role);
  };

  const displayedNotifications = notifications.filter((n) =>
    isNotificationForRole(n, selectedRole)
  );

  const unreadCount = displayedNotifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-[1px]"
      />

      <aside className="relative w-full max-w-md bg-[#0F1623] border-l border-slate-800 h-full flex flex-col justify-between z-10 shadow-2xl">
        <div className="p-4 border-b border-slate-800 bg-[#090D16]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold text-slate-100 uppercase">
                {selectedRole === 'Athlete'
                  ? 'MY PERSONAL NOTIFICATIONS'
                  : `${selectedRole} NOTIFICATIONS`}
              </h2>
              <span className="font-mono text-xs text-sky-400">
                ({unreadCount} unread)
              </span>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => onMarkAllRead(selectedRole)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1 rounded text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {displayedNotifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3.5 rounded-md border cursor-pointer transition-colors ${
                notif.read
                  ? 'bg-[#0B101B] border-slate-800/80 opacity-75 hover:opacity-100'
                  : 'bg-[#131C2E] border-sky-500/40 hover:bg-[#172238]'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <span
                    className={
                      notif.severity === 'high'
                        ? 'text-rose-400 font-semibold'
                        : notif.severity === 'medium'
                          ? 'text-amber-400 font-semibold'
                          : 'text-sky-400 font-semibold'
                    }
                  >
                    {notif.category}
                  </span>
                  <span>·</span>
                  <span>
                    {notif.roles && notif.roles.length > 0
                      ? notif.roles.join(', ')
                      : selectedRole}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0">
                  {notif.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                )}
                <span
                  className={`text-xs font-bold ${
                    notif.severity === 'high'
                      ? 'text-amber-300'
                      : 'text-sky-300'
                  }`}
                >
                  {notif.title}
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-200 leading-relaxed">
                {notif.description}
              </p>

              <div className="mt-2.5 flex items-center justify-between text-[11px]">
                <span className="text-sky-400 font-medium">
                  {notif.actionLabel || 'Click to open operational view'} →
                </span>
                {!notif.read && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(notif.id);
                    }}
                    className="text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    <span>Mark read</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
};

interface RiskFactorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  athletes: Athlete[];
  onSelectAthlete: (athlete: Athlete) => void;
}

export const RiskFactorsModal: React.FC<RiskFactorsModalProps> = ({
  isOpen,
  onClose,
  athletes,
  onSelectAthlete,
}) => {
  if (!isOpen) return null;

  const flaggedAthletes = athletes.filter((a) => a.injuryRisk === 'High');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
      />

      <div className="relative w-full max-w-3xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10">
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                AI INJURY-RISK TELEMETRY BREAKDOWN (3 ELEVATED COHORT PROFILES)
              </h2>
              <p className="text-xs text-slate-400">
                Multi-variable weighting: Acute:Chronic Workload Ratio (35%) · Autonomic HRV (25%) · Sleep/Wellness (20%) · Prior Pathology (20%)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400">
                <th className="py-2 pr-3">Athlete</th>
                <th className="py-2 px-2">Readiness</th>
                <th className="py-2 px-2">ACWR (Load)</th>
                <th className="py-2 px-2">HRV rMSSD</th>
                <th className="py-2 px-2">Sleep (3d)</th>
                <th className="py-2 px-2">Prior Pathology</th>
                <th className="py-2 pl-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {flaggedAthletes.map((ath) => (
                <tr key={ath.id} className="hover:bg-[#151E2E]">
                  <td className="py-3 pr-3 font-semibold text-slate-100">
                    {ath.name}
                    <span className="block text-[11px] font-normal text-slate-400">
                      {ath.position} · #{ath.jerseyNumber}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-mono font-bold text-rose-400 tabular-nums">
                    {ath.readiness}% ({ath.readinessDelta}%)
                  </td>
                  <td className="py-3 px-2 font-mono text-amber-300 tabular-nums">
                    {ath.acwr.toFixed(2)} ({ath.acuteLoadAu} AU)
                  </td>
                  <td className="py-3 px-2 font-mono text-rose-300 tabular-nums">
                    {ath.hrvMs} ms (Base {ath.hrvBaselineMs})
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-300 tabular-nums">
                    {ath.sleepHours}h / night
                  </td>
                  <td className="py-3 px-2 text-slate-300 max-w-[200px]">
                    {ath.previousInjuryHistory}
                  </td>
                  <td className="py-3 pl-2 text-right">
                    <button
                      onClick={() => {
                        onSelectAthlete(ath);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-sky-500/20 border border-sky-500/40 text-sky-300 font-medium hover:bg-sky-500/30 whitespace-nowrap"
                    >
                      Open Drawer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const SystemGuideModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
      />
      <div className="relative w-full max-w-2xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10">
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                UNIFIED SPORTS INTERFACE (USI) — OPERATIONAL ARCHITECTURE
              </h2>
              <p className="text-xs text-slate-400">
                Enterprise AI-Native Athlete Management System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
            <div className="font-bold text-slate-100 mb-1">
              Core Hierarchy & Context Propagation
            </div>
            <p className="font-mono text-sky-400 text-[11px]">
              Federation → Sport → Program → Squad → Athlete → Training / Medical / Science / Nutrition / Assessments / Analytics / AI Intelligence
            </p>
          </div>

          <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
            <div className="font-bold text-slate-100 mb-1">
              Operating Principle: Data → Intelligence → Decision → Operational Action
            </div>
            <p className="text-slate-400">
              Every physiological signal, GPS workload metric, and clinical gate in USI is connected directly to an actionable workflow decision—allowing Performance Directors, Coaches, Sports Scientists, and Clinicians to review and apply recommendations in real time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
