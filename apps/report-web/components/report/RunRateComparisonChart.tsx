'use client';

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { RunRateComparisonPoint } from '../../lib/charts/buildRunRateComparison';

interface RunRateComparisonChartProps {
  data: RunRateComparisonPoint[];
  teamAName: string;
  teamBName: string;
}

const TEAM_A_COLOR = '#2563eb';
const TEAM_B_COLOR = '#16a34a';
const axisColor = 'hsl(var(--muted-foreground))';
const gridColor = 'hsl(var(--border))';
const tooltipStyle = {
  borderRadius: '8px',
  borderColor: 'hsl(var(--border))',
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))',
};

export function RunRateComparisonChart({ data, teamAName, teamBName }: RunRateComparisonChartProps) {
  return (
    <div className="w-full h-[300px] mb-8 bg-card border rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase">Run Rate Comparison</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" opacity={0.4} />
          <XAxis dataKey="over" tick={{ fontSize: 12, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
          <YAxis tick={{ fontSize: 12, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="teamA" name={teamAName} stroke={TEAM_A_COLOR} strokeWidth={3} dot={false} />
          <Line type="monotone" dataKey="teamB" name={teamBName} stroke={TEAM_B_COLOR} strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
