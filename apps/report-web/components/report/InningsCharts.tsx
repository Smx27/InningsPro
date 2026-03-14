'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

import { buildManhattanData } from '../../lib/charts/buildManhattanData';
import { buildRunRateData } from '../../lib/charts/buildRunRateData';
import { ChartSkeleton } from '../ui/ChartSkeleton';

import type { InningsReport } from '../../types/report.types';

const RunRateChart = dynamic(() => import('./RunRateChart').then((module) => module.RunRateChart), {
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

export function InningsCharts({ inning }: { inning: InningsReport }) {
  const runRateData = useMemo(() => buildRunRateData(inning), [inning]);
  const manhattanData = useMemo(() => buildManhattanData(inning), [inning]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:w-full">
      <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
        <RunRateChart data={runRateData} />
      </div>
      <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
        <ManhattanChart data={manhattanData} />
      </div>
    </div>
  );
}
