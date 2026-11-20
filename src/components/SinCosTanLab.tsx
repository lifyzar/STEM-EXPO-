import { useMemo, useState } from 'react';
import { degToRad } from '../utils/math';

type RatioFocus = 'sin' | 'cos' | 'tan';

const SPECIAL_ANGLES = [0, 30, 45, 60, 90, 120, 180, 270, 360];

export default function SinCosTanLab() {
  // Part A: Right-Angled Navigation Triangle
  const [theta, setTheta] = useState(37);
  const [hypotenuse, setHypotenuse] = useState(50);
  const [ratioFocus, setRatioFocus] = useState<RatioFocus>('sin');

  // Part B: 0-360 Interactive Trig Curves Chart
  const [chartAngle, setChartAngle] = useState(45);
  const [showSin, setShowSin] = useState(true);
  const [showCos, setShowCos] = useState(true);
  const [showTan, setShowTan] = useState(true);

  const rad = degToRad(theta);
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = Math.tan(rad);

  const opposite = hypotenuse * sinVal; // Eastward leg
  const adjacent = hypotenuse * cosVal; // Northward leg

  // SVG triangle scaling to fit cleanly in 380x260 viewBox
  const maxBoxW = 240;
  const maxBoxH = 175;
  const scalePx = Math.min(maxBoxW / Math.max(opposite, 1), maxBoxH / Math.max(adjacent, 1));
  const oppPx = Math.max(24, opposite * scalePx);
  const adjPx = Math.max(24, adjacent * scalePx);
  const originX = 76;
  const originY = 222;
  const northCornerY = originY - adjPx;
  const lighthouseX = originX + oppPx;
  const lighthouseY = northCornerY;

  // Interactive 0°-360° Chart Geometry
  const CW = 660;
  const CH = 300;
  const PAD_L = 52;
  const PAD_R = 24;
  const PAD_T = 24;
  const PAD_B = 38;
  const plotW = CW - PAD_L - PAD_R;
  const plotH = CH - PAD_T - PAD_B;
  const yMin = -2.2;
  const yMax = 2.2;

  const xForDeg = (d: number) => PAD_L + (d / 360) * plotW;
  const yForVal = (v: number) => PAD_T + ((yMax - v) / (yMax - yMin)) * plotH;

  const sinPath = useMemo(() => {
    const pts: string[] = [];
    for (let d = 0; d <= 360; d += 2) {
      const y = yForVal(Math.sin(degToRad(d)));
      pts.push(`${d === 0 ? 'M' : 'L'} ${xForDeg(d).toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const cosPath = useMemo(() => {
    const pts: string[] = [];
    for (let d = 0; d <= 360; d += 2) {
      const y = yForVal(Math.cos(degToRad(d)));
      pts.push(`${d === 0 ? 'M' : 'L'} ${xForDeg(d).toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  // Split tan curve cleanly across asymptotes at 90° and 270°
  const tanSegments = useMemo(() => {
    const ranges: [number, number][] = [
      [0, 86],
      [94, 266],
      [274, 360],
    ];
    return ranges.map(([start, end]) => {
      const pts: string[] = [];
      for (let d = start; d <= end; d += 1) {
        const val = Math.tan(degToRad(d));
        const clamped = Math.max(yMin, Math.min(yMax, val));
        pts.push(`${d === start ? 'M' : 'L'} ${xForDeg(d).toFixed(1)} ${yForVal(clamped).toFixed(1)}`);
      }
      return pts.join(' ');
    });
  }, []);

  const chartRad = degToRad(chartAngle);
  const chartSin = Math.sin(chartRad);
  const chartCos = Math.cos(chartRad);
  const isTanAsymptote = chartAngle === 90 || chartAngle === 270;
  const chartTan = isTanAsymptote ? NaN : Math.tan(chartRad);

  const quadrantText =
    chartAngle < 90
      ? 'Quadrant 1 (0°–90°): All ratios positive (All)'
      : chartAngle < 180
        ? 'Quadrant 2 (90°–180°): Only Sine positive (Sin)'
        : chartAngle < 270
          ? 'Quadrant 3 (180°–270°): Only Tangent positive (Tan)'
          : 'Quadrant 4 (270°–360°): Only Cosine positive (Cos)';

  return (
    <section id="sin-cos-tan" className="py-12 sm:py-16 border-b border-slate-200 bg-[#F4F8FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-sky-700">
            Module 02 · Right-Angled Trigonometry &amp; Wave Charts
          </p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Sin, Cos &amp; Tan in Navigation
          </h2>
          <p className="mt-2.5 text-base text-slate-600 leading-relaxed">
            Every straight boat course forms a right-angled triangle with North and East axes. Identify the{' '}
            <strong className="font-semibold text-slate-900">Hypotenuse (H)</strong>,{' '}
            <strong className="font-semibold text-slate-900">Opposite (O)</strong>, and{' '}
            <strong className="font-semibold text-slate-900">Adjacent (A)</strong> sides relative to the heading
            angle <span className="font-mono">θ</span> using <span className="font-mono font-semibold">SOH CAH TOA</span>.
          </p>
        </div>

        {/* Part A: Right-Angled Triangle Explorer */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive Triangle Stage */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-4 sm:p-5">
            <div className="flex items-center justify-between text-xs text-slate-500 pb-3 mb-3 border-b border-slate-200">
              <span>Right-Angled Navigation Triangle</span>
              <span className="font-mono tabular-nums text-sky-700 font-medium">
                θ = {theta}° · H = {hypotenuse} NM
              </span>
            </div>

            <div className="rounded-lg border border-sky-100 bg-[#F8FCFF] overflow-hidden">
              <svg
                viewBox="0 0 380 260"
                className="w-full h-auto block"
                role="img"
                aria-label="Right-angled triangle showing Adjacent North leg, Opposite East leg, and Hypotenuse boat course"
              >
                {/* North reference dashed line */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={originX}
                  y2={18}
                  stroke="#94A3B8"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                />
                <text x={originX} y={13} textAnchor="middle" className="fill-slate-600 font-mono text-[10px] font-bold">
                  N (000°)
                </text>

                {/* Filled Triangle */}
                <polygon
                  points={`${originX},${originY} ${originX},${northCornerY} ${lighthouseX},${lighthouseY}`}
                  fill="#0284C7"
                  fillOpacity="0.06"
                />

                {/* Right-angle square marker at North corner */}
                <rect
                  x={originX}
                  y={northCornerY}
                  width="12"
                  height="12"
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.4"
                />

                {/* Adjacent Side (North) */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={originX}
                  y2={northCornerY}
                  stroke={ratioFocus === 'cos' || ratioFocus === 'tan' ? '#0D9488' : '#94A3B8'}
                  strokeWidth={ratioFocus === 'cos' || ratioFocus === 'tan' ? 4 : 2.2}
                  strokeLinecap="round"
                />
                <text
                  x={originX - 10}
                  y={(originY + northCornerY) / 2}
                  textAnchor="end"
                  className="fill-teal-800 font-mono text-[11px] font-semibold"
                >
                  A = {adjacent.toFixed(1)}
                </text>

                {/* Opposite Side (East) */}
                <line
                  x1={originX}
                  y1={northCornerY}
                  x2={lighthouseX}
                  y2={lighthouseY}
                  stroke={ratioFocus === 'sin' || ratioFocus === 'tan' ? '#EA580C' : '#94A3B8'}
                  strokeWidth={ratioFocus === 'sin' || ratioFocus === 'tan' ? 4 : 2.2}
                  strokeLinecap="round"
                />
                <text
                  x={(originX + lighthouseX) / 2}
                  y={northCornerY - 10}
                  textAnchor="middle"
                  className="fill-orange-700 font-mono text-[11px] font-semibold"
                >
                  O = {opposite.toFixed(1)}
                </text>

                {/* Hypotenuse (Boat Course) */}
                <line
                  x1={originX}
                  y1={originY}
                  x2={lighthouseX}
                  y2={lighthouseY}
                  stroke={ratioFocus === 'sin' || ratioFocus === 'cos' ? '#0284C7' : '#94A3B8'}
                  strokeWidth={ratioFocus === 'sin' || ratioFocus === 'cos' ? 4 : 2.2}
                  strokeLinecap="round"
                />

                {/* Angle θ arc at Boat */}
                {(() => {
                  const r = 34;
                  const ax = originX + r * Math.sin(rad);
                  const ay = originY - r * Math.cos(rad);
                  const lx = originX + 50 * Math.sin(rad / 2);
                  const ly = originY - 50 * Math.cos(rad / 2);
                  return (
                    <>
                      <path
                        d={`M ${originX} ${originY - r} A ${r} ${r} 0 0 1 ${ax.toFixed(1)} ${ay.toFixed(1)}`}
                        fill="none"
                        stroke="#0F172A"
                        strokeWidth="2"
                      />
                      <text x={lx} y={ly} textAnchor="middle" className="fill-slate-900 font-mono text-[11px] font-bold">
                        {theta}°
                      </text>
                    </>
                  );
                })()}

                {/* Hypotenuse Label */}
                <text
                  x={(originX + lighthouseX) / 2 + 16}
                  y={(originY + lighthouseY) / 2 + 16}
                  className="fill-sky-800 font-mono text-[11px] font-semibold"
                >
                  H = {hypotenuse} NM
                </text>

                {/* Boat & Lighthouse Markers */}
                <circle cx={originX} cy={originY} r="5.5" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
                <text x={originX} y={originY + 18} textAnchor="middle" className="fill-slate-800 font-sans text-[11px] font-semibold">
                  Boat
                </text>

                <circle cx={lighthouseX} cy={lighthouseY} r="6.5" fill="#F59E0B" stroke="#0F172A" strokeWidth="1.5" />
                <text x={lighthouseX + 8} y={lighthouseY + 18} textAnchor="middle" className="fill-slate-800 font-sans text-[11px] font-semibold">
                  Island
                </text>
              </svg>
            </div>

            {/* Sliders */}
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between text-sm">
                  <label htmlFor="trig-angle" className="font-medium text-slate-700">
                    Heading Angle (θ)
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-sky-700">{theta}°</span>
                </div>
                <input
                  id="trig-angle"
                  type="range"
                  min={5}
                  max={85}
                  value={theta}
                  onChange={(e) => setTheta(Number(e.target.value))}
                  className="trig-slider"
                />
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <label htmlFor="trig-hyp" className="font-medium text-slate-700">
                    Hypotenuse Distance (H)
                  </label>
                  <span className="font-mono tabular-nums font-semibold text-sky-700">{hypotenuse} NM</span>
                </div>
                <input
                  id="trig-hyp"
                  type="range"
                  min={10}
                  max={100}
                  value={hypotenuse}
                  onChange={(e) => setHypotenuse(Number(e.target.value))}
                  className="trig-slider"
                />
              </div>
            </div>
          </div>

          {/* Right Explanation & SOH CAH TOA Cards */}
          <div className="lg:col-span-6 space-y-4">
            {/* Segmented Control for Ratio Highlight */}
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-slate-900">Select Ratio to Inspect</h3>
                <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg" role="tablist" aria-label="Trigonometric ratio selector">
                  {(['sin', 'cos', 'tan'] as RatioFocus[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      role="tab"
                      aria-selected={ratioFocus === r}
                      onClick={() => setRatioFocus(r)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors min-h-[36px] whitespace-nowrap ${
                        ratioFocus === r
                          ? 'bg-white text-sky-700 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {r.toUpperCase()} θ
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Worked Proof */}
              <div className="mt-4 bg-[#F4F8FB] border border-slate-200 rounded-lg p-4">
                {ratioFocus === 'sin' && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900">
                      SOH — Sine links Opposite (Eastward) and Hypotenuse (Course)
                    </div>
                    <div className="font-mono text-sm tabular-nums text-slate-800 bg-white border border-slate-200 rounded-md p-3">
                      <div>sin({theta}°) = Opposite / Hypotenuse</div>
                      <div className="mt-1 text-orange-700 font-semibold">
                        sin({theta}°) = {opposite.toFixed(2)} / {hypotenuse} = {sinVal.toFixed(4)}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Eastward travel: O = {hypotenuse} × sin({theta}°) = {opposite.toFixed(2)} NM
                      </div>
                    </div>
                  </div>
                )}

                {ratioFocus === 'cos' && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900">
                      CAH — Cosine links Adjacent (Northward) and Hypotenuse (Course)
                    </div>
                    <div className="font-mono text-sm tabular-nums text-slate-800 bg-white border border-slate-200 rounded-md p-3">
                      <div>cos({theta}°) = Adjacent / Hypotenuse</div>
                      <div className="mt-1 text-teal-700 font-semibold">
                        cos({theta}°) = {adjacent.toFixed(2)} / {hypotenuse} = {cosVal.toFixed(4)}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Northward travel: A = {hypotenuse} × cos({theta}°) = {adjacent.toFixed(2)} NM
                      </div>
                    </div>
                  </div>
                )}

                {ratioFocus === 'tan' && (
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-slate-900">
                      TOA — Tangent links Opposite (Eastward) and Adjacent (Northward)
                    </div>
                    <div className="font-mono text-sm tabular-nums text-slate-800 bg-white border border-slate-200 rounded-md p-3">
                      <div>tan({theta}°) = Opposite / Adjacent</div>
                      <div className="mt-1 text-sky-700 font-semibold">
                        tan({theta}°) = {opposite.toFixed(2)} / {adjacent.toFixed(2)} = {tanVal.toFixed(4)}
                      </div>
                      <div className="mt-1 text-xs text-slate-600">
                        Useful when you know East &amp; North grid distances and want the bearing: θ = tan⁻¹(O / A)
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Summary Cheat Sheet Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-mono font-semibold text-orange-700">SOH · Sine</div>
                <div className="mt-1 text-lg font-bold font-mono text-slate-900">sin θ = O / H</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Measures how much of your path goes <strong className="text-slate-800">across</strong> (Opposite).
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-mono font-semibold text-teal-700">CAH · Cosine</div>
                <div className="mt-1 text-lg font-bold font-mono text-slate-900">cos θ = A / H</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Measures how much of your path goes <strong className="text-slate-800">along</strong> (Adjacent).
                </p>
              </div>
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="text-xs font-mono font-semibold text-sky-700">TOA · Tangent</div>
                <div className="mt-1 text-lg font-bold font-mono text-slate-900">tan θ = O / A</div>
                <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                  Gives the <strong className="text-slate-800">slope ratio</strong> between Opposite and Adjacent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Part B: Interactive 0°–360° Trigonometric Function Charts */}
        <div className="mt-8 bg-white border border-slate-200 rounded-xl p-4 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Interactive Trigonometric Function Chart (0° to 360°)
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Scrub across a full compass circle to compare <span className="font-mono">sin θ</span>,{' '}
                <span className="font-mono">cos θ</span>, and <span className="font-mono">tan θ</span> across all four quadrants.
              </p>
            </div>

            {/* Curve Visibility Toggles */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSin((v) => !v)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors min-h-[40px] whitespace-nowrap ${
                  showSin
                    ? 'bg-sky-50 border-sky-300 text-sky-800'
                    : 'bg-white border-slate-300 text-slate-500'
                }`}
              >
                y = sin θ
              </button>
              <button
                type="button"
                onClick={() => setShowCos((v) => !v)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors min-h-[40px] whitespace-nowrap ${
                  showCos
                    ? 'bg-teal-50 border-teal-300 text-teal-800'
                    : 'bg-white border-slate-300 text-slate-500'
                }`}
              >
                y = cos θ
              </button>
              <button
                type="button"
                onClick={() => setShowTan((v) => !v)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-colors min-h-[40px] whitespace-nowrap ${
                  showTan
                    ? 'bg-orange-50 border-orange-300 text-orange-800'
                    : 'bg-white border-slate-300 text-slate-500'
                }`}
              >
                y = tan θ
              </button>
            </div>
          </div>

          {/* Chart SVG */}
          <div className="mt-4 overflow-x-auto">
            <svg
              viewBox={`0 0 ${CW} ${CH}`}
              className="w-full min-w-[460px] h-auto block"
              role="img"
              aria-label="Interactive chart of sine, cosine, and tangent functions from 0 to 360 degrees"
            >
              {/* Quadrant background bands */}
              <rect x={xForDeg(0)} y={PAD_T} width={plotW / 4} height={plotH} fill="#F0F9FF" />
              <rect x={xForDeg(90)} y={PAD_T} width={plotW / 4} height={plotH} fill="#FFFFFF" />
              <rect x={xForDeg(180)} y={PAD_T} width={plotW / 4} height={plotH} fill="#F0F9FF" />
              <rect x={xForDeg(270)} y={PAD_T} width={plotW / 4} height={plotH} fill="#FFFFFF" />

              {/* Horizontal grid lines (-2, -1, 0, 1, 2) */}
              {[-2, -1, 0, 1, 2].map((val) => {
                const y = yForVal(val);
                return (
                  <g key={val}>
                    <line
                      x1={PAD_L}
                      y1={y}
                      x2={CW - PAD_R}
                      y2={y}
                      stroke={val === 0 ? '#475569' : '#CBD5E1'}
                      strokeWidth={val === 0 ? 1.5 : 1}
                    />
                    <text
                      x={PAD_L - 8}
                      y={y + 4}
                      textAnchor="end"
                      className="fill-slate-600 font-mono text-[11px]"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Vertical degree grid lines & tan asymptotes */}
              {[0, 90, 180, 270, 360].map((deg) => {
                const x = xForDeg(deg);
                const isAsymptote = showTan && (deg === 90 || deg === 270);
                return (
                  <g key={deg}>
                    <line
                      x1={x}
                      y1={PAD_T}
                      x2={x}
                      y2={CH - PAD_B}
                      stroke={isAsymptote ? '#EA580C' : '#CBD5E1'}
                      strokeWidth={isAsymptote ? 1.3 : 1}
                      strokeDasharray={isAsymptote ? '4 4' : undefined}
                    />
                    <text
                      x={x}
                      y={CH - 14}
                      textAnchor="middle"
                      className="fill-slate-700 font-mono text-[11px] font-medium"
                    >
                      {deg}°
                    </text>
                  </g>
                );
              })}

              {/* Curves */}
              {showTan &&
                tanSegments.map((d, idx) => (
                  <path
                    key={idx}
                    d={d}
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                ))}
              {showCos && (
                <path d={cosPath} fill="none" stroke="#0D9488" strokeWidth="2.6" strokeLinecap="round" />
              )}
              {showSin && (
                <path d={sinPath} fill="none" stroke="#0284C7" strokeWidth="2.8" strokeLinecap="round" />
              )}

              {/* Active Angle Scrubber Line & Data Points */}
              <line
                x1={xForDeg(chartAngle)}
                y1={PAD_T}
                x2={xForDeg(chartAngle)}
                y2={CH - PAD_B}
                stroke="#0F172A"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
              {showSin && (
                <circle
                  cx={xForDeg(chartAngle)}
                  cy={yForVal(chartSin)}
                  r="5.5"
                  fill="#0284C7"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
              {showCos && (
                <circle
                  cx={xForDeg(chartAngle)}
                  cy={yForVal(chartCos)}
                  r="5.5"
                  fill="#0D9488"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
              {showTan && !isTanAsymptote && Math.abs(chartTan) <= yMax && (
                <circle
                  cx={xForDeg(chartAngle)}
                  cy={yForVal(chartTan)}
                  r="5.5"
                  fill="#EA580C"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              )}
            </svg>
          </div>

          {/* Scrubber & Readouts */}
          <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            <div className="lg:col-span-6">
              <div className="flex items-center justify-between text-sm">
                <label htmlFor="curve-angle-slider" className="font-medium text-slate-700">
                  Inspect Angle on Curves
                </label>
                <span className="font-mono tabular-nums font-semibold text-slate-900">{chartAngle}°</span>
              </div>
              <input
                id="curve-angle-slider"
                type="range"
                min={0}
                max={360}
                value={chartAngle}
                onChange={(e) => setChartAngle(Number(e.target.value))}
                className="trig-slider"
              />
              <div className="flex flex-wrap gap-1.5 mt-1">
                {SPECIAL_ANGLES.map((ang) => (
                  <button
                    key={ang}
                    type="button"
                    onClick={() => setChartAngle(ang)}
                    className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors min-h-[32px] ${
                      chartAngle === ang
                        ? 'bg-sky-600 border-sky-600 text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-sky-400'
                    }`}
                  >
                    {ang}°
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[#F4F8FB] border border-slate-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-sky-800">sin({chartAngle}°)</div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900">
                    {chartSin.toFixed(3)}
                  </div>
                </div>
                <div className="bg-[#F4F8FB] border border-slate-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-teal-800">cos({chartAngle}°)</div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900">
                    {chartCos.toFixed(3)}
                  </div>
                </div>
                <div className="bg-[#F4F8FB] border border-slate-200 rounded-lg p-3">
                  <div className="text-xs font-medium text-orange-800">tan({chartAngle}°)</div>
                  <div className="mt-1 text-lg font-bold font-mono tabular-nums text-slate-900">
                    {isTanAsymptote ? 'Undefined' : chartTan.toFixed(3)}
                  </div>
                </div>
              </div>
              <p className="mt-2 text-xs font-medium text-slate-600">{quadrantText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
