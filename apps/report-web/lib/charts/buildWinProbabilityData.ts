import type { BallEvent, MatchReport } from '../../types/report.types';

export interface WinProbabilityPoint {
  over: number;
  teamA: number;
  teamB: number;
}

interface ChaseProgressState {
  ballsPlayed: number;
  currentRuns: number;
  remainingRuns: number;
  remainingBalls: number;
}

const MAX_REFERENCE_RUN_RATE = 12;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toOverBallProgress(over: number, ball: number): number {
  return Number(`${over + 1}.${ball}`);
}

function sortBallsByProgression(ballEvents: BallEvent[]): BallEvent[] {
  return [...ballEvents].sort((a, b) => a.over - b.over || a.ball - b.ball);
}

export function calculateChasingWinProbability(state: ChaseProgressState): number {
  if (state.remainingRuns === 0) return 100;
  if (state.remainingBalls === 0 && state.remainingRuns > 0) return 0;

  const requiredRunRate = state.remainingRuns / (state.remainingBalls / 6);
  const winProbability = 100 - (requiredRunRate / MAX_REFERENCE_RUN_RATE) * 100;

  return clamp(winProbability, 0, 100);
}

export function buildWinProbabilityData(report: MatchReport): WinProbabilityPoint[] {
  const [firstInnings, secondInnings] = report.innings;
  if (!firstInnings || !secondInnings) return [];

  const battingSecondIsTeamA = secondInnings.teamId === report.teamA.id;
  const target = firstInnings.totalRuns + 1;
  const totalBalls = report.overs * 6;

  const orderedBalls = sortBallsByProgression(secondInnings.ballEvents || []);
  const data: WinProbabilityPoint[] = [];

  let currentRuns = 0;
  let ballsPlayed = 0;
  let chaseCompleted = false;

  orderedBalls.forEach((ballEvent) => {
    currentRuns += (ballEvent.runs || 0) + (ballEvent.extras || 0);
    ballsPlayed += 1;

    const remainingRuns = Math.max(target - currentRuns, 0);
    const remainingBalls = Math.max(totalBalls - ballsPlayed, 0);

    chaseCompleted = chaseCompleted || remainingRuns === 0;

    const chasingWinProbability = chaseCompleted
      ? 100
      : calculateChasingWinProbability({
          ballsPlayed,
          currentRuns,
          remainingRuns,
          remainingBalls,
        });

    const teamAProbability = battingSecondIsTeamA ? chasingWinProbability : 100 - chasingWinProbability;

    data.push({
      over: toOverBallProgress(ballEvent.over, ballEvent.ball),
      teamA: Number(teamAProbability.toFixed(1)),
      teamB: Number((100 - teamAProbability).toFixed(1)),
    });
  });

  return data;
}
