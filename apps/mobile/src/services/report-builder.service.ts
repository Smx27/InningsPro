import { databaseService } from './db.service';
import { ScorecardCalculatorService } from './scorecard-calculator.service';

import type { BallEvent } from '@core/database/schema';
import type { InningsReport, MatchReport, TeamReport } from '@/types/report.types';

type MatchRules = {
  oversPerInnings: number;
  ballsPerOver: number;
};

const DEFAULT_RULES: MatchRules = {
  oversPerInnings: 20,
  ballsPerOver: 6,
};

export class ReportBuilderService {
  async buildMatchReport(matchId: string): Promise<MatchReport> {
    const match = await databaseService.getMatchById(matchId);
    if (!match) {
      throw new Error(`Match not found for id: ${matchId}`);
    }

    const tournament = await databaseService.getTournamentById(match.tournamentId);
    if (!tournament) {
      throw new Error(`Tournament not found for id: ${match.tournamentId}`);
    }

    const rules = this.parseRules(match.rulesJson);
    const scorecardCalculator = new ScorecardCalculatorService(rules.ballsPerOver);

    const [allTeams, inningsRows, events] = await Promise.all([
      databaseService.getTeamsByTournament(match.tournamentId),
      databaseService.getInningsByMatch(match.id),
      databaseService.getBallEventsByMatch(match.id),
    ]);

    const selectedTeamIds = new Set([match.teamAId, match.teamBId]);
    const selectedTeams = allTeams.filter((team) => selectedTeamIds.has(team.id));
    const teamPlayers = await Promise.all(
      selectedTeams.map(async (team) => ({
        teamId: team.id,
        players: await databaseService.getPlayersByTeam(team.id),
      })),
    );

    const playersByTeamId = new Map(teamPlayers.map((entry) => [entry.teamId, entry.players]));
    const teams: TeamReport[] = selectedTeams.map((team) => ({
      id: team.id,
      name: team.name,
      players: (playersByTeamId.get(team.id) ?? []).map((player) => ({
        id: player.id,
        name: player.name,
      })),
    }));

    const teamsById = new Map(teams.map((team) => [team.id, team]));

    const eventsByInnings = this.groupEventsByInnings(events);
    const inningsReports: InningsReport[] = inningsRows
      .slice()
      .sort((a, b) => a.inningsNumber - b.inningsNumber)
      .map((inningsRow) => {
        const inningsEvents = eventsByInnings.get(inningsRow.inningsNumber) ?? [];
        const totalRuns = inningsEvents.reduce((sum, event) => sum + event.runs, 0);
        const wickets = inningsEvents.reduce((sum, event) => sum + (event.wicketType ? 1 : 0), 0);
        const legalBalls = inningsEvents.reduce((sum, event) => sum + (event.isLegalBall ? 1 : 0), 0);
        const overs = Number((legalBalls / rules.ballsPerOver).toFixed(2));
        const runRate = overs === 0 ? 0 : Number((totalRuns / overs).toFixed(2));

        return {
          number: inningsRow.inningsNumber,
          battingTeamId: inningsRow.battingTeamId,
          totalRuns,
          wickets,
          overs,
          runRate,
          battingScorecard: scorecardCalculator.calculateBattingScorecard(inningsEvents),
          bowlingScorecard: scorecardCalculator.calculateBowlingScorecard(inningsEvents),
          ballEvents: inningsEvents,
        };
      });

    return {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      tournament: {
        id: tournament.id,
        name: tournament.name,
      },
      match: {
        id: match.id,
        teamA: teamsById.get(match.teamAId)?.name ?? match.teamAId,
        teamB: teamsById.get(match.teamBId)?.name ?? match.teamBId,
        oversPerInnings: rules.oversPerInnings,
      },
      teams,
      innings: inningsReports,
    };
  }

  private groupEventsByInnings(events: BallEvent[]): Map<number, BallEvent[]> {
    const grouped = new Map<number, BallEvent[]>();

    for (const event of events) {
      const existing = grouped.get(event.inningsNumber) ?? [];
      existing.push(event);
      grouped.set(event.inningsNumber, existing);
    }

    return grouped;
  }

  private parseRules(rulesJson: string): MatchRules {
    try {
      const parsed = JSON.parse(rulesJson) as Partial<MatchRules>;

      return {
        oversPerInnings: parsed.oversPerInnings ?? DEFAULT_RULES.oversPerInnings,
        ballsPerOver: parsed.ballsPerOver ?? DEFAULT_RULES.ballsPerOver,
      };
    } catch {
      return DEFAULT_RULES;
    }
  }
}

export const reportBuilderService = new ReportBuilderService();
