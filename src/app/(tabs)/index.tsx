import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatGrid } from '@/components/weather/StatBadge';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { HourlyForecastCard } from '@/components/weather/HourlyForecastCard';
import { DailyForecastCard } from '@/components/weather/DailyForecastCard';
import {
  HourlyScrollSkeleton,
  DailyListSkeleton,
  StatGridSkeleton,
} from '@/components/weather/WeatherCardSkeleton';

import { getConditionGradient, getCurrentSkyGradient } from '@/design/gradients';
import { GlassColors, Radius } from '@/design/tokens';
import { useWeatherStore } from '@/store/weather.store';
import { convertTemperature, convertWindSpeed } from '@/utils/weather';

import type { CurrentWeather, DailyForecast, HourlyForecast, WeatherLocation } from '@/features/weather/types';
import type { StatBadgeProps } from '@/components/weather/StatBadge';

// ─── Mock data ─────────────────────────────────────────────────────────────────

const NOW = Date.now();
const HOUR = 3_600_000;
const DAY = 86_400_000;

function nextDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

const DATES = nextDates(7);

const MOCK_LOCATION: WeatherLocation = {
  id: 'paris-1',
  name: 'Paris',
  country: 'FR',
  coordinates: { lat: 48.8566, lon: 2.3522 },
  isCurrentLocation: true,
};

const MOCK_WEATHER: CurrentWeather = {
  locationId: 'paris-1',
  temperature: 22,
  feelsLike: 21,
  humidity: 62,
  windSpeed: 3.8,
  windDirection: 225,
  condition: 'clear',
  description: 'clear sky',
  iconCode: '01d',
  visibility: 10_000,
  uvIndex: 6,
  pressure: 1018,
  updatedAt: NOW,
};

const MOCK_HOURLY: HourlyForecast[] = [
  { timestamp: NOW + 0 * HOUR, temperature: 22, condition: 'clear',        iconCode: '01d', precipitationChance: 0  },
  { timestamp: NOW + 1 * HOUR, temperature: 23, condition: 'clear',        iconCode: '01d', precipitationChance: 0  },
  { timestamp: NOW + 2 * HOUR, temperature: 24, condition: 'clear',        iconCode: '01d', precipitationChance: 0  },
  { timestamp: NOW + 3 * HOUR, temperature: 24, condition: 'clear',        iconCode: '01d', precipitationChance: 0  },
  { timestamp: NOW + 4 * HOUR, temperature: 23, condition: 'clouds',       iconCode: '02d', precipitationChance: 5  },
  { timestamp: NOW + 5 * HOUR, temperature: 22, condition: 'clouds',       iconCode: '03d', precipitationChance: 10 },
  { timestamp: NOW + 6 * HOUR, temperature: 20, condition: 'clouds',       iconCode: '04d', precipitationChance: 18 },
  { timestamp: NOW + 7 * HOUR, temperature: 19, condition: 'rain',         iconCode: '10d', precipitationChance: 48 },
  { timestamp: NOW + 8 * HOUR, temperature: 18, condition: 'rain',         iconCode: '10d', precipitationChance: 65 },
  { timestamp: NOW + 9 * HOUR, temperature: 17, condition: 'rain',         iconCode: '10n', precipitationChance: 72 },
  { timestamp: NOW + 10 * HOUR, temperature: 17, condition: 'drizzle',     iconCode: '09n', precipitationChance: 40 },
  { timestamp: NOW + 11 * HOUR, temperature: 16, condition: 'clouds',      iconCode: '04n', precipitationChance: 15 },
  { timestamp: NOW + 12 * HOUR, temperature: 16, condition: 'clouds',      iconCode: '04n', precipitationChance: 8  },
  { timestamp: NOW + 13 * HOUR, temperature: 15, condition: 'clouds',      iconCode: '04n', precipitationChance: 5  },
];

const MOCK_DAILY: DailyForecast[] = [
  { date: DATES[0], tempMin: 17, tempMax: 24, condition: 'clear',       iconCode: '01d', precipitationChance: 0,  humidity: 62, windSpeed: 3.8, sunrise: NOW - 6 * HOUR, sunset: NOW + 8 * HOUR  },
  { date: DATES[1], tempMin: 15, tempMax: 21, condition: 'clouds',      iconCode: '03d', precipitationChance: 20, humidity: 70, windSpeed: 5.2, sunrise: NOW + DAY - 6 * HOUR, sunset: NOW + DAY + 8 * HOUR },
  { date: DATES[2], tempMin: 13, tempMax: 18, condition: 'rain',        iconCode: '10d', precipitationChance: 75, humidity: 84, windSpeed: 6.1, sunrise: NOW + 2 * DAY - 6 * HOUR, sunset: NOW + 2 * DAY + 8 * HOUR },
  { date: DATES[3], tempMin: 12, tempMax: 16, condition: 'thunderstorm',iconCode: '11d', precipitationChance: 90, humidity: 91, windSpeed: 8.4, sunrise: NOW + 3 * DAY - 6 * HOUR, sunset: NOW + 3 * DAY + 8 * HOUR },
  { date: DATES[4], tempMin: 14, tempMax: 19, condition: 'clouds',      iconCode: '04d', precipitationChance: 30, humidity: 75, windSpeed: 4.1, sunrise: NOW + 4 * DAY - 6 * HOUR, sunset: NOW + 4 * DAY + 8 * HOUR },
  { date: DATES[5], tempMin: 16, tempMax: 23, condition: 'clear',       iconCode: '01d', precipitationChance: 5,  humidity: 60, windSpeed: 3.2, sunrise: NOW + 5 * DAY - 6 * HOUR, sunset: NOW + 5 * DAY + 8 * HOUR },
  { date: DATES[6], tempMin: 18, tempMax: 26, condition: 'clear',       iconCode: '01d', precipitationChance: 0,  humidity: 55, windSpeed: 2.8, sunrise: NOW + 6 * DAY - 6 * HOUR, sunset: NOW + 6 * DAY + 8 * HOUR },
];

// ─── Layout constants ──────────────────────────────────────────────────────────

const HERO_FADE_START = 100;
const HERO_FADE_END = 240;
const MINI_HEADER_FADE_START = 160;
const MINI_HEADER_FADE_END = 230;

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { temperatureUnit, windSpeedUnit } = useWeatherStore();

  // Simulate a brief loading state so skeletons are visible on first launch
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1600);
    return () => clearTimeout(t);
  }, []);

  // ─── Derived values ──────────────────────────────────────────────────────────

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 20 || currentHour < 6;

  const temp     = convertTemperature(MOCK_WEATHER.temperature, temperatureUnit);
  const feelsLike = convertTemperature(MOCK_WEATHER.feelsLike, temperatureUnit);
  const todayHigh = convertTemperature(MOCK_DAILY[0].tempMax, temperatureUnit);
  const todayLow  = convertTemperature(MOCK_DAILY[0].tempMin, temperatureUnit);
  const wind      = convertWindSpeed(MOCK_WEATHER.windSpeed, windSpeedUnit);
  const unitLabel = temperatureUnit === 'celsius' ? 'C' : 'F';

  const description =
    MOCK_WEATHER.description.charAt(0).toUpperCase() +
    MOCK_WEATHER.description.slice(1);

  // Background: blend sky gradient with condition colours
  const condGradient = getConditionGradient(MOCK_WEATHER.condition, isNight);
  const skyGradient  = getCurrentSkyGradient();
  // Use condition gradient (more specific) as primary source
  const bgColors = condGradient.colors as [string, string, ...string[]];
  const bgStart  = condGradient.start  ?? { x: 0, y: 0 };
  const bgEnd    = condGradient.end    ?? { x: 0, y: 1 };

  const statsData = useMemo<StatBadgeProps[]>(() => [
    { stat: 'humidity',   value: `${MOCK_WEATHER.humidity}%`                         },
    { stat: 'wind',       value: `${wind} ${windSpeedUnit}`, detail: 'SW'             },
    { stat: 'feelsLike',  value: `${feelsLike}°${unitLabel}`                          },
    { stat: 'uv',         value: String(MOCK_WEATHER.uvIndex), detail: 'Moderate'     },
    { stat: 'pressure',   value: `${MOCK_WEATHER.pressure} hPa`                      },
    { stat: 'visibility', value: `${(MOCK_WEATHER.visibility / 1000).toFixed(0)} km` },
  ], [feelsLike, wind, windSpeedUnit, unitLabel]);

  // ─── Scroll-driven animations ────────────────────────────────────────────────

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Hero fades out + rises as you scroll
  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_FADE_START, HERO_FADE_END], [1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, HERO_FADE_END],
          [0, -HERO_FADE_END * 0.25],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  // Mini header slides down + fades in
  const miniHeaderAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [MINI_HEADER_FADE_START, MINI_HEADER_FADE_END],
      [0, 1],
      Extrapolation.CLAMP,
    ),
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [MINI_HEADER_FADE_START, MINI_HEADER_FADE_END],
          [-8, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* ── Full-screen sky gradient ── */}
      <LinearGradient
        colors={bgColors}
        start={bgStart}
        end={bgEnd}
        style={StyleSheet.absoluteFill}
      />

      {/* Depth overlay — subtle dark vignette */}
      <View style={[StyleSheet.absoluteFill, styles.depthOverlay]} />

      {/* ── Sticky mini header (appears on scroll) ── */}
      <Animated.View
        style={[
          styles.miniHeader,
          { paddingTop: insets.top + 8 },
          miniHeaderAnimStyle,
        ]}
        pointerEvents="none"
      >
        <View style={styles.miniHeaderInner}>
          <View style={styles.miniHeaderLeft}>
            <Text variant="footnote" style={styles.pinEmoji}>📍</Text>
            <Text variant="headline" weight="600" color="#FFFFFF">
              {MOCK_LOCATION.name}
            </Text>
          </View>
          <Text variant="title2" weight="300" color="#FFFFFF">
            {isLoading ? '—' : `${temp}°`}
          </Text>
        </View>
      </Animated.View>

      {/* ── Main scrollable content ── */}
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Safe area top spacer */}
        <View style={{ height: insets.top + 12 }} />

        {/* ── Scrolling top bar (location + search) ── */}
        <View style={styles.topBar}>
          <View style={styles.locationRow}>
            {MOCK_LOCATION.isCurrentLocation && (
              <Text variant="caption2" color={GlassColors.white50}>My Location</Text>
            )}
            <Text variant="headline" weight="600" color="#FFFFFF">
              {MOCK_LOCATION.name}
            </Text>
          </View>

          <Pressable
            style={styles.iconButton}
            accessibilityLabel="Search locations"
          >
            <SymbolView
              name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
              size={18}
              tintColor="#FFFFFF"
            />
          </Pressable>
        </View>

        {/* ── Hero — temperature floats over gradient ── */}
        <Animated.View entering={FadeInDown.delay(60).duration(600)}>
          <Animated.View style={[styles.hero, heroAnimStyle]}>
            {isLoading ? (
              <HeroSkeleton />
            ) : (
              <View style={styles.heroContent}>
                {/* Large weather icon */}
                <WeatherIcon
                  condition={MOCK_WEATHER.condition}
                  isNight={isNight}
                  size="2xl"
                />

                {/* Temperature */}
                <Text
                  variant="display"
                  weight="200"
                  color="#FFFFFF"
                  style={styles.temperature}
                >
                  {temp}°
                </Text>

                {/* Condition label */}
                <Text
                  variant="title3"
                  weight="400"
                  color="rgba(255,255,255,0.80)"
                  style={styles.centered}
                >
                  {description}
                </Text>

                {/* High / Low */}
                <View style={styles.highLowRow}>
                  <Text variant="callout" color="rgba(255,255,255,0.65)">
                    H: {todayHigh}°
                  </Text>
                  <Text
                    variant="callout"
                    color="rgba(255,255,255,0.35)"
                    style={styles.highLowSep}
                  >
                    ·
                  </Text>
                  <Text variant="callout" color="rgba(255,255,255,0.65)">
                    L: {todayLow}°
                  </Text>
                </View>
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {/* ── Content cards ── */}
        <View style={styles.cards}>
          {isLoading ? (
            <>
              <HourlyScrollSkeleton count={7} />
              <DailyListSkeleton count={7} />
              <StatGridSkeleton />
            </>
          ) : (
            <>
              {/* Hourly forecast */}
              <Animated.View entering={FadeInUp.delay(100).duration(500)}>
                <HourlyForecastCard
                  items={MOCK_HOURLY}
                  isNight={isNight}
                  unit={temperatureUnit}
                />
              </Animated.View>

              {/* 7-day forecast */}
              <Animated.View entering={FadeInUp.delay(220).duration(500)}>
                <DailyForecastCard
                  items={MOCK_DAILY}
                  unit={temperatureUnit}
                />
              </Animated.View>

              {/* Weather stats grid */}
              <Animated.View entering={FadeInUp.delay(340).duration(500)}>
                <StatGrid stats={statsData} />
              </Animated.View>
            </>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ─── Hero skeleton (inline — not a GlassCard, matches floating hero layout) ───

function HeroSkeleton() {
  return (
    <View style={[styles.heroContent, { gap: 16 }]}>
      <Skeleton width={96} height={96} borderRadius={Radius.full} />
      <Skeleton width={140} height={88} borderRadius={Radius.lg} />
      <Skeleton width={120} height={22} borderRadius={Radius.sm} />
      <View style={styles.highLowRow}>
        <Skeleton width={52} height={16} borderRadius={Radius.xs} />
        <Skeleton width={52} height={16} borderRadius={Radius.xs} />
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0C0A1E',
  },
  depthOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
  },

  // Mini sticky header
  miniHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: 'rgba(10, 12, 30, 0.70)',
    borderBottomWidth: 0.5,
    borderBottomColor: GlassColors.white10,
  },
  miniHeaderInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  miniHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pinEmoji: {
    fontSize: 12,
    lineHeight: 16,
  },

  // Scroll content
  scrollContent: {
    flexGrow: 1,
  },

  // Top bar (scrolls away)
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  locationRow: {
    alignItems: 'flex-start',
    gap: 1,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: GlassColors.white10,
    borderWidth: 1,
    borderColor: GlassColors.white20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  // Hero section
  hero: {
    paddingTop: 12,
    paddingBottom: 36,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    gap: 6,
  },
  temperature: {
    letterSpacing: -4,
    marginTop: -4,
  },
  centered: {
    textAlign: 'center',
  },
  highLowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  highLowSep: {
    opacity: 0.4,
  },

  // Content cards area
  cards: {
    paddingHorizontal: 16,
    gap: 14,
  },
});
