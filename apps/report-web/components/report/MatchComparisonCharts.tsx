'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { buildRunRateComparison } from '../../lib/charts/buildRunRateComparison';
import { buildWinProbabilityData } from '../../lib/charts/buildWinProbabilityData';
import { buildWormChartData } from '../../lib/charts/buildWormChartData';
import { ChartSkeleton } from '../ui/ChartSkeleton';

import type { MatchReport } from '../../types/report.types';

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

export function MatchComparisonCharts({ report }: { report: MatchReport }) {
  const wormData = useMemo(() => buildWormChartData(report), [report]);
  const runRateData = useMemo(() => buildRunRateComparison(report), [report]);
  const winProbabilityData = useMemo(() => buildWinProbabilityData(report), [report]);

  return (
    <div className="grid grid-cols-1 gap-8 print:block print:w-full">
      <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
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
