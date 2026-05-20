import { useQuery } from '@tanstack/react-query';

import {
  DEFAULT_CACHE_TIME_MS,
  REFETCH_INTERVAL_MS,
  STALE_TIME_MS,
} from '@/config/constants';
import type { Coordinates } from '@/types';
import { fetchWeatherForecast } from '../api/weather.api';
import { weatherKeys } from '../lib/query-keys';

export function useWeatherForecast(coords: Coordinates | null) {
  return useQuery({
    queryKey: weatherKeys.forecast(coords?.lat, coords?.lon),
    queryFn: () => fetchWeatherForecast(coords!),
    enabled: coords !== null,
    staleTime: STALE_TIME_MS,
    gcTime: DEFAULT_CACHE_TIME_MS,
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
