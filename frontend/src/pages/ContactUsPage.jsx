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
  listContainer,
  listItem,
  fadeUpSmall,
  easeOut,
} from '../utils/marketingMotion.js';

/** POST JSON to contact API (SMTP). Default /api/contact; prod: VITE_CONTACT_API_URL. */
const CONTACT_API_URL =
  import.meta.env.VITE_CONTACT_API_URL?.trim() || '/api/contact';

const FORMSPREE_FALLBACK =
  import.meta.env.VITE_FORMSPREE_FORM_ID && import.meta.env.VITE_CONTACT_USE_FORMSPREE === 'true'
    ? `https://formspree.io/f/${import.meta.env.VITE_FORMSPREE_FORM_ID}`
    : null;

/** Logistics / operations — Unsplash photo IDs must stay valid (older lab image returned 404) */
const HERO_BG =
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=80';

const inputClass =
  'w-full px-4 py-3.5 rounded-xl border border-white/[0.12] bg-white/[0.04] text-white placeholder-neutral-500 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-violet-500/35 focus:border-violet-400/45 transition-[border-color,box-shadow]';

const labelClass = 'block text-sm font-medium text-neutral-300 mb-2';

const iconWrap =
  'flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/25 shadow-[0_0_24px_-4px_rgba(167,139,250,0.35)]';

const IconLocation = () => (
  <span className={iconWrap}>
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  </span>
);
const IconMail = () => (
  <span className={iconWrap}>
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  </span>
);
const IconPhone = () => (
  <span className={iconWrap}>
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  </span>
);

const ContactUsPage = () => {
  const reduceMotion = useReducedMotion();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitErrorDetail, setSubmitErrorDetail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  useEffect(() => {
    if (submitStatus !== 'success') return;
    const timer = setTimeout(() => setSubmitStatus(null), 5000);
    return () => clearTimeout(timer);
  }, [submitStatus]);

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    setSubmitErrorDetail('');
    const payload = {
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      company: data.company || '',
      phone: data.phone || '',
    };

    try {
      const url = FORMSPREE_FALLBACK || CONTACT_API_URL;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(
          FORMSPREE_FALLBACK
            ? {
                ...payload,
                _replyto: data.email,
              }
            : payload
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
        title="Contact Us | ATSN Robotics"
        description="Get in touch with ATSN Robotics. We'd love to hear from you."
      />

      <SiteHeader variant="solid" />

      {/* Hero — robotics imagery + ATSN dark / violet accent (landing palette) */}
      <section className="relative min-h-[320px] md:min-h-[400px] flex items-end pb-20 md:pb-32 pt-28 md:pt-32 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
          initial={reduceMotion ? false : { scale: 1.07 }}
          animate={reduceMotion ? {} : { scale: 1 }}
          transition={reduceMotion ? { duration: 0 } : { duration: 1.25, ease: easeOut }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/88 to-violet-950/35"
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#050505]/45" aria-hidden />
        <motion.div
          className="relative z-10 w-full max-w-4xl mx-auto px-6 text-center"
          variants={heroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={heroItem}
            className="text-xs font-bold tracking-[0.25em] uppercase text-violet-400/95 mb-3"
          >
            ATSN Robotics
          </motion.p>
          <motion.h1
            variants={heroItem}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4"
          >
            Contact us
          </motion.h1>
          <motion.p
            variants={heroItem}
            className="text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed mb-8 md:mb-12"
          >
            Questions about ARGO or autonomous robotics? We&apos;re here to help — reach us at{' '}
            <a
              href="mailto:services@atsnai.com"
              className="text-violet-400 font-medium hover:text-violet-300 underline decoration-violet-500/50 underline-offset-4"
            >
              services@atsnai.com
            </a>
            .
          </motion.p>
        </motion.div>
      </section>

      {/* Overlapping card — dark glass, violet accents (landing-aligned) */}
      <div className="relative z-20 -mt-10 md:-mt-16 max-w-6xl mx-auto px-4 sm:px-6 pb-4 pt-2 md:pt-4">
        <motion.div
          className="rounded-2xl border border-neutral-800 bg-neutral-950/85 backdrop-blur-xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] ring-1 ring-white/5 overflow-hidden"
          variants={cardLift}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:min-h-[520px]">
            <div className="p-8 md:p-10 lg:p-12 bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 border-b lg:border-b-0 lg:border-r border-neutral-800/80">
              <motion.h2
                className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-8"
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.45, ease: easeOut }}
              >
                Get in touch
              </motion.h2>
              <motion.ul className="space-y-8" variants={listContainer} initial="hidden" whileInView="visible" viewport={viewportOnce}>
                <motion.li variants={listItem} className="flex gap-4">
                  <IconLocation />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Head office</p>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Gala Magnus, 314, Safal Parisar Rd, South Bopal, Bopal, Ahmedabad, Gujarat 380057, India
                    </p>
                  </div>
                </motion.li>
                <motion.li variants={listItem} className="flex gap-4">
                  <IconMail />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Email us</p>
                    <a
                      href="mailto:services@atsnai.com"
                      className="text-violet-400 hover:text-violet-300 font-medium text-sm"
                    >
                      services@atsnai.com
                    </a>
                  </div>
                </motion.li>
                <motion.li variants={listItem} className="flex gap-4">
                  <IconPhone />
                  <div>
                    <p className="text-sm font-semibold text-white mb-1">Sales &amp; support</p>
                    <p className="text-neutral-400 text-sm">
                      We respond within 1–2 business days. For urgent matters, note it in your message.
                    </p>
                  </div>
                </motion.li>
              </motion.ul>

              <div className="mt-10 pt-8 border-t border-neutral-800">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-4">Follow us</p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-neutral-300 hover:border-violet-500/50 hover:text-violet-400 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-neutral-300 hover:border-violet-500/50 hover:text-violet-400 transition-colors"
                    aria-label="Twitter / X"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden p-8 md:p-10 lg:p-12 border-b lg:border-b-0 lg:border-l border-white/[0.08] bg-gradient-to-br from-white/[0.07] via-neutral-950/35 to-neutral-950/75 backdrop-blur-2xl">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_100%_0%,rgba(124,58,237,0.09),transparent_55%)]"
                aria-hidden
              />
              <div className="relative z-[1]">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, ease: easeOut, delay: 0.08 }}
              >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">Send us a message</h2>
              <p className="text-neutral-400 text-sm mb-8 leading-relaxed">
                Tell us about ARGO, deployments, or partnerships — or try the{' '}
                <Link to="/contact/invite" className="text-violet-400 font-medium hover:text-violet-300 underline underline-offset-2">
                  open invitation
                </Link>{' '}
                for a shorter note.
              </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
                viewport={viewportOnce}
                transition={{ duration: 0.55, ease: easeOut, delay: 0.12 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className={labelClass}>
                      Full name <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      {...register('name', { required: 'Name is required' })}
                      className={inputClass}
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className={labelClass}>
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      className={inputClass}
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="company" className={labelClass}>
                      Company
                    </label>
                    <input id="company" type="text" placeholder="Your company" {...register('company')} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelClass}>
                      Phone
                    </label>
                    <input id="phone" type="tel" placeholder="+91 …" {...register('phone')} className={inputClass} />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className={labelClass}>
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="subject"
                    type="text"
                    placeholder="How can we help?"
                    {...register('subject', { required: 'Subject is required' })}
                    className={inputClass}
                  />
                  {errors.subject && <p className="mt-1 text-sm text-red-400">{errors.subject.message}</p>}
                </div>

                <div>
                  <label htmlFor="message" className={labelClass}>
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us about your project or inquiry..."
                    {...register('message', {
                      required: 'Message is required',
                      minLength: { value: 10, message: 'Message must be at least 10 characters' },
                    })}
                    className={`${inputClass} resize-none`}
                  />
                  {errors.message && <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>}
                </div>

                {submitStatus === 'success' && (
                  <div
                    className="p-4 rounded-xl border border-emerald-400/35 bg-emerald-500/[0.08] text-emerald-300 text-sm shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] backdrop-blur-md"
                    role="status"
                  >
                    Thank you! Your message has been sent. We&apos;ll respond at your email address soon.
                  </div>
                )}
                {submitStatus === 'error' && (
                  <div className="p-4 rounded-xl border border-red-400/35 bg-red-500/[0.08] text-red-300 text-sm space-y-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-md">
                    <p>
                      Something went wrong. Please try again or email{' '}
                      <a href="mailto:services@atsnai.com" className="text-violet-300 underline">
                        services@atsnai.com
                      </a>
                      .
                    </p>
                    {submitErrorDetail && <p className="text-sm text-red-300/90 border-t border-red-500/20 pt-2">{submitErrorDetail}</p>}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex w-full sm:w-auto min-w-[220px] items-center justify-center gap-2.5 rounded-xl border border-violet-400/40 bg-gradient-to-br from-violet-500/25 via-violet-600/20 to-violet-900/30 px-8 py-3.5 text-sm font-semibold text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_12px_40px_-12px_rgba(124,58,237,0.55)] backdrop-blur-xl hover:border-violet-300/55 hover:from-violet-500/35 hover:via-violet-600/28 hover:to-violet-900/35 focus:outline-none focus:ring-2 focus:ring-violet-400/50 focus:ring-offset-2 focus:ring-offset-[#080808] disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:border-violet-400/40 disabled:hover:from-violet-500/25 transition-[border-color,box-shadow,background-color] duration-200"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.06] text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-md transition-[border-color,background-color] group-hover:border-white/35 group-hover:bg-white/[0.1] group-disabled:opacity-60">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </span>
                  {isSubmitting ? 'Sending…' : 'Send'}
                </button>
              </motion.form>
              </div>
            </div>
          </div>
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
          introLine="Plan a visit to our Ahmedabad office or open the map for directions."
        />
      </motion.div>

      <SiteFooter className="mt-4" />
    </div>
  );
};

export default ContactUsPage;
