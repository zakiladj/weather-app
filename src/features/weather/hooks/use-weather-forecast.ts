import { useQuery } from '@tanstack/react-query';

import { fetchWeatherForecast } from '../api/weather.api';
import type { Coordinates } from '@/types';

export function useWeatherForecast(coords: Coordinates | null) {
  return useQuery({
    queryKey: ['weather', 'forecast', coords?.lat, coords?.lon],
    queryFn: () => fetchWeatherForecast(coords!),
    enabled: coords !== null,
  });
}
