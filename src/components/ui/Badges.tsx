import React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Eye,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  XCircle,
  FileWarning,
  HeartPulse,
  Ban,
} from 'lucide-react';
import {
  AthleteStatus,
  AthleteTrainingStatus,
  DocumentStatus,
  InjuryStage,
  LoadLevel,
  MedicalClearanceStatus,
  RiskLevel,
  SessionIntensity,
  SessionStatus,
  VerificationStatus,
} from '../../types/usi';

export const StatusBadge: React.FC<{ status: AthleteStatus | SessionStatus | InjuryStage }> = ({
  status,
}) => {
  switch (status) {
    case 'Ready':
    case 'Completed':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Monitor':
    case 'Return-to-Play':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 whitespace-nowrap">
          <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Attention':
    case 'Escalated':
    case 'Unavailable':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Restricted':
    case 'In Rehabilitation':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 whitespace-nowrap">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
    case 'Upcoming':
    case 'In Progress':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>{status}</span>
        </span>
      );
  }
};

export const TrainingStatusBadge: React.FC<{ status: AthleteTrainingStatus }> = ({
  status,
}) => {
  switch (status) {
    case 'ACTIVE':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Active</span>
        </span>
      );
    case 'RESTRICTED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 whitespace-nowrap">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Restricted</span>
        </span>
      );
    case 'INJURED':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Injured</span>
        </span>
      );
    case 'IN REHAB':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 whitespace-nowrap">
          <HeartPulse className="w-3.5 h-3.5 text-orange-400 shrink-0" />
          <span>In Rehab</span>
        </span>
      );
    case 'RETURN TO PLAY':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 whitespace-nowrap">
          <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Return to Play</span>
        </span>
      );
    case 'PENDING':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-300 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case 'INACTIVE':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap">
          <Ban className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Inactive</span>
        </span>
      );
  }
};

export const VerificationStatusBadge: React.FC<{ status: VerificationStatus }> = ({
  status,
}) => {
  switch (status) {
    case 'Verified':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Verified</span>
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case 'Changes Requested':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-300 whitespace-nowrap">
          <FileWarning className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Changes Requested</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 whitespace-nowrap">
          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Rejected</span>
        </span>
      );
    case 'Incomplete':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Incomplete</span>
        </span>
      );
  }
};

export const MedicalStatusBadge: React.FC<{ status: MedicalClearanceStatus }> = ({
  status,
}) => {
  switch (status) {
    case 'Cleared':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Cleared</span>
        </span>
      );
    case 'Pending':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Pending</span>
        </span>
      );
    case 'Restricted':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-400 whitespace-nowrap">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Restricted</span>
        </span>
      );
    case 'Expired':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-500 whitespace-nowrap">
          <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span>Expired</span>
        </span>
      );
  }
};

export const DocumentStatusBadge: React.FC<{ status: DocumentStatus }> = ({ status }) => {
  switch (status) {
    case 'Verified':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 whitespace-nowrap">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Verified</span>
        </span>
      );
    case 'Pending Review':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-400 whitespace-nowrap">
          <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <span>Pending Review</span>
        </span>
      );
    case 'Expiring Soon':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400 whitespace-nowrap">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>Expiring Soon</span>
        </span>
      );
    case 'Expired':
    default:
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 whitespace-nowrap">
          <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>Expired</span>
        </span>
      );
  }
};

export const RiskBadge: React.FC<{ risk: RiskLevel }> = ({ risk }) => {
  if (risk === 'High' || risk === 'Elevated') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-400 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
        <span>{risk}</span>
      </span>
    );
  }
  if (risk === 'Moderate') {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
        <span>{risk}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
      <span>{risk}</span>
    </span>
  );
};

export const LoadBadge: React.FC<{ load: LoadLevel | SessionIntensity }> = ({ load }) => {
  if (load === 'High') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-300 whitespace-nowrap">
        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>High</span>
      </span>
    );
  }
  if (load === 'Moderate' || load === 'Normal') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 whitespace-nowrap">
        <Activity className="w-3.5 h-3.5 text-sky-400 shrink-0" />
        <span>{load}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 whitespace-nowrap">
      <span>Low</span>
    </span>
  );
};

export const AthleteAvatar: React.FC<{
  name: string;
  jerseyNumber?: number;
  status?: AthleteStatus;
  size?: 'sm' | 'md' | 'lg';
}> = ({ name, jerseyNumber, status = 'Ready', size = 'md' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const borderColor =
    status === 'Attention' || status === 'Unavailable'
      ? 'border-rose-500/60 bg-rose-950/40 text-rose-200'
      : status === 'Monitor' || status === 'Restricted'
        ? 'border-amber-500/60 bg-amber-950/40 text-amber-200'
        : 'border-emerald-500/50 bg-slate-800/90 text-slate-100';

  const sizeClasses =
    size === 'sm'
      ? 'w-7 h-7 text-[11px]'
      : size === 'lg'
        ? 'w-11 h-11 text-sm'
        : 'w-8 h-8 text-xs';

  return (
    <div className="relative inline-flex items-center justify-center shrink-0">
      <div
        className={`${sizeClasses} ${borderColor} rounded-md border font-mono font-semibold flex items-center justify-center tracking-tight select-none`}
      >
        {initials}
      </div>
      {jerseyNumber !== undefined && (
        <span className="-bottom-1 -right-1.5 bg-[#090D16] border border-slate-700 px-1 rounded text-[9px] font-mono font-semibold text-slate-300 leading-tight">
          #{jerseyNumber}
        </span>
      )}
    </div>
  );
};

export const ReadinessScoreIndicator: React.FC<{
  score: number;
  delta?: number;
  showBar?: boolean;
}> = ({ score, delta, showBar = true }) => {
  const colorClass =
    score >= 80
      ? 'text-emerald-400'
      : score >= 65
        ? 'text-amber-400'
        : 'text-rose-400';

  const barColor =
    score >= 80
      ? 'bg-emerald-500'
      : score >= 65
        ? 'bg-amber-500'
        : 'bg-rose-500';

  return (
    <div className="flex items-center gap-2.5">
      <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
        <span className={`text-sm font-semibold ${colorClass}`}>{score}</span>
        {delta !== undefined && (
          <span
            className={`text-[11px] ${
              delta >= 0 ? 'text-emerald-400/90' : 'text-rose-400/90'
            }`}
          >
            {delta > 0 ? `+${delta}` : `${delta}`}
          </span>
        )}
      </div>
      {showBar && (
        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
          <div
            className={`h-full ${barColor} rounded-full`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      )}
    </div>
  );
};
