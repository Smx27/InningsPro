import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import {
  LastBallsRow,
  QuickActionsBar,
  RunGrid,
  ScoreHeader,
} from '@features/scoring/components';
import { useScoringStore } from '@features/scoring/store/useScoringStore';

export default function LiveScoringScreen() {
  const params = useLocalSearchParams<{ matchId: string }>();
  const matchId = Array.isArray(params.matchId) ? params.matchId[0] : params.matchId;

  const { matchState, isLoading, loadMatch, recordRun, recordExtra, recordWicket, undoLastBall } = useScoringStore(
    useShallow((state) => ({
      matchState: state.matchState,
      isLoading: state.isLoading,
      loadMatch: state.loadMatch,
      recordRun: state.recordRun,
      recordExtra: state.recordExtra,
      recordWicket: state.recordWicket,
      undoLastBall: state.undoLastBall,
    })),
  );

  useEffect(() => {
    if (!matchId) {
      return;
    }

    void loadMatch(matchId);
  }, [loadMatch, matchId]);

  const triggerHaptic = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleRunPress = useCallback(
    async (runs: number) => {
      await triggerHaptic();
      await recordRun(runs);
    },
    [recordRun, triggerHaptic],
  );

  const handleWide = useCallback(async () => {
    await triggerHaptic();
    await recordExtra('wide');
  }, [recordExtra, triggerHaptic]);

  const handleNoBall = useCallback(async () => {
    await triggerHaptic();
    await recordExtra('noball');
  }, [recordExtra, triggerHaptic]);

  const handleWicket = useCallback(async () => {
    await triggerHaptic();
    await recordWicket('bowled');
  }, [recordWicket, triggerHaptic]);

  const handleUndo = useCallback(async () => {
    await triggerHaptic();
    await undoLastBall();
  }, [triggerHaptic, undoLastBall]);

  if (!matchId) {
    return (
      <View className="flex-1 items-center justify-center bg-zinc-100 px-6 dark:bg-black">
        <Text className="text-base text-zinc-700 dark:text-zinc-200">Missing match id</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-zinc-100 dark:bg-black">
      <View className="px-4 pb-3 pt-12">
        <ScoreHeader
          runs={matchState.totalRuns}
          wickets={matchState.totalWickets}
          overs={matchState.overs}
          runRate={matchState.runRate}
          striker={matchState.currentStriker}
          nonStriker={matchState.currentNonStriker}
        />
      </View>

      <ScrollView className="flex-1" contentContainerClassName="gap-5 px-4 pb-8">
        <RunGrid onRunPress={handleRunPress} disabled={isLoading} />

        <QuickActionsBar
          onWide={handleWide}
          onNoBall={handleNoBall}
          onWicket={handleWicket}
          onUndo={handleUndo}
          disabled={isLoading}
        />

        <View className="rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <LastBallsRow balls={matchState.last6Balls} />
        </View>
      </ScrollView>

      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : null}
    </View>
  );
}
