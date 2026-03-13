import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import type { LeaderboardRow, TeamStanding } from './types';

interface LeaderboardTablesProps {
  runs: LeaderboardRow[];
  wickets: LeaderboardRow[];
  strikeRate: LeaderboardRow[];
  economy: LeaderboardRow[];
  teams: TeamStanding[];
}

function PlayerMetricTable({
  title,
  metric,
  rows,
}: {
  title: string;
  metric: string;
  rows: LeaderboardRow[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">{metric}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={`${title}-${row.name}-${row.team}`}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.team ?? '-'}</TableCell>
                <TableCell className="text-right">{row.value.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function LeaderboardTables({
  runs,
  wickets,
  strikeRate,
  economy,
  teams,
}: LeaderboardTablesProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <PlayerMetricTable title="Top Runs" metric="Runs" rows={runs} />
      <PlayerMetricTable title="Top Wickets" metric="Wickets" rows={wickets} />
      <PlayerMetricTable title="Top Strike Rate" metric="SR" rows={strikeRate} />
      <PlayerMetricTable title="Best Economy" metric="Eco" rows={economy} />

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle className="text-base">Team Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team</TableHead>
                <TableHead className="text-right">P</TableHead>
                <TableHead className="text-right">W</TableHead>
                <TableHead className="text-right">L</TableHead>
                <TableHead className="text-right">Pts</TableHead>
                <TableHead className="text-right">NRR</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teams.map((team) => (
                <TableRow key={team.team}>
                  <TableCell className="font-medium">{team.team}</TableCell>
                  <TableCell className="text-right">{team.played}</TableCell>
                  <TableCell className="text-right">{team.won}</TableCell>
                  <TableCell className="text-right">{team.lost}</TableCell>
                  <TableCell className="text-right">{team.points}</TableCell>
                  <TableCell className="text-right">{team.netRunRate.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
