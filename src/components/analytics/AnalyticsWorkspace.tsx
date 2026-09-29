import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bot,
  Calendar,
  Check,
  CheckCircle2,
  ChevronRight,
  Download,
  FileText,
  Layers,
  Loader2,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import {
  AIInsight,
  AnalyticsHierarchyLevel,
  Athlete,
  DailyAnalyticsPoint,
  Injury,
  NavItemId,
  NutritionPlan,
  Report,
  TestResult,
  UserRole,
} from '../../types/usi';
import {
  AI_ANALYTICS_INSIGHTS,
  ARJUN_INTEGRATED_CORRELATION_TIMELINE,
} from '../../data/intelligenceMockData';

export type AnalyticsSubTab =
  | 'analytics-bi'
  | 'analytics-federation'
  | 'analytics-sport'
  | 'analytics-program'
  | 'analytics-squad'
  | 'analytics-athlete'
  | 'analytics-reports';

interface AnalyticsWorkspaceProps {
  activeSubTab: AnalyticsSubTab;
  onSelectSubTab: (tab: AnalyticsSubTab) => void;
  selectedRole: UserRole;
  athletes: Athlete[];
  injuries: Injury[];
  nutritionPlans: NutritionPlan[];
  testResults: TestResult[];
  analyticsSeries: DailyAnalyticsPoint[];
  reports: Report[];
  onCreateReport: (rep: Report) => void;
  onNavigateModule: (nav: NavItemId) => void;
  onOpenAthlete360: (athleteId: string) => void;
  onTriggerToast: (msg: string) => void;
}

export const AnalyticsWorkspace: React.FC<AnalyticsWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  selectedRole,
  athletes,
  injuries,
  nutritionPlans,
  testResults,
  analyticsSeries,
  reports,
  onCreateReport,
  onNavigateModule,
  onOpenAthlete360,
  onTriggerToast,
}) => {
  // Determine active hierarchy level from subTab (Sections 21 & 23)
  const currentLevel: AnalyticsHierarchyLevel =
    selectedRole === 'Athlete'
      ? 'Athlete'
      : activeSubTab === 'analytics-sport'
        ? 'Sport'
        : activeSubTab === 'analytics-program'
          ? 'Program'
          : activeSubTab === 'analytics-squad'
            ? 'Squad'
            : activeSubTab === 'analytics-athlete'
              ? 'Athlete'
              : 'Federation';

  const isReportsView = activeSubTab === 'analytics-reports';

  // 27. KPI Intelligence Drill-Down State
  const [activeKpiDrilldown, setActiveKpiDrilldown] = useState<
    'readiness' | 'injuries' | null
  >('readiness');

  // 29 & 30. Report Builder & Export Workflow State
  const [reportName, setReportName] = useState(
    'Senior Squad Performance Review'
  );
  const [reportScope, setReportScope] = useState('Football → Senior Squad');
  const [reportMetrics, setReportMetrics] = useState<string[]>([
    'Readiness',
    'Training Load',
    'Injuries',
    'Attendance',
    'Assessments',
    'Nutrition',
  ]);
  const [reportDateRange, setReportDateRange] = useState('Last 30 Days');
  const [reportFilters, setReportFilters] = useState(
    'Active & Restricted Athletes'
  );
  const [reportFormat, setReportFormat] = useState<'PDF' | 'Excel' | 'CSV'>(
    'PDF'
  );
  const [previewReport, setPreviewReport] = useState<Report | null>(null);

  // 30. Export Modal Workflow State
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel' | 'CSV'>(
    'PDF'
  );
  const [exportState, setExportState] = useState<
    'idle' | 'generating' | 'ready'
  >('idle');

  const [selectedAnalyticsAthleteId, setSelectedAnalyticsAthleteId] =
    useState<string>('ath-arjun-mehta');

  const activeAthlete =
    athletes.find((a) => a.id === selectedAnalyticsAthleteId) ||
    athletes.find((a) => a.id === 'ath-arjun-mehta') ||
    athletes[0];
  const activeAthletePlan =
    nutritionPlans.find((p) => p.athleteId === activeAthlete.id) ||
    nutritionPlans[0];
  const activeAthleteInjuries = injuries.filter(
    (i) => i.athleteId === activeAthlete.id
  );

  const handleSelectLevel = (level: AnalyticsHierarchyLevel) => {
    const map: Record<AnalyticsHierarchyLevel, AnalyticsSubTab> = {
      Federation: 'analytics-federation',
      Sport: 'analytics-sport',
      Program: 'analytics-program',
      Squad: 'analytics-squad',
      Athlete: 'analytics-athlete',
    };
    onSelectSubTab(map[level]);
  };

  const handleStartGenerateReport = () => {
    setExportState('generating');
    setTimeout(() => {
      setExportState('ready');
    }, 900);
  };

  // Dynamic KPIs for the shared hierarchical analytics engine (Sections 22, 24, 25, 26)
  const getLevelKpis = () => {
    if (currentLevel === 'Federation') {
      return [
        { label: 'Athletes', value: '184', sub: 'Across 8 Olympic/National programs' },
        { label: 'Active Programs', value: '8', sub: 'Football, Athletics, Hockey, etc.' },
        {
          label: 'Average Readiness',
          value: '78%',
          sub: 'Click to drill into Readiness tiers',
          drill: 'readiness' as const,
        },
        {
          label: 'Active Injuries',
          value: String(injuries.length),
          sub: 'Click to drill into Injury distribution',
          drill: 'injuries' as const,
        },
        { label: 'Training Compliance', value: '94%', sub: 'Session & RPE completion' },
        { label: 'Assessment Completion', value: '91%', sub: '142 athletes tested this cycle' },
        { label: 'Nutrition Compliance', value: '84%', sub: '162 active fueling plans' },
      ];
    }
    if (currentLevel === 'Sport') {
      return [
        { label: 'Athletes (Football)', value: '64', sub: 'Senior, U23 & U19 squads' },
        {
          label: 'Average Readiness',
          value: '76%',
          sub: 'Click for Readiness Distribution',
          drill: 'readiness' as const,
        },
        {
          label: 'Injury Rate',
          value: '6.2%',
          sub: '4 active cases · Click for breakdown',
          drill: 'injuries' as const,
        },
        { label: 'Training Compliance', value: '93%', sub: 'High-speed GPS verified' },
        { label: 'Assessment Completion', value: '94%', sub: '8 athletes pending' },
        { label: 'Nutrition Compliance', value: '81%', sub: 'Hydration compliance 76%' },
      ];
    }
    if (currentLevel === 'Program') {
      return [
        { label: "Senior Men's Program", value: '46', sub: 'Senior A & Reserve Pool' },
        {
          label: 'Average Readiness',
          value: '77%',
          sub: 'Click for Readiness Distribution',
          drill: 'readiness' as const,
        },
        {
          label: 'Active Injuries',
          value: '3',
          sub: 'Hamstring (2), Ankle (1)',
          drill: 'injuries' as const,
        },
        { label: 'Training Compliance', value: '95%', sub: 'Competition Block 3' },
        { label: 'Assessment Completion', value: '95%', sub: 'September Cycle' },
        { label: 'Nutrition Compliance', value: '83%', sub: 'Performance fueling active' },
      ];
    }
    if (currentLevel === 'Squad') {
      return [
        { label: 'Senior Squad Athletes', value: '28', sub: 'Matchday Pool' },
        {
          label: 'Readiness Distribution',
          value: '78%',
          sub: '8 athletes below 70%',
          drill: 'readiness' as const,
        },
        { label: 'Training Load (Mean)', value: '2,480 AU', sub: '12 athletes elevated load' },
        {
          label: 'Injury Distribution',
          value: '4 Restricted',
          sub: 'Hamstring (2), Ankle (1), Shoulder (1)',
          drill: 'injuries' as const,
        },
        { label: 'Attendance', value: '94%', sub: 'Today across 4 pitch/gym blocks' },
        { label: 'Assessment Progress', value: '96%', sub: 'Force-Plate & Sprint battery' },
        { label: 'Nutrition Compliance', value: '84%', sub: 'Mean squad adherence' },
      ];
    }
    // Athlete Level (Dynamic Selected Athlete)
    const activeInj = activeAthleteInjuries[0];
    return [
      {
        label: `Readiness (${activeAthlete.name})`,
        value: `${activeAthlete.readiness}%`,
        sub: `${activeAthlete.status} Tier (${activeAthlete.readinessDelta >= 0 ? '+' : ''}${activeAthlete.readinessDelta}% vs 7d)`,
      },
      {
        label: 'Training Load',
        value: `${activeAthlete.trainingLoad}`,
        sub: `${activeAthlete.acuteLoadAu} AU · ACWR ${activeAthlete.acwr.toFixed(2)}`,
      },
      {
        label: 'Recovery',
        value: `${activeAthlete.recovery}%`,
        sub: `HRV ${activeAthlete.hrvMs}ms · Sleep ${activeAthlete.sleepFormatted}`,
      },
      {
        label: 'Injury Status',
        value: activeInj ? activeInj.stage.split('(')[0].trim() : 'Cleared',
        sub: activeInj
          ? `${activeInj.bodyPart} (${activeInj.rehabCompliancePct}% comp.)`
          : 'No active time-loss pathology',
      },
      {
        label: 'Nutrition & Hydration',
        value: `${activeAthletePlan?.compliancePct ?? activeAthlete.nutritionCompliancePct}%`,
        sub: `Hydration ${activeAthletePlan?.hydrationCompliancePct ?? 85}% (${activeAthletePlan?.hydrationIntakeL ?? activeAthlete.hydrationLiters}L/${activeAthletePlan?.hydrationTargetL ?? activeAthlete.hydrationTargetLiters}L)`,
      },
      {
        label: 'Performance Score',
        value: `${activeAthlete.performanceScore}`,
        sub: `Talent Index ${activeAthlete.talentIndex} (${activeAthlete.pathwayStage})`,
      },
      {
        label: 'Assessments (30m / CMJ)',
        value: `${activeAthlete.performanceMetrics.sprint30m.current} / ${activeAthlete.performanceMetrics.cmj.current}`,
        sub: `Yo-Yo ${activeAthlete.performanceMetrics.yoYoIr2.current}`,
      },
    ];
  };

  // 36. UX Principles Context Framing
  const getUxContextGuide = () => {
    switch (currentLevel) {
      case 'Federation':
        return {
          where: 'National High Performance Program (Federation Executive Level)',
          what: '184 athletes across 8 national programs',
          changed: 'Readiness holding at 78%; Football workload up +9% in pre-competition phase',
          why: 'Identifies cross-sport resource bottlenecks and medical risk concentration',
          next: 'Click "Football" below to drill down into Sport-level analytics',
        };
      case 'Sport':
        return {
          where: 'Federation / Football',
          what: '64 Football athletes across Senior, U23, and U19 squads',
          changed: 'Assessment completion reached 94% (8 pending); Injury rate at 6.2%',
          why: 'Compares Senior vs U23 readiness and nutritional compliance',
          next: 'Click "Senior Men\'s Program" to drill down into Program analytics',
        };
      case 'Program':
        return {
          where: "Federation / Football / Senior Men's Program",
          what: '46 Senior Program athletes in Competition Block 3',
          changed: 'High-speed running volume increased +14% over 14-day microcycle',
          why: 'Balances peak tactical readiness against posterior-chain tissue load',
          next: 'Click "Senior Squad" to inspect Squad operational signals',
        };
      case 'Squad':
        return {
          where: "Federation / Football / Senior Men's Program / Senior Squad",
          what: '28 Senior Squad matchday athletes',
          changed: 'Readiness declined 5% over 7 days; 12 athletes show elevated workload',
          why: '4 athletes are medically restricted and 8 sit below 70% readiness',
          next: 'Click "Arjun Mehta" to inspect integrated Athlete cross-module intelligence',
        };
      case 'Athlete':
        return {
          where: `Federation / ${activeAthlete.sport} / ${activeAthlete.program} / ${activeAthlete.squad} / ${activeAthlete.name}`,
          what: `Integrated 360° telemetry for ${activeAthlete.name} (${activeAthlete.athleteId})`,
          changed: `Readiness ${activeAthlete.readiness}%, Load ${activeAthlete.acuteLoadAu} AU, Hydration ${activeAthletePlan?.hydrationCompliancePct ?? 82}%, 30m Sprint ${activeAthlete.performanceMetrics.sprint30m.current}`,
          why:
            activeAthleteInjuries.length > 0
              ? `Active ${activeAthleteInjuries[0].bodyPart} rehab + ${activeAthlete.trainingLoad} load requires pre-session review`
              : `Maintaining ${activeAthlete.status} readiness and optimal neuromuscular output`,
          next: 'Use [Review Training], [Review Medical], or [Review Recovery] in the AI Cross-Module Insight',
        };
    }
  };

  const uxGuide = getUxContextGuide();
  const levelKpis = getLevelKpis();

  return (
    <div className="space-y-5">
      {/* 21, 22, 23, 36. HEADER + PERSISTENT HIERARCHY BREADCRUMB DRILL-DOWN */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <BarChart3 className="w-4 h-4" />
              <span>National High Performance Program · Connected Intelligence Layer</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1 uppercase">
              {isReportsView
                ? 'ANALYTICS REPORT BUILDER & EXPORT'
                : currentLevel === 'Federation'
                  ? 'FEDERATION PERFORMANCE ANALYTICS'
                  : `${currentLevel.toUpperCase()} PERFORMANCE ANALYTICS`}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onSelectSubTab('analytics-reports')}
              className={`px-3.5 py-2 rounded-md text-xs font-semibold border transition-colors ${
                isReportsView
                  ? 'bg-sky-500 text-slate-950 border-sky-400'
                  : 'bg-[#090D16] text-slate-200 border-slate-700 hover:bg-slate-800'
              }`}
            >
              Report Builder & Schedules
            </button>
            <button
              onClick={() => {
                setExportState('idle');
                setIsExportModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
          </div>
        </div>

        {/* 23 & 36. INTERACTIVE HIERARCHICAL BREADCRUMB DRILL-DOWN BAR */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-[11px] font-mono text-slate-400 mr-1">
              Hierarchy Drill-Down:
            </span>
            {(
              selectedRole === 'Athlete'
                ? [
                    {
                      level: 'Athlete' as AnalyticsHierarchyLevel,
                      label: 'My Longitudinal Analytics (Arjun Mehta)',
                    },
                  ]
                : selectedRole === 'Coach'
                ? [
                    {
                      level: 'Squad' as AnalyticsHierarchyLevel,
                      label: 'Senior Squad',
                    },
                    {
                      level: 'Athlete' as AnalyticsHierarchyLevel,
                      label: activeAthlete.name,
                    },
                  ]
                : [
                    {
                      level: 'Federation' as AnalyticsHierarchyLevel,
                      label: 'Federation (National HP Program)',
                    },
                    { level: 'Sport' as AnalyticsHierarchyLevel, label: 'Football' },
                    {
                      level: 'Program' as AnalyticsHierarchyLevel,
                      label: "Senior Men's Program",
                    },
                    {
                      level: 'Squad' as AnalyticsHierarchyLevel,
                      label: 'Senior Squad',
                    },
                    {
                      level: 'Athlete' as AnalyticsHierarchyLevel,
                      label: activeAthlete.name,
                    },
                  ]
            ).map((crumb, idx) => {
              const active = !isReportsView && currentLevel === crumb.level;
              return (
                <React.Fragment key={crumb.level}>
                  {idx > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <button
                    onClick={() => handleSelectLevel(crumb.level)}
                    className={`px-2.5 py-1.5 rounded font-medium transition-colors ${
                      active
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold'
                        : 'bg-[#090D16] text-slate-300 hover:text-white border border-slate-800'
                    }`}
                  >
                    {crumb.label}
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          {!isReportsView && currentLevel !== 'Athlete' && (
            <button
              onClick={() => {
                const order: AnalyticsHierarchyLevel[] = [
                  'Federation',
                  'Sport',
                  'Program',
                  'Squad',
                  'Athlete',
                ];
                const next =
                  order[Math.min(order.length - 1, order.indexOf(currentLevel) + 1)];
                handleSelectLevel(next);
              }}
              className="text-xs font-mono text-sky-400 hover:underline flex items-center gap-1"
            >
              <span>Drill Down Next Level</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* 36. UX PRINCIPLES CONTEXT STRIP (WHERE / WHAT / CHANGED / WHY / NEXT) */}
        {!isReportsView && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2.5 pt-2 text-[11px]">
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
              <span className="font-mono text-sky-400 block uppercase">
                WHERE am I?
              </span>
              <strong className="text-slate-100 mt-0.5 block">
                {uxGuide.where}
              </strong>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
              <span className="font-mono text-sky-400 block uppercase">
                WHAT am I looking at?
              </span>
              <strong className="text-slate-200 mt-0.5 block">
                {uxGuide.what}
              </strong>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
              <span className="font-mono text-amber-400 block uppercase">
                WHAT changed?
              </span>
              <strong className="text-slate-200 mt-0.5 block">
                {uxGuide.changed}
              </strong>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
              <span className="font-mono text-emerald-400 block uppercase">
                WHY does it matter?
              </span>
              <strong className="text-slate-200 mt-0.5 block">
                {uxGuide.why}
              </strong>
            </div>
            <div className="p-2.5 rounded bg-[#0B101B] border border-slate-800">
              <span className="font-mono text-sky-300 block uppercase">
                WHAT can I do next?
              </span>
              <strong className="text-slate-200 mt-0.5 block">
                {uxGuide.next}
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================
       * SHARED HIERARCHICAL ANALYTICS ENGINE (FEDERATION → SPORT → PROGRAM → SQUAD → ATHLETE)
       * ========================================================= */}
      {!isReportsView && (
        <>
          {/* Dynamic KPI Cards for Current Hierarchy Level */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
            {levelKpis.map((kpi) => {
              const isDrillActive =
                kpi.drill && activeKpiDrilldown === kpi.drill;
              return (
                <button
                  key={kpi.label}
                  onClick={() => {
                    if (kpi.drill) {
                      setActiveKpiDrilldown(kpi.drill);
                      onTriggerToast(
                        `Opened KPI Intelligence Drill-Down: ${kpi.label}`
                      );
                    }
                  }}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    isDrillActive
                      ? 'bg-sky-500/15 border-sky-400'
                      : 'bg-[#0F1623] border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[11px] text-slate-400 font-medium">
                    {kpi.label}
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                    {kpi.value}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {kpi.sub}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 27. KPI INTELLIGENCE DRILL-DOWN PANEL + HIERARCHY SELECTOR */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Left: Interactive Hierarchy Drill-Down Cards */}
            <div className="xl:col-span-7 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm font-bold text-slate-100 uppercase">
                    {currentLevel === 'Federation' &&
                      'FEDERATION SPORTS COMPARISON (CLICK FOOTBALL TO DRILL DOWN)'}
                    {currentLevel === 'Sport' &&
                      'FOOTBALL PROGRAMS & SQUAD COMPARISON (CLICK TO DRILL DOWN)'}
                    {currentLevel === 'Program' &&
                      "SENIOR MEN'S PROGRAM SQUAD BREAKDOWN (CLICK SENIOR SQUAD)"}
                    {currentLevel === 'Squad' &&
                      'SENIOR SQUAD OPERATIONAL SIGNALS & ATHLETE ROSTER (CLICK ANY ATHLETE)'}
                    {currentLevel === 'Athlete' &&
                      `INTEGRATED ATHLETE INTELLIGENCE TIMELINE — ${activeAthlete.name.toUpperCase()}`}
                  </h2>
                </div>
                {currentLevel === 'Athlete' && selectedRole !== 'Athlete' && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400 font-mono text-[11px]">
                      Select Athlete:
                    </span>
                    <select
                      value={activeAthlete.id}
                      onChange={(e) => setSelectedAnalyticsAthleteId(e.target.value)}
                      className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-700 text-sky-300 font-semibold focus:outline-none focus:border-sky-500"
                    >
                      {athletes.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.position})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {currentLevel === 'Federation' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    {
                      sport: 'Football',
                      athletes: 64,
                      readiness: '76%',
                      injuryRate: '6.2%',
                      trainingComp: '93%',
                      assessComp: '94%',
                      nutrComp: '81%',
                      clickable: true,
                    },
                    {
                      sport: 'Athletics (Track & Sprints)',
                      athletes: 48,
                      readiness: '81%',
                      injuryRate: '4.1%',
                      trainingComp: '96%',
                      assessComp: '92%',
                      nutrComp: '88%',
                      clickable: false,
                    },
                    {
                      sport: "Men's & Women's Hockey",
                      athletes: 42,
                      readiness: '79%',
                      injuryRate: '4.8%',
                      trainingComp: '94%',
                      assessComp: '89%',
                      nutrComp: '85%',
                      clickable: false,
                    },
                    {
                      sport: 'Badminton & Court Programs',
                      athletes: 30,
                      readiness: '80%',
                      injuryRate: '3.3%',
                      trainingComp: '95%',
                      assessComp: '90%',
                      nutrComp: '86%',
                      clickable: false,
                    },
                  ].map((sp) => (
                    <button
                      key={sp.sport}
                      onClick={() => handleSelectLevel('Sport')}
                      className="p-4 rounded bg-[#0B101B] border border-slate-800 hover:border-sky-500 text-left space-y-2 transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-sm text-slate-100">
                          {sp.sport}
                        </strong>
                        <span className="font-mono text-sky-400">
                          {sp.athletes} Athletes →
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 font-mono text-[11px] text-slate-300">
                        <div>Readiness: {sp.readiness}</div>
                        <div>Injuries: {sp.injuryRate}</div>
                        <div>Assess: {sp.assessComp}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {currentLevel === 'Sport' && (
                <div className="space-y-3 text-xs">
                  {[
                    {
                      name: "Senior Men's Program (Senior Squad)",
                      athletes: 28,
                      readiness: '78%',
                      load: 'High (2,480 AU)',
                      nutrition: '84%',
                      nextLevel: 'Program' as AnalyticsHierarchyLevel,
                    },
                    {
                      name: 'U23 National Development Program',
                      athletes: 22,
                      readiness: '75%',
                      load: 'Moderate (2,120 AU)',
                      nutrition: '79%',
                      nextLevel: 'Squad' as AnalyticsHierarchyLevel,
                    },
                    {
                      name: 'U19 Elite Academy Pathway',
                      athletes: 14,
                      readiness: '76%',
                      load: 'Normal (1,890 AU)',
                      nutrition: '80%',
                      nextLevel: 'Squad' as AnalyticsHierarchyLevel,
                    },
                  ].map((sq) => (
                    <button
                      key={sq.name}
                      onClick={() => handleSelectLevel(sq.nextLevel)}
                      className="w-full p-4 rounded bg-[#0B101B] border border-slate-800 hover:border-sky-500 text-left flex flex-wrap items-center justify-between gap-3"
                    >
                      <div>
                        <div className="font-bold text-slate-100 text-sm">
                          {sq.name}
                        </div>
                        <div className="text-slate-400 font-mono text-[11px] mt-0.5">
                          {sq.athletes} Athletes · Readiness {sq.readiness} ·
                          Nutrition {sq.nutrition}
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded bg-sky-500/20 text-sky-300 font-semibold">
                        Drill into Program →
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentLevel === 'Program' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded bg-[#0B101B] border border-sky-500/40 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-slate-100">
                        Senior Squad (First Team Matchday Pool)
                      </div>
                      <div className="text-slate-400 mt-0.5">
                        28 Athletes · Readiness 78% · 4 Active Injuries · 94% Attendance
                      </div>
                    </div>
                    <button
                      onClick={() => handleSelectLevel('Squad')}
                      className="px-3.5 py-2 rounded bg-sky-500 text-slate-950 font-semibold"
                    >
                      Drill into Senior Squad →
                    </button>
                  </div>
                </div>
              )}

              {/* 25. SQUAD ANALYTICS: TOP OPERATIONAL SIGNALS + CLICK ARJUN */}
              {currentLevel === 'Squad' && (
                <div className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded bg-amber-950/20 border border-amber-500/40">
                      <span className="font-mono text-[10px] text-amber-400 uppercase">
                        TOP OPERATIONAL SIGNAL 1
                      </span>
                      <strong className="text-slate-100 block mt-1">
                        12 athletes have elevated workload.
                      </strong>
                    </div>
                    <div className="p-3.5 rounded bg-rose-950/20 border border-rose-500/40">
                      <span className="font-mono text-[10px] text-rose-400 uppercase">
                        TOP OPERATIONAL SIGNAL 2
                      </span>
                      <strong className="text-slate-100 block mt-1">
                        4 athletes are medically restricted.
                      </strong>
                    </div>
                    <div className="p-3.5 rounded bg-sky-950/20 border border-sky-500/40">
                      <span className="font-mono text-[10px] text-sky-400 uppercase">
                        TOP OPERATIONAL SIGNAL 3
                      </span>
                      <strong className="text-slate-100 block mt-1">
                        8 athletes have readiness below 70%.
                      </strong>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                    <div className="font-bold text-slate-300 uppercase">
                      Select Squad Athlete to Drill into Athlete Analytics ({athletes.length}):
                    </div>
                    {athletes.map((ath) => (
                      <button
                        key={ath.id}
                        onClick={() => {
                          setSelectedAnalyticsAthleteId(ath.id);
                          handleSelectLevel('Athlete');
                        }}
                        className="w-full p-3 rounded bg-[#0B101B] border border-slate-800 hover:border-sky-500 flex items-center justify-between text-left transition-colors"
                      >
                        <div>
                          <strong className="text-slate-100">{ath.name}</strong>
                          <span className="ml-2 font-mono text-slate-400">
                            {ath.athleteId} · {ath.position} · Readiness {ath.readiness}% · Load{' '}
                            {ath.trainingLoad}
                          </span>
                        </div>
                        <span className="text-sky-400 font-semibold">
                          Athlete Analytics →
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 26. ATHLETE ANALYTICS (DYNAMIC CORRELATION TIMELINE) */}
              {currentLevel === 'Athlete' && (
                <div className="space-y-3 text-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-[#0B101B] border-b border-slate-800 text-[10px] font-mono text-slate-400 uppercase">
                          <th className="py-2 px-2.5">Date</th>
                          <th className="py-2 px-2.5">Training</th>
                          <th className="py-2 px-2.5">Medical</th>
                          <th className="py-2 px-2.5">Recovery</th>
                          <th className="py-2 px-2.5">Assessment</th>
                          <th className="py-2 px-2.5">Nutrition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/70">
                        {(activeAthlete.id === 'ath-arjun-mehta'
                          ? ARJUN_INTEGRATED_CORRELATION_TIMELINE
                          : [
                              {
                                date: 'Today',
                                training: `${activeAthlete.recentSessions[0]?.title || 'Squad Session'} (${activeAthlete.acuteLoadAu} AU)`,
                                medical:
                                  activeAthleteInjuries[0]
                                    ? `${activeAthleteInjuries[0].bodyPart} — ${activeAthleteInjuries[0].stage}`
                                    : `${activeAthlete.medicalStatus} (No restriction)`,
                                recovery: `Readiness ${activeAthlete.readiness}% · HRV ${activeAthlete.hrvMs}ms · Sleep ${activeAthlete.sleepFormatted}`,
                                assessment: `30m: ${activeAthlete.performanceMetrics.sprint30m.current} · CMJ: ${activeAthlete.performanceMetrics.cmj.current}`,
                                nutrition: `Compliance ${activeAthletePlan?.compliancePct ?? activeAthlete.nutritionCompliancePct}% · Hydration ${activeAthletePlan?.hydrationIntakeL ?? activeAthlete.hydrationLiters}L`,
                              },
                              {
                                date: '3 Days Ago',
                                training: `${activeAthlete.recentSessions[1]?.title || 'Conditioning Block'} (${Math.round(activeAthlete.acuteLoadAu * 0.92)} AU)`,
                                medical:
                                  activeAthleteInjuries[0]
                                    ? `Rehab compliance ${activeAthleteInjuries[0].rehabCompliancePct}%`
                                    : 'Routine physio screening passed',
                                recovery: `Readiness ${Math.min(99, activeAthlete.readiness + 3)}% · HRV ${activeAthlete.hrvMs + 2}ms`,
                                assessment: `Yo-Yo IR2: ${activeAthlete.performanceMetrics.yoYoIr2.current}`,
                                nutrition: `Macro Target ${activeAthletePlan?.caloriesTarget ?? activeAthlete.dailyCalorieTargetKcal} kcal met`,
                              },
                              {
                                date: '7 Days Ago',
                                training: `Microcycle Baseline Load (${activeAthlete.chronicLoadAu} AU)`,
                                medical: 'Baseline musculoskeletal check verified',
                                recovery: `Readiness ${Math.max(55, activeAthlete.readiness - activeAthlete.readinessDelta)}% · Baseline HRV ${activeAthlete.hrvBaselineMs}ms`,
                                assessment: `Baseline 30m: ${activeAthlete.performanceMetrics.sprint30m.previous}`,
                                nutrition: `Hydration Status: ${activeAthlete.hydrationStatus}`,
                              },
                            ]
                        ).map((row) => (
                          <tr key={row.date} className="hover:bg-[#141D2E]">
                            <td className="py-2.5 px-2.5 font-mono font-bold text-sky-400">
                              {row.date}
                            </td>
                            <td className="py-2.5 px-2.5 text-slate-200">
                              {row.training}
                            </td>
                            <td className="py-2.5 px-2.5 text-amber-300">
                              {row.medical}
                            </td>
                            <td className="py-2.5 px-2.5 text-slate-200">
                              {row.recovery}
                            </td>
                            <td className="py-2.5 px-2.5 text-emerald-300">
                              {row.assessment}
                            </td>
                            <td className="py-2.5 px-2.5 text-sky-300">
                              {row.nutrition}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Right: 27. KPI INTELLIGENCE DRILL-DOWN VIEW */}
            <div className="xl:col-span-5 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 uppercase">
                  KPI INTELLIGENCE DRILL-DOWN
                </h3>
                <div className="flex gap-1.5 text-xs">
                  <button
                    onClick={() => setActiveKpiDrilldown('readiness')}
                    className={`px-2.5 py-1 rounded font-semibold ${
                      activeKpiDrilldown === 'readiness'
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-[#090D16] text-slate-300'
                    }`}
                  >
                    Readiness (78%)
                  </button>
                  <button
                    onClick={() => setActiveKpiDrilldown('injuries')}
                    className={`px-2.5 py-1 rounded font-semibold ${
                      activeKpiDrilldown === 'injuries'
                        ? 'bg-sky-500 text-slate-950'
                        : 'bg-[#090D16] text-slate-300'
                    }`}
                  >
                    Active Injuries (4)
                  </button>
                </div>
              </div>

              {activeKpiDrilldown === 'readiness' ? (
                <div className="space-y-3 text-xs">
                  <div className="font-bold text-slate-200">
                    Readiness Distribution (Average Readiness: 78%)
                  </div>
                  {[
                    { label: 'Ready', pct: 78, color: 'bg-emerald-500' },
                    { label: 'Monitor', pct: 12, color: 'bg-amber-400' },
                    { label: 'Restricted', pct: 7, color: 'bg-rose-400' },
                    { label: 'Unavailable', pct: 3, color: 'bg-slate-500' },
                  ].map((r) => (
                    <div key={r.label} className="space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-200">{r.label}</span>
                        <strong className="text-slate-100">{r.pct}%</strong>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${r.color}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="font-bold text-slate-200">
                    Injury Distribution (Active Injuries: 4)
                  </div>
                  {[
                    { label: 'Hamstring', count: 2, pct: 50 },
                    { label: 'Ankle', count: 1, pct: 25 },
                    { label: 'Shoulder', count: 1, pct: 25 },
                  ].map((inj) => (
                    <div key={inj.label} className="space-y-1">
                      <div className="flex justify-between font-mono">
                        <span className="text-slate-200">{inj.label}</span>
                        <strong className="text-rose-400">{inj.count}</strong>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-rose-500"
                          style={{ width: `${inj.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 31. AI CROSS-MODULE ANALYSIS & 28. AI PERFORMANCE INSIGHTS */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* 31. AI CROSS-MODULE INSIGHT (DYNAMIC ATHLETE) */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-sky-500/40 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-sky-400" />
                  <h3 className="text-sm font-bold text-slate-100 uppercase">
                    AI CROSS-MODULE INSIGHT — {activeAthlete.name.toUpperCase()}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded bg-sky-500/20 font-mono text-[10px] text-sky-300">
                  5 Connected Modules
                </span>
              </div>

              {/* 5 Correlated Signals */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {[
                  {
                    label: 'Training Load',
                    val: `${activeAthlete.trainingLoad} (${activeAthlete.acwr.toFixed(2)})`,
                    color:
                      activeAthlete.trainingLoad === 'High'
                        ? 'text-amber-400'
                        : 'text-emerald-400',
                  },
                  {
                    label: 'Recovery',
                    val: `${activeAthlete.recovery}% (${activeAthlete.readinessDelta >= 0 ? '+' : ''}${activeAthlete.readinessDelta}%)`,
                    color:
                      activeAthlete.recovery < 70
                        ? 'text-rose-400'
                        : 'text-emerald-400',
                  },
                  {
                    label: 'Hydration Compliance',
                    val: `${activeAthletePlan?.hydrationCompliancePct ?? 84}%`,
                    color:
                      (activeAthletePlan?.hydrationCompliancePct ?? 84) < 80
                        ? 'text-amber-300'
                        : 'text-emerald-400',
                  },
                  {
                    label: 'Medical Status',
                    val:
                      activeAthleteInjuries.length > 0
                        ? `${activeAthleteInjuries[0].bodyPart} Active`
                        : activeAthlete.medicalStatus,
                    color:
                      activeAthleteInjuries.length > 0
                        ? 'text-rose-300'
                        : 'text-emerald-400',
                  },
                  {
                    label: '30m Sprint',
                    val: activeAthlete.performanceMetrics.sprint30m.current,
                    color: 'text-emerald-400',
                  },
                ].map((sig) => (
                  <div
                    key={sig.label}
                    className="p-2.5 rounded bg-[#0B101B] border border-slate-800"
                  >
                    <span className="text-[10px] text-slate-400 block">
                      {sig.label}
                    </span>
                    <strong className={`font-mono text-xs mt-0.5 block ${sig.color}`}>
                      {sig.val}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="p-3.5 rounded bg-[#090D16] border border-slate-800 text-xs space-y-1">
                <div className="font-mono text-[10px] text-sky-400 uppercase">
                  AI Interpretation (Advisory · Non-Diagnostic)
                </div>
                <p className="text-slate-100 leading-relaxed font-medium">
                  "{activeAthlete.aiSummary}"
                </p>
              </div>

              {/* 3 Required Cross-Module Navigation Actions */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <button
                  onClick={() => onNavigateModule('workload')}
                  className="px-3.5 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
                >
                  Review Training
                </button>
                <button
                  onClick={() => onNavigateModule('injury-intelligence')}
                  className="px-3.5 py-2 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold"
                >
                  Review Medical
                </button>
                <button
                  onClick={() => onNavigateModule('recovery')}
                  className="px-3.5 py-2 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold"
                >
                  Review Recovery
                </button>
              </div>
            </div>

            {/* 28. AI PERFORMANCE INSIGHTS */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 uppercase">
                  AI PERFORMANCE INSIGHTS
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  Responsible AI · Signal-Backed
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {AI_ANALYTICS_INSIGHTS.map((ins) => (
                  <div
                    key={ins.id}
                    className="p-3.5 rounded bg-[#0B101B] border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <p className="text-slate-100 font-medium">
                        "{ins.statement}"
                      </p>
                      <div className="text-[11px] font-mono text-slate-400">
                        {ins.signals.join(' · ')}
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateModule(ins.targetNav)}
                      className="px-3 py-1.5 rounded bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-semibold shrink-0"
                    >
                      {ins.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
       * 29. REPORT BUILDER (/analytics/reports)
       * ========================================================= */}
      {isReportsView && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 text-xs">
          <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="pb-3 border-b border-slate-800">
              <h2 className="text-sm font-bold text-slate-100 uppercase">
                CREATE ANALYTICS REPORT
              </h2>
              <p className="text-slate-400 mt-0.5">
                Configure multi-module federation, squad, or athlete reports
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Report Name</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Scope</label>
                  <input
                    type="text"
                    value={reportScope}
                    onChange={(e) => setReportScope(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">
                    Date Range
                  </label>
                  <input
                    type="text"
                    value={reportDateRange}
                    onChange={(e) => setReportDateRange(e.target.value)}
                    className="w-full p-2.5 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">
                  Included Modules & Metrics
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Readiness',
                    'Training Load',
                    'Injuries',
                    'Attendance',
                    'Assessments',
                    'Nutrition',
                  ].map((m) => {
                    const active = reportMetrics.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          setReportMetrics((prev) =>
                            prev.includes(m)
                              ? prev.filter((x) => x !== m)
                              : [...prev, m]
                          )
                        }
                        className={`px-2.5 py-1.5 rounded border font-medium ${
                          active
                            ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                            : 'bg-[#090D16] border-slate-800 text-slate-400'
                        }`}
                      >
                        {active ? `✓ ${m}` : m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Filters</label>
                  <input
                    type="text"
                    value={reportFilters}
                    onChange={(e) => setReportFilters(e.target.value)}
                    className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Format</label>
                  <select
                    value={reportFormat}
                    onChange={(e) =>
                      setReportFormat(
                        e.target.value as 'PDF' | 'Excel' | 'CSV'
                      )
                    }
                    className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                  >
                    <option value="PDF">PDF</option>
                    <option value="Excel">Excel</option>
                    <option value="CSV">CSV</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Actions: [Preview] [Save Report] [Export] [Schedule] */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  const newRep: Report = {
                    id: `rep-${Date.now()}`,
                    reportName,
                    scope: reportScope,
                    metrics: reportMetrics,
                    dateRange: reportDateRange,
                    filters: reportFilters,
                    format: reportFormat,
                    createdAt: 'Today · Just now',
                    createdBy: selectedRole,
                    status: 'Ready',
                  };
                  setPreviewReport(newRep);
                }}
                className="px-3.5 py-2 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold"
              >
                Preview
              </button>
              <button
                onClick={() => {
                  const savedRep: Report = {
                    id: `rep-${Date.now()}`,
                    reportName: reportName.trim() || 'Custom Performance Report',
                    scope: reportScope,
                    metrics: reportMetrics,
                    dateRange: reportDateRange,
                    filters: reportFilters,
                    format: reportFormat,
                    createdAt: 'Today · Saved',
                    createdBy: selectedRole,
                    status: 'Ready',
                  };
                  setPreviewReport(savedRep);
                  onCreateReport(savedRep);
                }}
                className="px-3.5 py-2 rounded bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-semibold"
              >
                Save Report
              </button>
              <button
                onClick={() => {
                  setExportFormat(reportFormat);
                  setExportState('idle');
                  setIsExportModalOpen(true);
                }}
                className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold"
              >
                Export
              </button>
              <button
                onClick={() => {
                  const scheduledRep: Report = {
                    id: `rep-${Date.now()}`,
                    reportName: reportName.trim() || 'Scheduled Performance Report',
                    scope: reportScope,
                    metrics: reportMetrics,
                    dateRange: reportDateRange,
                    filters: reportFilters,
                    format: reportFormat,
                    createdAt: 'Scheduled Weekly',
                    createdBy: selectedRole,
                    status: 'Scheduled',
                  };
                  setPreviewReport(scheduledRep);
                  onCreateReport(scheduledRep);
                }}
                className="px-3.5 py-2 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-semibold"
              >
                Schedule
              </button>
            </div>
          </div>

          {/* Saved & Previewed Reports */}
          <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase pb-3 border-b border-slate-800">
              SAVED & SCHEDULED REPORTS ({reports.length})
            </h3>

            {previewReport && (
              <div className="p-4 rounded bg-[#090D16] border border-sky-500/50 space-y-2">
                <div className="text-[10px] font-mono text-sky-400 uppercase">
                  LIVE REPORT PREVIEW
                </div>
                <div className="text-sm font-bold text-slate-100">
                  {previewReport.reportName} ({previewReport.format})
                </div>
                <div className="text-slate-400">
                  Scope: {previewReport.scope} · {previewReport.dateRange}
                </div>
                <div className="text-slate-300 font-mono text-[11px]">
                  Metrics: {previewReport.metrics.join(', ')}
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  className="p-3.5 rounded bg-[#0B101B] border border-slate-800 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="font-bold text-slate-100">
                      {rep.reportName}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {rep.scope} · {rep.metrics.join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setExportFormat(rep.format);
                      setExportState('idle');
                      setIsExportModalOpen(true);
                    }}
                    className="px-3 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
                  >
                    Export ({rep.format})
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * 30. EXPORT REPORT WORKFLOW MODAL
       * ========================================================= */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsExportModalOpen(false)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-100 uppercase">
                Export Report
              </span>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="text-slate-300">
                Report: <strong>{reportName}</strong> ({reportScope})
              </div>

              <div>
                <label className="block text-slate-400 mb-1.5">
                  Select Export Format
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PDF', 'Excel', 'CSV'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => {
                        setExportFormat(fmt);
                        setExportState('idle');
                      }}
                      className={`p-2.5 rounded border font-mono font-bold ${
                        exportFormat === fmt
                          ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                          : 'bg-[#090D16] border-slate-800 text-slate-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              {exportState === 'generating' && (
                <div className="p-4 rounded bg-[#0B101B] border border-sky-500/40 flex items-center gap-3 text-sky-300 font-mono">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </div>
              )}

              {exportState === 'ready' && (
                <div className="p-4 rounded bg-emerald-950/25 border border-emerald-500/50 flex items-center justify-between">
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    Report Ready ✓
                  </span>
                  <button
                    onClick={() => {
                      onTriggerToast(
                        `Downloaded ${reportName}.${exportFormat.toLowerCase()} ✓`
                      );
                      setIsExportModalOpen(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-500 text-slate-950 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Close
              </button>
              {exportState === 'idle' && (
                <button
                  onClick={handleStartGenerateReport}
                  className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
                >
                  Generate Report
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
