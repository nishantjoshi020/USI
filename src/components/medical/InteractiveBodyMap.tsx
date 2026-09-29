import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ClipboardEdit,
  Dumbbell,
  Eye,
  HeartPulse,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';
import { BodyRegionId, BodyRegionSeverity, Injury } from '../../types/usi';
import { ALL_BODY_REGIONS } from '../../data/medicalMockData';

interface InteractiveBodyMapProps {
  injuries: Injury[];
  selectedRegion: BodyRegionId;
  onSelectRegion: (region: BodyRegionId) => void;
  athleteFilterName?: string; // If provided, indicates Athlete-Specific Body Map mode
  compactSelectionMode?: boolean; // Used inside Step 2 of Injury Reporting modal
  onViewInjury?: (injury: Injury) => void;
  onUpdateAssessment?: (injury: Injury) => void;
  onCreateRehabSession?: (injury: Injury) => void;
  onAdvanceRtp?: (injury: Injury) => void;
  onReportNewInjuryAtRegion?: (region: BodyRegionId) => void;
}

interface SvgRegionDef {
  id: BodyRegionId;
  shortLabel: string;
  view: 'front' | 'back';
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
}

// Front View Anatomical Regions (ViewBox 0 0 220 420)
const FRONT_SVG_REGIONS: SvgRegionDef[] = [
  { id: 'Head', shortLabel: 'Head', view: 'front', x: 92, y: 12, w: 36, h: 40, rx: 16 },
  { id: 'Neck', shortLabel: 'Neck', view: 'front', x: 99, y: 54, w: 22, h: 16, rx: 4 },
  { id: 'Shoulder — Right', shortLabel: 'R.Shld', view: 'front', x: 56, y: 68, w: 26, h: 24, rx: 8 },
  { id: 'Shoulder — Left', shortLabel: 'L.Shld', view: 'front', x: 138, y: 68, w: 26, h: 24, rx: 8 },
  { id: 'Chest', shortLabel: 'Chest', view: 'front', x: 84, y: 70, w: 52, h: 46, rx: 6 },
  { id: 'Core', shortLabel: 'Core', view: 'front', x: 86, y: 118, w: 48, h: 52, rx: 6 },
  { id: 'Upper Arm — Right', shortLabel: 'R.Arm', view: 'front', x: 52, y: 94, w: 22, h: 36, rx: 6 },
  { id: 'Upper Arm — Left', shortLabel: 'L.Arm', view: 'front', x: 146, y: 94, w: 22, h: 36, rx: 6 },
  { id: 'Elbow — Right', shortLabel: 'R.Elb', view: 'front', x: 50, y: 132, w: 20, h: 18, rx: 5 },
  { id: 'Elbow — Left', shortLabel: 'L.Elb', view: 'front', x: 150, y: 132, w: 20, h: 18, rx: 5 },
  { id: 'Forearm — Right', shortLabel: 'R.Fore', view: 'front', x: 46, y: 152, w: 20, h: 36, rx: 5 },
  { id: 'Forearm — Left', shortLabel: 'L.Fore', view: 'front', x: 154, y: 152, w: 20, h: 36, rx: 5 },
  { id: 'Wrist — Right', shortLabel: 'R.Wrst', view: 'front', x: 44, y: 190, w: 18, h: 16, rx: 4 },
  { id: 'Wrist — Left', shortLabel: 'L.Wrst', view: 'front', x: 158, y: 190, w: 18, h: 16, rx: 4 },
  { id: 'Hip — Right', shortLabel: 'R.Hip', view: 'front', x: 80, y: 172, w: 28, h: 28, rx: 6 },
  { id: 'Hip — Left', shortLabel: 'L.Hip', view: 'front', x: 112, y: 172, w: 28, h: 28, rx: 6 },
  { id: 'Quadriceps — Right', shortLabel: 'R.Quad', view: 'front', x: 78, y: 202, w: 28, h: 66, rx: 8 },
  { id: 'Quadriceps — Left', shortLabel: 'L.Quad', view: 'front', x: 114, y: 202, w: 28, h: 66, rx: 8 },
  { id: 'Knee — Right', shortLabel: 'R.Knee', view: 'front', x: 80, y: 270, w: 24, h: 26, rx: 6 },
  { id: 'Knee — Left', shortLabel: 'L.Knee', view: 'front', x: 116, y: 270, w: 24, h: 26, rx: 6 },
  { id: 'Ankle — Right', shortLabel: 'R.Ank', view: 'front', x: 82, y: 362, w: 22, h: 22, rx: 5 },
  { id: 'Ankle — Left', shortLabel: 'L.Ank', view: 'front', x: 116, y: 362, w: 22, h: 22, rx: 5 },
  { id: 'Foot — Right', shortLabel: 'R.Foot', view: 'front', x: 76, y: 386, w: 28, h: 20, rx: 6 },
  { id: 'Foot — Left', shortLabel: 'L.Foot', view: 'front', x: 116, y: 386, w: 28, h: 20, rx: 6 },
];

// Back View Anatomical Regions (ViewBox 0 0 220 420)
const BACK_SVG_REGIONS: SvgRegionDef[] = [
  { id: 'Head', shortLabel: 'Head', view: 'back', x: 92, y: 12, w: 36, h: 40, rx: 16 },
  { id: 'Neck', shortLabel: 'Neck', view: 'back', x: 99, y: 54, w: 22, h: 16, rx: 4 },
  { id: 'Shoulder — Left', shortLabel: 'L.Shld', view: 'back', x: 56, y: 68, w: 26, h: 24, rx: 8 },
  { id: 'Shoulder — Right', shortLabel: 'R.Shld', view: 'back', x: 138, y: 68, w: 26, h: 24, rx: 8 },
  { id: 'Upper Back', shortLabel: 'Up.Back', view: 'back', x: 84, y: 70, w: 52, h: 48, rx: 6 },
  { id: 'Lower Back', shortLabel: 'Lo.Back', view: 'back', x: 86, y: 120, w: 48, h: 50, rx: 6 },
  { id: 'Upper Arm — Left', shortLabel: 'L.Arm', view: 'back', x: 52, y: 94, w: 22, h: 36, rx: 6 },
  { id: 'Upper Arm — Right', shortLabel: 'R.Arm', view: 'back', x: 146, y: 94, w: 22, h: 36, rx: 6 },
  { id: 'Elbow — Left', shortLabel: 'L.Elb', view: 'back', x: 50, y: 132, w: 20, h: 18, rx: 5 },
  { id: 'Elbow — Right', shortLabel: 'R.Elb', view: 'back', x: 150, y: 132, w: 20, h: 18, rx: 5 },
  { id: 'Forearm — Left', shortLabel: 'L.Fore', view: 'back', x: 46, y: 152, w: 20, h: 36, rx: 5 },
  { id: 'Forearm — Right', shortLabel: 'R.Fore', view: 'back', x: 154, y: 152, w: 20, h: 36, rx: 5 },
  { id: 'Wrist — Left', shortLabel: 'L.Wrst', view: 'back', x: 44, y: 190, w: 18, h: 16, rx: 4 },
  { id: 'Wrist — Right', shortLabel: 'R.Wrst', view: 'back', x: 158, y: 190, w: 18, h: 16, rx: 4 },
  { id: 'Hip — Left', shortLabel: 'L.Hip', view: 'back', x: 80, y: 172, w: 28, h: 28, rx: 6 },
  { id: 'Hip — Right', shortLabel: 'R.Hip', view: 'back', x: 112, y: 172, w: 28, h: 28, rx: 6 },
  { id: 'Hamstring — Left', shortLabel: 'L.Ham', view: 'back', x: 78, y: 202, w: 28, h: 66, rx: 8 },
  { id: 'Hamstring — Right', shortLabel: 'R.Ham', view: 'back', x: 114, y: 202, w: 28, h: 66, rx: 8 },
  { id: 'Calf — Left', shortLabel: 'L.Calf', view: 'back', x: 80, y: 298, w: 24, h: 62, rx: 7 },
  { id: 'Calf — Right', shortLabel: 'R.Calf', view: 'back', x: 116, y: 298, w: 24, h: 62, rx: 7 },
  { id: 'Ankle — Left', shortLabel: 'L.Ank', view: 'back', x: 82, y: 362, w: 22, h: 22, rx: 5 },
  { id: 'Ankle — Right', shortLabel: 'R.Ank', view: 'back', x: 116, y: 362, w: 22, h: 22, rx: 5 },
  { id: 'Foot — Left', shortLabel: 'L.Foot', view: 'back', x: 76, y: 386, w: 28, h: 20, rx: 6 },
  { id: 'Foot — Right', shortLabel: 'R.Foot', view: 'back', x: 116, y: 386, w: 28, h: 20, rx: 6 },
];

export const InteractiveBodyMap: React.FC<InteractiveBodyMapProps> = ({
  injuries,
  selectedRegion,
  onSelectRegion,
  athleteFilterName,
  compactSelectionMode = false,
  onViewInjury,
  onUpdateAssessment,
  onCreateRehabSession,
  onAdvanceRtp,
  onReportNewInjuryAtRegion,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'front' | 'back'>('split');
  const [hoveredRegion, setHoveredRegion] = useState<BodyRegionId | null>(null);

  const getRegionInjuries = (regionId: BodyRegionId): Injury[] => {
    return injuries.filter((inj) => inj.bodyRegion === regionId);
  };

  const getRegionSeverity = (regionId: BodyRegionId): BodyRegionSeverity => {
    const matched = getRegionInjuries(regionId);
    if (matched.length === 0) return 'Healthy';
    if (matched.some((i) => i.severity === 'Severe' || i.severity === 'Critical'))
      return 'Severe';
    if (matched.some((i) => i.severity === 'Moderate')) return 'Moderate';
    if (matched.some((i) => i.severity === 'Minor')) return 'Minor';
    return 'At Risk';
  };

  const selectedRegionMeta =
    ALL_BODY_REGIONS.find((r) => r.id === selectedRegion) || ALL_BODY_REGIONS[0];
  const selectedRegionInjuries = getRegionInjuries(selectedRegion);
  const primaryInjury = selectedRegionInjuries[0] || null;
  const selectedSeverity = getRegionSeverity(selectedRegion);

  const renderSvgSilhouette = (
    orientation: 'front' | 'back',
    regions: SvgRegionDef[]
  ) => {
    return (
      <div className="flex flex-col items-center">
        <div className="text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          {orientation === 'front'
            ? 'Anterior (Front View)'
            : 'Posterior (Back View)'}
        </div>

        <svg
          viewBox="0 0 220 420"
          className="w-full max-w-[215px] h-auto select-none bg-[#090D16] rounded-lg border border-slate-800/90 p-2"
        >
          <defs>
            {/* Non-color-only SVG patterns for Moderate and Severe states */}
            <pattern
              id={`hatch-severe-${orientation}`}
              width="6"
              height="6"
              patternTransform="rotate(45 0 0)"
              patternUnits="userSpaceOnUse"
            >
              <rect width="6" height="6" fill="rgba(225, 29, 72, 0.35)" />
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="6"
                stroke="#FB7185"
                strokeWidth="2"
              />
            </pattern>

            <pattern
              id={`dots-moderate-${orientation}`}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <rect width="6" height="6" fill="rgba(245, 158, 11, 0.28)" />
              <circle cx="3" cy="3" r="1.2" fill="#FBBF24" />
            </pattern>
          </defs>

          {/* Subtle anatomical grid lines */}
          <line
            x1="110"
            y1="8"
            x2="110"
            y2="412"
            stroke="#1E293B"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="170"
            x2="200"
            y2="170"
            stroke="#1E293B"
            strokeDasharray="3 3"
            strokeWidth="1"
          />

          {/* Connector silhouette calves/shins on front view */}
          {orientation === 'front' && (
            <>
              <rect
                x="81"
                y="298"
                width="22"
                height="62"
                rx="6"
                fill="#0F1623"
                stroke="#1E293B"
                strokeWidth="1"
              />
              <rect
                x="117"
                y="298"
                width="22"
                height="62"
                rx="6"
                fill="#0F1623"
                stroke="#1E293B"
                strokeWidth="1"
              />
            </>
          )}
          {orientation === 'back' && (
            <>
              <rect
                x="80"
                y="270"
                width="24"
                height="26"
                rx="6"
                fill="#0F1623"
                stroke="#1E293B"
                strokeWidth="1"
              />
              <rect
                x="116"
                y="270"
                width="24"
                height="26"
                rx="6"
                fill="#0F1623"
                stroke="#1E293B"
                strokeWidth="1"
              />
            </>
          )}

          {regions.map((reg) => {
            const severity = getRegionSeverity(reg.id);
            const isSelected = selectedRegion === reg.id;
            const isHovered = hoveredRegion === reg.id;

            let fill = '#131C2E';
            let stroke = '#334155';
            let markerSymbol = '';

            if (severity === 'Severe') {
              fill = `url(#hatch-severe-${orientation})`;
              stroke = '#F43F5E';
              markerSymbol = '!';
            } else if (severity === 'Moderate') {
              fill = `url(#dots-moderate-${orientation})`;
              stroke = '#F59E0B';
              markerSymbol = '▲';
            } else if (severity === 'Minor' || severity === 'At Risk') {
              fill = 'rgba(56, 189, 248, 0.25)';
              stroke = '#38BDF8';
              markerSymbol = '●';
            }

            if (isSelected) {
              stroke = '#38BDF8';
            } else if (isHovered) {
              stroke = '#94A3B8';
            }

            return (
              <g
                key={`${orientation}-${reg.id}`}
                onClick={() => onSelectRegion(reg.id)}
                onMouseEnter={() => setHoveredRegion(reg.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className="cursor-pointer transition-all"
              >
                <rect
                  x={reg.x}
                  y={reg.y}
                  width={reg.w}
                  height={reg.h}
                  rx={reg.rx || 5}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSelected ? 2.5 : severity !== 'Healthy' ? 1.8 : 1}
                />

                {/* Selected Outer Focus Halo */}
                {isSelected && (
                  <rect
                    x={reg.x - 2}
                    y={reg.y - 2}
                    width={reg.w + 4}
                    height={reg.h + 4}
                    rx={(reg.rx || 5) + 2}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                    strokeDasharray="3 2"
                  />
                )}

                {/* Non-Color-Only Severity Marker Badge on Injured Region */}
                {markerSymbol && (
                  <g>
                    <circle
                      cx={reg.x + reg.w / 2}
                      cy={reg.y + reg.h / 2}
                      r="7"
                      fill="#090D16"
                      stroke={stroke}
                      strokeWidth="1.5"
                    />
                    <text
                      x={reg.x + reg.w / 2}
                      y={reg.y + reg.h / 2 + 3}
                      textAnchor="middle"
                      fill="#F8FAFC"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {markerSymbol}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-[#0F1623] border border-slate-800/90 rounded-lg p-5">
      {/* Top Bar: Title, View Mode Switcher & Severity Legend */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold tracking-wide text-slate-100 uppercase">
              {athleteFilterName
                ? `INTERACTIVE ANATOMICAL BODY MAP — ${athleteFilterName.toUpperCase()}`
                : 'INTERACTIVE ANATOMICAL BODY MAP (30 CLINICAL REGIONS)'}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Select any front/back anatomical region or use the region index to inspect pathology, RTP stage & actions
          </p>
        </div>

        {/* Front / Back / Split View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-[#090D16] border border-slate-800 rounded-md text-xs">
          {(
            [
              { id: 'split', label: 'Front & Back' },
              { id: 'front', label: 'Front Only' },
              { id: 'back', label: 'Back Only' },
            ] as const
          ).map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewMode === mode.id
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Non-Color-Only Severity Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2.5 px-3 bg-[#0B101B] border-b border-slate-800/80 text-[11px] text-slate-300">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#131C2E] border border-slate-600 inline-block" />
            <span>Healthy (✓)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-sky-500/30 border border-sky-400 inline-flex items-center justify-center text-[8px] font-mono font-bold">
              ●
            </span>
            <span>Minor / At Risk (●)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-400 inline-flex items-center justify-center text-[8px] font-mono font-bold text-amber-200">
              ▲
            </span>
            <span>Moderate Pattern (▲)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-rose-500/40 border border-rose-400 inline-flex items-center justify-center text-[8px] font-mono font-bold text-rose-200">
              !
            </span>
            <span>Severe Hatch (!)</span>
          </span>
        </div>
        <span className="font-mono text-sky-400">
          Selected: {selectedRegionMeta.displayLabel.toUpperCase()}
        </span>
      </div>

      {/* Main Body Map Grid: SVG Silhouettes + 30-Region Selector + Contextual Side Panel */}
      <div
        className={`grid grid-cols-1 ${
          compactSelectionMode ? 'lg:grid-cols-12' : 'xl:grid-cols-12'
        } gap-5 mt-4 items-start`}
      >
        {/* Left/Center: Interactive SVG Silhouettes */}
        <div
          className={`${
            compactSelectionMode ? 'lg:col-span-7' : 'xl:col-span-5'
          } flex flex-col items-center`}
        >
          <div
            className={`grid ${
              viewMode === 'split' ? 'grid-cols-2' : 'grid-cols-1'
            } gap-3 w-full justify-items-center`}
          >
            {(viewMode === 'split' || viewMode === 'front') &&
              renderSvgSilhouette('front', FRONT_SVG_REGIONS)}
            {(viewMode === 'split' || viewMode === 'back') &&
              renderSvgSilhouette('back', BACK_SVG_REGIONS)}
          </div>

          {/* Quick Injured Region Jump Pills */}
          <div className="w-full mt-3 pt-3 border-t border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 mb-2">
              Quick Select Active Pathology Regions:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(
                [
                  'Hamstring — Left',
                  'Ankle — Right',
                  'Shoulder — Right',
                  'Hamstring — Right',
                  'Knee — Left',
                ] as BodyRegionId[]
              ).map((rId) => {
                const sev = getRegionSeverity(rId);
                const active = selectedRegion === rId;
                const disp =
                  ALL_BODY_REGIONS.find((x) => x.id === rId)?.displayLabel ||
                  rId;
                return (
                  <button
                    key={rId}
                    onClick={() => onSelectRegion(rId)}
                    className={`px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                      active
                        ? 'bg-sky-500/20 border-sky-400 text-sky-200 font-semibold'
                        : sev !== 'Healthy'
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 hover:bg-amber-500/20'
                          : 'bg-[#090D16] border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>{disp}</span>
                    {sev !== 'Healthy' && (
                      <span className="ml-1.5 font-mono text-[10px]">
                        ({sev})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Middle: All 30 Anatomical Regions Directory */}
        <div
          className={`${
            compactSelectionMode ? 'lg:col-span-5' : 'xl:col-span-3'
          } bg-[#0B101B] border border-slate-800 rounded-lg p-3 max-h-[430px] overflow-y-auto`}
        >
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider pb-2 mb-2 border-b border-slate-800">
            30 Anatomical Regions
          </div>
          <div className="space-y-1">
            {ALL_BODY_REGIONS.map((reg) => {
              const sev = getRegionSeverity(reg.id);
              const isSelected = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => onSelectRegion(reg.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                    isSelected
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <span className="truncate">{reg.id}</span>
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      sev === 'Severe'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : sev === 'Moderate'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : sev === 'Minor'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'text-emerald-400/80'
                    }`}
                  >
                    {sev === 'Healthy' ? '✓ Healthy' : sev}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: 5. CONTEXTUAL BODY REGION SIDE PANEL / DRAWER */}
        {!compactSelectionMode && (
          <div className="xl:col-span-4 bg-[#0B101B] border border-slate-800 rounded-lg p-4 flex flex-col justify-between min-h-[430px]">
            <div className="space-y-3.5">
              {/* Region Header */}
              <div className="pb-3 border-b border-slate-800 flex items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-mono text-sky-400 uppercase">
                    SELECTED ANATOMICAL REGION
                  </div>
                  <h4 className="text-base font-bold text-slate-100 uppercase mt-0.5">
                    {selectedRegionMeta.displayLabel}
                  </h4>
                  <div className="text-[11px] text-slate-400 font-mono">
                    Code: {selectedRegion}
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold border ${
                    selectedSeverity === 'Severe'
                      ? 'bg-rose-500/20 border-rose-500/40 text-rose-300'
                      : selectedSeverity === 'Moderate'
                        ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                        : selectedSeverity === 'Minor'
                          ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                          : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                  }`}
                >
                  {selectedSeverity}
                </span>
              </div>

              {primaryInjury ? (
                <>
                  {/* Active Injury Details matching Section 5 exactly */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Current Status
                      </span>
                      <strong className="text-rose-400 font-semibold mt-0.5 block">
                        Active Injury ({primaryInjury.stage})
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Athlete
                      </span>
                      <strong className="text-slate-100 font-semibold mt-0.5 block">
                        {primaryInjury.athleteName}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800 col-span-2">
                      <span className="text-slate-400 block text-[10px]">
                        Injury Diagnosis
                      </span>
                      <strong className="text-slate-100 font-semibold mt-0.5 block">
                        {primaryInjury.diagnosis}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Severity
                      </span>
                      <strong className="text-amber-300 font-mono mt-0.5 block">
                        {primaryInjury.severity}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Pain
                      </span>
                      <strong className="text-slate-100 font-mono mt-0.5 block tabular-nums">
                        {primaryInjury.painScore} / 10
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Reported
                      </span>
                      <strong className="text-slate-200 font-mono mt-0.5 block">
                        {primaryInjury.onsetDate}
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Current RTP Stage
                      </span>
                      <strong className="text-sky-400 font-mono mt-0.5 block tabular-nums">
                        {primaryInjury.rtpStage} / 5
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Rehab Progress
                      </span>
                      <strong className="text-emerald-400 font-mono mt-0.5 block tabular-nums">
                        {primaryInjury.rehabProgressPct}%
                      </strong>
                    </div>

                    <div className="p-2.5 rounded bg-[#0F1623] border border-slate-800">
                      <span className="text-slate-400 block text-[10px]">
                        Medical Clearance
                      </span>
                      <strong className="text-amber-400 font-mono mt-0.5 block">
                        {primaryInjury.medicalStatus === 'Cleared'
                          ? 'Cleared'
                          : 'Pending'}
                      </strong>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                  <div>
                    <div className="text-sm font-bold text-slate-200">
                      Region Status: Healthy
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      No active injuries or tissue overload restrictions recorded for{' '}
                      <strong>{selectedRegionMeta.displayLabel}</strong>.
                    </p>
                  </div>
                  {onReportNewInjuryAtRegion && (
                    <button
                      onClick={() => onReportNewInjuryAtRegion(selectedRegion)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-sky-300"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Report Injury in This Region</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4 Required Actions when an injury is present */}
            {primaryInjury && (
              <div className="pt-3.5 mt-3.5 border-t border-slate-800 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onViewInjury && onViewInjury(primaryInjury)}
                  className="px-3 py-2 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs text-center transition-colors"
                >
                  View Injury
                </button>
                <button
                  onClick={() =>
                    onUpdateAssessment && onUpdateAssessment(primaryInjury)
                  }
                  className="px-3 py-2 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs text-center transition-colors"
                >
                  Update Assessment
                </button>
                <button
                  onClick={() =>
                    onCreateRehabSession && onCreateRehabSession(primaryInjury)
                  }
                  className="px-3 py-2 rounded bg-[#0F1623] hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs text-center transition-colors"
                >
                  Create Rehab Session
                </button>
                <button
                  onClick={() => onAdvanceRtp && onAdvanceRtp(primaryInjury)}
                  className="px-3 py-2 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-semibold text-xs text-center transition-colors"
                >
                  Advance RTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
