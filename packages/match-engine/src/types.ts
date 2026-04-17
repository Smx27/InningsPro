import type { Match, MatchRules, WicketBallEvent, Id, ISODateTime } from '@inningspro/shared-types';

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
        id: Id;
        timestamp: ISODateTime;
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
        id: Id;
        timestamp: ISODateTime;
        type: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
        runs: number;
        runsOffBat?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined; // Added for no-balls
        isBoundary?: boolean | undefined; // Added
        batterId: Id;
        nonStrikerId: Id;
        bowlerId: Id;
      };
    }
  | {
      type: 'RECORD_WICKET';
      payload: {
        id: Id;
        timestamp: ISODateTime;
        type: WicketBallEvent['wicketType'];
        playerOutId: Id;
        runsCompleted?: 0 | 1 | 2 | 3 | undefined; // Added
        batterId: Id;
        nonStrikerId: Id;
        bowlerId: Id;
      };
    };

export type MatchEngineState = Match & {
  lastRejectionReason?: string | undefined;
};
