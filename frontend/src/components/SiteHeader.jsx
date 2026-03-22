import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
  { to: '/contact/invite', label: "Let's Talk" },
];

const MenuIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * @param {'overlay' | 'solid' | 'light'} variant — landing overlay; dark pages solid; contact pages light bar
 */
const SiteHeader = ({ variant = 'solid' }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const isOverlay = variant === 'overlay';
  const isLight = variant === 'light';
  const barClass = isLight
    ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm shadow-slate-900/5'
    : isOverlay
      ? 'bg-[#050505]/90 backdrop-blur-md border-b border-neutral-800/50 md:border-transparent md:bg-transparent md:backdrop-blur-none md:mix-blend-difference'
      : 'bg-[#050505]/90 backdrop-blur-sm border-b border-neutral-800/50';

  const desktopLink = isLight
    ? 'text-sm font-medium tracking-wide text-slate-600 hover:text-[#0B1B35] transition-colors'
    : isOverlay
      ? 'text-sm font-medium tracking-wider text-neutral-300 hover:text-white transition-colors'
      : 'text-sm font-medium tracking-wider text-neutral-400 hover:text-white transition-colors';

  const logoClass = isLight
    ? 'text-xl md:text-2xl font-bold tracking-tight text-[#0B1B35] hover:text-blue-700 transition-colors'
    : isOverlay
      ? 'text-xl md:text-2xl font-bold tracking-tight text-white md:text-inherit'
      : 'text-xl md:text-2xl font-bold tracking-tight hover:text-violet-400 transition-colors';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] px-4 sm:px-6 md:px-10 py-4 md:py-6 flex justify-between items-center pointer-events-auto ${barClass}`}
      >
        <Link to="/" className={logoClass}>
          ATSN ROBOTICS
        </Link>

        {/* Desktop / tablet: top nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Main navigation">
          {NAV_LINKS.map(({ to, label }) => (
            <Link key={to} to={to} className={desktopLink}>
              {label}
            </Link>
          ))}
        </nav>

        {/* Mobile: hamburger */}
        <button
          type="button"
          className={`md:hidden p-2 -mr-2 rounded-lg transition-colors ${
            isLight ? 'text-slate-800 hover:bg-slate-100' : 'text-neutral-100 hover:bg-white/10'
          }`}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* Mobile full-screen menu (only when open) */}
      {menuOpen && (
        <div
          id="mobile-nav-panel"
          className={`fixed inset-0 z-[90] pt-[4.5rem] px-6 pb-8 md:hidden ${
            isLight ? 'bg-white border-t border-slate-100' : 'bg-[#050505]'
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <nav className="flex flex-col gap-1 max-w-md mx-auto" aria-label="Mobile navigation">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`text-lg font-medium py-4 border-b transition-colors ${
                  isLight
                    ? 'text-slate-900 border-slate-100 hover:text-blue-700'
                    : 'text-white border-neutral-800 hover:text-violet-400'
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
};

export default SiteHeader;
