import { useQuery } from '@tanstack/react-query';

import { fetchCurrentWeather } from '../api/weather.api';
import type { Coordinates } from '@/types';

export function useCurrentWeather(coords: Coordinates | null) {
  return useQuery({
    queryKey: ['weather', 'current', coords?.lat, coords?.lon],
    queryFn: () => fetchCurrentWeather(coords!),
    enabled: coords !== null,
  });
}
