import { Activity, BarChart2, Download } from 'lucide-react';

import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

const featureItems = [
  {
    title: 'Detailed Charts',
    description: 'Visualize run rates, match momentum, and innings breakdowns instantly.',
    icon: BarChart2,
  },
  {
    title: 'Beautiful Scorecards',
    description: 'Share clear batting and bowling summaries with key match statistics.',
    icon: Activity,
  },
  {
    title: 'Multiple Exports',
    description: 'Download high-quality PDF and data-rich Excel reports in one click.',
    icon: Download,
  },
];

export function Features() {
  return (
    <Section id="features">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Features</h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {featureItems.map(({ title, description, icon: Icon }) => (
          <Card key={title} className="text-center">
            <Icon className="mx-auto mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 text-xl font-bold">{title}</h3>
            <p className="text-muted-foreground">{description}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
