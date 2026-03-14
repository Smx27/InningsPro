'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { ExportButtons } from './ExportButtons';
import { ReportDocument } from './ReportDocument';
import { useExportPdf } from '../../lib/export/exportPdf';
import { useReportStore } from '../../lib/store';
import { Card } from '../ui/Card';
import { GradientBackground } from '../ui/GradientBackground';
import { Section } from '../ui/Section';

export function ReportPageClient() {
  const router = useRouter();
  const report = useReportStore((state) => state.report);
  const rawJson = useReportStore((state) => state.rawJson);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePdfExport = useExportPdf(componentRef, `match-report-${report?.id}`);

  useEffect(() => {
    if (!report) {
      router.push('/');
    }
  }, [report, router]);

  if (!report || !rawJson) return null;

  return (
    <Section className="relative overflow-hidden" spacing="compact">
      <GradientBackground />
      <div className="relative mx-auto w-full max-w-5xl space-y-6">
        <ExportButtons report={report} rawJson={rawJson} onPdfExport={handlePdfExport} />

        <Card className="p-3 md:p-6">
          <div ref={componentRef}>
            <ReportDocument report={report} />
          </div>
        </Card>
      </div>
    </Section>
  );
}
