export interface MatchReport {
  id: string;
  name?: string;
  date?: string;
  overs: number;
  teamA: TeamReport;
  teamB: TeamReport;
  innings: InningsReport[];
}

export interface TeamReport {
  id: string;
  name: string;
  players: PlayerReport[];
}

export interface PlayerReport {
  id: string;
  name: string;
  role?: string;
}

export interface InningsReport {
  teamId: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
  runRate: number;
  battingScorecard: BattingScore[];
  bowlingScorecard: BowlingScore[];
  ballEvents: BallEvent[];
}

export interface BattingScore {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: string;
}

export interface BowlingScore {
  playerId: string;
  overs: number;
  runs: number;
  wickets: number;
  economy: number;
  maidens: number;
}

export interface BallEvent {
  over: number;
  ball: number;
  runs: number;
  isWicket: boolean;
  isFour: boolean;
  isSix: boolean;
  extras?: number;
  extraType?: string;
  bowlerId: string;
  batsmanId: string;
}
