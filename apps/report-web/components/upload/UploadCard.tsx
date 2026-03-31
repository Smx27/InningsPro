'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Loader2, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { isMatchReportParseError, parseMatchReport } from '../../lib/parser/parseMatchReport';
import {
  isTournamentReportParseError,
  parseTournamentReport,
} from '../../lib/parser/parseTournamentReport';
import { useReportStore } from '../../lib/store';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/Card';
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
  if (isMatchReportParseError(error) || isTournamentReportParseError(error)) {
    if (error.issues.length === 0) {
      return 'The report schema is invalid. Please check required fields and try again.';
    }

    const issueMessages = error.issues.slice(0, 3).map((issue) => {
      const label = formatPath(issue.path);
      return `${label}: ${issue.message}`;
    });

    const remainingIssueCount = error.issues.length - issueMessages.length;
    const suffix = remainingIssueCount > 0 ? ` +${remainingIssueCount} more issue(s).` : '';

    return `Fix these fields: ${issueMessages.join(' · ')}.${suffix}`;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Invalid match report format.';
};

export function UploadCard() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const setReport = useReportStore((state) => state.setReport);
  const setTournamentReport = useReportStore((state) => state.setTournamentReport);

  const handleFile = async (file: File) => {
    setError(null);
    setIsSuccess(false);
    setStatusMessage(null);

    if (!file.name.endsWith('.json')) {
      setError('Please upload a JSON file.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Uploading report...');

    try {
      const text = await file.text();
      setStatusMessage('Validating report...');

      try {
        const tournamentReport = parseTournamentReport(text);
        setTournamentReport(tournamentReport, text);
        setStatusMessage('Tournament report ready.');
        setIsSuccess(true);
        await new Promise((resolve) => setTimeout(resolve, 700));
        router.push('/tournament-analytics');
        return;
      } catch (tournamentError) {
        if (!isTournamentReportParseError(tournamentError)) {
          throw tournamentError;
        }
      }

      const report = parseMatchReport(text);
      setReport(report, text);
      setStatusMessage('Match report ready.');
      setIsSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 700));
      router.push('/reports');
    } catch (err: unknown) {
      setError(getReadableErrorMessage(err));
    } finally {
      setIsProcessing(false);
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
      <Card className="overflow-hidden border-white/30 bg-white/40 shadow-2xl shadow-primary/10 backdrop-blur-xl dark:border-white/15 dark:bg-slate-950/40">
        <CardContent
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={cn(
            'rounded-xl border-2 border-dashed p-10 text-center transition-all duration-300',
            isDragging
              ? 'scale-[1.01] border-primary bg-primary/15 shadow-[0_0_0_6px_rgba(56,189,248,0.18)]'
              : 'border-border/60 bg-background/50 hover:border-primary/70 hover:bg-primary/5',
            (isProcessing || isSuccess) && 'pointer-events-none',
          )}
        >
          <Input
            id="file-upload"
            type="file"
            accept=".json"
            onChange={onChange}
            className="hidden"
            disabled={isProcessing || isSuccess}
          />
          <div className="relative">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex flex-col items-center gap-2"
                >
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                  >
                    <CheckCircle2 className="mb-2 h-14 w-14 text-emerald-500" />
                  </motion.div>
                  <h3 className="text-lg font-semibold">Report parsed successfully</h3>
                  <p className="text-sm text-muted-foreground">Taking you to your report...</p>
                </motion.div>
              ) : (
                <motion.label
                  key="idle"
                  htmlFor="file-upload"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={cn(
                    'flex cursor-pointer flex-col items-center gap-2',
                    isProcessing && 'cursor-progress',
                  )}
                >
                  <UploadCloud
                    className={cn(
                      'mb-2 h-12 w-12 transition-colors duration-300',
                      isDragging ? 'text-primary' : 'text-muted-foreground',
                    )}
                  />
                  <h3 className="text-xl font-semibold tracking-tight">Upload Report</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Drag and drop your Innings Pro JSON here, or click to browse.
                  </p>
                  <Button type="button" disabled={isProcessing}>
                    Select File
                  </Button>
                </motion.label>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isProcessing && !isSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-6 flex items-center justify-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-sm text-primary"
                >
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{statusMessage ?? 'Processing report...'}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
      {error && (
        <p className="mt-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-center text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      )}
    </div>
  );
}
