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
    (a) => a.trainingStatus === 'RESTRICTED' || a.trainingStatus === 'IN REHAB' || a.trainingStatus === 'RETURN TO PLAY'
  ).length;
  const injuredCount = athletes.filter((a) => a.trainingStatus === 'INJURED').length;
  const pendingVerificationCount = athletes.filter((a) => a.verificationStatus === 'Pending').length;
  const verifiedCount = athletes.filter((a) => a.verificationStatus === 'Verified').length;
  const activeInjuries = injuries.filter((i) => i.stage !== 'Resolved');
  const meanReadiness = Math.round(
    athletes.reduce((acc, a) => acc + (a.readiness || 75), 0) / totalAthletes
  );
  const meanAcwr = (
    athletes.reduce((acc, a) => acc + (a.acwr || 1.1), 0) / totalAthletes
  ).toFixed(2);
  const acwrSpikesCount = athletes.filter((a) => (a.acwr || 0) >= 1.35).length;
  const meanHrv = Math.round(
    athletes.reduce((acc, a) => acc + (a.hrvMs || 65), 0) / totalAthletes
  );
  const meanNutrition = Math.round(
    athletes.reduce((acc, a) => acc + (a.nutritionCompliancePct || 85), 0) / totalAthletes
  );
  const dehydratedCount = athletes.filter((a) => a.hydrationStatus !== 'Optimal').length;
  const completedSessionsCount = sessions.filter((s) => s.status === 'Completed').length;
  const avgAttendance = sessions.length
    ? Math.round(sessions.reduce((s, sess) => s + (sess.attendance || 90), 0) / sessions.length)
    : 94;
  const totalSprintMeters = sessions.reduce((acc, s) => acc + (s.targetHighSpeedM || 0), 0);
  const highRiskAthletes = athletes.filter((a) => a.injuryRisk === 'High');

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
            subtext: `${activeCount} of ${totalAthletes} active elite athletes`,
            deltaLabel: activeCount >= 7 ? '+2.1% vs target' : '-1.4% below target',
            tone: activeCount >= 7 ? 'emerald' : 'amber',
            targetHint: 'Inspect Ready Cohort',
            iconName: 'UserCheck',
          },
          {
            id: 'injury-incidence',
            label: 'Clinical Injury Load',
            value: `${activeInjuries.length}`,
            subtext: `${activeInjuries.length} active cases in clinical tracking`,
            deltaLabel: `${injuryPct}% squad load`,
            tone: activeInjuries.length <= 4 ? 'emerald' : 'rose',
            targetHint: 'Open Injury Intelligence',
            iconName: 'HeartPulse',
          },
          {
            id: 'olympic-pathway',
            label: 'Olympic Pathway Ready',
            value: `${meanReadiness}%`,
            subtext: `Mean readiness across ${totalAthletes} carded athletes`,
            deltaLabel: 'Target ≥ 80%',
            tone: meanReadiness >= 80 ? 'emerald' : 'sky',
            targetHint: 'Inspect Pathway Pipeline',
            iconName: 'Trophy',
          },
          {
            id: 'acwr-stability',
            label: 'Squad Workload Stability',
            value: `${meanAcwr}`,
            subtext: `Optimal ACWR sweetspot (0.8 - 1.3)`,
            deltaLabel: Number(meanAcwr) <= 1.25 ? 'Sweetspot safe' : 'Elevated load',
            tone: Number(meanAcwr) <= 1.25 ? 'emerald' : 'amber',
            targetHint: 'Workload Science Matrix',
            iconName: 'Activity',
          },
          {
            id: 'interdisciplinary-sync',
            label: 'Staff Sync Compliance',
            value: `${avgAttendance}%`,
            subtext: 'Coach, Physio, Nutrition logging',
            deltaLabel: '100% daily sign-off',
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
        primaryAnalyticsTitle: 'Quadrennial Pathway Readiness & Availability Trend',
        primaryAnalyticsSubtitle: `Continuous telemetry aggregate across Senior and U-23 Olympic squads (${totalAthletes} athletes tracked)`,
        analyticsMetrics: [
          { name: 'Squad Availability', current: `${availabilityPct}%`, benchmark: '88.0%', unit: '%', status: Number(availabilityPct) >= 80 ? 'optimal' : 'warning', trend: 'stable' },
          { name: 'Mean ACWR Load', current: meanAcwr, benchmark: '1.10', unit: 'AU', status: Number(meanAcwr) <= 1.25 ? 'optimal' : 'warning', trend: 'up' },
          { name: 'Mean Readiness', current: `${meanReadiness}%`, benchmark: '82%', unit: '%', status: meanReadiness >= 75 ? 'optimal' : 'warning', trend: 'stable' },
          { name: 'Active Injuries', current: activeInjuries.length, benchmark: '4', unit: 'cases', status: activeInjuries.length <= 4 ? 'optimal' : 'critical', trend: 'down' },
        ],
        priorityItems: [
          {
            id: 'pa-01',
            title: `Arjun Mehta: Stage 3 Hamstring RTP Sign-off Pending`,
            severity: 'CRITICAL',
            badge: 'Clinical Clearance',
            detail: 'Arjun completed 85% Vmax acceleration gate with 96% symmetry. CMO final match clearance required.',
            timestamp: '14 mins ago',
            actionText: 'Review Clearance Gate',
          },
          {
            id: 'pa-02',
            title: `Devansh Kulkarni: Ankle Joint Effusion Off-loading`,
            severity: 'HIGH',
            badge: 'Injury Alert',
            detail: 'Devansh off-loaded from pitch training following right ankle syndesmosis effusion (Pain 5/10).',
            timestamp: '1 hour ago',
            actionText: 'Inspect Clinical Dossier',
          },
          {
            id: 'pa-03',
            title: `${pendingVerificationCount} Athletes Pending Institutional Clearance`,
            severity: 'MEDIUM',
            badge: 'Federation Gate',
            detail: `Zorawar Gill & Pranav Sundaram awaiting federation documentation seal and coach assignment.`,
            timestamp: '2 hours ago',
            actionText: 'Open Enrollment Tracker',
          },
        ],
        distributionTitle: 'Squad Functional Availability',
        distributionData: [
          { label: 'Unconstrained Match Ready', percentage: Math.round((activeCount / totalAthletes) * 100), count: activeCount, colorClass: 'bg-emerald-500' },
          { label: 'Restricted / Modified Load', percentage: Math.round((restrictedCount / totalAthletes) * 100), count: restrictedCount, colorClass: 'bg-amber-500' },
          { label: 'Clinical Rehab / Unavailable', percentage: Math.round((injuredCount / totalAthletes) * 100), count: injuredCount, colorClass: 'bg-rose-500' },
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
            subtext: `${activeCount} unconstrained match-fit players`,
            deltaLabel: 'Starting XI ready',
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
            subtext: `${acwrSpikesCount} players above 1.35 threshold`,
            deltaLabel: 'ACWR sweetspot',
            tone: Number(meanAcwr) <= 1.25 ? 'emerald' : 'amber',
            targetHint: 'Workload Science Matrix',
            iconName: 'Activity',
          },
          {
            id: 'attendance',
            label: 'Session Attendance Rate',
            value: `${avgAttendance}%`,
            subtext: `${totalSprintMeters}m high-speed sprint exposure`,
            deltaLabel: '+1.8% vs last week',
            tone: 'emerald',
            targetHint: 'Attendance Register',
            iconName: 'UserCheck',
          },
          {
            id: 'tactical-flags',
            label: 'High Fatigue / Risk Warnings',
            value: `${highRiskAthletes.length}`,
            subtext: 'Arjun, Vikramaditya, Devansh',
            deltaLabel: 'Modify high-press drills',
            tone: 'rose',
            targetHint: 'Squad Availability Board',
            iconName: 'HeartPulse',
          },
        ],
        primaryAnalyticsTitle: 'Matchday Squad Selection & Physical Readiness Matrix',
        primaryAnalyticsSubtitle: `Real-time position-by-position readiness for Senior Squad tactical planning`,
        analyticsMetrics: [
          { name: 'Matchday Unrestricted Fit', current: activeCount, benchmark: 8, unit: 'players', status: activeCount >= 7 ? 'optimal' : 'warning', trend: 'stable' },
          { name: 'Speed-Capped Players', current: restrictedCount, benchmark: 2, unit: 'players', status: restrictedCount <= 3 ? 'optimal' : 'warning', trend: 'up' },
          { name: 'Mean Squad ACWR', current: meanAcwr, benchmark: '1.15', unit: 'AU', status: Number(meanAcwr) <= 1.25 ? 'optimal' : 'warning', trend: 'stable' },
          { name: 'Tactical Drill Attendance', current: `${avgAttendance}%`, benchmark: '92%', unit: '%', status: 'optimal', trend: 'up' },
        ],
        priorityItems: [
          {
            id: 'coach-pa-01',
            title: `Arjun Mehta: Speed Capped at 80% Vmax (24.0 km/h)`,
            severity: 'HIGH',
            badge: 'Drill Restriction',
            detail: 'Arjun restricted from 11v11 maximal counter-attack sprints. Substitute Pranav Sundaram in high-press unit.',
            timestamp: '30 mins ago',
            actionText: 'Adjust Tactical Unit',
          },
          {
            id: 'coach-pa-02',
            title: `Devansh Kulkarni: Withdrawn from Pitch Sessions`,
            severity: 'CRITICAL',
            badge: 'Injury Absence',
            detail: 'Right ankle syndesmosis effusion confirmed. Kabir Rao stepping in as starting center-back.',
            timestamp: '1 hour ago',
            actionText: 'Confirm Starting XI',
          },
          {
            id: 'coach-pa-03',
            title: `Rohan Chhetri: Cleared for 92% Vmax Match Simulation`,
            severity: 'OPTIMAL',
            badge: 'RTP Stage 4',
            detail: 'Rohan successfully integrated into full squad midfield drills without pain. Ready for 45-min match block.',
            timestamp: '2 hours ago',
            actionText: 'Include in Match Sheet',
          },
        ],
        distributionTitle: 'Tactical Role Distribution',
        distributionData: [
          { label: 'Starting XI / Full Fit', percentage: Math.round((activeCount / totalAthletes) * 100), count: activeCount, colorClass: 'bg-emerald-500' },
          { label: 'Load-Managed Sub Unit', percentage: Math.round((restrictedCount / totalAthletes) * 100), count: restrictedCount, colorClass: 'bg-amber-500' },
          { label: 'Unavailable / Off-Feet', percentage: Math.round((injuredCount / totalAthletes) * 100), count: injuredCount, colorClass: 'bg-rose-500' },
        ],
      };
    }

    case 'Sports Scientist': {
      return {
        kpis: [
          {
            id: 'mean-readiness',
            label: 'Cohort Mean Readiness',
            value: `${meanReadiness}%`,
            subtext: `Hooper-Mackinnon 14-day cohort average`,
            deltaLabel: meanReadiness >= 75 ? 'Optimal aerobic state' : 'Fatigued cohort',
            tone: meanReadiness >= 75 ? 'emerald' : 'amber',
            targetHint: 'Readiness & HRV Modeling',
            iconName: 'Activity',
          },
          {
            id: 'neuromuscular-fatigue',
            label: 'Neuromuscular Fatigue Flags',
            value: `${athletes.filter((a) => (a.readiness || 80) < 70).length}`,
            subtext: `CMJ flight-time:contraction-time drop`,
            deltaLabel: 'Force plate screening',
            tone: 'rose',
            targetHint: 'Force Plate Asymmetry',
            iconName: 'BarChart2',
          },
          {
            id: 'acwr-spikes',
            label: 'ACWR Spike Danger Flags',
            value: `${acwrSpikesCount}`,
            subtext: `Athletes with ACWR ≥ 1.35 (Arjun 1.42, Vikram 1.39)`,
            deltaLabel: 'Tissue strain threshold',
            tone: 'rose',
            targetHint: 'Workload Science Matrix',
            iconName: 'AlertTriangle',
          },
          {
            id: 'hrv-recovery',
            label: 'Mean Overnight HRV rMSSD',
            value: `${meanHrv} ms`,
            subtext: `Autonomic parasympathetic baseline`,
            deltaLabel: 'Telemetry live sync',
            tone: 'sky',
            targetHint: 'Sleep & HRV Telemetry',
            iconName: 'Moon',
          },
          {
            id: 'high-speed-volume',
            label: 'High-Speed Sprint Volume',
            value: `${totalSprintMeters}m`,
            subtext: `Catapult/StatsSports GPS exposure today`,
            deltaLabel: 'Sprint bands >25 km/h',
            tone: 'emerald',
            targetHint: 'GPS Sprint Exposures',
            iconName: 'Zap',
          },
          {
            id: 'data-freshness',
            label: 'Telemetry Data Freshness',
            value: '100%',
            subtext: `${totalAthletes} of ${totalAthletes} wearable IoT pods synced`,
            deltaLabel: '06:15 IST cloud push',
            tone: 'emerald',
            targetHint: 'IoT Hardware Status',
            iconName: 'ShieldCheck',
          },
        ],
        primaryAnalyticsTitle: 'Biometric Telemetry & Acute:Chronic Workload Science',
        primaryAnalyticsSubtitle: `Continuous GPS velocity distribution, HRV rMSSD deviations, and force plate asymmetry`,
        analyticsMetrics: [
          { name: 'Cohort Mean Readiness', current: `${meanReadiness}%`, benchmark: '80%', unit: '%', status: meanReadiness >= 75 ? 'optimal' : 'warning', trend: 'stable' },
          { name: 'Squad ACWR Ratio', current: meanAcwr, benchmark: '1.10', unit: 'AU', status: Number(meanAcwr) <= 1.25 ? 'optimal' : 'warning', trend: 'up' },
          { name: 'Mean Nightly HRV', current: `${meanHrv} ms`, benchmark: '68 ms', unit: 'ms', status: 'optimal', trend: 'stable' },
          { name: 'GPS Sprint Exposure', current: `${totalSprintMeters}m`, benchmark: '1200m', unit: 'm', status: 'optimal', trend: 'up' },
        ],
        priorityItems: [
          {
            id: 'ss-pa-01',
            title: `Arjun Mehta: CMJ Eccentric Asymmetry -14% Left Deficit`,
            severity: 'CRITICAL',
            badge: 'Force Plate Deficit',
            detail: 'Morning dual force-plate trial reveals 14% peak impulse deficit on left hamstring. Correlates with ACWR spike (1.42).',
            timestamp: '45 mins ago',
            actionText: 'View Force Traces',
          },
          {
            id: 'ss-pa-02',
            title: `Vikramaditya Nair: FT:CT Ratio Drop -9.2%`,
            severity: 'HIGH',
            badge: 'Neuromuscular Fatigue',
            detail: 'Vikramaditya exhibiting flight-time to contraction-time drop following yesterday’s high deceleration volume.',
            timestamp: '1 hour ago',
            actionText: 'Cap Sprint Velocity',
          },
          {
            id: 'ss-pa-03',
            title: `Pranav Sundaram: Peak Velocity 34.1 km/h Logged`,
            severity: 'OPTIMAL',
            badge: 'Sprint Record',
            detail: 'Pranav recorded personal-best velocity in Speed & Acceleration module with zero autonomic fatigue.',
            timestamp: '2 hours ago',
            actionText: 'Export Biometric Profile',
          },
        ],
        distributionTitle: 'Workload Risk Distribution (ACWR)',
        distributionData: [
          { label: 'Sweetspot (0.8 - 1.25 AU)', percentage: Math.round(((totalAthletes - acwrSpikesCount) / totalAthletes) * 100), count: totalAthletes - acwrSpikesCount, colorClass: 'bg-emerald-500' },
          { label: 'Danger Zone (≥ 1.35 AU)', percentage: Math.round((acwrSpikesCount / totalAthletes) * 100), count: acwrSpikesCount, colorClass: 'bg-rose-500' },
        ],
      };
    }

    case 'Physiotherapist': {
      const severeInjuries = activeInjuries.filter((i) => i.severity === 'Severe').length;
      const moderateInjuries = activeInjuries.filter((i) => i.severity === 'Moderate').length;
      const inRehabCount = activeInjuries.filter((i) => i.stage === 'Rehabilitation' || i.stage === 'Assessment' || i.stage === 'Monitoring').length;
      const rtpReadyCount = activeInjuries.filter((i) => i.rtpStage >= 3).length;
      const avgPain = activeInjuries.length
        ? (activeInjuries.reduce((s, i) => s + (i.painScore || 0), 0) / activeInjuries.length).toFixed(1)
        : '2.0';

      return {
        kpis: [
          {
            id: 'active-injuries',
            label: 'Active Injury Register',
            value: `${activeInjuries.length}`,
            subtext: `${severeInjuries} severe · ${moderateInjuries} moderate cases`,
            deltaLabel: `${activeInjuries.length} total cases`,
            tone: 'rose',
            targetHint: 'Open Injury Registry',
            iconName: 'HeartPulse',
          },
          {
            id: 'in-rehabilitation',
            label: 'Athletes in Active Rehab',
            value: `${inRehabCount}`,
            subtext: 'Prescribed daily clinical exercises',
            deltaLabel: 'Rehab protocols active',
            tone: 'amber',
            targetHint: 'Rehabilitation Protocols',
            iconName: 'Activity',
          },
          {
            id: 'return-to-play',
            label: '5-Stage RTP Protocol Gates',
            value: `${rtpReadyCount}`,
            subtext: 'Arjun (St 3), Rohan (St 4), Devansh (St 2)',
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
            value: '96%',
            subtext: 'Attendance in physiotherapy bay',
            deltaLabel: '100% adherence',
            tone: 'emerald',
            targetHint: 'Rehab Attendance Log',
            iconName: 'CheckCircle2',
          },
          {
            id: 'clearance-due',
            label: 'Clearance Milestones Due',
            value: `${activeInjuries.filter((i) => Object.values(i.gateCriteria || {}).filter(Boolean).length >= 4).length}`,
            subtext: 'Arjun Mehta & Rohan Chhetri',
            deltaLabel: 'Awaiting CMO review',
            tone: 'sky',
            targetHint: 'Review Gate Approvals',
            iconName: 'FileCheck',
          },
        ],
        primaryAnalyticsTitle: 'Clinical Musculoskeletal Screening & RTP Gate Clearance',
        primaryAnalyticsSubtitle: `5-Stage Return-to-Play objective criteria, isokinetic limb symmetry, and ultrasound monitoring`,
        analyticsMetrics: [
          { name: 'Active Clinical Cases', current: activeInjuries.length, benchmark: 4, unit: 'cases', status: 'warning', trend: 'down' },
          { name: 'Stage 3+ RTP Progression', current: rtpReadyCount, benchmark: 2, unit: 'athletes', status: 'optimal', trend: 'up' },
          { name: 'Limb Symmetry Index (Mean)', current: '91.8%', benchmark: '90%', unit: '%', status: 'optimal', trend: 'up' },
          { name: 'Mean Clinical Pain Index', current: `${avgPain}/10`, benchmark: '2.5/10', unit: 'VAS', status: Number(avgPain) <= 3.0 ? 'optimal' : 'warning', trend: 'down' },
        ],
        priorityItems: [
          {
            id: 'physio-pa-01',
            title: `Arjun Mehta: Stage 3/5 Acceleration Gate Review`,
            severity: 'HIGH',
            badge: 'Hamstring Protocol',
            detail: 'Arjun completed 85% Vmax acceleration corridor with zero pain. Gate criteria 4 of 5 verified; awaiting CMO clearance sign-off.',
            timestamp: '15 mins ago',
            actionText: 'Sign-Off RTP Gate',
          },
          {
            id: 'physio-pa-02',
            title: `Devansh Kulkarni: Ankle Syndesmosis Diagnostic Ultrasound`,
            severity: 'CRITICAL',
            badge: 'Acute Effusion',
            detail: 'Effusion localized around anterior inferior tibiofibular ligament. Off-feet conditioning active; ultrasound review booked 17:30.',
            timestamp: '1 hour ago',
            actionText: 'Record Clinical Note',
          },
          {
            id: 'physio-pa-03',
            title: `Rohan Chhetri: 96.4% Eccentric Hamstring Symmetry Verified`,
            severity: 'OPTIMAL',
            badge: 'Stage 4 Complete',
            detail: 'NordBord eccentric testing demonstrates complete bilateral restoration. Ready for final match clearance.',
            timestamp: '2 hours ago',
            actionText: 'Generate Clearance Doc',
          },
        ],
        distributionTitle: 'Injury Anatomic Distribution',
        distributionData: [
          { label: 'Hamstring Pathology', percentage: 50, count: 2, colorClass: 'bg-rose-500' },
          { label: 'Shoulder Complex', percentage: 25, count: 1, colorClass: 'bg-amber-500' },
          { label: 'Ankle Syndesmosis', percentage: 25, count: 1, colorClass: 'bg-sky-500' },
        ],
      };
    }

    case 'Nutritionist': {
      return {
        kpis: [
          {
            id: 'fueling-compliance',
            label: 'Squad Fueling Compliance',
            value: `${meanNutrition}%`,
            subtext: `Target macronutrient adherence`,
            deltaLabel: '+2.4% vs last cycle',
            tone: meanNutrition >= 85 ? 'emerald' : 'amber',
            targetHint: 'Athlete Fueling Plans',
            iconName: 'Apple',
          },
          {
            id: 'hydration-risk',
            label: 'Pre-Training Hydration Flags',
            value: `${dehydratedCount}`,
            subtext: `USG > 1.020 (Arjun, Vikramaditya)`,
            deltaLabel: 'Prescribed electrolyte bolus',
            tone: dehydratedCount > 0 ? 'amber' : 'emerald',
            targetHint: 'USG Hydration Queue',
            iconName: 'Droplets',
          },
          {
            id: 'active-plans',
            label: 'Active Metabolic Fuel Plans',
            value: `${nutritionPlans.length || totalAthletes}`,
            subtext: `Tailored protein & recovery caloric targets`,
            deltaLabel: `${totalAthletes} athletes carded`,
            tone: 'sky',
            targetHint: 'Metabolic Plan Register',
            iconName: 'Utensils',
          },
          {
            id: 'wada-audit',
            label: 'Informed-Sport WADA Audit',
            value: '100%',
            subtext: 'Every supplement batch tested & certified',
            deltaLabel: 'Zero banned substances',
            tone: 'emerald',
            targetHint: 'WADA Supplement Registry',
            iconName: 'ShieldCheck',
          },
          {
            id: 'protein-target-met',
            label: 'Protein Target Achievement',
            value: `${athletes.filter((a) => (a.nutritionCompliancePct || 85) >= 90).length} / ${totalAthletes}`,
            subtext: 'Meeting ≥ 2.0g/kg lean mass threshold',
            deltaLabel: 'Collagen added for rehab',
            tone: 'emerald',
            targetHint: 'Macro Breakdown',
            iconName: 'Activity',
          },
          {
            id: 'body-comp-stable',
            label: 'DEXA Lean Mass Stability',
            value: '95.4%',
            subtext: 'Dual-energy X-ray absorptiometry track',
            deltaLabel: 'Body fat 9.8% - 11.2%',
            tone: 'emerald',
            targetHint: 'DEXA Body Composition',
            iconName: 'BarChart2',
          },
        ],
        primaryAnalyticsTitle: 'Macronutrient Adherence & Pre-Training Hydration Status',
        primaryAnalyticsSubtitle: `Real-time refractometer urine specific gravity (USG), recovery protein intake, and Informed-Sport audit`,
        analyticsMetrics: [
          { name: 'Squad Fueling Compliance', current: `${meanNutrition}%`, benchmark: '85%', unit: '%', status: meanNutrition >= 85 ? 'optimal' : 'warning', trend: 'up' },
          { name: 'Optimal Hydration (USG < 1.020)', current: `${totalAthletes - dehydratedCount} / ${totalAthletes}`, benchmark: '8', unit: 'athletes', status: dehydratedCount <= 2 ? 'optimal' : 'warning', trend: 'stable' },
          { name: 'Mean Protein Ingestion', current: '2.1g/kg', benchmark: '2.0g/kg', unit: 'g/kg', status: 'optimal', trend: 'up' },
          { name: 'WADA Batch Audit', current: '100%', benchmark: '100%', unit: '%', status: 'optimal', trend: 'stable' },
        ],
        priorityItems: [
          {
            id: 'nutri-pa-01',
            title: `Arjun Mehta: USG 1.024 (Mild Dehydration Flagged)`,
            severity: 'HIGH',
            badge: 'Pre-Training USG',
            detail: 'Morning refractometer testing shows elevated specific gravity. Prescribed 500ml hypotonic electrolyte bolus prior to training.',
            timestamp: '25 mins ago',
            actionText: 'Dispense Electrolyte Bolus',
          },
          {
            id: 'nutri-pa-02',
            title: `Vikramaditya Nair: Caloric Deficit (-660 kcal below target)`,
            severity: 'HIGH',
            badge: 'Energy Availability',
            detail: 'Vikramaditya consumed only 2,390 kcal vs 3,050 kcal target during high-load sprint phase. Added carbohydrate smoothie.',
            timestamp: '1 hour ago',
            actionText: 'Adjust Meal Plan',
          },
          {
            id: 'nutri-pa-03',
            title: `Devansh Kulkarni: Anti-Inflammatory Tart Cherry & Collagen Active`,
            severity: 'OPTIMAL',
            badge: 'Tissue Recovery',
            detail: 'Prescribed 15g hydrolysed collagen peptides + 500mg Vitamin C 45 mins prior to rehab session for syndesmosis recovery.',
            timestamp: '2 hours ago',
            actionText: 'View Supplement Audit',
          },
        ],
        distributionTitle: 'Hydration Status Cohort',
        distributionData: [
          { label: 'Optimal Hydration (< 1.020 USG)', percentage: Math.round(((totalAthletes - dehydratedCount) / totalAthletes) * 100), count: totalAthletes - dehydratedCount, colorClass: 'bg-emerald-500' },
          { label: 'Mild Dehydration (1.020 - 1.026 USG)', percentage: Math.round((dehydratedCount / totalAthletes) * 100), count: dehydratedCount, colorClass: 'bg-amber-500' },
        ],
      };
    }

    case 'Federation Admin': {
      return {
        kpis: [
          {
            id: 'total-registered',
            label: 'National Registry Cohort',
            value: `${totalAthletes}`,
            subtext: `${verifiedCount} fully verified & licensed`,
            deltaLabel: `${totalAthletes} carded athletes`,
            tone: 'emerald',
            targetHint: 'National Athlete Registry',
            iconName: 'Users',
          },
          {
            id: 'pending-verification',
            label: 'Pending Institutional Review',
            value: `${pendingVerificationCount}`,
            subtext: `Zorawar Gill, Pranav, Vikramaditya`,
            deltaLabel: 'Awaiting seals',
            tone: pendingVerificationCount > 0 ? 'amber' : 'emerald',
            targetHint: 'Enrollment Applications',
            iconName: 'FileCheck',
          },
          {
            id: 'verified-passports',
            label: 'Verified & Sealed Passports',
            value: `${verifiedCount}`,
            subtext: 'Full biometric & age verified',
            deltaLabel: 'State NOC cleared',
            tone: 'emerald',
            targetHint: 'Licensing Verification',
            iconName: 'ShieldCheck',
          },
          {
            id: 'medical-clearances',
            label: 'Medical Board Clearance',
            value: `${athletes.filter((a) => a.medicalStatus === 'Cleared').length}`,
            subtext: `${athletes.filter((a) => a.medicalStatus === 'Restricted').length} with clinical restrictions`,
            deltaLabel: 'CMO sign-off',
            tone: 'sky',
            targetHint: 'Clinical Clearance Board',
            iconName: 'HeartPulse',
          },
          {
            id: 'wada-whereabouts',
            label: 'WADA Whereabouts Pool',
            value: '100%',
            subtext: 'Tier-1 testing pool compliant for Q3/Q4',
            deltaLabel: 'Zero missed tests',
            tone: 'emerald',
            targetHint: 'WADA Whereabouts Register',
            iconName: 'Globe',
          },
          {
            id: 'urgent-travel-flags',
            label: 'Urgent Travel / Visa Warnings',
            value: '1',
            subtext: 'Arjun Mehta: Passport < 6 months validity',
            deltaLabel: 'Action required',
            tone: 'rose',
            targetHint: 'Travel Watchdog',
            iconName: 'AlertTriangle',
          },
        ],
        primaryAnalyticsTitle: 'National Registry Governance & International Sanction Auditing',
        primaryAnalyticsSubtitle: `3-Tier institutional clearance, Ministry travel sanctions, and anti-doping governance`,
        analyticsMetrics: [
          { name: 'Licensing Verification Rate', current: `${Math.round((verifiedCount / totalAthletes) * 100)}%`, benchmark: '90%', unit: '%', status: 'optimal', trend: 'up' },
          { name: 'Pending Admin Approvals', current: pendingVerificationCount, benchmark: 2, unit: 'athletes', status: pendingVerificationCount <= 3 ? 'optimal' : 'warning', trend: 'down' },
          { name: 'Medical Board Cleared', current: `${athletes.filter((a) => a.medicalStatus === 'Cleared').length} / ${totalAthletes}`, benchmark: '8', unit: 'athletes', status: 'optimal', trend: 'stable' },
          { name: 'WADA Filing Compliance', current: '100%', benchmark: '100%', unit: '%', status: 'optimal', trend: 'stable' },
        ],
        priorityItems: [
          {
            id: 'fed-pa-01',
            title: `Arjun Mehta: Passport Expires 28 Nov 2026 (48 Days Remaining)`,
            severity: 'CRITICAL',
            badge: 'Travel Ineligible',
            detail: 'Passport validity violates the 180-day entry rule for the upcoming European tour on 12 Oct. Urgent Tatkal renewal notice issued.',
            timestamp: '20 mins ago',
            actionText: 'Dispatch Ministry Liaison',
          },
          {
            id: 'fed-pa-02',
            title: `Zorawar Gill: National Camp Call-up Verification Pending`,
            severity: 'HIGH',
            badge: 'Licensing Gate',
            detail: 'Zorawar requires proof of renewed sports insurance and primary coach sign-off to complete Level 2 verification.',
            timestamp: '1 hour ago',
            actionText: 'Review Application',
          },
          {
            id: 'fed-pa-03',
            title: `Pranav Sundaram: U-23 Contract Counter-Signature Ready`,
            severity: 'MEDIUM',
            badge: 'Contract Approval',
            detail: 'State association NOC and sporting passport verified. Ready for institutional seal.',
            timestamp: '2 hours ago',
            actionText: 'Affix Official Seal',
          },
        ],
        distributionTitle: 'Institutional Verification Pipeline',
        distributionData: [
          { label: 'Fully Verified & Activated', percentage: Math.round((verifiedCount / totalAthletes) * 100), count: verifiedCount, colorClass: 'bg-emerald-500' },
          { label: 'Pending Administrative / Medical Seal', percentage: Math.round((pendingVerificationCount / totalAthletes) * 100), count: pendingVerificationCount, colorClass: 'bg-amber-500' },
        ],
      };
    }

    case 'Operations Team': {
      return {
        kpis: [
          {
            id: 'facility-bookings',
            label: 'Facility Zone Bookings Today',
            value: '5 Active',
            subtext: 'Pitch 1, Pitch 2, S&C Gym, Pools',
            deltaLabel: '100% pitch utilization',
            tone: 'emerald',
            targetHint: 'Facility Timetable',
            iconName: 'Building2',
          },
          {
            id: 'active-work-orders',
            label: 'Open Facility Work Orders',
            value: '2 Open',
            subtext: 'Sprinkler valve & gym cable inspection',
            deltaLabel: '1 resolved today',
            tone: 'amber',
            targetHint: 'Work Order Register',
            iconName: 'Wrench',
          },
          {
            id: 'gps-fleet-pods',
            label: 'GPS Fleet Hardware Synced',
            value: '28 / 30',
            subtext: 'Catapult pods charged & calibrated',
            deltaLabel: '2 on charging dock',
            tone: 'emerald',
            targetHint: 'Hardware Fleet Matrix',
            iconName: 'Zap',
          },
          {
            id: 'turf-quality-score',
            label: 'Pitch 1 Natural Grass Health',
            value: '94%',
            subtext: '22mm cut · Soil moisture 28%',
            deltaLabel: 'FIFA Quality Pro',
            tone: 'emerald',
            targetHint: 'Turf Management',
            iconName: 'CheckCircle2',
          },
          {
            id: 'transport-routes',
            label: 'Team Transport Logistics',
            value: '3 Charters',
            subtext: 'Airport transfer & training shuttle',
            deltaLabel: 'On schedule',
            tone: 'sky',
            targetHint: 'Transport Schedules',
            iconName: 'Truck',
          },
          {
            id: 'facility-budget',
            label: 'HPC Operational Budget',
            value: '98.2%',
            subtext: 'Consumables & maintenance on budget',
            deltaLabel: '+1.8% efficiency',
            tone: 'emerald',
            targetHint: 'Budget Variance',
            iconName: 'BarChart2',
          },
        ],
        primaryAnalyticsTitle: 'High Performance Centre Facility Allocation & Hardware Health',
        primaryAnalyticsSubtitle: `Hourly pitch occupancy, IoT hardware sensor battery health, and preventative engineering orders`,
        analyticsMetrics: [
          { name: 'Pitch Zone Utilization', current: '92%', benchmark: '85%', unit: '%', status: 'optimal', trend: 'up' },
          { name: 'GPS Hardware Fleet Online', current: '28/30', benchmark: '28', unit: 'pods', status: 'optimal', trend: 'stable' },
          { name: 'Preventative Work Orders', current: 2, benchmark: 3, unit: 'orders', status: 'optimal', trend: 'down' },
          { name: 'Turf Traction Index', current: '42 Nm', benchmark: '40 Nm', unit: 'Nm', status: 'optimal', trend: 'stable' },
        ],
        priorityItems: [
          {
            id: 'ops-pa-01',
            title: `Pitch 1 Zone A: Sprinkler Calibration Scheduled 13:00`,
            severity: 'MEDIUM',
            badge: 'Groundskeeping',
            detail: 'Zone A irrigation cycle scheduled between Senior Squad morning session and U-23 afternoon block.',
            timestamp: '40 mins ago',
            actionText: 'Confirm Pitch Window',
          },
          {
            id: 'ops-pa-02',
            title: `Cryo-Chamber: Liquid Nitrogen Delivery Verified`,
            severity: 'OPTIMAL',
            badge: 'Medical Logistics',
            detail: 'Medical wing recovery cryo-tank filled to 100% capacity. Ready for post-training recovery rotations.',
            timestamp: '2 hours ago',
            actionText: 'View Delivery Docket',
          },
          {
            id: 'ops-pa-03',
            title: `Airport Logistics: Team Charter for Asian Grand Prix Confirmed`,
            severity: 'HIGH',
            badge: 'Travel Logistics',
            detail: 'Charter manifest for 28 athletes and 12 staff locked for 12 Oct departure.',
            timestamp: '3 hours ago',
            actionText: 'Download Manifest',
          },
        ],
        distributionTitle: 'Facility Occupancy by Squad',
        distributionData: [
          { label: 'Senior National Squad', percentage: 55, count: 18, colorClass: 'bg-emerald-500' },
          { label: 'U-23 Development Unit', percentage: 30, count: 10, colorClass: 'bg-indigo-500' },
          { label: 'Rehab & Recovery Clinic', percentage: 15, count: 5, colorClass: 'bg-sky-500' },
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
            subtext: cur.readiness >= 80 ? 'Optimal match condition' : cur.readiness >= 65 ? 'Monitor load exposure' : 'Restricted load',
            deltaLabel: cur.readinessDelta ? `${cur.readinessDelta > 0 ? '+' : ''}${cur.readinessDelta}% vs 7d` : 'Daily Hooper score',
            tone: cur.readiness >= 80 ? 'emerald' : cur.readiness >= 65 ? 'amber' : 'rose',
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
            deltaLabel: (cur.hrvMs || 60) >= (cur.hrvBaselineMs || 60) ? 'Optimal recovery' : 'Autonomic dip',
            tone: (cur.hrvMs || 60) >= (cur.hrvBaselineMs || 60) ? 'emerald' : 'amber',
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
            subtext: cur.hydrationStatus === 'Optimal' ? 'Optimal hydration' : 'Hydration bolus prescribed',
            deltaLabel: 'Macronutrient targets',
            tone: cur.hydrationStatus === 'Optimal' ? 'emerald' : 'amber',
            targetHint: 'Daily Fueling Plan',
            iconName: 'Utensils',
          },
          {
            id: 'medical-status',
            label: 'My Training Status',
            value: `${cur.trainingStatus}`,
            subtext: `${cur.medicalStatus} clearance`,
            deltaLabel: cur.trainingStatus === 'ACTIVE' ? 'Cleared 100%' : 'Speed capped',
            tone: cur.trainingStatus === 'ACTIVE' ? 'emerald' : cur.trainingStatus === 'RESTRICTED' ? 'amber' : 'rose',
            targetHint: 'My Clearance & Dossier',
            iconName: 'ShieldCheck',
          },
        ],
        primaryAnalyticsTitle: 'My 14-Day Readiness, Sleep & Workload Telemetry',
        primaryAnalyticsSubtitle: `Your daily personalized metrics synced directly with Coach Vikram Sharma and Physiotherapy`,
        analyticsMetrics: [
          { name: 'My Readiness Score', current: `${cur.readiness}%`, benchmark: '80%', unit: '%', status: cur.readiness >= 75 ? 'optimal' : 'warning', trend: 'stable' },
          { name: 'Acute Workload', current: `${cur.acuteLoadAu || 650} AU`, benchmark: '600 AU', unit: 'AU', status: 'optimal', trend: 'up' },
          { name: 'Overnight HRV', current: `${cur.hrvMs || 58} ms`, benchmark: `${cur.hrvBaselineMs || 60} ms`, unit: 'ms', status: 'optimal', trend: 'stable' },
          { name: 'Fueling Compliance', current: `${cur.nutritionCompliancePct || 88}%`, benchmark: '85%', unit: '%', status: 'optimal', trend: 'up' },
        ],
        priorityItems: [
          {
            id: 'ath-pa-01',
            title: `GPS Speed Cap Today: ≤ 80% Vmax (24.0 km/h)`,
            severity: cur.trainingStatus === 'RESTRICTED' ? 'HIGH' : 'OPTIMAL',
            badge: 'GPS Corridor',
            detail: 'Controlled acceleration corridors prescribed by Coach Vikram and Dr. Patel. Avoid maximal deceleration stops.',
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
        distributionTitle: 'My Weekly Workload Load Breakdown',
        distributionData: [
          { label: 'Tactical Match Play', percentage: 50, count: 4, colorClass: 'bg-emerald-500' },
          { label: 'Strength & Power', percentage: 30, count: 2, colorClass: 'bg-sky-500' },
          { label: 'Rehab / Mobility', percentage: 20, count: 2, colorClass: 'bg-amber-500' },
        ],
      };
    }
  }
}
