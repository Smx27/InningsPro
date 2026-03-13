import { z } from 'zod';

import { MatchReportParseError, parseMatchReportData } from './parseMatchReport';
import { computeTeamLeaderboard, computeTopRunScorers } from '../analytics/tournamentAnalytics';

import type { TournamentReport } from '../../types/tournament';

export type TournamentReportParseIssue = {
  path: string;
  message: string;
};

export class TournamentReportParseError extends Error {
  readonly issues: TournamentReportParseIssue[];

  constructor(message: string, issues: TournamentReportParseIssue[] = []) {
    super(message);
    this.name = 'TournamentReportParseError';
    this.issues = issues;
  }
}

export const isTournamentReportParseError = (error: unknown): error is TournamentReportParseError => {
  return error instanceof TournamentReportParseError;
};

const tournamentShapeSchema = z
  .object({
    tournamentId: z.string().min(1).optional(),
    tournamentName: z.string().min(1).optional(),
    tournament: z
      .object({
        id: z.string().min(1),
        name: z.string().min(1)
      })
      .optional(),
    matches: z.array(z.unknown()).min(1, 'At least one match is required')
  })
  .superRefine((value, ctx) => {
    const id = value.tournamentId ?? value.tournament?.id;
    const name = value.tournamentName ?? value.tournament?.name;

    if (!id) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['tournamentId'], message: 'Tournament id is required' });
    }

    if (!name) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['tournamentName'], message: 'Tournament name is required' });
    }
  });

function mapZodIssues(error: z.ZodError): TournamentReportParseIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join('.'),
    message: issue.message
  }));
}

function ballsToOvers(balls: number): number {
  return Number((balls / 6).toFixed(2));
}

export function parseTournamentReport(jsonString: string): TournamentReport {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(jsonString) as unknown;
  } catch {
    throw new TournamentReportParseError('We could not read that file as valid JSON.');
  }

  return parseTournamentReportData(parsedJson);
}

export function parseTournamentReportData(parsedJson: unknown): TournamentReport {
  const baseResult = tournamentShapeSchema.safeParse(parsedJson);

  if (!baseResult.success) {
    throw new TournamentReportParseError(
      'The uploaded tournament report is missing required fields or has invalid values.',
      mapZodIssues(baseResult.error)
    );
  }

  const parsedMatches = baseResult.data.matches.map((match, index) => {
    try {
      return parseMatchReportData(match);
    } catch (error) {
      if (error instanceof MatchReportParseError) {
        throw new TournamentReportParseError(
          `Match ${index + 1} in the tournament payload is invalid.`,
          error.issues.map((issue) => ({ path: `matches.${index}.${issue.path}`, message: issue.message }))
        );
      }

      throw error;
    }
  });

  const teamLeaderboard = computeTeamLeaderboard(parsedMatches);
  const topRunScorers = computeTopRunScorers(parsedMatches);

  const totalWicketsByTeam = new Map<string, number>();
  for (const match of parsedMatches) {
    for (const innings of match.innings) {
      const bowlingTeamId = innings.teamId === match.teamA.id ? match.teamB.id : match.teamA.id;
      totalWicketsByTeam.set(bowlingTeamId, (totalWicketsByTeam.get(bowlingTeamId) ?? 0) + innings.totalWickets);
    }
  }

  const teams = teamLeaderboard.map((team) => ({
    teamId: team.teamId,
    teamName: team.teamName,
    matches: team.matches,
    wins: team.wins,
    losses: team.losses,
    runs: team.runsScored,
    balls: team.ballsFaced,
    wickets: totalWicketsByTeam.get(team.teamId) ?? 0,
    overs: ballsToOvers(team.ballsFaced),
    strikeRate: team.ballsFaced > 0 ? (team.runsScored / team.ballsFaced) * 100 : 0,
    economy: team.ballsBowled > 0 ? (team.runsConceded / team.ballsBowled) * 6 : 0,
    totals: {
      runs: team.runsScored,
      balls: team.ballsFaced,
      wickets: totalWicketsByTeam.get(team.teamId) ?? 0,
      overs: ballsToOvers(team.ballsFaced)
    }
  }));

  const players = topRunScorers.map((player) => ({
    playerId: player.playerId,
    playerName: player.playerName,
    teamId: player.teamId,
    teamName: player.teamName,
    matches: player.matches,
    runs: player.runs,
    balls: player.ballsFaced,
    wickets: player.wickets,
    overs: ballsToOvers(player.ballsBowled),
    strikeRate: player.ballsFaced > 0 ? (player.runs / player.ballsFaced) * 100 : 0,
    economy: player.ballsBowled > 0 ? (player.runsConceded / player.ballsBowled) * 6 : 0
  }));

  return {
    tournamentId: baseResult.data.tournamentId ?? baseResult.data.tournament!.id,
    tournamentName: baseResult.data.tournamentName ?? baseResult.data.tournament!.name,
    matches: parsedMatches,
    teams,
    players,
    totals: {
      matches: parsedMatches.length,
      wins: teams.reduce((acc, team) => acc + team.wins, 0),
      losses: teams.reduce((acc, team) => acc + team.losses, 0),
      runs: teams.reduce((acc, team) => acc + team.runs, 0),
      balls: teams.reduce((acc, team) => acc + team.balls, 0),
      wickets: teams.reduce((acc, team) => acc + team.wickets, 0),
      overs: teams.reduce((acc, team) => acc + team.overs, 0)
    }
  };
}
