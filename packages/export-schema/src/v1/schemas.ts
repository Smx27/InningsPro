import { z } from 'zod';

const idSchema = z.string().min(1);
const isoDateTimeSchema = z.string().datetime({ offset: true });

export const matchRulesSchema = z.object({
  maxOversPerInnings: z.number().int().positive(),
  ballsPerOver: z.number().int().positive(),
  wicketsPerInnings: z.number().int().positive(),
  powerplayOvers: z.number().int().positive().optional(),
  wideBallAddsRun: z.boolean(),
  noBallAddsRun: z.boolean(),
  freeHitAfterNoBall: z.boolean()
});

export const playerSchema = z.object({
  id: idSchema,
  teamId: idSchema,
  fullName: z.string().min(1),
  shortName: z.string().min(1).optional(),
  jerseyNumber: z.number().int().positive().optional(),
  role: z.enum(['batter', 'bowler', 'all-rounder', 'wicket-keeper']),
  battingStyle: z.enum(['right-hand', 'left-hand']).optional(),
  bowlingStyle: z
    .enum([
      'right-arm-fast',
      'right-arm-medium',
      'right-arm-spin',
      'left-arm-fast',
      'left-arm-medium',
      'left-arm-spin'
    ])
    .optional(),
  isCaptain: z.boolean().optional(),
  isWicketKeeper: z.boolean().optional()
});

export const teamSchema = z.object({
  id: idSchema,
  tournamentId: idSchema,
  name: z.string().min(1),
  shortName: z.string().min(1).optional(),
  players: z.array(playerSchema),
  coachName: z.string().min(1).optional(),
  homeGround: z.string().min(1).optional()
});

export const tournamentSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  season: z.string().min(1),
  format: z.enum(['T20', 'ODI', 'TEST', 'CUSTOM']),
  rules: matchRulesSchema,
  teamIds: z.array(idSchema),
  startsAt: isoDateTimeSchema,
  endsAt: isoDateTimeSchema.optional()
});

const ballEventBaseSchema = z.object({
  id: idSchema,
  inningsId: idSchema,
  overNumber: z.number().int().nonnegative(),
  ballInOver: z.number().int().positive(),
  timestamp: isoDateTimeSchema,
  batterId: idSchema,
  bowlerId: idSchema,
  nonStrikerId: idSchema,
  comment: z.string().optional()
});

const deliveryBallEventSchema = ballEventBaseSchema.extend({
  kind: z.literal('delivery'),
  runsOffBat: z.union([
    z.literal(0),
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6)
  ]),
  isBoundary: z.boolean()
});

const wicketBallEventSchema = ballEventBaseSchema.extend({
  kind: z.literal('wicket'),
  wicketType: z.enum([
    'bowled',
    'caught',
    'lbw',
    'run-out',
    'stumped',
    'hit-wicket',
    'retired-out',
    'obstructing-the-field'
  ]),
  playerOutId: idSchema,
  creditedToBowler: z.boolean(),
  fielderIds: z.array(idSchema).optional(),
  runsCompleted: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)])
});

const extraBallEventSchema = ballEventBaseSchema.extend({
  kind: z.literal('extra'),
  extraType: z.enum(['wide', 'no-ball', 'bye', 'leg-bye']),
  runs: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
    z.literal(6),
    z.literal(7)
  ]),
  rebowled: z.boolean()
});

const penaltyBallEventSchema = ballEventBaseSchema.extend({
  kind: z.literal('penalty'),
  awardedTo: z.enum(['batting', 'bowling']),
  runs: z.literal(5),
  reason: z.enum(['slow-over-rate', 'ball-tampering', 'unfair-play', 'time-wasting', 'disciplinary'])
});

const reviewBallEventSchema = ballEventBaseSchema.extend({
  kind: z.literal('review'),
  reviewType: z.enum(['DRS', 'umpire']),
  requestedBy: z.enum(['batting', 'bowling', 'umpire']),
  decision: z.enum(['upheld', 'overturned', 'inconclusive']),
  originalDecision: z.enum(['out', 'not-out', 'wide', 'no-ball']).optional(),
  finalDecision: z.enum(['out', 'not-out', 'wide', 'no-ball']).optional()
});

export const ballEventSchema = z.discriminatedUnion('kind', [
  deliveryBallEventSchema,
  wicketBallEventSchema,
  extraBallEventSchema,
  penaltyBallEventSchema,
  reviewBallEventSchema
]);

export const inningsSchema = z.object({
  id: idSchema,
  matchId: idSchema,
  battingTeamId: idSchema,
  bowlingTeamId: idSchema,
  sequence: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  startsAt: isoDateTimeSchema,
  endsAt: isoDateTimeSchema.optional(),
  declared: z.boolean(),
  targetRuns: z.number().int().nonnegative().optional(),
  events: z.array(ballEventSchema)
});

export const matchSchema = z.object({
  id: idSchema,
  tournamentId: idSchema,
  homeTeamId: idSchema,
  awayTeamId: idSchema,
  venue: z.string().min(1).optional(),
  startsAt: isoDateTimeSchema,
  tossWinnerTeamId: idSchema.optional(),
  tossDecision: z.enum(['bat', 'bowl']).optional(),
  rules: matchRulesSchema,
  innings: z.array(inningsSchema),
  status: z.enum(['scheduled', 'live', 'completed', 'abandoned']),
  winnerTeamId: idSchema.optional()
});

export const schemaVersionV1 = z.literal('1.0.0');

export const matchExportSchemaV1 = z.object({
  schemaVersion: schemaVersionV1,
  exportedAt: isoDateTimeSchema,
  tournament: tournamentSchema,
  teams: z.array(teamSchema),
  match: matchSchema
});

export const tournamentExportSchemaV1 = z.object({
  schemaVersion: schemaVersionV1,
  exportedAt: isoDateTimeSchema,
  tournament: tournamentSchema,
  teams: z.array(teamSchema),
  matches: z.array(matchSchema)
});

export type MatchExportSchemaV1 = z.infer<typeof matchExportSchemaV1>;
export type TournamentExportSchemaV1 = z.infer<typeof tournamentExportSchemaV1>;
