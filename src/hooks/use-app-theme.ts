import { useColorScheme } from 'react-native';

import { useWeatherStore } from '@/store/weather.store';

export function useAppTheme() {
  const systemScheme = useColorScheme();
  const themeMode = useWeatherStore((s) => s.themeMode);

  const isDark =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  return { isDark, colorScheme: isDark ? 'dark' : 'light' } as const;
}
