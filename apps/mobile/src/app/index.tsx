import { Text, View } from 'react-native';

import { useThemeTokens } from '@core/theme/useThemeTokens';
import { useAppStore } from '@store/useAppStore';

export default function HomeScreen() {
  const tokens = useThemeTokens();
  const currentMatch = useAppStore((state) => state.currentMatch);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: tokens.background }}
    >
      <Text className="text-xl font-bold" style={{ color: tokens.text }}>
        InningsPro Mobile Foundation
      </Text>
      <Text className="mt-4" style={{ color: tokens.text }}>
        Score: {currentMatch.runs}/{currentMatch.wickets} ({currentMatch.balls} balls)
      </Text>
    </View>
  );
}
