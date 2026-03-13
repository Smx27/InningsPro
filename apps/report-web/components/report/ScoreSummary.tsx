import { InningsReport } from '../../types/report';

export function ScoreSummary({ innings, teamName }: { innings: InningsReport; teamName: string }) {
  const extras = innings.ballEvents.reduce((sum, ball) => sum + (ball.extras || 0), 0);

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
          <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">Total Runs</span>
          <span className="text-xl font-bold">{innings.totalRuns}</span>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
          <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">Wickets</span>
          <span className="text-xl font-bold">{innings.totalWickets}</span>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
          <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">Overs</span>
          <span className="text-xl font-bold">{innings.totalOvers}</span>
        </div>
        <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
          <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">Run Rate</span>
          <span className="text-xl font-bold">{innings.runRate.toFixed(2)}</span>
        </div>
      </div>
      <div className="bg-muted/30 rounded-lg px-4 py-2 border text-sm text-muted-foreground flex items-center justify-between">
        <span className="font-semibold uppercase">{teamName} Extras</span>
        <span className="font-bold text-foreground">{extras}</span>
      </div>
    </div>
  );
}
