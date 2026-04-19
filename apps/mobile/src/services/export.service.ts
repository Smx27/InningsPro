import { databaseService } from './db.service';
import type { ExportSchemaV1, Match, Team, Tournament } from '@inningspro/shared-types';
import { v1 } from '@inningspro/export-schema';

/**
 * ExportService
 * 
 * Handles the generation of .ipro portable match files.
 * These files follow ExportSchemaV1 and are consumed by the Web Reporting Portal.
 */
export class ExportService {
  /**
   * Generates a validated JSON string of the match data.
   */
  async generateExport(matchId: string): Promise<string> {
    const match = await databaseService.getMatchById(matchId);
    if (!match) throw new Error(`Match ${matchId} not found`);

    const tournament = await databaseService.getTournamentById(match.tournamentId);
    if (!tournament) throw new Error(`Tournament ${match.tournamentId} not found`);

    const [homeTeam, awayTeam] = await Promise.all([
      databaseService.getTeamById(match.homeTeamId),
      databaseService.getTeamById(match.awayTeamId),
    ]);

    if (!homeTeam || !awayTeam) throw new Error('Teams not found');

    const innings = await databaseService.getInningsByMatch(matchId);
    
    // Enrich innings with events
    const enrichedInnings = await Promise.all(
      innings.map(async (inn) => {
        const events = await databaseService.getBallEventsByMatch(matchId, inn.inningsNumber);
        return {
          id: inn.id,
          matchId: inn.matchId,
          battingTeamId: inn.battingTeamId,
          bowlingTeamId: inn.bowlingTeamId,
          sequence: inn.inningsNumber as any,
          startsAt: inn.createdAt.toISOString(),
          declared: !!inn.isDeclared,
          events: events,
        };
      })
    );

    const matchData: Match = {
      id: match.id,
      tournamentId: match.tournamentId,
      homeTeamId: match.homeTeamId,
      awayTeamId: match.awayTeamId,
      venue: match.venue || undefined,
      startsAt: match.createdAt.toISOString(),
      tossWinnerTeamId: match.tossWinnerId || undefined,
      tossDecision: match.tossDecision as any,
      rules: match.rules as any,
      innings: enrichedInnings,
      status: match.status as any,
      winnerTeamId: match.winnerId || undefined,
    };

    const payload: ExportSchemaV1 = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      tournament: tournament as any,
      teams: [homeTeam as any, awayTeam as any],
      matches: [matchData],
    };

    // Runtime validation using the shared schema
    const validated = v1.parseMatchExport(payload);

    return JSON.stringify(validated, null, 2);
  }
}

export const exportService = new ExportService();
