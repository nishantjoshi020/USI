import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Bot,
  Calendar,
  ChevronDown,
  HelpCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  Building2,
  Trophy,
  Layers,
  Users,
  User,
} from 'lucide-react';
import { Athlete, HierarchyContext, UserRole } from '../../types/usi';
import { CONTEXT_OPTIONS, ROLE_DESCRIPTIONS } from '../../data/mockData';

interface TopContextBarProps {
  context: HierarchyContext;
  onUpdateContext: (partial: Partial<HierarchyContext>) => void;
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  unreadNotificationsCount: number;
  onOpenSearch: () => void;
  onToggleNotifications: () => void;
  onOpenHelpModal: () => void;
  onOpenAICopilot?: () => void;
  pendingAIActionsCount?: number;
  onResetDemoState?: () => void;
  activeAthlete?: Athlete;
  athletes?: Athlete[];
  onSelectActiveAthlete?: (athleteId: string) => void;
  onOpenOnboarding?: () => void;
}

const ROLES: UserRole[] = [
  'Performance Director',
  'Coach',
  'Sports Scientist',
  'Physiotherapist',
  'Nutritionist',
  'Federation Admin',
  'Athlete',
  'Operations Team',
];

export const TopContextBar: React.FC<TopContextBarProps> = ({
  context,
  onUpdateContext,
  selectedRole,
  onSelectRole,
  unreadNotificationsCount,
  onOpenSearch,
  onToggleNotifications,
  onOpenHelpModal,
  onOpenAICopilot,
  pendingAIActionsCount = 0,
  onResetDemoState,
  activeAthlete,
  athletes,
  onSelectActiveAthlete,
  onOpenOnboarding,
}) => {
  const [openDropdown, setOpenDropdown] = useState<
    'federation' | 'sport' | 'program' | 'squad' | 'date' | 'role' | null
  >(null);

  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (barRef.current && !barRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      ref={barRef}
      className="h-14 bg-[#090D16]/95 backdrop-blur-sm border-b border-slate-800/90 px-4 flex items-center justify-between gap-2 sticky top-0 z-20"
    >
      {/* Left: Global Hierarchy Context Filters (Federation -> Sport -> Program -> Squad) */}
      <div className="flex items-center gap-1 min-w-0 flex-1">
        {/* Federation */}
        <div className="relative min-w-0">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === 'federation' ? null : 'federation')
            }
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-left transition-colors whitespace-nowrap"
          >
            <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-100 truncate max-w-[170px] xl:max-w-[230px]">
              {context.federation}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {openDropdown === 'federation' && (
            <div className="absolute left-0 mt-1.5 w-72 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                Select Governing Federation
              </div>
              {CONTEXT_OPTIONS.federations.map((fed) => (
                <button
                  key={fed}
                  onClick={() => {
                    onUpdateContext({ federation: fed });
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    context.federation === fed
                      ? 'bg-sky-500/15 text-sky-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{fed}</span>
                  {context.federation === fed && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-slate-600 text-xs select-none">/</span>

        {/* Sport */}
        <div className="relative shrink-0">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'sport' ? null : 'sport')}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-left transition-colors whitespace-nowrap"
          >
            <Trophy className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-100">
              {context.sport}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {openDropdown === 'sport' && (
            <div className="absolute left-0 mt-1.5 w-48 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                Select Federation Sport
              </div>
              {CONTEXT_OPTIONS.sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => {
                    onUpdateContext({ sport });
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    context.sport === sport
                      ? 'bg-sky-500/15 text-sky-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{sport}</span>
                  {context.sport === sport && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-slate-600 text-xs select-none">/</span>

        {/* Program */}
        <div className="relative min-w-0">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === 'program' ? null : 'program')
            }
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-left transition-colors whitespace-nowrap"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-100 truncate max-w-[130px] xl:max-w-[170px]">
              {context.program}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {openDropdown === 'program' && (
            <div className="absolute left-0 mt-1.5 w-64 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                Select High Performance Program
              </div>
              {CONTEXT_OPTIONS.programs.map((prog) => (
                <button
                  key={prog}
                  onClick={() => {
                    onUpdateContext({ program: prog });
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    context.program === prog
                      ? 'bg-sky-500/15 text-sky-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{prog}</span>
                  {context.program === prog && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-slate-600 text-xs select-none">/</span>

        {/* Squad */}
        <div className="relative min-w-0">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'squad' ? null : 'squad')}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-left transition-colors whitespace-nowrap"
          >
            <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-100 truncate max-w-[125px] xl:max-w-[160px]">
              {context.squad}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {openDropdown === 'squad' && (
            <div className="absolute left-0 mt-1.5 w-64 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                Select Operational Squad
              </div>
              {CONTEXT_OPTIONS.squads.map((sq) => (
                <button
                  key={sq}
                  onClick={() => {
                    onUpdateContext({ squad: sq });
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between ${
                    context.squad === sq
                      ? 'bg-sky-500/15 text-sky-300 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/70'
                  }`}
                >
                  <span>{sq}</span>
                  {context.squad === sq && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Zone: AI Copilot Trigger, Notifications, Compact Role Selector */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Persistent AI Copilot Trigger (Section 1) */}
        {onOpenAICopilot && (
          <button
            onClick={onOpenAICopilot}
            title="Open Context-Aware USI AI Copilot"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-[11px] font-semibold text-sky-300 transition-colors whitespace-nowrap"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400" />
            <span>AI Copilot</span>
            {pendingAIActionsCount > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-sky-500 text-slate-950 font-mono text-[10px] font-bold leading-none">
                {pendingAIActionsCount}
              </span>
            )}
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={onToggleNotifications}
          title="Operational Notifications"
          className="relative p-1.5 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-slate-300 hover:text-white transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center tabular-nums">
              {unreadNotificationsCount}
            </span>
          )}
        </button>

        {/* Compact Role Selector */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === 'role' ? null : 'role')}
            title={`Active Role View: ${selectedRole}`}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 transition-colors text-left whitespace-nowrap"
          >
            <div className="w-5 h-5 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-sky-300 shrink-0">
              {selectedRole
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </div>
            <span className="text-[11px] font-semibold text-slate-100 max-w-[125px] truncate">
              {selectedRole}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {openDropdown === 'role' && (
            <div className="absolute right-0 mt-1.5 w-80 bg-[#0F1623] border border-slate-700 rounded-md shadow-2xl py-1.5 z-50">
              <div className="px-3.5 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Role-Based Operational Lens</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Switch active specialist role to preview permissions and workflow emphasis.
                </p>
              </div>
              <div className="py-1">
                {ROLES.map((role) => {
                  const active = selectedRole === role;
                  const meta = ROLE_DESCRIPTIONS[role];
                  return (
                    <button
                      key={role}
                      onClick={() => {
                        onSelectRole(role);
                        setOpenDropdown(null);
                      }}
                      className={`w-full text-left px-3.5 py-2 transition-colors ${
                        active
                          ? 'bg-sky-500/15 border-l-2 border-sky-400'
                          : 'hover:bg-slate-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${
                            active ? 'text-sky-300' : 'text-slate-200'
                          }`}
                        >
                          {role}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          {meta.clearance.split('·')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {meta.focus}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
