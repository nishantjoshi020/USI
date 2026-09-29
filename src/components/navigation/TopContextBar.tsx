import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Bot,
  ChevronDown,
  ShieldCheck,
  Building2,
  Trophy,
  Layers,
  Users,
  Monitor,
  Tablet,
  Smartphone,
  Menu,
} from 'lucide-react';
import { HierarchyContext, UserRole } from '../../types/usi';
import { CONTEXT_OPTIONS, ROLE_DESCRIPTIONS } from '../../data/mockData';

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';

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
  viewportMode?: ViewportMode;
  onChangeViewportMode?: (mode: ViewportMode) => void;
  onToggleMobileSidebar?: () => void;
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
  onToggleNotifications,
  onOpenAICopilot,
  pendingAIActionsCount = 0,
  viewportMode = 'desktop',
  onChangeViewportMode,
  onToggleMobileSidebar,
}) => {
  const [openDropdown, setOpenDropdown] = useState<
    | 'federation'
    | 'sport'
    | 'program'
    | 'squad'
    | 'mobile-context'
    | 'role'
    | null
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

  const isMobile = viewportMode === 'mobile';
  const isTablet = viewportMode === 'tablet';

  return (
    <header
      ref={barRef}
      className={`h-14 bg-[#090D16]/95 backdrop-blur-sm border-b border-slate-800/90 ${
        isMobile ? 'px-2.5 gap-1.5' : 'px-4 gap-2'
      } flex items-center justify-between sticky top-0 z-20`}
    >
      {/* Left: Global Hierarchy Context Filters */}
      <div className="flex items-center gap-1 min-w-0 flex-1">
        {/* Sidebar Drawer Trigger for Mobile & Tablet */}
        {(isMobile || isTablet) && onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            title="Open Navigation Menu"
            className="p-1.5 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-slate-300 hover:text-white transition-colors shrink-0"
          >
            <Menu className="w-3.5 h-3.5 text-sky-400" />
          </button>
        )}

        {isMobile ? (
          /* Compact Unified Hierarchy Context Selector for Mobile (Full 4-Tier Parity inside Popover) */
          <div className="relative min-w-0">
            <button
              onClick={() =>
                setOpenDropdown(
                  openDropdown === 'mobile-context' ? null : 'mobile-context'
                )
              }
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-left transition-colors whitespace-nowrap"
            >
              <Trophy className="w-3 h-3 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-100 truncate max-w-[105px]">
                {context.sport} · {context.squad.replace("Senior Men's ", '')}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {openDropdown === 'mobile-context' && (
              <div className="absolute left-0 mt-1.5 w-72 bg-[#0F1623] border border-slate-700 rounded-md shadow-2xl p-3 z-50 space-y-2.5">
                <div className="text-[11px] font-semibold text-sky-400 border-b border-slate-800 pb-1.5">
                  Operational Hierarchy Context
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Federation
                  </label>
                  <select
                    value={context.federation}
                    onChange={(e) =>
                      onUpdateContext({ federation: e.target.value })
                    }
                    className="w-full px-2 py-1.5 rounded bg-[#090D16] border border-slate-800 text-xs text-slate-100"
                  >
                    {CONTEXT_OPTIONS.federations.map((fed) => (
                      <option key={fed} value={fed}>
                        {fed}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Sport
                  </label>
                  <select
                    value={context.sport}
                    onChange={(e) => onUpdateContext({ sport: e.target.value })}
                    className="w-full px-2 py-1.5 rounded bg-[#090D16] border border-slate-800 text-xs text-slate-100"
                  >
                    {CONTEXT_OPTIONS.sports.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Program
                  </label>
                  <select
                    value={context.program}
                    onChange={(e) =>
                      onUpdateContext({ program: e.target.value })
                    }
                    className="w-full px-2 py-1.5 rounded bg-[#090D16] border border-slate-800 text-xs text-slate-100"
                  >
                    {CONTEXT_OPTIONS.programs.map((prog) => (
                      <option key={prog} value={prog}>
                        {prog}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">
                    Squad
                  </label>
                  <select
                    value={context.squad}
                    onChange={(e) => onUpdateContext({ squad: e.target.value })}
                    className="w-full px-2 py-1.5 rounded bg-[#090D16] border border-slate-800 text-xs text-slate-100"
                  >
                    {CONTEXT_OPTIONS.squads.map((sq) => (
                      <option key={sq} value={sq}>
                        {sq}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Federation */}
            <div className="relative min-w-0">
              <button
                onClick={() =>
                  setOpenDropdown(
                    openDropdown === 'federation' ? null : 'federation'
                  )
                }
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-left transition-colors whitespace-nowrap"
              >
                <Building2 className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span
                  className={`text-[11px] font-semibold text-slate-100 truncate ${
                    isTablet
                      ? 'max-w-[95px]'
                      : 'max-w-[160px] xl:max-w-[220px]'
                  }`}
                >
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
                onClick={() =>
                  setOpenDropdown(openDropdown === 'sport' ? null : 'sport')
                }
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
                <span
                  className={`text-[11px] font-semibold text-slate-100 truncate ${
                    isTablet
                      ? 'max-w-[85px]'
                      : 'max-w-[120px] xl:max-w-[165px]'
                  }`}
                >
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
                onClick={() =>
                  setOpenDropdown(openDropdown === 'squad' ? null : 'squad')
                }
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 text-left transition-colors whitespace-nowrap"
              >
                <Users className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span
                  className={`text-[11px] font-semibold text-slate-100 truncate ${
                    isTablet
                      ? 'max-w-[85px]'
                      : 'max-w-[115px] xl:max-w-[155px]'
                  }`}
                >
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
          </>
        )}
      </div>

      {/* Right Zone: AI Copilot Trigger, Notifications, Compact Role Selector, View Switcher */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Persistent AI Copilot Trigger */}
        {onOpenAICopilot && (
          <button
            onClick={onOpenAICopilot}
            title="Open Context-Aware USI AI Copilot"
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-[11px] font-semibold text-sky-300 transition-colors whitespace-nowrap"
          >
            <Bot className="w-3.5 h-3.5 text-sky-400 shrink-0" />
            {!isMobile && <span>AI Copilot</span>}
            {pendingAIActionsCount > 0 && (
              <span className="px-1 py-0.5 rounded bg-sky-500 text-slate-950 font-mono text-[9px] font-bold leading-none">
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
            onClick={() =>
              setOpenDropdown(openDropdown === 'role' ? null : 'role')
            }
            title={`Active Role View: ${selectedRole}`}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 transition-colors text-left whitespace-nowrap"
          >
            <div className="w-5 h-5 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-[10px] font-mono font-bold text-sky-300 shrink-0">
              {selectedRole
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </div>
            {!isMobile && (
              <span
                className={`text-[11px] font-semibold text-slate-100 truncate ${
                  isTablet ? 'max-w-[85px]' : 'max-w-[120px]'
                }`}
              >
                {selectedRole}
              </span>
            )}
            <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
          </button>

          {openDropdown === 'role' && (
            <div className="absolute right-0 mt-1.5 w-72 sm:w-80 bg-[#0F1623] border border-slate-700 rounded-md shadow-2xl py-1.5 z-50">
              <div className="px-3.5 py-2 border-b border-slate-800">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Role-Based Operational Lens</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Switch active specialist role to preview permissions and workflow emphasis.
                </p>
              </div>
              <div className="py-1 max-h-80 overflow-y-auto">
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

        {/* Viewport Switcher (Desktop / Tablet / Mobile) next to Role Switcher */}
        {onChangeViewportMode && (
          <div
            className="flex items-center p-0.5 rounded-md bg-[#0F1623] border border-slate-800 shrink-0"
            title="Switch Responsive Viewport Mode (Desktop / Tablet / Mobile)"
          >
            {(
              [
                {
                  id: 'desktop' as const,
                  label: 'Desktop',
                  icon: Monitor,
                },
                {
                  id: 'tablet' as const,
                  label: 'Tablet',
                  icon: Tablet,
                },
                {
                  id: 'mobile' as const,
                  label: 'Mobile',
                  icon: Smartphone,
                },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              const active = viewportMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeViewportMode(item.id)}
                  title={`${item.label} View`}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded text-[10px] font-semibold transition-colors ${
                    active
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  {!isMobile && !isTablet && (
                    <span className="hidden xl:inline">{item.label}</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};

