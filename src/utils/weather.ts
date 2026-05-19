import type { TemperatureUnit, WindSpeedUnit } from '@/types';
import type { WeatherCondition } from '@/features/weather/types';

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') return Math.round(celsius * 9 / 5 + 32);
  return Math.round(celsius);
}

export function convertWindSpeed(mps: number, unit: WindSpeedUnit): number {
  switch (unit) {
    case 'km/h': return Math.round(mps * 3.6);
    case 'mph': return Math.round(mps * 2.237);
    default: return Math.round(mps);
  }
}

export function getWeatherBackground(condition: WeatherCondition, isDark: boolean): string {
  const backgrounds: Record<WeatherCondition, { light: string; dark: string }> = {
    clear: { light: 'bg-sky-400', dark: 'bg-sky-800' },
    clouds: { light: 'bg-slate-400', dark: 'bg-slate-700' },
    rain: { light: 'bg-blue-500', dark: 'bg-blue-900' },
    drizzle: { light: 'bg-blue-400', dark: 'bg-blue-800' },
    thunderstorm: { light: 'bg-indigo-600', dark: 'bg-indigo-900' },
    snow: { light: 'bg-slate-200', dark: 'bg-slate-600' },
    mist: { light: 'bg-gray-300', dark: 'bg-gray-700' },
    fog: { light: 'bg-gray-300', dark: 'bg-gray-700' },
  };
  return isDark ? backgrounds[condition].dark : backgrounds[condition].light;
}
