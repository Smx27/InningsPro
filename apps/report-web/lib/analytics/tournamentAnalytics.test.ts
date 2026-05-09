import assert from 'node:assert';
import { test } from 'node:test';
import {
  computeTopRunScorers,
  computeTopWicketTakers,
  aggregatePlayers,
  computeTeamLeaderboard,
} from './tournamentAnalytics';
import type { MatchReport } from '../../types/report.types';

function createDummyMatch(id: string): MatchReport {
  return {
    id,
    overs: 20,
    teamA: {
      id: 'teamA',
      name: 'Team A',
      players: [{ id: 'p1', name: 'Player 1' }],
    },
    teamB: {
      id: 'teamB',
      name: 'Team B',
      players: [{ id: 'p2', name: 'Player 2' }],
    },
    innings: [
      {
        teamId: 'teamA',
        totalRuns: 100,
        totalWickets: 1,
        totalOvers: 20,
        runRate: 5,
        battingScorecard: [{
          playerId: 'p1',
          runs: 50,
          balls: 30,
          fours: 4,
          sixes: 1,
          strikeRate: 166.67,
          isOut: false,
        }],
        bowlingScorecard: [{
          playerId: 'p2',
          overs: 4,
          runs: 20,
          wickets: 0,
          economy: 5,
          maidens: 0,
        }],
        ballEvents: [],
      }
    ],
  };
}

test('memoization works and returns copies', () => {
  const matches: MatchReport[] = [createDummyMatch('m1')];

  const agg1 = aggregatePlayers(matches);
  const agg2 = aggregatePlayers(matches);

  assert.notStrictEqual(agg1, agg2, 'Should return different array references');
  assert.deepStrictEqual(agg1, agg2, 'Should have same content');

  const leaderboard1 = computeTeamLeaderboard(matches);
  const leaderboard2 = computeTeamLeaderboard(matches);

  assert.notStrictEqual(leaderboard1, leaderboard2, 'Should return different array references');
  assert.deepStrictEqual(leaderboard1, leaderboard2, 'Should have same content');
});

test('sorting one result does not affect subsequent calls', () => {
  const matches: MatchReport[] = [
    createDummyMatch('m1'),
    {
        ...createDummyMatch('m2'),
        innings: [
            {
                ...createDummyMatch('m2').innings[0],
                battingScorecard: [{
                    playerId: 'p1',
                    runs: 100,
                    balls: 30,
                    fours: 4,
                    sixes: 1,
                    strikeRate: 166.67,
                    isOut: false,
                }]
            }
        ]
    }
  ];

  const topScorers = computeTopRunScorers(matches);
  const originalFirstId = topScorers[0].playerId;

  // Mutate the returned array by reversing it
  topScorers.reverse();

  const topScorersAgain = computeTopRunScorers(matches);
  assert.strictEqual(topScorersAgain[0].playerId, originalFirstId, 'Subsequent call should return correctly sorted data');
});
