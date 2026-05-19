# Project Memory

## Overview
Production-ready weather app — React Native + Expo SDK 55.
Architecture phase complete. No real screens built yet.

---

## Exact Dependency Versions

### Core runtime
| Package | Version |
|---|---|
| expo | ~55.0.25 |
| react-native | 0.83.6 |
| react | 19.2.0 |
| expo-router | ~55.0.15 |
| typescript | ~5.9.2 |

### Styling
| Package | Version |
|---|---|
| nativewind | ^4.2.4 |
| tailwindcss | ^3.4.19 |

### State & data fetching
| Package | Version |
|---|---|
| zustand | ^5.0.13 |
| @tanstack/react-query | ^5.100.11 |
| axios | ^1.16.1 |

### Navigation (pre-installed)
| Package | Version |
|---|---|
| @react-navigation/native | ^7.1.33 |
| @react-navigation/bottom-tabs | ^7.15.5 |
| @react-navigation/elements | ^2.9.10 |
| react-native-screens | ~4.23.0 |
| react-native-safe-area-context | ~5.6.2 |

### Animation & gestures (pre-installed)
| Package | Version |
|---|---|
| react-native-reanimated | 4.2.1 |
| react-native-gesture-handler | ~2.30.0 |
| react-native-worklets | 0.7.4 |

### Expo modules (pre-installed)
`expo-splash-screen`, `expo-font`, `expo-constants`, `expo-device`,
`expo-image`, `expo-glass-effect`, `expo-linking`, `expo-status-bar`,
`expo-symbols`, `expo-system-ui`, `expo-web-browser`

---

## Architecture Pattern
Feature-sliced design. Rule: features never import from each other.

```
src/
├── app/                        # Expo Router — file-based routing
│   ├── _layout.tsx             # Root: AppProviders → ThemeProvider → Stack
│   ├── +not-found.tsx
│   └── (tabs)/
│       ├── _layout.tsx         # Tab navigator (Today / Forecast / Settings)
│       ├── index.tsx           # Today screen stub
│       ├── forecast.tsx        # Forecast screen stub
│       └── settings.tsx        # Settings screen stub
│
├── features/weather/           # Self-contained feature slice
│   ├── api/weather.api.ts      # Raw OWM fetch functions (no hooks)
│   ├── hooks/                  # useCurrentWeather, useWeatherForecast
│   └── types/index.ts          # All weather domain types
│
├── store/weather.store.ts      # Zustand: locations, units, themeMode
├── providers/app-providers.tsx # QueryClientProvider (add providers here)
├── lib/
│   ├── axios.ts                # Axios instance (baseURL, timeout, error interceptor)
│   └── query-client.ts         # Singleton QueryClient (stale: 5m, gc: 10m, retry: 2)
├── config/
│   ├── constants.ts            # API URLs, timeouts, limits
│   └── env.ts                  # WEATHER_API_KEY via expo-constants.expoConfig.extra
├── hooks/
│   └── use-app-theme.ts        # Resolves Zustand themeMode + system colorScheme → isDark
├── utils/
│   ├── weather.ts              # convertTemperature, convertWindSpeed, getWeatherBackground
│   └── format.ts               # formatTime, formatDate, formatWeekday, formatTemperature
└── types/index.ts              # Shared: Coordinates, TemperatureUnit, WindSpeedUnit, ThemeMode
```

---

## Config Files

| File | Purpose |
|---|---|
| `babel.config.js` | `jsxImportSource: nativewind` + `nativewind/babel` preset |
| `metro.config.js` | `withNativeWind(config, { input: './src/global.css' })` |
| `tailwind.config.js` | content: `src/**`, `nativewind/preset`, weather color tokens |
| `nativewind-env.d.ts` | `/// <reference types="nativewind/types" />` — TS shim |
| `tsconfig.json` | strict, `@/*` → `./src/*`, `@/assets/*` → `./assets/*` |
| `src/global.css` | `@tailwind base/components/utilities` + CSS vars |

---

## Key Decisions
- **API key**: never hardcoded — lives in `app.json` `extra` block, read via `expo-constants`
- **queryClient**: module-level singleton, not created inside a component
- **Unit conversion**: API always returns metric; conversion to user preference done in `utils/weather.ts` at render time
- **Theme**: Zustand stores preference (`'light' | 'dark' | 'system'`); `useAppTheme` resolves to boolean `isDark`
- **NativeWind entry**: `global.css` imported as the very first line of `_layout.tsx`
- **Tab routing**: Expo Router group `(tabs)/` — parentheses prevent the word "tabs" from appearing in the URL/path

## Weather API
- Provider: OpenWeatherMap
- Current: `GET /weather?lat&lon&appid&units=metric`
- Forecast: `GET /forecast?lat&lon&cnt=40&appid&units=metric` (40 × 3h slots → 7 daily)

## Design Direction
- Apple-inspired, minimal, glass-morphism accents (`expo-glass-effect` available)
- Custom Tailwind tokens: `weather.sunny`, `weather.cloudy`, `weather.rainy`, `weather.stormy`, `weather.snowy`
- Dark mode via `useAppTheme` — all screens should branch on `isDark`

## Known Boilerplate to Remove
These files are leftovers from the Expo template and conflict with or are unused by the new architecture:
- `src/app/explore.tsx` — template screen, not wired anywhere
- `src/app/index.tsx` — superseded by `(tabs)/index.tsx`
- `src/components/animated-icon.*`, `app-tabs.*`, `themed-text.tsx`, `themed-view.tsx`, `hint-row.tsx`, `external-link.tsx`, `web-badge.tsx`, `ui/collapsible.tsx`
