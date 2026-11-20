import { useMemo, useState } from 'react';
import { degToRad, radToDeg } from '../utils/math';

type CosineMode = 'side' | 'angle';

export default function CosineRuleLab() {
  const [mode, setMode] = useState<CosineMode>('side');

  // Mode 1: Find Missing Side (SAS)
  const [sideB, setSideB] = useState(42);
  const [sideC, setSideC] = useState(56);
  const [includedA, setIncludedA] = useState(68);

  // Mode 2: Find Missing Angle (SSS)
  const [sssA, setSssA] = useState(48);
  const [sssB, setSssB] = useState(40);
  const [sssC, setSssC] = useState(55);

  // SAS Computation
  const cosA = Math.cos(degToRad(includedA));
  const aSquared = sideB * sideB + sideC * sideC - 2 * sideB * sideC * cosA;
  const sideA = Math.sqrt(Math.max(0, aSquared));
  const pythagorasVal = Math.sqrt(sideB * sideB + sideC * sideC);

  // SSS Validity & Computation
  const isValidTriangle = sssA + sssB > sssC && sssA + sssC > sssB && sssB + sssC > sssA;
  const sssCosA = isValidTriangle
    ? Math.max(-1, Math.min(1, (sssB * sssB + sssC * sssC - sssA * sssA) / (2 * sssB * sssC)))
    : 0;
  const sssCosB = isValidTriangle
    ? Math.max(-1, Math.min(1, (sssA * sssA + sssC * sssC - sssB * sssB) / (2 * sssA * sssC)))
    : 0;
  const sssAngleA = isValidTriangle ? radToDeg(Math.acos(sssCosA)) : 0;
  const sssAngleB = isValidTriangle ? radToDeg(Math.acos(sssCosB)) : 0;
  const sssAngleC = isValidTriangle ? 180 - sssAngleA - sssAngleB : 0;

  // Triangle SVG Coordinates for either mode
  const triCoords = useMemo(() => {
    const activeB = mode === 'side' ? sideB : sssB;
    const activeC = mode === 'side' ? sideC : sssC;
    const activeAngleA = mode === 'side' ? includedA : isValidTriangle ? sssAngleA : 60;

    // Place A at bottom-left-ish, B along horizontal baseline of length activeC, C at angle activeAngleA
    const maxW = 280;
    const maxH = 175;
    const rad = degToRad(activeAngleA);
    const rawCx = activeB * Math.cos(rad);
    const rawCy = activeB * Math.sin(rad);

    const minRawX = Math.min(0, rawCx);
    const maxRawX = Math.max(activeC, rawCx);
    const spanX = Math.max(10, maxRawX - minRawX);
    const spanY = Math.max(10, rawCy);

    const scale = Math.min(maxW / spanX, maxH / spanY);
    const originX = 65 + Math.max(0, -minRawX * scale);
    const originY = 225;

    return {
      ax: originX,
      ay: originY,
      bx: originX + activeC * scale,
      by: originY,
      cx: originX + rawCx * scale,
      cy: originY - rawCy * scale,
    };
  }, [mode, sideB, sideC, includedA, sssB, sssC, sssAngleA, isValidTriangle]);

  // Interactive Cosine Rule Curve Chart (a as a function of included angle A from 0° to 180°)
  const CW = 480;
  const CH = 220;
  const PAD_L = 46;
  const PAD_R = 18;
  const PAD_T = 20;
  const PAD_B = 34;
  const plotW = CW - PAD_L - PAD_R;
  const plotH = CH - PAD_T - PAD_B;
  const maxDist = sideB + sideC + 10;

  const xForAngle = (deg: number) => PAD_L + (deg / 180) * plotW;
  const yForDist = (d: number) => PAD_T + ((maxDist - d) / maxDist) * plotH;

  const curvePath = useMemo(() => {
    const pts: string[] = [];
    for (let deg = 0; deg <= 180; deg += 3) {
      const dist = Math.sqrt(Math.max(0, sideB * sideB + sideC * sideC - 2 * sideB * sideC * Math.cos(degToRad(deg))));
      pts.push(`${deg === 0 ? 'M' : 'L'} ${xForAngle(deg).toFixed(1)} ${yForDist(dist).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [sideB, sideC, maxDist]);

  return (
    <section id="cosine-rule" className="py-12 sm:py-16 border-b border-slate-200 bg-[#F4F8FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-sky-700">
              Module 04 · Two-Leg Voyages &amp; Three-Side Triangles
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              The Cosine Rule Simulator
            </h2>
            <p className="mt-2.5 text-base text-slate-600 leading-relaxed">
              Use the <strong className="font-semibold text-slate-900">Cosine Rule</strong> when you know two
              island legs and the angle between them (<span className="font-mono">SAS</span>), or when you know
              all three distances (<span className="font-mono">SSS</span>) and need to calculate the turn angles.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start" role="tablist" aria-label="Cosine rule mode">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'side'}
              onClick={() => setMode('side')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-md transition-colors min-h-[40px] whitespace-nowrap ${
                mode === 'side' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Find Side (SAS)
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
              Find Angle (SSS)
            </button>
          </div>
        </div>

        {/* Formula Reference Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">To Find Opposite Side (SAS)</div>
              <div className="mt-1 text-base sm:text-lg font-mono font-semibold text-slate-900">
                a² = b² + c² − 2bc cos A
              </div>
            </div>
            <span className="text-xs font-medium text-sky-700 shrink-0">Pythagoras + turn term</span>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-medium text-slate-500">To Find Angle A (SSS)</div>
              <div className="mt-1 text-base sm:text-lg font-mono font-semibold text-slate-900">
                cos A = (b² + c² − a²) / (2bc)
              </div>
            </div>
            <span className="text-xs font-medium text-teal-700 shrink-0">Rearranged form</span>
          </div>
        </div>

        {/* Interactive Split Workbench */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Triangle Diagram + Sliders */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-600 pb-3 mb-3 border-b border-slate-200">
              <span>{mode === 'side' ? 'Two-Leg Island Course (SAS)' : 'Three-Island Distance Triangle (SSS)'}</span>
              <span className="font-mono tabular-nums font-semibold text-sky-700">
                {mode === 'side'
                  ? `a = ${sideA.toFixed(2)} NM`
                  : isValidTriangle
                    ? `∠A = ${sssAngleA.toFixed(1)}°`
                    : 'Invalid Triangle'}
              </span>
            </div>

            {mode === 'angle' && !isValidTriangle ? (
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-6 text-center min-h-[240px] flex flex-col items-center justify-center">
                <div className="text-base font-semibold text-amber-900">
                  Triangle Inequality Not Met
                </div>
                <p className="mt-1.5 text-sm text-amber-800 max-w-md">
                  The two shorter distances must add up to more than the longest distance ({sssA}, {sssB}, {sssC}) so
                  the island paths can meet. Adjust one of the sliders below.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-sky-200 bg-[#EBF7FD] overflow-hidden">
                <svg
                  viewBox="0 0 420 265"
                  className="w-full h-auto block"
                  role="img"
                  aria-label="Cosine rule island navigation triangle showing sides a, b, c and angle A"
                >
                  <polygon
                    points={`${triCoords.ax},${triCoords.ay} ${triCoords.bx},${triCoords.by} ${triCoords.cx},${triCoords.cy}`}
                    fill="#0D9488"
                    fillOpacity="0.1"
                    stroke="#0F172A"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />

                  {/* Highlight target unknown side/angle */}
                  <line
                    x1={triCoords.bx}
                    y1={triCoords.by}
                    x2={triCoords.cx}
                    y2={triCoords.cy}
                    stroke="#EA580C"
                    strokeWidth="3.2"
                  />

                  {/* Side labels */}
                  <text
                    x={(triCoords.ax + triCoords.bx) / 2}
                    y={triCoords.ay + 20}
                    textAnchor="middle"
                    className="fill-slate-800 font-mono text-[11px] font-semibold"
                  >
                    c = {(mode === 'side' ? sideC : sssC).toFixed(1)} NM
                  </text>

                  <text
                    x={(triCoords.ax + triCoords.cx) / 2 - 12}
                    y={(triCoords.ay + triCoords.cy) / 2 - 6}
                    textAnchor="end"
                    className="fill-sky-800 font-mono text-[11px] font-semibold"
                  >
                    b = {(mode === 'side' ? sideB : sssB).toFixed(1)}
                  </text>

                  <text
                    x={(triCoords.bx + triCoords.cx) / 2 + 12}
                    y={(triCoords.by + triCoords.cy) / 2 - 6}
                    textAnchor="start"
                    className="fill-orange-700 font-mono text-[11px] font-bold"
                  >
                    a = {(mode === 'side' ? sideA : sssA).toFixed(1)}
                  </text>

                  {/* Vertices */}
                  <circle cx={triCoords.ax} cy={triCoords.ay} r="6.5" fill="#0284C7" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x={triCoords.ax - 8} y={triCoords.ay + 18} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Port A ({(mode === 'side' ? includedA : sssAngleA).toFixed(1)}°)
                  </text>

                  <circle cx={triCoords.bx} cy={triCoords.by} r="6.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x={triCoords.bx + 8} y={triCoords.by + 18} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Island B
                  </text>

                  <circle cx={triCoords.cx} cy={triCoords.cy} r="6.5" fill="#10B981" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x={triCoords.cx} y={triCoords.cy - 11} textAnchor="middle" className="fill-slate-900 font-sans text-[11px] font-semibold">
                    Island C
                  </text>
                </svg>
              </div>
            )}

            {/* Sliders */}
            {mode === 'side' ? (
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="cos-b" className="font-medium text-slate-700">Leg b (A → C)</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{sideB} NM</span>
                  </div>
                  <input
                    id="cos-b"
                    type="range"
                    min={15}
                    max={80}
                    value={sideB}
                    onChange={(e) => setSideB(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="cos-c" className="font-medium text-slate-700">Leg c (A → B)</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{sideC} NM</span>
                  </div>
                  <input
                    id="cos-c"
                    type="range"
                    min={15}
                    max={80}
                    value={sideC}
                    onChange={(e) => setSideC(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="cos-angle" className="font-medium text-slate-700">Included Angle A</label>
                    <span className="font-mono tabular-nums font-semibold text-orange-700">{includedA}°</span>
                  </div>
                  <input
                    id="cos-angle"
                    type="range"
                    min={10}
                    max={170}
                    value={includedA}
                    onChange={(e) => setIncludedA(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sss-a" className="font-medium text-slate-700">Side a (opposite ∠A)</label>
                    <span className="font-mono tabular-nums font-semibold text-orange-700">{sssA} NM</span>
                  </div>
                  <input
                    id="sss-a"
                    type="range"
                    min={20}
                    max={90}
                    value={sssA}
                    onChange={(e) => setSssA(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sss-b" className="font-medium text-slate-700">Side b (A ↔ C)</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{sssB} NM</span>
                  </div>
                  <input
                    id="sss-b"
                    type="range"
                    min={20}
                    max={90}
                    value={sssB}
                    onChange={(e) => setSssB(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <label htmlFor="sss-c" className="font-medium text-slate-700">Side c (A ↔ B)</label>
                    <span className="font-mono tabular-nums font-semibold text-sky-700">{sssC} NM</span>
                  </div>
                  <input
                    id="sss-c"
                    type="range"
                    min={20}
                    max={90}
                    value={sssC}
                    onChange={(e) => setSssC(Number(e.target.value))}
                    className="trig-slider"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right: Step-by-Step Solution & Interactive Cosine Rule Curve Chart */}
          <div className="lg:col-span-6 space-y-5">
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h3 className="text-base font-semibold text-slate-900">Step-by-Step Calculation</h3>
              {mode === 'side' ? (
                <div className="mt-3 space-y-2 font-mono text-xs sm:text-sm tabular-nums text-slate-800 bg-[#F4F8FB] border border-slate-200 rounded-lg p-4">
                  <div>a² = {sideB}² + {sideC}² − 2({sideB})({sideC}) cos({includedA}°)</div>
                  <div>
                    a² = {sideB * sideB + sideC * sideC} − ({(2 * sideB * sideC * cosA).toFixed(1)}) ={' '}
                    {aSquared.toFixed(1)}
                  </div>
                  <div className="pt-2 border-t border-slate-200 font-bold text-orange-700">
                    a = √{aSquared.toFixed(1)} = {sideA.toFixed(2)} NM
                  </div>
                  <div className="text-xs text-slate-600">
                    {includedA === 90
                      ? 'At 90°, cos(90°) = 0, so this simplifies straight to Pythagoras!'
                      : includedA > 90
                        ? 'Because A > 90°, cos(A) is negative, adding to b² + c².'
                        : 'Because A < 90°, cos(A) is positive, subtracting from b² + c².'}
                  </div>
                </div>
              ) : isValidTriangle ? (
                <div className="mt-3 space-y-2 font-mono text-xs sm:text-sm tabular-nums text-slate-800 bg-[#F4F8FB] border border-slate-200 rounded-lg p-4">
                  <div>
                    cos A = ({sssB}² + {sssC}² − {sssA}²) / (2 × {sssB} × {sssC})
                  </div>
                  <div>
                    cos A = {sssB * sssB + sssC * sssC - sssA * sssA} / {2 * sssB * sssC} = {sssCosA.toFixed(4)}
                  </div>
                  <div className="pt-2 border-t border-slate-200 font-bold text-sky-700">
                    ∠A = {sssAngleA.toFixed(1)}° · ∠B = {sssAngleB.toFixed(1)}° · ∠C = {sssAngleC.toFixed(1)}°
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-amber-800">
                  Adjust sides so the sum of any two sides exceeds the third side.
                </p>
              )}
            </div>

            {/* Interactive Cosine Rule Curve Chart */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-slate-900">
                  Distance a vs. Included Angle A (0°–180°)
                </h3>
                <span className="font-mono text-xs tabular-nums text-teal-700 font-semibold">
                  90° Pythagoras = {pythagorasVal.toFixed(1)} NM
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Watch how opening the angle A between legs b = {sideB} and c = {sideC} stretches the direct distance a.
              </p>

              <div className="mt-3 overflow-x-auto">
                <svg
                  viewBox={`0 0 ${CW} ${CH}`}
                  className="w-full min-w-[340px] h-auto block"
                  role="img"
                  aria-label="Chart of opposite distance a versus included angle A from 0 to 180 degrees"
                >
                  {/* Axes */}
                  <line x1={PAD_L} y1={PAD_T} x2={PAD_L} y2={CH - PAD_B} stroke="#94A3B8" strokeWidth="1.2" />
                  <line x1={PAD_L} y1={CH - PAD_B} x2={CW - PAD_R} y2={CH - PAD_B} stroke="#94A3B8" strokeWidth="1.2" />

                  {/* Vertical 90° Pythagoras Landmark */}
                  <line
                    x1={xForAngle(90)}
                    y1={PAD_T}
                    x2={xForAngle(90)}
                    y2={CH - PAD_B}
                    stroke="#0D9488"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                  />
                  <text x={xForAngle(90)} y={PAD_T + 10} textAnchor="middle" className="fill-teal-800 font-mono text-[10px] font-semibold">
                    90° (Pythagoras)
                  </text>

                  {/* X ticks */}
                  {[0, 45, 90, 135, 180].map((deg) => (
                    <text
                      key={deg}
                      x={xForAngle(deg)}
                      y={CH - 12}
                      textAnchor="middle"
                      className="fill-slate-600 font-mono text-[10px]"
                    >
                      {deg}°
                    </text>
                  ))}

                  {/* Curve */}
                  <path d={curvePath} fill="none" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />

                  {/* Current SAS Marker */}
                  {mode === 'side' && (
                    <g>
                      <circle
                        cx={xForAngle(includedA)}
                        cy={yForDist(sideA)}
                        r="6"
                        fill="#EA580C"
                        stroke="#FFFFFF"
                        strokeWidth="2"
                      />
                      <text
                        x={Math.min(CW - 60, Math.max(PAD_L + 45, xForAngle(includedA)))}
                        y={Math.max(PAD_T + 18, yForDist(sideA) - 10)}
                        textAnchor="middle"
                        className="fill-orange-700 font-mono text-[10px] font-bold"
                      >
                        ({includedA}°, {sideA.toFixed(1)} NM)
                      </text>
                    </g>
                  )}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
