import { Card } from '../ui/Card';

import type { MatchReport } from '../../types/report.types';

function formatOvers(overs: number) {
  if (Number.isInteger(overs)) {
    return overs.toString();
  }

  return overs.toFixed(1);
}

export function StatCards({ report }: { report: MatchReport }) {
  const totalRuns = report.innings.reduce((total, inning) => total + inning.totalRuns, 0);
  const totalWickets = report.innings.reduce((total, inning) => total + inning.totalWickets, 0);
  const totalOvers = report.innings.reduce((total, inning) => total + inning.totalOvers, 0);
  const runRate = totalOvers > 0 ? totalRuns / totalOvers : 0;

  const stats = [
    { label: 'Total Runs', value: totalRuns.toString() },
    { label: 'Wickets', value: totalWickets.toString() },
    { label: 'Run Rate', value: runRate.toFixed(2) },
    { label: 'Overs', value: formatOvers(totalOvers) },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="rounded-2xl shadow-xl backdrop-blur p-5">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
          <p className="mt-2 text-2xl font-bold text-primary">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
