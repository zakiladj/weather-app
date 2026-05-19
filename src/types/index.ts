export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindSpeedUnit = 'km/h' | 'mph' | 'm/s';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface ApiError {
  message: string;
  code?: number;
}
