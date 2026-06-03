import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { shareService } from '../share.service';
import { exportService } from '../export.service';

vi.mock('expo-file-system/legacy', () => ({
  cacheDirectory: 'cache://',
  writeAsStringAsync: vi.fn(),
  EncodingType: { UTF8: 'utf8' },
}));

vi.mock('expo-sharing', () => ({
  isAvailableAsync: vi.fn(),
  shareAsync: vi.fn(),
}));

vi.mock('../export.service', () => ({
  exportService: {
    exportMatchReport: vi.fn(),
  },
}));

describe('ShareService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    (Sharing.isAvailableAsync as any).mockResolvedValue(true);
    (exportService.exportMatchReport as any).mockResolvedValue('{"report": "data"}');
  });

  it('should share match report with sanitized filename', async () => {
    const matchId = 'm1-test';
    await shareService.shareMatchReport(matchId);

    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      'cache://match-report-m1-test.json',
      '{"report": "data"}',
      expect.any(Object)
    );
    expect(Sharing.shareAsync).toHaveBeenCalledWith('cache://match-report-m1-test.json', expect.any(Object));
  });

  it('should sanitize path traversal sequences in matchId', async () => {
    const maliciousMatchId = '../../../etc/passwd';
    await shareService.shareMatchReport(maliciousMatchId);

    // Should remove ../ and /
    expect(FileSystem.writeAsStringAsync).toHaveBeenCalledWith(
      'cache://match-report-etcpasswd.json',
      '{"report": "data"}',
      expect.any(Object)
    );
    expect(Sharing.shareAsync).toHaveBeenCalledWith('cache://match-report-etcpasswd.json', expect.any(Object));
  });

  it('should throw error if sharing is not available', async () => {
    (Sharing.isAvailableAsync as any).mockResolvedValue(false);
    await expect(shareService.shareMatchReport('m1')).rejects.toThrow('Sharing is not available on this device.');
  });
});
