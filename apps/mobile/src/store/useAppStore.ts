import { create } from 'zustand';

import { MatchState, matchEngineService } from '@services/match-engine.service';

type AppStore = {
  currentMatch: MatchState;
  incrementBall: (runsScored: number, wicket?: boolean) => void;
  resetMatch: () => void;
};

export const useAppStore = create<AppStore>((set) => ({
  currentMatch: matchEngineService.initialState(),
  incrementBall: (runsScored, wicket = false) =>
    set((state) => ({
      currentMatch: matchEngineService.addBall(state.currentMatch, runsScored, wicket),
    })),
  resetMatch: () => set({ currentMatch: matchEngineService.initialState() }),
}));
