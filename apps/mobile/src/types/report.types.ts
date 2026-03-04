import type { BallEvent } from '@core/database/schema';

export type MatchReport = {
  version: string;
  exportedAt: string;
  tournament: {
    id: string;
    name: string;
  };
  match: {
    id: string;
    teamA: string;
    teamB: string;
    oversPerInnings: number;
  };
  teams: TeamReport[];
  innings: InningsReport[];
};

export type TeamReport = {
  id: string;
  name: string;
  players: PlayerReport[];
};

export type PlayerReport = {
  id: string;
  name: string;
};

export type InningsReport = {
  number: number;
  battingTeamId: string;
  totalRuns: number;
  wickets: number;
  overs: number;
  runRate: number;
  battingScorecard: BattingScore[];
  bowlingScorecard: BowlingScore[];
  ballEvents: BallEvent[];
};

export type BattingScore = {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
};

export type BowlingScore = {
  playerId: string;
  overs: number;
  runs: number;
  wickets: number;
  economy: number;
};
