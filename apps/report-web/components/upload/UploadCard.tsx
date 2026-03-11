'use client';

import { UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { parseMatchReport } from '../../lib/parser/parseMatchReport';
import { useReportStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid match report format.';
      setError(message);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const [file] = Array.from(e.dataTransfer.files);
    if (file) {
      void handleFile(file);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [file] = Array.from(e.target.files ?? []);
    if (file) {
      void handleFile(file);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <Card>
        <CardContent
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            'rounded-xl border-2 border-dashed p-10 text-center transition-colors duration-200',
            isDragging ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-gray-300 hover:border-green-400 dark:border-gray-700'
          )}
        >
          <Input id="file-upload" type="file" accept=".json" onChange={onChange} className="hidden" />
          <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center gap-2">
            <UploadCloud className={cn('mb-2 h-12 w-12', isDragging ? 'text-green-500' : 'text-gray-400')} />
            <h3 className="text-lg font-semibold">Upload Match Report</h3>
            <p className="mb-4 text-sm text-gray-500">Drag and drop your Innings Pro JSON here, or click to browse</p>
            <Button type="button">Select File</Button>
          </label>
        </CardContent>
      </Card>
      {error && <p className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-center text-sm text-red-600">{error}</p>}
    </div>
  );
}
