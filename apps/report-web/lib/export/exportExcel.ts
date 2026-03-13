import * as XLSX from 'xlsx';

import { MatchReport, InningsReport } from '../../types/report.types';

export function exportExcel(report: MatchReport) {
  const wb = XLSX.utils.book_new();

  report.innings.forEach((inning, i) => {
    // 1. Batting Scorecard
    const battingWs = XLSX.utils.json_to_sheet(inning.battingScorecard);
    XLSX.utils.book_append_sheet(wb, battingWs, `Innings ${i + 1} - Batting`);

    // 2. Bowling Scorecard
    const bowlingWs = XLSX.utils.json_to_sheet(inning.bowlingScorecard);
    XLSX.utils.book_append_sheet(wb, bowlingWs, `Innings ${i + 1} - Bowling`);

    // 3. Ball Events
    const ballWs = XLSX.utils.json_to_sheet(inning.ballEvents);
    XLSX.utils.book_append_sheet(wb, ballWs, `Innings ${i + 1} - Balls`);
  });

  const fileName = `match-report-${report.id}.xlsx`;
  XLSX.writeFile(wb, fileName);
}
