import { Section } from '../ui/Section';

const steps = [
  {
    title: 'Export from Mobile',
    description: 'Finish your match in the Innings Pro mobile app and tap "Export Match Report".',
  },
  {
    title: 'Upload JSON',
    description: 'Drag and drop the generated JSON file into the upload zone below.',
  },
  {
    title: 'View & Export',
    description: 'Review insights and download polished PDF or Excel reports for sharing.',
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
              {index + 1}
            </div>
            <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
            <p className="text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
