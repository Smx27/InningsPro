import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScoringStore } from '../useScoringStore';
import { databaseService } from '@services/db.service';
import { matchEngineService } from '@services/match-engine.service';

vi.mock('@services/db.service', () => ({
  databaseService: {
    getMatchById: vi.fn(),
    getPlayersByTeam: vi.fn(),
    getBallEventsByMatch: vi.fn(),
    addBallEvent: vi.fn(),
    undoLastBall: vi.fn(),
  },
}));

vi.mock('@services/match-engine.service', () => {
  const initial = {
    matchId: '',
    inningsNumber: 1,
    totalRuns: 0,
    totalWickets: 0,
    overs: 0,
    legalBalls: 0,
    runRate: 0,
    currentStriker: null,
    currentNonStriker: null,
    last6Balls: [],
    runs: 0,
    wickets: 0,
    balls: 0,
  };
  return {
    matchEngineService: {
      initialState: vi.fn(() => initial),
      startMatch: vi.fn(),
      recordBall: vi.fn(),
      undoLastBall: vi.fn(),
    },
  };
});

vi.mock('@services/logger', () => ({
  logError: vi.fn(),
  logMatchEvent: vi.fn(),
}));

describe('useScoringStore', () => {
  const defaultInitialState = {
    matchId: '',
    inningsNumber: 1,
    totalRuns: 0,
    totalWickets: 0,
    overs: 0,
    legalBalls: 0,
    runRate: 0,
    currentStriker: null,
    currentNonStriker: null,
    last6Balls: [],
    runs: 0,
    wickets: 0,
    balls: 0,
  };

  beforeEach(() => {
    vi.resetAllMocks();
    useScoringStore.setState({
      matchState: { ...defaultInitialState },
      isLoading: false,
      isMatchCompleted: false,
      currentBowlerId: null,
      lastOverBowlerId: null,
      isBowlerModalOpen: false,
      isWicketSheetOpen: false,
      isBatsmanModalOpen: false,
      pendingWicketType: null,
    });
  });

  it('should load match state and seed players', async () => {
    const matchId = 'm1';
    const mockMatch = { id: matchId, teamAId: 'teamA', status: 'live' };
    const mockState = {
      ...defaultInitialState,
      matchId,
      currentStriker: null,
      currentNonStriker: null,
    };
    const mockPlayers = [{ id: 'p1' }, { id: 'p2' }];

    (databaseService.getMatchById as any).mockResolvedValue(mockMatch);
    (databaseService.getPlayersByTeam as any).mockResolvedValue(mockPlayers);
    (matchEngineService.startMatch as any).mockResolvedValue(mockState);

    await useScoringStore.getState().loadMatch(matchId);

    expect(databaseService.getMatchById).toHaveBeenCalledWith(matchId);
    expect(matchEngineService.startMatch).toHaveBeenCalledWith(matchId);
    expect(useScoringStore.getState().matchState.matchId).toBe(matchId);
    expect(useScoringStore.getState().matchState.currentStriker).toBe('p1');
    expect(useScoringStore.getState().matchState.currentNonStriker).toBe('p2');
    expect(useScoringStore.getState().isBowlerModalOpen).toBe(true);
  });

  it('should record run and update state', async () => {
    const matchId = 'm1';
    const loadedState = {
      ...defaultInitialState,
      matchId,
      currentStriker: 'p1',
      currentNonStriker: 'p2',
    };
    const nextState = {
      ...loadedState,
      runs: 4,
      totalRuns: 4,
      legalBalls: 1,
      balls: 1,
      overs: 0.1,
    };

    useScoringStore.setState({
      matchState: loadedState,
      currentBowlerId: 'b1',
    });

    (databaseService.getMatchById as any).mockResolvedValue({ id: matchId, status: 'live' });
    (matchEngineService.recordBall as any).mockResolvedValue(nextState);

    await useScoringStore.getState().recordRun(4);

    expect(matchEngineService.recordBall).toHaveBeenCalledWith({
      matchId,
      runs: 4,
      strikerId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    });
    expect(useScoringStore.getState().matchState.totalRuns).toBe(4);
  });

  it('should record extra and update state', async () => {
    const matchId = 'm1';
    const loadedState = {
      ...defaultInitialState,
      matchId,
      currentStriker: 'p1',
      currentNonStriker: 'p2',
    };
    const nextState = {
      ...loadedState,
      runs: 1,
      totalRuns: 1,
    };

    useScoringStore.setState({
      matchState: loadedState,
      currentBowlerId: 'b1',
    });

    (databaseService.getMatchById as any).mockResolvedValue({ id: matchId, status: 'live' });
    (matchEngineService.recordBall as any).mockResolvedValue(nextState);

    await useScoringStore.getState().recordExtra('wide');

    expect(matchEngineService.recordBall).toHaveBeenCalledWith({
      matchId,
      runs: 1,
      extrasType: 'wide',
      strikerId: 'p1',
      nonStrikerId: 'p2',
      bowlerId: 'b1',
    });
    expect(useScoringStore.getState().matchState.totalRuns).toBe(1);
  });

  it('should undo last ball', async () => {
    const matchId = 'm1';
    const nextState = { ...defaultInitialState, matchId };

    useScoringStore.setState({
      matchState: { ...defaultInitialState, matchId, totalRuns: 4 },
    });

    (databaseService.getMatchById as any).mockResolvedValue({ id: matchId, status: 'live' });
    (matchEngineService.undoLastBall as any).mockResolvedValue(nextState);

    await useScoringStore.getState().undoLastBall();

    expect(matchEngineService.undoLastBall).toHaveBeenCalledWith(matchId);
    expect(useScoringStore.getState().matchState.totalRuns).toBe(0);
  });
});
