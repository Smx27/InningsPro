import { BattingScore, PlayerReport } from '../../types/report';

interface Props {
  scorecard: BattingScore[];
  players: PlayerReport[];
}

export function BattingScorecard({ scorecard, players }: Props) {
  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || id;

  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-card mb-8 shadow-sm">
      <div className="p-4 border-b bg-muted/40 font-bold">Batting</div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/20 text-muted-foreground border-b">
          <tr>
            <th className="px-6 py-3 font-medium">Batter</th>
            <th className="px-6 py-3 font-medium"></th>
            <th className="px-6 py-3 font-medium text-right">R</th>
            <th className="px-6 py-3 font-medium text-right">B</th>
            <th className="px-6 py-3 font-medium text-right">4s</th>
            <th className="px-6 py-3 font-medium text-right">6s</th>
            <th className="px-6 py-3 font-medium text-right">SR</th>
          </tr>
        </thead>
        <tbody>
          {scorecard.map((score, i) => (
            <tr key={score.playerId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 font-medium">{getPlayerName(score.playerId)}</td>
              <td className="px-6 py-4 text-muted-foreground italic text-xs max-w-[150px] truncate">
                {score.isOut ? (score.dismissal || 'Out') : 'Not out'}
              </td>
              <td className="px-6 py-4 text-right font-bold">{score.runs}</td>
              <td className="px-6 py-4 text-right">{score.balls}</td>
              <td className="px-6 py-4 text-right">{score.fours}</td>
              <td className="px-6 py-4 text-right">{score.sixes}</td>
              <td className="px-6 py-4 text-right">{score.strikeRate.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
