'use client';

import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { ExportButtons } from './ExportButtons';
import { ReportDocument } from './ReportDocument';
import demoMatchReport from '../../lib/demo/demoMatchReport.json';
import { useExportPdf } from '../../lib/export/exportPdf';
import { parseMatchReportData } from '../../lib/parser/parseMatchReport';
import { useReportStore } from '../../lib/store';
import { Button } from '../ui/button';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';
import { UploadCard } from '../upload/UploadCard';

const staggerContainerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut' as const,
      duration: 0.45,
      staggerChildren: 0.12,
    },
  },
};

const staggerItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut' as const,
      duration: 0.35,
    },
  },
};

export function ReportPageClient() {
  const report = useReportStore((state) => state.report);
  const rawJson = useReportStore((state) => state.rawJson);
  const setReport = useReportStore((state) => state.setReport);
  const searchParams = useSearchParams();
  const isDemoReport = searchParams.get('demo') === 'true';
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePdfExport = useExportPdf(componentRef, `match-report-${report?.id}`);

  useEffect(() => {
    if (report) return;

    if (isDemoReport) {
      const parsedDemoReport = parseMatchReportData(demoMatchReport);
      setReport(parsedDemoReport, JSON.stringify(demoMatchReport));
    }
  }, [isDemoReport, report, setReport]);

  if (!report || !rawJson) {
    return (
      <Section className="relative overflow-hidden" spacing="compact">
        <motion.div
          className="relative mx-auto flex w-full max-w-5xl flex-col gap-6"
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={staggerItemVariants}>
            <Card
              interactive
              className="rounded-2xl p-6 text-center shadow-xl backdrop-blur md:p-8"
            >
              <h1 className="text-2xl font-bold">Match Report Builder</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Upload a match report JSON to render a full breakdown, or start with the demo
                report.
              </p>
              <Button asChild className="mt-5" variant="outline">
                <Link href="/reports?demo=true">Load Demo Report</Link>
              </Button>
            </Card>
          </motion.div>

          <motion.div variants={staggerItemVariants}>
            <UploadCard />
          </motion.div>
        </motion.div>
      </Section>
    );
  }

  return (
    <Section className="relative overflow-hidden" spacing="compact">
      <motion.div
        className="relative mx-auto w-full max-w-7xl space-y-6"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={staggerItemVariants}>
          <Card interactive className="rounded-2xl shadow-xl backdrop-blur p-5 print:hidden">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                  <Crown className="h-3.5 w-3.5" />
                  Premium Exports
                </p>
                <h2 className="text-xl font-semibold">Export Center</h2>
                <p className="text-sm text-muted-foreground">
                  Download your report in presentation-ready formats.
                </p>
              </div>
              <ExportButtons report={report} rawJson={rawJson} onPdfExport={handlePdfExport} />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={staggerItemVariants}>
          <Card interactive className="rounded-2xl shadow-xl backdrop-blur p-3 md:p-6">
            <div ref={componentRef}>
              <ReportDocument report={report} />
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </Section>
  );
}
