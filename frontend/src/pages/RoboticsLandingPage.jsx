import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import SEO from '../components/SEO';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import RobotGuide from '../components/robotics/RobotGuide';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import {
  getHeroRobotProgress,
  easeInOutCubic,
} from '../utils/heroScrollProgress';

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

/** Robot phase: 1.5 viewports of scroll before page content scrolls */
const ROBOT_PHASE_VH = 1.5;
/** Wipe-in: each char reveals as robot passes (te-based threshold) */
const WIPE_START = 0.12;
const WIPE_RANGE = 0.55;

const HERO_TITLE = 'Intelligence in Motion';
const HERO_SUB = 'Robots that understand, adapt, and move naturally in human environments.';

const INDUSTRY_CARDS = [
  {
    title: 'Hotels & Restaurants',
    body:
      'Movement should adapt to proximity, navigate tight spaces, and preserve the natural flow of human interaction.',
    productTo: '/products#argo-h',
    productCta: 'View ARGO-H',
  },
  {
    title: 'Retail Spaces',
    body:
      'Movement should respond to shifting foot traffic and reposition in sync with the environment.',
    productTo: '/products#argo-r',
    productCta: 'View ARGO-R',
  },
  {
    title: 'Sports Grounds & Stadiums',
    body:
      'Movement should stay consistent across large grounds while maintaining distance from dense crowd activity.',
    productTo: '/products#argo-s',
    productCta: 'View ARGO-S',
  },
];

const RoboticsLandingPage = () => {
  const titleCharRefs = useRef([]);
  const subCharRefs = useRef([]);
  const coreVisualRef = useRef(null);
  const heroProgressRef = useRef(0);
  const scrollRef = useRef(0);
  const lenisRef = useRef(null);
  const [restRevealed, setRestRevealed] = useState(false);
  const heroOverlayRef = useRef(null);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    root.classList.add('robotics-landing-hide-scrollbar');
    body.classList.add('robotics-landing-hide-scrollbar');
    return () => {
      root.classList.remove('robotics-landing-hide-scrollbar');
      body.classList.remove('robotics-landing-hide-scrollbar');
    };
  }, []);

  // Lenis smooth scroll + hero tick (robot progress, curtain text)
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);
    const rafCb = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(rafCb);
    gsap.ticker.lagSmoothing(0);

    const tick = () => {
      const scrollY = lenis.scroll;
      scrollRef.current = scrollY;
      const vh = window.innerHeight;
      const robotP = getHeroRobotProgress(scrollY, vh, ROBOT_PHASE_VH);
      const te = easeInOutCubic(robotP);

      heroProgressRef.current = robotP;

      const phaseHeight = ROBOT_PHASE_VH * vh;
      if (scrollY >= phaseHeight) setRestRevealed(true);

      if (heroOverlayRef.current) {
        const overlayOpacity = scrollY >= phaseHeight ? 0 : 1;
        gsap.set(heroOverlayRef.current, { opacity: overlayOpacity });
      }

      const nTitle = HERO_TITLE.length;
      titleCharRefs.current.forEach((el, i) => {
        if (el) {
          const thresh = WIPE_START + (i / nTitle) * WIPE_RANGE;
          gsap.set(el, { opacity: te > thresh ? 1 : 0 });
        }
      });
      const nSub = HERO_SUB.length;
      subCharRefs.current.forEach((el, i) => {
        if (el) {
          const thresh = WIPE_START + (i / nSub) * WIPE_RANGE;
          gsap.set(el, { opacity: te > thresh ? 1 : 0 });
        }
      });
    };

    lenis.on('scroll', tick);
    tick();

    return () => {
      gsap.ticker.remove(rafCb);
      lenis.destroy();
      lenisRef.current = null;
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

      <RobotGuide heroProgressRef={heroProgressRef} scrollRef={scrollRef} />

      {/* Outside <main> so z-index stacks above the z-10 content layer and WebGL canvas */}
      <SiteHeader variant="overlay" />

      <main className="relative z-10 w-full pointer-events-none">
        <section id="section-hero" className="relative w-full pointer-events-auto">
          {/* Phase 1 spacer: creates scroll distance for robot animation (250vh = ~1.5 vp scroll + buffer) */}
          <div style={{ height: '250vh' }} aria-hidden="true" />
          {/* Fixed hero content during phase 1; fades out when robot exits */}
          <div
            ref={heroOverlayRef}
            className="fixed inset-0 flex flex-col items-center justify-center px-6 pt-24 pb-32 pointer-events-none"
            style={{ zIndex: 10 }}
          >
            <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-5">
              <h1
                className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.08]"
                style={{ color: C.text }}
              >
                {HERO_TITLE.split('').map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => { titleCharRefs.current[i] = el; }}
                    style={{ opacity: 0 }}
                  >
                    {char}
                  </span>
                ))}
              </h1>
              <p
                className="text-base sm:text-lg md:text-xl max-w-2xl font-normal leading-relaxed"
                style={{ color: C.secondary }}
              >
                {HERO_SUB.split('').map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => { subCharRefs.current[i] = el; }}
                    style={{ opacity: 0 }}
                  >
                    {char}
                  </span>
                ))}
              </p>
            </div>
            <p
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[11px] uppercase tracking-[0.35em]"
              style={{ color: C.secondary }}
            >
              Scroll
            </p>
          </div>
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
            {INDUSTRY_CARDS.map((item) => (
              <article
                key={item.title}
                className="immersive-card w-full max-w-[960px] px-4"
              >
                <div
                  className="rounded-xl border px-8 py-10 md:px-12 md:py-12"
                  style={{
                    backgroundColor: C.surface,
                    borderColor: 'rgba(234,234,234,0.1)',
                    boxShadow: `0 0 0 1px ${C.glow}26, 0 20px 60px rgba(0,0,0,0.5)`,
                  }}
                >
                  <h3 className="text-2xl md:text-3xl font-semibold mb-6" style={{ color: C.text }}>
                    {item.title}
                  </h3>
                  <p className="text-lg md:text-xl leading-relaxed max-w-3xl" style={{ color: C.secondary }}>
                    {item.body}
                  </p>
                  {item.productTo && (
                    <Link
                      to={item.productTo}
                      className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold transition-colors hover:opacity-90"
                      style={{ color: C.glow }}
                    >
                      {item.productCta}
                      <span aria-hidden>→</span>
                    </Link>
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
