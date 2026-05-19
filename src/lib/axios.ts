import axios from 'axios';

import { API_BASE_URL, GEO_API_URL } from '@/config/constants';
import { ENV } from '@/config/env';

function errorInterceptor(error: unknown) {
  const message =
    (error as any)?.response?.data?.message ??
    (error as any)?.message ??
    'Unknown error';
  return Promise.reject(new Error(message));
}

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
