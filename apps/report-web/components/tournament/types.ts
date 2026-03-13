export interface MatchItem {
  id: string;
  date: string;
  teamA: string;
  teamB: string;
  scoreSummary: string;
  result: string;
  reportHref: string;
}

export interface LeaderboardRow {
  name: string;
  team?: string;
  value: number;
}

export interface TeamStanding {
  team: string;
  played: number;
  won: number;
  lost: number;
  points: number;
  netRunRate: number;
}

export interface TournamentSummaryData {
  title: string;
  stage: string;
  totalMatches: number;
  teams: number;
  totalRuns: number;
  totalWickets: number;
}

export interface RunsDistributionPoint {
  match: string;
  runs: number;
}

export interface TeamPerformancePoint {
  team: string;
  runs: number;
  wickets: number;
}

export interface PlayerStanding {
  player: string;
  team: string;
  runs: number;
  wickets: number;
  strikeRate: number;
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
