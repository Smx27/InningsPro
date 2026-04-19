import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useScoringStore } from '../useScoringStore';
import { databaseService } from '@services/db.service';
import { matchEngineService } from '@services/match-engine.service';
import * as Haptics from 'expo-haptics';

vi.mock('@services/db.service', () => ({
  databaseService: {
    getMatchById: vi.fn(),
    getBallEventsByMatch: vi.fn(),
    addBallEvent: vi.fn(),
    undoLastBall: vi.fn(),
  },
}));

vi.mock('@services/match-engine.service', () => ({
  matchEngineService: {
    hydrateMatch: vi.fn(),
    processAction: vi.fn(),
  },
}));

vi.mock('@services/logger', () => ({
  logError: vi.fn(),
  logMatchEvent: vi.fn(),
}));

vi.mock('expo-haptics', () => ({
  notificationAsync: vi.fn(),
  impactAsync: vi.fn(),
  NotificationFeedbackType: {
    Success: 'success',
    Error: 'error',
    Warning: 'warning',
  },
  ImpactFeedbackStyle: {
    Medium: 'medium',
  },
}));

describe('useScoringStore', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useScoringStore.setState({
      matchState: null,
      isLoading: false,
      isProcessing: false,
      currentBowlerId: null,
    });
  });

  it('should load match state from database', async () => {
    const matchId = 'm1';
    const mockMatch = { id: matchId, rules: {} };
    const mockEvents = [{ id: 'e1', bowlerId: 'p1' }];
    const mockState = { id: matchId, innings: [] };

    (databaseService.getMatchById as any).mockResolvedValue(mockMatch);
    (databaseService.getBallEventsByMatch as any).mockResolvedValue(mockEvents);
    (matchEngineService.hydrateMatch as any).mockReturnValue(mockState);

    await useScoringStore.getState().loadMatch(matchId);

    expect(databaseService.getMatchById).toHaveBeenCalledWith(matchId);
    expect(databaseService.getBallEventsByMatch).toHaveBeenCalledWith(matchId);
    expect(matchEngineService.hydrateMatch).toHaveBeenCalled();
    expect(useScoringStore.getState().matchState).toBe(mockState);
    expect(useScoringStore.getState().currentBowlerId).toBe('p1');
  });

  it('should record event via match engine', async () => {
    const matchId = 'm1';
    const mockState = { id: matchId, innings: [{ sequence: 1, events: [] }] };
    const nextState = { 
      id: matchId, 
      innings: [{ 
        sequence: 1, 
        events: [{ kind: 'delivery', overNumber: 0, ballInOver: 1, id: 'e1' }] 
      }] 
    };
    const action = { type: 'RECORD_DELIVERY', payload: {} };

    useScoringStore.setState({ matchState: mockState as any });
    (matchEngineService.processAction as any).mockReturnValue(nextState);
    (databaseService.addBallEvent as any).mockResolvedValue({});

    await useScoringStore.getState().recordEvent(action as any);

    expect(matchEngineService.processAction).toHaveBeenCalledWith(mockState, action);
    expect(databaseService.addBallEvent).toHaveBeenCalled();
    expect(Haptics.impactAsync).toHaveBeenCalled();
    expect(useScoringStore.getState().matchState).toBe(nextState);
  });

  it('should undo last action', async () => {
    const matchId = 'm1';
    const mockState = { id: matchId, rules: {}, innings: [{ sequence: 1 }] };
    const nextState = { id: matchId, innings: [] };

    useScoringStore.setState({ matchState: mockState as any });
    (databaseService.undoLastBall as any).mockResolvedValue({ id: 'e1' });
    (databaseService.getBallEventsByMatch as any).mockResolvedValue([]);
    (matchEngineService.hydrateMatch as any).mockReturnValue(nextState);

    await useScoringStore.getState().undo();

    expect(databaseService.undoLastBall).toHaveBeenCalledWith(matchId, 1);
    expect(databaseService.getBallEventsByMatch).toHaveBeenCalledWith(matchId);
    expect(Haptics.notificationAsync).toHaveBeenCalled();
    expect(useScoringStore.getState().matchState).toBe(nextState);
  });
});
