'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface Props {
  data: { over: number; runs: number }[];
}

const axisColor = 'hsl(var(--muted-foreground))';
const gridColor = 'hsl(var(--border))';
const tooltipStyle = {
  borderRadius: '8px',
  borderColor: 'hsl(var(--border))',
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--card-foreground))',
};

export function ManhattanChart({ data }: Props) {
  return (
    <div className="w-full h-[300px] mb-8 bg-card border rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase">
        Runs per Over (Manhattan)
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid stroke={gridColor} strokeDasharray="3 3" opacity={0.4} vertical={false} />
          <XAxis
            dataKey="over"
            tick={{ fontSize: 12, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: axisColor }}
            axisLine={{ stroke: gridColor }}
            tickLine={{ stroke: gridColor }}
          />
          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={tooltipStyle} />
          <Bar dataKey="runs" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.runs > 10 ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.65)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
