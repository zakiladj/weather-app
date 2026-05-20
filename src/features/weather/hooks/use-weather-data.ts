import { useCallback } from 'react';

import type { Coordinates } from '@/types';
import { isNetworkError } from '../lib/network-error';
import { useCurrentWeather } from './use-current-weather';
import { useWeatherForecast } from './use-weather-forecast';

// ─── Composed hook ─────────────────────────────────────────────────────────────
//
// Coordinates both weather queries and exposes a unified loading/error/offline state.
// Use this on screens that need both current weather and forecast data.

export function useWeatherData(coords: Coordinates | null) {
  const weatherQuery = useCurrentWeather(coords);
  const forecastQuery = useWeatherForecast(coords);

  const refetch = useCallback(
    () => Promise.all([weatherQuery.refetch(), forecastQuery.refetch()]),
    [weatherQuery.refetch, forecastQuery.refetch],
  );

  // `error` is set even on background refetch failures when cached data exists
  const latestError = weatherQuery.error ?? forecastQuery.error;
  const isOffline = isNetworkError(latestError);

  // Greater of the two successful fetch timestamps; null if never fetched
  const raw = Math.max(weatherQuery.dataUpdatedAt, forecastQuery.dataUpdatedAt);
  const dataUpdatedAt: number | null = raw > 0 ? raw : null;

  return {
    weather: weatherQuery.data,
    forecast: forecastQuery.data,
    isLoading: weatherQuery.isLoading || forecastQuery.isLoading,
    isError: weatherQuery.isError || forecastQuery.isError,
    isOffline,
    hasData: !!weatherQuery.data && !!forecastQuery.data,
    dataUpdatedAt,
    refetch,
  };
}
