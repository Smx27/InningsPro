import { MatchReport } from '../../types/report';

export function parseMatchReport(jsonString: string): MatchReport {
  try {
    const data = JSON.parse(jsonString);

    // Basic validation to ensure required fields exist
    if (!data.id || !data.teamA || !data.teamB || !data.innings || !Array.isArray(data.innings)) {
      throw new Error('Invalid Match Report format');
    }

    return data as MatchReport;
  } catch (error: any) {
    throw new Error(`Failed to parse match report: ${error.message}`);
  }
}
