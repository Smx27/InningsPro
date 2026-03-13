import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import type { MatchItem } from './types';

interface MatchListProps {
  matches: MatchItem[];
}

export function MatchList({ matches }: MatchListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Matches</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {matches.map((match) => (
            <li key={match.id} className="rounded-lg border p-3">
              <p className="text-sm font-medium">
                {match.teamA} vs {match.teamB}
              </p>
              <p className="text-xs text-muted-foreground">
                {match.date} · {match.venue}
              </p>
              <p className="mt-1 text-sm">{match.result}</p>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
