import { and, desc, eq, isNotNull, sql, sum } from 'drizzle-orm';

import { getDatabase } from '@core/database';
import {
  ballEvents,
  BallEvent,
  innings,
  Innings,
  matches,
  Match,
  NewBallEvent,
  NewInnings,
  NewMatch,
  NewPlayer,
  NewTeam,
  NewTournament,
  players,
  Player,
  teams,
  Team,
  tournaments,
  Tournament,
} from '@core/database/schema';

import { logError } from './logger';

type DatabaseErrorContext = Record<string, number | string>;

export class DatabaseError extends Error {
  readonly method: string;

  readonly context: DatabaseErrorContext;

  readonly cause: unknown;

  constructor(method: string, context: DatabaseErrorContext, cause: unknown) {
    super(`Database operation failed in ${method}`);
    this.name = 'DatabaseError';
    this.method = method;
    this.context = context;
    this.cause = cause;
  }
}

export class DatabaseService {
  private matchCache = new Map<string, Match>();

  private inningsCache = new Map<string, Innings[]>();

  private ballEventsCache = new Map<string, BallEvent[]>();

  invalidateCaches(): void {
    this.matchCache.clear();
    this.inningsCache.clear();
    this.ballEventsCache.clear();
  }
  private getBallEventsCacheKey(matchId: string, inningsNumber: number): string {
    return `${matchId}:${inningsNumber}`;
  }

  private toDatabaseError(
    method: string,
    context: DatabaseErrorContext,
    error: unknown,
  ): DatabaseError {
    logError(error, { method, ...context });
    return new DatabaseError(method, context, error);
  }

  /**
   * Creates a tournament record.
   *
   * @param payload - Tournament values to persist.
   * @returns The created tournament row.
   * @throws {DatabaseError} When the insert fails or does not return a row.
   */
  async createTournament(payload: NewTournament): Promise<Tournament> {
    try {
      const db = getDatabase();
      const [created] = await db.insert(tournaments).values(payload).returning();

      if (!created) {
        throw new Error('Insert did not return a row');
      }

      return created;
    } catch (error) {
      throw this.toDatabaseError('createTournament', { tournamentName: payload.name }, error);
    }
  }

  /**
   * Retrieves all tournaments sorted by most recently created.
   *
   * @returns Tournament rows in descending creation order.
   * @throws {DatabaseError} When the query fails.
   */
  async getTournaments(): Promise<Tournament[]> {
    try {
      const db = getDatabase();

      return db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
    } catch (error) {
      throw this.toDatabaseError('getTournaments', {}, error);
    }
  }

  /**
   * Gets a tournament by id.
   *
   * @param id - Tournament id.
   * @returns The tournament row when found, otherwise `undefined`.
   * @throws {DatabaseError} When the query fails.
   */
  async getTournamentById(id: string): Promise<Tournament | undefined> {
    try {
      const db = getDatabase();
      const [record] = await db.select().from(tournaments).where(eq(tournaments.id, id)).limit(1);

      if (!record) {
        return undefined;
      }

      return record;
    } catch (error) {
      throw this.toDatabaseError('getTournamentById', { id }, error);
    }
  }

  /**
   * Creates a team record.
   *
   * @param payload - Team values to persist.
   * @returns The created team row.
   * @throws {DatabaseError} When the insert fails or does not return a row.
   */
  async createTeam(payload: NewTeam): Promise<Team> {
    try {
      const db = getDatabase();
      const [created] = await db.insert(teams).values(payload).returning();

      if (!created) {
        throw new Error('Insert did not return a row');
      }

      return created;
    } catch (error) {
      throw this.toDatabaseError(
        'createTeam',
        { teamName: payload.name, tournamentId: payload.tournamentId },
        error,
      );
    }
  }

  /**
   * Retrieves teams for a tournament sorted by most recently created.
   *
   * @param tournamentId - Parent tournament id.
   * @returns Team rows for the tournament.
   * @throws {DatabaseError} When the query fails.
   */
  async getTeamsByTournament(tournamentId: string): Promise<Team[]> {
    try {
      const db = getDatabase();

      return db
        .select()
        .from(teams)
        .where(eq(teams.tournamentId, tournamentId))
        .orderBy(desc(teams.createdAt));
    } catch (error) {
      throw this.toDatabaseError('getTeamsByTournament', { tournamentId }, error);
    }
  }

  /**
   * Gets a team by id.
   *
   * @param id - Team id.
   * @returns The team row when found, otherwise `undefined`.
   * @throws {DatabaseError} When the query fails.
   */
  async getTeamById(id: string): Promise<Team | undefined> {
    try {
      const db = getDatabase();
      const [record] = await db.select().from(teams).where(eq(teams.id, id)).limit(1);

      if (!record) {
        return undefined;
      }

      return record;
    } catch (error) {
      throw this.toDatabaseError('getTeamById', { id }, error);
    }
  }

  /**
   * Creates a player record.
   *
   * @param payload - Player values to persist.
   * @returns The created player row.
   * @throws {DatabaseError} When the insert fails or does not return a row.
   */
  async createPlayer(payload: NewPlayer): Promise<Player> {
    try {
      const db = getDatabase();
      const [created] = await db.insert(players).values(payload).returning();

      if (!created) {
        throw new Error('Insert did not return a row');
      }

      return created;
    } catch (error) {
      throw this.toDatabaseError(
        'createPlayer',
        { playerName: payload.name, teamId: payload.teamId },
        error,
      );
    }
  }

  /**
   * Creates multiple player records in a single bulk operation.
   *
   * @param payloads - Array of player values to persist.
   * @returns The created player rows.
   * @throws {DatabaseError} When the bulk insert fails.
   */
  async createPlayers(payloads: NewPlayer[]): Promise<Player[]> {
    try {
      if (payloads.length === 0) {
        return [];
      }

      const db = getDatabase();
      return db.insert(players).values(payloads).returning();
    } catch (error) {
      throw this.toDatabaseError('createPlayers', { count: payloads.length }, error);
    }
  }

  /**
   * Retrieves players for a team sorted by most recently created.
   *
   * @param teamId - Parent team id.
   * @returns Player rows for the team.
   * @throws {DatabaseError} When the query fails.
   */
  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    try {
      const db = getDatabase();

      return db
        .select()
        .from(players)
        .where(eq(players.teamId, teamId))
        .orderBy(desc(players.createdAt));
    } catch (error) {
      throw this.toDatabaseError('getPlayersByTeam', { teamId }, error);
    }
  }

  /**
   * Creates a match record and updates the in-memory match cache.
   *
   * @param payload - Match values to persist.
   * @returns The created match row.
   * @throws {DatabaseError} When the insert fails or does not return a row.
   */
  async createMatch(payload: NewMatch): Promise<Match> {
    try {
      const db = getDatabase();
      const [created] = await db.insert(matches).values(payload).returning();

      if (!created) {
        throw new Error('Insert did not return a row');
      }

      this.matchCache.set(created.id, created);

      return created;
    } catch (error) {
      throw this.toDatabaseError('createMatch', { tournamentId: payload.tournamentId }, error);
    }
  }

  /**
   * Gets a match by id using cache-first lookup.
   *
   * @param id - Match id.
   * @returns The match row when found, otherwise `undefined`.
   * @throws {DatabaseError} When the lookup fails.
   */
  async getMatchById(id: string): Promise<Match | undefined> {
    try {
      const cached = this.matchCache.get(id);
      if (cached) {
        return cached;
      }

      const db = getDatabase();
      const [record] = await db.select().from(matches).where(eq(matches.id, id)).limit(1);

      if (!record) {
        return undefined;
      }

      this.matchCache.set(id, record);

      return record;
    } catch (error) {
      throw this.toDatabaseError('getMatchById', { id }, error);
    }
  }

  /**
   * Retrieves recent matches with resolved team names.
   *
   * @param limit - Maximum number of matches to return.
   * @returns Recent match summaries ordered by newest first.
   * @throws {DatabaseError} When the query fails.
   */
  async getRecentMatches(limit = 5): Promise<
    Array<{
      id: string;
      status: string;
      createdAt: Date;
      teamAName: string;
      teamBName: string;
    }>
  > {
    try {
      const db = getDatabase();
      const recentMatches = await db
        .select()
        .from(matches)
        .orderBy(desc(matches.createdAt))
        .limit(limit);

      return Promise.all(
        recentMatches.map(async (match) => {
          const [teamA, teamB] = await Promise.all([
            this.getTeamById(match.teamAId),
            this.getTeamById(match.teamBId),
          ]);

          return {
            id: match.id,
            status: match.status,
            createdAt: match.createdAt,
            teamAName: teamA?.name ?? 'Team A',
            teamBName: teamB?.name ?? 'Team B',
          };
        }),
      );
    } catch (error) {
      throw this.toDatabaseError('getRecentMatches', { limit }, error);
    }
  }

  /**
   * Updates a match status and refreshes the in-memory match cache.
   *
   * @param id - Match id.
   * @param status - Allowed match status value.
   * @returns The updated match row.
   * @throws {DatabaseError} When the update fails or does not return a row.
   */
  async updateMatchStatus(id: string, status: 'upcoming' | 'live' | 'completed'): Promise<Match> {
    try {
      const db = getDatabase();
      const [updated] = await db
        .update(matches)
        .set({ status, updatedAt: sql`${Math.floor(Date.now() / 1000)}` })
        .where(eq(matches.id, id))
        .returning();

      if (!updated) {
        throw new Error('Update did not return a row');
      }

      this.matchCache.set(id, updated);

      return updated;
    } catch (error) {
      throw this.toDatabaseError('updateMatchStatus', { id, status }, error);
    }
  }

  /**
   * Creates an innings record and updates cached innings for the match when present.
   *
   * @param payload - Innings values to persist.
   * @returns The created innings row.
   * @throws {DatabaseError} When the insert fails or does not return a row.
   */
  async createInnings(payload: NewInnings): Promise<Innings> {
    try {
      const db = getDatabase();
      const [created] = await db.insert(innings).values(payload).returning();

      if (!created) {
        throw new Error('Insert did not return a row');
      }

      const cachedInnings = this.inningsCache.get(created.matchId);
      if (cachedInnings) {
        this.inningsCache.set(
          created.matchId,
          [...cachedInnings, created].sort((a, b) => b.inningsNumber - a.inningsNumber),
        );
      }

      return created;
    } catch (error) {
      throw this.toDatabaseError(
        'createInnings',
        { matchId: payload.matchId, inningsNumber: payload.inningsNumber },
        error,
      );
    }
  }

  /**
   * Retrieves innings for a match using cache-first lookup.
   *
   * @param matchId - Match id.
   * @returns Innings rows in descending innings order.
   * @throws {DatabaseError} When the query fails.
   */
  async getInningsByMatch(matchId: string): Promise<Innings[]> {
    try {
      const cached = this.inningsCache.get(matchId);
      if (cached) {
        return cached;
      }

      const db = getDatabase();
      const records = await db
        .select()
        .from(innings)
        .where(eq(innings.matchId, matchId))
        .orderBy(desc(innings.inningsNumber));

      this.inningsCache.set(matchId, records);

      return records;
    } catch (error) {
      throw this.toDatabaseError('getInningsByMatch', { matchId }, error);
    }
  }

  /**
   * Retrieves the current innings for a match.
   *
   * @param matchId - Match id.
   * @returns The latest innings row by innings number, or `undefined`.
   * @throws {DatabaseError} When the lookup fails.
   */
  async getCurrentInnings(matchId: string): Promise<Innings | undefined> {
    try {
      const cached = this.inningsCache.get(matchId);
      if (cached && cached.length > 0) {
        return cached[0];
      }

      const db = getDatabase();
      const [record] = await db
        .select()
        .from(innings)
        .where(eq(innings.matchId, matchId))
        .orderBy(desc(innings.inningsNumber))
        .limit(1);

      if (!record) {
        return undefined;
      }

      const cachedInnings = this.inningsCache.get(matchId) ?? [];
      this.inningsCache.set(
        matchId,
        [...cachedInnings, record].sort((a, b) => b.inningsNumber - a.inningsNumber),
      );

      return record;
    } catch (error) {
      throw this.toDatabaseError('getCurrentInnings', { matchId }, error);
    }
  }

  /**
   * Creates a ball event and updates cached events for the innings when present.
   *
   * @param payload - Ball event values to persist.
   * @returns The created ball event row.
   * @throws {DatabaseError} When the insert fails or does not return a row.
   */
  async addBallEvent(payload: NewBallEvent): Promise<BallEvent> {
    try {
      const db = getDatabase();
      const [created] = await db.insert(ballEvents).values(payload).returning();

      if (!created) {
        throw new Error('Insert did not return a row');
      }

      const cacheKey = this.getBallEventsCacheKey(created.matchId, created.inningsNumber);
      const cachedEvents = this.ballEventsCache.get(cacheKey);
      if (cachedEvents) {
        this.ballEventsCache.set(
          cacheKey,
          [...cachedEvents, created].sort((a, b) => {
            if (a.inningsNumber !== b.inningsNumber) {
              return a.inningsNumber - b.inningsNumber;
            }

            if (a.overNumber !== b.overNumber) {
              return a.overNumber - b.overNumber;
            }

            if (a.ballNumber !== b.ballNumber) {
              return a.ballNumber - b.ballNumber;
            }

            return a.createdAt.getTime() - b.createdAt.getTime();
          }),
        );
      }

      return created;
    } catch (error) {
      throw this.toDatabaseError(
        'addBallEvent',
        {
          matchId: payload.matchId,
          inningsNumber: payload.inningsNumber,
          overNumber: payload.overNumber,
          ballNumber: payload.ballNumber,
        },
        error,
      );
    }
  }

  /**
   * Creates multiple ball events and updates cached events for the affected innings.
   *
   * @param payloads - Array of ball event values to persist.
   * @returns The created ball event rows.
   * @throws {DatabaseError} When the insert fails.
   */
  async addBallEvents(payloads: NewBallEvent[]): Promise<BallEvent[]> {
    try {
      const db = getDatabase();
      const createdEvents = await db.insert(ballEvents).values(payloads).returning();

      if (createdEvents.length === 0) {
        return [];
      }

      // Group by innings to update cache
      const groupedByInnings = new Map<string, BallEvent[]>();
      for (const event of createdEvents) {
        const key = this.getBallEventsCacheKey(event.matchId, event.inningsNumber);
        const existing = groupedByInnings.get(key) ?? [];
        existing.push(event);
        groupedByInnings.set(key, existing);
      }

      for (const [cacheKey, newEvents] of groupedByInnings) {
        const cachedEvents = this.ballEventsCache.get(cacheKey);
        if (cachedEvents) {
          const merged = [...cachedEvents, ...newEvents].sort((a, b) => {
            if (a.inningsNumber !== b.inningsNumber) {
              return a.inningsNumber - b.inningsNumber;
            }
            if (a.overNumber !== b.overNumber) {
              return a.overNumber - b.overNumber;
            }
            if (a.ballNumber !== b.ballNumber) {
              return a.ballNumber - b.ballNumber;
            }
            return a.createdAt.getTime() - b.createdAt.getTime();
          });
          this.ballEventsCache.set(cacheKey, merged);
        }
      }

      return createdEvents;
    } catch (error) {
      throw this.toDatabaseError('addBallEvents', { count: payloads.length }, error);
    }
  }

  /**
   * Retrieves ball events for a match, optionally scoped to a single innings.
   *
   * @param matchId - Match id.
   * @param inningsNumber - Optional innings number for scoped retrieval.
   * @returns Ball events ordered chronologically for scoring replay.
   * @throws {DatabaseError} When the query fails.
   */
  async getBallEventsByMatch(matchId: string, inningsNumber?: number): Promise<BallEvent[]> {
    try {
      if (inningsNumber !== undefined) {
        const cacheKey = this.getBallEventsCacheKey(matchId, inningsNumber);
        const cached = this.ballEventsCache.get(cacheKey);
        if (cached) {
          return cached;
        }
      }

      const db = getDatabase();
      const records = await db
        .select()
        .from(ballEvents)
        .where(
          inningsNumber === undefined
            ? eq(ballEvents.matchId, matchId)
            : and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)),
        )
        .orderBy(
          ballEvents.inningsNumber,
          ballEvents.overNumber,
          ballEvents.ballNumber,
          ballEvents.createdAt,
        );

      const groupedByInnings = new Map<number, BallEvent[]>();
      for (const event of records) {
        const existing = groupedByInnings.get(event.inningsNumber) ?? [];
        existing.push(event);
        groupedByInnings.set(event.inningsNumber, existing);
      }

      for (const [inningsNumber, events] of groupedByInnings) {
        this.ballEventsCache.set(this.getBallEventsCacheKey(matchId, inningsNumber), events);
      }
      return records;
    } catch (error) {
      throw this.toDatabaseError(
        'getBallEventsByMatch',
        inningsNumber === undefined ? { matchId } : { matchId, inningsNumber },
        error,
      );
    }
  }

  /**
   * Deletes the most recent ball event in an innings.
   *
   * @param matchId - Match id.
   * @param inningsNumber - Innings number.
   * @returns The deleted ball event, or `null` when no event exists.
   * @throws {DatabaseError} When the transaction fails.
   */
  async undoLastBall(matchId: string, inningsNumber: number): Promise<BallEvent | null> {
    try {
      const db = getDatabase();
      const deletedEvent = await db.transaction(async (tx) => {
        const [lastBall] = await tx
          .select({ id: ballEvents.id })
          .from(ballEvents)
          .where(and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)))
          .orderBy(desc(ballEvents.createdAt), desc(ballEvents.id))
          .limit(1);

        if (!lastBall) {
          return null;
        }

        const [deleted] = await tx
          .delete(ballEvents)
          .where(eq(ballEvents.id, lastBall.id))
          .returning();

        if (!deleted) {
          throw new Error('Delete did not return deleted row');
        }

        return deleted;
      });

      if (deletedEvent) {
        const cacheKey = this.getBallEventsCacheKey(matchId, inningsNumber);
        const cachedEvents = this.ballEventsCache.get(cacheKey);
        if (cachedEvents) {
          this.ballEventsCache.set(
            cacheKey,
            cachedEvents.filter((event) => event.id !== deletedEvent.id),
          );
        }
      }

      return deletedEvent;
    } catch (error) {
      throw this.toDatabaseError('undoLastBall', { matchId, inningsNumber }, error);
    }
  }

  /**
   * Retrieves the latest ball event for an innings.
   *
   * @param matchId - Match id.
   * @param inningsNumber - Innings number.
   * @returns The most recent ball event, or `undefined` when none exists.
   * @throws {DatabaseError} When the query fails.
   */
  async getLastBall(matchId: string, inningsNumber: number): Promise<BallEvent | undefined> {
    try {
      const db = getDatabase();
      const [lastBall] = await db
        .select()
        .from(ballEvents)
        .where(and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)))
        .orderBy(
          desc(ballEvents.overNumber),
          desc(ballEvents.ballNumber),
          desc(ballEvents.createdAt),
        )
        .limit(1);

      if (!lastBall) {
        return undefined;
      }

      return lastBall;
    } catch (error) {
      throw this.toDatabaseError('getLastBall', { matchId, inningsNumber }, error);
    }
  }

  /**
   * Calculates total runs for an innings.
   *
   * @param matchId - Match id.
   * @param inningsNumber - Innings number.
   * @returns Total runs as a number.
   * @throws {DatabaseError} When the aggregation query fails.
   */
  async getTotalRuns(matchId: string, inningsNumber: number): Promise<number> {
    try {
      const db = getDatabase();
      const [result] = await db
        .select({ totalRuns: sum(ballEvents.runs) })
        .from(ballEvents)
        .where(and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)));

      return Number(result?.totalRuns ?? 0);
    } catch (error) {
      throw this.toDatabaseError('getTotalRuns', { matchId, inningsNumber }, error);
    }
  }

  /**
   * Calculates total wickets for an innings.
   *
   * @param matchId - Match id.
   * @param inningsNumber - Innings number.
   * @returns Number of wicket events.
   * @throws {DatabaseError} When the aggregation query fails.
   */
  async getTotalWickets(matchId: string, inningsNumber: number): Promise<number> {
    try {
      const db = getDatabase();
      const [result] = await db
        .select({
          totalWickets: sql<number>`cast(count(*) as int)`,
        })
        .from(ballEvents)
        .where(
          and(
            eq(ballEvents.matchId, matchId),
            eq(ballEvents.inningsNumber, inningsNumber),
            isNotNull(ballEvents.wicketType),
          ),
        );

      return result?.totalWickets ?? 0;
    } catch (error) {
      throw this.toDatabaseError('getTotalWickets', { matchId, inningsNumber }, error);
    }
  }

  /**
   * Calculates the number of legal balls in an innings.
   *
   * @param matchId - Match id.
   * @param inningsNumber - Innings number.
   * @returns Number of legal deliveries.
   * @throws {DatabaseError} When the aggregation query fails.
   */
  async getLegalBallCount(matchId: string, inningsNumber: number): Promise<number> {
    try {
      const db = getDatabase();
      const [result] = await db
        .select({
          legalBallCount: sql<number>`cast(count(*) as int)`,
        })
        .from(ballEvents)
        .where(
          and(
            eq(ballEvents.matchId, matchId),
            eq(ballEvents.inningsNumber, inningsNumber),
            eq(ballEvents.isLegalBall, true),
          ),
        );

      return result?.legalBallCount ?? 0;
    } catch (error) {
      throw this.toDatabaseError('getLegalBallCount', { matchId, inningsNumber }, error);
    }
  }
}

export const databaseService = new DatabaseService();
