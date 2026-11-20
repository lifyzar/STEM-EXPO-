import { ArrowDownRight, Compass, Navigation, Triangle } from 'lucide-react';

const MODULES = [
  {
    id: '#bearings',
    index: '01',
    title: 'Bearings & Boat Chart',
    summary: 'Three-figure bearings from North, clockwise angles, and back-bearings across islands.',
  },
  {
    id: '#sin-cos-tan',
    index: '02',
    title: 'Sin · Cos · Tan & Curves',
    summary: 'Right-angled SOH CAH TOA vectors paired with live 0° to 360° wave charts.',
  },
  {
    id: '#sine-rule',
    index: '03',
    title: 'The Sine Rule',
    summary: 'Triangulate boats from two islands and explore the ambiguous two-triangle case.',
  },
  {
    id: '#cosine-rule',
    index: '04',
    title: 'The Cosine Rule',
    summary: 'Calculate direct island-to-island distances and interior angles from SAS or SSS courses.',
  },
];

export default function HeroSection() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-[#EBF6FC] via-[#F4F8FB] to-[#F4F8FB]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Left Headline & Subtitle */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <p className="text-sm font-medium text-sky-700 tracking-wide mb-3">
              Interactive Mathematics Exhibition · Nautical Trigonometry Lab
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 text-balance leading-[1.08]">
              STEM EXPO
            </h1>
            <p className="mt-3 text-xl sm:text-2xl font-semibold text-sky-700 text-balance">
              Island navigation and Trigonometry
            </p>
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Plot boat headings between tropical islands, visualize how sine, cosine, and tangent
              decompose every voyage into North and East vectors, and solve real-time maritime
              triangles using the Sine and Cosine Rules.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#bearings"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                <Navigation className="w-4 h-4" aria-hidden="true" />
                <span>Launch Boat Simulator</span>
              </a>
              <a
                href="#sin-cos-tan"
                className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors min-h-[44px] whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
              >
                <Triangle className="w-4 h-4 text-teal-600" aria-hidden="true" />
                <span>Explore Trig Charts</span>
              </a>
            </div>
          </div>

          {/* Right Live Nautical Diagram Preview */}
          <div className="lg:col-span-5 flex">
            <div className="w-full rounded-xl bg-white border border-slate-200 p-5 sm:p-6 flex flex-col justify-between nautical-grid">
              <div className="flex items-center justify-between text-xs font-medium text-slate-500 pb-3 border-b border-slate-200/80">
                <span>Live Vector Overview</span>
                <span className="font-mono tabular-nums text-sky-700">Heading 053° · 50.0 NM</span>
              </div>

              <div className="my-4 flex-1 flex items-center justify-center">
                <svg
                  viewBox="0 0 360 230"
                  className="w-full max-w-[360px] h-auto"
                  role="img"
                  aria-label="Illustration showing a boat navigating on a 053 degree bearing toward an island using a right-angled triangle"
                >
                  <defs>
                    <linearGradient id="seaGradHero" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#E0F2FE" />
                      <stop offset="100%" stopColor="#CCFBF1" />
                    </linearGradient>
                  </defs>
                  <rect x="8" y="8" width="344" height="214" rx="12" fill="url(#seaGradHero)" stroke="#BAE6FD" strokeWidth="1.5" />

                  {/* North arrow at Boat */}
                  <line x1="85" y1="175" x2="85" y2="55" stroke="#0F172A" strokeWidth="1.5" strokeDasharray="4 4" />
                  <polygon points="85,48 80,58 90,58" fill="#0F172A" />
                  <text x="85" y="40" textAnchor="middle" className="fill-slate-900 font-mono text-[12px] font-semibold">N</text>

                  {/* Right-angle displacement legs */}
                  <line x1="85" y1="70" x2="265" y2="70" stroke="#0D9488" strokeWidth="2" strokeDasharray="5 4" />
                  <line x1="85" y1="175" x2="85" y2="70" stroke="#0284C7" strokeWidth="2.5" />
                  <rect x="85" y="70" width="12" height="12" fill="none" stroke="#475569" strokeWidth="1.2" />

                  {/* Bearing angle arc */}
                  <path d="M 85 135 A 40 40 0 0 1 117 143" fill="none" stroke="#EA580C" strokeWidth="2.2" />
                  <text x="115" y="130" className="fill-orange-700 font-mono text-[11px] font-semibold">053°</text>

                  {/* Hypotenuse course line */}
                  <line x1="85" y1="175" x2="265" y2="70" stroke="#0369A1" strokeWidth="3" />

                  {/* Labels */}
                  <text x="46" y="126" textAnchor="middle" className="fill-sky-800 font-mono text-[11px] font-medium">30.1 NM</text>
                  <text x="175" y="60" textAnchor="middle" className="fill-teal-800 font-mono text-[11px] font-medium">39.9 NM (d·sin θ)</text>
                  <text x="192" y="140" textAnchor="middle" transform="rotate(-30 192 140)" className="fill-sky-900 font-mono text-[11px] font-semibold">
                    d = 50.0 NM
                  </text>

                  {/* Coral Island */}
                  <ellipse cx="268" cy="74" rx="28" ry="18" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
                  <ellipse cx="268" cy="70" rx="18" ry="11" fill="#10B981" />
                  <circle cx="265" cy="70" r="3" fill="#0F172A" />
                  <text x="268" y="106" textAnchor="middle" className="fill-slate-800 font-sans text-[11px] font-semibold">Coral Island</text>

                  {/* Boat marker */}
                  <g transform="translate(85, 175) rotate(53)">
                    <path d="M 0 -13 L 8 9 L 0 5 L -8 9 Z" fill="#EA580C" stroke="#FFFFFF" strokeWidth="1.5" />
                  </g>
                  <text x="85" y="203" textAnchor="middle" className="fill-slate-800 font-sans text-[11px] font-semibold">Boat</text>

                  {/* Mini compass */}
                  <g transform="translate(318, 182)">
                    <circle cx="0" cy="0" r="20" fill="#FFFFFF" stroke="#94A3B8" strokeWidth="1.2" />
                    <polygon points="0,-15 4,0 0,-3 -4,0" fill="#EA580C" />
                    <polygon points="0,15 4,0 0,3 -4,0" fill="#64748B" />
                    <text x="0" y="-23" textAnchor="middle" className="fill-slate-700 font-mono text-[9px] font-bold">N</text>
                  </g>
                </svg>
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
                <span>Drag boats & islands directly on charts</span>
                <span className="inline-flex items-center gap-1 font-medium text-sky-700">
                  <Compass className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Clockwise from 000° N</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column Module Quick-Jump Strip */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MODULES.map((mod) => (
            <a
              key={mod.id}
              href={mod.id}
              className="group bg-white border border-slate-200 rounded-xl p-5 hover:border-sky-400 transition-colors flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono font-medium text-sky-700">
                  <span>Module {mod.index}</span>
                  <ArrowDownRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 transition-colors" aria-hidden="true" />
                </div>
                <h2 className="mt-2 text-base font-semibold text-slate-900 group-hover:text-sky-700 transition-colors">
                  {mod.title}
                </h2>
                <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">
                  {mod.summary}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
