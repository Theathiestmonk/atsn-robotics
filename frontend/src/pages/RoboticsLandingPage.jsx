import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import RobotGuide from '../components/robotics/RobotGuide';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { getHeroProgress, getHeroDriveT } from '../utils/heroScrollProgress';
import { viewportOnce } from '../utils/marketingMotion.js';

gsap.registerPlugin(ScrollTrigger);

/** Brand palette */
const C = {
  black: '#0A0A0A',
  surface: '#1E1E1E',
  text: '#EAEAEA',
  secondary: '#A0A0A0',
  accent: '#7C3AED',
  glow: '#C084FC',
};

const CORE_PARAGRAPHS = [
  'Most robots are built for controlled environments, but the real world is dynamic and unpredictable.',
  'At ATSN AI, we focus on enabling robots to understand, adapt, and move naturally within that reality.',
];

/** Unsplash — industrial / logistics (real-world operations). Hotlink OK per Unsplash license. */
const CORE_IDEA_IMAGE =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&q=80&auto=format&fit=crop';

/**
 * Hero headline: fade in after robot passes path center (te > 0.5), same as RobotGuide.
 * Dwell / drift use raw scroll p so timing stays predictable.
 */
const HERO_TITLE_TE = 0.52;
const HERO_TITLE_DWELL_END = 0.68;
const HERO_TITLE_UP_PX = 140;
const HERO_SUB_TE = 0.6;
const HERO_SUB_DWELL_END = 0.74;
const HERO_SUB_UP_PX = 110;

const MARKETING_IMG = {
  hotel: '/images/marketing/hotel-lobby.png',
  retail: '/images/marketing/retail-atrium.png',
  stadium: '/images/marketing/stadium.png',
};

const INDUSTRY_SECTIONS = [
  {
    key: 'hotels-restaurants',
    title: 'Hotels & Restaurants',
    body:
      'Movement should adapt to proximity, navigate tight spaces, and preserve the natural flow of human interaction.',
    variant: 'hotelRestaurant',
    productTo: '/products#argo-h',
    productCta: 'View ARGO-H',
  },
  {
    key: 'retail',
    title: 'Retail Spaces',
    body:
      'Movement should respond to shifting foot traffic and reposition in sync with the environment.',
    variant: 'retail',
    productTo: '/products#argo-r',
    productCta: 'View ARGO-R',
  },
  {
    key: 'stadium',
    title: 'Sports Grounds & Stadiums',
    body:
      'Movement should stay consistent across large grounds while maintaining distance from dense crowd activity.',
    variant: 'stadium',
    productTo: '/products#argo-s',
    productCta: 'View ARGO-S',
  },
];

function IndustryPhoto({ src, alt, className = '', aspectClass = 'aspect-[4/3]', objectPosition, reduceMotion }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border bg-neutral-900 ${aspectClass} ${className}`}
      style={{
        borderColor: 'rgba(234,234,234,0.1)',
        boxShadow: `0 0 0 1px ${C.glow}22, 0 16px 48px rgba(0,0,0,0.45)`,
      }}
    >
      <motion.img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={{ objectPosition: objectPosition || 'center' }}
        loading="lazy"
        decoding="async"
        initial={{ scale: 1 }}
        whileInView={reduceMotion ? {} : { scale: 1.06 }}
        transition={{ duration: 16, ease: 'linear' }}
        viewport={viewportOnce}
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/40 via-transparent to-black/10"
        aria-hidden
      />
    </div>
  );
}

const RoboticsLandingPage = () => {
  const reduceMotion = useReducedMotion();
  const heroTextRef = useRef(null);
  const heroSubRef = useRef(null);
  const coreVisualRef = useRef(null);
  /** Once hero scroll completes (robot parked), reveal rest; stays on if user scrolls back */
  const [restRevealed, setRestRevealed] = useState(false);

  // Hero text: fade in after center pass → hold (dwell) → move up with remaining scroll.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const p = getHeroProgress();
      const te = getHeroDriveT();

      let titleOpacity = 0;
      let titleY = 18;
      if (te > HERO_TITLE_TE) {
        titleOpacity = 1;
        if (p <= HERO_TITLE_DWELL_END) {
          titleY = 0;
        } else {
          const t = (p - HERO_TITLE_DWELL_END) / Math.max(0.001, 1 - HERO_TITLE_DWELL_END);
          titleY = -HERO_TITLE_UP_PX * Math.min(1, t);
        }
      }

      let subOpacity = 0;
      let subY = 16;
      if (te > HERO_SUB_TE) {
        subOpacity = 1;
        if (p <= HERO_SUB_DWELL_END) {
          subY = 0;
        } else {
          const t = (p - HERO_SUB_DWELL_END) / Math.max(0.001, 1 - HERO_SUB_DWELL_END);
          subY = -HERO_SUB_UP_PX * Math.min(1, t);
        }
      }

      if (heroTextRef.current) {
        gsap.set(heroTextRef.current, { opacity: titleOpacity, y: titleY });
      }
      if (heroSubRef.current) {
        gsap.set(heroSubRef.current, { opacity: subOpacity, y: subY });
      }
      if (p >= 1) setRestRevealed(true);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    tick();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (coreVisualRef.current) {
        gsap.fromTo(
          coreVisualRef.current,
          { y: 24, opacity: 0.9 },
          {
            y: 0,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#section-meet-argo',
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: true,
            },
          }
        );
      }

      gsap.utils.toArray('.immersive-card').forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 48 },
          {
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 40%',
              scrub: true,
            },
          }
        );
      });
    });

    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (restRevealed) {
      ScrollTrigger.refresh();
    }
  }, [restRevealed]);

  return (
    <div
      className="relative w-full min-h-screen max-w-[100%] overflow-x-clip selection:bg-violet-600/30"
      style={{
        backgroundColor: C.black,
        color: C.text,
      }}
    >
      <SEO
        title="ATSN Robotics | Intelligence in Motion"
        description="Robots that understand, adapt, and move naturally in human environments."
      />

      <RobotGuide />

      <main className="relative z-10 w-full pointer-events-none">
        <SiteHeader variant="overlay" />

        <section
          id="section-hero"
          className="relative w-full min-h-[240vh] flex flex-col items-center justify-center px-6 pt-24 pb-32 pointer-events-auto"
        >
          <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-5">
            <h1
              ref={heroTextRef}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.08]"
              style={{ color: C.text, opacity: 0 }}
            >
              Intelligence in Motion
            </h1>
            <p
              ref={heroSubRef}
              className="text-base sm:text-lg md:text-xl max-w-2xl font-normal leading-relaxed"
              style={{ color: C.secondary, opacity: 0 }}
            >
              Robots that understand, adapt, and move naturally in human environments.
            </p>
          </div>
          <p
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.35em] pointer-events-none"
            style={{ color: C.secondary }}
          >
            Scroll
          </p>
        </section>

        <div
          id="rest-after-hero"
          className="transition-[opacity,transform] duration-700 ease-out"
          style={{
            opacity: restRevealed ? 1 : 0,
            visibility: restRevealed ? 'visible' : 'hidden',
            pointerEvents: restRevealed ? 'auto' : 'none',
            transform: restRevealed ? 'translateY(0)' : 'translateY(20px)',
          }}
        >
        <section
          id="section-meet-argo"
          className="relative w-full py-24 md:py-32 px-6 md:px-12 lg:px-16 pointer-events-auto border-t"
          style={{ borderColor: 'rgba(234,234,234,0.06)' }}
        >
          <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            <div className="text-left space-y-8">
              <p
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: C.accent }}
              >
                Core idea
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight tracking-tight" style={{ color: C.text }}>
                Not just motion.
                <br />
                Intelligent motion.
              </h2>
              <div className="space-y-6 text-lg md:text-xl leading-relaxed max-w-xl" style={{ color: C.secondary }}>
                {CORE_PARAGRAPHS.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>

            <div
              ref={coreVisualRef}
              className="relative w-full min-h-[320px] lg:min-h-[420px] rounded-lg overflow-hidden border"
              style={{
                backgroundColor: C.surface,
                borderColor: 'rgba(234,234,234,0.1)',
                boxShadow: `0 0 0 1px ${C.glow}22, 0 24px 80px rgba(0,0,0,0.55)`,
              }}
            >
              <img
                src={CORE_IDEA_IMAGE}
                alt="Warehouse and logistics — operations in dynamic real-world environments"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, rgba(10,10,10,0.2) 0%, ${C.black}cc 78%, ${C.black}f2 100%)`,
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${C.accent}33 0%, transparent 55%)`,
                }}
              />
              <div className="relative h-full min-h-[320px] lg:min-h-[420px] flex flex-col justify-end p-8 md:p-10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: C.glow }}>
                  Real operations
                </p>
                <p className="text-xl md:text-2xl font-medium leading-snug max-w-md" style={{ color: C.text }}>
                  Built for spaces that change hour by hour — not lab conditions.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          id="section-industries"
          className="relative w-full py-20 md:py-28 px-6 pointer-events-auto border-t"
          style={{ backgroundColor: '#070707', borderColor: 'rgba(234,234,234,0.06)' }}
        >
          <div className="max-w-[1100px] mx-auto mb-16 md:mb-24 text-center lg:text-left px-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-3" style={{ color: C.accent }}>
              Where it works
            </p>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight" style={{ color: C.text }}>
              Movement that fits the venue
            </h2>
          </div>

          <div className="flex flex-col items-center gap-24 md:gap-32 pb-12">
            {INDUSTRY_SECTIONS.map((item) => (
              <article
                key={item.key}
                className="immersive-card w-full max-w-[1100px] px-4"
              >
                <div
                  className="rounded-xl border px-6 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: 'rgba(234,234,234,0.1)',
                    boxShadow: `0 0 0 1px ${C.glow}26, 0 20px 60px rgba(0,0,0,0.5)`,
                  }}
                >
                  {item.variant === 'retail' && (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
                      <div className="order-2 space-y-6 lg:order-1">
                        <h3 className="text-2xl md:text-3xl font-semibold" style={{ color: C.text }}>
                          {item.title}
                        </h3>
                        <p className="text-lg md:text-xl leading-relaxed" style={{ color: C.secondary }}>
                          {item.body}
                        </p>
                        {item.productTo && (
                          <Link
                            to={item.productTo}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-90"
                            style={{ color: C.glow }}
                          >
                            {item.productCta}
                            <span aria-hidden>→</span>
                          </Link>
                        )}
                      </div>
                      <div className="order-1 lg:order-2">
                        <IndustryPhoto
                          src={MARKETING_IMG.retail}
                          alt="Bright multi-level retail atrium with escalators, glass dome, and storefronts"
                          aspectClass="aspect-[16/10] lg:aspect-[4/3]"
                          reduceMotion={reduceMotion}
                        />
                      </div>
                    </div>
                  )}

                  {item.variant === 'hotelRestaurant' && (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
                      <div className="order-2 space-y-6 lg:order-1">
                        <h3 className="text-2xl md:text-3xl font-semibold" style={{ color: C.text }}>
                          {item.title}
                        </h3>
                        <p className="text-lg md:text-xl leading-relaxed" style={{ color: C.secondary }}>
                          {item.body}
                        </p>
                        {item.productTo && (
                          <Link
                            to={item.productTo}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-90"
                            style={{ color: C.glow }}
                          >
                            {item.productCta}
                            <span aria-hidden>→</span>
                          </Link>
                        )}
                      </div>
                      <div className="order-1 lg:order-2">
                        <IndustryPhoto
                          src={MARKETING_IMG.hotel}
                          alt="Upscale hotel lobby — calm, premium hospitality environment"
                          reduceMotion={reduceMotion}
                        />
                      </div>
                    </div>
                  )}

                  {item.variant === 'stadium' && (
                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14 lg:items-center">
                      <div className="order-1">
                        <IndustryPhoto
                          src={MARKETING_IMG.stadium}
                          alt="Evening match in a modern stadium — crowds, concourse, and floodlit pitch"
                          aspectClass="aspect-[16/10] lg:aspect-[4/3]"
                          reduceMotion={reduceMotion}
                        />
                      </div>
                      <div className="order-2 space-y-6">
                        <h3 className="text-2xl md:text-3xl font-semibold" style={{ color: C.text }}>
                          {item.title}
                        </h3>
                        <p className="text-lg md:text-xl leading-relaxed" style={{ color: C.secondary }}>
                          {item.body}
                        </p>
                        {item.productTo && (
                          <Link
                            to={item.productTo}
                            className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors hover:opacity-90"
                            style={{ color: C.glow }}
                          >
                            {item.productCta}
                            <span aria-hidden>→</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id="section-real-world"
          className="relative w-full min-h-[70vh] flex flex-col justify-center items-center px-6 py-24 pointer-events-auto"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, transparent 35%, ${C.black}aa 100%)`,
            }}
          />
          <div className="relative z-10 text-center w-full max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-semibold tracking-tight" style={{ color: C.text }}>
              The real world doesn&apos;t wait
            </h2>
            <p className="text-lg md:text-xl leading-relaxed font-normal" style={{ color: C.secondary }}>
              Uneven floors, shifting obstacles, and schedules that change by the hour. Motion here
              is tuned for that mess — not a spotless lab.
            </p>
          </div>
        </section>

        <section
          id="section-footer"
          className="relative w-full min-h-[50vh] flex items-end pb-8 pointer-events-auto"
        >
          <SiteFooter />
        </section>
        </div>
      </main>
    </div>
  );
};

export default RoboticsLandingPage;
