import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import SEO from '../components/SEO';
import AnimatedLegalSection from '../components/AnimatedLegalSection.jsx';
import SiteFooter from '../components/SiteFooter.jsx';
import SiteHeader from '../components/SiteHeader.jsx';
import { legalHeroContainer, legalHeroItem, viewportOnce, easeOut } from '../utils/marketingMotion.js';

const sectionTitle = 'text-lg font-semibold text-white mt-10 mb-3 first:mt-0';
const listClass = 'list-disc pl-5 space-y-2 my-3 text-neutral-300';

const TermsOfServicePage = () => {
  const reduceMotion = useReducedMotion();
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return (
  <div className="min-h-screen bg-[#050505] text-white">
    <SEO
      title="Terms & Conditions | ATSN Robotics"
      description="Terms and conditions for the ATSN Robotics website and autonomous robotics services (including ARGO). Governing law: India, Ahmedabad jurisdiction."
    />
    <SiteHeader variant="solid" />
    <main className="max-w-3xl mx-auto px-6 pt-28 md:pt-32 pb-16">
      {reduceMotion ? (
        <>
          <p className="text-violet-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Terms &amp; Conditions</h1>
          <p className="text-neutral-500 text-sm mb-10">Last updated: {lastUpdated}</p>
        </>
      ) : (
        <motion.div
          className="mb-10"
          variants={legalHeroContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={legalHeroItem}
            className="text-violet-400 text-xs font-bold tracking-[0.2em] uppercase mb-3"
          >
            Legal
          </motion.p>
          <motion.h1
            variants={legalHeroItem}
            className="text-3xl md:text-4xl font-bold tracking-tight mb-2"
          >
            Terms &amp; Conditions
          </motion.h1>
          <motion.p variants={legalHeroItem} className="text-neutral-500 text-sm">
            Last updated: {lastUpdated}
          </motion.p>
        </motion.div>
      )}

      <div className="space-y-8 text-neutral-300 text-sm md:text-base leading-relaxed">
        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using platforms, products, and services offered by ATSN Robotics, you agree to be bound by these Terms
            &amp; Conditions.
          </p>
          <p className="mt-3">
            These terms apply to the ATSN Robotics website, marketing and inquiry channels, and our autonomous robotics
            offerings — including platforms such as ARGO, fleet or operations dashboards tied to those products, and
            related hardware or software services we provide under the ATSN Robotics brand.
          </p>
          <p className="mt-3">
            If you do not agree with any part of these terms, you must discontinue use of our services.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>2. Scope of Services</h2>
          <p>
            ATSN Robotics develops autonomous robotics, intelligent motion systems, and supporting software for
            hospitality, venues, retail, and similar environments — focused on safe, reliable operation in the physical world.
          </p>
          <p className="mt-3 mb-2">Services may include:</p>
          <ul className={listClass}>
            <li>Autonomous robotics (including ARGO and future systems)</li>
            <li>Fleet management dashboards</li>
            <li>Software and dashboards that support deployment and monitoring of our robotics systems</li>
            <li>Hardware leasing and software subscriptions</li>
          </ul>
          <p>All services are subject to continuous improvement and evolution.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>3. Use License</h2>
          <p>
            Subject to compliance with these Terms, ATSN Robotics grants you a limited, non-exclusive, non-transferable license
            to use its services for business purposes.
          </p>
          <p className="mt-3 mb-2">You agree not to:</p>
          <ul className={listClass}>
            <li>Copy, modify, or reverse engineer any part of the system</li>
            <li>Resell or exploit the services without authorization</li>
            <li>Use the services for unlawful or prohibited activities</li>
          </ul>
          <p className="mt-3">This is a license grant — not a transfer of ownership.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>4. Service Availability &amp; Performance</h2>
          <p>We strive to ensure high availability and reliability across our systems. However:</p>
          <ul className={listClass}>
            <li>Services may experience interruptions due to maintenance, updates, or external factors</li>
            <li>We do not guarantee uninterrupted or error-free operation</li>
            <li>We reserve the right to modify, suspend, or discontinue services at any time</li>
          </ul>
          <p className="mt-3">Where possible, we will provide prior notice for significant disruptions.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>5. User Responsibilities</h2>
          <p className="mb-2">You are responsible for:</p>
          <ul className={listClass}>
            <li>Maintaining the confidentiality of your account credentials</li>
            <li>Ensuring authorized use of your account and systems</li>
            <li>Compliance with all applicable laws and regulations</li>
          </ul>
          <p className="mt-4 mb-2">You agree not to:</p>
          <ul className={listClass}>
            <li>Misuse or interfere with our systems or hardware</li>
            <li>Attempt unauthorized access to any part of the platform</li>
            <li>Use the services in a way that may harm ATSN Robotics, its clients, or third parties</li>
          </ul>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>6. Hardware &amp; Operational Responsibility</h2>
          <p className="mb-2">For clients using ATSN Robotics hardware or deployed systems:</p>
          <ul className={listClass}>
            <li>You are responsible for ensuring a safe operating environment</li>
            <li>Systems must be used according to provided guidelines and instructions</li>
            <li>Unauthorized modifications to hardware or software are strictly prohibited</li>
          </ul>
          <p className="mt-3">
            ATSN Robotics is not responsible for misuse, improper deployment, or operation outside recommended conditions.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>7. Intellectual Property</h2>
          <p>
            All content, technology, software, hardware designs, and system architecture are the exclusive property of
            ATSN Robotics and its licensors.
          </p>
          <p className="mt-3 mb-2">This includes:</p>
          <ul className={listClass}>
            <li>Robotics systems and designs</li>
            <li>Onboard software, control logic, and related intellectual property for our robotics products</li>
            <li>Software platforms and dashboards</li>
            <li>Branding, trademarks, and content</li>
          </ul>
          <p className="mt-3">Unauthorized use, reproduction, or distribution is strictly prohibited.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>8. Payments &amp; Subscriptions</h2>
          <p className="mb-2">Where applicable:</p>
          <ul className={listClass}>
            <li>Services may be offered via subscription, leasing, or usage-based pricing</li>
            <li>Payments are processed securely through authorized providers</li>
          </ul>
          <p className="mt-4 mb-2">Failure to complete payments may result in:</p>
          <ul className={listClass}>
            <li>Suspension of services</li>
            <li>Restricted access to platforms or hardware</li>
          </ul>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>9. Limitation of Liability</h2>
          <p className="mb-2">To the fullest extent permitted by law:</p>
          <p className="mb-2">ATSN Robotics shall not be liable for:</p>
          <ul className={listClass}>
            <li>Indirect, incidental, or consequential damages</li>
            <li>Loss of profits, revenue, data, or business opportunities</li>
            <li>Service interruptions or system failures beyond reasonable control</li>
          </ul>
          <p className="mt-3">All services are provided on an &quot;as is&quot; and &quot;as available&quot; basis.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>10. Indemnification</h2>
          <p className="mb-2">
            You agree to indemnify and hold harmless ATSN Robotics, its directors, employees, and partners from any claims,
            damages, or liabilities arising from:
          </p>
          <ul className={listClass}>
            <li>Misuse of services</li>
            <li>Violation of these Terms</li>
            <li>Breach of applicable laws</li>
          </ul>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>11. Termination</h2>
          <p className="mb-2">
            We reserve the right to suspend or terminate access to our services at our sole discretion, without prior
            notice, in cases including:
          </p>
          <ul className={listClass}>
            <li>Breach of these Terms</li>
            <li>Misuse of systems or platforms</li>
            <li>Non-payment or contractual violations</li>
          </ul>
          <p className="mt-3">Upon termination, your right to use the services will immediately cease.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>12. Changes to Terms</h2>
          <p>We may update or modify these Terms as our technology and services evolve.</p>
          <p className="mt-3 mb-2">For material changes:</p>
          <ul className={listClass}>
            <li>We will provide prior notice (typically 30 days)</li>
            <li>Continued use of services constitutes acceptance of updated terms</li>
          </ul>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>13. Governing Law</h2>
          <p>
            These Terms shall be governed and interpreted in accordance with the laws of India. Any disputes shall be
            subject to the jurisdiction of courts located in Ahmedabad, Gujarat.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>14. Contact &amp; Legal Information</h2>
          <p className="mb-3">For any questions regarding these Terms:</p>
          <ul className="space-y-2 text-neutral-300">
            <li>
              <span className="text-neutral-500">Helpdesk phone:</span>{' '}
              <a href="tel:+919998198868" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
                +91 99981 98868
              </a>
            </li>
            <li>
              <span className="text-neutral-500">Support email:</span>{' '}
              <a
                href="mailto:services@atsnai.com"
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
              >
                services@atsnai.com
              </a>
            </li>
            <li>
              <span className="text-neutral-500">Legal email:</span>{' '}
              <a
                href="mailto:legal@atsnai.com"
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
              >
                legal@atsnai.com
              </a>
            </li>
            <li>
              <span className="text-neutral-500">Robotics website:</span>{' '}
              <a
                href="https://atsn-robotics.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
              >
                atsn-robotics.vercel.app
              </a>
            </li>
          </ul>
          <p className="mt-4">
            For service-related issues, you may contact our support team directly via phone or email.
          </p>
        </AnimatedLegalSection>
      </div>

      <motion.p
        className="mt-12 pt-8 border-t border-neutral-800 text-sm text-neutral-500"
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        whileInView={reduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.42, ease: easeOut }}
      >
        See also our{' '}
        <Link to="/privacy" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </motion.p>
    </main>
    <SiteFooter />
  </div>
  );
};

export default TermsOfServicePage;
