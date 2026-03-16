import React, { useEffect } from 'react';
import SEO from '../components/SEO';
import RobotGuide from '../components/robotics/RobotGuide';
import BlurText from '../components/ui/BlurText';
import Magnet from '../components/ui/Magnet';
import TiltCard from '../components/ui/TiltCard';
import ScrollReveal from '../components/ui/ScrollReveal';
import CardSwap, { Card } from '../components/ui/CardSwap';
import LightRays from '../components/ui/LightRays';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const featureCards = [
  {
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    label: 'Autonomous Navigation',
    desc: 'Independently plans and executes movement from origin to destination without manual intervention.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    label: 'Adaptive to Change',
    desc: 'Responds to obstacles, movement shifts, and environmental variations in real time.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'Human-Centric Design',
    desc: 'Built to operate safely and naturally within human spaces and structured indoor environments.',
  },
  {
    icon: (
      <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    label: 'Purpose-Built for Goods Movement',
    desc: 'Designed to transport items efficiently, reducing repetitive manual effort in everyday operations.',
  },
];

const industryCards = [
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: 'Hotels',
    desc: 'Automate room service, luggage handling, and supply delivery across floors without staff effort.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'Warehouses',
    desc: 'Navigate complex storage environments, pick and move goods with precision and speed.',
  },
  {
    icon: (
      <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Stadium & Ground Support',
    desc: 'Support large-scale logistics, vendor stocking, and equipment movement across expansive venues.',
  },
];

const RoboticsLandingPage = () => {
  const cardW = typeof window !== 'undefined' ? Math.min(900, Math.floor(window.innerWidth * 0.61)) : 900;
  const cardH = Math.round(cardW * 0.4);
  const cardW3 = Math.round(cardW * 0.75);
  const cardH3 = Math.round(cardH * 0.75);
  const cardW2 = Math.round(cardW3 * 1.33);
  const cardH2 = Math.round(cardH3 * 1.33);

  useEffect(() => {
    gsap.fromTo('.hero-text',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.2 }
    );

    gsap.utils.toArray('.feature-card').forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 65%',
            scrub: true,
          }
        }
      );
    });

    gsap.utils.toArray('.industry-card').forEach((card) => {
      gsap.fromTo(card,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'top 65%',
            scrub: true,
          }
        }
      );
    });
  }, []);

  return (
    <div className="relative w-full bg-[#050505] text-white overflow-hidden selection:bg-cyan-500/30">
      <SEO
        title="ATSN Robotics | Intelligent Motion"
        description="Experience the future of autonomous movement."
      />

      {/* Fixed Robot Guide Layer (Z-0) */}
      <RobotGuide />

      {/* Fixed LightRays layer — above robot (z-1), screen blend so robot stays visible */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      >
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={1}
          lightSpread={0.5}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.1}
          noiseAmount={0}
          distortion={0}
          pulsating={false}
          fadeDistance={1}
          saturation={1}
        />
      </div>

      {/* Foreground Content (Z-10) */}
      <main className="relative z-10 w-full pointer-events-none">

        {/* Fixed Header */}
        <header className="fixed top-0 left-0 w-full px-10 py-6 flex justify-between items-center z-50 mix-blend-difference pointer-events-auto">
          <div className="text-2xl font-bold tracking-tight">ATSN ROBOTICS</div>
          <Magnet padding={60} magnetStrength={3}>
            <button className="px-6 py-2 border border-white/20 rounded-full hover:bg-white/10 transition">
              Book Demo
            </button>
          </Magnet>
        </header>

        {/* ── SECTION 1: HERO ── */}
        <section
          id="section-hero"
          className="relative w-full min-h-screen flex flex-col items-center justify-center px-6 pointer-events-auto"
        >
          <h1 className="hero-text text-5xl md:text-8xl font-bold tracking-tighter text-center leading-[1.05] flex flex-col items-center gap-2">
            <BlurText
              text="Intelligent Motion"
              delay={120}
              direction="top"
              stepDuration={0.4}
              className="text-white"
            />
            <BlurText
              text="Autonomous Future"
              delay={120}
              direction="top"
              stepDuration={0.4}
              animationFrom={{ filter: 'blur(12px)', opacity: 0, y: 40 }}
              className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
            />
          </h1>
          <div className="hero-text mt-6 text-lg md:text-2xl text-neutral-400 text-center font-light tracking-wide max-w-xl">
            <BlurText
              text="Let's Build the Future Together"
              delay={80}
              direction="top"
              stepDuration={0.3}
              className="text-neutral-400"
            />
          </div>
          <div className="absolute bottom-10 flex items-center justify-center animate-bounce pointer-events-none">
            <span className="text-sm font-medium uppercase tracking-widest text-neutral-500">Scroll</span>
          </div>
        </section>

        {/* ── SECTION 2: MEET ARGO ── */}
        <section
          id="section-meet-argo"
          className="relative w-full pointer-events-auto"
          style={{ minHeight: '246vh' }}
        >

          {/* ── Stage 1: Robot Introduction (120vh) ──
               Text sits in the upper viewport; robot appears at visual center-bottom */}
          <div
            className="flex flex-col items-center justify-start pointer-events-none select-none"
            style={{ height: '67vh', paddingTop: '10vh' }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-5">
              Meet ARGO
            </p>
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter text-center leading-[1.05]">
              <BlurText
                text="ARGO"
                delay={100}
                direction="top"
                stepDuration={0.45}
                className="text-white"
              />
            </h2>
          </div>

          {/* ── Stage 2: Robot Description (84vh) ──
               Two-column: description on left, right 35vw reserved for robot */}
          <div
            className="flex items-center pointer-events-auto"
            style={{ height: '67vh' }}
          >
            {/* Left content column */}
            <div className="flex-1 flex flex-col justify-center items-center px-10 md:px-24">
              <ScrollReveal
                enableBlur
                baseOpacity={0.1}
                baseRotation={2}
                blurStrength={3}
                containerClassName="text-neutral-300 text-2xl md:text-3xl leading-relaxed max-w-2xl text-center"
                wordAnimationEnd="bottom 70%"
              >
                ARGO (Autonomous Robot for Goods and Operations) is designed to move intelligently from one point to another, handling dynamic environments and real-world perturbations with ease.
              </ScrollReveal>
            </div>
            {/* Right robot zone spacer */}
            <div style={{ width: '35vw', flexShrink: 0 }} />
          </div>

          {/* ── Stage 3: CardSwap Section (140vh) ──
               Large fluid cards on left, robot remains visible on right */}
          <div
            className="flex items-center pointer-events-auto"
            style={{ height: '112vh' }}
          >
            {/* Left content column */}
            <div className="flex-1 flex flex-col justify-center px-10 md:px-16">
              <div
                style={{
                  width: 'min(898px, 61vw)',
                  minWidth: '320px',
                  height: '420px',
                  position: 'relative',
                }}
              >
                <CardSwap
                  width={cardW2}
                  height={cardH2}
                  flipMode
                  delay={5000}
                  swapOnHover
                  swapOnClick
                  containerAlign="center"
                >
                  {featureCards.map((card) => (
                    <Card key={card.label}>
                      <div className="feature-card h-full p-10 flex flex-col gap-5">
                        <div>{card.icon}</div>
                        <h3 className="text-xl font-semibold text-white leading-snug">
                          {card.label}
                        </h3>
                        <p className="text-neutral-400 text-base leading-relaxed">{card.desc}</p>
                      </div>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </div>
            {/* Right robot zone spacer */}
            <div style={{ width: '35vw', flexShrink: 0 }} />
          </div>

        </section>

        {/* ── SECTION 3: ARGO FOR INDUSTRIES ── */}
        <section
          id="section-industries"
          className="relative w-full min-h-screen flex flex-col justify-center px-10 md:px-24 py-[15vh] pointer-events-auto"
        >
          <div className="w-full max-w-7xl mx-auto">
            <p className="text-xs font-bold tracking-widest uppercase text-cyan-400 mb-4">
              Applications
            </p>
            <h2 className="text-4xl md:text-6xl font-bold mb-16 leading-tight">
              Argo for Industries
            </h2>

            <div
              style={{
                height: '315px',
                position: 'relative',
                width: 'min(675px, 46vw)',
                minWidth: '280px',
              }}
            >
              <CardSwap
                width={cardW3}
                height={cardH3}
                flipMode
                delay={4000}
                swapOnHover
                swapOnClick
                containerAlign="center"
              >
                {industryCards.map((card) => (
                  <Card key={card.title}>
                    <div className="industry-card h-full p-10 flex flex-col gap-5">
                      <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                        {card.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-white">{card.title}</h3>
                      <p className="text-neutral-400 text-base leading-relaxed">{card.desc}</p>
                    </div>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: THE REAL WORLD ── */}
        {/* Background must stay transparent so the robot parking animation is visible */}
        <section
          id="section-real-world"
          className="relative w-full min-h-[80vh] flex flex-col justify-center items-center px-10 py-[15vh] pointer-events-auto"
        >
          {/* Subtle radial vignette that does NOT cover the robot canvas below */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,5,5,0.55)_100%)] pointer-events-none" />
          <div className="relative z-10 text-center w-full max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 text-white drop-shadow-2xl">
              The Real World.
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed font-light">
              From dynamic logistics corridors to complex manufacturing floors, our AI adapts
              to unstructured environments seamlessly.
            </p>
          </div>
        </section>

        {/* ── SECTION 5: FOOTER ── */}
        {/* No solid background here either — robot dissolves visibly before footer content overlaps */}
        <section
          id="section-footer"
          className="relative w-full min-h-[60vh] flex items-end pb-10 pointer-events-auto"
        >
          <footer className="w-full border-t border-neutral-800/50 pt-16 px-10 md:px-32 bg-neutral-950/80 backdrop-blur-sm">
            <div className="w-full max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-white text-2xl font-bold mb-4 tracking-tighter">ATSN Robotics</h4>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Building the autonomous future, one intelligent movement at a time.
                </p>
              </div>
              <div>
                <h4 className="text-neutral-200 font-semibold mb-6 text-sm uppercase tracking-wider">Company</h4>
                <ul className="text-neutral-500 text-sm space-y-4">
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">About Us</li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">Careers</li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">Contact</li>
                </ul>
              </div>
              <div>
                <h4 className="text-neutral-200 font-semibold mb-6 text-sm uppercase tracking-wider">Legal</h4>
                <ul className="text-neutral-500 text-sm space-y-4">
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">Terms of Service</li>
                </ul>
              </div>
              <div>
                <h4 className="text-neutral-200 font-semibold mb-6 text-sm uppercase tracking-wider">Connect</h4>
                <ul className="text-neutral-500 text-sm space-y-4">
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">LinkedIn</li>
                  <li className="hover:text-cyan-400 transition-colors cursor-pointer">Twitter</li>
                </ul>
              </div>
            </div>
          </footer>
        </section>

      </main>
    </div>
  );
};

export default RoboticsLandingPage;
