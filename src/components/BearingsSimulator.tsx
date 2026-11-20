import { useEffect, useRef, useState } from 'react';
import { Compass, Navigation, RotateCcw, Eye } from 'lucide-react';
import {
  Point2D,
  calculateBackBearing,
  calculateBearing,
  calculateDistance,
  describeClockwiseArc,
  describeClockwiseSector,
  formatBearing,
  interiorAngleAt,
  normalizeDeg,
  polarFromNorth,
} from '../utils/math';

const CHART_W = 640;
const CHART_H = 440;
const NM_SCALE = 0.2; // 5 px = 1 NM (100 px = 20 NM)

const DEFAULT_BOAT: Point2D = { x: 165, y: 315 };
const DEFAULT_CORAL: Point2D = { x: 430, y: 145 };
const DEFAULT_PALM: Point2D = { x: 480, y: 325 };

interface PresetCourse {
  label: string;
  boat: Point2D;
  coral: Point2D;
  palm: Point2D;
}

const PRESETS: PresetCourse[] = [
  {
    label: 'NE Crossing (057°)',
    boat: { x: 165, y: 315 },
    coral: { x: 430, y: 145 },
    palm: { x: 480, y: 325 },
  },
  {
    label: 'SE Channel (132°)',
    boat: { x: 150, y: 140 },
    coral: { x: 375, y: 340 },
    palm: { x: 495, y: 170 },
  },
  {
    label: 'SW Return (225°)',
    boat: { x: 445, y: 135 },
    coral: { x: 225, y: 355 },
    palm: { x: 170, y: 155 },
  },
  {
    label: 'NW Harbour (310°)',
    boat: { x: 450, y: 340 },
    coral: { x: 205, y: 135 },
    palm: { x: 185, y: 325 },
  },
];

type DragTarget = 'boat' | 'coral' | 'palm' | null;

export default function BearingsSimulator() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [boat, setBoat] = useState<Point2D>(DEFAULT_BOAT);
  const [coral, setCoral] = useState<Point2D>(DEFAULT_CORAL);
  const [palm, setPalm] = useState<Point2D>(DEFAULT_PALM);
  const [dragging, setDragging] = useState<DragTarget>(null);
  const [showBackBearing, setShowBackBearing] = useState(true);
  const [showTriangleCourse, setShowTriangleCourse] = useState(false);
  const [isSailing, setIsSailing] = useState(false);
  const [wakeTrail, setWakeTrail] = useState<Point2D[]>([]);

  const animRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const bearingBtoC = calculateBearing(boat, coral);
  const backBearingCtoB = calculateBackBearing(bearingBtoC);
  const distBtoC = calculateDistance(boat, coral, NM_SCALE);

  const bearingBtoP = calculateBearing(boat, palm);
  const bearingCtoP = calculateBearing(coral, palm);
  const distCtoP = calculateDistance(coral, palm, NM_SCALE);
  const distBtoP = calculateDistance(boat, palm, NM_SCALE);

  const angleAtBoat = interiorAngleAt(coral, boat, palm);
  const angleAtCoral = interiorAngleAt(boat, coral, palm);
  const angleAtPalm = interiorAngleAt(boat, palm, coral);

  const clampPoint = (pt: Point2D): Point2D => ({
    x: Math.max(48, Math.min(CHART_W - 48, pt.x)),
    y: Math.max(54, Math.min(CHART_H - 44, pt.y)),
  });

  const getSvgCoords = (clientX: number, clientY: number): Point2D | null => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * CHART_W;
    const y = ((clientY - rect.top) / rect.height) * CHART_H;
    return clampPoint({ x, y });
  };

  const handlePointerDown = (target: DragTarget) => (e: React.PointerEvent) => {
    e.stopPropagation();
    if (isSailing) stopSailing();
    (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
    setDragging(target);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const pt = getSvgCoords(e.clientX, e.clientY);
    if (!pt) return;
    if (dragging === 'boat') setBoat(pt);
    else if (dragging === 'coral') setCoral(pt);
    else if (dragging === 'palm') setPalm(pt);
  };

  const handlePointerUp = () => {
    setDragging(null);
  };

  const stopSailing = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = null;
    setIsSailing(false);
  };

  const startSailAnimation = () => {
    if (isSailing) {
      stopSailing();
      return;
    }
    const start = { ...boat };
    const end = { ...coral };
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    if (dist < 28) return;

    // Stop slightly offshore of Coral Island
    const stopFraction = Math.max(0.1, (dist - 32) / dist);
    const target = {
      x: start.x + dx * stopFraction,
      y: start.y + dy * stopFraction,
    };

    setIsSailing(true);
    setWakeTrail([start]);
    const duration = 2200;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      // Smooth ease-in-out
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const nextPt = {
        x: start.x + (target.x - start.x) * ease,
        y: start.y + (target.y - start.y) * ease,
      };
      setBoat(nextPt);
      setWakeTrail((prev) => {
        const last = prev[prev.length - 1];
        if (!last || Math.hypot(nextPt.x - last.x, nextPt.y - last.y) > 8) {
          return [...prev, nextPt];
        }
        return prev;
      });
      if (t < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsSailing(false);
        animRef.current = null;
      }
    };

    animRef.current = requestAnimationFrame(step);
  };

  const applyPreset = (preset: PresetCourse) => {
    stopSailing();
    setWakeTrail([]);
    setBoat(preset.boat);
    setCoral(preset.coral);
    setPalm(preset.palm);
  };

  const resetAll = () => {
    stopSailing();
    setWakeTrail([]);
    setBoat(DEFAULT_BOAT);
    setCoral(DEFAULT_CORAL);
    setPalm(DEFAULT_PALM);
  };

  // Manual bearing adjustment via slider (rotates Boat around Coral Island or moves Coral along bearing)
  const handleManualBearing = (newBearingDeg: number) => {
    stopSailing();
    setWakeTrail([]);
    const currentDistPx = Math.max(70, Math.min(260, Math.hypot(coral.x - boat.x, coral.y - boat.y)));
    const nextCoral = clampPoint(polarFromNorth(boat.x, boat.y, currentDistPx, newBearingDeg));
    setCoral(nextCoral);
  };

  const coInteriorNorth = normalizeDeg(bearingBtoC) <= 180 ? 180 - bearingBtoC : bearingBtoC - 180;
  const bearingLabelPos = polarFromNorth(boat.x, boat.y, 52, bearingBtoC / 2);
  const backLabelPos = polarFromNorth(coral.x, coral.y, 50, backBearingCtoB / 2);

  return (
    <section id="bearings" className="py-12 sm:py-16 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-sky-700">
            Module 01 · Three-Figure Bearings &amp; Island Navigation
          </p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Boat &amp; Island Bearings Simulator
          </h2>
          <p className="mt-2.5 text-base text-slate-600 leading-relaxed">
            In maritime navigation, a <strong className="font-semibold text-slate-900">bearing</strong> is always
            measured clockwise from true North (<span className="font-mono">000°</span>) and written with three
            digits. Drag the boat or islands on the chart below to watch forward bearings, back-bearings, and
            island triangle courses update live.
          </p>
        </div>

        {/* Two-Zone Sandbox Layout */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Stage: Interactive Nautical SVG Chart */}
          <div className="lg:col-span-7 bg-[#F4F8FB] border border-slate-200 rounded-xl p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-200 text-xs text-slate-600">
              <span>Drag the Boat, Coral Island, or Palm Atoll directly</span>
              <span className="font-mono tabular-nums text-sky-700 font-medium">
                Scale: 1 grid square = 8 NM
              </span>
            </div>

            <div className="relative w-full overflow-hidden rounded-lg border border-sky-200 bg-[#E6F4FA]">
              <svg
                ref={svgRef}
                viewBox={`0 0 ${CHART_W} ${CHART_H}`}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                className="w-full h-auto block select-none touch-none"
                role="img"
                aria-label="Interactive nautical chart showing boat and islands with North lines and three-figure bearings"
              >
                <defs>
                  <linearGradient id="oceanChartBg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E0F2FE" />
                    <stop offset="100%" stopColor="#BAE6FD" stopOpacity="0.65" />
                  </linearGradient>
                  <pattern id="nauticalGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#0284C7"
                      strokeOpacity="0.14"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>

                {/* Sea background & grid */}
                <rect width={CHART_W} height={CHART_H} fill="url(#oceanChartBg)" />
                <rect width={CHART_W} height={CHART_H} fill="url(#nauticalGridPattern)" />

                {/* Subtle wave contour arcs */}
                <path
                  d="M 20 80 Q 140 65 260 80 T 500 80 T 620 75"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />
                <path
                  d="M 30 390 Q 170 375 310 390 T 590 385"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeOpacity="0.45"
                  strokeWidth="1.5"
                />

                {/* Compass Rose in top-right corner */}
                <g transform="translate(585, 58)">
                  <circle cx="0" cy="0" r="30" fill="#FFFFFF" fillOpacity="0.88" stroke="#94A3B8" strokeWidth="1" />
                  <line x1="0" y1="-26" x2="0" y2="26" stroke="#CBD5E1" strokeWidth="1" />
                  <line x1="-26" y1="0" x2="26" y2="0" stroke="#CBD5E1" strokeWidth="1" />
                  <polygon points="0,-22 5,-3 0,-7 -5,-3" fill="#EA580C" />
                  <polygon points="0,22 5,3 0,7 -5,3" fill="#64748B" />
                  <text x="0" y="-25" textAnchor="middle" className="fill-slate-900 font-mono text-[10px] font-bold">
                    N
                  </text>
                  <text x="23" y="3" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] font-semibold">
                    E
                  </text>
                  <text x="-23" y="3" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] font-semibold">
                    W
                  </text>
                  <text x="0" y="29" textAnchor="middle" className="fill-slate-500 font-mono text-[8px] font-semibold">
                    S
                  </text>
                </g>

                {/* Optional 3-Island Triangle Course */}
                {showTriangleCourse && (
                  <g>
                    <polygon
                      points={`${boat.x},${boat.y} ${coral.x},${coral.y} ${palm.x},${palm.y}`}
                      fill="#0D9488"
                      fillOpacity="0.09"
                      stroke="#0D9488"
                      strokeWidth="2"
                      strokeDasharray="6 4"
                    />
                    {/* Midpoint distance labels for C->P and B->P */}
                    <g transform={`translate(${(coral.x + palm.x) / 2}, ${(coral.y + palm.y) / 2})`}>
                      <rect x="-28" y="-10" width="56" height="20" rx="4" fill="#FFFFFF" stroke="#99F6E4" strokeWidth="1" />
                      <text y="4" textAnchor="middle" className="fill-teal-800 font-mono text-[10px] font-semibold">
                        {distCtoP.toFixed(1)} NM
                      </text>
                    </g>
                    <g transform={`translate(${(boat.x + palm.x) / 2}, ${(boat.y + palm.y) / 2})`}>
                      <rect x="-28" y="-10" width="56" height="20" rx="4" fill="#FFFFFF" stroke="#99F6E4" strokeWidth="1" />
                      <text y="4" textAnchor="middle" className="fill-teal-800 font-mono text-[10px] font-semibold">
                        {distBtoP.toFixed(1)} NM
                      </text>
                    </g>
                  </g>
                )}

                {/* Wake trail when sailing */}
                {wakeTrail.length > 1 && (
                  <polyline
                    points={wakeTrail.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                )}

                {/* North line at Boat */}
                <g>
                  <line
                    x1={boat.x}
                    y1={boat.y}
                    x2={boat.x}
                    y2={Math.max(18, boat.y - 84)}
                    stroke="#0F172A"
                    strokeWidth="1.6"
                    strokeDasharray="4 3"
                  />
                  <polygon
                    points={`${boat.x},${Math.max(12, boat.y - 90)} ${boat.x - 4},${Math.max(20, boat.y - 82)} ${boat.x + 4},${Math.max(20, boat.y - 82)}`}
                    fill="#0F172A"
                  />
                  <text
                    x={boat.x}
                    y={Math.max(10, boat.y - 94)}
                    textAnchor="middle"
                    className="fill-slate-900 font-mono text-[11px] font-bold"
                  >
                    N
                  </text>
                </g>

                {/* North line & Back-Bearing at Coral Island */}
                {showBackBearing && (
                  <g>
                    <line
                      x1={coral.x}
                      y1={coral.y}
                      x2={coral.x}
                      y2={Math.max(18, coral.y - 84)}
                      stroke="#0F172A"
                      strokeWidth="1.6"
                      strokeDasharray="4 3"
                    />
                    <polygon
                      points={`${coral.x},${Math.max(12, coral.y - 90)} ${coral.x - 4},${Math.max(20, coral.y - 82)} ${coral.x + 4},${Math.max(20, coral.y - 82)}`}
                      fill="#0F172A"
                    />
                    <text
                      x={coral.x}
                      y={Math.max(10, coral.y - 94)}
                      textAnchor="middle"
                      className="fill-slate-900 font-mono text-[11px] font-bold"
                    >
                      N
                    </text>

                    {/* Back-bearing sector & arc */}
                    <path
                      d={describeClockwiseSector(coral.x, coral.y, 34, 0, backBearingCtoB)}
                      fill="#0284C7"
                      fillOpacity="0.14"
                    />
                    <path
                      d={describeClockwiseArc(coral.x, coral.y, 34, 0, backBearingCtoB)}
                      fill="none"
                      stroke="#0284C7"
                      strokeWidth="2.2"
                    />
                    <g transform={`translate(${backLabelPos.x}, ${backLabelPos.y})`}>
                      <rect x="-20" y="-9" width="40" height="18" rx="4" fill="#FFFFFF" fillOpacity="0.92" stroke="#7DD3FC" strokeWidth="1" />
                      <text y="3.5" textAnchor="middle" className="fill-sky-800 font-mono text-[10px] font-semibold">
                        {formatBearing(backBearingCtoB)}
                      </text>
                    </g>
                  </g>
                )}

                {/* Forward bearing sector & arc at Boat */}
                <path
                  d={describeClockwiseSector(boat.x, boat.y, 36, 0, bearingBtoC)}
                  fill="#EA580C"
                  fillOpacity="0.16"
                />
                <path
                  d={describeClockwiseArc(boat.x, boat.y, 36, 0, bearingBtoC)}
                  fill="none"
                  stroke="#EA580C"
                  strokeWidth="2.4"
                />
                <g transform={`translate(${bearingLabelPos.x}, ${bearingLabelPos.y})`}>
                  <rect x="-20" y="-9" width="40" height="18" rx="4" fill="#FFFFFF" fillOpacity="0.94" stroke="#FDBA74" strokeWidth="1" />
                  <text y="3.5" textAnchor="middle" className="fill-orange-700 font-mono text-[10px] font-semibold">
                    {formatBearing(bearingBtoC)}
                  </text>
                </g>

                {/* Course Line Boat -> Coral Island */}
                <line
                  x1={boat.x}
                  y1={boat.y}
                  x2={coral.x}
                  y2={coral.y}
                  stroke="#0369A1"
                  strokeWidth="2.6"
                />

                {/* Distance Label on Course Line */}
                <g transform={`translate(${(boat.x + coral.x) / 2}, ${(boat.y + coral.y) / 2})`}>
                  <rect x="-30" y="-11" width="60" height="22" rx="5" fill="#0F172A" />
                  <text y="4" textAnchor="middle" className="fill-white font-mono text-[11px] font-semibold">
                    {distBtoC.toFixed(1)} NM
                  </text>
                </g>

                {/* Palm Atoll (visible in triangle course mode) */}
                {showTriangleCourse && (
                  <g
                    transform={`translate(${palm.x}, ${palm.y})`}
                    onPointerDown={handlePointerDown('palm')}
                    className="cursor-grab active:cursor-grabbing"
                  >
                    <circle cx="0" cy="0" r="28" fill="transparent" />
                    <ellipse cx="0" cy="3" rx="22" ry="15" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                    <ellipse cx="0" cy="0" rx="14" ry="9" fill="#0D9488" />
                    <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                    <text y="30" textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                      Palm Atoll (P)
                    </text>
                  </g>
                )}

                {/* Coral Island (Draggable) */}
                <g
                  transform={`translate(${coral.x}, ${coral.y})`}
                  onPointerDown={handlePointerDown('coral')}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <circle cx="0" cy="0" r="30" fill="transparent" />
                  <ellipse cx="0" cy="3" rx="25" ry="16" fill="#FDE68A" stroke="#D97706" strokeWidth="1.8" />
                  <ellipse cx="0" cy="0" rx="16" ry="10" fill="#10B981" />
                  <circle cx="0" cy="0" r="4" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text y="32" textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Coral Island (C)
                  </text>
                </g>

                {/* Boat (Draggable, rotated toward Coral Island) */}
                <g
                  transform={`translate(${boat.x}, ${boat.y})`}
                  onPointerDown={handlePointerDown('boat')}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <circle cx="0" cy="0" r="28" fill="transparent" />
                  <g transform={`rotate(${bearingBtoC})`}>
                    <path
                      d="M 0 -16 L 10 11 L 0 6 L -10 11 Z"
                      fill="#EA580C"
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                  <text y="28" textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Boat (B)
                  </text>
                </g>
              </svg>
            </div>

            {/* Stage Action Toolbar */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={startSailAnimation}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                >
                  <Navigation className="w-4 h-4" aria-hidden="true" />
                  <span>{isSailing ? 'Stop Boat' : 'Sail Along Bearing'}</span>
                </button>
                <button
                  type="button"
                  onClick={resetAll}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors min-h-[44px] whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowBackBearing((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors min-h-[44px] whitespace-nowrap ${
                    showBackBearing
                      ? 'bg-sky-50 border-sky-300 text-sky-800'
                      : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Back-Bearing</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowTriangleCourse((v) => !v)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors min-h-[44px] whitespace-nowrap ${
                    showTriangleCourse
                      ? 'bg-teal-50 border-teal-300 text-teal-800'
                      : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>3-Island Triangle</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Control & Concept Deck */}
          <div className="lg:col-span-5 space-y-5">
            {/* Live Telemetry Readout */}
            <div className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-slate-900">Live Navigation Readout</h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                  <div className="text-xs font-medium text-slate-500">Bearing of Coral from Boat</div>
                  <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-orange-600">
                    {formatBearing(bearingBtoC)}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">Clockwise from Boat N</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-lg p-3.5">
                  <div className="text-xs font-medium text-slate-500">Back-Bearing (Boat from Coral)</div>
                  <div className="mt-1 text-2xl font-bold font-mono tabular-nums text-sky-700">
                    {formatBearing(backBearingCtoB)}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {bearingBtoC < 180 ? `${formatBearing(bearingBtoC)} + 180°` : `${formatBearing(bearingBtoC)} − 180°`}
                  </div>
                </div>
              </div>

              {/* Bearing Slider for exact dialing on mobile */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between text-sm">
                  <label htmlFor="bearing-dial" className="font-medium text-slate-700">
                    Adjust Bearing Manually
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-sky-700">
                    {formatBearing(bearingBtoC)} · {distBtoC.toFixed(1)} NM
                  </span>
                </div>
                <input
                  id="bearing-dial"
                  type="range"
                  min={0}
                  max={359}
                  value={Math.round(bearingBtoC) % 360}
                  onChange={(e) => handleManualBearing(Number(e.target.value))}
                  className="trig-slider mt-1"
                />
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>000° N</span>
                  <span>090° E</span>
                  <span>180° S</span>
                  <span>270° W</span>
                  <span>359°</span>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs font-medium text-slate-500 mb-2">Preset Voyages</div>
                <div className="grid grid-cols-2 gap-2">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:border-sky-400 hover:text-sky-700 transition-colors text-left min-h-[40px]"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Parallel North Lines Proof OR 3-Island Triangle Bridge */}
            {showTriangleCourse ? (
              <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-5">
                <h3 className="text-base font-semibold text-slate-900">
                  How Bearings Form Triangles
                </h3>
                <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                  Subtracting two bearings from the same North line gives the interior angle between courses:
                </p>
                <div className="mt-3 space-y-2 font-mono text-xs sm:text-sm tabular-nums text-slate-800 bg-white border border-teal-200 rounded-lg p-3.5">
                  <div>Bearing B → C = {formatBearing(bearingBtoC)}</div>
                  <div>Bearing B → P = {formatBearing(bearingBtoP)}</div>
                  <div className="pt-1.5 border-t border-slate-200 font-semibold text-teal-800">
                    ∠B = {angleAtBoat.toFixed(1)}° · ∠C = {angleAtCoral.toFixed(1)}° · ∠P = {angleAtPalm.toFixed(1)}°
                  </div>
                  <div className="text-xs text-slate-600">
                    Bearing C → P = {formatBearing(bearingCtoP)} · Sum = {(angleAtBoat + angleAtCoral + angleAtPalm).toFixed(1)}°
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-5">
                <h3 className="text-base font-semibold text-slate-900">
                  Back-Bearing &amp; Parallel North Proof
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  North arrows at Boat <span className="font-mono">B</span> and Coral Island{' '}
                  <span className="font-mono">C</span> are parallel. Co-interior angles between parallel North
                  lines always add up to <span className="font-mono font-semibold text-slate-900">180°</span>:
                </p>
                <div className="mt-3 bg-white border border-slate-200 rounded-lg p-3.5 font-mono text-xs sm:text-sm tabular-nums space-y-1.5 text-slate-800">
                  {bearingBtoC <= 180 ? (
                    <>
                      <div>Co-interior angle at C = 180° − {bearingBtoC.toFixed(0)}° = {coInteriorNorth.toFixed(0)}°</div>
                      <div className="font-semibold text-sky-700">
                        Back-bearing = 360° − {coInteriorNorth.toFixed(0)}° = {formatBearing(backBearingCtoB)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>Reflex angle difference = {bearingBtoC.toFixed(0)}° − 180°</div>
                      <div className="font-semibold text-sky-700">
                        Back-bearing = {formatBearing(backBearingCtoB)}
                      </div>
                    </>
                  )}
                </div>

                {/* Three Golden Rules */}
                <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-xs font-semibold text-slate-900">1. From North</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Start at 000°</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-xs font-semibold text-slate-900">2. Clockwise</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">Turn right</div>
                  </div>
                  <div className="bg-white border border-slate-200 rounded-lg p-2.5">
                    <div className="text-xs font-semibold text-slate-900">3. 3 Digits</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">e.g. 045°</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
