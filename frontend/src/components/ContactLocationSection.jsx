import React from 'react';

const DEFAULT_OFFICE_ADDRESS =
  'Gala Magnus, 314, Safal Parisar Rd, South Bopal, Bopal, Ahmedabad, Gujarat 380057, India';

const COMPANY_ADDRESS_LINES = (
  import.meta.env.VITE_COMPANY_ADDRESS ||
  'Gala Magnus, 314|Safal Parisar Rd, South Bopal, Bopal|Ahmedabad, Gujarat 380057|India'
)
  .split('|')
  .map((s) => s.trim())
  .filter(Boolean);

const MAP_SEARCH_QUERY = import.meta.env.VITE_MAP_QUERY || DEFAULT_OFFICE_ADDRESS;

const MAP_EMBED_SRC =
  import.meta.env.VITE_MAP_EMBED_URL ||
  `https://maps.google.com/maps?q=${encodeURIComponent(MAP_SEARCH_QUERY)}&hl=en&z=14&output=embed`;

function MapFrame({ className = '' }) {
  return (
    <div className={`map-embed-dark-wrap w-full min-h-0 ${className}`}>
      <iframe
        title="Company location on Google Maps"
        src={MAP_EMBED_SRC}
        className="map-embed-dark h-[min(420px,50vh)] min-h-[280px] w-full"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}

/**
 * Shared office address + dark-themed Google Maps embed (same env as contact pages).
 * @param {'dark' | 'light'} theme — light matches professional contact layout (navy/white pages)
 * @param {boolean} mapFullWidth — light theme: map spans full viewport width below copy
 */
export default function ContactLocationSection({
  className = '',
  introLine = 'Plan a visit or get directions using the map.',
  theme = 'dark',
  mapFullWidth = false,
}) {
  const isLight = theme === 'light';

  const kicker = isLight
    ? 'text-xs font-bold tracking-widest uppercase text-blue-600'
    : 'text-xs font-bold tracking-widest uppercase text-violet-400';
  const heading = isLight
    ? 'text-3xl md:text-4xl font-bold tracking-tight text-[#0B1B35]'
    : 'text-3xl md:text-4xl font-bold tracking-tighter text-white';
  const body = isLight ? 'text-slate-600 text-sm leading-relaxed' : 'text-neutral-400 text-sm leading-relaxed';
  const address = isLight ? 'not-italic text-slate-800 space-y-1' : 'not-italic text-neutral-200 space-y-1';
  const link = isLight
    ? 'inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors'
    : 'inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors';
  const border = isLight ? 'border-slate-200' : 'border-neutral-800';

  const copyBlock = (
    <div className="space-y-4">
      <p className={kicker}>Visit us</p>
      <h2 id="location-heading" className={heading}>
        Office location
      </h2>
      <p className={body}>{introLine}</p>
      <address className={address}>
        {COMPANY_ADDRESS_LINES.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </address>
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_SEARCH_QUERY)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={link}
      >
        Open in Google Maps
        <span aria-hidden>→</span>
      </a>
    </div>
  );

  if (isLight && mapFullWidth) {
    return (
      <section
        id="location"
        className={`border-t ${border} bg-slate-50 ${className}`}
        aria-labelledby="location-heading"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 pt-14 pb-10 md:pb-12">{copyBlock}</div>
        <MapFrame className="map-embed-bleed" />
      </section>
    );
  }

  return (
    <section
      id="location"
      className={`mt-20 pt-16 border-t ${border} ${className}`}
      aria-labelledby="location-heading"
    >
      <div
        className={`grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12 lg:items-start ${
          isLight ? 'max-w-7xl mx-auto px-6 md:px-10' : ''
        }`}
      >
        {copyBlock}
        <MapFrame />
      </div>
    </section>
  );
}
