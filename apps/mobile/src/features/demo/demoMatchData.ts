export type DemoTeamDefinition = {
  id: string;
  name: string;
  players: string[];
};

export type DemoBallEventDefinition = {
  runs: number;
  isLegalBall: boolean;
  extrasType?: 'wide' | 'noball' | 'bye' | 'legbye';
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped';
  strikerIndex: number;
  nonStrikerIndex: number;
  bowlerIndex: number;
};

export type DemoMatchSeed = {
  tournamentId: string;
  tournamentName: string;
  teamA: DemoTeamDefinition;
  teamB: DemoTeamDefinition;
  rules: {
    oversPerInnings: number;
    ballsPerOver: number;
    totalInnings: number;
    maxWickets: number;
    allowExtras: boolean;
    wicketStrikeMode: 'auto' | 'manual' | 'always_new_striker';
  };
  innings: {
    battingTeamId: string;
    bowlingTeamId: string;
    events: DemoBallEventDefinition[];
  };
};

export const DEMO_MATCH_SEED: DemoMatchSeed = {
  tournamentId: 'demo-tournament',
  tournamentName: 'Innings Pro Demo Cup',
  teamA: {
    id: 'demo-team-a',
    name: 'Mumbai Meteors',
    players: ['R. Sharma', 'I. Kishan', 'S. Yadav', 'H. Pandya', 'T. Varma', 'T. David'],
  },
  teamB: {
    id: 'demo-team-b',
    name: 'Chennai Chargers',
    players: ['R. Gaikwad', 'D. Conway', 'A. Rahane', 'S. Dube', 'R. Jadeja', 'M. Ali'],
  },
  rules: {
    oversPerInnings: 2,
    ballsPerOver: 6,
    totalInnings: 1,
    maxWickets: 10,
    allowExtras: true,
    wicketStrikeMode: 'auto',
  },
  innings: {
    battingTeamId: 'demo-team-a',
    bowlingTeamId: 'demo-team-b',
    events: [
      { runs: 1, isLegalBall: true, strikerIndex: 0, nonStrikerIndex: 1, bowlerIndex: 0 },
      { runs: 4, isLegalBall: true, strikerIndex: 1, nonStrikerIndex: 0, bowlerIndex: 0 },
      { runs: 0, isLegalBall: true, strikerIndex: 1, nonStrikerIndex: 0, bowlerIndex: 0 },
      { runs: 1, isLegalBall: true, strikerIndex: 1, nonStrikerIndex: 0, bowlerIndex: 0 },
      { runs: 6, isLegalBall: true, strikerIndex: 0, nonStrikerIndex: 1, bowlerIndex: 0 },
      { runs: 2, isLegalBall: true, strikerIndex: 0, nonStrikerIndex: 1, bowlerIndex: 0 },
      { runs: 1, isLegalBall: false, extrasType: 'wide', strikerIndex: 1, nonStrikerIndex: 0, bowlerIndex: 1 },
      { runs: 1, isLegalBall: true, strikerIndex: 1, nonStrikerIndex: 0, bowlerIndex: 1 },
      { runs: 0, isLegalBall: true, wicketType: 'caught', strikerIndex: 0, nonStrikerIndex: 1, bowlerIndex: 1 },
      { runs: 2, isLegalBall: true, strikerIndex: 2, nonStrikerIndex: 1, bowlerIndex: 1 },
      { runs: 3, isLegalBall: true, strikerIndex: 2, nonStrikerIndex: 1, bowlerIndex: 1 },
      { runs: 1, isLegalBall: true, strikerIndex: 1, nonStrikerIndex: 2, bowlerIndex: 1 },
      { runs: 4, isLegalBall: true, strikerIndex: 2, nonStrikerIndex: 1, bowlerIndex: 1 },
    ],
  },
};
