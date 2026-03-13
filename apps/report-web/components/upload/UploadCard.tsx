'use client';

import { UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { isMatchReportParseError, parseMatchReport } from '../../lib/parser/parseMatchReport';
import { useReportStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';

const formatPath = (rawPath: string): string => {
  if (!rawPath) return 'report';

  return rawPath
    .replace(/\.(\d+)(?=\.|$)/g, '[$1]')
    .replace(/^teamA/, 'Team A')
    .replace(/^teamB/, 'Team B')
    .replace(/^innings/, 'Innings')
    .replace(/\.(\w)/g, (_, char: string) => ` ${char.toUpperCase()}`)
    .replace(/^(\w)/, (_, char: string) => char.toUpperCase());
};

const getReadableErrorMessage = (error: unknown): string => {
  if (isMatchReportParseError(error)) {
    if (error.issues.length === 0) {
      return error.message;
    }

    const issueMessages = error.issues.slice(0, 5).map((issue) => {
      const label = formatPath(issue.path);
      return `• ${label}: ${issue.message}`;
    });

    const remainingIssueCount = error.issues.length - issueMessages.length;
    const suffix = remainingIssueCount > 0 ? `\n• +${remainingIssueCount} more issue(s)` : '';

    return `Please fix the following report fields:\n${issueMessages.join('\n')}${suffix}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Invalid match report format.';
};

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
      setError(getReadableErrorMessage(err));
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
            isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'
          )}
        >
          <Input id="file-upload" type="file" accept=".json" onChange={onChange} className="hidden" />
          <label htmlFor="file-upload" className="flex cursor-pointer flex-col items-center gap-2">
            <UploadCloud className={cn('mb-2 h-12 w-12', isDragging ? 'text-primary' : 'text-muted-foreground')} />
            <h3 className="text-lg font-semibold">Upload Match Report</h3>
            <p className="mb-4 text-sm text-muted-foreground">Drag and drop your Innings Pro JSON here, or click to browse</p>
            <Button type="button">Select File</Button>
          </label>
        </CardContent>
      </Card>
      {error && (
        <p className="mt-4 whitespace-pre-line rounded-md border border-red-500/40 bg-red-500/10 p-3 text-center text-sm text-red-700 dark:text-red-300">{error}</p>
      )}
    </div>
  );
}
