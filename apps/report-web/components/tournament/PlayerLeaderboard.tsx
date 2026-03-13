import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import type { PlayerStanding } from './types';

interface PlayerLeaderboardProps {
  players: PlayerStanding[];
}

export function PlayerLeaderboard({ players }: PlayerLeaderboardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Player Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Wickets</TableHead>
              <TableHead className="text-right">SR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.player}>
                <TableCell className="font-medium">{player.player}</TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell className="text-right">{player.runs}</TableCell>
                <TableCell className="text-right">{player.wickets}</TableCell>
                <TableCell className="text-right">{player.strikeRate.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
