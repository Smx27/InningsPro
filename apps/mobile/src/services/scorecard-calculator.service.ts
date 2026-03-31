import type { BallEvent } from '@core/database/schema';
import type { BattingScore, BowlingScore } from '@/types/report.types';

type BattingAccumulator = {
  playerId: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
};

type BowlingAccumulator = {
  playerId: string;
  legalBalls: number;
  runs: number;
  wickets: number;
};

export class ScorecardCalculatorService {
  constructor(private readonly ballsPerOver: number) {
    if (ballsPerOver <= 0) {
      throw new Error('ballsPerOver must be greater than 0');
    }
  }

  calculateBattingScorecard(events: BallEvent[]): BattingScore[] {
    const battingMap = new Map<string, BattingAccumulator>();

    for (const event of events) {
      if (!event.strikerId) {
        continue;
      }

      const current = battingMap.get(event.strikerId) ?? {
        playerId: event.strikerId,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
      };

      current.runs += event.runs;
      if (event.isLegalBall) {
        current.balls += 1;
      }
      if (event.runs === 4) {
        current.fours += 1;
      }
      if (event.runs === 6) {
        current.sixes += 1;
      }

      battingMap.set(event.strikerId, current);
    }

    return Array.from(battingMap.values())
      .map(
        (score): BattingScore => ({
          playerId: score.playerId,
          runs: score.runs,
          balls: score.balls,
          fours: score.fours,
          sixes: score.sixes,
          strikeRate: score.balls === 0 ? 0 : Number(((score.runs / score.balls) * 100).toFixed(2)),
        }),
      )
      .sort((a, b) => b.runs - a.runs || a.playerId.localeCompare(b.playerId));
  }

  calculateBowlingScorecard(events: BallEvent[]): BowlingScore[] {
    const bowlingMap = new Map<string, BowlingAccumulator>();

    for (const event of events) {
      if (!event.bowlerId) {
        continue;
      }

      const current = bowlingMap.get(event.bowlerId) ?? {
        playerId: event.bowlerId,
        legalBalls: 0,
        runs: 0,
        wickets: 0,
      };

      if (event.isLegalBall) {
        current.legalBalls += 1;
      }
      current.runs += event.runs;
      if (event.wicketType) {
        current.wickets += 1;
      }

      bowlingMap.set(event.bowlerId, current);
    }

    return Array.from(bowlingMap.values())
      .map((score): BowlingScore => {
        const overs = Number((score.legalBalls / this.ballsPerOver).toFixed(2));
        const economy = overs === 0 ? 0 : Number((score.runs / overs).toFixed(2));

        return {
          playerId: score.playerId,
          overs,
          runs: score.runs,
          wickets: score.wickets,
          economy,
        };
      })
      .sort(
        (a, b) =>
          b.wickets - a.wickets || a.economy - b.economy || a.playerId.localeCompare(b.playerId),
      );
  }
}
