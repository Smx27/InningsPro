import { create } from 'zustand';

import { databaseService } from '@services/db.service';

import type { Player } from '@core/database/schema';

type MatchContextState = {
  matchId: string | null;
  teamAId: string | null;
  teamBId: string | null;
  teamAPlayers: Player[];
  teamBPlayers: Player[];
  battingTeamId: string | null;
  bowlingTeamId: string | null;
  isLoading: boolean;
};

type MatchContextActions = {
  loadMatchContext: (matchId: string) => Promise<void>;
};

export const useMatchContextStore = create<MatchContextState & MatchContextActions>((set, get) => ({
  matchId: null,
  teamAId: null,
  teamBId: null,
  teamAPlayers: [],
  teamBPlayers: [],
  battingTeamId: null,
  bowlingTeamId: null,
  isLoading: false,

  loadMatchContext: async (matchId: string) => {
    const state = get();
    if (state.matchId === matchId && state.teamAPlayers.length > 0 && state.teamBPlayers.length > 0) {
      return;
    }

    set({ isLoading: true });

    try {
      const match = await databaseService.getMatchById(matchId);
      if (!match) {
        throw new Error('Match not found');
      }

      const currentInnings = await databaseService.getCurrentInnings(matchId);
      if (!currentInnings) {
        throw new Error('Current innings not found');
      }

      const teamAPlayers = await databaseService.getPlayersByTeam(match.teamAId);
      const teamBPlayers = await databaseService.getPlayersByTeam(match.teamBId);

      set({
        matchId,
        teamAId: match.teamAId,
        teamBId: match.teamBId,
        teamAPlayers,
        teamBPlayers,
        battingTeamId: currentInnings.battingTeamId,
        bowlingTeamId: currentInnings.bowlingTeamId,
      });
    } finally {
      set({ isLoading: false });
    }
  },
}));
