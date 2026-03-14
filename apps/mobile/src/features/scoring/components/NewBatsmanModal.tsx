import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, Text, View } from 'react-native';

import type { Player } from '@core/database/schema';

type NewBatsmanModalProps = {
  visible: boolean;
  players: Player[];
  onSelect: (playerId: string) => void;
};

type PlayerRowProps = {
  item: Player;
  selected: boolean;
  onPress: (id: string) => void;
};

const PlayerRow = memo(function PlayerRow({ item, selected, onPress }: PlayerRowProps) {
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      className={`rounded-2xl border p-4 active:scale-[0.99] ${
        selected
          ? 'border-emerald-500 bg-emerald-500/10'
          : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
      }`}
    >
      <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</Text>
      <Text className="mt-1 text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">{item.role}</Text>
    </Pressable>
  );
});

export const NewBatsmanModal = memo(function NewBatsmanModal({
  visible,
  players,
  onSelect,
}: NewBatsmanModalProps) {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const sortedPlayers = useMemo(
    () => [...players].sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })),
    [players],
  );

  const confirmSelection = useCallback(() => {
    if (!selectedPlayerId) {
      return;
    }

    onSelect(selectedPlayerId);
    setSelectedPlayerId(null);
  }, [onSelect, selectedPlayerId]);

  const keyExtractor = useCallback((item: Player) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: Player }) => {
      return <PlayerRow item={item} selected={item.id === selectedPlayerId} onPress={setSelectedPlayerId} />;
    },
    [selectedPlayerId],
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={() => undefined}>
      <View className="flex-1 bg-zinc-100 px-4 pb-8 pt-14 dark:bg-black">
        <View className="mb-5">
          <Text className="text-2xl font-black text-zinc-900 dark:text-zinc-100">Select New Batsman</Text>
          <Text className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
            Selection is mandatory to continue wicket scoring.
          </Text>
        </View>

        <FlatList
          data={sortedPlayers}
          keyExtractor={keyExtractor}
          contentContainerClassName="gap-3 pb-28"
          renderItem={renderItem}
          ListEmptyComponent={
            <View className="rounded-2xl border border-amber-300 bg-amber-50 p-4 dark:border-amber-700/70 dark:bg-amber-950/30">
              <Text className="text-sm font-medium text-amber-800 dark:text-amber-300">
                No available batsmen left in the batting lineup.
              </Text>
            </View>
          }
        />

        <View className="absolute bottom-0 left-0 right-0 border-t border-zinc-200 bg-white px-4 pb-8 pt-4 dark:border-zinc-800 dark:bg-zinc-950">
          <Pressable
            disabled={!selectedPlayerId}
            onPress={confirmSelection}
            className="h-14 items-center justify-center rounded-2xl bg-emerald-500 active:scale-[0.98] disabled:bg-zinc-300 dark:disabled:bg-zinc-700"
          >
            <Text className="text-base font-bold text-white">Confirm New Batsman</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
});
