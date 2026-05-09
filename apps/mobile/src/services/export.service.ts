import { databaseService } from './db.service';
import type {
  BallEvent as SharedBallEvent,
  Match as SharedMatch,
  Team as SharedTeam,
  Tournament as SharedTournament,
  MatchStatus as SharedMatchStatus,
  MatchRules as SharedMatchRules,
  Innings as SharedInnings,
  Player as SharedPlayer,
} from '@inningspro/shared-types';
import { v1 } from '@inningspro/export-schema';
import type {
  BallEvent as DBBallEvent,
  Match as DBMatch,
  Innings as DBInnings,
  Team as DBTeam,
  Tournament as DBTournament,
  Player as DBPlayer,
} from '@core/database/schema';

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

    const teams = await databaseService.getTeamsByTournament(match.tournamentId);
    const homeTeam = teams.find((t) => t.id === match.teamAId);
    const awayTeam = teams.find((t) => t.id === match.teamBId);

    if (!homeTeam || !awayTeam) throw new Error('Teams not found');

    const [mappedHomeTeam, mappedAwayTeam, mappedTournament] = await Promise.all([
      this.mapTeam(homeTeam),
      this.mapTeam(awayTeam),
      this.mapTournament(tournament, teams),
    ]);

    const innings = await databaseService.getInningsByMatch(matchId);

    // Enrich innings with events
    const enrichedInnings: SharedInnings[] = await Promise.all(
      innings.map(async (inn) => {
        const events = await databaseService.getBallEventsByMatch(matchId, inn.inningsNumber);
        return {
          id: inn.id,
          matchId: inn.matchId,
          battingTeamId: inn.battingTeamId,
          bowlingTeamId: inn.bowlingTeamId,
          sequence: this.mapInningsSequence(inn.inningsNumber),
          startsAt: inn.createdAt.toISOString(),
          declared: false,
          events: events.map((e) => this.mapBallEvent(e, inn.id)),
        };
      }),
    );

    const matchData: SharedMatch = {
      id: match.id,
      tournamentId: match.tournamentId,
      homeTeamId: match.teamAId,
      awayTeamId: match.teamBId,
      venue: undefined,
      startsAt: match.createdAt.toISOString(),
      tossWinnerTeamId: undefined,
      tossDecision: undefined,
      rules: this.mapMatchRules(match.rulesJson),
      innings: enrichedInnings,
      status: this.mapMatchStatus(match.status),
      winnerTeamId: undefined,
    };

    const payload: v1.MatchExportSchemaV1 = {
      schemaVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      tournament: mappedTournament,
      teams: [mappedHomeTeam, mappedAwayTeam],
      match: matchData,
    };

    // Runtime validation using the shared schema
    const validated = v1.parseMatchExport(payload);

    return JSON.stringify(validated, null, 2);
  }

  private mapInningsSequence(num: number): 1 | 2 | 3 | 4 {
    if (num === 1 || num === 2 || num === 3 || num === 4) {
      return num;
    }
    return 1;
  }

  private mapMatchStatus(status: string): SharedMatchStatus {
    switch (status) {
      case 'upcoming':
        return 'scheduled';
      case 'live':
        return 'live';
      case 'completed':
        return 'completed';
      default:
        return 'scheduled';
    }
  }

  private mapMatchRules(rulesJson: string): SharedMatchRules {
    try {
      const parsed = JSON.parse(rulesJson);
      return {
        maxOversPerInnings: parsed.oversPerInnings ?? 20,
        ballsPerOver: parsed.ballsPerOver ?? 6,
        wicketsPerInnings: parsed.maxWickets ?? 10,
        wideBallAddsRun: true,
        noBallAddsRun: true,
        freeHitAfterNoBall: false,
      };
    } catch {
      return {
        maxOversPerInnings: 20,
        ballsPerOver: 6,
        wicketsPerInnings: 10,
        wideBallAddsRun: true,
        noBallAddsRun: true,
        freeHitAfterNoBall: false,
      };
    }
  }

  private async mapTeam(team: DBTeam): Promise<SharedTeam> {
    const players = await databaseService.getPlayersByTeam(team.id);
    return {
      id: team.id,
      tournamentId: team.tournamentId,
      name: team.name,
      players: players.map((p) => this.mapPlayer(p)),
    };
  }

  private mapPlayer(player: DBPlayer): SharedPlayer {
    return {
      id: player.id,
      teamId: player.teamId,
      fullName: player.name,
      role: this.mapPlayerRole(player.role),
    };
  }

  private mapPlayerRole(role: string): SharedPlayer['role'] {
    switch (role.toLowerCase()) {
      case 'batter':
      case 'batsman':
        return 'batter';
      case 'bowler':
        return 'bowler';
      case 'wicket-keeper':
      case 'wicketkeeper':
      case 'wk':
        return 'wicket-keeper';
      case 'all-rounder':
      case 'allrounder':
      default:
        return 'all-rounder';
    }
  }

  private async mapTournament(tournament: DBTournament, teams: DBTeam[]): Promise<SharedTournament> {
    return {
      id: tournament.id,
      name: tournament.name,
      season: new Date(tournament.createdAt).getFullYear().toString(),
      format: 'CUSTOM',
      rules: this.mapMatchRules(tournament.rulesJson),
      teamIds: teams.map((t) => t.id),
      startsAt: tournament.createdAt.toISOString(),
    };
  }

  private mapBallEvent(event: DBBallEvent, inningsId: string): SharedBallEvent {
    const base = {
      id: event.id,
      inningsId,
      overNumber: event.overNumber,
      ballInOver: event.ballNumber,
      timestamp: event.createdAt.toISOString(),
      batterId: event.strikerId || 'unknown',
      bowlerId: event.bowlerId || 'unknown',
      nonStrikerId: event.nonStrikerId || 'unknown',
    };

    if (event.extrasType) {
      return {
        ...base,
        kind: 'extra',
        extraType: this.mapExtraType(event.extrasType),
        runs: this.mapExtraRuns(event.runs),
        rebowled: event.extrasType === 'wide' || event.extrasType === 'noball',
      };
    }

    if (event.wicketType) {
      return {
        ...base,
        kind: 'wicket',
        wicketType: this.mapWicketType(event.wicketType),
        playerOutId: event.strikerId || 'unknown',
        creditedToBowler: event.wicketType !== 'runout',
        runsCompleted: 0,
      };
    }

    return {
      ...base,
      kind: 'delivery',
      runsOffBat: this.mapRunsOffBat(event.runs),
      isBoundary: event.runs === 4 || event.runs === 6,
    };
  }

  private mapExtraRuns(runs: number): 1 | 2 | 3 | 4 | 5 | 6 | 7 {
    if (runs >= 1 && runs <= 7) {
      return runs as 1 | 2 | 3 | 4 | 5 | 6 | 7;
    }
    return 1;
  }

  private mapRunsOffBat(runs: number): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
    if (runs >= 0 && runs <= 6) {
      return runs as 0 | 1 | 2 | 3 | 4 | 5 | 6;
    }
    return 0;
  }

  private mapExtraType(type: string): 'wide' | 'no-ball' | 'bye' | 'leg-bye' {
    switch (type) {
      case 'wide':
        return 'wide';
      case 'noball':
        return 'no-ball';
      case 'bye':
        return 'bye';
      case 'legbye':
        return 'leg-bye';
      default:
        return 'wide';
    }
  }

  private mapWicketType(
    type: string,
  ):
    | 'bowled'
    | 'caught'
    | 'lbw'
    | 'run-out'
    | 'stumped'
    | 'hit-wicket'
    | 'retired-out'
    | 'obstructing-the-field' {
    switch (type) {
      case 'bowled':
        return 'bowled';
      case 'caught':
        return 'caught';
      case 'lbw':
        return 'lbw';
      case 'runout':
        return 'run-out';
      case 'stumped':
        return 'stumped';
      default:
        return 'bowled';
    }
  }
}

export const exportService = new ExportService();
