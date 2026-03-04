"use client";

import { FileDown, FileText, Download } from 'lucide-react';

import { exportExcel } from '../../lib/export/exportExcel';
import { MatchReport } from '../../types/report';

interface Props {
  report: MatchReport;
  rawJson: string;
  onPdfExport: () => void;
}

export function ExportButtons({ report, rawJson, onPdfExport }: Props) {

  const handleJsonDownload = () => {
    const blob = new Blob([rawJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match-report-${report.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center py-8 print:hidden">
      <button
        onClick={onPdfExport}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
      >
        <FileText className="w-4 h-4 mr-2 text-red-500" />
        Download PDF
      </button>

      <button
        onClick={() => exportExcel(report)}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
      >
        <FileDown className="w-4 h-4 mr-2 text-green-600" />
        Download Excel
      </button>

      <button
        onClick={handleJsonDownload}
        className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 hover:text-gray-900 dark:bg-gray-950 dark:text-gray-100 dark:border-gray-800 dark:hover:bg-gray-800"
      >
        <Download className="w-4 h-4 mr-2 text-blue-500" />
        Download JSON
      </button>
    </div>
  );
}
