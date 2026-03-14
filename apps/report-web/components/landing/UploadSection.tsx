import { Section } from '../ui/Section';
import { UploadCard } from '../upload/UploadCard';

export function UploadSection() {
  return (
    <Section className="bg-muted/30" id="upload">
      <div className="mx-auto flex max-w-2xl flex-col items-center space-y-6 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Upload Your Match File</h2>
        <p className="text-muted-foreground md:text-lg">
          Drop your exported Innings Pro JSON to generate an interactive report with charts and scorecards.
        </p>
        <div className="w-full max-w-md">
          <UploadCard />
        </div>
      </div>
    </Section>
  );
}
