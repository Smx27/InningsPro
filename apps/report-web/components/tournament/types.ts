export interface MatchItem {
  id: string;
  date: string;
  venue: string;
  teamA: string;
  teamB: string;
  result: string;
}

export interface TeamStanding {
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  netRunRate: number;
}

export interface PlayerStanding {
  player: string;
  team: string;
  runs: number;
  wickets: number;
  strikeRate: number;
}

export interface TournamentSummaryData {
  title: string;
  stage: string;
  teams: number;
  matchesCompleted: number;
  totalMatches: number;
  totalRuns: number;
  totalWickets: number;
}

export interface PlayerStatsRow {
  player: string;
  team: string;
  matches: number;
  runs: number;
  average: number;
  strikeRate: number;
  wickets: number;
}

export interface TeamStatsRow {
  team: string;
  matches: number;
  wins: number;
  losses: number;
  runsScored: number;
  runsConceded: number;
  netRunRate: number;
}
