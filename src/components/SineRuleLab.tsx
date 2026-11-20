import { useState } from 'react';
import { degToRad, radToDeg } from '../utils/math';

type SineMode = 'side' | 'angle';

export default function SineRuleLab() {
  const [mode, setMode] = useState<SineMode>('side');

  // Mode 1: Find Missing Side (ASA)
  const [angleA, setAngleA] = useState(48);
  const [angleB, setAngleB] = useState(62);
  const [sideC, setSideC] = useState(54); // Baseline A <-> B in NM

  // Mode 2: Find Missing Angle (SSA)
  const [ssaAngleA, setSsaAngleA] = useState(34);
  const [ssaSideB, setSsaSideB] = useState(55);
  const [ssaSideA, setSsaSideA] = useState(38);

  // Calculations for Mode 1 (ASA)
  const safeAngleB = Math.min(angleB, 165 - angleA);
  const angleC = 180 - angleA - safeAngleB;
  const sinA = Math.sin(degToRad(angleA));
  const sinB = Math.sin(degToRad(safeAngleB));
  const sinC = Math.sin(degToRad(angleC));
  const ratio2R = sideC / sinC;
  const sideA = ratio2R * sinA;
  const sideB = ratio2R * sinB;

  // Coordinates for ASA SVG diagram (viewBox 420x270)
  // Baseline AB along bottom: A on left, B on right
  const asaCoordinates = (() => {
    const basePx = 270;
    const scale = basePx / sideC;
    const ax = 75;
    const ay = 225;
    const bx = ax + basePx;
    const by = ay;
    // C is at distance sideB * scale from A at angleA above AB
    const cx = ax + sideB * scale * Math.cos(degToRad(angleA));
    const cy = ay - sideB * scale * Math.sin(degToRad(angleA));
    // Clamp view fit gently by normalizing if cy goes too high
    const minY = Math.min(ay, cy);
    if (minY < 32) {
      const shrink = (ay - 36) / (ay - cy);
      const adjScale = scale * shrink;
      const newBasePx = sideC * adjScale;
      const startX = (420 - newBasePx) / 2;
      return {
        ax: startX,
        ay,
        bx: startX + newBasePx,
        by,
        cx: startX + sideB * adjScale * Math.cos(degToRad(angleA)),
        cy: ay - sideB * adjScale * Math.sin(degToRad(angleA)),
      };
    }
    return { ax, ay, bx, by, cx, cy };
  })();

  // Calculations for Mode 2 (SSA & Ambiguous Case)
  const ssaSinA = Math.sin(degToRad(ssaAngleA));
  const altitudeH = ssaSideB * ssaSinA;
  const sinB_ssa = (ssaSideB * ssaSinA) / ssaSideA;

  let ssaCaseCount: 0 | 1 | 2 = 0;
  let bAcute = 0;
  let bObtuse = 0;
  if (ssaSideA < altitudeH - 0.05) {
    ssaCaseCount = 0;
  } else if (Math.abs(ssaSideA - altitudeH) <= 0.05 || ssaSideA >= ssaSideB) {
    ssaCaseCount = 1;
    bAcute = radToDeg(Math.asin(Math.min(1, sinB_ssa)));
  } else {
    ssaCaseCount = 2;
    bAcute = radToDeg(Math.asin(Math.min(1, sinB_ssa)));
    bObtuse = 180 - bAcute;
  }

  // SSA SVG Diagram (viewBox 420x270)
  const ssaGeometry = (() => {
    const scale = 2.6;
    const ax = 58;
    const ay = 225;
    const cx = ax + ssaSideB * scale * Math.cos(degToRad(ssaAngleA));
    const cy = ay - ssaSideB * scale * Math.sin(degToRad(ssaAngleA));
    const rPx = ssaSideA * scale;
    // Intersection points on horizontal ray y = ay
    const dxSq = rPx * rPx - (ay - cy) * (ay - cy);
    const dx = dxSq > 0 ? Math.sqrt(dxSq) : 0;
    const b1x = cx + dx;
    const b2x = cx - dx;
    return { ax, ay, cx, cy, rPx, b1x, b2x };
  })();

  return (
    <section id="sine-rule" className="py-12 sm:py-16 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-sky-700">
              Module 03 · Non-Right Triangles &amp; Island Triangulation
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              The Sine Rule Simulator
            </h2>
            <p className="mt-2.5 text-base text-slate-600 leading-relaxed">
              When a sea triangle has no <span className="font-mono">90°</span> angle, use the{' '}
              <strong className="font-semibold text-slate-900">Sine Rule</strong> whenever you know an angle and
              its opposite side. Two island lookouts can locate any boat offshore using angles alone.
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start" role="tablist" aria-label="Sine rule mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'side'}
              onClick={() => setMode('side')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors min-h-[40px] whitespace-nowrap ${
                mode === 'side' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Find Side (ASA)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'angle'}
              onClick={() => setMode('angle')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors min-h-[40px] whitespace-nowrap ${
                mode === 'angle' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Find Angle (Ambiguous Case)
            </button>
          </div>
        </div>

        {/* Formula Banner */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">To Find a Missing Side</div>
              <div className="mt-1 text-base sm:text-lg font-mono font-semibold text-slate-900">
                a / sin A = b / sin B = c / sin C
              </div>
            </div>
            <span className="text-xs font-medium text-sky-700 shrink-0">Side on top</span>
          </div>
          <div className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">To Find a Missing Angle</div>
              <div className="mt-1 text-base sm:text-lg font-mono font-semibold text-slate-900">
                sin A / a = sin B / b = sin C / c
              </div>
            </div>
            <span className="text-xs font-medium text-teal-700 shrink-0">Sine on top</span>
          </div>
        </div>

        {mode === 'side' ? (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Stage: Triangulation SVG */}
            <div className="lg:col-span-6 bg-[#F4F8FB] border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-3 mb-3 border-b border-slate-200">
                <span>Two Islands (A &amp; B) Spotting Boat (C)</span>
                <span className="font-mono tabular-nums text-sky-700 font-semibold">
                  ∠C = {angleC}°
                </span>
              </div>

              <div className="rounded-lg border border-sky-200 bg-[#EBF7FD] overflow-hidden">
                <svg
                  viewBox="0 0 420 270"
                  className="w-full h-auto block"
                  role="img"
                  aria-label="Sine rule island triangulation triangle with vertices A, B, and C"
                >
                  {/* Triangle */}
                  <polygon
                    points={`${asaCoordinates.ax},${asaCoordinates.ay} ${asaCoordinates.bx},${asaCoordinates.by} ${asaCoordinates.cx},${asaCoordinates.cy}`}
                    fill="#0284C7"
                    fillOpacity="0.1"
                    stroke="#0284C7"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />

                  {/* Baseline c label */}
                  <text
                    x={(asaCoordinates.ax + asaCoordinates.bx) / 2}
                    y={asaCoordinates.ay + 20}
                    textAnchor="middle"
                    className="fill-slate-900 font-mono text-[11px] font-semibold"
                  >
                    c = {sideC.toFixed(1)} NM
                  </text>

                  {/* Side b (A to C) label */}
                  <text
                    x={(asaCoordinates.ax + asaCoordinates.cx) / 2 - 14}
                    y={(asaCoordinates.ay + asaCoordinates.cy) / 2 - 6}
                    textAnchor="end"
                    className="fill-teal-800 font-mono text-[11px] font-semibold"
                  >
                    b = {sideB.toFixed(1)}
                  </text>

                  {/* Side a (B to C) label */}
                  <text
                    x={(asaCoordinates.bx + asaCoordinates.cx) / 2 + 14}
                    y={(asaCoordinates.by + asaCoordinates.cy) / 2 - 6}
                    textAnchor="start"
                    className="fill-orange-700 font-mono text-[11px] font-semibold"
                  >
                    a = {sideA.toFixed(1)}
                  </text>

                  {/* Vertex Markers */}
                  <circle cx={asaCoordinates.ax} cy={asaCoordinates.ay} r="7" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
                  <text x={asaCoordinates.ax - 12} y={asaCoordinates.ay + 18} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Island A ({angleA}°)
                  </text>

                  <circle cx={asaCoordinates.bx} cy={asaCoordinates.by} r="7" fill="#10B981" stroke="#0F172A" strokeWidth="1.5" />
                  <text x={asaCoordinates.bx + 12} y={asaCoordinates.by + 18} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Island B ({safeAngleB}°)
                  </text>

                  <circle cx={asaCoordinates.cx} cy={asaCoordinates.cy} r="6.5" fill="#EA580C" stroke="#FFFFFF" strokeWidth="2" />
                  <text x={asaCoordinates.cx} y={asaCoordinates.cy - 12} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Boat C ({angleC}°)
                  </text>
                </svg>
              </div>

              {/* Controls */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sine-angle-a" className="font-medium text-slate-700">Angle at Island A</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{angleA}°</span>
                  </div>
                  <input
                    id="sine-angle-a"
                    type="range"
                    min={20}
                    max={85}
                    value={angleA}
                    onChange={(e) => setAngleA(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sine-angle-b" className="font-medium text-slate-700">Angle at Island B</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{safeAngleB}°</span>
                  </div>
                  <input
                    id="sine-angle-b"
                    type="range"
                    min={20}
                    max={Math.min(85, 165 - angleA)}
                    value={safeAngleB}
                    onChange={(e) => setAngleB(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sine-side-c" className="font-medium text-slate-700">Baseline Distance c (A ↔ B)</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{sideC} NM</span>
                  </div>
                  <input
                    id="sine-side-c"
                    type="range"
                    min={20}
                    max={80}
                    value={sideC}
                    onChange={(e) => setSideC(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
              </div>
            </div>

            {/* Right Step-by-Step Working + Interactive Ratio Equivalence Chart */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-5">
                <h3 className="text-base font-semibold text-slate-900">Step-by-Step Solution</h3>
                <div className="mt-3 space-y-2.5 font-mono text-xs sm:text-sm tabular-nums text-slate-800 bg-white border border-slate-200 rounded-lg p-4">
                  <div>
                    <span className="text-slate-500">1. Angle sum:</span> ∠C = 180° − {angleA}° − {safeAngleB}° ={' '}
                    <strong className="text-slate-900">{angleC}°</strong>
                  </div>
                  <div>
                    <span className="text-slate-500">2. Known ratio:</span> c / sin C = {sideC} / sin({angleC}°) ={' '}
                    <strong className="text-sky-700">{ratio2R.toFixed(2)}</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-100 text-orange-700 font-semibold">
                    3. Side a (B ↔ C): a = {ratio2R.toFixed(2)} × sin({angleA}°) = {sideA.toFixed(2)} NM
                  </div>
                  <div className="text-teal-700 font-semibold">
                    4. Side b (A ↔ C): b = {ratio2R.toFixed(2)} × sin({safeAngleB}°) = {sideB.toFixed(2)} NM
                  </div>
                </div>
              </div>

              {/* Interactive Ratio Equivalence Chart */}
              <div className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">
                    Constant Ratio Chart (a/sin A = b/sin B = c/sin C)
                  </h3>
                  <span className="font-mono text-xs tabular-nums text-sky-700 font-semibold">
                    2R = {ratio2R.toFixed(2)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-600">
                  Every side divided by the sine of its opposite angle equals the exact same circumcircle diameter.
                </p>

                <div className="mt-4 space-y-3">
                  {[
                    { label: 'a / sin A', num: sideA, deg: angleA, color: 'bg-orange-500' },
                    { label: 'b / sin B', num: sideB, deg: safeAngleB, color: 'bg-teal-600' },
                    { label: 'c / sin C', num: sideC, deg: angleC, color: 'bg-sky-600' },
                  ].map((item) => {
                    const ratio = item.num / Math.sin(degToRad(item.deg));
                    const widthPct = Math.min(100, (ratio / 140) * 100);
                    return (
                      <div key={item.label} className="bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex items-center justify-between text-xs font-mono tabular-nums mb-1.5">
                          <span className="font-semibold text-slate-800">
                            {item.label} = {item.num.toFixed(1)} / sin({item.deg}°)
                          </span>
                          <span className="font-bold text-slate-900">{ratio.toFixed(2)} NM</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${item.color} rounded-full transition-all duration-150`}
                            style={{ width: `${widthPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mode 2: Find Angle (SSA & Ambiguous Case) */
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 bg-[#F4F8FB] border border-slate-200 rounded-xl p-4 sm:p-5">
              <div className="flex items-center justify-between text-xs text-slate-600 pb-3 mb-3 border-b border-slate-200">
                <span>Ambiguous Case Visualizer (SSA)</span>
                <span className="font-mono tabular-nums font-semibold text-sky-700">
                  {ssaCaseCount === 0
                    ? '0 Triangles (Too Short)'
                    : ssaCaseCount === 1
                      ? '1 Unique Triangle'
                      : '2 Valid Triangles!'}
                </span>
              </div>

              <div className="rounded-lg border border-sky-200 bg-[#EBF7FD] overflow-hidden">
                <svg
                  viewBox="0 0 420 270"
                  className="w-full h-auto block"
                  role="img"
                  aria-label="Sine rule ambiguous case diagram showing how side a swings across the baseline"
                >
                  {/* Infinite horizontal baseline ray from A */}
                  <line
                    x1={ssaGeometry.ax}
                    y1={ssaGeometry.ay}
                    x2={400}
                    y2={ssaGeometry.ay}
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="5 4"
                  />

                  {/* Vertical altitude h */}
                  <line
                    x1={ssaGeometry.cx}
                    y1={ssaGeometry.cy}
                    x2={ssaGeometry.cx}
                    y2={ssaGeometry.ay}
                    stroke="#64748B"
                    strokeWidth="1.2"
                    strokeDasharray="3 3"
                  />
                  <text
                    x={ssaGeometry.cx + 6}
                    y={(ssaGeometry.cy + ssaGeometry.ay) / 2}
                    className="fill-slate-600 font-mono text-[10px]"
                  >
                    h={altitudeH.toFixed(1)}
                  </text>

                  {/* Swinging circle arc of radius a centered at C */}
                  <circle
                    cx={ssaGeometry.cx}
                    cy={ssaGeometry.cy}
                    r={ssaGeometry.rPx}
                    fill="none"
                    stroke="#EA580C"
                    strokeOpacity="0.35"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />

                  {/* Side b (A to C) */}
                  <line
                    x1={ssaGeometry.ax}
                    y1={ssaGeometry.ay}
                    x2={ssaGeometry.cx}
                    y2={ssaGeometry.cy}
                    stroke="#0284C7"
                    strokeWidth="2.8"
                  />

                  {/* Valid triangle solution(s) */}
                  {ssaCaseCount >= 1 && ssaGeometry.b1x <= 405 && (
                    <>
                      <line
                        x1={ssaGeometry.cx}
                        y1={ssaGeometry.cy}
                        x2={ssaGeometry.b1x}
                        y2={ssaGeometry.ay}
                        stroke="#0D9488"
                        strokeWidth="2.6"
                      />
                      <circle cx={ssaGeometry.b1x} cy={ssaGeometry.ay} r="6" fill="#0D9488" stroke="#FFFFFF" strokeWidth="1.5" />
                      <text x={ssaGeometry.b1x} y={ssaGeometry.ay + 18} textAnchor="middle" className="fill-teal-800 font-mono text-[10px] font-semibold">
                        B₁ ({bAcute.toFixed(1)}°)
                      </text>
                    </>
                  )}

                  {ssaCaseCount === 2 && ssaGeometry.b2x > ssaGeometry.ax + 8 && (
                    <>
                      <line
                        x1={ssaGeometry.cx}
                        y1={ssaGeometry.cy}
                        x2={ssaGeometry.b2x}
                        y2={ssaGeometry.ay}
                        stroke="#EA580C"
                        strokeWidth="2.6"
                      />
                      <circle cx={ssaGeometry.b2x} cy={ssaGeometry.ay} r="6" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" />
                      <text x={ssaGeometry.b2x} y={ssaGeometry.ay + 18} textAnchor="middle" className="fill-orange-700 font-mono text-[10px] font-semibold">
                        B₂ ({bObtuse.toFixed(1)}°)
                      </text>
                    </>
                  )}

                  {/* Vertex A & C */}
                  <circle cx={ssaGeometry.ax} cy={ssaGeometry.ay} r="6.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x={ssaGeometry.ax} y={ssaGeometry.ay + 18} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    A ({ssaAngleA}°)
                  </text>

                  <circle cx={ssaGeometry.cx} cy={ssaGeometry.cy} r="6.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x={ssaGeometry.cx} y={ssaGeometry.cy - 11} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    C (b={ssaSideB})
                  </text>
                </svg>
              </div>

              {/* SSA Sliders */}
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="ssa-angle-a" className="font-medium text-slate-700">Known Angle A</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{ssaAngleA}°</span>
                  </div>
                  <input
                    id="ssa-angle-a"
                    type="range"
                    min={15}
                    max={70}
                    value={ssaAngleA}
                    onChange={(e) => setSsaAngleA(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="ssa-side-b" className="font-medium text-slate-700">Adjacent Side b</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{ssaSideB} NM</span>
                  </div>
                  <input
                    id="ssa-side-b"
                    type="range"
                    min={30}
                    max={70}
                    value={ssaSideB}
                    onChange={(e) => setSsaSideB(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="ssa-side-a" className="font-medium text-slate-700">Opposite Side a (Swinging Radius)</label>
                    <span className="font-mono tabular-nums font-semibold text-orange-700">{ssaSideA} NM</span>
                  </div>
                  <input
                    id="ssa-side-a"
                    type="range"
                    min={12}
                    max={80}
                    value={ssaSideA}
                    onChange={(e) => setSsaSideA(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
              </div>
            </div>

            {/* Right Explanation for SSA */}
            <div className="lg:col-span-6 space-y-5">
              <div className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-5">
                <h3 className="text-base font-semibold text-slate-900">
                  Why Can Two Angles Be Possible?
                </h3>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  Because <span className="font-mono font-semibold text-slate-900">sin(B) = sin(180° − B)</span>,
                  solving for an angle with the Sine Rule can produce both an acute angle <span className="font-mono">B₁</span>{' '}
                  and an obtuse angle <span className="font-mono">B₂</span> whenever{' '}
                  <span className="font-mono">b sin A &lt; a &lt; b</span>.
                </p>

                <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4 font-mono text-xs sm:text-sm tabular-nums space-y-2">
                  <div>Minimum height: h = b · sin A = {ssaSideB} × sin({ssaAngleA}°) = {altitudeH.toFixed(2)} NM</div>
                  <div>sin B = (b · sin A) / a = {sinB_ssa.toFixed(4)}</div>
                  {ssaCaseCount === 0 && (
                    <div className="pt-2 border-t border-slate-100 text-red-700 font-semibold">
                      No solution: sin B &gt; 1 (side a = {ssaSideA} &lt; height {altitudeH.toFixed(1)})
                    </div>
                  )}
                  {ssaCaseCount === 1 && (
                    <div className="pt-2 border-t border-slate-100 text-teal-700 font-semibold">
                      1 solution: B₁ = {bAcute.toFixed(1)}° (since a ≥ b, obtuse B₂ exceeds 180° − A)
                    </div>
                  )}
                  {ssaCaseCount === 2 && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="text-teal-700 font-semibold">Solution 1 (Acute): B₁ = {bAcute.toFixed(1)}°</div>
                      <div className="text-orange-700 font-semibold">Solution 2 (Obtuse): B₂ = 180° − {bAcute.toFixed(1)}° = {bObtuse.toFixed(1)}°</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
