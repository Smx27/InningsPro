"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { BallTimeline } from '../../components/report/BallTimeline';
import { BattingScorecard } from '../../components/report/BattingScorecard';
import { BowlingScorecard } from '../../components/report/BowlingScorecard';
import { ExportButtons } from '../../components/report/ExportButtons';
import { ManhattanChart } from '../../components/report/ManhattanChart';
import { MatchHeader } from '../../components/report/MatchHeader';
import { RunRateChart } from '../../components/report/RunRateChart';
import { ScoreSummary } from '../../components/report/ScoreSummary';
import { buildManhattanData } from '../../lib/charts/buildManhattanData';
import { buildRunRateData } from '../../lib/charts/buildRunRateData';
import { useExportPdf } from '../../lib/export/exportPdf';
import { useReportStore } from '../../lib/store';

export default function ReportPage() {
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

      <div ref={componentRef} className="bg-background print:bg-white p-4 md:p-8 rounded-xl">
        <MatchHeader report={report} />

        {report.innings.map((inning, idx) => {
          const isTeamA = inning.teamId === report.teamA.id;
          const teamName = isTeamA ? report.teamA.name : report.teamB.name;
          const teamPlayers = isTeamA ? report.teamA.players : report.teamB.players;
          const oppPlayers = isTeamA ? report.teamB.players : report.teamA.players;

          return (
            <div key={inning.teamId} className="mb-16 pb-8 border-b last:border-0 last:mb-0 last:pb-0 break-inside-avoid">
              <h2 className="text-2xl font-bold mb-6 text-green-600 dark:text-green-500">Innings {idx + 1}: {teamName}</h2>

              <ScoreSummary innings={inning} teamName={teamName} />

              <BattingScorecard scorecard={inning.battingScorecard} players={teamPlayers} />

              <BowlingScorecard scorecard={inning.bowlingScorecard} players={oppPlayers} />

              <BallTimeline balls={inning.ballEvents} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:block print:w-full">
                <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
                  <RunRateChart data={buildRunRateData(inning)} />
                </div>
                <div className="print:w-full print:h-[300px] print:mb-8 break-inside-avoid">
                  <ManhattanChart data={buildManhattanData(inning)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
