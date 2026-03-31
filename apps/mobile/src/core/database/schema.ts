import { sql } from 'drizzle-orm';
import { index, integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const tournaments = sqliteTable('tournaments', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  rulesJson: text('rules_json').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const teams = sqliteTable('teams', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id')
    .notNull()
    .references(() => tournaments.id),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const players = sqliteTable('players', {
  id: text('id').primaryKey(),
  teamId: text('team_id')
    .notNull()
    .references(() => teams.id),
  name: text('name').notNull(),
  role: text('role').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const matches = sqliteTable('matches', {
  id: text('id').primaryKey(),
  tournamentId: text('tournament_id')
    .notNull()
    .references(() => tournaments.id),
  teamAId: text('team_a_id')
    .notNull()
    .references(() => teams.id),
  teamBId: text('team_b_id')
    .notNull()
    .references(() => teams.id),
  status: text('status').notNull(),
  rulesJson: text('rules_json').notNull(),
  currentInnings: integer('current_innings').notNull().default(1),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const innings = sqliteTable('innings', {
  id: text('id').primaryKey(),
  matchId: text('match_id')
    .notNull()
    .references(() => matches.id),
  inningsNumber: integer('innings_number').notNull(),
  battingTeamId: text('batting_team_id')
    .notNull()
    .references(() => teams.id),
  bowlingTeamId: text('bowling_team_id')
    .notNull()
    .references(() => teams.id),
  totalRuns: integer('total_runs').notNull().default(0),
  totalWickets: integer('total_wickets').notNull().default(0),
  totalOvers: real('total_overs').notNull().default(0),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }),
});

export const ballEvents = sqliteTable(
  'ball_events',
  {
    id: text('id').primaryKey(),
    matchId: text('match_id')
      .notNull()
      .references(() => matches.id),
    inningsNumber: integer('innings_number').notNull(),
    overNumber: integer('over_number').notNull(),
    ballNumber: integer('ball_number').notNull(),
    runs: integer('runs').notNull().default(0),
    isLegalBall: integer('is_legal_ball', { mode: 'boolean' }).notNull(),
    extrasType: text('extras_type'),
    wicketType: text('wicket_type'),
    strikerId: text('striker_id').references(() => players.id),
    nonStrikerId: text('non_striker_id').references(() => players.id),
    bowlerId: text('bowler_id').references(() => players.id),
    commentary: text('commentary'),
    createdAt: integer('created_at', { mode: 'timestamp' })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => ({
    matchIdIdx: index('ball_events_match_id_idx').on(table.matchId),
    inningsNumberIdx: index('ball_events_innings_number_idx').on(table.inningsNumber),
    overBallIdx: index('ball_events_over_ball_idx').on(
      table.matchId,
      table.inningsNumber,
      table.overNumber,
      table.ballNumber,
    ),
    createdAtIdx: index('ball_events_created_at_idx').on(table.createdAt),
  }),
);

export type Tournament = typeof tournaments.$inferSelect;
export type NewTournament = typeof tournaments.$inferInsert;

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;

export type Innings = typeof innings.$inferSelect;
export type NewInnings = typeof innings.$inferInsert;

export type BallEvent = typeof ballEvents.$inferSelect;
export type NewBallEvent = typeof ballEvents.$inferInsert;
