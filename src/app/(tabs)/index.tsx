import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { Text } from '@/components/ui/Text';
import { DailyForecastCard } from '@/components/weather/DailyForecastCard';
import { HourlyForecastCard } from '@/components/weather/HourlyForecastCard';
import { StatGrid } from '@/components/weather/StatBadge';
import type { StatBadgeProps } from '@/components/weather/StatBadge';
import {
  DailyListSkeleton,
  HourlyScrollSkeleton,
  StatGridSkeleton,
} from '@/components/weather/WeatherCardSkeleton';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { getConditionGradient, getCurrentSkyGradient } from '@/design/gradients';
import { GlassColors, Radius } from '@/design/tokens';
import type { WeatherCondition } from '@/features/weather/types';
import { useWeatherData } from '@/features/weather/hooks/use-weather-data';
import { useLocation } from '@/hooks/use-location';
import { useSpringPress } from '@/hooks/use-spring-press';
import { useWeatherStore } from '@/store/weather.store';
import { convertTemperature, convertWindSpeed, degreesToCompass } from '@/utils/weather';

// ─── Layout constants ──────────────────────────────────────────────────────────

const HERO_FADE_START = 100;
const HERO_FADE_END = 240;
const MINI_HEADER_FADE_START = 160;
const MINI_HEADER_FADE_END = 230;

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { temperatureUnit, windSpeedUnit } = useWeatherStore();
  const { activeLocation, status: locationStatus, requestGPS } = useLocation();

  const coords = activeLocation?.coordinates ?? null;

  const { weather, forecast, isLoading, isError, hasData, refetch } =
    useWeatherData(coords);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // ─── Derived display values ──────────────────────────────────────────────────

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 20 || currentHour < 6;

  const condition = weather?.condition ?? 'clear';
  const skyGradient = getCurrentSkyGradient();
  const condGradient = getConditionGradient(condition, isNight);

  const activeBg = hasData ? condGradient : skyGradient;
  const bgColors = activeBg.colors as readonly string[];
  const bgStart = activeBg.start ?? { x: 0, y: 0 };
  const bgEnd = activeBg.end ?? { x: 0, y: 1 };

  const unitLabel = temperatureUnit === 'celsius' ? 'C' : 'F';
  const temp = weather ? convertTemperature(weather.temperature, temperatureUnit) : null;
  const feelsLike = weather ? convertTemperature(weather.feelsLike, temperatureUnit) : null;
  const todayHigh = forecast?.daily[0]
    ? convertTemperature(forecast.daily[0].tempMax, temperatureUnit)
    : null;
  const todayLow = forecast?.daily[0]
    ? convertTemperature(forecast.daily[0].tempMin, temperatureUnit)
    : null;
  const wind = weather ? convertWindSpeed(weather.windSpeed, windSpeedUnit) : null;
  const windDir = weather ? degreesToCompass(weather.windDirection) : '';

  const description =
    weather
      ? weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
      : '';

  const statsData = useMemo<StatBadgeProps[]>(() => {
    if (!weather) return [];
    return [
      { stat: 'humidity',   value: `${weather.humidity}%` },
      { stat: 'wind',       value: `${wind} ${windSpeedUnit}`, detail: windDir },
      { stat: 'feelsLike',  value: `${feelsLike}°${unitLabel}` },
      { stat: 'uv',         value: weather.uvIndex ? String(weather.uvIndex) : '—' },
      { stat: 'pressure',   value: `${weather.pressure} hPa` },
      { stat: 'visibility', value: `${(weather.visibility / 1000).toFixed(0)} km` },
    ];
  }, [weather, wind, windSpeedUnit, windDir, feelsLike, unitLabel]);

  // ─── Animated background crossfade ──────────────────────────────────────────
  // Two gradient layers: layer1 is the stable baseline, layer2 fades in on
  // condition change, then layer1 updates to match and layer2 resets to invisible.

  const [layer1Colors, setLayer1Colors] = useState<readonly string[]>(bgColors);
  const [layer2Colors, setLayer2Colors] = useState<readonly string[]>(bgColors);
  const layer2Opacity = useSharedValue(0);

  const bgColorsRef = useRef<readonly string[]>(bgColors);
  bgColorsRef.current = bgColors;

  const gradKey = `${hasData ? condition : '__loading'}-${isNight ? 'n' : 'd'}`;
  const gradKeyRef = useRef(gradKey); // Pre-seeded so mount never triggers a transition

  useEffect(() => {
    if (gradKey === gradKeyRef.current) return;
    gradKeyRef.current = gradKey;

    const next = bgColorsRef.current;
    setLayer2Colors(next);
    layer2Opacity.value = 0;
    layer2Opacity.value = withTiming(
      1,
      { duration: 1100, easing: Easing.inOut(Easing.quad) },
      (done) => {
        if (done) {
          runOnJS(setLayer1Colors)(next);
          layer2Opacity.value = 0;
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradKey]);

  const layer2AnimStyle = useAnimatedStyle(() => ({
    opacity: layer2Opacity.value,
  }));

  // ─── Scroll-driven animations ────────────────────────────────────────────────

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  // Background parallax — gradient moves up at 15% of scroll speed
  const bgParallaxStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, 600],
          [0, -40],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

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

  // ─── Menu button spring ──────────────────────────────────────────────────────

  const menuPress = useSpringPress({ scale: 0.86, damping: 12, stiffness: 280 });

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* ── Two-layer animated gradient background ── */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { bottom: -50 }, bgParallaxStyle]}
        pointerEvents="none"
      >
        <LinearGradient
          colors={layer1Colors as [string, string, ...string[]]}
          start={bgStart}
          end={bgEnd}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[StyleSheet.absoluteFill, layer2AnimStyle]}>
          <LinearGradient
            colors={layer2Colors as [string, string, ...string[]]}
            start={bgStart}
            end={bgEnd}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </Animated.View>

      <View style={[StyleSheet.absoluteFill, styles.depthOverlay]} pointerEvents="none" />

      {/* ── No-location empty state ── */}
      {!activeLocation ? (
        <View
          style={[
            styles.emptyState,
            { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 },
          ]}
        >
          <Text variant="title1" color="#FFFFFF" style={styles.emptyIcon}>🌤️</Text>
          <Text variant="title1" weight="700" color="#FFFFFF">
            No Location Set
          </Text>
          <Text variant="body" color={GlassColors.white50} style={styles.emptySubtitle}>
            Allow location access to see local weather, or search for any city.
          </Text>
          <Button
            variant="primary"
            label={locationStatus === 'requesting' ? 'Locating…' : 'Use My Location'}
            loading={locationStatus === 'requesting'}
            onPress={requestGPS}
            fullWidth
          />
          <Button
            variant="secondary"
            label="Search Cities"
            onPress={() => router.push('/search')}
            fullWidth
          />
          {locationStatus === 'denied' && (
            <Text variant="caption1" color="rgba(255,120,120,0.9)" style={styles.deniedNote}>
              Location permission denied. Please enable it in Settings.
            </Text>
          )}
        </View>
      ) : (
        <>
          {/* ── Sticky mini header ── */}
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
                  {activeLocation.name}
                </Text>
              </View>
              <Text variant="title2" weight="300" color="#FFFFFF">
                {temp !== null ? `${temp}°` : '—'}
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
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor="#FFFFFF"
                titleColor="#FFFFFF"
              />
            }
          >
            <View style={{ height: insets.top + 12 }} />

            {/* Top bar */}
            <View style={styles.topBar}>
              <View style={styles.locationRow}>
                {activeLocation.isCurrentLocation && (
                  <Text variant="caption2" color={GlassColors.white50}>
                    My Location
                  </Text>
                )}
                <Text variant="headline" weight="600" color="#FFFFFF">
                  {activeLocation.name}
                </Text>
              </View>
              <Animated.View style={menuPress.animStyle}>
                <Pressable
                  style={styles.iconButton}
                  onPress={() => router.push('/search')}
                  onPressIn={menuPress.onPressIn}
                  onPressOut={menuPress.onPressOut}
                  accessibilityLabel="Search locations"
                >
                  <SymbolView
                    name={{ ios: 'line.3.horizontal', android: 'menu', web: 'menu' }}
                    size={18}
                    tintColor="#FFFFFF"
                  />
                </Pressable>
              </Animated.View>
            </View>

            {/* Hero */}
            <Animated.View entering={FadeInDown.delay(60).duration(600)}>
              <Animated.View style={[styles.hero, heroAnimStyle]}>
                {isLoading ? (
                  <HeroSkeleton />
                ) : isError ? (
                  <ErrorHero onRetry={onRefresh} />
                ) : (
                  <View style={styles.heroContent}>
                    <FloatingWeatherIcon condition={condition} isNight={isNight} />
                    <Text
                      variant="display"
                      weight="200"
                      color="#FFFFFF"
                      style={styles.temperature}
                    >
                      {temp}°
                    </Text>
                    <Text
                      variant="title3"
                      weight="400"
                      color="rgba(255,255,255,0.80)"
                      style={styles.centered}
                    >
                      {description}
                    </Text>
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

            {/* Content cards */}
            <View style={styles.cards}>
              {isLoading ? (
                <>
                  <HourlyScrollSkeleton count={7} />
                  <DailyListSkeleton count={7} />
                  <StatGridSkeleton />
                </>
              ) : !isError && forecast ? (
                <>
                  <Animated.View entering={FadeInUp.delay(100).duration(500)}>
                    <HourlyForecastCard
                      items={forecast.hourly}
                      isNight={isNight}
                      unit={temperatureUnit}
                    />
                  </Animated.View>
                  <Animated.View entering={FadeInUp.delay(220).duration(500)}>
                    <DailyForecastCard items={forecast.daily} unit={temperatureUnit} />
                  </Animated.View>
                  <Animated.View entering={FadeInUp.delay(340).duration(500)}>
                    <StatGrid stats={statsData} />
                  </Animated.View>
                </>
              ) : null}
            </View>
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
}

// ─── Floating weather icon ─────────────────────────────────────────────────────
// Gentle sine-wave float — runs entirely on the UI thread.

function FloatingWeatherIcon({
  condition,
  isNight,
}: {
  condition: WeatherCondition;
  isNight: boolean;
}) {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 2400, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [floatY]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  return (
    <Animated.View style={floatStyle}>
      <WeatherIcon condition={condition} isNight={isNight} size="2xl" />
    </Animated.View>
  );
}

// ─── Hero skeleton ─────────────────────────────────────────────────────────────

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

// ─── Error hero ────────────────────────────────────────────────────────────────

function ErrorHero({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={[styles.heroContent, { gap: 14 }]}>
      <Text variant="title1" color="#FFFFFF">⚠️</Text>
      <Text variant="title3" weight="600" color="#FFFFFF" style={styles.centered}>
        Could not load weather
      </Text>
      <Text variant="callout" color={GlassColors.white50} style={styles.centered}>
        Check your connection and try again.
      </Text>
      <Button variant="secondary" label="Retry" onPress={onRetry} size="sm" />
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

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 14,
  },
  emptyIcon: {
    fontSize: 56,
    lineHeight: 68,
    marginBottom: 4,
  },
  emptySubtitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  deniedNote: {
    textAlign: 'center',
    marginTop: 4,
  },

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

  scrollContent: {
    flexGrow: 1,
  },

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

  cards: {
    paddingHorizontal: 16,
    gap: 14,
  },
});
