import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import {
  viewportOnce,
  heroContainer,
  heroItem,
  fadeUp,
  fadeUpSmall,
  scaleIn,
  easeOut,
} from '../utils/marketingMotion.js';

/** ATSN Robotics / landing palette — ARGO section uses only these */
const BRAND = {
  black: '#0A0A0A',
  deep: '#070707',
  surface: '#1E1E1E',
  text: '#EAEAEA',
  secondary: '#A0A0A0',
  accent: '#7C3AED',
  glow: '#C084FC',
  /** Section kicker — lavender from reference mock */
  label: '#B993FF',
};

/** Shared neon underline under uppercase section labels */
const SECTION_LABEL_LINE_STYLE = {
  background: `linear-gradient(90deg, transparent 0%, rgba(124,58,237,0.2) 10%, ${BRAND.accent} 32%, ${BRAND.glow} 50%, ${BRAND.accent} 68%, rgba(124,58,237,0.2) 90%, transparent 100%)`,
  boxShadow: `0 0 14px rgba(192, 132, 252, 0.75), 0 0 28px rgba(124, 58, 237, 0.4), 0 0 42px rgba(124, 58, 237, 0.15)`,
};

function AboutPageSectionHeading({
  id,
  children,
  align = 'center',
  reduceMotion,
  className = '',
  /** When align is `start`, center label + line below `lg` (stacked / narrow layouts). */
  centerWhenNarrow = false,
}) {
  const center = align === 'center';
  const textAlignClass = center
    ? 'text-center'
    : centerWhenNarrow
      ? 'text-center lg:text-left'
      : 'text-left';
  const lineClass = center
    ? 'mx-auto origin-center max-w-md md:max-w-lg lg:max-w-xl'
    : centerWhenNarrow
      ? 'mx-auto origin-center max-w-md md:max-w-lg lg:mx-0 lg:mr-auto lg:ml-0 lg:origin-left lg:max-w-md xl:max-w-lg'
      : 'mr-auto origin-left max-w-sm md:max-w-md lg:max-w-lg';

  return (
    <div className={`${textAlignClass} ${className}`}>
      <h2
        id={id}
        className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-[0.22em] sm:tracking-[0.24em] md:tracking-[0.26em] mb-4 md:mb-5"
        style={{ color: BRAND.label }}
      >
        {children}
      </h2>
      <motion.div
        className={`h-[2px] rounded-full ${lineClass}`}
        style={SECTION_LABEL_LINE_STYLE}
        initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
        whileInView={reduceMotion ? {} : { scaleX: 1, opacity: 1 }}
        viewport={viewportOnce}
        transition={{ duration: 0.9, ease: easeOut, delay: 0.1 }}
      />
    </div>
  );
}

const argoCardVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: easeOut, delay: 0.08 * i },
  }),
};

const HERO_BG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80';

const MARKETING_IMG = {
  hotel: '/images/marketing/hotel-lobby.png',
  retail: '/images/marketing/retail-atrium.png',
  stadium: '/images/marketing/stadium.png',
};

/** Accent image for OUR VISION — luxury hospitality context */
const VISION_IMAGE = MARKETING_IMG.hotel;

const ARGO_PILLARS = [
  {
    title: 'Graceful Hospitality',
    body:
      'An extension of warm hospitality. From presenting a beautifully plated dinner to softly gliding down a corridor with fresh linens and amenities, ARGO ensures every guest feels deeply cared for. It handles the journey with whisper-quiet precision and seamless digital payments, leaving human interactions warm, personal, and completely uninterrupted.',
    media: {
      kind: 'single',
      src: MARKETING_IMG.hotel,
      alt: 'Luxury hotel lobby — refined, calm hospitality setting',
    },
  },
  {
    title: 'Curated Retail Spaces',
    body:
      'A beautifully immersive atmosphere. ARGO acts as a subtle companion on the retail floor, carrying items and softly filling the boutique with curated ambient audio. It navigates gently around shoppers, moving in perfect sync with the flow of the room to create a flawless, inviting environment.',
    media: {
      kind: 'single',
      src: MARKETING_IMG.retail,
      alt: 'Spacious luxury retail atrium — multiple levels, escalators, and warm architectural lighting',
    },
  },
  {
    title: 'High-Energy Venues & Stadiums',
    body:
      'Premium care in the crowd. Even in the highest energy stadiums, ARGO brings a sense of calm, VIP reliability. Whether delivering chilled beverages directly to your seat or safely navigating a dense concourse, its robust, waterproof design ensures fans are perfectly cared for without ever missing a play.',
    media: {
      kind: 'single',
      src: MARKETING_IMG.stadium,
      alt: 'Stadium at night — packed stands, concourse, and floodlit pitch',
    },
  },
];

function ImageFrame({ src, alt, className = '', imgStyle }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-white/[0.08] bg-neutral-900 shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_24px_64px_-16px_rgba(0,0,0,0.75)] ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-violet-600/20 via-transparent to-transparent z-[1]"
        aria-hidden
      />
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
        style={imgStyle}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

const AboutUsPage = () => {
  const reduceMotion = useReducedMotion();
  const heroBgTransition = reduceMotion ? { duration: 0 } : { duration: 1.35, ease: easeOut };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <SEO
        title="About ATSN AI | Designing the future of human experiences"
        description="ATSN AI builds autonomous ecosystems for hotels, retail, and stadiums. ARGO delivers graceful spatial intelligence so technology quietly anticipates every moment."
      />

      <SiteHeader variant="solid" />

      {/* 1. Hero — global mission */}
      <section className="relative min-h-[340px] md:min-h-[420px] flex items-end pb-14 md:pb-20 pt-28 md:pt-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={reduceMotion ? {} : { scale: 1 }}
          transition={heroBgTransition}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/92 to-violet-950/40"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#050505]/50" aria-hidden />
        <motion.div
          className="relative z-10 w-full max-w-3xl lg:max-w-4xl mx-auto px-6 text-center"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={heroItem}
            className="mx-auto w-full max-w-lg text-center pb-8 md:pb-10 lg:pb-14 xl:pb-16"
          >
            <h2
              className="text-xs sm:text-sm md:text-base lg:text-lg font-bold uppercase tracking-[0.22em] sm:tracking-[0.24em] md:tracking-[0.26em] mb-4 md:mb-5"
              style={{ color: BRAND.label }}
            >
              About ATSN AI
            </h2>
            <motion.div
              className="mx-auto h-[2px] w-full max-w-md origin-center rounded-full sm:max-w-md md:max-w-lg lg:max-w-xl"
              style={SECTION_LABEL_LINE_STYLE}
              initial={reduceMotion ? false : { scaleX: 0, opacity: 0 }}
              animate={reduceMotion ? {} : { scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.9, ease: easeOut, delay: reduceMotion ? 0 : 0.42 }}
              aria-hidden
            />
          </motion.div>
          <motion.h1
            variants={heroItem}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[3.5rem] 2xl:text-[3.85rem] font-bold tracking-tight text-white mb-6 leading-[1.1] sm:leading-[1.08] max-w-4xl mx-auto"
          >
            Designing the future of human experiences.
          </motion.h1>
          <motion.div variants={heroItem} className="text-base md:text-lg text-neutral-300 leading-relaxed text-left sm:text-center max-w-2xl mx-auto space-y-4">
            <p>
              At ATSN AI, we build autonomous ecosystems that transform how people experience the world&apos;s
              most dynamic spaces. We believe that whether you are checking into a luxury suite, exploring a
              beautifully curated boutique, or cheering at a live match, technology should quietly anticipate
              your needs—making every single moment feel effortless.
            </p>
          </motion.div>
        </motion.div>
      </section>

      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        <article className="space-y-20 md:space-y-28">
          {/* 2. OUR VISION */}
          <section
            aria-labelledby="our-vision-heading"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="order-2 lg:order-1"
            >
              <ImageFrame
                src={VISION_IMAGE}
                alt="Luxury hotel lobby — refined spaces where quiet service matters"
                className="aspect-[4/3] w-full"
              />
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="order-1 lg:order-2 space-y-6"
            >
              <AboutPageSectionHeading
                id="our-vision-heading"
                align="start"
                centerWhenNarrow
                reduceMotion={reduceMotion}
                className="mb-2"
              >
                OUR VISION
              </AboutPageSectionHeading>
              <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-[2.75rem] font-semibold tracking-tight text-white leading-snug text-center lg:text-left">
                Technology that protects the magic.
              </h3>
              <div className="space-y-5 text-base md:text-lg text-neutral-300 leading-relaxed text-center lg:text-left">
                <p>
                  The most beautiful experiences—an intimate dinner, a seamless shopping trip, the thrilling
                  energy of a stadium—all share one thing: you are entirely in the moment. But too often,
                  logistical friction interrupts that magic.
                </p>
                <p>
                  We founded ATSN AI to change that. We don&apos;t just build hardware; we engineer graceful
                  spatial intelligence. The ARGO platform is designed to understand the delicate choreography
                  of human connection. It takes care of the background logistics with quiet, intuitive elegance,
                  ensuring that you can simply relax and enjoy the foreground.
                </p>
              </div>
            </motion.div>
          </section>

          <motion.div
            className="h-px bg-gradient-to-r from-transparent via-violet-500/25 to-transparent"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: easeOut }}
            aria-hidden
          />

          {/* 3. THE ARGO EXPERIENCE — brand band + motion */}
          <section
            aria-labelledby="argo-experience-heading"
            className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden px-5 sm:px-8 md:px-12 py-16 md:py-24"
            style={{
              background: `linear-gradient(165deg, ${BRAND.deep} 0%, ${BRAND.black} 42%, rgba(124, 58, 237, 0.06) 50%, ${BRAND.black} 58%, ${BRAND.deep} 100%)`,
              borderTop: `1px solid rgba(124, 58, 237, 0.12)`,
              borderBottom: `1px solid rgba(124, 58, 237, 0.1)`,
            }}
          >
            {/* Soft brand glow orbs — accent + glow only */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
              <motion.div
                className="absolute -top-32 left-[12%] h-[min(420px,55vw)] w-[min(420px,55vw)] rounded-full opacity-[0.22] blur-[100px] md:blur-[120px]"
                style={{
                  background: `radial-gradient(circle, ${BRAND.accent} 0%, transparent 68%)`,
                }}
                animate={
                  reduceMotion
                    ? {}
                    : {
                        x: [0, 24, 0],
                        y: [0, 16, 0],
                        opacity: [0.18, 0.28, 0.18],
                      }
                }
                transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute -bottom-40 right-[8%] h-[min(380px,50vw)] w-[min(380px,50vw)] rounded-full opacity-[0.2] blur-[100px] md:blur-[120px]"
                style={{
                  background: `radial-gradient(circle, ${BRAND.glow} 0%, transparent 65%)`,
                }}
                animate={
                  reduceMotion
                    ? {}
                    : {
                        x: [0, -20, 0],
                        y: [0, -12, 0],
                        opacity: [0.15, 0.26, 0.15],
                      }
                }
                transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
              />
              <motion.div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                  backgroundImage: `linear-gradient(105deg, transparent 38%, ${BRAND.glow} 50%, transparent 62%)`,
                  backgroundSize: '220% 100%',
                  backgroundPosition: '0% 0%',
                }}
                animate={
                  reduceMotion
                    ? {}
                    : { backgroundPosition: ['0% 0%', '100% 0%', '0% 0%'] }
                }
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                aria-hidden
              />
            </div>

            <div className="relative z-[1] mx-auto max-w-6xl space-y-12 md:space-y-14">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.6, ease: easeOut }}
                className="text-center"
              >
                <AboutPageSectionHeading
                  id="argo-experience-heading"
                  align="center"
                  reduceMotion={reduceMotion}
                >
                  THE ARGO EXPERIENCE
                </AboutPageSectionHeading>
              </motion.div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-7">
                {ARGO_PILLARS.map(({ title, body, media }, index) => (
                  <motion.article
                    key={title}
                    custom={index}
                    variants={argoCardVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    whileHover={
                      reduceMotion
                        ? {}
                        : {
                            y: -6,
                            transition: { type: 'spring', stiffness: 400, damping: 22 },
                          }
                    }
                    className="group relative rounded-xl px-6 py-8 md:px-7 md:py-9"
                    style={{
                      backgroundColor: BRAND.surface,
                      border: '1px solid rgba(234, 234, 234, 0.08)',
                      boxShadow: `0 0 0 1px rgba(124, 58, 237, 0.08), 0 20px 56px -24px rgba(0, 0, 0, 0.65)`,
                    }}
                  >
                    <motion.div
                      className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(135deg, rgba(124, 58, 237, 0.12) 0%, transparent 45%, rgba(192, 132, 252, 0.06) 100%)`,
                        boxShadow: `inset 0 0 0 1px rgba(192, 132, 252, 0.12)`,
                      }}
                      aria-hidden
                    />
                    {media?.kind === 'single' && (
                      <motion.div
                        className="relative z-[1] mb-5 aspect-[4/3] w-full overflow-hidden rounded-xl border border-white/[0.08] bg-neutral-900 shadow-[0_0_0_1px_rgba(139,92,246,0.12),0_20px_48px_-16px_rgba(0,0,0,0.65)]"
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                        viewport={viewportOnce}
                        transition={{ duration: 0.55, ease: easeOut }}
                      >
                        <motion.img
                          src={media.src}
                          alt={media.alt}
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                          initial={{ scale: 1 }}
                          whileInView={reduceMotion ? {} : { scale: 1.05 }}
                          transition={{ duration: 14, ease: 'linear' }}
                          viewport={viewportOnce}
                        />
                        <div
                          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-tr from-violet-600/20 via-transparent to-transparent"
                          aria-hidden
                        />
                      </motion.div>
                    )}
                    <div
                      className="mb-4 flex items-center gap-3"
                      style={{ color: BRAND.accent }}
                    >
                      <motion.span
                        className="inline-flex h-2 w-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: BRAND.glow,
                          boxShadow: `0 0 14px ${BRAND.glow}`,
                        }}
                        animate={
                          reduceMotion
                            ? {}
                            : { scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }
                        }
                        transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: index * 0.35 }}
                        aria-hidden
                      />
                      <h3
                        className="text-xl font-semibold tracking-tight md:text-2xl lg:text-[1.65rem]"
                        style={{ color: BRAND.text }}
                      >
                        {title}
                      </h3>
                    </div>
                    <p
                      className="relative text-sm leading-relaxed md:text-base"
                      style={{ color: BRAND.secondary }}
                    >
                      {body}
                    </p>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* 4. THE BUILDERS */}
          <motion.section
            aria-labelledby="builders-heading"
            variants={fadeUpSmall}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="rounded-2xl border border-violet-500/20 bg-gradient-to-br from-violet-950/35 via-neutral-950/90 to-[#0a0a0a] px-8 py-12 md:px-14 md:py-16 text-center"
          >
            <AboutPageSectionHeading
              id="builders-heading"
              align="center"
              reduceMotion={reduceMotion}
              className="mb-8"
            >
              THE BUILDERS
            </AboutPageSectionHeading>
            <h3 className="text-3xl md:text-4xl lg:text-5xl xl:text-[2.75rem] font-semibold text-white tracking-tight mb-6 leading-snug">
              Engineers of empathy.
            </h3>
            <p className="text-base md:text-lg text-neutral-300 leading-relaxed max-w-3xl mx-auto mb-10">
              The ATSN AI team brings together brilliant minds in robotics, computer vision, and spatial design.
              But more importantly, we study human emotion and movement—from the subtle, quiet cues of luxury
              service to the collective joy of a live crowd. We are united by a single obsession: creating
              beautiful, intuitive hardware that feels entirely natural, making every space it enters feel a
              little more magical for the people inside.
            </p>
            <p className="text-neutral-400 text-sm md:text-base mb-6">
              Step into the future of seamless spaces.
            </p>
            <div className="flex justify-center">
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-violet-500/45 bg-violet-600/10 px-7 py-3.5 text-sm font-semibold text-violet-200 shadow-[0_0_0_1px_rgba(192,132,252,0.08)] transition-colors hover:border-violet-400/70 hover:bg-violet-500/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]"
              >
                <span>Get in touch</span>
                <span
                  className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600/30 text-white transition-transform group-hover:translate-x-0.5 group-hover:bg-violet-500/40"
                  aria-hidden
                >
                  <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                <span className="sr-only"> — opens the contact page</span>
              </Link>
            </div>
          </motion.section>
        </article>
      </main>

      <SiteFooter className="mt-8" />
    </div>
  );
};

export default AboutUsPage;
