import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

import { exportService } from './export.service';

export class ShareService {
  async shareMatchReport(matchId: string): Promise<void> {
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      throw new Error('Sharing is not available on this device.');
    }

    const report = await exportService.exportMatchReport(matchId);
    const directory = FileSystem.cacheDirectory;
    if (!directory) {
      throw new Error('Unable to access cache directory.');
    }

    // Sanitize matchId to prevent path traversal
    const safeMatchId = matchId.replace(/[^a-zA-Z0-9-_]/g, '');
    const fileUri = `${directory}match-report-${safeMatchId}.json`;
    await FileSystem.writeAsStringAsync(fileUri, report, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    await Sharing.shareAsync(fileUri, {
      UTI: 'public.json',
      mimeType: 'application/json',
      dialogTitle: 'Share Match Report',
    });
  }
}

export const shareService = new ShareService();
