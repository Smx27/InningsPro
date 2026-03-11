import { BowlingScore, PlayerReport } from '../../types/report';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface Props {
  scorecard: BowlingScore[];
  players: PlayerReport[];
}

export function BowlingScorecard({ scorecard, players }: Props) {
  const getPlayerName = (id: string) => players.find((player) => player.id === id)?.name || id;

  return (
    <Card className="mb-8">
      <CardHeader className="border-b bg-muted/40 p-4">
        <CardTitle className="text-base">Bowling</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/20 uppercase text-xs">
            <TableRow>
              <TableHead className="px-6 py-3">Bowler</TableHead>
              <TableHead className="px-6 py-3 text-right">O</TableHead>
              <TableHead className="px-6 py-3 text-right">M</TableHead>
              <TableHead className="px-6 py-3 text-right">R</TableHead>
              <TableHead className="px-6 py-3 text-right">W</TableHead>
              <TableHead className="px-6 py-3 text-right">Econ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scorecard.map((score) => (
              <TableRow key={score.playerId}>
                <TableCell className="px-6 py-4 font-medium text-green-700 dark:text-green-500">{getPlayerName(score.playerId)}</TableCell>
                <TableCell className="px-6 py-4 text-right">{score.overs}</TableCell>
                <TableCell className="px-6 py-4 text-right">{score.maidens}</TableCell>
                <TableCell className="px-6 py-4 text-right">{score.runs}</TableCell>
                <TableCell className="px-6 py-4 text-right font-bold">{score.wickets}</TableCell>
                <TableCell className="px-6 py-4 text-right">{score.economy.toFixed(1)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
