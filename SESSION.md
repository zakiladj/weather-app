# Session — 2026-05-19

## Goal
Bootstrap production architecture for the weather app.
No screens — only structure, dependencies, and wiring.

---

## Completed

### 1. Dependencies installed
```
nativewind@4.2.4   tailwindcss@3.4.19
zustand@5.0.13     @tanstack/react-query@5.100.11   axios@1.16.1
```

### 2. Build config
- `babel.config.js` — `jsxImportSource: nativewind`, `nativewind/babel` preset
- `metro.config.js` — `withNativeWind`, CSS input: `src/global.css`
- `tailwind.config.js` — content paths, `nativewind/preset`, design tokens
- `nativewind-env.d.ts` — TypeScript reference shim
- `tsconfig.json` — added `nativewind-env.d.ts` to `include`
- `src/global.css` — added `@tailwind base/components/utilities`

### 3. Feature layer — `src/features/weather/`
- `api/weather.api.ts` — `fetchCurrentWeather` + `fetchWeatherForecast` (typed, OWM)
- `hooks/use-current-weather.ts` — `useQuery` wrapper, enabled when coords present
- `hooks/use-weather-forecast.ts` — `useQuery` wrapper, 7-day + hourly
- `types/index.ts` — `WeatherCondition`, `CurrentWeather`, `DailyForecast`, `HourlyForecast`, `WeatherForecast`, `WeatherLocation`

### 4. Shared infrastructure
- `src/lib/axios.ts` — Axios instance, base URL, timeout, error interceptor
- `src/lib/query-client.ts` — singleton `QueryClient` (stale 5m, gc 10m, retry 2)
- `src/store/weather.store.ts` — Zustand: active location, saved locations, units, theme mode
- `src/providers/app-providers.tsx` — `QueryClientProvider` wrapping the app
- `src/config/constants.ts` — API URLs, cache durations, limits
- `src/config/env.ts` — `WEATHER_API_KEY` via `expo-constants`
- `src/types/index.ts` — `Coordinates`, `TemperatureUnit`, `WindSpeedUnit`, `ThemeMode`, `ApiError`
- `src/hooks/use-app-theme.ts` — resolves `themeMode` + system scheme → `isDark`
- `src/utils/weather.ts` — unit converters, `getWeatherBackground`
- `src/utils/format.ts` — time, date, weekday, temperature formatters

### 5. Routing
- `src/app/_layout.tsx` — root layout: `AppProviders` → `ThemeProvider` → `Stack`, imports `global.css`
- `src/app/(tabs)/_layout.tsx` — `Tabs` navigator with Today / Forecast / Settings
- `src/app/(tabs)/index.tsx` — Today stub
- `src/app/(tabs)/forecast.tsx` — Forecast stub
- `src/app/(tabs)/settings.tsx` — Settings stub
- `src/app/+not-found.tsx` — 404 fallback

---

## Known Debt (not touched this session)
- `src/app/explore.tsx` and `src/app/index.tsx` are unused template leftovers — delete before building screens
- `src/components/` contains Expo template components — audit and replace with weather-specific ones
- `src/constants/theme.ts` and `src/hooks/use-color-scheme.*` are template files — can be removed once design system is in place

---

## Up Next
1. Delete boilerplate leftovers (`explore.tsx`, old `index.tsx`, old components)
2. Build **Today screen** — current temp, condition, feels like, wind, humidity, hourly scroll
3. Build **Forecast screen** — 7-day `FlatList` with daily rows
4. Build **Settings screen** — temperature unit toggle, wind unit toggle, theme selector
5. Location search screen + `expo-location` permission flow
6. Polish — Reanimated 4 entrance animations, glass card components
