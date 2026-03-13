import { MatchReport } from '../../types/report';

export function MatchHeader({ report }: { report: MatchReport }) {
  const tA = report.teamA.name;
  const tB = report.teamB.name;

  // Format score strings like: Team A 145/6 (20)
  const getScoreStr = (teamId: string, teamName: string) => {
    const innings = report.innings.find(i => i.teamId === teamId);
    if (!innings) return `${teamName} (Yet to bat)`;
    return `${teamName} ${innings.totalRuns}/${innings.totalWickets} (${innings.totalOvers})`;
  };

  return (
    <div className="flex flex-col items-center border-b pb-6 mb-8 text-center">
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {tA} vs {tB}
      </h1>
      <p className="text-muted-foreground text-lg mb-6">
        {report.overs} Overs Match {report.date ? `• ${report.date}` : ''}
      </p>

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-16 w-full justify-center">
        <div className="bg-card shadow rounded-xl p-6 flex-1 max-w-sm text-center border">
          <p className="text-sm font-semibold uppercase text-muted-foreground mb-1">Team 1</p>
          <p className="text-2xl font-bold text-primary">{getScoreStr(report.teamA.id, tA)}</p>
        </div>
        <div className="bg-card shadow rounded-xl p-6 flex-1 max-w-sm text-center border">
          <p className="text-sm font-semibold uppercase text-muted-foreground mb-1">Team 2</p>
          <p className="text-2xl font-bold text-primary">{getScoreStr(report.teamB.id, tB)}</p>
        </div>
      </div>
    </div>
  );
}
