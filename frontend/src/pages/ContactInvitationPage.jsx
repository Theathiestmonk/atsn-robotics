import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import ContactLocationSection from '../components/ContactLocationSection.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import {
  viewportOnce,
  heroContainer,
  heroItem,
  cardLift,
  fadeUpSmall,
  gridStagger,
  gridItem,
  easeOut,
} from '../utils/marketingMotion.js';

const CONTACT_API_URL =
  import.meta.env.VITE_CONTACT_API_URL?.trim() || '/api/contact';

const FORMSPREE_FALLBACK =
  import.meta.env.VITE_FORMSPREE_FORM_ID && import.meta.env.VITE_CONTACT_USE_FORMSPREE === 'true'
    ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`
    : null;

const ENGINEERING_MAILTO =
  'mailto:services@atsnai.com?subject=Engineering%20inquiry&body=Hi%20ATSN%20team%2C%0A%0A';

/** Tech / hardware — distinct from contact page hero */
const HERO_BG =
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2000&q=80';

const inputClass =
  'w-full px-4 py-3.5 rounded-xl bg-[#141416] border border-neutral-700/55 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-violet-500/35 focus:border-violet-500/70 transition-colors';

const labelClass = 'block text-sm font-medium text-neutral-300 mb-2';

const iconWrap =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/25 shadow-[0_0_24px_-4px_rgba(167,139,250,0.35)]';

/** Invite card — neutral surfaces + violet only as accent (no heavy purple gradient) */
const INVITE = {
  formBg: '#0c0c0c',
  asideGradient: 'linear-gradient(180deg, #131316 0%, #0f0f12 38%, #0c0c0f 72%, #09090b 100%)',
  asideAccentWash:
    'radial-gradient(ellipse 120% 80% at 100% 0%, rgba(124, 58, 237, 0.07) 0%, transparent 55%)',
  borderAside: 'rgba(124, 58, 237, 0.14)',
  cardBg: 'rgba(20, 20, 24, 0.85)',
  cardBorder: 'rgba(234, 234, 234, 0.08)',
};

/**
 * Open invitation — same ATSN dark + violet accent as landing & /contact
 */
const ContactInvitationPage = () => {
  const reduceMotion = useReducedMotion();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitErrorDetail, setSubmitErrorDetail] = useState('');

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm();

  useEffect(() => {
    if (submitStatus !== 'success') return;
    const t = setTimeout(() => setSubmitStatus(null), 5000);
    return () => clearTimeout(t);
  }, [submitStatus]);

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    setSubmitErrorDetail('');
    const space = data.space?.trim() || '';
    const payload = {
      name: data.name,
      email: data.email,
      subject: 'Open invitation — collaboration',
      message: `Tell us about your space:\n\n${space}`,
      company: '',
      phone: '',
    };

    try {
      const url = FORMSPREE_FALLBACK || CONTACT_API_URL;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(
          FORMSPREE_FALLBACK ? { ...payload, _replyto: data.email } : payload
        ),
      });
      const body = await response.json().catch(() => ({}));
      if (response.ok) {
        setSubmitStatus('success');
        reset();
        return;
      }
      setSubmitErrorDetail(typeof body.error === 'string' ? body.error : '');
      setSubmitStatus('error');
    } catch {
      setSubmitStatus('error');
      setSubmitErrorDetail('Network error — is the contact API running?');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <SEO
        title="Let's Talk | ATSN Robotics — Open Invitation"
        description="Start a conversation about intelligent motion for your space. Warm, simple contact from ATSN Robotics."
      />

      <SiteHeader variant="solid" />

      <section className="relative min-h-[300px] md:min-h-[360px] flex items-end pb-14 md:pb-20 pt-28 md:pt-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          initial={reduceMotion ? false : { scale: 1.07 }}
          animate={reduceMotion ? {} : { scale: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.25, ease: easeOut }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/88 to-[#050505]/20"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050505]/65"
          aria-hidden
        />
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.nav
            variants={heroItem}
            className="text-xs text-neutral-500 mb-3"
            aria-label="Breadcrumb"
          >
            <Link to="/" className="hover:text-violet-400 transition-colors">
              Home
            </Link>
            <span className="mx-2 opacity-50">/</span>
            <span className="text-neutral-300">Let&apos;s Talk</span>
          </motion.nav>
          <motion.p
            variants={heroItem}
            className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400/95 mb-3"
          >
            The open invitation
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3"
          >
            Let&apos;s start the conversation
          </motion.h1>
          <motion.p variants={heroItem} className="text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            Hotels, retail, venues — tell us about your space. We&apos;ll follow up at{' '}
            <a href="mailto:services@atsnai.com" className="text-violet-400 font-medium hover:text-violet-300">
              services@atsnai.com
            </a>
            .
          </motion.p>
        </motion.div>
      </section>

      <div className="relative z-20 -mt-12 md:-mt-20 max-w-6xl mx-auto px-4 sm:px-6 pb-4">
        <motion.div
          className="rounded-2xl border border-neutral-800 bg-neutral-950/85 backdrop-blur-xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/5 overflow-hidden"
          variants={cardLift}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 lg:min-h-[560px]">
            <div
              className="lg:col-span-8 p-8 md:p-10 lg:p-12 border-b border-neutral-800/90 lg:border-b-0"
              style={{ backgroundColor: INVITE.formBg }}
            >
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, ease: easeOut }}
              >
                <p className="text-xs font-bold tracking-widest uppercase text-[#C084FC] mb-2">Contact us</p>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
                  Share your{' '}
                  <span
                    className="italic bg-clip-text text-transparent bg-gradient-to-r from-white via-[#e9d5ff] to-[#7C3AED]"
                    style={{ WebkitBackgroundClip: 'text' }}
                  >
                    space
                  </span>{' '}
                  with us
                </h2>
                <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                  Need company, phone, or subject lines?{' '}
                  <Link to="/contact" className="text-violet-400 font-medium hover:text-violet-300 underline underline-offset-2">
                    Use the standard contact page
                  </Link>
                  .
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
                initial={reduceMotion ? false : { opacity: 0, y: 22 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.55, ease: easeOut, delay: 0.1 }}
              >
                <div>
                  <label htmlFor="inv-name" className={labelClass}>
                    Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="inv-name"
                    type="text"
                    autoComplete="name"
                    {...register('name', { required: 'Please add your name' })}
                    className={inputClass}
                    placeholder="Your name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                </div>

                <div>
                  <label htmlFor="inv-email" className={labelClass}>
                    Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="inv-email"
                    type="email"
                    autoComplete="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                </div>

                <div>
                  <label htmlFor="inv-space" className={labelClass}>
                    Tell us about your space <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="inv-space"
                    rows={6}
                    {...register('space', {
                      required: 'A few words about your space helps us respond',
                      minLength: { value: 10, message: 'Please share at least a sentence or two (10+ characters)' },
                    })}
                    className={`${inputClass} resize-y min-h-[140px]`}
                    placeholder="Hotel lobby, warehouse floor, stadium concourse — whatever makes your space unique."
                  />
                  {errors.space && <p className="mt-1 text-sm text-red-400">{errors.space.message}</p>}
                </div>

                {submitStatus === 'success' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm" role="status">
                    Thank you — your invitation is on its way. We&apos;ll be in touch at your email soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm space-y-2">
                    <p>
                      Something went wrong. You can try again or email{' '}
                      <a href="mailto:services@atsnai.com" className="text-violet-300 underline">
                        services@atsnai.com
                      </a>
                      .
                    </p>
                    {submitErrorDetail && <p className="text-sm text-red-300/90 border-t border-red-500/20 pt-2">{submitErrorDetail}</p>}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center justify-center gap-2.5 rounded-xl border border-violet-400/40 bg-gradient-to-br from-violet-500/25 via-violet-600/20 to-violet-900/30 px-8 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_12px_40px_-12px_rgba(124,58,237,0.55)] backdrop-blur-xl hover:border-violet-300/55 hover:from-violet-500/35 hover:via-violet-600/28 hover:to-violet-900/35 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-2 focus:ring-offset-[#0c0c0c] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:border-violet-400/40 disabled:hover:from-violet-500/25 transition-[border-color,box-shadow,background-color] duration-200"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-md transition-[border-color,background-color] group-hover:border-white/35 group-hover:bg-white/[0.1] group-disabled:opacity-60">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </span>
                    {isSubmitting ? 'Sending…' : 'Send an Invitation'}
                  </button>
                  <a
                    href={ENGINEERING_MAILTO}
                    className="text-center text-sm font-medium text-neutral-400 hover:text-violet-400 underline underline-offset-2"
                  >
                    Email engineering directly
                  </a>
                </div>
              </motion.form>
            </div>

            <motion.aside
              className="relative lg:col-span-4 flex flex-col overflow-hidden border-t border-neutral-800/90 p-8 md:p-10 lg:p-12 lg:border-t-0 lg:border-l lg:border-l-violet-500/20"
              initial={reduceMotion ? false : { opacity: 0, x: 24 }}
              whileInView={reduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={viewportOnce}
              transition={{ duration: 0.6, ease: easeOut, delay: 0.06 }}
            >
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{ background: INVITE.asideGradient }}
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{ background: INVITE.asideAccentWash }}
                aria-hidden
              />
              <div className="relative z-[1] flex min-h-0 flex-1 flex-col">
              <div className="mb-6 flex items-center gap-3">
                <span className={iconWrap}>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <h3 className="text-lg md:text-xl font-bold text-white leading-snug">
                  We&apos;re here to help you ship intelligent motion.
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                <div
                  className="rounded-xl border p-4 backdrop-blur-sm"
                  style={{
                    backgroundColor: INVITE.cardBg,
                    borderColor: 'rgba(124, 58, 237, 0.22)',
                    boxShadow: '0 0 0 1px rgba(192, 132, 252, 0.06) inset',
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#C084FC] mb-1">Email</p>
                  <a
                    href="mailto:services@atsnai.com"
                    className="text-white font-medium hover:text-[#C084FC] break-all transition-colors"
                  >
                    services@atsnai.com
                  </a>
                </div>
                <div
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: INVITE.cardBg,
                    borderColor: INVITE.cardBorder,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Head office</p>
                  <p className="text-sm text-neutral-300 leading-relaxed">
                    Gala Magnus, 314, Safal Parisar Rd, South Bopal, Ahmedabad, Gujarat 380057, India
                  </p>
                </div>
                <div
                  className="rounded-xl border p-4"
                  style={{
                    backgroundColor: INVITE.cardBg,
                    borderColor: INVITE.cardBorder,
                  }}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-1">Full form</p>
                  <Link to="/contact" className="text-violet-400 font-medium hover:text-[#C084FC] transition-colors">
                    Company, phone &amp; subject →
                  </Link>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-neutral-800/70">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Connect</p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { href: 'https://www.linkedin.com/', label: 'LinkedIn' },
                    { href: 'https://twitter.com/', label: 'X' },
                  ].map(({ href, label }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-neutral-300 hover:border-violet-500/50 hover:text-violet-400 transition-colors"
                      aria-label={label}
                    >
                      {label === 'LinkedIn' ? (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
              </div>
            </motion.aside>
          </div>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-10 md:mt-14">
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 rounded-2xl border border-neutral-800 bg-neutral-950/60 px-6 py-8 ring-1 ring-white/5"
          variants={gridStagger}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          {[
            { t: 'Purpose-built robotics', d: 'ARGO-class platforms for real venues.' },
            { t: 'Responsive team', d: 'We read every message — usually within 1–2 business days.' },
            { t: 'Clear next steps', d: 'From pilot conversations to deployment planning.' },
          ].map(({ t, d }) => (
            <motion.div key={t} variants={gridItem} className="text-center sm:text-left">
              <p className="font-semibold text-white flex items-center justify-center sm:justify-start gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.85)]" aria-hidden />
                {t}
              </p>
              <p className="text-sm text-neutral-500 mt-1">{d}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <motion.div
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-8"
        variants={fadeUpSmall}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <ContactLocationSection
          theme="dark"
          introLine="Same Ahmedabad office as our main contact — directions below."
        />
      </motion.div>

      <SiteFooter className="mt-4" />
    </div>
  );
};

export default ContactInvitationPage;
