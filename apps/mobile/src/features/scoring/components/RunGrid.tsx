import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

type RunGridProps = {
  onRunPress: (runs: number) => void;
  disabled?: boolean;
};

const RUN_OPTIONS = [0, 1, 2, 3, 4, 6] as const;

export const RunGrid = memo(function RunGrid({ onRunPress, disabled = false }: RunGridProps) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-3">
      {RUN_OPTIONS.map((run) => (
        <Pressable
          key={run}
          disabled={disabled}
          onPress={() => onRunPress(run)}
          className="h-20 w-[31.5%] items-center justify-center rounded-2xl bg-emerald-500 shadow-lg active:scale-95 disabled:opacity-50"
        >
          <Text className="text-2xl font-black text-white">{run}</Text>
        </Pressable>
      ))}
    </View>
  );
});
