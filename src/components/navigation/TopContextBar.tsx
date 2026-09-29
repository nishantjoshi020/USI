import React, { useState, useRef, useEffect } from 'react';
import {
  Activity,
  Bell,
  Bot,
  Building2,
  ChevronDown,
  ClipboardList,
  Compass,
  Crown,
  Flame,
  HeartPulse,
  Landmark,
  Layers,
  Lock,
  Medal,
  Menu,
  Monitor,
  ShieldCheck,
  Smartphone,
  Tablet,
  Target,
  Trophy,
  User,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  Wrench,
  Zap,
} from 'lucide-react';
import { HierarchyContext, UserRole } from '../../types/usi';
import {
  CONTEXT_OPTIONS,
  getAllowedSquadsForContext,
  PERSONA_HIERARCHY_PERMISSIONS,
  ROLE_DESCRIPTIONS,
} from '../../data/mockData';

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
  isSidebarOpen?: boolean;
  activeAthlete?: unknown;
  athletes?: unknown[];
  onSelectActiveAthlete?: (athId: string) => void;
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

/* Dynamic Custom Sport & Context Icons to convey full information in Icon-Only Mode */
const renderSportIcon = (sport: string) => {
  switch (sport) {
    case 'Football':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-emerald-400 shrink-0"
        >
          <circle cx="12" cy="12" r="10" />
          <polygon points="12 7 16.5 10.2 14.8 15.5 9.2 15.5 7.5 10.2 12 7" />
          <line x1="12" y1="2" x2="12" y2="7" />
          <line x1="21.5" y1="8.9" x2="16.5" y2="10.2" />
          <line x1="17.9" y1="20.1" x2="14.8" y2="15.5" />
          <line x1="6.1" y1="20.1" x2="9.2" y2="15.5" />
          <line x1="2.5" y1="8.9" x2="7.5" y2="10.2" />
        </svg>
      );
    case 'Field Hockey':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-cyan-400 shrink-0"
        >
          {/* Hockey stick 1 */}
          <path d="M4 3l11 14c1.5 2 4 2 5 0.5 0.8-1.2 0.2-2.8-1.2-3.2" />
          {/* Hockey stick 2 crossed */}
          <path d="M20 3L9 17c-1.5 2-4 2-5 0.5-0.8-1.2-0.2-2.8 1.2-3.2" />
          {/* Hockey ball */}
          <circle cx="12" cy="20" r="2" fill="currentColor" />
        </svg>
      );
    case 'Athletics':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-amber-400 shrink-0"
        >
          <circle cx="15" cy="4" r="2" />
          <path d="M10.5 9.5L7 11l-2 4" />
          <path d="M10.5 9.5l4 2.5 3.5-2" />
          <path d="M14.5 12l-2.5 4.5 4 3.5" />
          <path d="M12 16.5l-4.5 1-2.5 3.5" />
        </svg>
      );
    case 'Swimming':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-sky-400 shrink-0"
        >
          <circle cx="16" cy="7" r="2" />
          <path d="M6 12l5-3 4 2 3-2" />
          <path d="M2 16c1.5 1 3.5 1 5 0s3.5-1 5 0 3.5 1 5 0 3.5-1 5 0" />
          <path d="M2 20c1.5 1 3.5 1 5 0s3.5-1 5 0 3.5 1 5 0 3.5-1 5 0" />
        </svg>
      );
    case 'Badminton':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-rose-400 shrink-0"
        >
          <path d="M6 18a3 3 0 1 0 4.2 4.2l1.8-1.8-4.2-4.2-1.8 1.8z" />
          <path d="M10.2 20.4L21 9l-5-1-2-5-11.4 10.8" />
          <line x1="8" y1="12" x2="15" y2="16" />
          <line x1="12" y1="8" x2="16" y2="15" />
        </svg>
      );
    default:
      return <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />;
  }
};

const renderFederationIcon = (fed: string) => {
  if (fed.includes('Olympic')) {
    return <Medal className="w-4 h-4 text-amber-400 shrink-0" />;
  }
  if (fed.includes('Academy')) {
    return <Landmark className="w-4 h-4 text-violet-400 shrink-0" />;
  }
  return <Building2 className="w-4 h-4 text-sky-400 shrink-0" />;
};

const renderProgramIcon = (prog: string) => {
  if (prog.includes('Women')) {
    return <Crown className="w-4 h-4 text-fuchsia-400 shrink-0" />;
  }
  if (prog.includes('U-23')) {
    return <Flame className="w-4 h-4 text-amber-400 shrink-0" />;
  }
  if (prog.includes('U-19')) {
    return <Compass className="w-4 h-4 text-emerald-400 shrink-0" />;
  }
  return <Layers className="w-4 h-4 text-sky-400 shrink-0" />;
};

const renderSquadIcon = (squad: string) => {
  if (squad.includes('Rehabilitation') || squad.includes('RTP')) {
    return <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />;
  }
  if (squad.includes('Match Day')) {
    return <Target className="w-4 h-4 text-emerald-400 shrink-0" />;
  }
  if (squad.includes('U23')) {
    return <Zap className="w-4 h-4 text-indigo-400 shrink-0" />;
  }
  if (squad === 'Senior Squad') {
    return <UserCheck className="w-4 h-4 text-sky-400 shrink-0" />;
  }
  return <Users className="w-4 h-4 text-amber-400 shrink-0" />;
};

const renderRoleIcon = (role: UserRole) => {
  switch (role) {
    case 'Performance Director':
      return <ShieldCheck className="w-3.5 h-3.5 text-sky-300 shrink-0" />;
    case 'Coach':
      return <ClipboardList className="w-3.5 h-3.5 text-emerald-300 shrink-0" />;
    case 'Sports Scientist':
      return <Activity className="w-3.5 h-3.5 text-cyan-300 shrink-0" />;
    case 'Physiotherapist':
      return <HeartPulse className="w-3.5 h-3.5 text-rose-300 shrink-0" />;
    case 'Nutritionist':
      return <Utensils className="w-3.5 h-3.5 text-amber-300 shrink-0" />;
    case 'Federation Admin':
      return <Building2 className="w-3.5 h-3.5 text-violet-300 shrink-0" />;
    case 'Athlete':
      return <User className="w-3.5 h-3.5 text-sky-300 shrink-0" />;
    case 'Operations Team':
      return <Wrench className="w-3.5 h-3.5 text-orange-300 shrink-0" />;
    default:
      return <User className="w-3.5 h-3.5 text-sky-300 shrink-0" />;
  }
};

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
  isSidebarOpen = true,
  onOpenOnboarding,
}) => {
  const [openDropdown, setOpenDropdown] = useState<
    | 'federation'
    | 'sport'
    | 'program'
    | 'squad'
    | 'mobile-context'
    | 'role'
    | 'viewport'
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
  // When sidebar is open (or on mobile), use expressive icon-only layout; when sidebar is closed, show full text labels
  const isIconOnly = isSidebarOpen || isMobile;

  const perm =
    PERSONA_HIERARCHY_PERMISSIONS[selectedRole] ||
    PERSONA_HIERARCHY_PERMISSIONS['Performance Director'];
  const allowedSquads = getAllowedSquadsForContext(
    selectedRole,
    context.program
  );
  const isAllMobileLocked =
    !perm.canSwitchFederation &&
    !perm.canSwitchSport &&
    !perm.canSwitchProgram &&
    !perm.canSwitchSquad;

  return (
    <header
      ref={barRef}
      className={`h-14 bg-[#090D16]/95 backdrop-blur-sm border-b border-slate-800/90 ${
        isMobile ? 'px-2.5 gap-1.5' : 'px-4 gap-2'
      } flex items-center justify-between sticky top-0 z-20`}
    >
      {/* Left: Global Hierarchy Context Filters */}
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
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
              disabled={isAllMobileLocked}
              onClick={() => {
                if (isAllMobileLocked) return;
                setOpenDropdown(
                  openDropdown === 'mobile-context' ? null : 'mobile-context'
                );
              }}
              title={`${context.federation} / ${context.sport} / ${context.program} / ${context.squad}`}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md border text-left transition-colors whitespace-nowrap ${
                isAllMobileLocked
                  ? 'bg-[#0B101B] border-slate-800/80 opacity-65 cursor-not-allowed'
                  : 'bg-[#0F1623] hover:bg-[#151E2E] border-slate-800'
              }`}
            >
              {renderFederationIcon(context.federation)}
              <span className="text-slate-700 text-[10px]">/</span>
              {renderSportIcon(context.sport)}
              <span className="text-slate-700 text-[10px]">/</span>
              {renderProgramIcon(context.program)}
              <span className="text-slate-700 text-[10px]">/</span>
              {renderSquadIcon(context.squad)}
              {isAllMobileLocked ? (
                <Lock className="w-3 h-3 text-slate-500 shrink-0 ml-0.5" />
              ) : (
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
              )}
            </button>

            {openDropdown === 'mobile-context' && !isAllMobileLocked && (
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
                    disabled={!perm.canSwitchFederation}
                    onChange={(e) =>
                      onUpdateContext({ federation: e.target.value })
                    }
                    className={`w-full px-2 py-1.5 rounded border text-xs ${
                      perm.canSwitchFederation
                        ? 'bg-[#090D16] border-slate-700 text-slate-100'
                        : 'bg-[#070A12] border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {perm.allowedFederations.map((fed) => (
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
                    disabled={!perm.canSwitchSport}
                    onChange={(e) => onUpdateContext({ sport: e.target.value })}
                    className={`w-full px-2 py-1.5 rounded border text-xs ${
                      perm.canSwitchSport
                        ? 'bg-[#090D16] border-slate-700 text-slate-100'
                        : 'bg-[#070A12] border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {perm.allowedSports.map((sp) => (
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
                    disabled={!perm.canSwitchProgram}
                    onChange={(e) =>
                      onUpdateContext({ program: e.target.value })
                    }
                    className={`w-full px-2 py-1.5 rounded border text-xs ${
                      perm.canSwitchProgram
                        ? 'bg-[#090D16] border-slate-700 text-slate-100'
                        : 'bg-[#070A12] border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {perm.allowedPrograms.map((prog) => (
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
                    disabled={!perm.canSwitchSquad}
                    onChange={(e) => onUpdateContext({ squad: e.target.value })}
                    className={`w-full px-2 py-1.5 rounded border text-xs ${
                      perm.canSwitchSquad
                        ? 'bg-[#090D16] border-slate-700 text-slate-100'
                        : 'bg-[#070A12] border-slate-800/80 text-slate-500 cursor-not-allowed opacity-60'
                    }`}
                  >
                    {allowedSquads.map((sq) => (
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
            {/* 1. Governing Federation */}
            <div className="relative min-w-0">
              <button
                disabled={!perm.canSwitchFederation}
                onClick={() => {
                  if (!perm.canSwitchFederation) return;
                  setOpenDropdown(
                    openDropdown === 'federation' ? null : 'federation'
                  );
                }}
                title={`Federation: ${context.federation}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-left transition-colors whitespace-nowrap ${
                  perm.canSwitchFederation
                    ? 'bg-[#0F1623] hover:bg-[#151E2E] border-slate-800'
                    : 'bg-[#0B101B] border-slate-800/70 opacity-60 cursor-not-allowed'
                }`}
              >
                {renderFederationIcon(context.federation)}
                {!isIconOnly && (
                  <span
                    className={`text-[11px] font-semibold ${
                      perm.canSwitchFederation
                        ? 'text-slate-100'
                        : 'text-slate-400'
                    } ${
                      isTablet
                        ? 'truncate max-w-[90px]'
                        : 'whitespace-nowrap'
                    }`}
                  >
                    {context.federation}
                  </span>
                )}
                {perm.canSwitchFederation ? (
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                )}
              </button>

              {openDropdown === 'federation' && perm.canSwitchFederation && (
                <div className="absolute left-0 mt-1.5 w-76 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                    Select Governing Federation
                  </div>
                  {perm.allowedFederations.map((fed) => (
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
                      <span className="flex items-center gap-2">
                        {renderFederationIcon(fed)}
                        <span>{fed}</span>
                      </span>
                      {context.federation === fed && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-600 text-xs select-none">/</span>

            {/* 2. Sport */}
            <div className="relative shrink-0">
              <button
                disabled={!perm.canSwitchSport}
                onClick={() => {
                  if (!perm.canSwitchSport) return;
                  setOpenDropdown(openDropdown === 'sport' ? null : 'sport');
                }}
                title={`Sport: ${context.sport}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-left transition-colors whitespace-nowrap ${
                  perm.canSwitchSport
                    ? 'bg-[#0F1623] hover:bg-[#151E2E] border-slate-800'
                    : 'bg-[#0B101B] border-slate-800/70 opacity-60 cursor-not-allowed'
                }`}
              >
                {renderSportIcon(context.sport)}
                {!isIconOnly && (
                  <span
                    className={`text-[11px] font-semibold ${
                      perm.canSwitchSport ? 'text-slate-100' : 'text-slate-400'
                    }`}
                  >
                    {context.sport}
                  </span>
                )}
                {perm.canSwitchSport ? (
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                )}
              </button>

              {openDropdown === 'sport' && perm.canSwitchSport && (
                <div className="absolute left-0 mt-1.5 w-60 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                    Select Federation Sport
                  </div>
                  {perm.allowedSports.map((sport) => (
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
                      <span className="flex items-center gap-2">
                        {renderSportIcon(sport)}
                        <span>{sport}</span>
                      </span>
                      {context.sport === sport && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-600 text-xs select-none">/</span>

            {/* 3. Program */}
            <div className="relative min-w-0">
              <button
                disabled={!perm.canSwitchProgram}
                onClick={() => {
                  if (!perm.canSwitchProgram) return;
                  setOpenDropdown(
                    openDropdown === 'program' ? null : 'program'
                  );
                }}
                title={`Program: ${context.program}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-left transition-colors whitespace-nowrap ${
                  perm.canSwitchProgram
                    ? 'bg-[#0F1623] hover:bg-[#151E2E] border-slate-800'
                    : 'bg-[#0B101B] border-slate-800/70 opacity-60 cursor-not-allowed'
                }`}
              >
                {renderProgramIcon(context.program)}
                {!isIconOnly && (
                  <span
                    className={`text-[11px] font-semibold ${
                      perm.canSwitchProgram
                        ? 'text-slate-100'
                        : 'text-slate-400'
                    } ${
                      isTablet
                        ? 'truncate max-w-[80px]'
                        : 'whitespace-nowrap'
                    }`}
                  >
                    {context.program}
                  </span>
                )}
                {perm.canSwitchProgram ? (
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                )}
              </button>

              {openDropdown === 'program' && perm.canSwitchProgram && (
                <div className="absolute left-0 mt-1.5 w-68 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                    Select High Performance Program
                  </div>
                  {perm.allowedPrograms.map((prog) => (
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
                      <span className="flex items-center gap-2">
                        {renderProgramIcon(prog)}
                        <span>{prog}</span>
                      </span>
                      {context.program === prog && (
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span className="text-slate-600 text-xs select-none">/</span>

            {/* 4. Squad */}
            <div className="relative min-w-0">
              <button
                disabled={!perm.canSwitchSquad}
                onClick={() => {
                  if (!perm.canSwitchSquad) return;
                  setOpenDropdown(openDropdown === 'squad' ? null : 'squad');
                }}
                title={`Squad: ${context.squad}`}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border text-left transition-colors whitespace-nowrap ${
                  perm.canSwitchSquad
                    ? 'bg-[#0F1623] hover:bg-[#151E2E] border-slate-800'
                    : 'bg-[#0B101B] border-slate-800/70 opacity-60 cursor-not-allowed'
                }`}
              >
                {renderSquadIcon(context.squad)}
                {!isIconOnly && (
                  <span
                    className={`text-[11px] font-semibold ${
                      perm.canSwitchSquad ? 'text-slate-100' : 'text-slate-400'
                    } ${
                      isTablet
                        ? 'truncate max-w-[85px]'
                        : 'whitespace-nowrap'
                    }`}
                  >
                    {context.squad}
                  </span>
                )}
                {perm.canSwitchSquad ? (
                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                )}
              </button>

              {openDropdown === 'squad' && perm.canSwitchSquad && (
                <div className="absolute left-0 mt-1.5 w-68 bg-[#0F1623] border border-slate-700 rounded-md shadow-xl py-1 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-medium text-slate-400 border-b border-slate-800">
                    Select Operational Squad
                  </div>
                  {allowedSquads.map((sq) => (
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
                      <span className="flex items-center gap-2">
                        {renderSquadIcon(sq)}
                        <span>{sq}</span>
                      </span>
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

      {/* Right Zone: Add Athlete, AI Copilot Trigger, Notifications, Compact Role Selector, View Switcher */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Persistent Global Add Athlete Trigger */}
        {onOpenOnboarding && selectedRole !== 'Athlete' && (
          <button
            onClick={onOpenOnboarding}
            title="Enroll / Add New Athlete to Federation"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-sm transition-colors whitespace-nowrap"
          >
            <UserPlus className="w-3.5 h-3.5" />
            {!isIconOnly && <span>+ Add Athlete</span>}
          </button>
        )}

        {/* Persistent AI Copilot Trigger */}
        {onOpenAICopilot && (
          <button
            onClick={onOpenAICopilot}
            title="Open Context-Aware USI AI Copilot"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 text-[11px] font-semibold text-sky-300 transition-colors whitespace-nowrap"
          >
            <Bot className="w-4 h-4 text-sky-400 shrink-0" />
            {!isIconOnly && <span>AI Copilot</span>}
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
          <Bell className="w-4 h-4" />
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
            className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 transition-colors text-left whitespace-nowrap"
          >
            <div className="w-5 h-5 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center shrink-0">
              {renderRoleIcon(selectedRole)}
            </div>
            {!isIconOnly && (
              <span
                className={`text-[11px] font-semibold text-slate-100 ${
                  isTablet ? 'truncate max-w-[85px]' : 'whitespace-nowrap'
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
                  const rolePerm = PERSONA_HIERARCHY_PERMISSIONS[role];
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
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-xs font-semibold flex items-center gap-2 ${
                            active ? 'text-sky-300' : 'text-slate-200'
                          }`}
                        >
                          {renderRoleIcon(role)}
                          <span>{role}</span>
                        </span>
                        {rolePerm && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold shrink-0 ${
                              rolePerm.canSwitchFederation
                                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                                : !rolePerm.canSwitchSquad
                                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                                  : 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                            }`}
                          >
                            {rolePerm.scopeBadge}
                          </span>
                        )}
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

        {/* Screen / Viewport Switcher Dropdown (styled like Role Switcher) */}
        {onChangeViewportMode && (
          <div className="relative">
            <button
              onClick={() =>
                setOpenDropdown(
                  openDropdown === 'viewport' ? null : 'viewport'
                )
              }
              title={`Active Screen View: ${
                viewportMode === 'desktop'
                  ? 'Desktop'
                  : viewportMode === 'tablet'
                    ? 'Tablet'
                    : 'Mobile'
              }`}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-800 transition-colors text-left whitespace-nowrap"
            >
              <div className="w-5 h-5 rounded bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-300 shrink-0">
                {viewportMode === 'desktop' ? (
                  <Monitor className="w-3.5 h-3.5" />
                ) : viewportMode === 'tablet' ? (
                  <Tablet className="w-3.5 h-3.5" />
                ) : (
                  <Smartphone className="w-3.5 h-3.5" />
                )}
              </div>
              {!isIconOnly && (
                <span className="text-[11px] font-semibold text-slate-100">
                  {viewportMode === 'desktop'
                    ? 'Desktop'
                    : viewportMode === 'tablet'
                      ? 'Tablet'
                      : 'Mobile'}
                </span>
              )}
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {openDropdown === 'viewport' && (
              <div className="absolute right-0 mt-1.5 w-64 bg-[#0F1623] border border-slate-700 rounded-md shadow-2xl py-1.5 z-50">
                <div className="px-3.5 py-2 border-b border-slate-800">
                  <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5 text-sky-400" />
                    <span>Responsive Screen Switcher</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Switch active screen layout while preserving full feature parity.
                  </p>
                </div>

                <div className="py-1">
                  {(
                    [
                      {
                        id: 'desktop' as const,
                        label: 'Desktop',
                        spec: 'Full Width',
                        desc: 'Multi-column command center & expanded sidebar',
                        icon: Monitor,
                      },
                      {
                        id: 'tablet' as const,
                        label: 'Tablet',
                        spec: '834px Slate',
                        desc: 'Compact icon-rail sidebar & adaptive 2–3 col grids',
                        icon: Tablet,
                      },
                      {
                        id: 'mobile' as const,
                        label: 'Mobile',
                        spec: '430px Handheld',
                        desc: 'Slide-over drawer, bottom dock & stacked cards',
                        icon: Smartphone,
                      },
                    ] as const
                  ).map((item) => {
                    const Icon = item.icon;
                    const active = viewportMode === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onChangeViewportMode(item.id);
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
                            className={`text-xs font-semibold flex items-center gap-1.5 ${
                              active ? 'text-sky-300' : 'text-slate-200'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5 text-sky-400" />
                            <span>{item.label}</span>
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            {item.spec}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                          {item.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

