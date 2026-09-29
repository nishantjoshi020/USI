import {
  AIActionCentreItem,
  AIActionSafetyClass,
  AIAuditTrailRecord,
  AIAutomationAuditEvent,
  AICopilotActionButton,
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
    recommendation: "Modify Arjun's high-speed sprint prescription",
    detail:
      'Replace 6 × 30m maximal sprint block with 4 × 20m controlled acceleration (≤85% Vmax) due to readiness 62, load +22%, and Stage 3 hamstring restriction.',
    approverRole: 'Awaiting Coach / Performance Director',
    targetRoles: ['Coach', 'Performance Director', 'Sports Scientist', 'Athlete'],
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 08:15',
    evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-02',
    priority: 'High',
    safetyClass: 'CONSEQUENTIAL',
    source: 'AI Medical Risk Monitor',
    affectedAthleteId: 'ath-arjun-mehta',
    affectedAthleteName: 'Arjun Mehta',
    squad: 'Senior Squad',
    recommendation: 'Hold RTP Stage 4 progression until eccentric symmetry ≥ 90%',
    detail:
      'NordBord eccentric hamstring symmetry is at 88% (gate threshold ≥ 90%) with 3/10 morning soreness. Maintain Stage 3 sport-specific cap for 48h and schedule hydrotherapy.',
    approverRole: 'Awaiting Physiotherapist',
    targetRoles: ['Physiotherapist', 'Performance Director', 'Athlete'],
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 08:18',
    evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-03',
    priority: 'Medium',
    safetyClass: 'RECOMMENDATION',
    source: 'AI Workload & Readiness Engine',
    affectedAthleteId: 'ath-kabir-rao',
    affectedAthleteName: 'Kabir Rao & Vikramaditya Nair',
    squad: 'Senior & U23',
    recommendation: 'Apply ACWR & HRV neuromuscular fatigue load cap',
    detail:
      'Vikramaditya Nair (ACWR 1.31, CMJ -6.5%, HRV -13%) and Kabir Rao (ACWR 1.22, Load +18%) exceed acute fatigue thresholds. Cap high-speed running exposure by 20% tomorrow.',
    approverRole: 'Awaiting Sports Scientist',
    targetRoles: ['Sports Scientist', 'Coach', 'Performance Director'],
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 08:22',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-04',
    priority: 'High',
    safetyClass: 'RECOMMENDATION',
    source: 'AI Nutrition Monitor',
    affectedAthleteId: 'ath-arjun-mehta',
    affectedAthleteName: 'Arjun Mehta & Rohan Deshmukh',
    squad: 'Senior & U23',
    recommendation: 'Prescribe +600ml sodium-electrolyte & 1.2g/kg carb reload',
    detail:
      'Arjun Mehta hydration compliance dropped to 74% (2.8L / 3.5L) alongside +22% acute load. Add +600ml isotonic electrolyte reload + 15g hydrolyzed collagen pre-rehab.',
    approverRole: 'Awaiting Nutritionist',
    targetRoles: ['Nutritionist', 'Athlete', 'Sports Scientist'],
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 08:05',
    evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-05',
    priority: 'Medium',
    safetyClass: 'RECOMMENDATION',
    source: 'AI Assessment & TID Engine',
    affectedAthleteId: 'ath-rohan-deshmukh',
    affectedAthleteName: '8 Pending Squad Athletes',
    squad: 'Senior & U23 Squads',
    recommendation: 'Schedule September Mobility & Squat Strength field block',
    detail:
      'Football September assessment completion is at 94%. Schedule remaining 8 athletes for Mobility Screen and Squat Strength prior to 30 Sep deadline.',
    approverRole: 'Awaiting Sports Scientist / Performance Director',
    targetRoles: ['Sports Scientist', 'Performance Director', 'Coach'],
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 07:50',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-06',
    priority: 'High',
    safetyClass: 'CONSEQUENTIAL',
    source: 'AI Governance & Compliance Engine',
    affectedAthleteId: 'ath-kabir-rao',
    affectedAthleteName: '3 Pending Athlete Applications',
    squad: 'Senior & U23 Registry',
    recommendation: 'Complete federation eligibility & WADA whereabouts sign-off',
    detail:
      '3 athlete onboarding records have verified medical & identity uploads awaiting final Federation Admin governance approval before competition registration locks.',
    approverRole: 'Awaiting Federation Admin',
    targetRoles: ['Federation Admin', 'Performance Director'],
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 07:40',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'ai-act-07',
    priority: 'Medium',
    safetyClass: 'RECOMMENDATION',
    source: 'AI Facility & Operations Engine',
    affectedAthleteName: 'Main Pitch A & U23 GPS Sensor Fleet',
    squad: 'Facility Operations',
    recommendation: 'Recalibrate 3 U23 Catapult pods & prep Cryo Suite for 11:45',
    detail:
      '3 Catapult Vector S7 pods on U23 dock #2 show 42% battery & firmware drift ahead of 09:30 kick-off. Allocate 4 post-session hydrotherapy slots for high-load Senior Squad cohort.',
    approverRole: 'Awaiting Operations Team',
    targetRoles: ['Operations Team', 'Sports Scientist'],
    status: 'Pending Review',
    confidence: 'High',
    createdAt: 'Today · 07:15',
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
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
      'Workload +22% (ACWR 1.28)',
      'HRV -14% (58ms vs 67ms)',
      'Sleep -11% (6h 10m avg)',
      'Active hamstring rehabilitation (Stage 3/5 · 88% symmetry)',
    ],
    confidence: 'Moderate',
    recommendedAction: 'Cap maximal sprinting at ≤85% Vmax & hold RTP Stage 4 gate.',
    targetNav: 'injury-intelligence',
    targetRoles: [
      'Performance Director',
      'Coach',
      'Physiotherapist',
      'Sports Scientist',
      'Athlete',
    ],
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
      'Stage 2/5 Right Shoulder AC Joint non-contact protocol',
    ],
    confidence: 'High',
    recommendedAction: 'Cap high-speed running volume to 5 × 20m in tomorrow’s session.',
    targetNav: 'workload',
    targetRoles: ['Coach', 'Sports Scientist', 'Physiotherapist', 'Performance Director'],
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'risk-sig-03',
    category: 'Recovery Risk',
    athleteId: 'ath-rahul-singh',
    athleteName: 'Rahul Singh & Arjun Mehta',
    squad: 'Senior Squad',
    riskLevel: 'Moderate',
    signals: [
      'Arjun Mehta hydration compliance 74% (2.8L / 3.5L target)',
      'Rahul Singh recovery -11% over 72 hours with glycogen depletion',
      'Post-match neuromuscular & metabolic fatigue residual',
    ],
    confidence: 'High',
    recommendedAction: 'Trigger +600ml sodium-electrolyte reload & hydrotherapy protocol.',
    targetNav: 'nutrition',
    targetRoles: ['Nutritionist', 'Sports Scientist', 'Athlete', 'Physiotherapist'],
    evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
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
      'Readiness score 59 · Posterior chain soreness 6/10',
    ],
    confidence: 'High',
    recommendedAction: 'Substitute high-press 11v11 with technical possession & force-plate screen.',
    targetNav: 'assessments-tid',
    targetRoles: ['Sports Scientist', 'Coach', 'Performance Director', 'Physiotherapist'],
    evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
  },
  {
    id: 'risk-sig-05',
    category: 'Operational Risk',
    athleteName: 'Governance, Assessments & Facility Readiness',
    squad: 'Senior & U23 Operations',
    riskLevel: 'Moderate',
    signals: [
      '3 athlete onboarding profiles pending Federation Admin verification sign-off',
      '8 athletes pending September cycle assessments (deadline 30 Sep)',
      '3 U23 Catapult Vector GPS pods below 45% battery prior to 09:30 session',
    ],
    confidence: 'High',
    recommendedAction: 'Complete pending verification sign-offs, assessment blocks & GPS pod sync.',
    targetNav: 'athlete-registry',
    targetRoles: ['Federation Admin', 'Operations Team', 'Performance Director'],
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
    answerTitle: 'EXECUTIVE HIGH-PERFORMANCE & GOVERNANCE BRIEFING',
    answerStatement:
      'Executive synthesis across 184 federation athletes: Senior Squad readiness is at 78% (-5% over 7 days) with 3 high-risk profiles requiring cross-department intervention ahead of tomorrow’s 09:30 tactical block.',
    confidence: 'High',
    safetyClass: 'CONSEQUENTIAL',
    evidenceSummary: [
      { label: 'Federation Roster', value: '184 (162 Ready)', tone: 'sky' },
      { label: 'Senior Readiness', value: '78% (↓ 5% 7d)', tone: 'amber' },
      { label: 'High-Risk Escalations', value: '3 Athletes', tone: 'rose' },
      { label: 'Pending Approvals', value: '4 Cross-Module Gates', tone: 'amber' },
    ],
    interpretation:
      'As Performance Director, your highest-leverage decisions today are: (1) approving sprint volume caps for 4 overloaded Senior/U23 athletes, (2) reviewing Arjun Mehta’s Stage 3/5 hamstring RTP ceiling with the Medical Lead, and (3) enforcing the 30 Sep assessment completion deadline (8 athletes pending).',
    recommendation:
      'Approve the staged training load modifications (-90 to -160 AU) and inspect federation-wide readiness & injury escalations.',
    actions: [
      {
        id: 'act-init-mod',
        label: 'Review Training Modifications (4)',
        safetyClass: 'CONSEQUENTIAL',
        actionType: 'open-training-mod-modal',
      },
      {
        id: 'act-init-arjun',
        label: 'Inspect High-Risk Profile (Arjun)',
        safetyClass: 'INFORMATIONAL',
        actionType: 'open-athlete-360',
        targetAthleteId: 'ath-arjun-mehta',
      },
      {
        id: 'act-init-risk',
        label: 'Open Executive Risk Centre',
        safetyClass: 'INFORMATIONAL',
        actionType: 'open-risk-centre',
      },
    ],
    followUpSuggestions: [
      'Give me a performance overview of the federation.',
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      'Prepare a weekly performance report for the Senior Squad.',
      'Show athletes with active injury, elevated workload, and declining recovery.',
    ],
  },
];

export function getPersonaInitialMessages(role: UserRole): AICopilotMessage[] {
  switch (role) {
    case 'Performance Director':
      return INITIAL_COPILOT_MESSAGES;

    case 'Coach':
      return [
        {
          id: 'msg-welcome-coach',
          sender: 'ai',
          timestamp: '08:00',
          answerTitle: 'COACH TACTICAL & SESSION AVAILABILITY BRIEFING',
          answerStatement:
            '36 of 42 Senior Squad athletes are cleared for full tactical intensity in tomorrow’s 09:30 High-Speed Conditioning & Sprint Block. 4 athletes require drill prescription modifications to prevent soft-tissue overload.',
          confidence: 'High',
          safetyClass: 'CONSEQUENTIAL',
          evidenceSummary: [
            { label: 'Full Pitch Availability', value: '36 / 42 Athletes', tone: 'emerald' },
            { label: 'Modified Drill Cap', value: '4 Athletes Flagged', tone: 'amber' },
            { label: 'Arjun Sprint Ceiling', value: '≤ 85% Vmax (4×20m)', tone: 'rose' },
            { label: 'Projected Load Save', value: '-90 to -160 AU', tone: 'sky' },
          ],
          interpretation:
            'As Head Coach, exposing Arjun Mehta (Readiness 62, Stage 3 hamstring) and Vikramaditya Nair (Readiness 59, ACWR 1.31) to the full 6 × 30m maximal sprint & high-press 11v11 block exceeds their safe tactical load thresholds.',
          recommendation:
            'Approve the 4 staged drill modifications (e.g. Arjun: 6 × 30m sprint → 4 × 20m controlled acceleration; Vikram: High-Press 11v11 → Technical Possession) before publishing tomorrow’s pitch sheet.',
          actions: [
            {
              id: 'act-coach-mod',
              label: 'Approve Session Drill Modifications',
              safetyClass: 'CONSEQUENTIAL',
              actionType: 'open-training-mod-modal',
            },
            {
              id: 'act-coach-sess',
              label: 'Open Training & Session Planner',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-training-module',
            },
            {
              id: 'act-coach-arjun',
              label: 'Open Arjun Mehta 360',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-athlete-360',
              targetAthleteId: 'ath-arjun-mehta',
            },
          ],
          followUpSuggestions: [
            "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
            'Who is cleared for full 11v11 tactical pressing tomorrow?',
            'Why is Arjun restricted?',
            'Prepare a tactical load & substitution brief for Senior Squad.',
          ],
        },
      ];

    case 'Sports Scientist':
      return [
        {
          id: 'msg-welcome-scientist',
          sender: 'ai',
          timestamp: '08:00',
          answerTitle: 'SPORTS SCIENCE TELEMETRY: ACWR, HRV & NEUROMUSCULAR FATIGUE',
          answerStatement:
            'Morning screening complete: 12 athletes exceed ACWR 1.15, 3 athletes exhibit autonomic HRV rMSSD suppression >12%, and 8 athletes require September field assessment completion prior to 30 Sep.',
          confidence: 'High',
          safetyClass: 'RECOMMENDATION',
          evidenceSummary: [
            { label: 'ACWR > 1.15 Cohort', value: '12 Athletes (+18% Load)', tone: 'amber' },
            { label: 'HRV rMSSD Suppression', value: '3 Athletes (↓ 11–14%)', tone: 'rose' },
            { label: 'CMJ Neuromuscular Dip', value: 'Vikram Nair (-6.5%)', tone: 'rose' },
            { label: 'Sep Assessment Cycle', value: '94% Done (8 Pending)', tone: 'sky' },
          ],
          interpretation:
            'Arjun Mehta (ACWR 1.28, HRV 58ms vs 67ms baseline) and Vikramaditya Nair (ACWR 1.31, CMJ peak power -6.5%, RSA decrement 5.1%) display coupled mechanical and autonomic fatigue.',
          recommendation:
            'Flag Vikramaditya Nair and Arjun Mehta for high-speed running caps (-20% HSR volume) and schedule the 8 pending athletes for Mobility & Squat Strength validation.',
          actions: [
            {
              id: 'act-sci-mod',
              label: 'Review Load & HSR Caps',
              safetyClass: 'CONSEQUENTIAL',
              actionType: 'open-training-mod-modal',
            },
            {
              id: 'act-sci-readiness',
              label: 'Open Readiness & HRV Matrix',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-readiness-module',
            },
            {
              id: 'act-sci-assess',
              label: 'Open Assessments & TID',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-assessments-module',
            },
          ],
          followUpSuggestions: [
            'Show me athletes with high workload and declining recovery.',
            'Analyze HRV suppression and CMJ neuromuscular fatigue across Senior Squad.',
            'Which 8 athletes are pending September assessment tests?',
            'Why is his readiness low?',
          ],
        },
      ];

    case 'Physiotherapist':
      return [
        {
          id: 'msg-welcome-physio',
          sender: 'ai',
          timestamp: '08:00',
          answerTitle: 'CLINICAL REHABILITATION & RETURN-TO-PLAY (RTP) GATE BRIEFING',
          answerStatement:
            '4 active clinical injuries registered (68% mean rehab completion). Arjun Mehta is at RTP Stage 3/5 with 88% eccentric hamstring symmetry (2% below the 90% Stage 4 gate) and 3/10 morning soreness.',
          confidence: 'High',
          safetyClass: 'CONSEQUENTIAL',
          evidenceSummary: [
            { label: 'Active Rehab Caseload', value: '4 Injuries (68% Avg)', tone: 'amber' },
            { label: 'Arjun Hamstring RTP', value: 'Stage 3/5 (88% Sym)', tone: 'rose' },
            { label: 'Kabir Shoulder Rehab', value: 'Stage 2/5 (Non-Contact)', tone: 'amber' },
            { label: 'Devansh Patellar Load', value: 'Isometric Protocol', tone: 'sky' },
          ],
          interpretation:
            'Arjun Mehta’s acute workload spiked +22% while his NordBord eccentric hamstring symmetry sits at 88% (gate requirement ≥ 90%) and subjective pain is 3/10 (gate requirement ≤ 2/10). Advancing to Stage 4 today carries elevated re-injury risk.',
          recommendation:
            'Hold Arjun Mehta at RTP Stage 3 for 48 hours, enforce the ≤85% Vmax sprint ceiling in tomorrow’s session, and schedule post-pitch contrast hydrotherapy + manual release.',
          actions: [
            {
              id: 'act-phys-med',
              label: 'Open Clinical & RTP Workspace',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-medical-module',
            },
            {
              id: 'act-phys-mod',
              label: 'Enforce Sprint Restriction Cap',
              safetyClass: 'CONSEQUENTIAL',
              actionType: 'open-training-mod-modal',
            },
            {
              id: 'act-phys-arjun',
              label: 'Open Arjun Clinical 360',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-athlete-360',
              targetAthleteId: 'ath-arjun-mehta',
            },
          ],
          followUpSuggestions: [
            'Why is Arjun restricted?',
            'Summarize active rehabilitation cases and RTP gate criteria.',
            'Who needs RTP review today?',
            'Show athletes with active injury, elevated workload, and declining recovery.',
          ],
        },
      ];

    case 'Nutritionist':
      return [
        {
          id: 'msg-welcome-nutri',
          sender: 'ai',
          timestamp: '08:00',
          answerTitle: 'METABOLIC FUELING, HYDRATION & RECOVERY NUTRITION BRIEFING',
          answerStatement:
            'Squad nutrition plan compliance averages 84%, but hydration adherence dipped to 76% (12 athletes below sweat-rate target). Arjun Mehta is at 74% hydration (2.8L / 3.5L) despite a +22% workload spike.',
          confidence: 'High',
          safetyClass: 'RECOMMENDATION',
          evidenceSummary: [
            { label: 'Plan Compliance', value: '84% Squad Mean', tone: 'emerald' },
            { label: 'Hydration Compliance', value: '76% (12 Athletes Low)', tone: 'amber' },
            { label: 'Arjun Hydration Deficit', value: '-700ml (2.8L / 3.5L)', tone: 'rose' },
            { label: 'Rehab Collagen Protocol', value: '2 Athletes Active', tone: 'sky' },
          ],
          interpretation:
            'High-speed conditioning load increased +18% across Senior Squad this week, creating a glycogen and sodium-electrolyte deficit in 4 high-minute players (Arjun Mehta, Rahul Singh, Vikramaditya Nair, Rohan Deshmukh).',
          recommendation:
            'Prescribe +600ml sodium-electrolyte solution + 1.2g/kg carbohydrate reload post-session for Arjun Mehta and Rahul Singh, and verify 15g Vitamin-C enriched collagen 45m prior to Arjun’s hamstring rehab.',
          actions: [
            {
              id: 'act-nutri-open',
              label: 'Open Nutrition & Hydration Workspace',
              safetyClass: 'RECOMMENDATION',
              actionType: 'open-nutrition-module',
            },
            {
              id: 'act-nutri-arjun',
              label: 'Review Arjun Fueling Profile',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-athlete-360',
              targetAthleteId: 'ath-arjun-mehta',
            },
          ],
          followUpSuggestions: [
            'Identify athletes with declining nutrition and hydration compliance.',
            'What electrolyte and carb reload is needed for high-workload athletes?',
            'Review anti-inflammatory & collagen supplementation for injured athletes.',
            'Show body composition and lean mass trends across Senior Squad.',
          ],
        },
      ];

    case 'Federation Admin':
      return [
        {
          id: 'msg-welcome-admin',
          sender: 'ai',
          timestamp: '08:00',
          answerTitle: 'FEDERATION GOVERNANCE, ELIGIBILITY & COMPLIANCE BRIEFING',
          answerStatement:
            'Federation registry verification stands at 96.2% across 184 athletes. 3 athlete onboarding applications require final eligibility sign-off, 5 medical clearances are pending update, and 100% of consequential AI actions have human audit logs.',
          confidence: 'High',
          safetyClass: 'INFORMATIONAL',
          evidenceSummary: [
            { label: 'Verified Federation Roster', value: '96.2% (177 / 184)', tone: 'emerald' },
            { label: 'Pending Verifications', value: '3 Applications', tone: 'amber' },
            { label: 'Pending Medical Sign-Off', value: '5 Athletes', tone: 'rose' },
            { label: 'AI Audit Compliance', value: '100% Human-Gated', tone: 'sky' },
          ],
          interpretation:
            'As Federation Admin, competition registration locks in 72 hours. Completing identity, WADA whereabouts, and coach assignment verification for the 3 pending U23/Academy profiles is your primary governance priority.',
          recommendation:
            'Open the Athlete Registry verification queue to approve pending athlete applications and audit recent consequential AI approvals.',
          actions: [
            {
              id: 'act-adm-reg',
              label: 'Open Athlete Registry & Approvals',
              safetyClass: 'RECOMMENDATION',
              actionType: 'open-registry-module',
            },
            {
              id: 'act-adm-action',
              label: 'Review Governance Action Queue',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-action-centre',
            },
          ],
          followUpSuggestions: [
            'Show athletes pending federation eligibility verification and document sign-off.',
            'Summarize AI governance audit trail and human approval compliance.',
            'Which athletes are missing assigned coaches or medical clearance documents?',
            'Give me a performance overview of the federation.',
          ],
        },
      ];

    case 'Athlete':
      return [
        {
          id: 'msg-welcome-athlete',
          sender: 'ai',
          timestamp: '08:00',
          answerTitle: 'PERSONAL READINESS, RECOVERY & TRAINING ASSISTANT (ARJUN MEHTA)',
          answerStatement:
            'Good morning, Arjun. Your readiness score today is 62/100 (Recovery 64%, HRV 58ms). Because you are in Stage 3/5 hamstring progression and your recent training load was +22%, your sprint drill tomorrow is modified to protect your recovery.',
          confidence: 'High',
          safetyClass: 'INFORMATIONAL',
          evidenceSummary: [
            { label: 'My Readiness Today', value: '62 / 100 (Monitor)', tone: 'amber' },
            { label: 'Morning HRV & Sleep', value: '58 ms · 6h 10m', tone: 'rose' },
            { label: 'Tomorrow Sprint Cap', value: '4 × 20m (≤85% Vmax)', tone: 'sky' },
            { label: 'Hydration Remaining', value: '+700ml Today (2.8/3.5L)', tone: 'amber' },
          ],
          interpretation:
            'Your 30m sprint speed has improved 3% this cycle (4.21s), and your hamstring strength symmetry is at 88% (just 2% away from Stage 4 clearance). Prioritizing sleep (>7h 45m) and hydration today will help bounce your HRV back to your 67ms baseline.',
          recommendation:
            'Complete your +600ml electrolyte reload before 18:00, take your 15g collagen dose 45m before afternoon physio, and follow the 4 × 20m controlled acceleration cap tomorrow.',
          actions: [
            {
              id: 'act-ath-360',
              label: 'View My Athlete 360 Profile',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-athlete-360',
              targetAthleteId: 'ath-arjun-mehta',
            },
            {
              id: 'act-ath-nutri',
              label: 'Log My Hydration & Meals',
              safetyClass: 'RECOMMENDATION',
              actionType: 'open-nutrition-module',
            },
          ],
          followUpSuggestions: [
            'Explain my morning recovery telemetry and HRV baseline.',
            'What are my hydration and fueling targets before today session?',
            'Why is my sprint prescription modified for tomorrow?',
            'How close am I to Stage 4 Return-to-Play clearance?',
          ],
        },
      ];

    case 'Operations Team':
      return [
        {
          id: 'msg-welcome-ops',
          sender: 'ai',
          timestamp: '08:00',
          answerTitle: 'FACILITY OPERATIONS, SENSOR FLEET & LOGISTICS BRIEFING',
          answerStatement:
            'Main Pitch A is cleared for 09:30 training (Clegg hardness 71g, moisture 24%). 3 Catapult Vector S7 GPS pods on U23 Dock #2 are at 42% battery requiring sync, and 4 Cryo/Hydrotherapy slots are requested for 11:45.',
          confidence: 'High',
          safetyClass: 'RECOMMENDATION',
          evidenceSummary: [
            { label: 'Main Pitch A Status', value: '71g Clegg (Optimal)', tone: 'emerald' },
            { label: 'Catapult GPS Fleet', value: '39/42 Ready (3 Low Batt)', tone: 'amber' },
            { label: 'Cryo & Hydro Suite', value: '4 Slots Booked (11:45)', tone: 'sky' },
            { label: 'Timing Gates (Pitch B)', value: 'Calibrated for 30m Test', tone: 'emerald' },
          ],
          interpretation:
            'With 4 Senior Squad athletes moving to modified controlled acceleration drills tomorrow at 09:30, Pitch A Lane 2 requires 20m deceleration cones, and the Hydrotherapy Suite needs contrast baths at 10°C / 38°C ready by 11:30.',
          recommendation:
            'Swap the 3 low-battery U23 GPS pods to spare units #43–#45, confirm timing gate alignment on Pitch B, and lock the 11:45 Hydrotherapy recovery rotation.',
          actions: [
            {
              id: 'act-ops-sess',
              label: 'View Pitch & Session Schedule',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-training-module',
            },
            {
              id: 'act-ops-act',
              label: 'Open Operations Action Queue',
              safetyClass: 'RECOMMENDATION',
              actionType: 'open-action-centre',
            },
          ],
          followUpSuggestions: [
            'Check Catapult GPS pod battery, firmware sync, and timing gate status.',
            'What facility, pitch, and hydrotherapy setups are needed for tomorrow?',
            'Summarize travel manifest and equipment logistics for away fixture.',
            'Which sessions require modified pitch lane setup tomorrow?',
          ],
        },
      ];
  }
}

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

  // 9. NUTRITION, HYDRATION, COLLAGEN & BODY COMPOSITION QUERIES (Nutritionist & Athlete Lens)
  if (
    q === '/nutrition' ||
    q.includes('nutrition') ||
    q.includes('hydration') ||
    q.includes('fueling') ||
    q.includes('electrolyte') ||
    q.includes('collagen') ||
    q.includes('body composition')
  ) {
    const isAthleteLens = context.role === 'Athlete';
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: isAthleteLens
          ? `PERSONAL FUELING & HYDRATION PLAN — ${activeAth.name.toUpperCase()}`
          : 'METABOLIC FUELING, SWEAT-RATE HYDRATION & SUPPLEMENTATION ANALYSIS',
        answerStatement: isAthleteLens
          ? `You have logged 2.8L of your 3.5L hydration target today (74%) and 2,610 of 2,850 kcal (82%). Because of your +22% training load and Stage 3 hamstring rehab, an extra +600ml sodium-electrolyte reload and 15g collagen dose are recommended today.`
          : 'Squad nutrition plan compliance is at 84%, while hydration compliance dipped to 76% (12 athletes below daily sweat-rate targets, led by Arjun Mehta at 74% and Rohan Deshmukh at 75%).',
        confidence: 'High',
        safetyClass: 'RECOMMENDATION',
        evidenceSummary: [
          { label: 'Squad Plan Adherence', value: '84% (Target ≥85%)', tone: 'emerald' },
          { label: 'Hydration Compliance', value: '76% (12 Low)', tone: 'amber' },
          { label: 'Arjun Hydration', value: '2.8L / 3.5L (74%)', tone: 'rose' },
          { label: 'Rehab Collagen Synergy', value: '15g + Vit C Pre-Physio', tone: 'sky' },
        ],
        tableHeaders: isAthleteLens
          ? undefined
          : ['Athlete', 'Squad', 'Hydration', 'Calorie Adherence', 'Action Needed'],
        tableRows: isAthleteLens
          ? undefined
          : [
              {
                id: 'nut-1',
                athleteId: 'ath-arjun-mehta',
                athleteName: 'Arjun Mehta',
                squad: 'Senior Squad',
                col1Label: 'Hydration',
                col1Value: '74% (2.8/3.5L)',
                col2Label: 'Calories',
                col2Value: '82% (2,610 kcal)',
                riskOrStatus: '+600ml Isotonic + Collagen',
                riskTone: 'rose',
              },
              {
                id: 'nut-2',
                athleteId: 'ath-rohan-deshmukh',
                athleteName: 'Rohan Deshmukh',
                squad: 'U23',
                col1Label: 'Hydration',
                col1Value: '75% (2.6/3.5L)',
                col2Label: 'Calories',
                col2Value: '80% (2,480 kcal)',
                riskOrStatus: 'Pre-Session Carb Top-Up',
                riskTone: 'amber',
              },
              {
                id: 'nut-3',
                athleteId: 'ath-rahul-singh',
                athleteName: 'Rahul Singh',
                squad: 'Senior Squad',
                col1Label: 'Hydration',
                col1Value: '78% (2.9/3.7L)',
                col2Label: 'Calories',
                col2Value: '85% (2,890 kcal)',
                riskOrStatus: 'Post-Match Glycogen Reload',
                riskTone: 'amber',
              },
              {
                id: 'nut-4',
                athleteId: 'ath-devansh-kulkarni',
                athleteName: 'Devansh Kulkarni',
                squad: 'Senior Squad',
                col1Label: 'Hydration',
                col1Value: '86% (3.0/3.5L)',
                col2Label: 'Calories',
                col2Value: '89% (2,760 kcal)',
                riskOrStatus: 'Tendon Collagen Protocol',
                riskTone: 'sky',
              },
            ],
        evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
        interpretation: isAthleteLens
          ? 'Closing your 700ml fluid deficit before 18:00 and taking hydrolyzed collagen 45m prior to hamstring loading supports tendon/muscle remodeling and overnight HRV recovery.'
          : 'Dehydration >2% body mass compounds autonomic HRV suppression (-14% in Arjun Mehta) and increases hamstring cramping risk during high-speed conditioning.',
        recommendation: isAthleteLens
          ? 'Log +600ml sodium-electrolyte drink now and complete your evening recovery meal (45g protein, 95g complex carbs).'
          : 'Approve the +600ml sodium-electrolyte & 1.2g/kg carbohydrate reload for Arjun Mehta, Rohan Deshmukh, and Rahul Singh in the Nutrition Workspace.',
        actions: [
          {
            id: `act-nut-open-${Date.now()}`,
            label: isAthleteLens ? 'Log My Hydration & Fueling' : 'Open Nutrition Workspace',
            safetyClass: 'RECOMMENDATION',
            actionType: 'open-nutrition-module',
          },
          {
            id: `act-nut-ath-${Date.now()}`,
            label: `Open ${activeAth.name} 360`,
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-athlete-360',
            targetAthleteId: activeAth.id,
          },
        ],
        followUpSuggestions: isAthleteLens
          ? [
              'Explain my morning recovery telemetry and HRV baseline.',
              'Why is my sprint prescription modified for tomorrow?',
            ]
          : [
              'Review anti-inflammatory & collagen supplementation for injured athletes.',
              'Show me athletes with high workload and declining recovery.',
            ],
      },
    };
  }

  // 10. SPORTS SCIENCE: HRV, CMJ NEUROMUSCULAR FATIGUE & ASSESSMENTS
  if (
    q === '/assessments' ||
    q === '/science' ||
    q.includes('assessment') ||
    q.includes('benchmark') ||
    q.includes('hrv') ||
    q.includes('cmj') ||
    q.includes('neuromuscular')
  ) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'SPORTS SCIENCE: HRV SUPPRESSION, CMJ POWER & BENCHMARK COMPLIANCE',
        answerStatement:
          '3 Senior Squad athletes exhibit rMSSD HRV suppression >11% alongside neuromuscular CMJ power dips (Vikramaditya Nair -6.5%, Arjun Mehta -4.2%), while 8 athletes remain pending September field assessments (94% completion).',
        confidence: 'High',
        safetyClass: 'RECOMMENDATION',
        evidenceSummary: [
          { label: 'HRV rMSSD Depressed', value: '3 Athletes (↓ 11–14%)', tone: 'rose' },
          { label: 'CMJ Power Dip', value: 'Vikram Nair (-6.5%)', tone: 'rose' },
          { label: 'Sep Assessment Cycle', value: '94% (8 Pending)', tone: 'sky' },
          { label: 'Arjun 30m Sprint', value: '4.21s (Improved +3%)', tone: 'emerald' },
        ],
        tableHeaders: ['Athlete', 'Squad', 'HRV Shift', 'CMJ / Sprint Metric', 'Science Flag'],
        tableRows: [
          {
            id: 'sc-1',
            athleteId: 'ath-arjun-mehta',
            athleteName: 'Arjun Mehta',
            squad: 'Senior Squad',
            col1Label: 'HRV',
            col1Value: '58ms (-14%)',
            col2Label: '30m Sprint',
            col2Value: '4.21s (+3%)',
            riskOrStatus: 'Autonomic Fatigue · RTP 3/5',
            riskTone: 'rose',
          },
          {
            id: 'sc-2',
            athleteId: 'ath-vikram-nair',
            athleteName: 'Vikramaditya Nair',
            squad: 'Senior Squad',
            col1Label: 'HRV',
            col1Value: '54ms (-13%)',
            col2Label: 'CMJ Power',
            col2Value: '-6.5% vs Baseline',
            riskOrStatus: 'Neuromuscular Overload',
            riskTone: 'rose',
          },
          {
            id: 'sc-3',
            athleteId: 'ath-rahul-singh',
            athleteName: 'Rahul Singh',
            squad: 'Senior Squad',
            col1Label: 'HRV',
            col1Value: '60ms (-11%)',
            col2Label: 'RSA Decrement',
            col2Value: '4.8% (Monitor)',
            riskOrStatus: 'Post-Match Residual',
            riskTone: 'amber',
          },
          {
            id: 'sc-4',
            athleteId: 'ath-kabir-rao',
            athleteName: 'Kabir Rao',
            squad: 'U23',
            col1Label: 'ACWR',
            col1Value: '1.22 (+18%)',
            col2Label: '30m Sprint',
            col2Value: '4.29s (-0.04s vs BM)',
            riskOrStatus: 'Pending Squat & Mobility',
            riskTone: 'amber',
          },
        ],
        evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
        interpretation:
          'Coupled HRV suppression and CMJ flight-time:contraction-time reduction in Vikramaditya Nair and Arjun Mehta confirm central + peripheral fatigue. Meanwhile, 8 athletes must complete Mobility Screen and Squat Strength before the 30 Sep cycle lock.',
        recommendation:
          'Approve the -20% high-speed running cap for Vikramaditya Nair and Arjun Mehta, and schedule the 8 pending athletes into Thursday’s 10:30 field testing block.',
        actions: [
          {
            id: `act-ass-open-${Date.now()}`,
            label: 'Open Assessments & TID',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-assessments-module',
          },
          {
            id: `act-sci-mod-${Date.now()}`,
            label: 'Approve Load Modifications',
            safetyClass: 'CONSEQUENTIAL',
            actionType: 'open-training-mod-modal',
          },
        ],
        followUpSuggestions: [
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
          'Show me athletes with high workload and declining recovery.',
        ],
      },
    };
  }

  // 11. FEDERATION ADMIN: ELIGIBILITY VERIFICATION, ONBOARDING & AI GOVERNANCE AUDIT
  if (
    q === '/governance' ||
    q.includes('verification') ||
    q.includes('eligibility') ||
    q.includes('onboarding') ||
    q.includes('audit') ||
    q.includes('missing assigned coaches') ||
    q.includes('compliance')
  ) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'FEDERATION GOVERNANCE, ELIGIBILITY & AUDIT COMPLIANCE REPORT',
        answerStatement:
          '177 of 184 federation athletes (96.2%) have fully verified profiles. 3 onboarding applications await Federation Admin sign-off, 2 U23 athletes require formal coach assignment, and 100% of consequential AI recommendations have human approval logs.',
        confidence: 'High',
        safetyClass: 'INFORMATIONAL',
        evidenceSummary: [
          { label: 'Verified Roster', value: '177 / 184 (96.2%)', tone: 'emerald' },
          { label: 'Pending Admin Sign-Off', value: '3 Athletes', tone: 'amber' },
          { label: 'Medical Clearance Hold', value: '5 Restricted/Pending', tone: 'rose' },
          { label: 'AI Governance Audit', value: '100% Human-Gated', tone: 'sky' },
        ],
        tableHeaders: ['Athlete / Entity', 'Squad', 'Governance Item', 'Document Status', 'Priority'],
        tableRows: [
          {
            id: 'gov-1',
            athleteId: 'ath-kabir-rao',
            athleteName: 'Kabir Rao',
            squad: 'U23',
            col1Label: 'Verification',
            col1Value: 'Pending Admin Sign-Off',
            col2Label: 'Docs',
            col2Value: 'WADA & Medical Uploaded',
            riskOrStatus: 'Action Required',
            riskTone: 'amber',
          },
          {
            id: 'gov-2',
            athleteId: 'ath-arjun-mehta',
            athleteName: 'Arjun Mehta',
            squad: 'Senior Squad',
            col1Label: 'Medical Gate',
            col1Value: 'Clearance Pending (RTP 3/5)',
            col2Label: 'AI Audit',
            col2Value: 'Sprint Cap Staged',
            riskOrStatus: 'Restricted',
            riskTone: 'rose',
          },
          {
            id: 'gov-3',
            athleteId: 'ath-rohan-deshmukh',
            athleteName: 'Rohan Deshmukh',
            squad: 'U23',
            col1Label: 'Profile Completion',
            col1Value: '88% Complete',
            col2Label: 'Pending',
            col2Value: 'Annual Cardiac Upload',
            riskOrStatus: 'Monitor',
            riskTone: 'amber',
          },
        ],
        evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
        interpretation:
          'All AI-generated training modifications and RTP gate flags have been routed through mandatory human-in-the-loop review gates with full timestamped attribution.',
        recommendation:
          'Approve the 3 pending athlete onboarding verifications in Athlete Registry and review the AI Audit Trail.',
        actions: [
          {
            id: `act-gov-reg-${Date.now()}`,
            label: 'Open Athlete Registry & Verification',
            safetyClass: 'RECOMMENDATION',
            actionType: 'open-registry-module',
          },
          {
            id: `act-gov-act-${Date.now()}`,
            label: 'Open AI Action Centre',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-action-centre',
          },
        ],
        followUpSuggestions: [
          'Give me a performance overview of the federation.',
          'Prepare a weekly performance report for the Senior Squad.',
        ],
      },
    };
  }

  // 12. OPERATIONS TEAM: FACILITY, PITCH TELEMETRY, GPS POD FLEET & LOGISTICS
  if (
    q === '/ops' ||
    q.includes('gps') ||
    q.includes('catapult') ||
    q.includes('pitch') ||
    q.includes('facility') ||
    q.includes('hydrotherapy') ||
    q.includes('travel') ||
    q.includes('manifest')
  ) {
    return {
      nextFilterTopic: null,
      message: {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        timestamp: nowTime,
        answerTitle: 'FACILITY OPERATIONS, WEARABLE SENSOR FLEET & RECOVERY LOGISTICS',
        answerStatement:
          'Main Pitch A is optimal (71g Clegg hardness, 24% moisture) for tomorrow’s 09:30 session. 3 Catapult Vector S7 GPS pods on U23 Dock #2 require battery swap/firmware sync, and 4 Hydrotherapy/Cryo slots are staged for 11:45.',
        confidence: 'High',
        safetyClass: 'RECOMMENDATION',
        evidenceSummary: [
          { label: 'Main Pitch A Clegg', value: '71g (Optimal 65–80g)', tone: 'emerald' },
          { label: 'GPS Sensor Fleet', value: '39 / 42 Synced (3 Low)', tone: 'amber' },
          { label: 'Hydro / Cryo Suite', value: '4 Recovery Slots @ 11:45', tone: 'sky' },
          { label: 'Pitch B Timing Gates', value: 'Brower 30m Calibrated', tone: 'emerald' },
        ],
        evidenceBundle: SQUAD_EVIDENCE_BUNDLE,
        interpretation:
          'Because 4 athletes (Arjun Mehta, Kabir Rao, Vikramaditya Nair, Devansh Kulkarni) have staged AI training modifications for tomorrow at 09:30, Pitch A Lane 2 needs a dedicated 20m controlled acceleration zone and non-contact station.',
        recommendation:
          'Replace U23 GPS pods #14, #19, and #22 with charged spares #43–#45 before 08:30, set up the 20m modified acceleration lane on Pitch A, and pre-chill the Cryo/Hydro contrast baths for 11:30.',
        actions: [
          {
            id: `act-ops-tr-${Date.now()}`,
            label: 'Open Session & Pitch Schedule',
            safetyClass: 'INFORMATIONAL',
            actionType: 'open-training-module',
          },
          {
            id: `act-ops-ac-${Date.now()}`,
            label: 'Review Operations Action Queue',
            safetyClass: 'RECOMMENDATION',
            actionType: 'open-action-centre',
          },
        ],
        followUpSuggestions: [
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
          'Give me a performance overview of the federation.',
        ],
      },
    };
  }

  // 13. ATHLETE PERSONAL QUERIES ("Why is my sprint prescription modified?" / "How close am I to Stage 4?")
  if (
    q.includes('my sprint') ||
    q.includes('stage 4') ||
    q.includes('my readiness') ||
    q.includes('who is cleared for full 11v11') ||
    q.includes('tactical load')
  ) {
    if (context.role === 'Athlete' || q.includes('my ')) {
      return {
        nextFilterTopic: null,
        message: {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          timestamp: nowTime,
          answerTitle: 'YOUR PERSONAL RTP & SPRINT PROTECTION PLAN (ARJUN MEHTA)',
          answerStatement:
            'Your hamstring strength symmetry is at 88% (just 2% shy of the 90% Stage 4 Return-to-Play gate). Tomorrow’s sprint drill is capped at 4 × 20m controlled acceleration (≤85% Vmax) so you don’t overload the biceps femoris while your HRV is down 14%.',
          confidence: 'High',
          safetyClass: 'INFORMATIONAL',
          evidenceSummary: [
            { label: 'RTP Stage Progress', value: 'Stage 3/5 (68%)', tone: 'amber' },
            { label: 'Eccentric Symmetry', value: '88% (Target ≥90%)', tone: 'sky' },
            { label: 'Morning Pain Score', value: '3/10 (Target ≤2/10)', tone: 'amber' },
            { label: 'Tomorrow Sprint Cap', value: '4 × 20m @ ≤85% Vmax', tone: 'emerald' },
          ],
          evidenceBundle: ARJUN_EVIDENCE_BUNDLE,
          interpretation:
            'Your 30m sprint speed is already trending 3% faster (4.21s), so holding maximal 30m top-speed exposure for 48 hours protects your hamstring while you close the final 2% eccentric strength gap.',
          recommendation:
            'Complete today’s Nordic eccentric protocol with Dr. Ananya Rao, drink +600ml electrolyte fluid before 18:00, and aim for 8 hours of sleep tonight.',
          actions: [
            {
              id: `act-ath-p360-${Date.now()}`,
              label: 'Open My Athlete 360',
              safetyClass: 'INFORMATIONAL',
              actionType: 'open-athlete-360',
              targetAthleteId: 'ath-arjun-mehta',
            },
            {
              id: `act-ath-pnut-${Date.now()}`,
              label: 'Open My Fueling & Hydration',
              safetyClass: 'RECOMMENDATION',
              actionType: 'open-nutrition-module',
            },
          ],
          followUpSuggestions: [
            'What are my hydration and fueling targets before today session?',
            'Explain my morning recovery telemetry and HRV baseline.',
          ],
        },
      };
    }
  }

  // DEFAULT CONTEXTUAL & PERSONA-AWARE INTELLIGENCE RESPONSE
  const loadDiff =
    activeAth.chronicLoadAu > 0
      ? Math.round(
          ((activeAth.acuteLoadAu - activeAth.chronicLoadAu) /
            activeAth.chronicLoadAu) *
            100
        )
      : 0;

  const roleTailoredRecommendation: Record<UserRole, string> = {
    'Performance Director': `Executive Action: Approve the staged training modifications for ${activeAth.name} and 3 squad peers, and review RTP Stage 3/5 governance status.`,
    Coach: `Tactical Action: Cap ${activeAth.name}'s high-speed sprint exposure to 4 × 20m controlled acceleration (≤85% Vmax) in tomorrow's 09:30 pitch block.`,
    'Sports Scientist': `Science Action: Monitor ${activeAth.name}'s ACWR (${activeAth.acwr.toFixed(2)}) and morning HRV (${activeAth.hrvMs}ms vs ${activeAth.hrvBaselineMs}ms) before clearing maximal sprint density.`,
    Physiotherapist: `Clinical Action: Maintain ${activeAth.name} at RTP Stage 3/5 until NordBord eccentric symmetry reaches ≥90% (currently 88%) and pain is ≤2/10.`,
    Nutritionist: `Fueling Action: Prescribe +600ml sodium-electrolyte reload and 15g Vitamin-C enriched collagen for ${activeAth.name} to close the 74% hydration gap.`,
    'Federation Admin': `Governance Action: Verify ${activeAth.name}'s medical restriction sign-off and complete the 3 pending athlete onboarding verifications in Registry.`,
    Athlete: `Personal Action: Follow your 4 × 20m controlled acceleration cap tomorrow, log +600ml electrolyte hydration before 18:00, and target ≥7h 45m sleep tonight.`,
    'Operations Team': `Operations Action: Configure Pitch A Lane 2 for 20m controlled acceleration drills at 09:30 and reserve a 11:45 Hydrotherapy slot for ${activeAth.name}.`,
  };

  return {
    nextFilterTopic: null,
    message: {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      timestamp: nowTime,
      answerTitle: `${context.role.toUpperCase()} INTELLIGENCE — ${activeAth.name.toUpperCase()} & ${context.squad.toUpperCase()}`,
      answerStatement: `Evaluated "${rawQuery}" through the ${context.role} operational lens for ${context.sport} · ${context.squad}. ${activeAth.name} is at Readiness ${activeAth.readiness}/100 (${activeAth.injuryRisk} Risk) with acute workload ${loadDiff >= 0 ? '+' : ''}${loadDiff}% (${activeAth.acuteLoadAu} AU) and medical status ${activeAth.medicalStatus}.`,
      confidence: 'High',
      safetyClass: 'RECOMMENDATION',
      evidenceSummary: [
        {
          label: 'Evaluated Athlete',
          value: `${activeAth.name} (Readiness ${activeAth.readiness})`,
          tone: activeAth.readiness < 70 ? 'rose' : activeAth.readiness < 80 ? 'amber' : 'emerald',
        },
        {
          label: 'Workload Delta',
          value: `${loadDiff >= 0 ? '+' : ''}${loadDiff}% (${activeAth.acuteLoadAu} AU)`,
          tone: activeAth.acwr > 1.2 ? 'rose' : 'sky',
        },
        {
          label: 'Medical & Hydration',
          value: `${activeAth.medicalStatus} · Hydr ${activeAth.hydrationStatus}`,
          tone:
            activeAth.medicalStatus === 'Cleared'
              ? 'emerald'
              : activeAth.medicalStatus === 'Restricted'
                ? 'rose'
                : 'amber',
        },
        { label: 'Active Persona Lens', value: context.role, tone: 'sky' },
      ],
      evidenceBundle: activeBundle,
      interpretation: activeAth.aiSummary,
      recommendation:
        roleTailoredRecommendation[context.role] ||
        `Review proposed training modifications for ${activeAth.name} or inspect full clinical and physiological evidence.`,
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
      followUpSuggestions:
        AI_ROLE_BEHAVIOR_MATRIX[context.role]?.promptChips.slice(0, 3) || [
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

export interface PersonaProactiveRecommendation {
  id: string;
  title: string;
  metricBadge: string;
  impactTone: 'rose' | 'amber' | 'emerald' | 'sky';
  rationale: string;
  queryPrompt: string;
  actionLabel: string;
  actionType: AICopilotActionButton['actionType'];
  safetyClass: AIActionSafetyClass;
  targetAthleteId?: string;
}

export interface PersonaCopilotConfig {
  personaTitle: string;
  activeNeedSummary: string;
  focus: string;
  allowedApprovals: string[];
  restrictedScope: string;
  proactiveRecommendations: PersonaProactiveRecommendation[];
  promptChips: string[];
  slashCommands: { command: string; label: string; sampleQuery: string }[];
  headerQuickActions: {
    label: string;
    query?: string;
    openTrainingModModal?: boolean;
    tone: 'primary' | 'amber' | 'secondary';
  }[];
}

export const AI_ROLE_BEHAVIOR_MATRIX: Record<UserRole, PersonaCopilotConfig> = {
  'Performance Director': {
    personaTitle: 'Executive High-Performance & Multi-Module Governance Copilot',
    activeNeedSummary:
      'Need: Oversee 184 federation athletes (78% mean readiness), resolve 3 high-risk cross-module escalations, and sign off on tomorrow’s consequential load modifications.',
    focus:
      'Federation-wide readiness, cross-module injury risk escalation, and high-impact training & RTP governance.',
    allowedApprovals: [
      'Approve multi-athlete training session modifications',
      'Review RTP gate overrides with Medical Lead',
      'Approve federation performance reports & TID escalations',
    ],
    restrictedScope:
      'Cannot independently issue clinical medical diagnoses without Physiotherapist / Medical Officer sign-off.',
    proactiveRecommendations: [
      {
        id: 'pd-rec-1',
        title: 'Approve Sprint Load Caps for 4 Flagged Athletes',
        metricBadge: '-90 to -160 AU',
        impactTone: 'rose',
        rationale:
          'Arjun Mehta, Vikramaditya Nair, Kabir Rao, and Devansh Kulkarni exceed safe ACWR/RTP ceilings for tomorrow’s 09:30 tactical block.',
        queryPrompt:
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
        actionLabel: 'Review & Approve (4)',
        actionType: 'open-training-mod-modal',
        safetyClass: 'CONSEQUENTIAL',
      },
      {
        id: 'pd-rec-2',
        title: 'Audit Senior Squad 5% Readiness Decline',
        metricBadge: '83% → 78% (7d)',
        impactTone: 'amber',
        rationale:
          '12 Senior Squad athletes crossed ACWR 1.15 following the MD-4 high-press block with 3 showing autonomic HRV suppression.',
        queryPrompt: 'Give me a performance overview of the federation.',
        actionLabel: 'Open Federation Analytics',
        actionType: 'open-analytics-module',
        safetyClass: 'INFORMATIONAL',
      },
      {
        id: 'pd-rec-3',
        title: 'Generate Weekly Executive Board Briefing',
        metricBadge: 'Week 39 Ready',
        impactTone: 'sky',
        rationale:
          'Compile cross-module readiness, medical RTP, nutrition compliance (84%), and September assessment completion (94%) into a shareable brief.',
        queryPrompt: 'Prepare a weekly performance report for the Senior Squad.',
        actionLabel: 'Generate Executive Report',
        actionType: 'open-analytics-module',
        safetyClass: 'INFORMATIONAL',
      },
    ],
    promptChips: [
      'Give me a performance overview of the federation.',
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      'Show athletes with active injury, elevated workload, and declining recovery.',
      'Prepare a weekly performance report for the Senior Squad.',
      'Why has squad readiness declined this week?',
      'Which 8 athletes are pending September assessment completion?',
    ],
    slashCommands: [
      {
        command: '/federation',
        label: 'Federation Executive Overview',
        sampleQuery: 'Give me a performance overview of the federation.',
      },
      {
        command: '/risk',
        label: 'Cross-Module High-Risk Escalations',
        sampleQuery:
          'Show athletes with active injury, elevated workload, and declining recovery.',
      },
      {
        command: '/training',
        label: 'Consequential Session Modifications',
        sampleQuery:
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      },
      {
        command: '/report',
        label: 'Compile Weekly Executive Report',
        sampleQuery: 'Prepare a weekly performance report for the Senior Squad.',
      },
      {
        command: '/readiness',
        label: 'Low Readiness Cohort Filter',
        sampleQuery: 'Show athletes with low readiness',
      },
    ],
    headerQuickActions: [
      {
        label: 'Review Training Modifications (4)',
        openTrainingModModal: true,
        tone: 'amber',
      },
      {
        label: 'Generate Executive Report',
        query: 'Prepare a weekly performance report for the Senior Squad.',
        tone: 'secondary',
      },
    ],
  },

  Coach: {
    personaTitle: 'Tactical Session Planner & Squad Availability Copilot',
    activeNeedSummary:
      'Need: Finalize tomorrow’s 09:30 High-Speed Conditioning & Tactical Press roster (36/42 full availability) and substitute drills for 4 load-restricted players.',
    focus:
      'Daily squad availability, session load modification, tactical exposure ceilings, and individual athlete readiness.',
    allowedApprovals: [
      'Approve proposed training session modifications (-90 to -160 AU)',
      'Adjust pitch drill prescriptions for restricted athletes',
    ],
    restrictedScope:
      'Private clinical diagnostic notes are summarized to functional training restrictions only.',
    proactiveRecommendations: [
      {
        id: 'coach-rec-1',
        title: 'Replace 6×30m Sprints for Arjun Mehta & Kabir Rao',
        metricBadge: '≤85% Vmax Cap',
        impactTone: 'rose',
        rationale:
          'Switch Arjun to 4 × 20m controlled acceleration (-145 AU) and Kabir to 5 × 20m non-contact acceleration (-90 AU) for tomorrow’s 09:30 pitch session.',
        queryPrompt:
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
        actionLabel: 'Approve Drill Changes',
        actionType: 'open-training-mod-modal',
        safetyClass: 'CONSEQUENTIAL',
      },
      {
        id: 'coach-rec-2',
        title: 'Move Vikramaditya Nair to Technical Possession Group',
        metricBadge: 'Readiness 59',
        impactTone: 'amber',
        rationale:
          'Vikram shows posterior chain soreness (6/10) and ACWR 1.31. Exclude from full 11v11 high-press transition tomorrow.',
        queryPrompt: 'Why is his readiness low?',
        actionLabel: 'Open Session Planner',
        actionType: 'open-training-module',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'coach-rec-3',
        title: 'Inspect Functional Restriction on Arjun Mehta',
        metricBadge: 'RTP Stage 3/5',
        impactTone: 'sky',
        rationale:
          'Cleared for tactical build-up and ball work, but maximal deceleration & >85% Vmax sprinting remain restricted by Medical.',
        queryPrompt: 'Why is Arjun restricted?',
        actionLabel: 'Open Arjun 360',
        actionType: 'open-athlete-360',
        safetyClass: 'INFORMATIONAL',
        targetAthleteId: 'ath-arjun-mehta',
      },
    ],
    promptChips: [
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      'Who is cleared for full 11v11 tactical pressing tomorrow?',
      'Why is Arjun restricted?',
      'Why is his readiness low?',
      'Show athletes with low readiness',
      'Show me athletes with high workload and declining recovery.',
    ],
    slashCommands: [
      {
        command: '/training',
        label: 'Tomorrow 09:30 Drill Modifications',
        sampleQuery:
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      },
      {
        command: '/availability',
        label: 'Squad Tactical Availability & Restrictions',
        sampleQuery: 'Show athletes with low readiness',
      },
      {
        command: '/athlete',
        label: 'Active Player Readiness Breakdown',
        sampleQuery: 'Why is his readiness low?',
      },
      {
        command: '/restrictions',
        label: 'Functional Pitch Restrictions',
        sampleQuery: 'Why is Arjun restricted?',
      },
      {
        command: '/workload',
        label: 'High Load & Fatigue Cohort',
        sampleQuery: 'Show me athletes with high workload and declining recovery.',
      },
    ],
    headerQuickActions: [
      {
        label: 'Approve Drill Modifications (4)',
        openTrainingModModal: true,
        tone: 'amber',
      },
      {
        label: 'Check Tomorrow Squad Availability',
        query: 'Show athletes with low readiness',
        tone: 'secondary',
      },
    ],
  },

  'Sports Scientist': {
    personaTitle: 'Physiological Load, HRV & Neuromuscular Intelligence Copilot',
    activeNeedSummary:
      'Need: Mitigate ACWR spikes (>1.20) and autonomic HRV rMSSD suppression (-11% to -14%) in 3 Senior Squad athletes, and complete 8 pending September benchmark tests.',
    focus:
      'Acute-to-chronic workload ratios (ACWR), HRV rMSSD suppression, neuromuscular fatigue, and benchmark testing.',
    allowedApprovals: [
      'Approve workload & recovery monitoring flags',
      'Validate assessment test results & TID weight models',
    ],
    restrictedScope:
      'Cannot clear injured athletes for competition without Medical Lead approval.',
    proactiveRecommendations: [
      {
        id: 'sci-rec-1',
        title: 'Flag Coupled HRV & ACWR Overload in 3 Players',
        metricBadge: 'HRV ↓ 11–14%',
        impactTone: 'rose',
        rationale:
          'Arjun Mehta (ACWR 1.28, HRV -14%), Vikramaditya Nair (ACWR 1.31, CMJ -6.5%), and Rahul Singh (HRV -11%) exhibit central + peripheral fatigue.',
        queryPrompt:
          'Analyze HRV suppression and CMJ neuromuscular fatigue across Senior Squad.',
        actionLabel: 'Open Readiness & HRV',
        actionType: 'open-readiness-module',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'sci-rec-2',
        title: 'Complete 8 Pending September Field Assessments',
        metricBadge: '94% Complete',
        impactTone: 'amber',
        rationale:
          '8 athletes across Senior & U23 squads require Mobility Screen & Squat Strength validation prior to the 30 Sep cycle lock.',
        queryPrompt: 'Which 8 athletes are pending September assessment tests?',
        actionLabel: 'Open Assessments & TID',
        actionType: 'open-assessments-module',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'sci-rec-3',
        title: 'Cap High-Speed Running Volume Tomorrow (-20%)',
        metricBadge: '-90 to -160 AU',
        impactTone: 'sky',
        rationale:
          'Applying the proposed sprint caps brings Arjun Mehta’s projected ACWR from 1.28 back toward the 1.12 optimal sweet spot.',
        queryPrompt: 'Show me athletes with high workload and declining recovery.',
        actionLabel: 'Review Load Caps',
        actionType: 'open-training-mod-modal',
        safetyClass: 'CONSEQUENTIAL',
      },
    ],
    promptChips: [
      'Analyze HRV suppression and CMJ neuromuscular fatigue across Senior Squad.',
      'Show me athletes with high workload and declining recovery.',
      'Which 8 athletes are pending September assessment tests?',
      'Why is his readiness low?',
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      'Show athletes with low readiness',
    ],
    slashCommands: [
      {
        command: '/science',
        label: 'HRV, ACWR & CMJ Fatigue Analysis',
        sampleQuery:
          'Analyze HRV suppression and CMJ neuromuscular fatigue across Senior Squad.',
      },
      {
        command: '/risk',
        label: 'High Workload & Declining Recovery',
        sampleQuery: 'Show me athletes with high workload and declining recovery.',
      },
      {
        command: '/assessments',
        label: 'September Benchmark & TID Status',
        sampleQuery: 'Which 8 athletes are pending September assessment tests?',
      },
      {
        command: '/readiness',
        label: 'Low Readiness Cohort (<68)',
        sampleQuery: 'Show athletes with low readiness',
      },
      {
        command: '/athlete',
        label: 'Individual Telemetry Breakdown',
        sampleQuery: 'Why is his readiness low?',
      },
    ],
    headerQuickActions: [
      {
        label: 'Run HRV & Neuromuscular Scan',
        query:
          'Analyze HRV suppression and CMJ neuromuscular fatigue across Senior Squad.',
        tone: 'primary',
      },
      {
        label: 'Review Load Caps (4)',
        openTrainingModModal: true,
        tone: 'amber',
      },
    ],
  },

  Physiotherapist: {
    personaTitle: 'Clinical Rehabilitation & Return-to-Play (RTP) Gate Copilot',
    activeNeedSummary:
      'Need: Manage 4 active rehabilitation cases (68% avg progress), hold Arjun Mehta at RTP Stage 3/5 until NordBord symmetry reaches ≥90% (currently 88%), and enforce pitch speed ceilings.',
    focus:
      'Clinical injury diagnosis, tissue pain progression, rehabilitation adherence, and 5-stage Return-to-Play gates.',
    allowedApprovals: [
      'Approve RTP stage progression & clinical gate criteria',
      'Issue medical restrictions on high-speed running exposure',
    ],
    restrictedScope:
      'Full clinical access enabled. AI remains strictly advisory and never auto-clears athletes.',
    proactiveRecommendations: [
      {
        id: 'phys-rec-1',
        title: 'Hold Arjun Mehta at RTP Stage 3/5 (Symmetry 88%)',
        metricBadge: 'Gate Target ≥90%',
        impactTone: 'rose',
        rationale:
          'Left biceps femoris Grade 1 strain shows 88% eccentric symmetry and 3/10 pain after +22% workload spike. Keep ≤85% Vmax ceiling for 48h.',
        queryPrompt: 'Why is Arjun restricted?',
        actionLabel: 'Open Clinical & RTP Gate',
        actionType: 'open-medical-module',
        safetyClass: 'CONSEQUENTIAL',
      },
      {
        id: 'phys-rec-2',
        title: 'Enforce Isometric Quad Protocol for Devansh Kulkarni',
        metricBadge: 'Patellar Tendon',
        impactTone: 'amber',
        rationale:
          'Substitute high-deceleration agility box drills with linear tempo running + heavy slow resistance / isometric quad loading.',
        queryPrompt:
          'Show athletes with active injury, elevated workload, and declining recovery.',
        actionLabel: 'Approve Rehab Drill Swap',
        actionType: 'open-training-mod-modal',
        safetyClass: 'CONSEQUENTIAL',
      },
      {
        id: 'phys-rec-3',
        title: 'Review Kabir Rao Stage 2/5 AC Joint Progression',
        metricBadge: 'Non-Contact Pitch',
        impactTone: 'sky',
        rationale:
          'Cleared for linear conditioning (5 × 20m acceleration) while maintaining upper-body contact restriction.',
        queryPrompt: 'Summarize active rehabilitation cases and RTP gate criteria.',
        actionLabel: 'Open Medical Register',
        actionType: 'open-medical-module',
        safetyClass: 'INFORMATIONAL',
      },
    ],
    promptChips: [
      'Why is Arjun restricted?',
      'Summarize active rehabilitation cases and RTP gate criteria.',
      'Show athletes with active injury, elevated workload, and declining recovery.',
      'Who needs RTP review today?',
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      'Why is his readiness low?',
    ],
    slashCommands: [
      {
        command: '/injuries',
        label: 'Clinical Caseload & RTP Gate Summary',
        sampleQuery: 'Why is Arjun restricted?',
      },
      {
        command: '/rtp',
        label: 'Return-to-Play Gate Readiness',
        sampleQuery: 'Who needs RTP review today?',
      },
      {
        command: '/rehabLoad',
        label: 'Injured Athletes with Elevated Load',
        sampleQuery:
          'Show athletes with active injury, elevated workload, and declining recovery.',
      },
      {
        command: '/training',
        label: 'Enforce Medical Pitch Restrictions',
        sampleQuery:
          "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
      },
      {
        command: '/athlete',
        label: 'Patient Readiness & Soreness',
        sampleQuery: 'Why is his readiness low?',
      },
    ],
    headerQuickActions: [
      {
        label: 'Review RTP Gate Criteria',
        query: 'Why is Arjun restricted?',
        tone: 'primary',
      },
      {
        label: 'Enforce Pitch Restrictions (4)',
        openTrainingModModal: true,
        tone: 'amber',
      },
    ],
  },

  Nutritionist: {
    personaTitle: 'Metabolic Periodisation, Fueling & Hydration Copilot',
    activeNeedSummary:
      'Need: Correct sweat-rate hydration deficits in 12 athletes (squad mean 76%), prescribe +600ml electrolyte & carb reload for Arjun Mehta (74% hydration, +22% load), and manage rehab collagen protocols.',
    focus:
      'Caloric & macronutrient periodisation, sweat-rate hydration recovery, and body composition trends.',
    allowedApprovals: [
      'Approve fueling & electrolyte reload adjustments',
      'Modify daily supplementation schedules',
    ],
    restrictedScope:
      'Clinical injury records limited to metabolic and recovery fueling requirements.',
    proactiveRecommendations: [
      {
        id: 'nut-rec-1',
        title: 'Prescribe +600ml Electrolyte & Carb Reload for Arjun Mehta',
        metricBadge: 'Hydration 74%',
        impactTone: 'rose',
        rationale:
          'Arjun logged 2.8L / 3.5L hydration and 2,610 / 2,850 kcal (82%) during a +22% acute workload spike, compounding his -14% HRV drop.',
        queryPrompt:
          'Identify athletes with declining nutrition and hydration compliance.',
        actionLabel: 'Open Nutrition Workspace',
        actionType: 'open-nutrition-module',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'nut-rec-2',
        title: 'Verify Pre-Rehab Collagen + Vitamin C Protocol',
        metricBadge: '2 Rehab Cases',
        impactTone: 'amber',
        rationale:
          'Ensure Arjun Mehta (hamstring Stage 3) and Devansh Kulkarni (patellar tendon) ingest 15g hydrolyzed collagen 45m prior to loading.',
        queryPrompt:
          'Review anti-inflammatory & collagen supplementation for injured athletes.',
        actionLabel: 'Open Supplement Protocols',
        actionType: 'open-nutrition-module',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'nut-rec-3',
        title: 'Matchday-3 Glycogen Periodisation for Senior Squad',
        metricBadge: '84% Plan Compliance',
        impactTone: 'emerald',
        rationale:
          'Scale carbohydrate targets to 6.5g/kg ahead of tomorrow’s 09:30 High-Speed Conditioning & Sprint block.',
        queryPrompt:
          'What electrolyte and carb reload is needed for high-workload athletes?',
        actionLabel: 'Inspect Arjun 360 Fueling',
        actionType: 'open-athlete-360',
        safetyClass: 'INFORMATIONAL',
        targetAthleteId: 'ath-arjun-mehta',
      },
    ],
    promptChips: [
      'Identify athletes with declining nutrition and hydration compliance.',
      'What electrolyte and carb reload is needed for high-workload athletes?',
      'Review anti-inflammatory & collagen supplementation for injured athletes.',
      'Show body composition and lean mass trends across Senior Squad.',
      'Why is his readiness low?',
      'Show me athletes with high workload and declining recovery.',
    ],
    slashCommands: [
      {
        command: '/nutrition',
        label: 'Fueling & Hydration Compliance Scan',
        sampleQuery:
          'Identify athletes with declining nutrition and hydration compliance.',
      },
      {
        command: '/hydration',
        label: 'Sweat-Rate & Electrolyte Deficit Cohort',
        sampleQuery:
          'What electrolyte and carb reload is needed for high-workload athletes?',
      },
      {
        command: '/supplements',
        label: 'Rehab Collagen & Ergogenic Stack',
        sampleQuery:
          'Review anti-inflammatory & collagen supplementation for injured athletes.',
      },
      {
        command: '/athlete',
        label: 'Active Athlete Metabolic Profile',
        sampleQuery: 'Why is his readiness low?',
      },
      {
        command: '/workload',
        label: 'High Energy Expenditure Cohort',
        sampleQuery: 'Show me athletes with high workload and declining recovery.',
      },
    ],
    headerQuickActions: [
      {
        label: 'Scan Hydration & Fueling Deficits',
        query:
          'Identify athletes with declining nutrition and hydration compliance.',
        tone: 'primary',
      },
      {
        label: 'Review Rehab Collagen Stack',
        query:
          'Review anti-inflammatory & collagen supplementation for injured athletes.',
        tone: 'secondary',
      },
    ],
  },

  'Federation Admin': {
    personaTitle: 'Federation Eligibility, Onboarding & Governance Audit Copilot',
    activeNeedSummary:
      'Need: Complete eligibility sign-off for 3 pending athlete onboarding applications (96.2% roster verified), track 5 pending medical clearances, and audit human-in-the-loop AI logs.',
    focus:
      'Athlete eligibility verification, document compliance, coach assignments, and governance audit logs.',
    allowedApprovals: [
      'Approve athlete onboarding & verification applications',
      'Audit AI governance logs & role compliance',
    ],
    restrictedScope:
      'Clinical medical notes and tactical session modifications restricted to specialist staff.',
    proactiveRecommendations: [
      {
        id: 'adm-rec-1',
        title: 'Approve 3 Pending Athlete Onboarding Applications',
        metricBadge: '96.2% Verified',
        impactTone: 'amber',
        rationale:
          '3 U23/Senior onboarding records have completed identity & WADA document uploads and await final Federation Admin sign-off.',
        queryPrompt:
          'Show athletes pending federation eligibility verification and document sign-off.',
        actionLabel: 'Open Athlete Registry',
        actionType: 'open-registry-module',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'adm-rec-2',
        title: 'Audit Consequential AI Human-in-the-Loop Approvals',
        metricBadge: '100% Governed',
        impactTone: 'sky',
        rationale:
          'Verify that all consequential training modifications and medical restriction flags carry authorized specialist sign-off.',
        queryPrompt:
          'Summarize AI governance audit trail and human approval compliance.',
        actionLabel: 'Open Action Queue',
        actionType: 'open-action-centre',
        safetyClass: 'INFORMATIONAL',
      },
      {
        id: 'adm-rec-3',
        title: 'Export Weekly Federation Governance & Compliance Report',
        metricBadge: '184 Athletes',
        impactTone: 'emerald',
        rationale:
          'Compile federation roster verification, assessment completion (91%), and medical clearance status for ministry oversight.',
        queryPrompt: 'Prepare a weekly performance report for the Senior Squad.',
        actionLabel: 'Open Reports & Analytics',
        actionType: 'open-analytics-module',
        safetyClass: 'INFORMATIONAL',
      },
    ],
    promptChips: [
      'Show athletes pending federation eligibility verification and document sign-off.',
      'Summarize AI governance audit trail and human approval compliance.',
      'Which athletes are missing assigned coaches or medical clearance documents?',
      'Give me a performance overview of the federation.',
      'Prepare a weekly performance report for the Senior Squad.',
      'Which 8 athletes are pending September assessment tests?',
    ],
    slashCommands: [
      {
        command: '/governance',
        label: 'Eligibility, Verification & Audit Status',
        sampleQuery:
          'Show athletes pending federation eligibility verification and document sign-off.',
      },
      {
        command: '/audit',
        label: 'AI Human-in-the-Loop Governance Log',
        sampleQuery:
          'Summarize AI governance audit trail and human approval compliance.',
      },
      {
        command: '/federation',
        label: 'Federation Roster & Compliance Summary',
        sampleQuery: 'Give me a performance overview of the federation.',
      },
      {
        command: '/report',
        label: 'Generate Ministry & Board Report',
        sampleQuery: 'Prepare a weekly performance report for the Senior Squad.',
      },
      {
        command: '/assessments',
        label: 'Deadline Compliance Check',
        sampleQuery: 'Which 8 athletes are pending September assessment tests?',
      },
    ],
    headerQuickActions: [
      {
        label: 'Review Verification Queue (3)',
        query:
          'Show athletes pending federation eligibility verification and document sign-off.',
        tone: 'primary',
      },
      {
        label: 'Audit AI Governance Logs',
        query:
          'Summarize AI governance audit trail and human approval compliance.',
        tone: 'secondary',
      },
    ],
  },

  Athlete: {
    personaTitle: 'Personal Readiness, Fueling & Recovery AI Assistant',
    activeNeedSummary:
      'Need (Arjun Mehta): Understand why today’s readiness is 62/100, follow tomorrow’s 4 × 20m controlled sprint modification (Stage 3/5 hamstring protection), and close today’s -700ml hydration deficit.',
    focus:
      'Personal readiness indicators, daily training schedule, recovery metrics, and subjective wellness logs.',
    allowedApprovals: [
      'Submit daily morning wellness survey & RPE scores',
      'Log personal hydration & post-workout nutrition intake',
    ],
    restrictedScope:
      'Restricted to personal biometric records and assigned training plans only.',
    proactiveRecommendations: [
      {
        id: 'ath-rec-1',
        title: 'Tomorrow 09:30 Pitch Modification: 4 × 20m Controlled Sprint',
        metricBadge: '≤85% Vmax Cap',
        impactTone: 'amber',
        rationale:
          'Protects your Stage 3/5 hamstring recovery (currently 88% strength symmetry) while your morning HRV is down 14% (58ms vs 67ms).',
        queryPrompt: 'Why is my sprint prescription modified for tomorrow?',
        actionLabel: 'Explain My Sprint Cap',
        actionType: 'open-athlete-360',
        safetyClass: 'INFORMATIONAL',
        targetAthleteId: 'ath-arjun-mehta',
      },
      {
        id: 'ath-rec-2',
        title: 'Drink +600ml Sodium-Electrolyte Fluid Before 18:00',
        metricBadge: '2.8L / 3.5L Logged',
        impactTone: 'rose',
        rationale:
          'Closing your 700ml hydration gap and taking 15g Vitamin-C collagen 45m before physio accelerates tendon & muscle recovery.',
        queryPrompt:
          'What are my hydration and fueling targets before today session?',
        actionLabel: 'Log My Hydration',
        actionType: 'open-nutrition-module',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'ath-rec-3',
        title: 'Target ≥7h 45m Sleep Tonight to Rebound HRV',
        metricBadge: '6h 10m Avg (3d)',
        impactTone: 'sky',
        rationale:
          'Your 3-night sleep average (6h 10m) is the primary driver of your readiness dip from 81 → 62.',
        queryPrompt: 'Explain my morning recovery telemetry and HRV baseline.',
        actionLabel: 'View My Recovery 360',
        actionType: 'open-athlete-360',
        safetyClass: 'INFORMATIONAL',
        targetAthleteId: 'ath-arjun-mehta',
      },
    ],
    promptChips: [
      'Explain my morning recovery telemetry and HRV baseline.',
      'What are my hydration and fueling targets before today session?',
      'Why is my sprint prescription modified for tomorrow?',
      'How close am I to Stage 4 Return-to-Play clearance?',
      'Why is my readiness 62 today?',
      'What supplements should I take before afternoon rehabilitation?',
    ],
    slashCommands: [
      {
        command: '/my-readiness',
        label: 'Explain My Readiness & HRV Today',
        sampleQuery: 'Explain my morning recovery telemetry and HRV baseline.',
      },
      {
        command: '/my-fueling',
        label: 'My Daily Hydration & Meal Targets',
        sampleQuery:
          'What are my hydration and fueling targets before today session?',
      },
      {
        command: '/my-training',
        label: 'Why My Tomorrow Sprints Are Modified',
        sampleQuery: 'Why is my sprint prescription modified for tomorrow?',
      },
      {
        command: '/my-rtp',
        label: 'My Stage 3/5 Hamstring Progress',
        sampleQuery: 'How close am I to Stage 4 Return-to-Play clearance?',
      },
    ],
    headerQuickActions: [
      {
        label: 'Explain My Recovery Baseline',
        query: 'Explain my morning recovery telemetry and HRV baseline.',
        tone: 'primary',
      },
      {
        label: 'Review Today Fueling & Hydration',
        query: 'What are my hydration and fueling targets before today session?',
        tone: 'secondary',
      },
    ],
  },

  'Operations Team': {
    personaTitle: 'Facility Readiness, Wearable Sensor Fleet & Logistics Copilot',
    activeNeedSummary:
      'Need: Swap 3 low-battery U23 Catapult GPS pods before 09:30 kick-off, configure Pitch A Lane 2 for 4 modified-sprint athletes, and prep 4 Hydrotherapy/Cryo recovery slots for 11:45.',
    focus:
      'Facility capacity, pitch surface condition, sports technology calibration, and logistics travel manifests.',
    allowedApprovals: [
      'Confirm pitch & gym maintenance schedules',
      'Sign off on travel manifest & equipment logistics orders',
    ],
    restrictedScope:
      'Medical diagnostics and tactical coach notes restricted to high performance staff.',
    proactiveRecommendations: [
      {
        id: 'ops-rec-1',
        title: 'Swap & Sync 3 U23 Catapult Vector S7 GPS Pods',
        metricBadge: '39/42 Pods Ready',
        impactTone: 'amber',
        rationale:
          'Pods #14, #19, and #22 on U23 Dock #2 are at 42% battery with pending firmware sync ahead of tomorrow’s 09:30 pitch block.',
        queryPrompt:
          'Check Catapult GPS pod battery, firmware sync, and timing gate status.',
        actionLabel: 'Verify Sensor Fleet',
        actionType: 'open-action-centre',
        safetyClass: 'RECOMMENDATION',
      },
      {
        id: 'ops-rec-2',
        title: 'Configure Pitch A Lane 2 & Brower 30m Timing Gates',
        metricBadge: '71g Clegg Optimal',
        impactTone: 'emerald',
        rationale:
          'Set up 20m controlled acceleration cones on Pitch A Lane 2 for the 4 load-modified players and verify Pitch B optical gates.',
        queryPrompt:
          'What facility, pitch, and hydrotherapy setups are needed for tomorrow?',
        actionLabel: 'Open Session Logistics',
        actionType: 'open-training-module',
        safetyClass: 'INFORMATIONAL',
      },
      {
        id: 'ops-rec-3',
        title: 'Prepare 11:45 Contrast Hydrotherapy & Cryo Rotation',
        metricBadge: '4 High-Load Slots',
        impactTone: 'sky',
        rationale:
          'Pre-chill contrast pools (10°C / 38°C) for Arjun Mehta, Vikramaditya Nair, Rahul Singh, and Devansh Kulkarni immediately post-pitch.',
        queryPrompt:
          'What facility, pitch, and hydrotherapy setups are needed for tomorrow?',
        actionLabel: 'View Recovery Schedule',
        actionType: 'open-readiness-module',
        safetyClass: 'RECOMMENDATION',
      },
    ],
    promptChips: [
      'Check Catapult GPS pod battery, firmware sync, and timing gate status.',
      'What facility, pitch, and hydrotherapy setups are needed for tomorrow?',
      'Summarize travel manifest and equipment logistics for away fixture.',
      'Which sessions require modified pitch lane setup tomorrow?',
      'Give me a performance overview of the federation.',
      "Should we modify tomorrow's high-intensity session for athletes at elevated risk?",
    ],
    slashCommands: [
      {
        command: '/ops',
        label: 'Facility, Pitch & Sensor Fleet Briefing',
        sampleQuery:
          'What facility, pitch, and hydrotherapy setups are needed for tomorrow?',
      },
      {
        command: '/sensors',
        label: 'Catapult GPS & Timing Gate Diagnostics',
        sampleQuery:
          'Check Catapult GPS pod battery, firmware sync, and timing gate status.',
      },
      {
        command: '/hydro',
        label: 'Cryo & Hydrotherapy Recovery Booking',
        sampleQuery:
          'What facility, pitch, and hydrotherapy setups are needed for tomorrow?',
      },
      {
        command: '/logistics',
        label: 'Travel Manifest & Kit Allocation',
        sampleQuery:
          'Summarize travel manifest and equipment logistics for away fixture.',
      },
    ],
    headerQuickActions: [
      {
        label: 'Check GPS Fleet & Pitch Status',
        query:
          'Check Catapult GPS pod battery, firmware sync, and timing gate status.',
        tone: 'primary',
      },
      {
        label: 'Prep Tomorrow Facility Setup',
        query:
          'What facility, pitch, and hydrotherapy setups are needed for tomorrow?',
        tone: 'secondary',
      },
    ],
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


