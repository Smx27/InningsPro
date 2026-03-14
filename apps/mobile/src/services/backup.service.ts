import { and, eq, inArray } from 'drizzle-orm';

import { getDatabase } from '@core/database';
import {
  ballEvents,
  innings,
  matches,
  players,
  teams,
  tournaments,
  type BallEvent,
  type Innings,
  type Match,
  type Player,
  type Team,
  type Tournament,
} from '@core/database/schema';

import { databaseService } from './db.service';
import { logError, logInfo } from './logger';

export type BackupPayload = {
  version: '1.0';
  exportedAt: string;
  tournaments: Tournament[];
  teams: Team[];
  players: Player[];
  matches: Match[];
  innings: Innings[];
  ballEvents: BallEvent[];
};

const isBackupPayload = (value: unknown): value is BackupPayload => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<BackupPayload>;
  return (
    candidate.version === '1.0' &&
    Array.isArray(candidate.tournaments) &&
    Array.isArray(candidate.teams) &&
    Array.isArray(candidate.players) &&
    Array.isArray(candidate.matches) &&
    Array.isArray(candidate.innings) &&
    Array.isArray(candidate.ballEvents)
  );
};

class BackupService {
  async exportTournament(tournamentId: string): Promise<BackupPayload> {
    const db = getDatabase();

    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, tournamentId))
      .limit(1);

    if (!tournament) {
      throw new Error(`Tournament not found: ${tournamentId}`);
    }

    const tournamentTeams = await db.select().from(teams).where(eq(teams.tournamentId, tournamentId));
    const teamIds = tournamentTeams.map((team) => team.id);

    const tournamentPlayers =
      teamIds.length > 0
        ? await db.select().from(players).where(inArray(players.teamId, teamIds))
        : [];

    const tournamentMatches = await db.select().from(matches).where(eq(matches.tournamentId, tournamentId));
    const matchIds = tournamentMatches.map((match) => match.id);

    const tournamentInnings =
      matchIds.length > 0
        ? await db.select().from(innings).where(inArray(innings.matchId, matchIds))
        : [];

    const tournamentBallEvents =
      matchIds.length > 0
        ? await db.select().from(ballEvents).where(inArray(ballEvents.matchId, matchIds))
        : [];

    logInfo('Tournament export generated', { tournamentId, matches: tournamentMatches.length });

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tournaments: [tournament],
      teams: tournamentTeams,
      players: tournamentPlayers,
      matches: tournamentMatches,
      innings: tournamentInnings,
      ballEvents: tournamentBallEvents,
    };
  }

  async exportMatch(matchId: string): Promise<BackupPayload> {
    const db = getDatabase();
    const [match] = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);

    if (!match) {
      throw new Error(`Match not found: ${matchId}`);
    }

    const [tournament] = await db
      .select()
      .from(tournaments)
      .where(eq(tournaments.id, match.tournamentId))
      .limit(1);

    if (!tournament) {
      throw new Error(`Tournament not found for match: ${matchId}`);
    }

    const matchTeams = await db
      .select()
      .from(teams)
      .where(and(eq(teams.tournamentId, tournament.id), inArray(teams.id, [match.teamAId, match.teamBId])));

    const teamIds = matchTeams.map((team) => team.id);
    const matchPlayers =
      teamIds.length > 0 ? await db.select().from(players).where(inArray(players.teamId, teamIds)) : [];

    const matchInningsRows = await db.select().from(innings).where(eq(innings.matchId, match.id));
    const matchEvents = await db.select().from(ballEvents).where(eq(ballEvents.matchId, match.id));

    logInfo('Match export generated', { matchId, deliveries: matchEvents.length });

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tournaments: [tournament],
      teams: matchTeams,
      players: matchPlayers,
      matches: [match],
      innings: matchInningsRows,
      ballEvents: matchEvents,
    };
  }

  async importBackup(json: string | BackupPayload): Promise<void> {
    const parsed = typeof json === 'string' ? (JSON.parse(json) as unknown) : json;

    if (!isBackupPayload(parsed)) {
      throw new Error('Backup payload is invalid');
    }

    const db = getDatabase();

    try {
      await db.transaction(async (tx) => {
        if (parsed.tournaments.length > 0) {
          await tx.insert(tournaments).values(parsed.tournaments).onConflictDoNothing();
        }
        if (parsed.teams.length > 0) {
          await tx.insert(teams).values(parsed.teams).onConflictDoNothing();
        }
        if (parsed.players.length > 0) {
          await tx.insert(players).values(parsed.players).onConflictDoNothing();
        }
        if (parsed.matches.length > 0) {
          await tx.insert(matches).values(parsed.matches).onConflictDoNothing();
        }
        if (parsed.innings.length > 0) {
          await tx.insert(innings).values(parsed.innings).onConflictDoNothing();
        }
        if (parsed.ballEvents.length > 0) {
          await tx.insert(ballEvents).values(parsed.ballEvents).onConflictDoNothing();
        }
      });

      databaseService.invalidateCaches();

      logInfo('Backup import completed', {
        tournaments: parsed.tournaments.length,
        matches: parsed.matches.length,
      });
    } catch (error) {
      logError(error, { operation: 'importBackup' });
      throw error;
    }
  }
}

export const backupService = new BackupService();
