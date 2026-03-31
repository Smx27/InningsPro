import assert from 'node:assert';
import { test } from 'node:test';

import { parseTournamentExport, safeParseTournamentExport } from './validators';

const validTournamentPayload = {
  schemaVersion: '1.0.0',
  exportedAt: new Date().toISOString(),
  tournament: {
    id: 'tourney_1',
    name: 'T20 World Cup',
    season: '2024',
    format: 'T20',
    rules: {
      maxOversPerInnings: 20,
      ballsPerOver: 6,
      wicketsPerInnings: 10,
      powerplayOvers: 6,
      wideBallAddsRun: true,
      noBallAddsRun: true,
      freeHitAfterNoBall: true,
    },
    teamIds: ['team_1', 'team_2'],
    startsAt: new Date().toISOString(),
  },
  teams: [
    {
      id: 'team_1',
      tournamentId: 'tourney_1',
      name: 'India',
      players: [
        {
          id: 'player_1',
          teamId: 'team_1',
          fullName: 'Virat Kohli',
          role: 'batter',
        },
      ],
    },
    {
      id: 'team_2',
      tournamentId: 'tourney_1',
      name: 'Australia',
      players: [
        {
          id: 'player_2',
          teamId: 'team_2',
          fullName: 'Pat Cummins',
          role: 'bowler',
        },
      ],
    },
  ],
  matches: [
    {
      id: 'match_1',
      tournamentId: 'tourney_1',
      homeTeamId: 'team_1',
      awayTeamId: 'team_2',
      startsAt: new Date().toISOString(),
      rules: {
        maxOversPerInnings: 20,
        ballsPerOver: 6,
        wicketsPerInnings: 10,
        wideBallAddsRun: true,
        noBallAddsRun: true,
        freeHitAfterNoBall: true,
      },
      innings: [],
      status: 'scheduled',
    },
  ],
};

test('parseTournamentExport successfully parses a valid payload', () => {
  const result = parseTournamentExport(validTournamentPayload);
  assert.strictEqual(result.schemaVersion, '1.0.0');
  assert.strictEqual(result.tournament.id, 'tourney_1');
  assert.strictEqual(result.teams.length, 2);
  assert.strictEqual(result.matches.length, 1);
});

test('parseTournamentExport throws ZodError when parsing an invalid payload', () => {
  const invalidPayload = { ...validTournamentPayload, schemaVersion: '1.0.1' }; // Invalid version

  assert.throws(
    () => {
      parseTournamentExport(invalidPayload);
    },
    (err: Error) => {
      return err.name === 'ZodError';
    },
  );
});

test('safeParseTournamentExport returns success: true for a valid payload', () => {
  const result = safeParseTournamentExport(validTournamentPayload);
  assert.strictEqual(result.success, true);
  if (result.success) {
    assert.strictEqual(result.data.schemaVersion, '1.0.0');
    assert.strictEqual(result.data.tournament.id, 'tourney_1');
  }
});

test('safeParseTournamentExport returns success: false for an invalid payload', () => {
  const invalidPayload = { ...validTournamentPayload, schemaVersion: '1.0.1' };
  const result = safeParseTournamentExport(invalidPayload);
  assert.strictEqual(result.success, false);
  if (!result.success) {
    assert.strictEqual(result.error.name, 'ZodError');
  }
});

test('safeParseTournamentExport fails on missing required fields', () => {
  const payloadMissingMatches = { ...validTournamentPayload };
  // @ts-expect-error - testing missing required field
  delete payloadMissingMatches.matches;

  const result = safeParseTournamentExport(payloadMissingMatches);
  assert.strictEqual(result.success, false);
});
