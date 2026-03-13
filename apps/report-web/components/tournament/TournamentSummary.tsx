import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import type { TournamentSummaryData } from './types';

interface TournamentSummaryProps {
  summary: TournamentSummaryData;
}

const kpis = [
  { key: 'totalMatches', label: 'Total Matches' },
  { key: 'teams', label: 'Teams' },
  { key: 'totalRuns', label: 'Runs' },
  { key: 'totalWickets', label: 'Wickets' },
] as const;

export function TournamentSummary({ summary }: TournamentSummaryProps) {
  return (
    <section className="space-y-4">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{summary.title}</h1>
        <p className="text-sm text-muted-foreground">{summary.stage}</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.key}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{summary[kpi.key]}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
