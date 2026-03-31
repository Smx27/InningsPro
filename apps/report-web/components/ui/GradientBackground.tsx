'use client';

import { motion } from 'framer-motion';

const blobs = [
  {
    className: '-left-24 top-4 h-64 w-64 bg-sky-400/20 md:-left-12 md:h-80 md:w-80 lg:h-96 lg:w-96',
    animate: {
      x: [0, 40, -20, 0],
      y: [0, -28, 24, 0],
      scale: [1, 1.1, 0.93, 1],
    },
  },
  {
    className:
      'right-0 top-20 h-56 w-56 bg-emerald-400/18 md:right-8 md:h-72 md:w-72 lg:right-16 lg:h-96 lg:w-96',
    animate: {
      x: [0, -30, 14, 0],
      y: [0, 28, -22, 0],
      scale: [1, 0.9, 1.08, 1],
    },
  },
  {
    className:
      'bottom-0 left-1/2 h-52 w-52 -translate-x-1/2 bg-sky-500/14 md:bottom-6 md:h-64 md:w-64 lg:bottom-10 lg:h-80 lg:w-80',
    animate: {
      x: [0, 20, -24, 0],
      y: [0, -18, 28, 0],
      scale: [1, 1.06, 0.88, 1],
    },
  },
];

export function GradientBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-muted/70" />
      {blobs.map(({ className, animate }, index) => (
        <motion.div
          key={index}
          animate={animate}
          className={`absolute rounded-full blur-3xl ${className}`}
          transition={{
            duration: 16 + index * 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'mirror',
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
