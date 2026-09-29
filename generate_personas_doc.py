import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

def create_document():
    doc = docx.Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Color Palette Constants
    COLOR_PRIMARY = RGBColor(15, 23, 42)      # Deep Slate #0F172A
    COLOR_ACCENT = RGBColor(14, 116, 144)     # Deep Cyan #0E7490
    COLOR_MUTED = RGBColor(71, 85, 105)       # Slate 600 #475569
    COLOR_HIGHLIGHT = RGBColor(3, 105, 161)   # Sky 700 #0369A1

    # Helper: Set Cell Shading
    def set_cell_background(cell, hex_color):
        shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shading_elm)

    # Helper: Set Cell Margins (Padding)
    def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for margin_name, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
            node = OxmlElement(f'w:{margin_name}')
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    # Helper: Table Borders
    def set_table_borders(table, color="CBD5E1"):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
            f'<w:bottom w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
            f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{color}"/>'
            f'<w:insideV w:val="none"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)

    # Base Normal Style
    normal_style = doc.styles['Normal']
    normal_style.font.name = 'Calibri'
    normal_style.font.size = Pt(10.5)
    normal_style.font.color.rgb = RGBColor(30, 41, 59)
    normal_style.paragraph_format.line_spacing = 1.15
    normal_style.paragraph_format.space_after = Pt(4)

    # ==========================================
    # COVER / HEADER
    # ==========================================
    p_pre = doc.add_paragraph()
    run_pre = p_pre.add_run("UNIFIED SPORTS INTELLIGENCE (USI) PLATFORM")
    run_pre.font.size = Pt(9.5)
    run_pre.font.bold = True
    run_pre.font.color.rgb = COLOR_ACCENT
    p_pre.paragraph_format.space_after = Pt(2)

    p_title = doc.add_paragraph()
    run_title = p_title.add_run("Enterprise User Personas & Operational Roles Specification")
    run_title.font.size = Pt(24)
    run_title.font.bold = True
    run_title.font.color.rgb = COLOR_PRIMARY
    p_title.paragraph_format.space_after = Pt(6)

    p_sub = doc.add_paragraph()
    run_sub = p_sub.add_run("A Comprehensive Field-Researched Analysis of the 8 Core Stakeholders Across High-Performance Sports Institutes, National Federations, and Olympic Pathway Environments")
    run_sub.font.size = Pt(11.5)
    run_sub.font.color.rgb = COLOR_MUTED
    p_sub.paragraph_format.space_after = Pt(16)

    # Metadata Table
    meta_table = doc.add_table(rows=2, cols=4)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False
    set_table_borders(meta_table, "E2E8F0")

    meta_data = [
        [("System", "Unified Sports Intelligence (USI)"), ("Target Domain", "National Sports Federations & High Performance Institutes"), ("Research Baseline", "UK Sport, AIS, USOPC, Premier League, WADA Code"), ("Version", "1.0 (Production-Ready)")],
        [("Total Personas", "8 Core Operating Roles"), ("Classification", "Integrated Support Team (IST) & Governance"), ("Date of Generation", "September 2026"), ("Architecture", "Role-Based Access Control (RBAC)")]
    ]

    for r_idx, row in enumerate(meta_table.rows):
        for c_idx, cell in enumerate(row.cells):
            set_cell_background(cell, "F8FAFC" if r_idx == 0 else "FFFFFF")
            set_cell_margins(cell, 80, 80, 100, 100)
            label, val = meta_data[r_idx][c_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r1 = p.add_run(f"{label}: ")
            r1.font.bold = True
            r1.font.size = Pt(8.5)
            r1.font.color.rgb = COLOR_MUTED
            r2 = p.add_run(val)
            r2.font.size = Pt(8.5)
            r2.font.color.rgb = COLOR_PRIMARY

    doc.add_paragraph().paragraph_format.space_after = Pt(14)

    # ==========================================
    # SECTION 1: EXECUTIVE SUMMARY & MATRIX
    # ==========================================
    h1 = doc.add_heading(level=1)
    run_h1 = h1.add_run("1. Executive Overview & The Integrated Support Team (IST) Model")
    run_h1.font.size = Pt(16)
    run_h1.font.bold = True
    run_h1.font.color.rgb = COLOR_PRIMARY
    h1.paragraph_format.space_before = Pt(12)
    h1.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "Modern high-performance sports organizations do not operate in functional isolation. Olympic national governing bodies (NGBs), institutes of sport (e.g., AIS, UK Sport, English Institute of Sport), and elite professional franchises operate through a transdisciplinary Integrated Support Team (IST) framework. In this architecture, decisions surrounding an elite athlete's training, readiness, medical clearance, tactical deployment, and international compliance must be synchronized in real time across 8 specialized personas."
    )

    doc.add_paragraph(
        "Historically, high-performance sport has suffered from 'data silos'—where the Head Coach utilizes tactical and video systems (e.g., Hudl, Sportscode); the Sports Scientist monitors GPS and force plates in isolated spreadsheets; the Lead Physiotherapist maintains clinical notes in medical software; the Nutritionist logs DEXA scans and hydration in separate portals; and the Federation Registrar manages eligibility in manual government databases. The Unified Sports Intelligence (USI) platform bridges these gaps through strict, role-aware operational views and AI-native decision workflows."
    )

    # High-level Comparison Table
    doc.add_paragraph().paragraph_format.space_after = Pt(4)
    p_tbl_title = doc.add_paragraph()
    r_tt = p_tbl_title.add_run("Table 1: Cross-Persona Operational Synthesis Matrix")
    r_tt.font.bold = True
    r_tt.font.size = Pt(10)
    r_tt.font.color.rgb = COLOR_HIGHLIGHT
    p_tbl_title.paragraph_format.space_after = Pt(4)

    summary_table = doc.add_table(rows=9, cols=5)
    summary_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(summary_table, "CBD5E1")

    headers = ["Persona", "Primary Mandate", "Key Daily Artifact / Workflow", "Critical Metrics Monitored", "Decision Authority"]
    for idx, heading in enumerate(headers):
        cell = summary_table.rows[0].cells[idx]
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, 100, 100, 120, 120)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(heading)
        r.font.bold = True
        r.font.size = Pt(9)
        r.font.color.rgb = RGBColor(255, 255, 255)

    matrix_rows = [
        ("1. Athlete", "Peak readiness, recovery, biometric input, and match execution.", "Morning readiness survey, sRPE input, GPS pod tracking, recovery logging.", "Readiness (0-100), HRV rMSSD, Sleep Duration, Soreness, ACWR.", "Self-management & symptom disclosure."),
        ("2. Head Coach", "Tactical strategy, squad selection, periodisation, and match performance.", "Training session design, attendance verification, tactical drill debrief.", "Squad availability %, High-Speed Running (HSR), Drill intensity, Match results.", "Squad selection, match strategy & tactical load."),
        ("3. Sports Scientist", "Objective load quantification, fatigue analytics, and injury risk mitigation.", "GPS data cleaning, ACWR modeling, CMJ force plate testing, IST briefings.", "ACWR ratio, Sprint Distance (>25.2 km/h), PlayerLoad™, CMJ flight-time.", "Training volume/intensity caps & taper advice."),
        ("4. Physiotherapist", "Clinical injury triage, stage-gated rehabilitation, and objective RTP clearance.", "Interactive anatomical mapping, OSICS diagnosis, treatment logs, RTP gates.", "Days lost to injury, Limb Symmetry Index (>90%), Pain score (0-10), RTP stage.", "Medical clearance & return-to-play sign-off."),
        ("5. Performance Nutritionist", "Nutritional periodisation, hydration optimization, and anti-doping vetting.", "Meal plan assignment, urine osmolality checks, DEXA scans, supplement audits.", "Macronutrient g/kg, Hydration compliance %, Body fat %, Lean mass (kg).", "Supplement protocol & dietary clearance."),
        ("6. Federation Admin", "National registry governance, eligibility verification, and WADA compliance.", "Onboarding validation, KYC/Passport verification, whereabouts filing audits.", "Verified athlete %, Pending backlog count, Whereabouts filing compliance (100%).", "National eligibility & competition licensing."),
        ("7. Performance Director", "High-performance strategy, podium conversion, IST leadership, and budget allocation.", "Command Center overview, AI risk escalation review, Olympic cycle planning.", "Podium conversion %, Squad availability (>92%), Budget ROI, Pathway conversion.", "Executive resource allocation, staffing, cycle approval."),
        ("8. Operations Team", "Camp logistics, travel coordination, facility booking, and inventory operations.", "Venue reservations, flight & visa manifests, equipment tracking, travel itinerary.", "Camp budget variance, Logistical completion rate (%), Facility utilization.", "Operational schedules, vendor contracts & logistics.")
    ]

    for r_idx, row_data in enumerate(matrix_rows, start=1):
        for c_idx, text in enumerate(row_data):
            cell = summary_table.rows[r_idx].cells[c_idx]
            set_cell_background(cell, "F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(cell, 80, 80, 100, 100)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8.5)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_HIGHLIGHT

    doc.add_page_break()

    # ==========================================
    # SECTION 2: DETAILED PERSONAS
    # ==========================================
    h2 = doc.add_heading(level=1)
    run_h2 = h2.add_run("2. Detailed In-Depth Profiles for All 8 Operating Personas")
    run_h2.font.size = Pt(16)
    run_h2.font.bold = True
    run_h2.font.color.rgb = COLOR_PRIMARY
    h2.paragraph_format.space_before = Pt(8)
    h2.paragraph_format.space_after = Pt(6)

    personas = [
        {
            "num": "2.1",
            "title": "Persona 1: The Elite / National Squad Athlete",
            "name": "Arjun Mehta (Representative Profile)",
            "archetype": "International Senior Forward / Olympic Pathway Competitor (Age 23)",
            "mandate": "Maximize physical readiness, adhere strictly to periodised training and nutritional regimes, execute tactical gameplay, report symptoms honestly, and maintain 100% anti-doping whereabouts compliance.",
            "context": "Competes in high-intensity sport (e.g., Football/Hockey/Athletics), representing the Senior National Squad. Operates in high-stress, high-consequence environments where physical availability directly impacts national team selection and podium potential.",
            "daily_workflow": [
                "07:00 – 07:30 (Morning Awakening Telemetry): Opens the USI Athlete Mobile Portal immediately upon waking. Completes the 60-second morning wellness questionnaire (Sleep duration: 7h 48m, Sleep quality: 8/10, Perceived muscle soreness: 2/10, Stress: Low, Energy: High). Syncs autonomic HRV telemetry from wearable (rMSSD: 70 ms vs 68 ms baseline).",
                "08:15 – 08:45 (Nutrition & Hydration Verification): Logs morning hydration intake (500 ml electrolyte water) and checks the assigned match-day glycogen fueling plan (target: 3,400 kcal, 450g CHO). Reviews approved daily supplement stack (Omega-3, Creatine Monohydrate, Vitamin D3—all Informed-Sport batch certified).",
                "09:15 – 09:30 (Medical & Physio Check-in): Enters the national training facility. Undergoes brief tissue palpation with lead physiotherapist for historical left hamstring tightness (recorded as cleared).",
                "10:00 – 11:45 (Pitch Tactical Training): Wears Catapult Vector GPS pod in harness. Executes high-intensity pressing drills and small-sided games. Live telemetry monitored by sports science staff.",
                "12:00 – 12:15 (Session Exertion Logging): Immediately post-session, inputs Borg CR-10 Session Rating of Perceived Exertion (sRPE = 8 / 10). System calculates internal training load (8 x 75 min = 600 AU).",
                "14:00 – 15:15 (Strength & Conditioning Block): Velocity-based trap bar deadlifts and eccentric Nordic hamstring curls.",
                "16:00 – 16:45 (Recovery & Video Review): 12-minute cold water immersion (10°C), pneumatic compression boots, and reviews 15-minute tactical video clips assigned by Head Coach.",
                "20:30 (Whereabouts Check): Confirms 60-minute WADA ADAMS anti-doping testing window for the following morning."
            ],
            "responsibilities": [
                "Biometric & Subjective Reporting: Provide truthful, daily inputs on sleep, muscle fatigue, psychological stress, and pain markers before arriving at the training facility.",
                "Workload Execution: Adhere strictly to coaching speed, intensity, and duration prescriptions without unmonitored overtraining or undertraining.",
                "Anti-Doping Compliance (WADA/NADA): Maintain up-to-the-minute whereabouts entries in ADAMS; ensure every ingested substance or medication is cross-checked against Global DRO.",
                "Rehabilitation Adherence: When injured, complete 100% of prescribed stage-gated physiotherapy exercises, isokinetic strength tests, and return-to-play protocols.",
                "Nutritional Adherence: Follow prescribed macronutrient periodisation according to match day (MD-2, MD-1, Match Day, Recovery Day)."
            ],
            "kpis": [
                "Daily Readiness Composite Score (target: >80 / 100).",
                "Acute:Chronic Workload Ratio (ACWR maintained between 0.90 – 1.25 sweet spot).",
                "Sleep Duration & Quality (>7.5 hours/night with >20% Deep/REM sleep).",
                "Nutritional & Hydration Compliance (>90% adherence to caloric and fluid targets).",
                "Limb Symmetry Index (LSI >90% strength symmetry between dominant and non-dominant leg)."
            ],
            "pain_points": [
                "App Fatigue: Overwhelmed by having to log into separate apps for GPS, wellness, team chat, travel logistics, and anti-doping.",
                "Data Black Hole: Feels that data is constantly taken from them (blood tests, wearable sensors, questionnaires) without receiving immediate, personalized feedback on what it means.",
                "Fear of Benchmarking: Anxious that reporting soreness or mild pain will cause the coach to drop them from the starting lineup.",
                "Anti-Doping Anxiety: Constant fear of accidental contamination from over-the-counter medication or unvetted food."
            ],
            "usi_features": [
                "Personalized Athlete Mobile Portal with single-tap morning wellness log.",
                "Private Athlete 360 dashboard showing personal readiness, sleep trends, and load status without exposing teammate comparisons.",
                "Direct meal and hydration consumption toggles.",
                "Real-time injury rehabilitation progress indicator (Stage 1 to 5 RTP Gate tracker)."
            ]
        },
        {
            "num": "2.2",
            "title": "Persona 2: The Head Coach / Tactical Specialist",
            "name": "Coach Vikram Sharma (Representative Profile)",
            "archetype": "Senior National Team Head Coach / UEFA Pro / Elite High-Performance Coach (Age 46)",
            "mandate": "Drive technical and tactical excellence, formulate match strategy, structure periodised microcycles, optimize squad availability, and win podium medals at continental and world championships.",
            "context": "Under immense public, media, and federation pressure to deliver victories. Must balance tactical ambition with the physical limitations flagged by the sports science and medical departments.",
            "daily_workflow": [
                "07:45 – 08:15 (Morning Readiness & Availability Triage): Arrives at training center; opens USI Coach Command Center. Reviews squad availability matrix (e.g., 22 Available, 2 Modified, 1 In Rehab). Identifies that Arjun Mehta has an ACWR spike (1.38) and left hamstring fatigue.",
                "08:15 – 08:45 (Daily IST Briefing): Convenes with Lead Sports Scientist and Head Physio. Negotiates training modifications: agrees to cap Arjun's High-Speed Running at 70% and substitute high-deceleration drills.",
                "09:00 – 09:30 (Session Finalization): Uses USI Session Builder to finalize today's 75-minute tactical training session (High Block Pressing & 7v7 Transition Grids). Automatically transmits individual load caps to staff.",
                "10:00 – 11:45 (Pitch Execution): Leads pitch tactical practice with whistle and tactical board. Monitors live telemetry broadcast to side-pitch tablets.",
                "12:15 – 12:45 (Coach Attendance & Exertion Sign-off): Completes the session attendance register (Present, Late, Excused, Injured). Reviews squad sRPE distribution.",
                "14:30 – 16:30 (Opponent Tactical Scouting & Video): Analyzes opposition defensive shape; drafts starting lineup scenarios.",
                "17:00 – 17:30 (Debrief with Performance Director): Reviews weekly load accumulation and upcoming tournament squad nominations."
            ],
            "responsibilities": [
                "Tactical & Periodisation Design: Architect annual, monthly, and weekly training plans (macro, meso, microcycles) aligned with tournament peaking.",
                "Squad Selection & Match Management: Select the match-day roster based on tactical requirements, objective physical readiness, and psychological form.",
                "Attendance & Execution Verification: Ensure all national squad members attend sessions and adhere to behavioral and technical standards.",
                "IST Collaboration: Translate sports science and medical restrictions into practical pitch drills without compromising tactical preparation.",
                "Player Development & Culture: Build an elite, accountable team culture focused on international competitiveness."
            ],
            "kpis": [
                "Match Win / Podium Percentage (target: Top 3 national ranking / qualification).",
                "Squad Availability Rate (>90% of roster fit for tactical selection on match days).",
                "Tactical Plan Compliance (% of planned high-intensity drills executed successfully).",
                "Training Session Attendance Rate (>98% squad attendance across national camps).",
                "Player Progression Index (developmental academy players successfully integrated into the senior team)."
            ],
            "pain_points": [
                "Sports Science Jargon: Frustrated by academic terminology (e.g., 'monotony index', 'autonomic dysfunction') when he just needs to know: 'Can he sprint at 100% for 90 minutes?'",
                "Late-Breaking Medical Surprises: Finding out 10 minutes before training that a key playmaker has been pulled by the medical staff.",
                "Conflicting Priorities: Balancing the desire to push players harder with the medical team's conservative risk thresholds.",
                "Fragmented Administrative Burdens: Wasting time on administrative forms that distract from tactical film study."
            ],
            "usi_features": [
                "Role-Scoped Coach Command Center highlighting immediate player restrictions in plain language.",
                "Interactive Session Builder with drag-and-drop drill protocols and instant squad volume estimation.",
                "Live Attendance & sRPE collection register.",
                "Roster Availability Board linking directly to medical injury stages."
            ]
        },
        {
            "num": "2.3",
            "title": "Persona 3: The Lead Sports Scientist / Load & Fatigue Analyst",
            "name": "Dr. Ananya Sen (Representative Profile)",
            "archetype": "Lead Performance Sports Scientist / PhD in Exercise Physiology / Biomechanist (Age 34)",
            "mandate": "Quantify external and internal training workloads, detect physiological and neuromuscular fatigue, model injury risk trajectories, and ensure athletes peak at target competitions.",
            "context": "Operates at the nexus of raw biometric data and practical coaching. Responsible for translating millions of telemetry data points (GPS, accelerometers, heart rate, force plates) into clean, actionable coaching insights.",
            "daily_workflow": [
                "07:15 – 08:00 (Overnight Telemetry Ingestion): Ingests overnight HRV, resting heart rate, and sleep architecture data from team wearables. Runs algorithmic outlier detection to flag autonomic nervous system suppression.",
                "08:00 – 08:30 (Force Plate Testing): Conducts Countermovement Jump (CMJ) force plate testing for squad members in the gym. Analyzes flight-time:contraction-time ratio and eccentric deceleration impulse to quantify neuromuscular fatigue.",
                "08:30 – 08:45 (IST Morning Huddle): Presents the 'Squad Risk Board' to Coach and Physio. Recommends training deloads for athletes entering dangerous ACWR zones (>1.45).",
                "09:30 – 10:00 (GPS Hardware Setup): Calibrates Catapult Vector GPS pods; sets individualized speed zones (Z1 Recovery to Z6 Sprint >25.2 km/h).",
                "10:00 – 11:45 (Live Pitch Monitoring): Monitors live telemetry via telemetry antennas. Flags when an athlete exceeds target high-speed running thresholds.",
                "12:00 – 13:30 (Data Cleaning & Mathematical Modeling): Downloads raw GNSS data. Cleans erroneous traces, computes rolling 7-day Acute vs 28-day Chronic workload ratios (ACWR), and calculates session-RPE internal loads.",
                "15:00 – 16:30 (Longitudinal Research & AI Modeling): Analyzes multi-week fatigue trends; refines periodisation load curves for the Performance Director."
            ],
            "responsibilities": [
                "External Workload Quantification: Track and analyze GPS metrics including Total Distance (m), High-Speed Running (HSR >19.8 km/h), Sprint Distance (>25.2 km/h), Accelerations/Decelerations (>3 m/s²), and Metabolic Power.",
                "Internal Load & Fatigue Monitoring: Monitor sRPE, training impulse (TRIMP), HRV rMSSD baselines, and biochemical markers (creatine kinase / saliva cortisol where available).",
                "Neuromuscular Testing: Execute weekly force-plate testing (CMJ, Isometric Mid-Thigh Pull) to detect concealed central nervous system fatigue.",
                "ACWR & Injury Risk Forecasting: Maintain longitudinal rolling workload models to identify dangerous workload spikes (>1.5) and chronic fitness decay (<0.8).",
                "Coach Education & Data Translation: Create intuitive, visually engaging dashboards that convey complex physiological realities without cognitive overload."
            ],
            "kpis": [
                "Non-Contact Soft Tissue Injury Reduction (target: zero preventable workload-spike strains).",
                "Data Capture Integrity (>99% successful download, cleaning, and indexing of daily GPS & readiness data).",
                "ACWR Optimization Rate (>85% of active squad maintained in the 0.80–1.30 safe progression zone).",
                "Peaking Accuracy (physiological metrics at peak 100% during national championship qualification windows).",
                "Coach Adoption Rate (100% of training sessions reviewed and co-signed with coaching staff)."
            ],
            "pain_points": [
                "Data Silos & CSV Manual Hell: Spending 2 hours every day exporting CSVs from GPS software, force plate software, and wellness apps into Excel.",
                "Coach Dismissal: Having clear workload warnings ignored by coaches because 'the player looks fine and we have a big match'.",
                "Noisy Data: Distinguishing true physiological fatigue from psychological lack of effort or temporary life stress.",
                "Unclear Causality: Dealing with the reality that ACWR is an associative metric, not a crystal ball, requiring multi-modal triangulation."
            ],
            "usi_features": [
                "Dedicated Sports Science Workspace featuring live GPS, HRV, and fatigue telemetry.",
                "Interactive ACWR Calculator with real-time 'What If' Load Simulation slider.",
                "Automated AI Anomaly Detection alerting on multi-variable risk spikes.",
                "Unified Athlete 360 Telemetry Stream eliminating spreadsheet maintenance."
            ]
        },
        {
            "num": "2.4",
            "title": "Persona 4: The Lead Sports Physiotherapist / Head of Medical",
            "name": "Dr. Rajesh Kulkarni (Representative Profile)",
            "archetype": "Lead Sports Physiotherapist / Sports Medicine Specialist / Olympic Medical Team Lead (Age 42)",
            "mandate": "Diagnose and triage sports injuries, maintain standardized clinical registers, design stage-gated rehabilitation protocols, enforce objective return-to-play criteria, and safeguard athlete physical integrity.",
            "context": "Maintains legal, ethical, and clinical responsibility for player health. Balances intense pressure from coaching staff to accelerate recovery with the clinical necessity to avoid re-injury and catastrophic tissue breakdown.",
            "daily_workflow": [
                "07:30 – 08:30 (Morning Triage & Acute Clinic): Examines acute injuries sustained during yesterday's training. Performs clinical special tests (e.g., Lachman, anterior drawer, hamstring passive stretch). Logs pain scores and swelling metrics.",
                "08:30 – 08:45 (IST Medical Handover): Informs Head Coach and Sports Scientist of athlete restrictions: designates Arjun Mehta as 'Stage 3 RTP — Non-contact only'.",
                "09:00 – 11:30 (Clinical Rehabilitation Delivery): Conducts stage-gated rehabilitation sessions in the medical gym. Administers manual therapy, dry needling, eccentric loading, and neuromuscular re-education.",
                "12:00 – 13:00 (Diagnostic & Clinical Documentation): Records standardized OSICS-coded diagnoses in the clinical injury register; uploads ultrasound and MRI reports.",
                "14:00 – 15:30 (Objective RTP Testing): Administers Return-to-Play clearance battery: tests isokinetic hamstring-to-quadriceps strength symmetry on NordBord/dynamometer; conducts agility hop tests.",
                "16:00 – 16:30 (Medical Review & Gate Sign-off): Formally signs off on athletes advancing from Stage 2 (Strength Restoration) to Stage 3 (Sport-Specific Training).",
                "17:00 – 18:00 (Emergency Prep & Travel Kit Audit): Inspects defibrillator (AED), spinal board, suture kits, and WADA-approved emergency medications."
            ],
            "responsibilities": [
                "Injury Triage & Diagnosis: Accurately assess acute and overuse injuries using standardized diagnostic classifications (OSICS-10 / Orchard Sports Injury Coding).",
                "Interactive Anatomical Mapping: Maintain a comprehensive, 30-region anatomical map of all active musculoskeletal pathologies across the federation roster.",
                "Stage-Gated Rehabilitation: Program and supervise rehabilitation across 5 distinct phases: (1) Pain Reduction, (2) Strength Restoration, (3) Sport-Specific Training, (4) Full Team Training, (5) Return to Competition.",
                "Objective RTP Clearance: Ensure clearance decisions are strictly criterion-based (pain <=2/10, limb symmetry >=90%, full sprint velocity verified) rather than time-based.",
                "Medical Governance & Records: Maintain HIPAA/GDPR-compliant longitudinal clinical medical notes, treatment records, and diagnostic imaging archives."
            ],
            "kpis": [
                "Re-Injury Recurrence Rate (target: <5% within 12 months of RTP clearance).",
                "Average Days Lost per Injury Category (benchmarked against international sports medicine norms).",
                "Limb Symmetry Index at Clearance (>90% isokinetic strength and hop-test symmetry).",
                "Rehabilitation Protocol Adherence Rate (>95% prescribed rehab sessions completed and logged).",
                "Clinical Record Audit Compliance (100% of active injuries documented with OSICS code, onset date, and clinician notes)."
            ],
            "pain_points": [
                "Premature Return-to-Play Pressure: Constant pushback from coaches wanting injured star players cleared before biological tissue healing is complete.",
                "Static, Clunky Body Maps: Legacy medical systems that only offer flat, non-interactive clip-art diagrams where specific muscle heads cannot be isolated.",
                "Unrecorded Informal Treatments: Players receiving unofficial manual therapy or massages without medical department logging.",
                "Fragmented Rehab Data: Inability to easily cross-reference rehab progress against live GPS running velocity on the pitch."
            ],
            "usi_features": [
                "Interactive 30-Region Anatomical Body Map with dual anterior/posterior SVG silhouettes, severity hatching, and pathology overlays.",
                "6-Step Clinical Injury Reporting Modal with automated OSICS classification.",
                "Objective 5-Stage Return-to-Play Clearance Gate Modal with physician/physio sign-off toggles.",
                "Encrypted, searchable Medical Notes & Clinical Caseload Register."
            ]
        },
        {
            "num": "2.5",
            "title": "Persona 5: The Performance Nutritionist / Sports Dietitian",
            "name": "Neha Kapoor (Representative Profile)",
            "archetype": "Lead Performance Nutritionist / Board Certified Specialist in Sports Dietetics (CSSD) (Age 31)",
            "mandate": "Engineer nutritional periodisation plans, track hydration and micronutrient status, manage body composition, and safeguard 100% WADA anti-doping compliance across all ingested supplements.",
            "context": "Works across the entire national squad cohort to ensure that athletes have the physiological fuel required to execute high-volume training while maintaining ideal lean muscle mass and bone mineral density.",
            "daily_workflow": [
                "07:30 – 08:30 (Morning Hydration Screening): Evaluates morning urine specific gravity (USG) and osmolality for squad members as they arrive. Flags dehydrated athletes (USG >1.020) for mandatory rehydration protocols.",
                "08:30 – 09:30 (Fueling Station Management): Prepares individualized pre-training carbohydrate snacks and electrolyte formulations based on today's tactical session load.",
                "10:00 – 11:30 (Intra-Workout Fueling): Manages pitch-side hydration, carbohydrate gels, and electrolyte replenishment during high-intensity training breaks.",
                "12:00 – 13:00 (Post-Training Recovery Optimization): Administers post-session recovery nutrition (25-30g rapid-digestion protein + 1.2g/kg CHO) within the 45-minute metabolic window.",
                "13:30 – 15:30 (Body Composition & DEXA Scans): Conducts standardized Dual-energy X-ray Absorptiometry (DEXA) scans and ISAK 8-site skinfold assessments; computes lean muscle mass and body fat %.",
                "16:00 – 17:00 (WADA Supplement Audit): Audits third-party supplement batches against Informed-Sport / NSF Certified for Sport databases. Logs batch numbers into federation records.",
                "17:00 – 18:00 (Catering & Travel Menu Planning): Coordinates with hotel chefs and flight caterers for upcoming away matches; designs allergen-safe, macro-periodised buffets."
            ],
            "responsibilities": [
                "Nutritional Periodisation: Design tailored macro and micronutrient plans that match daily training load (e.g., high CHO on double-session days, low CHO/high fat on deload days).",
                "Hydration Monitoring: Screen hydration status using urine osmolality, sweat-rate testing, and pre/post-session nude body mass changes.",
                "WADA/NADA Supplement Compliance: Enforce a strict 'Food-First' philosophy; vet every supplement, vitamin, or recovery powder against the WADA Prohibited List; verify batch certificates.",
                "Body Composition Assessment: Monitor tissue composition (DEXA, skinfolds) with standardized protocols, accounting for hydration artifacts.",
                "Travel & Competition Fueling Logistics: Plan competition travel nutrition, combating jet lag, altered food availability, and hotel catering limitations."
            ],
            "kpis": [
                "Anti-Doping Zero-Violation Record (100% clean supplement audit trail; zero contaminated product incidents).",
                "Hydration Optimization (>90% of squad starting training in euhydrated state USG <1.020).",
                "Body Composition Targets (maintenance of position-specific lean mass and optimal body fat % without energy deficiency).",
                "Nutritional Plan Adherence (>85% athlete compliance with prescribed meal plans and recovery shakes).",
                "Relative Energy Deficiency in Sport (RED-S) Prevention (zero cases of low energy availability or amenorrhea/bone stress fractures)."
            ],
            "pain_points": [
                "Unapproved Supplement Use: Athletes buying unvetted vitamins or protein powders online based on social media hype.",
                "Travel Catering Chaos: Arriving at overseas tournament hotels to find high-fat, deep-fried food that violates the sports nutrition protocol.",
                "Manual Food Diary Frustration: Athletes refusing to weigh food or abandoning tedious 7-day food logging apps.",
                "Disconnect from Workload Data: Having to manually ask the sports scientist how many calories an athlete burned during practice."
            ],
            "usi_features": [
                "Dedicated Nutrition Workspace featuring meal plan builders with macronutrient periodisation.",
                "Real-time Hydration Intake Logger with one-click intake tracking.",
                "WADA-Approved Supplement Protocol Manager with batch number tracking.",
                "Longitudinal DEXA & Body Composition trend analytics."
            ]
        },
        {
            "num": "2.6",
            "title": "Persona 6: The Federation Administrator / National Registrar",
            "name": "Amitav Ghosh (Representative Profile)",
            "archetype": "National Sports Federation Registrar / Governance & Compliance Director (Age 52)",
            "mandate": "Govern the official national athlete registry, verify legal identity, age, and medical eligibility, ensure strict WADA/NADA whereabouts compliance, and maintain flawless governance for international sanctions.",
            "context": "Serves as the administrative guardian of the federation. Accountable to the Ministry of Sport, International Olympic Committee (IOC), international sport federations (e.g., FIFA, World Athletics), and national anti-doping authorities.",
            "daily_workflow": [
                "08:30 – 09:30 (Enrollment & Onboarding Queue): Opens USI Athlete Registry; reviews newly submitted athlete enrollment dossiers. Verifies national passport authenticity, birth registry, and signed player agreements.",
                "09:30 – 10:30 (Medical & Cardiac Clearance Audit): Cross-references cardiology ECG/echo sign-offs against national squad intake criteria; updates clearance flags from 'Pending' to 'Verified'.",
                "10:30 – 11:30 (WADA ADAMS Whereabouts Audit): Logs into national anti-doping tracking dashboard; reviews whereabouts submission compliance for athletes in the Registered Testing Pool (RTP). Flags athletes nearing the 12-month missed test threshold.",
                "12:00 – 13:00 (Coach Licensing & Staff Credentials): Verifies coaching certifications (e.g., AFC/UEFA Pro licenses, S&C accreditation) and safeguarding background checks for newly hired staff.",
                "14:00 – 15:30 (International Tournament Registration): Generates official squad entry rosters for international qualifiers; exports cryptographically signed eligibility passports.",
                "16:00 – 17:00 (Ministry & Funding Compliance Reporting): Compiles quarterly federation operational reports, athlete participation demographics, and budget audit reports for government funding oversight."
            ],
            "responsibilities": [
                "Athlete Registry Governance: Maintain the definitive, centralized registry of all sanctioned athletes across Senior, U-23, U-20, and Academy squads.",
                "Identity & Age Fraud Verification: Enforce rigorous KYC protocols, document forensics, and biological age verification to eliminate eligibility scandals.",
                "Anti-Doping Governance: Ensure 100% adherence to WADA Code and national anti-doping whereabouts reporting, education seminars, and Therapeutic Use Exemptions (TUE).",
                "Competition Licensing & Entry: Process official entry accreditations, international passports, and transfer certificates (ITC) in compliance with global governing bodies.",
                "Legal & Regulatory Governance: Manage athlete employment contracts, insurance policies, medical liability waivers, and safeguarding protocols."
            ],
            "kpis": [
                "100% Competition Eligibility Compliance (zero athlete disqualifications due to administrative or documentation oversights).",
                "Registry Onboarding Velocity (<48 hours turnaround time from application submission to verified athlete license).",
                "Anti-Doping Whereabouts Adherence (100% on-time quarterly filing rate; zero administrative filing failures).",
                "Document Verification Rate (100% of registered athletes backed by verified passports, medical waivers, and cardiac clearances).",
                "Regulatory Audit Score (flawless annual audit rating from National Sports Ministry and International Federation)."
            ],
            "pain_points": [
                "Paper-Based Inefficiency: Drowning in paper registration forms, scanned email PDFs, and expired passport copies.",
                "Forged Age & Identity Records: Constant risk of athletes presenting forged local municipal birth certificates to enter age-group competitions.",
                "Whereabouts Panic: Stressing over athletes missing their 60-minute testing window, risking multi-year bans for administrative negligence.",
                "Siloed Communication: Being left out of the loop when an athlete is injured or drops out of national camp."
            ],
            "usi_features": [
                "Centralized Athlete Registry with advanced multi-column filtering and bulk verification actions.",
                "6-Step Automated Athlete Onboarding Workflow with document upload and verification gating.",
                "Interactive Athlete Approval Modal supporting Approve, Request Changes, and Reject actions.",
                "Audit Trail & Document Management System tracking expiration dates, insurance, and medical waivers."
            ]
        },
        {
            "num": "2.7",
            "title": "Persona 7: The High Performance Director (HPD)",
            "name": "Marcus Sterling (Representative Profile)",
            "archetype": "High Performance Director (HPD) / Olympic Performance Director / Former Elite Olympian (Age 50)",
            "mandate": "Architect and lead the national high-performance strategic system, drive sustained multi-cycle podium success, manage multi-million dollar performance budgets, lead the Integrated Support Team (IST), and report to the Federation Board and Government Sports Authority.",
            "context": "The ultimate executive authority for performance. Operates at 30,000 feet, evaluating systems, pathways, talent conversion, and cross-functional synergy rather than daily pitch tactical minutiae.",
            "daily_workflow": [
                "07:30 – 08:15 (Executive Command Center Review): Opens USI Executive Command Center. Scans high-level KPIs: Federation Readiness (81/100), Active Caseload (3 in Rehab), Squad Load (1.08 ACWR), and AI Strategic Recommendations.",
                "08:30 – 09:30 (IST Executive Briefing): Chairs weekly cross-functional leadership meeting with Head Coach, Lead Sports Scientist, Chief Medical Officer, and Operations Director. Reviews squad availability trends and tournament readiness.",
                "10:00 – 11:30 (Talent Identification & Pathway Review): Inspects the Assessments & TID Workspace; reviews 5-tier talent identification quotient scores for U-19 prospects entering the national pipeline.",
                "12:00 – 13:30 (Budget & Resource Allocation): Evaluates equipment capital expenditures (e.g., purchase of new dual-force plates and GPS upgrades); reviews travel budget ROI for overseas training camps.",
                "14:30 – 16:00 (Ministry of Sport & Board Meeting): Presents quarterly performance dashboard to government funding officials, demonstrating target milestone progress toward Olympic qualification.",
                "16:30 – 17:30 (Strategic AI Risk Oversight): Reviews AI Risk Signals and automated workflow audit logs; verifies that consequential training modifications receive certified human sign-off."
            ],
            "responsibilities": [
                "Strategic High-Performance Architecture: Design, implement, and monitor 4-year Olympic/World Championship cycle strategic plans (Quadrennial Plans).",
                "Integrated Support Team (IST) Leadership: Unify coaching, sports science, medicine, nutrition, psychology, and operations into a frictionless, collaborative unit.",
                "Talent Identification & Pathway Pipeline: Ensure seamless progression of talent from regional academies through national development teams to the senior squad.",
                "Budget & Resource Allocation: Manage performance budgets, prioritize high-ROI technologies and facilities, and negotiate staff contracts.",
                "Stakeholder Management & Board Governance: Serve as primary performance liaison to CEO, Federation Board, National Olympic Committee (NOC), and Government Sports Ministries."
            ],
            "kpis": [
                "Olympic / World Championship Podium Conversion (number of medals, finals appearances, and world rankings achieved).",
                "Squad Availability Index (squad availability maintained >90% leading into major benchmark events).",
                "Pathway Conversion Rate (>35% of U-20 national talent successfully graduating into senior international caps).",
                "High-Performance Budget ROI (efficient allocation of funding with zero budget overrun).",
                "Staff Retention & High-Performance Culture (low turnover of elite coaching and scientific personnel)."
            ],
            "pain_points": [
                "Data Fragmentation & Reporting Fatigue: Sifting through 20 different weekly reports to understand if the squad is actually ready to compete.",
                "Tribalism & Silos: Managing political friction between old-school coaches and modern data scientists.",
                "Short-Termism: Fighting board pressure for immediate match wins when long-term strategic periodisation requires developmental deloading.",
                "Accountability Without Control: Being held accountable for Olympic medals when athletes suffer preventable injuries in unmonitored club environments."
            ],
            "usi_features": [
                "Executive Command Center with dynamic KPI grids, readiness distribution, and high-level squad summaries.",
                "Cross-Discipline Hierarchy Context Switcher (Federation > Sport > Program > Squad).",
                "AI Copilot Strategic Assistant for natural language querying of squad telemetry.",
                "Assessments & TID Talent Scoring Radar analytics."
            ]
        },
        {
            "num": "2.8",
            "title": "Persona 8: The Director of Team Operations & Logistics",
            "name": "Sanjay Nair (Representative Profile)",
            "archetype": "Director of High Performance Operations & Logistics / Team Operations Manager (Age 38)",
            "mandate": "Coordinate all domestic and international camp logistics, manage travel itineraries and visa procurement, schedule facilities and training venues, manage high-value sports equipment, and eliminate operational friction for athletes and staff.",
            "context": "The logistical backbone of the high-performance system. If operations fails, athletes miss flights, equipment gets held at customs, training pitches are unplayable, and performance suffers.",
            "daily_workflow": [
                "08:00 – 09:00 (Daily Facility & Pitch Operations): Confirms pitch availability, groundskeeping mowing heights, and training equipment placement with facility managers.",
                "09:00 – 10:30 (International Tour & Visa Logistics): Coordinates with national embassies and consulates for 35 visa applications ahead of international qualifiers in Europe. Tracks passport expiry dates.",
                "10:30 – 11:30 (Flight & Accommodation Manifests): Manages group charter flights, excess baggage allowances for medical and GPS equipment, and single/twin-share room allocations.",
                "12:00 – 13:00 (Camp Budget Auditing): Reviews camp accommodation invoices, transport bus hire, and meal stipends; updates financial ledger.",
                "14:00 – 15:30 (Equipment & Asset Tracking): Conducts physical audit of team kit bags, GPS vests, medical trauma kits, and filming towers; updates equipment inventory database.",
                "16:00 – 17:00 (Emergency Operations Hotline): Troubleshoots a delayed cargo shipment containing high-speed training cameras and recovery ice baths.",
                "17:00 – 18:00 (Briefing with Head Coach & HPD): Confirms daily schedule, bus departure times, and press conference timings for tomorrow's match day."
            ],
            "responsibilities": [
                "National Camp & Tour Logistics: Plan, budget, and execute multi-week training camps and international tournament travel for 40+ athletes and support staff.",
                "Travel & Visa Coordination: Procure international visas, manage group flight bookings, and arrange secure ground transportation.",
                "Facility & Venue Scheduling: Book high-performance pitches, gym facilities, recovery suites, and meeting rooms with stadium authorities.",
                "Equipment & Cargo Logistics: Manage customs clearance, air cargo manifests, and inventory tracking for sports science, medical, and technical gear.",
                "Vendor Management & Cost Control: Negotiate contracts with airlines, hotels, catering companies, and ground transit vendors within budget parameters."
            ],
            "kpis": [
                "Zero Logistical Disruptions (100% on-time flight arrivals, zero lost equipment bags, zero visa rejections).",
                "Operational Budget Adherence (<2% variance against approved tour and camp budgets).",
                "Facility Readiness Index (100% of pitches, gyms, and recovery facilities pre-inspected and ready prior to team arrival).",
                "Athlete Satisfaction Score (>90% positive feedback on camp accommodation, nutrition, and transit comfort).",
                "Asset Tracking Integrity (zero loss or damage of high-value GPS units, video cameras, or medical devices)."
            ],
            "pain_points": [
                "Last-Minute Coaching Changes: Head Coach suddenly altering training times or flight dates with 24 hours notice.",
                "Visa & Customs Bureaucracy: Equipment held at international borders due to complex customs declarations (carnets).",
                "Disconnected Itineraries: Athletes and staff not reading emailed PDFs and missing team bus departures.",
                "Manual Expense Management: Tracking hundreds of paper taxi receipts, excess baggage fees, and hotel meal charges."
            ],
            "usi_features": [
                "Operations Hub linking directly to training schedules and camp manifests.",
                "Bulk Athlete Communications and schedule broadcasting.",
                "Document & Passport Registry integration preventing visa application errors.",
                "Automated Audit Trail and reporting modules for transparent budget accountability."
            ]
        }
    ]

    for p in personas:
        # Persona Header
        p_sec = doc.add_heading(level=2)
        r_psec = p_sec.add_run(f"{p['num']} {p['title']}")
        r_psec.font.size = Pt(13.5)
        r_psec.font.bold = True
        r_psec.font.color.rgb = COLOR_HIGHLIGHT
        p_sec.paragraph_format.space_before = Pt(14)
        p_sec.paragraph_format.space_after = Pt(4)

        # Overview Table
        info_tbl = doc.add_table(rows=4, cols=2)
        info_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(info_tbl, "E2E8F0")

        fields = [
            ("Representative Profile", p['name']),
            ("Industry Archetype & Demographics", p['archetype']),
            ("Core Mandate & Mission", p['mandate']),
            ("Operational Context", p['context'])
        ]

        for idx, (f_label, f_val) in enumerate(fields):
            c_lbl = info_tbl.rows[idx].cells[0]
            c_val = info_tbl.rows[idx].cells[1]
            set_cell_background(c_lbl, "F1F5F9")
            set_cell_background(c_val, "FFFFFF")
            set_cell_margins(c_lbl, 60, 60, 80, 80)
            set_cell_margins(c_val, 60, 60, 80, 80)
            
            p1 = c_lbl.paragraphs[0]
            p1.paragraph_format.space_after = Pt(0)
            r1 = p1.add_run(f_label)
            r1.font.bold = True
            r1.font.size = Pt(8.5)
            r1.font.color.rgb = COLOR_MUTED

            p2 = c_val.paragraphs[0]
            p2.paragraph_format.space_after = Pt(0)
            r2 = p2.add_run(f_val)
            r2.font.size = Pt(8.5)
            r2.font.color.rgb = COLOR_PRIMARY

        doc.add_paragraph().paragraph_format.space_after = Pt(2)

        # Daily Workflow
        p_wf_h = doc.add_paragraph()
        r_wfh = p_wf_h.add_run("A Day in the Life (Operational Chronology):")
        r_wfh.font.bold = True
        r_wfh.font.size = Pt(10)
        r_wfh.font.color.rgb = COLOR_PRIMARY
        p_wf_h.paragraph_format.space_after = Pt(2)

        for step in p['daily_workflow']:
            p_step = doc.add_paragraph(style='List Bullet')
            p_step.paragraph_format.space_after = Pt(2)
            p_step.paragraph_format.line_spacing = 1.1
            parts = step.split(":", 1)
            if len(parts) == 2:
                r_time = p_step.add_run(parts[0] + ":")
                r_time.font.bold = True
                r_time.font.size = Pt(9)
                r_time.font.color.rgb = COLOR_ACCENT
                r_desc = p_step.add_run(parts[1])
                r_desc.font.size = Pt(9)
            else:
                r = p_step.add_run(step)
                r.font.size = Pt(9)

        # Core Responsibilities
        p_resp_h = doc.add_paragraph()
        r_resph = p_resp_h.add_run("Key Core Responsibilities:")
        r_resph.font.bold = True
        r_resph.font.size = Pt(10)
        r_resph.font.color.rgb = COLOR_PRIMARY
        p_resp_h.paragraph_format.space_before = Pt(4)
        p_resp_h.paragraph_format.space_after = Pt(2)

        for resp in p['responsibilities']:
            p_r = doc.add_paragraph(style='List Bullet')
            p_r.paragraph_format.space_after = Pt(2)
            p_r.paragraph_format.line_spacing = 1.1
            parts = resp.split(":", 1)
            if len(parts) == 2:
                r_tag = p_r.add_run(parts[0] + ":")
                r_tag.font.bold = True
                r_tag.font.size = Pt(9)
                r_desc = p_r.add_run(parts[1])
                r_desc.font.size = Pt(9)
            else:
                r = p_r.add_run(resp)
                r.font.size = Pt(9)

        # Two-column Box: KPIs vs Pain Points
        doc.add_paragraph().paragraph_format.space_after = Pt(2)
        kpi_pain_tbl = doc.add_table(rows=2, cols=2)
        kpi_pain_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(kpi_pain_tbl, "CBD5E1")

        c_kpi_h = kpi_pain_tbl.rows[0].cells[0]
        c_pain_h = kpi_pain_tbl.rows[0].cells[1]
        set_cell_background(c_kpi_h, "0F172A")
        set_cell_background(c_pain_h, "881337") # Rose 900
        set_cell_margins(c_kpi_h, 60, 60, 80, 80)
        set_cell_margins(c_pain_h, 60, 60, 80, 80)

        p_kh = c_kpi_h.paragraphs[0]
        p_kh.paragraph_format.space_after = Pt(0)
        r_kh = p_kh.add_run("Operational KPIs & Performance Metrics")
        r_kh.font.bold = True
        r_kh.font.size = Pt(8.5)
        r_kh.font.color.rgb = RGBColor(255, 255, 255)

        p_ph = c_pain_h.paragraphs[0]
        p_ph.paragraph_format.space_after = Pt(0)
        r_ph = p_ph.add_run("Critical Pain Points & Operational Friction")
        r_ph.font.bold = True
        r_ph.font.size = Pt(8.5)
        r_ph.font.color.rgb = RGBColor(255, 255, 255)

        c_kpi_b = kpi_pain_tbl.rows[1].cells[0]
        c_pain_b = kpi_pain_tbl.rows[1].cells[1]
        set_cell_background(c_kpi_b, "F8FAFC")
        set_cell_background(c_pain_b, "FFF1F2")
        set_cell_margins(c_kpi_b, 80, 80, 80, 80)
        set_cell_margins(c_pain_b, 80, 80, 80, 80)

        p_kb = c_kpi_b.paragraphs[0]
        p_kb.paragraph_format.space_after = Pt(0)
        for k in p['kpis']:
            pk = c_kpi_b.add_paragraph(style='List Bullet')
            pk.paragraph_format.space_after = Pt(2)
            rk = pk.add_run(k)
            rk.font.size = Pt(8)

        p_pb = c_pain_b.paragraphs[0]
        p_pb.paragraph_format.space_after = Pt(0)
        for pain in p['pain_points']:
            pp = c_pain_b.add_paragraph(style='List Bullet')
            pp.paragraph_format.space_after = Pt(2)
            rp = pp.add_run(pain)
            rp.font.size = Pt(8)

        # USI Feature Alignment
        p_feat_h = doc.add_paragraph()
        r_feath = p_feat_h.add_run("USI Platform Feature Alignment:")
        r_feath.font.bold = True
        r_feath.font.size = Pt(9.5)
        r_feath.font.color.rgb = COLOR_HIGHLIGHT
        p_feat_h.paragraph_format.space_before = Pt(6)
        p_feat_h.paragraph_format.space_after = Pt(2)

        for feat in p['usi_features']:
            pf = doc.add_paragraph(style='List Bullet')
            pf.paragraph_format.space_after = Pt(2)
            rf = pf.add_run(feat)
            rf.font.size = Pt(8.5)

        doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # ==========================================
    # SECTION 3: SYSTEM ARCHITECTURE & RBAC
    # ==========================================
    doc.add_page_break()
    h3 = doc.add_heading(level=1)
    run_h3 = h3.add_run("3. Cross-Functional Data Flows & Role-Based Access Control (RBAC)")
    run_h3.font.size = Pt(16)
    run_h3.font.bold = True
    run_h3.font.color.rgb = COLOR_PRIMARY
    h3.paragraph_format.space_before = Pt(8)
    h3.paragraph_format.space_after = Pt(6)

    doc.add_paragraph(
        "To satisfy international sports data governance, medical privacy standards (HIPAA, GDPR Article 9 health data), and WADA clean sport guidelines, the USI platform enforces strict boundaries on what each persona can view, edit, and authorize. The table below formalizes the Permission and Visibility Matrix across the 8 personas."
    )

    perm_table = doc.add_table(rows=9, cols=7)
    perm_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    set_table_borders(perm_table, "CBD5E1")

    perm_headers = ["User Persona", "Tactical & Sched.", "Clinical Med. & Body Map", "Sports Science GPS/ACWR", "Nutrition Plans", "Registry & KYC", "AI Automation & Rules"]
    for idx, heading in enumerate(perm_headers):
        cell = perm_table.rows[0].cells[idx]
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, 80, 80, 80, 80)
        p = cell.paragraphs[0]
        p.paragraph_format.space_after = Pt(0)
        r = p.add_run(heading)
        r.font.bold = True
        r.font.size = Pt(8)
        r.font.color.rgb = RGBColor(255, 255, 255)

    perm_rows = [
        ("Athlete", "Personal View Only", "Personal Status Only", "Personal Baseline", "Personal Plan (Toggles)", "Personal Docs", "Read-Only Signals"),
        ("Coach", "Full Create / Edit", "Status / RTP Stage Only", "View & Summary Load", "View Adherence", "View Squad", "Approve Training Mods"),
        ("Sports Scientist", "View & Suggest Mods", "View Pathology Areas", "Full Admin / Analysis", "View Hydration", "View Baselines", "Manage Risk Rules"),
        ("Physiotherapist", "View Schedule", "Full Clinical / Sign-Off", "View Load & HSR", "View Inflammation", "View Med Screening", "RTP Gate Clearance"),
        ("Nutritionist", "View Load Demands", "View Tissue Pathology", "View Caloric Burn", "Full Create / Edit", "View Compliance", "Advisory Alerts"),
        ("Federation Admin", "View Broad Dates", "Medical Status Only", "Aggregated Squad", "Compliance View", "Full Approval / Gate", "System Audit Logs"),
        ("Performance Director", "Executive Oversight", "Executive Caseload", "Executive ACWR", "Executive Overview", "Executive Registry", "Full System Governance"),
        ("Operations Team", "Manage Venues/Times", "Emergency Protocols", "Squad Headcounts", "Catering Logistics", "Logistics Documents", "Logistics Triggers")
    ]

    for r_idx, row_data in enumerate(perm_rows, start=1):
        for c_idx, text in enumerate(row_data):
            cell = perm_table.rows[r_idx].cells[c_idx]
            set_cell_background(cell, "F8FAFC" if r_idx % 2 == 1 else "FFFFFF")
            set_cell_margins(cell, 60, 60, 70, 70)
            p = cell.paragraphs[0]
            p.paragraph_format.space_after = Pt(0)
            r = p.add_run(text)
            r.font.size = Pt(8)
            if c_idx == 0:
                r.font.bold = True
                r.font.color.rgb = COLOR_HIGHLIGHT

    # Concluding Note
    doc.add_paragraph().paragraph_format.space_after = Pt(12)
    p_concl = doc.add_paragraph()
    r_cc = p_concl.add_run("Summary & Implementation Conclusion:")
    r_cc.font.bold = True
    r_cc.font.size = Pt(10.5)
    r_cc.font.color.rgb = COLOR_PRIMARY
    p_concl.paragraph_format.space_after = Pt(4)

    doc.add_paragraph(
        "By grounding each of the 8 user personas in rigorous empirical sports science, clinical sports medicine, and elite governance workflows, the Unified Sports Intelligence (USI) system eliminates the friction, communication gaps, and data silos that compromise national athletic performance. Every screen, interactive drawer, anatomical overlay, and AI recommendation in the USI prototype is calibrated to solve the precise daily pain points and operational needs documented in this specification."
    )

    output_path = r"C:\Users\ACT\Downloads\USI\USI_User_Personas_Comprehensive_Specification.docx"
    doc.save(output_path)
    print(f"Document successfully created at: {output_path}")

if __name__ == '__main__':
    create_document()
