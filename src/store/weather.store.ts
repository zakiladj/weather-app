import { create } from 'zustand';

import type { Coordinates, TemperatureUnit, WindSpeedUnit, ThemeMode } from '@/types';
import type { WeatherLocation } from '@/features/weather/types';

interface WeatherStore {
  activeLocation: WeatherLocation | null;
  savedLocations: WeatherLocation[];
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  themeMode: ThemeMode;

  setActiveLocation: (location: WeatherLocation) => void;
  addSavedLocation: (location: WeatherLocation) => void;
  removeSavedLocation: (id: string) => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  activeLocation: null,
  savedLocations: [],
  temperatureUnit: 'celsius',
  windSpeedUnit: 'km/h',
  themeMode: 'system',

  setActiveLocation: (location) => set({ activeLocation: location }),

  addSavedLocation: (location) =>
    set((state) => ({
      savedLocations: state.savedLocations.some((l) => l.id === location.id)
        ? state.savedLocations
        : [...state.savedLocations, location],
    })),

  removeSavedLocation: (id) =>
    set((state) => ({
      savedLocations: state.savedLocations.filter((l) => l.id !== id),
    })),

  setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
  setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
  setThemeMode: (mode) => set({ themeMode: mode }),
}));
