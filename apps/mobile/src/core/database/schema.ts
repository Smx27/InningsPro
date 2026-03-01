import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const matches = sqliteTable('matches', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  teamA: text('team_a').notNull(),
  teamB: text('team_b').notNull(),
  overs: integer('overs').notNull(),
  status: text('status').notNull().default('scheduled')
});

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
