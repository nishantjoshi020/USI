import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CalendarCheck,
  HeartPulse,
  UserCheck,
  Users,
} from 'lucide-react';

export type KpiFilterKey =
  | 'total-athletes'
  | 'active-athletes'
  | 'attention'
  | 'injuries'
  | 'readiness'
  | 'attendance';

interface KpiGridProps {
  activeKpi: KpiFilterKey | null;
  onSelectKpi: (kpi: KpiFilterKey) => void;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ activeKpi, onSelectKpi }) => {
  const kpis: {
    id: KpiFilterKey;
    label: string;
    value: string;
    subtext: string;
    deltaLabel: string;
    tone: 'neutral' | 'emerald' | 'amber' | 'rose' | 'sky';
    targetHint: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: 'total-athletes',
      label: 'Total Athletes',
      value: '184',
      subtext: '4 National Squads',
      deltaLabel: '+6 enrolled',
      tone: 'neutral',
      targetHint: 'Open Athlete Registry',
      icon: Users,
    },
    {
      id: 'active-athletes',
      label: 'Active Athletes',
      value: '162',
      subtext: '88.0% squad availability',
      deltaLabel: 'Full clearance',
      tone: 'emerald',
      targetHint: 'Filter Ready Cohort',
      icon: UserCheck,
    },
    {
      id: 'attention',
      label: 'Athletes Requiring Attention',
      value: '18',
      subtext: '3 high risk · 15 monitor',
      deltaLabel: '+3 vs yesterday',
      tone: 'amber',
      targetHint: 'Focus Attention Table',
      icon: AlertTriangle,
    },
    {
      id: 'injuries',
      label: 'Active Injuries',
      value: '4',
      subtext: '2 rehab · 1 RTP · 1 escalated',
      deltaLabel: '2.2% incidence',
      tone: 'rose',
      targetHint: 'Open Injury Intelligence',
      icon: HeartPulse,
    },
    {
      id: 'readiness',
      label: 'Average Readiness',
      value: '78%',
      subtext: '7-day mean: 80.4%',
      deltaLabel: '-2.4% vs 7d',
      tone: 'sky',
      targetHint: 'Inspect Readiness Distribution',
      icon: Activity,
    },
    {
      id: 'attendance',
      label: "Today's Attendance",
      value: '94%',
      subtext: '6 of 8 sessions completed',
      deltaLabel: 'On schedule',
      tone: 'emerald',
      targetHint: 'Focus Training Operations',
      icon: CalendarCheck,
    },
  ];

  return (
    <section aria-label="Operational Key Performance Indicators">
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
