import type { BallEvent, InningsReport } from '../../types/report.types';

export function buildRunRateData(innings: InningsReport) {
  if (!innings.ballEvents || innings.ballEvents.length === 0) return [];

  let totalRuns = 0;
  const data: { over: number; runRate: number }[] = [];

  // Group by over to compute run rate at the end of each over
  const ballsByOver = innings.ballEvents.reduce(
    (acc, ball) => {
      const a = acc || {};
      if (!a[ball.over]) {
        a[ball.over] = [];
      }
      a[ball.over]!.push(ball);
      return a;
    },
    {} as Record<number, BallEvent[]>,
  );

  const sortedOvers = Object.keys(ballsByOver || {})
    .map(Number)
    .sort((a, b) => a - b);

  sortedOvers.forEach((overNum) => {
    const runsInOver = (ballsByOver[overNum] || []).reduce(
      (sum, b) => sum + (b.runs || 0) + (b.extras || 0),
      0,
    );
    totalRuns += runsInOver;
    // Over number starts from 0 for the first over, so we use overNum + 1
    const runRate = totalRuns / (overNum + 1);
    data.push({ over: overNum + 1, runRate: Number(runRate.toFixed(2)) });
  });

  return data;
}
