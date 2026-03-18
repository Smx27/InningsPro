import { DEMO_MATCH_SEED } from '@features/demo/demoMatchData';
import { generateId } from '@utils/id';

import { databaseService } from './db.service';

export class DemoMatchService {
  async loadDemoMatch(): Promise<string> {
    const tournament = await databaseService.createTournament({
      id: generateId(DEMO_MATCH_SEED.tournamentId),
      name: `${DEMO_MATCH_SEED.tournamentName} ${new Date().toLocaleTimeString()}`,
      rulesJson: JSON.stringify(DEMO_MATCH_SEED.rules),
    });

    const [teamA, teamB] = await Promise.all([
      databaseService.createTeam({
        id: generateId('demo-team-a'),
        tournamentId: tournament.id,
        name: DEMO_MATCH_SEED.teamA.name,
      }),
      databaseService.createTeam({
        id: generateId('demo-team-b'),
        tournamentId: tournament.id,
        name: DEMO_MATCH_SEED.teamB.name,
      }),
    ]);

    const teamAPlayers = await Promise.all(
      DEMO_MATCH_SEED.teamA.players.map((name, index) =>
        databaseService.createPlayer({
          id: `${teamA.id}-p-${index + 1}`,
          teamId: teamA.id,
          name,
          role: 'batter',
        }),
      ),
    );

    const teamBPlayers = await Promise.all(
      DEMO_MATCH_SEED.teamB.players.map((name, index) =>
        databaseService.createPlayer({
          id: `${teamB.id}-p-${index + 1}`,
          teamId: teamB.id,
          name,
          role: 'bowler',
        }),
      ),
    );

    const match = await databaseService.createMatch({
      id: generateId('demo-match'),
      tournamentId: tournament.id,
      teamAId: teamA.id,
      teamBId: teamB.id,
      status: 'completed',
      rulesJson: JSON.stringify(DEMO_MATCH_SEED.rules),
      currentInnings: 1,
    });

    await databaseService.createInnings({
      id: `inn-${match.id}-1`,
      matchId: match.id,
      inningsNumber: 1,
      battingTeamId: teamA.id,
      bowlingTeamId: teamB.id,
      totalRuns: 0,
      totalWickets: 0,
      totalOvers: 0,
    });

    let legalBalls = 0;
    let overNumber = 0;
    let ballInOver = 0;

    for (const [index, event] of DEMO_MATCH_SEED.innings.events.entries()) {
      if (event.isLegalBall) {
        ballInOver += 1;
      }

      await databaseService.addBallEvent({
        id: `ball-${match.id}-1-${index + 1}`,
        matchId: match.id,
        inningsNumber: 1,
        overNumber,
        ballNumber: event.isLegalBall ? ballInOver : ballInOver + 1,
        runs: event.runs,
        isLegalBall: event.isLegalBall,
        extrasType: event.extrasType,
        wicketType: event.wicketType,
        strikerId: teamAPlayers[event.strikerIndex]?.id ?? null,
        nonStrikerId: teamAPlayers[event.nonStrikerIndex]?.id ?? null,
        bowlerId: teamBPlayers[event.bowlerIndex]?.id ?? null,
        commentary: 'Demo ball event',
      });

      if (event.isLegalBall) {
        legalBalls += 1;
      }

      if (legalBalls > 0 && legalBalls % DEMO_MATCH_SEED.rules.ballsPerOver === 0) {
        overNumber += 1;
        ballInOver = 0;
      }
    }

    return match.id;
  }
}

export const demoMatchService = new DemoMatchService();
