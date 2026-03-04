import { BowlingScore, PlayerReport } from '../../types/report';

interface Props {
  scorecard: BowlingScore[];
  players: PlayerReport[];
}

export function BowlingScorecard({ scorecard, players }: Props) {
  const getPlayerName = (id: string) => players.find(p => p.id === id)?.name || id;

  return (
    <div className="w-full overflow-x-auto rounded-xl border bg-card mb-8 shadow-sm">
      <div className="p-4 border-b bg-muted/40 font-bold">Bowling</div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-muted/20 text-muted-foreground border-b">
          <tr>
            <th className="px-6 py-3 font-medium">Bowler</th>
            <th className="px-6 py-3 font-medium text-right">O</th>
            <th className="px-6 py-3 font-medium text-right">M</th>
            <th className="px-6 py-3 font-medium text-right">R</th>
            <th className="px-6 py-3 font-medium text-right">W</th>
            <th className="px-6 py-3 font-medium text-right">Econ</th>
          </tr>
        </thead>
        <tbody>
          {scorecard.map((score, i) => (
            <tr key={score.playerId} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
              <td className="px-6 py-4 font-medium text-green-700 dark:text-green-500">{getPlayerName(score.playerId)}</td>
              <td className="px-6 py-4 text-right">{score.overs}</td>
              <td className="px-6 py-4 text-right">{score.maidens}</td>
              <td className="px-6 py-4 text-right">{score.runs}</td>
              <td className="px-6 py-4 text-right font-bold">{score.wickets}</td>
              <td className="px-6 py-4 text-right">{score.economy.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
