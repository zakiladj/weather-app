import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { TemperatureUnit, ThemeMode, WindSpeedUnit } from '@/types';
import type { WeatherLocation } from '@/features/weather/types';

interface WeatherStore {
  activeLocation: WeatherLocation | null;
  savedLocations: WeatherLocation[];
  recentSearches: WeatherLocation[];
  temperatureUnit: TemperatureUnit;
  windSpeedUnit: WindSpeedUnit;
  themeMode: ThemeMode;

  // Tracks whether the persist middleware has finished loading from AsyncStorage.
  // Use this to guard any logic that must NOT run until we know whether the
  // user has a previously saved location.
  _hasHydrated: boolean;

  setActiveLocation: (location: WeatherLocation) => void;
  clearActiveLocation: () => void;
  addSavedLocation: (location: WeatherLocation) => void;
  removeSavedLocation: (id: string) => void;
  addRecentSearch: (location: WeatherLocation) => void;
  removeRecentSearch: (id: string) => void;
  clearRecentSearches: () => void;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setWindSpeedUnit: (unit: WindSpeedUnit) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export const useWeatherStore = create<WeatherStore>()(
  persist(
    (set) => ({
      activeLocation: null,
      savedLocations: [],
      recentSearches: [],
      temperatureUnit: 'celsius',
      windSpeedUnit: 'km/h',
      themeMode: 'system',
      _hasHydrated: false,

      setActiveLocation: (location) => set({ activeLocation: location }),

      clearActiveLocation: () => set({ activeLocation: null }),

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

      addRecentSearch: (location) =>
        set((state) => {
          const filtered = state.recentSearches.filter((l) => l.id !== location.id);
          return { recentSearches: [location, ...filtered].slice(0, 5) };
        }),

      removeRecentSearch: (id) =>
        set((state) => ({
          recentSearches: state.recentSearches.filter((l) => l.id !== id),
        })),

      clearRecentSearches: () => set({ recentSearches: [] }),

      setTemperatureUnit: (unit) => set({ temperatureUnit: unit }),
      setWindSpeedUnit: (unit) => set({ windSpeedUnit: unit }),
      setThemeMode: (mode) => set({ themeMode: mode }),
    }),
    {
      name: 'weather-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist user-facing state. _hasHydrated is runtime-only.
      partialize: (state) => ({
        activeLocation: state.activeLocation,
        savedLocations: state.savedLocations,
        recentSearches: state.recentSearches,
        temperatureUnit: state.temperatureUnit,
        windSpeedUnit: state.windSpeedUnit,
        themeMode: state.themeMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    },
  ),
);

// Fallback: mark hydration complete even if onRehydrateStorage receives
// undefined (AsyncStorage error). Without this, _hasHydrated stays false
// and the location hook never auto-detects GPS permission.
useWeatherStore.persist.onFinishHydration(() => {
  if (!useWeatherStore.getState()._hasHydrated) {
    useWeatherStore.setState({ _hasHydrated: true });
  }
});
