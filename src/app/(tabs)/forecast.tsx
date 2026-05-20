import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import { GlassCard } from '@/components/ui/GlassCard';
import { OfflineBanner } from '@/components/ui/OfflineBanner';
import { Text } from '@/components/ui/Text';
import { DailyForecastCard } from '@/components/weather/DailyForecastCard';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { DailyListSkeleton } from '@/components/weather/WeatherCardSkeleton';
import { getCurrentSkyGradient } from '@/design/gradients';
import { GlassColors } from '@/design/tokens';
import { useWeatherForecast } from '@/features/weather/hooks/use-weather-forecast';
import { isNetworkError } from '@/features/weather/lib/network-error';
import type { DailyForecast } from '@/features/weather/types';
import { useWeatherStore } from '@/store/weather.store';
import { convertTemperature } from '@/utils/weather';
import { formatTime, formatWeekday } from '@/utils/format';

export default function ForecastScreen() {
  const insets = useSafeAreaInsets();
  const { temperatureUnit, activeLocation } = useWeatherStore();

  const coords = activeLocation?.coordinates ?? null;

  const {
    data: forecast,
    isLoading,
    isError,
    error,
    dataUpdatedAt,
    refetch,
  } = useWeatherForecast(coords);

  const isOffline     = isNetworkError(error);
  const lastUpdatedAt = dataUpdatedAt > 0 ? dataUpdatedAt : null;

  const [isRefreshing, setIsRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const skyGradient  = getCurrentSkyGradient();
  const today        = forecast?.daily[0] ?? null;
  const sunriseStr   = today ? formatTime(today.sunrise, '12h') : '—';
  const sunsetStr    = today ? formatTime(today.sunset,  '12h') : '—';
  const highTemp     = today ? convertTemperature(today.tempMax, temperatureUnit) : null;
  const lowTemp      = today ? convertTemperature(today.tempMin, temperatureUnit) : null;
  const unitLabel    = temperatureUnit === 'celsius' ? '°C' : '°F';
  const locationLabel = activeLocation ? `${activeLocation.name} · ${activeLocation.country}` : 'No Location';

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* ── Cinematic sky background ── */}
      <LinearGradient
        colors={skyGradient.colors as [string, string, ...string[]]}
        start={skyGradient.start ?? { x: 0, y: 0 }}
        end={skyGradient.end   ?? { x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.depthOverlay]} />

      {/* ── Status bar gradient guard ── */}
      <LinearGradient
        colors={[skyGradient.colors[0] as string, `${skyGradient.colors[0]}00`]}
        style={[StyleSheet.absoluteFill, { height: insets.top + 72, bottom: undefined }]}
        pointerEvents="none"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
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
        {/* ── Cinematic page header ── */}
        <Animated.View entering={FadeInDown.duration(600)} style={styles.header}>
          <Text variant="caption1" weight="700" color={GlassColors.white50} style={styles.locationLabel}>
            {locationLabel.toUpperCase()}
          </Text>
          <Text variant="largeTitle" weight="700" color="#FFFFFF" style={styles.pageTitle}>
            Forecast
          </Text>
        </Animated.View>

        {/* ── No-location message ── */}
        {!activeLocation && (
          <View style={styles.noLocationWrapper}>
            <Text variant="body" color={GlassColors.white50} style={{ textAlign: 'center' }}>
              Set a location on the Today tab to see your forecast.
            </Text>
          </View>
        )}

        {/* ── Curved glass sheet ── */}
        {activeLocation && (
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />

            {/* Offline banner */}
            {isOffline && !!forecast && (
              <View style={styles.offlineBannerWrapper}>
                <OfflineBanner dataUpdatedAt={lastUpdatedAt} />
              </View>
            )}

            <View style={styles.cards}>
              {isLoading ? (
                <DailyListSkeleton count={7} />
              ) : isError && isOffline && !forecast ? (
                <OfflineCard onRetry={onRefresh} />
              ) : isError ? (
                <ErrorCard onRetry={onRefresh} />
              ) : forecast ? (
                <>
                  <Animated.View entering={FadeInUp.delay(80).duration(500)}>
                    <DailyForecastCard items={forecast.daily} unit={temperatureUnit} />
                  </Animated.View>

                  <Animated.View entering={FadeInUp.delay(200).duration(500)}>
                    <TodayDetailCard
                      sunrise={sunriseStr}
                      sunset={sunsetStr}
                      highTemp={highTemp}
                      lowTemp={lowTemp}
                      unitLabel={unitLabel}
                      humidity={today?.humidity ?? 0}
                      windSpeed={today?.windSpeed ?? 0}
                    />
                  </Animated.View>

                  <Animated.View entering={FadeInUp.delay(320).duration(500)}>
                    <ConditionSummaryCard items={forecast.daily} temperatureUnit={temperatureUnit} />
                  </Animated.View>
                </>
              ) : null}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Offline card ──────────────────────────────────────────────────────────────

function OfflineCard({ onRetry }: { onRetry: () => void }) {
  return (
    <GlassCard>
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 8 }}>
        <Text variant="title2" color="#FFFFFF">📡</Text>
        <Text variant="body" weight="600" color="#FFFFFF">You're Offline</Text>
        <Text variant="callout" color={GlassColors.white50} style={{ textAlign: 'center' }}>
          No cached forecast available. Connect to the internet to load data.
        </Text>
        <Button variant="secondary" label="Try Again" onPress={onRetry} size="sm" />
      </View>
    </GlassCard>
  );
}

// ─── Error card ────────────────────────────────────────────────────────────────

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <GlassCard>
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 8 }}>
        <Text variant="title2" color="#FFFFFF">⚠️</Text>
        <Text variant="body" weight="600" color="#FFFFFF">Could not load forecast</Text>
        <Text variant="callout" color={GlassColors.white50} style={{ textAlign: 'center' }}>
          Check your connection and try again.
        </Text>
        <Button variant="secondary" label="Retry" onPress={onRetry} size="sm" />
      </View>
    </GlassCard>
  );
}

// ─── Today detail card ─────────────────────────────────────────────────────────

interface TodayDetailCardProps {
  sunrise: string; sunset: string;
  highTemp: number | null; lowTemp: number | null;
  unitLabel: string;
  humidity: number; windSpeed: number;
}

function TodayDetailCard({ sunrise, sunset, highTemp, lowTemp, unitLabel, humidity, windSpeed }: TodayDetailCardProps) {
  const windKmh = (windSpeed * 3.6).toFixed(0);

  return (
    <GlassCard padding={false} radius={26}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderIcon}>☀️</Text>
        <Text variant="caption1" weight="700" color={GlassColors.white50} style={styles.cardHeaderLabel}>
          TODAY'S DETAILS
        </Text>
        <View style={styles.cardHeaderRule} />
      </View>
      <Divider color={GlassColors.white8} />

      <View style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
        <DetailRow
          left={{ emoji: '🌅', label: 'Sunrise', value: sunrise }}
          right={{ emoji: '🌇', label: 'Sunset',  value: sunset  }}
        />
        <Divider color={GlassColors.white8} />
        <DetailRow
          left={{ emoji: '🌡️', label: 'High', value: highTemp !== null ? `${highTemp}${unitLabel}` : '—' }}
          right={{ emoji: '❄️', label: 'Low',  value: lowTemp  !== null ? `${lowTemp}${unitLabel}`  : '—' }}
        />
        <Divider color={GlassColors.white8} />
        <DetailRow
          left={{ emoji: '💧', label: 'Humidity', value: `${humidity}%` }}
          right={{ emoji: '💨', label: 'Wind',     value: `${windKmh} km/h` }}
        />
      </View>
    </GlassCard>
  );
}

interface DetailCell { emoji: string; label: string; value: string }

function DetailRow({ left, right }: { left: DetailCell; right: DetailCell }) {
  return (
    <View style={styles.detailRow}>
      <DetailCellView {...left} />
      <View style={styles.detailCellDivider} />
      <DetailCellView {...right} />
    </View>
  );
}

function DetailCellView({ emoji, label, value }: DetailCell) {
  return (
    <View style={styles.detailCell}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
        <Text variant="caption1" style={{ fontSize: 13 }}>{emoji}</Text>
        <Text variant="caption1" weight="600" color={GlassColors.white50} style={{ letterSpacing: 0.6 }}>
          {label.toUpperCase()}
        </Text>
      </View>
      <Text variant="title3" weight="700" color="#FFFFFF" style={{ marginTop: 5, letterSpacing: -0.3 }}>
        {value}
      </Text>
    </View>
  );
}

// ─── Condition summary strip ───────────────────────────────────────────────────

interface ConditionSummaryCardProps {
  items: DailyForecast[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

function ConditionSummaryCard({ items, temperatureUnit }: ConditionSummaryCardProps) {
  return (
    <GlassCard padding={false} radius={26}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardHeaderIcon}>📊</Text>
        <Text variant="caption1" weight="700" color={GlassColors.white50} style={styles.cardHeaderLabel}>
          WEEKLY OVERVIEW
        </Text>
        <View style={styles.cardHeaderRule} />
      </View>
      <Divider color={GlassColors.white8} />

      <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        {items.map((item, idx) => {
          const high  = convertTemperature(item.tempMax, temperatureUnit);
          const low   = convertTemperature(item.tempMin, temperatureUnit);
          const label = idx === 0 ? 'Today' : formatWeekday(item.date);
          return (
            <View key={item.date} style={styles.summaryRow}>
              <Text variant="callout" weight="500" color="#FFFFFF" style={{ width: 72 }}>
                {label}
              </Text>
              <WeatherIcon condition={item.condition} isNight={false} size="sm" />
              <View style={{ flex: 1, alignItems: 'center' }}>
                {item.precipitationChance > 10 && (
                  <Text variant="caption1" weight="600" color="rgba(100,180,255,0.85)">
                    {item.precipitationChance}%
                  </Text>
                )}
              </View>
              <Text variant="callout" color="rgba(255,255,255,0.45)" style={{ width: 36, textAlign: 'right' }}>
                {low}°
              </Text>
              <Text variant="callout" weight="700" color="#FFFFFF" style={{ width: 36, textAlign: 'right' }}>
                {high}°
              </Text>
            </View>
          );
        })}
      </View>
    </GlassCard>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0C20',
  },
  depthOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.20)',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 22,
    paddingBottom: 24,
  },
  locationLabel: {
    letterSpacing: 1.5,
    marginBottom: 2,
  },
  pageTitle: {
    letterSpacing: -0.5,
  },
  noLocationWrapper: {
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },

  // ── Curved sheet ──
  sheet: {
    backgroundColor: 'rgba(2, 5, 24, 0.62)',
    borderTopLeftRadius: 44,
    borderTopRightRadius: 44,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(255,255,255,0.14)',
  },
  sheetHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  offlineBannerWrapper: {
    alignItems: 'center',
    paddingTop: 8,
  },
  cards: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 12,
  },

  // ── Card shared premium header ──
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  cardHeaderIcon: {
    fontSize: 12,
    lineHeight: 16,
  },
  cardHeaderLabel: {
    letterSpacing: 1.2,
  },
  cardHeaderRule: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginLeft: 4,
  },

  // ── Detail rows ──
  detailRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  detailCell: {
    flex: 1,
    paddingVertical: 16,
  },
  detailCellDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginHorizontal: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
