import React, { useState, useMemo } from 'react';
import {
  ArrowUpDown,
  ChevronRight,
  Filter,
  Search,
  UserCheck,
} from 'lucide-react';
import { Athlete } from '../../types/usi';
import {
  AthleteAvatar,
  LoadBadge,
  ReadinessScoreIndicator,
  RiskBadge,
  StatusBadge,
} from '../ui/Badges';

interface AthleteAttentionTableProps {
  athletes: Athlete[];
  selectedAthleteId: string | null;
  onSelectAthlete: (athlete: Athlete) => void;
  statusFilter: string;
  onChangeStatusFilter: (status: string) => void;
}

export const AthleteAttentionTable: React.FC<AthleteAttentionTableProps> = ({
  athletes,
  selectedAthleteId,
  onSelectAthlete,
  statusFilter,
  onChangeStatusFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'readiness' | 'acwr' | 'name'>('readiness');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredAthletes = useMemo(() => {
    return athletes
      .filter((a) => {
        if (statusFilter === 'Attention' && a.status !== 'Attention') return false;
        if (statusFilter === 'Monitor' && a.status !== 'Monitor') return false;
        if (statusFilter === 'Ready' && a.status !== 'Ready') return false;
        if (statusFilter === 'ElevatedRisk' && a.injuryRisk !== 'High') return false;
        if (positionFilter !== 'All' && a.position !== positionFilter) return false;
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          return (
            a.name.toLowerCase().includes(q) ||
            a.position.toLowerCase().includes(q) ||
            a.code.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        if (sortField === 'readiness') {
          return sortAsc ? a.readiness - b.readiness : b.readiness - a.readiness;
        }
        if (sortField === 'acwr') {
          return sortAsc ? b.acwr - a.acwr : a.acwr - b.acwr;
        }
        return sortAsc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      });
  }, [athletes, statusFilter, positionFilter, searchQuery, sortField, sortAsc]);

  const handleSort = (field: 'readiness' | 'acwr' | 'name') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <section
      id="athlete-attention-section"
      className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5"
    >
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm font-bold tracking-wide text-slate-100">
              ATHLETES REQUIRING ATTENTION
            </h2>
            <span className="text-xs text-slate-500">·</span>
            <span className="text-xs font-mono text-slate-400 tabular-nums">
              Showing {filteredAthletes.length} of {athletes.length} monitored squad profiles
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any athlete row to open the Athlete Detail Drawer with telemetry, medical context & quick actions
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1 p-1 bg-[#090D16] border border-slate-800 rounded-md">
            {[
              { id: 'All', label: 'All Cohort' },
              { id: 'Attention', label: 'Attention (3)' },
              { id: 'Monitor', label: 'Monitor (4)' },
              { id: 'Ready', label: 'Ready (3)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => onChangeStatusFilter(tab.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                  statusFilter === tab.id
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Position Selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={positionFilter}
              onChange={(e) => setPositionFilter(e.target.value)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#0F1623]">All Positions</option>
              <option value="Forward" className="bg-[#0F1623]">Forwards</option>
              <option value="Midfielder" className="bg-[#0F1623]">Midfielders</option>
              <option value="Defender" className="bg-[#0F1623]">Defenders</option>
              <option value="Goalkeeper" className="bg-[#0F1623]">Goalkeepers</option>
            </select>
          </div>

          {/* Table Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter athlete..."
              className="pl-8 pr-3 py-1.5 bg-[#090D16] border border-slate-800 rounded-md text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-sky-500 w-44"
            />
          </div>
        </div>
      </div>

      {/* High-Density Operational Table */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/90 text-[11px] font-semibold text-slate-400">
              <th className="py-2.5 pr-4">
                <button
                  onClick={() => handleSort('name')}
                  className="inline-flex items-center gap-1 hover:text-slate-200"
                >
                  <span>Athlete</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3">Sport</th>
              <th className="py-2.5 px-3">Position</th>
              <th className="py-2.5 px-3">
                <button
                  onClick={() => handleSort('readiness')}
                  className="inline-flex items-center gap-1 hover:text-slate-200"
                >
                  <span>Readiness</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3">Injury Risk</th>
              <th className="py-2.5 px-3">
                <button
                  onClick={() => handleSort('acwr')}
                  className="inline-flex items-center gap-1 hover:text-slate-200"
                >
                  <span>Training Load (ACWR)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </button>
              </th>
              <th className="py-2.5 px-3 hidden xl:table-cell">Primary Signal / Context</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 pl-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredAthletes.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-slate-400">
                  <div className="flex flex-col items-center gap-2">
                    <UserCheck className="w-5 h-5 text-slate-500" />
                    <span>No athletes match the current filter criteria.</span>
                    <button
                      onClick={() => {
                        onChangeStatusFilter('All');
                        setPositionFilter('All');
                        setSearchQuery('');
                      }}
                      className="text-sky-400 hover:underline text-xs font-medium"
                    >
                      Reset all table filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredAthletes.map((athlete) => {
                const isSelected = selectedAthleteId === athlete.id;
                return (
                  <tr
                    key={athlete.id}
                    onClick={() => onSelectAthlete(athlete)}
                    className={`group cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-sky-500/10'
                        : 'hover:bg-[#151E2E]'
                    }`}
                  >
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <AthleteAvatar
                          name={athlete.name}
                          jerseyNumber={athlete.jerseyNumber}
                          status={athlete.status}
                        />
                        <div>
                          <div className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors">
                            {athlete.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-500">
                            {athlete.code} · {athlete.subSquad}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {athlete.sport}
                    </td>
                    <td className="py-3 px-3 text-slate-300 whitespace-nowrap">
                      {athlete.position}
                    </td>
                    <td className="py-3 px-3">
                      <ReadinessScoreIndicator
                        score={athlete.readiness}
                        delta={athlete.readinessDelta}
                      />
                    </td>
                    <td className="py-3 px-3">
                      <RiskBadge risk={athlete.injuryRisk} />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <LoadBadge load={athlete.trainingLoad} />
                        <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                          ({athlete.acwr.toFixed(2)})
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 hidden xl:table-cell text-slate-400 max-w-[260px] truncate">
                      {athlete.riskSignals[0]}
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={athlete.status} />
                    </td>
                    <td className="py-3 pl-3 text-right">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-400 group-hover:text-sky-300 whitespace-nowrap">
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
