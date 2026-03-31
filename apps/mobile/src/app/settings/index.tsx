import { desc } from 'drizzle-orm';
import * as Application from 'expo-application';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { useCallback, useMemo } from 'react';
import { Alert, Linking, ScrollView, Share, Text, View } from 'react-native';

import { SettingsItem, SettingsSection } from '@/components';
import { getDatabase } from '@core/database';
import { matches, tournaments } from '@core/database/schema';
import { backupService } from '@services/backup.service';
import { reportBuilderService } from '@services/report-builder.service';

const LINKS = {
  privacy: 'https://inningspro.app/privacy',
  terms: 'https://inningspro.app/terms',
  supportEmail: 'mailto:support@inningspro.app',
} as const;

const showError = (title: string, error: unknown): void => {
  const message = error instanceof Error ? error.message : 'Something went wrong';
  Alert.alert(title, message);
};

const shareJsonPayload = async (title: string, payload: unknown): Promise<void> => {
  await Share.share({
    title,
    message: JSON.stringify(payload, null, 2),
  });
};

const getLatestTournamentId = async (): Promise<string> => {
  const db = getDatabase();
  const [latestTournament] = await db
    .select({ id: tournaments.id })
    .from(tournaments)
    .orderBy(desc(tournaments.createdAt))
    .limit(1);

  if (!latestTournament) {
    throw new Error('No tournament found to export.');
  }

  return latestTournament.id;
};

const getLastMatchId = async (): Promise<string> => {
  const db = getDatabase();
  const [lastMatch] = await db
    .select({ id: matches.id })
    .from(matches)
    .orderBy(desc(matches.createdAt))
    .limit(1);

  if (!lastMatch) {
    throw new Error('No match found to export report.');
  }

  return lastMatch.id;
};

export default function SettingsScreen() {
  const appVersion = useMemo(
    () => Application.nativeApplicationVersion ?? Application.applicationName ?? 'Unknown',
    [],
  );

  const openExternalLink = useCallback(async (url: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        throw new Error(`Cannot open URL: ${url}`);
      }

      await Linking.openURL(url);
    } catch (error) {
      showError('Unable to open link', error);
    }
  }, []);

  const handleTournamentBackupExport = useCallback(async () => {
    try {
      const tournamentId = await getLatestTournamentId();
      const backup = await backupService.exportTournament(tournamentId);
      await shareJsonPayload('Innings Pro Tournament Backup', backup);
    } catch (error) {
      showError('Backup export failed', error);
    }
  }, []);

  const handleBackupImport = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        return;
      }

      const fileUri = result.assets[0]?.uri;
      if (!fileUri) {
        throw new Error('No file selected.');
      }

      const json = await FileSystem.readAsStringAsync(fileUri);
      await backupService.importBackup(json);
      Alert.alert('Import complete', 'Backup imported successfully.');
    } catch (error) {
      showError('Backup import failed', error);
    }
  }, []);

  const handleReportExport = useCallback(async () => {
    try {
      const matchId = await getLastMatchId();
      const report = await reportBuilderService.buildMatchReport(matchId);
      await shareJsonPayload('Innings Pro Match Report', report);
    } catch (error) {
      showError('Report export failed', error);
    }
  }, []);

  return (
    <ScrollView
      className="flex-1 bg-zinc-50 dark:bg-black"
      contentContainerClassName="gap-4 p-4 pb-12"
    >
      <View className="gap-1 px-1">
        <Text className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Settings</Text>
        <Text className="text-sm text-zinc-500 dark:text-zinc-400">
          Manage backups, reports, legal and support options.
        </Text>
      </View>

      <SettingsSection title="Data">
        <SettingsItem
          title="Export Tournament Backup"
          icon="💾"
          onPress={handleTournamentBackupExport}
        />
        <View className="h-px bg-zinc-200 dark:bg-zinc-800" />
        <SettingsItem title="Import Backup" icon="📥" onPress={handleBackupImport} />
      </SettingsSection>

      <SettingsSection title="Reports">
        <SettingsItem title="Export Last Match Report" icon="📄" onPress={handleReportExport} />
      </SettingsSection>

      <SettingsSection title="Legal">
        <SettingsItem
          title="Privacy Policy"
          icon="🔒"
          onPress={() => void openExternalLink(LINKS.privacy)}
        />
        <View className="h-px bg-zinc-200 dark:bg-zinc-800" />
        <SettingsItem
          title="Terms of Service"
          icon="📜"
          onPress={() => void openExternalLink(LINKS.terms)}
        />
      </SettingsSection>

      <SettingsSection title="Support">
        <SettingsItem
          title="Contact Support"
          icon="✉️"
          onPress={() => void openExternalLink(LINKS.supportEmail)}
        />
      </SettingsSection>

      <SettingsSection title="About">
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-base font-medium text-zinc-900 dark:text-zinc-100">
            App Version
          </Text>
          <Text className="text-sm text-zinc-500 dark:text-zinc-400">{appVersion}</Text>
        </View>
      </SettingsSection>
    </ScrollView>
  );
}
