import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportService } from '../export.service';
import { databaseService } from '../db.service';
import { v1 } from '@inningspro/export-schema';

vi.mock('../db.service', () => ({
  databaseService: {
    getMatchById: vi.fn(),
    getTournamentById: vi.fn(),
    getTeamById: vi.fn(),
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
      homeTeamId: 'team1',
      awayTeamId: 'team2',
      venue: 'Test Stadium',
      createdAt: new Date('2025-01-01T00:00:00Z'),
      status: 'completed',
    };
    const mockTournament = { id: 't1', name: 'Test Tournament' };
    const mockTeam1 = { id: 'team1', name: 'Team One' };
    const mockTeam2 = { id: 'team2', name: 'Team Two' };
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
        kind: 'delivery',
        overNumber: 0,
        ballInOver: 1,
        timestamp: '2025-01-01T00:05:10Z',
        batterId: 'p1',
        bowlerId: 'p2',
        nonStrikerId: 'p3',
        runsOffBat: 4,
        isBoundary: true,
      },
    ];

    (databaseService.getMatchById as any).mockResolvedValue(mockMatch);
    (databaseService.getTournamentById as any).mockResolvedValue(mockTournament);
    (databaseService.getTeamById as any).mockImplementation((id: string) => {
      if (id === 'team1') return Promise.resolve(mockTeam1);
      if (id === 'team2') return Promise.resolve(mockTeam2);
      return Promise.resolve(null);
    });
    (databaseService.getInningsByMatch as any).mockResolvedValue(mockInnings);
    (databaseService.getBallEventsByMatch as any).mockResolvedValue(mockEvents);

    const result = await exportService.generateExport(matchId);
    const parsed = JSON.parse(result);

    expect(parsed.schemaVersion).toBe('1.0.0');
    expect(parsed.matches[0].id).toBe(matchId);
    expect(parsed.matches[0].innings[0].events).toHaveLength(1);
    expect(v1.parseMatchExport).toHaveBeenCalled();
  });

  it('should throw error if match is not found', async () => {
    (databaseService.getMatchById as any).mockResolvedValue(null);
    await expect(exportService.generateExport('missing')).rejects.toThrow('Match missing not found');
  });
});
