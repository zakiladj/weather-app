# Session — 2026-05-19

---

## Phase 1 — Architecture & infrastructure ✅

### Dependencies installed
```
nativewind@4.2.4    tailwindcss@3.4.19
zustand@5.0.13      @tanstack/react-query@5.100.11    axios@1.16.1
```

### Build config created
- `babel.config.js` — `jsxImportSource: nativewind` + `nativewind/babel` preset
- `metro.config.js` — `withNativeWind`, CSS input: `src/global.css`
- `tailwind.config.js` — content paths, `nativewind/preset`, initial tokens
- `nativewind-env.d.ts` — TypeScript reference shim
- `tsconfig.json` — added `nativewind-env.d.ts` to `include`
- `src/global.css` — `@tailwind base/components/utilities` + CSS vars

### Feature layer built — `src/features/weather/`
- `api/weather.api.ts` — `fetchCurrentWeather`, `fetchWeatherForecast` (typed, OWM)
- `hooks/use-current-weather.ts` — `useQuery` wrapper, enabled only when coords present
- `hooks/use-weather-forecast.ts` — `useQuery` wrapper, 7-day + 24h hourly
- `types/index.ts` — `WeatherCondition`, `CurrentWeather`, `DailyForecast`, `HourlyForecast`, `WeatherForecast`, `WeatherLocation`

### Shared infrastructure built
- `src/lib/axios.ts` — Axios instance, base URL, timeout, error interceptor
- `src/lib/query-client.ts` — singleton `QueryClient` (stale 5m, gc 10m, retry 2)
- `src/store/weather.store.ts` — Zustand: active/saved locations, units, themeMode
- `src/providers/app-providers.tsx` — `QueryClientProvider` root wrapper
- `src/config/constants.ts` — API URLs, cache durations, limits
- `src/config/env.ts` — `WEATHER_API_KEY` via `expo-constants`
- `src/types/index.ts` — `Coordinates`, `TemperatureUnit`, `WindSpeedUnit`, `ThemeMode`, `ApiError`
- `src/hooks/use-app-theme.ts` — resolves Zustand `themeMode` + system scheme → `isDark`
- `src/utils/weather.ts` — unit converters, `getWeatherBackground`
- `src/utils/format.ts` — time, date, weekday, temperature formatters

### Routing restructured
- `src/app/_layout.tsx` — `AppProviders` → `ThemeProvider` → `Stack`, first line imports `global.css`
- `src/app/(tabs)/_layout.tsx` — `Tabs` navigator (Today / Forecast / Settings)
- `src/app/(tabs)/index.tsx`, `forecast.tsx`, `settings.tsx` — placeholder stubs
- `src/app/+not-found.tsx` — 404 fallback

---

## Phase 2 — Design system & UI components ✅

### New dependency added
```
expo-linear-gradient@~55.0.14    (Button primary gradient, sky backgrounds)
```

### `tailwind.config.js` extended with
- `sky.*` — 9 time-of-day colour stops (dawn → midnight)
- `glass.*` — rgba glass surface and border utilities
- `surface.*` / `content.*` — semantic light/dark tokens
- `weather.*` — extended with `drizzle`, `mist`, `fog` condition colours
- `fontSize` — full iOS HIG type scale mapped to Tailwind utilities
- `borderRadius` — `xs` through `4xl`
- `opacity` — fine-grained steps (8, 12, 15, 35, 55, 65, 85, 95)

### Design foundation — `src/design/`

**`tokens.ts`** exports:
- `Typography` — 12-variant iOS HIG scale (`display` 96px / 200w → `caption2` 11px)
- `Spacing` — 21 named steps aligned to 4px grid
- `Radius` — `xs` (6) → `full` (9999)
- `Shadows` — `xs / sm / md / lg / xl` + coloured glows (`blue`, `purple`, `amber`)
- `GlassColors` — rgba constants for glass surfaces and borders
- `SemanticColors` — light/dark surface, text, and border values for imperative `style` use
- `Duration` — `instant / fast / normal / slow / slower`

**`gradients.ts`** exports:
- `SkyGradients` — 9 ambient backgrounds keyed by time of day
- `ConditionGradients` — all 8 weather conditions × day/night, each as `{ colors, start, end }`
- `getConditionGradient(condition, isNight)` — direct lookup
- `getSkyPeriod(hour)` — maps UTC hour 0–23 to a `SkyPeriod` key
- `getCurrentSkyGradient()` — convenience: returns gradient for current local hour

### Primitive UI components — `src/components/ui/`

| File | What it does |
|---|---|
| `Text.tsx` | `variant` prop maps to `Typography` token; `ui-rounded` font on iOS for `display`; `dim` and `weight` overrides |
| `Badge.tsx` | `solid / glass / outline / tinted` × 7 colours; `leading` slot; size `sm / md` |
| `Button.tsx` | `primary` (LinearGradient) / `secondary` (glass) / `ghost` / `icon`; Reanimated 0.96 press scale; `loading` state; `leading` + `trailing` slots |
| `Card.tsx` | `default / elevated / flat`; dark-mode surface via `useAppTheme`; native iOS shadow via `Shadows` tokens |
| `GlassCard.tsx` | `GlassView` (iOS 26+ via `isGlassEffectAPIAvailable()`) → fallback semi-transparent `View`; `glowColor` prop for coloured shadow |
| `Input.tsx` | `default / glass` variants; Reanimated border-opacity on focus; clear button; `label / hint / error` slots |
| `Skeleton.tsx` | `withRepeat` sin-wave shimmer; `SkeletonText` (multi-line) and `SkeletonCircle` wrappers |
| `Divider.tsx` | horizontal / vertical; `inset`, `thickness`, `color`; defaults to `white/20` for glass contexts |

### Weather domain components — `src/components/weather/`

| File | Key props / exports |
|---|---|
| `WeatherIcon.tsx` | `condition`, `isNight`, `size` (xs→2xl); `getWeatherEmoji()` helper |
| `CurrentWeatherCard.tsx` | `weather: CurrentWeather`, `location: WeatherLocation`, `unit`, `windUnit`, `isNight` |
| `HourlyItem.tsx` | `item: HourlyForecast`, `isCurrentHour`, `unit`; rain% hidden when ≤20% |
| `DailyItem.tsx` | `item: DailyForecast`, `globalMin`, `globalMax` (for normalised temp bar), `unit` |
| `StatBadge.tsx` | `stat` key (`humidity / wind / uv / pressure / visibility / feelsLike / rain`), `value`, `detail`; `StatGrid` 2-col wrapper |
| `WeatherCardSkeleton.tsx` | 4 exports: `WeatherCardSkeleton`, `HourlyScrollSkeleton`, `DailyListSkeleton`, `StatGridSkeleton` |

---

## Known debt (untouched, still on disk)
- `src/app/explore.tsx`, `src/app/index.tsx` — unused template screens
- `src/components/animated-icon.*`, `app-tabs.*`, `themed-text.tsx`, `themed-view.tsx`, `hint-row.tsx`, `external-link.tsx`, `web-badge.tsx`, `ui/collapsible.tsx` — Expo template components
- `src/constants/theme.ts`, `src/hooks/use-color-scheme.*`, `src/hooks/use-theme.ts` — legacy template hooks, safe to delete once screens are migrated off them

---

## Phase 3 — Screen implementation (Up next)

**Order matters** — complete in sequence:

1. **Delete boilerplate** — remove all files listed in "Known debt" above
2. **Today screen** (`(tabs)/index.tsx`)
   - Full-screen `LinearGradient` sky background via `getCurrentSkyGradient()`
   - `CurrentWeatherCard` hero at top
   - Horizontal `ScrollView` of `HourlyItem` chips
   - `StatGrid` with humidity, wind, UV, pressure
   - Loading state: `WeatherCardSkeleton` + `HourlyScrollSkeleton` + `StatGridSkeleton`
3. **Forecast screen** (`(tabs)/forecast.tsx`)
   - `GlassCard` container with `DailyItem` list (7 rows)
   - Compute `globalMin` / `globalMax` before rendering the list
   - Loading state: `DailyListSkeleton`
4. **Settings screen** (`(tabs)/settings.tsx`)
   - Temperature unit toggle (`celsius / fahrenheit`)
   - Wind speed unit toggle (`km/h / mph / m/s`)
   - Theme mode selector (`light / dark / system`)
   - All state from `useWeatherStore`
5. **Location search** — new stack screen, `Input` component, `expo-location` for GPS permission
6. **Entrance animations** — Reanimated `FadeInDown` / `SlideInUp` on screen mount
