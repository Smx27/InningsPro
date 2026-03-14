'use client';

import { motion, type Variants } from 'framer-motion';

import { Button } from '../ui/button';
import { GradientBackground } from '../ui/GradientBackground';
import { Section } from '../ui/Section';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.08,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.35,
      duration: 0.55,
      ease: 'easeOut',
    },
  },
};

export function Hero() {
  return (
    <Section className="relative overflow-hidden py-24 md:py-32 lg:py-40" id="hero">
      <GradientBackground />
      <motion.div
        animate="visible"
        className="relative mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl" variants={itemVariants}>
          Innings Pro Analytics
        </motion.h1>
        <motion.p className="max-w-[700px] text-lg text-muted-foreground md:text-xl" variants={itemVariants}>
          Turn cricket match data into beautiful insights
        </motion.p>
        <motion.div className="flex flex-wrap items-center justify-center gap-3" variants={ctaVariants}>
          <Button asChild size="lg">
            <a href="#upload">Upload Match Report</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#analytics-preview">View Example Report</a>
          </Button>
        </motion.div>
      </motion.div>
    </Section>
  );
}
