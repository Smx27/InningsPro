import { create } from 'zustand';

import type { Player } from '@core/database/schema';
import { databaseService } from '@services/db.service';

type MatchContextStore = {
  matchId: string | null;
  teamAId: string | null;
  teamBId: string | null;
  teamAPlayers: Player[];
  teamBPlayers: Player[];
  battingTeamId: string | null;
  bowlingTeamId: string | null;
  loadMatchContext: (matchId: string) => Promise<void>;
};

export const useMatchContextStore = create<MatchContextStore>((set, get) => ({
  matchId: null,
  teamAId: null,
  teamBId: null,
  teamAPlayers: [],
  teamBPlayers: [],
  battingTeamId: null,
  bowlingTeamId: null,

  loadMatchContext: async (matchId) => {
    const currentState = get();
    if (currentState.matchId === matchId && currentState.teamAPlayers.length > 0 && currentState.teamBPlayers.length > 0) {
      return;
    }

    const match = await databaseService.getMatchById(matchId);
    if (!match) {
      throw new Error(`Match not found for id: ${matchId}`);
    }

    const currentInnings = await databaseService.getCurrentInnings(matchId);
    const tournamentTeams = await databaseService.getTeamsByTournament(match.tournamentId);

    const teamA = tournamentTeams.find((team) => team.id === match.teamAId);
    const teamB = tournamentTeams.find((team) => team.id === match.teamBId);

    if (!teamA || !teamB) {
      throw new Error(`Unable to resolve teams for match: ${matchId}`);
    }

    const [teamAPlayers, teamBPlayers] = await Promise.all([
      databaseService.getPlayersByTeam(match.teamAId),
      databaseService.getPlayersByTeam(match.teamBId),
    ]);

    set({
      matchId,
      teamAId: match.teamAId,
      teamBId: match.teamBId,
      teamAPlayers,
      teamBPlayers,
      battingTeamId: currentInnings?.battingTeamId ?? null,
      bowlingTeamId: currentInnings?.bowlingTeamId ?? null,
    });
  },
}));
