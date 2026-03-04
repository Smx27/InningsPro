"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  data: { over: number; runRate: number }[];
}

export function RunRateChart({ data }: Props) {
  return (
    <div className="w-full h-[300px] mb-8 bg-card border rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase">Run Rate Tracker</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="over" tick={{fontSize: 12}} />
          <YAxis tick={{fontSize: 12}} />
          <Tooltip contentStyle={{ borderRadius: '8px' }} />
          <Line type="monotone" dataKey="runRate" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
