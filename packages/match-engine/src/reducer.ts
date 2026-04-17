import type { MatchEngineState, MatchEngineAction } from './types.ts';
import type { BallEvent, DeliveryBallEvent, ExtraBallEvent, Innings, WicketBallEvent } from '@inningspro/shared-types';

/**
 * Match Engine Reducer
 * Handles all core scoring logic and state transitions.
 */
export function matchReducer(state: MatchEngineState, action: MatchEngineAction): MatchEngineState {
  if (state.status === 'completed') return state;

  switch (action.type) {
    case 'START_MATCH':
      return {
        ...state,
        id: action.payload.matchId,
        rules: action.payload.rules,
        status: 'live',
      };

    case 'RECORD_DELIVERY': {
      const innings = state.innings[state.innings.length - 1];
      if (!innings) return state;

      const legalBalls = innings.events.filter(isLegalBall).length;
      const overNumber = Math.floor(legalBalls / state.rules.ballsPerOver);

      // Bowler Rotation Check
      if (isFirstBallOfNewOver(innings, overNumber)) {
        const lastBowlerId = getLastOverBowlerId(innings, overNumber - 1);
        if (lastBowlerId === action.payload.bowlerId) return state;
      }

      const ballsInCurrentOver = innings.events.filter((e) => e.overNumber === overNumber).length;

      const newEvent: DeliveryBallEvent = {
        id: `event_${Date.now()}_${innings.events.length}`,
        inningsId: innings.id,
        kind: 'delivery',
        overNumber,
        ballInOver: ballsInCurrentOver + 1,
        timestamp: new Date().toISOString(),
        batterId: action.payload.batterId,
        nonStrikerId: action.payload.nonStrikerId,
        bowlerId: action.payload.bowlerId,
        runsOffBat: action.payload.runsOffBat,
        isBoundary: action.payload.isBoundary,
      };

      return checkMatchCompletion(
        updateInnings(state, innings.id, (inn) => ({
          ...inn,
          events: [...inn.events, newEvent],
        })),
      );
    }

    case 'RECORD_EXTRA': {
      const innings = state.innings[state.innings.length - 1];
      if (!innings) return state;

      const { type, runs, batterId, nonStrikerId, bowlerId } = action.payload;
      const rebowled = type === 'wide' || type === 'no-ball';

      const legalBalls = innings.events.filter(isLegalBall).length;
      const overNumber = Math.floor(legalBalls / state.rules.ballsPerOver);

      // Bowler Rotation Check
      if (isFirstBallOfNewOver(innings, overNumber)) {
        const lastBowlerId = getLastOverBowlerId(innings, overNumber - 1);
        if (lastBowlerId === bowlerId) return state;
      }

      const ballsInCurrentOver = innings.events.filter((e) => e.overNumber === overNumber).length;

      const totalRuns = (rebowled ? runs + 1 : runs) as any;

      const newEvent: ExtraBallEvent = {
        id: `event_${Date.now()}_${innings.events.length}`,
        inningsId: innings.id,
        kind: 'extra',
        extraType: type,
        runs: totalRuns,
        rebowled,
        overNumber,
        ballInOver: ballsInCurrentOver + 1,
        timestamp: new Date().toISOString(),
        batterId,
        nonStrikerId,
        bowlerId,
      };

      return checkMatchCompletion(
        updateInnings(state, innings.id, (inn) => ({
          ...inn,
          events: [...inn.events, newEvent],
        })),
      );
    }

    case 'RECORD_WICKET': {
      const innings = state.innings[state.innings.length - 1];
      if (!innings) return state;

      const { type, playerOutId, batterId, nonStrikerId, bowlerId } = action.payload;

      const legalBalls = innings.events.filter(isLegalBall).length;
      const overNumber = Math.floor(legalBalls / state.rules.ballsPerOver);

      // Bowler Rotation Check
      if (isFirstBallOfNewOver(innings, overNumber)) {
        const lastBowlerId = getLastOverBowlerId(innings, overNumber - 1);
        if (lastBowlerId === bowlerId) return state;
      }

      const ballsInCurrentOver = innings.events.filter((e) => e.overNumber === overNumber).length;

      const creditedToBowler = ['bowled', 'caught', 'lbw', 'stumped', 'hit-wicket'].includes(type);

      const newEvent: WicketBallEvent = {
        id: `event_${Date.now()}_${innings.events.length}`,
        inningsId: innings.id,
        kind: 'wicket',
        wicketType: type,
        playerOutId,
        creditedToBowler,
        runsCompleted: 0,
        overNumber,
        ballInOver: ballsInCurrentOver + 1,
        timestamp: new Date().toISOString(),
        batterId,
        nonStrikerId,
        bowlerId,
      };

      return checkMatchCompletion(
        updateInnings(state, innings.id, (inn) => ({
          ...inn,
          events: [...inn.events, newEvent],
        })),
      );
    }

    default:
      return state;
  }
}

function isLegalBall(event: BallEvent): boolean {
  if (event.kind === 'delivery') return true;
  if (event.kind === 'extra') return !event.rebowled;
  if (event.kind === 'wicket') return true;
  return false;
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
  return lastOverEvents[lastOverEvents.length - 1].bowlerId;
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
