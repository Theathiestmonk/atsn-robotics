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

const PrivacyPolicyPage = () => {
  const reduceMotion = useReducedMotion();
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return (
  <div className="min-h-screen bg-[#050505] text-white">
    <SEO
      title="Privacy Policy | ATSN Robotics"
      description="How ATSN Robotics collects, uses, and protects personal data on this robotics website and related inquiry or product channels."
    />
    <SiteHeader variant="solid" />
    <main className="max-w-3xl mx-auto px-6 pt-28 md:pt-32 pb-16">
      {reduceMotion ? (
        <>
          <p className="text-violet-400 text-xs font-bold tracking-[0.2em] uppercase mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
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
            Privacy Policy
          </motion.h1>
          <motion.p variants={legalHeroItem} className="text-neutral-500 text-sm">
            Last updated: {lastUpdated}
          </motion.p>
        </motion.div>
      )}

      <div className="space-y-8 text-neutral-300 text-sm md:text-base leading-relaxed">
        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>1. Introduction</h2>
          <p>
            ATSN Robotics (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) respects your privacy. This Privacy Policy
            applies to this ATSN Robotics website (
            <a
              href="https://atsn-robotics.vercel.app"
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2"
            >
              atsn-robotics.vercel.app
            </a>
            ) and to information we collect when you contact us about our robotics products, request demos or
            partnerships, or otherwise engage with us through channels presented on this site (collectively, the
            &quot;Services&quot;). It does not govern separate ATSN-branded websites or products that are not operated
            as part of this robotics offering.
          </p>
          <p className="mt-3">
            By using the Services, you acknowledge this Policy. If you do not agree, please discontinue use and contact
            us using the details in Section 15.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>2. Who We Are</h2>
          <p>
            The data controller for personal data processed in connection with these Services is ATSN Robotics. Our
            operational presence includes Ahmedabad, Gujarat, India. For privacy requests, use the contacts in
            Section 15.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>3. Information We Collect</h2>
          <p className="mb-2">We may collect:</p>
          <ul className={listClass}>
            <li>
              <strong className="text-neutral-200">Identity &amp; contact data:</strong> name, email, phone, company,
              job title, and similar details you submit via forms, demos, support, or contracts.
            </li>
            <li>
              <strong className="text-neutral-200">Account &amp; technical data:</strong> login identifiers, device and
              browser type, IP address, approximate location, logs, and usage events for platforms and dashboards you
              access.
            </li>
            <li>
              <strong className="text-neutral-200">Robotics &amp; operations data:</strong> where you use our hardware
              or fleet tools, operational telemetry, status, and configuration data needed to run, secure, and improve
              systems (as described in your agreement or product documentation).
            </li>
            <li>
              <strong className="text-neutral-200">Communications:</strong> content of emails, chat, or tickets you send
              us.
            </li>
            <li>
              <strong className="text-neutral-200">Cookies &amp; similar technologies:</strong> as described in
              Section 8.
            </li>
          </ul>
          <p className="mt-3">
            We do not knowingly collect special categories of personal data unless you voluntarily provide them and we
            have a lawful basis to process them.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>4. How We Use Information</h2>
          <p className="mb-2">We use personal data to:</p>
          <ul className={listClass}>
            <li>Provide, operate, and maintain the Services, including robotics products (e.g. ARGO), deployment support, and related fleet or operations tooling where applicable</li>
            <li>Authenticate users, prevent fraud, and protect security</li>
            <li>Respond to inquiries, support requests, and legal or contractual obligations</li>
            <li>Process payments and manage subscriptions or leases where applicable</li>
            <li>Analyze usage to improve products, reliability, and user experience</li>
            <li>Send service-related notices and, where permitted, marketing (you may opt out where required)</li>
            <li>Comply with law and enforce our Terms &amp; Conditions</li>
          </ul>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>5. Legal Bases (India)</h2>
          <p>
            Where the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023, and related rules
            apply, we process personal data based on consent where required, performance of a contract, compliance with
            legal obligations, or legitimate interests that are not overridden by your rights (such as security,
            analytics, and product improvement), as applicable to each processing activity.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>6. Sharing &amp; Processors</h2>
          <p className="mb-2">We may share data with:</p>
          <ul className={listClass}>
            <li>Service providers (hosting, email delivery, analytics, payment processors) under confidentiality and data-processing terms</li>
            <li>Professional advisers where required (lawyers, auditors)</li>
            <li>Authorities when required by law or to protect rights and safety</li>
            <li>Business transfers in connection with a merger, acquisition, or asset sale, subject to applicable law</li>
          </ul>
          <p className="mt-3">We do not sell your personal data as a product.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>7. International Transfers</h2>
          <p>
            Your data may be processed in India and, where we use global infrastructure or vendors, in other countries.
            We take steps designed to ensure appropriate safeguards in line with applicable law.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>8. Cookies &amp; Similar Technologies</h2>
          <p>
            We use cookies and similar technologies for essential operation, preferences, analytics, and security. You
            can control cookies through your browser settings; disabling some cookies may limit functionality.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>9. Retention</h2>
          <p>
            We retain personal data only as long as needed for the purposes above, including legal, accounting, and
            dispute resolution requirements. Retention periods vary by data type and contract.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>10. Security</h2>
          <p>
            We implement technical and organizational measures appropriate to the risk, including access controls and
            encryption where appropriate. No method of transmission or storage is 100% secure.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>11. Your Rights</h2>
          <p className="mb-2">Depending on applicable law, you may have rights to:</p>
          <ul className={listClass}>
            <li>Access, correct, or update your personal data</li>
            <li>Withdraw consent where processing is consent-based</li>
            <li>Request erasure or restriction in permitted circumstances</li>
            <li>Lodge a complaint with a supervisory or regulatory authority where available</li>
          </ul>
          <p className="mt-3">To exercise rights, contact us using Section 15. We may verify your identity before responding.</p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>12. Children</h2>
          <p>
            Our Services are not directed to children under 16 (or the minimum age in your jurisdiction). We do not
            knowingly collect personal data from children. If you believe we have, contact us and we will take
            appropriate steps.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>13. Third-Party Links</h2>
          <p>
            Our Services may link to third-party sites. We are not responsible for their privacy practices. Review
            their policies before providing information.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>14. Changes to This Policy</h2>
          <p>
            We may update this Policy from time to time. We will post the revised version with a new &quot;Last
            updated&quot; date and, where required, provide additional notice. Continued use after changes constitutes
            acceptance where permitted by law.
          </p>
        </AnimatedLegalSection>

        <AnimatedLegalSection reduceMotion={reduceMotion}>
          <h2 className={sectionTitle}>15. Contact</h2>
          <p className="mb-3">For privacy questions or requests:</p>
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
              <span className="text-neutral-500">Legal / privacy email:</span>{' '}
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
        <Link to="/terms" className="text-violet-400 hover:text-violet-300 underline underline-offset-2">
          Terms &amp; Conditions
        </Link>
        .
      </motion.p>
    </main>
    <SiteFooter />
  </div>
  );
};

export default PrivacyPolicyPage;
