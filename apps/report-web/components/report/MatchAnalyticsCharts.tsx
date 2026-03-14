'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { ChartSkeleton } from '../ui/ChartSkeleton';

import type { RunRateComparisonPoint } from '../../lib/charts/buildRunRateComparison';
import type { WinProbabilityPoint } from '../../lib/charts/buildWinProbabilityData';
import type { WormChartPoint } from '../../lib/charts/buildWormChartData';
import type { BallEvent, MatchReport } from '../../types/report.types';

const WormChart = dynamic(() => import('./WormChart').then((module) => module.WormChart), {
  ssr: false,
  loading: () => <ChartSkeleton />,
});

const RunRateComparisonChart = dynamic(
  () => import('./RunRateComparisonChart').then((module) => module.RunRateComparisonChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

const WinProbabilityChart = dynamic(
  () => import('./WinProbabilityChart').then((module) => module.WinProbabilityChart),
  {
    ssr: false,
    loading: () => <ChartSkeleton />,
  },
);

function buildRunsByOver(ballEvents: BallEvent[]) {
  const runsByOver = new Map<number, number>();

  ballEvents.forEach((ball) => {
    const runs = (ball.runs || 0) + (ball.extras || 0);
    runsByOver.set(ball.over, (runsByOver.get(ball.over) || 0) + runs);
  });

  return runsByOver;
}

function buildCumulativeRunsByCompletedOver(ballEvents: BallEvent[]) {
  const runsByOver = buildRunsByOver(ballEvents);
  const sortedOvers = [...runsByOver.keys()].sort((a, b) => a - b);

  const cumulativeByOver = new Map<number, number>();
  let cumulativeRuns = 0;

  sortedOvers.forEach((over) => {
    cumulativeRuns += runsByOver.get(over) || 0;
    cumulativeByOver.set(over + 1, cumulativeRuns);
  });

  return cumulativeByOver;
}

function buildWormData(teamABalls: BallEvent[], teamBBalls: BallEvent[]): WormChartPoint[] {
  const teamAByOver = buildCumulativeRunsByCompletedOver(teamABalls);
  const teamBByOver = buildCumulativeRunsByCompletedOver(teamBBalls);
  const maxOver = Math.max(...teamAByOver.keys(), ...teamBByOver.keys(), 0);

  const points: WormChartPoint[] = [];
  let teamALast = 0;
  let teamBLast = 0;

  for (let over = 1; over <= maxOver; over += 1) {
    if (teamAByOver.has(over)) teamALast = teamAByOver.get(over) || teamALast;
    if (teamBByOver.has(over)) teamBLast = teamBByOver.get(over) || teamBLast;

    points.push({ over, teamA: teamALast, teamB: teamBLast });
  }

  return points;
}

function buildRunRateData(
  teamABalls: BallEvent[],
  teamBBalls: BallEvent[],
): RunRateComparisonPoint[] {
  const buildRunRateByOver = (balls: BallEvent[]) => {
    const cumulativeByOver = buildCumulativeRunsByCompletedOver(balls);
    const runRateByOver = new Map<number, number>();

    cumulativeByOver.forEach((runs, over) => {
      runRateByOver.set(over, Number((runs / over).toFixed(2)));
    });

    return runRateByOver;
  };

  const teamAByOver = buildRunRateByOver(teamABalls);
  const teamBByOver = buildRunRateByOver(teamBBalls);
  const maxOver = Math.max(...teamAByOver.keys(), ...teamBByOver.keys(), 0);

  const points: RunRateComparisonPoint[] = [];
  let teamALast = 0;
  let teamBLast = 0;

  for (let over = 1; over <= maxOver; over += 1) {
    if (teamAByOver.has(over)) teamALast = teamAByOver.get(over) || teamALast;
    if (teamBByOver.has(over)) teamBLast = teamBByOver.get(over) || teamBLast;

    points.push({ over, teamA: teamALast, teamB: teamBLast });
  }

  return points;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function buildWinProbability(
  report: MatchReport,
  secondInningsBalls: BallEvent[],
): WinProbabilityPoint[] {
  const [firstInnings, secondInnings] = report.innings;
  if (!firstInnings || !secondInnings) return [];

  const battingSecondIsTeamA = secondInnings.teamId === report.teamA.id;
  const target = firstInnings.totalRuns + 1;
  const chaseProgress = buildCumulativeRunsByCompletedOver(secondInningsBalls);

  const data: WinProbabilityPoint[] = [];
  let lastRuns = 0;

  for (let over = 1; over <= report.overs; over += 1) {
    if (chaseProgress.has(over)) lastRuns = chaseProgress.get(over) || lastRuns;

    const remainingRuns = Math.max(target - lastRuns, 0);
    const oversRemaining = Math.max(report.overs - over, 0);

    let chasingWinProbability = 50;

    if (remainingRuns <= 0) {
      chasingWinProbability = 100;
    } else if (oversRemaining <= 0) {
      chasingWinProbability = 0;
    } else {
      const requiredRunRate = remainingRuns / oversRemaining;
      const currentRunRate = lastRuns / over;
      const scoreProgress = target > 0 ? lastRuns / target : 0;
      const pressureFactor = currentRunRate / (currentRunRate + requiredRunRate);

      chasingWinProbability = clamp((scoreProgress * 0.65 + pressureFactor * 0.35) * 100, 0, 100);
    }

    const teamAProbability = battingSecondIsTeamA
      ? chasingWinProbability
      : 100 - chasingWinProbability;

    data.push({
      over,
      teamA: Number(teamAProbability.toFixed(1)),
      teamB: Number((100 - teamAProbability).toFixed(1)),
    });
  }

  return data;
}

export function MatchAnalyticsCharts({ report }: { report: MatchReport }) {
  const hasBothInnings = Boolean(report.innings[0] && report.innings[1]);

  const wormData = useMemo(
    () => buildWormData(report.innings[0]?.ballEvents || [], report.innings[1]?.ballEvents || []),
    [report],
  );
  const runRateData = useMemo(
    () =>
      buildRunRateData(report.innings[0]?.ballEvents || [], report.innings[1]?.ballEvents || []),
    [report],
  );
  const winProbabilityData = useMemo(
    () => buildWinProbability(report, report.innings[1]?.ballEvents || []),
    [report],
  );

  if (!hasBothInnings) return null;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 print:block print:w-full">
      <div className="xl:col-span-2 print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
        <WormChart data={wormData} teamAName={report.teamA.name} teamBName={report.teamB.name} />
      </div>
      <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
        <RunRateComparisonChart
          data={runRateData}
          teamAName={report.teamA.name}
          teamBName={report.teamB.name}
        />
      </div>
      <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
        <WinProbabilityChart
          data={winProbabilityData}
          teamAName={report.teamA.name}
          teamBName={report.teamB.name}
        />
      </div>
    </div>
  );
}
