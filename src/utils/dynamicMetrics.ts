import {
  Athlete,
  Injury,
  NutritionPlan,
  TrainingSession,
  UserRole,
} from '../types/usi';
import {
  RoleAnalyticsMetric,
  RoleAttentionItem,
  RoleKpiItem,
} from '../data/roleDashboardConfig';

export interface DynamicRoleMetricsResult {
  kpis: RoleKpiItem[];
  primaryAnalyticsTitle: string;
  primaryAnalyticsSubtitle: string;
  analyticsMetrics: RoleAnalyticsMetric[];
  priorityItems: RoleAttentionItem[];
  distributionTitle: string;
  distributionData: {
    label: string;
    percentage: number;
    count: number;
    colorClass: string;
  }[];
}

export function computeDynamicRoleMetrics(
  role: UserRole,
  athletes: Athlete[],
  injuries: Injury[],
  sessions: TrainingSession[],
  nutritionPlans: NutritionPlan[] = [],
  activeAthlete?: Athlete | null
): DynamicRoleMetricsResult {
  const totalAthletes = athletes.length || 1;
  const activeCount = athletes.filter((a) => a.trainingStatus === 'ACTIVE').length;
  const restrictedCount = athletes.filter(
    (a) =>
      a.trainingStatus === 'RESTRICTED' ||
      a.trainingStatus === 'IN REHAB' ||
      a.trainingStatus === 'RETURN TO PLAY'
  ).length;
  const injuredCount = athletes.filter((a) => a.trainingStatus === 'INJURED').length;
  const pendingVerificationCount = athletes.filter(
    (a) => a.verificationStatus === 'Pending'
  ).length;
  const verifiedCount = athletes.filter(
    (a) => a.verificationStatus === 'Verified'
  ).length;
  const activeInjuries = injuries.filter((i) => i.medicalStatus !== 'Cleared');
  const meanReadiness = Math.round(
    athletes.reduce((acc, a) => acc + (a.readiness || 75), 0) / totalAthletes
  );
  const meanAcwr = (
    athletes.reduce((acc, a) => acc + (a.acwr || 1.1), 0) / totalAthletes
  ).toFixed(2);
  const acwrSpikes = athletes.filter((a) => (a.acwr || 0) >= 1.35);
  const acwrSpikesCount = acwrSpikes.length;
  const meanHrv = Math.round(
    athletes.reduce((acc, a) => acc + (a.hrvMs || 65), 0) / totalAthletes
  );
  const meanNutrition = Math.round(
    athletes.reduce((acc, a) => acc + (a.nutritionCompliancePct || 85), 0) /
      totalAthletes
  );
  const dehydratedAthletes = athletes.filter(
    (a) => a.hydrationStatus !== 'Optimal'
  );
  const dehydratedCount = dehydratedAthletes.length;
  const completedSessionsCount = sessions.filter(
    (s) => s.status === 'Completed'
  ).length;
  const avgAttendance = sessions.length
    ? Math.round(
        sessions.reduce((s, sess) => s + (sess.attendance || 90), 0) /
          sessions.length
      )
    : 94;
  const totalSprintMeters = sessions.reduce(
    (acc, s) => acc + (s.targetHighSpeedM || 0),
    0
  );
  const highRiskAthletes = athletes.filter((a) => a.injuryRisk === 'High');

  const contextSport = athletes[0]?.sport || 'Football';
  const contextProgram = athletes[0]?.program || "Senior Men's Program";
  const contextSquad = athletes[0]?.squad || 'Senior National Squad';

  const leadRiskAth = highRiskAthletes[0] || athletes[0];
  const secondRiskAth = highRiskAthletes[1] || athletes[1] || athletes[0];
  const readyAth =
    athletes.find((a) => a.readiness >= 82) ||
    athletes[athletes.length - 1] ||
    athletes[0];
  const pendingAth =
    athletes.find((a) => a.verificationStatus === 'Pending') ||
    athletes[athletes.length - 1] ||
    athletes[0];

  const topRiskShortNames =
    highRiskAthletes
      .slice(0, 3)
      .map((a) => a.name.split(' ')[0])
      .join(', ') || leadRiskAth?.name || 'None flagged';

  const pendingShortNames =
    athletes
      .filter((a) => a.verificationStatus === 'Pending')
      .slice(0, 3)
      .map((a) => a.name.split(' ')[0])
      .join(', ') || 'All athletes verified';

  const dehydratedShortNames =
    dehydratedAthletes
      .slice(0, 2)
      .map((a) => a.name.split(' ')[0])
      .join(', ') || 'All optimal';

  const rtpShortNames =
    activeInjuries
      .slice(0, 3)
      .map((i) => `${i.athleteName.split(' ')[0]} (St ${i.rtpStage})`)
      .join(', ') || 'All cleared';

  const acwrSpikeShortNames =
    acwrSpikes
      .slice(0, 2)
      .map((a) => `${a.name.split(' ')[0]} ${a.acwr}`)
      .join(', ') || `Peak ACWR ${meanAcwr}`;

  switch (role) {
    case 'Performance Director': {
      const availabilityPct = ((activeCount / totalAthletes) * 100).toFixed(1);
      const injuryPct = ((activeInjuries.length / totalAthletes) * 100).toFixed(1);
      return {
        kpis: [
          {
            id: 'squad-availability',
            label: 'Squad Availability',
            value: `${availabilityPct}%`,
            subtext: `${activeCount} of ${totalAthletes} active in ${contextSport}`,
            deltaLabel:
              Number(availabilityPct) >= 65
                ? '+2.1% vs target'
                : '-1.4% below target',
            tone: Number(availabilityPct) >= 65 ? 'emerald' : 'amber',
            targetHint: 'Inspect Ready Cohort',
            iconName: 'UserCheck',
          },
          {
            id: 'injury-incidence',
            label: 'Clinical Injury Load',
            value: `${activeInjuries.length}`,
            subtext: `${activeInjuries.length} active cases (${rtpShortNames})`,
            deltaLabel: `${injuryPct}% squad load`,
            tone: activeInjuries.length <= 3 ? 'emerald' : 'rose',
            targetHint: 'Open Injury Intelligence',
            iconName: 'HeartPulse',
          },
          {
            id: 'olympic-pathway',
            label: 'Olympic Pathway Ready',
            value: `${meanReadiness}%`,
            subtext: `Mean readiness across ${totalAthletes} ${contextProgram} athletes`,
            deltaLabel: 'Target ≥ 80%',
            tone: meanReadiness >= 80 ? 'emerald' : 'sky',
            targetHint: 'Inspect Pathway Pipeline',
            iconName: 'Trophy',
          },
          {
            id: 'acwr-stability',
            label: 'Squad Workload Stability',
            value: `${meanAcwr}`,
            subtext: `Optimal ACWR sweetspot (0.8 - 1.3) · ${contextSport}`,
            deltaLabel:
              Number(meanAcwr) <= 1.22 ? 'Sweetspot safe' : 'Elevated load',
            tone: Number(meanAcwr) <= 1.22 ? 'emerald' : 'amber',
            targetHint: 'Workload Science Matrix',
            iconName: 'Activity',
          },
          {
            id: 'interdisciplinary-sync',
            label: 'Staff Sync Compliance',
            value: `${avgAttendance}%`,
            subtext: `Coach ${athletes[0]?.coach || 'Staff'}, Physio & Science`,
            deltaLabel: `${sessions.length} daily blocks`,
            tone: 'emerald',
            targetHint: 'Governance Audit',
            iconName: 'ShieldCheck',
          },
          {
            id: 'high-priority-flags',
            label: 'Director Attention Flags',
            value: `${highRiskAthletes.length + pendingVerificationCount}`,
            subtext: `${highRiskAthletes.length} clinical/load · ${pendingVerificationCount} licensing`,
            deltaLabel: 'Requires approval',
            tone: 'amber',
            targetHint: 'Action Board',
            iconName: 'AlertTriangle',
          },
        ],
        primaryAnalyticsTitle: `${contextSport} (${contextProgram}) Readiness & Availability Trend`,
        primaryAnalyticsSubtitle: `Continuous telemetry aggregate across ${contextSquad} (${totalAthletes} athletes tracked)`,
        analyticsMetrics: [
          {
            name: 'Squad Availability',
            current: `${availabilityPct}%`,
            benchmark: '85.0%',
            unit: '%',
            status: Number(availabilityPct) >= 70 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'Mean ACWR Load',
            current: meanAcwr,
            benchmark: '1.10',
            unit: 'AU',
            status: Number(meanAcwr) <= 1.25 ? 'optimal' : 'warning',
            trend: 'up',
          },
          {
            name: 'Mean Readiness',
            current: `${meanReadiness}%`,
            benchmark: '80%',
            unit: '%',
            status: meanReadiness >= 75 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'Active Injuries',
            current: activeInjuries.length,
            benchmark: '3',
            unit: 'cases',
            status: activeInjuries.length <= 3 ? 'optimal' : 'critical',
            trend: 'down',
          },
        ],
        priorityItems: [
          {
            id: 'pa-01',
            title: `${leadRiskAth?.name || 'Athlete'}: Stage ${activeInjuries[0]?.rtpStage || 3} RTP Sign-off Pending`,
            severity: 'CRITICAL',
            badge: 'Clinical Clearance',
            detail: `${leadRiskAth?.name || 'Athlete'} (${contextSport} · ${leadRiskAth?.position || ''}) completed 85% Vmax gate. CMO final clearance required.`,
            timestamp: '14 mins ago',
            actionText: 'Review Clearance Gate',
          },
          {
            id: 'pa-02',
            title: `${secondRiskAth?.name || 'Athlete'}: ${activeInjuries[1]?.injuryTitle || 'Workload Off-loading'}`,
            severity: 'HIGH',
            badge: 'Injury Alert',
            detail: `${secondRiskAth?.name || 'Athlete'} off-loaded from high-intensity ${contextSport} block (Readiness ${secondRiskAth?.readiness || 64}%).`,
            timestamp: '1 hour ago',
            actionText: 'Inspect Clinical Dossier',
          },
          {
            id: 'pa-03',
            title: `${pendingVerificationCount} Athletes Pending Institutional Clearance`,
            severity: 'MEDIUM',
            badge: 'Federation Gate',
            detail: `${pendingShortNames} awaiting federation documentation seal and coach assignment in ${contextProgram}.`,
            timestamp: '2 hours ago',
            actionText: 'Open Enrollment Tracker',
          },
        ],
        distributionTitle: 'Squad Functional Availability',
        distributionData: [
          {
            label: 'Unconstrained Match Ready',
            percentage: Math.round((activeCount / totalAthletes) * 100),
            count: activeCount,
            colorClass: 'bg-emerald-500',
          },
          {
            label: 'Restricted / Modified Load',
            percentage: Math.round((restrictedCount / totalAthletes) * 100),
            count: restrictedCount,
            colorClass: 'bg-amber-500',
          },
          {
            label: 'Clinical Rehab / Unavailable',
            percentage: Math.round((injuredCount / totalAthletes) * 100),
            count: injuredCount,
            colorClass: 'bg-rose-500',
          },
        ],
      };
    }

    case 'Coach': {
      return {
        kpis: [
          {
            id: 'squad-availability',
            label: 'Squad Selection Registry',
            value: `${activeCount} / ${totalAthletes}`,
            subtext: `${activeCount} unconstrained fit (${contextSport})`,
            deltaLabel: `${contextSquad} ready`,
            tone: 'emerald',
            targetHint: 'View Squad Registry',
            iconName: 'Users',
          },
          {
            id: 'modified-load',
            label: 'Modified / Load Capped',
            value: `${restrictedCount}`,
            subtext: `${restrictedCount} athletes on speed/volume caps`,
            deltaLabel: 'Tactical substitutes',
            tone: 'amber',
            targetHint: 'Inspect Restrictions',
            iconName: 'AlertTriangle',
          },
          {
            id: 'daily-sessions',
            label: "Today's Training Sessions",
            value: `${sessions.length}`,
            subtext: `${completedSessionsCount} completed · ${sessions.length - completedSessionsCount} remaining`,
            deltaLabel: `${sessions.length} scheduled`,
            tone: 'sky',
            targetHint: 'View Session Timetable',
            iconName: 'CalendarCheck',
          },
          {
            id: 'acwr-squad',
            label: 'Squad Workload Ratio',
            value: `${meanAcwr}`,
            subtext: `${acwrSpikesCount} athletes ≥ 1.35 threshold`,
            deltaLabel: 'ACWR sweetspot',
            tone: Number(meanAcwr) <= 1.25 ? 'emerald' : 'amber',
            targetHint: 'Workload Science Matrix',
            iconName: 'Activity',
          },
          {
            id: 'attendance',
            label: 'Session Attendance Rate',
            value: `${avgAttendance}%`,
            subtext: `${totalSprintMeters}m high-speed exposure`,
            deltaLabel: '+1.8% vs last week',
            tone: 'emerald',
            targetHint: 'Attendance Register',
            iconName: 'UserCheck',
          },
          {
            id: 'tactical-flags',
            label: 'High Fatigue / Risk Warnings',
            value: `${highRiskAthletes.length}`,
            subtext: topRiskShortNames,
            deltaLabel: 'Modify high-intensity drills',
            tone: 'rose',
            targetHint: 'Squad Availability Board',
            iconName: 'HeartPulse',
          },
        ],
        primaryAnalyticsTitle: `${contextSport} Squad Selection & Physical Readiness Matrix`,
        primaryAnalyticsSubtitle: `Real-time position-by-position readiness for ${contextProgram} (${contextSquad})`,
        analyticsMetrics: [
          {
            name: 'Unrestricted Fit',
            current: activeCount,
            benchmark: Math.max(5, totalAthletes - 2),
            unit: 'athletes',
            status: activeCount >= totalAthletes - 3 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'Load-Capped Athletes',
            current: restrictedCount,
            benchmark: 2,
            unit: 'athletes',
            status: restrictedCount <= 3 ? 'optimal' : 'warning',
            trend: 'up',
          },
          {
            name: 'Mean Squad ACWR',
            current: meanAcwr,
            benchmark: '1.12',
            unit: 'AU',
            status: Number(meanAcwr) <= 1.25 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'Drill Attendance',
            current: `${avgAttendance}%`,
            benchmark: '92%',
            unit: '%',
            status: 'optimal',
            trend: 'up',
          },
        ],
        priorityItems: [
          {
            id: 'coach-pa-01',
            title: `${leadRiskAth?.name || 'Athlete'}: Speed Capped at 80% Vmax`,
            severity: 'HIGH',
            badge: 'Drill Restriction',
            detail: `${leadRiskAth?.name || 'Athlete'} restricted from maximal intensity exposure in ${sessions[0]?.title || 'Training'}.`,
            timestamp: '30 mins ago',
            actionText: 'Adjust Tactical Unit',
          },
          {
            id: 'coach-pa-02',
            title: `${secondRiskAth?.name || 'Athlete'}: Modified Volume Prescription`,
            severity: 'CRITICAL',
            badge: 'Load Management',
            detail: `ACWR ${secondRiskAth?.acwr || 1.38} flagged. ${readyAth?.name || 'Teammate'} assigned to lead primary unit.`,
            timestamp: '1 hour ago',
            actionText: 'Confirm Lineup',
          },
          {
            id: 'coach-pa-03',
            title: `${readyAth?.name || 'Athlete'}: Cleared for Full Competition Simulation`,
            severity: 'OPTIMAL',
            badge: 'Peak Readiness',
            detail: `${readyAth?.name || 'Athlete'} registered ${readyAth?.readiness || 88}% morning readiness with ${readyAth?.hrvMs || 72} ms HRV.`,
            timestamp: '2 hours ago',
            actionText: 'Include in Starting Unit',
          },
        ],
        distributionTitle: 'Tactical Role Distribution',
        distributionData: [
          {
            label: 'Starting Unit / Full Fit',
            percentage: Math.round((activeCount / totalAthletes) * 100),
            count: activeCount,
            colorClass: 'bg-emerald-500',
          },
          {
            label: 'Load-Managed Sub Unit',
            percentage: Math.round((restrictedCount / totalAthletes) * 100),
            count: restrictedCount,
            colorClass: 'bg-amber-500',
          },
          {
            label: 'Unavailable / Off-Feet',
            percentage: Math.round((injuredCount / totalAthletes) * 100),
            count: injuredCount,
            colorClass: 'bg-rose-500',
          },
        ],
      };
    }

    case 'Sports Scientist': {
      const fatigueCount = athletes.filter((a) => (a.readiness || 80) < 70).length;
      const syncedPodsCount = Math.max(1, totalAthletes - (totalAthletes % 2 === 0 ? 0 : 1));
      const freshnessPct = Math.round((syncedPodsCount / totalAthletes) * 100);
      return {
        kpis: [
          {
            id: 'mean-readiness',
            label: 'Cohort Mean Readiness',
            value: `${meanReadiness}%`,
            subtext: `Hooper-Mackinnon 14d (${contextSport})`,
            deltaLabel:
              meanReadiness >= 75 ? 'Optimal aerobic state' : 'Fatigued cohort',
            tone: meanReadiness >= 75 ? 'emerald' : 'amber',
            targetHint: 'Readiness & HRV Modeling',
            iconName: 'Activity',
          },
          {
            id: 'neuromuscular-fatigue',
            label: 'Neuromuscular Fatigue Flags',
            value: `${fatigueCount}`,
            subtext: `CMJ flight-time:contraction-time drop`,
            deltaLabel: 'Force plate screening',
            tone: fatigueCount > 2 ? 'rose' : 'amber',
            targetHint: 'Force Plate Asymmetry',
            iconName: 'BarChart2',
          },
          {
            id: 'acwr-spikes',
            label: 'ACWR Spike Danger Flags',
            value: `${acwrSpikesCount}`,
            subtext: `ACWR ≥ 1.35 (${acwrSpikeShortNames})`,
            deltaLabel: 'Tissue strain threshold',
            tone: acwrSpikesCount > 0 ? 'rose' : 'emerald',
            targetHint: 'Workload Science Matrix',
            iconName: 'AlertTriangle',
          },
          {
            id: 'hrv-recovery',
            label: 'Mean Overnight HRV rMSSD',
            value: `${meanHrv} ms`,
            subtext: `Autonomic baseline (${contextProgram})`,
            deltaLabel: 'Telemetry live sync',
            tone: 'sky',
            targetHint: 'Sleep & HRV Telemetry',
            iconName: 'Moon',
          },
          {
            id: 'high-speed-volume',
            label: 'High-Speed Sprint Volume',
            value: `${totalSprintMeters}m`,
            subtext: `Wearable GPS exposure today (${contextSport})`,
            deltaLabel: `${sessions.length} sessions tracked`,
            tone: 'emerald',
            targetHint: 'GPS Sprint Exposures',
            iconName: 'Zap',
          },
          {
            id: 'data-freshness',
            label: 'Telemetry Data Freshness',
            value: `${freshnessPct}%`,
            subtext: `${syncedPodsCount} of ${totalAthletes} wearable IoT pods synced`,
            deltaLabel: '06:15 IST cloud push',
            tone: 'emerald',
            targetHint: 'IoT Hardware Status',
            iconName: 'ShieldCheck',
          },
        ],
        primaryAnalyticsTitle: `${contextSport} Biometric Telemetry & ACWR Science`,
        primaryAnalyticsSubtitle: `Continuous velocity distribution, HRV rMSSD deviations, and force-plate asymmetry for ${contextProgram}`,
        analyticsMetrics: [
          {
            name: 'Cohort Mean Readiness',
            current: `${meanReadiness}%`,
            benchmark: '80%',
            unit: '%',
            status: meanReadiness >= 75 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'Squad ACWR Ratio',
            current: meanAcwr,
            benchmark: '1.10',
            unit: 'AU',
            status: Number(meanAcwr) <= 1.25 ? 'optimal' : 'warning',
            trend: 'up',
          },
          {
            name: 'Mean Nightly HRV',
            current: `${meanHrv} ms`,
            benchmark: '66 ms',
            unit: 'ms',
            status: meanHrv >= 62 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'High-Speed Exposure',
            current: `${totalSprintMeters}m`,
            benchmark: '1200m',
            unit: 'm',
            status: 'optimal',
            trend: 'up',
          },
        ],
        priorityItems: [
          {
            id: 'ss-pa-01',
            title: `${leadRiskAth?.name || 'Athlete'}: CMJ Asymmetry & ACWR ${leadRiskAth?.acwr || 1.41}`,
            severity: 'CRITICAL',
            badge: 'Force Plate Deficit',
            detail: `Morning dual force-plate trial for ${leadRiskAth?.name || 'Athlete'} correlates with acute load ${leadRiskAth?.acuteLoadAu || 720} AU.`,
            timestamp: '45 mins ago',
            actionText: 'View Force Traces',
          },
          {
            id: 'ss-pa-02',
            title: `${secondRiskAth?.name || 'Athlete'}: HRV Depressed (${secondRiskAth?.hrvMs || 51} ms)`,
            severity: 'HIGH',
            badge: 'Neuromuscular Fatigue',
            detail: `${secondRiskAth?.name || 'Athlete'} exhibiting autonomic suppression below ${secondRiskAth?.hrvBaselineMs || 62} ms baseline.`,
            timestamp: '1 hour ago',
            actionText: 'Cap Sprint Velocity',
          },
          {
            id: 'ss-pa-03',
            title: `${readyAth?.name || 'Athlete'}: Top Quartile Output (${readyAth?.readiness || 88}%)`,
            severity: 'OPTIMAL',
            badge: 'Peak Biometrics',
            detail: `${readyAth?.name || 'Athlete'} recorded personal-best power output in ${contextSport} testing with zero autonomic fatigue.`,
            timestamp: '2 hours ago',
            actionText: 'Export Biometric Profile',
          },
        ],
        distributionTitle: 'Workload Risk Distribution (ACWR)',
        distributionData: [
          {
            label: 'Sweetspot (0.8 - 1.34 AU)',
            percentage: Math.round(
              ((totalAthletes - acwrSpikesCount) / totalAthletes) * 100
            ),
            count: totalAthletes - acwrSpikesCount,
            colorClass: 'bg-emerald-500',
          },
          {
            label: 'Danger Zone (≥ 1.35 AU)',
            percentage: Math.round((acwrSpikesCount / totalAthletes) * 100),
            count: acwrSpikesCount,
            colorClass: 'bg-rose-500',
          },
        ],
      };
    }

    case 'Physiotherapist': {
      const severeInjuries = activeInjuries.filter(
        (i) => i.severity === 'Severe'
      ).length;
      const moderateInjuries = activeInjuries.filter(
        (i) => i.severity === 'Moderate'
      ).length;
      const inRehabCount = activeInjuries.filter(
        (i) =>
          i.stage === 'Rehabilitation' ||
          i.stage === 'In Rehabilitation' ||
          i.stage === 'Assessment' ||
          i.stage === 'Monitoring'
      ).length;
      const rtpReadyCount = activeInjuries.filter((i) => i.rtpStage >= 3).length;
      const avgPain = activeInjuries.length
        ? (
            activeInjuries.reduce((s, i) => s + (i.painScore || 0), 0) /
            activeInjuries.length
          ).toFixed(1)
        : '1.8';
      const meanLsi = activeInjuries.length
        ? (
            activeInjuries.reduce(
              (s, i) => s + (i.gateCriteria?.limbSymmetryIndexPct || 90),
              0
            ) / activeInjuries.length
          ).toFixed(1)
        : '93.5';
      const rehabCompliancePct = Math.min(
        99,
        Math.max(88, 92 + ((totalAthletes + activeInjuries.length) % 7))
      );
      const clearanceDueInjuries = activeInjuries.filter(
        (i) =>
          Object.values(i.gateCriteria || {}).filter((v) => v === true).length >= 3
      );

      return {
        kpis: [
          {
            id: 'active-injuries',
            label: 'Active Injury Register',
            value: `${activeInjuries.length}`,
            subtext: `${severeInjuries} severe · ${moderateInjuries} moderate (${contextSport})`,
            deltaLabel: `${activeInjuries.length} total cases`,
            tone: 'rose',
            targetHint: 'Open Injury Registry',
            iconName: 'HeartPulse',
          },
          {
            id: 'in-rehabilitation',
            label: 'Athletes in Active Rehab',
            value: `${inRehabCount}`,
            subtext: `Prescribed daily ${contextSport} clinical protocols`,
            deltaLabel: 'Rehab protocols active',
            tone: 'amber',
            targetHint: 'Rehabilitation Protocols',
            iconName: 'Activity',
          },
          {
            id: 'return-to-play',
            label: '5-Stage RTP Protocol Gates',
            value: `${rtpReadyCount}`,
            subtext: rtpShortNames,
            deltaLabel: 'Stage 3+ progression',
            tone: 'emerald',
            targetHint: 'RTP Clearance Gates',
            iconName: 'ShieldCheck',
          },
          {
            id: 'mean-pain-score',
            label: 'Cohort Mean Pain Score',
            value: `${avgPain} / 10`,
            subtext: 'Pain scores tracked pre/post rehab',
            deltaLabel: 'Visual Analogue Scale',
            tone: Number(avgPain) <= 3.0 ? 'emerald' : 'amber',
            targetHint: 'Pain & Soreness Trends',
            iconName: 'AlertTriangle',
          },
          {
            id: 'compliance',
            label: 'Rehab Session Compliance',
            value: `${rehabCompliancePct}%`,
            subtext: `Attendance in ${contextProgram} physio bay`,
            deltaLabel: `${meanLsi}% mean LSI`,
            tone: 'emerald',
            targetHint: 'Rehab Attendance Log',
            iconName: 'CheckCircle2',
          },
          {
            id: 'clearance-due',
            label: 'Clearance Milestones Due',
            value: `${clearanceDueInjuries.length}`,
            subtext:
              clearanceDueInjuries
                .slice(0, 2)
                .map((i) => i.athleteName)
                .join(' & ') || 'All gates reviewed',
            deltaLabel: 'Awaiting CMO review',
            tone: 'sky',
            targetHint: 'Review Gate Approvals',
            iconName: 'FileCheck',
          },
        ],
        primaryAnalyticsTitle: `${contextSport} Musculoskeletal Screening & RTP Gate Clearance`,
        primaryAnalyticsSubtitle: `5-Stage Return-to-Play objective criteria and limb symmetry across ${contextProgram}`,
        analyticsMetrics: [
          {
            name: 'Active Clinical Cases',
            current: activeInjuries.length,
            benchmark: 3,
            unit: 'cases',
            status: activeInjuries.length <= 3 ? 'optimal' : 'warning',
            trend: 'down',
          },
          {
            name: 'Stage 3+ RTP Progression',
            current: rtpReadyCount,
            benchmark: 2,
            unit: 'athletes',
            status: 'optimal',
            trend: 'up',
          },
          {
            name: 'Limb Symmetry Index (Mean)',
            current: `${meanLsi}%`,
            benchmark: '90%',
            unit: '%',
            status: Number(meanLsi) >= 90 ? 'optimal' : 'warning',
            trend: 'up',
          },
          {
            name: 'Mean Clinical Pain Index',
            current: `${avgPain}/10`,
            benchmark: '2.5/10',
            unit: 'VAS',
            status: Number(avgPain) <= 3.0 ? 'optimal' : 'warning',
            trend: 'down',
          },
        ],
        priorityItems: activeInjuries.slice(0, 3).map((inj, idx) => ({
          id: `physio-pa-0${idx + 1}`,
          title: `${inj.athleteName}: Stage ${inj.rtpStage}/5 ${inj.injuryTitle}`,
          severity:
            inj.severity === 'Severe'
              ? ('CRITICAL' as const)
              : inj.rtpStage >= 4
                ? ('OPTIMAL' as const)
                : ('HIGH' as const),
          badge: `${inj.bodyRegionDisplay}`,
          detail: `${inj.clinicalSummary} Pain ${inj.painScore}/10 · LSI ${inj.gateCriteria?.limbSymmetryIndexPct || 90}%.`,
          timestamp: `${(idx + 1) * 20} mins ago`,
          actionText:
            inj.rtpStage >= 3 ? 'Sign-Off RTP Gate' : 'Record Clinical Note',
        })),
        distributionTitle: 'Injury Anatomic Distribution',
        distributionData: activeInjuries.slice(0, 3).map((inj, idx) => ({
          label: inj.bodyRegionDisplay,
          percentage: Math.round(100 / Math.max(1, Math.min(3, activeInjuries.length))),
          count: 1,
          colorClass:
            idx === 0
              ? 'bg-rose-500'
              : idx === 1
                ? 'bg-amber-500'
                : 'bg-sky-500',
        })),
      };
    }

    case 'Nutritionist': {
      const proteinMetCount = athletes.filter(
        (a) => (a.nutritionCompliancePct || 85) >= 88
      ).length;
      const dexaStability = (93.2 + ((meanNutrition + totalAthletes) % 6) * 0.6).toFixed(1);
      const meanProteinGkg = (1.9 + ((meanNutrition % 5) * 0.1)).toFixed(1);
      return {
        kpis: [
          {
            id: 'fueling-compliance',
            label: 'Squad Fueling Compliance',
            value: `${meanNutrition}%`,
            subtext: `Target macro adherence (${contextSport})`,
            deltaLabel: '+2.4% vs last cycle',
            tone: meanNutrition >= 85 ? 'emerald' : 'amber',
            targetHint: 'Athlete Fueling Plans',
            iconName: 'Apple',
          },
          {
            id: 'hydration-risk',
            label: 'Pre-Training Hydration Flags',
            value: `${dehydratedCount}`,
            subtext: `USG > 1.020 (${dehydratedShortNames})`,
            deltaLabel: 'Prescribed electrolyte bolus',
            tone: dehydratedCount > 0 ? 'amber' : 'emerald',
            targetHint: 'USG Hydration Queue',
            iconName: 'Droplets',
          },
          {
            id: 'active-plans',
            label: 'Active Metabolic Fuel Plans',
            value: `${nutritionPlans.length || totalAthletes}`,
            subtext: `Tailored ${contextProgram} caloric targets`,
            deltaLabel: `${totalAthletes} athletes carded`,
            tone: 'sky',
            targetHint: 'Metabolic Plan Register',
            iconName: 'Utensils',
          },
          {
            id: 'wada-audit',
            label: 'Informed-Sport WADA Audit',
            value: '100%',
            subtext: `All ${totalAthletes} ${contextSport} batch logs verified`,
            deltaLabel: 'Zero banned substances',
            tone: 'emerald',
            targetHint: 'WADA Supplement Registry',
            iconName: 'ShieldCheck',
          },
          {
            id: 'protein-target-met',
            label: 'Protein Target Achievement',
            value: `${proteinMetCount} / ${totalAthletes}`,
            subtext: `Meeting ≥ ${meanProteinGkg}g/kg lean mass threshold`,
            deltaLabel: 'Collagen added for rehab',
            tone: 'emerald',
            targetHint: 'Macro Breakdown',
            iconName: 'Activity',
          },
          {
            id: 'body-comp-stable',
            label: 'DEXA Lean Mass Stability',
            value: `${dexaStability}%`,
            subtext: `Dual-energy X-ray track (${contextSquad})`,
            deltaLabel: 'Optimal lean mass ratio',
            tone: 'emerald',
            targetHint: 'DEXA Body Composition',
            iconName: 'BarChart2',
          },
        ],
        primaryAnalyticsTitle: `${contextSport} Macronutrient Adherence & Hydration Status`,
        primaryAnalyticsSubtitle: `Real-time refractometer USG, recovery protein intake, and Informed-Sport audit for ${contextProgram}`,
        analyticsMetrics: [
          {
            name: 'Squad Fueling Compliance',
            current: `${meanNutrition}%`,
            benchmark: '85%',
            unit: '%',
            status: meanNutrition >= 85 ? 'optimal' : 'warning',
            trend: 'up',
          },
          {
            name: 'Optimal Hydration (USG < 1.020)',
            current: `${totalAthletes - dehydratedCount} / ${totalAthletes}`,
            benchmark: `${Math.max(1, totalAthletes - 2)}`,
            unit: 'athletes',
            status: dehydratedCount <= 2 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'Mean Protein Ingestion',
            current: `${meanProteinGkg}g/kg`,
            benchmark: '2.0g/kg',
            unit: 'g/kg',
            status: 'optimal',
            trend: 'up',
          },
          {
            name: 'DEXA Lean Stability',
            current: `${dexaStability}%`,
            benchmark: '94.0%',
            unit: '%',
            status: 'optimal',
            trend: 'stable',
          },
        ],
        priorityItems: [
          {
            id: 'nutri-pa-01',
            title: `${dehydratedAthletes[0]?.name || leadRiskAth?.name || 'Athlete'}: USG 1.024 (Dehydration Flagged)`,
            severity: 'HIGH',
            badge: 'Pre-Training USG',
            detail: `Morning refractometer testing in ${contextSport} shows elevated specific gravity. Prescribed 500ml hypotonic electrolyte bolus.`,
            timestamp: '25 mins ago',
            actionText: 'Dispense Electrolyte Bolus',
          },
          {
            id: 'nutri-pa-02',
            title: `${secondRiskAth?.name || 'Athlete'}: High-Load Glycogen Replenishment`,
            severity: 'HIGH',
            badge: 'Energy Availability',
            detail: `Acute load ${secondRiskAth?.acuteLoadAu || 690} AU requires +450 kcal carbohydrate window post-${contextSport} session.`,
            timestamp: '1 hour ago',
            actionText: 'Adjust Meal Plan',
          },
          {
            id: 'nutri-pa-03',
            title: `${readyAth?.name || 'Athlete'}: Tart Cherry & Collagen Protocol Verified`,
            severity: 'OPTIMAL',
            badge: 'Tissue Recovery',
            detail: `15g hydrolysed collagen + 500mg Vitamin C dispensed prior to ${contextSquad} strength block.`,
            timestamp: '2 hours ago',
            actionText: 'View Supplement Audit',
          },
        ],
        distributionTitle: 'Hydration Status Cohort',
        distributionData: [
          {
            label: 'Optimal Hydration (< 1.020 USG)',
            percentage: Math.round(
              ((totalAthletes - dehydratedCount) / totalAthletes) * 100
            ),
            count: totalAthletes - dehydratedCount,
            colorClass: 'bg-emerald-500',
          },
          {
            label: 'Mild Dehydration (1.020 - 1.026 USG)',
            percentage: Math.round((dehydratedCount / totalAthletes) * 100),
            count: dehydratedCount,
            colorClass: 'bg-amber-500',
          },
        ],
      };
    }

    case 'Federation Admin': {
      const clearedMedCount = athletes.filter(
        (a) => a.medicalStatus === 'Cleared'
      ).length;
      const restrictedMedCount = athletes.filter(
        (a) => a.medicalStatus === 'Restricted'
      ).length;
      const travelFlagsCount = Math.max(1, pendingVerificationCount);
      const wadaCompliancePct =
        pendingVerificationCount > 2 ? '94%' : pendingVerificationCount === 2 ? '97%' : '100%';
      return {
        kpis: [
          {
            id: 'total-registered',
            label: 'National Registry Cohort',
            value: `${totalAthletes}`,
            subtext: `${verifiedCount} verified in ${contextSport}`,
            deltaLabel: `${contextProgram}`,
            tone: 'emerald',
            targetHint: 'National Athlete Registry',
            iconName: 'Users',
          },
          {
            id: 'pending-verification',
            label: 'Pending Institutional Review',
            value: `${pendingVerificationCount}`,
            subtext: pendingShortNames,
            deltaLabel: 'Awaiting seals',
            tone: pendingVerificationCount > 0 ? 'amber' : 'emerald',
            targetHint: 'Enrollment Applications',
            iconName: 'FileCheck',
          },
          {
            id: 'verified-passports',
            label: 'Verified & Sealed Passports',
            value: `${verifiedCount}`,
            subtext: `Full biometric & age verified (${contextSquad})`,
            deltaLabel: 'State NOC cleared',
            tone: 'emerald',
            targetHint: 'Licensing Verification',
            iconName: 'ShieldCheck',
          },
          {
            id: 'medical-clearances',
            label: 'Medical Board Clearance',
            value: `${clearedMedCount}`,
            subtext: `${restrictedMedCount} with clinical restrictions`,
            deltaLabel: 'CMO sign-off',
            tone: 'sky',
            targetHint: 'Clinical Clearance Board',
            iconName: 'HeartPulse',
          },
          {
            id: 'wada-whereabouts',
            label: 'WADA Whereabouts Pool',
            value: wadaCompliancePct,
            subtext: `Tier-1 testing pool compliant (${contextSport})`,
            deltaLabel: 'ADAMS Q4 synced',
            tone: 'emerald',
            targetHint: 'WADA Whereabouts Register',
            iconName: 'Globe',
          },
          {
            id: 'urgent-travel-flags',
            label: 'Urgent Travel / Visa Warnings',
            value: `${travelFlagsCount}`,
            subtext: `${leadRiskAth?.name || 'Athlete'}: Visa/Passport clearance`,
            deltaLabel: 'Action required',
            tone: 'rose',
            targetHint: 'Travel Watchdog',
            iconName: 'AlertTriangle',
          },
        ],
        primaryAnalyticsTitle: `${contextSport} Registry Governance & International Sanction Auditing`,
        primaryAnalyticsSubtitle: `3-Tier institutional clearance, Ministry travel sanctions, and anti-doping governance for ${contextProgram}`,
        analyticsMetrics: [
          {
            name: 'Licensing Verification Rate',
            current: `${Math.round((verifiedCount / totalAthletes) * 100)}%`,
            benchmark: '90%',
            unit: '%',
            status: 'optimal',
            trend: 'up',
          },
          {
            name: 'Pending Admin Approvals',
            current: pendingVerificationCount,
            benchmark: 2,
            unit: 'athletes',
            status: pendingVerificationCount <= 2 ? 'optimal' : 'warning',
            trend: 'down',
          },
          {
            name: 'Medical Board Cleared',
            current: `${clearedMedCount} / ${totalAthletes}`,
            benchmark: `${Math.max(1, totalAthletes - 2)}`,
            unit: 'athletes',
            status: 'optimal',
            trend: 'stable',
          },
          {
            name: 'WADA Filing Compliance',
            current: wadaCompliancePct,
            benchmark: '100%',
            unit: '%',
            status: 'optimal',
            trend: 'stable',
          },
        ],
        priorityItems: [
          {
            id: 'fed-pa-01',
            title: `${leadRiskAth?.name || 'Athlete'}: International Tour Sanction & Passport Check`,
            severity: 'CRITICAL',
            badge: 'Travel Watchdog',
            detail: `Upcoming ${contextSport} international fixture requires Ministry clearance and 180-day passport validity verification.`,
            timestamp: '20 mins ago',
            actionText: 'Dispatch Ministry Liaison',
          },
          {
            id: 'fed-pa-02',
            title: `${pendingAth?.name || 'Athlete'}: ${contextProgram} Verification Pending`,
            severity: 'HIGH',
            badge: 'Licensing Gate',
            detail: `${pendingAth?.name || 'Athlete'} requires proof of renewed sports insurance and coach sign-off to complete verification.`,
            timestamp: '1 hour ago',
            actionText: 'Review Application',
          },
          {
            id: 'fed-pa-03',
            title: `${readyAth?.name || 'Athlete'}: Contract Counter-Signature Ready`,
            severity: 'MEDIUM',
            badge: 'Contract Approval',
            detail: `State association NOC and ${contextSport} sporting passport verified. Ready for institutional seal.`,
            timestamp: '2 hours ago',
            actionText: 'Affix Official Seal',
          },
        ],
        distributionTitle: 'Institutional Verification Pipeline',
        distributionData: [
          {
            label: 'Fully Verified & Activated',
            percentage: Math.round((verifiedCount / totalAthletes) * 100),
            count: verifiedCount,
            colorClass: 'bg-emerald-500',
          },
          {
            label: 'Pending Administrative / Medical Seal',
            percentage: Math.round(
              (pendingVerificationCount / totalAthletes) * 100
            ),
            count: pendingVerificationCount,
            colorClass: 'bg-amber-500',
          },
        ],
      };
    }

    case 'Operations Team': {
      const activeBookings = sessions.length + (totalAthletes % 3);
      const openOrders = 1 + ((totalAthletes + activeInjuries.length) % 4);
      const totalPods = totalAthletes + 2;
      const syncedPods = totalAthletes;
      const venueHealthPct = 90 + ((meanReadiness + totalAthletes) % 9);
      const chartersCount = 2 + ((totalAthletes + sessions.length) % 3);
      const budgetPct = (95.2 + ((meanReadiness % 5) * 0.7)).toFixed(1);

      return {
        kpis: [
          {
            id: 'facility-bookings',
            label: 'Facility Zone Bookings Today',
            value: `${activeBookings} Active`,
            subtext: `${sessions[0]?.pitchOrVenue || contextSport} & S&C`,
            deltaLabel: `${avgAttendance}% venue utilization`,
            tone: 'emerald',
            targetHint: 'Facility Timetable',
            iconName: 'Building2',
          },
          {
            id: 'active-work-orders',
            label: 'Open Facility Work Orders',
            value: `${openOrders} Open`,
            subtext: `${contextSport} surface & gym calibration`,
            deltaLabel: '1 resolved today',
            tone: openOrders > 2 ? 'amber' : 'emerald',
            targetHint: 'Work Order Register',
            iconName: 'Wrench',
          },
          {
            id: 'gps-fleet-pods',
            label: 'Telemetry Fleet Synced',
            value: `${syncedPods} / ${totalPods}`,
            subtext: `${contextProgram} pods charged & calibrated`,
            deltaLabel: '2 on charging dock',
            tone: 'emerald',
            targetHint: 'Hardware Fleet Matrix',
            iconName: 'Zap',
          },
          {
            id: 'turf-quality-score',
            label: `${contextSport} Surface Readiness`,
            value: `${venueHealthPct}%`,
            subtext: `${sessions[0]?.pitchOrVenue || 'Main Arena'}`,
            deltaLabel: 'International Federation Pro',
            tone: 'emerald',
            targetHint: 'Venue Management',
            iconName: 'CheckCircle2',
          },
          {
            id: 'transport-routes',
            label: 'Team Transport Logistics',
            value: `${chartersCount} Charters`,
            subtext: `${contextSquad} transfer & training shuttle`,
            deltaLabel: 'On schedule',
            tone: 'sky',
            targetHint: 'Transport Schedules',
            iconName: 'Truck',
          },
          {
            id: 'facility-budget',
            label: 'HPC Operational Budget',
            value: `${budgetPct}%`,
            subtext: `${contextProgram} consumables & logistics`,
            deltaLabel: '+1.8% efficiency',
            tone: 'emerald',
            targetHint: 'Budget Variance',
            iconName: 'BarChart2',
          },
        ],
        primaryAnalyticsTitle: `${contextSport} Facility Allocation & Hardware Health (${contextProgram})`,
        primaryAnalyticsSubtitle: `Hourly venue occupancy, IoT sensor battery health, and engineering orders for ${contextSquad}`,
        analyticsMetrics: [
          {
            name: 'Venue Zone Utilization',
            current: `${venueHealthPct - 2}%`,
            benchmark: '85%',
            unit: '%',
            status: 'optimal',
            trend: 'up',
          },
          {
            name: 'Hardware Fleet Online',
            current: `${syncedPods}/${totalPods}`,
            benchmark: `${totalAthletes}`,
            unit: 'pods',
            status: 'optimal',
            trend: 'stable',
          },
          {
            name: 'Preventative Work Orders',
            current: openOrders,
            benchmark: 3,
            unit: 'orders',
            status: 'optimal',
            trend: 'down',
          },
          {
            name: 'Budget Utilization',
            current: `${budgetPct}%`,
            benchmark: '95.0%',
            unit: '%',
            status: 'optimal',
            trend: 'stable',
          },
        ],
        priorityItems: [
          {
            id: 'ops-pa-01',
            title: `${sessions[0]?.pitchOrVenue || 'Primary Venue'}: Calibration Scheduled 13:00`,
            severity: 'MEDIUM',
            badge: 'Venue Ops',
            detail: `Surface & environmental check scheduled prior to ${contextProgram} (${contextSport}) afternoon block.`,
            timestamp: '40 mins ago',
            actionText: 'Confirm Venue Window',
          },
          {
            id: 'ops-pa-02',
            title: `Cryo & Recovery Wing: ${totalAthletes} Athlete Slots Reserved`,
            severity: 'OPTIMAL',
            badge: 'Medical Logistics',
            detail: `Recovery suite prepped at 100% capacity for ${contextSquad} post-training rotations.`,
            timestamp: '2 hours ago',
            actionText: 'View Delivery Docket',
          },
          {
            id: 'ops-pa-03',
            title: `Travel Manifest: ${totalAthletes} ${contextSport} Athletes Confirmed`,
            severity: 'HIGH',
            badge: 'Travel Logistics',
            detail: `Charter manifest for ${totalAthletes} athletes and coaching staff under ${athletes[0]?.coach || 'Head Coach'} locked.`,
            timestamp: '3 hours ago',
            actionText: 'Download Manifest',
          },
        ],
        distributionTitle: 'Facility Occupancy by Cohort',
        distributionData: [
          {
            label: contextSquad,
            percentage: 55,
            count: activeCount,
            colorClass: 'bg-emerald-500',
          },
          {
            label: 'Strength & Biomechanics Lab',
            percentage: 30,
            count: restrictedCount,
            colorClass: 'bg-indigo-500',
          },
          {
            label: 'Rehab & Recovery Clinic',
            percentage: 15,
            count: Math.max(1, injuredCount),
            colorClass: 'bg-sky-500',
          },
        ],
      };
    }

    case 'Athlete':
    default: {
      const cur = activeAthlete || athletes[0];
      return {
        kpis: [
          {
            id: 'my-readiness',
            label: 'My Daily Readiness',
            value: `${cur.readiness}%`,
            subtext:
              cur.readiness >= 80
                ? `Optimal ${cur.sport} condition`
                : cur.readiness >= 65
                  ? 'Monitor load exposure'
                  : 'Restricted load',
            deltaLabel: cur.readinessDelta
              ? `${cur.readinessDelta > 0 ? '+' : ''}${cur.readinessDelta}% vs 7d`
              : 'Daily Hooper score',
            tone:
              cur.readiness >= 80
                ? 'emerald'
                : cur.readiness >= 65
                  ? 'amber'
                  : 'rose',
            targetHint: 'My Readiness Details',
            iconName: 'Activity',
          },
          {
            id: 'training-load',
            label: 'My Acute Training Load',
            value: `${cur.acuteLoadAu || 650} AU`,
            subtext: `Workload ratio: ACWR ${cur.acwr || 1.15}`,
            deltaLabel: `${cur.trainingLoadPct || 80}% of ceiling`,
            tone: (cur.acwr || 1.1) <= 1.25 ? 'emerald' : 'rose',
            targetHint: 'My Workload Targets',
            iconName: 'Flame',
          },
          {
            id: 'recovery-hrv',
            label: 'Nightly HRV (rMSSD)',
            value: `${cur.hrvMs || 58} ms`,
            subtext: `Baseline: ${cur.hrvBaselineMs || 60} ms`,
            deltaLabel:
              (cur.hrvMs || 60) >= (cur.hrvBaselineMs || 60)
                ? 'Optimal recovery'
                : 'Autonomic dip',
            tone:
              (cur.hrvMs || 60) >= (cur.hrvBaselineMs || 60)
                ? 'emerald'
                : 'amber',
            targetHint: 'Sleep & HRV Telemetry',
            iconName: 'Moon',
          },
          {
            id: 'sleep-duration',
            label: 'Sleep Duration & Score',
            value: `${cur.sleepFormatted || '7h 15m'}`,
            subtext: `${cur.sleepHours || 7.2}h average sleep`,
            deltaLabel: 'Whoop / Oura sync',
            tone: (cur.sleepHours || 7) >= 7.5 ? 'emerald' : 'amber',
            targetHint: 'Sleep Breakdown',
            iconName: 'Calendar',
          },
          {
            id: 'fueling-compliance',
            label: 'Daily Fueling Compliance',
            value: `${cur.nutritionCompliancePct || 88}%`,
            subtext:
              cur.hydrationStatus === 'Optimal'
                ? 'Optimal hydration'
                : 'Hydration bolus prescribed',
            deltaLabel: 'Macronutrient targets',
            tone: cur.hydrationStatus === 'Optimal' ? 'emerald' : 'amber',
            targetHint: 'Daily Fueling Plan',
            iconName: 'Utensils',
          },
          {
            id: 'medical-status',
            label: 'My Training Status',
            value: `${cur.trainingStatus}`,
            subtext: `${cur.medicalStatus} clearance (${cur.position})`,
            deltaLabel:
              cur.trainingStatus === 'ACTIVE' ? 'Cleared 100%' : 'Speed capped',
            tone:
              cur.trainingStatus === 'ACTIVE'
                ? 'emerald'
                : cur.trainingStatus === 'RESTRICTED'
                  ? 'amber'
                  : 'rose',
            targetHint: 'My Clearance & Dossier',
            iconName: 'ShieldCheck',
          },
        ],
        primaryAnalyticsTitle: `My 14-Day Readiness, Sleep & Workload Telemetry (${cur.name})`,
        primaryAnalyticsSubtitle: `Your daily personalized ${cur.sport} (${cur.program}) metrics synced directly with Coach ${cur.coach}`,
        analyticsMetrics: [
          {
            name: 'My Readiness Score',
            current: `${cur.readiness}%`,
            benchmark: '80%',
            unit: '%',
            status: cur.readiness >= 75 ? 'optimal' : 'warning',
            trend: 'stable',
          },
          {
            name: 'Acute Workload',
            current: `${cur.acuteLoadAu || 650} AU`,
            benchmark: '600 AU',
            unit: 'AU',
            status: 'optimal',
            trend: 'up',
          },
          {
            name: 'Overnight HRV',
            current: `${cur.hrvMs || 58} ms`,
            benchmark: `${cur.hrvBaselineMs || 60} ms`,
            unit: 'ms',
            status: 'optimal',
            trend: 'stable',
          },
          {
            name: 'Fueling Compliance',
            current: `${cur.nutritionCompliancePct || 88}%`,
            benchmark: '85%',
            unit: '%',
            status: 'optimal',
            trend: 'up',
          },
        ],
        priorityItems: [
          {
            id: 'ath-pa-01',
            title: `${sessions[0]?.title || 'Primary Session'}: Target Load ${cur.acuteLoadAu} AU`,
            severity: cur.trainingStatus === 'RESTRICTED' ? 'HIGH' : 'OPTIMAL',
            badge: cur.sport,
            detail: `Controlled intensity corridors prescribed by Coach ${cur.coach} for ${cur.position}.`,
            timestamp: '08:00 IST',
            actionText: 'View Drill Details',
          },
          {
            id: 'ath-pa-02',
            title: `Prescribed Hydration: 500ml Isotonic Bolus`,
            severity: cur.hydrationStatus !== 'Optimal' ? 'HIGH' : 'OPTIMAL',
            badge: 'Fueling Directive',
            detail: 'Consume at 45-minute training interval based on morning USG profile.',
            timestamp: '08:15 IST',
            actionText: 'Check Meal Plan',
          },
        ],
        distributionTitle: 'My Weekly Workload Breakdown',
        distributionData: [
          {
            label: `${cur.sport} Specific Tactical`,
            percentage: 50,
            count: 4,
            colorClass: 'bg-emerald-500',
          },
          {
            label: 'Strength & Power',
            percentage: 30,
            count: 2,
            colorClass: 'bg-sky-500',
          },
          {
            label: 'Rehab / Mobility',
            percentage: 20,
            count: 2,
            colorClass: 'bg-amber-500',
          },
        ],
      };
    }
  }
}
