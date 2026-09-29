import React, { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Check,
  Sparkles,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { AIRecommendation, DailyAnalyticsPoint } from '../../types/usi';

interface AiRecommendationsAndAnalyticsProps {
  recommendations: AIRecommendation[];
  onApplyRecommendation: (id: string) => void;
  onReviewRecommendation: (rec: AIRecommendation) => void;
  analyticsSeries: DailyAnalyticsPoint[];
  onOpenAnalyticsModule: () => void;
}

export const AiRecommendationsAndAnalytics: React.FC<
  AiRecommendationsAndAnalyticsProps
> = ({
  recommendations,
  onApplyRecommendation,
  onReviewRecommendation,
  analyticsSeries,
  onOpenAnalyticsModule,
}) => {
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number>(
    analyticsSeries.length - 1
  );

  const activePoint =
    analyticsSeries[hoveredDayIndex] ||
    analyticsSeries[analyticsSeries.length - 1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
      {/* Left 6 Cols: AI RECOMMENDATIONS */}
      <div className="lg:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold tracking-wide text-slate-100">
                  AI RECOMMENDATIONS
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Explainable decision support generated from workload, autonomic & medical signals
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              {recommendations.filter((r) => r.applied).length}/{recommendations.length} Applied
            </span>
          </div>

          <div className="mt-3.5 space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={rec.id}
                className={`p-3.5 rounded-md border transition-colors ${
                  rec.applied
                    ? 'bg-emerald-950/15 border-emerald-500/40'
                    : 'bg-[#0B101B] border-slate-800/90 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 font-semibold">
                      0{idx + 1}.
                    </span>
                    <span
                      className={`font-semibold ${
                        rec.priority === 'High'
                          ? 'text-amber-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {rec.priority} Priority
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">
                      {rec.targetLabel}
                    </span>
                  </div>

                  {rec.applied && (
                    <span className="text-[11px] font-mono text-emerald-400">
                      Logged {rec.appliedAt}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs font-semibold text-slate-100 leading-relaxed">
                  "{rec.statement}"
                </p>

                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  {rec.explanation}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400">
                    Impact: <strong className="text-slate-300 font-normal">{rec.expectedImpact}</strong>
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onReviewRecommendation(rec)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-slate-800/90 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
                    >
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>Review</span>
                    </button>

                    <button
                      onClick={() => onApplyRecommendation(rec.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold transition-colors whitespace-nowrap ${
                        rec.applied
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                          : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                      }`}
                    >
                      {rec.applied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Recommendation Applied ✓</span>
                          <RotateCcw className="w-3 h-3 ml-1 opacity-70" />
                        </>
                      ) : (
                        <span>Apply Recommendation</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right 6 Cols: ANALYTICS PREVIEW */}
      <div className="lg:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-slate-800/80">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold tracking-wide text-slate-100">
                  ANALYTICS PREVIEW (14-DAY TELEMETRY)
                </h2>
              </div>
              <div className="text-xs text-sky-400 font-medium mt-0.5">
                National Program → Football → Senior Squad
              </div>
            </div>

            <button
              onClick={onOpenAnalyticsModule}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-xs font-medium text-sky-300 hover:text-sky-200 transition-colors whitespace-nowrap"
            >
              <span>Open Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Day Scrub Header */}
          <div className="mt-3 px-3 py-2 rounded bg-[#0B101B] border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono tabular-nums">
            <span className="text-slate-300 font-semibold">
              Date: {activePoint.date}
            </span>
            <div className="flex items-center gap-4">
              <span className="text-emerald-400">
                Readiness: <strong>{activePoint.readinessPct}%</strong>
              </span>
              <span className="text-sky-400">
                Load: <strong>{activePoint.trainingLoadAu} AU</strong> (ACWR {activePoint.acwr.toFixed(2)})
              </span>
              <span className="text-rose-400">
                Active Injuries: <strong>{activePoint.activeInjuries}</strong>
              </span>
            </div>
          </div>

          {/* 3 Compact 14-Day Charts Stacked */}
          <div className="mt-3.5 space-y-3.5">
            {/* 1. Readiness Trend */}
            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">
                  Readiness Trend (14-Day Squad Mean)
                </span>
                <span className="font-mono text-emerald-400 tabular-nums">
                  Current: 78% · Baseline: 80%
                </span>
              </div>
              <div className="h-14 flex items-end gap-1.5 pt-2">
                {analyticsSeries.map((pt, idx) => {
                  const heightPct = Math.max(25, ((pt.readinessPct - 60) / 35) * 100);
                  const isHovered = idx === hoveredDayIndex;
                  return (
                    <button
                      key={pt.date}
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setHoveredDayIndex(idx)}
                      className="flex-1 h-full flex flex-col justify-end items-center group focus:outline-none"
                    >
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-sm transition-colors ${
                          isHovered
                            ? 'bg-emerald-400'
                            : pt.readinessPct >= 80
                              ? 'bg-emerald-500/60 group-hover:bg-emerald-400/80'
                              : 'bg-amber-500/70 group-hover:bg-amber-400'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                <span>{analyticsSeries[0].shortDate}</span>
                <span>{analyticsSeries[6].shortDate}</span>
                <span>{analyticsSeries[13].shortDate}</span>
              </div>
            </div>

            {/* 2. Training Load Trend */}
            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">
                  Training Load Trend (Daily Squad sRPE AU)
                </span>
                <span className="font-mono text-sky-400 tabular-nums">
                  Today: 2,480 AU · ACWR 1.04
                </span>
              </div>
              <div className="h-14 flex items-end gap-1.5 pt-2">
                {analyticsSeries.map((pt, idx) => {
                  const heightPct = Math.max(15, (pt.trainingLoadAu / 3000) * 100);
                  const isHovered = idx === hoveredDayIndex;
                  return (
                    <button
                      key={pt.date}
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setHoveredDayIndex(idx)}
                      className="flex-1 h-full flex flex-col justify-end items-center group focus:outline-none"
                    >
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-sm transition-colors ${
                          isHovered
                            ? 'bg-sky-400'
                            : pt.trainingLoadAu > 2650
                              ? 'bg-amber-500/75 group-hover:bg-amber-400'
                              : 'bg-sky-500/60 group-hover:bg-sky-400/80'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                <span>{analyticsSeries[0].shortDate}</span>
                <span>{analyticsSeries[6].shortDate}</span>
                <span>{analyticsSeries[13].shortDate}</span>
              </div>
            </div>

            {/* 3. Injury & Elevated Risk Trend */}
            <div className="p-3 rounded-md bg-[#0B101B] border border-slate-800/80">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-semibold text-slate-200">
                  Injury & Elevated Risk Caseload Trend
                </span>
                <span className="font-mono text-rose-400 tabular-nums">
                  4 Active Injuries · 3 High Risk Flags
                </span>
              </div>
              <div className="h-12 flex items-end gap-1.5 pt-2">
                {analyticsSeries.map((pt, idx) => {
                  const heightPct = (pt.activeInjuries / 5) * 100;
                  const isHovered = idx === hoveredDayIndex;
                  return (
                    <button
                      key={pt.date}
                      onMouseEnter={() => setHoveredDayIndex(idx)}
                      onClick={() => setHoveredDayIndex(idx)}
                      className="flex-1 h-full flex flex-col justify-end items-center group focus:outline-none"
                    >
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-t-sm transition-colors ${
                          isHovered
                            ? 'bg-rose-400'
                            : pt.activeInjuries >= 4
                              ? 'bg-rose-500/80'
                              : 'bg-rose-500/45 group-hover:bg-rose-400/70'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1 tabular-nums">
                <span>{analyticsSeries[0].shortDate}</span>
                <span>{analyticsSeries[6].shortDate}</span>
                <span>{analyticsSeries[13].shortDate}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
