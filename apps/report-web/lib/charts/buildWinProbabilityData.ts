import type { MatchReport } from '../../types/report.types';

export interface WinProbabilityPoint {
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

export function buildWinProbabilityData(report: MatchReport): WinProbabilityPoint[] {
  const [teamAInnings, teamBInnings] = report.innings;
  if (!teamAInnings || !teamBInnings) return [];

  const teamAByOver = buildCumulativeRunsByOver(teamAInnings.ballEvents || []);
  const teamBByOver = buildCumulativeRunsByOver(teamBInnings.ballEvents || []);

  const maxOver = Math.max(...teamAByOver.keys(), ...teamBByOver.keys(), 0);

  let teamALastRuns = 0;
  let teamBLastRuns = 0;
  const data: WinProbabilityPoint[] = [];

  for (let over = 1; over <= maxOver; over += 1) {
    if (teamAByOver.has(over)) teamALastRuns = teamAByOver.get(over) || teamALastRuns;
    if (teamBByOver.has(over)) teamBLastRuns = teamBByOver.get(over) || teamBLastRuns;

    const teamATotal = Math.max(teamAInnings.totalRuns, 1);
    const teamBTotal = Math.max(teamBInnings.totalRuns, 1);
    const teamAProgress = teamALastRuns / teamATotal;
    const teamBProgress = teamBLastRuns / teamBTotal;

    const ratio = teamAProgress + teamBProgress === 0 ? 0.5 : teamAProgress / (teamAProgress + teamBProgress);
    const teamAProbability = Number((ratio * 100).toFixed(1));

    data.push({
      over,
      teamA: teamAProbability,
      teamB: Number((100 - teamAProbability).toFixed(1)),
    });
  }

  return data;
}
