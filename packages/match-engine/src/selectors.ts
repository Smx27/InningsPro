import { 
  type Id, 
  type Innings, 
  type MatchRules,
  isLegalBall
} from '@inningspro/shared-types';

import type { MatchEngineState } from './types.ts';

/**
 * Formats balls into "Overs.Balls" format.
 */
export function formatOvers(legalBalls: number, ballsPerOver: number): string {
  const completedOvers = Math.floor(legalBalls / ballsPerOver);
  const remainingBalls = legalBalls % ballsPerOver;
  return `${completedOvers}.${remainingBalls}`;
}

/**
 * Calculates the total score, wickets, and overs for an innings.
 */
export function getInningsScore(innings: Innings, rules: MatchRules) {
  let totalRuns = 0;
  let totalWickets = 0;
  let legalBalls = 0;

  for (const event of innings.events) {
    if (event.kind === 'delivery') {
      totalRuns += event.runsOffBat;
      legalBalls++;
    } else if (event.kind === 'extra') {
      totalRuns += event.runs;
      if (!event.rebowled) {
        legalBalls++;
      }
    } else if (event.kind === 'wicket') {
      totalRuns += event.runsCompleted;
      totalWickets++;
      legalBalls++;
    }
  }

  return {
    totalRuns,
    totalWickets,
    oversBowled: formatOvers(legalBalls, rules.ballsPerOver),
  };
}

/**
 * Calculates statistics for a specific batter.
 */
export function getBatterStats(innings: Innings, batterId: Id) {
  let runs = 0;
  let balls = 0;
  let fours = 0;
  let sixes = 0;

  for (const event of innings.events) {
    if (event.batterId !== batterId) continue;

    if (event.kind === 'delivery') {
      runs += event.runsOffBat;
      balls++;
      if (event.runsOffBat === 4 && event.isBoundary) fours++;
      if (event.runsOffBat === 6 && event.isBoundary) sixes++;
    } else if (event.kind === 'wicket') {
      runs += event.runsCompleted;
      balls++;
    } else if (event.kind === 'extra') {
      // In cricket, no-balls count as balls faced, but wides do not.
      // Byes and leg-byes also count as balls faced but runs are not credited to batter.
      if (event.extraType !== 'wide') {
        balls++;
      }
      
      if (event.extraType === 'no-ball' && event.runsOffBat) {
        runs += event.runsOffBat;
        if (event.runsOffBat === 4 && event.isBoundary) fours++;
        if (event.runsOffBat === 6 && event.isBoundary) sixes++;
      }
    }
  }

  const strikeRate = balls > 0 ? (runs / balls) * 100 : 0;

  return {
    runs,
    balls,
    fours,
    sixes,
    strikeRate: Number(strikeRate.toFixed(2)),
  };
}

/**
 * Calculates statistics for a specific bowler.
 */
export function getBowlerStats(innings: Innings, bowlerId: Id, rules: MatchRules) {
  let runsConceded = 0;
  let wickets = 0;
  let legalBalls = 0;
  
  const oversMap = new Map<number, { runs: number, isMaiden: boolean, balls: number }>();

  for (const event of innings.events) {
    if (event.bowlerId !== bowlerId) continue;

    let eventRuns = 0;
    let countsAsLegal = false;

    if (event.kind === 'delivery') {
      eventRuns = event.runsOffBat;
      countsAsLegal = true;
    } else if (event.kind === 'extra') {
      // Bowler is credited with runs from Wides and No-balls.
      // Byes and Leg-byes are not credited to the bowler.
      if (event.extraType === 'wide' || event.extraType === 'no-ball') {
        eventRuns = event.runs;
      }
      countsAsLegal = !event.rebowled;
    } else if (event.kind === 'wicket') {
      eventRuns = event.runsCompleted;
      if (event.creditedToBowler) {
        wickets++;
      }
      countsAsLegal = true;
    }

    runsConceded += eventRuns;
    if (countsAsLegal) {
      legalBalls++;
    }

    // Track for maidens
    const overNum = event.overNumber;
    if (!oversMap.has(overNum)) {
      oversMap.set(overNum, { runs: 0, isMaiden: true, balls: 0 });
    }
    const overStats = oversMap.get(overNum)!;
    overStats.runs += eventRuns;
    if (countsAsLegal) {
      overStats.balls++;
    }
  }

  let maidens = 0;
  for (const stats of oversMap.values()) {
    // An over is a maiden if it's completed and 0 runs were conceded.
    if (stats.balls === rules.ballsPerOver && stats.runs === 0) {
      maidens++;
    }
  }

  const totalOversInDecimals = legalBalls / rules.ballsPerOver;
  const economy = totalOversInDecimals > 0 ? runsConceded / totalOversInDecimals : 0;

  return {
    overs: formatOvers(legalBalls, rules.ballsPerOver),
    maidens,
    runs: runsConceded,
    wickets,
    economy: Number(economy.toFixed(2)),
  };
}

/**
 * Provides suggestions for the next striker, non-striker, and bowler.
 */
export function getMatchHints(state: MatchEngineState) {
  const innings = state.innings[state.innings.length - 1];
  if (!innings || state.status === 'completed') return null;

  const lastEvent = innings.events[innings.events.length - 1];

  if (!lastEvent) {
    return {
      suggestedStrikerId: null,
      suggestedNonStrikerId: null,
      suggestedBowlerId: null,
      overJustCompleted: false,
      message: 'Match started. Please select opening batters and bowler.',
    };
  }

  const legalBalls = innings.events.filter(isLegalBall).length;

  const isOverComplete = legalBalls > 0 && legalBalls % state.rules.ballsPerOver === 0;
  const lastBallWasLegal = isLegalBall(lastEvent);
  
  const overJustCompleted = isOverComplete && lastBallWasLegal;

  // Determine current striker/non-striker after the last event
  let currentStrikerId = lastEvent.batterId;
  let currentNonStrikerId = lastEvent.nonStrikerId;

  // Striker rotation logic: odd runs
  let runsForRotation = 0;
  if (lastEvent.kind === 'delivery') {
    runsForRotation = lastEvent.runsOffBat;
  } else if (lastEvent.kind === 'extra') {
    const penalty = (lastEvent.extraType === 'wide' && state.rules.wideBallAddsRun) || (lastEvent.extraType === 'no-ball' && state.rules.noBallAddsRun) ? 1 : 0;
    runsForRotation = lastEvent.runs - penalty;
  } else if (lastEvent.kind === 'wicket') {
    runsForRotation = lastEvent.runsCompleted;
  }

  if (runsForRotation % 2 !== 0) {
    [currentStrikerId, currentNonStrikerId] = [currentNonStrikerId, currentStrikerId];
  }

  // Striker rotation logic: over completion
  if (overJustCompleted) {
    [currentStrikerId, currentNonStrikerId] = [currentNonStrikerId, currentStrikerId];
  }

  // Suggestions
  let suggestedStrikerId: string | null = currentStrikerId;
  let suggestedNonStrikerId: string | null = currentNonStrikerId;
  let suggestedBowlerId: string | null = lastEvent.bowlerId;
  let message = 'Next ball ready.';

  if (lastEvent.kind === 'wicket') {
    if (lastEvent.playerOutId === currentStrikerId) {
      suggestedStrikerId = null;
      message = 'Batter out! Please select a new striker.';
    } else if (lastEvent.playerOutId === currentNonStrikerId) {
      suggestedNonStrikerId = null;
      message = 'Non-striker out! Please select a new non-striker.';
    }
  }

  if (overJustCompleted) {
    suggestedBowlerId = null;
    message = 'Over complete! Please select a new bowler.';
  }

  return {
    suggestedStrikerId,
    suggestedNonStrikerId,
    suggestedBowlerId,
    overJustCompleted,
    message,
  };
}
