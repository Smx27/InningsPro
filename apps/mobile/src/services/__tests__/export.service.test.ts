import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportService } from '../export.service';
import { databaseService } from '../db.service';
import { v1 } from '@inningspro/export-schema';

vi.mock('../db.service', () => ({
  databaseService: {
    getMatchById: vi.fn(),
    getTournamentById: vi.fn(),
    getTeamById: vi.fn(),
    getTeamsByTournament: vi.fn(),
    getPlayersByTeam: vi.fn(),
    getInningsByMatch: vi.fn(),
    getBallEventsByMatch: vi.fn(),
  },
}));

vi.mock('@inningspro/export-schema', () => ({
  v1: {
    parseMatchExport: vi.fn((data) => data),
  },
}));

describe('ExportService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should generate a validated JSON export for a match', async () => {
    const matchId = 'm1';
    const mockMatch = {
      id: matchId,
      tournamentId: 't1',
      teamAId: 'team1',
      teamBId: 'team2',
      rulesJson: JSON.stringify({
        oversPerInnings: 20,
        ballsPerOver: 6,
        maxWickets: 10,
      }),
      createdAt: new Date('2025-01-01T00:00:00Z'),
      status: 'completed',
    };
    const mockTournament = {
      id: 't1',
      name: 'Test Tournament',
      createdAt: new Date('2025-01-01T00:00:00Z'),
      rulesJson: JSON.stringify({
        oversPerInnings: 20,
        ballsPerOver: 6,
        maxWickets: 10,
      }),
    };
    const mockTeam1 = { id: 'team1', tournamentId: 't1', name: 'Team One' };
    const mockTeam2 = { id: 'team2', tournamentId: 't1', name: 'Team Two' };
    const mockTeams = [mockTeam1, mockTeam2];
    const mockInnings = [
      {
        id: 'inn1',
        matchId: matchId,
        inningsNumber: 1,
        battingTeamId: 'team1',
        bowlingTeamId: 'team2',
        createdAt: new Date('2025-01-01T00:05:00Z'),
      },
    ];
    const mockEvents = [
      {
        id: 'e1',
        matchId: matchId,
        inningsNumber: 1,
        overNumber: 0,
        ballNumber: 1,
        runs: 4,
        isLegalBall: true,
        strikerId: 'p1',
        nonStrikerId: 'p3',
        bowlerId: 'p2',
        createdAt: new Date('2025-01-01T00:05:10Z'),
      },
    ];

    (databaseService.getMatchById as any).mockResolvedValue(mockMatch);
    (databaseService.getTournamentById as any).mockResolvedValue(mockTournament);
    (databaseService.getTeamsByTournament as any).mockResolvedValue(mockTeams);
    (databaseService.getPlayersByTeam as any).mockResolvedValue([
      { id: 'p1', teamId: 'team1', name: 'Player 1', role: 'batter' },
    ]);
    (databaseService.getInningsByMatch as any).mockResolvedValue(mockInnings);
    (databaseService.getBallEventsByMatch as any).mockResolvedValue(mockEvents);

    const result = await exportService.generateExport(matchId);
    const parsed = JSON.parse(result);

    expect(parsed.schemaVersion).toBe('1.0.0');
    expect(parsed.match.id).toBe(matchId);
    expect(parsed.match.innings[0].events).toHaveLength(1);
    expect(parsed.match.innings[0].events[0].kind).toBe('delivery');
    expect(parsed.match.innings[0].events[0].runsOffBat).toBe(4);
    expect(v1.parseMatchExport).toHaveBeenCalled();
  });

  it('should throw error if match is not found', async () => {
    (databaseService.getMatchById as any).mockResolvedValue(null);
    await expect(exportService.generateExport('missing')).rejects.toThrow('Match missing not found');
  });
});
