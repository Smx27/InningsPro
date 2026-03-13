'use client';

import { useMemo } from 'react';

import { RunRateComparisonChart } from './RunRateComparisonChart';
import { WinProbabilityChart } from './WinProbabilityChart';
import { WormChart } from './WormChart';
import { buildRunRateComparison } from '../../lib/charts/buildRunRateComparison';
import { buildWinProbabilityData } from '../../lib/charts/buildWinProbabilityData';
import { buildWormChartData } from '../../lib/charts/buildWormChartData';

import type { MatchReport } from '../../types/report.types';

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
        <RunRateComparisonChart data={runRateData} teamAName={report.teamA.name} teamBName={report.teamB.name} />
      </div>
      <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
        <WinProbabilityChart data={winProbabilityData} teamAName={report.teamA.name} teamBName={report.teamB.name} />
      </div>
    </div>
  );
}
