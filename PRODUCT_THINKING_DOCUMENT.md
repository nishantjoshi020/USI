# Unified Sports Interface (USI) — Product & Architecture Guide

**Product:** Athlete Management System (AMS)  
**Role:** Lead Product Manager  
**Standard:** Tier-1 Olympic Federation & High-Performance Sports SaaS

---

## 1. Product Reasoning

### The Core Problem
Most sports organizations fail not because they lack data, but because their departments work in silos:
* **The Medical-Coaching Disconnect:** Physiotherapists log injuries in private records, while coaches build training sessions in another tool. Because the coach does not know the player's physical limit, they assign full sprint drills, causing preventable reinjuries.
* **The Data Graveyard:** Teams buy expensive GPS vests and force plates that collect millions of numbers, but coaches only get a weekly PDF after the damage is already done.
* **The Privacy Dilemma:** Software either shows confidential medical files to coaches (breaking privacy laws) or hides all information (leaving coaches blind to player injuries).

### Why USI Was Built This Way
USI is an **event-driven operating system**, not a digital filing cabinet. When something happens in one department, the rest of the system responds immediately:
* An injury logged by a physiotherapist automatically limits the player's training status, alerts the coach, and lowers their planned running distance.
* Instead of showing private medical notes to coaches, USI gives simple movement rules: what is **Permitted** (e.g. light jogging under 14 km/h) and what is **Prohibited** (e.g. sprinting over 22 km/h).
* AI continuously watches for hidden fatigue and provides quick, 1-click action buttons for staff.

---

## 2. Information Architecture

USI organizes multi-sport organizations through a clear two-axis structure:

### The Vertical Hierarchy
Data flows down through four clear levels:
1. **Federation:** The national governing body, Olympic committee, or multi-sport franchise.
2. **Sport:** Football, Athletics, Field Hockey, Swimming, or Badminton.
3. **Program:** Senior National Team, U-23 Squad, or Youth Academy.
4. **Squad:** Squad A, Squad B, or specific training cohorts.
5. **Athlete:** The individual athlete profile.

### Context Preservation & Switching
Staff switch sports or squads using the persistent top bar. When switching from *Football* to *Athletics*:
* The system instantly updates the roster, injury registry, and training calendar.
* Open side drawers, active search queries, and filter states stay in place without resetting or losing work.

---

## 3. Module Hierarchy

USI organizes its 9 core modules into three functional tiers:

### Tier 1: Operational Execution
* **1. Command Center:** The main dashboard showing 6 key performance indicators (KPIs), team readiness scores, and urgent alert banners.
* **2. Athlete Management:** The athlete roster, personal 360 drawers, 6-step onboarding wizard, 3-tier approvals, and coach caseload balancing.
* **3. Training & Periodisation:** The season calendar, daily session builder, pitchside attendance, and morning coach triage.

### Tier 2: Clinical & Sports Science
* **4. Medical & Injury Intelligence (Priority Module):** The interactive 30-region body map, clinical injury wizard, 5-stage return-to-play gating, and decoupled coach movement rules.
* **5. Sports Science:** GPS running metrics, force-plate strength balance, overnight recovery monitoring (HRV), and acute-to-chronic workload modeling.
* **6. Nutrition & Fueling:** Daily meal and carbohydrate periodisation, hydration tracking, and Informed-Sport supplement batch verification.

### Tier 3: Governance & Intelligence
* **7. Assessments & TID:** Standardized physical fitness tests (sprint, jump, VO2Max) and talent identification promotion pathways.
* **8. Analytics & BI:** Cross-team injury rates per 1,000 hours, training load trends, and executive compliance reports.
* **9. AI Copilot Layer:** A built-in assistant that surfaces hidden fatigue and provides 1-click operational action buttons with safety logs.

---

## 4. User Personas (8 Core Roles)

USI adapts to 8 specific roles. Each role has distinct goals, daily routines, and privacy boundaries.

### 1. Athletes
* **Role & Scope:** The individual performer.
* **Main Job:** Check daily training schedules and log wellness in under 60 seconds.
* **Daily Routine:**
  - *Morning:* Fill out a 60-second wellness check (Sleep, Soreness, Fatigue, Stress on a 1–10 scale).
  - *Before Training:* Check today's assigned drills, speed limits, and meeting times.
  - *After Training:* Log perceived effort (RPE 1–10) and mark rehab exercises complete.
* **What They See:** The Athlete Hub Console, personal calendar, and assigned rehab exercises.
* **Privacy Boundary:** Athletes only see their own profile. They cannot see teammates' data or private medical notes.

### 2. Coaches
* **Role & Scope:** Head coach, assistant coach, and tactical trainers.
* **Main Job:** Know who is ready to train today, adjust drills pitchside in one click, and pick the starting lineup.
* **Daily Routine:**
  - *07:15:* Review the Morning Squad Triage Console to see who is Ready, who needs Modifications, and who is Ruled Out.
  - *07:45:* Use 1-click drill modifications for sore players (e.g. switch sprint drills to passing drills).
  - *13:00:* Review actual training load vs. planned load with $\pm 15\%$ variance alerts.
  - *16:00:* Pick the matchday starting lineup.
* **What They See:** Morning Squad Triage Console, Session Builder, and Starting Roster Selector.
* **Privacy Boundary:** Coaches do not see private medical notes or MRI scans. They see clear movement rules: what is **Permitted** and what is **Prohibited**.

### 3. Sports Scientists
* **Role & Scope:** High-performance scientists and load monitors.
* **Main Job:** Track training workloads, detect fatigue early, and prevent non-contact injuries.
* **Daily Routine:**
  - *07:00:* Check overnight recovery metrics (Heart Rate Variability and resting heart rate).
  - *09:30:* Monitor live GPS data during training (high-speed running, sprint distance, accelerations).
  - *12:00:* Run force-plate jump tests to check for left/right leg strength balance.
  - *15:00:* Calculate acute vs. chronic workloads and flag players at risk of injury.
* **What They See:** Sports Science Telemetry Center, Workload Models, and Force Plate Analysis.
* **Privacy Boundary:** Full access to sensor and biomechanical data. Read-only access to basic injury status; cannot change medical status.

### 4. Physiotherapists
* **Role & Scope:** Team doctors, physiotherapists, and rehab specialists.
* **Main Job:** Diagnose injuries quickly, guide rehabilitation, and ensure safe return to play.
* **Daily Routine:**
  - *07:30:* Review morning pain reports from athletes.
  - *09:00:* Examine injuries and log them using the 30-Region Interactive Body Map.
  - *11:00:* Guide rehab sessions and log daily progress with the `+5% Session` button.
  - *14:30:* Run return-to-play tests (strength balance $\ge 90\%$ and pain $\le 2/10$).
* **What They See:** Interactive 30-Region Body Map, 6-Step Injury Wizard, and 5-Stage Return-to-Play Tracker.
* **Privacy Boundary:** Full read and write access to clinical medical files. Responsible for setting an athlete's training status (`Cleared`, `Restricted`, or `Injured`).

### 5. Nutritionists
* **Role & Scope:** Performance dietitians and fueling specialists.
* **Main Job:** Fuel athletes for training demands and ensure all supplements are safe and certified.
* **Daily Routine:**
  - *07:00:* Check morning hydration test results.
  - *08:15:* Adjust daily meal and carbohydrate plans based on today's training intensity.
  - *12:30:* Log batch-tested supplements with Informed-Sport certificates.
  - *15:30:* Track body composition (muscle mass and body fat) over time.
* **What They See:** Nutrition & Fueling Workspace, Meal Planner, and Supplement Registry.
* **Privacy Boundary:** Full access to diet and supplement plans. No access to confidential medical notes.

### 6. Federation Admins
* **Role & Scope:** National governing body registrars and compliance officers.
* **Main Job:** Verify athlete identity, manage coach contracts, and track anti-doping compliance.
* **Daily Routine:**
  - *09:00:* Review new athlete registrations in the 3-Tier Approval Pipeline.
  - *10:30:* Verify government IDs, birth certificates, and federation licenses.
  - *14:00:* Check anti-doping Therapeutic Use Exemptions (TUE) expiring in the next 30 days.
  - *16:00:* Assign coaches to athletes while checking coach workload limits.
* **What They See:** 3-Tier Approval Pipeline, Coach Assignment Console, and Federation Hub.
* **Privacy Boundary:** Zero access to clinical medical notes. They only see administrative pass/fail verification flags.

### 7. Performance Directors
* **Role & Scope:** High Performance Directors and Olympic program leaders.
* **Main Job:** Keep squad availability high (above 90%), resolve staff disagreements, and oversee Olympic cycles.
* **Daily Routine:**
  - *08:00:* Check the Executive Command Center for team readiness and AI alerts.
  - *11:00:* Review cross-department communication and compliance.
  - *16:30:* Authorize final Stage 5 Return-to-Competition clearances.
* **What They See:** Executive Command Center, Squad Availability Cards, and Return-to-Play Override Console.
* **Privacy Boundary:** Full high-level visibility across all sports and squads. Authorized to make supervisory overrides with a mandatory written reason.

### 8. Operations Teams
* **Role & Scope:** Team managers, travel coordinators, and facility managers.
* **Main Job:** Keep facilities running smoothly, manage travel, and keep GPS hardware working.
* **Daily Routine:**
  - *07:00:* Check GPS docking stations to make sure vests are charged and synced.
  - *09:00:* Schedule pitches and gym slots to avoid conflicts between teams.
  - *13:00:* Build travel and hotel manifests for away matches and camps.
  - *16:30:* Complete equipment inventory checks.
* **What They See:** Operations & Logistics Hub, Hardware Monitor, and Travel Roster Builder.
* **Privacy Boundary:** Only broad availability flags (`Cleared`, `Restricted`, `Injured`) to plan travel rosters. No access to medical or performance data.

---

## 5. Key Operational Flows (3 Priority Tracks)

### Track 1: Athlete Onboarding & Multi-Tier Approval
1. **6-Step Onboarding:** Collects personal info, sport discipline, contact details, emergency contacts, medical history, and consent forms.
2. **Profile Completion:** A weighted formula calculates progress from $0\%$ to $100\%$ across personal, sport, documentation, medical, coaching, and training domains.
3. **Sequential 3-Tier Approval:**
   - *Level 1 (Admin):* Approves ID and federation eligibility.
   - *Level 2 (Coach):* Approves position and squad fit.
   - *Level 3 (Doctor):* Clears cardiac ECG and anti-doping status.
   *Result:* An athlete remains pending and cannot be fielded until all three sign off.
4. **Coach Assignment:** Shows real-time coach capacity (e.g. 18 / 20 athletes) to prevent overloading staff.

### Track 2: Tactical Periodisation & Pitchside Coaching
1. **Session Assignment:** Assigns drills to squads while automatically leaving out injured or restricted players.
2. **Morning Squad Triage:** Sorts players into three groups:
   - *Ready* ($\ge 75\%$ readiness): Cleared for 100% of training.
   - *Modify* ($50\text{--}74\%$ readiness): Needs adjusted drills and lower volume.
   - *Review* ($<50\%$ readiness): Excluded from training; sent for medical check.
3. **1-Click Drill Modification:** A single click adapts drills for sore players (e.g. maximal sprints become technical passing drills), automatically capping GPS speed limits.
4. **Planned vs. Actual Review:** Compares planned training load against actual GPS exertion, flagging sessions that exceed targets by more than $15\%$.

### Track 3: Medical Intelligence & Interactive Body Map (Priority Module)
1. **30-Region Interactive Body Map:** A clickable anatomical map (front, back, and split views) showing injuries, mechanical strain, and rehab progress.
2. **6-Step Injury Report:** Physios click the exact body part, select injury severity (Grade I, II, III), and attach diagnostic notes.
3. **Daily Rehab Logging:** Staff click `+5% Session` to log daily physical therapy progress directly on the injured anatomical region.
4. **5-Stage Return-to-Play Protocol:** Players must meet objective physical targets to advance:
   - Stage 1: Pain reduction and light mobility.
   - Stage 2: Strength restoration (leg symmetry $\ge 90\%$).
   - Stage 3: Sport-specific drills without pain ($\le 2/10$).
   - Stage 4: Full non-contact training.
   - Stage 5: Final return to competition (requires Performance Director sign-off).
5. **Decoupled Movement Rules:** Automatically turns medical diagnoses into clear `Allowed` vs. `Prohibited` rules for the coaching staff.

---

## 6. AI Integrations & Autonomous Workflows

USI uses a **Hybrid Supervisory AI Architecture** that pairs strict medical rules with smart pattern detection:

### 1. Spotting Hidden Fatigue
Athletes sometimes give themselves high scores ($2/10$ soreness) because they are afraid of being benched for an important game. USI compares self-reported soreness against overnight Heart Rate Variability (HRV):
* If an athlete claims they feel fine, but their nocturnal HRV shows a severe $-22\%$ drop, the AI alerts staff: *Potential pain masking / acute fatigue detected*.
* If an athlete reports severe soreness ($8/10$) but all physical and autonomic tests are normal, the AI recommends a wellness check for mental stress.

### 2. Consequential 1-Click Action Buttons
Instead of generating long walls of text, the AI provides actionable buttons that make real changes in the platform:
* `[Apply Speed Limit]`: Caps the athlete's GPS running threshold immediately.
* `[Schedule Staff Meeting]`: Dispatches a quick 15-minute sync between coach, doctor, and scientist.
* `[Unlock Stage 2 Rehab]`: Advances rehab progression once objective criteria are met.

### 3. Safety Classification & Audit Log
Every AI suggestion is labeled by risk level:
* `Informational`: General recovery summaries.
* `Training Change`: Recommended drill or workload adjustments.
* `Medical Restriction`: Recommended physical limits.
All suggestions, confidence scores, and staff actions are permanently logged in the **AI Safety Audit Registry**.

---

## 7. Workflow Assumptions, Constraints & Safeguards

| Scenario | What Usually Happens | How USI Handles It |
| :--- | :--- | :--- |
| **No Internet Pitchside** | App crashes; attendance and session data are lost. | Saves data locally on the device and syncs automatically when reconnected. |
| **Coach vs. Doctor Conflict** | Coach plays an injured athlete in an important match. | System hard-locks the player. Only the Performance Director can sign an audited override. |
| **Athlete Fakes Scores** | Player enters "8/10" every day to avoid attention. | AI compares scores with nocturnal HRV data. Lack of score variation triggers a review. |
| **Emergency Field Injury** | Paperwork takes too long while the player is rushed to hospital. | A 10-second Field Incident button immediately locks the player's training status. |
| **Expired Medical Exemption** | Athlete takes prescribed medication and gets suspended. | System warns staff 30 days before any anti-doping certificate expires. |

---

## 8. Justification of the 7 Evaluation Pillars

### 1. Operational Depth
* **Problem:** Simple dropdowns ("Fit", "Injured") lead to poor decisions.
* **Solution:** Uses validated micro-metrics: Internal Load ($\text{Effort} \times \text{Mins}$), Limb Symmetry Index ($\ge 90\%$), 4-part Hooper survey, and Informed-Sport supplement batch verification.
* **Proof:** 1-click drill modifications cap GPS speed under 14 km/h; live `+5% Session` logging on the body map.

### 2. Enterprise Workflow Understanding
* **Problem:** Single-user forms fail in organizations where decisions require multi-department sign-offs.
* **Solution:** 3-tier sequential approval (Admin $\rightarrow$ Coach $\rightarrow$ Doctor), coach caseload limits (under 20 athletes), and decoupled movement rules (`Permitted` vs. `Prohibited`).
* **Proof:** Athletes cannot be selected until all three departments sign off; coaches receive clear rules without seeing private medical files.

### 3. Scalable Architecture
* **Problem:** Most platforms only work for soccer or require separate databases for each team.
* **Solution:** 4-tier hierarchy (Federation $\rightarrow$ Sport $\rightarrow$ Program $\rightarrow$ Squad $\rightarrow$ Athlete) running across 5 Olympic sports with instant context switching and modular domain isolation.
* **Proof:** Seamless switching between Football, Athletics, Field Hockey, Swimming, and Badminton without losing active filters or open drawers.

### 4. Realistic SaaS Thinking
* **Problem:** Bright white screens cause glare outdoors, modal popups block the screen, and lack of history causes accountability issues.
* **Solution:** Dark-mode pitchside theme, non-blocking slide-over drawers, quick search ($\text{⌘K}$), color-blind accessible badges, and complete audit logs for every change.
* **Proof:** Glare-free morning triage; instant navigation across modules; immutable logs for all sign-offs.

### 5. Sports-Tech Understanding
* **Problem:** Teams waste hours manually combining CSV files from different hardware brands.
* **Solution:** Direct ingestion of GPS metrics, force-plate jump asymmetries, and nocturnal HRV, combined with exponential workload decay math (EWMA).
* **Proof:** Accurately flags acute-to-chronic workload spikes ($\text{ACWR} > 1.45$) and warns 30 days before medical exemptions expire.

### 6. Systems Integration Thinking
* **Problem:** Medical, coaching, and science data live in separate silos, causing communication breakdowns.
* **Solution:** Event-driven closed-loop cascade: when an injury is logged on the body map, the player is marked restricted, triage updates, sprint drills are locked, load envelopes drop, and rehab starts automatically.
* **Proof:** Zero double-entry; changes in one department update the entire system in real time.

### 7. AI-First Product Strategy
* **Problem:** Chatbots give generic fitness advice and cannot be trusted with player welfare.
* **Solution:** Spots hidden fatigue mathematically ($\Delta_{\text{Discordance}} = z(\text{Soreness}) - z(\text{HRV Suppression})$), provides 1-click action buttons, and logs every recommendation to a safety registry.
* **Proof:** Catches players hiding soreness ($2/10$) when HRV is depressed ($-22\%$); mutates GPS speed limits with one click.
