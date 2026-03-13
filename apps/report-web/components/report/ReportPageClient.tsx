'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { ExportButtons } from './ExportButtons';
import { ReportDocument } from './ReportDocument';
import { useExportPdf } from '../../lib/export/exportPdf';
import { useReportStore } from '../../lib/store';

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
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <ExportButtons report={report} rawJson={rawJson} onPdfExport={handlePdfExport} />

      <div ref={componentRef}>
        <ReportDocument report={report} />
      </div>
    </div>
  );
}
