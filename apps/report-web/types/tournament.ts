import type { MatchReport as BaseMatchReport, PlayerReport, TeamReport } from './report.types';

/**
 * Re-export base report shapes so tournament consumers can depend on a single module
 * without introducing duplicate, incompatible type definitions.
 */
export type MatchReport = BaseMatchReport;
export type TournamentMatchReport = BaseMatchReport;
export type { PlayerReport, TeamReport };

export interface TeamTotals {
  runs: number;
  balls: number;
  wickets: number;
  overs: number;
}

export interface PlayerAggregate {
  playerId: string;
  playerName: string;
  teamId: string;
  teamName: string;
  matches: number;
  runs: number;
  balls: number;
  wickets: number;
  overs: number;
  strikeRate: number;
  economy: number;
}

export interface TeamAggregate {
  teamId: string;
  teamName: string;
  matches: number;
  wins: number;
  losses: number;
  runs: number;
  balls: number;
  wickets: number;
  overs: number;
  strikeRate: number;
  economy: number;
  totals: TeamTotals;
}

export interface TournamentReport {
  tournamentId: string;
  tournamentName: string;
  matches: MatchReport[];
  teams: TeamAggregate[];
  players: PlayerAggregate[];
  totals: {
    matches: number;
    wins: number;
    losses: number;
    runs: number;
    balls: number;
    wickets: number;
    overs: number;
  };
}
