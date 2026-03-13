import { InningsReport } from '../../types/report.types';

export function buildManhattanData(innings: InningsReport) {
  if (!innings.ballEvents || innings.ballEvents.length === 0) return [];

  // Group runs by over
  const ballsByOver = innings.ballEvents.reduce((acc, ball) => {
    const a = acc || {};
    if (!a[ball.over]) {
      a[ball.over] = [];
    }
    a[ball.over]!.push(ball);
    return a;
  }, {} as Record<number, any[]>);

  const sortedOvers = Object.keys(ballsByOver || {}).map(Number).sort((a, b) => a - b);
  const data: { over: number; runs: number }[] = [];

  sortedOvers.forEach(overNum => {
    const runsInOver = (ballsByOver[overNum] || []).reduce((sum, b) => sum + (b.runs || 0) + (b.extras || 0), 0);
    data.push({ over: overNum + 1, runs: runsInOver });
  });

  return data;
}
