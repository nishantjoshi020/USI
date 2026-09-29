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
import { Athlete, Injury, NutritionPlan, TrainingSession, UserRole } from '../../types/usi';
import { ROLE_DASHBOARDS_CONFIG } from '../../data/roleDashboardConfig';
import { computeDynamicRoleMetrics } from '../../utils/dynamicMetrics';

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
  athletes?: Athlete[];
  injuries?: Injury[];
  sessions?: TrainingSession[];
  nutritionPlans?: NutritionPlan[];
  activeAthlete?: Athlete | null;
}

export const KpiGrid: React.FC<KpiGridProps> = ({
  activeKpi,
  onSelectKpi,
  selectedRole = 'Performance Director',
  athletes = [],
  injuries = [],
  sessions = [],
  nutritionPlans = [],
  activeAthlete = null,
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

  const dynamicMetrics = React.useMemo(() => {
    return computeDynamicRoleMetrics(
      selectedRole,
      athletes,
      injuries,
      sessions,
      nutritionPlans,
      activeAthlete
    );
  }, [selectedRole, athletes, injuries, sessions, nutritionPlans, activeAthlete]);

  const kpis = dynamicMetrics.kpis.map((kpi) => ({
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
        <span className="text-[10px] font-mono text-sky-400/90">
          6 Live Metrics · Click any indicator for in-depth breakdown & PDF/CSV export
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
              aria-expanded={isSelected}
              className={`group text-left p-4 rounded-lg bg-[#0F1623] hover:bg-[#151E2E] border transition-all duration-150 flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-sky-400 ring-2 ring-sky-500/30 bg-[#131E33] shadow-lg shadow-sky-950/50'
                  : 'border-slate-800/90 hover:border-sky-500/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors line-clamp-1">
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

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 space-y-1.5">
                <div className="text-[11px] text-slate-400 truncate">
                  {kpi.subtext}
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span
                    className={
                      isSelected
                        ? 'text-sky-300 font-bold'
                        : 'text-slate-500 group-hover:text-sky-400 transition-colors'
                    }
                  >
                    {isSelected ? '● Inspecting Breakdown' : kpi.targetHint}
                  </span>
                  <ArrowUpRight
                    className={`w-3 h-3 shrink-0 transition-transform ${
                      isSelected
                        ? 'text-sky-300 translate-x-0.5 -translate-y-0.5'
                        : 'text-slate-500 group-hover:text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5'
                    }`}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
