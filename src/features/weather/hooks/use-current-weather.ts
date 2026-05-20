import { useQuery } from '@tanstack/react-query';

import {
  DEFAULT_CACHE_TIME_MS,
  REFETCH_INTERVAL_MS,
  STALE_TIME_MS,
} from '@/config/constants';
import type { Coordinates } from '@/types';
import { fetchCurrentWeather } from '../api/weather.api';
import { weatherKeys } from '../lib/query-keys';

export function useCurrentWeather(coords: Coordinates | null) {
  return useQuery({
    queryKey: weatherKeys.current(coords?.lat, coords?.lon),
    queryFn: () => fetchCurrentWeather(coords!),
    enabled: coords !== null,
    staleTime: STALE_TIME_MS,
    gcTime: DEFAULT_CACHE_TIME_MS,
    refetchInterval: REFETCH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });
}
