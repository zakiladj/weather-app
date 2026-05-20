import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchReverseGeocode } from '@/features/weather/api/weather.api';
import { useWeatherStore } from '@/store/weather.store';

export type LocationStatus = 'idle' | 'requesting' | 'denied' | 'ready';

export function useLocation() {
  const { activeLocation, setActiveLocation, _hasHydrated } = useWeatherStore();
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const didAutoRequest = useRef(false);

  // Sync local status once we know a location was restored from persistence.
  // Without this, the empty state flashes briefly on app restart.
  useEffect(() => {
    if (_hasHydrated && activeLocation && status === 'idle') {
      setStatus('ready');
    }
  }, [_hasHydrated, activeLocation, status]);

  const requestGPS = useCallback(async () => {
    setStatus('requesting');
    setError(null);
    try {
      const { status: permStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permStatus !== 'granted') {
        setStatus('denied');
        return;
      }

      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude,
      };

      const location = await fetchReverseGeocode(coords);
      setActiveLocation(location);
      setStatus('ready');
    } catch (e) {
      setError((e as Error).message ?? 'Could not fetch location');
      setStatus('idle');
    }
  }, [setActiveLocation]);

  // Auto-detect GPS permission from a prior session — but only AFTER the
  // persist middleware has finished loading from AsyncStorage. This prevents
  // overwriting a user-saved city (e.g. Paris) with the device's GPS location.
  useEffect(() => {
    if (!_hasHydrated || activeLocation || didAutoRequest.current) return;
    didAutoRequest.current = true;

    Location.getForegroundPermissionsAsync().then(({ status: permStatus }) => {
      if (permStatus === 'granted') requestGPS();
    });
    // requestGPS is stable (useCallback with stable Zustand setter)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_hasHydrated]);

  return {
    activeLocation,
    status,
    error,
    requestGPS,
  };
}
