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
import { Text } from '@/components/ui/Text';
import { DailyForecastCard } from '@/components/weather/DailyForecastCard';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { DailyListSkeleton } from '@/components/weather/WeatherCardSkeleton';
import { getCurrentSkyGradient } from '@/design/gradients';
import { GlassColors } from '@/design/tokens';
import { useWeatherForecast } from '@/features/weather/hooks/use-weather-forecast';
import type { DailyForecast } from '@/features/weather/types';
import { useWeatherStore } from '@/store/weather.store';
import { convertTemperature } from '@/utils/weather';
import { formatTime, formatWeekday } from '@/utils/format';

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function ForecastScreen() {
  const insets = useSafeAreaInsets();
  const { temperatureUnit, activeLocation } = useWeatherStore();

  const coords = activeLocation?.coordinates ?? null;

  const {
    data: forecast,
    isLoading,
    isError,
    refetch,
  } = useWeatherForecast(coords);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  }, [refetch]);

  const skyGradient = getCurrentSkyGradient();
  const today = forecast?.daily[0] ?? null;

  const sunriseStr = today ? formatTime(today.sunrise, '12h') : '—';
  const sunsetStr = today ? formatTime(today.sunset, '12h') : '—';
  const highTemp = today ? convertTemperature(today.tempMax, temperatureUnit) : null;
  const lowTemp = today ? convertTemperature(today.tempMin, temperatureUnit) : null;
  const unitLabel = temperatureUnit === 'celsius' ? '°C' : '°F';

  const locationLabel = activeLocation
    ? `${activeLocation.name} · ${activeLocation.country}`
    : 'No Location';

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <LinearGradient
        colors={skyGradient.colors as [string, string, ...string[]]}
        start={skyGradient.start ?? { x: 0, y: 0 }}
        end={skyGradient.end ?? { x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.depthOverlay]} />

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
        {/* ── Page header ── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text variant="caption2" weight="600" color={GlassColors.white50}
            style={{ letterSpacing: 1.2 }}>
            {locationLabel.toUpperCase()}
          </Text>
          <Text variant="largeTitle" weight="700" color="#FFFFFF">
            Forecast
          </Text>
        </Animated.View>

        {/* ── No location prompt ── */}
        {!activeLocation && (
          <View style={styles.noLocationWrapper}>
            <Text variant="body" color={GlassColors.white50} style={{ textAlign: 'center' }}>
              Set a location on the Today tab to see your forecast.
            </Text>
          </View>
        )}

        {/* ── Content ── */}
        {activeLocation && (
          <View style={styles.cards}>
            {isLoading ? (
              <DailyListSkeleton count={7} />
            ) : isError ? (
              <ErrorCard onRetry={onRefresh} />
            ) : forecast ? (
              <>
                <Animated.View entering={FadeInUp.delay(80).duration(500)}>
                  <DailyForecastCard items={forecast.daily} unit={temperatureUnit} />
                </Animated.View>

                <Animated.View entering={FadeInUp.delay(180).duration(500)}>
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

                <Animated.View entering={FadeInUp.delay(280).duration(500)}>
                  <ConditionSummaryCard
                    items={forecast.daily}
                    temperatureUnit={temperatureUnit}
                  />
                </Animated.View>
              </>
            ) : null}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ─── Error card ────────────────────────────────────────────────────────────────

function ErrorCard({ onRetry }: { onRetry: () => void }) {
  return (
    <GlassCard>
      <View style={{ alignItems: 'center', gap: 12, paddingVertical: 8 }}>
        <Text variant="title2" color="#FFFFFF">⚠️</Text>
        <Text variant="body" weight="600" color="#FFFFFF">
          Could not load forecast
        </Text>
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
  sunrise: string;
  sunset: string;
  highTemp: number | null;
  lowTemp: number | null;
  unitLabel: string;
  humidity: number;
  windSpeed: number;
}

function TodayDetailCard({
  sunrise, sunset, highTemp, lowTemp, unitLabel, humidity, windSpeed,
}: TodayDetailCardProps) {
  const windKmh = (windSpeed * 3.6).toFixed(0);
  return (
    <GlassCard padding={false} radius={24}>
      <View style={styles.detailHeader}>
        <Text variant="caption2" style={{ fontSize: 11 }}>☀️</Text>
        <Text variant="caption2" weight="600" color={GlassColors.white50}
          style={{ letterSpacing: 0.8 }}>
          TODAY'S DETAILS
        </Text>
      </View>
      <Divider color={GlassColors.white10} />
      <View style={{ paddingHorizontal: 16, paddingBottom: 4 }}>
        <DetailRow
          left={{ emoji: '🌅', label: 'Sunrise', value: sunrise }}
          right={{ emoji: '🌇', label: 'Sunset', value: sunset }}
        />
        <Divider color={GlassColors.white10} />
        <DetailRow
          left={{ emoji: '🌡️', label: 'High', value: highTemp !== null ? `${highTemp}${unitLabel}` : '—' }}
          right={{ emoji: '❄️', label: 'Low', value: lowTemp !== null ? `${lowTemp}${unitLabel}` : '—' }}
        />
        <Divider color={GlassColors.white10} />
        <DetailRow
          left={{ emoji: '💧', label: 'Humidity', value: `${humidity}%` }}
          right={{ emoji: '💨', label: 'Wind', value: `${windKmh} km/h` }}
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
        <Text variant="caption1" weight="500" color={GlassColors.white50}>
          {label.toUpperCase()}
        </Text>
      </View>
      <Text variant="title3" weight="600" color="#FFFFFF" style={{ marginTop: 4 }}>
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
    <GlassCard padding={false} radius={24}>
      <View style={styles.detailHeader}>
        <Text variant="caption2" style={{ fontSize: 11 }}>📊</Text>
        <Text variant="caption2" weight="600" color={GlassColors.white50}
          style={{ letterSpacing: 0.8 }}>
          WEEKLY OVERVIEW
        </Text>
      </View>
      <Divider color={GlassColors.white10} />
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
        {items.map((item, idx) => {
          const high = convertTemperature(item.tempMax, temperatureUnit);
          const low = convertTemperature(item.tempMin, temperatureUnit);
          const label = idx === 0 ? 'Today' : formatWeekday(item.date);
          return (
            <View key={item.date} style={styles.summaryRow}>
              <Text variant="callout" weight="500" color="#FFFFFF" style={{ width: 72 }}>
                {label}
              </Text>
              <WeatherIcon condition={item.condition} isNight={false} size="sm" />
              <View style={{ flex: 1, alignItems: 'center' }}>
                {item.precipitationChance > 10 && (
                  <Text variant="caption1" color="rgba(100,180,255,0.85)">
                    {item.precipitationChance}%
                  </Text>
                )}
              </View>
              <Text variant="callout" color="rgba(255,255,255,0.50)"
                style={{ width: 36, textAlign: 'right' }}>
                {low}°
              </Text>
              <Text variant="callout" weight="600" color="#FFFFFF"
                style={{ width: 36, textAlign: 'right' }}>
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
    backgroundColor: '#0C0A1E',
  },
  depthOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  noLocationWrapper: {
    paddingHorizontal: 32,
    paddingTop: 40,
    alignItems: 'center',
  },
  cards: {
    paddingHorizontal: 16,
    gap: 14,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  detailCell: {
    flex: 1,
    paddingVertical: 14,
  },
  detailCellDivider: {
    width: 1,
    backgroundColor: GlassColors.white10,
    marginHorizontal: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
});
