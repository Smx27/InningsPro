'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { InningsSection } from './InningsSection';
import { MatchHeader } from './MatchHeader';
import { StatCards } from './StatCards';
import { buildRunRateComparison } from '../../lib/charts/buildRunRateComparison';
import { buildWormChartData } from '../../lib/charts/buildWormChartData';
import { Card } from '../ui/Card';
import { ChartSkeleton } from '../ui/ChartSkeleton';

import type { MatchReport } from '../../types/report.types';

const chartGroupVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut' as const,
      duration: 0.45,
      staggerChildren: 0.12,
    },
  },
};

const chartItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut' as const,
      duration: 0.35,
    },
  },
};

const RunRateComparisonChart = dynamic(
  () => import('./RunRateComparisonChart').then((module) => module.RunRateComparisonChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const WormChart = dynamic(() => import('./WormChart').then((module) => module.WormChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

export function ReportDocument({ report }: { report: MatchReport }) {
  const runRateData = useMemo(() => buildRunRateComparison(report), [report]);
  const wormData = useMemo(() => buildWormChartData(report), [report]);

  return (
    <div className="rounded-2xl bg-background/70 p-4 md:p-8">
      <MatchHeader report={report} />
      <StatCards report={report} />

      <motion.div
        className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2"
        variants={chartGroupVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={chartItemVariants}>
          <Card interactive className="rounded-2xl shadow-xl backdrop-blur p-4">
            <RunRateComparisonChart
              data={runRateData}
              teamAName={report.teamA.name}
              teamBName={report.teamB.name}
            />
          </Card>
        </motion.div>
        <motion.div variants={chartItemVariants}>
          <Card interactive className="rounded-2xl shadow-xl backdrop-blur p-4">
            <WormChart
              data={wormData}
              teamAName={report.teamA.name}
              teamBName={report.teamB.name}
            />
          </Card>
        </motion.div>
      </motion.div>

      {report.innings.map((inning, idx) => (
        <InningsSection
          key={`${inning.teamId}-${idx}`}
          inning={inning}
          report={report}
          inningNumber={idx + 1}
        />
      ))}
    </div>
  );
}
