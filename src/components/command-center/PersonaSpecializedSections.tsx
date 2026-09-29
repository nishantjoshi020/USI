import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Apple,
  Award,
  BarChart2,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Droplets,
  FileCheck,
  FileText,
  Flame,
  Globe,
  HeartPulse,
  Lock,
  MapPin,
  Moon,
  PlusSquare,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smile,
  Sparkles,
  Trophy,
  Truck,
  Upload,
  User,
  UserCheck,
  Users,
  Utensils,
  Wrench,
} from 'lucide-react';
import { UserRole } from '../../types/usi';

interface PersonaSpecializedSectionsProps {
  selectedRole: UserRole;
  onTriggerToast: (message: string) => void;
  onNavigateSection?: (navId: string) => void;
  onUpdateAthleteWellness?: (scores: {
    sleep: number;
    fatigue: number;
    soreness: number;
    stress: number;
    readiness: number;
  }) => void;
}

export const PersonaSpecializedSections: React.FC<PersonaSpecializedSectionsProps> = ({
  selectedRole,
  onTriggerToast,
  onNavigateSection,
  onUpdateAthleteWellness,
}) => {
  // Athlete Wellness State
  const [wellnessLogged, setWellnessLogged] = useState(false);
  const [sorenessLevel, setSorenessLevel] = useState(2);
  const [fatigueLevel, setFatigueLevel] = useState(3);
  const [stressLevel, setStressLevel] = useState(2);
  const [sleepScore, setSleepScore] = useState(88);

  // Operations Work Orders State
  const [workOrders, setWorkOrders] = useState([
    { id: 'WO-101', title: 'Pitch 1 Sprinkler Valve Calibration', zone: 'Zone A Turf', status: 'IN_PROGRESS', priority: 'HIGH', time: '11:45 IST' },
    { id: 'WO-102', title: 'Cryo-Chamber Liquid Nitrogen Refill', zone: 'Medical Wing', status: 'COMPLETED', priority: 'MEDIUM', time: '09:15 IST' },
    { id: 'WO-103', title: 'Gym Cable Pulley Friction Inspection', zone: 'Olympic Gym', status: 'PENDING', priority: 'LOW', time: '14:00 IST' },
  ]);

  // Nutrition Hydration Queue State
  const [hydrationQueue, setHydrationQueue] = useState([
    { id: 'ATH-01', name: 'Ananya Sen', squad: 'Track & Field', usg: 1.028, status: 'CRITICAL', action: '750ml Hypotonic Bolus' },
    { id: 'ATH-02', name: 'Rohan Kapoor', squad: 'Senior Squad', usg: 1.018, status: 'NORMAL', action: 'Standard Electrolyte' },
    { id: 'ATH-03', name: 'Vikram Malhotra', squad: 'Senior Squad', usg: 1.012, status: 'OPTIMAL', action: 'Pre-Hydrated' },
    { id: 'ATH-04', name: 'Priya Nair', squad: 'National U-23', usg: 1.022, status: 'MONITOR', action: '500ml Water + Pinch Salt' },
  ]);

  // Federation Registry Queue
  const [registryQueue, setRegistryQueue] = useState([
    { id: 'REG-882', name: 'Aarav Patel', sport: 'Athletics (100m)', state: 'Maharashtra', docs: 'Verified (Passport + Bio)', status: 'Awaiting Seal' },
    { id: 'REG-883', name: 'Sneha Deshmukh', sport: 'Badminton', state: 'Telangana', docs: 'Age Verification Complete', status: 'Approved' },
    { id: 'REG-884', name: 'Kabir Verma', sport: 'Shooting (10m)', state: 'Punjab', docs: 'Medical Card Pending', status: 'Action Required' },
  ]);

  /* =========================================================================
     1. ATHLETE PORTAL SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Athlete') {
    return (
      <div className="space-y-4">
        {/* Personal Schedule & Wellness Logging Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Today's Personal Schedule (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  My Today's Performance & Training Schedule
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300">
                MD-3 High-Speed Microcycle
              </span>
            </div>

            <div className="space-y-3">
              {[
                { time: '08:30 IST', title: 'Morning Biometrics & Hydration Testing', venue: 'Science Lab', badge: 'Completed', tone: 'emerald', detail: 'USG: 1.014 (Optimal) · Salivary Cortisol Baseline Normal' },
                { time: '10:00 IST', title: 'Strength & Power Gym Block', venue: 'High Performance Gym', badge: 'Completed', tone: 'emerald', detail: 'Target: 85% 1RM Trap Bar Deadlift + CMJ Potentiation' },
                { time: '12:30 IST', title: 'Nutritionist Consultation & Fueling Protocol', venue: 'Fueling Bar', badge: 'Completed', tone: 'emerald', detail: 'Consuming Smoothie #B-12 (40g Whey + 60g Cluster Dextrin)' },
                { time: '15:30 IST', title: 'High-Intensity Tactical Pitch Drill', venue: 'Stadium Pitch 2', badge: 'Upcoming', tone: 'sky', detail: 'Bring GPS Pod #14. Target RPE: 7/10 · High-Speed Running <400m' },
                { time: '18:00 IST', title: 'Contrast Hydrotherapy & Recovery Flush', venue: 'Hydro Recovery Zone', badge: 'Scheduled', tone: 'slate', detail: '10 mins cold immersion (10°C) + 3 mins sauna' },
              ].map((sess, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-slate-300 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {sess.time}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {sess.venue}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{sess.title}</h4>
                    <p className="text-[11px] text-slate-400">{sess.detail}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    sess.tone === 'emerald' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                    sess.tone === 'sky' ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {sess.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Wellness Check-in (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    My Daily Wellness & Soreness Check-in
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {wellnessLogged ? 'Status: Recorded' : 'Pending Morning Log'}
                </span>
              </div>

              {/* Sliders / Inputs */}
              <div className="space-y-3 pt-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Muscle Soreness (0 = None, 10 = Severe)</span>
                    <span className="font-mono font-bold text-emerald-400">{sorenessLevel} / 10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={sorenessLevel}
                    onChange={(e) => setSorenessLevel(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Fresh & Light</span>
                    <span>Moderate Fatigue</span>
                    <span>Severe Pain</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-300">Sleep Recovery Score</span>
                    <span className="font-mono font-bold text-sky-400">{sleepScore}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={sleepScore}
                    onChange={(e) => setSleepScore(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Restless</span>
                    <span>Adequate</span>
                    <span>Deep Restored</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Perceived Fatigue</span>
                      <span className="font-mono font-bold text-amber-400">{fatigueLevel}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={fatigueLevel}
                      onChange={(e) => setFatigueLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-slate-300">Mental Stress</span>
                      <span className="font-mono font-bold text-indigo-400">{stressLevel}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                {/* Computed Hooper-Mackinnon Readiness Preview */}
                <div className="p-2.5 rounded bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-300 font-medium">Computed Readiness Index</span>
                  <span className="font-mono font-bold text-xs text-emerald-400">
                    {Math.min(100, Math.max(35, Math.round((sleepScore * 0.4) + ((10 - sorenessLevel) * 3) + ((10 - fatigueLevel) * 2) + 10)))}%
                  </span>
                </div>

                {/* Subjective Status Feedback */}
                <div className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Physio Clearance Active</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Dr. Raghavan cleared your right adductor for maximum sprinting. High-speed running capped at 400m today.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setWellnessLogged(true);
                const computedReadiness = Math.min(100, Math.max(35, Math.round((sleepScore * 0.4) + ((10 - sorenessLevel) * 3) + ((10 - fatigueLevel) * 2) + 10)));
                onUpdateAthleteWellness?.({
                  sleep: sleepScore,
                  soreness: sorenessLevel,
                  fatigue: fatigueLevel,
                  stress: stressLevel,
                  readiness: computedReadiness,
                });
                onTriggerToast(`Morning wellness check-in logged ✓ Synced to Coach & Sport Science console (Readiness: ${computedReadiness}%)`);
              }}
              className="w-full py-2.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-xs font-bold text-emerald-200 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{wellnessLogged ? 'Update Logged Wellness Survey' : 'Submit Morning Wellness Survey'}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     2. NUTRITIONIST SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Nutritionist') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Pre-Training Hydration & USG Testing Queue (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Pre-Session Urine Specific Gravity (USG) Hydration Testing
                </h3>
              </div>
              <button
                onClick={() => onTriggerToast('Hydration test batch refreshed with latest lab refractometer data')}
                className="text-[11px] font-mono text-amber-400 hover:text-amber-300 font-semibold"
              >
                + Log USG Batch
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">Athlete</th>
                    <th className="pb-2">Squad</th>
                    <th className="pb-2">USG Reading</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action Protocol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {hydrationQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 text-white font-semibold">{item.name}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{item.squad}</td>
                      <td className="py-2.5 font-mono font-bold text-white">{item.usg}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          item.status === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                          item.status === 'MONITOR' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onTriggerToast(`Prescribed: ${item.action} for ${item.name}`)}
                          className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-[11px] text-amber-200"
                        >
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Informed-Sport WADA Supplement Registry & DEXA (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Informed-Sport WADA Supplement Audit
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                100% WADA Safe
              </span>
            </div>

            <div className="space-y-2.5">
              {[
                { name: 'Pure Whey Isolate Batch #49201', lab: 'LGC Informed Sport', cert: 'CERT-WADA-2026-09', status: 'Passed' },
                { name: 'Beta-Alanine CarnoSyn #8192', lab: 'Informed Choice UK', cert: 'CERT-WADA-2026-04', status: 'Passed' },
                { name: 'Electrolyte Hydration Salts #2201', lab: 'NSF Certified for Sport', cert: 'CERT-NSF-8819', status: 'Passed' },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-white">{item.name}</span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      <span>{item.lab}</span> · <span>{item.cert}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => onTriggerToast('Exporting complete WADA Anti-Doping Supplement Dossier (PDF)...')}
              className="w-full py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-xs font-bold text-amber-200 transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export Anti-Doping Audit Certificate</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     3. OPERATIONS TEAM SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Operations Team') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Facility Hourly Schedule & Turf Management (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Facility Zone Allocation & Booking Timetable
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-mono text-indigo-300">
                Main Stadium Complex
              </span>
            </div>

            <div className="space-y-3">
              {[
                { time: '09:00 - 11:30', zone: 'Natural Grass Pitch 1 (Zone A)', squad: 'Senior National Squad', tech: '24 GPS Pods Active', status: 'In Use', tone: 'emerald' },
                { time: '10:00 - 12:00', zone: 'Olympic S&C Center', squad: 'Development Squad Block', tech: 'Dual Force Plates #1 & #2', status: 'In Use', tone: 'emerald' },
                { time: '13:00 - 14:30', zone: 'Natural Grass Pitch 1 (Zone A)', squad: 'Groundskeeping Cut & Irrigation', tech: '22mm Cut Standard', status: 'Maintenance', tone: 'amber' },
                { time: '15:30 - 17:30', zone: 'Natural Grass Pitch 2 (Zone B)', squad: 'High-Press Tactical Drills', tech: 'Speed Gates & GPS Fleet', status: 'Booked', tone: 'sky' },
                { time: '17:30 - 19:30', zone: 'Contrast Pools & Hydrotherapy', squad: 'National Recovery Rotation', tech: 'Water pH 7.3 Checked', status: 'Reserved', tone: 'slate' },
              ].map((b, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-indigo-300">{b.time}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-xs font-semibold text-white">{b.zone}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 flex items-center gap-2">
                      <span>Squad: <strong>{b.squad}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400 font-mono">{b.tech}</span>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                    b.tone === 'emerald' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' :
                    b.tone === 'amber' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' :
                    b.tone === 'sky' ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30' :
                    'bg-slate-800 text-slate-400'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Open Facility Work Orders & Logistics (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Facility Work Orders & Maintenance
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {workOrders.filter(w => w.status !== 'COMPLETED').length} Active
                </span>
              </div>

              <div className="space-y-2.5">
                {workOrders.map((wo) => (
                  <div key={wo.id} className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400">{wo.id} · {wo.zone}</span>
                      <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold ${
                        wo.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                        wo.status === 'IN_PROGRESS' ? 'bg-sky-500/20 text-sky-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {wo.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-white">{wo.title}</h4>
                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
                      <span>Logged: {wo.time}</span>
                      <button
                        onClick={() => {
                          setWorkOrders(prev => prev.map(w => w.id === wo.id ? { ...w, status: 'COMPLETED' } : w));
                          onTriggerToast(`Work order ${wo.id} marked as completed.`);
                        }}
                        className="text-xs font-semibold text-sky-400 hover:text-sky-300"
                      >
                        {wo.status === 'COMPLETED' ? '✓ Closed' : 'Mark Resolved'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onTriggerToast('New facility maintenance order opened for engineering staff')}
              className="w-full py-2.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-xs font-bold text-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              <PlusSquare className="w-4 h-4 text-indigo-400" />
              <span>Create Facility Work Order</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     4. FEDERATION ADMIN SPECIALIZED HUB
     ========================================================================= */
  if (selectedRole === 'Federation Admin') {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Athlete Licensing & Eligibility Audit (7 Cols) */}
          <div className="lg:col-span-7 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  National Athlete Licensing & Eligibility Verification
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-mono text-cyan-300">
                184 National Registrations
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="pb-2">ID</th>
                    <th className="pb-2">Athlete</th>
                    <th className="pb-2">Discipline</th>
                    <th className="pb-2">Documentation</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {registryQueue.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 font-mono text-slate-400 text-[11px]">{item.id}</td>
                      <td className="py-2.5 text-white font-semibold">{item.name}</td>
                      <td className="py-2.5 text-slate-300 text-[11px]">{item.sport}</td>
                      <td className="py-2.5 text-slate-400 text-[11px]">{item.docs}</td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => {
                            setRegistryQueue(prev => prev.map(r => r.id === item.id ? { ...r, status: 'Approved' } : r));
                            onTriggerToast(`Federation License sealed and approved for ${item.name}`);
                          }}
                          className="px-2.5 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-[11px] font-semibold text-cyan-200"
                        >
                          {item.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* WADA Whereabouts Pool & Government Sanctions (5 Cols) */}
          <div className="lg:col-span-5 bg-[#0b111e]/90 border border-slate-800 rounded-xl p-5 backdrop-blur-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Anti-Doping (NADA/WADA) & Travel Sanctions
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-300 font-bold">
                100% Compliant
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Registered Testing Pool (RTP)</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">42 Tier-1 Athletes</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Whereabouts filings current for Q3. Zero missed tests, zero location filing failures.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#101827] border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">Sports Ministry Sanction #USI-881</span>
                  <span className="text-[10px] font-mono text-sky-400 font-bold">International Cleared</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Government of India foreign travel and daily allowance sanction active for Asian Grand Prix.
                </p>
              </div>
            </div>

            <button
              onClick={() => onTriggerToast('Exporting official Federation Governance & Anti-Doping Audit Certificate...')}
              className="w-full py-2.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-xs font-bold text-cyan-200 transition-all flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Export Federation Governance Audit</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // For Performance Director, Coach, Sports Scientist, Physiotherapist:
  // Return null because their primary dashboards utilize the standard sections with role-level action restrictions
  return null;
};
