import { useState } from 'react';
import { Compass, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '#bearings', label: 'Bearings' },
  { href: '#sin-cos-tan', label: 'Sin · Cos · Tan' },
  { href: '#sine-rule', label: 'Sine Rule' },
  { href: '#cosine-rule', label: 'Cosine Rule' },
  { href: '#challenge', label: 'Practice' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600 rounded"
        >
          <Compass className="w-5 h-5 text-sky-600 shrink-0" aria-hidden="true" />
          <span>STEM EXPO</span>
        </a>

        {/* Zone 2: 5 concise single-line text navigation links */}
        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-sky-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 border-transparent hover:border-sky-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky-600"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + mobile drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href="#bearings"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            Start Simulation
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile sections"
          className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition-colors min-h-[44px]"
            >
              <span>{link.label}</span>
            </a>
          ))}
          <a
            href="#bearings"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-2 flex items-center justify-center w-full px-4 py-3 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors min-h-[44px]"
          >
            Start Simulation
          </a>
        </nav>
      )}
    </header>
  );
}
