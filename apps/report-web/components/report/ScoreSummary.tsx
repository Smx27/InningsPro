import { InningsReport } from '../../types/report';

export function ScoreSummary({ innings, teamName }: { innings: InningsReport; teamName: string }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
        <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">{teamName} Score</span>
        <span className="text-xl font-bold">{innings.totalRuns}/{innings.totalWickets}</span>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
        <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">Overs</span>
        <span className="text-xl font-bold">{innings.totalOvers}</span>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
        <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">Run Rate</span>
        <span className="text-xl font-bold">{innings.runRate.toFixed(2)}</span>
      </div>
      <div className="bg-muted/50 rounded-lg p-4 border flex flex-col justify-center items-center text-center">
        <span className="text-xs font-semibold uppercase text-muted-foreground mb-1">Extras</span>
        <span className="text-xl font-bold">
          {innings.ballEvents.reduce((sum, ball) => sum + (ball.extras || 0), 0)}
        </span>
      </div>
    </div>
  );
}
