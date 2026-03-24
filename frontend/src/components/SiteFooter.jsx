import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Shared site footer — use on every page for consistent layout (Company, Legal, Connect).
 * @param {'dark' | 'light'} variant — light matches contact-page navy/white theme
 */
const SiteFooter = ({ className = '', variant = 'dark' }) => {
  const isLight = variant === 'light';
  return (
  <footer
    className={`w-full pt-16 pb-12 px-6 md:px-24 lg:px-32 ${
      isLight
        ? 'border-t border-slate-200 bg-[#0B1B35] text-white'
        : 'border-t border-neutral-800/50 bg-neutral-950/80 backdrop-blur-sm'
    } ${className}`}
  >
    <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
      <div className="col-span-2 md:col-span-1">
        <Link
          to="/"
          className={`text-2xl font-bold mb-4 tracking-tighter block transition-colors ${
            isLight ? 'text-white hover:text-blue-300' : 'text-white hover:text-violet-400'
          }`}
        >
          ATSN Robotics
        </Link>
        <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-300' : 'text-neutral-500'}`}>
          Building the autonomous future, one intelligent movement at a time.
        </p>
      </div>
      <div>
        <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wider ${isLight ? 'text-slate-200' : 'text-neutral-200'}`}>Company</h4>
        <ul className={`text-sm space-y-4 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
          <li>
            <Link to="/" className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}>
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}
            >
              Products
            </Link>
          </li>
          <li>
            <Link to="/about" className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}>
              Careers
            </Link>
          </li>
          <li>
            <Link to="/contact" className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}>
              Contact
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wider ${isLight ? 'text-slate-200' : 'text-neutral-200'}`}>Legal</h4>
        <ul className={`text-sm space-y-4 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
          <li>
            <Link
              to="/privacy"
              className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}
            >
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link
              to="/terms"
              className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}
            >
              Terms &amp; Conditions
            </Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className={`font-semibold mb-6 text-sm uppercase tracking-wider ${isLight ? 'text-slate-200' : 'text-neutral-200'}`}>Connect</h4>
        <ul className={`text-sm space-y-4 ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
          <li>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}
            >
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="https://twitter.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={isLight ? 'hover:text-white transition-colors' : 'hover:text-violet-400 transition-colors'}
            >
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </div>
    <p className={`max-w-7xl mx-auto mt-12 pt-8 text-center text-xs px-4 border-t ${
      isLight ? 'border-white/10 text-slate-500' : 'border-neutral-800/50 text-neutral-600'
    }`}>
      © {new Date().getFullYear()} ATSN Robotics. All rights reserved.
    </p>
  </footer>
  );
};

export default SiteFooter;
