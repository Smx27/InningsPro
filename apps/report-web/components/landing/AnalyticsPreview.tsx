import { LineChart, PieChart, TrendingUp } from 'lucide-react';

import { Section } from '../ui/Section';

export function AnalyticsPreview() {
  return (
    <Section className="bg-muted/30" id="analytics-preview">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Analytics Preview</h2>
          <p className="text-muted-foreground md:text-lg">
            Instantly explore run-rate momentum, contribution splits, and key turning points from every innings.
          </p>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" /> Win probability and momentum insights.
            </p>
            <p className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" /> Over-by-over trend and run-rate analysis.
            </p>
            <p className="flex items-center gap-2">
              <PieChart className="h-4 w-4 text-primary" /> Batting and bowling contribution breakdowns.
            </p>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4 shadow-sm sm:col-span-2">
            <div className="mb-3 h-3 w-28 rounded bg-muted" />
            <div className="h-40 rounded-md bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 h-3 w-20 rounded bg-muted" />
            <div className="h-24 rounded-md bg-primary/10" />
          </div>
          <div className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="mb-3 h-3 w-24 rounded bg-muted" />
            <div className="h-24 rounded-md bg-primary/10" />
          </div>
        </div>
      </div>
    </Section>
  );
}
