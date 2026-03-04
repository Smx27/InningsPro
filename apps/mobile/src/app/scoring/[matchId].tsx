import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect } from 'react';
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

export default function LiveScoringScreen() {
  const params = useLocalSearchParams<{ matchId: string }>();
  const matchId = Array.isArray(params.matchId) ? params.matchId[0] : params.matchId;

  const { loadMatchContext, teamAPlayers, teamBPlayers, bowlingTeamId, teamAId } = useMatchContextStore(
    useShallow((state) => ({
      loadMatchContext: state.loadMatchContext,
      teamAPlayers: state.teamAPlayers,
      teamBPlayers: state.teamBPlayers,
      bowlingTeamId: state.bowlingTeamId,
      teamAId: state.teamAId,
    })),
  );

  const {
    matchState,
    isLoading,
    isWicketSheetOpen,
    isBatsmanModalOpen,
    isBowlerModalOpen,
    closeBowlerModal,
    setBowler,
    availableBatsmen,
    loadMatch,
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
      isWicketSheetOpen: state.isWicketSheetOpen,
      isBatsmanModalOpen: state.isBatsmanModalOpen,
    isBowlerModalOpen: state.isBowlerModalOpen,
    closeBowlerModal: state.closeBowlerModal,
    setBowler: state.setBowler,
    availableBatsmen: state.availableBatsmen,
    loadMatch: state.loadMatch,
      recordRun: state.recordRun,
      recordExtra: state.recordExtra,
      openWicketFlow: state.openWicketFlow,
      closeWicketFlow: state.closeWicketFlow,
      selectWicketType: state.selectWicketType,
      confirmNewBatsman: state.confirmNewBatsman,
      undoLastBall: state.undoLastBall,
    })),
  );

  useEffect(() => {
    if (!matchId) {
      return;
    }

    void loadMatchContext(matchId);
    void loadMatch(matchId);
  }, [loadMatch, loadMatchContext, matchId]);

  const triggerHaptic = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handleRunPress = useCallback(
    async (runs: number) => {
      triggerHaptic();
      await recordRun(runs);
    },
    [recordRun, triggerHaptic],
  );

  const handleWide = useCallback(async () => {
    triggerHaptic();
    await recordExtra('wide');
  }, [recordExtra, triggerHaptic]);

  const handleNoBall = useCallback(async () => {
    triggerHaptic();
    await recordExtra('noball');
  }, [recordExtra, triggerHaptic]);

  const handleOpenWicketFlow = useCallback(() => {
    triggerHaptic();
    openWicketFlow();
  }, [openWicketFlow, triggerHaptic]);

  const handleWicketTypeSelect = useCallback(
    async (type: WicketType) => {
      triggerHaptic();
      await selectWicketType(type);
    },
    [selectWicketType, triggerHaptic],
  );

  const handleConfirmBatsman = useCallback(
    async (playerId: string) => {
      triggerHaptic();
      await confirmNewBatsman(playerId);
    },
    [confirmNewBatsman, triggerHaptic],
  );

  const handleUndo = useCallback(async () => {
    triggerHaptic();
    await undoLastBall();
  }, [triggerHaptic, undoLastBall]);

  const bowlingPlayers = bowlingTeamId === teamAId ? teamAPlayers : teamBPlayers;

  const handleSelectBowler = useCallback(
    (bowlerId: string) => {
      triggerHaptic();
      setBowler(bowlerId);
    },
    [setBowler, triggerHaptic],
  );

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
        onClose={closeWicketFlow}
      />

      {isLoading ? (
        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <ActivityIndicator size="large" color="#22c55e" />
        </View>
      ) : null}
    </View>
  );
}
