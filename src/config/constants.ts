export const APP_NAME = 'WeatherApp';
export const APP_VERSION = '1.0.0';

export const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
export const GEO_API_URL = 'https://api.openweathermap.org/geo/1.0';
export const WEATHER_ICON_URL = 'https://openweathermap.org/img/wn';

export const DEFAULT_CACHE_TIME_MS = 1000 * 60 * 60 * 2; // 2 hours — keeps stale data available offline
export const STALE_TIME_MS = 1000 * 60 * 5; // 5 minutes
export const REFETCH_INTERVAL_MS = 1000 * 60 * 10; // 10 minutes — background auto-refresh
export const LOCATION_SEARCH_DEBOUNCE_MS = 400;

export const MAX_SAVED_LOCATIONS = 10;
export const HOURLY_FORECAST_HOURS = 24;
export const DAILY_FORECAST_DAYS = 7;
