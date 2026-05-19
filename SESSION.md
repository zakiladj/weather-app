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

## Phase 3 — Screen implementation ✅

### Boilerplate deleted
Removed 17 Expo template files that were no longer needed:
- `src/app/explore.tsx`, `src/app/index.tsx`
- `src/components/animated-icon.*`, `app-tabs.*`, `themed-text.tsx`, `themed-view.tsx`, `hint-row.tsx`, `external-link.tsx`, `web-badge.tsx`, `ui/collapsible.tsx`
- `src/constants/theme.ts`, `src/hooks/use-color-scheme.*`, `src/hooks/use-theme.ts`

### New section components created
- `src/components/weather/HourlyForecastCard.tsx` — `GlassCard` wrapper with "🕐 HOURLY FORECAST" header, `Divider`, horizontal `ScrollView` of `HourlyItem` chips; `isCurrentHour={index === 0}`
- `src/components/weather/DailyForecastCard.tsx` — `GlassCard` wrapper with "📅 7-DAY FORECAST" header, `Divider`, `DailyItem` list; computes `globalMin` / `globalMax` internally

### Tab bar updated — `src/app/(tabs)/_layout.tsx`
- `position: absolute` glass tab bar — `rgba(10,12,30,0.82)` background, `borderTopWidth: 0.5`
- `SymbolView` SF Symbols icons — `sun.max.fill`, `calendar`, `gearshape.fill` (iOS) with Material fallbacks
- Active tint: `#FFFFFF` / inactive: `rgba(255,255,255,0.40)`

### Today screen — `src/app/(tabs)/index.tsx`
- Full-screen `LinearGradient` from `getConditionGradient(condition, isNight)` + `rgba(0,0,0,0.14)` depth overlay
- Sticky mini header (absolute, `zIndex: 10`) fades in as hero scrolls away
- Scroll-driven animations via `useSharedValue` + `useAnimatedScrollHandler`:
  - Hero: opacity + parallax translateY between `scrollY` 100–240
  - Mini header: opacity between `scrollY` 160–230
- Entrance: `FadeInDown.delay(60)` hero; `FadeInUp` cards staggered at 100/220/340ms
- Sections: `HourlyForecastCard` → `DailyForecastCard` → `StatGrid` (6 stats via `useMemo`)
- Loading state: 1.6s `setTimeout`, shows `HourlyScrollSkeleton` + `DailyListSkeleton` + `StatGridSkeleton`
- Mock: 14 hourly items, 7 daily items, clear sky 22°C Paris

### Forecast screen — `src/app/(tabs)/forecast.tsx`
- Full-screen `getCurrentSkyGradient()` background (time-of-day ambient, not condition-specific)
- Large "Forecast" page header with city + country label
- Three cards with staggered `FadeInUp` (80/180/280ms):
  1. `DailyForecastCard` — full 7-day list
  2. Today's Details — 3×2 grid: sunrise/sunset, high/low, humidity/wind using explicit `DetailRow` + `DetailCell` components
  3. Weekly Overview — compact strip with `WeatherIcon`, rain%, min/max per day
- Loading state: 1.2s `setTimeout`, shows `DailyListSkeleton`

### Settings screen — `src/app/(tabs)/settings.tsx`
- Dark navy `#0C0A1E` background — no weather gradient (context-neutral)
- Three `GlassCard` sections with staggered `FadeInUp` (60/140/220ms):
  - **Units** — temperature (°C / °F) and wind speed (km/h / mph / m/s) toggles
  - **Appearance** — theme mode (Light / Dark / System) toggle
  - **About** — Version, Data Source, Refresh Interval static rows
- Custom `SegmentedControl` — glass background, active at `rgba(255,255,255,0.20)`, rounded ends per segment
- All toggles wired to `useWeatherStore` — changes are instant and persist across tabs

### TypeScript fixes
- `LinearGradient colors` cast to `[string, string, ...string[]]` — expo-linear-gradient requires a tuple type, not `string[]`
- `Button.tsx` — `ButtonProps` now uses `Omit<PressableProps, 'style' | 'children'>` + `children?: React.ReactNode` to override Pressable's function-children union type

---

## Phase 4 — Location & real API (next)

**Priority order:**

1. **Add API key** — set `WEATHER_API_KEY` in `app.json` `extra` block; it's already wired in `src/config/env.ts`
2. **Wire Today screen** — replace `MOCK_WEATHER` / `MOCK_HOURLY` with `useCurrentWeather` + `useWeatherForecast` hooks from `src/features/weather/hooks/`
3. **Wire Forecast screen** — replace `MOCK_DAILY` with live forecast data from the same query
4. **GPS flow** — install `expo-location`, call `requestForegroundPermissionsAsync`, store coords in Zustand `activeLocation`; Today screen already reads `activeLocation` from store
5. **Location search screen** — new `app/search.tsx` stack screen; `Input` component driving OWM geocoding; results stored via `addSavedLocation` / `setActiveLocation`
6. **Error & empty states** — network error banners, retry `Button`, empty location state on first launch
7. **Pull-to-refresh** — `RefreshControl` on all `ScrollView`s calling React Query `refetch()`
