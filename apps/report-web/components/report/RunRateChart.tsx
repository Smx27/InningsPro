"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { over: number; runRate: number }[];
}

const axisColor = 'hsl(var(--muted-foreground))';
const gridColor = 'hsl(var(--border))';
const tooltipStyle = {
  borderRadius: '8px',
  borderColor: 'hsl(var(--border))',
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))'
};

export function RunRateChart({ data }: Props) {
  return (
    <div className="w-full h-[300px] mb-8 bg-card border rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase">Run Rate Tracker</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" opacity={0.4} />
          <XAxis dataKey="over" tick={{ fontSize: 12, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
          <YAxis tick={{ fontSize: 12, fill: axisColor }} axisLine={{ stroke: gridColor }} tickLine={{ stroke: gridColor }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="runRate" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
