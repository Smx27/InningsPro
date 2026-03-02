import { create } from 'zustand';

import { MatchState, matchEngineService } from '@services/match-engine.service';

type ExtraType = 'wide' | 'noball' | 'bye' | 'legbye';
type WicketType = 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';

type ScoringStore = {
  matchState: MatchState;
  isLoading: boolean;
  loadMatch: (matchId: string) => Promise<void>;
  recordRun: (runs: number) => Promise<void>;
  recordExtra: (type: ExtraType) => Promise<void>;
  recordWicket: (type: WicketType) => Promise<void>;
  undoLastBall: () => Promise<void>;
};

const getActorIds = (state: MatchState) => {
  if (!state.currentStriker || !state.currentNonStriker) {
    throw new Error('Missing striker/non-striker in match state');
  }

  return {
    strikerId: state.currentStriker,
    nonStrikerId: state.currentNonStriker,
    bowlerId: state.currentNonStriker,
  };
};

export const useScoringStore = create<ScoringStore>((set, get) => ({
  matchState: matchEngineService.initialState(),
  isLoading: false,

  loadMatch: async (matchId) => {
    set({ isLoading: true });
    try {
      const state = await matchEngineService.startMatch(matchId);
      set({ matchState: { ...state, matchId } });
    } finally {
      set({ isLoading: false });
    }
  },

  recordRun: async (runs) => {
    const { matchState } = get();
    const actorIds = getActorIds(matchState);

    const nextState = await matchEngineService.recordBall({
      matchId: matchState.matchId,
      runs,
      ...actorIds,
    });

    set({ matchState: nextState });
  },

  recordExtra: async (type) => {
    const { matchState } = get();
    const actorIds = getActorIds(matchState);

    const nextState = await matchEngineService.recordBall({
      matchId: matchState.matchId,
      runs: 1,
      extrasType: type,
      ...actorIds,
    });

    set({ matchState: nextState });
  },

  recordWicket: async (type) => {
    const { matchState } = get();
    const actorIds = getActorIds(matchState);

    const nextState = await matchEngineService.recordBall({
      matchId: matchState.matchId,
      runs: 0,
      wicketType: type,
      ...actorIds,
    });

    set({ matchState: nextState });
  },

  undoLastBall: async () => {
    const matchId = get().matchState.matchId;
    if (!matchId) {
      return;
    }

    const nextState = await matchEngineService.undoLastBall(matchId);
    set({ matchState: nextState });
  },
}));
