import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
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
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
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
import { ConditionGlow, GlassColors, Radius } from '@/design/tokens';
import type { WeatherCondition } from '@/features/weather/types';
import { useWeatherData } from '@/features/weather/hooks/use-weather-data';
import { useLocation } from '@/hooks/use-location';
import { useSpringPress } from '@/hooks/use-spring-press';
import { useWeatherStore } from '@/store/weather.store';
import { convertTemperature, convertWindSpeed, degreesToCompass } from '@/utils/weather';

// ─── Constants ─────────────────────────────────────────────────────────────────

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const HERO_FADE_START = 100;
const HERO_FADE_END   = 260;
const MINI_FADE_START = 170;
const MINI_FADE_END   = 240;

const STAR_COUNT = 38;
const RAIN_COUNT = 30;
const SNOW_COUNT = 22;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function getGlowColor(condition: WeatherCondition, isNight: boolean): string {
  const entry = ConditionGlow[condition] ?? ConditionGlow.default;
  return isNight ? entry.night : entry.day;
}

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { temperatureUnit, windSpeedUnit } = useWeatherStore();
  const { activeLocation, status: locationStatus, requestGPS } = useLocation();

  const coords = activeLocation?.coordinates ?? null;

  const { weather, forecast, isLoading, isError, isOffline, hasData, dataUpdatedAt, refetch } =
    useWeatherData(coords);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  // ─── Derived values ──────────────────────────────────────────────────────────

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 20 || currentHour < 6;

  const condition  = weather?.condition ?? 'clear';
  const skyGrad    = getCurrentSkyGradient();
  const condGrad   = getConditionGradient(condition, isNight);
  const glowColor  = getGlowColor(condition, isNight);

  const activeBg  = hasData ? condGrad : skyGrad;
  const bgColors  = activeBg.colors as readonly string[];
  const bgStart   = activeBg.start ?? { x: 0, y: 0 };
  const bgEnd     = activeBg.end   ?? { x: 0, y: 1 };

  const unitLabel  = temperatureUnit === 'celsius' ? 'C' : 'F';
  const temp       = weather ? convertTemperature(weather.temperature, temperatureUnit) : null;
  const feelsLike  = weather ? convertTemperature(weather.feelsLike, temperatureUnit) : null;
  const todayHigh  = forecast?.daily[0] ? convertTemperature(forecast.daily[0].tempMax, temperatureUnit) : null;
  const todayLow   = forecast?.daily[0] ? convertTemperature(forecast.daily[0].tempMin, temperatureUnit) : null;
  const wind       = weather ? convertWindSpeed(weather.windSpeed, windSpeedUnit) : null;
  const windDir    = weather ? degreesToCompass(weather.windDirection) : '';
  const description = weather
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

  // ─── Animated gradient crossfade ─────────────────────────────────────────────

  const [layer1Colors, setLayer1Colors] = useState<readonly string[]>(bgColors);
  const [layer2Colors, setLayer2Colors] = useState<readonly string[]>(bgColors);
  const layer2Opacity  = useSharedValue(0);
  const bgColorsRef    = useRef<readonly string[]>(bgColors);
  bgColorsRef.current  = bgColors;

  const gradKey    = `${hasData ? condition : '__loading'}-${isNight ? 'n' : 'd'}`;
  const gradKeyRef = useRef(gradKey);

  useEffect(() => {
    if (gradKey === gradKeyRef.current) return;
    gradKeyRef.current = gradKey;
    const next = bgColorsRef.current;
    setLayer2Colors(next);
    layer2Opacity.value = 0;
    layer2Opacity.value = withTiming(
      1,
      { duration: 1200, easing: Easing.inOut(Easing.quad) },
      (done) => {
        if (done) {
          runOnJS(setLayer1Colors)(next);
          layer2Opacity.value = 0;
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gradKey]);

  const layer2AnimStyle = useAnimatedStyle(() => ({ opacity: layer2Opacity.value }));

  // ─── Scroll-driven animations ────────────────────────────────────────────────

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const bgParallaxStyle = useAnimatedStyle(() => ({
    transform: [{
      translateY: interpolate(scrollY.value, [0, 600], [0, -50], Extrapolation.CLAMP),
    }],
  }));

  const heroAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [HERO_FADE_START, HERO_FADE_END], [1, 0], Extrapolation.CLAMP),
    transform: [{
      translateY: interpolate(
        scrollY.value,
        [0, HERO_FADE_END],
        [0, -HERO_FADE_END * 0.22],
        Extrapolation.CLAMP,
      ),
    }],
  }));

  const miniHeaderAnimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [MINI_FADE_START, MINI_FADE_END], [0, 1], Extrapolation.CLAMP),
    transform: [{
      translateY: interpolate(scrollY.value, [MINI_FADE_START, MINI_FADE_END], [-10, 0], Extrapolation.CLAMP),
    }],
  }));

  // ─── Menu button spring ──────────────────────────────────────────────────────

  const menuPress = useSpringPress({ scale: 0.86, damping: 12, stiffness: 280 });

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* ── Two-layer animated gradient background ── */}
      <Animated.View
        style={[StyleSheet.absoluteFill, { bottom: -60 }, bgParallaxStyle]}
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

      {/* ── Atmospheric particles ── */}
      <ParticleLayer condition={condition} isNight={isNight} />

      {/* ── Dark depth overlay ── */}
      <View style={[StyleSheet.absoluteFill, styles.depthOverlay]} pointerEvents="none" />

      {/* ── Top status-bar gradient guard ── */}
      <LinearGradient
        colors={[bgColors[0] as string, `${bgColors[0]}00`]}
        style={[StyleSheet.absoluteFill, { height: insets.top + 72, bottom: undefined }]}
        pointerEvents="none"
      />

      {/* ── No-location empty state ── */}
      {!activeLocation ? (
        <View style={[styles.emptyState, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]}>
          <Text variant="title1" color="#FFFFFF" style={styles.emptyIcon}>🌤️</Text>
          <Text variant="title1" weight="700" color="#FFFFFF">No Location Set</Text>
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
          <Button variant="secondary" label="Search Cities" onPress={() => router.push('/search')} fullWidth />
          {locationStatus === 'denied' && (
            <Text variant="caption1" color="rgba(255,120,120,0.9)" style={styles.deniedNote}>
              Location permission denied. Please enable it in Settings.
            </Text>
          )}
        </View>

      ) : isError && isOffline && !hasData ? (
        /* ── Offline, no cached data ── */
        <View style={[styles.emptyState, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100 }]}>
          <Text variant="title1" color="#FFFFFF" style={styles.emptyIcon}>📡</Text>
          <Text variant="title1" weight="700" color="#FFFFFF">You're Offline</Text>
          <Text variant="body" color={GlassColors.white50} style={styles.emptySubtitle}>
            No cached data available. Connect to the internet to see weather.
          </Text>
          <Button variant="secondary" label="Try Again" onPress={onRefresh} fullWidth />
        </View>

      ) : (
        <>
          {/* ── Sticky mini header ── */}
          <Animated.View
            style={[styles.miniHeader, { paddingTop: insets.top + 8 }, miniHeaderAnimStyle]}
            pointerEvents="none"
          >
            <View style={styles.miniHeaderInner}>
              <View style={styles.miniHeaderLeft}>
                <Text variant="footnote" style={styles.pinEmoji}>📍</Text>
                <Text variant="headline" weight="600" color="#FFFFFF">{activeLocation.name}</Text>
              </View>
              <Text variant="title2" weight="200" color="#FFFFFF">
                {temp !== null ? `${temp}°` : '—'}
              </Text>
            </View>
          </Animated.View>

          {/* ── Main scrollable content ── */}
          <Animated.ScrollView
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
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

            {/* ── Top bar ── */}
            <View style={styles.topBar}>
              <View style={styles.locationRow}>
                {activeLocation.isCurrentLocation && (
                  <Text variant="caption2" color={GlassColors.white50} style={styles.locationTypeLabel}>
                    MY LOCATION
                  </Text>
                )}
                <Text variant="title3" weight="600" color="#FFFFFF" style={styles.cityName}>
                  {activeLocation.name}
                </Text>
                <Text variant="footnote" color={GlassColors.white30}>
                  {activeLocation.country}
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

            {/* ── Offline banner ── */}
            {isOffline && hasData && (
              <View style={styles.offlineBannerRow}>
                <OfflineBanner dataUpdatedAt={dataUpdatedAt} />
              </View>
            )}

            {/* ── Hero ── */}
            <Animated.View entering={FadeInDown.delay(60).duration(700)}>
              <Animated.View style={[styles.hero, heroAnimStyle]}>
                {isLoading ? (
                  <HeroSkeleton />
                ) : isError ? (
                  <ErrorHero onRetry={onRefresh} />
                ) : (
                  <View style={styles.heroContent}>
                    {/* Ambient glow orb */}
                    <GlowOrb color={glowColor} />

                    {/* Floating weather icon */}
                    <FloatingWeatherIcon condition={condition} isNight={isNight} />

                    {/* Temperature */}
                    <Text
                      variant="display"
                      weight="200"
                      color="#FFFFFF"
                      style={styles.temperature}
                    >
                      {temp}°
                    </Text>

                    {/* Description pill */}
                    <View style={styles.conditionBadge}>
                      <Text variant="subheadline" weight="500" color="rgba(255,255,255,0.92)">
                        {description}
                      </Text>
                    </View>

                    {/* High / Low / Feels like */}
                    <View style={styles.highLowRow}>
                      <Text variant="callout" weight="500" color="rgba(255,255,255,0.75)">
                        H:{todayHigh}°
                      </Text>
                      <Text variant="callout" color="rgba(255,255,255,0.28)" style={styles.dot}>·</Text>
                      <Text variant="callout" weight="500" color="rgba(255,255,255,0.75)">
                        L:{todayLow}°
                      </Text>
                      {feelsLike !== null && (
                        <>
                          <Text variant="callout" color="rgba(255,255,255,0.28)" style={styles.dot}>·</Text>
                          <Text variant="callout" color="rgba(255,255,255,0.50)">
                            Feels {feelsLike}°
                          </Text>
                        </>
                      )}
                    </View>
                  </View>
                )}
              </Animated.View>
            </Animated.View>

            {/* ── Curved glass sheet ── */}
            <View style={styles.sheet}>
              {/* Sheet handle pill */}
              <View style={styles.sheetHandle} />

              {/* Card content */}
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
                      <HourlyForecastCard items={forecast.hourly} isNight={isNight} unit={temperatureUnit} />
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
            </View>
          </Animated.ScrollView>
        </>
      )}
    </View>
  );
}

// ─── Floating weather icon ─────────────────────────────────────────────────────

function FloatingWeatherIcon({ condition, isNight }: { condition: WeatherCondition; isNight: boolean }) {
  const floatY = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-12, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
        withTiming(0,   { duration: 2600, easing: Easing.inOut(Easing.sin) }),
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
      <WeatherIcon condition={condition} isNight={isNight} size="3xl" />
    </Animated.View>
  );
}

// ─── Ambient glow orb ─────────────────────────────────────────────────────────

function GlowOrb({ color }: { color: string }) {
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 3800, easing: Easing.inOut(Easing.sin) }),
        withTiming(1.0,  { duration: 3800, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.75 + pulse.value * 0.08,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.glowOrb,
        {
          shadowColor: color,
          backgroundColor: `${color}18`,
        },
        animStyle,
      ]}
    />
  );
}

// ─── Atmospheric particle layer ────────────────────────────────────────────────

function ParticleLayer({ condition, isNight }: { condition: WeatherCondition; isNight: boolean }) {
  const showStars = isNight && (condition === 'clear' || condition === 'clouds' || condition === 'mist');
  const showRain  = condition === 'rain' || condition === 'drizzle' || condition === 'thunderstorm';
  const showSnow  = condition === 'snow';

  if (showStars) return <StarField />;
  if (showRain)  return <RainField />;
  if (showSnow)  return <SnowField />;
  return null;
}

// ─── Star field ───────────────────────────────────────────────────────────────

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  pulseDuration: number;
  pulseDelay: number;
}

function StarField() {
  const stars = useMemo<StarData[]>(() =>
    Array.from({ length: STAR_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_W,
      y: Math.random() * SCREEN_H * 0.68,
      size: 1.5 + Math.random() * 2.8,
      baseOpacity: 0.30 + Math.random() * 0.70,
      pulseDuration: 1600 + Math.random() * 3600,
      pulseDelay: Math.random() * 4000,
    })),
    [],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {stars.map(s => <StarDot key={s.id} {...s} />)}
    </View>
  );
}

function StarDot({ x, y, size, baseOpacity, pulseDuration, pulseDelay }: StarData) {
  const opacity = useSharedValue(baseOpacity);

  useEffect(() => {
    opacity.value = withDelay(
      pulseDelay,
      withRepeat(
        withSequence(
          withTiming(baseOpacity * 0.12, { duration: pulseDuration }),
          withTiming(baseOpacity,        { duration: pulseDuration }),
        ),
        -1,
        false,
      ),
    );
  }, [opacity, pulseDelay, baseOpacity, pulseDuration]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#FFFFFF',
      }, animStyle]}
    />
  );
}

// ─── Rain field ───────────────────────────────────────────────────────────────

interface RainData {
  id: number;
  x: number;
  length: number;
  opacity: number;
  duration: number;
  delay: number;
}

function RainField() {
  const drops = useMemo<RainData[]>(() =>
    Array.from({ length: RAIN_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_W,
      length: 22 + Math.random() * 36,
      opacity: 0.10 + Math.random() * 0.22,
      duration: 650 + Math.random() * 500,
      delay: Math.random() * 1200,
    })),
    [],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {drops.map(d => <RainStreak key={d.id} {...d} />)}
    </View>
  );
}

function RainStreak({ x, length, opacity: op, duration, delay }: RainData) {
  const translateY = useSharedValue(-length);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(SCREEN_H + length, { duration, easing: Easing.linear }),
          withTiming(-length,           { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
  }, [translateY, delay, length, duration]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        left: x,
        top: 0,
        width: 1.5,
        height: length,
        borderRadius: 1,
        backgroundColor: 'rgba(180, 215, 255, 0.7)',
        opacity: op,
      }, animStyle]}
    />
  );
}

// ─── Snow field ───────────────────────────────────────────────────────────────

interface SnowData {
  id: number;
  x: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  driftRange: number;
}

function SnowField() {
  const flakes = useMemo<SnowData[]>(() =>
    Array.from({ length: SNOW_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * SCREEN_W,
      size: 3 + Math.random() * 5,
      opacity: 0.45 + Math.random() * 0.55,
      duration: 3200 + Math.random() * 4000,
      delay: Math.random() * 5000,
      driftRange: 18 + Math.random() * 32,
    })),
    [],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {flakes.map(f => <SnowFlake key={f.id} {...f} />)}
    </View>
  );
}

function SnowFlake({ x, size, opacity: op, duration, delay, driftRange }: SnowData) {
  const translateY = useSharedValue(0);
  const drift      = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(SCREEN_H + size, { duration, easing: Easing.linear }),
          withTiming(0,               { duration: 0 }),
        ),
        -1,
        false,
      ),
    );
    drift.value = withRepeat(
      withSequence(
        withTiming( driftRange, { duration: duration * 0.65, easing: Easing.inOut(Easing.sin) }),
        withTiming(-driftRange, { duration: duration * 0.65, easing: Easing.inOut(Easing.sin) }),
      ),
      -1,
      true,
    );
  }, [translateY, drift, size, duration, delay, driftRange]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { translateX: drift.value }],
  }));

  return (
    <Animated.View
      style={[{
        position: 'absolute',
        left: x,
        top: -size,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(255, 255, 255, 0.90)',
        opacity: op,
      }, animStyle]}
    />
  );
}

// ─── Hero skeleton ─────────────────────────────────────────────────────────────

function HeroSkeleton() {
  return (
    <View style={[styles.heroContent, { gap: 18 }]}>
      <Skeleton width={128} height={128} borderRadius={Radius.full} />
      <Skeleton width={150} height={92} borderRadius={Radius.lg} />
      <Skeleton width={130} height={22} borderRadius={Radius.sm} />
      <View style={styles.highLowRow}>
        <Skeleton width={56} height={16} borderRadius={Radius.xs} />
        <Skeleton width={56} height={16} borderRadius={Radius.xs} />
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
    backgroundColor: '#0A0C20',
  },
  depthOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },

  // ── Empty states ──
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

  // ── Mini header ──
  miniHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: 'rgba(6, 8, 28, 0.80)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: GlassColors.white15,
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

  // ── Scroll ──
  scrollContent: {
    flexGrow: 1,
  },

  // ── Top bar ──
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  locationRow: {
    alignItems: 'flex-start',
    gap: 1,
  },
  locationTypeLabel: {
    letterSpacing: 1.4,
  },
  cityName: {
    letterSpacing: -0.3,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: GlassColors.white10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: GlassColors.white20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Offline banner ──
  offlineBannerRow: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    paddingTop: 4,
  },

  // ── Hero ──
  hero: {
    paddingTop: 16,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  heroContent: {
    alignItems: 'center',
    gap: 4,
  },
  glowOrb: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 80,
    elevation: 20,
  },
  temperature: {
    letterSpacing: -6,
    marginTop: -8,
  },
  conditionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 7,
    backgroundColor: GlassColors.white10,
    borderRadius: 22,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: GlassColors.white20,
    marginTop: 6,
  },
  highLowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  dot: {
    opacity: 0.4,
  },
  centered: {
    textAlign: 'center',
  },

  // ── Curved glass sheet ──
  sheet: {
    backgroundColor: 'rgba(2, 5, 24, 0.62)',
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: GlassColors.white15,
    marginTop: -20,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: GlassColors.white30,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  cards: {
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 12,
  },
});
