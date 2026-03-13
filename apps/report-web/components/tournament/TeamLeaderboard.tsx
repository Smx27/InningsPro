import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import type { TeamStanding } from './types';

interface TeamLeaderboardProps {
  teams: TeamStanding[];
}

export function TeamLeaderboard({ teams }: TeamLeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team Leaderboard</CardTitle>
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
  );
}
