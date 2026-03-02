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
  Tournament
} from '@core/database/schema';

export class DatabaseServiceError extends Error {
  readonly cause: unknown;

  constructor(message: string, cause: unknown) {
    super(message);
    this.name = 'DatabaseServiceError';
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

  async createTournament(payload: NewTournament): Promise<Tournament | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(tournaments).values(payload).returning();

    return created;
  }

  async getTournaments(): Promise<Tournament[]> {
    const db = getDatabase();

    return db.select().from(tournaments).orderBy(desc(tournaments.createdAt));
  }

  async getTournamentById(id: string): Promise<Tournament | undefined> {
    const db = getDatabase();
    const [record] = await db.select().from(tournaments).where(eq(tournaments.id, id)).limit(1);

    return record;
  }

  async createTeam(payload: NewTeam): Promise<Team | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(teams).values(payload).returning();

    return created;
  }

  async getTeamsByTournament(tournamentId: string): Promise<Team[]> {
    const db = getDatabase();

    return db
      .select()
      .from(teams)
      .where(eq(teams.tournamentId, tournamentId))
      .orderBy(desc(teams.createdAt));
  }

  async createPlayer(payload: NewPlayer): Promise<Player | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(players).values(payload).returning();

    return created;
  }

  async getPlayersByTeam(teamId: string): Promise<Player[]> {
    const db = getDatabase();

    return db.select().from(players).where(eq(players.teamId, teamId)).orderBy(desc(players.createdAt));
  }

  async createMatch(payload: NewMatch): Promise<Match | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(matches).values(payload).returning();

    if (created) {
      this.matchCache.set(created.id, created);
    }

    return created;
  }

  async getMatchById(id: string): Promise<Match | undefined> {
    const cached = this.matchCache.get(id);
    if (cached) {
      return cached;
    }

    const db = getDatabase();
    const [record] = await db.select().from(matches).where(eq(matches.id, id)).limit(1);

    if (record) {
      this.matchCache.set(id, record);
    }

    return record;
  }

  async updateMatchStatus(id: string, status: Match['status']): Promise<Match | undefined> {
    const db = getDatabase();
    const [updated] = await db
      .update(matches)
      .set({ status, updatedAt: new Date() })
      .where(eq(matches.id, id))
      .returning();

    if (updated) {
      this.matchCache.set(id, updated);
    }

    return updated;
  }

  async createInnings(payload: NewInnings): Promise<Innings | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(innings).values(payload).returning();

    if (created) {
      const cachedInnings = this.inningsCache.get(created.matchId);
      if (cachedInnings) {
        this.inningsCache.set(
          created.matchId,
          [...cachedInnings, created].sort((a, b) => b.inningsNumber - a.inningsNumber)
        );
      }
    }

    return created;
  }

  async getInningsByMatch(matchId: string): Promise<Innings[]> {
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
  }

  async addBallEvent(payload: NewBallEvent): Promise<BallEvent | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(ballEvents).values(payload).returning();

    if (created) {
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
          })
        );
      }
    }

    return created;
  }

  async getBallEventsByMatch(matchId: string): Promise<BallEvent[]> {
    const db = getDatabase();
    const inningsRecords = await this.getInningsByMatch(matchId);

    if (inningsRecords.length > 0) {
      const missingInningsNumbers = inningsRecords
        .map(({ inningsNumber }) => inningsNumber)
        .filter((inningsNumber) => !this.ballEventsCache.has(this.getBallEventsCacheKey(matchId, inningsNumber)));

      if (missingInningsNumbers.length > 0) {
        for (const inningsNumber of missingInningsNumbers) {
          const records = await db
            .select()
            .from(ballEvents)
            .where(and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)))
            .orderBy(desc(ballEvents.overNumber), desc(ballEvents.ballNumber), desc(ballEvents.createdAt));

          this.ballEventsCache.set(this.getBallEventsCacheKey(matchId, inningsNumber), records);
        }
      }

      return inningsRecords.flatMap(
        ({ inningsNumber }) => this.ballEventsCache.get(this.getBallEventsCacheKey(matchId, inningsNumber)) ?? []
      );
    }

    const records = await db
      .select()
      .from(ballEvents)
      .where(eq(ballEvents.matchId, matchId))
      .orderBy(desc(ballEvents.inningsNumber), desc(ballEvents.overNumber), desc(ballEvents.ballNumber));

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
  }

  async undoLastBall(matchId: string, inningsNumber: number): Promise<BallEvent | null> {
    const db = getDatabase();

    try {
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

        const [deleted] = await tx.delete(ballEvents).where(eq(ballEvents.id, lastBall.id)).returning();

        return deleted ?? null;
      });

      if (deletedEvent) {
        const cacheKey = this.getBallEventsCacheKey(matchId, inningsNumber);
        const cachedEvents = this.ballEventsCache.get(cacheKey);
        if (cachedEvents) {
          this.ballEventsCache.set(
            cacheKey,
            cachedEvents.filter((event) => event.id !== deletedEvent.id)
          );
        }
      }

      return deletedEvent;
    } catch (error) {
      throw new DatabaseServiceError('Failed to undo last ball event', error);
    }
  }

  async getLastBall(matchId: string, inningsNumber: number): Promise<BallEvent | undefined> {
    const db = getDatabase();
    const [lastBall] = await db
      .select()
      .from(ballEvents)
      .where(and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)))
      .orderBy(desc(ballEvents.overNumber), desc(ballEvents.ballNumber), desc(ballEvents.createdAt))
      .limit(1);

    return lastBall;
  }

  async getTotalRuns(matchId: string, inningsNumber: number): Promise<number> {
    const db = getDatabase();
    const [result] = await db
      .select({ totalRuns: sum(ballEvents.runs) })
      .from(ballEvents)
      .where(and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)));

    return Number(result?.totalRuns ?? 0);
  }

  async getTotalWickets(matchId: string, inningsNumber: number): Promise<number> {
    const db = getDatabase();
    const [result] = await db
      .select({
        totalWickets: sql<number>`cast(count(*) as int)`
      })
      .from(ballEvents)
      .where(
        and(
          eq(ballEvents.matchId, matchId),
          eq(ballEvents.inningsNumber, inningsNumber),
          isNotNull(ballEvents.wicketType)
        )
      );

    return result?.totalWickets ?? 0;
  }

  async getLegalBallCount(matchId: string, inningsNumber: number): Promise<number> {
    const db = getDatabase();
    const [result] = await db
      .select({
        legalBallCount: sql<number>`cast(count(*) as int)`
      })
      .from(ballEvents)
      .where(
        and(
          eq(ballEvents.matchId, matchId),
          eq(ballEvents.inningsNumber, inningsNumber),
          eq(ballEvents.isLegalBall, true)
        )
      );

    return result?.legalBallCount ?? 0;
  }
}

export const databaseService = new DatabaseService();
