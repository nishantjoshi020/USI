import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BarChart2,
  Bot,
  CheckCircle2,
  ChevronRight,
  Compass,
  Cpu,
  ExternalLink,
  Layers,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  User,
  X,
} from 'lucide-react';
import { NavItemId, UserRole } from '../../types/usi';
import { ROLE_DASHBOARDS_CONFIG } from '../../data/roleDashboardConfig';
import { getKpiDeepDive } from '../../data/kpiDeepDiveData';

interface KpiDeepDivePanelProps {
  selectedRole: UserRole;
  activeKpiId: string | null;
  onSelectKpi: (kpiId: string | null) => void;
  onOpenAthlete360?: (athleteId: string) => void;
  onNavigateModule?: (navId: NavItemId) => void;
  onAskCopilot?: (prompt: string) => void;
  onTriggerToast?: (msg: string) => void;
}

export const KpiDeepDivePanel: React.FC<KpiDeepDivePanelProps> = ({
  selectedRole,
  activeKpiId,
  onSelectKpi,
  onOpenAthlete360,
  onNavigateModule,
  onAskCopilot,
  onTriggerToast,
}) => {
  const [isModalExpanded, setIsModalExpanded] = useState(false);

  if (!activeKpiId) return null;

  const roleConfig =
    ROLE_DASHBOARDS_CONFIG[selectedRole] ||
    ROLE_DASHBOARDS_CONFIG['Performance Director'];
  const { kpiItem, deepDive } = getKpiDeepDive(selectedRole, activeKpiId);

  const values = deepDive.trendPoints.map((p) => p.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const span = maxVal - minVal || 1;

  const toneBadgeClass =
    kpiItem.tone === 'rose'
      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
      : kpiItem.tone === 'amber'
        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        : kpiItem.tone === 'emerald'
          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
          : 'bg-sky-500/15 text-sky-300 border-sky-500/30';

  const toneValueClass =
    kpiItem.tone === 'rose'
      ? 'text-rose-400'
      : kpiItem.tone === 'amber'
        ? 'text-amber-400'
        : kpiItem.tone === 'emerald'
          ? 'text-emerald-400'
          : 'text-sky-400';

  const renderInspectorBody = (inModal: boolean) => (
    <div
      className={`rounded-xl border border-sky-500/40 bg-gradient-to-b from-[#0E1729] via-[#0B1220] to-[#090E1A] shadow-2xl overflow-hidden transition-all ${
        inModal ? 'max-w-5xl w-full max-h-[90vh] flex flex-col' : ''
      }`}
    >
      {/* Top Bar: Persona KPI Switcher Tabs & Controls */}
      <div className="px-4 py-3 bg-[#090D16]/90 border-b border-slate-800/90 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-[11px] font-mono font-bold text-sky-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-sky-400" />
            {roleConfig.displayName} · In-Depth KPI Intelligence
          </span>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
            {deepDive.categoryBadge}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsModalExpanded(!inModal)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-[11px] font-medium text-slate-200 transition-colors"
            title={inModal ? 'Dock inline' : 'Expand full dossier modal'}
          >
            {inModal ? (
              <>
                <Minimize2 className="w-3 h-3 text-sky-400" />
                <span>Dock Inline</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3 h-3 text-sky-400" />
                <span>Expand Modal</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsModalExpanded(false);
              onSelectKpi(null);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/40 text-[11px] font-medium text-slate-300 hover:text-rose-200 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Persona KPI Quick-Switcher Strip */}
      <div className="px-4 py-2 bg-[#0B111E] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 shrink-0 mr-1">
          Switch Indicator:
        </span>
        {roleConfig.kpis.map((k) => {
          const active = k.id === kpiItem.id;
          return (
            <button
              key={k.id}
              onClick={() => onSelectKpi(k.id)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 transition-all flex items-center gap-1.5 border ${
                active
                  ? 'bg-sky-500/20 text-white border-sky-500/50 shadow-sm'
                  : 'bg-[#11192A] text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{k.label}</span>
              <span
                className={`font-mono text-[11px] font-bold ${
                  active ? 'text-sky-300' : 'text-slate-500'
                }`}
              >
                {k.value}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Content Body */}
      <div
        className={`p-5 space-y-5 ${
          inModal ? 'overflow-y-auto flex-1' : ''
        }`}
      >
        {/* Top Row: Headline Metric + Executive Context + Sensor Source */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Headline KPI Box (4 Cols) */}
          <div className="lg:col-span-4 rounded-xl bg-[#10192B] border border-slate-800/90 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {kpiItem.label}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${toneBadgeClass}`}
                >
                  {kpiItem.deltaLabel}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-3">
                <span
                  className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight tabular-nums ${toneValueClass}`}
                >
                  {kpiItem.value}
                </span>
                <span className="text-xs text-slate-400">{kpiItem.subtext}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1.5 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate font-mono">
                  {deepDive.sensorOrDataSource}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Action Lens: {kpiItem.targetHint}</span>
              </div>
            </div>
          </div>

          {/* Executive Summary & Methodology (8 Cols) */}
          <div className="lg:col-span-8 rounded-xl bg-[#10192B] border border-slate-800/90 p-4 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-sky-400" />
                  <span>
                    Persona Operational Interpretation ({selectedRole})
                  </span>
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Live Verified Telemetry
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {deepDive.executiveSummary}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#0B111E] border border-slate-800/80 space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                Methodology, Formula & Clinical/Governance Thresholds
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {deepDive.methodologyAndThresholds}
              </p>
            </div>
          </div>
        </div>

        {/* Middle Row: 4 Sub-Metrics + 7-Point Historical Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 4 Sub-Indicators (7 Cols) */}
          <div className="lg:col-span-7 rounded-xl bg-[#10192B] border border-slate-800/90 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                <span>Component Sub-Indicators & Thresholds</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                4 Granular Drivers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deepDive.subMetrics.map((sub, idx) => {
                const statusBadge =
                  sub.status === 'optimal'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : sub.status === 'warning'
                      ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      : 'bg-rose-500/15 text-rose-300 border-rose-500/30';
                return (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-[#0B111E] border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-slate-300">
                        {sub.label}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${statusBadge}`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-baseline justify-between gap-2">
                      <span className="text-lg font-mono font-bold text-white tabular-nums">
                        {sub.value}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Target: {sub.target}
                      </span>
                    </div>
                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[11px] text-slate-400 font-mono">
                      {sub.delta}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Point Trend Chart (5 Cols) */}
          <div className="lg:col-span-5 rounded-xl bg-[#10192B] border border-slate-800/90 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <BarChart2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>{deepDive.trendTitle}</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Historical trajectory across recent sampling windows
                </p>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300">
                Unit: {deepDive.trendUnit}
              </span>
            </div>

            <div className="mt-4 pt-2 flex items-end justify-between gap-2 h-36 px-1">
              {deepDive.trendPoints.map((pt, idx) => {
                const isLast = idx === deepDive.trendPoints.length - 1;
                const heightPct = Math.max(
                  22,
                  Math.min(100, Math.round(((pt.value - minVal) / span) * 70 + 28))
                );
                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center justify-end h-full group"
                  >
                    <span
                      className={`text-[10px] font-mono mb-1.5 tabular-nums ${
                        isLast
                          ? 'text-sky-300 font-bold'
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {pt.displayValue}
                    </span>
                    <div className="w-full bg-slate-800/50 rounded-t-md h-24 flex items-end overflow-hidden">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          isLast
                            ? 'bg-gradient-to-t from-sky-600 to-sky-400 shadow-lg shadow-sky-500/20'
                            : 'bg-slate-700/80 group-hover:bg-sky-500/60'
                        }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-mono mt-1.5 ${
                        isLast ? 'text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      {pt.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Table: Cohort / Athlete / Subsystem Granular Drill-Down */}
        <div className="rounded-xl bg-[#10192B] border border-slate-800/90 p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{deepDive.breakdownTitle}</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Click any row action to inspect the underlying Athlete 360 Dossier or operational module
              </p>
            </div>
            <span className="text-[11px] font-mono text-sky-400">
              {deepDive.breakdownRows.length} Records Linked
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] font-mono uppercase text-slate-400">
                  <th className="pb-2.5 pr-3">{deepDive.breakdownHeaders[0]}</th>
                  <th className="pb-2.5 px-3">{deepDive.breakdownHeaders[1]}</th>
                  <th className="pb-2.5 px-3">{deepDive.breakdownHeaders[2]}</th>
                  <th className="pb-2.5 px-3">{deepDive.breakdownHeaders[3]}</th>
                  <th className="pb-2.5 pl-3 text-right">Drill-Down Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {deepDive.breakdownRows.map((row) => {
                  const rowBadge =
                    row.statusTone === 'rose'
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : row.statusTone === 'amber'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        : row.statusTone === 'emerald'
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-sky-500/15 text-sky-300 border-sky-500/30';
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-3 pr-3">
                        <div className="font-semibold text-white">
                          {row.name}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {row.subtitle}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono font-semibold text-slate-200">
                        {row.primaryMetric}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {row.secondaryMetric}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${rowBadge}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          onClick={() => {
                            if (row.linkedAthleteId && onOpenAthlete360) {
                              setIsModalExpanded(false);
                              onOpenAthlete360(row.linkedAthleteId);
                            } else if (row.targetNav && onNavigateModule) {
                              setIsModalExpanded(false);
                              onNavigateModule(row.targetNav);
                            } else if (onTriggerToast) {
                              onTriggerToast(
                                `Opened record: ${row.name} (${row.status})`
                              );
                            }
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-[11px] font-semibold text-sky-200 transition-colors"
                        >
                          <span>{row.actionLabel}</span>
                          <ArrowUpRight className="w-3 h-3 text-sky-400" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Action Bar: Proactive Persona Recommendation + AI Copilot + Module Jump */}
        <div className="rounded-xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-emerald-500/10 border border-sky-500/30 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-sky-300 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Recommended Action for {selectedRole}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-100 font-medium leading-relaxed">
              {deepDive.personaRecommendation}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onAskCopilot && (
              <button
                onClick={() => {
                  setIsModalExpanded(false);
                  onAskCopilot(deepDive.copilotPrompt);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-500/20 hover:bg-violet-500/30 border border-violet-500/40 text-xs font-semibold text-violet-200 transition-colors"
              >
                <Bot className="w-3.5 h-3.5 text-violet-300" />
                <span>Ask AI Copilot About This KPI</span>
              </button>
            )}

            {onNavigateModule && (
              <button
                onClick={() => {
                  setIsModalExpanded(false);
                  onNavigateModule(deepDive.primaryModuleNav);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 transition-colors shadow-sm"
              >
                <span>{deepDive.primaryModuleLabel}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Inline Deep-Dive Inspector directly beneath KpiGrid */}
      <div id="kpi-deep-dive-inspector" className="scroll-mt-20">
        {renderInspectorBody(false)}
      </div>

      {/* Optional Full-Screen Modal View when user clicks "Expand Modal" */}
      {isModalExpanded && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setIsModalExpanded(false)}
        >
          <div
            className="w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {renderInspectorBody(true)}
          </div>
        </div>
      )}
    </>
  );
};
