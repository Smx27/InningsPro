import { create } from 'zustand';

import { MatchState, matchEngineService } from '@services/match-engine.service';

type ExtraType = 'wide' | 'noball' | 'bye' | 'legbye';
export type WicketType = 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';

type ScoringStore = {
  matchState: MatchState;
  isLoading: boolean;
  currentBowlerId: string | null;
  lastOverBowlerId: string | null;
  isBowlerModalOpen: boolean;
  isWicketSheetOpen: boolean;
  isBatsmanModalOpen: boolean;
  pendingWicketType: WicketType | null;
  loadMatch: (matchId: string) => Promise<void>;
  recordRun: (runs: number) => Promise<void>;
  recordExtra: (type: ExtraType) => Promise<void>;
  openBowlerModal: () => void;
  closeBowlerModal: () => void;
  setBowler: (bowlerId: string) => void;
  openWicketFlow: () => void;
  closeWicketFlow: () => void;
  selectWicketType: (type: WicketType) => void;
  confirmNewBatsman: (playerId: string) => Promise<void>;
  undoLastBall: () => Promise<void>;
};

const didOverEnd = (previousState: MatchState, nextState: MatchState): boolean => {
  return nextState.legalBalls > previousState.legalBalls && Number.isInteger(nextState.overs);
};

export const useScoringStore = create<ScoringStore>((set, get) => ({
  matchState: matchEngineService.initialState(),
  isLoading: false,
  currentBowlerId: null,
  lastOverBowlerId: null,
  isBowlerModalOpen: false,
  isWicketSheetOpen: false,
  isBatsmanModalOpen: false,
  pendingWicketType: null,

  loadMatch: async (matchId) => {
    set({ isLoading: true });

    try {
      const state = await matchEngineService.startMatch(matchId);
      set({
        matchState: { ...state, matchId },
        currentBowlerId: null,
        lastOverBowlerId: null,
        isBowlerModalOpen: true,
        isWicketSheetOpen: false,
        isBatsmanModalOpen: false,
        pendingWicketType: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  recordRun: async (runs) => {
    const { matchState, currentBowlerId } = get();

    if (!currentBowlerId) {
      set({ isBowlerModalOpen: true });
      return;
    }

    if (!matchState.currentStriker || !matchState.currentNonStriker) {
      throw new Error('Missing striker/non-striker in match state');
    }

    const nextState = await matchEngineService.recordBall({
      matchId: matchState.matchId,
      runs,
      strikerId: matchState.currentStriker,
      nonStrikerId: matchState.currentNonStriker,
      bowlerId: currentBowlerId,
    });

    if (didOverEnd(matchState, nextState)) {
      set({
        matchState: nextState,
        lastOverBowlerId: currentBowlerId,
        currentBowlerId: null,
        isBowlerModalOpen: true,
      });
      return;
    }

    set({ matchState: nextState });
  },

  recordExtra: async (type) => {
    const { matchState, currentBowlerId } = get();

    if (!currentBowlerId) {
      set({ isBowlerModalOpen: true });
      return;
    }

    if (!matchState.currentStriker || !matchState.currentNonStriker) {
      throw new Error('Missing striker/non-striker in match state');
    }

    const nextState = await matchEngineService.recordBall({
      matchId: matchState.matchId,
      runs: 1,
      extrasType: type,
      strikerId: matchState.currentStriker,
      nonStrikerId: matchState.currentNonStriker,
      bowlerId: currentBowlerId,
    });

    if (didOverEnd(matchState, nextState)) {
      set({
        matchState: nextState,
        lastOverBowlerId: currentBowlerId,
        currentBowlerId: null,
        isBowlerModalOpen: true,
      });
      return;
    }

    set({ matchState: nextState });
  },

  openBowlerModal: () => {
    set({ isBowlerModalOpen: true });
  },

  closeBowlerModal: () => {
    set({ isBowlerModalOpen: false });
  },

  setBowler: (bowlerId) => {
    set({ currentBowlerId: bowlerId, isBowlerModalOpen: false });
  },

  openWicketFlow: () => {
    const { currentBowlerId } = get();
    if (!currentBowlerId) {
      set({ isBowlerModalOpen: true });
      return;
    }

    set({ isWicketSheetOpen: true, isBatsmanModalOpen: false, pendingWicketType: null });
  },

  closeWicketFlow: () => {
    set({
      isWicketSheetOpen: false,
      isBatsmanModalOpen: false,
      pendingWicketType: null,
    });
  },

  selectWicketType: (type) => {
    set({
      pendingWicketType: type,
      isWicketSheetOpen: false,
      isBatsmanModalOpen: true,
    });
  },

  confirmNewBatsman: async (playerId) => {
    const { matchState, pendingWicketType, currentBowlerId } = get();

    if (!currentBowlerId) {
      set({ isBowlerModalOpen: true });
      return;
    }

    if (!pendingWicketType) {
      throw new Error('Wicket type must be selected before confirming new batsman');
    }

    if (!matchState.currentNonStriker) {
      throw new Error('Missing non-striker in match state');
    }

    const nextState = await matchEngineService.recordBall({
      matchId: matchState.matchId,
      runs: 0,
      wicketType: pendingWicketType,
      strikerId: playerId,
      nonStrikerId: matchState.currentNonStriker,
      bowlerId: currentBowlerId,
    });

    if (didOverEnd(matchState, nextState)) {
      set({
        matchState: nextState,
        isBatsmanModalOpen: false,
        isWicketSheetOpen: false,
        pendingWicketType: null,
        lastOverBowlerId: currentBowlerId,
        currentBowlerId: null,
        isBowlerModalOpen: true,
      });
      return;
    }

    set({
      matchState: nextState,
      isBatsmanModalOpen: false,
      isWicketSheetOpen: false,
      pendingWicketType: null,
    });
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
