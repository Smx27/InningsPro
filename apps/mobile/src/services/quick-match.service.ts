import { generateId } from '@utils/id';

import { databaseService } from './db.service';

export type QuickMatchInput = {
  teamAName: string;
  teamBName: string;
  oversPerInnings: number;
  playersPerTeam: number;
};

const normalizeLabel = (value: string, fallback: string): string => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
};

export class QuickMatchService {
  async createQuickMatch(input: QuickMatchInput): Promise<string> {
    const teamAName = normalizeLabel(input.teamAName, 'Team A');
    const teamBName = normalizeLabel(input.teamBName, 'Team B');
    const oversPerInnings = Math.max(1, Math.trunc(input.oversPerInnings));
    const playersPerTeam = Math.max(2, Math.trunc(input.playersPerTeam));

    const rules = {
      oversPerInnings,
      ballsPerOver: 6,
      totalInnings: 1,
      maxWickets: playersPerTeam - 1,
      allowExtras: true,
      wicketStrikeMode: 'auto' as const,
    };

    const tournament = await databaseService.createTournament({
      id: generateId('quick-tournament'),
      name: `Quick Match ${new Date().toLocaleString()}`,
      rulesJson: JSON.stringify(rules),
    });

    const [teamA, teamB] = await Promise.all([
      databaseService.createTeam({
        id: generateId('quick-team-a'),
        tournamentId: tournament.id,
        name: teamAName,
      }),
      databaseService.createTeam({
        id: generateId('quick-team-b'),
        tournamentId: tournament.id,
        name: teamBName,
      }),
    ]);

    await Promise.all([
      ...Array.from({ length: playersPerTeam }, (_, index) =>
        databaseService.createPlayer({
          id: `${teamA.id}-p-${index + 1}`,
          teamId: teamA.id,
          name: `Player ${index + 1}`,
          role: 'allrounder',
        }),
      ),
      ...Array.from({ length: playersPerTeam }, (_, index) =>
        databaseService.createPlayer({
          id: `${teamB.id}-p-${index + 1}`,
          teamId: teamB.id,
          name: `Player ${index + 1}`,
          role: 'allrounder',
        }),
      ),
    ]);

    const match = await databaseService.createMatch({
      id: generateId('quick-match'),
      tournamentId: tournament.id,
      teamAId: teamA.id,
      teamBId: teamB.id,
      status: 'upcoming',
      rulesJson: JSON.stringify(rules),
      currentInnings: 1,
    });

    return match.id;
  }
}

export const quickMatchService = new QuickMatchService();
