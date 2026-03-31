'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import type { WinProbabilityPoint } from '../../lib/charts/buildWinProbabilityData';

interface WinProbabilityChartProps {
  data: WinProbabilityPoint[];
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

export function WinProbabilityChart({ data, teamAName, teamBName }: WinProbabilityChartProps) {
  return (
    <div className="w-full h-[300px] mb-8 bg-card border rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase">Win Probability</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" opacity={0.4} />
          <XAxis
            dataKey="over"
            tick={{ fontSize: 12, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value) => [`${Number(value || 0).toFixed(1)}%`, 'Win Probability']}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="teamA"
            name={teamAName}
            stroke={TEAM_A_COLOR}
            fill={TEAM_A_COLOR}
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="teamB"
            name={teamBName}
            stroke={TEAM_B_COLOR}
            fill={TEAM_B_COLOR}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
