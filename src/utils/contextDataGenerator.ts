import {
  AIActionCentreItem,
  AIEvidenceBundle,
  AIEvidenceMetric,
  AIRecommendation,
  AIRiskSignalCard,
  AITrainingModificationItem,
  AssessmentProgram,
  Athlete,
  BodyComposition,
  BodyCompositionPoint,
  BodyRegionId,
  DailyAnalyticsPoint,
  HierarchyContext,
  HydrationLog,
  Injury,
  MedicalOperationalAlert,
  MedicalRiskAlertItem,
  NavItemId,
  NutritionGoal,
  NutritionPlan,
  PerformanceMetricSeries,
  RehabPlanRecord,
  Report,
  Supplement,
  TalentProfile,
  Test,
  TestResult,
  TrainingSession,
  WellnessProfile,
} from '../types/usi';
import { CONTEXT_OPTIONS } from '../data/mockData';
import {
  INITIAL_MEDICAL_INJURIES,
  INITIAL_REHAB_PLANS,
} from '../data/medicalMockData';
import { INITIAL_NUTRITION_PLANS } from '../data/intelligenceMockData';
import {
  ARJUN_AUDIT_TRAIL,
  ARJUN_DOCUMENTS,
  ARJUN_TIMELINE,
  buildGenericSignals,
} from '../data/athlete360Defaults';

export interface ContextDataset {
  athletes: Athlete[];
  injuries: Injury[];
  sessions: TrainingSession[];
  nutritionPlans: NutritionPlan[];
  rehabPlans: RehabPlanRecord[];
  medicalAlerts: MedicalOperationalAlert[];
  medicalRiskAlerts: MedicalRiskAlertItem[];
  wellnessProfile: WellnessProfile;
  tests: Test[];
  assessmentPrograms: AssessmentProgram[];
  testResults: TestResult[];
  talentProfiles: TalentProfile[];
  hydrationLogs: HydrationLog[];
  supplements: Supplement[];
  bodyComposition: BodyComposition;
  reports: Report[];
  analyticsSeries: DailyAnalyticsPoint[];
  recommendations: AIRecommendation[];
  aiActionItems: AIActionCentreItem[];
  aiRiskSignals: AIRiskSignalCard[];
  aiTrainingModifications: AITrainingModificationItem[];
}

const MALE_FIRST_NAMES = [
  'Aarav', 'Vihaan', 'Vivaan', 'Aditya', 'Arjun', 'Reyansh', 'Ayaan', 'Krishna',
  'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Dhruv', 'Kabir', 'Rohan',
  'Siddharth', 'Vikram', 'Devansh', 'Zorawar', 'Harsh', 'Karan', 'Nikhil', 'Yash',
  'Rishabh', 'Surya', 'Lakshya', 'Chirag', 'Satwik', 'Neeraj', 'Murali', 'Avinash',
  'Tajinder', 'Srihari', 'Sajan', 'Kushagra', 'Manpreet', 'Hardik', 'Harmanpreet', 'Mandeep',
  'Sumit', 'Abhishek', 'Gurjant', 'Vivek', 'Shamsher', 'Jarmanpreet', 'Sanjay', 'Rajat',
];

const FEMALE_FIRST_NAMES = [
  'Ananya', 'Diya', 'Saanvi', 'Aadhya', 'Kiara', 'Myra', 'Pari', 'Riya',
  'Kavya', 'Nisha', 'Pooja', 'Sneha', 'Tanvi', 'Meera', 'Shruti', 'Ishita',
  'Sindhu', 'Ashwini', 'Treesa', 'Gayatri', 'Jyothi', 'Parul', 'Annu', 'Priyanka',
  'Kiran', 'Savita', 'Salima', 'Navneet', 'Vandana', 'Deepika', 'Neha', 'Lalremsiami',
  'Maana', 'Dhinidhi', 'Bhavya', 'Vritti', 'Bala', 'Manisha', 'Sweety', 'Dalima',
  'Sangita', 'Shilky', 'Anju', 'Indumathi', 'Grace', 'Soumya', 'Pyari', 'Karishma',
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Patel', 'Nair', 'Kulkarni', 'Gill', 'Chhetri', 'Fernandes',
  'Thapa', 'Sundaram', 'Rao', 'Singh', 'Mehta', 'Reddy', 'Joshi', 'Iyer',
  'Menon', 'Chatterjee', 'Sen', 'Banerjee', 'Deshmukh', 'Bhatia', 'Kapoor', 'Malhotra',
  'Chauhan', 'Rathore', 'Yadav', 'Gowda', 'Hegde', 'Shetty', 'Naidu', 'Pillai',
  'Nataraj', 'Prakash', 'Sable', 'Chopra', 'Sreeshankar', 'Rankireddy', 'Ponnappa', 'Tete',
  'Katariya', 'Punia', 'Kaur', 'Devi', 'Tamang', 'Borges', 'Sandhu', 'Mirza',
];

interface SportConfigItem {
  positions: string[];
  disciplineMen: string;
  disciplineWomen: string;
  disciplineU23: string;
  disciplineU19: string;
  coaches: [string, string, string];
  heightRange: [number, number]; // min, max cm
  weightMultiplier: number;
  injuries: {
    region: BodyRegionId;
    display: string;
    title: string;
    diagnosis: string;
  }[];
  sessions: {
    title: string;
    category: TrainingSession['category'];
    venue: string;
    objectives: string[];
  }[];
  testBatteries: {
    name: string;
    category: 'Speed' | 'Power' | 'Endurance' | 'Strength' | 'Sport-Specific' | 'Mobility';
    unit: string;
    benchmarkStr: string;
    numericBenchmark: number;
    lowerIsBetter: boolean;
  }[];
  supplements: {
    name: string;
    dosage: string;
    timing: string;
    purpose: 'Recovery' | 'Hydration' | 'General' | 'Performance';
  }[];
}

const SPORT_CONFIG: Record<string, SportConfigItem> = {
  Football: {
    positions: ['Forward', 'Midfielder', 'Defender', 'Winger', 'Goalkeeper', 'Center Back', 'Attacking Mid'],
    disciplineMen: '11v11 Men',
    disciplineWomen: '11v11 Women',
    disciplineU23: '11v11 U-23 Olympic',
    disciplineU19: '11v11 U-19 Youth',
    coaches: ['Vikram Sharma', 'Carlos Marquez', 'Renedy Singh'],
    heightRange: [172, 190],
    weightMultiplier: 0.42,
    injuries: [
      {
        region: 'Hamstring — Right',
        display: 'Right Hamstring',
        title: 'Biceps Femoris Grade II Strain',
        diagnosis: 'Myotendinous junction strain from high-speed transition sprint',
      },
      {
        region: 'Ankle — Right',
        display: 'Right Ankle',
        title: 'High Ankle Syndesmosis Sprain',
        diagnosis: 'Anterior inferior tibiofibular ligament effusion post-tackle',
      },
      {
        region: 'Hip — Left',
        display: 'Left Hip / Groin',
        title: 'Adductor Longus Overload',
        diagnosis: 'Eccentric deceleration groin strain during directional pressing',
      },
      {
        region: 'Knee — Left',
        display: 'Left Knee',
        title: 'Medial Collateral Ligament Grade I',
        diagnosis: 'Valgus contact stress during 11v11 tactical phase',
      },
    ],
    sessions: [
      {
        title: 'High-Press Tactical Transition & 11v11 Phase',
        category: 'Tactical',
        venue: 'Pitch 1 · Championship Turf',
        objectives: ['High-press triggers in attacking 11v11', 'Defensive line compactness'],
      },
      {
        title: 'Aerobic MAS 105% & Positional Rondo Conditioning',
        category: 'Conditioning',
        venue: 'Pitch 2 · Conditioning Grid',
        objectives: ['Aerobic power maintenance', 'Autonomic HRR-60s verification'],
      },
      {
        title: 'Max Velocity Sprint & Deceleration Inoculation',
        category: 'Speed',
        venue: 'Sprint Lanes · Pitch 1',
        objectives: ['Flying 30m >90% Vmax exposure', 'Eccentric hamstring resilience'],
      },
      {
        title: 'Lower-Limb Velocity-Based Force Plate Strength',
        category: 'Strength',
        venue: 'HPC S&C Bay A',
        objectives: ['Trap-bar RFD @ 0.75 m/s', 'Nordic & Copenhagen isometric checks'],
      },
    ],
    testBatteries: [
      { name: '30m Linear Sprint', category: 'Speed', unit: 's', benchmarkStr: '4.10s', numericBenchmark: 4.10, lowerIsBetter: true },
      { name: 'Countermovement Jump (CMJ)', category: 'Power', unit: 'cm', benchmarkStr: '52.0 cm', numericBenchmark: 52.0, lowerIsBetter: false },
      { name: 'Yo-Yo Intermittent Recovery L1', category: 'Endurance', unit: 'Level', benchmarkStr: '19.8 Level', numericBenchmark: 19.8, lowerIsBetter: false },
      { name: '1RM Trap Bar Deadlift / BW', category: 'Strength', unit: 'x BW', benchmarkStr: '2.10x BW', numericBenchmark: 2.10, lowerIsBetter: false },
      { name: 'Repeated Sprint Ability (RSA 6x30m)', category: 'Sport-Specific', unit: '% drop', benchmarkStr: '<4.5% drop', numericBenchmark: 4.5, lowerIsBetter: true },
    ],
    supplements: [
      { name: 'Creatine Monohydrate', dosage: '5g', timing: 'Post-Training', purpose: 'Performance' as const },
      { name: 'Beta-Alanine', dosage: '3.2g', timing: 'Pre-Training', purpose: 'Performance' as const },
      { name: 'Whey Protein Hydrolysate', dosage: '30g', timing: 'Post-Training', purpose: 'Recovery' as const },
      { name: 'Tart Cherry Extract', dosage: '30ml', timing: 'Before Bed', purpose: 'Recovery' as const },
    ],
  },
  Athletics: {
    positions: [
      '100m / 200m Sprint',
      '400m Hurdles',
      'Javelin Throw',
      'Long Jump',
      '3000m Steeplechase',
      '4x400m Relay',
      'Shot Put',
      '800m Middle Distance',
    ],
    disciplineMen: "Men's Track & Field",
    disciplineWomen: "Women's Track & Field",
    disciplineU23: 'U-23 Olympic Track & Field',
    disciplineU19: 'U-19 Junior Athletics',
    coaches: ['Dr. Klaus Bartonietz', 'Radhakrishnan Nair', 'Galina Bukharina'],
    heightRange: [174, 192],
    weightMultiplier: 0.44,
    injuries: [
      {
        region: 'Hamstring — Left',
        display: 'Left Hamstring',
        title: 'Proximal Semimembranosus Tendinopathy',
        diagnosis: 'Maximal block clearance & terminal swing phase overload',
      },
      {
        region: 'Calf — Right',
        display: 'Right Calf / Achilles',
        title: 'Mid-Portion Achilles Reactive Tendinopathy',
        diagnosis: 'High plyometric ground contact stiffness on synthetic Mondo track',
      },
      {
        region: 'Shoulder — Right',
        display: 'Right Shoulder',
        title: 'Glenohumeral Anterior Capsule Strain',
        diagnosis: 'Javelin throwing delivery phase torsional overload',
      },
      {
        region: 'Lower Back',
        display: 'Lumbar Spine',
        title: 'L4-L5 Facet Extension Irritation',
        diagnosis: 'Rotational & hyperextension load during takeoff/throw block',
      },
    ],
    sessions: [
      {
        title: 'Electronic Block Starts & 60m Acceleration Gates',
        category: 'Speed',
        venue: 'Mondo Olympic 8-Lane Track',
        objectives: ['Block reaction time <0.135s', '0–30m horizontal force vectoring'],
      },
      {
        title: 'Ballistic Plyometrics & Olympic Lifting Complex',
        category: 'Strength',
        venue: 'Throws & Jumps Power Hall',
        objectives: ['Power clean peak velocity >1.35 m/s', 'Drop-jump RSI optimization'],
      },
      {
        title: 'Biomechanics High-Speed Camera Technical Session',
        category: 'Technical',
        venue: 'Track Infield & Throws Sector',
        objectives: ['Release angle & penultimate stride kinematics', 'Limb symmetry check'],
      },
      {
        title: 'Glycolytic Speed Endurance & Lactate Threshold',
        category: 'Conditioning',
        venue: 'Main Stadium Track',
        objectives: ['Special endurance 150m/250m repeats', 'Blood lactate clearance'],
      },
    ],
    testBatteries: [
      { name: '30m Electronic Acceleration Split', category: 'Speed', unit: 's', benchmarkStr: '3.82s', numericBenchmark: 3.82, lowerIsBetter: true },
      { name: 'Reactive Strength Index (Drop Jump)', category: 'Power', unit: 'RSI', benchmarkStr: '2.70', numericBenchmark: 2.70, lowerIsBetter: false },
      { name: 'Flying 20m Max Velocity', category: 'Speed', unit: 'm/s', benchmarkStr: '11.0 m/s', numericBenchmark: 11.0, lowerIsBetter: false },
      { name: 'Olympic Power Clean / BW', category: 'Strength', unit: 'x BW', benchmarkStr: '1.65x BW', numericBenchmark: 1.65, lowerIsBetter: false },
      { name: 'Isometric Mid-Thigh Pull (IMTP)', category: 'Strength', unit: 'N', benchmarkStr: '3850 N', numericBenchmark: 3850, lowerIsBetter: false },
    ],
    supplements: [
      { name: 'Creatine Monohydrate', dosage: '5g', timing: 'Post-Training', purpose: 'Performance' as const },
      { name: 'Beta-Alanine', dosage: '3.2g', timing: 'Pre-Training', purpose: 'Performance' as const },
      { name: 'Iron Bisglycinate + Vitamin C', dosage: '28mg', timing: 'Morning with food', purpose: 'General' as const },
      { name: 'Tart Cherry Extract', dosage: '30ml', timing: 'Night', purpose: 'Recovery' as const },
    ],
  },
  'Field Hockey': {
    positions: [
      'Drag Flicker',
      'Center Forward',
      'Midfield Pivot',
      'Halfback',
      'Goalkeeper',
      'Inside Forward',
      'Fullback',
    ],
    disciplineMen: "Men's FIH Pro League Turf",
    disciplineWomen: "Women's FIH Pro League Turf",
    disciplineU23: 'Junior World Cup Pathway',
    disciplineU19: 'Sub-Junior National Turf',
    coaches: ['Craig Fulton', 'Harendra Singh', 'Janneke Schopman'],
    heightRange: [168, 185],
    weightMultiplier: 0.43,
    injuries: [
      {
        region: 'Lower Back',
        display: 'Lumbar Spine',
        title: 'Lumbar Paraspinal Postural Overload',
        diagnosis: 'Sustained semi-flexed dribbling & penalty corner drag-flick torque',
      },
      {
        region: 'Hamstring — Right',
        display: 'Right Hamstring',
        title: 'Distal Biceps Femoris Strain',
        diagnosis: 'Repeated low-posture lunge & turf acceleration exposure',
      },
      {
        region: 'Knee — Right',
        display: 'Right Knee',
        title: 'Patellofemoral Turf Load Syndrome',
        diagnosis: 'High eccentric braking forces on water-based synthetic astroturf',
      },
      {
        region: 'Wrist — Left',
        display: 'Left Wrist',
        title: 'ECU Tendon Sheath Inflammation',
        diagnosis: '3D stick skill reception and reverse-hit impact vibration',
      },
    ],
    sessions: [
      {
        title: 'Penalty Corner Drag-Flick & Defensive Battery Unit',
        category: 'Technical',
        venue: 'FIH Blue Water-Based Astroturf 1',
        objectives: ['Drag-flick ball velocity >125 km/h', 'First-runner block timing'],
      },
      {
        title: 'Rolling Substitution High-Intensity Turf Quarters',
        category: 'Tactical',
        venue: 'Main Hockey Stadium Turf',
        objectives: ['4 x 15-min quarter press structure', 'Circle penetration efficiency'],
      },
      {
        title: 'Repeated Sprint Ability (RSA) & COD Shuttle Matrix',
        category: 'Conditioning',
        venue: 'Astroturf Pitch 2',
        objectives: ['Multi-directional shuttle fatigue index <5%', 'HR recovery between shifts'],
      },
      {
        title: 'Posterior Chain & Lumbar Rotational Resilience',
        category: 'Strength',
        venue: 'Hockey S&C Performance Wing',
        objectives: ['Single-leg eccentric RDL symmetry', 'Thoracic & hip mobility'],
      },
    ],
    testBatteries: [
      { name: '40m Linear Turf Sprint', category: 'Speed', unit: 's', benchmarkStr: '5.08s', numericBenchmark: 5.08, lowerIsBetter: true },
      { name: 'Bronco 1200m Shuttle Test', category: 'Endurance', unit: 'min', benchmarkStr: '4:35 min', numericBenchmark: 4.58, lowerIsBetter: true },
      { name: '505 Change of Direction (COD)', category: 'Speed', unit: 's', benchmarkStr: '2.22s', numericBenchmark: 2.22, lowerIsBetter: true },
      { name: 'Drag-Flick Ball Velocity (Radar)', category: 'Power', unit: 'km/h', benchmarkStr: '128 km/h', numericBenchmark: 128, lowerIsBetter: false },
      { name: 'Repeated Sprint Ability (RSA)', category: 'Sport-Specific', unit: '% drop', benchmarkStr: '<4.2% drop', numericBenchmark: 4.2, lowerIsBetter: true },
    ],
    supplements: [
      { name: 'Beta-Alanine', dosage: '3.2g', timing: 'Pre-Turf Session', purpose: 'Performance' as const },
      { name: 'Whey Protein Isolate', dosage: '25g', timing: 'Post-Training', purpose: 'Recovery' as const },
      { name: 'Omega-3 EPA/DHA', dosage: '2000mg', timing: 'Morning Meal', purpose: 'General' as const },
      { name: 'Carb-Electrolyte Matrix', dosage: '40g', timing: 'Quarter Breaks', purpose: 'Hydration' as const },
    ],
  },
  Swimming: {
    positions: [
      '100m / 200m Freestyle',
      '200m Butterfly',
      '100m Backstroke',
      '200m Individual Medley',
      '50m Sprint Freestyle',
      '400m / 800m Freestyle',
      '100m Breaststroke',
    ],
    disciplineMen: "Men's 50m Olympic Pool",
    disciplineWomen: "Women's 50m Olympic Pool",
    disciplineU23: 'U-23 Aquatic Olympic Hopefuls',
    disciplineU19: 'Junior National Aquatic Squad',
    coaches: ['Nihar Ameen', 'Ian Turner', 'Pradeep Kumar'],
    heightRange: [178, 196],
    weightMultiplier: 0.40,
    injuries: [
      {
        region: 'Shoulder — Right',
        display: 'Right Shoulder',
        title: 'Supraspinatus Impingement (Swimmer Shoulder)',
        diagnosis: 'High-volume catch-phase internal rotation tendon overload',
      },
      {
        region: 'Shoulder — Left',
        display: 'Left Shoulder',
        title: 'Scapular Dyskinesis & Posterior Cuff Strain',
        diagnosis: 'Butterfly recovery phase fatigue and rotator cuff imbalance',
      },
      {
        region: 'Knee — Left',
        display: 'Left Knee',
        title: 'Medial Collateral Breaststroke Whip Strain',
        diagnosis: 'Valgus whip-kick torque during high-resistance breaststroke sets',
      },
      {
        region: 'Lower Back',
        display: 'Lumbar Spine',
        title: 'Undulatory Dolphin Kick Hyperextension Strain',
        diagnosis: '15m underwater breakout undulation load',
      },
    ],
    sessions: [
      {
        title: 'VO2 Max Pace 10x100m & Lactate Tolerance Pool Set',
        category: 'Conditioning',
        venue: 'Olympic 50m Aquatic Complex · Lanes 1–8',
        objectives: ['Hold race-pace stroke index', 'Post-set blood lactate 8–10 mmol/L'],
      },
      {
        title: 'Underwater 15m Dolphin Breakout & Dive Starts',
        category: 'Speed',
        venue: 'Olympic Dive & Sprint Pool',
        objectives: ['15m time <5.45s', 'Tumble-turn wall impulse force'],
      },
      {
        title: 'Dryland Scapular Stability & Tethered Power Pulls',
        category: 'Strength',
        venue: 'Aquatic Dryland Biomechanics Gym',
        objectives: ['External/internal rotation ratio >72%', 'Upper-body pull velocity'],
      },
      {
        title: 'Stroke Rate / DPS Underwater Video Telemetry',
        category: 'Technical',
        venue: 'Flume & Video Analysis Pool',
        objectives: ['Catch angle optimization', 'Hydrodynamic drag reduction'],
      },
    ],
    testBatteries: [
      { name: '50m Free Sprint Split', category: 'Speed', unit: 's', benchmarkStr: '22.40s', numericBenchmark: 22.40, lowerIsBetter: true },
      { name: 'Dive Start 15m Breakout Time', category: 'Power', unit: 's', benchmarkStr: '5.15s', numericBenchmark: 5.15, lowerIsBetter: true },
      { name: 'Critical Swim Speed (CSS)', category: 'Endurance', unit: 'm/s', benchmarkStr: '1.70 m/s', numericBenchmark: 1.70, lowerIsBetter: false },
      { name: 'Tethered Pull Peak Force', category: 'Strength', unit: 'N', benchmarkStr: '375 N', numericBenchmark: 375, lowerIsBetter: false },
      { name: 'Stroke Rate & Distance Per Stroke (DPS)', category: 'Sport-Specific', unit: 'm/stroke', benchmarkStr: '2.25 m/st', numericBenchmark: 2.25, lowerIsBetter: false },
    ],
    supplements: [
      { name: 'Sodium Bicarbonate Buffer', dosage: '0.3g/kg', timing: '90m Pre-Lactate Set', purpose: 'Performance' as const },
      { name: 'Beta-Alanine', dosage: '3.2g', timing: 'Pre-Morning Swim', purpose: 'Performance' as const },
      { name: 'Hydrolyzed Whey Protein', dosage: '30g', timing: 'Immediate Post-Pool', purpose: 'Recovery' as const },
      { name: 'High-Sodium Electrolytes', dosage: '1000mg', timing: 'Intra-Swim Bottle', purpose: 'Hydration' as const },
    ],
  },
  Badminton: {
    positions: [
      "Men's Singles",
      "Women's Singles",
      "Men's Doubles",
      "Women's Doubles",
      'Mixed Doubles',
      'Singles Specialist',
      'Doubles Front-Court',
    ],
    disciplineMen: "Men's BWF World Tour Squad",
    disciplineWomen: "Women's BWF World Tour Squad",
    disciplineU23: 'U-23 BWF Super 300 Pathway',
    disciplineU19: 'U-19 World Junior Squad',
    coaches: ['Pullela Gopichand', 'Mathias Boe', 'Agus Dwi Santoso'],
    heightRange: [170, 188],
    weightMultiplier: 0.41,
    injuries: [
      {
        region: 'Knee — Right',
        display: 'Right Knee',
        title: 'Patellar Tendinopathy (Jumper Knee)',
        diagnosis: 'Repetitive forecourt lunge deceleration and jump-smash landings',
      },
      {
        region: 'Shoulder — Right',
        display: 'Right Shoulder',
        title: 'Infraspinatus Overhead Smash Overload',
        diagnosis: 'High-velocity overhead jump-smash eccentric deceleration strain',
      },
      {
        region: 'Ankle — Right',
        display: 'Right Ankle',
        title: 'Lateral ATFL Inversion Micro-Sprain',
        diagnosis: 'Rapid split-step recovery from deep backhand corner lunge',
      },
      {
        region: 'Calf — Left',
        display: 'Left Calf / Achilles',
        title: 'Soleus-Gastrocnemius Split-Step Strain',
        diagnosis: 'Explosive rear-court push-off load during 75-min 3-game simulations',
      },
    ],
    sessions: [
      {
        title: 'Multi-Shuttle High-Tempo Court Agility & Defense',
        category: 'Conditioning',
        venue: 'BWF Show Courts 1–4 · National Hall',
        objectives: ['40-shuttle burst intervals @ 92% HRmax', 'Split-step reaction <180ms'],
      },
      {
        title: 'Jump-Smash Attacking Transitions & Net Kill Drills',
        category: 'Technical',
        venue: 'High Performance Courts 1–6',
        objectives: ['Smash shuttle velocity >390 km/h', 'Front-court interception speed'],
      },
      {
        title: 'Best-of-3 Match Simulation & Tactical Video Cues',
        category: 'Tactical',
        venue: 'Center Court Arena',
        objectives: ['Deception under fatigue in Game 3', 'Service/receive first-3-shot win %'],
      },
      {
        title: 'Single-Leg Lunge Eccentric & Achilles Stiffness S&C',
        category: 'Strength',
        venue: 'Racquet Sports Biomechanics Gym',
        objectives: ['Flywheel eccentric lunge overload', 'Rotator cuff ER endurance'],
      },
    ],
    testBatteries: [
      { name: 'Split-Step Reaction Latency', category: 'Speed', unit: 'ms', benchmarkStr: '160 ms', numericBenchmark: 160, lowerIsBetter: true },
      { name: 'Jump Smash Peak CMJ Height', category: 'Power', unit: 'cm', benchmarkStr: '58.0 cm', numericBenchmark: 58.0, lowerIsBetter: false },
      { name: 'Jump Smash Shuttle Velocity (Radar)', category: 'Power', unit: 'km/h', benchmarkStr: '415 km/h', numericBenchmark: 415, lowerIsBetter: false },
      { name: 'Deep Forecourt Lunge Recovery Time', category: 'Speed', unit: 's', benchmarkStr: '0.85s', numericBenchmark: 0.85, lowerIsBetter: true },
      { name: 'Court Hexagon Multi-Shuttle Agility', category: 'Sport-Specific', unit: 's', benchmarkStr: '13.5s', numericBenchmark: 13.5, lowerIsBetter: true },
    ],
    supplements: [
      { name: 'Glycerol + Hypotonic Hydration', dosage: '1.2g/kg', timing: 'Pre-Match 60m', purpose: 'Hydration' as const },
      { name: 'Caffeine + L-Theanine', dosage: '150mg/100mg', timing: 'Pre-Session 30m', purpose: 'Performance' as const },
      { name: 'Whey Protein Isolate', dosage: '25g', timing: 'Post-Session', purpose: 'Recovery' as const },
      { name: 'Magnesium Bisglycinate', dosage: '300mg', timing: 'Evening', purpose: 'Recovery' as const },
    ],
  },
};

const FEDERATION_META: Record<
  string,
  {
    codePrefix: string;
    emailDomain: string;
    campusLocation: string;
    fedIndex: number;
  }
> = {
  'National High Performance Program': {
    codePrefix: 'NHP',
    emailDomain: 'nhpp-sports.org',
    campusLocation: 'NHPP National Centre, New Delhi',
    fedIndex: 0,
  },
  'Olympic Elite Preparation Centre': {
    codePrefix: 'OEP',
    emailDomain: 'oepc-olympic.in',
    campusLocation: 'OEPC Olympic Campus, Bengaluru',
    fedIndex: 1,
  },
  'National Sports Academy Network': {
    codePrefix: 'NSA',
    emailDomain: 'nsan-academy.in',
    campusLocation: 'NSAN Regional Hub, Patiala & Bhubaneswar',
    fedIndex: 2,
  },
};

export function getContextKey(context: HierarchyContext): string {
  return `${context.federation}__${context.sport}__${context.program}__${context.squad}`;
}

function buildSportPerformanceMetrics(
  sport: string,
  i: number,
  permId: number
): Athlete['performanceMetrics'] {
  const cfg = SPORT_CONFIG[sport] || SPORT_CONFIG['Football'];
  const t0 = cfg.testBatteries[0];
  const t1 = cfg.testBatteries[1];
  const t2 = cfg.testBatteries[2];
  const t3 = cfg.testBatteries[3];

  const calcVal = (base: number, step: number, isLowerBetter: boolean) => {
    const raw = isLowerBetter
      ? base - 0.05 + ((i * 3 + permId) % 5) * step
      : base + ((i * 2 + permId) % 6) * step;
    return raw;
  };

  const v0 = calcVal(t0.numericBenchmark, 0.04, t0.lowerIsBetter);
  const v1 = calcVal(t1.numericBenchmark, 1.2, t1.lowerIsBetter);
  const v2 = calcVal(t2.numericBenchmark, 0.25, t2.lowerIsBetter);
  const v3 = calcVal(t3.numericBenchmark, 2.5, t3.lowerIsBetter);

  return {
    sprint30m: {
      label: t0.name,
      unit: t0.unit,
      current: `${v0.toFixed(t0.lowerIsBetter ? 2 : 1)}${t0.unit === 's' ? 's' : ' ' + t0.unit}`,
      squadAvg: t0.benchmarkStr,
      benchmark: t0.benchmarkStr,
      personalBest: `${(v0 * (t0.lowerIsBetter ? 0.97 : 1.05)).toFixed(t0.lowerIsBetter ? 2 : 1)}${t0.unit === 's' ? 's' : ''}`,
      cycles: [
        { cycle: 'Jun 26', value: Number((v0 * (t0.lowerIsBetter ? 1.04 : 0.95)).toFixed(2)), squadAvg: t0.numericBenchmark, benchmark: t0.numericBenchmark },
        { cycle: 'Jul 26', value: Number((v0 * (t0.lowerIsBetter ? 1.02 : 0.97)).toFixed(2)), squadAvg: t0.numericBenchmark, benchmark: t0.numericBenchmark },
        { cycle: 'Aug 26', value: Number((v0 * (t0.lowerIsBetter ? 1.01 : 0.98)).toFixed(2)), squadAvg: t0.numericBenchmark, benchmark: t0.numericBenchmark },
        { cycle: 'Sep 26', value: Number(v0.toFixed(2)), squadAvg: t0.numericBenchmark, benchmark: t0.numericBenchmark },
      ],
    },
    cmj: {
      label: t1.name,
      unit: t1.unit,
      current: `${v1.toFixed(t1.lowerIsBetter ? 2 : 1)} ${t1.unit}`,
      squadAvg: t1.benchmarkStr,
      benchmark: t1.benchmarkStr,
      personalBest: `${(v1 * (t1.lowerIsBetter ? 0.96 : 1.06)).toFixed(1)} ${t1.unit}`,
      cycles: [
        { cycle: 'Jun 26', value: Number((v1 * (t1.lowerIsBetter ? 1.05 : 0.94)).toFixed(1)), squadAvg: t1.numericBenchmark, benchmark: t1.numericBenchmark },
        { cycle: 'Jul 26', value: Number((v1 * (t1.lowerIsBetter ? 1.03 : 0.96)).toFixed(1)), squadAvg: t1.numericBenchmark, benchmark: t1.numericBenchmark },
        { cycle: 'Aug 26', value: Number((v1 * (t1.lowerIsBetter ? 1.01 : 0.98)).toFixed(1)), squadAvg: t1.numericBenchmark, benchmark: t1.numericBenchmark },
        { cycle: 'Sep 26', value: Number(v1.toFixed(1)), squadAvg: t1.numericBenchmark, benchmark: t1.numericBenchmark },
      ],
    },
    yoYo: {
      label: t2.name,
      unit: t2.unit,
      current: `${v2.toFixed(1)} ${t2.unit}`,
      squadAvg: t2.benchmarkStr,
      benchmark: t2.benchmarkStr,
      personalBest: `${(v2 * (t2.lowerIsBetter ? 0.95 : 1.05)).toFixed(1)} ${t2.unit}`,
      cycles: [
        { cycle: 'Jun 26', value: Number((v2 * (t2.lowerIsBetter ? 1.06 : 0.93)).toFixed(1)), squadAvg: t2.numericBenchmark, benchmark: t2.numericBenchmark },
        { cycle: 'Jul 26', value: Number((v2 * (t2.lowerIsBetter ? 1.04 : 0.95)).toFixed(1)), squadAvg: t2.numericBenchmark, benchmark: t2.numericBenchmark },
        { cycle: 'Aug 26', value: Number((v2 * (t2.lowerIsBetter ? 1.02 : 0.98)).toFixed(1)), squadAvg: t2.numericBenchmark, benchmark: t2.numericBenchmark },
        { cycle: 'Sep 26', value: Number(v2.toFixed(1)), squadAvg: t2.numericBenchmark, benchmark: t2.numericBenchmark },
      ],
    },
    strength: {
      label: t3.name,
      unit: t3.unit,
      current: `${v3.toFixed(1)} ${t3.unit}`,
      squadAvg: t3.benchmarkStr,
      benchmark: t3.benchmarkStr,
      personalBest: `${(v3 * 1.07).toFixed(1)} ${t3.unit}`,
      cycles: [
        { cycle: 'Jun 26', value: Number((v3 * 0.92).toFixed(1)), squadAvg: t3.numericBenchmark, benchmark: t3.numericBenchmark },
        { cycle: 'Jul 26', value: Number((v3 * 0.95).toFixed(1)), squadAvg: t3.numericBenchmark, benchmark: t3.numericBenchmark },
        { cycle: 'Aug 26', value: Number((v3 * 0.98).toFixed(1)), squadAvg: t3.numericBenchmark, benchmark: t3.numericBenchmark },
        { cycle: 'Sep 26', value: Number(v3.toFixed(1)), squadAvg: t3.numericBenchmark, benchmark: t3.numericBenchmark },
      ],
    },
  };
}

export function generateContextDataset(context: HierarchyContext): ContextDataset {
  const fedMeta =
    FEDERATION_META[context.federation] ||
    FEDERATION_META['National High Performance Program'];
  const sportCfg = SPORT_CONFIG[context.sport] || SPORT_CONFIG['Football'];

  const fedIdx = Math.max(0, CONTEXT_OPTIONS.federations.indexOf(context.federation));
  const sportIdx = Math.max(0, CONTEXT_OPTIONS.sports.indexOf(context.sport));
  const progIdx = Math.max(0, CONTEXT_OPTIONS.programs.indexOf(context.program));
  const squadIdx = Math.max(0, CONTEXT_OPTIONS.squads.indexOf(context.squad));

  // Unique integer seed for every single (federation, sport, program, squad) permutation (300 combinations)
  const permId = fedIdx * 100 + sportIdx * 20 + progIdx * 5 + squadIdx + 1;

  const isWomenProgram = context.program === "Senior Women's Program";
  const isU19 = context.program === 'U-19 Elite Pathway';
  const isU23 = context.program === 'U-23 Olympic Development Program';
  const isRehabSquad = context.squad === 'Rehabilitation & RTP Unit';
  const isMatchDaySquad = context.squad === 'Squad A — Match Day Group';
  const isSeniorNational = context.squad === 'Senior National Squad';

  // Distinct cohort sizes per combination (8 to 13 athletes)
  const cohortSize = isRehabSquad
    ? 6 + ((permId * 3) % 4) // 6..9 in rehab unit
    : isMatchDaySquad
      ? 11 + (permId % 3) // 11..13 matchday group
      : 8 + ((permId * 7 + sportIdx * 3 + progIdx) % 5); // 8..12

  const discipline = isWomenProgram
    ? sportCfg.disciplineWomen
    : isU23
      ? sportCfg.disciplineU23
      : isU19
        ? sportCfg.disciplineU19
        : sportCfg.disciplineMen;

  const primaryCoach =
    sportCfg.coaches[(fedIdx + progIdx) % sportCfg.coaches.length];

  // Physiological variance shifts per permutation
  const readinessShift = isRehabSquad
    ? -18 + ((permId * 3) % 6) // Low readiness in rehab
    : isMatchDaySquad
      ? 6 + (permId % 5) // Peak readiness in match day squad
      : ((permId * 7) % 15) - 6;

  const acwrShift = isRehabSquad
    ? 0.18 + ((permId % 4) * 0.02)
    : (((permId * 11) % 24) - 10) * 0.01;

  const generatedAthletes: Athlete[] = [];

  for (let i = 0; i < cohortSize; i++) {
    const nameOffset = fedIdx * 17 + sportIdx * 11 + progIdx * 7 + squadIdx * 3 + i * 5;
    const isFemale =
      isWomenProgram || (!context.program.includes('Men') && (i + progIdx) % 2 === 1);
    const firstPool = isFemale ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;
    const firstName = firstPool[nameOffset % firstPool.length];
    const lastName = LAST_NAMES[(nameOffset * 3 + sportIdx * 7 + i * 5) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const codeNum = 2000 + permId * 10 + i;
    const athCode = `${fedMeta.codePrefix}-${context.sport.substring(0, 3).toUpperCase()}-${codeNum}`;
    const athId = `ath-${fedMeta.codePrefix.toLowerCase()}-${sportIdx}-${progIdx}-${squadIdx}-${i}`;

    const baseAge = isU19
      ? 16 + (i % 3)
      : isU23
        ? 19 + (i % 4)
        : 23 + ((i + fedIdx + sportIdx) % 8);
    const birthYear = 2026 - baseAge;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dob = `${10 + ((i * 4 + permId) % 18)} ${months[(i + sportIdx) % 12]} ${birthYear}`;

    let trainingStatus: Athlete['trainingStatus'] = 'ACTIVE';
    let status: Athlete['status'] = 'Ready';
    let injuryRisk: Athlete['injuryRisk'] = 'Low';
    let medicalStatus: Athlete['medicalStatus'] = 'Cleared';
    let verificationStatus: Athlete['verificationStatus'] = 'Verified';

    const statusRoll = (i + permId) % 9;
    if (isRehabSquad) {
      if (i % 3 === 0) {
        trainingStatus = 'IN REHAB';
        status = 'Attention';
        injuryRisk = 'High';
        medicalStatus = 'Restricted';
      } else if (i % 3 === 1) {
        trainingStatus = 'RETURN TO PLAY';
        status = 'Monitor';
        injuryRisk = 'Moderate';
        medicalStatus = 'Restricted';
      } else {
        trainingStatus = 'RESTRICTED';
        status = 'Attention';
        injuryRisk = 'High';
        medicalStatus = 'Pending';
      }
    } else if (isMatchDaySquad) {
      trainingStatus = 'ACTIVE';
      status = 'Ready';
      injuryRisk = 'Low';
      medicalStatus = 'Cleared';
      verificationStatus = 'Verified';
      if (i === cohortSize - 1 && permId % 3 === 0) {
        trainingStatus = 'RESTRICTED';
        status = 'Monitor';
        injuryRisk = 'Moderate';
      }
    } else {
      if (i === 0 || statusRoll === 1) {
        trainingStatus = 'RESTRICTED';
        status = 'Attention';
        injuryRisk = 'High';
        medicalStatus = 'Restricted';
      } else if (i === 1 && (permId % 2 === 0)) {
        trainingStatus = 'INJURED';
        status = 'Attention';
        injuryRisk = 'High';
        medicalStatus = 'Restricted';
      } else if (statusRoll === 3) {
        trainingStatus = 'IN REHAB';
        status = 'Monitor';
        injuryRisk = 'Moderate';
        medicalStatus = 'Restricted';
      } else if (statusRoll === 5) {
        trainingStatus = 'RETURN TO PLAY';
        status = 'Monitor';
        injuryRisk = 'Moderate';
        medicalStatus = 'Pending';
      } else if (statusRoll === 7 && !isSeniorNational) {
        trainingStatus = 'PENDING';
        status = 'Monitor';
        injuryRisk = 'Moderate';
        verificationStatus = 'Pending';
        medicalStatus = 'Pending';
      }
    }

    if (i === cohortSize - 1 && !isMatchDaySquad && (permId + fedIdx) % 3 === 0) {
      verificationStatus = 'Pending';
    }

    const baseReadiness =
      trainingStatus === 'INJURED'
        ? 52 + ((i * 3 + permId) % 8)
        : trainingStatus === 'RESTRICTED' || trainingStatus === 'IN REHAB'
          ? 61 + ((i * 5 + permId) % 9)
          : trainingStatus === 'RETURN TO PLAY' || trainingStatus === 'PENDING'
            ? 70 + ((i * 4 + permId) % 8)
            : 82 + ((i * 3 + permId + readinessShift) % 14);

    const readiness = Math.max(48, Math.min(97, baseReadiness));
    const readinessDelta =
      readiness < 70 ? -12 + (i % 5) : readiness < 80 ? -4 + (i % 4) : 2 + (i % 5);

    const acwrRaw =
      trainingStatus === 'RESTRICTED' || trainingStatus === 'INJURED'
        ? 1.38 + ((i * 3 + permId) % 14) * 0.01
        : 0.95 + ((i * 5 + permId) % 24) * 0.01 + acwrShift;
    const acwr = Number(Math.max(0.82, Math.min(1.55, acwrRaw)).toFixed(2));

    const chronicLoadAu = 460 + ((i * 35 + permId * 17) % 210);
    const acuteLoadAu = Math.round(chronicLoadAu * acwr);
    const trainingLoadPct = Math.min(98, Math.max(55, Math.round((acuteLoadAu / 800) * 100)));
    const trainingLoad: Athlete['trainingLoad'] =
      acwr >= 1.32 ? 'High' : acwr >= 1.12 ? 'Moderate' : 'Normal';

    const hrvBaselineMs = 60 + ((i * 4 + permId) % 18);
    const hrvMs =
      readiness < 68
        ? Math.max(42, hrvBaselineMs - 10 - (i % 5))
        : Math.max(50, hrvBaselineMs + ((permId % 7) - 3) + (i % 6));

    const sleepHours =
      readiness < 68
        ? Number((5.6 + (i % 4) * 0.2).toFixed(1))
        : Number((7.2 + ((i + permId) % 6) * 0.2).toFixed(1));
    const sleepWhole = Math.floor(sleepHours);
    const sleepMins = Math.round((sleepHours - sleepWhole) * 60);
    const sleepFormatted = `${sleepWhole}h ${String(sleepMins).padStart(2, '0')}m`;

    const nutritionCompliancePct = Math.max(
      74,
      Math.min(99, 85 + ((i * 5 + permId * 3) % 14) - (readiness < 68 ? 6 : 0))
    );
    const hydrationStatus =
      readiness < 68 || (i + permId) % 5 === 0
        ? i % 2 === 0
          ? 'Mild Dehydration'
          : 'Monitor'
        : 'Optimal';

    const position =
      sportCfg.positions[(i + sportIdx + progIdx) % sportCfg.positions.length];

    const [hMin, hMax] = sportCfg.heightRange;
    const heightCm = isFemale
      ? hMin - 8 + ((i * 3 + sportIdx * 2) % (hMax - hMin))
      : hMin + ((i * 3 + sportIdx * 2) % (hMax - hMin));
    const weightKg = Number(
      (heightCm * sportCfg.weightMultiplier + ((i + permId) % 6) - (isFemale ? 6 : 0)).toFixed(1)
    );

    const readinessHistory14d = Array.from({ length: 14 }, (_, d) =>
      Math.max(50, Math.min(98, readiness + Math.round(Math.sin(d + i) * 4) + (13 - d > 5 ? -readinessDelta / 3 : 0)))
    );
    readinessHistory14d[13] = readiness;

    const loadHistory14d = Array.from({ length: 14 }, (_, d) =>
      d % 7 === 2 ? 0 : Math.round(acuteLoadAu * (0.78 + ((d + i) % 5) * 0.06))
    );
    loadHistory14d[13] = acuteLoadAu;

    const injTemplate = sportCfg.injuries[(i + permId) % sportCfg.injuries.length];

    generatedAthletes.push({
      id: athId,
      athleteId: athCode,
      name: fullName,
      code: athCode,
      dob,
      gender: isFemale ? 'Female' : 'Male',
      nationality: 'India',
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${fedMeta.emailDomain}`,
      phone: `+91 98${100 + ((permId + i) % 899)} ${20000 + ((permId * 13 + i * 101) % 79999)}`,
      emergencyContact: `R. ${lastName} (+91 98${200 + ((permId + i) % 799)} 11002)`,
      sport: context.sport,
      discipline,
      program: context.program,
      squad: context.squad,
      subSquad: context.squad,
      position,
      jerseyNumber: (i + 1) * 2 + (permId % 5),
      age: baseAge,
      heightCm,
      weightKg,
      coach: verificationStatus === 'Pending' && i % 2 === 1 ? 'Unassigned' : primaryCoach,
      coachRole: verificationStatus === 'Pending' && i % 2 === 1 ? 'Pending Assignment' : 'Head Coach',
      readiness,
      readinessDelta,
      injuryRisk,
      trainingLoad,
      trainingLoadPct,
      acuteLoadAu,
      chronicLoadAu,
      acwr,
      recovery: Math.max(52, Math.min(96, readiness + 2)),
      hrvMs,
      hrvBaselineMs,
      sleepHours,
      sleepFormatted,
      wellnessScore: Number((readiness / 11).toFixed(1)),
      sorenessScore: readiness < 68 ? 6 : readiness < 78 ? 4 : 2,
      status,
      trainingStatus,
      verificationStatus,
      medicalStatus,
      profileCompletion: verificationStatus === 'Verified' ? 96 : 82,
      profileCompletionBreakdown: {
        basicInfo: true,
        sportInfo: true,
        documents: verificationStatus === 'Verified',
        coachAssignment: !(verificationStatus === 'Pending' && i % 2 === 1),
        medicalClearance: medicalStatus === 'Cleared',
        emergencyContact: true,
      },
      lastUpdated: 'Today',
      riskSignals:
        readiness < 70
          ? [
              `Acute workload spike (ACWR ${acwr} · ${acuteLoadAu} AU in ${context.sport})`,
              `Morning HRV rMSSD depressed (${hrvMs} ms vs ${hrvBaselineMs} ms baseline)`,
              `${injTemplate.display} load sensitivity flagged in ${context.program}`,
            ]
          : [
              `Optimal ${context.sport} readiness & autonomic balance (${hrvMs} ms HRV)`,
              `Cleared for full ${context.squad} intensity prescription`,
            ],
      previousInjuryHistory:
        readiness < 75
          ? `${injTemplate.title} (${injTemplate.display} · Managed under ${context.federation})`
          : 'No time-loss injuries in past 12 months',
      nutritionCompliancePct,
      hydrationStatus,
      readinessHistory14d,
      loadHistory14d,
      aiSummary: `${fullName} (${context.sport} · ${position}) under ${context.federation} (${context.program}) currently registers ${readiness}% readiness with ACWR ${acwr} and ${hrvMs} ms overnight HRV.`,
      keySignals: buildGenericSignals(
        sleepFormatted,
        hrvMs,
        acuteLoadAu,
        Number((readiness / 11).toFixed(1))
      ),
      performanceScore: Math.min(96, Math.max(70, readiness + 4)),
      aiPerformanceInsight: `${fullName} ranks in the top quartile of ${context.program} (${context.sport}) for ${position} power-to-weight and sport-specific benchmarks.`,
      performanceMetrics: buildSportPerformanceMetrics(context.sport, i, permId),
      documents: ARJUN_DOCUMENTS.map((d, idx) => ({
        ...d,
        id: `${athId}-doc-${idx}`,
        status:
          verificationStatus === 'Pending' && idx === 1
            ? 'Pending Review'
            : 'Verified',
      })),
      timeline: ARJUN_TIMELINE.slice(0, 4),
      auditTrail: ARJUN_AUDIT_TRAIL,
      recentSessions: [
        {
          sessionId: `sess-${permId}-1`,
          title: sportCfg.sessions[0].title,
          rpe: readiness < 70 ? 8.5 : 7,
          loadAu: acuteLoadAu,
          highSpeedMeters: 480 + ((i * 65 + permId * 20) % 420),
        },
      ],
      medicalNote:
        medicalStatus === 'Cleared'
          ? `Cleared for full ${context.sport} competition and training at ${fedMeta.campusLocation}.`
          : `Active clinical monitoring for ${injTemplate.display} (${injTemplate.title}). Speed/load ceiling enforced.`,
    });
  }

  // Generate sport & context-scoped clinical injuries linked to the generated athletes
  const injuryCandidates = generatedAthletes.filter(
    (a) =>
      a.trainingStatus === 'INJURED' ||
      a.trainingStatus === 'IN REHAB' ||
      a.trainingStatus === 'RETURN TO PLAY' ||
      a.trainingStatus === 'RESTRICTED'
  );

  const generatedInjuries: Injury[] = (
    injuryCandidates.length > 0 ? injuryCandidates : generatedAthletes.slice(0, 2)
  )
    .slice(0, Math.max(2, Math.min(5, 2 + (permId % 4))))
    .map((ath, idx) => {
      const tpl = sportCfg.injuries[(idx + permId) % sportCfg.injuries.length];
      const rtpStage =
        ath.trainingStatus === 'RETURN TO PLAY'
          ? 4
          : ath.trainingStatus === 'RESTRICTED'
            ? 3
            : ath.trainingStatus === 'IN REHAB'
              ? 2
              : 1;
      const severity: Injury['severity'] =
        ath.trainingStatus === 'INJURED'
          ? 'Severe'
          : idx % 2 === 0
            ? 'Moderate'
            : 'Minor';
      const rtpStageName =
        rtpStage >= 5 ? 'Return to Competition'
        : rtpStage >= 4 ? 'Full Training'
        : rtpStage >= 3 ? 'Sport-Specific Training'
        : rtpStage >= 2 ? 'Strength Restoration'
        : 'Pain Reduction';
      const estimatedRtpDate = `${4 + ((idx * 5 + permId) % 18)} Oct 2026`;
      const bodyPart = tpl.display
        .replace(' — Right', '')
        .replace(' — Left', '')
        .replace('Right ', '')
        .replace('Left ', '')
        .split('/')[0]
        .trim();

      return {
        id: `inj-${permId}-${idx + 1}`,
        athleteId: ath.id,
        athleteName: ath.name,
        sport: context.sport,
        position: ath.position,
        squad: context.squad,
        bodyPart,
        bodyRegion: tpl.region,
        bodyRegionDisplay: tpl.display,
        side: (tpl.display.includes('Left')
          ? 'Left'
          : tpl.display.includes('Right')
            ? 'Right'
            : 'Bilateral') as 'Left' | 'Right' | 'Bilateral',
        injuryTitle: tpl.title,
        diagnosis: tpl.diagnosis,
        grade: severity === 'Severe' ? 'Grade III' : severity === 'Moderate' ? 'Grade II' : 'Grade I',
        severity,
        painScore: Math.max(1, 6 - rtpStage),
        stage: (rtpStage >= 4
          ? 'Return-to-Play'
          : rtpStage >= 2
            ? 'Rehabilitation'
            : 'Assessment') as Injury['stage'],
        rtpStage,
        rtpStageName,
        rehabProgressPct: Math.min(95, rtpStage * 20),
        medicalStatus: (rtpStage >= 4 ? 'Pending' : 'Restricted') as Injury['medicalStatus'],
        onsetDate: `${12 + ((idx * 3 + permId) % 14)} Sep 2026`,
        estimatedRtpDate,
        daysToRtp: 4 + ((idx * 5 + permId) % 18),
        leadClinician: 'Dr. S. Patel (Lead Physiotherapist)',
        rehabCompliancePct: 85 + (permId % 12),
        mechanism: `${context.sport} high-intensity ${ath.position} exposure (${context.program})`,
        initialAssessment: `${tpl.title} — Assessed at ${fedMeta.campusLocation}. ${tpl.diagnosis}.`,
        restrictions: rtpStage >= 3
          ? 'Capped at 85% Vmax; modified volume'
          : 'Off-feet / Clinical rehab bay only',
        currentProtocol: `Stage ${rtpStage}/5 ${
          rtpStage >= 4 ? 'Return-to-Play' : rtpStage >= 2 ? 'Rehabilitation' : 'Assessment'
        } Protocol`,
        lastUpdated: 'Today',
        gateCriteria: {
          painThresholdMet: rtpStage >= 2,
          strengthSymmetryMet: rtpStage >= 3,
          runningToleranceMet: rtpStage >= 3,
          functionalTestMet: rtpStage >= 4,
          medicalClearanceMet: false,
          limbSymmetryIndexPct: 82 + rtpStage * 3 + (permId % 4),
          dynamicPainScore: Math.max(1, 5 - rtpStage),
        },
        medicalNotes: [
          {
            id: `mn-${permId}-${idx}`,
            injuryId: `inj-${permId}-${idx + 1}`,
            athleteId: ath.id,
            noteType: 'Progress' as const,
            note: `${tpl.title} clinical reassessment at ${fedMeta.campusLocation}. Stage ${rtpStage}/5 progression active.`,
            author: 'Dr. S. Patel',
            authorRole: 'Physiotherapist',
            date: '28 Sep 2026 · 08:30',
          },
        ],
      };
    });

  // Generate sport & context-scoped training sessions
  const sessionCount = 3 + (permId % 2); // 3 or 4 sessions
  const generatedSessions: TrainingSession[] = sportCfg.sessions
    .slice(0, sessionCount)
    .map((sTpl, idx) => {
      const attendedCount = Math.max(
        4,
        generatedAthletes.length - ((idx + permId) % 2)
      );
      const attendancePct = Math.round(
        (attendedCount / generatedAthletes.length) * 100
      );
      const plannedLoadAu = 420 + ((idx * 110 + permId * 23) % 360);
      return {
        id: `sess-${permId}-${idx + 1}`,
        title: sTpl.title,
        category: sTpl.category,
        time:
          idx === 0
            ? '07:30 – 09:00'
            : idx === 1
              ? '10:30 – 11:45'
              : idx === 2
                ? '15:00 – 16:30'
                : '17:30 – 18:30',
        durationMin: idx === 0 || idx === 2 ? 90 : 75,
        coach: primaryCoach,
        coachRole: 'Head Coach',
        squad: context.squad,
        pitchOrVenue: `${sTpl.venue} (${fedMeta.codePrefix})`,
        attendance: attendancePct,
        attendedCount,
        scheduledCount: generatedAthletes.length,
        intensity: idx === 0 || idx === 2 ? 'High' : 'Moderate',
        status: idx < 2 ? 'Completed' : 'Upcoming',
        plannedLoadAu,
        actualLoadAu: idx < 2 ? plannedLoadAu + ((permId * 7) % 45) : undefined,
        targetHighSpeedM:
          sTpl.category === 'Strength'
            ? 0
            : 380 + ((idx * 140 + permId * 35) % 480),
        objectives: sTpl.objectives,
        drills: [
          {
            name: `${context.sport} Specific Activation & Biomechanics`,
            duration: '20 min',
            targetZone: 'Zone 2',
          },
          {
            name: sTpl.title,
            duration: '45 min',
            targetZone: 'High Intensity (85–92% HRmax)',
          },
        ],
        modifiedAthletes: injuryCandidates.slice(0, 2).map((a) => ({
          athleteId: a.id,
          athleteName: a.name,
          modification: 'Capped peak load / velocity per clinical RTP protocol',
        })),
        notes: `${context.federation} · ${context.sport} (${context.program}) session telemetry synced.`,
      };
    });

  // Generate context-scoped nutrition plans
  const calorieBase =
    context.sport === 'Swimming'
      ? 3900
      : context.sport === 'Athletics'
        ? 3400
        : context.sport === 'Field Hockey'
          ? 3500
          : context.sport === 'Badminton'
            ? 3100
            : 3300;

  const generatedNutritionPlans: NutritionPlan[] = generatedAthletes.map(
    (ath, idx) => {
      const goal: NutritionGoal =
        ath.trainingStatus === 'IN REHAB' || ath.trainingStatus === 'INJURED'
          ? 'Recovery'
          : idx % 3 === 0
            ? 'Competition Preparation'
            : 'Performance + Recovery';
      const targetCalories = calorieBase + ((idx * 120 + permId * 35) % 700);
      const currentCalories = calorieBase - 100 + ((idx * 110 + permId * 30) % 650);
      const targetProteinG = 175 + ((idx * 12 + permId * 5) % 55);
      const currentProteinG = 165 + ((idx * 12 + permId * 5) % 55);
      const targetCarbsG = Math.round(calorieBase * 0.13) + ((idx * 20 + permId * 10) % 100);
      const currentCarbsG = Math.round(calorieBase * 0.12) + ((idx * 20 + permId * 10) % 100);
      const targetFatG = 85 + ((idx * 6 + permId * 3) % 25);
      const currentFatG = 75 + ((idx * 6 + permId * 3) % 25);
      const targetHydrationL = Number((context.sport === 'Swimming' ? 4.0 : 3.5 + (idx % 3) * 0.3).toFixed(1));
      const currentHydrationL = Number((context.sport === 'Swimming' ? 3.6 : 3.1 + (idx % 3) * 0.3).toFixed(1));
      return {
        id: `np-${permId}-${idx + 1}`,
        athleteId: ath.id,
        athleteName: ath.name,
        sport: context.sport,
        squad: context.squad,
        planName: `${context.sport} — ${ath.position} ${goal} Plan`,
        goal,
        trainingPhase: isMatchDaySquad ? 'Competition Block' : isRehabSquad ? 'Rehabilitation' : 'High Load Block',
        targetCalories,
        currentCalories,
        targetProteinG,
        currentProteinG,
        targetCarbsG,
        currentCarbsG,
        targetFatG,
        currentFatG,
        targetHydrationL,
        currentHydrationL,
        mealFrequency: 5,
        startDate: '01 Sep 2026',
        endDate: '30 Sep 2026',
        compliancePct: ath.nutritionCompliancePct,
        hydrationCompliancePct: Math.max(70, Math.min(98, ath.nutritionCompliancePct - 4)),
        supplementCompliancePct: Math.max(80, Math.min(99, ath.nutritionCompliancePct + 2)),
        bodyCompStatus: 'Stable' as const,
        status: (ath.trainingStatus === 'INJURED' || ath.nutritionCompliancePct < 80
          ? 'Review Required'
          : ath.nutritionCompliancePct < 88
            ? 'Monitor'
            : 'On Track') as NutritionPlan['status'],
        compliance7d: [
          { day: 'Mon', compliancePct: Math.max(75, ath.nutritionCompliancePct - 3), hydrationPct: Math.max(70, ath.nutritionCompliancePct - 7) },
          { day: 'Tue', compliancePct: Math.max(75, ath.nutritionCompliancePct + 1), hydrationPct: Math.max(70, ath.nutritionCompliancePct - 5) },
          { day: 'Wed', compliancePct: Math.max(75, ath.nutritionCompliancePct - 5), hydrationPct: Math.max(70, ath.nutritionCompliancePct - 9) },
          { day: 'Thu', compliancePct: Math.max(75, ath.nutritionCompliancePct + 2), hydrationPct: Math.max(70, ath.nutritionCompliancePct - 3) },
          { day: 'Fri', compliancePct: Math.max(75, ath.nutritionCompliancePct - 2), hydrationPct: Math.max(70, ath.nutritionCompliancePct - 6) },
          { day: 'Sat', compliancePct: Math.max(75, ath.nutritionCompliancePct + 1), hydrationPct: Math.max(70, ath.nutritionCompliancePct - 4) },
          { day: 'Sun', compliancePct: ath.nutritionCompliancePct, hydrationPct: Math.max(70, ath.nutritionCompliancePct - 5) },
        ],
        meals: INITIAL_NUTRITION_PLANS[0]?.meals || [],
      };
    }
  );

  // Generate rehab plans matching generated injuries
  const generatedRehabPlans: RehabPlanRecord[] = generatedInjuries.map(
    (inj) => ({
      ...(INITIAL_REHAB_PLANS[0] || {
        totalStages: 5,
        stages: [],
        sessions: [],
      }),
      id: `rehab-${inj.id}`,
      injuryId: inj.id,
      athleteId: inj.athleteId,
      athleteName: inj.athleteName,
      title: `${inj.injuryTitle} — ${context.sport} RTP Protocol`,
      currentStage: inj.rtpStage,
      progressPct: Math.min(95, inj.rtpStage * 20),
      trackStatus: inj.severity === 'Severe' ? 'At Risk' : 'On Track',
      currentFocus: `${inj.bodyRegionDisplay} load tolerance & symmetry restoration`,
      nextMilestone: `Stage ${Math.min(5, inj.rtpStage + 1)} Clinical Clearance Gate`,
      targetDate: inj.estimatedRtpDate,
    })
  );

  // Generate Medical Alerts & Risk Alerts for this cohort
  const generatedMedicalAlerts: MedicalOperationalAlert[] = generatedInjuries.map((inj, idx) => ({
    id: `med-alert-${permId}-${idx + 1}`,
    type: idx % 2 === 0 ? 'RTP assessment due' : 'New injury reported',
    title: `Clinical Alert: ${inj.athleteName} (${inj.position})`,
    detail: `${inj.injuryTitle} (${inj.bodyRegionDisplay}) under active Stage ${inj.rtpStage}/5 protocol in ${context.squad}.`,
    timestamp: `${10 + idx}:30 AM`,
    severity: inj.severity === 'Severe' ? 'high' : 'medium',
    athleteId: inj.athleteId,
    injuryId: inj.id,
    acknowledged: false,
  }));

  const riskCandidates = generatedAthletes.filter((a) => a.injuryRisk === 'High' || a.acwr >= 1.32);
  const generatedMedicalRiskAlerts: MedicalRiskAlertItem[] = (
    riskCandidates.length > 0 ? riskCandidates : generatedAthletes.slice(0, 2)
  ).slice(0, 3).map((ath, idx) => ({
    id: `mra-${permId}-${idx + 1}`,
    athleteId: ath.id,
    athleteName: ath.name,
    tier: ath.acwr >= 1.35 ? 'ELEVATED RISK' : 'MONITOR',
    risk: ath.acwr >= 1.35 ? 'High' : 'Moderate',
    reason: `Acute workload spike (ACWR ${ath.acwr}) with depressed HRV (${ath.hrvMs} ms) in ${context.sport}.`,
    suggestedAction: `Cap ${context.sport} training intensity to 80% Vmax; schedule soft-tissue screening.`,
    status: 'Active',
    assignedTo: 'Dr. S. Patel',
  }));

  // Generate Wellness Profile for lead athlete
  const leadAthlete = generatedAthletes[0];
  const generatedWellnessProfile: WellnessProfile = {
    athleteId: leadAthlete.id,
    athleteName: leadAthlete.name,
    sleep: Math.max(4, Math.round(leadAthlete.sleepHours)),
    stress: leadAthlete.readiness < 70 ? 7 : 3,
    soreness: leadAthlete.sorenessScore,
    fatigue: leadAthlete.readiness < 70 ? 7 : 4,
    mood: leadAthlete.readiness < 70 ? 6 : 8,
    recovery: Math.round(leadAthlete.recovery / 10),
    trend7d: [
      { day: 'Mon', composite: 7.2, sleep: 7.5, fatigue: 6.8, recovery: 7.4 },
      { day: 'Tue', composite: 7.0, sleep: 7.0, fatigue: 7.1, recovery: 7.1 },
      { day: 'Wed', composite: 6.8, sleep: 6.5, fatigue: 7.5, recovery: 6.8 },
      { day: 'Thu', composite: 7.4, sleep: 7.8, fatigue: 6.5, recovery: 7.5 },
      { day: 'Fri', composite: 6.9, sleep: 6.8, fatigue: 7.3, recovery: 7.0 },
      { day: 'Sat', composite: 7.1, sleep: 7.2, fatigue: 7.0, recovery: 7.2 },
      { day: 'Sun', composite: Number((leadAthlete.readiness / 11).toFixed(1)), sleep: leadAthlete.sleepHours, fatigue: leadAthlete.sorenessScore, recovery: Number((leadAthlete.recovery / 10).toFixed(1)) },
    ],
  };

  // Generate Sport-Specific Tests Library
  const generatedTests: Test[] = sportCfg.testBatteries.map((tb, idx) => ({
    id: `test-${context.sport.toLowerCase()}-${idx + 1}`,
    name: tb.name,
    category: tb.category,
    unit: tb.unit,
    benchmark: tb.benchmarkStr,
    numericBenchmark: tb.numericBenchmark,
    lowerIsBetter: tb.lowerIsBetter,
    frequency: 'Monthly',
    status: 'Active',
  }));

  // Generate Assessment Program for this context
  const generatedAssessmentPrograms: AssessmentProgram[] = [
    {
      id: `ap-${permId}-1`,
      programName: `${context.sport} — ${context.program} Performance Battery`,
      sport: context.sport,
      squad: context.squad,
      assessmentPeriod: 'September 2026',
      tests: generatedTests.map((t) => t.name),
      evaluator: primaryCoach,
      deadline: '30 Sep 2026',
      athleteIds: generatedAthletes.map((a) => a.id),
      status: 'Active',
    },
    {
      id: `ap-${permId}-2`,
      programName: `${context.sport} Pre-Competition Readiness Screen`,
      sport: context.sport,
      squad: context.squad,
      assessmentPeriod: 'October 2026 (Scheduled)',
      tests: [generatedTests[0]?.name || 'Linear Sprint', generatedTests[1]?.name || 'Power CMJ'],
      evaluator: 'Sports Science Team',
      deadline: '10 Oct 2026',
      athleteIds: generatedAthletes.slice(0, 6).map((a) => a.id),
      status: 'Scheduled',
    },
  ];

  // Generate Test Results matching the generated athletes
  const generatedTestResults: TestResult[] = [];
  generatedAthletes.forEach((ath, athIdx) => {
    generatedTests.slice(0, 3).forEach((test, testIdx) => {
      const isBetter = ath.readiness >= 78;
      const factor = isBetter
        ? (test.lowerIsBetter ? 0.96 : 1.05)
        : (test.lowerIsBetter ? 1.04 : 0.94);
      const curr = Number((test.numericBenchmark * factor + (athIdx % 3) * 0.02).toFixed(test.lowerIsBetter ? 2 : 1));
      const prev = Number((curr * (test.lowerIsBetter ? 1.02 : 0.98)).toFixed(test.lowerIsBetter ? 2 : 1));
      const pb = Number((curr * (test.lowerIsBetter ? 0.97 : 1.04)).toFixed(test.lowerIsBetter ? 2 : 1));

      generatedTestResults.push({
        id: `tr-${permId}-${athIdx}-${testIdx}`,
        testId: test.id,
        testName: test.name,
        category: test.category,
        unit: test.unit,
        athleteId: ath.id,
        athleteName: ath.name,
        squad: context.squad,
        currentResult: curr,
        previousResult: prev,
        personalBest: pb,
        squadAverage: test.numericBenchmark,
        programBenchmark: test.numericBenchmark,
        nationalBenchmark: Number((test.numericBenchmark * (test.lowerIsBetter ? 0.94 : 1.08)).toFixed(test.lowerIsBetter ? 2 : 1)),
        lowerIsBetter: test.lowerIsBetter,
        improvementPct: isBetter ? 2.8 : -1.4,
        progressionStatus: isBetter ? 'Improving' : 'Stable',
        cycleHistory: [
          { cycle: 'Jun 26', value: prev, squadAvg: test.numericBenchmark, benchmark: test.numericBenchmark },
          { cycle: 'Jul 26', value: prev, squadAvg: test.numericBenchmark, benchmark: test.numericBenchmark },
          { cycle: 'Aug 26', value: prev, squadAvg: test.numericBenchmark, benchmark: test.numericBenchmark },
          { cycle: 'Sep 26', value: curr, squadAvg: test.numericBenchmark, benchmark: test.numericBenchmark },
        ],
        fieldStatus: 'Completed',
        validated: true,
      });
    });
  });

  // Generate Talent Profiles for this cohort
  const generatedTalentProfiles: TalentProfile[] = generatedAthletes.slice(0, 4).map((ath, idx) => ({
    id: `tp-${permId}-${idx + 1}`,
    athleteId: ath.id,
    athleteName: ath.name,
    ageGroup: isU19 ? 'U-19' : isU23 ? 'U-23' : 'Senior',
    sport: context.sport,
    squad: context.squad,
    position: ath.position,
    scores: {
      speed: 82 + ((idx * 4 + permId) % 15),
      power: 80 + ((idx * 5 + permId) % 16),
      endurance: 84 + ((idx * 3 + permId) % 14),
      strength: 78 + ((idx * 6 + permId) % 18),
      sportSpecific: 85 + ((idx * 4 + permId) % 12),
    },
    basePerformanceIndex: ath.performanceScore,
    benchmarkAlignment: ath.readiness >= 82 ? 'High' : 'Moderate',
    developmentPriority:
      idx % 3 === 0
        ? 'Acceleration & RSA Focus'
        : idx % 3 === 1
          ? 'Strength & Power Progression'
          : 'Tactical Transition',
    status: ath.squad.includes('Senior') ? 'Promoted to Senior Squad' : 'Active Candidate',
    developmentAreas: [
      `High-speed ${context.sport} deceleration control`,
      'Aerobic recovery kinetics post-match',
    ],
    strengths: [
      `Exceptional ${ath.position} positional awareness`,
      'First-step reaction and force transfer',
    ],
    suggestedDevelopmentFocus: `Increase eccentric lower-limb volume for ${context.sport} longevity under ${context.federation}.`,
    assessmentEvidence: [
      `${context.sport} battery score: ${ath.performanceScore}/100`,
      `Overnight autonomic HRV: ${ath.hrvMs} ms`,
    ],
  }));

  // Generate Hydration Logs for lead athlete
  const generatedHydrationLogs: HydrationLog[] = [
    { id: `hlog-${permId}-1`, athleteId: leadAthlete.id, time: '07:15', amountMl: 500, beverageType: 'Electrolyte Solution' },
    { id: `hlog-${permId}-2`, athleteId: leadAthlete.id, time: '09:45', amountMl: 750, beverageType: 'Pure Water' },
    { id: `hlog-${permId}-3`, athleteId: leadAthlete.id, time: '12:30', amountMl: 600, beverageType: 'Hypotonic Sports Drink' },
    { id: `hlog-${permId}-4`, athleteId: leadAthlete.id, time: '15:15', amountMl: 500, beverageType: 'Protein Recovery Shake' },
  ];

  // Generate Supplements tailored to sport
  const generatedSupplements: Supplement[] = sportCfg.supplements.map((s, idx) => ({
    id: `supp-${permId}-${idx + 1}`,
    athleteId: leadAthlete.id,
    name: s.name,
    purpose: s.purpose,
    dosage: s.dosage,
    schedule: s.timing,
    compliancePct: 92 + (idx % 6),
    status: 'Active' as const,
  }));

  // Generate Body Composition tailored to sport
  const isFemale = leadAthlete.gender === 'Female';
  const bodyFatPct = isFemale
    ? context.sport === 'Athletics' ? 14.5 : 18.2
    : context.sport === 'Athletics' ? 8.2 : 10.4;
  const leanMassKg = Number((leadAthlete.weightKg * (1 - bodyFatPct / 100)).toFixed(1));
  const bmi = Number((leadAthlete.weightKg / ((leadAthlete.heightCm / 100) ** 2)).toFixed(1));
  const generatedBodyComposition: BodyComposition = {
    athleteId: leadAthlete.id,
    athleteName: leadAthlete.name,
    weightKg: leadAthlete.weightKg,
    bodyFatPct,
    leanMassKg,
    bmi,
    statusLabel: 'Stable',
    aiObservation: `${leadAthlete.name} body composition is within optimal ranges for ${context.sport}. Lean mass trending positively across the current ${context.program} cycle under ${context.federation}.`,
    history8w: Array.from({ length: 8 }, (_, w): BodyCompositionPoint => ({
      week: `W${w + 1}`,
      weightKg: Number((leadAthlete.weightKg - 0.5 + w * 0.1 + (permId % 3) * 0.05).toFixed(1)),
      bodyFatPct: Number((bodyFatPct + 0.4 - w * 0.1).toFixed(1)),
      leanMassKg: Number((leanMassKg - 0.2 + w * 0.08).toFixed(1)),
      bmi: Number((bmi - 0.2 + w * 0.04).toFixed(1)),
    })),
  };

  // Generate Reports
  const generatedReports: Report[] = [
    {
      id: `rep-${permId}-1`,
      reportName: `${context.sport} — ${context.program} Longitudinal Performance Dossier`,
      scope: `${context.federation} → ${context.sport} → ${context.squad}`,
      metrics: ['Readiness', 'Training Load', 'Injury Incidence', 'Assessment Benchmarks'],
      dateRange: '01 Sep 2026 – 28 Sep 2026',
      filters: `Active Cohort (${generatedAthletes.length} athletes)`,
      format: 'PDF',
      createdAt: '28 Sep 2026 · 09:00',
      createdBy: 'USI Performance Analytics Engine',
      status: 'Ready',
    },
    {
      id: `rep-${permId}-2`,
      reportName: `${context.squad} Weekly Training Load & Injury Surveillance`,
      scope: `${context.sport} · ${context.squad}`,
      metrics: ['ACWR', 'High-Speed Yardage', 'Rehab Milestones'],
      dateRange: 'Past 7 Days',
      filters: 'Squad Roster',
      format: 'Excel',
      createdAt: '28 Sep 2026 · 07:30',
      createdBy: primaryCoach,
      status: 'Ready',
    },
    {
      id: `rep-${permId}-3`,
      reportName: `${context.sport} Talent Identification & Benchmark Report`,
      scope: `${context.federation} Pathway`,
      metrics: ['Force Plate RFD', 'Sprint Gate Velocity', 'Autonomic Balance'],
      dateRange: 'Q3 2026 Cycle',
      filters: 'Carded Athletes',
      format: 'CSV',
      createdAt: '26 Sep 2026',
      createdBy: 'Dr. R. Subramanian',
      status: 'Scheduled',
    },
  ];

  // Generate 14-day Analytics Series with distinct values per permutation
  const meanReadiness = Math.round(
    generatedAthletes.reduce((s, a) => s + a.readiness, 0) / generatedAthletes.length
  );
  const meanLoad = Math.round(
    generatedAthletes.reduce((s, a) => s + a.acuteLoadAu, 0) / generatedAthletes.length
  );
  const meanAcwr = Number(
    (generatedAthletes.reduce((s, a) => s + a.acwr, 0) / generatedAthletes.length).toFixed(2)
  );

  const generatedAnalyticsSeries: DailyAnalyticsPoint[] = Array.from({ length: 14 }, (_, d) => {
    const dayOffset = 13 - d;
    const dayNum = 15 + d;
    const wave = Math.sin((d + permId) * 0.8) * 5;
    return {
      date: `${dayNum} Sep 2026`,
      shortDate: `${dayNum} Sep`,
      readinessPct: Math.max(55, Math.min(96, Math.round(meanReadiness + wave))),
      trainingLoadAu: Math.round(meanLoad * (0.82 + ((d + permId) % 5) * 0.08)),
      chronicLoadAu: Math.round(meanLoad * 0.95),
      acwr: Number(Math.max(0.85, Math.min(1.48, meanAcwr + wave * 0.02)).toFixed(2)),
      activeInjuries: generatedInjuries.length,
      elevatedRiskCount: riskCandidates.length,
      attendancePct: 92 + (d % 6),
    };
  });

  // Generate Recommendations referencing this sport and athletes
  const leadRiskAthlete = riskCandidates[0] || generatedAthletes[0];
  const leadInjuredAthlete = generatedInjuries[0] || {
    athleteId: generatedAthletes[0].id,
    athleteName: generatedAthletes[0].name,
    injuryTitle: 'Hamstring Strain Grade II',
    rtpStage: 2,
    squad: context.squad,
  };

  const generatedRecommendations: AIRecommendation[] = [
    {
      id: `rec-${permId}-1`,
      priority: 'High',
      statement: `Cap ${context.sport} peak speed for ${leadRiskAthlete.name}`,
      explanation: `Acute workload elevated (ACWR ${leadRiskAthlete.acwr}) in ${context.program}. Reduce high-speed volume by 25% today.`,
      signals: [
        `ACWR ${leadRiskAthlete.acwr} — exceeds 1.30 safe training zone`,
        `HRV ${leadRiskAthlete.hrvMs} ms — depressed vs ${leadRiskAthlete.hrvBaselineMs} ms baseline`,
        `Readiness ${leadRiskAthlete.readiness}% — below optimal threshold`,
      ],
      targetType: 'Athlete',
      targetLabel: leadRiskAthlete.name,
      linkedAthleteId: leadRiskAthlete.id,
      expectedImpact: 'ACWR reduction to safe zone (1.18); soft-tissue strain risk −18%',
      applied: false,
    },
    {
      id: `rec-${permId}-2`,
      priority: 'High',
      statement: `Advance RTP testing for ${leadInjuredAthlete.athleteName}`,
      explanation: `Clinical gate criteria for ${leadInjuredAthlete.injuryTitle} in ${context.squad} indicate readiness for Stage progression.`,
      signals: [
        `RTP Stage ${leadInjuredAthlete.rtpStage}/5 gate criteria met`,
        'Pain score and symmetry index within clinical clearance thresholds',
        `${leadInjuredAthlete.injuryTitle} protocol: milestone evidence complete`,
      ],
      targetType: 'Athlete',
      targetLabel: leadInjuredAthlete.athleteName,
      linkedAthleteId: leadInjuredAthlete.athleteId,
      expectedImpact: 'Return-to-play timeline acceleration by 3–5 days',
      applied: false,
    },
    {
      id: `rec-${permId}-3`,
      priority: 'Medium',
      statement: `Optimize ${context.sport} recovery glycogen replenishment`,
      explanation: `${leadAthlete.name} hydration compliance at ${leadAthlete.nutritionCompliancePct}%. Add 500ml electrolyte solution post-session.`,
      signals: [
        `Nutrition compliance ${leadAthlete.nutritionCompliancePct}%`,
        `Hydration status: ${leadAthlete.hydrationStatus}`,
        `Post-session carbohydrate timing window: not met in last 3 sessions`,
      ],
      targetType: 'Athlete',
      targetLabel: leadAthlete.name,
      linkedAthleteId: leadAthlete.id,
      expectedImpact: '+8% autonomic recovery score; improved next-day readiness',
      applied: false,
    },
  ];

  // Generate live AI Action Items
  const generatedAiActionItems: AIActionCentreItem[] = [
    {
      id: `act-${permId}-1`,
      priority: 'High',
      safetyClass: 'RECOMMENDATION',
      source: 'AI Workload & Readiness Engine',
      affectedAthleteId: leadRiskAthlete.id,
      affectedAthleteName: leadRiskAthlete.name,
      squad: context.squad,
      recommendation: `Cap ${context.sport} training intensity for ${leadRiskAthlete.name} to 80% Vmax today`,
      detail: `ACWR ${leadRiskAthlete.acwr} with HRV ${leadRiskAthlete.hrvMs} ms — fatigue telemetry indicates elevated injury susceptibility in ${context.sport} sessions.`,
      approverRole: 'Head Coach / Performance Director',
      status: 'Pending Review',
      confidence: 'High',
      createdAt: '07:30 AM Today',
      evidenceBundle: {
        id: `eb-act-${permId}-1`,
        title: 'Workload & Readiness Evidence',
        subjectLabel: leadRiskAthlete.name,
        confidence: 'High',
        generatedAt: '07:00 AM Today',
        metrics: [
          { domain: 'Training', label: 'ACWR', deltaOrValue: String(leadRiskAthlete.acwr), detail: 'Acute:Chronic Workload Ratio — exceeds 1.30 safe zone', tone: 'rose' },
          { domain: 'HRV', label: 'HRV rMSSD', deltaOrValue: `${leadRiskAthlete.hrvMs} ms`, detail: `vs ${leadRiskAthlete.hrvBaselineMs} ms 28-day baseline`, tone: 'amber' },
          { domain: 'Recovery', label: 'Readiness', deltaOrValue: `${leadRiskAthlete.readiness}%`, detail: 'Morning readiness score', tone: 'amber' },
        ],
      },
    },
    {
      id: `act-${permId}-2`,
      priority: 'High',
      safetyClass: 'CONSEQUENTIAL',
      source: 'AI Medical Risk Monitor',
      affectedAthleteId: leadInjuredAthlete.athleteId,
      affectedAthleteName: leadInjuredAthlete.athleteName,
      squad: context.squad,
      recommendation: `Review and approve next RTP stage for ${leadInjuredAthlete.athleteName}`,
      detail: `Physiotherapy assessment indicates Stage ${leadInjuredAthlete.rtpStage}/5 milestone clearance criteria satisfied under ${context.federation}. ${leadInjuredAthlete.injuryTitle} protocol advancing.`,
      approverRole: 'Chief Medical Officer / Lead Physiotherapist',
      status: 'Pending Review',
      confidence: 'High',
      createdAt: '08:15 AM Today',
      evidenceBundle: {
        id: `eb-act-${permId}-2`,
        title: 'RTP Clinical Evidence',
        subjectLabel: leadInjuredAthlete.athleteName,
        confidence: 'High',
        generatedAt: '08:00 AM Today',
        metrics: [
          { domain: 'Medical', label: 'Pain Score', deltaOrValue: '1/10', detail: 'Below 2/10 clinical threshold for advancement', tone: 'emerald' },
          { domain: 'Medical', label: 'Symmetry Index', deltaOrValue: '88%', detail: 'Above 85% gate criterion', tone: 'emerald' },
        ],
      },
    },
  ];

  // Generate live AI Risk Signals
  const generatedAiRiskSignals: AIRiskSignalCard[] = [
    {
      id: `sig-${permId}-1`,
      category: 'Workload Risk',
      athleteId: leadRiskAthlete.id,
      athleteName: leadRiskAthlete.name,
      squad: context.squad,
      riskLevel: leadRiskAthlete.acwr >= 1.35 ? 'High' : 'Elevated',
      signals: [
        `ACWR ${leadRiskAthlete.acwr} — workload spike detected in ${context.sport} (${context.program})`,
        `HRV rMSSD ${leadRiskAthlete.hrvMs} ms vs ${leadRiskAthlete.hrvBaselineMs} ms 28-day baseline`,
        `Sleep ${leadRiskAthlete.sleepFormatted} — below 7h optimal recovery threshold`,
      ],
      confidence: 'High',
      recommendedAction: `Modify today's ${context.sport} training: replace sprint repetition drills with tactical positioning walk-through. Cap session intensity at 80% Vmax.`,
      targetNav: 'workload' as NavItemId,
      evidenceBundle: {
        id: `eb-sig-${permId}-1`,
        title: 'Neuromuscular & Workload Evidence',
        subjectLabel: leadRiskAthlete.name,
        confidence: 'High',
        generatedAt: '07:15 AM Today',
        metrics: [
          { domain: 'Training', label: 'ACWR Spike', deltaOrValue: String(leadRiskAthlete.acwr), detail: `Exceeds 1.30 safe threshold in ${context.sport}`, tone: 'rose' },
          { domain: 'HRV', label: 'HRV Suppression', deltaOrValue: `${leadRiskAthlete.hrvMs} ms`, detail: 'Morning autonomic nervous system state', tone: 'amber' },
          { domain: 'Sleep', label: 'Sleep Duration', deltaOrValue: leadRiskAthlete.sleepFormatted, detail: 'Last night recorded via wearable', tone: 'amber' },
        ],
      },
    },
  ];

  // Generate proposed AI training modifications
  const generatedAiTrainingModifications: AITrainingModificationItem[] = [
    {
      id: `tmod-${permId}-1`,
      athleteId: leadRiskAthlete.id,
      athleteName: leadRiskAthlete.name,
      squad: context.squad,
      riskLevel: leadRiskAthlete.acwr >= 1.35 ? 'High' : 'Moderate',
      readiness: leadRiskAthlete.readiness,
      loadChange: '-25% High-Speed Volume',
      currentPrescription: `${sportCfg.sessions[0].title} — 100% Full Squad Velocity & Contact Exposure`,
      proposedPrescription: 'Capped at 80% Vmax; off-feet aerobic bike flushing substitution for high-speed elements',
      reason: `Workload spike (ACWR ${leadRiskAthlete.acwr}) under ${context.program} loading schedule. Depressed HRV ${leadRiskAthlete.hrvMs} ms vs ${leadRiskAthlete.hrvBaselineMs} ms baseline.`,
      expectedLoadImpact: 'ACWR reduction to 1.15 zone; soft-tissue strain risk −18%',
      medicalTrainingContext: `${context.sport} — ${context.program} — ${context.squad} high-intensity microcycle management`,
      approved: false,
    },
  ];

  return {
    athletes: generatedAthletes,
    injuries: generatedInjuries,
    sessions: generatedSessions,
    nutritionPlans: generatedNutritionPlans,
    rehabPlans: generatedRehabPlans,
    medicalAlerts: generatedMedicalAlerts,
    medicalRiskAlerts: generatedMedicalRiskAlerts,
    wellnessProfile: generatedWellnessProfile,
    tests: generatedTests,
    assessmentPrograms: generatedAssessmentPrograms,
    testResults: generatedTestResults,
    talentProfiles: generatedTalentProfiles,
    hydrationLogs: generatedHydrationLogs,
    supplements: generatedSupplements,
    bodyComposition: generatedBodyComposition,
    reports: generatedReports,
    analyticsSeries: generatedAnalyticsSeries,
    recommendations: generatedRecommendations,
    aiActionItems: generatedAiActionItems,
    aiRiskSignals: generatedAiRiskSignals,
    aiTrainingModifications: generatedAiTrainingModifications,
  };
}
