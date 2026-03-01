import { relations } from 'drizzle-orm';

import { ballEvents, innings, matches, players, teams, tournaments } from './schema';

export const tournamentsRelations = relations(tournaments, ({ many }) => ({
  teams: many(teams),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tournament: one(tournaments, {
    fields: [teams.tournamentId],
    references: [tournaments.id],
  }),
  players: many(players),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.id],
  }),
}));

export const matchesRelations = relations(matches, ({ many }) => ({
  innings: many(innings),
  ballEvents: many(ballEvents),
}));

export const inningsRelations = relations(innings, ({ one }) => ({
  match: one(matches, {
    fields: [innings.matchId],
    references: [matches.id],
  }),
}));

export const ballEventsRelations = relations(ballEvents, ({ one }) => ({
  match: one(matches, {
    fields: [ballEvents.matchId],
    references: [matches.id],
  }),
  striker: one(players, {
    fields: [ballEvents.strikerId],
    references: [players.id],
  }),
  nonStriker: one(players, {
    fields: [ballEvents.nonStrikerId],
    references: [players.id],
  }),
  bowler: one(players, {
    fields: [ballEvents.bowlerId],
    references: [players.id],
  }),
}));
