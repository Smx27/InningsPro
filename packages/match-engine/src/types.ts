import type { Match, MatchRules, WicketBallEvent, Id } from '@inningspro/shared-types';

export type MatchEngineAction =
  | {
      type: 'START_MATCH';
      payload: {
        matchId: Id;
        rules: MatchRules;
      };
    }
  | {
      type: 'RECORD_DELIVERY';
      payload: {
        runsOffBat: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        isBoundary: boolean;
        batterId: Id;
        nonStrikerId: Id;
        bowlerId: Id;
      };
    }
  | {
      type: 'RECORD_EXTRA';
      payload: {
        type: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
        runs: number;
        batterId: Id;
        nonStrikerId: Id;
        bowlerId: Id;
      };
    }
  | {
      type: 'RECORD_WICKET';
      payload: {
        type: WicketBallEvent['wicketType'];
        playerOutId: Id;
        batterId: Id;
        nonStrikerId: Id;
        bowlerId: Id;
      };
    };

export type MatchEngineState = Match;
