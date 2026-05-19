# Project Memory

## Project status
Two phases complete. Ready to build screens.

| Phase | Status |
|---|---|
| 1 — Architecture & infrastructure | ✅ Done |
| 2 — Design system & UI components | ✅ Done |
| 3 — Screen implementation | ⬜ Next |
| 4 — Location features | ⬜ Planned |
| 5 — Polish & animations | ⬜ Planned |

---

## Full dependency manifest

### Core runtime
| Package | Version |
|---|---|
| expo | ~55.0.25 |
| react-native | 0.83.6 |
| react | 19.2.0 |
| expo-router | ~55.0.15 |
| typescript | ~5.9.2 |

### Styling & design system
| Package | Version | Purpose |
|---|---|---|
| nativewind | ^4.2.4 | `className` prop on all RN components |
| tailwindcss | ^3.4.19 | Tailwind v3 — required by NativeWind v4 |
| expo-linear-gradient | ~55.0.14 | Button gradients, sky backgrounds |
| expo-glass-effect | ~55.0.11 | Native iOS 26 glass via `GlassView` |

### State & data fetching
| Package | Version |
|---|---|
| zustand | ^5.0.13 |
| @tanstack/react-query | ^5.100.11 |
| axios | ^1.16.1 |

### Navigation
| Package | Version |
|---|---|
| @react-navigation/native | ^7.1.33 |
| @react-navigation/bottom-tabs | ^7.15.5 |
| @react-navigation/elements | ^2.9.10 |
| react-native-screens | ~4.23.0 |
| react-native-safe-area-context | ~5.6.2 |

### Animation & gestures
| Package | Version |
|---|---|
| react-native-reanimated | 4.2.1 |
| react-native-gesture-handler | ~2.30.0 |
| react-native-worklets | 0.7.4 |

### Expo modules
| Package | Version |
|---|---|
| expo-splash-screen | ~55.0.21 |
| expo-font | ~55.0.8 |
| expo-constants | ~55.0.16 |
| expo-device | ~55.0.17 |
| expo-image | ~55.0.10 |
| expo-symbols | ~55.0.9 |
| expo-linking | ~55.0.15 |
| expo-status-bar | ~55.0.6 |
| expo-system-ui | ~55.0.18 |
| expo-web-browser | ~55.0.16 |

---

## Architecture pattern
Feature-sliced design. Rule: features never import from each other.

```
src/
├── app/                              # Expo Router — file-based routing
│   ├── _layout.tsx                   # Root: AppProviders → ThemeProvider → Stack
│   ├── +not-found.tsx
│   └── (tabs)/
│       ├── _layout.tsx               # Tab navigator
│       ├── index.tsx                 # Today screen (stub)
│       ├── forecast.tsx              # Forecast screen (stub)
│       └── settings.tsx              # Settings screen (stub)
│
├── design/                           # Design system foundation
│   ├── tokens.ts                     # Typography, Spacing, Radius, Shadows, GlassColors, Duration
│   └── gradients.ts                  # SkyGradients + ConditionGradients, helper functions
│
├── components/
│   ├── ui/                           # Primitive design-system components
│   │   ├── Text.tsx                  # iOS HIG type scale via variant prop
│   │   ├── Badge.tsx                 # solid / glass / outline / tinted
│   │   ├── Button.tsx                # primary (gradient) / secondary / ghost / icon
│   │   ├── Card.tsx                  # default / elevated / flat, dark mode aware
│   │   ├── GlassCard.tsx             # GlassView (iOS 26+) with fallback
│   │   ├── Input.tsx                 # default / glass, focus animation, clear button
│   │   ├── Skeleton.tsx              # Reanimated shimmer + SkeletonText / SkeletonCircle
│   │   └── Divider.tsx               # horizontal / vertical, glass-friendly
│   │
│   └── weather/                      # Weather domain components
│       ├── WeatherIcon.tsx           # condition → emoji, day/night, 6 sizes
│       ├── CurrentWeatherCard.tsx    # Hero card — temp, condition, badges, footer
│       ├── HourlyItem.tsx            # Vertical chip — time, icon, rain%, temp
│       ├── DailyItem.tsx             # Row — day, icon, rain%, temp range bar
│       ├── StatBadge.tsx             # Stat pill + StatGrid 2-col wrapper
│       └── WeatherCardSkeleton.tsx   # 4 exports: card, hourly, daily, stat skeletons
│
├── features/weather/                 # Self-contained feature slice
│   ├── api/weather.api.ts            # fetchCurrentWeather + fetchWeatherForecast (OWM)
│   ├── hooks/                        # useCurrentWeather, useWeatherForecast
│   └── types/index.ts                # WeatherCondition, CurrentWeather, DailyForecast, …
│
├── store/weather.store.ts            # Zustand: activeLocation, savedLocations, units, themeMode
├── providers/app-providers.tsx       # QueryClientProvider — add all future providers here
├── lib/
│   ├── axios.ts                      # Axios instance (baseURL, timeout, error interceptor)
│   └── query-client.ts               # Singleton QueryClient (stale 5m, gc 10m, retry 2)
├── config/
│   ├── constants.ts                  # API URLs, cache durations, limits
│   └── env.ts                        # WEATHER_API_KEY via expo-constants.expoConfig.extra
├── hooks/
│   └── use-app-theme.ts              # Zustand themeMode + system colorScheme → isDark
├── utils/
│   ├── weather.ts                    # convertTemperature, convertWindSpeed, getWeatherBackground
│   └── format.ts                     # formatTime, formatDate, formatWeekday, formatTemperature
└── types/index.ts                    # Coordinates, TemperatureUnit, WindSpeedUnit, ThemeMode
```

---

## Config files

| File | Key detail |
|---|---|
| `babel.config.js` | `jsxImportSource: nativewind` + `nativewind/babel` preset |
| `metro.config.js` | `withNativeWind(config, { input: './src/global.css' })` |
| `tailwind.config.js` | Extended: `sky.*`, `glass.*`, `surface.*`, `content.*`, `weather.*`, iOS font-size scale, opacity scale |
| `nativewind-env.d.ts` | `/// <reference types="nativewind/types" />` |
| `tsconfig.json` | strict mode, `@/*` → `./src/*`, `@/assets/*` → `./assets/*` |
| `src/global.css` | `@tailwind base/components/utilities` + CSS custom properties |

---

## Design system decisions

### Styling approach
- All new components use NativeWind `className` exclusively for layout, spacing, color utilities
- `style` prop reserved for: iOS shadow objects, dynamic rgba colors, Reanimated animated styles
- No `StyleSheet.create()` anywhere in the design system — deliberate, keep it that way

### Typography
- Full iOS HIG scale in `src/design/tokens.ts` — `display` (96px / weight 200) down to `caption2` (11px)
- `Text` component resolves `ui-rounded` font on iOS for the `display` variant (big temperature number)
- Pair `<Text variant="display">` with `weight` override for fine control

### Glass effects
- `GlassCard` calls `isGlassEffectAPIAvailable()` at render — uses native `GlassView` on iOS 26+, falls back to semi-transparent `View` on Android and older iOS
- `glassStyle` prop: `'regular'` (standard) or `'clear'` (thinner). Default: `'regular'`
- `colorScheme` prop: `'auto' | 'light' | 'dark'` — use `'dark'` when placing glass over dark gradients

### Shadows
- Defined as RN `ViewStyle` objects in `Shadows` from `tokens.ts` — spread directly into `style` prop
- Coloured glow variants: `Shadows.blue`, `Shadows.purple`, `Shadows.amber` — use on condition-tinted cards
- `GlassCard` accepts a `glowColor` prop which overrides the shadow color with 30% opacity

### Gradients
- `getConditionGradient(condition, isNight)` → `GradientConfig` ready for `<LinearGradient colors={...} start={...} end={...} />`
- `getCurrentSkyGradient()` → ambient sky based on current local hour (9 time-of-day bands)
- `getSkyPeriod(hour)` → `SkyPeriod` string — useful for picking themed icons or background overlays

### Button
- `primary` wraps content in `LinearGradient` (default `#60A5FA → #3B82F6`)
- `gradientFrom` / `gradientTo` props let any screen override the gradient for condition-matched buttons
- Press animation: Reanimated `withTiming(0.96)` scale — fast (150ms in, 150ms out)

### Skeleton
- Single pulsing opacity animation (`withRepeat`, sin-wave easing, infinite)
- `SkeletonText` and `SkeletonCircle` are convenience wrappers — prefer these over raw `Skeleton` in loading states
- `WeatherCardSkeleton.tsx` exports 4 layout-matched variants: `WeatherCardSkeleton`, `HourlyScrollSkeleton`, `DailyListSkeleton`, `StatGridSkeleton`

### DailyItem temperature bar
- Requires `globalMin` and `globalMax` (across the full 7-day range) so all rows share a normalised scale
- Compute these in the parent before rendering the list

---

## Architecture decisions

- **API key**: never hardcoded — lives in `app.json` `extra` block, read via `expo-constants`
- **queryClient**: module-level singleton, not created inside a component
- **Unit conversion**: API returns metric; conversion to user preference happens at render time in `utils/weather.ts`
- **Theme**: Zustand stores `'light' | 'dark' | 'system'`; `useAppTheme` resolves → `isDark: boolean`
- **NativeWind entry**: `global.css` is the first import in `_layout.tsx`
- **Tab routing**: `(tabs)/` group — parentheses keep "tabs" out of the URL

---

## Weather API
- Provider: OpenWeatherMap
- Current: `GET /weather?lat&lon&appid&units=metric`
- Forecast: `GET /forecast?lat&lon&cnt=40&appid&units=metric` (40 × 3h slots → 7 daily via date-key dedup)

---

## Known boilerplate to remove
These Expo template files are still on disk — delete before building screens:
- `src/app/explore.tsx`, `src/app/index.tsx`
- `src/components/animated-icon.*`, `app-tabs.*`, `themed-text.tsx`, `themed-view.tsx`, `hint-row.tsx`, `external-link.tsx`, `web-badge.tsx`, `ui/collapsible.tsx`
- `src/constants/theme.ts`, `src/hooks/use-color-scheme.*`, `src/hooks/use-theme.ts` — replaceable by design system once screens are migrated
