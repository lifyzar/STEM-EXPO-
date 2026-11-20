import { useState } from 'react';
import { BookOpen, Compass, Sparkles } from 'lucide-react';
import { degToRad } from '../utils/math';

export default function TrigPioneers() {
  const [sampleDeg, setSampleDeg] = useState(30);

  const rad = degToRad(sampleDeg);
  const sinVal = Math.sin(rad);
  const cosVal = Math.cos(rad);
  const tanVal = sampleDeg === 90 ? Infinity : Math.tan(rad);
  const secVal = sampleDeg === 90 ? Infinity : 1 / cosVal;
  const cscVal = sampleDeg === 0 ? Infinity : 1 / sinVal;

  return (
    <section id="pioneers" className="py-12 sm:py-16 border-b border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-medium text-sky-700">
            History &amp; Fun Facts · Pioneers of Trigonometry
          </p>
          <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Al-Battani &amp; Abu al-Wafa: Who Built Modern Trigonometry?
          </h2>
          <p className="mt-2.5 text-base text-slate-600 leading-relaxed">
            Long before GPS and graphing calculators, medieval scholars turned geometry into the practical ratios
            of <span className="font-mono font-medium text-slate-800">sin</span>,{' '}
            <span className="font-mono font-medium text-slate-800">cos</span>,{' '}
            <span className="font-mono font-medium text-slate-800">tan</span>, and the{' '}
            <strong className="font-semibold text-slate-900">Sine Rule</strong> used for navigation today.
          </p>
        </div>

        {/* Two Scholar Feature Columns */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Card 1: Al-Battani */}
          <article className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200 text-xs text-slate-500">
                <span className="font-medium text-sky-700">Scholar 01 · c. 858–929 CE</span>
                <span className="font-mono">Harran &amp; Raqqa</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Al-Battani (Muhammad ibn Jabir al-Battani)
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Earlier Greek astronomers worked with bulky <strong className="font-semibold text-slate-900">chords</strong>{' '}
                across full circles. Al-Battani pioneered calculations using <strong className="font-semibold text-slate-900">half-chords</strong>—the
                direct foundation of the modern <span className="font-mono font-semibold text-sky-700">sin θ</span>—and
                introduced systematic <span className="font-mono font-semibold text-teal-700">tangent</span> and{' '}
                <span className="font-mono font-semibold text-teal-700">cotangent</span> tables from shadow lengths.
              </p>

              <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-orange-700">
                  <Sparkles className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Fun Fact: Shadow Math &amp; Solar Year Precision</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  By measuring the shadow cast by a vertical sundial rod (<span className="font-mono">tan θ = shadow / stick</span>)
                  and using his identity <span className="font-mono font-semibold text-slate-900">tan θ = sin θ / cos θ</span>,
                  Al-Battani calculated the length of Earth&apos;s year as{' '}
                  <strong className="font-semibold text-slate-900">365 days, 5 hours, 46 minutes, 24 seconds</strong>—accurate
                  to within about two minutes! Even Copernicus cited Al-Battani&apos;s work 23 times centuries later.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              <Compass className="w-4 h-4 text-sky-600 shrink-0" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-slate-800">Navigation Impact:</strong> Made solar elevation and
                bearing trigonometry practical for open-sea voyages.
              </span>
            </div>
          </article>

          {/* Card 2: Abu al-Wafa al-Buzjani */}
          <article className="bg-[#F4F8FB] border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-200 text-xs text-slate-500">
                <span className="font-medium text-teal-700">Scholar 02 · 940–998 CE</span>
                <span className="font-mono">Buzjan &amp; Baghdad</span>
              </div>

              <h3 className="mt-4 text-xl font-bold text-slate-900">
                Abu al-Wafa al-Buzjani
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                Abu al-Wafa revolutionized trigonometry by setting the reference circle radius to{' '}
                <strong className="font-semibold text-slate-900">R = 1 (the Unit Circle)</strong> instead of 60. That
                single step turned <span className="font-mono font-semibold text-sky-700">sin θ</span> and{' '}
                <span className="font-mono font-semibold text-teal-700">cos θ</span> into clean pure ratios. He also
                defined <span className="font-mono">secant</span> and <span className="font-mono">cosecant</span> and
                proved the general <strong className="font-semibold text-slate-900">Sine Rule</strong> for spherical triangles!
              </p>

              <div className="mt-4 bg-white border border-slate-200 rounded-lg p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-sky-700">
                  <BookOpen className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>Fun Fact: 8-Decimal Accuracy by Hand</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  With no electronic calculators, Abu al-Wafa built a sine table for every{' '}
                  <strong className="font-semibold text-slate-900">0.25° (15 arcminutes)</strong> accurate to{' '}
                  <strong className="font-semibold text-slate-900">8 decimal places</strong>! He achieved this by
                  deriving angle-sum formulas like{' '}
                  <span className="font-mono font-semibold text-slate-900">sin(α + β) = sin α cos β + cos α sin β</span>.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 flex items-center gap-2 text-xs text-slate-600">
              <Compass className="w-4 h-4 text-teal-600 shrink-0" aria-hidden="true" />
              <span>
                <strong className="font-semibold text-slate-800">Navigation Impact:</strong> A crater on the Moon
                (<span className="font-mono">Abul Wáfa</span>) is named in honor of his astronomical math.
              </span>
            </div>
          </article>
        </div>

        {/* Interactive Unit Circle & Quarter-Degree Table Explorer */}
        <div className="mt-6 bg-[#F4F8FB] border border-slate-200 rounded-xl p-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">
                Try Abu al-Wafa&apos;s 0.25° Precision &amp; Al-Battani&apos;s Ratio Identity
              </h3>
              <p className="text-sm text-slate-600 mt-0.5">
                Slide in <span className="font-mono">0.25°</span> steps to inspect how all six classical trigonometric
                functions behave on a unit radius (<span className="font-mono">R = 1</span>).
              </p>
            </div>
            <div className="font-mono tabular-nums text-lg font-bold text-sky-700 shrink-0">
              θ = {sampleDeg.toFixed(2)}°
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="pioneer-deg-slider" className="sr-only">
              Select angle in 0.25 degree increments
            </label>
            <input
              id="pioneer-deg-slider"
              type="range"
              min={0}
              max={90}
              step={0.25}
              value={sampleDeg}
              onChange={(e) => setSampleDeg(Number(e.target.value))}
              className="trig-slider"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>0.00°</span>
              <span>22.50°</span>
              <span>45.00°</span>
              <span>67.50°</span>
              <span>90.00°</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500">sin θ (Half-Chord)</div>
              <div className="mt-1 font-mono tabular-nums text-sm sm:text-base font-bold text-sky-700">
                {sinVal.toFixed(6)}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500">cos θ (Complement)</div>
              <div className="mt-1 font-mono tabular-nums text-sm sm:text-base font-bold text-teal-700">
                {cosVal.toFixed(6)}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500">tan θ = sin θ / cos θ</div>
              <div className="mt-1 font-mono tabular-nums text-sm sm:text-base font-bold text-orange-700">
                {Number.isFinite(tanVal) ? tanVal.toFixed(6) : 'Undefined'}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3">
              <div className="text-xs text-slate-500">sec θ = 1 / cos θ</div>
              <div className="mt-1 font-mono tabular-nums text-sm sm:text-base font-bold text-slate-800">
                {Number.isFinite(secVal) ? secVal.toFixed(4) : 'Undefined'}
              </div>
            </div>
            <div className="bg-white border border-slate-200 rounded-lg p-3 col-span-2 sm:col-span-1">
              <div className="text-xs text-slate-500">csc θ = 1 / sin θ</div>
              <div className="mt-1 font-mono tabular-nums text-sm sm:text-base font-bold text-slate-800">
                {Number.isFinite(cscVal) ? cscVal.toFixed(4) : 'Undefined'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
