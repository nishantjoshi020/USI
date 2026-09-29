import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle2,
  Droplets,
  Dumbbell,
  Eye,
  Flame,
  Filter,
  Pill,
  Plus,
  Scale,
  Search,
  Sparkles,
  Utensils,
  X,
  ShieldCheck,
  ShieldAlert,
  Calculator,
  Zap,
} from 'lucide-react';
import {
  Athlete,
  BodyComposition,
  HydrationLog,
  Meal,
  NavItemId,
  NutritionGoal,
  NutritionPlan,
  Supplement,
  UserRole,
} from '../../types/usi';

export type NutritionSubTab =
  | 'nutrition'
  | 'nutrition-plans'
  | 'nutrition-hydration'
  | 'nutrition-supplements'
  | 'nutrition-body-composition';

interface NutritionWorkspaceProps {
  activeSubTab: NutritionSubTab;
  onSelectSubTab: (tab: NutritionSubTab) => void;
  selectedRole: UserRole;
  athletes: Athlete[];
  plans: NutritionPlan[];
  hydrationLogs: HydrationLog[];
  supplements: Supplement[];
  bodyComposition: BodyComposition;
  onToggleMealConsumed: (planId: string, mealId: string) => void;
  onCreateNutritionPlan: (newPlan: NutritionPlan) => void;
  onAddHydrationIntake: (log: Omit<HydrationLog, 'id'>) => void;
  onAddSupplement: (supp: Omit<Supplement, 'id'>) => void;
  onToggleSupplementLogged: (suppId: string) => void;
  onUpdateBodyComposition?: (
    athleteId: string,
    weightKg: number,
    bodyFatPct: number,
    leanMassKg: number,
    statusLabel: 'Stable' | 'Lean Gain' | 'Monitor'
  ) => void;
  onOpenAthlete360: (athleteId: string) => void;
  onNavigateModule: (nav: NavItemId) => void;
  onTriggerToast: (msg: string) => void;
}

export const NutritionWorkspace: React.FC<NutritionWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  selectedRole,
  athletes,
  plans,
  hydrationLogs,
  supplements,
  bodyComposition,
  onToggleMealConsumed,
  onCreateNutritionPlan,
  onAddHydrationIntake,
  onAddSupplement,
  onToggleSupplementLogged,
  onUpdateBodyComposition,
  onOpenAthlete360,
  onNavigateModule,
  onTriggerToast,
}) => {
  // Filters for Section 2 Nutrition Athlete Table
  const [sportFilter, setSportFilter] = useState('All');
  const [squadFilter, setSquadFilter] = useState('All');
  const [complianceFilter, setComplianceFilter] = useState('All');
  const [hydrationFilter, setHydrationFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Athlete Plan for Drawer & Detail Panels
  const [selectedPlanDrawerId, setSelectedPlanDrawerId] = useState<
    string | null
  >(null);
  const [activeProfilePlanId, setActiveProfilePlanId] =
    useState<string>('nplan-arjun');

  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [isAddHydrationOpen, setIsAddHydrationOpen] = useState(false);
  const [isAddSupplementOpen, setIsAddSupplementOpen] = useState(false);
  const [isLogBodyCompOpen, setIsLogBodyCompOpen] = useState(false);

  // Sweat Rate & Sodium Loss Calculator State
  const [isSweatCalcOpen, setIsSweatCalcOpen] = useState(false);
  const [preExerciseMassKg, setPreExerciseMassKg] = useState(74.2);
  const [postExerciseMassKg, setPostExerciseMassKg] = useState(72.9);
  const [fluidConsumedMl, setFluidConsumedMl] = useState(800);
  const [exerciseDurationMin, setExerciseDurationMin] = useState(90);

  // Create Nutrition Plan Form State (Section 4)
  const [planAthleteId, setPlanAthleteId] =
    useState<string>('ath-arjun-mehta');
  const [planGoal, setPlanGoal] = useState<NutritionGoal>(
    'Performance + Recovery'
  );
  const [planPhase, setPlanPhase] = useState('Competition Block 3');
  const [planCalories, setPlanCalories] = useState(2850);
  const [planProtein, setPlanProtein] = useState(165);
  const [planCarbs, setPlanCarbs] = useState(380);
  const [planFat, setPlanFat] = useState(80);
  const [planMealsFreq, setPlanMealsFreq] = useState(7);
  const [planStartDate, setPlanStartDate] = useState('28 Sep 2026');
  const [planEndDate, setPlanEndDate] = useState('31 Oct 2026');

  // Add Hydration Form State (Section 6)
  const [intakeAthleteId, setIntakeAthleteId] =
    useState<string>('ath-arjun-mehta');
  const [intakeTime, setIntakeTime] = useState('20:15');
  const [intakeAmountMl, setIntakeAmountMl] = useState(350);
  const [intakeBeverage, setIntakeBeverage] = useState(
    'Evening Electrolyte Water'
  );

  // Add Supplement Form State (Section 7)
  const [suppAthleteId, setSuppAthleteId] =
    useState<string>('ath-arjun-mehta');
  const [suppName, setSuppName] = useState('Omega-3 Fish Oil');
  const [suppPurpose, setSuppPurpose] =
    useState<Supplement['purpose']>('Recovery');
  const [suppDosage, setSuppDosage] = useState('2 capsules (2000mg)');
  const [suppSchedule, setSuppSchedule] = useState('With Dinner');

  // Body Composition Metric Selector & Log Form State (Section 8)
  const [bodyCompMetric, setBodyCompMetric] = useState<
    'weightKg' | 'bodyFatPct' | 'leanMassKg' | 'bmi'
  >('weightKg');
  const [scanWeightKg, setScanWeightKg] = useState<number>(74.2);
  const [scanBodyFatPct, setScanBodyFatPct] = useState<number>(9.8);
  const [scanLeanMassKg, setScanLeanMassKg] = useState<number>(64.1);
  const [scanStatusLabel, setScanStatusLabel] = useState<
    'Stable' | 'Lean Gain' | 'Monitor'
  >('Stable');

  const activePlan =
    plans.find((p) => p.id === activeProfilePlanId) || plans[0];
  const drawerPlan =
    plans.find((p) => p.id === selectedPlanDrawerId) || null;
  const activeAthleteObj =
    athletes.find((a) => a.id === activePlan.athleteId) || athletes[0];

  // Filtered Nutrition Plans Table
  const filteredPlans = useMemo(() => {
    let sourcePlans = plans;
    if (selectedRole === 'Athlete') {
      sourcePlans = plans.filter(
        (p) =>
          p.athleteId === 'ath-1042' ||
          p.athleteName.toLowerCase().includes('arjun') ||
          p.athleteId === athletes[0]?.id
      );
      if (sourcePlans.length === 0 && plans.length > 0) sourcePlans = [plans[0]];
    }

    return sourcePlans.filter((p) => {
      if (
        searchQuery.trim() &&
        !p.athleteName.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !p.planName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      if (sportFilter !== 'All' && p.sport !== sportFilter) return false;
      if (squadFilter !== 'All' && p.squad !== squadFilter) return false;
      if (complianceFilter === 'High (≥85%)' && p.compliancePct < 85)
        return false;
      if (complianceFilter === 'Below 85%' && p.compliancePct >= 85)
        return false;
      if (hydrationFilter === 'Optimal (≥80%)' && p.hydrationCompliancePct < 80)
        return false;
      if (hydrationFilter === 'Below 80%' && p.hydrationCompliancePct >= 80)
        return false;
      if (statusFilter !== 'All' && p.status !== statusFilter) return false;
      return true;
    });
  }, [
    plans,
    selectedRole,
    athletes,
    searchQuery,
    sportFilter,
    squadFilter,
    complianceFilter,
    hydrationFilter,
    statusFilter,
  ]);

  // Hydration totals scoped to activePlan athlete (Section 6)
  const athleteHydrationLogs = useMemo(() => {
    const logs = hydrationLogs.filter(
      (h) => h.athleteId === activePlan.athleteId
    );
    if (logs.length > 0) return logs;
    // Synthesize baseline logs for the selected athlete if none logged yet
    const baseMl = Math.round((activePlan.currentHydrationL || 2.8) * 1000);
    return [
      {
        id: `hlog-base-1-${activePlan.athleteId}`,
        athleteId: activePlan.athleteId,
        time: '07:00',
        amountMl: Math.round(baseMl * 0.25),
        beverageType: 'Morning Water + Electrolytes',
      },
      {
        id: `hlog-base-2-${activePlan.athleteId}`,
        athleteId: activePlan.athleteId,
        time: '10:30',
        amountMl: Math.round(baseMl * 0.4),
        beverageType: 'Intra-Session Isotonic Fluid',
      },
      {
        id: `hlog-base-3-${activePlan.athleteId}`,
        athleteId: activePlan.athleteId,
        time: '14:15',
        amountMl: Math.round(baseMl * 0.35),
        beverageType: 'Post-Training Recovery Fluid',
      },
    ];
  }, [hydrationLogs, activePlan.athleteId, activePlan.currentHydrationL]);

  const totalHydrationMl = athleteHydrationLogs.reduce(
    (sum, h) => sum + h.amountMl,
    0
  );
  const totalHydrationL = Number((totalHydrationMl / 1000).toFixed(2));
  const hydrationTargetL = activePlan.targetHydrationL || 3.5;
  const dailyHydrationCompliancePct = Math.min(
    100,
    Math.round((totalHydrationL / hydrationTargetL) * 100)
  );
  const hydrationStatusLabel: 'Optimal' | 'Monitor' | 'Low' =
    dailyHydrationCompliancePct >= 90
      ? 'Optimal'
      : dailyHydrationCompliancePct >= 75
        ? 'Monitor'
        : 'Low';

  // Supplements scoped to activePlan athlete (or fallback)
  const athleteSupplements = useMemo(() => {
    const list = supplements.filter(
      (s) => s.athleteId === activePlan.athleteId
    );
    return list.length > 0 ? list : supplements;
  }, [supplements, activePlan.athleteId]);

  // Dynamic Body Composition for the currently selected athlete
  const activeBodyComposition: BodyComposition = useMemo(() => {
    if (bodyComposition.athleteId === activePlan.athleteId) {
      return bodyComposition;
    }
    const w = activeAthleteObj?.weightKg || 74.0;
    const hM = (activeAthleteObj?.heightCm || 178) / 100;
    const bmi = Number((w / (hM * hM)).toFixed(1));
    const bf = 10.2;
    const lean = Number((w * (1 - bf / 100)).toFixed(1));
    return {
      athleteId: activePlan.athleteId,
      athleteName: activePlan.athleteName,
      weightKg: w,
      bodyFatPct: bf,
      leanMassKg: lean,
      bmi,
      statusLabel: activePlan.bodyCompStatus || 'Stable',
      aiObservation: `${activePlan.athleteName}'s body mass (${w} kg) and lean mass (${lean} kg) remain aligned with ${activePlan.goal} targets during ${activePlan.trainingPhase}.`,
      history8w: Array.from({ length: 8 }, (_, idx) => ({
        week: `W${idx + 1}`,
        weightKg: Number((w - 0.3 + (idx % 3) * 0.15).toFixed(1)),
        bodyFatPct: Number((bf + 0.2 - idx * 0.03).toFixed(1)),
        leanMassKg: Number((lean - 0.2 + idx * 0.04).toFixed(1)),
        bmi,
      })),
    };
  }, [bodyComposition, activePlan, activeAthleteObj]);

  const handleSubmitNewPlan = () => {
    const targetAth =
      athletes.find((a) => a.id === planAthleteId) || athletes[0];
    const scaledMeals: Meal[] = activePlan.meals.map((m, idx) => {
      const ratio = planCalories / (activePlan.targetCalories || 2850);
      return {
        ...m,
        id: `meal-${Date.now()}-${idx}`,
        calories: Math.round(m.calories * ratio),
        proteinG: Math.round(m.proteinG * (planProtein / (activePlan.targetProteinG || 165))),
        carbsG: Math.round(m.carbsG * (planCarbs / (activePlan.targetCarbsG || 380))),
        fatG: Math.round(m.fatG * (planFat / (activePlan.targetFatG || 80))),
        consumed: idx < 4,
      };
    });
    const consumedMeals = scaledMeals.filter((m) => m.consumed);
    const curCal = consumedMeals.reduce((s, m) => s + m.calories, 0);
    const curProt = consumedMeals.reduce((s, m) => s + m.proteinG, 0);
    const curCarbs = consumedMeals.reduce((s, m) => s + m.carbsG, 0);
    const curFat = consumedMeals.reduce((s, m) => s + m.fatG, 0);
    const compPct = Math.min(100, Math.round((curCal / planCalories) * 100));

    const newPlan: NutritionPlan = {
      id: `nplan-${Date.now()}`,
      athleteId: targetAth.id,
      athleteName: targetAth.name,
      sport: targetAth.sport,
      squad: targetAth.squad.includes('U23') ? 'U23' : 'Senior Squad',
      planName: `${planGoal} Plan`,
      goal: planGoal,
      trainingPhase: planPhase,
      targetCalories: planCalories,
      currentCalories: curCal,
      targetProteinG: planProtein,
      currentProteinG: curProt,
      targetCarbsG: planCarbs,
      currentCarbsG: curCarbs,
      targetFatG: planFat,
      currentFatG: curFat,
      targetHydrationL: 3.5,
      currentHydrationL: 2.8,
      mealFrequency: planMealsFreq,
      startDate: planStartDate,
      endDate: planEndDate,
      compliancePct: compPct,
      hydrationCompliancePct: 80,
      supplementCompliancePct: 96,
      bodyCompStatus: 'Stable',
      status: compPct >= 80 ? 'On Track' : 'Monitor',
      compliance7d: activePlan.compliance7d,
      meals: scaledMeals,
    };
    onCreateNutritionPlan(newPlan);
    setActiveProfilePlanId(newPlan.id);
    setIsCreatePlanOpen(false);
    onTriggerToast(
      `Saved ${newPlan.planName} (${planCalories} kcal) for ${targetAth.name} ✓`
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. NUTRITION HEADER & SUB-ROUTE NAVIGATION */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Utensils className="w-4 h-4" />
              <span>USI PERFORMANCE NUTRITION & METABOLIC OPERATIONS</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1 uppercase">
              NUTRITION
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Monitor athlete nutrition, hydration, supplementation and body composition.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1.5 rounded bg-[#090D16] border border-slate-800 text-xs font-mono text-slate-300">
              Role Lens: <strong className="text-sky-400">{selectedRole}</strong>
            </span>
            {['Nutritionist', 'Sports Scientist', 'Performance Director'].includes(selectedRole) && (
              <button
                onClick={() => {
                  setPlanAthleteId(activePlan.athleteId);
                  setIsCreatePlanOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Nutrition Plan</span>
              </button>
            )}
            <button
              onClick={() => {
                setIntakeAthleteId(activePlan.athleteId);
                setIsAddHydrationOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-sky-300 font-semibold text-xs transition-colors"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>+ Add Intake</span>
            </button>
          </div>
        </div>

        {/* Sub-Routes Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                {
                  id: 'nutrition',
                  label: 'Nutrition & Athlete Fueling',
                  route: '/nutrition',
                },
                {
                  id: 'nutrition-plans',
                  label: 'Diet & Meal Plans',
                  route: '/nutrition/plans',
                },
                {
                  id: 'nutrition-hydration',
                  label: 'Hydration Tracking',
                  route: '/nutrition/hydration',
                },
                {
                  id: 'nutrition-supplements',
                  label: 'Supplements',
                  route: '/nutrition/supplements',
                },
                {
                  id: 'nutrition-body-composition',
                  label: 'Body Composition',
                  route: '/nutrition/body-composition',
                },
              ] as const
            ).map((tab) => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectSubTab(tab.id)}
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
              Active Athlete Focus:
            </span>
            <select
              value={activePlan.id}
              onChange={(e) => setActiveProfilePlanId(e.target.value)}
              className="px-2.5 py-1 rounded bg-[#090D16] border border-slate-700 text-xs font-semibold text-sky-300 focus:outline-none focus:border-sky-500"
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.athleteName} ({p.planName})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 1. TOP 5 NUTRITION KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {[
          {
            label: 'Athletes With Active Plans',
            value: '162',
            sub: '88% of federation registry',
            accent: 'text-slate-100',
            targetTab: 'nutrition' as NutritionSubTab,
          },
          {
            label: 'Plan Compliance',
            value: '84%',
            sub: '+2.1% vs last 7-day block',
            accent: 'text-emerald-400',
            targetTab: 'nutrition-plans' as NutritionSubTab,
          },
          {
            label: 'Hydration Compliance',
            value: '76%',
            sub: 'Arjun Mehta at 74% (Monitor)',
            accent: 'text-sky-400',
            targetTab: 'nutrition-hydration' as NutritionSubTab,
          },
          {
            label: 'Supplement Compliance',
            value: '91%',
            sub: '96% for Arjun Mehta',
            accent: 'text-emerald-300',
            targetTab: 'nutrition-supplements' as NutritionSubTab,
          },
          {
            label: 'Athletes Requiring Review',
            value: '12',
            sub: 'High load + sub-target hydration',
            accent: 'text-amber-400',
            targetTab: 'nutrition' as NutritionSubTab,
          },
        ].map((kpi) => (
          <button
            key={kpi.label}
            onClick={() => onSelectSubTab(kpi.targetTab)}
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

      {/* 9. NUTRITION → TRAINING INTEGRATION BANNER */}
      <div className="bg-[#0F1623] border border-amber-500/40 rounded-lg p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 mt-0.5">
            <Bot className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-amber-300 uppercase">
                AI PERFORMANCE INSIGHT · NUTRITION ↔ TRAINING CORRELATION
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-[10px] text-slate-200">
                Arjun Mehta · High Training Load (+22%) + Hydration Compliance 74%
              </span>
            </div>
            <p className="text-slate-100 font-medium">
              "Hydration intake is below the athlete's current target while training load remains elevated."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              onSelectSubTab('nutrition-hydration');
              onTriggerToast('Opened Arjun Mehta Hydration Plan for review');
            }}
            className="px-3.5 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Review Hydration Plan
          </button>
          <button
            onClick={() => onOpenAthlete360('ath-arjun-mehta')}
            className="px-3 py-2 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-xs text-slate-200 font-medium"
          >
            Athlete 360 →
          </button>
        </div>
      </div>

      {/* =========================================================
       * DEFAULT TAB (/nutrition): ATHLETE TABLE + ARJUN PROFILE
       * ========================================================= */}
      {activeSubTab === 'nutrition' && (
        <>
          {/* 2. NUTRITION ATHLETE TABLE */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
                  NUTRITION ATHLETE OPERATIONAL TABLE
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any athlete row to open the Athlete Nutrition Detail Drawer
                </p>
              </div>

              {/* 5 Required Filters: Sport, Squad, Compliance, Hydration, Status */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search athlete..."
                    className="pl-8 pr-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-100 w-40"
                  />
                </div>

                <select
                  value={sportFilter}
                  onChange={(e) => setSportFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Sport: All</option>
                  <option value="Football">Football</option>
                </select>

                <select
                  value={squadFilter}
                  onChange={(e) => setSquadFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Squad: All</option>
                  <option value="Senior Squad">Senior Squad</option>
                  <option value="U23">U23</option>
                </select>

                <select
                  value={complianceFilter}
                  onChange={(e) => setComplianceFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Compliance: All</option>
                  <option value="High (≥85%)">High (≥85%)</option>
                  <option value="Below 85%">Below 85%</option>
                </select>

                <select
                  value={hydrationFilter}
                  onChange={(e) => setHydrationFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Hydration: All</option>
                  <option value="Optimal (≥80%)">Optimal (≥80%)</option>
                  <option value="Below 80%">Below 80%</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-slate-200"
                >
                  <option value="All">Status: All</option>
                  <option value="On Track">On Track</option>
                  <option value="Monitor">Monitor</option>
                  <option value="Review Required">Review Required</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B101B] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Athlete</th>
                    <th className="py-2.5 px-3">Squad</th>
                    <th className="py-2.5 px-3">Nutrition Plan</th>
                    <th className="py-2.5 px-3">Compliance</th>
                    <th className="py-2.5 px-3">Hydration</th>
                    <th className="py-2.5 px-3">Supplements</th>
                    <th className="py-2.5 px-3">Body Composition</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {filteredPlans.map((plan) => (
                    <tr
                      key={plan.id}
                      onClick={() => {
                        setActiveProfilePlanId(plan.id);
                        setSelectedPlanDrawerId(plan.id);
                      }}
                      className="hover:bg-[#141D2E] cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-semibold text-slate-100">
                        {plan.athleteName}
                      </td>
                      <td className="py-3 px-3 text-slate-300">{plan.squad}</td>
                      <td className="py-3 px-3 text-sky-300 font-medium">
                        {plan.planName}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-100 tabular-nums">
                        {plan.compliancePct}%
                      </td>
                      <td className="py-3 px-3 font-mono font-bold tabular-nums">
                        <span
                          className={
                            plan.hydrationCompliancePct < 80
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }
                        >
                          {plan.hydrationCompliancePct}%
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-300 tabular-nums">
                        {plan.supplementCompliancePct}%
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-200 font-mono text-[11px]">
                          {plan.bodyCompStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded font-mono text-[11px] font-semibold border ${
                            plan.status === 'On Track'
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                              : plan.status === 'Monitor'
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                          }`}
                        >
                          {plan.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. ATHLETE NUTRITION PROFILE (ARJUN MEHTA) + 5. MEAL PLAN PREVIEW */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Section 3: ARJUN MEHTA Nutrition Profile */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[11px] font-mono text-sky-400 uppercase">
                    ATHLETE NUTRITION PROFILE
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5 uppercase">
                    {activePlan.athleteName} — Nutrition Profile
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-xs text-sky-300 font-bold">
                  Compliance: {activePlan.compliancePct}%
                </span>
              </div>

              {/* Daily Target vs Current Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
                {[
                  {
                    label: 'Calories',
                    target: `${activePlan.targetCalories.toLocaleString()} kcal`,
                    current: `${activePlan.currentCalories.toLocaleString()} kcal`,
                    pct: Math.round(
                      (activePlan.currentCalories / activePlan.targetCalories) *
                        100
                    ),
                  },
                  {
                    label: 'Protein',
                    target: `${activePlan.targetProteinG} g`,
                    current: `${activePlan.currentProteinG} g`,
                    pct: Math.round(
                      (activePlan.currentProteinG / activePlan.targetProteinG) *
                        100
                    ),
                  },
                  {
                    label: 'Carbohydrates',
                    target: `${activePlan.targetCarbsG} g`,
                    current: `${activePlan.currentCarbsG} g`,
                    pct: Math.round(
                      (activePlan.currentCarbsG / activePlan.targetCarbsG) * 100
                    ),
                  },
                  {
                    label: 'Fat',
                    target: `${activePlan.targetFatG} g`,
                    current: `${activePlan.currentFatG} g`,
                    pct: Math.round(
                      (activePlan.currentFatG / activePlan.targetFatG) * 100
                    ),
                  },
                  {
                    label: 'Hydration',
                    target: `${activePlan.targetHydrationL} L`,
                    current: `${totalHydrationL} L`,
                    pct: dailyHydrationCompliancePct,
                  },
                ].map((macro) => (
                  <div
                    key={macro.label}
                    className="p-3 rounded bg-[#0B101B] border border-slate-800 space-y-1"
                  >
                    <span className="text-slate-400 block text-[10px]">
                      {macro.label}
                    </span>
                    <strong className="font-mono text-slate-100 text-xs block tabular-nums">
                      {macro.current}
                    </strong>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      Target: {macro.target}
                    </span>
                    <span className="font-mono text-[10px] text-sky-400 font-bold block">
                      {macro.pct}%
                    </span>
                  </div>
                ))}
              </div>

              {/* 7-Day Nutrition Compliance Chart */}
              <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 uppercase">
                    7-Day Nutrition & Hydration Compliance Trend
                  </span>
                  <span className="font-mono text-[11px] text-emerald-400">
                    Rolling Mean: {activePlan.compliancePct}%
                  </span>
                </div>
                <div className="grid grid-cols-7 gap-2 items-end h-28 pt-3">
                  {activePlan.compliance7d.map((pt) => (
                    <div
                      key={pt.day}
                      className="flex flex-col items-center gap-1"
                    >
                      <span className="text-[10px] font-mono text-slate-300">
                        {pt.compliancePct}%
                      </span>
                      <div className="w-full bg-slate-800/70 rounded-t h-16 flex items-end p-0.5 gap-0.5">
                        <div
                          className="w-1/2 bg-emerald-500 rounded-t"
                          style={{ height: `${pt.compliancePct}%` }}
                          title={`Nutrition: ${pt.compliancePct}%`}
                        />
                        <div
                          className="w-1/2 bg-sky-400 rounded-t"
                          style={{ height: `${pt.hydrationPct}%` }}
                          title={`Hydration: ${pt.hydrationPct}%`}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {pt.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 5: Daily Meal Plan Preview with [Mark Consumed] */}
            <div className="xl:col-span-6 bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 uppercase">
                    DAILY MEAL PLAN — {activePlan.athleteName.toUpperCase()}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Goal: {activePlan.goal} · Phase: {activePlan.trainingPhase}
                  </p>
                </div>
                <button
                  onClick={() => onSelectSubTab('nutrition-plans')}
                  className="text-xs text-sky-400 hover:underline font-medium"
                >
                  Full Diet Plan →
                </button>
              </div>

              <div className="space-y-2 max-h-[330px] overflow-y-auto pr-1 text-xs">
                {activePlan.meals.map((meal) => (
                  <div
                    key={meal.id}
                    className="p-3 rounded bg-[#0B101B] border border-slate-800 flex flex-wrap items-center justify-between gap-2"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <strong className="text-slate-100">{meal.name}</strong>
                        <span className="font-mono text-[11px] text-slate-400">
                          {meal.time}
                        </span>
                        <span className="font-mono text-[11px] text-sky-400">
                          {meal.calories} kcal · P {meal.proteinG}g · C{' '}
                          {meal.carbsG}g · F {meal.fatG}g
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {meal.menuSummary}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onToggleMealConsumed(activePlan.id, meal.id)
                      }
                      className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors ${
                        meal.consumed
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                          : 'bg-sky-500 hover:bg-sky-400 text-slate-950'
                      }`}
                    >
                      {meal.consumed ? '✓ Consumed' : 'Mark Consumed'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* =========================================================
       * TAB 2 (/nutrition/plans): DIET PLAN & MEAL PLAN
       * ========================================================= */}
      {activeSubTab === 'nutrition-plans' && (
        <div className="space-y-5">
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-100 uppercase">
                  ACTIVE DIET PLAN — {activePlan.athleteName.toUpperCase()}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Periodised macronutrient prescription & 7-meal fueling schedule
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-xs text-sky-300 font-semibold">
                {activePlan.planName}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Goal</span>
                <strong className="text-sky-300 mt-0.5 block">
                  {activePlan.goal}
                </strong>
              </div>
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">
                  Training Phase
                </span>
                <strong className="text-slate-100 mt-0.5 block">
                  {activePlan.trainingPhase}
                </strong>
              </div>
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">
                  Daily Calories
                </span>
                <strong className="font-mono text-slate-100 mt-0.5 block">
                  {activePlan.targetCalories.toLocaleString()} kcal
                </strong>
              </div>
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Protein</span>
                <strong className="font-mono text-emerald-400 mt-0.5 block">
                  {activePlan.targetProteinG} g
                </strong>
              </div>
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">
                  Carbs / Fat
                </span>
                <strong className="font-mono text-slate-200 mt-0.5 block">
                  {activePlan.targetCarbsG}g / {activePlan.targetFatG}g
                </strong>
              </div>
              <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                <span className="text-slate-400 block text-[10px]">
                  Duration
                </span>
                <strong className="font-mono text-slate-200 mt-0.5 block">
                  {activePlan.startDate} – {activePlan.endDate}
                </strong>
              </div>
            </div>

            {/* Full 7-Meal Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#0B101B] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Meal</th>
                    <th className="py-2.5 px-3">Time</th>
                    <th className="py-2.5 px-3">Prescribed Menu</th>
                    <th className="py-2.5 px-3">Calories</th>
                    <th className="py-2.5 px-3">Protein</th>
                    <th className="py-2.5 px-3">Carbs</th>
                    <th className="py-2.5 px-3">Fat</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/70">
                  {activePlan.meals.map((meal) => (
                    <tr key={meal.id} className="hover:bg-[#141D2E]">
                      <td className="py-3 px-3 font-bold text-slate-100">
                        {meal.name}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {meal.time}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {meal.menuSummary}
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-100">
                        {meal.calories} kcal
                      </td>
                      <td className="py-3 px-3 font-mono text-emerald-400">
                        {meal.proteinG} g
                      </td>
                      <td className="py-3 px-3 font-mono text-sky-300">
                        {meal.carbsG} g
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300">
                        {meal.fatG} g
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                            meal.consumed
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {meal.consumed ? 'Consumed' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() =>
                            onToggleMealConsumed(activePlan.id, meal.id)
                          }
                          className={`px-3 py-1 rounded font-semibold text-xs ${
                            meal.consumed
                              ? 'bg-slate-800 text-slate-300'
                              : 'bg-sky-500 text-slate-950'
                          }`}
                        >
                          {meal.consumed ? 'Undo' : 'Mark Consumed'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 3 (/nutrition/hydration): HYDRATION TRACKING
       * ========================================================= */}
      {activeSubTab === 'nutrition-hydration' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase">
                HYDRATION TRACKING — {activePlan.athleteName.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Chronological fluid intake log & electrolyte compliance for {activePlan.athleteName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-sky-500/15 border border-sky-500/30 font-mono text-xs text-sky-300 font-semibold">
                Target: {hydrationTargetL.toFixed(1)} L / day
              </span>
              <button
                onClick={() => setIsSweatCalcOpen(true)}
                className="px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 font-mono text-xs text-amber-300 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Sweat Rate & Sodium Calculator</span>
              </button>
            </div>
          </div>

          {/* 4 Summary Cards matching Section 6 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block">Daily Target</span>
              <strong className="text-xl font-mono font-bold text-slate-100 mt-1 block">
                {hydrationTargetL.toFixed(1)} L
              </strong>
            </div>
            <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block">Consumed</span>
              <strong className="text-xl font-mono font-bold text-sky-400 mt-1 block">
                {totalHydrationL} L ({totalHydrationMl} ml)
              </strong>
            </div>
            <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block">Today's Compliance</span>
              <strong className="text-xl font-mono font-bold text-emerald-400 mt-1 block">
                {dailyHydrationCompliancePct}%
              </strong>
            </div>
            <div className="p-4 rounded bg-[#0B101B] border border-slate-800">
              <span className="text-slate-400 block">Hydration Status</span>
              <strong
                className={`text-xl font-mono font-bold mt-1 block ${
                  hydrationStatusLabel === 'Optimal'
                    ? 'text-emerald-400'
                    : hydrationStatusLabel === 'Monitor'
                      ? 'text-amber-400'
                      : 'text-rose-400'
                }`}
              >
                {hydrationStatusLabel}
              </strong>
            </div>
          </div>

          {/* Hydration Timeline */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold text-slate-200 uppercase">
              Daily Intake Timeline ({athleteHydrationLogs.length} Entries)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              {athleteHydrationLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 rounded bg-[#0B101B] border border-slate-800 space-y-1"
                >
                  <div className="font-mono text-sky-400 font-bold">
                    {log.time}
                  </div>
                  <div className="text-base font-mono font-bold text-slate-100">
                    {log.amountMl} ml
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {log.beverageType}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 4 (/nutrition/supplements): SUPPLEMENT MANAGEMENT
       * ========================================================= */}
      {activeSubTab === 'nutrition-supplements' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase">
                SUPPLEMENT MANAGEMENT — {activePlan.athleteName.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Batch-tested sports nutrition supplementation schedule & intake compliance (No medical claims)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>100% WADA & Informed-Sport Certified</span>
              </span>
              <button
                onClick={() => {
                  setSuppAthleteId(activePlan.athleteId);
                  setIsAddSupplementOpen(true);
                }}
                className="px-4 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
              >
                + Add Supplement
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0B101B] border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                  <th className="py-2.5 px-4">Supplement</th>
                  <th className="py-2.5 px-3">Batch Certificate</th>
                  <th className="py-2.5 px-3">Purpose</th>
                  <th className="py-2.5 px-3">Dosage</th>
                  <th className="py-2.5 px-3">Schedule</th>
                  <th className="py-2.5 px-3">Compliance</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-4 text-right">Log Intake</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70">
                {athleteSupplements.map((supp) => (
                  <tr key={supp.id} className="hover:bg-[#141D2E]">
                    <td className="py-3 px-4 font-bold text-slate-100">
                      {supp.name}
                    </td>
                    <td className="py-3 px-3 font-mono text-[11px] text-emerald-300">
                      <span className="inline-flex items-center gap-1 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                        LGC-BATCH-88219 (Pass)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-sky-300">{supp.purpose}</td>
                    <td className="py-3 px-3 font-mono text-slate-200">
                      {supp.dosage}
                    </td>
                    <td className="py-3 px-3 text-slate-300">{supp.schedule}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                      {supp.compliancePct}%
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[11px]">
                        {supp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          onToggleSupplementLogged(supp.id);
                          onTriggerToast(
                            `Logged ${supp.name} dose for ${activePlan.athleteName} ✓`
                          );
                        }}
                        className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
                      >
                        Log Dose ✓
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================
       * TAB 5 (/nutrition/body-composition): BODY COMPOSITION
       * ========================================================= */}
      {activeSubTab === 'nutrition-body-composition' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase">
                BODY COMPOSITION TELEMETRY — {activeBodyComposition.athleteName.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                8-week anthropometric & DEXA lean mass progression
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold">
                Status: {activeBodyComposition.statusLabel}
              </span>
              <button
                onClick={() => {
                  setScanWeightKg(activeBodyComposition.weightKg);
                  setScanBodyFatPct(activeBodyComposition.bodyFatPct);
                  setScanLeanMassKg(activeBodyComposition.leanMassKg);
                  setScanStatusLabel(activeBodyComposition.statusLabel);
                  setIsLogBodyCompOpen(true);
                }}
                className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
              >
                + Log Body Composition Scan
              </button>
            </div>
          </div>

          {/* 4 Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {(
              [
                {
                  id: 'weightKg',
                  label: 'Weight',
                  val: `${activeBodyComposition.weightKg} kg`,
                },
                {
                  id: 'bodyFatPct',
                  label: 'Body Fat %',
                  val: `${activeBodyComposition.bodyFatPct}%`,
                },
                {
                  id: 'leanMassKg',
                  label: 'Lean Mass',
                  val: `${activeBodyComposition.leanMassKg} kg`,
                },
                {
                  id: 'bmi',
                  label: 'BMI',
                  val: `${activeBodyComposition.bmi}`,
                },
              ] as const
            ).map((m) => (
              <button
                key={m.id}
                onClick={() => setBodyCompMetric(m.id)}
                className={`p-4 rounded border text-left transition-all ${
                  bodyCompMetric === m.id
                    ? 'bg-sky-500/15 border-sky-400'
                    : 'bg-[#0B101B] border-slate-800'
                }`}
              >
                <span className="text-slate-400 block">{m.label}</span>
                <strong className="text-xl font-mono font-bold text-slate-100 mt-1 block">
                  {m.val}
                </strong>
              </button>
            ))}
          </div>

          {/* 8-Week Trend Chart */}
          <div className="p-4 rounded bg-[#0B101B] border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase">
              8-Week Trend ({bodyCompMetric})
            </div>
            <div className="grid grid-cols-8 gap-2 items-end h-32 pt-4">
              {activeBodyComposition.history8w.map((pt) => {
                const val = pt[bodyCompMetric];
                return (
                  <div
                    key={pt.week}
                    className="flex flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-mono text-sky-300 font-bold">
                      {val}
                    </span>
                    <div className="w-full bg-slate-800/70 rounded-t h-20 flex items-end p-1">
                      <div
                        className="w-full bg-sky-500/80 rounded-t"
                        style={{ height: '75%' }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">
                      {pt.week}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Required Neutral AI Observation */}
          <div className="p-4 rounded-md bg-[#0B101B] border border-sky-500/30 flex items-start gap-3 text-xs">
            <Bot className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-sky-300 uppercase">
                AI Observation (Non-Diagnostic)
              </div>
              <p className="text-slate-100 mt-0.5 font-medium">
                "{activeBodyComposition.aiObservation}"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * NUTRITION DETAIL DRAWER (WHEN ATHLETE ROW IS CLICKED)
       * ========================================================= */}
      {drawerPlan && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            onClick={() => setSelectedPlanDrawerId(null)}
            className="fixed inset-0 bg-black/65 backdrop-blur-[1px]"
          />
          <aside className="relative w-full max-w-lg bg-[#0F1623] border-l border-slate-800 h-full p-5 flex flex-col justify-between z-10 overflow-y-auto shadow-2xl">
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                <div>
                  <div className="text-[10px] font-mono text-emerald-400 uppercase">
                    ATHLETE NUTRITION DETAIL DRAWER
                  </div>
                  <h3 className="text-base font-bold text-slate-100 mt-0.5 uppercase">
                    {drawerPlan.athleteName} — Nutrition Profile
                  </h3>
                  <div className="text-slate-400 mt-0.5">
                    {drawerPlan.squad} · {drawerPlan.planName} ({drawerPlan.goal})
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlanDrawerId(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Daily Calories</span>
                  <strong className="font-mono text-sm text-slate-100 mt-0.5 block">
                    {drawerPlan.currentCalories.toLocaleString()} /{' '}
                    {drawerPlan.targetCalories.toLocaleString()} kcal
                  </strong>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Protein</span>
                  <strong className="font-mono text-sm text-emerald-400 mt-0.5 block">
                    {drawerPlan.currentProteinG} / {drawerPlan.targetProteinG} g
                  </strong>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Carbohydrates</span>
                  <strong className="font-mono text-sm text-sky-300 mt-0.5 block">
                    {drawerPlan.currentCarbsG} / {drawerPlan.targetCarbsG} g
                  </strong>
                </div>
                <div className="p-3 rounded bg-[#0B101B] border border-slate-800">
                  <span className="text-slate-400 block">Hydration</span>
                  <strong className="font-mono text-sm text-amber-300 mt-0.5 block">
                    {drawerPlan.currentHydrationL} / {drawerPlan.targetHydrationL}{' '}
                    L ({drawerPlan.hydrationCompliancePct}%)
                  </strong>
                </div>
              </div>

              <div className="space-y-2">
                <div className="font-bold text-slate-200 uppercase">
                  Daily Meals Checklist
                </div>
                {drawerPlan.meals.map((m) => (
                  <div
                    key={m.id}
                    className="p-2.5 rounded bg-[#0B101B] border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <strong className="text-slate-100">{m.name}</strong>
                      <span className="ml-2 font-mono text-slate-400">
                        {m.calories} kcal · {m.proteinG}g P
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleMealConsumed(drawerPlan.id, m.id)}
                      className={`px-2.5 py-1 rounded font-semibold ${
                        m.consumed
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-sky-500 text-slate-950'
                      }`}
                    >
                      {m.consumed ? '✓ Consumed' : 'Mark Consumed'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex gap-2 text-xs">
              <button
                onClick={() => {
                  setSelectedPlanDrawerId(null);
                  onOpenAthlete360(drawerPlan.athleteId);
                }}
                className="flex-1 py-2 rounded bg-sky-500 text-slate-950 font-semibold"
              >
                Open Athlete 360 →
              </button>
              <button
                onClick={() => {
                  setSelectedPlanDrawerId(null);
                  onSelectSubTab('nutrition-hydration');
                }}
                className="flex-1 py-2 rounded bg-slate-800 text-slate-200 font-medium"
              >
                Hydration Log
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =========================================================
       * MODAL 1: CREATE NUTRITION PLAN (SECTION 4)
       * ========================================================= */}
      {isCreatePlanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsCreatePlanOpen(false)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-xl bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-100 uppercase">
                Create Nutrition Plan
              </span>
              <button
                onClick={() => setIsCreatePlanOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Athlete</label>
                <select
                  value={planAthleteId}
                  onChange={(e) => setPlanAthleteId(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Goal</label>
                <select
                  value={planGoal}
                  onChange={(e) =>
                    setPlanGoal(e.target.value as NutritionGoal)
                  }
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  <option value="Performance + Recovery">
                    Performance + Recovery
                  </option>
                  <option value="Performance">Performance</option>
                  <option value="Recovery">Recovery</option>
                  <option value="Weight Management">Weight Management</option>
                  <option value="Body Composition">Body Composition</option>
                  <option value="Competition Preparation">
                    Competition Preparation
                  </option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Training Phase
                </label>
                <input
                  type="text"
                  value={planPhase}
                  onChange={(e) => setPlanPhase(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Meal Frequency
                </label>
                <input
                  type="number"
                  value={planMealsFreq}
                  onChange={(e) => setPlanMealsFreq(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Daily Calories (kcal)
                </label>
                <input
                  type="number"
                  value={planCalories}
                  onChange={(e) => setPlanCalories(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={planProtein}
                  onChange={(e) => setPlanProtein(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Carbohydrates (g)
                </label>
                <input
                  type="number"
                  value={planCarbs}
                  onChange={(e) => setPlanCarbs(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={planFat}
                  onChange={(e) => setPlanFat(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Start Date</label>
                <input
                  type="text"
                  value={planStartDate}
                  onChange={(e) => setPlanStartDate(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">End Date</label>
                <input
                  type="text"
                  value={planEndDate}
                  onChange={(e) => setPlanEndDate(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsCreatePlanOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitNewPlan}
                className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
              >
                Save Nutrition Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * MODAL 2: ADD HYDRATION INTAKE (SECTION 6)
       * ========================================================= */}
      {isAddHydrationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddHydrationOpen(false)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-100 uppercase">
                + Add Hydration Intake
              </span>
              <button
                onClick={() => setIsAddHydrationOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Athlete</label>
                <select
                  value={intakeAthleteId}
                  onChange={(e) => setIntakeAthleteId(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.athleteId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Time</label>
                <input
                  type="text"
                  value={intakeTime}
                  onChange={(e) => setIntakeTime(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Volume (ml)
                </label>
                <input
                  type="number"
                  step={50}
                  value={intakeAmountMl}
                  onChange={(e) => setIntakeAmountMl(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Beverage / Solution
                </label>
                <input
                  type="text"
                  value={intakeBeverage}
                  onChange={(e) => setIntakeBeverage(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAddHydrationOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAddHydrationIntake({
                    athleteId: intakeAthleteId,
                    time: intakeTime,
                    amountMl: intakeAmountMl,
                    beverageType: intakeBeverage,
                  });
                  const matchPlan = plans.find(
                    (p) => p.athleteId === intakeAthleteId
                  );
                  if (matchPlan) setActiveProfilePlanId(matchPlan.id);
                  setIsAddHydrationOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
              >
                Log Hydration Intake
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * MODAL 3: ADD SUPPLEMENT (SECTION 7)
       * ========================================================= */}
      {isAddSupplementOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsAddSupplementOpen(false)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-100 uppercase">
                + Add Supplement to Protocol
              </span>
              <button
                onClick={() => setIsAddSupplementOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Athlete</label>
                <select
                  value={suppAthleteId}
                  onChange={(e) => setSuppAthleteId(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  {athletes.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.athleteId})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Supplement Name
                </label>
                <input
                  type="text"
                  value={suppName}
                  onChange={(e) => setSuppName(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Purpose</label>
                <select
                  value={suppPurpose}
                  onChange={(e) =>
                    setSuppPurpose(e.target.value as Supplement['purpose'])
                  }
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  <option value="Recovery">Recovery</option>
                  <option value="Hydration">Hydration</option>
                  <option value="General">General</option>
                  <option value="Performance">Performance</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Dosage</label>
                <input
                  type="text"
                  value={suppDosage}
                  onChange={(e) => setSuppDosage(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Schedule</label>
                <input
                  type="text"
                  value={suppSchedule}
                  onChange={(e) => setSuppSchedule(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsAddSupplementOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onAddSupplement({
                    athleteId: suppAthleteId,
                    name: suppName,
                    purpose: suppPurpose,
                    dosage: suppDosage,
                    schedule: suppSchedule,
                    compliancePct: 100,
                    status: 'Active',
                  });
                  const matchPlan = plans.find(
                    (p) => p.athleteId === suppAthleteId
                  );
                  if (matchPlan) setActiveProfilePlanId(matchPlan.id);
                  setIsAddSupplementOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
              >
                Save Supplement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
       * MODAL 4: LOG BODY COMPOSITION SCAN (SECTION 8)
       * ========================================================= */}
      {isLogBodyCompOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsLogBodyCompOpen(false)}
            className="fixed inset-0 bg-black/75"
          />
          <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 space-y-4 z-10 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-bold text-sm text-slate-100 uppercase">
                Log Body Composition Scan ({activePlan.athleteName})
              </span>
              <button
                onClick={() => setIsLogBodyCompOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-400 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={scanWeightKg}
                  onChange={(e) => setScanWeightKg(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Body Fat (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={scanBodyFatPct}
                  onChange={(e) => setScanBodyFatPct(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Lean Mass (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={scanLeanMassKg}
                  onChange={(e) => setScanLeanMassKg(Number(e.target.value))}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 font-mono text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">
                  Status Classification
                </label>
                <select
                  value={scanStatusLabel}
                  onChange={(e) =>
                    setScanStatusLabel(
                      e.target.value as 'Stable' | 'Lean Gain' | 'Monitor'
                    )
                  }
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  <option value="Stable">Stable</option>
                  <option value="Lean Gain">Lean Gain</option>
                  <option value="Monitor">Monitor</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsLogBodyCompOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onUpdateBodyComposition) {
                    onUpdateBodyComposition(
                      activePlan.athleteId,
                      scanWeightKg,
                      scanBodyFatPct,
                      scanLeanMassKg,
                      scanStatusLabel
                    );
                  }
                  setIsLogBodyCompOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-sky-500 text-slate-950 font-semibold"
              >
                Save Scan Telemetry
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Sweat Rate & Sodium Loss Calculator Modal */}
      {isSweatCalcOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b111e] border border-amber-500/40 rounded-xl max-w-lg w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">Sweat Rate & Sodium Loss Profile Calculator</h3>
                  <span className="text-[11px] font-mono text-amber-400">Clinical Hydro-Electrolyte Replacement Model</span>
                </div>
              </div>
              <button
                onClick={() => setIsSweatCalcOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Pre-Exercise Mass (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={preExerciseMassKg}
                  onChange={(e) => setPreExerciseMassKg(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Post-Exercise Mass (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={postExerciseMassKg}
                  onChange={(e) => setPostExerciseMassKg(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Fluid Consumed (ml)</label>
                <input
                  type="number"
                  step="50"
                  value={fluidConsumedMl}
                  onChange={(e) => setFluidConsumedMl(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Session Duration (min)</label>
                <input
                  type="number"
                  step="5"
                  value={exerciseDurationMin}
                  onChange={(e) => setExerciseDurationMin(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded bg-[#090D16] border border-slate-700 text-white font-mono"
                />
              </div>
            </div>

            {/* Dynamic Calculated Outputs */}
            {(() => {
              const weightLossKg = Math.max(0, preExerciseMassKg - postExerciseMassKg);
              const totalSweatLossMl = weightLossKg * 1000 + fluidConsumedMl;
              const durationHours = exerciseDurationMin / 60 || 1;
              const sweatRateLHr = (totalSweatLossMl / durationHours / 1000).toFixed(2);
              const sodiumReplenishMgHr = Math.round(Number(sweatRateLHr) * 950);
              return (
                <div className="p-3.5 rounded-lg bg-[#070D18] border border-amber-500/30 space-y-2">
                  <div className="text-[11px] font-bold text-amber-300 uppercase">Calculated Physiological Deficits:</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">TOTAL SWEAT LOSS</span>
                      <strong className="text-sm font-mono text-white">{totalSweatLossMl} ml</strong>
                    </div>
                    <div className="p-2 rounded bg-[#090D16] border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">SWEAT RATE</span>
                      <strong className="text-sm font-mono text-amber-400">{sweatRateLHr} L/hr</strong>
                    </div>
                    <div className="p-2 rounded bg-[#090D16] border border-slate-800 col-span-2">
                      <span className="text-[10px] text-slate-400 block">PRESCRIBED SODIUM REPLACEMENT TARGET</span>
                      <strong className="text-sm font-mono text-emerald-400">
                        {sodiumReplenishMgHr} mg Na+ / hour (Isotonic Osmolality: 285 mOsm/kg)
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })()}

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsSweatCalcOpen(false)}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onTriggerToast(`Updated personalized electrolyte target for ${activePlan.athleteName} based on sweat test ✓`);
                  setIsSweatCalcOpen(false);
                }}
                className="px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
              >
                Apply To Hydration Target
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
