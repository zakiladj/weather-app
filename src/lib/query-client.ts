import { QueryClient } from '@tanstack/react-query';

import { DEFAULT_CACHE_TIME_MS, STALE_TIME_MS } from '@/config/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: STALE_TIME_MS,
      gcTime: DEFAULT_CACHE_TIME_MS,
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
    },
  },
});
