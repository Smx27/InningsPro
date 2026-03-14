import { Button } from '../ui/button';
import { Section } from '../ui/Section';

export function Hero() {
  return (
    <Section className="bg-muted/30 md:py-24 lg:py-32 xl:py-40" id="hero">
      <div className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
        <p className="rounded-full border bg-background px-4 py-1 text-sm text-muted-foreground">Match reporting, simplified</p>
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
          Generate Beautiful Cricket Match Reports
        </h1>
        <p className="max-w-[700px] text-muted-foreground md:text-xl">
          Turn your Innings Pro match JSON into polished scorecards, charts, and presentation-ready reports in seconds.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <a href="#upload">Upload Match JSON</a>
          </Button>
          <Button asChild variant="outline">
            <a href="#analytics-preview">Preview Analytics</a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
