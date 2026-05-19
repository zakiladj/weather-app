import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchReverseGeocode } from '@/features/weather/api/weather.api';
import { useWeatherStore } from '@/store/weather.store';

export type LocationStatus = 'idle' | 'requesting' | 'denied' | 'ready';

export function useLocation() {
  const { activeLocation, setActiveLocation } = useWeatherStore();
  const [status, setStatus] = useState<LocationStatus>(
    activeLocation ? 'ready' : 'idle',
  );
  const [error, setError] = useState<string | null>(null);
  const didAutoRequest = useRef(false);

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

  // Auto-detect if permission was already granted from a previous session
  useEffect(() => {
    if (activeLocation || didAutoRequest.current) return;
    didAutoRequest.current = true;

    Location.getForegroundPermissionsAsync().then(({ status: permStatus }) => {
      if (permStatus === 'granted') requestGPS();
    });
    // requestGPS is stable (useCallback with stable setActiveLocation from Zustand)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    activeLocation,
    status,
    error,
    requestGPS,
  };
}
