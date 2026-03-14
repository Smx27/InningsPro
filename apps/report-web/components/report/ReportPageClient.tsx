'use client';

import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { ExportButtons } from './ExportButtons';
import { ReportDocument } from './ReportDocument';
import { useExportPdf } from '../../lib/export/exportPdf';
import { useReportStore } from '../../lib/store';
import { Card } from '../ui/Card';
import { Section } from '../ui/Section';

const staggerContainerVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: 'easeOut',
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
      ease: 'easeOut',
      duration: 0.35,
    },
  },
};

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
