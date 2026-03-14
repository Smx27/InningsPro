import { AnalyticsPreview } from '../components/landing/AnalyticsPreview';
import { CTA } from '../components/landing/CTA';
import { Features } from '../components/landing/Features';
import { Hero } from '../components/landing/Hero';
import { HowItWorks } from '../components/landing/HowItWorks';
import { UploadSection } from '../components/landing/UploadSection';

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <Hero />
      <Features />
      <AnalyticsPreview />
      <HowItWorks />
      <UploadSection />
      <CTA />
    </div>
  );
}
