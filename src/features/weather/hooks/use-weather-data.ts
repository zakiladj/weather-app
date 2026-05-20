import { useCallback } from 'react';

import type { Coordinates } from '@/types';
import { useCurrentWeather } from './use-current-weather';
import { useWeatherForecast } from './use-weather-forecast';

// ─── Composed hook ─────────────────────────────────────────────────────────────
//
// Coordinates both weather queries and exposes a unified loading/error state.
// Use this on screens that need both current weather and forecast data.

export function useWeatherData(coords: Coordinates | null) {
  const {
    data: weather,
    isLoading: isWeatherLoading,
    isError: isWeatherError,
    refetch: refetchWeather,
  } = useCurrentWeather(coords);

  const {
    data: forecast,
    isLoading: isForecastLoading,
    isError: isForecastError,
    refetch: refetchForecast,
  } = useWeatherForecast(coords);

  const refetch = useCallback(
    () => Promise.all([refetchWeather(), refetchForecast()]),
    [refetchWeather, refetchForecast],
  );

  return {
    weather,
    forecast,
    isLoading: isWeatherLoading || isForecastLoading,
    isError: isWeatherError || isForecastError,
    hasData: !!weather && !!forecast,
    refetch,
  };
}
