import React, { useState, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  FileCheck,
  FileText,
  Filter,
  HeartPulse,
  Info,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import { Athlete, UserRole } from '../../types/usi';

interface EnrollmentApplicationsPageProps {
  athletes: Athlete[];
  selectedRole?: UserRole;
  onOpenReviewApplication: (athlete: Athlete) => void;
  onOpenAthlete360: (athlete: Athlete) => void;
  onOpenAssignCoach: (athlete: Athlete) => void;
  onOpenNewApplication: () => void;
  onTriggerToast: (msg: string) => void;
}

export type EnrollmentStageFilter =
  | 'ALL'
  | 'PENDING_ADMIN'
  | 'PENDING_COACH'
  | 'PENDING_MEDICAL'
  | 'ACTIVATED'
  | 'CHANGES_REQUESTED';

export const EnrollmentApplicationsPage: React.FC<EnrollmentApplicationsPageProps> = ({
  athletes,
  selectedRole = 'Federation Admin',
  onOpenReviewApplication,
  onOpenAthlete360,
  onOpenAssignCoach,
  onOpenNewApplication,
  onTriggerToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<EnrollmentStageFilter>('ALL');

  // Derive verification stage data for each athlete
  const candidateApplications = useMemo(() => {
    return athletes.map((a, index) => {
      // Simulate nuanced multi-tier stage data derived from athlete attributes
      const isAdminApproved = a.verificationStatus === 'Verified' || a.profileCompletion >= 90;
      const isCoachApproved = Boolean(a.coach && a.coach !== 'Unassigned' && a.coach !== 'Assigning…');
      const isMedicalCleared = a.medicalStatus === 'Cleared';

      let stage: 'PENDING_ADMIN' | 'PENDING_COACH' | 'PENDING_MEDICAL' | 'ACTIVATED' | 'CHANGES_REQUESTED' = 'ACTIVATED';
      let stageLabel = 'Active & Activated';

      if (a.verificationStatus === 'Rejected' || a.verificationNotes?.includes('expired') || a.verificationNotes?.includes('insurance')) {
        stage = 'CHANGES_REQUESTED';
        stageLabel = 'Changes Requested';
      } else if (!isAdminApproved) {
        stage = 'PENDING_ADMIN';
        stageLabel = 'Level 1: Admin Docs Pending';
      } else if (!isCoachApproved) {
        stage = 'PENDING_COACH';
        stageLabel = 'Level 2: Coach Review Pending';
      } else if (!isMedicalCleared) {
        stage = 'PENDING_MEDICAL';
        stageLabel = 'Level 3: Medical Board Pending';
      }

      return {
        athlete: a,
        stage,
        stageLabel,
        adminStatus: isAdminApproved ? 'approved' : a.verificationStatus === 'Rejected' ? 'changes' : 'pending',
        coachStatus: isCoachApproved ? 'approved' : 'pending',
        medicalStatus: isMedicalCleared ? 'cleared' : a.medicalStatus === 'Restricted' ? 'restricted' : 'pending',
        documentsCount: a.documents?.length || 3,
        daysInReview: (index % 5) + 1,
      };
    });
  }, [athletes]);

  // Stage distribution counts
  const stageCounts = useMemo(() => {
    const counts = {
      ALL: candidateApplications.length,
      PENDING_ADMIN: 0,
      PENDING_COACH: 0,
      PENDING_MEDICAL: 0,
      ACTIVATED: 0,
      CHANGES_REQUESTED: 0,
    };
    candidateApplications.forEach((c) => {
      counts[c.stage]++;
    });
    return counts;
  }, [candidateApplications]);

  // Filtered applications list
  const filteredCandidates = useMemo(() => {
    return candidateApplications.filter((c) => {
      const matchSearch =
        !searchQuery.trim() ||
        c.athlete.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.athlete.athleteId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.athlete.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.athlete.position.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStage = stageFilter === 'ALL' || c.stage === stageFilter;

      return matchSearch && matchStage;
    });
  }, [candidateApplications, searchQuery, stageFilter]);

  return (
    <div className="space-y-5">
      {/* Header & Overview */}
      <div className="bg-[#0F1623] border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400 font-semibold uppercase tracking-wider">
              <FileCheck className="w-4 h-4 text-sky-400" />
              <span>ATHLETE ENROLLMENT & VERIFICATION PIPELINE</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              Enrollment Applications & Multi-Stage Verification Tracker
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Track added athlete candidates across the sequential institutional approval stages: Admin Documentation → Coach Sporting Profile → Medical Board Clearance → Final Activation.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenNewApplication}
              className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ New Enrollment Invitation</span>
            </button>
          </div>
        </div>

        {/* Stage Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
          {[
            { id: 'ALL' as const, label: 'All Applications', count: stageCounts.ALL, color: 'text-slate-100', border: 'border-slate-700' },
            { id: 'PENDING_ADMIN' as const, label: '1. Admin Docs', count: stageCounts.PENDING_ADMIN, color: 'text-sky-300', border: 'border-sky-500/40' },
            { id: 'PENDING_COACH' as const, label: '2. Coach Sporting', count: stageCounts.PENDING_COACH, color: 'text-violet-300', border: 'border-violet-500/40' },
            { id: 'PENDING_MEDICAL' as const, label: '3. Medical Board', count: stageCounts.PENDING_MEDICAL, color: 'text-amber-300', border: 'border-amber-500/40' },
            { id: 'ACTIVATED' as const, label: '4. Activated (100%)', count: stageCounts.ACTIVATED, color: 'text-emerald-400', border: 'border-emerald-500/40' },
            { id: 'CHANGES_REQUESTED' as const, label: 'Changes Requested', count: stageCounts.CHANGES_REQUESTED, color: 'text-rose-400', border: 'border-rose-500/40' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStageFilter(st.id)}
              className={`p-3 rounded-lg border text-left transition-all ${
                stageFilter === st.id
                  ? 'bg-slate-800/90 ' + st.border + ' ring-1 ring-current'
                  : 'bg-[#090D16] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className={`text-xl font-mono font-bold ${st.color}`}>{st.count}</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-tight">{st.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0F1623] border border-slate-800 p-3 rounded-lg">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            placeholder="Search candidate name, ID, sport, event…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded bg-[#090D16] border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 w-full sm:w-auto justify-end">
          <span>Showing <strong>{filteredCandidates.length}</strong> of {candidateApplications.length} candidates</span>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-[#0F1623] border border-slate-800 rounded-xl overflow-hidden shadow-xl text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#090D16] border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Candidate Athlete</th>
                <th className="py-3 px-3">Sport / Discipline</th>
                <th className="py-3 px-3">Profile Completion</th>
                <th className="py-3 px-3">3-Tier Verification Pipeline</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {filteredCandidates.map(({ athlete: a, stage, stageLabel, adminStatus, coachStatus, medicalStatus, documentsCount, daysInReview }) => (
                <tr key={a.id} className="hover:bg-[#131B2B] transition-colors">
                  {/* Candidate Identity */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                        {a.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{a.name}</span>
                          {stage === 'ACTIVATED' && (
                            <span title="Activated Athlete">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                          {a.athleteId} · Applied {daysInReview}d ago
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Sport & Discipline */}
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-200">{a.sport}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{a.position} · {a.squad}</div>
                  </td>

                  {/* Profile Completion */}
                  <td className="py-3 px-3">
                    <div className="w-32 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-slate-400">Filled:</span>
                        <strong className={a.profileCompletion >= 90 ? 'text-emerald-400' : 'text-amber-300'}>
                          {a.profileCompletion}%
                        </strong>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            a.profileCompletion >= 90 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${a.profileCompletion}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 3-Tier Verification Pipeline Matrix */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      {/* Admin Pill */}
                      <span
                        className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                          adminStatus === 'approved'
                            ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/40'
                            : adminStatus === 'changes'
                            ? 'bg-rose-950/20 text-rose-300 border-rose-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title="Level 1: Administrative Verification"
                      >
                        <span>🏛️ Admin</span>
                        <strong>{adminStatus === 'approved' ? '✓' : adminStatus === 'changes' ? '!' : '…'}</strong>
                      </span>

                      {/* Coach Pill */}
                      <span
                        className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                          coachStatus === 'approved'
                            ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title="Level 2: Coach Sporting Profile"
                      >
                        <span>⏱️ Coach</span>
                        <strong>{coachStatus === 'approved' ? '✓' : '…'}</strong>
                      </span>

                      {/* Medical Pill */}
                      <span
                        className={`px-2 py-0.5 rounded border flex items-center gap-1 ${
                          medicalStatus === 'cleared'
                            ? 'bg-emerald-950/20 text-emerald-300 border-emerald-500/40'
                            : medicalStatus === 'restricted'
                            ? 'bg-amber-950/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                        title="Level 3: Medical Board Clearance"
                      >
                        <span>🩺 Med</span>
                        <strong>{medicalStatus === 'cleared' ? '✓' : medicalStatus === 'restricted' ? '▲' : '…'}</strong>
                      </span>
                    </div>
                  </td>

                  {/* Stage Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                        stage === 'ACTIVATED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : stage === 'CHANGES_REQUESTED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          : stage === 'PENDING_ADMIN'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                          : stage === 'PENDING_COACH'
                          ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
                          : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {stageLabel}
                    </span>
                  </td>

                  {/* Primary Action Button */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onOpenReviewApplication(a)}
                        className={`px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1 transition-all ${
                          stage === 'ACTIVATED'
                            ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow'
                        }`}
                      >
                        <span>{stage === 'ACTIVATED' ? 'View Clearance' : 'Review Application'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => onOpenAthlete360(a)}
                        title="Open Full Athlete 360 Dossier"
                        className="p-1.5 rounded bg-[#090D16] hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCandidates.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 text-xs">
                    No enrollment applications match the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
