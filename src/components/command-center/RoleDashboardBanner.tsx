import React from 'react';
import {
  Activity,
  AlertTriangle,
  Apple,
  Award,
  BarChart2,
  Building2,
  Calendar,
  CheckCircle2,
  Download,
  Droplets,
  FileCheck,
  FilePlus,
  FileText,
  Globe,
  HeartPulse,
  MessageSquare,
  Moon,
  PlusSquare,
  RefreshCw,
  Send,
  ShieldCheck,
  Smile,
  Sparkles,
  Trophy,
  Truck,
  Upload,
  UserCheck,
  Users,
} from 'lucide-react';
import { UserRole } from '../../types/usi';
import { ROLE_DASHBOARDS_CONFIG } from '../../data/roleDashboardConfig';

interface RoleDashboardBannerProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  onTriggerQuickAction?: (actionId: string, label: string) => void;
}

const ALL_ROLES: UserRole[] = [
  'Performance Director',
  'Coach',
  'Sports Scientist',
  'Physiotherapist',
  'Nutritionist',
  'Federation Admin',
  'Athlete',
  'Operations Team',
];

export const RoleDashboardBanner: React.FC<RoleDashboardBannerProps> = ({
  selectedRole,
  onSelectRole,
  onTriggerQuickAction,
}) => {
  const config = ROLE_DASHBOARDS_CONFIG[selectedRole] || ROLE_DASHBOARDS_CONFIG['Performance Director'];

  const renderIcon = (name: string, className = 'w-4 h-4') => {
    switch (name) {
      case 'Activity':
        return <Activity className={className} />;
      case 'AlertTriangle':
        return <AlertTriangle className={className} />;
      case 'Apple':
        return <Apple className={className} />;
      case 'Award':
        return <Award className={className} />;
      case 'BarChart2':
        return <BarChart2 className={className} />;
      case 'Building2':
        return <Building2 className={className} />;
      case 'Calendar':
        return <Calendar className={className} />;
      case 'CheckCircle2':
        return <CheckCircle2 className={className} />;
      case 'Download':
        return <Download className={className} />;
      case 'Droplets':
        return <Droplets className={className} />;
      case 'FileCheck':
        return <FileCheck className={className} />;
      case 'FilePlus':
        return <FilePlus className={className} />;
      case 'FileText':
        return <FileText className={className} />;
      case 'Globe':
        return <Globe className={className} />;
      case 'HeartPulse':
        return <HeartPulse className={className} />;
      case 'MessageSquare':
        return <MessageSquare className={className} />;
      case 'Moon':
        return <Moon className={className} />;
      case 'PlusSquare':
        return <PlusSquare className={className} />;
      case 'RefreshCw':
        return <RefreshCw className={className} />;
      case 'Send':
        return <Send className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Smile':
        return <Smile className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      case 'Upload':
        return <Upload className={className} />;
      case 'UserCheck':
        return <UserCheck className={className} />;
      case 'Users':
      default:
        return <Users className={className} />;
    }
  };

  const getThemeBadgeStyles = (role: UserRole) => {
    switch (role) {
      case 'Performance Director':
        return 'bg-sky-500/15 border-sky-500/30 text-sky-300';
      case 'Coach':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300';
      case 'Sports Scientist':
        return 'bg-violet-500/15 border-violet-500/30 text-violet-300';
      case 'Physiotherapist':
        return 'bg-rose-500/15 border-rose-500/30 text-rose-300';
      case 'Nutritionist':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-300';
      case 'Federation Admin':
        return 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300';
      case 'Athlete':
        return 'bg-teal-500/15 border-teal-500/30 text-teal-300';
      case 'Operations Team':
        return 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300';
      default:
        return 'bg-sky-500/15 border-sky-500/30 text-sky-300';
    }
  };

  return (
    <div className="space-y-3">
      {/* 8-Persona Quick Pill Switcher */}
      <div className="bg-[#0c121e]/90 border border-slate-800/90 rounded-xl p-2.5 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 mb-2 px-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
            </span>
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Select Active Persona View (8 Dedicated Role Lens)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            Active: <strong className="text-slate-200">{config.displayName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
          {ALL_ROLES.map((role) => {
            const isActive = selectedRole === role;
            const roleConf = ROLE_DASHBOARDS_CONFIG[role];
            return (
              <button
                key={role}
                onClick={() => onSelectRole(role)}
                title={`Switch dashboard view to ${roleConf.displayName}`}
                className={`flex flex-col items-center justify-center p-2 rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-sky-500/20 border-2 border-sky-400 text-sky-200 shadow-lg shadow-sky-500/10 font-bold scale-[1.02]'
                    : 'bg-[#131c2d]/70 hover:bg-[#19243a] border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="mb-1 text-slate-300">
                  {renderIcon(roleConf.kpis[0]?.iconName || 'Users', 'w-4 h-4')}
                </div>
                <span className="text-[11px] leading-tight line-clamp-1">{role}</span>
                {isActive && (
                  <span className="text-[9px] font-mono text-sky-400 font-semibold mt-0.5">● ACTIVE</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Role Hero Card */}
      <div className="rounded-xl border border-slate-800/90 bg-gradient-to-r from-[#0c1322] via-[#0e1628] to-[#0c1322] p-4 lg:p-5 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          {/* Persona details */}
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getThemeBadgeStyles(selectedRole)}`}>
                {config.displayName}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-[11px] font-mono text-slate-300">
                {config.clearanceLevel}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live Telemetry Synced
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>{config.displayName}</span>
              <span className="text-sm font-normal text-slate-400">· Dashboard Lens</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 inline mr-1.5" />
              <strong>Operational Focus:</strong> {config.tagline}
            </p>
          </div>

          {/* Quick Action Shortcuts for This Persona */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {config.quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() =>
                  onTriggerQuickAction
                    ? onTriggerQuickAction(action.id, action.label)
                    : alert(`[${selectedRole}] Quick Action: "${action.label}" activated.`)
                }
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-semibold text-sky-200 hover:text-white transition-all shadow-sm"
              >
                {renderIcon(action.icon, 'w-3.5 h-3.5 text-sky-400')}
                <span>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
