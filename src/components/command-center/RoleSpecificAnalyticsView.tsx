import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Droplets,
  HeartPulse,
  Layers,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { UserRole } from '../../types/usi';
import { ROLE_DASHBOARDS_CONFIG, RoleAttentionItem } from '../../data/roleDashboardConfig';

interface RoleSpecificAnalyticsViewProps {
  selectedRole: UserRole;
  onOpenActionItem?: (item: RoleAttentionItem) => void;
  onNavigateSection?: (sectionKey: string) => void;
}

export const RoleSpecificAnalyticsView: React.FC<RoleSpecificAnalyticsViewProps> = ({
  selectedRole,
  onOpenActionItem,
  onNavigateSection,
}) => {
  const config = ROLE_DASHBOARDS_CONFIG[selectedRole] || ROLE_DASHBOARDS_CONFIG['Performance Director'];

  const getSeverityBadge = (severity: RoleAttentionItem['severity']) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-sky-500/20 text-sky-400 border-sky-500/40';
      case 'OPTIMAL':
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="space-y-4">
      {/* 2-Column Grid: Left is Role Specialized Analytics & Benchmarks, Right is Role Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Primary Analytics & Live Benchmarks (7 Cols) */}
        <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {config.primaryAnalyticsTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {config.primaryAnalyticsSubtitle}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono text-sky-300 self-start sm:self-center">
              Tailored to {config.displayName}
            </span>
          </div>

          {/* 4 Metric Benchmark Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {config.analyticsMetrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-[#101827] border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition-colors"
              >
                <span className="text-[11px] text-slate-400 font-medium line-clamp-1">
                  {m.name}
                </span>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className="text-lg font-bold font-mono text-white tracking-tight">
                    {m.current}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {m.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60 text-[10px]">
                  <span className="text-slate-400">Target: {m.benchmark}</span>
                  <span
                    className={`flex items-center font-mono font-semibold ${
                      m.status === 'optimal'
                        ? 'text-emerald-400'
                        : m.status === 'warning'
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {m.trend === 'up' ? (
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                    ) : m.trend === 'down' ? (
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                    ) : (
                      '●'
                    )}
                    {m.status.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Distribution Progress Spectrum */}
          <div className="bg-[#101827]/70 border border-slate-800/70 rounded-lg p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                {config.distributionTitle}
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                100% Cohort Sample
              </span>
            </div>

            {/* Stacked Bar */}
            <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
              {config.distributionData.map((d, i) => (
                <div
                  key={i}
                  style={{ width: `${d.percentage}%` }}
                  className={`${d.colorClass} h-full transition-all duration-500`}
                  title={`${d.label}: ${d.percentage}% (${d.count})`}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px]">
              {config.distributionData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-slate-300">
                  <span className={`w-2 h-2 rounded-full ${d.colorClass} shrink-0`} />
                  <span className="truncate">{d.label}:</span>
                  <span className="font-mono font-bold text-white shrink-0">
                    {d.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Persona Priority Action Queue (5 Cols) */}
        <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Priority Operational Attention Queue
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono font-bold text-amber-300">
                {config.priorityItems.length} ACTIONABLE
              </span>
            </div>

            <div className="space-y-2.5 mt-3">
              {config.priorityItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getSeverityBadge(
                        item.severity
                      )}`}
                    >
                      {item.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {item.timestamp}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-slate-100 leading-snug">
                    {item.title}
                  </h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.detail}
                  </p>

                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() =>
                        onOpenActionItem
                          ? onOpenActionItem(item)
                          : alert(`[${selectedRole}] Triggering: ${item.actionText} for "${item.title}"`)
                      }
                      className="flex items-center gap-1 px-2.5 py-1 rounded bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-[11px] font-semibold text-sky-200 transition-colors"
                    >
                      <span>{item.actionText}</span>
                      <ArrowUpRight className="w-3 h-3 text-sky-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Role Lens: <strong className="text-slate-200">{config.displayName}</strong></span>
            <button
              onClick={() => onNavigateSection && onNavigateSection('analytics-bi')}
              className="text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>Full Analytics Dossier</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
