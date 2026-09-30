import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Download,
  ExternalLink,
  FileCheck,
  Filter,
  PanelRightOpen,
  Search,
  SlidersHorizontal,
  Square,
  UserCheck,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  Athlete,
  AthleteTrainingStatus,
  MedicalClearanceStatus,
  UserRole,
  VerificationStatus,
} from '../../types/usi';
import {
  AthleteAvatar,
  MedicalStatusBadge,
  ReadinessScoreIndicator,
  RiskBadge,
  TrainingStatusBadge,
  VerificationStatusBadge,
} from '../ui/Badges';
import { AVAILABLE_COACHES } from '../../data/athlete360Defaults';
import { exportAthletesRoster } from '../../utils/exportEngine';

interface AthleteRegistryPageProps {
  athletes: Athlete[];
  onOpenAthlete360: (athlete: Athlete) => void;
  onOpenQuickDrawer: (athlete: Athlete) => void;
  onOpenAddAthleteModal: () => void;
  onOpenAssignCoachModal: (athlete: Athlete) => void;
  onOpenReviewApplicationModal: (athlete: Athlete) => void;
  onBulkUpdateAthletes: (
    athleteIds: string[],
    updates: Partial<Athlete>,
    actionDescription: string
  ) => void;
  onTriggerToast: (msg: string) => void;
  selectedRole?: UserRole;
  initialSummaryKpi?: string | null;
}

export const AthleteRegistryPage: React.FC<AthleteRegistryPageProps> = ({
  athletes,
  onOpenAthlete360,
  onOpenQuickDrawer,
  onOpenAddAthleteModal,
  onOpenAssignCoachModal,
  onOpenReviewApplicationModal,
  onBulkUpdateAthletes,
  onTriggerToast,
  selectedRole = 'Performance Director',
  initialSummaryKpi = null,
}) => {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('All');
  const [programFilter, setProgramFilter] = useState('All');
  const [squadFilter, setSquadFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [readinessFilter, setReadinessFilter] = useState('All');
  const [injuryRiskFilter, setInjuryRiskFilter] = useState('All');
  const [verificationFilter, setVerificationFilter] = useState(
    initialSummaryKpi === 'pending-verification' ? 'Pending' : 'All'
  );
  const [medicalFilter, setMedicalFilter] = useState('All');
  const [wadaFilter, setWadaFilter] = useState('All');
  const [incompleteOnly, setIncompleteOnly] = useState(false);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // Active KPI Card Filter
  const [activeSummaryKpi, setActiveSummaryKpi] = useState<string | null>(
    initialSummaryKpi
  );

  React.useEffect(() => {
    if (initialSummaryKpi === 'pending-verification') {
      setActiveSummaryKpi('pending-verification');
      setVerificationFilter('Pending');
    } else if (initialSummaryKpi === null) {
      setActiveSummaryKpi(null);
      setVerificationFilter('All');
    }
  }, [initialSummaryKpi]);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkModalType, setBulkModalType] = useState<
    'squad' | 'coach' | 'status' | null
  >(null);
  const [bulkTargetValue, setBulkTargetValue] = useState('');

  // Dynamic Summary KPI counts
  const pendingVerificationCount = useMemo(
    () =>
      Math.max(
        8,
        athletes.filter((a) => a.verificationStatus === 'Pending').length + 5
      ),
    [athletes]
  );

  const incompleteProfilesCount = useMemo(
    () =>
      Math.max(9, athletes.filter((a) => a.profileCompletion < 90).length + 7),
    [athletes]
  );

  const medicalPendingCount = useMemo(
    () =>
      Math.max(
        5,
        athletes.filter((a) => a.medicalStatus !== 'Cleared').length
      ),
    [athletes]
  );

  const filteredAthletes = useMemo(() => {
    // Athlete persona only sees their own individual registration record
    if (selectedRole === 'Athlete') {
      return athletes.slice(0, 1);
    }

    return athletes.filter((a) => {
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matches =
          a.name.toLowerCase().includes(q) ||
          a.athleteId.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          a.squad.toLowerCase().includes(q) ||
          a.coach.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (sportFilter !== 'All' && a.sport !== sportFilter) return false;
      if (programFilter !== 'All' && a.program !== programFilter) return false;
      if (
        squadFilter !== 'All' &&
        a.squad !== squadFilter &&
        !a.squad.includes(squadFilter.replace(' Squad', ''))
      )
        return false;
      if (statusFilter !== 'All' && a.trainingStatus !== statusFilter)
        return false;

      if (readinessFilter === 'High (80+)' && a.readiness < 80) return false;
      if (
        readinessFilter === 'Monitor (65–79)' &&
        (a.readiness < 65 || a.readiness >= 80)
      )
        return false;
      if (readinessFilter === 'Low (<65)' && a.readiness >= 65) return false;

      if (injuryRiskFilter !== 'All' && a.injuryRisk !== injuryRiskFilter)
        return false;
      if (
        verificationFilter !== 'All' &&
        a.verificationStatus !== verificationFilter
      )
        return false;
      if (medicalFilter === 'Not Cleared') {
        if (a.medicalStatus === 'Cleared') return false;
      } else if (medicalFilter !== 'All' && a.medicalStatus !== medicalFilter) {
        return false;
      }
      if (wadaFilter === 'Compliant' && a.wadaWhereabouts?.filingStatus !== 'Compliant')
        return false;
      if (wadaFilter === 'TUE Active' && !a.wadaWhereabouts?.tueActive)
        return false;
      if (incompleteOnly && a.profileCompletion >= 95) return false;

      return true;
    });
  }, [
    athletes,
    searchQuery,
    sportFilter,
    programFilter,
    squadFilter,
    statusFilter,
    readinessFilter,
    injuryRiskFilter,
    verificationFilter,
    medicalFilter,
    wadaFilter,
    incompleteOnly,
    selectedRole,
  ]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSportFilter('All');
    setProgramFilter('All');
    setSquadFilter('All');
    setStatusFilter('All');
    setReadinessFilter('All');
    setInjuryRiskFilter('All');
    setVerificationFilter('All');
    setMedicalFilter('All');
    setWadaFilter('All');
    setIncompleteOnly(false);
    setActiveSummaryKpi(null);
  };

  const handleSummaryKpiClick = (kpiId: string) => {
    resetAllFilters();
    if (activeSummaryKpi === kpiId) {
      setActiveSummaryKpi(null);
      return;
    }
    setActiveSummaryKpi(kpiId);
    if (kpiId === 'active') {
      setStatusFilter('ACTIVE');
    } else if (kpiId === 'pending-verification') {
      setVerificationFilter('Pending');
    } else if (kpiId === 'incomplete') {
      setIncompleteOnly(true);
    } else if (kpiId === 'medical-pending') {
      setMedicalFilter('Not Cleared');
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredAthletes.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAthletes.map((a) => a.id));
    }
  };

  const handleExportCsv = (subset?: Athlete[], format: 'CSV' | 'PDF' | 'Excel' = 'CSV') => {
    const target = subset || filteredAthletes;
    const filename = exportAthletesRoster(
      format,
      target,
      selectedRole,
      `${selectedRole} Athlete Registry Export`
    );
    onTriggerToast(
      `Exported ${target.length} athlete registry records to ${filename} ✓`
    );
  };

  return (
    <div className="space-y-5">
      {/* 1. ATHLETE REGISTRY HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-3 border-b border-slate-800/90">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
            <span>{selectedRole === 'Athlete' ? 'Personal Portal' : 'Athletes'}</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-300">
              {selectedRole === 'Athlete' ? 'My Profile' : 'Athlete Registry'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 mt-1">
            {selectedRole === 'Athlete'
              ? 'MY ATHLETE PROFILE & REGISTRATION'
              : selectedRole === 'Coach'
              ? 'SQUAD ATHLETE SELECTION ROSTER'
              : selectedRole === 'Physiotherapist'
              ? 'CLINICAL CLEARANCE & REHABILITATION ROSTER'
              : selectedRole === 'Nutritionist'
              ? 'NUTRITION & HYDRATION ATHLETE ROSTER'
              : selectedRole === 'Operations Team'
              ? 'SQUAD LOGISTICS & TRAVEL READINESS'
              : selectedRole === 'Federation Admin'
              ? 'NATIONAL ATHLETE REGISTRY & LICENSING'
              : 'ATHLETE REGISTRY'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {selectedRole === 'Athlete'
              ? 'Personal verification status, assigned coach, medical clearance, and operational status.'
              : selectedRole === 'Coach'
              ? 'Manage squad tactical availability, readiness tiers, attendance, and player workload caps.'
              : selectedRole === 'Physiotherapist'
              ? 'Track active clinical cases, musculoskeletal screening compliance, and return-to-play gate status.'
              : selectedRole === 'Nutritionist'
              ? 'Monitor pre-session hydration status (USG), caloric intake compliance, and DEXA body composition.'
              : selectedRole === 'Operations Team'
              ? 'Review travel manifest eligibility, biometric identification, and kit/tech sizing readiness.'
              : selectedRole === 'Federation Admin'
              ? 'National federation database, biometric passport verification, and institutional licensing.'
              : 'Manage athlete profiles, eligibility, readiness, assignments and operational status.'}
          </p>
        </div>

        {selectedRole !== 'Athlete' && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleExportCsv(undefined, 'CSV')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
              title="Download filtered roster as CSV"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => handleExportCsv(undefined, 'PDF')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
              title="Download filtered roster as PDF Dossier"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export PDF</span>
            </button>
            <button
              onClick={() => handleExportCsv(undefined, 'Excel')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#0F1623] hover:bg-[#151E2E] border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
              title="Download filtered roster as Excel (.xls)"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Excel</span>
            </button>

            {['Federation Admin', 'Performance Director'].includes(selectedRole) && (
              <button
                onClick={onOpenAddAthleteModal}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs transition-colors whitespace-nowrap"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>+ Add Athlete</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* SUMMARY KPIs (5 Clickable Cards) - Hidden for Athlete */}
      {selectedRole !== 'Athlete' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            {
              id: 'total',
              label: 'Total Athletes',
              value: athletes.length,
              sub: `Of ${athletes.length} cohort records in context`,
              tone: 'text-slate-100',
            },
            {
              id: 'active',
              label: 'Active',
              value: athletes.filter((a) => a.trainingStatus === 'ACTIVE').length,
              sub: 'Cleared for squad operations',
              tone: 'text-emerald-400',
            },
            {
              id: 'pending-verification',
              label: 'Pending Verification',
              value: athletes.filter((a) => a.verificationStatus === 'Pending').length,
              sub: 'Awaiting federation sign-off',
              tone: 'text-amber-400',
            },
            {
              id: 'incomplete',
              label: 'Incomplete Profiles',
              value: athletes.filter((a) => a.profileCompletion < 95).length,
              sub: 'Missing doc or clearance',
              tone: 'text-amber-300',
            },
            {
              id: 'medical-pending',
              label: 'Medical Clearance Pending',
              value: athletes.filter((a) => a.medicalStatus !== 'Cleared').length,
              sub: 'Requires clinician sign-off',
              tone: 'text-rose-400',
            },
          ].map((kpi) => {
            const isSelected = activeSummaryKpi === kpi.id;
            return (
              <button
                key={kpi.id}
                onClick={() => handleSummaryKpiClick(kpi.id)}
                className={`text-left p-3.5 rounded-lg bg-[#0F1623] hover:bg-[#151E2E] border transition-colors ${
                  isSelected
                    ? 'border-sky-500 bg-[#131C2E]'
                    : 'border-slate-800/90'
                }`}
              >
                <div className="text-xs font-medium text-slate-400">
                  {kpi.label}
                </div>
                <div
                  className={`text-2xl font-mono font-bold mt-1 tabular-nums ${kpi.tone}`}
                >
                  {kpi.value}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 truncate">
                  {kpi.sub}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* FILTER / ACTION TOOLBAR (Hidden for Athlete) */}
      {selectedRole !== 'Athlete' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* [Search athletes] */}
          <div className="relative flex-1 min-w-[210px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search athletes by name, ID (ATH-1042), position..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* [Sport] */}
          <select
            value={sportFilter}
            onChange={(e) => setSportFilter(e.target.value)}
            aria-label="Filter by Sport"
            className="px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Sport: All</option>
            <option value="Football">Football</option>
            <option value="Athletics">Athletics</option>
            <option value="Field Hockey">Field Hockey</option>
          </select>

          {/* [Program] */}
          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            aria-label="Filter by Program"
            className="px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Program: All</option>
            <option value="Senior Men's Program">Senior Men's Program</option>
            <option value="U-23 Olympic Development Program">U-23 Olympic Dev</option>
          </select>

          {/* [Squad] */}
          <select
            value={squadFilter}
            onChange={(e) => setSquadFilter(e.target.value)}
            aria-label="Filter by Squad"
            className="px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Squad: All</option>
            <option value="Senior Squad">Senior Squad</option>
            <option value="U23">U23</option>
          </select>

          {/* [Status] */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Training Status"
            className="px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="RESTRICTED">Restricted</option>
            <option value="INJURED">Injured</option>
            <option value="IN REHAB">In Rehab</option>
            <option value="RETURN TO PLAY">Return to Play</option>
            <option value="PENDING">Pending</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {/* [Readiness] */}
          <select
            value={readinessFilter}
            onChange={(e) => setReadinessFilter(e.target.value)}
            aria-label="Filter by Readiness"
            className="px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Readiness: All</option>
            <option value="High (80+)">Ready (80+)</option>
            <option value="Monitor (65–79)">Monitor (65–79)</option>
            <option value="Low (<65)">Restricted (&lt;65)</option>
          </select>

          {/* [Injury Risk] */}
          <select
            value={injuryRiskFilter}
            onChange={(e) => setInjuryRiskFilter(e.target.value)}
            aria-label="Filter by Injury Risk"
            className="px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Injury Risk: All</option>
            <option value="High">High Risk</option>
            <option value="Moderate">Moderate Risk</option>
            <option value="Low">Low Risk</option>
          </select>

          {/* [Verification] */}
          <select
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
            aria-label="Filter by Verification"
            className="px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">Verification: All</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Changes Requested">Changes Requested</option>
            <option value="Rejected">Rejected</option>
            <option value="Incomplete">Incomplete</option>
          </select>

          {/* [More Filters] */}
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium transition-colors whitespace-nowrap ${
              showMoreFilters || medicalFilter !== 'All' || incompleteOnly
                ? 'bg-sky-500/15 border-sky-500/40 text-sky-300'
                : 'bg-[#090D16] border-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>More Filters</span>
          </button>
        </div>

        {/* Extended Filter Bar */}
        {showMoreFilters && (
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Medical Clearance:</span>
                <select
                  value={medicalFilter}
                  onChange={(e) => setMedicalFilter(e.target.value)}
                  className="px-2.5 py-1 bg-[#090D16] border border-slate-800 rounded text-xs text-slate-200"
                >
                  <option value="All">All Medical States</option>
                  <option value="Cleared">Cleared</option>
                  <option value="Pending">Pending</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-slate-400">WADA Whereabouts:</span>
                <select
                  value={wadaFilter}
                  onChange={(e) => setWadaFilter(e.target.value)}
                  className="px-2.5 py-1 bg-[#090D16] border border-slate-800 rounded text-xs text-slate-200"
                >
                  <option value="All">All WADA States</option>
                  <option value="Compliant">RTP Compliant</option>
                  <option value="TUE Active">TUE Active</option>
                </select>
              </div>

              <label className="inline-flex items-center gap-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={incompleteOnly}
                  onChange={(e) => setIncompleteOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-sky-500"
                />
                <span>Incomplete Profiles Only (&lt;95%)</span>
              </label>
            </div>

            <button
              onClick={resetAllFilters}
              className="text-sky-400 hover:underline font-medium"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
      )}

      {/* 15. BULK OPERATIONS TOOLBAR (Visible when 1+ rows selected and not Athlete) */}
      {selectedRole !== 'Athlete' && selectedIds.length > 0 && (
        <div className="px-4 py-3 rounded-lg bg-[#131C2E] border border-sky-500/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="px-2 py-0.5 rounded bg-sky-500 text-slate-950 font-mono font-bold tabular-nums">
              {selectedIds.length}
            </span>
            <span className="font-semibold text-slate-100">
              {selectedIds.length === 1
                ? '1 athlete selected'
                : `${selectedIds.length} athletes selected`}
            </span>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-400 hover:text-slate-200 underline ml-2"
            >
              Clear selection
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setBulkModalType('squad');
                setBulkTargetValue('Senior Squad');
              }}
              className="px-3 py-1.5 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
            >
              Assign Squad
            </button>

            <button
              onClick={() => {
                setBulkModalType('coach');
                setBulkTargetValue(AVAILABLE_COACHES[0].name);
              }}
              className="px-3 py-1.5 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
            >
              Assign Coach
            </button>

            <button
              onClick={() => {
                setBulkModalType('status');
                setBulkTargetValue('ACTIVE');
              }}
              className="px-3 py-1.5 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
            >
              Update Status
            </button>

            <button
              onClick={() => {
                const selectedSubset = athletes.filter((a) =>
                  selectedIds.includes(a.id)
                );
                handleExportCsv(selectedSubset);
              }}
              className="px-3 py-1.5 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-xs font-medium text-slate-200 transition-colors whitespace-nowrap"
            >
              Export
            </button>

            <button
              onClick={() => {
                onBulkUpdateAthletes(
                  selectedIds,
                  { verificationStatus: 'Verified', lastUpdated: 'Just now' },
                  `Verified ${selectedIds.length} selected athlete profiles`
                );
                setSelectedIds([]);
              }}
              className="px-3 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors whitespace-nowrap"
            >
              Request Verification
            </button>
          </div>
        </div>
      )}

      {/* 2. DENSE ENTERPRISE ATHLETE TABLE */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] font-semibold text-slate-400">
                {selectedRole !== 'Athlete' && (
                  <th className="py-3 pl-4 pr-2 w-9">
                    <button
                      onClick={toggleSelectAll}
                      aria-label="Select all athletes"
                      className="text-slate-400 hover:text-slate-200 flex items-center"
                    >
                      {selectedIds.length > 0 &&
                      selectedIds.length === filteredAthletes.length ? (
                        <CheckSquare className="w-4 h-4 text-sky-400" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                )}
                <th className={`py-3 ${selectedRole === 'Athlete' ? 'pl-4' : ''} px-3`}>Athlete</th>
                <th className="py-3 px-3">Athlete ID</th>
                <th className="py-3 px-3">Sport</th>
                <th className="py-3 px-3">Position</th>
                <th className="py-3 px-3">Squad</th>
                <th className="py-3 px-3">Readiness</th>
                <th className="py-3 px-3">Injury Risk</th>
                <th className="py-3 px-3">Training Status</th>
                <th className="py-3 px-3">Verification</th>
                <th className="py-3 px-3">Medical Clearance</th>
                <th className="py-3 px-3">WADA Whereabouts</th>
                <th className="py-3 px-3">Last Updated</th>
                <th className="py-3 pl-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredAthletes.length === 0 ? (
                <tr>
                  <td colSpan={selectedRole === 'Athlete' ? 13 : 14} className="py-10 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-6 h-6 text-slate-500" />
                      <span>No athlete records match your active filters.</span>
                      <button
                        onClick={resetAllFilters}
                        className="text-sky-400 hover:underline font-medium"
                      >
                        Reset all filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredAthletes.map((athlete) => {
                  const isChecked = selectedIds.includes(athlete.id);
                  return (
                    <tr
                      key={athlete.id}
                      onClick={() => onOpenAthlete360(athlete)}
                      className={`group cursor-pointer transition-colors ${
                        isChecked
                          ? 'bg-sky-500/10'
                          : 'hover:bg-[#151E2E]'
                      }`}
                    >
                      {selectedRole !== 'Athlete' && (
                        <td
                          className="py-3 pl-4 pr-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelectRow(athlete.id);
                          }}
                        >
                          <button
                            aria-label={`Select ${athlete.name}`}
                            className="text-slate-400 hover:text-slate-200 flex items-center"
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-sky-400" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      )}
                      <td className={`py-3 ${selectedRole === 'Athlete' ? 'pl-4' : ''} px-3`}>
                        <div className="flex items-center gap-2.5">
                          <AthleteAvatar
                            name={athlete.name}
                            jerseyNumber={athlete.jerseyNumber}
                            status={athlete.status}
                            size="sm"
                          />
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors whitespace-nowrap">
                              {athlete.name}
                            </div>
                            <div className="text-[11px] text-slate-500 whitespace-nowrap">
                              Coach: {athlete.coach} · {athlete.profileCompletion}% complete
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-300 whitespace-nowrap tabular-nums">
                        {athlete.athleteId}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                        {athlete.sport}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                        {athlete.position}
                      </td>
                      <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                        {athlete.squad}
                      </td>
                      <td className="py-3 px-3">
                        <ReadinessScoreIndicator
                          score={athlete.readiness}
                          showBar={true}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <RiskBadge risk={athlete.injuryRisk} />
                      </td>
                      <td className="py-3 px-3">
                        <TrainingStatusBadge status={athlete.trainingStatus} />
                      </td>
                      <td className="py-3 px-3">
                        <VerificationStatusBadge
                          status={athlete.verificationStatus}
                        />
                      </td>
                      <td className="py-3 px-3">
                        <MedicalStatusBadge status={athlete.medicalStatus} />
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                            athlete.wadaWhereabouts?.tueActive
                              ? 'bg-sky-500/15 text-sky-300 border-sky-500/30'
                              : athlete.wadaWhereabouts?.filingStatus === 'Compliant'
                                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {athlete.wadaWhereabouts?.tueActive
                            ? 'TUE Active'
                            : athlete.wadaWhereabouts?.filingStatus || 'RTP Clean'}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {athlete.lastUpdated}
                      </td>
                      <td
                        className="py-3 pl-3 pr-4 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1.5">
                          {athlete.verificationStatus === 'Pending' &&
                            ['Federation Admin', 'Performance Director'].includes(selectedRole) && (
                              <button
                                onClick={() =>
                                  onOpenReviewApplicationModal(athlete)
                                }
                                className="px-2 py-1 rounded bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-[11px] font-semibold transition-colors"
                              >
                                Review Application
                              </button>
                            )}

                          <button
                            onClick={() => onOpenQuickDrawer(athlete)}
                            title={selectedRole === 'Athlete' ? 'My Biometric Summary' : 'Quick Drawer Preview'}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-medium transition-colors"
                          >
                            <PanelRightOpen className="w-3.5 h-3.5 text-sky-400" />
                            <span>Quick View</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-4 py-3 border-t border-slate-800 bg-[#0B101B] flex items-center justify-between text-xs text-slate-400">
          {selectedRole === 'Athlete' ? (
            <>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Displaying personal verified record · <strong className="text-emerald-400">Athlete Portal Active</strong></span>
              </span>
              <span className="text-[11px]">
                Click row or button to view your comprehensive biometric &amp; training profile
              </span>
            </>
          ) : (
            <>
              <span>
                Displaying <strong className="font-mono text-slate-200">{filteredAthletes.length}</strong> operational records (of 184 federation total)
              </span>
              <span className="text-[11px]">
                Click any row to launch full <strong className="text-sky-400">Athlete 360</strong> profile
              </span>
            </>
          )}
        </div>
      </div>

      {/* Bulk Action Confirmation Modal */}
      {bulkModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setBulkModalType(null)}
            className="fixed inset-0 bg-black/70 backdrop-blur-[1px]"
          />
          <div className="relative w-full max-w-md bg-[#0F1623] border border-slate-700 rounded-lg p-5 z-10 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-100">
                {bulkModalType === 'squad'
                  ? 'Bulk Assign Squad'
                  : bulkModalType === 'coach'
                    ? 'Bulk Assign Coach'
                    : 'Bulk Update Training Status'}
              </h3>
              <button
                onClick={() => setBulkModalType(null)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-400">
                Applying update to{' '}
                <strong className="text-slate-100 font-mono">
                  {selectedIds.length}
                </strong>{' '}
                selected athletes.
              </p>

              {bulkModalType === 'squad' && (
                <select
                  value={bulkTargetValue}
                  onChange={(e) => setBulkTargetValue(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  <option value="Senior Squad">Senior Squad</option>
                  <option value="U23">U23</option>
                  <option value="Rehabilitation & RTP Unit">
                    Rehabilitation & RTP Unit
                  </option>
                </select>
              )}

              {bulkModalType === 'coach' && (
                <select
                  value={bulkTargetValue}
                  onChange={(e) => setBulkTargetValue(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  {AVAILABLE_COACHES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.role} · {c.squad})
                    </option>
                  ))}
                </select>
              )}

              {bulkModalType === 'status' && (
                <select
                  value={bulkTargetValue}
                  onChange={(e) => setBulkTargetValue(e.target.value)}
                  className="w-full p-2 rounded bg-[#090D16] border border-slate-700 text-slate-100"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="IN REHAB">IN REHAB</option>
                  <option value="RETURN TO PLAY">RETURN TO PLAY</option>
                  <option value="PENDING">PENDING</option>
                </select>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setBulkModalType(null)}
                className="px-3 py-1.5 rounded bg-slate-800 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (bulkModalType === 'squad') {
                    onBulkUpdateAthletes(
                      selectedIds,
                      { squad: bulkTargetValue, lastUpdated: 'Just now' },
                      `Assigned ${selectedIds.length} athletes to ${bulkTargetValue}`
                    );
                  } else if (bulkModalType === 'coach') {
                    onBulkUpdateAthletes(
                      selectedIds,
                      { coach: bulkTargetValue, lastUpdated: 'Just now' },
                      `Assigned Coach ${bulkTargetValue} to ${selectedIds.length} athletes`
                    );
                  } else if (bulkModalType === 'status') {
                    onBulkUpdateAthletes(
                      selectedIds,
                      {
                        trainingStatus: bulkTargetValue as AthleteTrainingStatus,
                        lastUpdated: 'Just now',
                      },
                      `Updated Training Status to ${bulkTargetValue} for ${selectedIds.length} athletes`
                    );
                  }
                  setBulkModalType(null);
                  setSelectedIds([]);
                }}
                className="px-3.5 py-1.5 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs"
              >
                Apply Bulk Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
