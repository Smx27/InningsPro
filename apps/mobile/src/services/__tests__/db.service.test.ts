import { describe, it, expect, vi, beforeEach } from 'vitest';
import { databaseService } from '../db.service';
import { getDatabase } from '@core/database';

vi.mock('@core/database', () => ({
  getDatabase: vi.fn(),
  ballEvents: { id: 'ballEvents', inningsNumber: 'inningsNumber', overNumber: 'overNumber', ballNumber: 'ballNumber', createdAt: 'createdAt', matchId: 'matchId', runs: 'runs', wicketType: 'wicketType' },
  matches: { id: 'matches', createdAt: 'createdAt', teamAId: 'teamAId', teamBId: 'teamBId', status: 'status' },
  tournaments: { id: 'tournaments', createdAt: 'createdAt' },
  teams: { id: 'teams', tournamentId: 'tournamentId', createdAt: 'createdAt' },
  players: { id: 'players', teamId: 'teamId', createdAt: 'createdAt' },
  innings: { id: 'innings', matchId: 'matchId', inningsNumber: 'inningsNumber' },
}));

vi.mock('../logger', () => ({
  logError: vi.fn(),
}));

describe('DatabaseService', () => {
  let mockDb: any;

  beforeEach(() => {
    vi.resetAllMocks();
    mockDb = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn(),
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      orderBy: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      transaction: vi.fn(),
    };
    (getDatabase as any).mockReturnValue(mockDb);
    databaseService.invalidateCaches();
  });

  it('should add ball event to SQLite', async () => {
    const mockEvent = {
      id: 'e1',
      kind: 'delivery',
      inningsId: 'i1',
      overNumber: 0,
      ballInOver: 1,
      timestamp: '2025-01-01T00:00:00Z',
      batterId: 'p1',
      bowlerId: 'p2',
      nonStrikerId: 'p3',
      runsOffBat: 1,
      isBoundary: false,
    };

    mockDb.returning.mockResolvedValue([
      {
        id: 'e1',
        inningsId: 'i1',
        matchId: 'm1',
        inningsNumber: 1,
        overNumber: 0,
        ballNumber: 1,
        timestamp: '2025-01-01T00:00:00Z',
        strikerId: 'p1',
        bowlerId: 'p2',
        nonStrikerId: 'p3',
        kind: 'delivery',
        runsOffBat: 1,
        isBoundary: 0,
      },
    ]);

    const result = await databaseService.addBallEvent(mockEvent as any, 'm1', 1);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(result.id).toBe('e1');
    expect(result.kind).toBe('delivery');
  });

  it('should retrieve ball events by match ID', async () => {
    mockDb.orderBy.mockResolvedValue([
      {
        id: 'e1',
        inningsId: 'i1',
        matchId: 'm1',
        inningsNumber: 1,
        overNumber: 0,
        ballNumber: 1,
        timestamp: '2025-01-01T00:00:00Z',
        strikerId: 'p1',
        bowlerId: 'p2',
        nonStrikerId: 'p3',
        kind: 'delivery',
        runsOffBat: 1,
        isBoundary: 0,
      },
    ]);

    const result = await databaseService.getBallEventsByMatch('m1');

    expect(mockDb.select).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('e1');
  });

  it('should undo last ball', async () => {
    mockDb.transaction.mockImplementation(async (cb: any) => {
      const tx = {
        select: vi.fn().mockReturnThis(),
        from: vi.fn().mockReturnThis(),
        where: vi.fn().mockReturnThis(),
        orderBy: vi.fn().mockReturnThis(),
        limit: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        returning: vi.fn(),
      };
      tx.limit.mockResolvedValue([{ id: 'e1' }]);
      tx.returning.mockResolvedValue([
        {
          id: 'e1',
          inningsId: 'i1',
          matchId: 'm1',
          inningsNumber: 1,
          overNumber: 0,
          ballNumber: 1,
          timestamp: '2025-01-01T00:00:00Z',
          strikerId: 'p1',
          bowlerId: 'p2',
          nonStrikerId: 'p3',
          kind: 'delivery',
          runsOffBat: 1,
          isBoundary: 0,
        },
      ]);
      return cb(tx);
    });

    const result = await databaseService.undoLastBall('m1', 1);

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(result?.id).toBe('e1');
  });
});
