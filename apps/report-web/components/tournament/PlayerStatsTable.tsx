import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import type { PlayerStatsRow } from './types';

interface PlayerStatsTableProps {
  rows: PlayerStatsRow[];
}

export function PlayerStatsTable({ rows }: PlayerStatsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Player Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">M</TableHead>
              <TableHead className="text-right">Runs</TableHead>
              <TableHead className="text-right">Avg</TableHead>
              <TableHead className="text-right">SR</TableHead>
              <TableHead className="text-right">Wkts</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.player}>
                <TableCell className="font-medium">{row.player}</TableCell>
                <TableCell>{row.team}</TableCell>
                <TableCell className="text-right">{row.matches}</TableCell>
                <TableCell className="text-right">{row.runs}</TableCell>
                <TableCell className="text-right">{row.average.toFixed(2)}</TableCell>
                <TableCell className="text-right">{row.strikeRate.toFixed(1)}</TableCell>
                <TableCell className="text-right">{row.wickets}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
