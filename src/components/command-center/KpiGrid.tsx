import React from 'react';
import {
  Activity,
  AlertTriangle,
  Apple,
  ArrowUpRight,
  BarChart2,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Droplets,
  FileCheck,
  Globe,
  HeartPulse,
  Moon,
  ShieldCheck,
  Trophy,
  UserCheck,
  Users,
} from 'lucide-react';
import { UserRole } from '../../types/usi';
import { ROLE_DASHBOARDS_CONFIG } from '../../data/roleDashboardConfig';

export type KpiFilterKey =
  | 'total-athletes'
  | 'active-athletes'
  | 'attention'
  | 'injuries'
  | 'readiness'
  | 'attendance'
  | string;

interface KpiGridProps {
  activeKpi: KpiFilterKey | null;
  onSelectKpi: (kpi: KpiFilterKey) => void;
  selectedRole?: UserRole;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  activeKpi,
  onSelectKpi,
  selectedRole = 'Performance Director',
}) => {
  const roleConfig = ROLE_DASHBOARDS_CONFIG[selectedRole] || ROLE_DASHBOARDS_CONFIG['Performance Director'];

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Activity':
        return Activity;
      case 'AlertTriangle':
        return AlertTriangle;
      case 'Apple':
        return Apple;
      case 'BarChart2':
        return BarChart2;
      case 'Building2':
        return Building2;
      case 'CalendarCheck':
        return CalendarCheck;
      case 'CheckCircle2':
        return CheckCircle2;
      case 'Droplets':
        return Droplets;
      case 'FileCheck':
        return FileCheck;
      case 'Globe':
        return Globe;
      case 'HeartPulse':
        return HeartPulse;
      case 'Moon':
        return Moon;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Trophy':
        return Trophy;
      case 'UserCheck':
        return UserCheck;
      case 'Users':
      default:
        return Users;
    }
  };

  const kpis = roleConfig.kpis.map((kpi) => ({
    id: kpi.id,
    label: kpi.label,
    value: kpi.value,
    subtext: kpi.subtext,
    deltaLabel: kpi.deltaLabel,
    tone: kpi.tone,
    targetHint: kpi.targetHint,
    icon: getIconComponent(kpi.iconName),
  }));

  return (
    <section aria-label="Operational Key Performance Indicators">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-sky-400" />
          Active KPI Indicators: <strong className="text-slate-200">{roleConfig.displayName}</strong>
        </span>
        <span className="text-[10px] font-mono text-slate-400">
          6 Live Metrics · Click any card to inspect
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isSelected = activeKpi === kpi.id;

          const valueColor =
            kpi.tone === 'rose'
              ? 'text-rose-400'
              : kpi.tone === 'amber'
                ? 'text-amber-400'
                : kpi.tone === 'emerald'
                  ? 'text-emerald-400'
                  : 'text-slate-100';

          const iconColor =
            kpi.tone === 'rose'
              ? 'text-rose-400'
              : kpi.tone === 'amber'
                ? 'text-amber-400'
                : kpi.tone === 'emerald'
                  ? 'text-emerald-400'
                  : 'text-sky-400';

          return (
            <button
              key={kpi.id}
              onClick={() => onSelectKpi(kpi.id)}
              className={`group text-left p-4 rounded-lg bg-[#0F1623] hover:bg-[#151E2E] border transition-all duration-150 flex flex-col justify-between ${
                isSelected
                  ? 'border-sky-500 ring-1 ring-sky-500/30 bg-[#131C2D]'
                  : 'border-slate-800/90 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-1">
                    {kpi.label}
                  </span>
                  <Icon className={`w-4 h-4 shrink-0 ${iconColor}`} />
                </div>

                <div className="mt-2.5 flex items-baseline justify-between gap-2">
                  <span
                    className={`text-2xl font-mono font-bold tracking-tight tabular-nums ${valueColor}`}
                  >
                    {kpi.value}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                    {kpi.deltaLabel}
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="truncate">{kpi.subtext}</span>
                <span className="inline-flex items-center gap-0.5 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium shrink-0">
                  <ArrowUpRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
