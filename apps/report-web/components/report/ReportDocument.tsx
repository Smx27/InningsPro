
import { InningsSection } from './InningsSection';
import { MatchHeader } from './MatchHeader';

import type { MatchReport } from '../../types/report';

export function ReportDocument({ report }: { report: MatchReport }) {
  return (
    <div className="bg-background print:bg-white p-4 md:p-8 rounded-xl">
      <MatchHeader report={report} />

      {report.innings.map((inning, idx) => (
        <InningsSection key={`${inning.teamId}-${idx}`} inning={inning} report={report} inningNumber={idx + 1} />
      ))}
    </div>
  );
}
