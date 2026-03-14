import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

type SettingsItemProps = {
  title: string;
  icon: string;
  onPress: () => void;
};

function SettingsItemComponent({ title, icon, onPress }: SettingsItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className="flex-row items-center justify-between px-4 py-3 active:opacity-80"
      onPress={onPress}
    >
      <View className="flex-row items-center gap-3">
        <Text className="text-lg">{icon}</Text>
        <Text className="text-base font-medium text-zinc-900 dark:text-zinc-100">{title}</Text>
      </View>
      <Text className="text-zinc-400 dark:text-zinc-500">›</Text>
    </Pressable>
  );
}

export const SettingsItem = memo(SettingsItemComponent);

export type { SettingsItemProps };
