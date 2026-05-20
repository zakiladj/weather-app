import { geoApi, weatherApi } from '@/lib/axios';
import { ENV } from '@/config/env';
import type { Coordinates } from '@/types';
import { normalizeCondition } from '@/utils/weather';
import type { CurrentWeather, WeatherForecast, WeatherLocation } from '../types';

if (__DEV__ && !ENV.WEATHER_API_KEY) {
  console.warn(
    '[WeatherAPI] No API key found.\n' +
    'Add your OpenWeatherMap key to app.json:\n' +
    '  "extra": { "weatherApiKey": "YOUR_KEY_HERE" }',
  );
}

// ─── Current weather ───────────────────────────────────────────────────────────

export async function fetchCurrentWeather(coords: Coordinates): Promise<CurrentWeather> {
  const { data } = await weatherApi.get('/weather', {
    params: { lat: coords.lat, lon: coords.lon },
  });

  return {
    locationId: String(data.id),
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg ?? 0,
    condition: normalizeCondition(data.weather[0].main),
    description: data.weather[0].description,
    iconCode: data.weather[0].icon,
    visibility: data.visibility ?? 0,
    uvIndex: 0,
    pressure: data.main.pressure,
    updatedAt: data.dt * 1000,
  };
}

// ─── Forecast ─────────────────────────────────────────────────────────────────

export async function fetchWeatherForecast(coords: Coordinates): Promise<WeatherForecast> {
  const { data } = await weatherApi.get('/forecast', {
    params: { lat: coords.lat, lon: coords.lon, cnt: 40 },
  });

  const hourly = data.list.slice(0, 24).map((item: any) => ({
    timestamp: item.dt * 1000,
    temperature: item.main.temp,
    condition: normalizeCondition(item.weather[0].main),
    iconCode: item.weather[0].icon,
    precipitationChance: Math.round((item.pop ?? 0) * 100),
  }));

  // Deduplicate by calendar date — keep the noon slot when available
  const dailyMap = new Map<string, any>();
  for (const item of data.list) {
    const date = new Date(item.dt * 1000).toISOString().slice(0, 10);
    const existing = dailyMap.get(date);
    const hour = new Date(item.dt * 1000).getUTCHours();
    // Prefer 12:00 UTC slot; otherwise keep the first seen
    if (!existing || hour === 12) dailyMap.set(date, item);
  }

  const daily = Array.from(dailyMap.values())
    .slice(0, 7)
    .map((item) => ({
      date: new Date(item.dt * 1000).toISOString().slice(0, 10),
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      condition: normalizeCondition(item.weather[0].main),
      iconCode: item.weather[0].icon,
      precipitationChance: Math.round((item.pop ?? 0) * 100),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      sunrise: data.city.sunrise * 1000,
      sunset: data.city.sunset * 1000,
    }));

  return { locationId: String(data.city.id), hourly, daily };
}

// ─── Geocoding ────────────────────────────────────────────────────────────────

export async function fetchReverseGeocode(coords: Coordinates): Promise<WeatherLocation> {
  const { data } = await geoApi.get('/reverse', {
    params: { lat: coords.lat, lon: coords.lon, limit: 1 },
  });

  if (!data.length) throw new Error('No location found for these coordinates');

  const place = data[0];
  return {
    id: `${coords.lat.toFixed(4)},${coords.lon.toFixed(4)}`,
    name: place.local_names?.en ?? place.name,
    country: place.country,
    coordinates: coords,
    isCurrentLocation: true,
  };
}

export async function fetchLocationSearch(query: string): Promise<WeatherLocation[]> {
  const { data } = await geoApi.get('/direct', {
    params: { q: query.trim(), limit: 5 },
  });

  return (data as any[]).map((place) => ({
    id: `${(place.lat as number).toFixed(4)},${(place.lon as number).toFixed(4)}`,
    name: place.local_names?.en ?? place.name,
    country: place.country,
    coordinates: { lat: place.lat as number, lon: place.lon as number },
  }));
}
