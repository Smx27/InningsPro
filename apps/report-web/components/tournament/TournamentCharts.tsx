'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import type { RunsDistributionPoint, TeamPerformancePoint } from './types';

interface TournamentChartsProps {
  runsDistribution: RunsDistributionPoint[];
  teamPerformance: TeamPerformancePoint[];
}

export function TournamentCharts({ runsDistribution, teamPerformance }: TournamentChartsProps) {
  return (
    <section className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Runs Distribution by Match</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={runsDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="match" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="runs" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Team Performance</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={teamPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="team" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="runs" fill="hsl(var(--primary))" />
              <Bar dataKey="wickets" fill="hsl(var(--secondary-foreground))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </section>
  );
}
