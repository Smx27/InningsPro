import { create } from 'zustand';

import { databaseService } from '@services/db.service';
import { MatchState, matchEngineService } from '@services/match-engine.service';
import type { Player } from '@core/database/schema';

type ExtraType = 'wide' | 'noball' | 'bye' | 'legbye';
export type WicketType = 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';

type ScoringStore = {
  matchState: MatchState;
  isLoading: boolean;
  isWicketSheetOpen: boolean;
  isBatsmanModalOpen: boolean;
  pendingWicketType: WicketType | null;
  availableBatsmen: Player[];
  loadMatch: (matchId: string) => Promise<void>;
  recordRun: (runs: number) => Promise<void>;
  recordExtra: (type: ExtraType) => Promise<void>;
  recordWicket: (type: WicketType) => Promise<void>;
  openWicketFlow: () => void;
  closeWicketFlow: () => void;
  selectWicketType: (type: WicketType) => Promise<void>;
  confirmNewBatsman: (playerId: string) => Promise<void>;
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
  isWicketSheetOpen: false,
  isBatsmanModalOpen: false,
  pendingWicketType: null,
  availableBatsmen: [],

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

  openWicketFlow: () => {
    set({ isWicketSheetOpen: true, isBatsmanModalOpen: false, pendingWicketType: null });
  },

  closeWicketFlow: () => {
    set({
      isWicketSheetOpen: false,
      isBatsmanModalOpen: false,
      pendingWicketType: null,
      availableBatsmen: [],
    });
  },

  selectWicketType: async (type) => {
    const { matchState } = get();
    if (!matchState.matchId) {
      return;
    }

    const currentInnings = await databaseService.getCurrentInnings(matchState.matchId);
    if (!currentInnings) {
      throw new Error('No active innings found for match');
    }

    const players = await databaseService.getPlayersByTeam(currentInnings.battingTeamId);
    const availableBatsmen = players.filter(
      (player) => player.id !== matchState.currentStriker && player.id !== matchState.currentNonStriker,
    );

    set({
      pendingWicketType: type,
      isWicketSheetOpen: false,
      isBatsmanModalOpen: true,
      availableBatsmen,
    });
  },

  confirmNewBatsman: async (playerId) => {
    const { matchState, pendingWicketType } = get();

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
      bowlerId: matchState.currentNonStriker,
    });

    set({
      matchState: nextState,
      isBatsmanModalOpen: false,
      isWicketSheetOpen: false,
      pendingWicketType: null,
      availableBatsmen: [],
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
