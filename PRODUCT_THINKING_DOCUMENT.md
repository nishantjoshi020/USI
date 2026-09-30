# Unified Sports Interface (USI) — Product & Architecture Guide

**Product:** Athlete Management System (AMS)  
**Role:** Lead Product Manager  
**Purpose:** Explain how the system works, who uses it, and how it solves real problems in elite sports.

---

## 1. Executive Summary

### The Problem
In most sports organizations, teams use separate tools that do not talk to each other:
* Doctors log injuries in one system, but coaches cannot see the physical limits and run injured players too hard.
* Wearables and GPS devices collect millions of data points, but staff only see them in weekly PDF reports when it is too late.
* Coaches either see confidential medical records (violating privacy) or see nothing at all.

### Our Solution
USI connects medical, coaching, science, and administrative workflows into a single system:
* When a physiotherapist logs an injury, the system automatically marks the player as restricted, notifies the coach, and updates the training plan.
* Coaches see clear, practical movement rules (what the player can and cannot do) without seeing private medical files.
* AI spots hidden fatigue early and suggests quick, 1-click actions for staff.

---

## 2. Platform Structure

USI organizes teams across four levels:
1. **Federation:** National governing body or sports institute.
2. **Sport:** Football, Athletics, Field Hockey, Swimming, or Badminton.
3. **Program:** Senior team, U-23 squad, or Development academy.
4. **Squad:** Squad A, Squad B, or specific training cohorts.

Staff can switch sports or squads instantly from the top bar. The system updates the roster and data immediately without losing active searches or open drawers.

---

## 3. The 8 User Personas

USI adapts to 8 distinct roles. Each role has specific permissions and sees only the information they need.

### 1. Athletes
* **Main Goal:** Check daily training schedules and log wellness without filling out long forms.
* **Daily Routine:**
  - *Morning:* Fill out a 60-second wellness check (Sleep, Soreness, Fatigue, Stress on a 1–10 scale).
  - *Before Training:* Check today's session, location, and assigned exercises.
  - *After Training:* Log session effort (RPE 1–10) and mark rehab exercises complete.
* **What They See:** The Athlete Hub Console, their personal calendar, and assigned rehab drills.
* **Privacy Boundary:** Athletes only see their own profile. They cannot see teammates' data or private medical notes.

### 2. Coaches
* **Main Goal:** Know who is ready to train today, adjust drills quickly, and pick the starting lineup.
* **Daily Routine:**
  - *07:15:* Review the Morning Squad Triage to see who is Ready, who needs Modifications, and who is Ruled Out.
  - *07:45:* Use 1-click adjustments for sore players (for example: switch from sprint drills to passing drills).
  - *13:00:* Review actual training load vs. planned load.
  - *16:00:* Select the matchday starting lineup.
* **What They See:** Morning Squad Triage Console, Session Builder, and Roster Selector.
* **Privacy Boundary:** Coaches do not see private medical notes or MRI scans. Instead, they see simple movement rules: what is **Permitted** (e.g. light jogging under 14 km/h) and what is **Prohibited** (e.g. sprinting over 22 km/h).

### 3. Sports Scientists
* **Main Goal:** Track training workloads, catch fatigue early, and prevent non-contact injuries.
* **Daily Routine:**
  - *07:00:* Check overnight recovery metrics (Heart Rate Variability and resting heart rate).
  - *09:30:* Monitor live GPS data during training (high-speed running, sprint distance, accelerations).
  - *12:00:* Run force plate jump tests to check for left/right strength balance.
  - *15:00:* Calculate acute vs. chronic workloads and flag players at risk of injury.
* **What They See:** Sports Science Telemetry Center, Workload Models, and Force Plate Analysis.
* **Privacy Boundary:** Full access to GPS and biomechanical data. Read-only access to basic injury status; cannot change medical status.

### 4. Physiotherapists
* **Main Goal:** Diagnose injuries quickly, guide rehabilitation, and ensure safe return to play.
* **Daily Routine:**
  - *07:30:* Review morning pain reports from players.
  - *09:00:* Examine injuries and log them using the 30-Region Interactive Body Map.
  - *11:00:* Guide rehab sessions and log daily progress with the `+5% Session` button.
  - *14:30:* Run return-to-play tests (strength symmetry $\ge 90\%$ and pain $\le 2/10$).
* **What They See:** Interactive 30-Region Body Map, 6-Step Injury Wizard, and 5-Stage Return-to-Play Tracker.
* **Privacy Boundary:** Full read and write access to clinical medical files. Responsible for setting an athlete's training status (`Cleared`, `Restricted`, or `Injured`).

### 5. Nutritionists
* **Main Goal:** Fuel athletes for training demands and ensure all supplements are safe and certified.
* **Daily Routine:**
  - *07:00:* Check morning hydration test results.
  - *08:15:* Adjust daily meal and carbohydrate plans based on today's training intensity.
  - *12:30:* Log batch-tested supplements with Informed-Sport certificates.
  - *15:30:* Track body composition (muscle mass and body fat) over time.
* **What They See:** Nutrition & Fueling Workspace, Meal Planner, and Supplement Registry.
* **Privacy Boundary:** Full access to diet and supplement plans. No access to confidential medical notes.

### 6. Federation Admins
* **Main Goal:** Verify athlete identity, manage contracts, and track anti-doping compliance.
* **Daily Routine:**
  - *09:00:* Review new athlete registrations in the 3-Tier Approval Pipeline.
  - *10:30:* Verify government IDs, birth certificates, and federation licenses.
  - *14:00:* Check anti-doping Therapeutic Use Exemptions (TUE) expiring in the next 30 days.
  - *16:00:* Assign coaches to athletes while checking coach workload limits.
* **What They See:** 3-Tier Approval Pipeline, Coach Assignment Console, and Federation Hub.
* **Privacy Boundary:** Zero access to clinical medical notes. They only see administrative pass/fail verification flags.

### 7. Performance Directors
* **Main Goal:** Keep squad availability high (above 90%), resolve staff disagreements, and oversee Olympic cycles.
* **Daily Routine:**
  - *08:00:* Check the Executive Command Center for team readiness and AI alerts.
  - *11:00:* Review cross-department communication and compliance.
  - *16:30:* Authorize final Stage 5 Return-to-Competition clearances.
* **What They See:** Executive Command Center, Squad Availability Cards, and Return-to-Play Override Console.
* **Privacy Boundary:** Full high-level visibility across all sports and squads. Authorized to make supervisory overrides with a mandatory written reason.

### 8. Operations Teams
* **Main Goal:** Keep facilities running smoothly, manage travel, and keep GPS hardware working.
* **Daily Routine:**
  - *07:00:* Check GPS docking stations to make sure vests are charged and synced.
  - *09:00:* Schedule pitches and gym slots to avoid conflicts between teams.
  - *13:00:* Build travel and hotel manifests for away matches and camps.
  - *16:30:* Complete equipment inventory checks.
* **What They See:** Operations & Logistics Hub, Hardware Monitor, and Travel Roster Builder.
* **Privacy Boundary:** Only broad availability flags (`Cleared`, `Restricted`, `Injured`) to plan travel rosters. No access to medical or performance data.

---

### Persona Summary Table

| Persona | Primary Focus | Daily Cadence | Key Screen / Workspace | Privacy Boundary |
| :--- | :--- | :--- | :--- | :--- |
| **Athlete** | Self-readiness and simple logs | Morning & Post-training | Athlete Hub Console | Own data only; teammates hidden |
| **Coach** | Tactical drills and lineup selection | 07:15, 08:30, 13:00, 16:00 | Morning Triage & Drill Mod | Movement rules only; no medical notes |
| **Sports Scientist** | Workload modeling & fatigue detection | 07:00, 09:30, 12:00, 15:00 | Sports Science Telemetry | Full sensor data; cannot change medical status |
| **Physiotherapist** | Injury diagnosis and guided rehab | 07:30, 09:00, 11:00, 14:30 | Interactive Body Map & RTP | Full clinical EHR; sets medical status |
| **Nutritionist** | Fueling and supplement safety | 07:00, 08:15, 12:30, 15:30 | Nutrition & Fueling Hub | Diet and supplements; no medical notes |
| **Federation Admin** | Identity verification and compliance | 09:00, 10:30, 14:00, 16:00 | 3-Tier Approval Pipeline | Legal and eligibility; no medical notes |
| **Performance Director** | Overall squad availability and oversight | 08:00, 11:00, 14:00, 16:30 | Executive Command Center | Full visibility; authorizes final overrides |
| **Operations Team** | Facility bookings and hardware health | 07:00, 09:00, 13:00, 16:30 | Operations & Logistics Hub | Travel rosters only; no medical or stats |

---

## 4. Justification of the 7 Core Evaluation Pillars

---

### 1. Operational Depth
* **The Problem:** Simple dropdowns like "Fit" or "Injured" are not enough. Elite teams need precise, objective numbers to make smart decisions.
* **How USI Solves It:**
  - **Internal Load:** Calculated as $\text{Effort (1--10)} \times \text{Duration (mins)}$.
  - **Strength Balance:** Force plates measure left vs. right leg symmetry ($\ge 90\%$ needed to advance rehab).
  - **Subjective Fatigue:** Uses the 4-part Hooper survey (Sleep, Soreness, Fatigue, Stress on a 1–10 scale).
  - **Supplement Safety:** Every batch is verified with Informed-Sport lab certificates before giving it to an athlete.
* **Real-World Example:** In the Morning Triage, when an athlete reports groin tightness, the coach clicks **Modify Session**. The drill changes instantly from maximal sprinting to passing drills, and the system caps GPS speed to under 14 km/h.

---

### 2. Enterprise Workflow Understanding
* **The Problem:** In elite sports, one person cannot do everything. Decisions require sign-offs across medical, coaching, and legal teams, but traditional forms do not support this.
* **How USI Solves It:**
  - **Sequential 3-Tier Approval:** A new athlete cannot be selected for a match until three people sign off in order:
    1. *Admin:* Checks passport, birth certificate, and eligibility.
    2. *Coach:* Confirms tactical role and squad fit.
    3. *Doctor:* Clears cardiac ECG, concussion baseline, and anti-doping status.
  - **Coach Workload Limits:** Shows live athlete-to-coach ratios (e.g. 18 / 20 assigned) to prevent coach burnout.
  - **Decoupled Movement Rules:** Instead of showing confusing MRI text to coaches, the system gives clear rules:
    - *Allowed:* Light jogging under 14 km/h, upper body gym work.
    - *Prohibited:* Full sprints over 22 km/h, contact scrimmages.
  - **Return-to-Play Sign-Off:** Physios guide Stages 1 through 4. The final step (Stage 5: Match Competition) requires the Performance Director's written sign-off.

---

### 3. Scalable Architecture
* **The Problem:** Most platforms only work for one sport (like soccer) or require separate systems for each team.
* **How USI Solves It:**
  - **4-Tier Structure:** Federation $\rightarrow$ Sport $\rightarrow$ Program $\rightarrow$ Squad $\rightarrow$ Athlete.
  - **Works Across 5 Sports:** Supports Football, Athletics, Field Hockey, Swimming, and Badminton. Each sport tracks its own metrics (e.g. sprint times for Athletics, stroke rates for Swimming, and distance for Football).
  - **Fast Context Switching:** Switch sports or squads from the top bar in one click. Open drawers, search filters, and active screens stay intact.
  - **Modular Design:** Medical, coaching, science, and admin sections are cleanly separated so that changes in one module cannot break another.

---

### 4. Realistic SaaS Thinking
* **The Problem:** Many sports tools have bright white screens that cause glare outdoors, confusing popups that block the screen, and no history of who changed what.
* **How USI Solves It:**
  - **Glare-Free Dark Theme:** Built with a dark palette designed for tablets used pitchside in bright morning sunlight.
  - **Clear Status Indicators:** Statuses use colors, clear text badges, and icons so color-blind staff never get confused.
  - **Slide-Over Drawers:** Athlete profiles and injury files open in smooth side drawers so the team list stays visible behind them.
  - **Quick Search ($\text{⌘K}$):** Staff can jump to any player, session, or medical file in two seconds using keyboard shortcuts.
  - **Complete Audit Trail:** Every status change, drill edit, and medical sign-off logs who did it, when, and why.

---

### 5. Sports-Tech Understanding
* **The Problem:** Teams use many hardware brands (Catapult GPS, Vald force plates, Oura rings) and waste hours exporting and combining CSV files.
* **How USI Solves It:**
  - **GPS Integration:** Reads high-speed running ($>19.8\text{ km/h}$), sprint distance ($>25.2\text{ km/h}$), and accelerations directly.
  - **Force Plate Integration:** Ingests jump heights and left-to-right leg strength balance.
  - **Heart Rate Variability (HRV):** Reads overnight recovery data to measure nervous system readiness.
  - **Smart Workload Math (EWMA):** Uses exponential decay formulas to compare acute (7-day) vs. chronic (28-day) workload without the mathematical errors found in simple rolling averages.
  - **Anti-Doping Alerts:** Warns staff 30 days before an athlete's medical exemption (TUE) expires.

---

### 6. Systems Integration Thinking
* **The Problem:** When departments do not talk, mistakes happen. A doctor diagnoses an injury, but the coach never gets the message and plays the athlete anyway.
* **How USI Solves It:**
  - **Automatic Chain Reaction:** When a physio logs an injury on the body map:
    1. Player status automatically changes to `RESTRICTED`.
    2. Coach's morning triage flags the player for `REVIEW`.
    3. The training builder removes the player from high-speed sprint drills.
    4. The coach sees permitted vs. prohibited movement rules.
    5. The sports science model lowers the player's 7-day workload target.
    6. The nutritionist gets an alert to adjust calories for lower energy output.
    7. A 5-stage rehab plan starts automatically.
  - **Zero Double-Entry:** Staff enter information once, and the entire system updates instantly.

---

### 7. AI-First Product Strategy
* **The Problem:** Generic AI chatbots give vague, unhelpful advice ("make sure to stretch") or make dangerous mistakes with medical data.
* **How USI Solves It:**
  - **Spots Hidden Fatigue:** Athletes sometimes claim they feel fine ($2/10$ soreness) so they can play, even when their body is exhausted. The system compares reported soreness against nocturnal HRV. If HRV is dropped by $-22\%$, the system flags a hidden fatigue alert.
  - **1-Click Action Buttons:** Instead of just generating text, the AI provides clickable buttons:
    - `[Apply Speed Limit]`: Caps GPS speed limits immediately.
    - `[Schedule Staff Meeting]`: Sets up a quick 15-minute sync between coach, doctor, and scientist.
    - `[Unlock Stage 2 Rehab]`: Advances rehab once objective test scores are met.
  - **Safety Log:** Every AI suggestion is labeled by risk level (`Informational`, `Training Change`, or `Medical Restriction`) and saved in a permanent safety audit log.

---

## 5. Overview of Modules & Priority Workflows

### The 9 Modules
1. **Command Center:** Real-time team dashboard, Hooper readiness scores, and AI alert banners.
2. **Athlete Management:** Athlete roster, 360 profile drawer, 6-step onboarding, and 3-tier approvals.
3. **Training & Periodisation:** Calendar, session builder, attendance, and morning coach triage.
4. **Medical & Injury (Priority):** Interactive 30-region body map, injury reports, and 5-stage return-to-play gating.
5. **Sports Science:** GPS metrics, force plate asymmetries, HRV monitoring, and workload models.
6. **Nutrition & Fueling:** Meal planning, hydration checks, and certified supplement tracking.
7. **Assessments & TID:** Physical tests (sprint, jump, VO2Max) and academy promotion radar.
8. **Analytics & BI:** Injury rates per 1,000 hours, training strain charts, and executive reports.
9. **AI Copilot:** Contextual assistant with 1-click action buttons and safety logs.

### The 3 Priority Workflows

#### 1. Athlete Onboarding & Approval
* A 6-step guided wizard collects personal, sport, and medical information.
* A live formula calculates profile completeness from $0\%$ to $100\%$.
* Requires sequential sign-offs: Admin $\rightarrow$ Coach $\rightarrow$ Chief Medical Officer before the athlete is active.
* Coaches are assigned using a live caseload counter (e.g. 18 / 20 athletes) to prevent overloading.

#### 2. Tactical Training & Coach Workflow
* Assigns sessions to squads while automatically excluding injured or restricted players.
* Morning triage groups players into Ready ($\ge 75\%$), Modify ($50\text{--}74\%$), and Review ($<50\%$).
* Coaches can modify any drill in one click to reduce sprint volume.
* Post-training review checks if actual GPS load exceeded planned targets by more than $15\%$.

#### 3. Medical & Interactive Body Map (Priority Module)
* **30-Region Interactive Body Map:** Click anywhere on the body (front, back, or split view) to view injuries, strain levels, and rehab progress.
* **Live Progress Logging:** Click `+5% Session` to log physical therapy adherence directly on the injured body part.
* **5-Stage Return-to-Play:** Players must meet objective physical criteria (LSI $\ge 90\%$ and pain $\le 2/10$) to advance through stages.
* **Decoupled Movement Rules:** Replaces medical jargon with clear `Allowed` vs. `Prohibited` activity lists for coaches.

---

## 6. Real-World Edge Cases & Safeguards

| Real-World Problem | What Usually Happens | How USI Handles It |
| :--- | :--- | :--- |
| **No Internet Pitchside** | App crashes; attendance data is lost. | Saves data locally on the device and syncs automatically when reconnected. |
| **Coach vs. Doctor Disagreement** | Coach plays an injured athlete in an important match. | System hard-locks the player. Only the Performance Director can sign an audited override. |
| **Athlete Fakes Wellness Scores** | Player enters "8/10" every day to hide an injury. | AI compares scores with nocturnal HRV data. Lack of score variation triggers an administrative review. |
| **Emergency Field Injury** | Paperwork takes too long while the player is rushed to hospital. | A 10-second Field Incident button immediately locks the player's training status. |
| **Expired Medical Exemption** | Athlete takes prescribed medication and gets suspended. | System warns staff 30 days before any anti-doping certificate expires. |
