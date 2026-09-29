import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Cpu,
  ShieldAlert,
  SlidersHorizontal,
} from 'lucide-react';
import { AI_OPERATIONAL_ALERT, READINESS_DISTRIBUTION } from '../../data/mockData';

interface ReadinessAndAlertSectionProps {
  selectedReadinessTier: string | null;
  onSelectReadinessTier: (tier: string | null) => void;
  onViewAthletesRegistry: () => void;
  onReviewRiskAthletes: () => void;
  onOpenRiskFactorsModal: () => void;
}

export const ReadinessAndAlertSection: React.FC<ReadinessAndAlertSectionProps> = ({
  selectedReadinessTier,
  onSelectReadinessTier,
  onViewAthletesRegistry,
  onReviewRiskAthletes,
  onOpenRiskFactorsModal,
}) => {
  const tierColors: Record<
    string,
    { bar: string; text: string; dot: string; border: string }
  > = {
    Ready: {
      bar: 'bg-emerald-500',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      border: 'border-emerald-500/40',
    },
    Monitor: {
      bar: 'bg-amber-500',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      border: 'border-amber-500/40',
    },
    Restricted: {
      bar: 'bg-orange-500',
      text: 'text-orange-400',
      dot: 'bg-orange-400',
      border: 'border-orange-500/40',
    },
    Unavailable: {
      bar: 'bg-rose-500',
      text: 'text-rose-400',
      dot: 'bg-rose-500',
      border: 'border-rose-500/40',
    },
  };

  const subsystemMetrics = [
    { label: 'Neuromuscular (CMJ Power)', value: 81, status: 'Nominal' },
    { label: 'Autonomic HRV (rMSSD)', value: 74, status: '3 Depressed' },
    { label: 'Metabolic & Glycogen Load', value: 79, status: 'Optimal' },
    { label: 'Sleep & Subjective Wellness', value: 76, status: 'Monitor' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left 7 Cols: ATHLETE READINESS SECTION */}
      <div className="lg:col-span-7 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-wide text-slate-100">
                  ATHLETE READINESS OVERVIEW
                </h2>
                <span className="text-xs text-slate-500">·</span>
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  n = 184 Athletes
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Morning physiological screening composite (HRV, CMJ force-plate, sleep & soreness)
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onReviewRiskAthletes}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-semibold text-amber-300 transition-colors whitespace-nowrap"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Morning Triage Console</span>
              </button>
              <button
                onClick={onViewAthletesRegistry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-medium text-sky-300 hover:text-sky-200 transition-colors whitespace-nowrap"
              >
                <span>View athletes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stacked Distribution Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Squad Availability Distribution</span>
              {selectedReadinessTier ? (
                <button
                  onClick={() => onSelectReadinessTier(null)}
                  className="text-xs text-sky-400 hover:underline font-medium"
                >
                  Clear tier filter ({selectedReadinessTier})
                </button>
              ) : (
                <span className="font-mono text-[11px] text-slate-400">
                  Click a tier to filter attention table below
                </span>
              )}
            </div>

            <div className="h-3.5 w-full rounded-md bg-slate-900 overflow-hidden flex gap-0.5 p-0.5 border border-slate-800">
              {READINESS_DISTRIBUTION.map((item) => {
                const style = tierColors[item.tier];
                const isSelected = selectedReadinessTier === item.tier;
                return (
                  <button
                    key={item.tier}
                    onClick={() =>
                      onSelectReadinessTier(isSelected ? null : item.tier)
                    }
                    style={{ width: `${item.percentage}%` }}
                    title={`${item.tier}: ${item.percentage}% (${item.athleteCount} athletes)`}
                    className={`h-full ${style.bar} first:rounded-l-sm last:rounded-r-sm transition-opacity ${
                      selectedReadinessTier && !isSelected
                        ? 'opacity-35'
                        : 'opacity-95 hover:opacity-100'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          {/* 4 Readiness Tiers Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4">
            {READINESS_DISTRIBUTION.map((item) => {
              const style = tierColors[item.tier];
              const isSelected = selectedReadinessTier === item.tier;
              return (
                <button
                  key={item.tier}
                  onClick={() =>
                    onSelectReadinessTier(isSelected ? null : item.tier)
                  }
                  className={`text-left p-3 rounded-md border transition-colors ${
                    isSelected
                      ? `${style.border} bg-[#151E2E]`
                      : 'border-slate-800/90 bg-[#0B101B] hover:bg-[#131C2E]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                      <span>{item.tier}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                      {item.rangeLabel}
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span
                      className={`text-2xl font-mono font-bold tabular-nums ${style.text}`}
                    >
                      {item.percentage}%
                    </span>
                    <span className="text-xs font-mono text-slate-400 tabular-nums">
                      {item.athleteCount} ath
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Subsystem Breakdown */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {subsystemMetrics.map((sub) => (
            <div key={sub.label} className="text-xs">
              <div className="text-slate-400 truncate text-[11px]">{sub.label}</div>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="font-mono font-semibold text-slate-200 tabular-nums">
                  {sub.value}%
                </span>
                <span className="text-[11px] text-slate-400">{sub.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right 5 Cols: AI OPERATIONAL ALERT */}
      <div className="lg:col-span-5 bg-[#0F1623] border border-amber-500/40 rounded-lg p-5 flex flex-col justify-between relative">
        <div>
          {/* Top Header */}
          <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-amber-500/15 border border-amber-500/40 flex items-center justify-center shrink-0">
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-bold tracking-wider text-amber-300">
                  {AI_OPERATIONAL_ALERT.title}
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {AI_OPERATIONAL_ALERT.timestamp}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 shrink-0">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Risk level: {AI_OPERATIONAL_ALERT.riskLevel}</span>
            </div>
          </div>

          {/* Primary Operational Message */}
          <p className="mt-3.5 text-sm font-medium text-slate-100 leading-relaxed">
            "{AI_OPERATIONAL_ALERT.message}"
          </p>

          {/* Signals List */}
          <div className="mt-3.5">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>DETECTED MULTI-VARIABLE SIGNALS</span>
              <span className="font-mono text-sky-400">
                {AI_OPERATIONAL_ALERT.confidence}
              </span>
            </div>
            <ul className="space-y-1.5">
              {AI_OPERATIONAL_ALERT.signals.map((sig) => (
                <li
                  key={sig.label}
                  className="flex items-start justify-between gap-2 text-xs py-1 px-2.5 rounded bg-[#0B101B] border border-slate-800/80"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{sig.label}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 text-right truncate max-w-[190px]">
                    {sig.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-4 pt-3.5 border-t border-slate-800/80 flex items-center gap-2.5">
          <button
            onClick={onReviewRiskAthletes}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Review Athletes</span>
          </button>

          <button
            onClick={onOpenRiskFactorsModal}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-200 font-medium text-xs transition-colors whitespace-nowrap"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
            <span>View Risk Factors</span>
          </button>
        </div>
      </div>
    </div>
  );
};
