import {
  AthleteDocument,
  AthleteTimelineEvent,
  AuditTrailEntry,
  CoachProfile,
  KeySignalItem,
  PerformanceMetricSeries,
} from '../types/usi';

export const AVAILABLE_COACHES: CoachProfile[] = [
  {
    id: 'coach-vikram',
    name: 'Vikram Sharma',
    role: 'Head Coach',
    sport: 'Football',
    squad: 'Senior Squad',
    currentAthletesCount: 18,
    specialization: 'Tactical Periodisation & Match Strategy',
  },
  {
    id: 'coach-amit',
    name: 'Amit Verma',
    role: 'Assistant Coach',
    sport: 'Football',
    squad: 'U23',
    currentAthletesCount: 14,
    specialization: 'Transition Phase & Positional Development',
  },
  {
    id: 'coach-vance',
    name: 'M. Vance',
    role: 'Head of Conditioning',
    sport: 'Football',
    squad: 'Senior Squad',
    currentAthletesCount: 24,
    specialization: 'High-Speed Running & Metabolic Conditioning',
  },
  {
    id: 'coach-lindqvist',
    name: 'K. Lindqvist',
    role: 'Lead S&C Specialist',
    sport: 'Football',
    squad: 'Senior Squad',
    currentAthletesCount: 20,
    specialization: 'Force-Velocity Profiling & Eccentric Resilience',
  },
];

export const ARJUN_KEY_SIGNALS: KeySignalItem[] = [
  {
    id: 'sleep',
    label: 'Sleep',
    value: '6h 12m',
    delta: '↓ 11%',
    direction: 'down',
    isNegativeSignal: true,
    baseline: '7h 05m rolling 28d average',
    explanation:
      'Sleep duration fell below the 6.5h recovery threshold for 3 consecutive nights following late tactical sessions.',
  },
  {
    id: 'hrv',
    label: 'HRV',
    value: '48 ms',
    delta: '↓ 14%',
    direction: 'down',
    isNegativeSignal: true,
    baseline: '56 ms rolling 28d rMSSD baseline',
    explanation:
      'Morning autonomic rMSSD suppression indicates incomplete parasympathetic reactivation.',
  },
  {
    id: 'acuteLoad',
    label: 'Acute Load',
    value: '742 AU',
    delta: '↑ 22%',
    direction: 'up',
    isNegativeSignal: true,
    baseline: '608 AU 4-week rolling daily mean',
    explanation:
      'Cumulative high-speed running (>21 km/h) and sprint decelerations spiked over the last 72 hours.',
  },
  {
    id: 'wellness',
    label: 'Wellness',
    value: '6.4 / 10',
    delta: '↓ 9%',
    direction: 'down',
    isNegativeSignal: true,
    baseline: '7.1 / 10 squad benchmark',
    explanation:
      'Subjective composite lowered by localized right posterior thigh soreness (4/10) and elevated fatigue.',
  },
];

export const ARJUN_TIMELINE: AthleteTimelineEvent[] = [
  {
    id: 'tl-01',
    date: '28 Sep',
    time: '06:10',
    title: 'AI risk alert generated',
    description: 'Elevated injury-risk pattern detected',
    category: 'AI',
    actor: 'USI Intelligence Engine',
    detailNotes:
      'Multi-variable threshold crossed: readiness dropped from 81 to 62 over 7 days alongside +22% acute workload and HRV suppression (-14%). Recommended review of high-speed running exposure.',
  },
  {
    id: 'tl-02',
    date: '27 Sep',
    time: '17:30',
    title: 'Training load increased',
    description: 'High-intensity exposure above baseline',
    category: 'Training',
    actor: 'Coach M. Vance',
    detailNotes:
      'Recorded 742 AU daily load with 910m high-speed running during Tactical Transition & Speed sessions (+22% above 28-day rolling average).',
  },
  {
    id: 'tl-03',
    date: '26 Sep',
    time: '08:15',
    title: 'Wellness check completed',
    description: 'Score: 6.4 / 10',
    category: 'Sports Science',
    actor: 'Arjun Mehta (Morning Check-in)',
    detailNotes:
      'Sleep duration logged at 6h 12m; morning HRV 48 ms; subjective lower-limb soreness rated 4/10.',
  },
  {
    id: 'tl-04',
    date: '24 Sep',
    time: '16:45',
    title: 'Hamstring discomfort reported',
    description: 'Pain: 4 / 10',
    category: 'Medical',
    actor: 'Dr. S. Patel (Lead Physiotherapist)',
    detailNotes:
      'Localized right biceps femoris myofascial tightness reported post-acceleration block. Isometric force-plate test showed 11.4% limb asymmetry.',
  },
  {
    id: 'tl-05',
    date: '20 Sep',
    time: '10:30',
    title: 'Training assessment completed',
    description: '30m Sprint (4.21s) & CMJ Force-Plate (48 cm)',
    category: 'Assessment',
    actor: 'Dr. R. Subramanian',
    detailNotes:
      'Acceleration improved +6.4% vs prior cycle (4.21s vs 4.29s). Repeated-sprint ability flagged slightly below benchmark.',
  },
  {
    id: 'tl-06',
    date: '12 Sep',
    time: '11:00',
    title: 'Previous hamstring injury recorded',
    description: 'Historical clinical baseline linked to profile',
    category: 'Medical',
    actor: 'Medical Registry Sync',
    detailNotes:
      'Prior Right Biceps Femoris Grade II strain history verified in longitudinal OSICS medical record; ongoing eccentric Nordic monitoring active.',
  },
];

export const ARJUN_DOCUMENTS: AthleteDocument[] = [
  {
    id: 'doc-01',
    name: 'Passport',
    category: 'Identity',
    status: 'Verified',
    expiry: '14 Aug 2031',
    uploadedBy: 'Federation Ops',
    lastUpdated: '10 Jan 2026',
    fileSize: '1.8 MB PDF',
  },
  {
    id: 'doc-02',
    name: 'Medical Clearance',
    category: 'Medical',
    status: 'Pending Review',
    expiry: '30 Sep 2026',
    uploadedBy: 'Dr. S. Patel',
    lastUpdated: '27 Sep 2026',
    fileSize: '2.4 MB PDF',
    notes: 'Updated hamstring isometric & ECG clearance awaiting Chief Medical Officer sign-off.',
  },
  {
    id: 'doc-03',
    name: 'Insurance Certificate',
    category: 'Insurance',
    status: 'Expiring Soon',
    expiry: '12 Oct 2026',
    uploadedBy: 'A. Kulkarni (Admin)',
    lastUpdated: '15 Oct 2025',
    fileSize: '940 KB PDF',
    notes: 'Expires in 14 days — federation renewal policy #NHPP-2026-88B queued.',
  },
  {
    id: 'doc-04',
    name: 'Athlete Agreement',
    category: 'Contracts',
    status: 'Verified',
    expiry: '31 May 2027',
    uploadedBy: 'Federation Legal',
    lastUpdated: '01 Jun 2026',
    fileSize: '3.1 MB PDF',
  },
  {
    id: 'doc-05',
    name: 'Fitness Assessment',
    category: 'Performance',
    status: 'Verified',
    expiry: '20 Dec 2026',
    uploadedBy: 'Dr. R. Subramanian',
    lastUpdated: '20 Sep 2026',
    fileSize: '4.2 MB PDF',
  },
  {
    id: 'doc-06',
    name: 'WADA Therapeutic Use & Anti-Doping Cert',
    category: 'Certifications',
    status: 'Verified',
    expiry: '01 Mar 2027',
    uploadedBy: 'Compliance Officer',
    lastUpdated: '02 Mar 2026',
    fileSize: '1.1 MB PDF',
  },
];

export const ARJUN_AUDIT_TRAIL: AuditTrailEntry[] = [
  {
    id: 'aud-01',
    timestamp: 'Today · 16:42',
    role: 'Performance Director',
    action: 'Viewed AI risk recommendation',
  },
  {
    id: 'aud-02',
    timestamp: 'Today · 15:18',
    role: 'Coach',
    action: 'Updated training assignment',
  },
  {
    id: 'aud-03',
    timestamp: 'Today · 13:02',
    role: 'Physiotherapist',
    action: 'Updated medical status',
  },
  {
    id: 'aud-04',
    timestamp: 'Yesterday · 18:24',
    role: 'Sports Scientist',
    action: 'Synced wearable data',
  },
];

export const buildDefaultPerformanceMetrics = (
  sprintCurrent = '4.21s',
  cmjCurrent = '48 cm',
  yoYoCurrent = '19.2',
  strengthCurrent = '92%'
): {
  sprint30m: PerformanceMetricSeries;
  cmj: PerformanceMetricSeries;
  yoYo: PerformanceMetricSeries;
  strength: PerformanceMetricSeries;
} => ({
  sprint30m: {
    label: '30m Sprint',
    unit: 's',
    current: sprintCurrent,
    squadAvg: '4.32s',
    benchmark: '4.25s',
    personalBest: '4.18s',
    cycles: [
      { cycle: 'Jun 26', value: 4.34, squadAvg: 4.35, benchmark: 4.25 },
      { cycle: 'Jul 26', value: 4.29, squadAvg: 4.34, benchmark: 4.25 },
      { cycle: 'Aug 26', value: 4.25, squadAvg: 4.33, benchmark: 4.25 },
      { cycle: 'Sep 26', value: parseFloat(sprintCurrent), squadAvg: 4.32, benchmark: 4.25 },
    ],
  },
  cmj: {
    label: 'Countermovement Jump',
    unit: 'cm',
    current: cmjCurrent,
    squadAvg: '46 cm',
    benchmark: '47 cm',
    personalBest: '50 cm',
    cycles: [
      { cycle: 'Jun 26', value: 45, squadAvg: 45, benchmark: 47 },
      { cycle: 'Jul 26', value: 46, squadAvg: 45.5, benchmark: 47 },
      { cycle: 'Aug 26', value: 47, squadAvg: 46, benchmark: 47 },
      { cycle: 'Sep 26', value: parseInt(cmjCurrent, 10), squadAvg: 46, benchmark: 47 },
    ],
  },
  yoYo: {
    label: 'Yo-Yo Test',
    unit: 'lvl',
    current: yoYoCurrent,
    squadAvg: '19.8',
    benchmark: '19.6',
    personalBest: '20.1',
    cycles: [
      { cycle: 'Jun 26', value: 18.8, squadAvg: 19.4, benchmark: 19.6 },
      { cycle: 'Jul 26', value: 19.0, squadAvg: 19.5, benchmark: 19.6 },
      { cycle: 'Aug 26', value: 19.4, squadAvg: 19.7, benchmark: 19.6 },
      { cycle: 'Sep 26', value: parseFloat(yoYoCurrent), squadAvg: 19.8, benchmark: 19.6 },
    ],
  },
  strength: {
    label: 'Strength',
    unit: '%',
    current: strengthCurrent,
    squadAvg: '88%',
    benchmark: '90%',
    personalBest: '94%',
    cycles: [
      { cycle: 'Jun 26', value: 86, squadAvg: 85, benchmark: 90 },
      { cycle: 'Jul 26', value: 88, squadAvg: 86, benchmark: 90 },
      { cycle: 'Aug 26', value: 90, squadAvg: 87, benchmark: 90 },
      { cycle: 'Sep 26', value: parseInt(strengthCurrent, 10), squadAvg: 88, benchmark: 90 },
    ],
  },
});

export const buildGenericSignals = (
  sleepVal: string,
  hrvVal: number,
  loadVal: number,
  wellnessVal: number
): KeySignalItem[] => [
  {
    id: 'sleep',
    label: 'Sleep',
    value: sleepVal,
    delta: '+4%',
    direction: 'up',
    isNegativeSignal: false,
    baseline: '7h 30m rolling 28d average',
    explanation: 'Consistent circadian sleep window maintained across microcycle.',
  },
  {
    id: 'hrv',
    label: 'HRV',
    value: `${hrvVal} ms`,
    delta: '+2%',
    direction: 'up',
    isNegativeSignal: false,
    baseline: `${hrvVal - 2} ms rolling 28d baseline`,
    explanation: 'Autonomic rMSSD within normal individual coefficient of variation.',
  },
  {
    id: 'acuteLoad',
    label: 'Acute Load',
    value: `${loadVal} AU`,
    delta: '+6%',
    direction: 'up',
    isNegativeSignal: false,
    baseline: `${Math.round(loadVal * 0.94)} AU 4-week rolling mean`,
    explanation: 'Training load progression aligned with planned mesocycle target.',
  },
  {
    id: 'wellness',
    label: 'Wellness',
    value: `${wellnessVal} / 10`,
    delta: '+3%',
    direction: 'up',
    isNegativeSignal: false,
    baseline: '7.5 / 10 squad benchmark',
    explanation: 'Subjective muscle soreness, fatigue, and mood scores nominal.',
  },
];
