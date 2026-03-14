import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useShallow } from 'zustand/react/shallow';

import { useMatchContextStore } from '@features/match/context/useMatchContextStore';
import {
  BowlerSelectionModal,
  LastBallsRow,
  NewBatsmanModal,
  QuickActionsBar,
  RunGrid,
  ScoreHeader,
  WicketTypeSheet,
} from '@features/scoring/components';
import { useScoringStore, type WicketType } from '@features/scoring/store/useScoringStore';

type MatchHapticType = 'run' | 'boundary' | 'wicket' | 'undo';

export default function LiveScoringScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ matchId: string }>();
  const matchId = Array.isArray(params.matchId) ? params.matchId[0] : params.matchId;

  const {
    matchState,
    isLoading,
    isMatchCompleted,
    isBowlerModalOpen,
    isWicketSheetOpen,
    isBatsmanModalOpen,
    currentBowlerId,
    loadMatch,
    openBowlerModal,
    closeBowlerModal,
    setBowler,
    recordRun,
    recordExtra,
    openWicketFlow,
    closeWicketFlow,
    selectWicketType,
    confirmNewBatsman,
    undoLastBall,
  } = useScoringStore(
    useShallow((state) => ({
      matchState: state.matchState,
      isLoading: state.isLoading,
      isMatchCompleted: state.isMatchCompleted,
      isBowlerModalOpen: state.isBowlerModalOpen,
      isWicketSheetOpen: state.isWicketSheetOpen,
      isBatsmanModalOpen: state.isBatsmanModalOpen,
      currentBowlerId: state.currentBowlerId,
      loadMatch: state.loadMatch,
      openBowlerModal: state.openBowlerModal,
      closeBowlerModal: state.closeBowlerModal,
      setBowler: state.setBowler,
      recordRun: state.recordRun,
      recordExtra: state.recordExtra,
      openWicketFlow: state.openWicketFlow,
      closeWicketFlow: state.closeWicketFlow,
      selectWicketType: state.selectWicketType,
      confirmNewBatsman: state.confirmNewBatsman,
      undoLastBall: state.undoLastBall,
    })),
  );

  const {
    loadMatchContext,
    contextBowlingTeamId,
    contextBattingTeamId,
    contextTeamAId,
    contextTeamAPlayers,
    contextTeamBPlayers,
  } = useMatchContextStore(
    useShallow((state) => ({
      loadMatchContext: state.loadMatchContext,
      contextBowlingTeamId: state.bowlingTeamId,
      contextBattingTeamId: state.battingTeamId,
      contextTeamAId: state.teamAId,
      contextTeamAPlayers: state.teamAPlayers,
      contextTeamBPlayers: state.teamBPlayers,
    })),
  );

  useEffect(() => {
    if (!matchId) {
      return;
    }

    void Promise.all([loadMatch(matchId), loadMatchContext(matchId)]);
  }, [loadMatch, loadMatchContext, matchId]);

  useEffect(() => {
    if (!matchId || !isMatchCompleted) {
      return;
    }

    router.replace(`/scoring/${matchId}/summary`);
  }, [isMatchCompleted, matchId, router]);

  const bowlingPlayers = useMemo(() => {
    if (!contextBowlingTeamId) {
      return [];
    }

    return contextBowlingTeamId === contextTeamAId ? contextTeamAPlayers : contextTeamBPlayers;
  }, [contextBowlingTeamId, contextTeamAId, contextTeamAPlayers, contextTeamBPlayers]);

  const availableBatsmen = useMemo(() => {
    if (!contextBattingTeamId) {
      return [];
    }

    const battingPlayers =
      contextBattingTeamId === contextTeamAId ? contextTeamAPlayers : contextTeamBPlayers;

    return battingPlayers.filter(
      (player) => player.id !== matchState.currentStriker && player.id !== matchState.currentNonStriker,
    );
  }, [
    contextBattingTeamId,
    contextTeamAId,
    contextTeamAPlayers,
    contextTeamBPlayers,
    matchState.currentNonStriker,
    matchState.currentStriker,
  ]);

  const triggerHaptic = useCallback((type: MatchHapticType) => {
    switch (type) {
      case 'run':
        void Haptics.selectionAsync();
        return;
      case 'boundary':
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        return;
      case 'wicket':
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        return;
      case 'undo':
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        return;
      default:
        return;
    }
  }, []);

  const handleRunPress = useCallback(
    async (runs: number) => {
      triggerHaptic(runs >= 4 ? 'boundary' : 'run');
      await recordRun(runs);
    },
    [recordRun, triggerHaptic],
  );

  const handleWide = useCallback(async () => {
    triggerHaptic('run');
    await recordExtra('wide');
  }, [recordExtra, triggerHaptic]);

  const handleNoBall = useCallback(async () => {
    triggerHaptic('run');
    await recordExtra('noball');
  }, [recordExtra, triggerHaptic]);

  const handleOpenWicketFlow = useCallback(() => {
    triggerHaptic('wicket');
    openWicketFlow();
  }, [openWicketFlow, triggerHaptic]);

  const handleWicketTypeSelect = useCallback(
    (type: WicketType) => {
      triggerHaptic('wicket');
      selectWicketType(type);
    },
    [selectWicketType, triggerHaptic],
  );

  const handleConfirmBatsman = useCallback(
    async (playerId: string) => {
      triggerHaptic('wicket');
      await confirmNewBatsman(playerId);
    },
    [confirmNewBatsman, triggerHaptic],
  );

  const handleSelectBowler = useCallback(
    (bowlerId: string) => {
      triggerHaptic('run');
      setBowler(bowlerId);
    },
    [setBowler, triggerHaptic],
  );

  const handleUndo = useCallback(async () => {
    triggerHaptic('undo');
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
          onWicket={handleOpenWicketFlow}
          onUndo={handleUndo}
          disabled={isLoading}
        />

        <View className="rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <LastBallsRow balls={matchState.last6Balls} />
        </View>

        <View className="rounded-3xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <Text className="text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Current Bowler
          </Text>
          <Text className="mt-2 text-base font-bold text-zinc-900 dark:text-zinc-100">
            {currentBowlerId ?? 'Not selected'}
          </Text>
          <Text
            onPress={openBowlerModal}
            className="mt-3 text-sm font-semibold text-emerald-600 dark:text-emerald-400"
          >
            Change bowler
          </Text>
        </View>
      </ScrollView>

      <BowlerSelectionModal
        visible={isBowlerModalOpen}
        players={bowlingPlayers}
        onSelect={handleSelectBowler}
        onClose={closeBowlerModal}
      />

      <WicketTypeSheet
        visible={isWicketSheetOpen}
        onSelect={handleWicketTypeSelect}
        onClose={closeWicketFlow}
      />

      <NewBatsmanModal
        visible={isBatsmanModalOpen}
        players={availableBatsmen}
        onSelect={handleConfirmBatsman}
      />

      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : null}
    </View>
  );
}
