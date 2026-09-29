export type UserRole =
  | 'Performance Director'
  | 'Coach'
  | 'Sports Scientist'
  | 'Physiotherapist'
  | 'Nutritionist'
  | 'Federation Admin'
  | 'Athlete'
  | 'Operations Team';

export type AthleteStatus = 'Attention' | 'Monitor' | 'Ready' | 'Restricted' | 'Unavailable';

export type AthleteTrainingStatus =
  | 'ACTIVE'
  | 'PENDING'
  | 'RESTRICTED'
  | 'INJURED'
  | 'IN REHAB'
  | 'RETURN TO PLAY'
  | 'INACTIVE';

export type VerificationStatus =
  | 'Verified'
  | 'Pending'
  | 'Rejected'
  | 'Incomplete'
  | 'Changes Requested';

export type MedicalClearanceStatus =
  | 'Cleared'
  | 'Pending'
  | 'Restricted'
  | 'Expired';

export type DocumentCategory =
  | 'Identity'
  | 'Medical'
  | 'Insurance'
  | 'Contracts'
  | 'Certifications'
  | 'Performance';

export type DocumentStatus =
  | 'Verified'
  | 'Pending Review'
  | 'Expiring Soon'
  | 'Expired';

export type TimelineCategory =
  | 'Training'
  | 'Medical'
  | 'Sports Science'
  | 'Assessment'
  | 'AI'
  | 'Administrative';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Elevated';
export type LoadLevel = 'Low' | 'Normal' | 'Moderate' | 'High';
export type SessionIntensity = 'Low' | 'Moderate' | 'High';
export type SessionStatus = 'Completed' | 'Upcoming' | 'In Progress';
export type InjuryStage =
  | 'In Rehabilitation'
  | 'Return-to-Play'
  | 'Escalated'
  | 'Assessment'
  | 'Recovery'
  | 'Monitoring'
  | 'Rehabilitation';

export type InjurySeverity = 'Minor' | 'Moderate' | 'Severe' | 'Critical';

export type BodyRegionSeverity =
  | 'Healthy'
  | 'At Risk'
  | 'Minor'
  | 'Moderate'
  | 'Severe';

export type BodyRegionId =
  | 'Head'
  | 'Neck'
  | 'Shoulder — Left'
  | 'Shoulder — Right'
  | 'Upper Arm — Left'
  | 'Upper Arm — Right'
  | 'Elbow — Left'
  | 'Elbow — Right'
  | 'Forearm — Left'
  | 'Forearm — Right'
  | 'Wrist — Left'
  | 'Wrist — Right'
  | 'Chest'
  | 'Upper Back'
  | 'Lower Back'
  | 'Core'
  | 'Hip — Left'
  | 'Hip — Right'
  | 'Quadriceps — Left'
  | 'Quadriceps — Right'
  | 'Hamstring — Left'
  | 'Hamstring — Right'
  | 'Knee — Left'
  | 'Knee — Right'
  | 'Calf — Left'
  | 'Calf — Right'
  | 'Ankle — Left'
  | 'Ankle — Right'
  | 'Foot — Left'
  | 'Foot — Right';

export interface MedicalNoteRecord {
  id: string;
  injuryId: string;
  athleteId: string;
  noteType: 'Assessment' | 'Treatment' | 'Progress' | 'Restriction' | 'Clearance';
  note: string;
  author: string;
  authorRole: string;
  date: string;
}

export interface RehabStageDetail {
  stageNumber: number;
  title: string;
  status: 'Complete' | 'Current' | 'Pending';
  objectives: string[];
  exercises: string[];
  tests: string[];
  completionCriteria: string[];
  assignedProfessional: string;
}

export interface RehabSessionRecord {
  id: string;
  injuryId: string;
  athleteId: string;
  date: string;
  professional: string;
  focus: string;
  exercises: string[];
  targetLoad: string;
  painBefore: number;
  painAfter: number;
  notes: string;
  status: 'Completed' | 'Scheduled';
}

export interface RehabPlanRecord {
  id: string;
  injuryId: string;
  athleteId: string;
  athleteName: string;
  title: string;
  currentStage: number;
  totalStages: number;
  progressPct: number;
  trackStatus: 'On Track' | 'At Risk' | 'Delayed';
  currentFocus: string;
  nextMilestone: string;
  targetDate: string;
  stages: RehabStageDetail[];
  sessions: RehabSessionRecord[];
}

export interface WearableTelemetry {
  nightlyHrvMs: number;
  hrvBaselineMs: number;
  restingHeartRateBpm: number;
  sleepEfficiencyPct: number;
  deepSleepMinutes: number;
  lastSyncTime: string;
  source: 'Oura Ring Gen3' | 'Whoop 4.0' | 'Catapult Vector' | 'Apple Watch Ultra';
}

export interface PersonalDrillOrder {
  id: string;
  drillTitle: string;
  sprintSpeedCapPct: number; // e.g. 80% Vmax
  prescribedHydrationMl: number; // e.g. 500
  coachTacticalConstraint: string;
  physioPrecaution: string;
}

export interface PositiveMovementPrescription {
  athleteId: string;
  permittedActivities: string[];
  prohibitedActivities: string[];
  maxVelocityKmh: number;
  contactAllowed: boolean;
  lastUpdatedBy: string;
  effectiveDate: string;
}

export interface RTPGateCriteriaState {
  painThresholdMet: boolean; // Pain <= 2/10 or <= 3/10 controlled
  strengthSymmetryMet: boolean; // >= 90%
  runningToleranceMet: boolean;
  functionalTestMet: boolean;
  medicalClearanceMet: boolean;
  limbSymmetryIndexPct?: number; // e.g. 88%
  dynamicPainScore?: number; // e.g. 1/10
  evidenceFileName?: string; // e.g. ForcePlate_Report.pdf
}

export interface MedicalRiskAlertItem {
  id: string;
  athleteId: string;
  athleteName: string;
  tier: 'ELEVATED RISK' | 'MONITOR';
  risk: 'High' | 'Moderate';
  reason: string;
  suggestedAction: string;
  status: 'Active' | 'Reviewed' | 'Dismissed' | 'Follow-up Assigned';
  dismissReason?: string;
  assignedTo?: string;
}

export interface MedicalOperationalAlert {
  id: string;
  type:
    | 'New injury reported'
    | 'RTP assessment due'
    | 'Medical clearance expiring'
    | 'Pain score increased'
    | 'Rehab milestone missed'
    | 'AI risk escalation';
  title: string;
  detail: string;
  timestamp: string;
  severity: 'high' | 'medium' | 'info';
  athleteId: string;
  injuryId?: string;
  acknowledged: boolean;
}

export interface WellnessProfile {
  athleteId: string;
  athleteName: string;
  sleep: number; // 1-10
  stress: number; // 1-10
  soreness: number; // 1-10
  fatigue: number; // 1-10
  mood: number; // 1-10
  recovery: number; // 1-10
  trend7d: { day: string; composite: number; sleep: number; fatigue: number; recovery: number }[];
}

export type NavItemId =
  | 'command-center'
  | 'athlete-registry'
  | 'athlete-lifecycle'
  | 'athlete-360'
  | 'enrollment'
  | 'verification'
  | 'periodisation'
  | 'sessions'
  | 'exercises'
  | 'workload'
  | 'injury-intelligence'
  | 'injury-register'
  | 'rehabilitation'
  | 'return-to-play'
  | 'readiness'
  | 'fatigue'
  | 'gps-wearables'
  | 'recovery'
  | 'nutrition'
  | 'nutrition-plans'
  | 'nutrition-hydration'
  | 'nutrition-supplements'
  | 'nutrition-body-composition'
  | 'assessments-tid'
  | 'assessments-tests'
  | 'assessments-benchmarks'
  | 'assessments-talent'
  | 'assessments-field-testing'
  | 'analytics-bi'
  | 'analytics-federation'
  | 'analytics-sport'
  | 'analytics-program'
  | 'analytics-squad'
  | 'analytics-athlete'
  | 'analytics-reports'
  | 'ai-copilot'
  | 'ai-action-centre'
  | 'ai-risk-centre'
  | 'ai-automation'
  | 'ai-audit'
  | 'settings'
  | 'camps'
  | 'manifests'
  | 'cargo'
  | 'facilities'
  | 'operations';

export interface HierarchyContext {
  federation: string;
  sport: string;
  program: string;
  squad: string;
  date: string;
}

export interface AthleteDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  status: DocumentStatus;
  expiry: string;
  uploadedBy: string;
  lastUpdated: string;
  fileSize: string;
  notes?: string;
}

export interface AthleteTimelineEvent {
  id: string;
  date: string;
  time?: string;
  title: string;
  description: string;
  category: TimelineCategory;
  actor: string;
  detailNotes: string;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  role: UserRole | string;
  action: string;
}

export interface KeySignalItem {
  id: 'sleep' | 'hrv' | 'acuteLoad' | 'wellness';
  label: string;
  value: string;
  delta: string;
  direction: 'up' | 'down';
  isNegativeSignal: boolean;
  baseline: string;
  explanation: string;
}

export interface PerformanceMetricSeries {
  label: string;
  unit: string;
  current: string;
  squadAvg: string;
  benchmark: string;
  personalBest: string;
  cycles: { cycle: string; value: number; squadAvg: number; benchmark: number }[];
}

export interface ProfileCompletionBreakdown {
  basicInfo: boolean;
  sportInfo: boolean;
  documents: boolean;
  coachAssignment: boolean;
  medicalClearance: boolean;
  emergencyContact: boolean;
}

export interface CoachProfile {
  id: string;
  name: string;
  role: string;
  sport: string;
  squad: string;
  currentAthletesCount: number;
  specialization: string;
}

export interface Athlete {
  id: string;
  athleteId: string; // e.g. ATH-1042
  name: string;
  code: string;
  dob: string;
  gender: string;
  nationality: string;
  email: string;
  phone: string;
  emergencyContact: string;
  sport: string;
  discipline: string;
  program: string;
  squad: string;
  subSquad: string;
  position: string;
  jerseyNumber: number;
  age: number;
  heightCm: number;
  weightKg: number;
  coach: string;
  coachRole: string;
  readiness: number; // 0-100
  readinessDelta: number; // vs 7d baseline
  injuryRisk: RiskLevel;
  trainingLoad: LoadLevel;
  trainingLoadPct: number; // e.g. 87%
  acuteLoadAu: number;
  chronicLoadAu: number;
  acwr: number;
  recovery: number; // 0-100
  hrvMs: number;
  hrvBaselineMs: number;
  sleepHours: number;
  sleepFormatted: string;
  wellnessScore: number; // out of 10
  sorenessScore: number; // 1-10
  status: AthleteStatus; // Command center status
  trainingStatus: AthleteTrainingStatus; // Registry & 360 operational status
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  medicalStatus: MedicalClearanceStatus;
  profileCompletion: number;
  profileCompletionBreakdown: ProfileCompletionBreakdown;
  lastUpdated: string;
  riskSignals: string[];
  previousInjuryHistory: string;
  nutritionCompliancePct: number;
  hydrationStatus: 'Optimal' | 'Mild Dehydration' | 'Monitor';
  readinessHistory14d: number[];
  loadHistory14d: number[];
  aiSummary: string;
  keySignals: KeySignalItem[];
  performanceScore: number;
  aiPerformanceInsight: string;
  performanceMetrics: {
    sprint30m: PerformanceMetricSeries;
    cmj: PerformanceMetricSeries;
    yoYo: PerformanceMetricSeries;
    strength: PerformanceMetricSeries;
  };
  documents: AthleteDocument[];
  timeline: AthleteTimelineEvent[];
  auditTrail: AuditTrailEntry[];
  recentSessions: {
    sessionId: string;
    title: string;
    rpe: number;
    loadAu: number;
    highSpeedMeters: number;
  }[];
  medicalNote: string;
  wadaWhereabouts?: {
    poolTier: 'International RTP' | 'National RTP' | 'General Testing Pool';
    filingQuarter: string;
    filingStatus: 'Compliant' | 'Pending Review' | 'Deadline Overdue';
    dailyWindowTime: string;
    dailyLocation: string;
    nextDeadline: string;
    missedTestsCount12m: number;
    tueActive: boolean;
    tueCertificate?: {
      certificateNumber: string;
      substance: string;
      approvedUntil: string;
      grantingBody: string;
    };
  };
  wearableTelemetry?: WearableTelemetry;
  personalDrillOrders?: PersonalDrillOrder[];
  positivePrescription?: PositiveMovementPrescription;
}

export interface Squad {
  id: string;
  name: string;
  sport: string;
  program: string;
  headCoach: string;
  totalAthletes: number;
  activeAthletes: number;
  attentionCount: number;
  avgReadiness: number;
  avgAcwr: number;
  trainingLoadStatus: LoadLevel;
}

export interface TrainingSession {
  id: string;
  title: string;
  category: 'Conditioning' | 'Strength' | 'Tactical' | 'Recovery' | 'Speed' | 'Technical';
  time: string;
  durationMin: number;
  coach: string;
  coachRole: string;
  squad: string;
  pitchOrVenue: string;
  attendance: number;
  attendedCount: number;
  scheduledCount: number;
  intensity: SessionIntensity;
  status: SessionStatus;
  plannedLoadAu: number;
  actualLoadAu?: number;
  targetHighSpeedM: number;
  objectives: string[];
  drills: {
    name: string;
    duration: string;
    targetZone: string;
  }[];
  modifiedAthletes: {
    athleteId: string;
    athleteName: string;
    modification: string;
  }[];
  notes: string;
  attendedAthletes?: string[];
  tacticalUnit?: 'Starting XI' | 'Defensive Unit' | 'Midfield Engine' | 'Attacking Line' | 'Rehab Group' | 'Full Squad';
  livePitchsideSubstitutions?: {
    athleteId: string;
    athleteName: string;
    fromDrill: string;
    toModification: string;
    timestamp: string;
  }[];
  drillClipUrl?: string;
}

export interface Injury {
  id: string;
  athleteId: string;
  athleteName: string;
  sport: string;
  position: string;
  squad: string;
  bodyPart: 'Hamstring' | 'Ankle' | 'Shoulder' | 'Knee' | 'Groin' | string;
  bodyRegion: BodyRegionId;
  bodyRegionDisplay: string;
  side: 'Left' | 'Right' | 'Bilateral';
  injuryTitle: string;
  diagnosis: string;
  grade: string;
  severity: InjurySeverity;
  painScore: number; // 0-10
  stage: InjuryStage;
  rtpStage: number; // 1 to 5
  rtpStageName: string;
  rehabProgressPct: number;
  medicalStatus: MedicalClearanceStatus;
  onsetDate: string;
  estimatedRtpDate: string;
  daysToRtp: number;
  leadClinician: string;
  rehabCompliancePct: number;
  mechanism: string;
  initialAssessment: string;
  restrictions: string;
  escalationReason?: string;
  currentProtocol: string;
  lastUpdated: string;
  gateCriteria: RTPGateCriteriaState;
  overrideApproved?: boolean;
  overrideDetails?: {
    reason: string;
    authorisedBy: string;
    timestamp: string;
  };
  medicalNotes: MedicalNoteRecord[];
  positivePrescription?: PositiveMovementPrescription;
}

export interface ReadinessTierDistribution {
  tier: 'Ready' | 'Monitor' | 'Restricted' | 'Unavailable';
  percentage: number;
  athleteCount: number;
  description: string;
  rangeLabel: string;
}

export interface AIRecommendation {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  statement: string;
  explanation: string;
  signals: string[];
  targetType: 'Squad' | 'Athlete' | 'Cohort';
  targetLabel: string;
  linkedAthleteId?: string;
  expectedImpact: string;
  applied: boolean;
  appliedAt?: string;
  appliedBy?: string;
}

export interface AppNotification {
  id: string;
  category:
    | 'AI Risk Alert'
    | 'Medical'
    | 'Training'
    | 'Assessment'
    | 'Nutrition'
    | 'Governance'
    | 'Operations'
    | 'Science';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  severity: 'high' | 'medium' | 'info';
  roles?: UserRole[];
  actionLabel?: string;
  linkedAthleteId?: string;
  linkedSessionId?: string;
  targetNav?: NavItemId;
}

export interface AssessmentRecord {
  id: string;
  title: string;
  category: 'Neuromuscular' | 'Metabolic' | 'Strength' | 'Return-to-Play' | 'Body Composition';
  squad: string;
  dueDate: string;
  completedCount: number;
  totalCount: number;
  status: 'Pending' | 'In Progress' | 'Completed';
  leadScientist: string;
  flaggedAthletesCount: number;
}

export interface DailyAnalyticsPoint {
  date: string;
  shortDate: string;
  readinessPct: number;
  trainingLoadAu: number;
  chronicLoadAu: number;
  acwr: number;
  activeInjuries: number;
  elevatedRiskCount: number;
  attendancePct: number;
}

/* =========================================================
 * 32. DATA MODEL EXTENSION (NUTRITION, ASSESSMENTS, ANALYTICS)
 * ========================================================= */

export type NutritionGoal =
  | 'Performance'
  | 'Recovery'
  | 'Weight Management'
  | 'Body Composition'
  | 'Competition Preparation'
  | 'Performance + Recovery';

export interface Meal {
  id: string;
  name:
    | 'Breakfast'
    | 'Pre-Training'
    | 'Post-Training'
    | 'Lunch'
    | 'Snack'
    | 'Dinner'
    | 'Recovery';
  time: string;
  menuSummary: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  consumed: boolean;
}

export interface HydrationLog {
  id: string;
  athleteId: string;
  time: string;
  amountMl: number;
  beverageType: string;
}

export interface Supplement {
  id: string;
  athleteId: string;
  name: string;
  purpose: 'Recovery' | 'Hydration' | 'General' | 'Performance';
  dosage: string;
  schedule: string;
  compliancePct: number;
  status: 'Active' | 'Paused';
}

export interface BodyCompositionPoint {
  week: string;
  weightKg: number;
  bodyFatPct: number;
  leanMassKg: number;
  bmi: number;
}

export interface BodyComposition {
  athleteId: string;
  athleteName: string;
  weightKg: number;
  bodyFatPct: number;
  leanMassKg: number;
  bmi: number;
  statusLabel: 'Stable' | 'Lean Gain' | 'Monitor';
  aiObservation: string;
  history8w: BodyCompositionPoint[];
}

export interface NutritionPlan {
  id: string;
  athleteId: string;
  athleteName: string;
  sport: string;
  squad: string;
  planName: string;
  goal: NutritionGoal;
  trainingPhase: string;
  targetCalories: number;
  currentCalories: number;
  targetProteinG: number;
  currentProteinG: number;
  targetCarbsG: number;
  currentCarbsG: number;
  targetFatG: number;
  currentFatG: number;
  targetHydrationL: number;
  currentHydrationL: number;
  mealFrequency: number;
  startDate: string;
  endDate: string;
  compliancePct: number;
  hydrationCompliancePct: number;
  supplementCompliancePct: number;
  bodyCompStatus: 'Stable' | 'Lean Gain' | 'Monitor';
  status: 'On Track' | 'Monitor' | 'Review Required';
  compliance7d: { day: string; compliancePct: number; hydrationPct: number }[];
  meals: Meal[];
}

export type TestCategory =
  | 'Speed'
  | 'Strength'
  | 'Power'
  | 'Endurance'
  | 'Mobility'
  | 'Anthropometry'
  | 'Sport-Specific';

export interface Test {
  id: string;
  name: string;
  category: TestCategory;
  unit: string;
  benchmark: string;
  numericBenchmark: number;
  lowerIsBetter: boolean;
  frequency: string;
  status: 'Active' | 'Scheduled';
}

export interface AssessmentProgram {
  id: string;
  programName: string;
  sport: string;
  squad: string;
  assessmentPeriod: string;
  tests: string[];
  evaluator: string;
  deadline: string;
  athleteIds: string[];
  status: 'Active' | 'Scheduled' | 'Completed';
}

export interface TestResult {
  id: string;
  testId: string;
  testName: string;
  category: TestCategory;
  unit: string;
  athleteId: string;
  athleteName: string;
  squad: string;
  currentResult: number;
  previousResult: number;
  personalBest: number;
  squadAverage: number;
  programBenchmark: number;
  nationalBenchmark: number;
  lowerIsBetter: boolean;
  improvementPct: number;
  progressionStatus: 'Improving' | 'Stable' | 'Declining';
  cycleHistory: { cycle: string; value: number; squadAvg: number; benchmark: number }[];
  fieldStatus: 'Scheduled' | 'In Progress' | 'Completed';
  validated: boolean;
}

export interface Benchmark {
  testId: string;
  testName: string;
  unit: string;
  lowerIsBetter: boolean;
  athleteValue: number;
  squadAverage: number;
  programBenchmark: number;
  nationalBenchmark: number;
  previousCycleAthleteValue: number;
}

export interface TalentScoringWeights {
  speed: number;
  power: number;
  endurance: number;
  strength: number;
  sportSpecific: number;
}

export interface TalentProfile {
  id: string;
  athleteId: string;
  athleteName: string;
  ageGroup: string;
  sport: string;
  squad: string;
  position: string;
  scores: {
    speed: number;
    power: number;
    endurance: number;
    strength: number;
    sportSpecific: number;
  };
  basePerformanceIndex: number;
  benchmarkAlignment: 'High' | 'Moderate' | 'Developing';
  developmentPriority: 'Acceleration & RSA Focus' | 'Strength & Power Progression' | 'Tactical Transition';
  status: 'Active Candidate' | 'Under Review' | 'Academy Pathway';
  developmentAreas: string[];
  strengths: string[];
  suggestedDevelopmentFocus: string;
  assessmentEvidence: string[];
}

export type AnalyticsHierarchyLevel =
  | 'Federation'
  | 'Sport'
  | 'Program'
  | 'Squad'
  | 'Athlete';

export interface AnalyticsMetric {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  drilldownType?: 'readiness' | 'injuries' | 'compliance' | 'workload';
}

export interface ReportConfiguration {
  reportName: string;
  scope: string;
  metrics: string[];
  dateRange: string;
  filters: string;
  format: 'PDF' | 'Excel' | 'CSV';
}

export interface Report extends ReportConfiguration {
  id: string;
  createdAt: string;
  createdBy: string;
  status: 'Ready' | 'Scheduled';
}

export interface AIInsight {
  id: string;
  title: string;
  statement: string;
  signals: string[];
  actionLabel: string;
  targetNav: NavItemId;
  linkedAthleteId?: string;
}

/* =========================================================
 * AI COPILOT & AI-NATIVE OPERATIONS LAYER
 * ========================================================= */

export type AIConfidenceLevel = 'High' | 'Moderate' | 'Low';

export type AIActionSafetyClass =
  | 'INFORMATIONAL'
  | 'RECOMMENDATION'
  | 'CONSEQUENTIAL';

export interface AIEvidenceMetric {
  domain: 'Training' | 'Recovery' | 'HRV' | 'Sleep' | 'Medical' | 'Nutrition' | 'Assessments';
  label: string;
  deltaOrValue: string;
  detail: string;
  tone: 'emerald' | 'amber' | 'rose' | 'sky';
}

export interface AIEvidenceBundle {
  id: string;
  title: string;
  subjectLabel: string;
  confidence: AIConfidenceLevel;
  generatedAt: string;
  metrics: AIEvidenceMetric[];
  clinicalDisclaimer?: string;
}

export interface AITrainingModificationItem {
  id: string;
  athleteId: string;
  athleteName: string;
  squad: string;
  riskLevel: 'High' | 'Moderate' | 'Low';
  readiness: number;
  loadChange: string;
  currentPrescription: string;
  proposedPrescription: string;
  reason: string;
  expectedLoadImpact: string;
  medicalTrainingContext: string;
  approved: boolean;
}

export interface AICopilotTableRow {
  id: string;
  athleteId?: string;
  athleteName: string;
  squad: string;
  col1Label: string;
  col1Value: string;
  col2Label: string;
  col2Value: string;
  riskOrStatus: string;
  riskTone: 'rose' | 'amber' | 'emerald' | 'sky';
}

export interface AICopilotActionButton {
  id: string;
  label: string;
  safetyClass: AIActionSafetyClass;
  actionType:
    | 'open-training-mod-modal'
    | 'open-athlete-360'
    | 'open-training-module'
    | 'open-medical-module'
    | 'open-assessments-module'
    | 'open-analytics-module'
    | 'open-nutrition-module'
    | 'open-registry-module'
    | 'open-readiness-module'
    | 'open-risk-centre'
    | 'open-action-centre'
    | 'open-report-preview'
    | 'open-coach-brief'
    | 'open-ai-summary'
    | 'create-followup';
  targetAthleteId?: string;
}

export interface AICopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  timestamp: string;
  queryText?: string;
  contextSnapshot?: {
    athleteName: string;
    sport: string;
    squad: string;
    role: UserRole;
    moduleName: string;
  };
  // Structured AI Explanation Pattern (Section 5)
  answerTitle?: string;
  answerStatement?: string;
  confidence?: AIConfidenceLevel;
  safetyClass?: AIActionSafetyClass;
  evidenceSummary?: { label: string; value: string; tone?: 'rose' | 'amber' | 'emerald' | 'sky' }[];
  evidenceBundle?: AIEvidenceBundle;
  interpretation?: string;
  recommendation?: string;
  tableHeaders?: [string, string, string, string, string];
  tableRows?: AICopilotTableRow[];
  isUncertaintyState?: boolean;
  uncertaintyAlternative?: string;
  generatedReportPreview?: {
    title: string;
    scope: string;
    executiveSummary: string;
    sections: { heading: string; summary: string }[];
    keyRisks: string[];
    recommendedActions: string[];
  };
  actions?: AICopilotActionButton[];
  followUpSuggestions?: string[];
}

export type AIActionStatus =
  | 'Pending Review'
  | 'Approved'
  | 'Rejected'
  | 'Applied'
  | 'Expired';

export interface AIActionCentreItem {
  id: string;
  priority: 'High' | 'Medium' | 'Low';
  safetyClass: AIActionSafetyClass;
  source:
    | 'AI Workload & Readiness Engine'
    | 'AI Medical Risk Monitor'
    | 'AI Assessment & TID Engine'
    | 'AI Nutrition Monitor'
    | 'AI Governance & Compliance Engine'
    | 'AI Facility & Operations Engine';
  affectedAthleteId?: string;
  affectedAthleteName: string;
  squad: string;
  recommendation: string;
  detail: string;
  approverRole: string;
  targetRoles?: UserRole[];
  status: AIActionStatus;
  confidence: AIConfidenceLevel;
  createdAt: string;
  evidenceBundle: AIEvidenceBundle;
}

export type AIRiskCategory =
  | 'Injury Risk Signals'
  | 'Workload Risk'
  | 'Recovery Risk'
  | 'Performance Decline'
  | 'Operational Risk';

export interface AIRiskSignalCard {
  id: string;
  category: AIRiskCategory;
  athleteId?: string;
  athleteName: string;
  squad: string;
  riskLevel: 'Elevated' | 'High' | 'Moderate';
  signals: string[];
  confidence: AIConfidenceLevel;
  recommendedAction: string;
  targetNav: NavItemId;
  targetRoles?: UserRole[];
  feedbackStatus?: 'Helpful' | 'Not Relevant' | 'Dismissed';
  dismissReason?: 'Not relevant' | 'Already addressed' | 'Incorrect data' | 'Other';
  evidenceBundle: AIEvidenceBundle;
}

export interface AIWorkflowAutomationRule {
  id: string;
  name: string;
  whenCondition1: string;
  andCondition2: string;
  thenAction: string;
  targetRole: string;
  enabled: boolean;
  lastTriggered: string;
  triggerCount7d: number;
}

export interface AIAutomationAuditEvent {
  id: string;
  ruleId: string;
  trigger: string;
  dataUsed: string[];
  recommendation: string;
  humanReviewStatus: string;
  action: string;
  timestamp: string;
  athleteName: string;
}

export interface AIAuditTrailRecord {
  id: string;
  query: string;
  recommendation: string;
  evidenceAccessed: string[];
  reviewedBy: string;
  reviewerRole: UserRole | string;
  decision: 'Approved' | 'Rejected' | 'Advisory Reviewed' | 'Modified';
  actionTaken: string;
  timestamp: string;
  safetyClass: AIActionSafetyClass;
}

export interface AIDataFreshnessItem {
  id: string;
  domain: 'Readiness' | 'GPS' | 'Medical' | 'Nutrition' | 'AI Insight' | 'Assessments';
  lastUpdated: string;
  minutesAgo: number;
  isStale: boolean;
  sourceSystem: string;
}


