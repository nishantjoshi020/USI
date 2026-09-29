import React, { useState } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  FileText,
  Filter,
  Globe,
  Hotel,
  Layers,
  MapPin,
  Package,
  Plane,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Truck,
  UserCheck,
  Users,
  Wrench,
  X,
} from 'lucide-react';
import { UserRole } from '../../types/usi';

export type OperationsSubTab =
  | 'camps'
  | 'manifests'
  | 'cargo'
  | 'facilities';

interface OperationsWorkspaceProps {
  activeSubTab: OperationsSubTab;
  onSelectSubTab: (tab: OperationsSubTab) => void;
  selectedRole?: UserRole;
  onTriggerToast: (message: string) => void;
}

interface CampRecord {
  id: string;
  name: string;
  location: string;
  venue: string;
  dates: string;
  squad: string;
  headcount: number;
  budgetAllocated: string;
  budgetSpent: string;
  budgetVariance: string;
  status: 'In Progress' | 'Upcoming' | 'Completed';
  travelCoordinator: string;
}

const CAMPS_DATA: CampRecord[] = [
  {
    id: 'camp-01',
    name: 'National Senior Squad Pre-Olympic Peaking Camp',
    location: 'Munich, Germany',
    venue: 'Bavaria Olympic Training Center',
    dates: '12 Oct – 24 Oct 2026',
    squad: "Senior Men's National Squad",
    headcount: 36,
    budgetAllocated: '€85,000',
    budgetSpent: '€78,400',
    budgetVariance: '-7.7% (Under Budget)',
    status: 'Upcoming',
    travelCoordinator: 'Sanjay Nair (Ops Director)',
  },
  {
    id: 'camp-02',
    name: 'Asian Championship Altitude Adaptation Camp',
    location: 'Shimla, India',
    venue: 'High Altitude Sports Training Center (HASTC)',
    dates: '15 Sep – 02 Oct 2026',
    squad: "Senior Men's & U-23 Squad",
    headcount: 42,
    budgetAllocated: '₹34,00,000',
    budgetSpent: '₹32,80,000',
    budgetVariance: '-3.5% (Optimal)',
    status: 'In Progress',
    travelCoordinator: 'Sunil Mehta (Ops Coordinator)',
  },
  {
    id: 'camp-03',
    name: 'National Monsoon Conditioning Camp',
    location: 'Goa, India',
    venue: 'Goa State Sports Complex',
    dates: '10 Aug – 28 Aug 2026',
    squad: 'National Development Squad',
    headcount: 28,
    budgetAllocated: '₹18,50,000',
    budgetSpent: '₹18,90,000',
    budgetVariance: '+2.1% (Approved Variance)',
    status: 'Completed',
    travelCoordinator: 'Sunil Mehta (Ops Coordinator)',
  },
];

interface TravelManifestItem {
  id: string;
  flightNumber: string;
  airline: string;
  route: string;
  departure: string;
  arrival: string;
  passengersCount: number;
  excessBaggageKg: number;
  cargoDescription: string;
  status: 'Confirmed' | 'Check-in Open' | 'En Route' | 'Completed';
}

const TRAVEL_MANIFESTS: TravelManifestItem[] = [
  {
    id: 'flt-01',
    flightNumber: 'LH 761 / LH 2042',
    airline: 'Lufthansa Group',
    route: 'DEL (New Delhi) → MUC (Munich)',
    departure: '12 Oct 2026 · 02:45 IST',
    arrival: '12 Oct 2026 · 11:30 CEST',
    passengersCount: 36,
    excessBaggageKg: 380,
    cargoDescription: '18x Catapult GPS Kits, 4x Medical Trauma Kits, 2x Video Masts',
    status: 'Confirmed',
  },
  {
    id: 'flt-02',
    flightNumber: 'AI 409',
    airline: 'Air India',
    route: 'DEL (New Delhi) → CHD (Chandigarh / Shimla Ground)',
    departure: '15 Sep 2026 · 06:15 IST',
    arrival: '15 Sep 2026 · 07:25 IST',
    passengersCount: 42,
    excessBaggageKg: 240,
    cargoDescription: 'Vald ForceDecks plates, Recovery Normatec units',
    status: 'Completed',
  },
];

interface RoomingAllocation {
  roomNumber: string;
  type: 'Single (Lead Staff)' | 'Twin-Share (Athletes)';
  occupants: string[];
  pairingRationale: string;
  hotel: string;
}

const ROOMING_ALLOCATIONS: RoomingAllocation[] = [
  {
    roomNumber: 'Suite 401',
    type: 'Single (Lead Staff)',
    occupants: ['Vikram Sharma (Head Coach)'],
    pairingRationale: 'Tactical planning hub / coach isolation',
    hotel: 'Hilton Munich City Training Hotel',
  },
  {
    roomNumber: 'Suite 402',
    type: 'Single (Lead Staff)',
    occupants: ['Dr. Rajesh Kulkarni (Chief Medical Officer)'],
    pairingRationale: 'Medical examination and treatment facility',
    hotel: 'Hilton Munich City Training Hotel',
  },
  {
    roomNumber: 'Room 312',
    type: 'Twin-Share (Athletes)',
    occupants: ['Arjun Mehta (Forward)', 'Rohan Kapoor (Midfielder)'],
    pairingRationale: 'Synchronized sleep chronology (Chronotype: Early Bird / 22:30 sleep window)',
    hotel: 'Hilton Munich City Training Hotel',
  },
  {
    roomNumber: 'Room 314',
    type: 'Twin-Share (Athletes)',
    occupants: ['Vikram Malhotra (Defender)', 'Devansh Joshi (Fullback)'],
    pairingRationale: 'Tactical unit alignment / similar recovery protocols',
    hotel: 'Hilton Munich City Training Hotel',
  },
];

interface CargoItem {
  id: string;
  name: string;
  category: 'Sports Science Telemetry' | 'Medical Trauma & Physio' | 'Tactical Video & Analysis' | 'Training Gear';
  serialNumber: string;
  valueUsd: number;
  weightKg: number;
  customsCarnetNumber: string;
  status: 'Inspected & Cleared' | 'Customs Transit' | 'Requires ATA Carnet Renewal';
}

const CARGO_INVENTORY: CargoItem[] = [
  {
    id: 'crg-01',
    name: 'Catapult Vector S7 GNSS Pods (Case of 24 units)',
    category: 'Sports Science Telemetry',
    serialNumber: 'CAT-VEC-2026-9921',
    valueUsd: 48000,
    weightKg: 12.5,
    customsCarnetNumber: 'ATA-CARNET-IN-88912',
    status: 'Inspected & Cleared',
  },
  {
    id: 'crg-02',
    name: 'Vald ForceDecks Dual Dual-Force Plates System',
    category: 'Sports Science Telemetry',
    serialNumber: 'VALD-FD-8812',
    valueUsd: 22000,
    weightKg: 28.0,
    customsCarnetNumber: 'ATA-CARNET-IN-88913',
    status: 'Inspected & Cleared',
  },
  {
    id: 'crg-03',
    name: 'Philips HeartStart Automated External Defibrillator (AED)',
    category: 'Medical Trauma & Physio',
    serialNumber: 'PH-AED-99201',
    valueUsd: 4500,
    weightKg: 4.2,
    customsCarnetNumber: 'ATA-CARNET-IN-88914',
    status: 'Inspected & Cleared',
  },
  {
    id: 'crg-04',
    name: 'Normatec 3 Dual Leg Pneumatic Recovery Systems (x4)',
    category: 'Medical Trauma & Physio',
    serialNumber: 'NT3-SYS-401-404',
    valueUsd: 5200,
    weightKg: 14.8,
    customsCarnetNumber: 'ATA-CARNET-IN-88915',
    status: 'Inspected & Cleared',
  },
];

export const OperationsWorkspace: React.FC<OperationsWorkspaceProps> = ({
  activeSubTab,
  onSelectSubTab,
  selectedRole = 'Operations Team',
  onTriggerToast,
}) => {
  return (
    <div className="space-y-5">
      {/* 1. Header & Navigation Subtabs */}
      <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
              <Truck className="w-4 h-4 text-amber-400" />
              <span>HIGH PERFORMANCE OPERATIONS & LOGISTICS HUB</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-300">Camp, Travel, Venue & Cargo Management</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mt-1">
              National Camp Logistics, International Travel & Asset Infrastructure
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Coordinating multi-city tours, charter flight manifests, sleep-optimized rooming pairings, and international ATA customs carnets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTriggerToast('Exported complete Camp & Cargo Manifest PDF ✓')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Tour Dossier</span>
            </button>
          </div>
        </div>

        {/* Subtabs Bar */}
        <div className="flex flex-wrap items-center gap-1 pt-3">
          {(
            [
              { id: 'camps', label: 'Camp Logistics & Budget', icon: Globe },
              { id: 'manifests', label: 'Flights & Rooming Roster', icon: Plane },
              { id: 'cargo', label: 'Cargo & ATA Carnet Assets', icon: Package },
              { id: 'facilities', label: 'Facility Master Schedule', icon: Building2 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectSubTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUBTAB: CAMPS LOGISTICS & BUDGET */}
      {activeSubTab === 'camps' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CAMPS_DATA.map((camp) => (
              <div
                key={camp.id}
                className="p-5 rounded-lg bg-[#0F1623] border border-slate-800 space-y-3 shadow-sm hover:border-amber-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      camp.status === 'In Progress'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : camp.status === 'Upcoming'
                          ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {camp.status}
                  </span>
                  <span className="text-xs font-mono text-slate-400">{camp.headcount} Personnel</span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-100">{camp.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-amber-300/90 mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{camp.venue} · {camp.location}</span>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#090D16] border border-slate-800/80 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400">
                    <span>Dates:</span>
                    <strong className="text-slate-200">{camp.dates}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Allocated:</span>
                    <span className="text-slate-200">{camp.budgetAllocated}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Variance:</span>
                    <strong className="text-emerald-400">{camp.budgetVariance}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px] truncate">Lead: {camp.travelCoordinator}</span>
                  <button
                    onClick={() => onTriggerToast(`Opened itinerary details for ${camp.location}`)}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SUBTAB: FLIGHTS & ROOMING ROSTER */}
      {activeSubTab === 'manifests' && (
        <div className="space-y-5">
          {/* Flight Manifests */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide mb-3 flex items-center gap-2">
              <Plane className="w-4 h-4 text-amber-400" />
              <span>International Tour Group Flight Manifests</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] text-slate-400 font-semibold">
                    <th className="py-2.5 px-3">Flight / Carrier</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Departure</th>
                    <th className="py-2.5 px-3">Arrival</th>
                    <th className="py-2.5 px-3">Party Size</th>
                    <th className="py-2.5 px-3">Excess Cargo</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {TRAVEL_MANIFESTS.map((flt) => (
                    <tr key={flt.id} className="hover:bg-[#121927]">
                      <td className="py-3 px-3 font-bold text-slate-100">{flt.flightNumber} ({flt.airline})</td>
                      <td className="py-3 px-3 text-cyan-300 font-semibold">{flt.route}</td>
                      <td className="py-3 px-3 text-slate-300">{flt.departure}</td>
                      <td className="py-3 px-3 text-slate-300">{flt.arrival}</td>
                      <td className="py-3 px-3 text-slate-200">{flt.passengersCount} Pax</td>
                      <td className="py-3 px-3 text-amber-400 font-bold">{flt.excessBaggageKg} kg</td>
                      <td className="py-3 px-3 text-right">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          {flt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sleep-Optimized Rooming Manifest */}
          <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide flex items-center gap-2">
                  <Hotel className="w-4 h-4 text-sky-400" />
                  <span>Sleep & Recovery-Optimized Hotel Rooming Allocations</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pairing athletes by autonomic chronotype, circadian sleep windows, and recovery modality needs to prevent sleep fragmentation.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">Hilton Munich City (36 Rooms Blocked)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
              {ROOMING_ALLOCATIONS.map((room, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-[#0B101B] border border-slate-800 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-300 text-sm">{room.roomNumber}</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                      {room.type}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-100">
                    {room.occupants.join(' & ')}
                  </div>
                  <div className="text-[11px] text-slate-400 bg-[#090D16] p-2 rounded border border-slate-800/80">
                    <strong className="text-sky-300">Sleep/Tactical Rationale:</strong> {room.pairingRationale}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SUBTAB: CARGO & ATA CARNET ASSETS */}
      {activeSubTab === 'cargo' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                HIGH-VALUE SPORTS TECHNOLOGY & MEDICAL CARGO MANIFEST (ATA CARNET)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Official international customs passport items exempt from overseas duty. Total Insured Value: $79,700 USD.
              </p>
            </div>
            <button
              onClick={() => onTriggerToast('Generated Official ATA Carnet Customs Declaration Form ✓')}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs"
            >
              Export Carnet Form
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-[#0B101B] text-[11px] text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Equipment Item</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Serial Number</th>
                  <th className="py-2.5 px-3">Insured Value</th>
                  <th className="py-2.5 px-3">Weight</th>
                  <th className="py-2.5 px-3">Customs Carnet #</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {CARGO_INVENTORY.map((c) => (
                  <tr key={c.id} className="hover:bg-[#121927]">
                    <td className="py-3 px-3 font-sans font-semibold text-slate-100">{c.name}</td>
                    <td className="py-3 px-3 font-sans text-slate-300">{c.category}</td>
                    <td className="py-3 px-3 text-slate-400">{c.serialNumber}</td>
                    <td className="py-3 px-3 text-emerald-400 font-bold">${c.valueUsd.toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-300">{c.weightKg} kg</td>
                    <td className="py-3 px-3 text-amber-300">{c.customsCarnetNumber}</td>
                    <td className="py-3 px-3 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUBTAB: FACILITY MASTER SCHEDULE */}
      {activeSubTab === 'facilities' && (
        <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wide">
                TRAINING FACILITY & VENUE ALLOCATION MASTER SCHEDULE
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time pitch allocation, hydrotherapy recovery suite scheduling, and gym reservations.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Zero Venue Conflicts Detected</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { time: '08:00 – 10:00', venue: 'Pitch 1 (Grass)', squad: 'Senior Squad Tactical Session', status: 'Booked & Inspected' },
              { time: '10:15 – 11:45', venue: 'Olympic High Performance Gym', squad: 'Senior Squad S&C Block', status: 'Booked' },
              { time: '12:00 – 13:30', venue: 'Hydrotherapy Recovery Center', squad: 'Squad Contrast CWI Flush', status: 'Active (10°C Ready)' },
              { time: '15:30 – 17:30', venue: 'Pitch 2 (Hybrid Turf)', squad: 'U-23 National Camp Session', status: 'Booked' },
              { time: '18:00 – 19:30', venue: 'Auditorium & Tactical Film Suite', squad: 'Senior Squad Match Briefing', status: 'Booked' },
            ].map((f, i) => (
              <div key={i} className="p-3.5 rounded-lg bg-[#0B101B] border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-amber-400 w-28">{f.time}</span>
                  <div>
                    <strong className="text-slate-100 block">{f.venue}</strong>
                    <span className="text-slate-400 text-[11px]">{f.squad}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono text-[10px] font-semibold">
                  {f.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
