import type { Coordinates } from '@/types';

export type WeatherCondition =
  | 'clear'
  | 'clouds'
  | 'rain'
  | 'drizzle'
  | 'thunderstorm'
  | 'snow'
  | 'mist'
  | 'fog';

export interface WeatherLocation {
  id: string;
  name: string;
  country: string;
  coordinates: Coordinates;
  isCurrentLocation?: boolean;
}

export interface CurrentWeather {
  locationId: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  condition: WeatherCondition;
  description: string;
  iconCode: string;
  visibility: number;
  uvIndex: number;
  pressure: number;
  updatedAt: number;
}

export interface HourlyForecast {
  timestamp: number;
  temperature: number;
  condition: WeatherCondition;
  iconCode: string;
  precipitationChance: number;
}

export interface DailyForecast {
  date: string;
  tempMin: number;
  tempMax: number;
  condition: WeatherCondition;
  iconCode: string;
  precipitationChance: number;
  humidity: number;
  windSpeed: number;
  sunrise: number;
  sunset: number;
}

export interface WeatherForecast {
  locationId: string;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}
