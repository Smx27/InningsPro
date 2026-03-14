'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { BallTimeline } from './BallTimeline';
import { BattingScorecard } from './BattingScorecard';
import { BowlingScorecard } from './BowlingScorecard';
import { MatchHeader } from './MatchHeader';
import { StatCards } from './StatCards';
import { buildManhattanData } from '../../lib/charts/buildManhattanData';
import { buildRunRateComparison } from '../../lib/charts/buildRunRateComparison';
import { buildWormChartData } from '../../lib/charts/buildWormChartData';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { ChartSkeleton } from '../ui/ChartSkeleton';

import type { MatchReport } from '../../types/report.types';

const chartGroupVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut',
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
      ease: 'easeOut',
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

const ManhattanChart = dynamic(
  () => import('./ManhattanChart').then((module) => module.ManhattanChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

export function ReportDocument({ report }: { report: MatchReport }) {
  const runRateData = useMemo(() => buildRunRateComparison(report), [report]);
  const wormData = useMemo(() => buildWormChartData(report), [report]);

  return (
    <div className="rounded-2xl bg-background/70 p-4 md:p-8">
      <MatchHeader report={report} />
      <StatCards report={report} />

      <motion.div
        className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2"
        variants={chartGroupVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div variants={chartItemVariants}>
          <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
            <RunRateComparisonChart
              data={runRateData}
              teamAName={report.teamA.name}
              teamBName={report.teamB.name}
            />
          </Card>
        </motion.div>
        <motion.div variants={chartItemVariants}>
          <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
            <WormChart
              data={wormData}
              teamAName={report.teamA.name}
              teamBName={report.teamB.name}
            />
          </Card>
        </motion.div>
      </motion.div>

      {report.innings.map((inning, idx) => {
        const isTeamA = inning.teamId === report.teamA.id;
        const battingTeam = isTeamA ? report.teamA : report.teamB;
        const bowlingTeam = isTeamA ? report.teamB : report.teamA;
        const manhattanData = buildManhattanData(inning);

        return (
          <section key={`${inning.teamId}-${idx}`} className="mb-10 last:mb-0">
            <Card className="mb-4 rounded-2xl shadow-xl backdrop-blur p-5">
              <h2 className="text-xl font-bold text-primary">
                Innings {idx + 1}: {battingTeam.name}
              </h2>
            </Card>

            <motion.div
              className="grid grid-cols-1 gap-6 2xl:grid-cols-2"
              variants={chartGroupVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={chartItemVariants}>
                <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                  <CardHeader className="p-2 pb-4">
                    <CardTitle className="text-base">Batting Scorecard</CardTitle>
                  </CardHeader>
                  <BattingScorecard
                    scorecard={inning.battingScorecard}
                    players={battingTeam.players}
                  />
                </Card>
              </motion.div>

              <motion.div variants={chartItemVariants}>
                <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                  <CardHeader className="p-2 pb-4">
                    <CardTitle className="text-base">Bowling Scorecard</CardTitle>
                  </CardHeader>
                  <BowlingScorecard
                    scorecard={inning.bowlingScorecard}
                    players={bowlingTeam.players}
                  />
                </Card>
              </motion.div>

              <motion.div variants={chartItemVariants}>
                <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                  <CardHeader className="p-2 pb-4">
                    <CardTitle className="text-base">Manhattan Chart</CardTitle>
                  </CardHeader>
                  <ManhattanChart data={manhattanData} />
                </Card>
              </motion.div>

              <motion.div variants={chartItemVariants}>
                <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                  <CardHeader className="p-2 pb-4">
                    <CardTitle className="text-base">Ball Timeline</CardTitle>
                  </CardHeader>
                  <BallTimeline balls={inning.ballEvents} />
                </Card>
              </motion.div>
            </motion.div>
          </section>
        );
      })}
    </div>
  );
}
