import { Button } from '../ui/button';
import { Section } from '../ui/Section';

export function CTA() {
  return (
    <Section id="cta">
      <div className="rounded-3xl border bg-card px-6 py-10 text-center shadow-sm md:px-10 md:py-14">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to share your next match report?</h2>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-lg">
          Upload your match JSON and create a polished report in under a minute.
        </p>
        <div className="mt-6 flex justify-center">
          <Button asChild size="lg">
            <a href="#upload">Get Started</a>
          </Button>
        </div>
      </div>
    </Section>
  );
}
