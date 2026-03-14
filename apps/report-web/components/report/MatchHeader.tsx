import { MatchReport } from '../../types/report.types';
import { Card } from '../ui/Card';

export function MatchHeader({ report }: { report: MatchReport }) {
  const tA = report.teamA.name;
  const tB = report.teamB.name;

  const getScoreStr = (teamId: string, teamName: string) => {
    const innings = report.innings.find((i) => i.teamId === teamId);
    if (!innings) return `${teamName} (Yet to bat)`;
    return `${teamName} ${innings.totalRuns}/${innings.totalWickets} (${innings.totalOvers})`;
  };

  return (
    <div className="mb-8 flex flex-col items-center border-b pb-6 text-center">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">
        {tA} vs {tB}
      </h1>
      <p className="mb-6 text-lg text-muted-foreground">
        {report.overs} Overs Match {report.date ? `• ${report.date}` : ''}
      </p>

      <div className="flex w-full flex-col justify-center gap-6 sm:flex-row sm:gap-16">
        <Card className="flex-1 p-6 text-center max-w-sm">
          <p className="mb-1 text-sm font-semibold uppercase text-muted-foreground">Team 1</p>
          <p className="text-2xl font-bold text-primary">{getScoreStr(report.teamA.id, tA)}</p>
        </Card>
        <Card className="flex-1 p-6 text-center max-w-sm">
          <p className="mb-1 text-sm font-semibold uppercase text-muted-foreground">Team 2</p>
          <p className="text-2xl font-bold text-primary">{getScoreStr(report.teamB.id, tB)}</p>
        </Card>
      </div>
    </div>
  );
}
