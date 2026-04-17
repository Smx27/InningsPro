import { 
  type DeliveryBallEvent, 
  type ExtraBallEvent, 
  type Innings, 
  type WicketBallEvent,
  isLegalBall 
} from '@inningspro/shared-types';

import type { MatchEngineState, MatchEngineAction } from './types.ts';

/**
 * Match Engine Reducer
 * Handles all core scoring logic and state transitions.
 */
export function matchReducer(state: MatchEngineState, action: MatchEngineAction): MatchEngineState {
  if (state.status === 'completed') return state;

  // Clear previous rejection reason
  const nextState = { ...state, lastRejectionReason: undefined };

  switch (action.type) {
    case 'START_MATCH':
      return {
        ...nextState,
        id: action.payload.matchId,
        rules: action.payload.rules,
        status: 'live',
      };

    case 'RECORD_DELIVERY': {
      const innings = nextState.innings[nextState.innings.length - 1];
      if (!innings) return nextState;

      const legalBalls = innings.events.filter(isLegalBall).length;
      const overNumber = Math.floor(legalBalls / nextState.rules.ballsPerOver);

      // Bowler Rotation Check
      if (isFirstBallOfNewOver(innings, overNumber)) {
        const lastBowlerId = getLastOverBowlerId(innings, overNumber - 1);
        if (lastBowlerId === action.payload.bowlerId) {
          return {
            ...nextState,
            lastRejectionReason: 'The same bowler cannot bowl consecutive overs.',
          };
        }
      }

      const ballsInCurrentOver = innings.events.filter((e) => e.overNumber === overNumber).length;

      const newEvent: DeliveryBallEvent = {
        id: action.payload.id,
        inningsId: innings.id,
        kind: 'delivery',
        overNumber,
        ballInOver: ballsInCurrentOver + 1,
        timestamp: action.payload.timestamp,
        batterId: action.payload.batterId,
        nonStrikerId: action.payload.nonStrikerId,
        bowlerId: action.payload.bowlerId,
        runsOffBat: action.payload.runsOffBat,
        isBoundary: action.payload.isBoundary,
      };

      return checkMatchCompletion(
        updateInnings(nextState, innings.id, (inn) => ({
          ...inn,
          events: [...inn.events, newEvent],
        })),
      );
    }

    case 'RECORD_EXTRA': {
      const innings = nextState.innings[nextState.innings.length - 1];
      if (!innings) return nextState;

      const { type, runs, batterId, nonStrikerId, bowlerId, id, timestamp, runsOffBat, isBoundary } = action.payload;
      const rebowled = type === 'wide' || type === 'no-ball';

      const legalBalls = innings.events.filter(isLegalBall).length;
      const overNumber = Math.floor(legalBalls / nextState.rules.ballsPerOver);

      // Bowler Rotation Check
      if (isFirstBallOfNewOver(innings, overNumber)) {
        const lastBowlerId = getLastOverBowlerId(innings, overNumber - 1);
        if (lastBowlerId === bowlerId) {
          return {
            ...nextState,
            lastRejectionReason: 'The same bowler cannot bowl consecutive overs.',
          };
        }
      }

      const ballsInCurrentOver = innings.events.filter((e) => e.overNumber === overNumber).length;

      const penalty = (type === 'wide' && nextState.rules.wideBallAddsRun) || (type === 'no-ball' && nextState.rules.noBallAddsRun) ? 1 : 0;
      const totalRuns = (runs + penalty);

      const newEvent: ExtraBallEvent = {
        id,
        inningsId: innings.id,
        kind: 'extra',
        extraType: type,
        runs: totalRuns,
        runsOffBat,
        isBoundary,
        rebowled,
        overNumber,
        ballInOver: ballsInCurrentOver + 1,
        timestamp,
        batterId,
        nonStrikerId,
        bowlerId,
      };

      return checkMatchCompletion(
        updateInnings(nextState, innings.id, (inn) => ({
          ...inn,
          events: [...inn.events, newEvent],
        })),
      );
    }

    case 'RECORD_WICKET': {
      const innings = nextState.innings[nextState.innings.length - 1];
      if (!innings) return nextState;

      const { type, playerOutId, batterId, nonStrikerId, bowlerId, id, timestamp, runsCompleted } = action.payload;

      const legalBalls = innings.events.filter(isLegalBall).length;
      const overNumber = Math.floor(legalBalls / nextState.rules.ballsPerOver);

      // Bowler Rotation Check
      if (isFirstBallOfNewOver(innings, overNumber)) {
        const lastBowlerId = getLastOverBowlerId(innings, overNumber - 1);
        if (lastBowlerId === bowlerId) {
          return {
            ...nextState,
            lastRejectionReason: 'The same bowler cannot bowl consecutive overs.',
          };
        }
      }

      const ballsInCurrentOver = innings.events.filter((e) => e.overNumber === overNumber).length;

      const creditedToBowler = ['bowled', 'caught', 'lbw', 'stumped', 'hit-wicket'].includes(type);

      const newEvent: WicketBallEvent = {
        id,
        inningsId: innings.id,
        kind: 'wicket',
        wicketType: type,
        playerOutId,
        creditedToBowler,
        runsCompleted: runsCompleted || 0,
        overNumber,
        ballInOver: ballsInCurrentOver + 1,
        timestamp,
        batterId,
        nonStrikerId,
        bowlerId,
      };

      return checkMatchCompletion(
        updateInnings(nextState, innings.id, (inn) => ({
          ...inn,
          events: [...inn.events, newEvent],
        })),
      );
    }

    default:
      return nextState;
  }
}

function updateInnings(
  state: MatchEngineState,
  inningsId: string,
  updater: (inn: Innings) => Innings,
): MatchEngineState {
  return {
    ...state,
    innings: state.innings.map((inn) => (inn.id === inningsId ? updater(inn) : inn)),
  };
}

function isFirstBallOfNewOver(innings: Innings, overNumber: number): boolean {
  if (overNumber === 0) return false;
  return !innings.events.some((e) => e.overNumber === overNumber);
}

function getLastOverBowlerId(innings: Innings, lastOverNumber: number): string | null {
  if (lastOverNumber < 0) return null;
  const lastOverEvents = innings.events.filter((e) => e.overNumber === lastOverNumber);
  if (lastOverEvents.length === 0) return null;
  return lastOverEvents[lastOverEvents.length - 1]!.bowlerId;
}

function checkMatchCompletion(state: MatchEngineState): MatchEngineState {
  const innings = state.innings[state.innings.length - 1];
  if (!innings) return state;

  const totalWickets = innings.events.filter((e) => e.kind === 'wicket').length;
  const legalBalls = innings.events.filter(isLegalBall).length;
  const maxBalls = state.rules.maxOversPerInnings * state.rules.ballsPerOver;

  if (totalWickets >= state.rules.wicketsPerInnings || legalBalls >= maxBalls) {
    return {
      ...state,
      status: 'completed',
    };
  }

  return state;
}
