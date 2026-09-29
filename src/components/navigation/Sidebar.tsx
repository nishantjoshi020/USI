import React, { useState } from 'react';
import {
  Activity,
  BarChart3,
  Bot,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Dumbbell,
  HeartPulse,
  LayoutDashboard,
  Settings,
  Shield,
  Users,
  Utensils,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { NavItemId, UserRole } from '../../types/usi';

interface SidebarProps {
  activeNav: NavItemId;
  onSelectNav: (nav: NavItemId) => void;
  attentionCount: number;
  activeInjuryCount: number;
  selectedRole?: UserRole;
}

const ROLE_ALLOWED_NAV_GROUPS: Record<UserRole, string[]> = {
  'Performance Director': [
    'command-center',
    'athletes',
    'training',
    'medical',
    'sports-science',
    'nutrition',
    'assessments-tid',
    'analytics-bi',
    'ai-copilot',
    'settings',
  ],
  Athlete: [
    'command-center',
    'training',
    'medical',
    'nutrition',
    'assessments-tid',
    'ai-copilot',
  ],
  Coach: [
    'command-center',
    'athletes',
    'training',
    'medical',
    'sports-science',
    'assessments-tid',
    'ai-copilot',
  ],
  'Sports Scientist': [
    'command-center',
    'athletes',
    'training',
    'sports-science',
    'assessments-tid',
    'analytics-bi',
    'ai-copilot',
  ],
  Physiotherapist: [
    'command-center',
    'athletes',
    'medical',
    'sports-science',
    'ai-copilot',
  ],
  Nutritionist: [
    'command-center',
    'athletes',
    'nutrition',
    'sports-science',
    'ai-copilot',
  ],
  'Federation Admin': [
    'command-center',
    'athletes',
    'assessments-tid',
    'analytics-bi',
    'ai-copilot',
    'settings',
  ],
  'Operations Team': [
    'command-center',
    'athletes',
    'training',
    'assessments-tid',
    'analytics-bi',
    'ai-copilot',
    'settings',
  ],
};

interface NavGroup {
  id: string;
  label: string;
  icon: React.FC<{ className?: string }>;
  navId?: NavItemId;
  badgeCount?: number;
  badgeTone?: 'amber' | 'rose' | 'sky';
  children?: {
    id: NavItemId;
    label: string;
    badge?: string | number;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  attentionCount,
  activeInjuryCount,
  selectedRole = 'Performance Director',
}) => {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    athletes: false,
    training: false,
    medical: false,
    'sports-science': true,
    nutrition: false,
    'assessments-tid': false,
    'analytics-bi': false,
  });
  const [isCompact, setIsCompact] = useState(false);

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const navGroups: NavGroup[] = [
    {
      id: 'command-center',
      label: 'COMMAND CENTER',
      icon: LayoutDashboard,
      navId: 'command-center',
    },
    {
      id: 'athletes',
      label: 'Athletes',
      icon: Users,
      badgeCount: attentionCount,
      badgeTone: 'amber',
      children: [
        { id: 'athlete-registry', label: 'Athlete Registry', badge: 184 },
        { id: 'enrollment', label: 'Enrollment' },
        { id: 'verification', label: 'Verification' },
      ],
    },
    {
      id: 'training',
      label: 'Training',
      icon: Dumbbell,
      children: [
        { id: 'periodisation', label: 'Periodisation' },
        { id: 'sessions', label: 'Sessions', badge: '8 Today' },
        { id: 'exercises', label: 'Exercises' },
        { id: 'workload', label: 'Workload' },
      ],
    },
    {
      id: 'medical',
      label: 'Medical',
      icon: HeartPulse,
      badgeCount: activeInjuryCount,
      badgeTone: 'rose',
      children: [
        { id: 'injury-intelligence', label: 'Injury Intelligence', badge: activeInjuryCount },
        { id: 'injury-register', label: 'Injury Register' },
        { id: 'rehabilitation', label: 'Rehabilitation' },
        { id: 'return-to-play', label: 'Return to Play' },
      ],
    },
    {
      id: 'sports-science',
      label: 'Sports Science',
      icon: Activity,
      children: [
        { id: 'readiness', label: 'Readiness' },
        { id: 'fatigue', label: 'Fatigue' },
        { id: 'gps-wearables', label: 'GPS & Wearables' },
        { id: 'recovery', label: 'Recovery' },
      ],
    },
    {
      id: 'nutrition',
      label: 'Nutrition',
      icon: Utensils,
      navId: 'nutrition',
      children: [
        { id: 'nutrition', label: 'Athlete Fueling', badge: '84%' },
        { id: 'nutrition-plans', label: 'Plans' },
        { id: 'nutrition-hydration', label: 'Hydration' },
        { id: 'nutrition-supplements', label: 'Supplements' },
        { id: 'nutrition-body-composition', label: 'Body Composition' },
      ],
    },
    {
      id: 'assessments-tid',
      label: 'Assessments & TID',
      icon: ClipboardCheck,
      navId: 'assessments-tid',
      children: [
        { id: 'assessments-tid', label: 'Command Center', badge: 6 },
        { id: 'assessments-tests', label: 'Tests' },
        { id: 'assessments-field-testing', label: 'Field Testing' },
        { id: 'assessments-benchmarks', label: 'Benchmarks' },
        { id: 'assessments-talent', label: 'Talent Identification' },
      ],
    },
    {
      id: 'analytics-bi',
      label: 'Analytics & BI',
      icon: BarChart3,
      navId: 'analytics-federation',
      children: [
        { id: 'analytics-federation', label: 'Federation Analytics' },
        { id: 'analytics-sport', label: 'Sport Analytics' },
        { id: 'analytics-program', label: 'Program Analytics' },
        { id: 'analytics-squad', label: 'Squad Analytics' },
        { id: 'analytics-athlete', label: 'Athlete Analytics' },
        { id: 'analytics-reports', label: 'Reports' },
      ],
    },
    {
      id: 'ai-copilot',
      label: 'AI Copilot',
      icon: Bot,
      navId: 'ai-copilot',
      badgeCount: 5,
      badgeTone: 'sky',
      children: [
        { id: 'ai-copilot', label: 'USI Copilot', badge: 'Live' },
        { id: 'ai-action-centre', label: 'AI Action Centre', badge: 5 },
        { id: 'ai-risk-centre', label: 'AI Risk Centre', badge: 5 },
        { id: 'ai-automation', label: 'Workflow Automation' },
        { id: 'ai-audit', label: 'AI Audit Trail' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      navId: 'settings',
    },
  ];

  return (
    <aside
      className={`${
        isCompact ? 'w-16' : 'w-64'
      } shrink-0 bg-[#090D16] border-r border-slate-800/90 flex flex-col h-screen sticky top-0 select-none transition-all duration-150 z-30`}
    >
      {/* Brand Lockup */}
      <div className="h-16 px-4 border-b border-slate-800/90 flex items-center justify-between">
        <button
          onClick={() => onSelectNav('command-center')}
          className="flex items-center gap-3 text-left group focus:outline-none"
        >
          <div className="w-8 h-8 rounded-md bg-sky-500/15 border border-sky-500/40 flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-sky-400" />
          </div>
          {!isCompact && (
            <div className="leading-tight">
              <div className="text-sm font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">
                USI
              </div>
              <div className="text-[11px] text-slate-400 font-medium truncate">
                Unified Sports Interface
              </div>
            </div>
          )}
        </button>

        <button
          onClick={() => setIsCompact(!isCompact)}
          title={isCompact ? 'Expand navigation' : 'Collapse navigation'}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors"
        >
          {isCompact ? (
            <PanelLeftOpen className="w-4 h-4" />
          ) : (
            <PanelLeftClose className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Scroll Area */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
        {navGroups
          .filter((group) =>
            (
              ROLE_ALLOWED_NAV_GROUPS[selectedRole] ||
              ROLE_ALLOWED_NAV_GROUPS['Performance Director']
            ).includes(group.id)
          )
          .map((group) => {
          const Icon = group.icon;
          const hasChildren = Boolean(group.children && group.children.length > 0);
          const isChildActive = group.children?.some((c) => c.id === activeNav);
          const isDirectActive = group.navId === activeNav;
          const isExpanded = !collapsedSections[group.id];

          if (!hasChildren && group.navId) {
            const isCommandCenter = group.navId === 'command-center';
            return (
              <div key={group.id} className={isCommandCenter ? 'pb-2 mb-2 border-b border-slate-800/80' : ''}>
                <button
                  onClick={() => onSelectNav(group.navId!)}
                  title={isCompact ? group.label : undefined}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                    isDirectActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isDirectActive ? 'text-sky-400' : 'text-slate-400'
                      }`}
                    />
                    {!isCompact && (
                      <span
                        className={`truncate ${
                          isCommandCenter ? 'tracking-wider font-semibold text-[11px]' : ''
                        }`}
                      >
                        {group.label}
                      </span>
                    )}
                  </div>
                  {!isCompact && group.badgeCount !== undefined && (
                    <span className="font-mono text-[11px] text-sky-400 tabular-nums">
                      {group.badgeCount}
                    </span>
                  )}
                </button>
              </div>
            );
          }

          return (
            <div key={group.id} className="space-y-0.5">
              <button
                onClick={() => {
                  if (group.navId) {
                    onSelectNav(group.navId);
                    setCollapsedSections((prev) => ({ ...prev, [group.id]: false }));
                  } else if (isCompact && group.children?.[0]) {
                    onSelectNav(group.children[0].id);
                  } else {
                    toggleSection(group.id);
                  }
                }}
                title={isCompact ? group.label : undefined}
                className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors ${
                  isChildActive
                    ? 'text-slate-100 bg-slate-800/40'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isChildActive ? 'text-sky-400' : 'text-slate-400'
                    }`}
                  />
                  {!isCompact && <span className="truncate font-medium">{group.label}</span>}
                </div>

                {!isCompact && (
                  <div className="flex items-center gap-1.5">
                    {group.badgeCount !== undefined && (
                      <span
                        className={`font-mono text-[11px] tabular-nums ${
                          group.badgeTone === 'rose'
                            ? 'text-rose-400'
                            : group.badgeTone === 'amber'
                              ? 'text-amber-400'
                              : 'text-sky-400'
                        }`}
                      >
                        {group.badgeCount}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    )}
                  </div>
                )}
              </button>

              {!isCompact && isExpanded && group.children && (
                <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-slate-800/80 ml-4">
                  {group.children.map((child) => {
                    const active = activeNav === child.id;
                    return (
                      <button
                        key={child.id}
                        onClick={() => onSelectNav(child.id)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                          active
                            ? 'bg-sky-500/15 text-sky-300 font-semibold'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                        }`}
                      >
                        <span className="truncate">{child.label}</span>
                        {child.badge !== undefined && (
                          <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                            {child.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Operational Hierarchy Footer */}
      {!isCompact && (
        <div className="p-3 border-t border-slate-800/90 bg-[#0B101B]">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Data Flow Pipeline</span>
            <span className="font-mono text-emerald-400">Live Sync</span>
          </div>
          <div className="mt-1 text-[11px] text-slate-500 truncate">
            Data → Intelligence → Action
          </div>
        </div>
      )}
    </aside>
  );
};
