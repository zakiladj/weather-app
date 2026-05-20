import { useQuery } from '@tanstack/react-query';

import { DEFAULT_CACHE_TIME_MS, STALE_TIME_MS } from '@/config/constants';
import { fetchLocationSearch } from '../api/weather.api';
import { locationKeys } from '../lib/query-keys';

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: locationKeys.search(query),
    queryFn: () => fetchLocationSearch(query),
    enabled: query.trim().length >= 2,
    staleTime: STALE_TIME_MS,
    gcTime: DEFAULT_CACHE_TIME_MS,
  });
}
