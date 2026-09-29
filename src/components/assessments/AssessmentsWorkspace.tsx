import React, { useState, useMemo } from 'react';
import {
  Activity,
  ArrowUpRight,
  Award,
  BarChart3,
  Bot,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Gauge,
  Play,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Target,
  TrendingUp,
  UserCheck,
  X,
} from 'lucide-react';
import {
  AssessmentProgram,
  Athlete,
  TalentProfile,
  TalentScoringWeights,
  Test,
  TestCategory,
  TestResult,
  UserRole,
} from '../../types/usi';

export type AssessmentsSubTab =
  | 'assessments-tid'
  | 'assessments-tests'
  | 'assessments-benchmarks'
  | 'assessments-talent'
  | 'assessments-field-testing';

interface AssessmentsWorkspaceProps {
  activeSubTab: AssessmentsSubTab;
  onSelectSubTab: (tab: AssessmentsSubTab) => void;
  selectedRole: UserRole;
  athletes: Athlete[];
  tests: Test[];
  programs: AssessmentProgram[];
  testResults: TestResult[];
  talentProfiles: TalentProfile[];
  talentWeights: TalentScoringWeights;
  onUpdateTalentWeights: (weights: TalentScoringWeights) => void;
  onCreateProgram: (program: AssessmentProgram) => void;
  onSaveTestResult: (updatedResult: TestResult) => void;
  onOpenAthlete360: (athleteId: string) => void;
  onTriggerToast: (msg: string) => void;
  onPromoteTalentAthlete?: (profileId: string, athleteId: string) => void;
}

export const AssessmentsWorkspace: React.FC<AssessmentsWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  selectedRole,
  athletes,
  tests,
  programs,
  testResults,
  talentProfiles,
  talentWeights,
  onUpdateTalentWeights,
  onCreateProgram,
  onSaveTestResult,
  onOpenAthlete360,
  onTriggerToast,
  onPromoteTalentAthlete,
}) => {
  // Test Library Filter
  const [selectedTestCategory, setSelectedTestCategory] = useState<
    'All' | TestCategory
  >('All');

  // Create Assessment Program Modal State (Section 14)
  const [isCreateProgramOpen, setIsCreateProgramOpen] = useState(false);
  const [progName, setProgName] = useState(
    'Senior Football Performance Assessment'
  );
  const [progSport, setProgSport] = useState('Football');
  const [progSquad, setProgSquad] = useState('Senior Squad');
  const [progPeriod, setProgPeriod] = useState('September 2026');
  const [progSelectedTests, setProgSelectedTests] = useState<string[]>([
    '30m Sprint',
    'Countermovement Jump',
    'Yo-Yo Test',
    'Squat Strength',
    'Mobility Screen',
  ]);
  const [progEvaluator, setProgEvaluator] = useState('Dr. R. Subramanian');
  const [progDeadline, setProgDeadline] = useState('30 Sep 2026');
  const [progAthleteIds, setProgAthleteIds] = useState<string[]>([
    'ath-arjun-mehta',
    'ath-rahul-singh',
    'ath-kabir-rao',
  ]);

  // Field Testing Workflow & Result Entry State (Sections 15 & 16)
  const [fieldWorkflowStep, setFieldWorkflowStep] = useState<number>(4);
  const [selectedResultId, setSelectedResultId] =
    useState<string>('tr-arjun-30m');
  const [entryValueInput, setEntryValueInput] = useState<string>('4.21');
  const [activeAssessmentAthleteId, setActiveAssessmentAthleteId] =
    useState<string>('ath-arjun-mehta');
  const [isLogNewTestModalOpen, setIsLogNewTestModalOpen] = useState(false);
  const [newTestAthleteId, setNewTestAthleteId] =
    useState<string>('ath-arjun-mehta');
  const [newTestId, setNewTestId] = useState<string>(
    tests[0]?.id || 'test-30m'
  );
  const [newTestVal, setNewTestVal] = useState<string>('4.20');

  // Benchmarking Cycle Toggle (Section 17)
  const [benchmarkCycle, setBenchmarkCycle] = useState<'current' | 'previous'>(
    'current'
  );

  // Selected Talent Candidate Drawer (Section 20)
  const [selectedTalentDrawerId, setSelectedTalentDrawerId] = useState<
    string | null
  >(null);

  const activeResult =
    testResults.find((r) => r.id === selectedResultId) || testResults[0];
  const activeAssessmentAthlete =
    athletes.find((a) => a.id === activeAssessmentAthleteId) || athletes[0];

  const numericEntry = parseFloat(entryValueInput) || activeResult.currentResult;
  const isAboveBenchmark = activeResult.lowerIsBetter
    ? numericEntry <= activeResult.programBenchmark
    : numericEntry >= activeResult.programBenchmark;

  const calculatedImprovementPct = activeResult.lowerIsBetter
    ? Number(
        (
          ((activeResult.previousResult - numericEntry) /
            activeResult.previousResult) *
          100
        ).toFixed(1)
      )
    : Number(
        (
          ((numericEntry - activeResult.previousResult) /
            activeResult.previousResult) *
          100
        ).toFixed(1)
      );

  const filteredTests = useMemo(() => {
    if (selectedTestCategory === 'All') return tests;
    return tests.filter((t) => t.category === selectedTestCategory);
  }, [tests, selectedTestCategory]);

  // Calculate dynamic Talent Index from configurable scoring weights (Section 19)
  const computeTalentIndex = (tp: TalentProfile): number => {
    const totalW =
      talentWeights.speed +
      talentWeights.power +
      talentWeights.endurance +
      talentWeights.strength +
      talentWeights.sportSpecific;
    if (totalW === 0) return tp.basePerformanceIndex;
    const weighted =
      tp.scores.speed * talentWeights.speed +
      tp.scores.power * talentWeights.power +
      tp.scores.endurance * talentWeights.endurance +
      tp.scores.strength * talentWeights.strength +
      tp.scores.sportSpecific * talentWeights.sportSpecific;
    return Math.round(weighted / totalW);
  };

  const selectedTalentProfile =
    talentProfiles.find((t) => t.id === selectedTalentDrawerId) || null;

  const athleteProgressionResults: TestResult[] = useMemo(() => {
    const existing = testResults.filter(
      (r) => r.athleteId === activeAssessmentAthlete.id
    );
    if (existing.length > 0) return existing;
    // Synthesize from the athlete's performanceMetrics if not yet in testResults
    const pm = activeAssessmentAthlete.performanceMetrics;
    const parseNum = (s: string, fallback: number) => {
      const m = parseFloat(s.replace(/[^0-9.]/g, ''));
      return isNaN(m) ? fallback : m;
    };
    return [
      {
        id: `tr-synth-30m-${activeAssessmentAthlete.id}`,
        testId: 'test-30m',
        testName: '30m Sprint',
        category: 'Speed',
        unit: 'sec',
        athleteId: activeAssessmentAthlete.id,
        athleteName: activeAssessmentAthlete.name,
        squad: activeAssessmentAthlete.squad,
        currentResult: parseNum(pm.sprint30m.current, 4.24),
        previousResult: Number(
          (parseNum(pm.sprint30m.current, 4.24) + 0.05).toFixed(2)
        ),
        personalBest: parseNum(pm.sprint30m.personalBest, 4.19),
        squadAverage: parseNum(pm.sprint30m.squadAvg, 4.28),
        programBenchmark: parseNum(pm.sprint30m.benchmark, 4.25),
        nationalBenchmark: 4.18,
        lowerIsBetter: true,
        improvementPct: 1.2,
        progressionStatus: 'Improving',
        cycleHistory: pm.sprint30m.cycles.slice(-3),
        fieldStatus: 'Completed',
        validated: true,
      },
      {
        id: `tr-synth-cmj-${activeAssessmentAthlete.id}`,
        testId: 'test-cmj',
        testName: 'Countermovement Jump',
        category: 'Power',
        unit: 'cm',
        athleteId: activeAssessmentAthlete.id,
        athleteName: activeAssessmentAthlete.name,
        squad: activeAssessmentAthlete.squad,
        currentResult: parseNum(pm.cmj.current, 47.5),
        previousResult: Number(
          (parseNum(pm.cmj.current, 47.5) - 1.5).toFixed(1)
        ),
        personalBest: parseNum(pm.cmj.personalBest, 49.0),
        squadAverage: parseNum(pm.cmj.squadAvg, 45.8),
        programBenchmark: parseNum(pm.cmj.benchmark, 46.0),
        nationalBenchmark: 49.5,
        lowerIsBetter: false,
        improvementPct: 3.2,
        progressionStatus: 'Improving',
        cycleHistory: pm.cmj.cycles.slice(-3),
        fieldStatus: 'Completed',
        validated: true,
      },
      {
        id: `tr-synth-yoyo-${activeAssessmentAthlete.id}`,
        testId: 'test-yoyo',
        testName: 'Yo-Yo Test',
        category: 'Endurance',
        unit: 'level',
        athleteId: activeAssessmentAthlete.id,
        athleteName: activeAssessmentAthlete.name,
        squad: activeAssessmentAthlete.squad,
        currentResult: parseNum(pm.yoYo.current, 19.2),
        previousResult: Number(
          (parseNum(pm.yoYo.current, 19.2) - 0.4).toFixed(1)
        ),
        personalBest: parseNum(pm.yoYo.personalBest, 19.6),
        squadAverage: parseNum(pm.yoYo.squadAvg, 18.6),
        programBenchmark: parseNum(pm.yoYo.benchmark, 18.8),
        nationalBenchmark: 19.8,
        lowerIsBetter: false,
        improvementPct: 2.1,
        progressionStatus: 'Improving',
        cycleHistory: pm.yoYo.cycles.slice(-3),
        fieldStatus: 'Completed',
        validated: true,
      },
    ];
  }, [testResults, activeAssessmentAthlete]);

  return (
    <div className="space-y-5">
      {/* 11 & 12. ASSESSMENT COMMAND CENTER HEADER & SUB-NAVIGATION */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <ClipboardCheck className="w-4 h-4" />
              <span>USI PHYSICAL BENCHMARKING & TALENT IDENTIFICATION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1 uppercase">
              ASSESSMENTS & TALENT IDENTIFICATION
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Standardized physical batteries, field-testing workflows, multi-tier benchmarking, and configurable Talent Identification (TID).
            </p>
          </div>

          {['Coach', 'Sports Scientist', 'Performance Director'].includes(selectedRole) && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => {
                  onSelectSubTab('assessments-field-testing');
                  onTriggerToast(
                    'Field Testing Active — Ready to enter & validate results'
                  );
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Testing</span>
              </button>
              <button
                onClick={() => setIsCreateProgramOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create Assessment Program</span>
              </button>
            </div>
          )}
        </div>

        {/* Sub-Routes Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                {
                  id: 'assessments-tid',
                  label: selectedRole === 'Athlete' ? 'My Assessment Overview' : 'Assessment Command Center',
                  route: '/assessments',
                },
                {
                  id: 'assessments-tests',
                  label: 'Test Library',
                  route: '/assessments/tests',
                },
                ...(selectedRole !== 'Athlete'
                  ? [
                      {
                        id: 'assessments-field-testing',
                        label: 'Field Testing & Result Entry',
                        route: '/assessments/field-testing',
                      },
                    ]
                  : []),
                {
                  id: 'assessments-benchmarks',
                  label: selectedRole === 'Athlete' ? 'My Benchmarks & Progression' : 'Benchmarking & Progression',
                  route: '/assessments/benchmarks',
                },
                ...(selectedRole !== 'Athlete'
                  ? [
                      {
                        id: 'assessments-talent',
                        label: 'Talent Identification (TID)',
                        route: '/assessments/talent',
                      },
                    ]
                  : []),
              ] as const
            ).map((tab) => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectSubTab(tab.id as AssessmentsSubTab)}
                  className={`px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-[#090D16] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] font-mono text-slate-400">
              Athlete Focus:
            </span>
            <select
              value={activeAssessmentAthlete.id}
              onChange={(e) => {
                const nextAthId = e.target.value;
                setActiveAssessmentAthleteId(nextAthId);
                const matchRes = testResults.find(
                  (r) => r.athleteId === nextAthId
                );
                if (matchRes) {
                  setSelectedResultId(matchRes.id);
                  setEntryValueInput(String(matchRes.currentResult));
                }
              }}
              className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-700 text-xs font-semibold text-sky-300 focus:outline-none focus:border-sky-500"
            >
              {athletes.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name} ({a.athleteId} · {a.squad})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 12. TOP 5 ASSESSMENT KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {[
          {
            label: 'Active Assessment Programs',
            value: '6',
            sub: 'Senior & U23 September Cycle',
            accent: 'text-slate-100',
            tab: 'assessments-tid' as AssessmentsSubTab,
          },
          {
            label: 'Athletes Tested This Cycle',
            value: '142',
            sub: '91% federation cycle completion',
            accent: 'text-emerald-400',
            tab: 'assessments-field-testing' as AssessmentsSubTab,
          },
          {
            label: 'Pending Assessments',
            value: '18',
            sub: '8 in Football Senior/U23',
            accent: 'text-amber-400',
            tab: 'assessments-field-testing' as AssessmentsSubTab,
          },
          {
            label: 'Below Benchmark',
            value: '23',
            sub: 'Flagged for targeted conditioning',
            accent: 'text-rose-400',
            tab: 'assessments-benchmarks' as AssessmentsSubTab,
          },
          {
            label: 'Talent Candidates',
            value: '14',
            sub: 'High benchmark alignment cohort',
            accent: 'text-sky-400',
            tab: 'assessments-talent' as AssessmentsSubTab,
          },
        ].map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => onSelectSubTab(kpi.tab)}
            className="p-4 rounded-lg bg-[#0F1623] border border-slate-800/90 hover:border-slate-700 text-left transition-all"
          >
            <div className="text-[11px] font-medium text-slate-400">
              {kpi.label}
            </div>
            <div
              className={`text-2xl font-bold font-mono tabular-nums mt-1 ${kpi.accent}`}
            >
              {kpi.value}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">{kpi.sub}</div>
          </button>
        ))}
      </div>

      {/* =========================================================
       * DEFAULT TAB (/assessments): COMMAND CENTER + PROGRESSION
       * ========================================================= */}
      {activeSubTab === 'assessments-tid' && (
        <>
          {/* 12. 6 ASSESSMENT DOMAIN CARDS */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  ASSESSMENT BATTERY DOMAINS
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any domain card to filter the Test Library or launch Field Testing
                </p>
              </div>
              <button
                onClick={() => onSelectSubTab('assessments-tests')}
                className="text-xs text-sky-400 hover:underline font-medium"
              >
                Open Full Test Library →
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 text-xs">
              {[
                {
                  name: 'Speed' as TestCategory,
                  primaryTest: '30m Sprint',
                  benchmark: '4.25 sec',
                  arjunVal: '4.21 sec (✓ Above)',
                },
                {
                  name: 'Strength' as TestCategory,
                  primaryTest: 'Squat Strength',
                  benchmark: '2.00 xBW',
                  arjunVal: '1.94 xBW',
                },
                {
                  name: 'Power' as TestCategory,
                  primaryTest: 'Countermovement Jump',
                  benchmark: '46.0 cm',
                  arjunVal: '48.0 cm (✓ Above)',
                },
                {
                  name: 'Endurance' as TestCategory,
                  primaryTest: 'Yo-Yo Test / VO2 Max',
                  benchmark: '18.8 level',
                  arjunVal: '19.2 level (✓ Above)',
                },
                {
                  name: 'Mobility' as TestCategory,
                  primaryTest: 'Mobility Screen',
                  benchmark: '18 / 21 pts',
                  arjunVal: '18 / 21 pts',
                },
                {
                  name: 'Sport-Specific' as TestCategory,
                  primaryTest: 'Repeated Sprint Ability',
                  benchmark: '≤ 4.2% decr',
                  arjunVal: '4.4% decr',
                },
              ].map((dom) => (
                <button
                  key={dom.name}
                  onClick={() => {
                    setSelectedTestCategory(dom.name);
                    onSelectSubTab('assessments-tests');
                  }}
                  className="p-3.5 rounded-md bg-[#0B101B] border border-slate-800 hover:border-sky-500/50 text-left space-y-1.5 transition-all"
                >
                  <div className="font-bold text-sky-400 uppercase">
                    {dom.name}
                  </div>
                  <div className="font-semibold text-slate-100">
                    {dom.primaryTest}
                  </div>
                  <div className="text-[11px] font-mono text-slate-400">
                    Target: {dom.benchmark}
                  </div>
                  <div className="text-[11px] font-mono text-emerald-400">
                    Arjun: {dom.arjunVal}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Active Assessment Programs + Quick Field Testing & Progression */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Active Assessment Programs */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-slate-100 uppercase">
                  ACTIVE ASSESSMENT PROGRAMS ({programs.length})
                </h3>
                <span className="text-[11px] font-mono text-slate-400">
                  September Cycle
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {programs.map((prog) => (
                  <div
                    key={prog.id}
                    className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-slate-100">
                        {prog.programName}
                      </strong>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                        {prog.assessmentPeriod}
                      </span>
                    </div>
                    <div className="text-slate-400">
                      {prog.sport} · {prog.squad} · Evaluator: {prog.evaluator}
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {prog.tests.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[10px]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 flex justify-between items-center border-t border-slate-800/80">
                      <span className="font-mono text-[11px] text-slate-400">
                        Deadline: {prog.deadline}
                      </span>
                      <button
                        onClick={() =>
                          onSelectSubTab('assessments-field-testing')
                        }
                        className="px-3 py-1 rounded bg-sky-500 text-slate-950 font-semibold"
                      >
                        Enter Results →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 18. PROGRESSION ANALYSIS PREVIEW (SELECTED ATHLETE) */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase">
                    ATHLETE PROGRESSION ANALYSIS — {activeAssessmentAthlete.name.toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    3-Cycle longitudinal physical trajectory with non-color-only status indicators
                  </p>
                </div>
                <button
                  onClick={() => onSelectSubTab('assessments-benchmarks')}
                  className="text-xs text-sky-400 hover:underline font-medium"
                >
                  Compare Benchmarks →
                </button>
              </div>

              <div className="space-y-2.5 text-xs">
                {athleteProgressionResults.map((res) => (
                  <div
                    key={res.id}
                    className="p-3.5 rounded bg-[#0B101B] border border-slate-800 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-bold text-slate-100">
                        {res.testName} ({res.category})
                      </div>
                      <div className="font-mono text-sky-300 mt-0.5">
                        {res.cycleHistory.map((c) => c.value).join(' → ')}{' '}
                        {res.unit}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono">
                        <span className="text-slate-400 block text-[10px]">
                          Benchmark: {res.programBenchmark} {res.unit}
                        </span>
                        <strong className="text-emerald-400">
                          +{res.improvementPct}% Improvement
                        </strong>
                      </div>
                      <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold">
                        ▲ {res.progressionStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
       * TAB 2 (/assessments/tests): 13. TEST LIBRARY
       * ========================================================= */}
      {activeSubTab === 'assessments-tests' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase">
                STANDARDIZED TEST LIBRARY
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Federation-validated physiological & biomechanical test protocols
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {(
                [
                  'All',
                  'Speed',
                  'Strength',
                  'Power',
                  'Endurance',
                  'Mobility',
                  'Anthropometry',
                  'Sport-Specific',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedTestCategory(cat)}
                  className={`px-2.5 py-1 rounded font-medium ${
                    selectedTestCategory === cat
                      ? 'bg-sky-500 text-slate-950 font-semibold'
                      : 'bg-[#090D16] border border-slate-800 text-slate-300'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0B101B] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                  <th className="py-2.5 px-4">Test Name</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Benchmark</th>
                  <th className="py-2.5 px-3">Frequency</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {filteredTests.map((t) => (
                  <tr key={t.id} className="hover:bg-[#141D2E]">
                    <td className="py-3 px-4 font-bold text-slate-100">
                      {t.name}
                    </td>
                    <td className="py-3 px-3 text-sky-300">{t.category}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {t.unit}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      {t.benchmark}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{t.frequency}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 3 (/assessments/field-testing): 15. FIELD TESTING & 16. RESULT ENTRY
       * ========================================================= */}
      {activeSubTab === 'assessments-field-testing' && (
        <div className="space-y-5">
          {/* 15. 7-STEP FIELD TESTING WORKFLOW PIPELINE */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  OPERATIONAL FIELD-TESTING WORKFLOW
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  End-to-end field capture, automatic benchmark validation, and insight generation
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-xs text-sky-300 font-semibold">
                Step {fieldWorkflowStep} of 7 Active
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-2 text-xs">
              {[
                '1. Schedule Test',
                '2. Assign Athletes',
                '3. Conduct Test',
                '4. Enter Results',
                '5. Validate Results',
                '6. Compare Benchmark',
                '7. Generate Insights',
              ].map((stepLabel, idx) => {
                const sNum = idx + 1;
                const active = fieldWorkflowStep === sNum;
                const done = fieldWorkflowStep > sNum;
                return (
                  <button
                    key={stepLabel}
                    onClick={() => setFieldWorkflowStep(sNum)}
                    className={`p-2.5 rounded border text-left font-medium transition-all ${
                      active
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-bold'
                        : done
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-[#0B101B] border-slate-800 text-slate-400'
                    }`}
                  >
                    {done ? `✓ ${stepLabel}` : stepLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Field Testing Athletes Status Queue */}
            <div className="xl:col-span-5 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="text-sm font-bold text-slate-100 uppercase">
                  ASSIGNED ATHLETES ({testResults.length})
                </div>
                <button
                  onClick={() => {
                    setNewTestAthleteId(activeAssessmentAthlete.id);
                    setIsLogNewTestModalOpen(true);
                  }}
                  className="px-2.5 py-1 rounded bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 text-xs font-semibold"
                >
                  + Log Athlete Test
                </button>
              </div>
              <div className="space-y-2.5 text-xs max-h-[380px] overflow-y-auto pr-1">
                {testResults.map((res) => (
                  <button
                    key={res.id}
                    onClick={() => {
                      setSelectedResultId(res.id);
                      setActiveAssessmentAthleteId(res.athleteId);
                      setEntryValueInput(String(res.currentResult));
                    }}
                    className={`w-full p-3.5 rounded border text-left flex items-center justify-between transition-all ${
                      selectedResultId === res.id
                        ? 'bg-sky-500/15 border-sky-400'
                        : 'bg-[#0B101B] border-slate-800 hover:bg-[#141D2E]'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-100">
                        {res.athleteName} — {res.testName}
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        Current: {res.currentResult} {res.unit} · Benchmark:{' '}
                        {res.programBenchmark} {res.unit}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                        res.fieldStatus === 'Completed'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : res.fieldStatus === 'In Progress'
                            ? 'bg-sky-500/20 text-sky-300'
                            : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {res.fieldStatus}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 16. LIVE RESULT ENTRY & AUTOMATIC BENCHMARK CALCULATOR */}
            <div className="xl:col-span-7 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[11px] font-mono text-sky-400 uppercase">
                    FIELD RESULT ENTRY & BENCHMARK VALIDATION
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5">
                    {activeResult.testName} — {activeResult.athleteName}
                  </h3>
                </div>
                <span
                  className={`px-3 py-1 rounded font-mono text-xs font-bold border ${
                    isAboveBenchmark
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  }`}
                >
                  {isAboveBenchmark
                    ? 'Above Benchmark ✓'
                    : 'Below Benchmark ▲'}
                </span>
              </div>

              {/* Input + Benchmark Comparison Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded bg-[#090D16] border border-sky-500/50">
                  <label className="block text-sky-400 font-semibold mb-1">
                    Entered Result ({activeResult.unit})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={entryValueInput}
                    onChange={(e) => setEntryValueInput(e.target.value)}
                    className="w-full p-2 rounded bg-[#0F1623] border border-slate-700 font-mono text-base font-bold text-slate-100"
                  />
                </div>
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Squad Average</span>
                  <strong className="text-lg font-mono font-bold text-slate-200 mt-2 block">
                    {activeResult.squadAverage} {activeResult.unit}
                  </strong>
                </div>
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Benchmark</span>
                  <strong className="text-lg font-mono font-bold text-sky-400 mt-2 block">
                    {activeResult.programBenchmark} {activeResult.unit}
                  </strong>
                </div>
              </div>

              {/* Personal Best, Previous, Current, Improvement */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Personal Best</span>
                  <strong className="font-mono text-sm text-slate-100 mt-0.5 block">
                    {activeResult.personalBest} {activeResult.unit}
                  </strong>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Previous</span>
                  <strong className="font-mono text-sm text-slate-300 mt-0.5 block">
                    {activeResult.previousResult} {activeResult.unit}
                  </strong>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Current</span>
                  <strong className="font-mono text-sm text-sky-300 mt-0.5 block">
                    {numericEntry} {activeResult.unit}
                  </strong>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Improvement</span>
                  <strong className="font-mono text-sm text-emerald-400 mt-0.5 block">
                    {calculatedImprovementPct}%
                  </strong>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => {
                    const nextHistory = activeResult.cycleHistory.map((c, idx) =>
                      idx === activeResult.cycleHistory.length - 1
                        ? { ...c, value: numericEntry }
                        : c
                    );
                    const nextPersonalBest = activeResult.lowerIsBetter
                      ? Math.min(activeResult.personalBest, numericEntry)
                      : Math.max(activeResult.personalBest, numericEntry);
                    onSaveTestResult({
                      ...activeResult,
                      currentResult: numericEntry,
                      personalBest: nextPersonalBest,
                      improvementPct: Math.abs(calculatedImprovementPct),
                      progressionStatus:
                        calculatedImprovementPct >= 0 ? 'Improving' : 'Stable',
                      cycleHistory: nextHistory,
                      fieldStatus: 'Completed',
                      validated: true,
                    });
                    setActiveAssessmentAthleteId(activeResult.athleteId);
                    setFieldWorkflowStep(6);
                    onTriggerToast(
                      `Validated ${activeResult.testName} (${numericEntry} ${activeResult.unit}) for ${activeResult.athleteName} ✓`
                    );
                  }}
                  className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
                >
                  Validate & Save Result ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 4 (/assessments/benchmarks): 17. BENCHMARKING & 18. PROGRESSION
       * ========================================================= */}
      {activeSubTab === 'assessments-benchmarks' && (
        <div className="space-y-5">
          {/* 17. MULTI-TIER BENCHMARK COMPARISON */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  MULTI-TIER BENCHMARK COMPARISON — {activeAssessmentAthlete.name.toUpperCase()}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Compare Athlete vs Squad Average vs Program Benchmark vs National Benchmark
                </p>
              </div>

              {/* Current Cycle / Previous Cycle Toggle */}
              <div className="flex items-center gap-1 p-1 bg-[#090D16] border border-slate-800 rounded-md text-xs">
                <button
                  onClick={() => setBenchmarkCycle('current')}
                  className={`px-3 py-1 rounded font-semibold ${
                    benchmarkCycle === 'current'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400'
                  }`}
                >
                  Current Cycle (Sep 2026)
                </button>
                <button
                  onClick={() => setBenchmarkCycle('previous')}
                  className={`px-3 py-1 rounded font-semibold ${
                    benchmarkCycle === 'previous'
                      ? 'bg-sky-500 text-slate-950'
                      : 'text-slate-400'
                  }`}
                >
                  Previous Cycle (Jul 2026)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {athleteProgressionResults.map((res) => {
                const displayedAthleteVal =
                  benchmarkCycle === 'current'
                    ? res.currentResult
                    : res.previousResult;
                const beatsBench = res.lowerIsBetter
                  ? displayedAthleteVal <= res.programBenchmark
                  : displayedAthleteVal >= res.programBenchmark;

                return (
                  <div
                    key={res.id}
                    className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-slate-100">
                        {res.testName}
                      </strong>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
                          beatsBench
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-amber-500/20 text-amber-300'
                        }`}
                      >
                        {beatsBench ? '✓ Above Benchmark' : '▲ Below Benchmark'}
                      </span>
                    </div>

                    <div className="space-y-2 font-mono">
                      <div className="flex justify-between p-2 rounded bg-[#0F1623] border border-sky-500/30">
                        <span className="text-sky-300">
                          {activeAssessmentAthlete.name} ({benchmarkCycle}):
                        </span>
                        <strong className="text-slate-100">
                          {displayedAthleteVal} {res.unit}
                        </strong>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-[#0F1623] border border-slate-800">
                        <span className="text-slate-400">Squad Average:</span>
                        <strong className="text-slate-200">
                          {res.squadAverage} {res.unit}
                        </strong>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-[#0F1623] border border-slate-800">
                        <span className="text-slate-400">
                          Program Benchmark:
                        </span>
                        <strong className="text-emerald-400">
                          {res.programBenchmark} {res.unit}
                        </strong>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-[#0F1623] border border-slate-800">
                        <span className="text-slate-400">
                          National Benchmark:
                        </span>
                        <strong className="text-amber-300">
                          {res.nationalBenchmark} {res.unit}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 18. PROGRESSION ANALYSIS CHARTS */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-100 uppercase">
              MULTI-CYCLE PROGRESSION CHARTS — {activeAssessmentAthlete.name.toUpperCase()}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
              {athleteProgressionResults.map((res) => (
                <div
                  key={res.id}
                  className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100">
                      {res.testName}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 font-mono text-[11px] text-emerald-300 font-bold">
                      ▲ {res.progressionStatus}
                    </span>
                  </div>
                  <div className="font-mono text-sm font-bold text-sky-300">
                    {res.cycleHistory.map((c) => c.value).join(' → ')}{' '}
                    {res.unit}
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-end h-24 pt-2">
                    {res.cycleHistory.map((c, idx) => (
                      <div
                        key={c.cycle}
                        className="flex flex-col items-center gap-1"
                      >
                        <span className="font-mono text-[10px] text-slate-200 font-bold">
                          {c.value}
                        </span>
                        <div className="w-full bg-slate-800 rounded-t h-14 flex items-end p-1">
                          <div
                            className="w-full bg-sky-500 rounded-t"
                            style={{ height: `${60 + idx * 18}%` }}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-slate-400">
                          {c.cycle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 5 (/assessments/talent): 19. TALENT IDENTIFICATION & 20. TALENT PROFILE
       * ========================================================= */}
      {activeSubTab === 'assessments-talent' && (
        <div className="space-y-5">
          {/* Configurable Scoring Model Sliders */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  CONFIGURABLE TALENT IDENTIFICATION (TID) SCORING MODEL
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Adjust domain weightings below to dynamically recalculate candidate Performance Index & Benchmark Alignment
                </p>
              </div>
              <span className="font-mono text-xs text-sky-400">
                Total Weight:{' '}
                {talentWeights.speed +
                  talentWeights.power +
                  talentWeights.endurance +
                  talentWeights.strength +
                  talentWeights.sportSpecific}
                %
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {(
                [
                  { key: 'speed', label: 'Speed', val: talentWeights.speed },
                  { key: 'power', label: 'Power', val: talentWeights.power },
                  {
                    key: 'endurance',
                    label: 'Endurance',
                    val: talentWeights.endurance,
                  },
                  {
                    key: 'strength',
                    label: 'Strength',
                    val: talentWeights.strength,
                  },
                  {
                    key: 'sportSpecific',
                    label: 'Sport-Specific',
                    val: talentWeights.sportSpecific,
                  },
                ] as const
              ).map((w) => (
                <div
                  key={w.key}
                  className="p-3 rounded bg-[#0B101B] border border-slate-800 space-y-1.5"
                >
                  <div className="flex justify-between">
                    <span className="text-slate-300 font-medium">
                      {w.label}
                    </span>
                    <strong className="font-mono text-sky-400">{w.val}%</strong>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={50}
                    step={5}
                    value={w.val}
                    onChange={(e) =>
                      onUpdateTalentWeights({
                        ...talentWeights,
                        [w.key]: Number(e.target.value),
                      })
                    }
                    className="w-full accent-sky-400"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Candidate Table + Talent Profile Preview */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <h3 className="text-sm font-bold text-slate-100 uppercase">
                TALENT IDENTIFICATION CANDIDATES (CLICK ANY CANDIDATE FOR TALENT PROFILE)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B101B] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                    <th className="py-2.5 px-4">Athlete</th>
                    <th className="py-2.5 px-3">Age Group</th>
                    <th className="py-2.5 px-3">Sport</th>
                    <th className="py-2.5 px-3">Performance Index</th>
                    <th className="py-2.5 px-3">Benchmark Alignment</th>
                    <th className="py-2.5 px-3">Development Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-4 text-right">Pathway Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {talentProfiles.map((tp) => {
                    const dynamicIdx = computeTalentIndex(tp);
                    return (
                      <tr
                        key={tp.id}
                        onClick={() => setSelectedTalentDrawerId(tp.id)}
                        className="hover:bg-[#141D2E] cursor-pointer transition-colors"
                      >
                        <td className="py-3 px-4 font-bold text-slate-100">
                          {tp.athleteName}
                        </td>
                        <td className="py-3 px-3 text-slate-300">
                          {tp.ageGroup}
                        </td>
                        <td className="py-3 px-3 text-slate-300">{tp.sport}</td>
                        <td className="py-3 px-3 font-mono font-bold text-sky-400 text-sm">
                          {dynamicIdx}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                            {tp.benchmarkAlignment}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-200">
                          {tp.developmentPriority}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">
                            {tp.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                          {tp.squad === 'Senior Squad' || tp.status.includes('Promoted') ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                              <CheckCircle2 className="w-3 h-3" /> Senior Squad
                            </span>
                          ) : (
                            <button
                              onClick={() => {
                                onPromoteTalentAthlete?.(tp.id, tp.athleteId);
                                onTriggerToast(`Promoted ${tp.athleteName} to Senior Squad ✓ Assigned to Coach Vikram Sharma`);
                              }}
                              className="px-2.5 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-[11px] font-bold text-emerald-300 transition-colors"
                            >
                              Promote to Senior →
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * 20. TALENT PROFILE DRAWER
       * ========================================================= */}
      {selectedTalentProfile && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSelectedTalentDrawerId(null)}
            className="fixed inset-0 bg-black/65 backdrop-blur-[1px]"
          />
          <aside className="relative w-full max-w-lg bg-[#0F1623] border-l border-slate-800 h-full p-5 flex flex-col justify-between z-10 overflow-y-auto shadow-2xl text-xs">
            <div className="space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-mono text-sky-400 uppercase">
                    TALENT PROFILE
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5 uppercase">
                    {selectedTalentProfile.athleteName} — TALENT PROFILE
                  </h3>
                  <div className="text-slate-400 mt-0.5">
                    {selectedTalentProfile.sport} · {selectedTalentProfile.squad}{' '}
                    · {selectedTalentProfile.ageGroup}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTalentDrawerId(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">
                    Performance Index
                  </span>
                  <strong className="text-2xl font-mono font-bold text-sky-400 mt-1 block">
                    {computeTalentIndex(selectedTalentProfile)}
                  </strong>
                </div>
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">
                    Benchmark Alignment
                  </span>
                  <strong className="text-lg font-mono font-bold text-emerald-400 mt-1 block">
                    {selectedTalentProfile.benchmarkAlignment}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1.5">
                  <div className="font-bold text-emerald-400 uppercase">
                    Strengths
                  </div>
                  {selectedTalentProfile.strengths.map((s) => (
                    <div key={s} className="text-slate-200">
                      • {s}
                    </div>
                  ))}
                </div>
                <div className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1.5">
                  <div className="font-bold text-amber-400 uppercase">
                    Development Areas
                  </div>
                  {selectedTalentProfile.developmentAreas.map((d) => (
                    <div key={d} className="text-slate-200">
                      • {d}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded bg-[#0B101B] border border-sky-500/30 space-y-2">
                <div className="font-bold text-sky-300 uppercase">
                  Suggested Development Focus
                </div>
                <p className="text-slate-100 font-medium">
                  "{selectedTalentProfile.suggestedDevelopmentFocus}"
                </p>
              </div>

              <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-2">
                <div className="font-bold text-slate-200 uppercase">
                  Supporting Evidence From Assessment Data
                </div>
                {selectedTalentProfile.assessmentEvidence.map((ev) => (
                  <div key={ev} className="text-slate-300 font-mono text-[11px]">
                    ✓ {ev}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => {
                  onPromoteTalentAthlete?.(selectedTalentProfile.id, selectedTalentProfile.athleteId);
                  onTriggerToast(
                    `Promoted ${selectedTalentProfile.athleteName} to Senior National Squad ✓ Reassigned to Head Coach Vikram Sharma`
                  );
                }}
                className="w-full py-2.5 rounded bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Promote to Senior Squad & Reassign Coach</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTalentDrawerId(null);
                  onOpenAthlete360(selectedTalentProfile.athleteId);
                }}
                className="w-full py-2.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold transition-colors"
              >
                Open Full Athlete 360 →
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =========================================================
       * 14. CREATE ASSESSMENT PROGRAM MODAL
       * ========================================================= */}
      {isCreateProgramOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreateProgramOpen(false)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-xl bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-100 uppercase">
                + Create Assessment Program
              </span>
              <button
                onClick={() => setIsCreateProgramOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-slate-400 mb-1">
                  Program Name
                </label>
                <input
                  type="text"
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Sport</label>
                <input
                  type="text"
                  value={progSport}
                  onChange={(e) => setProgSport(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Squad</label>
                <input
                  type="text"
                  value={progSquad}
                  onChange={(e) => setProgSquad(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Assessment Period
                </label>
                <input
                  type="text"
                  value={progPeriod}
                  onChange={(e) => setProgPeriod(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Deadline</label>
                <input
                  type="text"
                  value={progDeadline}
                  onChange={(e) => setProgDeadline(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsCreateProgramOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onCreateProgram({
                    id: `aprog-${Date.now()}`,
                    programName: progName,
                    sport: progSport,
                    squad: progSquad,
                    assessmentPeriod: progPeriod,
                    tests: progSelectedTests,
                    evaluator: progEvaluator,
                    deadline: progDeadline,
                    athleteIds: progAthleteIds,
                    status: 'Active',
                  });
                  setIsCreateProgramOpen(false);
                  onTriggerToast(
                    `Created Assessment Program: ${progName} (${progSquad}) ✓`
                  );
                }}
                className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
              >
                Save Assessment Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * LOG NEW ATHLETE TEST RESULT MODAL
       * ========================================================= */}
      {isLogNewTestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsLogNewTestModalOpen(false)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-100 uppercase">
                + Log Athlete Test Result
              </span>
              <button
                onClick={() => setIsLogNewTestModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Athlete</label>
                <select
                  value={newTestAthleteId}
                  onChange={(e) => setNewTestAthleteId(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.athleteId} · {a.squad})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Standardized Test
                </label>
                <select
                  value={newTestId}
                  onChange={(e) => {
                    const tid = e.target.value;
                    setNewTestId(tid);
                    const foundT = tests.find((t) => t.id === tid);
                    if (foundT) setNewTestVal(String(foundT.numericBenchmark));
                  }}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  {tests.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category} · Benchmark: {t.benchmark})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Measured Result
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newTestVal}
                  onChange={(e) => setNewTestVal(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsLogNewTestModalOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const targetAth =
                    athletes.find((a) => a.id === newTestAthleteId) ||
                    athletes[0];
                  const targetTest =
                    tests.find((t) => t.id === newTestId) || tests[0];
                  const valNum =
                    parseFloat(newTestVal) || targetTest.numericBenchmark;
                  const existingMatch = testResults.find(
                    (r) =>
                      r.athleteId === targetAth.id &&
                      (r.testId === targetTest.id ||
                        r.testName === targetTest.name)
                  );
                  const prevVal = existingMatch
                    ? existingMatch.currentResult
                    : targetTest.lowerIsBetter
                      ? Number((valNum + 0.06).toFixed(2))
                      : Number((valNum * 0.96).toFixed(1));
                  const newRes: TestResult = {
                    id: existingMatch ? existingMatch.id : `tr-${Date.now()}`,
                    testId: targetTest.id,
                    testName: targetTest.name,
                    category: targetTest.category,
                    unit: targetTest.unit,
                    athleteId: targetAth.id,
                    athleteName: targetAth.name,
                    squad: targetAth.squad.includes('U23')
                      ? 'U23'
                      : 'Senior Squad',
                    currentResult: valNum,
                    previousResult: prevVal,
                    personalBest: targetTest.lowerIsBetter
                      ? Math.min(valNum, prevVal)
                      : Math.max(valNum, prevVal),
                    squadAverage: targetTest.numericBenchmark,
                    programBenchmark: targetTest.numericBenchmark,
                    nationalBenchmark: targetTest.lowerIsBetter
                      ? Number((targetTest.numericBenchmark * 0.98).toFixed(2))
                      : Number((targetTest.numericBenchmark * 1.04).toFixed(1)),
                    lowerIsBetter: targetTest.lowerIsBetter,
                    improvementPct: 2.4,
                    progressionStatus: 'Improving',
                    cycleHistory: [
                      {
                        cycle: 'May',
                        value: prevVal,
                        squadAvg: targetTest.numericBenchmark,
                        benchmark: targetTest.numericBenchmark,
                      },
                      {
                        cycle: 'Jul',
                        value: prevVal,
                        squadAvg: targetTest.numericBenchmark,
                        benchmark: targetTest.numericBenchmark,
                      },
                      {
                        cycle: 'Sep',
                        value: valNum,
                        squadAvg: targetTest.numericBenchmark,
                        benchmark: targetTest.numericBenchmark,
                      },
                    ],
                    fieldStatus: 'Completed',
                    validated: true,
                  };
                  onSaveTestResult(newRes);
                  setSelectedResultId(newRes.id);
                  setEntryValueInput(String(valNum));
                  setActiveAssessmentAthleteId(targetAth.id);
                  setIsLogNewTestModalOpen(false);
                  onTriggerToast(
                    `Logged & validated ${targetTest.name} (${valNum} ${targetTest.unit}) for ${targetAth.name} ✓`
                  );
                }}
                className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
              >
                Save & Validate Result ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
