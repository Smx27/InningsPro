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

export class DatabaseService {
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

    return created;
  }

  async getMatchById(id: string): Promise<Match | undefined> {
    const db = getDatabase();
    const [record] = await db.select().from(matches).where(eq(matches.id, id)).limit(1);

    return record;
  }

  async updateMatchStatus(id: string, status: Match['status']): Promise<Match | undefined> {
    const db = getDatabase();
    const [updated] = await db
      .update(matches)
      .set({ status, updatedAt: new Date() })
      .where(eq(matches.id, id))
      .returning();

    return updated;
  }

  async createInnings(payload: NewInnings): Promise<Innings | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(innings).values(payload).returning();

    return created;
  }

  async getInningsByMatch(matchId: string): Promise<Innings[]> {
    const db = getDatabase();

    return db
      .select()
      .from(innings)
      .where(eq(innings.matchId, matchId))
      .orderBy(desc(innings.inningsNumber));
  }

  async addBallEvent(payload: NewBallEvent): Promise<BallEvent | undefined> {
    const db = getDatabase();
    const [created] = await db.insert(ballEvents).values(payload).returning();

    return created;
  }

  async getBallEventsByMatch(matchId: string): Promise<BallEvent[]> {
    const db = getDatabase();

    return db
      .select()
      .from(ballEvents)
      .where(eq(ballEvents.matchId, matchId))
      .orderBy(desc(ballEvents.inningsNumber), desc(ballEvents.overNumber), desc(ballEvents.ballNumber));
  }

  async undoLastBall(matchId: string, inningsNumber: number): Promise<BallEvent | undefined> {
    const db = getDatabase();
    const [lastBall] = await db
      .select({ id: ballEvents.id })
      .from(ballEvents)
      .where(and(eq(ballEvents.matchId, matchId), eq(ballEvents.inningsNumber, inningsNumber)))
      .orderBy(desc(ballEvents.overNumber), desc(ballEvents.ballNumber), desc(ballEvents.createdAt))
      .limit(1);

    if (!lastBall) {
      return undefined;
    }

    const [deleted] = await db.delete(ballEvents).where(eq(ballEvents.id, lastBall.id)).returning();

    return deleted;
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
