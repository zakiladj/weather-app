import axios from 'axios';

import { API_BASE_URL } from '@/config/constants';
import { ENV } from '@/config/env';

export const weatherApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  params: {
    appid: ENV.WEATHER_API_KEY,
    units: 'metric',
  },
});

weatherApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  }
);
