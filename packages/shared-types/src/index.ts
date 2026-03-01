export type Id = string;

export interface MatchRules {
  maxOversPerInnings: number;
  ballsPerOver: number;
  wicketsPerInnings: number;
  powerplayOvers?: number;
  wideBallAddsRun: boolean;
  noBallAddsRun: boolean;
  freeHitAfterNoBall: boolean;
}

export interface Player {
  id: Id;
  teamId: Id;
  fullName: string;
  shortName?: string;
  jerseyNumber?: number;
  role: 'batter' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  battingStyle?: 'right-hand' | 'left-hand';
  bowlingStyle?:
    | 'right-arm-fast'
    | 'right-arm-medium'
    | 'right-arm-spin'
    | 'left-arm-fast'
    | 'left-arm-medium'
    | 'left-arm-spin';
  isCaptain?: boolean;
  isWicketKeeper?: boolean;
}

export interface Team {
  id: Id;
  tournamentId: Id;
  name: string;
  shortName?: string;
  players: Player[];
  coachName?: string;
  homeGround?: string;
}

export interface Tournament {
  id: Id;
  name: string;
  season: string;
  format: 'T20' | 'ODI' | 'TEST' | 'CUSTOM';
  rules: MatchRules;
  teamIds: Id[];
  startsAt: string;
  endsAt?: string;
}

export type BallEvent =
  | DeliveryBallEvent
  | WicketBallEvent
  | ExtraBallEvent
  | PenaltyBallEvent
  | ReviewBallEvent;

export interface BallEventBase {
  id: Id;
  inningsId: Id;
  overNumber: number;
  ballInOver: number;
  timestamp: string;
  batterId: Id;
  bowlerId: Id;
  nonStrikerId: Id;
  comment?: string;
}

export interface DeliveryBallEvent extends BallEventBase {
  kind: 'delivery';
  runsOffBat: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  isBoundary: boolean;
}

export interface WicketBallEvent extends BallEventBase {
  kind: 'wicket';
  wicketType:
    | 'bowled'
    | 'caught'
    | 'lbw'
    | 'run-out'
    | 'stumped'
    | 'hit-wicket'
    | 'retired-out'
    | 'obstructing-the-field';
  playerOutId: Id;
  creditedToBowler: boolean;
  fielderIds?: Id[];
  runsCompleted: 0 | 1 | 2 | 3;
}

export interface ExtraBallEvent extends BallEventBase {
  kind: 'extra';
  extraType: 'wide' | 'no-ball' | 'bye' | 'leg-bye';
  runs: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  rebowled: boolean;
}

export interface PenaltyBallEvent extends BallEventBase {
  kind: 'penalty';
  awardedTo: 'batting' | 'bowling';
  runs: 5;
  reason:
    | 'slow-over-rate'
    | 'ball-tampering'
    | 'unfair-play'
    | 'time-wasting'
    | 'disciplinary';
}

export interface ReviewBallEvent extends BallEventBase {
  kind: 'review';
  reviewType: 'DRS' | 'umpire';
  requestedBy: 'batting' | 'bowling' | 'umpire';
  decision: 'upheld' | 'overturned' | 'inconclusive';
  originalDecision?: 'out' | 'not-out' | 'wide' | 'no-ball';
  finalDecision?: 'out' | 'not-out' | 'wide' | 'no-ball';
}

export interface Innings {
  id: Id;
  matchId: Id;
  battingTeamId: Id;
  bowlingTeamId: Id;
  sequence: 1 | 2 | 3 | 4;
  startsAt: string;
  endsAt?: string;
  declared: boolean;
  targetRuns?: number;
  events: BallEvent[];
}

export interface Match {
  id: Id;
  tournamentId: Id;
  homeTeamId: Id;
  awayTeamId: Id;
  venue?: string;
  startsAt: string;
  tossWinnerTeamId?: Id;
  tossDecision?: 'bat' | 'bowl';
  rules: MatchRules;
  innings: Innings[];
  status: 'scheduled' | 'live' | 'completed' | 'abandoned';
  winnerTeamId?: Id;
}

export interface ExportSchemaV1 {
  schemaVersion: '1.0.0';
  exportedAt: string;
  tournament: Tournament;
  teams: Team[];
  matches: Match[];
}
