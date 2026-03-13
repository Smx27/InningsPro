import type { MatchReport } from '../../types/report.types';

export interface WormChartPoint {
  over: number;
  teamA: number;
  teamB: number;
}

function buildCumulativeRunsByOver(ballEvents: MatchReport['innings'][number]['ballEvents']) {
  const runsByOver = new Map<number, number>();

  ballEvents.forEach((ball) => {
    const runs = (ball.runs || 0) + (ball.extras || 0);
    runsByOver.set(ball.over, (runsByOver.get(ball.over) || 0) + runs);
  });

  const sortedOvers = [...runsByOver.keys()].sort((a, b) => a - b);
  let cumulativeRuns = 0;
  const cumulativeByOver = new Map<number, number>();

  sortedOvers.forEach((over) => {
    cumulativeRuns += runsByOver.get(over) || 0;
    cumulativeByOver.set(over + 1, cumulativeRuns);
  });

  return cumulativeByOver;
}

export function buildWormChartData(report: MatchReport): WormChartPoint[] {
  const [teamAInnings, teamBInnings] = report.innings;
  if (!teamAInnings || !teamBInnings) return [];

  const teamAByOver = buildCumulativeRunsByOver(teamAInnings.ballEvents || []);
  const teamBByOver = buildCumulativeRunsByOver(teamBInnings.ballEvents || []);

  const maxOver = Math.max(...teamAByOver.keys(), ...teamBByOver.keys(), 0);

  let teamALast = 0;
  let teamBLast = 0;
  const points: WormChartPoint[] = [];

  for (let over = 1; over <= maxOver; over += 1) {
    if (teamAByOver.has(over)) teamALast = teamAByOver.get(over) || teamALast;
    if (teamBByOver.has(over)) teamBLast = teamBByOver.get(over) || teamBLast;

    points.push({
      over,
      teamA: teamALast,
      teamB: teamBLast,
    });
  }

  return points;
}
