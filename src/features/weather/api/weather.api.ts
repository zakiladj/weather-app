import { weatherApi } from '@/lib/axios';
import type { Coordinates } from '@/types';
import type { CurrentWeather, WeatherForecast } from '../types';

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
    windDirection: data.wind.deg,
    condition: data.weather[0].main.toLowerCase(),
    description: data.weather[0].description,
    iconCode: data.weather[0].icon,
    visibility: data.visibility,
    uvIndex: 0,
    pressure: data.main.pressure,
    updatedAt: data.dt * 1000,
  };
}

export async function fetchWeatherForecast(coords: Coordinates): Promise<WeatherForecast> {
  const { data } = await weatherApi.get('/forecast', {
    params: { lat: coords.lat, lon: coords.lon, cnt: 40 },
  });

  const hourly = data.list.slice(0, 24).map((item: any) => ({
    timestamp: item.dt * 1000,
    temperature: item.main.temp,
    condition: item.weather[0].main.toLowerCase(),
    iconCode: item.weather[0].icon,
    precipitationChance: Math.round((item.pop ?? 0) * 100),
  }));

  const dailyMap = new Map<string, any>();
  for (const item of data.list) {
    const date = new Date(item.dt * 1000).toISOString().slice(0, 10);
    if (!dailyMap.has(date)) dailyMap.set(date, item);
  }

  const daily = Array.from(dailyMap.values())
    .slice(0, 7)
    .map((item) => ({
      date: new Date(item.dt * 1000).toISOString().slice(0, 10),
      tempMin: item.main.temp_min,
      tempMax: item.main.temp_max,
      condition: item.weather[0].main.toLowerCase(),
      iconCode: item.weather[0].icon,
      precipitationChance: Math.round((item.pop ?? 0) * 100),
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      sunrise: data.city.sunrise * 1000,
      sunset: data.city.sunset * 1000,
    }));

  return { locationId: String(data.city.id), hourly, daily };
}
