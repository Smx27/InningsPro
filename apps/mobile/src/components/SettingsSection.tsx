import { memo, type ReactNode } from 'react';
import { Text, View } from 'react-native';

type SettingsSectionProps = {
  title: string;
  children: ReactNode;
};

function SettingsSectionComponent({ title, children }: SettingsSectionProps) {
  return (
    <View className="gap-2">
      <Text className="px-1 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        {title}
      </Text>
      <View className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:bg-zinc-900">
        {children}
      </View>
    </View>
  );
}

export const SettingsSection = memo(SettingsSectionComponent);
