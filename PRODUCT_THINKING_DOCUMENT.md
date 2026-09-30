# PRODUCT THINKING & SYSTEMS ARCHITECTURE SPECIFICATION
## Unified Sports Interface (USI) — Athlete Management System (AMS)
**Document Owner:** Lead Product Manager, High-Performance Sports Systems  
**Status:** Shipped & Operationally Verified in Enterprise Prototype  
**Target Standard:** Tier-1 Olympic Federation, High-Performance Centre (HPC) & Enterprise Sports SaaS  
**Document Type:** Enterprise PM Delivery Specification & Systems Architecture Justification

---

## 1. Executive Summary & Core Product Strategy

### 1.1 The Enterprise Problem We Solved
Legacy Athlete Management Systems (Smartabase, Kitman Labs, Kinduct, Catapult AMS) operate as **passive, relational data silos**. Medical records, Catapult GPS telemetry, Vald force-plate outputs, and coaching session builders live in disconnected databases:
* **The Clinical-Tactical Disconnect:** A physiotherapist logs an acute hamstring strain in an EHR module, but the coach's pitchside session builder is disconnected. The coach runs high-speed sprint drills, causing preventable acute reinjury.
* **The "Data Graveyard" Paradox:** Millions of Catapult/StatsSports GPS and Vald force-plate metrics are ingested, but $85\%$ are reviewed *post-mortem* in weekly PDF reports rather than enforcing real-time pitchside volume ceilings.
* **The Flat RBAC Anti-Pattern:** Legacy tools either show confidential MRI diagnostics to coaches (breaching medical privacy/GDPR/HIPAA) or hide all context (leaving coaches blind to physical limitations).

### 1.2 The Core Product Thesis
> **"USI is an event-driven, closed-loop operating system, not a digital filing cabinet."**

Every clinical, scientific, or logistical event initiates a **deterministic, causal cascade** across all operational silos:
```
[Clinical Diagnosis (Physio)] ──► [Training Status = RESTRICTED] ──► [Pitchside Movement Ceiling] ──► [Auto-Session Adaptation]
               ▲                                                                                              │
               └───────────────── [Empirical 5-Stage Return-to-Play Exit Verification] ◄──────────────────────┘
```

---

## 2. Information Architecture (IA) & Hierarchical Scoping

To scale across multi-sport national governing bodies and Olympic committees, USI implements a **Two-Axis Architectural Grid**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        VERTICAL MULTI-TENANT HIERARCHY ENGINE                          │
│                                                                                        │
│  [Tier 1: Federation] ──► [Tier 2: Sport] ──► [Tier 3: Program] ──► [Tier 4: Squad]    │
│  National HP Program      Football, Athletics  Senior Men, U-23     Senior, Squad A    │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
┌───────────────────────────────────────────▼────────────────────────────────────────────┐
│                       PERSISTENT TOP CONTEXT & FILTER BAR                              │
│   Preserves active sport/squad cohort, role identity, and search across all transitions│
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
        ┌───────────────────────────────────┼───────────────────────────────────┐
        ▼                                   ▼                                   ▼
┌───────────────────────┐       ┌───────────────────────┐       ┌───────────────────────┐
│ OPERATIONAL EXECUTION │       │  CLINICAL & SCIENCE   │       │ GOVERNANCE & COPILOT  │
│ - Command Center      │       │ - Medical & Injury    │       │ - Assessments & TID   │
│ - Athlete Management  │       │ - Sports Science      │       │ - Analytics & BI      │
│ - Training Periodise  │       │ - Nutrition & Fueling │       │ - AI Copilot Layer    │
└───────────────────────┘       └───────────────────────┘       └───────────────────────┘
```

### Context Persistence & Switching Mechanics
The active context (`{ federation, sport, program, squad, athleteId }`) is held persistently in the Central Platform State Engine. Changing sport (e.g., *Football* $\rightarrow$ *Athletics* $\rightarrow$ *Swimming* $\rightarrow$ *Field Hockey* $\rightarrow$ *Badminton*) dynamically re-binds cohorts, coach directories, and injury registries without dropping active search queries or drawer states.

---

## 3. Deep Persona Analysis: Operational Profiles for All 8 Personas

USI deploys an **Adaptive 8-Persona Role-Based Architecture**. The interface alters data density, action buttons, and confidentiality firewalls based on the active role.

```
                                  ┌────────────────────────────────────────────────────────┐
                                  │           TIER 1: FEDERATION GOVERNANCE                │
                                  │  Federation Admin (Legal, Contracts, Anti-Doping TUE)  │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                  ┌───────────────────────────┴────────────────────────────┐
                                  │      TIER 2: HIGH PERFORMANCE DIRECTORATE & LOGISTICS  │
                                  │  Performance Director (Full Write/Override, Cycles)   │
                                  │  Operations Team (Camps, Travel Manifests, Facilities) │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                  ┌───────────────────────────┴────────────────────────────┐
                                  │       TIER 3: PERFORMANCE SCIENCE & CLINICAL MEDICINE  │
                                  │  Physiotherapist (Clinical EHR, Body Map, RTP Gates)   │
                                  │  Sports Scientist (Biometrics, GPS, ACWR, Anomaly)     │
                                  │  Nutritionist (Fueling, Hydration, Supplements)       │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                  ┌───────────────────────────┴────────────────────────────┐
                                  │             TIER 4: TACTICAL PROGRAM COACHING          │
                                  │  Coach (Tactical Periodisation, Squad Triage, Lineups) │
                                  └───────────────────────────┬────────────────────────────┘
                                                              │
                                  ┌───────────────────────────┴────────────────────────────┐
                                  │            TIER 5: ATHLETE SELF-SERVICE SCOPE          │
                                  │  Athlete (Daily Hoopers Wellness, Logs, Prescriptions) │
                                  └────────────────────────────────────────────────────────┘
```

### 3.1 Persona 1: Athletes (Tier 5 · Personal Self-Service Scope)
* **Role & Enterprise Scope:** The core performer. In an enterprise system, athlete engagement dictates data validity. If the athlete UX is cumbersome, data compliance collapses.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Tell me what my body needs to do today in 10 seconds."
  - "Log my morning wellness without feeling like I'm doing paperwork."
  - "See my permitted drills and rehab exercises without clinical jargon."
* **Daily Workflow Cadence:**
  - *06:45 (Pre-Breakfast):* Complete 60-second **Hooper-Mackinnon Morning Wellness Survey** (1–10 on Sleep Quality, Muscle Soreness, General Fatigue, Mental Stress).
  - *08:00 (Pre-Session):* Inspect personal calendar: check assigned session intensity, positive movement boundaries, and meeting locations.
  - *11:30 (Post-Training):* Log perceived session exertion (Session RPE 0–10).
  - *15:00 (Rehab / Secondary Block):* Complete assigned physical therapy drills; check off rehab session milestones.
  - *20:00 (Evening Fueling):* Log daily hydration intake and meal compliance.
* **Prototype UI Surfaces & Workspaces:**
  - Dedicated **Athlete Hub Console** in Command Center.
  - Interactive Morning Wellness Modal & Quick Hooper Slider.
  - Athlete 360 Personal Drawer with confidential self-view.
* **Data Ingestion & Telemetry:** Sleep duration (hrs), subjective Hooper scores, session RPE, perceived tissue tightness, hydration volume (L).
* **Operational Actions & State Mutations:** Submit daily wellness; submit session RPE; log rehab exercise completion; acknowledge coach feedback.
* **Privacy & RBAC Firewalls:** **Strict Self-Service Boundary.** Athletes can only view their own records. They cannot view teammates' wellness data, clinical diagnostic MRI images, or internal coach selection notes.
* **Failure Modes & Edge Cases:** *Fatigue Masking:* Athletes under-reporting soreness to avoid being benched. Mitigated by the **Autonomic-Subjective Discordance Engine**, which flags when reported soreness ($2/10$) contradicts nocturnal HRV depression ($-22\%$).

---

### 3.2 Persona 2: Coaches (Tier 4 · Tactical Program Coaching)
* **Role & Enterprise Scope:** Head Coach, Assistant Coach, and Tactical Analysts. Responsible for match preparation, tactical periodisation, drill delivery, and team selection.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Who is available for 100% of my session today, who needs modified volume, and who is ruled out?"
  - "Adapt my session plan pitchside in one click when a player flags soreness."
  - "Select my starting lineup with full knowledge of physical constraints."
* **Daily Workflow Cadence:**
  - *07:15 (Morning Staff Meeting):* Review the **Morning Squad Readiness Triage Console**.
  - *07:45 (Pre-Training):* Execute 1-click drill modifications for flagged athletes (*Max Sprint $\rightarrow$ Technical Drills*).
  - *08:30 (Pitchside Execution):* Monitor real-time drill participation, attendance, and GPS speed exposure limits.
  - *13:00 (Post-Session Review):* Open **Coach Planned vs. Actual Load Review Console**; review $+15\%$ workload variance alerts; approve actual load.
  - *16:00 (Fixture Preparation):* Build Starting XI roster with active readiness indicators.
* **Prototype UI Surfaces & Workspaces:**
  - **Morning Squad Triage Console**.
  - **1-Click Drill Modification Engine**.
  - **Coach Planned vs. Actual Load Variance Console**.
  - **Starting XI / Roster Selector**.
* **Data Ingestion & Telemetry:** Daily readiness scores, Hooper flags, live GPS high-speed running volume, session RPE, drill attendance.
* **Operational Actions & State Mutations:** Batch assign sessions; modify individual drill intensities; toggle starting lineup; approve session load variances; sign off on Stage 2 onboarding approval.
* **Privacy & RBAC Firewalls:** **Clinical Diagnostic Firewall.** Coaches *never* see raw MRI reports, surgical notes, or psychological logs. The system translates medical limitations into clear **Positive Movement Prescriptions** (`✅ Permitted` vs `⛔ Prohibited`).
* **Failure Modes & Edge Cases:** *Coach Overriding Medical Lock:* A coach attempting to run an injured player in a high-intensity drill is strictly blocked by system hard-gates. Only the Performance Director or Lead Physio can grant an audited clinical override.

---

### 3.3 Persona 3: Sports Scientists (Tier 3 · Sport Science & Biomechanics)
* **Role & Enterprise Scope:** High-Performance Scientists, Load Monitors, and Biomechanists. Responsible for external load modeling, neuromuscular fatigue detection, and injury risk mitigation.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Identify acute workload spikes before tissue failure occurs."
  - "Detect neuromuscular asymmetry and autonomic nervous system suppression."
  - "Prescribe objective volume ceilings to technical coaching staff."
* **Daily Workflow Cadence:**
  - *07:00 (Overnight Telemetry Sync):* Ingest nocturnal wearable data (HRV rMSSD, resting heart rate, sleep architecture).
  - *09:30 (Live Training Telemetry):* Stream Catapult/StatsSports GPS feeds: monitor High-Speed Running ($>19.8\text{ km/h}$), sprint distance ($>25.2\text{ km/h}$), and mechanical work.
  - *12:00 (Neuromuscular Testing):* Conduct Vald ForceDecks Countermovement Jump (CMJ) and NordBord eccentric hamstring asymmetry testing.
  - *15:00 (Load Computation):* Compute Exponentially Weighted Moving Average (EWMA) Acute-to-Chronic Workload Ratios (ACWR). Update the **AI Anomaly & Risk Matrix**.
* **Prototype UI Surfaces & Workspaces:**
  - **Sports Science Telemetry Center**.
  - **Autonomic-Subjective Discordance Engine**.
  - **Vald ForceDecks Asymmetry Telemetry Viewer**.
* **Data Ingestion & Telemetry:** Raw GPS micro-telemetry (10Hz), force-time curves, bilateral impulse asymmetry, HRV rMSSD, Hooper survey z-scores.
* **Operational Actions & State Mutations:** Flag high-risk load spikes ($\text{ACWR} > 1.45$); update GPS speed ceilings; log CMJ asymmetry test results; trigger joint clinical-scientific reviews.
* **Privacy & RBAC Firewalls:** Full read/write access to biomechanical and physiological telemetry; read-only access to medical pathology summaries; no authority to discharge athletes from medical rehabilitation.
* **Failure Modes & Edge Cases:** *Sensor Calibration Failure:* GPS pods docking with uncalibrated accelerometers. System detects anomalous step-frequency ratios and flags pod ID for hardware recalibration.

---

### 3.4 Persona 4: Physiotherapists (Tier 3 · Sports Medicine & Rehabilitation)
* **Role & Enterprise Scope:** Head Team Physician, Lead Physiotherapist, and Rehab Specialists. Governs athlete physical integrity, acute injury diagnosis, rehabilitation, and Return-to-Play clearance.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Document anatomical injuries rapidly using an interactive spatial interface."
  - "Track daily rehabilitation compliance and progressive overload quantitatively."
  - "Enforce objective, criteria-based Return-to-Play gates without coaching pressure."
* **Daily Workflow Cadence:**
  - *07:30 (Morning Clinical Triage):* Review acute pain flags submitted by athletes or coaches.
  - *09:00 (Clinical Assessments):* Conduct physical examinations; record structural pathology using the **30-Region Interactive Body Map**.
  - *11:00 (Rehabilitation Delivery):* Supervise 5-stage rehabilitation protocols; log compliance with live `+5% Session` incrementation.
  - *14:30 (RTP Exit Testing):* Administer objective exit criteria tests (Force Plate Limb Symmetry Index $\ge 90\%$, dynamic jump pain $\le 2/10\text{ VAS}$).
  - *16:30 (Clinical Documentation):* Record chronological progress notes coded with OSICS v11.2 pathology standards.
* **Prototype UI Surfaces & Workspaces:**
  - **Interactive 30-Region Body Map**.
  - **6-Step Clinical Injury Reporting Wizard**.
  - **5-Stage Empirical Return-to-Play Protocol Engine**.
  - **Medical Workspace & Clinical EHR File Drawer**.
* **Data Ingestion & Telemetry:** 30 anatomical body regions, injury severity grades (Grade I, II, III), diagnostic ultrasound/MRI findings, pain VAS scores (0–10), force-plate bilateral LSI %.
* **Operational Actions & State Mutations:** Full write access to Medical Workspace, Interactive Body Map, Injury Wizard, Rehab Session Logger, and RTP Gate advancement (Stages 1–4); mutate athlete medical status (`Cleared`, `Restricted`, `Injured`).
* **Privacy & RBAC Firewalls:** Full clinical EHR read/write access. Generates decoupled **Positive Movement Prescriptions** for coaches while protecting private medical notes behind HIPAA/GDPR health data boundaries.
* **Failure Modes & Edge Cases:** *Premature Return to Competition:* Coach pressuring athlete to play before tissue healing. System enforces objective criteria locks: Stage 5 cannot be cleared without CMO sign-off and $\text{LSI} \ge 90\%$.

---

### 3.5 Persona 5: Nutritionists (Tier 3 · Performance Nutrition & Fueling)
* **Role & Enterprise Scope:** Performance Dietitians and Fueling Specialists. Responsible for metabolic periodisation, hydration strategies, body composition monitoring, and WADA-compliant supplement security.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Align daily carbohydrate and caloric intake with tactical training expenditure."
  - "Eliminate anti-doping contamination risk in supplement provisioning."
  - "Track lean muscle mass and fat mass changes longitudinally."
* **Daily Workflow Cadence:**
  - *07:00 (Hydration Triage):* Ingest morning urine specific gravity (USG) and osmolality test results.
  - *08:15 (Fueling Periodisation):* Adjust daily caloric and macronutrient targets based on planned tactical session GPS load.
  - *12:30 (Supplement Distribution):* Dispense batch-certified supplements; verify Informed-Sport batch certificates.
  - *15:30 (Body Composition Review):* Log DEXA scan results; review lean mass vs. fat mass longitudinal trends.
* **Prototype UI Surfaces & Workspaces:**
  - **Nutrition & Fueling Workspace**.
  - **Macro Periodisation Calculator**.
  - **Informed-Sport Batch Verification Registry**.
* **Data Ingestion & Telemetry:** Daily caloric intake, macronutrient grams (P/C/F), hydration volume (ml), USG readings, DEXA body fat %, supplement batch numbers.
* **Operational Actions & State Mutations:** Assign personalized meal plans; log hydration status; register certified supplement batches; generate metabolic recovery recommendations.
* **Privacy & RBAC Firewalls:** Full write access to dietary periodisation and supplement registries; read-only access to tactical training sessions; zero access to confidential medical EHR notes or psychological evaluations.
* **Failure Modes & Edge Cases:** *Contaminated Supplement Ingestion:* Mitigated by mandatory Informed-Sport batch verification logging. Uncertified supplement SKUs are blocked from athlete dispensing records.

---

### 3.6 Persona 6: Federation Admins (Tier 1 · Institutional Governance & Compliance)
* **Role & Enterprise Scope:** National Governing Body (NGB) Administrators, Registrars, and Legal Officers. Responsible for athlete eligibility, regulatory compliance, coach licensing, and anti-doping governance.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Verify identity, nationality, and eligibility documents before squad entry."
  - "Audit coach-athlete contracts and staff caseload capacity."
  - "Track WADA Therapeutic Use Exemption (TUE) expirations proactively."
* **Daily Workflow Cadence:**
  - *09:00 (Registration Pipeline):* Audit incoming onboarding dossiers in the **3-Tier Approval Pipeline**.
  - *10:30 (Administrative Verification):* Execute Level 1 Administrative Verifications (Gov ID, DOB, Federation passport eligibility).
  - *14:00 (Anti-Doping Audit):* Review WADA TUE certificates; flag exemptions expiring within 30 days.
  - *16:00 (Resource Allocation):* Assign certified coaches to athletes; monitor coach caseload capacity.
* **Prototype UI Surfaces & Workspaces:**
  - **3-Tier Sequential Approval Pipeline**.
  - **Coach Assignment Console with Caseload Balancer**.
  - **Federation Governance Hub**.
* **Data Ingestion & Telemetry:** Passports, birth certificates, federation licenses, insurance policies, WADA TUE certificates, coach contracts.
* **Operational Actions & State Mutations:** Approve/reject Level 1 administrative clearance; request document re-upload; bind coach-to-athlete assignments; export federation compliance dossiers.
* **Privacy & RBAC Firewalls:** **Strict Medical Privacy Firewall.** Federation Admins have zero visibility into clinical EHR narratives or diagnostic ultrasound images. They only see high-level clearance flags (`TUE Active: YES/NO`, `Medical Screen: PASSED/PENDING`).
* **Failure Modes & Edge Cases:** *Ineligible Athlete Fielding:* An athlete lacking federation clearance being selected for a match. System blocks non-cleared athletes from the starting lineup roster selector.

---

### 3.7 Persona 7: Performance Directors (Tier 2 · High Performance Directorate)
* **Role & Enterprise Scope:** High Performance Director (HPD), Technical Director, and Olympic Program Leader. Responsible for quadrennial cycle planning, cross-disciplinary alignment, and squad availability optimization.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Maintain squad availability above $90\%$ across Olympic cycles."
  - "Audit cross-departmental compliance and resolve clinical-coaching friction."
  - "Authorize high-stakes clinical overrides with full audit traceability."
* **Daily Workflow Cadence:**
  - *08:00 (Executive Triage):* Review Command Center for overnight AI Risk Alerts and multi-sport readiness distributions.
  - *11:00 (Departmental Cross-Talk):* Audit communication logs between coaching, medical, and sports science teams.
  - *14:00 (Olympic Cycle Review):* Review Talent Identification (TID) promotion pipelines and macrocycle periodisation.
  - *16:30 (Clinical Review):* Authorize contentious Return-to-Play Stage 5 Competition Overrides with mandatory written rationale.
* **Prototype UI Surfaces & Workspaces:**
  - **Executive Command Center Dashboard**.
  - **Executive KPI & Availability Overview Cards**.
  - **Stage 5 Return-to-Competition Clinical Override Gate**.
* **Data Ingestion & Telemetry:** Aggregated squad availability %, departmental compliance rates, injury incidence per 1,000h, TID academy promotion scores, budget allocation.
* **Operational Actions & State Mutations:** Global read/write authority; execute audited Stage 5 Return-to-Competition overrides; authorize multi-sport squad promotions; reassign coaching staff.
* **Privacy & RBAC Firewalls:** Full global visibility across all 5 sports and 4 squad tiers; authorized to view high-level clinical readiness summaries and execute supervisory overrides.
* **Failure Modes & Edge Cases:** *Unchecked Staff Overrides:* A director overriding medical advice without accountability. System requires mandatory written justification, logged permanently with actor ID, timestamp, and clinical dissent flags.

---

### 3.8 Persona 8: Operations Teams (Tier 2 · Campus, Facilities & Logistics Operations)
* **Role & Enterprise Scope:** Team Managers, Facility Coordinators, Equipment Managers, and Logistics Directors. Responsible for training camp logistics, travel manifests, pitch allocation, and hardware telemetry infrastructure.
* **Core Jobs-To-Be-Done (JTBD):**
  - "Eliminate travel and accommodation friction for national squads."
  - "Ensure GPS vests and sensor hardware are charged, calibrated, and synced."
  - "Resolve pitch and facility scheduling conflicts between squads."
* **Daily Workflow Cadence:**
  - *07:00 (Hardware Telemetry Audit):* Verify GPS docking station synchronization, vest charging states, and sensor calibration.
  - *09:00 (Facility Allocation):* Audit pitch allocations to resolve facility clashes between Senior and U-23 squads.
  - *13:00 (Logistics Manifests):* Synchronize flight rosters, rooming lists, and baggage manifests for overseas international camps.
  - *16:30 (Equipment Inventory):* Check in hardware pods, force-plates, and recovery boots; generate cargo manifests.
* **Prototype UI Surfaces & Workspaces:**
  - **Operations & Logistics Hub**.
  - **Hardware Health & Docking Telemetry Monitor**.
  - **Travel Manifest & Camp Roster Generator**.
* **Data Ingestion & Telemetry:** Pitch booking slots, hardware battery levels and sync timestamps, flight manifests, squad availability rosters.
* **Operational Actions & State Mutations:** Reallocate training pitch bookings; flag malfunctioning GPS pods; generate camp logistics manifests; update equipment maintenance logs.
* **Privacy & RBAC Firewalls:** Read-only access to broad availability statuses (`Cleared`, `Restricted`, `Injured`) to ensure accurate travel and lodging manifests; zero access to medical notes, force-plate asymmetry data, or performance ratings.
* **Failure Modes & Edge Cases:** *Hardware Failure on Matchday:* GPS pod battery dying mid-session. Operations console flags pods with $<80\%$ charge or outdated firmware before session rollout.

---

### 3.9 Persona Operational & Permissions Matrix

| Persona | Primary Focus | Daily Cadence | Permitted Write Actions | Clinical Privacy Boundary | Prototype UI Surface |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Athlete** | Self-Readiness & Logs | Pre-session, Post-session | Hooper survey, Session RPE, Meal logs | Self-records only; teammates masked | Athlete Hub Console |
| **Coach** | Tactical Session Delivery | 07:15, 08:30, 13:00, 16:00 | Session assign, 1-click drill mod, Lineup | Positive movement prescription only | Coach Triage & Drill Mod |
| **Sports Scientist** | Load & Neuromuscular Risk | 07:00, 09:30, 12:00, 15:00 | GPS ceilings, ACWR spikes, CMJ tests | Read-only medical; full telemetry | Sports Science Telemetry |
| **Physiotherapist** | Clinical Pathology & RTP | 07:30, 09:00, 11:00, 14:30 | Body map tags, 6-step injury, RTP 1–4 | Full EHR write; generates prescriptions | Interactive Body Map & RTP |
| **Nutritionist** | Fueling & Supplement Safety | 07:00, 08:15, 12:30, 15:30 | Macro plans, Hydration, Informed-Sport | Diet write; zero medical access | Nutrition Workspace |
| **Federation Admin** | Compliance & Contracts | 09:00, 10:30, 14:00, 16:00 | Level 1 verify, Coach caseload assign | Non-clinical compliance flags only | 3-Tier Approval & Caseload |
| **Performance Director**| Quadrennial Availability | 08:00, 11:00, 14:00, 16:30 | Full system write, Stage 5 RTP override | Global access; audited overrides | Executive Command Center |
| **Operations Team** | Facilities & Hardware Health| 07:00, 09:00, 13:00, 16:30 | Pitch bookings, GPS vest dock sync | Broad availability rosters only | Operations & Logistics Hub |

---

## 4. Architectural Justification: The 7 Core Evaluation Pillars

---

### 4.1 Justification 1: Operational Depth
* **The Reality of Elite Sports Operations:** Elite high-performance programs do not operate on generic averages or hand-waving status updates. They operate on specific, empirical micro-metrics:
  1. **Internal Workload Modeling:**
     $$\text{Internal Load (Arbitrary Units)} = \text{Session RPE (0--10)} \times \text{Duration (mins)}$$
  2. **Bilateral Neuromuscular Symmetry:**
     $$\text{Limb Symmetry Index (LSI \%)} = \left(\frac{\text{Involved Limb Force}}{\text{Uninvolved Limb Force}}\right) \times 100 \quad (\text{Threshold: } \ge 90\%)$$
  3. **Subjective Fatigue Index:** Hooper-Mackinnon composite survey measuring Sleep Quality, Muscle Soreness, General Fatigue, and Mental Stress (1–10 scale).
  4. **Anti-Doping Security:** Informed-Sport batch verification certificates registered per supplement SKU before dispensing.
* **Operational Implementation & Proof:**
  - **1-Click Drill Modification:** In the Coach Triage Console, clicking **Modify Session** on an adductor-tightness athlete immediately adapts the drill:
    $$\text{Max Sprint Acceleration 8}\times 60\text{m} \longrightarrow \text{Technical Passing Drills + Active Recovery}$$
    This automatically sets the athlete's GPS high-speed running threshold to $<14\text{ km/h}$.
  - **Planned vs. Actual Workload Review:** Flags $> +15\%$ deviations between planned coaching targets and GPS-measured exertion, allowing coaches to approve with an audit note or trigger scientific load reviews.
  - **Live Anatomical Adherence Logging:** On the Interactive Body Map, clicking `+5% Session` directly increments physical therapy compliance on the selected anatomical structure.

---

### 4.2 Justification 2: Enterprise Workflow Understanding
* **Asynchronous Multi-Disciplinary Workflows:** Traditional forms assume a single user fills out an entire record. Elite sports federations rely on multi-stage handshakes across legal, tactical, and medical departments:
  1. **Sequential 3-Tier Approval Pipeline (Athlete Operations Engine):**
     - **Level 1 (Federation Admin):** Verifies government ID, birth certificate, and federation eligibility.
     - **Level 2 (Head Coach):** Verifies playing position, squad categorization, and tactical role.
     - **Level 3 (Chief Medical Officer):** Verifies 12-lead ECG cardiac screening, baseline concussion testing, and WADA TUE exemptions.
     - *System Enactment:* An athlete remains in `PENDING` state and cannot be selected for fixtures until all 3 sequential signatures are committed.
  2. **Coach Capacity Load Balancing (Athlete Operations Engine):**
     - The coach assignment engine displays real-time capacity counters (e.g. `18 / 20 athletes assigned`).
     - Prevents coaching cognitive overload by flagging overallocated staff in amber/rose.
  3. **Decoupling Clinical Narratives from Pitch Boundaries:**
     - Medical EHR entries are strictly firewalled from coaches.
     - The interface synthesizes an operational **Positive Movement Prescription**:
       - `✅ Permitted Activities:` Linear jogging $<14\text{ km/h}$, upper-body gym conditioning, static passing drills.
       - `⛔ Prohibited Activities:` Maximal sprinting $>22\text{ km/h}$, reactive slide tackling, high-speed deceleration scrimmages.

---

### 4.3 Justification 3: Scalable Architecture
* **Strict 4-Tier Multi-Tenant Hierarchy Engine:**
  - Multi-tenant scoping from `Tier 1: Federation` $\rightarrow$ `Tier 2: Sport Discipline` $\rightarrow$ `Tier 3: Pathway Program` $\rightarrow$ `Tier 4: Squad Cohort` $\rightarrow$ `Individual Athlete`.
  - Accommodates 5 Olympic disciplines (*Football, Athletics, Field Hockey, Swimming, Badminton*).
* **Stateful Separation of Concerns:**
  - **Root State Coordination:** The Central Application State Engine maintains persistent context across module switching. Changing sport dynamically updates athlete rosters, injury registries, and coach directories without stale closures or state tearing.
  - **Type-Safe Domain Modeling:** Unified domain contracts cover over 1,100 schema specifications defining `Athlete`, `Injury`, `TrainingSession`, `WellnessProfile`, `RehabPlanRecord`, and `UserRole`.
  - **Modular Domain Architecture:** Clean domain isolation between Command Center, Athlete Registry, Tactical Training, Sports Medicine, Sports Science, Nutrition, Talent Identification, Executive Analytics, and AI Copilot.

---

### 4.4 Justification 4: Realistic SaaS Thinking
* **Enterprise Multi-Tenancy & Data Privacy:**
  - **HIPAA / GDPR Health Data Firewalls:** Non-medical staff cannot access diagnostic imaging files, ultrasound scans, or mental health notes.
  - **Context-Preserving Ergonomics:** Changing active filters preserves search queries, pagination, and drawer states across module transitions.
* **Non-Blocking Ergonomics:**
  - **Slide-Over Drawers vs. Modal Traps:** Routine investigations (Injury Clinical File, Athlete 360, AI Copilot) open in smooth slide-over side drawers, keeping the underlying squad roster visible in the background.
  - **Global Command Palette (`⌘K` / `Ctrl+K`):** Enables instantaneous keyboard-driven navigation across athletes, sessions, clinical files, and modules without manual menu traversal.
  - **Visual Feedback & Reversibility:** Every state change triggers a descriptive, non-intrusive toast notification and writes an immutable record to the athlete's chronological audit trail.
  - **Tabular Figures & Typography:** Monospace tabular numbers ensure telemetry metrics, HRV figures, and ACWR ratios align vertically across tables.

---

### 4.5 Justification 5: Sports-Tech Understanding
* **Hardware-Native Telemetry & Metric Ingestion:**
  - **Catapult / StatsSports GPS Telemetry:**
    - High-Speed Running (HSR: $>19.8\text{ km/h}$)
    - Very High-Speed Running / Sprinting ($>25.2\text{ km/h}$)
    - Dynamic Accelerations ($>3.0\text{ m/s}^2$) and Decelerations ($<-3.0\text{ m/s}^2$)
  - **Vald ForceDecks / NordBord Biomechanics:**
    - Countermovement Jump (CMJ) concentric/eccentric bilateral force asymmetry.
    - NordBord eccentric knee flexor peak torque and bilateral balance.
  - **Autonomic Nervous System Telemetry:**
    - Nocturnal Heart Rate Variability (HRV rMSSD in ms) and Resting Heart Rate (bpm).
  - **Workload Modeling:**
    - Exponentially Weighted Moving Average (EWMA) Acute-to-Chronic Workload Ratio:
      $$\text{EWMA}_{\text{today}} = \text{Load}_{\text{today}} \cdot \lambda + \text{EWMA}_{\text{yesterday}} \cdot (1 - \lambda)$$
      where $\lambda_a = \frac{2}{7 + 1} = 0.25$ (Acute, 7-day) and $\lambda_c = \frac{2}{28 + 1} = 0.069$ (Chronic, 28-day).
  - **WADA Anti-Doping Regulations:** Proactive 30-day alerts for expiring Therapeutic Use Exemption (TUE) certificates.

---

### 4.6 Justification 6: Systems Integration Thinking
* **Closed-Loop Deterministic Event Cascade:**
  USI eliminates manual double-entry. A single clinical event triggers an automatic, causal ripple effect across the platform:
```
[Physiotherapist Reports Acute Hamstring Strain on Interactive Body Map]
  │
  ├──► Athlete Training Status mutated from ACTIVE to RESTRICTED
  ├──► Morning Squad Triage Console updates player status to REVIEW
  ├──► Session Assignment engine excludes athlete from high-intensity contact drills
  ├──► Coach Console displays Permitted vs Prohibited movement prescription
  ├──► Sports Science ACWR model reduces 7-day planned load envelope
  ├──► Nutritionist receives notification to adjust caloric intake for reduced expenditure
  └──► Auto-instantiates 5-Stage Empirical Rehabilitation Plan
```
* **Bidirectional Telemetry Feedback:**
  When GPS High-Speed Running exceeds planned targets by $+20\%$, the session review triggers an automated alert to the sports science load model, which updates tomorrow's morning squad triage readiness forecast.

---

### 4.7 Justification 7: AI-First Product Strategy
* **Not a Generic Chatbot Wrapper:** USI integrates a **Hybrid Supervisory AI Architecture** combining deterministic clinical rule engines with semantic AI reasoning:
  1. **Autonomic-Subjective Discordance Engine:**
     Detects fatigue under-reporting mathematically:
     $$\Delta_{\text{Discordance}} = z\left(\text{Subjective Soreness}\right) - z\left(\text{Autonomic HRV Suppression}\right)$$
     When reported soreness is low ($2/10$) but nocturnal HRV exhibits severe parasympathetic depression ($-22\%$ below baseline), the system flags an immediate alert: *Potential pain masking / acute fatigue under-reporting*.
  2. **Consequential Operational AI Execution:**
     The AI Copilot does not merely return text; it executes operational state mutations via interactive action chips:
     - **[Apply High-Speed Running Cap]:** Directly adjusts pitchside GPS monitoring thresholds and alerts coaching staff.
     - **[Summon Joint Review]:** Schedules an immediate multidisciplinary consultation between coach, physio, and scientist.
     - **[Initiate Stage 2 RTP]:** Advances rehabilitation progression when exit criteria are satisfied.
  3. **Safety Classification & Auditability:**
     - Every recommendation is classified (`INFORMATIONAL`, `OPERATIONAL_CHANGE`, `CLINICAL_RESTRICTION`).
     - Includes an explainable evidence bundle, model confidence %, and permanent log in the **AI Safety Audit Registry**.

---

## 5. Delivery Matrix: 9 Mandatory Modules & 3 Priority Workflows

### 5.1 The 9 Mandatory Modules Audit

| Module | Core Purpose | Key Operational Capabilities | Prototype Status |
| :--- | :--- | :--- | :--- |
| **1. Command Center** | Operational nervous system | 6 role-aware KPIs, Hooper readiness breakdown, AI Operational Alert banner, 8-persona specialized hub views | **100% Shipped** |
| **2. Athlete Management** | Lifecycle & governance | Athlete Registry, Athlete 360, 6-step onboarding wizard, 3-tier approval modal, dynamic profile completion formula ($0\text{--}100\%$), coach assignment modal | **100% Shipped** |
| **3. Training & Periodisation**| Tactical delivery | Macro/meso/microcycle calendar, session builder, attendance/RPE collection, EWMA ACWR calculations, Coach Triage Console | **100% Shipped** |
| **4. Medical & Injury (PRIORITY)**| Clinical governance | 30-region interactive body map, 6-step clinical reporting wizard, 5-stage empirical RTP exit gating (LSI $\ge 90\%$, Pain $\le 2/10$), decoupled coach movement prescriptions | **100% Shipped** |
| **5. Sports Science** | Load & biometrics | Catapult GPS telemetry, Vald force asymmetry traces, autonomic HRV monitoring, autonomic-subjective discordance engine | **100% Shipped** |
| **6. Nutrition & Fueling** | Fueling & compliance | Caloric/macro periodisation, hydration osmolality logging, Informed-Sport supplement batch verification, DEXA body fat trends | **100% Shipped** |
| **7. Assessments & TID** | Talent pathway | Testing systems (30m Sprint, CMJ, Yo-Yo, VO2Max), TID scoring radar, TID Academy promotion pathway | **100% Shipped** |
| **8. Analytics & BI** | Executive reporting | Cross-cohort longitudinal injury rates per 1,000h, workload vs strain regression, automated executive PDF exports | **100% Shipped** |
| **9. AI Copilot Layer** | Autonomous intelligence| Multi-turn conversational assistant, contextual action buttons, explainable evidence bundles, AI safety audit trail | **100% Shipped** |

---

### 5.2 Priority Workflow Track Deep-Dives

#### Track 1: Athlete Lifecycle Management
* **Step 1 (Onboarding):** 6-step guided wizard with discipline-specific positions for Football, Athletics, Field Hockey, Swimming, and Badminton.
* **Step 2 (Profile Completion):** Weighted mathematical formula across 6 operational domains:
  $$\text{Profile Completion \%} = (0.15 \cdot c_{\text{info}}) + (0.15 \cdot c_{\text{sport}}) + (0.20 \cdot c_{\text{docs}}) + (0.20 \cdot c_{\text{med}}) + (0.15 \cdot c_{\text{coach}}) + (0.15 \cdot c_{\text{plan}})$$
* **Step 3 (3-Tier Approval):** Sequential clearance gates requiring Level 1 (Admin), Level 2 (Coach), and Level 3 (Medical) verification before activation.
* **Step 4 (Coach Assignment):** Multi-sport coach directory with live caseload capacity counters (e.g. `18 / 20 athletes assigned`).

#### Track 2: Tactical Periodisation & Operational Training
* **Session Assignment:** Batch-assigns players to tactical sessions with automatic exclusion of injured/restricted athletes.
* **Morning Squad Triage:** Classifies athletes into `Ready` ($\ge 75\%$), `Modify` ($50\text{--}74\%$), and `Review` ($<50\%$).
* **1-Click Drill Modification:** Adapts high-intensity sprinting to technical active recovery with one click, updating session notes and GPS speed limits.
* **Planned vs. Actual Review:** Compares internal load ($\text{RPE} \times \text{Duration}$) against planned targets with $+15\%$ variance alerting.

#### Track 3: Medical & Injury Intelligence (THE PRIORITY MODULE)
* **30-Region Interactive Body Map:**
  - Clickable anterior and posterior coordinates covering head to toe.
  - Bilateral perspectives: Front, Back, Split View.
  - 3 Real-time Overlays: `Pathology` (tear grades), `Telemetry Strain` (GPS deceleration overload), `Rehab Compliance` (% progress).
  - Accessible Severity Mapping: Non-color-only text badges and high-contrast borders.
  - Live Interaction: `+5% Session` button logs daily physical therapy adherence directly on the anatomical inspector.
* **6-Step Clinical Reporting Wizard:** Directly embeds the **Interactive Body Map** for point-and-click anatomical tagging.
* **5-Stage Empirical Return-to-Play (RTP) Protocol & Exit Gates:**
  - Stage 1 (Pain Reduction) $\rightarrow$ Stage 2 (Strength Restoration) $\rightarrow$ Stage 3 (Sport-Specific Training) $\rightarrow$ Stage 4 (Full Training) $\rightarrow$ Stage 5 (Return to Competition).
  - Objective criteria: Force-plate $\text{LSI} \ge 90\%$, dynamic jump pain $\le 2/10\text{ VAS}$, GPS running tolerance, CMO sign-off.
  - Authorized clinical override unlocked exclusively for `Physiotherapist` and `Performance Director` with mandatory audit rationale logging.
* **Decoupled Coach Movement Prescriptions:** Replaces raw clinical EHR notes with actionable `✅ Permitted` vs `⛔ Prohibited` movement instructions.

---

## 6. Workflow Assumptions, Constraints & Failure Modes

| Real-World Scenario | Failure Mode in Legacy Software | USI Architectural Mitigation |
| :--- | :--- | :--- |
| **Pitchside Network Loss** | Offline app crashes or loses session attendance data. | Local caching architecture; attendance and drill modifications queue in state and synchronize with toast feedback upon reconnection. |
| **Conflicting Staff Priorities** | Coach wants an athlete for a final; Physiotherapist considers tissue unready. | Hard clinical gate lock. The coach cannot override medical restrictions. Only the **Performance Director** or **Lead Physiotherapist** can execute an audited override. |
| **Athlete Questionnaire Bias** | Athletes submit fake identical numbers (e.g. 8/10 every day) to avoid scrutiny. | AI telemetry cross-referencing compares reported readiness against wearable biometrics (HRV, resting heart rate). Lack of variation triggers an administrative compliance flag. |
| **Acute Pitchside Incident** | Traumatic injury occurs on pitch requiring immediate hospital transport before formal diagnosis. | Quick Field Incident Report trigger allows coaches or medical staff to flag an acute event in 10 seconds, immediately locking the player's training status. |
| **WADA Anti-Doping Exemption Expiry** | Athlete prescribed prohibited medication without an active TUE certificate. | Multi-tier approval system flags expiring TUE certificates 30 days prior, preventing participation in sanctioned competitive squads. |

---

## 7. UX Architecture & Enterprise Design Decisions

### 7.1 Ergonomic Information Density
* **Dark-Mode Palette:** Deep slate foundation minimizing glare during early-morning pitchside usage.
* **Strict Color Semantics:**
  - `Emerald`: Cleared, Ready, Full Training Availability ($\ge 80\%$).
  - `Amber`: Monitor, Modified Workload, Moderate Risk ($50\text{--}74\%$).
  - `Rose`: Restricted, Active Injury, Critical Overload ($<50\%$).
  - `Sky`: Active Rehabilitation, RTP Gate Progression, Educational Advisory.
* **Tabular Figures & Typography:** Monospace tabular numerical styling ensures telemetry metrics, Heart Rate Variability figures, and ACWR ratios align vertically across dynamic data tables.

### 7.2 Non-Blocking Interaction Architecture
* **Slide-Over Drawers vs. Modal Traps:** Routine investigations (Injury Clinical File, Athlete 360, AI Copilot) open in smooth slide-over side drawers, keeping the underlying squad roster visible in the background.
* **Global Command Palette (`⌘K` / `Ctrl+K`):** Enables instantaneous keyboard-driven navigation across athletes, sessions, clinical files, and modules without manual menu traversal.
* **Visual Feedback & Reversibility:** Every state change triggers a descriptive, non-intrusive toast notification and writes an immutable record to the athlete's chronological audit trail.

---

## 8. Enterprise System Verification & Operational Delivery Standards

### 8.1 Functional Delivery & Operational Verification
* **Multi-Tenant Scoping:** Full end-to-end verification across 5 Olympic sport disciplines (Football, Athletics, Field Hockey, Swimming, Badminton) across all 4 squad tiers.
* **Clinical Hard-Lock Verification:** Verified that non-medical personas (coaches, operations, federation admins) cannot bypass medical restrictions or view confidential medical EHR transcripts.
* **Telemetry Stress & Responsiveness:** Verified real-time performance with zero latency bottlenecks across 30 anatomical body regions, multi-session load calculations, and longitudinal risk regressions.

### 8.2 Operational Delivery Summary
* **1. Command Center:** Role-adaptive operational hub with 6 real-time KPIs and 8 specialized persona views.
* **2. Athlete Management:** 6-step onboarding wizard, 3-tier sequential approval pipeline, dynamic weighted profile completion formula ($0\text{--}100\%$), and coach capacity caseload balancing.
* **3. Training & Periodisation:** Tactical periodisation engine, 1-click drill modification, morning squad triage, and planned vs. actual load variance review.
* **4. Medical & Injury Intelligence (Priority Module):** Interactive 30-region spatial body map with 3 real-time overlays (pathology, strain, rehab), 5-stage empirical RTP exit gating (LSI $\ge 90\%$, Pain $\le 2/10$), and decoupled positive movement prescriptions.
* **5. Sports Science:** Ingestion of Catapult/StatsSports GPS telemetry, Vald force asymmetry traces, EWMA ACWR modeling, and autonomic-subjective discordance detection.
* **6. Nutrition & Fueling:** Daily metabolic periodisation, hydration osmolality monitoring, and Informed-Sport batch verification tracking.
* **7. Assessments & TID:** Standardized physical testing battery, talent identification radar scoring, and academy promotion pathway.
* **8. Analytics & BI:** Cross-cohort longitudinal injury surveillance per 1,000h, training strain regressions, and executive compliance reporting.
* **9. AI Copilot Layer:** Hybrid supervisory AI architecture, operational action execution chips, and tamper-evident AI safety audit registry.
