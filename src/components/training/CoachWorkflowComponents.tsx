import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Dumbbell,
  Filter,
  HeartPulse,
  MapPin,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Athlete, TrainingSession, UserRole } from '../../types/usi';
import { LoadBadge, StatusBadge } from '../ui/Badges';

/* =============================================================================
   SESSION ASSIGNMENT MODAL — Assign athletes to a training session
   ============================================================================= */

interface SessionAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: TrainingSession[];
  athletes: Athlete[];
  selectedRole: UserRole;
  onAssignAthlete: (sessionId: string, athleteId: string, athleteName: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const SessionAssignmentModal: React.FC<SessionAssignmentModalProps> = ({
  isOpen,
  onClose,
  sessions,
  athletes,
  selectedRole,
  onAssignAthlete,
  onTriggerToast,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState(sessions[0]?.id || '');
  const [searchAthlete, setSearchAthlete] = useState('');
  const [assignedAthletes, setAssignedAthletes] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const selectedSession = sessions.find((s) => s.id === selectedSessionId);

  const eligibleAthletes = athletes.filter((ath) => {
    const matchSearch = !searchAthlete || ath.name.toLowerCase().includes(searchAthlete.toLowerCase());
    const isAvailable = ath.trainingStatus !== 'INJURED' && ath.medicalStatus !== 'Restricted';
    return matchSearch && isAvailable;
  });

  const handleToggleAssign = (ath: Athlete) => {
    const newSet = new Set(assignedAthletes);
    if (newSet.has(ath.id)) {
      newSet.delete(ath.id);
      onTriggerToast(`${ath.name} removed from session`);
    } else {
      newSet.add(ath.id);
      onAssignAthlete(selectedSessionId, ath.id, ath.name);
      onTriggerToast(`✓ ${ath.name} assigned to ${selectedSession?.title || 'session'}`);
    }
    setAssignedAthletes(newSet);
  };

  const handleConfirm = () => {
    onTriggerToast(`✓ ${assignedAthletes.size} athletes assigned to ${selectedSession?.title} — Coach notified`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div onClick={onClose} className="fixed inset-0 bg-black/75 backdrop-blur-[1px]" />
      <div className="relative w-full max-w-2xl bg-[#0F1623] border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div>
            <div className="text-xs font-mono text-emerald-400">SESSION ASSIGNMENT WORKFLOW</div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">Assign Athletes to Training Session</h2>
            <p className="text-xs text-slate-400">Role: {selectedRole} — assigned athletes will be notified automatically</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          {/* Session Selector */}
          <div>
            <div className="text-slate-300 font-semibold mb-2">1. Select Training Session</div>
            <div className="space-y-2">
              {sessions.map((sess) => (
                <button
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`w-full p-3.5 rounded-md border text-left transition-colors ${
                    selectedSessionId === sess.id
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-slate-100'
                      : 'bg-[#090D16] border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold">{sess.title}</div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5 flex items-center gap-2">
                        <Clock className="w-3 h-3" />{sess.time} ({sess.durationMin}m)
                        <span className="text-slate-600">·</span>
                        <MapPin className="w-3 h-3 text-emerald-400" />{sess.pitchOrVenue}
                        <span className="text-slate-600">·</span>
                        Coach: {sess.coach}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={sess.status} />
                      {selectedSessionId === sess.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Athlete Assignment */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-300 font-semibold">2. Assign Athletes ({assignedAthletes.size} selected)</div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search…"
                  value={searchAthlete}
                  onChange={(e) => setSearchAthlete(e.target.value)}
                  className="pl-7 pr-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 w-40"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500" />
              </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 text-[10px] text-slate-500 uppercase pb-1.5 border-b border-slate-800 mb-2">
              <div className="col-span-5">Athlete</div>
              <div className="col-span-2">Readiness</div>
              <div className="col-span-2">Load</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-right">Add</div>
            </div>

            <div className="space-y-1.5 max-h-64 overflow-y-auto">
              {eligibleAthletes.map((ath) => {
                const isAssigned = assignedAthletes.has(ath.id);
                const hasLoadWarning = ath.acwr > 1.3;
                return (
                  <div
                    key={ath.id}
                    className={`grid grid-cols-12 items-center p-2.5 rounded-md border transition-colors ${
                      isAssigned
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : hasLoadWarning
                        ? 'bg-amber-950/10 border-amber-800/30'
                        : 'bg-[#090D16] border-slate-800'
                    }`}
                  >
                    <div className="col-span-5">
                      <div className="font-semibold text-slate-100">{ath.name}</div>
                      <div className="text-[10px] font-mono text-slate-500">{ath.position} · {ath.squad}</div>
                    </div>
                    <div className="col-span-2 font-mono font-bold text-amber-300">{ath.readiness}%</div>
                    <div className="col-span-2"><LoadBadge load={ath.trainingLoad} /></div>
                    <div className="col-span-2">
                      {hasLoadWarning && (
                        <span className="text-[10px] font-mono text-amber-400">ACWR {ath.acwr}</span>
                      )}
                    </div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleToggleAssign(ath)}
                        className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                          isAssigned
                            ? 'bg-emerald-500 text-slate-950'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
                        }`}
                      >
                        {isAssigned ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Role-specific guidance */}
          <div className={`p-3 rounded-md border text-[11px] ${
            selectedRole === 'Coach' ? 'bg-emerald-950/20 border-emerald-600/30 text-emerald-300' :
            selectedRole === 'Performance Director' ? 'bg-sky-950/20 border-sky-600/30 text-sky-300' :
            'bg-slate-900/50 border-slate-700 text-slate-400'
          }`}>
            <strong>{selectedRole} Note:</strong>{' '}
            {selectedRole === 'Coach' && 'Athletes with high ACWR (>1.3) are flagged. Load-capped athletes will receive modified drill prescriptions automatically.'}
            {selectedRole === 'Performance Director' && 'As Performance Director, you are overriding standard squad selection. Your decision will be logged in the audit trail.'}
            {selectedRole !== 'Coach' && selectedRole !== 'Performance Director' && 'Session assignment will notify the assigned coach and update athlete training schedules.'}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#090D16] flex items-center justify-between">
          <div className="text-xs text-slate-400">
            {assignedAthletes.size > 0
              ? `${assignedAthletes.size} athlete${assignedAthletes.size !== 1 ? 's' : ''} will be notified`
              : 'No athletes selected'}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium">Cancel</button>
            <button
              onClick={handleConfirm}
              disabled={assignedAthletes.size === 0}
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Confirm Assignment ({assignedAthletes.size})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* =============================================================================
   COACH WORKFLOW PANEL — Coach-specific view of squad + session management
   ============================================================================= */

interface CoachWorkflowPanelProps {
  athletes: Athlete[];
  sessions: TrainingSession[];
  selectedRole: UserRole;
  onOpenSessionAssignment: () => void;
  onOpenAthlete360: (athlete: Athlete) => void;
  onOpenTrainingModModal: () => void;
  onTriggerToast: (msg: string) => void;
}

export const CoachWorkflowPanel: React.FC<CoachWorkflowPanelProps> = ({
  athletes,
  sessions,
  selectedRole,
  onOpenSessionAssignment,
  onOpenAthlete360,
  onOpenTrainingModModal,
  onTriggerToast,
}) => {
  const [activeCoachTab, setActiveCoachTab] = useState<'roster' | 'lineup' | 'load'>('roster');
  const [startingXI, setStartingXI] = useState<Set<string>>(new Set(
    athletes.filter((a) => a.trainingStatus === 'ACTIVE' && a.readiness >= 80).slice(0, 11).map((a) => a.id)
  ));
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<string | null>(sessions[0]?.id || null);

  const availableAthletes = athletes.filter((a) => a.trainingStatus !== 'INJURED' && a.medicalStatus !== 'Restricted');
  const injuredAthletes = athletes.filter((a) => a.trainingStatus === 'INJURED' || a.medicalStatus === 'Restricted');
  const highLoadAthletes = athletes.filter((a) => a.acwr > 1.3);

  const toggleStartingXI = (athleteId: string) => {
    const newSet = new Set(startingXI);
    if (newSet.has(athleteId)) {
      newSet.delete(athleteId);
      const ath = athletes.find((a) => a.id === athleteId);
      onTriggerToast(`${ath?.name} removed from Starting XI`);
    } else {
      if (newSet.size >= 11) {
        onTriggerToast('Starting XI is full (11 players). Remove a player first.');
        return;
      }
      newSet.add(athleteId);
      const ath = athletes.find((a) => a.id === athleteId);
      onTriggerToast(`✓ ${ath?.name} added to Starting XI (${newSet.size}/11)`);
    }
    setStartingXI(newSet);
  };

  const handleFinalizeLineup = () => {
    onTriggerToast(`✓ Starting XI confirmed (${startingXI.size} players) — Submitted to Performance Director & Sports Science for review`);
  };

  const selectedSession = sessions.find((s) => s.id === selectedSessionForDetail);

  return (
    <div className="bg-[#0F1623] border border-slate-800 rounded-lg overflow-hidden">
      {/* Coach Workflow Header */}
      <div className="p-5 border-b border-slate-800 bg-[#090D16]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-emerald-400">COACH TACTICAL WORKFLOW</div>
            <h2 className="text-base font-bold text-slate-100 mt-0.5">Squad Management & Session Planning</h2>
          </div>
          <div className="flex items-center gap-2">
            {highLoadAthletes.length > 0 && (
              <button
                onClick={onOpenTrainingModModal}
                className="px-3 py-1.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-semibold hover:bg-amber-500/25"
              >
                ⚡ {highLoadAthletes.length} Load Alerts
              </button>
            )}
            <button
              onClick={onOpenSessionAssignment}
              className="px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
            >
              + Assign Athletes to Session
            </button>
          </div>
        </div>

        {/* Quick Stat Row */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Available', value: availableAthletes.length, color: 'text-emerald-400' },
            { label: 'Injured/Out', value: injuredAthletes.length, color: 'text-rose-400' },
            { label: 'Load Warning', value: highLoadAthletes.length, color: 'text-amber-400' },
            { label: 'Starting XI', value: `${startingXI.size}/11`, color: 'text-sky-400' },
          ].map((s, i) => (
            <div key={i} className="p-2.5 rounded-md bg-[#090D16] border border-slate-800 text-xs">
              <div className="text-slate-400">{s.label}</div>
              <div className={`text-xl font-mono font-bold mt-0.5 ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 mt-4 border-b border-slate-800/70">
          {([
            { id: 'roster', label: 'Squad Roster' },
            { id: 'lineup', label: `Starting XI Builder (${startingXI.size}/11)` },
            { id: 'load', label: 'Load & Periodisation' },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCoachTab(tab.id)}
              className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors -mb-px ${
                activeCoachTab === tab.id
                  ? 'border-emerald-500 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5">
        {/* ROSTER TAB */}
        {activeCoachTab === 'roster' && (
          <div className="space-y-3">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="py-2 pr-3">Athlete</th>
                    <th className="py-2 px-2">Position</th>
                    <th className="py-2 px-2">Readiness</th>
                    <th className="py-2 px-2">ACWR</th>
                    <th className="py-2 px-2">Training Load</th>
                    <th className="py-2 px-2">Medical Status</th>
                    <th className="py-2 px-2">Starting XI</th>
                    <th className="py-2 pl-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {athletes.map((ath) => {
                    const isInXI = startingXI.has(ath.id);
                    const isInjured = ath.trainingStatus === 'INJURED';
                    const hasLoadWarn = ath.acwr > 1.3;
                    return (
                      <tr key={ath.id} className={`transition-colors ${isInjured ? 'opacity-60' : 'hover:bg-[#151E2E]'}`}>
                        <td className="py-2.5 pr-3">
                          <div className="font-semibold text-slate-100">{ath.name}</div>
                          <div className="text-[10px] font-mono text-slate-500">{ath.athleteId}</div>
                        </td>
                        <td className="py-2.5 px-2 text-slate-300">{ath.position}</td>
                        <td className={`py-2.5 px-2 font-mono font-bold tabular-nums ${ath.readiness >= 80 ? 'text-emerald-400' : ath.readiness >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {ath.readiness}%
                        </td>
                        <td className={`py-2.5 px-2 font-mono tabular-nums ${hasLoadWarn ? 'text-amber-400 font-bold' : 'text-slate-300'}`}>
                          {ath.acwr}
                        </td>
                        <td className="py-2.5 px-2"><LoadBadge load={ath.trainingLoad} /></td>
                        <td className="py-2.5 px-2">
                          <span className={`font-mono text-[10px] font-bold ${
                            ath.medicalStatus === 'Cleared' ? 'text-emerald-400' :
                            ath.medicalStatus === 'Restricted' ? 'text-rose-400' : 'text-amber-400'
                          }`}>{ath.medicalStatus}</span>
                        </td>
                        <td className="py-2.5 px-2">
                          <button
                            onClick={() => !isInjured && toggleStartingXI(ath.id)}
                            disabled={isInjured}
                            className={`w-5 h-5 rounded border transition-colors ${
                              isInXI ? 'bg-emerald-500 border-emerald-400' :
                              isInjured ? 'bg-slate-800 border-slate-700 opacity-40 cursor-not-allowed' :
                              'border-slate-600 hover:border-slate-400'
                            }`}
                          >
                            {isInXI && <Check className="w-3 h-3 text-slate-950 mx-auto" />}
                          </button>
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          <button
                            onClick={() => onOpenAthlete360(ath)}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200"
                          >
                            360 Profile →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STARTING XI TAB */}
        {activeCoachTab === 'lineup' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Pitch Visual */}
              <div className="bg-[#090D16] border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="text-xs font-bold text-slate-200 uppercase">Starting XI ({startingXI.size}/11)</div>
                {/* Simulated pitch layout */}
                <div className="bg-emerald-950/20 border border-emerald-800/20 rounded-lg p-3 space-y-2">
                  {['Goalkeeper', 'Defenders', 'Midfielders', 'Forwards'].map((line) => {
                    const lineAthletes = athletes
                      .filter((a) => startingXI.has(a.id))
                      .filter((a) => {
                        if (line === 'Goalkeeper') return a.position === 'Goalkeeper';
                        if (line === 'Defenders') return a.position === 'Defender';
                        if (line === 'Midfielders') return a.position === 'Midfielder';
                        return a.position === 'Forward';
                      });
                    if (lineAthletes.length === 0) return null;
                    return (
                      <div key={line} className="space-y-1">
                        <div className="text-[10px] font-mono text-emerald-400/50 text-center uppercase">{line}</div>
                        <div className="flex justify-center gap-2 flex-wrap">
                          {lineAthletes.map((ath) => (
                            <div key={ath.id} className="text-center">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-[10px] font-bold text-emerald-300 mx-auto">
                                {ath.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                              </div>
                              <div className="text-[9px] text-slate-400 mt-0.5 max-w-[50px] leading-tight truncate">{ath.name.split(' ')[0]}</div>
                              <div className={`text-[9px] font-mono ${ath.readiness >= 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{ath.readiness}%</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                  {startingXI.size === 0 && (
                    <div className="text-center text-slate-500 text-xs py-6">Select players from the roster tab</div>
                  )}
                </div>

                <button
                  onClick={handleFinalizeLineup}
                  disabled={startingXI.size < 11}
                  className="w-full py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs"
                >
                  {startingXI.size < 11 ? `Select ${11 - startingXI.size} more player${11 - startingXI.size !== 1 ? 's' : ''}` : '✓ Confirm Starting XI Lineup'}
                </button>
              </div>

              {/* Selection List */}
              <div className="bg-[#090D16] border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-3 border-b border-slate-800 text-xs font-bold text-slate-200">Available Athletes</div>
                <div className="overflow-y-auto" style={{ maxHeight: '340px' }}>
                  {availableAthletes.map((ath) => {
                    const isInXI = startingXI.has(ath.id);
                    return (
                      <button
                        key={ath.id}
                        onClick={() => toggleStartingXI(ath.id)}
                        className={`w-full px-3.5 py-2.5 flex items-center justify-between text-left border-b border-slate-800/60 transition-colors ${
                          isInXI ? 'bg-emerald-950/20' : 'hover:bg-[#151E2E]'
                        }`}
                      >
                        <div>
                          <span className="text-xs font-semibold text-slate-100">{ath.name}</span>
                          <div className="text-[10px] text-slate-500">{ath.position} · Readiness {ath.readiness}%</div>
                        </div>
                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${isInXI ? 'bg-emerald-500 border-emerald-400' : 'border-slate-600'}`}>
                          {isInXI && <Check className="w-3 h-3 text-slate-950" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* LOAD & PERIODISATION TAB */}
        {activeCoachTab === 'load' && (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400">
                    <th className="py-2 pr-3">Athlete</th>
                    <th className="py-2 px-2">ACWR</th>
                    <th className="py-2 px-2">Acute Load (7d)</th>
                    <th className="py-2 px-2">Chronic Load (28d)</th>
                    <th className="py-2 px-2">HRV (rMSSD)</th>
                    <th className="py-2 px-2">Readiness</th>
                    <th className="py-2 px-2">Risk Zone</th>
                    <th className="py-2 pl-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {athletes.map((ath) => {
                    const isHighRisk = ath.acwr > 1.5;
                    const isMediumRisk = ath.acwr > 1.3 && ath.acwr <= 1.5;
                    const isSafe = ath.acwr <= 1.3;
                    return (
                      <tr key={ath.id} className="hover:bg-[#151E2E] transition-colors">
                        <td className="py-2.5 pr-3 font-semibold text-slate-100">{ath.name}</td>
                        <td className={`py-2.5 px-2 font-mono font-bold ${isHighRisk ? 'text-rose-400' : isMediumRisk ? 'text-amber-400' : 'text-emerald-400'}`}>
                          {ath.acwr}
                        </td>
                        <td className="py-2.5 px-2 font-mono text-slate-300">{ath.acuteLoadAu} AU</td>
                        <td className="py-2.5 px-2 font-mono text-slate-300">{ath.chronicLoadAu} AU</td>
                        <td className="py-2.5 px-2 font-mono text-slate-300">{ath.hrvMs} ms</td>
                        <td className={`py-2.5 px-2 font-mono font-bold ${ath.readiness >= 80 ? 'text-emerald-400' : ath.readiness >= 65 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {ath.readiness}%
                        </td>
                        <td className="py-2.5 px-2">
                          <span className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border ${
                            isHighRisk ? 'bg-rose-500/15 text-rose-300 border-rose-500/30' :
                            isMediumRisk ? 'bg-amber-500/15 text-amber-300 border-amber-500/30' :
                            'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          }`}>
                            {isHighRisk ? 'HIGH RISK' : isMediumRisk ? 'MODERATE' : 'SAFE ZONE'}
                          </span>
                        </td>
                        <td className="py-2.5 pl-2 text-right">
                          {(isHighRisk || isMediumRisk) && (
                            <button
                              onClick={() => onTriggerToast(`Load modification applied for ${ath.name}`)}
                              className="px-2.5 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-semibold"
                            >
                              Modify Load
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* ACWR Legend */}
            <div className="flex items-center gap-4 text-[11px] p-3 rounded-md bg-[#090D16] border border-slate-800">
              <span className="text-slate-400 font-semibold">ACWR Zones:</span>
              <span className="text-emerald-400">0.8 – 1.3 = Safe Zone</span>
              <span className="text-amber-400">1.3 – 1.5 = Moderate Risk</span>
              <span className="text-rose-400">&gt;1.5 = High Injury Risk</span>
              <span className="text-slate-500">&lt;0.8 = Under-trained</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
