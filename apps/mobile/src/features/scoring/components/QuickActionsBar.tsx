import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

type QuickActionsBarProps = {
  onWide: () => void;
  onNoBall: () => void;
  onWicket: () => void;
  onUndo: () => void;
  disabled?: boolean;
};

const actionClassName =
  'h-14 flex-1 items-center justify-center rounded-2xl border border-zinc-200 bg-white shadow-sm active:scale-95 dark:border-zinc-700 dark:bg-zinc-900';

export const QuickActionsBar = memo(function QuickActionsBar({
  onWide,
  onNoBall,
  onWicket,
  onUndo,
  disabled = false,
}: QuickActionsBarProps) {
  return (
    <View className="flex-row gap-2">
      <Pressable
        disabled={disabled}
        onPress={onWide}
        className={`${actionClassName} disabled:opacity-50`}
      >
        <Text className="font-semibold text-zinc-800 dark:text-zinc-100">Wide</Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        onPress={onNoBall}
        className={`${actionClassName} disabled:opacity-50`}
      >
        <Text className="font-semibold text-zinc-800 dark:text-zinc-100">No Ball</Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        onPress={onWicket}
        className={`${actionClassName} disabled:opacity-50`}
      >
        <Text className="font-semibold text-zinc-800 dark:text-zinc-100">Wicket</Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        onPress={onUndo}
        className="h-14 flex-1 items-center justify-center rounded-2xl border border-amber-200 bg-amber-500 shadow-sm active:scale-95 disabled:opacity-50"
      >
        <Text className="font-semibold text-white">Undo</Text>
      </Pressable>
    </View>
  );
});
