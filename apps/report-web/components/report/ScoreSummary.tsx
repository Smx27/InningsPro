import { InningsReport } from '../../types/report.types';
import { Card } from '../ui/Card';

export function ScoreSummary({ innings, teamName }: { innings: InningsReport; teamName: string }) {
  const extras = innings.ballEvents.reduce((sum, ball) => sum + (ball.extras || 0), 0);

  return (
    <div className="mb-6 space-y-3">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Card className="flex flex-col items-center justify-center rounded-xl border-white/30 bg-muted/25 p-4 text-center backdrop-blur-sm dark:border-white/10">
          <span className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Total Runs
          </span>
          <span className="text-xl font-bold">{innings.totalRuns}</span>
        </Card>
        <Card className="flex flex-col items-center justify-center rounded-xl border-white/30 bg-muted/25 p-4 text-center backdrop-blur-sm dark:border-white/10">
          <span className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Wickets
          </span>
          <span className="text-xl font-bold">{innings.totalWickets}</span>
        </Card>
        <Card className="flex flex-col items-center justify-center rounded-xl border-white/30 bg-muted/25 p-4 text-center backdrop-blur-sm dark:border-white/10">
          <span className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Overs</span>
          <span className="text-xl font-bold">{innings.totalOvers}</span>
        </Card>
        <Card className="flex flex-col items-center justify-center rounded-xl border-white/30 bg-muted/25 p-4 text-center backdrop-blur-sm dark:border-white/10">
          <span className="mb-1 text-xs font-semibold uppercase text-muted-foreground">
            Run Rate
          </span>
          <span className="text-xl font-bold">{innings.runRate.toFixed(2)}</span>
        </Card>
      </div>
      <Card className="flex items-center justify-between rounded-xl border-white/30 bg-muted/20 px-4 py-2 text-sm text-muted-foreground dark:border-white/10">
        <span className="font-semibold uppercase">{teamName} Extras</span>
        <span className="font-bold text-foreground">{extras}</span>
      </Card>
    </div>
  );
}
