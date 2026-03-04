import { databaseService } from './db.service';

import type { BallEvent, Innings, Match } from '@core/database/schema';

type ExtrasType = 'wide' | 'noball' | 'bye' | 'legbye';
type WicketType = 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
type WicketStrikeMode = 'auto' | 'manual' | 'always_new_striker';

type MatchRules = {
  oversPerInnings: number;
  ballsPerOver: number;
  totalInnings: number;
  maxWickets: number;
  allowExtras: boolean;
  wicketStrikeMode: WicketStrikeMode;
};

type RecordBallParams = {
  matchId: string;
  runs: number;
  extrasType?: ExtrasType;
  wicketType?: WicketType;
  strikerId: string;
  nonStrikerId: string;
  bowlerId: string;
  manualStrikeOverride?: boolean;
};

export type MatchState = {
  matchId: string;
  inningsNumber: number;
  totalRuns: number;
  totalWickets: number;
  overs: number;
  legalBalls: number;
  runRate: number;
  currentStriker: string | null;
  currentNonStriker: string | null;
  last6Balls: BallEvent[];
  runs: number;
  wickets: number;
  balls: number;
};

const DEFAULT_RULES: MatchRules = {
  oversPerInnings: 20,
  ballsPerOver: 6,
  totalInnings: 1,
  maxWickets: 10,
  allowExtras: true,
  wicketStrikeMode: 'auto',
};

export class MatchEngineService {

  initialState(): MatchState {
    return {
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
  }

  addBall(state: MatchState, runsScored: number, wicket = false): MatchState {
    const balls = state.balls + 1;
    const runs = state.runs + runsScored;
    const wickets = wicket ? state.wickets + 1 : state.wickets;

    return {
      ...state,
      runs,
      wickets,
      balls,
      totalRuns: runs,
      totalWickets: wickets,
      legalBalls: balls,
      overs: this.formatOvers(balls, DEFAULT_RULES.ballsPerOver),
      runRate: this.calculateRunRate(runs, balls, DEFAULT_RULES.ballsPerOver),
    };
  }
  /** Starts a match, initializes first innings if needed and marks the match live. */
  async startMatch(matchId: string): Promise<MatchState> {
    const match = await this.getMatchOrThrow(matchId);

    const inningsList = await databaseService.getInningsByMatch(matchId);
    if (inningsList.length === 0) {
      await this.createInnings(match, 1);
    }

    if (match.status !== 'live') {
      await databaseService.updateMatchStatus(matchId, 'live');
    }

    return this.getCurrentMatchState(matchId);
  }

  /** Records a ball event deterministically and returns the updated snapshot. */
  async recordBall(params: RecordBallParams): Promise<MatchState> {
    const match = await this.getMatchOrThrow(params.matchId);
    const rules = this.parseRules(match.rulesJson);
    const innings = await this.getCurrentInningsOrThrow(params.matchId);

    if (!rules.allowExtras && params.extrasType) {
      throw new Error('Extras are disabled for this match');
    }

    const inningsEvents = await databaseService.getBallEventsByMatch(params.matchId, innings.inningsNumber);

    const isLegalBall = this.isLegalBall(params.extrasType);
    const normalizedRuns = this.normalizeRuns(params.runs, params.extrasType);

    let legalBallCount = 0;
    let lastOverNumber = -1;
    let ballsInLastOver = 0;

    for (const event of inningsEvents) {
      if (event.isLegalBall) {
        legalBallCount++;
      }
      if (event.overNumber !== lastOverNumber) {
        lastOverNumber = event.overNumber;
        ballsInLastOver = 1;
      } else {
        ballsInLastOver++;
      }
    }

    const overNumber = Math.floor(legalBallCount / rules.ballsPerOver);
    const ballNumber = (overNumber === lastOverNumber ? ballsInLastOver : 0) + 1;
    const nextLegalBallCount = legalBallCount + (isLegalBall ? 1 : 0);

    const [nextStriker, nextNonStriker] = this.computeNextBatters(
      { ...params, runs: normalizedRuns },
      rules,
      isLegalBall,
      this.isOverEnded(nextLegalBallCount, rules.ballsPerOver),
    );

    await databaseService.addBallEvent({
      id: this.getBallEventId(params.matchId, innings.inningsNumber, inningsEvents.length + 1),
      matchId: params.matchId,
      inningsNumber: innings.inningsNumber,
      overNumber,
      ballNumber,
      runs: normalizedRuns,
      isLegalBall,
      extrasType: params.extrasType,
      wicketType: params.wicketType,
      strikerId: nextStriker,
      nonStrikerId: nextNonStriker,
      bowlerId: params.bowlerId,
      commentary: null,
    });

    const updatedState = await this.getCurrentMatchState(params.matchId);
    if (this.hasInningsEnded(updatedState.legalBalls, updatedState.totalWickets, rules)) {
      await this.handleInningsCompletion(match, innings.inningsNumber, rules);
      return this.getCurrentMatchState(params.matchId);
    }

    return updatedState;
  }

  /** Undoes the latest ball in current innings and returns recalculated state. */
  async undoLastBall(matchId: string): Promise<MatchState> {
    const innings = await this.getCurrentInningsOrThrow(matchId);
    await databaseService.undoLastBall(matchId, innings.inningsNumber);

    return this.getCurrentMatchState(matchId);
  }

  /** Returns current innings state from cached repository helpers and event replay. */
  async getCurrentMatchState(matchId: string): Promise<MatchState> {
    const match = await this.getMatchOrThrow(matchId);
    const rules = this.parseRules(match.rulesJson);
    const innings = await this.getCurrentInningsOrThrow(matchId);

    const totalRuns = await databaseService.getTotalRuns(matchId, innings.inningsNumber);
    const totalWickets = await databaseService.getTotalWickets(matchId, innings.inningsNumber);
    const legalBalls = await databaseService.getLegalBallCount(matchId, innings.inningsNumber);
    const inningsEvents = await databaseService.getBallEventsByMatch(matchId, innings.inningsNumber);
    const lastBall = inningsEvents.length > 0 ? inningsEvents[inningsEvents.length - 1] : undefined;

    return {
      matchId,
      inningsNumber: innings.inningsNumber,
      totalRuns,
      totalWickets,
      overs: this.formatOvers(legalBalls, rules.ballsPerOver),
      legalBalls,
      runRate: this.calculateRunRate(totalRuns, legalBalls, rules.ballsPerOver),
      currentStriker: lastBall?.strikerId ?? null,
      currentNonStriker: lastBall?.nonStrikerId ?? null,
      last6Balls: inningsEvents.slice(-6),
      runs: totalRuns,
      wickets: totalWickets,
      balls: legalBalls,
    };
  }

  private computeNextBatters(
    params: RecordBallParams,
    rules: MatchRules,
    isLegalBall: boolean,
    overEnded: boolean,
  ): [string, string] {
    if (params.manualStrikeOverride) {
      return [params.strikerId, params.nonStrikerId];
    }

    let striker = params.strikerId;
    let nonStriker = params.nonStrikerId;

    if (params.wicketType) {
      if (rules.wicketStrikeMode === 'always_new_striker') {
        [striker, nonStriker] = [params.nonStrikerId, params.strikerId];
      }
      if (rules.wicketStrikeMode === 'manual') {
        return [params.strikerId, params.nonStrikerId];
      }
    }

    if (params.runs % 2 === 1) {
      [striker, nonStriker] = [nonStriker, striker];
    }

    if (isLegalBall && overEnded) {
      [striker, nonStriker] = [nonStriker, striker];
    }

    return [striker, nonStriker];
  }

  private parseRules(rulesJson: string): MatchRules {
    let parsed: Partial<MatchRules> = DEFAULT_RULES;

    try {
      parsed = JSON.parse(rulesJson) as Partial<MatchRules>;
    } catch {
      parsed = DEFAULT_RULES;
    }

    return {
      oversPerInnings: parsed.oversPerInnings ?? DEFAULT_RULES.oversPerInnings,
      ballsPerOver: parsed.ballsPerOver ?? DEFAULT_RULES.ballsPerOver,
      totalInnings: parsed.totalInnings ?? DEFAULT_RULES.totalInnings,
      maxWickets: parsed.maxWickets ?? DEFAULT_RULES.maxWickets,
      allowExtras: parsed.allowExtras ?? DEFAULT_RULES.allowExtras,
      wicketStrikeMode: parsed.wicketStrikeMode ?? DEFAULT_RULES.wicketStrikeMode,
    };
  }


  private normalizeRuns(runs: number, extrasType?: ExtrasType): number {
    const normalizedRuns = Math.max(0, Math.trunc(runs));

    if (extrasType === 'wide' || extrasType === 'noball') {
      return Math.max(1, normalizedRuns);
    }

    return normalizedRuns;
  }

  private isLegalBall(extrasType?: ExtrasType): boolean {
    return extrasType !== 'wide' && extrasType !== 'noball';
  }

  private isOverEnded(legalBalls: number, ballsPerOver: number): boolean {
    return legalBalls > 0 && legalBalls % ballsPerOver === 0;
  }

  private formatOvers(legalBalls: number, ballsPerOver: number): number {
    return Number(`${Math.floor(legalBalls / ballsPerOver)}.${legalBalls % ballsPerOver}`);
  }

  private calculateRunRate(totalRuns: number, legalBalls: number, ballsPerOver: number): number {
    if (legalBalls === 0) {
      return 0;
    }

    return Number((totalRuns / (legalBalls / ballsPerOver)).toFixed(2));
  }

  private async getMatchOrThrow(matchId: string): Promise<Match> {
    const match = await databaseService.getMatchById(matchId);
    if (!match) {
      throw new Error(`Match not found for id: ${matchId}`);
    }

    return match;
  }

  private async getCurrentInningsOrThrow(matchId: string): Promise<Innings> {
    const current = await databaseService.getCurrentInnings(matchId);
    if (!current) {
      throw new Error(`No innings found for match id: ${matchId}`);
    }

    return current;
  }

  private async createInnings(match: Match, inningsNumber: number): Promise<void> {
    const isFirstInnings = inningsNumber === 1;
    await databaseService.createInnings({
      id: this.getInningsId(match.id, inningsNumber),
      matchId: match.id,
      inningsNumber,
      battingTeamId: isFirstInnings ? match.teamAId : match.teamBId,
      bowlingTeamId: isFirstInnings ? match.teamBId : match.teamAId,
      totalRuns: 0,
      totalWickets: 0,
      totalOvers: 0,
    });
  }

  private hasInningsEnded(legalBalls: number, wickets: number, rules: MatchRules): boolean {
    return legalBalls >= rules.oversPerInnings * rules.ballsPerOver || wickets >= rules.maxWickets;
  }

  private async handleInningsCompletion(match: Match, inningsNumber: number, rules: MatchRules): Promise<void> {
    if (inningsNumber < rules.totalInnings) {
      await this.createInnings(match, inningsNumber + 1);
      return;
    }

    await databaseService.updateMatchStatus(match.id, 'completed');
  }

  private getInningsId(matchId: string, inningsNumber: number): string {
    return `inn-${matchId}-${inningsNumber}`;
  }

  private getBallEventId(matchId: string, inningsNumber: number, sequence: number): string {
    return `ball-${matchId}-${inningsNumber}-${sequence}`;
  }
}

export const matchEngineService = new MatchEngineService();
