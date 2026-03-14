import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

import type { MatchItem } from './types';

interface MatchListProps {
  matches: MatchItem[];
}

export function MatchList({ matches }: MatchListProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Matches</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((match) => (
          <Card key={match.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {match.teamA} vs {match.teamB}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{match.date}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">{match.scoreSummary}</p>
              <p className="text-sm font-medium">{match.result}</p>
              <Link
                className="text-sm text-primary underline underline-offset-4"
                href={match.reportHref}
              >
                View report
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
