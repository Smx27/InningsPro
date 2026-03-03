import { memo } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import type { WicketType } from '@features/scoring/store/useScoringStore';

type WicketTypeSheetProps = {
  visible: boolean;
  onSelect: (type: WicketType) => void;
  onClose: () => void;
};

const WICKET_OPTIONS: Array<{ label: string; value: WicketType }> = [
  { label: 'Bowled', value: 'bowled' },
  { label: 'Caught', value: 'caught' },
  { label: 'LBW', value: 'lbw' },
  { label: 'Run Out', value: 'runout' },
  { label: 'Stumped', value: 'stumped' },
];

export const WicketTypeSheet = memo(function WicketTypeSheet({
  visible,
  onSelect,
  onClose,
}: WicketTypeSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable className="flex-1 bg-black/50" onPress={onClose}>
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="absolute bottom-0 w-full rounded-t-3xl border border-zinc-200 bg-white px-4 pb-8 pt-5 dark:border-zinc-800 dark:bg-zinc-950"
        >
          <View className="mb-4 items-center">
            <View className="h-1.5 w-12 rounded-full bg-zinc-300 dark:bg-zinc-700" />
            <Text className="mt-3 text-lg font-bold text-zinc-900 dark:text-zinc-100">Select wicket type</Text>
          </View>

          <View className="gap-3">
            {WICKET_OPTIONS.map((option) => (
              <Pressable
                key={option.value}
                onPress={() => onSelect(option.value)}
                className="h-14 items-center justify-center rounded-2xl border border-zinc-200 bg-zinc-50 active:scale-[0.98] dark:border-zinc-700 dark:bg-zinc-900"
              >
                <Text className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{option.label}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
});
