import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra ?? {};

export const ENV = {
  WEATHER_API_KEY: (extra.weatherApiKey as string) ?? '',
  APP_ENV: (extra.appEnv as string) ?? 'development',
} as const;
