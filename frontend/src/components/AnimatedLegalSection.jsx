import React from 'react';
import { motion } from 'framer-motion';
import { viewportOnce, easeOut } from '../utils/marketingMotion.js';

/**
 * Scroll-in section for Terms / Privacy. Respects reduced motion.
 */
export default function AnimatedLegalSection({ reduceMotion, children }) {
  if (reduceMotion) {
    return <section>{children}</section>;
  }
  return (
    <motion.section
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: 0.48, ease: easeOut }}
    >
      {children}
    </motion.section>
  );
}
