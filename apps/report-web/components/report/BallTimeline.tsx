import { cn } from '../../lib/utils';
import { BallEvent } from '../../types/report.types';

export function BallTimeline({ balls }: { balls: BallEvent[] }) {
  // Show up to the last 12 balls
  const recentBalls = balls.slice(-12);

  const getBallDisplay = (ball: BallEvent) => {
    if (ball.isWicket) return 'W';
    if (ball.extras) {
      const type = ball.extraType ? ball.extraType.charAt(0).toUpperCase() : 'E';
      return `${ball.extras}${type}`;
    }
    return ball.runs.toString();
  };

  const getBallColor = (ball: BallEvent) => {
    if (ball.isWicket) return 'bg-red-500 text-white border-red-600';
    if (ball.isSix) return 'bg-primary text-primary-foreground border-primary';
    if (ball.isFour) return 'bg-primary/80 text-primary-foreground border-primary';
    if (ball.runs === 0 && !ball.extras) return 'bg-muted text-muted-foreground border-border';
    return 'bg-card text-card-foreground border-border';
  };

  if (recentBalls.length === 0) return null;

  return (
    <div className="mb-8 bg-card border rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-bold mb-4 text-muted-foreground uppercase">Recent Deliveries</h3>
      <div className="flex flex-wrap gap-2">
        {recentBalls.map((ball, i) => (
          <div
            key={i}
            className={cn(
              'flex items-center justify-center w-10 h-10 rounded-full border shadow-sm font-bold text-sm',
              getBallColor(ball),
            )}
            title={`Over ${ball.over + 1}.${ball.ball}`}
          >
            {getBallDisplay(ball)}
          </div>
        ))}
      </div>
    </div>
  );
}
