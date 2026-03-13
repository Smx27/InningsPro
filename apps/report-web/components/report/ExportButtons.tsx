'use client';

import { Download, FileDown, FileText } from 'lucide-react';

import { exportExcel } from '../../lib/export/exportExcel';
import { MatchReport } from '../../types/report.types';
import { Button } from '../ui/button';

interface Props {
  report: MatchReport;
  rawJson: string;
  onPdfExport: () => void;
}

export function ExportButtons({ report, rawJson, onPdfExport }: Props) {
  const handleJsonDownload = () => {
    const blob = new Blob([rawJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `match-report-${report.id}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 py-8 print:hidden">
      <Button onClick={onPdfExport} variant="outline">
        <FileText className="h-4 w-4 text-red-500" />
        Download PDF
      </Button>
      <Button onClick={() => exportExcel(report)} variant="outline">
        <FileDown className="h-4 w-4 text-green-600" />
        Download Excel
      </Button>
      <Button onClick={handleJsonDownload} variant="outline">
        <Download className="h-4 w-4 text-blue-500" />
        Download JSON
      </Button>
    </div>
  );
}
