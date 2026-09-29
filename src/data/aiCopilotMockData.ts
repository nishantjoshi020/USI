import {
  AIActionCentreItem,
  AIAuditTrailRecord,
  AIAutomationAuditEvent,
  AICopilotMessage,
  AIDataFreshnessItem,
  AIEvidenceBundle,
  AIRiskSignalCard,
  AITrainingModificationItem,
  AIWorkflowAutomationRule,
  Athlete,
  UserRole,
} from '../types/usi';

export const INITIAL_DATA_FRESHNESS: AIDataFreshnessItem[] = [
  {
    id: 'df-readiness',
    domain: 'Readiness',
    lastUpdated: 'Updated 8 min ago',
    minutesAgo: 8,
    isStale: false,
    sourceSystem: 'Morning Force-Plate & HRV Screening',
  },
  {
    id: 'df-gps',
    domain: 'GPS',
    lastUpdated: 'Updated 12 min ago',
    minutesAgo: 12,
    isStale: false,
    sourceSystem: 'Catapult Vector 10Hz Telemetry',
  },
  {
    id: 'df-medical',
    domain: 'Medical',
    lastUpdated: 'Updated 2 hrs ago',
    minutesAgo: 120,
    isStale: false,
    sourceSystem: 'USI Clinical & RTP Register',
  },
  {
    id: 'df-nutrition',
    domain: 'Nutrition',
    lastUpdated: 'Updated 4 hrs ago',
    minutesAgo: 240,
    isStale: false,
    sourceSystem: 'Athlete Fueling & Hydration Log',
  },
  {
    id: 'df-ai',
    domain: 'AI Insight',
    lastUpdated: 'Generated 8 min ago',
    minutesAgo: 8,
    isStale: false,
    sourceSystem: 'USI Cross-Module Reasoning Engine',
  },
];

export const ARJUN_EVIDENCE_BUNDLE: AIEvidenceBundle = {
  id: 'ev-arjun-readiness',
  title: 'Arjun Mehta — Multi-Factor Readiness & Injury Risk Evidence',
  subjectLabel: 'Arjun Mehta (ATH-1042) · Football · Senior Squad',
  confidence: 'Moderate',
  generatedAt: 'Updated 8 min ago',
  metrics: [
    {
      domain: 'Training',
      label: 'Acute Workload Change',
      deltaOrValue: '+22% acute workload',
      detail: '742 AU vs 608 AU rolling 28-day chronic baseline (ACWR 1.28)',
      tone: 'rose',
    },
    {
      domain: 'Recovery',
      label: 'Composite Recovery Index',
      deltaOrValue: '-8%',
      detail: 'Declined from 72% → 64% over the last 72 hours',
      tone: 'amber',
    },
    {
      domain: 'HRV',
      label: 'Morning HRV (rMSSD)',
      deltaOrValue: '-14%',
      detail: '58 ms today vs 67 ms rolling individual baseline',
      tone: 'rose',
    },
    {
      domain: 'Sleep',
      label: 'Sleep Duration & Quality',
      deltaOrValue: '-11%',
      detail: '6h 10m average over last 3 nights (target ≥ 7h 45m)',
      tone: 'amber',
    },
    {
      domain: 'Medical',
      label: 'Active Medical Context',
      deltaOrValue: 'Hamstring rehabilitation Stage 3/5',
      detail: 'Grade 1 Left Biceps Femoris strain · Pain 3/10 · Medical clearance pending',
      tone: 'rose',
    },
    {
      domain: 'Nutrition',
      label: 'Hydration & Fueling Compliance',
      deltaOrValue: 'Hydration 74% (Low)',
      detail: '2.8L / 3.5L daily target · Calorie compliance 82% (2,610 / 2,850 kcal)',
      tone: 'amber',
    },
  ],
  clinicalDisclaimer:
    'Advisory Intelligence Only: USI AI synthesizes cross-module telemetry to assist sports professionals. AI cannot independently diagnose, clear, or override clinical medical decisions.',
};

export const SQUAD_EVIDENCE_BUNDLE: AIEvidenceBundle = {
  id: 'ev-squad-readiness',
  title: 'Senior Squad — 7-Day Readiness & Workload Evidence',
  subjectLabel: 'Football · Senior Squad (42 Athletes)',
  confidence: 'High',
  generatedAt: 'Updated 8 min ago',
  metrics: [
    {
      domain: 'Training',
      label: 'Squad Acute Load Spike',
      deltaOrValue: '+18% weekly load',
      detail: '12 athletes above ACWR 1.15 threshold following MD-4 tactical block',
      tone: 'amber',
    },
    {
      domain: 'Recovery',
      label: 'Squad Mean Readiness',
      deltaOrValue: '83% → 78% (-5%)',
      detail: '4 Senior Squad athletes currently below 65 readiness threshold',
      tone: 'amber',
    },
    {
      domain: 'HRV',
      label: 'Autonomic Suppression',
      deltaOrValue: '3 athletes depressed >12%',
      detail: 'Arjun Mehta (-14%), Vikramaditya Nair (-13%), Rahul Singh (-11%)',
      tone: 'rose',
    },
    {
      domain: 'Medical',
      label: 'Restricted / RTP Cohort',
      deltaOrValue: '4 Active Injuries',
      detail: '2 In Rehabilitation · 1 Return-to-Play Stage 3 · 1 Escalated Case',
      tone: 'rose',
    },
  ],
  clinicalDisclaimer:
    'Advisory Intelligence Only: Consequential session modifications require explicit Coach or Performance Director approval.',
};

export const INITIAL_TRAINING_MODIFICATIONS: AITrainingModificationItem[] = [
  {
    id: 'tmod-arjun',
    athleteId: 'ath-arjun-mehta',
    athleteName: 'Arjun Mehta',
    squad: 'Senior Squad',
    riskLevel: 'High',
    readiness: 62,
    loadChange: '+22%',
    currentPrescription: '6 × 30m sprint',
    proposedPrescription: '4 × 20m controlled acceleration',
    reason:
      'Active Stage 3/5 hamstring rehabilitation (max sprint restricted to 85% Vmax) combined with +22% acute workload and -14% HRV depression.',
    expectedLoadImpact: '-145 AU (Projected session load: 540 AU vs 685 AU)',
    medicalTrainingContext:
      'Medical status: Restricted · Hamstring rehab Stage 3/5 · Pain 3/10 · Clearance Pending',
    approved: true,
  },
  {
    id: 'tmod-kabir',
    athleteId: 'ath-kabir-rao',
    athleteName: 'Kabir Rao',
    squad: 'U23',
    riskLevel: 'Moderate',
    readiness: 71,
    loadChange: '+18%',
    currentPrescription: '6 × 30m sprint',
    proposedPrescription: '5 × 20m acceleration',
    reason:
      'Acute workload elevated +18% over 7 days with Stage 2 right shoulder AC joint rehabilitation (non-contact upper-body restriction).',
    expectedLoadImpact: '-90 AU (Projected session load: 595 AU vs 685 AU)',
    medicalTrainingContext:
      'Medical status: Restricted · Shoulder rehab Stage 2/5 · Non-contact pitch work cleared',
    approved: true,
  },
  {
    id: 'tmod-vikram',
    athleteId: 'ath-vikram-nair',
    athleteName: 'Vikramaditya Nair',
    squad: 'Senior Squad',
    riskLevel: 'High',
    readiness: 59,
    loadChange: '+21%',
    currentPrescription: 'Full 11v11 High-Press Transition + 6 × 30m sprint',
    proposedPrescription: 'Modified Technical Possession + 3 × 20m build-up runs',
    reason:
      'Readiness dropped to 59 with posterior chain soreness (6/10) and sleep duration < 6.5h over 3 consecutive nights.',
    expectedLoadImpact: '-160 AU (Projected session load: 525 AU vs 685 AU)',
    medicalTrainingContext:
      'Sports Science Alert · ACWR 1.31 · Morning wellness soreness flagged',
    approved: true,
  },
  {
    id: 'tmod-devansh',
    athleteId: 'ath-devansh-kulkarni',
    athleteName: 'Devansh Kulkarni',
    squad: 'Senior Squad',
    riskLevel: 'Moderate',
    readiness: 66,
    loadChange: '+16%',
    currentPrescription: 'High-Deceleration Agility Box + 6 × 30m sprint',
    proposedPrescription: 'Linear Tempo Conditioning + Isometric Quad Loading',
    reason:
      'Left patellar tendinopathy monitoring; high-deceleration change-of-direction load increases tendon strain.',
    expectedLoadImpact: '-110 AU (Projected session load: 575 AU vs 685 AU)',
    medicalTrainingContext:
      'Medical status: Restricted · Patellar tendon load management protocol',
    approved: true,
  },
];

export const INITIAL_AI_ACTION_CENTRE: AIActionCentreItem[] = [
  {
    id: 'ai-act-01',
    priority: 'High',
    safetyClass: 'CONSEQUENTIAL',
    source: 'AI Workload & Readiness Engine',
    affectedAthleteId: 'ath-arjun-mehta',
    affectedAthleteName: 'Arjun Mehta',
    squad: 'Senior Squad',
    recommendation: "Modify Arjun's training",
    detail:
      'Replace 6 × 30m maximal sprint block with 4 × 20m controlled acceleration (≤85% Vmax) due to readiness 62, load +22%, and Stage 3 hamstring restriction.',
    approverRole: 'Awaiting Coach Review',
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 08:15',
    evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-02',
    priority: 'Medium',
    safetyClass: 'RECOMMENDATION',
    source: 'AI Workload & Readiness Engine',
    affectedAthleteId: 'ath-kabir-rao',
    affectedAthleteName: 'Kabir Rao',
    squad: 'U23',
    recommendation: "Review Kabir's workload",
    detail:
      'Adjust high-speed sprint volume to 5 × 20m acceleration and maintain non-contact shoulder protocol during U23 transition block.',
    approverRole: 'Awaiting Sports Scientist',
    status: 'Pending Review',
    confidence: 'Moderate',
    createdAt: 'Today · 08:22',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-03',
    priority: 'Medium',
    safetyClass: 'RECOMMENDATION',
    source: 'AI Assessment & TID Engine',
    affectedAthleteId: 'ath-rohan-deshmukh',
    affectedAthleteName: '8 Pending Squad Athletes',
    squad: 'Senior & U23 Squads',
    recommendation: 'Schedule assessment',
    detail:
      'Football September assessment completion is at 94%. Schedule remaining 8 athletes for Mobility Screen and Squat Strength prior to 30 Sep deadline.',
    approverRole: 'Awaiting Performance Team',
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 07:50',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-04',
    priority: 'High',
    safetyClass: 'RECOMMENDATION',
    source: 'AI Nutrition Monitor',
    affectedAthleteId: 'ath-arjun-mehta',
    affectedAthleteName: 'Arjun Mehta',
    squad: 'Senior Squad',
    recommendation: 'Increase post-session electrolyte & carbohydrate reload',
    detail:
      'Hydration compliance dipped to 74% (2.8L / 3.5L) alongside +22% acute workload increase. Add +600ml isotonic recovery fluid post-pitch.',
    approverRole: 'Awaiting Nutritionist',
    status: 'Approved',
    confidence: 'High',
    createdAt: 'Yesterday · 17:40',
    evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
  },
];

export const INITIAL_AI_RISK_SIGNALS: AIRiskSignalCard[] = [
  {
    id: 'risk-sig-01',
    category: 'Injury Risk Signals',
    athleteId: 'ath-arjun-mehta',
    athleteName: 'Arjun Mehta',
    squad: 'Senior Squad',
    riskLevel: 'Elevated',
    signals: [
      'Workload +22%',
      'HRV -14%',
      'Sleep -11%',
      'Active hamstring rehabilitation (Stage 3/5)',
    ],
    confidence: 'Moderate',
    recommendedAction: 'Review high-intensity training.',
    targetNav: 'injury-intelligence',
    evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
  },
  {
    id: 'risk-sig-02',
    category: 'Workload Risk',
    athleteId: 'ath-kabir-rao',
    athleteName: 'Kabir Rao',
    squad: 'U23',
    riskLevel: 'Moderate',
    signals: [
      'Workload +24% over 7-day rolling window',
      'Recovery -7%',
      'ACWR 1.22 (approaching upper threshold)',
    ],
    confidence: 'High',
    recommendedAction: 'Cap high-speed running volume in tomorrow’s session.',
    targetNav: 'workload',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'risk-sig-03',
    category: 'Recovery Risk',
    athleteId: 'ath-rahul-singh',
    athleteName: 'Rahul Singh',
    squad: 'Senior Squad',
    riskLevel: 'Moderate',
    signals: [
      'Workload +19%',
      'Recovery -11% over 72 hours',
      'Post-match neuromuscular fatigue residual',
    ],
    confidence: 'Moderate',
    recommendedAction: 'Prioritise active recovery & hydrotherapy protocol.',
    targetNav: 'recovery',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'risk-sig-04',
    category: 'Performance Decline',
    athleteId: 'ath-vikram-nair',
    athleteName: 'Vikramaditya Nair',
    squad: 'Senior Squad',
    riskLevel: 'High',
    signals: [
      'CMJ peak power down -6.5% vs baseline',
      'Repeated Sprint Ability decrement 5.1% (benchmark ≤ 4.2%)',
      'Readiness score 59',
    ],
    confidence: 'High',
    recommendedAction: 'Schedule neuromuscular fatigue & force-plate review.',
    targetNav: 'assessments-tid',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'risk-sig-05',
    category: 'Operational Risk',
    athleteName: 'Senior & U23 Football Cohort (8 Athletes)',
    squad: 'Senior & U23',
    riskLevel: 'Moderate',
    signals: [
      '8 athletes pending September cycle assessments (deadline 30 Sep)',
      '5 athletes with pending medical clearance sign-off',
    ],
    confidence: 'High',
    recommendedAction: 'Trigger assessment completion & medical clearance reminders.',
    targetNav: 'athlete-registry',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
];

export const INITIAL_AUTOMATION_RULES: AIWorkflowAutomationRule[] = [
  {
    id: 'rule-01',
    name: 'Readiness & Recovery Decline Escalation',
    whenCondition1: 'Athlete readiness < 65',
    andCondition2: 'Recovery declining for 3 days',
    thenAction: 'Create "Readiness Review" task',
    targetRole: 'Coach & Sports Scientist',
    enabled: true,
    lastTriggered: 'Today · 07:30 (Arjun Mehta)',
    triggerCount7d: 4,
  },
  {
    id: 'rule-02',
    name: 'Medical Restriction vs Workload Guardrail',
    whenCondition1: 'Training load > threshold',
    andCondition2: 'Medical restriction exists',
    thenAction: 'Flag session assignment for review',
    targetRole: 'Coach & Physiotherapist',
    enabled: true,
    lastTriggered: 'Today · 08:15 (Arjun Mehta, Kabir Rao)',
    triggerCount7d: 3,
  },
  {
    id: 'rule-03',
    name: 'Assessment Cycle Deadline Compliance',
    whenCondition1: 'Assessment deadline approaching',
    andCondition2: 'Test incomplete',
    thenAction: 'Create assessment reminder',
    targetRole: 'Performance Team',
    enabled: true,
    lastTriggered: 'Today · 06:00 (8 Athletes)',
    triggerCount7d: 2,
  },
];

export const INITIAL_AUTOMATION_AUDIT_EVENTS: AIAutomationAuditEvent[] = [
  {
    id: 'auto-aud-01',
    ruleId: 'rule-01',
    trigger: 'Readiness < 65',
    dataUsed: ['Readiness 62', 'Recovery 64%', 'Load 742 AU'],
    recommendation: 'Review training exposure',
    humanReviewStatus: 'Awaiting Coach Review',
    action: 'Flagged in AI Action Centre (#ai-act-01)',
    timestamp: 'Today · 08:15',
    athleteName: 'Arjun Mehta',
  },
  {
    id: 'auto-aud-02',
    ruleId: 'rule-02',
    trigger: 'Training load > threshold AND Medical restriction exists',
    dataUsed: ['Acute Load +22%', 'Stage 3/5 Hamstring Restriction', 'Max Sprint Cap 85%'],
    recommendation: 'Replace 6 × 30m sprint with 4 × 20m controlled acceleration',
    humanReviewStatus: 'Pending Performance Director / Coach Approval',
    action: 'Proposed Training Modification Staged',
    timestamp: 'Today · 08:16',
    athleteName: 'Arjun Mehta',
  },
  {
    id: 'auto-aud-03',
    ruleId: 'rule-03',
    trigger: 'Assessment deadline approaching (30 Sep) AND Test incomplete',
    dataUsed: ['Completion 94%', '8 Athletes Pending Mobility & Squat Tests'],
    recommendation: 'Schedule field testing completion block',
    humanReviewStatus: 'Awaiting Performance Team',
    action: 'Created Assessment Reminder Task',
    timestamp: 'Today · 07:50',
    athleteName: 'Senior & U23 Squad (8 Athletes)',
  },
];

export const INITIAL_AI_AUDIT_TRAIL: AIAuditTrailRecord[] = [
  {
    id: 'aiaud-01',
    query: 'Automated Morning Risk Scan (Senior Squad)',
    recommendation: "Modify Arjun's session (6 × 30m sprint → 4 × 20m controlled acceleration)",
    evidenceAccessed: [
      'Training Load (+22% acute)',
      'HRV (-14% rMSSD)',
      'Sleep (-11%)',
      'Medical Register (Hamstring Stage 3/5)',
    ],
    reviewedBy: 'Vikram Sharma',
    reviewerRole: 'Coach',
    decision: 'Approved',
    actionTaken: 'Training session modified',
    timestamp: '10:42',
    safetyClass: 'CONSEQUENTIAL',
  },
  {
    id: 'aiaud-02',
    query: 'Why is Arjun restricted?',
    recommendation: 'Review training assignments against the current medical restriction.',
    evidenceAccessed: [
      'Medical Clearance Status (Restricted)',
      'RTP Stage 3/5',
      'Pain Score (3/10)',
    ],
    reviewedBy: 'Dr. Ananya Rao',
    reviewerRole: 'Physiotherapist',
    decision: 'Advisory Reviewed',
    actionTaken: 'Verified 85% Vmax sprint ceiling on pitch worksheet',
    timestamp: '09:18',
    safetyClass: 'INFORMATIONAL',
  },
  {
    id: 'aiaud-03',
    query: 'Identify athletes with declining nutrition compliance',
    recommendation: 'Adjust Arjun Mehta post-training electrolyte & carb intake (+600ml isotonic)',
    evidenceAccessed: [
      'Hydration Log (2.8L / 3.5L · 74%)',
      'Plan Compliance (82%)',
      'Acute Workload (+22%)',
    ],
    reviewedBy: 'Meera Krishnan',
    reviewerRole: 'Nutritionist',
    decision: 'Approved',
    actionTaken: 'Updated post-training hydration protocol',
    timestamp: 'Yesterday · 17:45',
    safetyClass: 'RECOMMENDATION',
  },
];

export const INITIAL_COPILOT_MESSAGES: AICopilotMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'ai',
    timestamp: '08:00',
    answerTitle: 'USI OPERATIONAL COPILOT READY',
    answerStatement:
      'Connected to Federation → Sport → Program → Squad → Athlete telemetry. I can analyze multi-domain signals, explain readiness and workload shifts, and stage operational actions for your review and approval.',
    confidence: 'High',
    safetyClass: 'INFORMATIONAL',
    evidenceSummary: [
      { label: 'Active Athletes', value: '184 (162 Active)', tone: 'sky' },
      { label: 'Squad Mean Readiness', value: '78% (↓ 5% 7d)', tone: 'amber' },
      { label: 'Elevated Risk Signals', value: '3 Athletes Flagged', tone: 'rose' },
      { label: 'Active Injuries', value: '4 Cases (68% Avg Rehab)', tone: 'amber' },
    ],
    interpretation:
      'Senior Squad readiness has declined 5% over the last 7 days driven by increased acute workload (+18%) and 3 athletes showing simultaneous recovery suppression.',
    recommendation:
      'Review the 3 athletes showing elevated injury-risk patterns or inspect tomorrow’s high-intensity training modifications.',
    actions: [
      {
        id: 'act-init-mod',
        label: 'Review Proposed Changes',
        safetyClass: 'CONSEQUENTIAL',
        actionType: 'open-training-mod-modal',
      },
      {
        id: 'act-init-arjun',
        label: 'Review Athlete (Arjun Mehta)',
        safetyClass: 'INFORMATIONAL',
        actionType: 'open-athlete-360',
        targetAthleteId: 'ath-arjun-mehta',
      },
      {
        id: 'act-init-risk',
        label: 'Open AI Risk Centre',
        safetyClass: 'INFORMATIONAL',
        actionType: 'open-risk-centre',
      },
    ],
    followUpSuggestions: [
      'Why is his readiness low?',
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      'Show me athletes with high workload and declining recovery.',
      'Why is Arjun restricted?',
    ],
  },
];

export function buildDynamicEvidenceBundle(
  athlete: Athlete
): AIEvidenceBundle {
  if (athlete.id === 'ath-arjun-mehta' && athlete.readiness === 62) {
    return ARJUN_EVIDENCE_BUNDLE;
  }
  const loadDeltaPct =
    athlete.chronicLoadAu > 0
      ? Math.round(
          ((athlete.acuteLoadAu - athlete.chronicLoadAu) /
            athlete.chronicLoadAu) *
            100
        )
      : 0;
  const hrvDeltaPct =
    athlete.hrvBaselineMs > 0
      ? Math.round(
          ((athlete.hrvMs - athlete.hrvBaselineMs) / athlete.hrvBaselineMs) *
            100
        )
      : 0;

  return {
    id: `ev-${athlete.id}-${Date.now()}`,
    title: `${athlete.name} — Multi-Factor Readiness & Telemetry Evidence`,
    subjectLabel: `${athlete.name} (${athlete.athleteId}) · ${athlete.sport} · ${athlete.squad}`,
    confidence: 'High',
    generatedAt: `Updated ${athlete.lastUpdated}`,
    metrics: [
      {
        domain: 'Training',
        label: 'Acute Workload vs Chronic',
        deltaOrValue: `${loadDeltaPct >= 0 ? '+' : ''}${loadDeltaPct}% acute load`,
        detail: `${athlete.acuteLoadAu} AU acute vs ${athlete.chronicLoadAu} AU chronic baseline (ACWR ${athlete.acwr.toFixed(2)})`,
        tone: athlete.acwr > 1.2 ? 'rose' : athlete.acwr > 1.08 ? 'amber' : 'emerald',
      },
      {
        domain: 'Recovery',
        label: 'Composite Recovery Index',
        deltaOrValue: `${athlete.recovery}%`,
        detail: `Readiness ${athlete.readiness}/100 (${athlete.readinessDelta >= 0 ? '+' : ''}${athlete.readinessDelta} delta)`,
        tone: athlete.recovery < 68 ? 'rose' : athlete.recovery < 78 ? 'amber' : 'emerald',
      },
      {
        domain: 'HRV',
        label: 'Morning HRV (rMSSD)',
        deltaOrValue: `${hrvDeltaPct >= 0 ? '+' : ''}${hrvDeltaPct}%`,
        detail: `${athlete.hrvMs} ms today vs ${athlete.hrvBaselineMs} ms individual baseline`,
        tone: hrvDeltaPct <= -10 ? 'rose' : hrvDeltaPct < 0 ? 'amber' : 'emerald',
      },
      {
        domain: 'Sleep',
        label: 'Sleep & Subjective Soreness',
        deltaOrValue: `${athlete.sleepFormatted} · Soreness ${athlete.sorenessScore}/10`,
        detail: `Wellness score ${athlete.wellnessScore}/10 · Status: ${athlete.status}`,
        tone: athlete.sorenessScore >= 5 ? 'rose' : athlete.sorenessScore >= 3 ? 'amber' : 'emerald',
      },
      {
        domain: 'Medical',
        label: 'Active Medical Context',
        deltaOrValue: `Clearance: ${athlete.medicalStatus}`,
        detail: athlete.medicalNote || 'No active clinical restrictions recorded.',
        tone:
          athlete.medicalStatus === 'Cleared'
            ? 'emerald'
            : athlete.medicalStatus === 'Restricted'
              ? 'rose'
              : 'amber',
      },
      {
        domain: 'Nutrition',
        label: 'Hydration & Fueling Compliance',
        deltaOrValue: `Hydration: ${athlete.hydrationStatus}`,
        detail: `Nutrition plan adherence: ${athlete.nutritionCompliancePct}%`,
        tone:
          athlete.hydrationStatus === 'Optimal'
            ? 'emerald'
            : athlete.hydrationStatus === 'Monitor'
              ? 'amber'
              : 'rose',
      },
    ],
    clinicalDisclaimer:
      'Advisory Intelligence Only: USI AI synthesizes cross-module telemetry to assist sports professionals. AI cannot independently diagnose, clear, or override clinical medical decisions.',
  };
}

/**
 * Deterministic, context-aware, role-aware & session-memory-aware AI reasoning generator
 */
export function buildCopilotResponse(
  rawQuery: string,
  context: {
    athlete: Athlete;
    allAthletes?: Athlete[];
    squad: string;
    sport: string;
    role: UserRole;
    moduleName: string;
    lastFilterTopic?: 'low-readiness' | 'senior-low-readiness' | null;
  }
): {
  message: AICopilotMessage;
  nextFilterTopic: 'low-readiness' | 'senior-low-readiness' | null;
} {
  const q = rawQuery.trim().toLowerCase();
  const nowTime = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const activeAth = context.athlete;
  const activeBundle = buildDynamicEvidenceBundle(activeAth);
  const roster = context.allAthletes || [];

  // 1. UNCERTAINTY / ERROR STATE (Section 27)
  if (
    q.includes('predict') ||
    q.includes('next month') ||
    q.includes('future injury') ||
    q.includes('will be injured')
  ) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'INSUFFICIENT VALIDATED DATA FOR LONG-HORIZON PREDICTION',
        answerStatement:
          'USI does not have sufficient validated data to make a reliable injury prediction.',
        confidence: 'Low',
        safetyClass: 'INFORMATIONAL',
        isUncertaintyState: true,
        uncertaintyAlternative:
          'Available alternative: I can identify current elevated-risk signals based on workload, recovery and medical context.',
        interpretation:
          'Predicting exact future injury events 30 days ahead carries high false-positive variance. USI restricts AI outputs to validated acute-to-chronic workload, autonomic recovery, and clinical restriction telemetry.',
        recommendation:
          'Review current elevated-risk signals across acute workload, HRV suppression, and active rehabilitation stages.',
        actions: [
          {
            id: `act-unc-${Date.now()}`,
            label: 'Show Risk Signals',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-risk-centre',
          },
        ],
        followUpSuggestions: [
          'Show athletes at elevated injury risk',
          'Show me athletes with high workload and declining recovery.',
        ],
      },
    };
  }

  // 2. SESSION CONVERSATION MEMORY FLOW (Section 26)
  // Step A: "Show athletes with low readiness" or "/readiness"
  if (
    q === '/readiness' ||
    (q.includes('low readiness') && !q.includes('senior')) ||
    q === 'show readiness issues'
  ) {
    return {
      nextFilterTopic: 'low-readiness',
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'LOW READINESS COHORT (FEDERATION-WIDE)',
        answerStatement:
          '12 athletes across the federation currently have readiness below the 68 threshold (4 in Senior Squad, 3 in U23, 5 in Academy/Athletics).',
        confidence: 'High',
        safetyClass: 'INFORMATIONAL',
        evidenceSummary: [
          { label: 'Total Low Readiness', value: '12 Athletes', tone: 'amber' },
          { label: 'Senior Squad', value: '4 Athletes', tone: 'rose' },
          { label: 'U23 Squad', value: '3 Athletes', tone: 'amber' },
          { label: 'Mean Readiness (Flagged)', value: '61.8', tone: 'rose' },
        ],
        tableHeaders: ['Athlete', 'Squad', 'Readiness', 'Recovery Change', 'Risk'],
        tableRows: [
          {
            id: 'lr-1',
            athleteId: 'ath-arjun-mehta',
            athleteName: 'Arjun Mehta',
            squad: 'Senior Squad',
            col1Label: 'Readiness',
            col1Value: '62',
            col2Label: 'Recovery',
            col2Value: '-8%',
            riskOrStatus: 'High',
            riskTone: 'rose',
          },
          {
            id: 'lr-2',
            athleteId: 'ath-vikram-nair',
            athleteName: 'Vikramaditya Nair',
            squad: 'Senior Squad',
            col1Label: 'Readiness',
            col1Value: '59',
            col2Label: 'Recovery',
            col2Value: '-12%',
            riskOrStatus: 'High',
            riskTone: 'rose',
          },
          {
            id: 'lr-3',
            athleteId: 'ath-devansh-kulkarni',
            athleteName: 'Devansh Kulkarni',
            squad: 'Senior Squad',
            col1Label: 'Readiness',
            col1Value: '66',
            col2Label: 'Recovery',
            col2Value: '-6%',
            riskOrStatus: 'Moderate',
            riskTone: 'amber',
          },
          {
            id: 'lr-4',
            athleteId: 'ath-kabir-rao',
            athleteName: 'Kabir Rao',
            squad: 'U23',
            col1Label: 'Readiness',
            col1Value: '67',
            col2Label: 'Recovery',
            col2Value: '-7%',
            riskOrStatus: 'Moderate',
            riskTone: 'amber',
          },
        ],
        evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
        interpretation:
          'Session memory active: You can narrow this cohort by asking "Only Senior Squad." or "Which of them are injured?"',
        recommendation:
          'Filter to Senior Squad to review tomorrow’s high-intensity training assignments.',
        actions: [
          {
            id: `act-lr-${Date.now()}`,
            label: 'Review Athlete',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-athlete-360',
            targetAthleteId: 'ath-arjun-mehta',
          },
          {
            id: `act-lr-tr-${Date.now()}`,
            label: 'Review Training',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-training-module',
          },
        ],
        followUpSuggestions: [
          'Only Senior Squad.',
          'Which of them are injured?',
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
        ],
      },
    };
  }

  // Step B in Session Memory: "Only Senior Squad."
  if (q.includes('only senior squad') || q === 'senior squad only') {
    return {
      nextFilterTopic: 'senior-low-readiness',
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'SESSION FILTER APPLIED — SENIOR SQUAD LOW READINESS',
        answerStatement:
          '4 athletes in Senior Squad currently have low readiness (< 68).',
        confidence: 'High',
        safetyClass: 'INFORMATIONAL',
        evidenceSummary: [
          { label: 'Cohort Scope', value: 'Senior Squad (Filtered from 12)', tone: 'sky' },
          { label: 'Matching Athletes', value: '4 Athletes', tone: 'rose' },
        ],
        tableHeaders: ['Athlete', 'Squad', 'Readiness', 'Load Change', 'Risk'],
        tableRows: [
          {
            id: 'slr-1',
            athleteId: 'ath-arjun-mehta',
            athleteName: 'Arjun Mehta',
            squad: 'Senior Squad',
            col1Label: 'Readiness 62',
            col1Value: '62',
            col2Label: 'Load',
            col2Value: '+22%',
            riskOrStatus: 'High (Injured - RTP 3/5)',
            riskTone: 'rose',
          },
          {
            id: 'slr-2',
            athleteId: 'ath-vikram-nair',
            athleteName: 'Vikramaditya Nair',
            squad: 'Senior Squad',
            col1Label: 'Readiness 59',
            col1Value: '59',
            col2Label: 'Load',
            col2Value: '+21%',
            riskOrStatus: 'High',
            riskTone: 'rose',
          },
          {
            id: 'slr-3',
            athleteId: 'ath-devansh-kulkarni',
            athleteName: 'Devansh Kulkarni',
            squad: 'Senior Squad',
            col1Label: 'Readiness 66',
            col1Value: '66',
            col2Label: 'Load',
            col2Value: '+16%',
            riskOrStatus: 'Moderate (Injured - Rehab)',
            riskTone: 'amber',
          },
          {
            id: 'slr-4',
            athleteId: 'ath-rahul-singh',
            athleteName: 'Rahul Singh',
            squad: 'Senior Squad',
            col1Label: 'Readiness 67',
            col1Value: '67',
            col2Label: 'Load',
            col2Value: '+19%',
            riskOrStatus: 'Moderate',
            riskTone: 'amber',
          },
        ],
        evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
        interpretation:
          'Narrowed from 12 federation athletes to the 4 athletes in Senior Squad using session context.',
        recommendation:
          'Ask "Which of them are injured?" or review proposed session modifications for this cohort.',
        actions: [
          {
            id: `act-slr-${Date.now()}`,
            label: 'Review Proposed Changes',
            safetyClass: 'CONSEQUENTIAL',
            actionType: 'open-training-mod-modal',
          },
        ],
        followUpSuggestions: [
          'Which of them are injured?',
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
        ],
      },
    };
  }

  // Step C in Session Memory: "Which of them are injured?"
  if (q.includes('which of them are injured') || q === 'who among them is injured') {
    return {
      nextFilterTopic: 'senior-low-readiness',
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'SESSION FILTER APPLIED — INJURED SENIOR SQUAD ATHLETES',
        answerStatement:
          '2 athletes from the Senior Squad low-readiness group have active registered injuries.',
        confidence: 'High',
        safetyClass: 'INFORMATIONAL',
        evidenceSummary: [
          { label: 'Filtered Cohort', value: '2 Athletes (Senior Squad)', tone: 'rose' },
          { label: 'Medical Status', value: 'Restricted / Active Rehab', tone: 'rose' },
        ],
        tableHeaders: ['Athlete', 'Injury', 'Load', 'Recovery', 'Risk'],
        tableRows: [
          {
            id: 'inj-1',
            athleteId: 'ath-arjun-mehta',
            athleteName: 'Arjun Mehta',
            squad: 'Hamstring (Stage 3/5)',
            col1Label: 'Load',
            col1Value: '+22%',
            col2Label: 'Recovery',
            col2Value: '64%',
            riskOrStatus: 'High',
            riskTone: 'rose',
          },
          {
            id: 'inj-2',
            athleteId: 'ath-devansh-kulkarni',
            athleteName: 'Devansh Kulkarni',
            squad: 'Patellar Tendon (Stage 2/5)',
            col1Label: 'Load',
            col1Value: '+16%',
            col2Label: 'Recovery',
            col2Value: '68%',
            riskOrStatus: 'Moderate',
            riskTone: 'amber',
          },
        ],
        evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
        interpretation:
          'Both Arjun Mehta and Devansh Kulkarni combine active lower-limb rehabilitation with elevated acute workload.',
        recommendation:
          'Modify tomorrow’s high-intensity sprint & deceleration exposure for both athletes.',
        actions: [
          {
            id: `act-inj-open-${Date.now()}`,
            label: 'Open Athlete (Arjun Mehta)',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-athlete-360',
            targetAthleteId: 'ath-arjun-mehta',
          },
          {
            id: `act-inj-mod-${Date.now()}`,
            label: 'Review Proposed Changes',
            safetyClass: 'CONSEQUENTIAL',
            actionType: 'open-training-mod-modal',
          },
        ],
        followUpSuggestions: [
          'Why is Arjun restricted?',
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
        ],
      },
    };
  }

  // 3. CONTEXT-AWARE READINESS EXPLANATION (Sections 3 & 5: "Why is his readiness low?" / "Why is Arjun's readiness low?")
  if (
    q.includes('why is his readiness low') ||
    q.includes("why is arjun's readiness low") ||
    q.includes('why is readiness low') ||
    q.includes("explain today's readiness changes") ||
    q.includes('recovery baseline')
  ) {
    const targetName = activeAth?.name || 'Arjun Mehta';
    const isArjun = activeAth?.id === 'ath-arjun-mehta' && activeAth.readiness === 62;
    const hrvDiffPct =
      activeAth.hrvBaselineMs > 0
        ? Math.round(
            ((activeAth.hrvMs - activeAth.hrvBaselineMs) /
              activeAth.hrvBaselineMs) *
              100
          )
        : -14;
    const loadDiffPct =
      activeAth.chronicLoadAu > 0
        ? Math.round(
            ((activeAth.acuteLoadAu - activeAth.chronicLoadAu) /
              activeAth.chronicLoadAu) *
              100
          )
        : 22;

    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        contextSnapshot: {
          athleteName: targetName,
          sport: context.sport,
          squad: context.squad,
          role: context.role,
          moduleName: context.moduleName,
        },
        answerTitle: `${targetName.toUpperCase()} — READINESS & RECOVERY EXPLANATION`,
        answerStatement: isArjun
          ? 'Readiness declined from 81 → 62 over 7 days.'
          : `${targetName}'s current composite readiness is ${activeAth.readiness}/100 (${activeAth.readinessDelta >= 0 ? '+' : ''}${activeAth.readinessDelta} 7-day shift) with ${activeAth.recovery}% recovery index.`,
        confidence: 'High',
        safetyClass: 'RECOMMENDATION',
        evidenceSummary: isArjun
          ? [
              { label: 'Sleep', value: '↓ 11% (6h 10m avg)', tone: 'amber' },
              { label: 'HRV', value: '↓ 14% (58 ms vs 67 ms)', tone: 'rose' },
              { label: 'Recovery', value: '↓ 8% (64% score)', tone: 'amber' },
              { label: 'Acute Load', value: '↑ 22% (742 AU)', tone: 'rose' },
              { label: 'Recent Hamstring Injury', value: 'Active (Stage 3/5)', tone: 'rose' },
            ]
          : [
              {
                label: 'Sleep',
                value: `${activeAth.sleepFormatted} (Wellness ${activeAth.wellnessScore}/10)`,
                tone: activeAth.sleepHours < 7 ? 'amber' : 'emerald',
              },
              {
                label: 'HRV',
                value: `${hrvDiffPct >= 0 ? '+' : ''}${hrvDiffPct}% (${activeAth.hrvMs} ms vs ${activeAth.hrvBaselineMs} ms)`,
                tone: hrvDiffPct < -8 ? 'rose' : hrvDiffPct < 0 ? 'amber' : 'emerald',
              },
              {
                label: 'Recovery',
                value: `${activeAth.recovery}% (Soreness ${activeAth.sorenessScore}/10)`,
                tone: activeAth.recovery < 70 ? 'amber' : 'emerald',
              },
              {
                label: 'Acute Load',
                value: `${loadDiffPct >= 0 ? '+' : ''}${loadDiffPct}% (${activeAth.acuteLoadAu} AU · ACWR ${activeAth.acwr.toFixed(2)})`,
                tone: activeAth.acwr > 1.2 ? 'rose' : 'sky',
              },
              {
                label: 'Medical Status',
                value: activeAth.medicalStatus,
                tone:
                  activeAth.medicalStatus === 'Cleared'
                    ? 'emerald'
                    : activeAth.medicalStatus === 'Restricted'
                      ? 'rose'
                      : 'amber',
              },
            ],
        evidenceBundle: activeBundle,
        interpretation: isArjun
          ? 'The decline appears primarily associated with increased workload and reduced recovery indicators.'
          : activeAth.aiSummary,
        recommendation:
          activeAth.readiness < 75
            ? `Review high-intensity exposure for ${targetName} before the next session.`
            : `${targetName} is cleared for prescribed training volume under ${activeAth.coach}.`,
        actions: [
          {
            id: `act-rd-tr-${Date.now()}`,
            label: 'Review Training',
            safetyClass: 'RECOMMENDATION',
            actionType: 'open-training-mod-modal',
          },
          {
            id: `act-rd-ath-${Date.now()}`,
            label: `Open ${targetName} 360`,
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-athlete-360',
            targetAthleteId: activeAth?.id || 'ath-arjun-mehta',
          },
        ],
        followUpSuggestions: [
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
          'Why is Arjun restricted?',
          `Prepare Coach Brief for ${targetName}`,
        ],
      },
    };
  }

  // 4. AI TRAINING ACTION & FLAGSHIP FLOW (Sections 7, 8, 35)
  if (
    q.includes('modify tomorrow') ||
    q.includes('high-intensity session') ||
    q.includes('review high-risk athlete assignments') ||
    q === '/training' ||
    q.includes("summarize today's training risks")
  ) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'AI TRAINING MODIFICATION PROPOSAL — 4 ATHLETES IDENTIFIED',
        answerStatement: 'I identified 4 athletes who may require review before tomorrow’s High-Intensity Tactical & Sprint Session.',
        confidence: 'High',
        safetyClass: 'CONSEQUENTIAL',
        evidenceSummary: [
          { label: 'Flagged Athletes', value: '4 Athletes', tone: 'rose' },
          { label: 'Projected Load Reduction', value: '-90 to -160 AU', tone: 'emerald' },
          { label: 'Approval Required', value: `${context.role} / Coach`, tone: 'amber' },
        ],
        tableHeaders: ['Athlete', 'Squad', 'Load Change', 'Readiness', 'Risk'],
        tableRows: [
          {
            id: 'tm-1',
            athleteId: 'ath-arjun-mehta',
            athleteName: 'Arjun Mehta',
            squad: 'Senior Squad',
            col1Label: 'Load',
            col1Value: '+22%',
            col2Label: 'Readiness',
            col2Value: '62',
            riskOrStatus: 'High Risk',
            riskTone: 'rose',
          },
          {
            id: 'tm-2',
            athleteId: 'ath-kabir-rao',
            athleteName: 'Kabir Rao',
            squad: 'U23',
            col1Label: 'Load',
            col1Value: '+18%',
            col2Label: 'Readiness',
            col2Value: '71',
            riskOrStatus: 'Moderate Risk',
            riskTone: 'amber',
          },
          {
            id: 'tm-3',
            athleteId: 'ath-vikram-nair',
            athleteName: 'Vikramaditya Nair',
            squad: 'Senior Squad',
            col1Label: 'Load',
            col1Value: '+21%',
            col2Label: 'Readiness',
            col2Value: '59',
            riskOrStatus: 'High Risk',
            riskTone: 'rose',
          },
          {
            id: 'tm-4',
            athleteId: 'ath-devansh-kulkarni',
            athleteName: 'Devansh Kulkarni',
            squad: 'Senior Squad',
            col1Label: 'Load',
            col1Value: '+16%',
            col2Label: 'Readiness',
            col2Value: '66',
            riskOrStatus: 'Moderate Risk',
            riskTone: 'amber',
          },
        ],
        evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
        interpretation:
          'Exposing these 4 athletes to tomorrow’s scheduled 6 × 30m maximal sprint block exceeds their current acute-to-chronic workload and clinical RTP ceilings.',
        recommendation:
          'Reduce high-intensity exposure for flagged athletes (e.g. Arjun: 6 × 30m sprint → 4 × 20m controlled acceleration; Kabir: 6 × 30m sprint → 5 × 20m acceleration).',
        actions: [
          {
            id: `act-mod-${Date.now()}`,
            label: 'Review Proposed Changes',
            safetyClass: 'CONSEQUENTIAL',
            actionType: 'open-training-mod-modal',
          },
          {
            id: `act-tr-${Date.now()}`,
            label: 'Review Training',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-training-module',
          },
        ],
        followUpSuggestions: [
          'Why is Arjun restricted?',
          'Give me a performance overview of the federation.',
        ],
      },
    };
  }

  // 5. AI MEDICAL CONTEXT (Section 11: "Why is Arjun restricted?" / "/injuries" / "Summarize active rehabilitation cases.")
  if (
    q.includes('why is arjun restricted') ||
    q.includes('why is he restricted') ||
    q === '/injuries' ||
    q.includes('rehabilitation cases') ||
    q.includes('who needs rtp review')
  ) {
    const canSeeClinicalNotes =
      context.role === 'Physiotherapist' ||
      context.role === 'Performance Director' ||
      context.role === 'Sports Scientist';

    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'ADVISORY MEDICAL & RTP CONTEXT — ARJUN MEHTA',
        answerStatement:
          'Medical status: Restricted (Active hamstring injury · RTP Stage 3/5 · Medical clearance pending).',
        confidence: 'High',
        safetyClass: 'INFORMATIONAL',
        evidenceSummary: [
          { label: 'Active Injury', value: 'Left Hamstring (Grade 1)', tone: 'rose' },
          { label: 'RTP Progression', value: 'Stage 3/5 (68%)', tone: 'amber' },
          { label: 'Reported Pain', value: '3/10', tone: 'amber' },
          { label: 'Clearance Status', value: 'Medical clearance pending', tone: 'rose' },
          {
            label: 'Operational Restriction',
            value: 'Maximal sprinting restricted (≤85% Vmax)',
            tone: 'amber',
          },
        ],
        evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
        interpretation: canSeeClinicalNotes
          ? 'Arjun is progressing through Stage 3 Sport-Specific Training with 88% eccentric strength symmetry (gate target ≥ 90%). Clinical notes remain restricted to authorized medical & performance leadership.'
          : 'Arjun is in Stage 3/5 Return-to-Play with maximal sprinting restricted. Detailed clinical physiotherapy notes are restricted for your current role.',
        recommendation:
          'Review training assignments against the current medical restriction. (Note: AI is advisory only and cannot independently diagnose, clear, or override medical decisions.)',
        actions: [
          {
            id: `act-med-mod-${Date.now()}`,
            label: 'Review Proposed Changes',
            safetyClass: 'CONSEQUENTIAL',
            actionType: 'open-training-mod-modal',
          },
          {
            id: `act-med-open-${Date.now()}`,
            label: 'Review Medical & RTP',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-medical-module',
          },
        ],
        followUpSuggestions: [
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
          'Why is his readiness low?',
        ],
      },
    };
  }

  // 6. NATURAL LANGUAGE QUERY: HIGH WORKLOAD & DECLINING RECOVERY (Sections 4, 14, 15, 35)
  if (
    q === '/risk' ||
    q.includes('high workload') ||
    q.includes('declining recovery') ||
    q.includes('elevated injury risk') ||
    q.includes('why are these athletes at risk') ||
    q.includes('workload increased') ||
    q.includes('active injury, elevated workload') ||
    q.includes('who needs attention today') ||
    q.includes('which athletes need follow-up')
  ) {
    const isCrossModuleInjuryQuery = q.includes('active injury');
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: isCrossModuleInjuryQuery
          ? 'CROSS-MODULE QUERY: MEDICAL + TRAINING + SPORTS SCIENCE'
          : `MULTI-FACTOR RISK COHORT (${context.role.toUpperCase()} VIEW)`,
        answerStatement: isCrossModuleInjuryQuery
          ? 'I combined Medical, Training, and Sports Science telemetry and found 3 athletes with active injury/restriction, elevated workload, and depressed recovery.'
          : 'I found 6 athletes matching high workload (+16% to +24%) and declining recovery (-6% to -12%) conditions.',
        confidence: 'High',
        safetyClass: 'RECOMMENDATION',
        evidenceSummary: [
          { label: 'Matched Athletes', value: isCrossModuleInjuryQuery ? '3 Athletes' : '6 Athletes', tone: 'rose' },
          { label: 'Mean Load Spike', value: '+20.4%', tone: 'rose' },
          { label: 'Mean Recovery Shift', value: '-8.6%', tone: 'amber' },
          { label: 'Role Focus', value: context.role, tone: 'sky' },
        ],
        tableHeaders: isCrossModuleInjuryQuery
          ? ['Athlete', 'Injury', 'Load', 'Recovery', 'Risk']
          : ['Athlete', 'Squad', 'Load Change', 'Recovery Change', 'Risk'],
        tableRows: isCrossModuleInjuryQuery
          ? [
              {
                id: 'cm-1',
                athleteId: 'ath-arjun-mehta',
                athleteName: 'Arjun Mehta',
                squad: 'Hamstring (Stage 3/5)',
                col1Label: 'Load',
                col1Value: '+22%',
                col2Label: 'Recovery',
                col2Value: '64%',
                riskOrStatus: 'High',
                riskTone: 'rose',
              },
              {
                id: 'cm-2',
                athleteId: 'ath-kabir-rao',
                athleteName: 'Kabir Rao',
                squad: 'Shoulder AC Joint (Stage 2/5)',
                col1Label: 'Load',
                col1Value: '+24%',
                col2Label: 'Recovery',
                col2Value: '69%',
                riskOrStatus: 'Moderate',
                riskTone: 'amber',
              },
              {
                id: 'cm-3',
                athleteId: 'ath-devansh-kulkarni',
                athleteName: 'Devansh Kulkarni',
                squad: 'Patellar Tendon (Stage 2/5)',
                col1Label: 'Load',
                col1Value: '+16%',
                col2Label: 'Recovery',
                col2Value: '68%',
                riskOrStatus: 'Moderate',
                riskTone: 'amber',
              },
            ]
          : [
              {
                id: 'hw-1',
                athleteId: 'ath-arjun-mehta',
                athleteName: 'Arjun Mehta',
                squad: 'Senior',
                col1Label: 'Load Change',
                col1Value: '+22%',
                col2Label: 'Recovery Change',
                col2Value: '-8%',
                riskOrStatus: 'High',
                riskTone: 'rose',
              },
              {
                id: 'hw-2',
                athleteId: 'ath-rahul-singh',
                athleteName: 'Rahul Singh',
                squad: 'Senior',
                col1Label: 'Load Change',
                col1Value: '+19%',
                col2Label: 'Recovery Change',
                col2Value: '-11%',
                riskOrStatus: 'Moderate',
                riskTone: 'amber',
              },
              {
                id: 'hw-3',
                athleteId: 'ath-kabir-rao',
                athleteName: 'Kabir Rao',
                squad: 'U23',
                col1Label: 'Load Change',
                col1Value: '+24%',
                col2Label: 'Recovery Change',
                col2Value: '-7%',
                riskOrStatus: 'Moderate',
                riskTone: 'amber',
              },
              {
                id: 'hw-4',
                athleteId: 'ath-vikram-nair',
                athleteName: 'Vikramaditya Nair',
                squad: 'Senior',
                col1Label: 'Load Change',
                col1Value: '+21%',
                col2Label: 'Recovery Change',
                col2Value: '-12%',
                riskOrStatus: 'High',
                riskTone: 'rose',
              },
              {
                id: 'hw-5',
                athleteId: 'ath-devansh-kulkarni',
                athleteName: 'Devansh Kulkarni',
                squad: 'Senior',
                col1Label: 'Load Change',
                col1Value: '+16%',
                col2Label: 'Recovery Change',
                col2Value: '-6%',
                riskOrStatus: 'Moderate',
                riskTone: 'amber',
              },
              {
                id: 'hw-6',
                athleteId: 'ath-rohan-deshmukh',
                athleteName: 'Rohan Deshmukh',
                squad: 'U23',
                col1Label: 'Load Change',
                col1Value: '+17%',
                col2Label: 'Recovery Change',
                col2Value: '-6%',
                riskOrStatus: 'Moderate',
                riskTone: 'amber',
              },
            ],
        evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
        interpretation:
          'Simultaneous acute workload spikes (>15%) and autonomic recovery suppression (-6% to -12%) elevate soft-tissue overload risk ahead of tomorrow’s high-intensity session.',
        recommendation:
          'Review proposed training modifications for tomorrow’s session to cap high-speed running exposure.',
        actions: [
          {
            id: `act-hw-ath-${Date.now()}`,
            label: 'Review Athlete',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-athlete-360',
            targetAthleteId: 'ath-arjun-mehta',
          },
          {
            id: `act-hw-tr-${Date.now()}`,
            label: 'Review Training',
            safetyClass: 'CONSEQUENTIAL',
            actionType: 'open-training-mod-modal',
          },
          {
            id: `act-hw-rk-${Date.now()}`,
            label: 'Review Risk',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-risk-centre',
          },
        ],
        followUpSuggestions: [
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
          'Why is Arjun restricted?',
          'Why is his readiness low?',
        ],
      },
    };
  }

  // 7. FEDERATION-LEVEL QUESTION (Section 16: "Give me a performance overview of the federation." / "Why has squad readiness declined?")
  if (
    q.includes('federation') ||
    q.includes('why has squad readiness declined') ||
    q.includes('how is the senior squad performing') ||
    q.includes('compare senior squad readiness') ||
    q.includes('largest changes this week') ||
    q.includes('lowest readiness')
  ) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'FEDERATION PERFORMANCE SUMMARY',
        answerStatement:
          'Federation-wide readiness averages 78% across 184 athletes (Senior Squad 78%, U23 Squad 81%). Readiness declined 3% federation-wide (5% in Senior Squad) over the last 7 days.',
        confidence: 'High',
        safetyClass: 'INFORMATIONAL',
        evidenceSummary: [
          { label: 'Athletes', value: '184', tone: 'sky' },
          { label: 'Average Readiness', value: '78% (↓ 3% 7d)', tone: 'amber' },
          { label: 'Active Injuries', value: '4', tone: 'rose' },
          { label: 'Training Compliance', value: '94%', tone: 'emerald' },
          { label: 'Assessment Completion', value: '91%', tone: 'sky' },
          { label: 'Nutrition Compliance', value: '84%', tone: 'emerald' },
        ],
        evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
        interpretation:
          'Key Signals: (1) Readiness declined 3% over the last 7 days (Senior Squad declined 5% from 83% → 78%). (2) 12 athletes have elevated workload. (3) 18 athletes require operational attention.',
        recommendation:
          'Inspect squad-level workload distribution in Analytics or review the 4 Senior Squad athletes flagged for training modification.',
        actions: [
          {
            id: `act-fed-an-${Date.now()}`,
            label: 'Open Analytics',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-analytics-module',
          },
          {
            id: `act-fed-mod-${Date.now()}`,
            label: 'Review Proposed Changes',
            safetyClass: 'CONSEQUENTIAL',
            actionType: 'open-training-mod-modal',
          },
        ],
        followUpSuggestions: [
          'Prepare a weekly performance report for the Senior Squad.',
          'Show me athletes with high workload and declining recovery.',
        ],
      },
    };
  }

  // 8. AI REPORT GENERATION (Section 17: "Prepare a weekly performance report for the Senior Squad" / "/report")
  if (q === '/report' || q.includes('report')) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'WEEKLY PERFORMANCE REPORT — SENIOR SQUAD',
        answerStatement:
          'Compiled multi-domain weekly performance report for Football · Senior Squad (n = 42 athletes) using live prototype telemetry.',
        confidence: 'High',
        safetyClass: 'INFORMATIONAL',
        generatedReportPreview: {
          title: 'WEEKLY PERFORMANCE REPORT — FOOTBALL SENIOR SQUAD',
          scope: 'National Sports Federation · Football · Senior Squad · Week 39 (22–28 Sep 2026)',
          executiveSummary:
            'Senior Squad completed 94% of planned training volume during MD-3 competition build-up. Mean readiness shifted from 83% → 78% (-5%) due to accumulated high-speed running load.',
          sections: [
            {
              heading: 'Readiness',
              summary:
                'Mean squad readiness 78%. 64% Ready, 22% Monitor, 9% Restricted, 5% Unavailable. 4 athletes below 68 threshold.',
            },
            {
              heading: 'Training',
              summary:
                '94% compliance. Weekly squad acute load averaged 685 AU (+18% vs prior week). 4 athletes staged for sprint volume modification tomorrow.',
            },
            {
              heading: 'Medical',
              summary:
                '4 active federation injuries (68% avg rehab progress). Arjun Mehta in Stage 3/5 hamstring RTP (Pain 3/10, 88% strength symmetry).',
            },
            {
              heading: 'Sports Science',
              summary:
                '3 athletes exhibit HRV rMSSD suppression >12% (Arjun Mehta -14%, Vikramaditya Nair -13%, Rahul Singh -11%).',
            },
            {
              heading: 'Nutrition',
              summary:
                '84% plan compliance, 76% hydration compliance, 91% supplement compliance. Arjun Mehta flagged for low hydration (74%).',
            },
            {
              heading: 'Assessments',
              summary:
                '94% football assessment completion (8 athletes pending Mobility Screen & Squat Strength). Arjun Mehta 30m sprint improved 3% to 4.21s.',
            },
          ],
          keyRisks: [
            'Arjun Mehta: High injury risk (Workload +22%, Recovery -8%, Stage 3/5 Hamstring)',
            'Vikramaditya Nair: Neuromuscular fatigue & readiness 59',
            '8 athletes pending September assessment cycle completion before 30 Sep',
          ],
          recommendedActions: [
            'Approve proposed sprint modifications for Arjun Mehta, Kabir Rao, Vikramaditya Nair, and Devansh Kulkarni',
            'Increase post-session electrolyte intake for athletes below 78% hydration compliance',
            'Complete remaining 8 physical assessments by Thursday',
          ],
        },
        interpretation:
          'All report sections are populated directly from connected Training, Medical, Sports Science, Nutrition, and Assessments records.',
        recommendation:
          'Review, edit, or export this report to PDF/Excel for the Performance Director briefing.',
        actions: [
          {
            id: `act-rep-exp-${Date.now()}`,
            label: 'Export / Edit Report in Analytics',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-analytics-module',
          },
        ],
        followUpSuggestions: [
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
          'Show athletes at elevated injury risk',
        ],
      },
    };
  }

  // 9. ASSESSMENTS / BENCHMARKS / NUTRITION QUERIES
  if (
    q === '/assessments' ||
    q.includes('assessment') ||
    q.includes('benchmark') ||
    q.includes('compliance')
  ) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'ASSESSMENT & NUTRITION COMPLIANCE ANALYSIS',
        answerStatement:
          'Football assessment completion is at 94% (8 athletes pending). Nutrition plan compliance is at 84% with 12 athletes requiring hydration review.',
        confidence: 'High',
        safetyClass: 'RECOMMENDATION',
        evidenceSummary: [
          { label: 'Assessment Completion', value: '94% (8 Pending)', tone: 'sky' },
          { label: 'Arjun 30m Sprint', value: '4.21s (Improved +3%)', tone: 'emerald' },
          { label: 'Nutrition Compliance', value: '84% Squad Mean', tone: 'emerald' },
          { label: 'Hydration Compliance', value: '76% (12 Low)', tone: 'amber' },
        ],
        evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
        interpretation:
          'Arjun Mehta exceeds the Senior Squad 30m Sprint benchmark (4.21s vs 4.25s) and CMJ benchmark (48 cm vs 46 cm), while Kabir Rao is 0.04s below the Senior 30m Sprint benchmark.',
        recommendation:
          'Schedule the 8 pending athletes for Mobility Screen & Squat Strength before 30 Sep.',
        actions: [
          {
            id: `act-ass-open-${Date.now()}`,
            label: 'Open Assessments & TID',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-assessments-module',
          },
        ],
        followUpSuggestions: [
          'Give me a performance overview of the federation.',
          'Show athletes at elevated injury risk',
        ],
      },
    };
  }

  // DEFAULT CONTEXTUAL INTELLIGENCE RESPONSE
  const loadDiff =
    activeAth.chronicLoadAu > 0
      ? Math.round(
          ((activeAth.acuteLoadAu - activeAth.chronicLoadAu) /
            activeAth.chronicLoadAu) *
            100
        )
      : 0;
  return {
    nextFilterTopic: null,
    message: {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      timestamp: nowTime,
      answerTitle: `OPERATIONAL ANALYSIS — ${activeAth.name.toUpperCase()} & ${context.squad.toUpperCase()}`,
      answerStatement: `Analyzed "${rawQuery}" across ${context.sport} · ${context.squad} under ${context.role} permissions. ${activeAth.name} is currently at Readiness ${activeAth.readiness}/100 (${activeAth.injuryRisk} Risk) with acute load ${loadDiff >= 0 ? '+' : ''}${loadDiff}% (${activeAth.acuteLoadAu} AU) and medical clearance ${activeAth.medicalStatus}.`,
      confidence: 'High',
      safetyClass: 'RECOMMENDATION',
      evidenceSummary: [
        {
          label: 'Current Athlete',
          value: `${activeAth.name} (Readiness ${activeAth.readiness})`,
          tone: activeAth.readiness < 70 ? 'rose' : activeAth.readiness < 80 ? 'amber' : 'emerald',
        },
        {
          label: 'Workload Delta',
          value: `${loadDiff >= 0 ? '+' : ''}${loadDiff}% (${activeAth.acuteLoadAu} AU)`,
          tone: activeAth.acwr > 1.2 ? 'rose' : 'sky',
        },
        {
          label: 'Medical Status',
          value: `${activeAth.medicalStatus} (${activeAth.trainingStatus})`,
          tone:
            activeAth.medicalStatus === 'Cleared'
              ? 'emerald'
              : activeAth.medicalStatus === 'Restricted'
                ? 'rose'
                : 'amber',
        },
        { label: 'Active Role Lens', value: context.role, tone: 'sky' },
      ],
      evidenceBundle: activeBundle,
      interpretation: activeAth.aiSummary,
      recommendation:
        activeAth.readiness < 75 || activeAth.medicalStatus !== 'Cleared'
          ? `Review proposed training modifications for ${activeAth.name} or inspect full clinical and physiological evidence.`
          : `${activeAth.name} is operating within target workload and readiness thresholds (${activeAth.nutritionCompliancePct}% nutrition adherence).`,
      actions: [
        {
          id: `act-def-mod-${Date.now()}`,
          label: 'Review Proposed Changes',
          safetyClass: 'CONSEQUENTIAL',
          actionType: 'open-training-mod-modal',
        },
        {
          id: `act-def-ath-${Date.now()}`,
          label: `Review ${activeAth.name} 360`,
          safetyClass: 'INFORMATIONAL',
          actionType: 'open-athlete-360',
          targetAthleteId: activeAth.id,
        },
      ],
      followUpSuggestions: [
        'Why is his readiness low?',
        "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
        'Show me athletes with high workload and declining recovery.',
      ],
    },
  };
}

export const AI_COPILOT_PROMPT_CHIPS: string[] = [
  'Why is his readiness low?',
  "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
  'Show me athletes with high workload and declining recovery.',
  'Why is Arjun restricted?',
  'Show athletes with low readiness.',
  'Give me a performance overview of the federation.',
  'Prepare a weekly performance report for the Senior Squad.',
  'Show athletes with active injury, elevated workload, and declining recovery.',
];

export const AI_SLASH_COMMANDS: {
  command: string;
  label: string;
  sampleQuery: string;
}[] = [
  {
    command: '/athlete',
    label: 'Explain Active Athlete Readiness',
    sampleQuery: 'Why is his readiness low?',
  },
  {
    command: '/squad',
    label: 'Squad Performance & Readiness Overview',
    sampleQuery: 'Give me a performance overview of the federation.',
  },
  {
    command: '/risk',
    label: 'High Workload & Declining Recovery Cohort',
    sampleQuery: 'Show me athletes with high workload and declining recovery.',
  },
  {
    command: '/readiness',
    label: 'Low Readiness Cohort (Multi-Turn Memory)',
    sampleQuery: 'Show athletes with low readiness',
  },
  {
    command: '/training',
    label: 'Review Tomorrow High-Intensity Session Modifications',
    sampleQuery:
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
  },
  {
    command: '/injuries',
    label: 'Medical & Return-to-Play Context',
    sampleQuery: 'Why is Arjun restricted?',
  },
  {
    command: '/assessments',
    label: 'Assessment & Benchmark Compliance',
    sampleQuery: '/assessments',
  },
  {
    command: '/report',
    label: 'Generate Weekly Executive Report',
    sampleQuery: 'Prepare a weekly performance report for the Senior Squad.',
  },
];

export const AI_ROLE_BEHAVIOR_MATRIX: Record<
  UserRole,
  {
    focus: string;
    allowedApprovals: string[];
    restrictedScope: string;
  }
> = {
  'Performance Director': {
    focus:
      'Federation-wide readiness, cross-module injury risk escalation, and high-impact training & RTP governance.',
    allowedApprovals: [
      'Approve multi-athlete training session modifications',
      'Review RTP gate overrides with Medical Lead',
      'Approve federation performance reports & TID escalations',
    ],
    restrictedScope:
      'Cannot independently issue clinical medical diagnoses without Physiotherapist / Medical Officer sign-off.',
  },
  Coach: {
    focus:
      'Daily squad availability, session load modification, tactical exposure ceilings, and individual athlete readiness.',
    allowedApprovals: [
      'Approve proposed training session modifications (-90 to -160 AU)',
      'Adjust pitch drill prescriptions for restricted athletes',
    ],
    restrictedScope:
      'Private clinical diagnostic notes are summarized to functional training restrictions only.',
  },
  'Sports Scientist': {
    focus:
      'Acute-to-chronic workload ratios (ACWR), HRV rMSSD suppression, neuromuscular fatigue, and benchmark testing.',
    allowedApprovals: [
      'Approve workload & recovery monitoring flags',
      'Validate assessment test results & TID weight models',
    ],
    restrictedScope:
      'Cannot clear injured athletes for competition without Medical Lead approval.',
  },
  Physiotherapist: {
    focus:
      'Clinical injury diagnosis, tissue pain progression, rehabilitation adherence, and 5-stage Return-to-Play gates.',
    allowedApprovals: [
      'Approve RTP stage progression & clinical gate criteria',
      'Issue medical restrictions on high-speed running exposure',
    ],
    restrictedScope:
      'Full clinical access enabled. AI remains strictly advisory and never auto-clears athletes.',
  },
  Nutritionist: {
    focus:
      'Caloric & macronutrient periodisation, sweat-rate hydration recovery, and body composition trends.',
    allowedApprovals: [
      'Approve fueling & electrolyte reload adjustments',
      'Modify daily supplementation schedules',
    ],
    restrictedScope:
      'Clinical injury records limited to metabolic and recovery fueling requirements.',
  },
  'Federation Admin': {
    focus:
      'Athlete eligibility verification, document compliance, coach assignments, and governance audit logs.',
    allowedApprovals: [
      'Approve athlete onboarding & verification applications',
      'Audit AI governance logs & role compliance',
    ],
    restrictedScope:
      'Clinical medical notes and tactical session modifications restricted to specialist staff.',
  },
  Athlete: {
    focus:
      'Personal readiness indicators, daily training schedule, recovery metrics, and subjective wellness logs.',
    allowedApprovals: [
      'Submit daily morning wellness survey & RPE scores',
      'Log personal hydration & post-workout nutrition intake',
    ],
    restrictedScope:
      'Restricted to personal biometric records and assigned training plans only.',
  },
  'Operations Team': {
    focus:
      'Facility capacity, pitch surface condition, sports technology calibration, and logistics travel manifests.',
    allowedApprovals: [
      'Confirm pitch & gym maintenance schedules',
      'Sign off on travel manifest & equipment logistics orders',
    ],
    restrictedScope:
      'Medical diagnostics and tactical coach notes restricted to high performance staff.',
  },
};

