'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { BallTimeline } from './BallTimeline';
import { BattingScorecard } from './BattingScorecard';
import { BowlingScorecard } from './BowlingScorecard';
import { MatchHeader } from './MatchHeader';
import { buildManhattanData } from '../../lib/charts/buildManhattanData';
import { buildRunRateComparison } from '../../lib/charts/buildRunRateComparison';
import { buildWormChartData } from '../../lib/charts/buildWormChartData';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { ChartSkeleton } from '../ui/ChartSkeleton';

import type { InningsReport, MatchReport } from '../../types/report.types';

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

function formatInningsSummary(innings: InningsReport) {
  return `${innings.totalRuns}/${innings.totalWickets} (${innings.totalOvers.toFixed(1)} ov)`;
}

function buildTopStats(report: MatchReport) {
  const boundaries = report.innings.reduce(
    (total, inning) =>
      total +
      inning.battingScorecard.reduce((count, batter) => count + batter.fours + batter.sixes, 0),
    0,
  );

  const wickets = report.innings.reduce((total, inning) => total + inning.totalWickets, 0);
  const totalRuns = report.innings.reduce((total, inning) => total + inning.totalRuns, 0);
  const combinedOvers = report.innings.reduce((total, inning) => total + inning.totalOvers, 0);
  const overallRunRate = combinedOvers > 0 ? totalRuns / combinedOvers : 0;

  return [
    {
      label: report.teamA.name,
      value: report.innings[0] ? formatInningsSummary(report.innings[0]) : '--',
    },
    {
      label: report.teamB.name,
      value: report.innings[1] ? formatInningsSummary(report.innings[1]) : '--',
    },
    { label: 'Match Runs', value: totalRuns.toString() },
    { label: 'Overall RR', value: overallRunRate.toFixed(2) },
    { label: 'Wickets', value: wickets.toString() },
    { label: 'Boundaries', value: boundaries.toString() },
  ];
}

export function ReportDocument({ report }: { report: MatchReport }) {
  const runRateData = useMemo(() => buildRunRateComparison(report), [report]);
  const wormData = useMemo(() => buildWormChartData(report), [report]);
  const topStats = useMemo(() => buildTopStats(report), [report]);

  return (
    <div className="rounded-2xl bg-background/70 p-4 md:p-8">
      <MatchHeader report={report} />

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {topStats.map((stat) => (
          <Card key={stat.label} className="rounded-2xl shadow-xl backdrop-blur p-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-primary">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
          <RunRateComparisonChart
            data={runRateData}
            teamAName={report.teamA.name}
            teamBName={report.teamB.name}
          />
        </Card>
        <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
          <WormChart data={wormData} teamAName={report.teamA.name} teamBName={report.teamB.name} />
        </Card>
      </div>

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

            <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
              <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                <CardHeader className="p-2 pb-4">
                  <CardTitle className="text-base">Batting Scorecard</CardTitle>
                </CardHeader>
                <BattingScorecard
                  scorecard={inning.battingScorecard}
                  players={battingTeam.players}
                />
              </Card>

              <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                <CardHeader className="p-2 pb-4">
                  <CardTitle className="text-base">Bowling Scorecard</CardTitle>
                </CardHeader>
                <BowlingScorecard
                  scorecard={inning.bowlingScorecard}
                  players={bowlingTeam.players}
                />
              </Card>

              <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                <CardHeader className="p-2 pb-4">
                  <CardTitle className="text-base">Manhattan Chart</CardTitle>
                </CardHeader>
                <ManhattanChart data={manhattanData} />
              </Card>

              <Card className="rounded-2xl shadow-xl backdrop-blur p-4">
                <CardHeader className="p-2 pb-4">
                  <CardTitle className="text-base">Ball Timeline</CardTitle>
                </CardHeader>
                <BallTimeline balls={inning.ballEvents} />
              </Card>
            </div>
          </section>
        );
      })}
    </div>
  );
}
