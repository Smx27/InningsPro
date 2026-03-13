
import { BallTimeline } from './BallTimeline';
import { BattingScorecard } from './BattingScorecard';
import { BowlingScorecard } from './BowlingScorecard';
import { InningsCharts } from './InningsCharts';
import { ScoreSummary } from './ScoreSummary';

import type { InningsReport, MatchReport } from '../../types/report.types';

interface Props {
  inning: InningsReport;
  report: MatchReport;
  inningNumber: number;
}

export function InningsSection({ inning, report, inningNumber }: Props) {
  const isTeamA = inning.teamId === report.teamA.id;
  const teamName = isTeamA ? report.teamA.name : report.teamB.name;
  const teamPlayers = isTeamA ? report.teamA.players : report.teamB.players;
  const oppPlayers = isTeamA ? report.teamB.players : report.teamA.players;

  return (
    <div className="mb-16 pb-8 border-b last:border-0 last:mb-0 last:pb-0 break-inside-avoid">
      <h2 className="text-2xl font-bold mb-6 text-primary">Innings {inningNumber}: {teamName}</h2>

      <ScoreSummary innings={inning} teamName={teamName} />

      <BattingScorecard scorecard={inning.battingScorecard} players={teamPlayers} />

      <BowlingScorecard scorecard={inning.bowlingScorecard} players={oppPlayers} />

      <BallTimeline balls={inning.ballEvents} />

      <InningsCharts inning={inning} />
    </div>
  );
}
