import {
  Athlete,
  BodyRegionId,
  HierarchyContext,
  Injury,
  NutritionPlan,
  RehabPlanRecord,
  TrainingSession,
} from '../types/usi';
import { ATHLETES, CONTEXT_OPTIONS, TRAINING_SESSIONS } from '../data/mockData';
import {
  INITIAL_MEDICAL_INJURIES,
  INITIAL_REHAB_PLANS,
} from '../data/medicalMockData';
import { INITIAL_NUTRITION_PLANS } from '../data/intelligenceMockData';
import {
  ARJUN_AUDIT_TRAIL,
  ARJUN_DOCUMENTS,
  ARJUN_TIMELINE,
  buildDefaultPerformanceMetrics,
  buildGenericSignals,
} from '../data/athlete360Defaults';

const MALE_FIRST_NAMES = [
  'Aarav', 'Vihaan', 'Vivaan', 'Aditya', 'Arjun', 'Reyansh', 'Ayaan', 'Krishna',
  'Ishaan', 'Shaurya', 'Atharv', 'Advik', 'Pranav', 'Dhruv', 'Kabir', 'Rohan',
  'Siddharth', 'Vikram', 'Devansh', 'Zorawar', 'Harsh', 'Karan', 'Nikhil', 'Yash',
  'Rishabh', 'Surya', 'Lakshya', 'Chirag', 'Satwik', 'Neeraj', 'Murali', 'Avinash',
  'Tajinder', 'Srihari', 'Sajan', 'Kushagra', 'Manpreet', 'Hardik', 'Harmanpreet', 'Mandeep',
  'Sumit', 'Abhishek', 'Gurjant', 'Vivek', 'Shamsher', 'Jarmanpreet', 'Sanjay', 'str-Rajat',
].map((n) => n.replace('str-', ''));

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
  'Katariya', 'Punia', 'Kaur', 'Devi', 'Tamang', 'Borges', 'war-Sandhu', 'Mirza',
].map((n) => n.replace('war-', ''));

const SPORT_CONFIG: Record<
  string,
  {
    positions: string[];
    disciplineMen: string;
    disciplineWomen: string;
    disciplineU23: string;
    disciplineU19: string;
    coaches: [string, string, string];
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
  }
> = {
  Football: {
    positions: ['Forward', 'Midfielder', 'Defender', 'Winger', 'Goalkeeper', 'Center Back', 'Attacking Mid'],
    disciplineMen: '11v11 Men',
    disciplineWomen: '11v11 Women',
    disciplineU23: '11v11 U-23 Olympic',
    disciplineU19: '11v11 U-19 Youth',
    coaches: ['Vikram Sharma', 'Carlos Marquez', 'Renedy Singh'],
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

export function generateContextDataset(context: HierarchyContext): {
  athletes: Athlete[];
  injuries: Injury[];
  sessions: TrainingSession[];
  nutritionPlans: NutritionPlan[];
  rehabPlans: RehabPlanRecord[];
} {
  const isInitialDefault =
    context.federation === 'National High Performance Program' &&
    context.sport === 'Football' &&
    context.program === "Senior Men's Program" &&
    context.squad === 'Senior National Squad';

  if (isInitialDefault) {
    return {
      athletes: ATHLETES,
      injuries: INITIAL_MEDICAL_INJURIES,
      sessions: TRAINING_SESSIONS,
      nutritionPlans: INITIAL_NUTRITION_PLANS,
      rehabPlans: INITIAL_REHAB_PLANS,
    };
  }

  const fedMeta =
    FEDERATION_META[context.federation] ||
    FEDERATION_META['National High Performance Program'];
  const sportCfg = SPORT_CONFIG[context.sport] || SPORT_CONFIG['Football'];

  const fedIdx = Math.max(0, CONTEXT_OPTIONS.federations.indexOf(context.federation));
  const sportIdx = Math.max(0, CONTEXT_OPTIONS.sports.indexOf(context.sport));
  const progIdx = Math.max(0, CONTEXT_OPTIONS.programs.indexOf(context.program));
  const squadIdx = Math.max(0, CONTEXT_OPTIONS.squads.indexOf(context.squad));

  // Unique integer seed for every single (federation, sport, program, squad) permutation
  const permId =
    fedIdx * 100 + sportIdx * 20 + progIdx * 5 + squadIdx + 1;

  // Vary cohort size between 7 and 12 athletes so every permutation has distinct totals & ratios
  const cohortSize = 7 + ((permId * 3 + fedIdx * 2 + sportIdx + progIdx) % 6); // 7..12

  const isWomenProgram = context.program === "Senior Women's Program";
  const isU19 = context.program === 'U-19 Elite Pathway';
  const isU23 = context.program === 'U-23 Olympic Development Program';
  const isRehabSquad = context.squad === 'Rehabilitation & RTP Unit';

  const discipline = isWomenProgram
    ? sportCfg.disciplineWomen
    : isU23
      ? sportCfg.disciplineU23
      : isU19
        ? sportCfg.disciplineU19
        : sportCfg.disciplineMen;

  const primaryCoach =
    sportCfg.coaches[(fedIdx + progIdx) % sportCfg.coaches.length];

  // Base physiological offsets per permutation so readiness, ACWR, HRV, nutrition all shift authentically
  const readinessShift = ((permId * 7) % 15) - 6; // -6 to +8
  const acwrShift = (((permId * 11) % 24) - 10) * 0.01; // -0.10 to +0.13
  const hrvShift = ((permId * 5) % 13) - 5; // -5 to +7

  const generatedAthletes: Athlete[] = [];

  for (let i = 0; i < cohortSize; i++) {
    const nameOffset = fedIdx * 13 + sportIdx * 9 + progIdx * 5 + squadIdx * 2 + i * 3;
    const isFemale =
      isWomenProgram || (!context.program.includes('Men') && (i + progIdx) % 3 === 1);
    const firstPool = isFemale ? FEMALE_FIRST_NAMES : MALE_FIRST_NAMES;
    const firstName = firstPool[nameOffset % firstPool.length];
    const lastName = LAST_NAMES[(nameOffset * 3 + sportIdx * 7 + i * 5) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;

    const codeNum = 2000 + permId * 10 + i;
    const athCode = `${fedMeta.codePrefix}-${codeNum}`;
    const athId = `ath-${fedMeta.codePrefix.toLowerCase()}-${sportIdx}-${progIdx}-${squadIdx}-${i}`;

    const baseAge = isU19
      ? 17 + (i % 3)
      : isU23
        ? 20 + (i % 3)
        : 23 + ((i + fedIdx + sportIdx) % 7);
    const birthYear = 2026 - baseAge;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dob = `${10 + ((i * 4 + permId) % 18)} ${months[(i + sportIdx) % 12]} ${birthYear}`;

    // Determine athlete status & training status based on permutation & index
    // Ensure each permutation has a distinct mix of ACTIVE, RESTRICTED, INJURED, IN REHAB, RETURN TO PLAY, PENDING
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
    } else if (i === 0 || statusRoll === 1) {
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
    } else if (statusRoll === 7) {
      trainingStatus = 'PENDING';
      status = 'Monitor';
      injuryRisk = 'Moderate';
      verificationStatus = 'Pending';
      medicalStatus = 'Pending';
    }

    if (i === cohortSize - 1 && (permId + fedIdx) % 2 === 0) {
      verificationStatus = 'Pending';
    }

    const baseReadiness =
      trainingStatus === 'INJURED'
        ? 54 + ((i * 3 + permId) % 9)
        : trainingStatus === 'RESTRICTED' || trainingStatus === 'IN REHAB'
          ? 62 + ((i * 5 + permId) % 11)
          : trainingStatus === 'RETURN TO PLAY' || trainingStatus === 'PENDING'
            ? 71 + ((i * 4 + permId) % 9)
            : 81 + ((i * 3 + permId + readinessShift) % 15);

    const readiness = Math.max(48, Math.min(97, baseReadiness));
    const readinessDelta =
      readiness < 70 ? -12 + (i % 6) : readiness < 80 ? -4 + (i % 5) : 2 + (i % 5);

    const acwrRaw =
      trainingStatus === 'RESTRICTED' || trainingStatus === 'INJURED'
        ? 1.36 + ((i * 3 + permId) % 14) * 0.01
        : 0.96 + ((i * 5 + permId) % 26) * 0.01 + acwrShift;
    const acwr = Number(Math.max(0.82, Math.min(1.54, acwrRaw)).toFixed(2));

    const chronicLoadAu = 480 + ((i * 35 + permId * 17) % 190);
    const acuteLoadAu = Math.round(chronicLoadAu * acwr);
    const trainingLoadPct = Math.min(98, Math.max(58, Math.round((acuteLoadAu / 800) * 100)));
    const trainingLoad: Athlete['trainingLoad'] =
      acwr >= 1.32 ? 'High' : acwr >= 1.12 ? 'Moderate' : 'Normal';

    const hrvBaselineMs = 60 + ((i * 4 + permId) % 18);
    const hrvMs =
      readiness < 68
        ? Math.max(42, hrvBaselineMs - 9 - (i % 6))
        : Math.max(48, hrvBaselineMs + hrvShift - 2 + (i % 7));

    const sleepHours =
      readiness < 68
        ? Number((5.7 + (i % 4) * 0.2).toFixed(1))
        : Number((7.2 + ((i + permId) % 6) * 0.2).toFixed(1));
    const sleepWhole = Math.floor(sleepHours);
    const sleepMins = Math.round((sleepHours - sleepWhole) * 60);
    const sleepFormatted = `${sleepWhole}h ${String(sleepMins).padStart(2, '0')}m`;

    const nutritionCompliancePct = Math.max(
      76,
      Math.min(99, 84 + ((i * 5 + permId * 3) % 15) - (readiness < 68 ? 5 : 0))
    );
    const hydrationStatus =
      readiness < 68 || (i + permId) % 4 === 0
        ? i % 2 === 0
          ? 'Mild Dehydration'
          : 'Monitor'
        : 'Optimal';

    const position =
      sportCfg.positions[(i + sportIdx + progIdx) % sportCfg.positions.length];

    const heightCm = isFemale
      ? 164 + ((i * 3 + sportIdx * 2) % 16)
      : 174 + ((i * 3 + sportIdx * 2) % 18);
    const weightKg = Number(
      (heightCm * (isFemale ? 0.37 : 0.42) + ((i + permId) % 6)).toFixed(1)
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
      aiPerformanceInsight: `${fullName} ranks in the top quartile of ${context.program} (${context.sport}) for ${position} power-to-weight efficiency.`,
      performanceMetrics: buildDefaultPerformanceMetrics(
        `${(3.95 + ((i + sportIdx) % 6) * 0.07).toFixed(2)}s`,
        `${46 + ((i * 2 + permId) % 12)} cm`,
        `${(18.8 + ((i + permId) % 8) * 0.3).toFixed(1)}`,
        `${88 + ((i + permId) % 10)}%`
      ),
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
          : `Active monitoring for ${injTemplate.display} (${injTemplate.title}). Speed/load ceiling enforced.`,
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

  const generatedInjuries: Injury[] = injuryCandidates
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

      return {
        id: `inj-${permId}-${idx + 1}`,
        athleteId: ath.id,
        athleteName: ath.name,
        athleteCode: ath.athleteId,
        sport: context.sport,
        program: context.program,
        squad: context.squad,
        position: ath.position,
        bodyRegion: tpl.region,
        bodyRegionDisplay: tpl.display,
        side: tpl.display.includes('Left')
          ? 'Left'
          : tpl.display.includes('Right')
            ? 'Right'
            : 'Central',
        injuryType: idx % 2 === 0 ? 'Overuse' : 'Acute',
        injuryTitle: tpl.title,
        diagnosis: tpl.diagnosis,
        severity,
        mechanism: `${context.sport} high-intensity ${ath.position} exposure (${context.program})`,
        onsetDate: `${12 + ((idx * 3 + permId) % 14)} Sep 2026`,
        reportedBy: 'Dr. S. Patel (Lead Physio)',
        assignedDoctor: 'Dr. R. Subramanian (CMO)',
        assignedPhysio: 'Dr. S. Patel',
        stage:
          rtpStage >= 4
            ? 'Return-to-Play'
            : rtpStage >= 2
              ? 'Rehabilitation'
              : 'Assessment',
        medicalStatus: rtpStage >= 4 ? 'Pending' : 'Restricted',
        trainingRestriction:
          rtpStage >= 3
            ? 'Capped at 85% Vmax; modified volume'
            : 'Off-feet / Clinical rehab bay only',
        estimatedReturn: `${4 + ((idx * 5 + permId) % 18)} Oct 2026`,
        daysActive: 6 + ((idx * 4 + permId) % 16),
        painScore: Math.max(1, 6 - rtpStage),
        painTrend: [6, 5, 4, Math.max(1, 6 - rtpStage)],
        rtpStage,
        gateCriteria: {
          painThresholdMet: rtpStage >= 2,
          strengthSymmetryMet: rtpStage >= 3,
          runningToleranceMet: rtpStage >= 3,
          functionalTestMet: rtpStage >= 4,
          medicalClearanceMet: false,
          limbSymmetryIndexPct: 82 + rtpStage * 3 + (permId % 4),
          dynamicPainScore: Math.max(1, 5 - rtpStage),
        },
        clinicalSummary: `${ath.name} (${context.sport} · ${context.program}) is in Stage ${rtpStage}/5 for ${tpl.title}.`,
        medicalNotes: [
          {
            id: `mn-${permId}-${idx}`,
            injuryId: `inj-${permId}-${idx + 1}`,
            athleteId: ath.id,
            noteType: 'Progress',
            note: `${tpl.title} clinical reassessment at ${fedMeta.campusLocation}. Stage ${rtpStage}/5 progression active.`,
            author: 'Dr. S. Patel',
            authorRole: 'Physiotherapist',
            date: '28 Sep 2026 · 08:30',
          },
        ],
        rehabSessions: [],
        lastUpdated: 'Today',
      };
    });

  // Generate sport & context-scoped training sessions
  const sessionCount = 3 + (permId % 2); // 3 or 4 sessions
  const generatedSessions: TrainingSession[] = sportCfg.sessions
    .slice(0, sessionCount)
    .map((sTpl, idx) => {
      const attendedCount = Math.max(
        4,
        generatedAthletes.length - (idx + permId) % 2
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
  const generatedNutritionPlans: NutritionPlan[] = generatedAthletes.map(
    (ath, idx) => ({
      id: `np-${permId}-${idx + 1}`,
      athleteId: ath.id,
      athleteName: ath.name,
      sport: context.sport,
      squad: context.squad,
      position: ath.position,
      goal:
        ath.trainingStatus === 'IN REHAB' || ath.trainingStatus === 'INJURED'
          ? 'Injury Recovery'
          : idx % 3 === 0
            ? 'Match Day Fueling'
            : 'High Load Conditioning',
      dailyCalorieTarget: 2650 + ((idx * 150 + permId * 40) % 900),
      actualCalorieIntake: 2550 + ((idx * 140 + permId * 35) % 850),
      carbsG: 340 + ((idx * 25 + permId * 10) % 140),
      carbsTargetG: 360 + ((idx * 25 + permId * 10) % 140),
      proteinG: 155 + ((idx * 12 + permId * 5) % 50),
      proteinTargetG: 160 + ((idx * 12 + permId * 5) % 50),
      fatG: 75 + ((idx * 6 + permId * 3) % 25),
      fatTargetG: 80 + ((idx * 6 + permId * 3) % 25),
      hydrationTargetL: Number((3.4 + (idx % 4) * 0.3).toFixed(1)),
      hydrationActualL: Number((3.1 + (idx % 4) * 0.3).toFixed(1)),
      compliancePct: ath.nutritionCompliancePct,
      assignedNutritionist: 'N. Kapoor (Lead Nutritionist)',
      lastUpdated: 'Today',
      meals: INITIAL_NUTRITION_PLANS[0]?.meals || [],
      aiSummary: `${ath.name} fueling plan tailored for ${context.sport} (${context.program}).`,
    })
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
      targetDate: inj.estimatedReturn,
    })
  );

  return {
    athletes: generatedAthletes,
    injuries: generatedInjuries,
    sessions: generatedSessions,
    nutritionPlans: generatedNutritionPlans,
    rehabPlans: generatedRehabPlans,
  };
}
