import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import SEO from '../components/SEO';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import { viewportOnce, fadeUp, fadeUpSmall, easeOut, heroContainer, heroItem } from '../utils/marketingMotion.js';

/**
 * Product lineup — replace `DEMO_PRODUCTS` (copy, images, alt text) when final assets are ready.
 * Image paths are under `frontend/public/` (e.g. `/images/marketing/...`).
 */
const BRAND = {
  accent: '#7C3AED',
  glow: '#C084FC',
};

const SECTION_LABEL_LINE_STYLE = {
  background: `linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.2) 10%, ${BRAND.accent} 32%, ${BRAND.glow} 50%, ${BRAND.accent} 68%, rgba(124,58,237,0.2) 90%, transparent 100%)`,
  boxShadow: `0 0 14px rgba(192, 132, 252, 0.75), 0 0 28px rgba(124, 58, 237, 0.4), 0 0 42px rgba(124, 58, 237, 0.15)`,
};

const HERO_BG =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80';

const DEMO_PRODUCTS = [
  {
    id: 'argo-h',
    model: 'ARGO-H',
    environment: 'Hotels & hospitality',
    headline: 'Designed for lobbies, corridors, and guest-facing service.',
    description:
      'Placeholder narrative for the hotel variant: quiet navigation near guests, predictable routes alongside housekeeping, and handoff points that match your property layout. Swap this block when your final positioning and specs are ready.',
    bullets: [
      'Corridor pacing and proximity-aware motion',
      'Service routes from kitchen or pantry to floors',
      'Integration hooks for PMS and staff alerts (TBD)',
    ],
    image: '/images/marketing/hotel-lobby.png',
    imageAlt: 'Hotel lobby — placeholder product visual for ARGO-H',
  },
  {
    id: 'argo-r',
    model: 'ARGO-R',
    environment: 'Retail spaces',
    headline: 'Built for aisles, atriums, and shifting shopper flow.',
    description:
      'Placeholder narrative for retail: movement that respects browsing lines, pop-up layouts, and peak-hour density. Replace with your real differentiators, payload limits, and safety story.',
    bullets: [
      'Floor plans with seasonal layout changes',
      'Low-noise presence on the selling floor',
      'Staff override and zone restrictions (TBD)',
    ],
    image: '/images/marketing/retail-atrium.png',
    imageAlt: 'Retail atrium — placeholder product visual for ARGO-R',
  },
  {
    id: 'argo-s',
    model: 'ARGO-S',
    environment: 'Cricket stadiums & large venues',
    headline: 'Sized for concourses, stands, and high-energy crowds.',
    description:
      'Placeholder narrative for stadiums: robust movement in wet or uneven zones, predictable service to seating bowls, and operations that scale on match days. Update with cricket-specific workflows and compliance when available.',
    bullets: [
      'Concourse routing during peak ingress and egress',
      'Weather-hardened operation (specify with final datasheet)',
      'F&B and merchandise logistics to seating zones',
    ],
    image: '/images/marketing/stadium.png',
    imageAlt: 'Stadium concourse — placeholder product visual for ARGO-S',
  },
];

function ProductImage({ src, alt }) {
  return (
    <div className="relative h-full min-h-[280px] lg:min-h-[420px] overflow-hidden bg-neutral-950">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
        decoding="async"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent lg:from-black/40"
        aria-hidden
      />
    </div>
  );
}

const ProductsPage = () => {
  const reduceMotion = useReducedMotion();
  const heroBgTransition = reduceMotion ? { duration: 0 } : { duration: 1.2, ease: easeOut };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <SEO
        title="ARGO product lineup | ATSN Robotics"
        description="ARGO-H for hospitality, ARGO-R for retail, ARGO-S for stadiums and large venues. Explore deployment-focused autonomous robotics from ATSN."
      />

      <SiteHeader variant="solid" />

      {/* Hero */}
      <section className="relative pt-24 md:pt-28 pb-16 md:pb-24 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          initial={reduceMotion ? false : { scale: 1.12, opacity: 0 }}
          animate={reduceMotion ? {} : { scale: 1.05, opacity: 1 }}
          transition={heroBgTransition}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-[#050505]/88 to-[#050505]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-violet-950/25 via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
          aria-hidden
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            variants={heroContainer}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            <motion.div variants={heroItem} className="space-y-4">
              <p
                className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-violet-300/90"
              >
                Commercial robotics
              </p>
              <motion.div
                className="mx-auto h-px w-16 rounded-full origin-center"
                style={SECTION_LABEL_LINE_STYLE}
                initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
                animate={reduceMotion ? {} : { scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.85, ease: easeOut, delay: reduceMotion ? 0 : 0.2 }}
                aria-hidden
              />
            </motion.div>
            <motion.h1
              variants={heroItem}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-white leading-[1.08]"
            >
              Autonomous service, tuned to your environment
            </motion.h1>
            <motion.p
              variants={heroItem}
              className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto"
            >
              The ARGO family shares one platform with three deployment profiles—hospitality, retail, and
              large-format venues—so operations, safety, and guest experience stay aligned from pilot to scale.
            </motion.p>
            <motion.div
              variants={heroItem}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2"
            >
              <a
                href="#lineup"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-neutral-950 hover:bg-neutral-100 transition-colors"
              >
                View models
              </a>
              <Link
                to="/contact/invite"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/[0.08] transition-colors backdrop-blur-sm"
              >
                Talk to sales
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <nav
        id="lineup"
        aria-label="Jump to product model"
        className="sticky top-[4.25rem] md:top-[5.25rem] z-[80] border-y border-white/[0.08] bg-neutral-950/40 backdrop-blur-xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] scroll-mt-24 md:scroll-mt-28"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-5">
            <span className="text-center sm:text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400 shrink-0 drop-shadow-sm">
              Go to product
            </span>
            <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
              {DEMO_PRODUCTS.map((p) => (
                <a
                  key={p.id}
                  href={`#${p.id}`}
                  className="inline-flex min-w-[6.75rem] items-center justify-center rounded-full border border-white/[0.22] bg-white/[0.07] px-5 py-2.5 text-sm font-semibold text-white/95 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),0_4px_24px_-4px_rgba(0,0,0,0.45)] backdrop-blur-lg transition-all duration-200 hover:border-violet-300/35 hover:bg-violet-500/[0.15] hover:text-white hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.22),0_0_32px_-6px_rgba(167,139,250,0.45)] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/55 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
                >
                  {p.model}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-12 md:space-y-16">
        {DEMO_PRODUCTS.map((product, index) => (
          <motion.article
            key={product.id}
            id={product.id}
            aria-labelledby={`${product.id}-heading`}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="group scroll-mt-32 md:scroll-mt-36 lg:scroll-mt-40 rounded-2xl overflow-hidden border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent shadow-[0_0_0_1px_rgba(124,58,237,0.06),0_32px_80px_-24px_rgba(0,0,0,0.75)]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-0">
              <div className="lg:col-span-5 flex flex-col justify-center p-8 md:p-10 lg:p-12 lg:pr-10 order-2 lg:order-1 border-b lg:border-b-0 lg:border-r border-white/[0.06]">
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className="inline-flex items-center rounded-md border border-violet-500/25 bg-violet-500/[0.08] px-2.5 py-1 text-xs font-semibold tracking-wide text-violet-200">
                    {product.model}
                  </span>
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                    {String(index + 1).padStart(2, '0')} / {String(DEMO_PRODUCTS.length).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-2">
                  {product.environment}
                </p>
                <h2
                  id={`${product.id}-heading`}
                  className="text-2xl md:text-3xl font-semibold tracking-tight text-white leading-snug mb-4"
                >
                  {product.headline}
                </h2>
                <p className="text-sm md:text-base text-neutral-400 leading-relaxed mb-8">
                  {product.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {product.bullets.map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-neutral-300 leading-relaxed">
                      <span
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/25"
                        aria-hidden
                      >
                        <Check className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 pt-2 border-t border-white/[0.06]">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-500 transition-colors"
                  >
                    Request datasheet
                  </Link>
                  <Link
                    to="/contact/invite"
                    className="inline-flex items-center justify-center text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                  >
                    Schedule briefing →
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-7 order-1 lg:order-2">
                <ProductImage src={product.image} alt={product.imageAlt} />
              </div>
            </div>
          </motion.article>
        ))}

        <motion.section
          variants={fadeUpSmall}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet-950/30 via-[#0c0c0c] to-[#050505] px-8 py-12 md:px-14 md:py-16 text-center"
        >
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 tracking-tight">
            Plan deployment with our team
          </h2>
          <p className="text-neutral-400 max-w-lg mx-auto mb-8 leading-relaxed text-sm md:text-base">
            Share floor plans, peak traffic patterns, and integration requirements—we will align the right ARGO
            profile and rollout path for your site.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/contact/invite"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-neutral-950 hover:bg-neutral-100 transition-colors"
            >
              Contact us
            </Link>
            <Link
              to="/about"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:bg-white/[0.06] transition-colors"
            >
              About ATSN
            </Link>
          </div>
        </motion.section>
      </main>

      <SiteFooter />
    </div>
  );
};

export default ProductsPage;
