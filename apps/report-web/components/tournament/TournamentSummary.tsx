import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import type { TournamentSummaryData } from './types';

interface TournamentSummaryProps {
  summary: TournamentSummaryData;
}

export function TournamentSummary({ summary }: TournamentSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{summary.title}</CardTitle>
        <p className="text-sm text-muted-foreground">{summary.stage}</p>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Teams</dt>
            <dd className="mt-1 text-2xl font-semibold">{summary.teams}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Matches</dt>
            <dd className="mt-1 text-2xl font-semibold">
              {summary.matchesCompleted}/{summary.totalMatches}
            </dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Total Runs</dt>
            <dd className="mt-1 text-2xl font-semibold">{summary.totalRuns}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">Total Wickets</dt>
            <dd className="mt-1 text-2xl font-semibold">{summary.totalWickets}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
