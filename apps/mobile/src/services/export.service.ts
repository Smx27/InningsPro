import { reportBuilderService } from './report-builder.service';

export class ExportService {
  async exportMatchReport(matchId: string): Promise<string> {
    const report = await reportBuilderService.buildMatchReport(matchId);

    return JSON.stringify(report, null, 2);
  }
}

export const exportService = new ExportService();
