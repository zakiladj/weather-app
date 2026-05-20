// ─── Query key factory ─────────────────────────────────────────────────────────
//
// All React Query cache keys live here. Every hook and every invalidateQueries
// call must use these factories — never inline string arrays.
//
// Key hierarchy:
//   ['weather']                           → all weather data
//   ['weather', 'current', lat, lon]      → current weather for a coordinate
//   ['weather', 'forecast', lat, lon]     → forecast for a coordinate
//   ['location']                          → all location data
//   ['location', 'search', query]         → geocoding search results

export const weatherKeys = {
  all: ['weather'] as const,

  current: (lat?: number | null, lon?: number | null) =>
    ['weather', 'current', lat, lon] as const,

  forecast: (lat?: number | null, lon?: number | null) =>
    ['weather', 'forecast', lat, lon] as const,
} as const;

export const locationKeys = {
  all: ['location'] as const,

  search: (query: string) => ['location', 'search', query] as const,
} as const;
