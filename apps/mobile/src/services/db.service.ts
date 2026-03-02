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

  private getBallEventsCacheKey(matchId: string, inningsNumber: number): string {
    return `${matchId}:${inningsNumber}`;
  }

  private toDatabaseError(
    method: string,
    context: DatabaseErrorContext,
    error: unknown,
  ): DatabaseError {
    return new DatabaseError(method, context, error);
  }

  async createTournament(payload: NewTournament): Promise<Tournament | undefined> {
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

  async getTournaments(): Promise<Tournament[]> {
    try {
      const db = getDatabase();

      return db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
    } catch (error) {
      throw this.toDatabaseError('getTournaments', {}, error);
    }
  }

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

  async createTeam(payload: NewTeam): Promise<Team | undefined> {
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

  async createPlayer(payload: NewPlayer): Promise<Player | undefined> {
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

  async createMatch(payload: NewMatch): Promise<Match | undefined> {
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

  async updateMatchStatus(id: string, status: Match['status']): Promise<Match | undefined> {
    try {
      const db = getDatabase();
      const [updated] = await db
        .update(matches)
        .set({ status, updatedAt: new Date() })
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

  async createInnings(payload: NewInnings): Promise<Innings | undefined> {
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

  async addBallEvent(payload: NewBallEvent): Promise<BallEvent | undefined> {
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
            if (b.overNumber !== a.overNumber) {
              return b.overNumber - a.overNumber;
            }

            if (b.ballNumber !== a.ballNumber) {
              return b.ballNumber - a.ballNumber;
            }

            return b.createdAt.getTime() - a.createdAt.getTime();
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

  async getBallEventsByMatch(matchId: string): Promise<BallEvent[]> {
    try {
      const db = getDatabase();
      const inningsRecords = await this.getInningsByMatch(matchId);

      if (inningsRecords.length > 0) {
        const missingInningsNumbers = inningsRecords
          .map(({ inningsNumber }) => inningsNumber)
          .filter(
            (inningsNumber) =>
              !this.ballEventsCache.has(this.getBallEventsCacheKey(matchId, inningsNumber)),
          );

        if (missingInningsNumbers.length > 0) {
          for (const inningsNumber of missingInningsNumbers) {
            const records = await db
              .select()
              .from(ballEvents)
              .where(
                and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)),
              )
              .orderBy(
                desc(ballEvents.overNumber),
                desc(ballEvents.ballNumber),
                desc(ballEvents.createdAt),
              );

            this.ballEventsCache.set(this.getBallEventsCacheKey(matchId, inningsNumber), records);
          }
        }

        return inningsRecords.flatMap(
          ({ inningsNumber }) =>
            this.ballEventsCache.get(this.getBallEventsCacheKey(matchId, inningsNumber)) ?? [],
        );
      }

      const records = await db
        .select()
        .from(ballEvents)
        .where(eq(ballEvents.matchId, matchId))
        .orderBy(
          desc(ballEvents.inningsNumber),
          desc(ballEvents.overNumber),
          desc(ballEvents.ballNumber),
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
      throw this.toDatabaseError('getBallEventsByMatch', { matchId }, error);
    }
  }

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
