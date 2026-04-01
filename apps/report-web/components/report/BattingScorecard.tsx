import { useMemo } from 'react';

import { PlayerReport, BattingScore } from '../../types/report.types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
  scorecard: BattingScore[];
  players: PlayerReport[];
}

export function BattingScorecard({ scorecard, players }: Props) {
  const playerNames = useMemo(() => {
    const map = new Map<string, string>();
    for (const player of players) {
      map.set(player.id, player.name);
    }
    return map;
  }, [players]);

  const getPlayerName = (id: string) => playerNames.get(id) || id;

  return (
    <Card className="mb-8">
      <CardHeader className="border-b bg-muted/40 p-4">
        <CardTitle className="text-base">Batting</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/20 uppercase text-xs">
            <TableRow>
              <TableHead className="px-6 py-3">Batter</TableHead>
              <TableHead className="px-6 py-3" />
              <TableHead className="px-6 py-3 text-right">R</TableHead>
              <TableHead className="px-6 py-3 text-right">B</TableHead>
              <TableHead className="px-6 py-3 text-right">4s</TableHead>
              <TableHead className="px-6 py-3 text-right">6s</TableHead>
              <TableHead className="px-6 py-3 text-right">SR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scorecard.map((score) => (
              <TableRow key={score.playerId}>
                <TableCell className="px-6 py-4 font-medium">
                  {getPlayerName(score.playerId)}
                </TableCell>
                <TableCell className="max-w-[150px] truncate px-6 py-4 text-xs italic text-muted-foreground">
                  {score.isOut ? score.dismissal || 'Out' : 'Not out'}
                </TableCell>
                <TableCell className="px-6 py-4 text-right font-bold">{score.runs}</TableCell>
                <TableCell className="px-6 py-4 text-right">{score.balls}</TableCell>
                <TableCell className="px-6 py-4 text-right">{score.fours}</TableCell>
                <TableCell className="px-6 py-4 text-right">{score.sixes}</TableCell>
                <TableCell className="px-6 py-4 text-right">
                  {score.strikeRate.toFixed(1)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
