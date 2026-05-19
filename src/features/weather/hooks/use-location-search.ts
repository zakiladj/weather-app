import { useQuery } from '@tanstack/react-query';

import { fetchLocationSearch } from '../api/weather.api';

export function useLocationSearch(query: string) {
  return useQuery({
    queryKey: ['location', 'search', query],
    queryFn: () => fetchLocationSearch(query),
    enabled: query.trim().length >= 2,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
}
