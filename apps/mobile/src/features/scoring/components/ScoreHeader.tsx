import { memo } from 'react';
import { Text, View } from 'react-native';

type ScoreHeaderProps = {
  runs: number;
  wickets: number;
  overs: number;
  runRate: number;
  striker: string | null;
  nonStriker: string | null;
};

export const ScoreHeader = memo(function ScoreHeader({
  runs,
  wickets,
  overs,
  runRate,
  striker,
  nonStriker,
}: ScoreHeaderProps) {
  return (
    <View className="rounded-3xl border border-white/20 bg-white/80 p-4 shadow-xl dark:border-white/10 dark:bg-zinc-900/80">
      <View className="flex-row items-end justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Live Score
          </Text>
          <Text className="mt-1 text-4xl font-black text-zinc-900 dark:text-zinc-100">
            {runs}/{wickets}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">Overs {overs.toFixed(1)}</Text>
          <Text className="text-sm font-semibold text-emerald-500">RR {runRate.toFixed(2)}</Text>
        </View>
      </View>

      <View className="mt-4 flex-row gap-3">
        <View className="flex-1 rounded-2xl bg-zinc-100/80 px-3 py-2 dark:bg-zinc-800/80">
          <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Striker</Text>
          <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100" numberOfLines={1}>
            {striker ?? 'Not set'}
          </Text>
        </View>
        <View className="flex-1 rounded-2xl bg-zinc-100/80 px-3 py-2 dark:bg-zinc-800/80">
          <Text className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Non-striker</Text>
          <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100" numberOfLines={1}>
            {nonStriker ?? 'Not set'}
          </Text>
        </View>
      </View>
    </View>
  );
});
