import axios from 'axios';

import { API_BASE_URL, GEO_API_URL } from '@/config/constants';
import { ENV } from '@/config/env';

// ─── Error interceptor ─────────────────────────────────────────────────────────

function errorInterceptor(error: unknown): Promise<never> {
  const err = error as {
    response?: { status?: number; data?: { message?: string } };
    code?: string;
    message?: string;
  };

  if (err.response?.status === 401) {
    return Promise.reject(
      new Error('Invalid API key. Add your OpenWeatherMap key to app.json → extra.weatherApiKey.'),
    );
  }

  if (err.response?.status === 429) {
    return Promise.reject(
      new Error('API rate limit exceeded. Please try again in a moment.'),
    );
  }

  if (err.code === 'ECONNABORTED') {
    return Promise.reject(
      new Error('Request timed out. Check your internet connection and try again.'),
    );
  }

  if (!err.response) {
    return Promise.reject(
      new Error('No internet connection. Check your network and try again.'),
    );
  }

  const message =
    err.response.data?.message ?? err.message ?? 'Something went wrong.';
  return Promise.reject(new Error(message));
}

// ─── Instances ─────────────────────────────────────────────────────────────────

export const weatherApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  params: {
    appid: ENV.WEATHER_API_KEY,
    units: 'metric',
  },
});

weatherApi.interceptors.response.use((r) => r, errorInterceptor);

export const geoApi = axios.create({
  baseURL: GEO_API_URL,
  timeout: 10_000,
  params: {
    appid: ENV.WEATHER_API_KEY,
  },
});

geoApi.interceptors.response.use((r) => r, errorInterceptor);
