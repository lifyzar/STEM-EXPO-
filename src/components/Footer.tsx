const INSTAGRAM_ACCOUNTS = [
  'thaalyslma',
  'rkalify',
  'maghisya.syaima',
  'mpeylita',
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-200 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          <div>
            <div className="text-lg font-bold tracking-tight text-white">STEM EXPO</div>
            <p className="mt-1 text-sm text-slate-400">
              Island navigation and Trigonometry
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
            <a href="#bearings" className="hover:text-sky-300 transition-colors">Bearings</a>
            <a href="#sin-cos-tan" className="hover:text-sky-300 transition-colors">Sin · Cos · Tan</a>
            <a href="#sine-rule" className="hover:text-sky-300 transition-colors">Sine Rule</a>
            <a href="#cosine-rule" className="hover:text-sky-300 transition-colors">Cosine Rule</a>
            <a href="#pioneers" className="hover:text-sky-300 transition-colors">Pioneers</a>
            <a href="#challenge" className="hover:text-sky-300 transition-colors">Practice</a>
          </nav>
        </div>

        {/* Exact requested STEM booth closing message at the very bottom */}
        <div className="pt-8 text-center">
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed">
            Appreciate you dropping by our stem booth! find us on our instagram account{' '}
            <span className="inline-flex flex-wrap justify-center gap-x-2.5 gap-y-1 font-medium text-sky-300">
              {INSTAGRAM_ACCOUNTS.map((handle) => (
                <a
                  key={handle}
                  href={`https://www.instagram.com/${handle}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white underline decoration-sky-400/60 underline-offset-4 transition-colors"
                >
                  @{handle}
                </a>
              ))}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
