"use client";

import { UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

import { parseMatchReport } from '../../lib/parser/parseMatchReport';
import { useReportStore } from '../../lib/store';
import { cn } from '../../lib/utils';

export function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setReport = useReportStore((state) => state.setReport);

  const handleFile = async (file: File) => {
    setError(null);
    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file.');
      return;
    }

    try {
      const text = await file.text();
      const report = parseMatchReport(text);
      setReport(report, text);
      router.push('/report');
    } catch (err: any) {
      setError(err.message || 'Invalid match report format.');
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, [handleFile]);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, [handleFile]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files[0]) handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={cn(
          "border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors duration-200",
          isDragging ? "border-green-500 bg-green-50 dark:bg-green-950/20" : "border-gray-300 hover:border-green-400 dark:border-gray-700"
        )}
      >
        <input
          type="file"
          accept=".json"
          onChange={onChange}
          className="hidden"
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
          <UploadCloud className={cn("h-12 w-12 mb-4", isDragging ? "text-green-500" : "text-gray-400")} />
          <h3 className="text-lg font-semibold mb-2">Upload Match Report</h3>
          <p className="text-sm text-gray-500 mb-4">
            Drag and drop your Innings Pro JSON here, or click to browse
          </p>
          <span className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-colors rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
            Select File
          </span>
        </label>
      </div>
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
}
