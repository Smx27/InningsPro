import { useColorScheme } from 'react-native';

import { themeByScheme } from './colors';

export const useThemeTokens = () => {
  const colorScheme = useColorScheme() ?? 'light';
  return themeByScheme[colorScheme === 'dark' ? 'dark' : 'light'];
};
