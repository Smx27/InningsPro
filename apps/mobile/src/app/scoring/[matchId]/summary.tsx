import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Share, Text, View } from 'react-native';

import { backupService } from '@services/backup.service';
import { databaseService } from '@services/db.service';
import { exportService } from '@services/export.service';
import { logError, logInfo } from '@services/logger';

type SummaryState = {
  winner: string;
  finalScore: string;
  runRate: string;
};

const DEFAULT_SUMMARY: SummaryState = {
  winner: 'TBD',
  finalScore: '0/0',
  runRate: '0.00',
};

export default function MatchSummaryScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ matchId: string }>();
  const matchId = Array.isArray(params.matchId) ? params.matchId[0] : params.matchId;

  const [summary, setSummary] = useState<SummaryState>(DEFAULT_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!matchId) {
      setIsLoading(false);
      return;
    }

    const loadSummary = async () => {
      try {
        const report = await exportService.exportMatchReport(matchId);
        const parsed = JSON.parse(report) as {
          match: { teamA: string; teamB: string };
          innings: Array<{ battingTeamId: string; totalRuns: number; wickets: number; runRate: number }>;
          teams: Array<{ id: string; name: string }>;
        };

        const innings = parsed.innings.at(-1);
        const teamNameById = new Map(parsed.teams.map((team) => [team.id, team.name]));
        const winner = innings ? teamNameById.get(innings.battingTeamId) ?? parsed.match.teamA : parsed.match.teamA;

        setSummary({
          winner,
          finalScore: innings ? `${innings.totalRuns}/${innings.wickets}` : '0/0',
          runRate: innings ? innings.runRate.toFixed(2) : '0.00',
        });
      } catch (error) {
        logError(error, { operation: 'loadMatchSummary', matchId });
      } finally {
        setIsLoading(false);
      }
    };

    void loadSummary();
  }, [matchId]);

  const canRender = useMemo(() => Boolean(matchId), [matchId]);

  const handleDownloadReport = useCallback(async () => {
    if (!matchId) {
      return;
    }

    const report = await exportService.exportMatchReport(matchId);
    await Share.share({ message: report });
    logInfo('Match report shared', { matchId });
  }, [matchId]);

  const handleExportMatch = useCallback(async () => {
    if (!matchId) {
      return;
    }

    const payload = await backupService.exportMatch(matchId);
    await Share.share({ message: JSON.stringify(payload, null, 2) });
    logInfo('Match backup exported', { matchId });
  }, [matchId]);

  const handleStartNewMatch = useCallback(async () => {
    if (matchId) {
      const match = await databaseService.getMatchById(matchId);
      logInfo('Returning to home after completed match', { matchId, status: match?.status });
    }

    router.replace('/');
  }, [matchId, router]);

  if (!canRender) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100 px-6 dark:bg-black">
        <Text className="text-base text-zinc-700 dark:text-zinc-200">Invalid match</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100 dark:bg-black">
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100 px-4 pb-10 pt-14 dark:bg-black">
      <Text className="text-3xl font-black text-zinc-900 dark:text-zinc-100">Match Summary</Text>

      <View className="mt-6 gap-3 rounded-3xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
        <Text className="text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Winner</Text>
        <Text className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{summary.winner}</Text>

        <Text className="mt-2 text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Final score</Text>
        <Text className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{summary.finalScore}</Text>

        <Text className="mt-2 text-sm uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Run rate</Text>
        <Text className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{summary.runRate}</Text>
      </View>

      <Pressable
        onPress={() => {
          void handleDownloadReport();
        }}
        className="mt-6 h-12 items-center justify-center rounded-2xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
      >
        <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Download Report</Text>
      </Pressable>

      <View className="mt-auto gap-3">
        <Pressable
          onPress={() => {
            void handleExportMatch();
          }}
          className="h-12 items-center justify-center rounded-2xl bg-emerald-500"
        >
          <Text className="text-base font-semibold text-white">Export Match</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            void handleStartNewMatch();
          }}
          className="h-12 items-center justify-center rounded-2xl border border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900"
        >
          <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Start New Match</Text>
        </Pressable>
      </View>
    </View>
  );
}
