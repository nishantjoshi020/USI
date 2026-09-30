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
  onTriggerQuickAction?: (actionId: string, label: string) => void;
  onResetPersona?: (role: UserRole) => void;
}

export const RoleDashboardBanner: React.FC<RoleDashboardBannerProps> = ({
  selectedRole,
  onTriggerQuickAction,
  onResetPersona,
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
            <span className="text-sm font-normal text-slate-400">· Operational Lens</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <Sparkles className="w-3.5 h-3.5 text-sky-400 inline mr-1.5" />
            <strong>Operational Focus:</strong> {config.tagline}
          </p>
        </div>

        {/* Quick Action Shortcuts & Reset Button for This Persona */}
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
          {onResetPersona && (
            <button
              type="button"
              onClick={() => onResetPersona(selectedRole)}
              title={`Reset ${selectedRole} persona state and telemetry`}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-xs font-semibold text-amber-200 hover:text-amber-100 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset {selectedRole}</span>
            </button>
          )}
        </div>
      </div>

      {/* Quadrennial Olympic Cycle Strategic Peaking Matrix (Specific to Performance Director) */}
      {selectedRole === 'Performance Director' && (
        <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                QUADRENNIAL OLYMPIC CYCLE STRATEGIC PEAKING (PARIS 2024 → LA 2028)
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono">
              <span className="text-slate-400">Countdown:</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                684 Days to LA 2028
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-[#070B13] border border-slate-800/90 space-y-1">
              <span className="text-slate-400 block text-[10px]">Quadrennial Phase</span>
              <strong className="text-sky-300 font-bold block">Year 2: Capacity Expansion</strong>
              <span className="text-[10px] text-slate-500 font-mono">Benchmark & Quota Slotting</span>
            </div>
            <div className="p-2.5 rounded bg-[#070B13] border border-slate-800/90 space-y-1">
              <span className="text-slate-400 block text-[10px]">Olympic Pathway Longlist</span>
              <strong className="text-slate-100 font-mono font-bold block">32 Elite Contenders</strong>
              <span className="text-[10px] text-emerald-400">14 On Tier-1 Qualification Track</span>
            </div>
            <div className="p-2.5 rounded bg-[#070B13] border border-slate-800/90 space-y-1">
              <span className="text-slate-400 block text-[10px]">World Top-8 Conversion</span>
              <strong className="text-amber-300 font-mono font-bold block">6 Benchmark Achieved</strong>
              <span className="text-[10px] text-slate-400">Target: 8 Top-8 Finalists</span>
            </div>
            <div className="p-2.5 rounded bg-[#070B13] border border-slate-800/90 space-y-1">
              <span className="text-slate-400 block text-[10px]">Forecasted Podium Medals</span>
              <strong className="text-emerald-400 font-mono font-bold block">3 Projected Medals</strong>
              <span className="text-[10px] text-emerald-400 font-semibold">1 Gold · 2 Silver/Bronze</span>
            </div>
          </div>

          {/* 4-Year Peaking Pipeline Progress Corridor */}
          <div className="p-2.5 rounded bg-[#070B13] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">Periodisation Alignment:</span>
              <span className="text-slate-400">Corridor ACWR 1.05–1.20 target peaking synchronization across 4 national training hubs</span>
            </div>
            <button
              onClick={() =>
                onTriggerQuickAction
                  ? onTriggerQuickAction('la28-dossier', 'LA 2028 Strategic Dossier')
                  : alert('LA 2028 Strategic Dossier opened')
              }
              className="text-sky-400 hover:text-sky-300 font-semibold whitespace-nowrap"
            >
              Inspect LA 2028 Milestone Plan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
