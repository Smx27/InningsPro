import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

import type { TeamStatsRow } from './types';

interface TeamStatsTableProps {
  rows: TeamStatsRow[];
}

export function TeamStatsTable({ rows }: TeamStatsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Team Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead className="text-right">M</TableHead>
              <TableHead className="text-right">W</TableHead>
              <TableHead className="text-right">L</TableHead>
              <TableHead className="text-right">Runs For</TableHead>
              <TableHead className="text-right">Runs Against</TableHead>
              <TableHead className="text-right">NRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.team}>
                <TableCell className="font-medium">{row.team}</TableCell>
                <TableCell className="text-right">{row.matches}</TableCell>
                <TableCell className="text-right">{row.wins}</TableCell>
                <TableCell className="text-right">{row.losses}</TableCell>
                <TableCell className="text-right">{row.runsScored}</TableCell>
                <TableCell className="text-right">{row.runsConceded}</TableCell>
                <TableCell className="text-right">{row.netRunRate.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
