import { z } from 'zod';

import type { MatchReport } from '../../types/report.types';

export type MatchReportParseIssue = {
  path: string;
  message: string;
};

export class MatchReportParseError extends Error {
  readonly issues: MatchReportParseIssue[];

  constructor(message: string, issues: MatchReportParseIssue[] = []) {
    super(message);
    this.name = 'MatchReportParseError';
    this.issues = issues;
  }
}

export const isMatchReportParseError = (error: unknown): error is MatchReportParseError => {
  return error instanceof MatchReportParseError;
};

const playerSchema = z.object({
  id: z.string().min(1, 'Player id is required'),
  name: z.string().min(1, 'Player name is required'),
  role: z.string().min(1, 'Player role cannot be empty').optional(),
});

const teamSchema = z.object({
  id: z.string().min(1, 'Team id is required'),
  name: z.string().min(1, 'Team name is required'),
  players: z.array(playerSchema),
});

const battingScoreSchema = z.object({
  playerId: z.string().min(1, 'Batter playerId is required'),
  runs: z.number().min(0),
  balls: z.number().min(0),
  fours: z.number().min(0),
  sixes: z.number().min(0),
  strikeRate: z.number().min(0),
  isOut: z.boolean(),
  dismissal: z.string().min(1).optional(),
});

const bowlingScoreSchema = z.object({
  playerId: z.string().min(1, 'Bowler playerId is required'),
  overs: z.number().min(0),
  runs: z.number().min(0),
  wickets: z.number().min(0),
  economy: z.number().min(0),
  maidens: z.number().min(0),
});

const ballEventSchema = z.object({
  over: z.number().int().min(0),
  ball: z.number().int().min(1),
  runs: z.number().min(0),
  isWicket: z.boolean(),
  isFour: z.boolean(),
  isSix: z.boolean(),
  extras: z.number().min(0).optional().default(0),
  extraType: z.string().min(1).optional(),
  bowlerId: z.string().min(1, 'Bowler id is required'),
  batsmanId: z.string().min(1, 'Batsman id is required'),
});

const inningsSchema = z.object({
  teamId: z.string().min(1, 'Innings teamId is required'),
  totalRuns: z.number().min(0),
  totalWickets: z.number().min(0),
  totalOvers: z.number().min(0),
  runRate: z.number().min(0),
  battingScorecard: z.array(battingScoreSchema),
  bowlingScorecard: z.array(bowlingScoreSchema),
  ballEvents: z.array(ballEventSchema),
});

const reportSchema = z.object({
  id: z.string().min(1, 'Match id is required'),
  name: z.string().min(1).optional(),
  date: z
    .preprocess((value: unknown) => {
      if (typeof value !== 'string') return undefined;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : undefined;
    }, z.string().min(1).optional())
    .optional(),
  overs: z.number().min(0),
  teamA: teamSchema,
  teamB: teamSchema,
  innings: z.array(inningsSchema).min(1, 'At least one innings entry is required'),
});

function mapZodIssues(error: z.ZodError): MatchReportParseIssue[] {
  return error.issues.map((issue: z.ZodIssue) => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
}

function toMatchReport(data: z.infer<typeof reportSchema>): MatchReport {
  return {
    id: data.id,
    ...(data.name ? { name: data.name } : {}),
    ...(data.date ? { date: data.date } : {}),
    overs: data.overs,
    teamA: {
      id: data.teamA.id,
      name: data.teamA.name,
      players: data.teamA.players.map((player) => ({
        id: player.id,
        name: player.name,
        ...(player.role ? { role: player.role } : {}),
      })),
    },
    teamB: {
      id: data.teamB.id,
      name: data.teamB.name,
      players: data.teamB.players.map((player) => ({
        id: player.id,
        name: player.name,
        ...(player.role ? { role: player.role } : {}),
      })),
    },
    innings: data.innings.map((innings) => ({
      teamId: innings.teamId,
      totalRuns: innings.totalRuns,
      totalWickets: innings.totalWickets,
      totalOvers: innings.totalOvers,
      runRate: innings.runRate,
      battingScorecard: innings.battingScorecard.map((row) => ({
        playerId: row.playerId,
        runs: row.runs,
        balls: row.balls,
        fours: row.fours,
        sixes: row.sixes,
        strikeRate: row.strikeRate,
        isOut: row.isOut,
        ...(row.dismissal ? { dismissal: row.dismissal } : {}),
      })),
      bowlingScorecard: innings.bowlingScorecard,
      ballEvents: innings.ballEvents.map((event) => ({
        over: event.over,
        ball: event.ball,
        runs: event.runs,
        isWicket: event.isWicket,
        isFour: event.isFour,
        isSix: event.isSix,
        extras: event.extras,
        ...(event.extraType ? { extraType: event.extraType } : {}),
        bowlerId: event.bowlerId,
        batsmanId: event.batsmanId,
      })),
    })),
  };
}

export function parseMatchReport(jsonString: string): MatchReport {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(jsonString) as unknown;
  } catch {
    throw new MatchReportParseError('We could not read that file as valid JSON.');
  }

  return parseMatchReportData(parsedJson);
}

export function parseMatchReportData(parsedJson: unknown): MatchReport {
  const result = reportSchema.safeParse(parsedJson);

  if (!result.success) {
    throw new MatchReportParseError(
      'The uploaded report is missing required fields or has invalid values.',
      mapZodIssues(result.error),
    );
  }

  return toMatchReport(result.data);
}
