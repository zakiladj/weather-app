import React, { useEffect, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { GlassCard } from '@/components/ui/GlassCard';
import { Divider } from '@/components/ui/Divider';
import { DailyForecastCard } from '@/components/weather/DailyForecastCard';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { DailyListSkeleton } from '@/components/weather/WeatherCardSkeleton';

import { getCurrentSkyGradient } from '@/design/gradients';
import { GlassColors } from '@/design/tokens';
import { useWeatherStore } from '@/store/weather.store';
import { convertTemperature } from '@/utils/weather';
import { formatTime, formatWeekday } from '@/utils/format';

import type { DailyForecast } from '@/features/weather/types';

// ─── Mock data (same source as Home for consistency) ──────────────────────────

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

const MOCK_DAILY: DailyForecast[] = [
  { date: DATES[0], tempMin: 17, tempMax: 24, condition: 'clear',        iconCode: '01d', precipitationChance: 0,  humidity: 62, windSpeed: 3.8, sunrise: NOW - 6 * HOUR,         sunset: NOW + 8 * HOUR         },
  { date: DATES[1], tempMin: 15, tempMax: 21, condition: 'clouds',       iconCode: '03d', precipitationChance: 20, humidity: 70, windSpeed: 5.2, sunrise: NOW + DAY - 6 * HOUR,   sunset: NOW + DAY + 8 * HOUR   },
  { date: DATES[2], tempMin: 13, tempMax: 18, condition: 'rain',         iconCode: '10d', precipitationChance: 75, humidity: 84, windSpeed: 6.1, sunrise: NOW + 2*DAY - 6 * HOUR, sunset: NOW + 2*DAY + 8 * HOUR },
  { date: DATES[3], tempMin: 12, tempMax: 16, condition: 'thunderstorm', iconCode: '11d', precipitationChance: 90, humidity: 91, windSpeed: 8.4, sunrise: NOW + 3*DAY - 6 * HOUR, sunset: NOW + 3*DAY + 8 * HOUR },
  { date: DATES[4], tempMin: 14, tempMax: 19, condition: 'clouds',       iconCode: '04d', precipitationChance: 30, humidity: 75, windSpeed: 4.1, sunrise: NOW + 4*DAY - 6 * HOUR, sunset: NOW + 4*DAY + 8 * HOUR },
  { date: DATES[5], tempMin: 16, tempMax: 23, condition: 'clear',        iconCode: '01d', precipitationChance: 5,  humidity: 60, windSpeed: 3.2, sunrise: NOW + 5*DAY - 6 * HOUR, sunset: NOW + 5*DAY + 8 * HOUR },
  { date: DATES[6], tempMin: 18, tempMax: 26, condition: 'clear',        iconCode: '01d', precipitationChance: 0,  humidity: 55, windSpeed: 2.8, sunrise: NOW + 6*DAY - 6 * HOUR, sunset: NOW + 6*DAY + 8 * HOUR },
];

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function ForecastScreen() {
  const insets = useSafeAreaInsets();
  const { temperatureUnit } = useWeatherStore();

  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const skyGradient = getCurrentSkyGradient();
  const today = MOCK_DAILY[0];
  const sunriseStr = formatTime(today.sunrise, '12h');
  const sunsetStr  = formatTime(today.sunset,  '12h');

  const highTemp = convertTemperature(today.tempMax, temperatureUnit);
  const lowTemp  = convertTemperature(today.tempMin, temperatureUnit);
  const unitLabel = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* Full-screen sky gradient */}
      <LinearGradient
        colors={skyGradient.colors as [string, string, ...string[]]}
        start={skyGradient.start ?? { x: 0, y: 0 }}
        end={skyGradient.end   ?? { x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={[StyleSheet.absoluteFill, styles.depthOverlay]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* ── Page header ── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <View>
            <Text variant="caption2" weight="600" color={GlassColors.white50}
              style={{ letterSpacing: 1.2 }}>
              PARIS · FR
            </Text>
            <Text variant="largeTitle" weight="700" color="#FFFFFF">
              Forecast
            </Text>
          </View>
        </Animated.View>

        {/* ── Content ── */}
        <View style={styles.cards}>
          {isLoading ? (
            <DailyListSkeleton count={7} />
          ) : (
            <>
              {/* 7-day forecast card */}
              <Animated.View entering={FadeInUp.delay(80).duration(500)}>
                <DailyForecastCard items={MOCK_DAILY} unit={temperatureUnit} />
              </Animated.View>

              {/* Today's detail card */}
              <Animated.View entering={FadeInUp.delay(180).duration(500)}>
                <TodayDetailCard
                  sunrise={sunriseStr}
                  sunset={sunsetStr}
                  highTemp={highTemp}
                  lowTemp={lowTemp}
                  unitLabel={unitLabel}
                  humidity={today.humidity}
                  windSpeed={today.windSpeed}
                />
              </Animated.View>

              {/* Condition summary strip */}
              <Animated.View entering={FadeInUp.delay(280).duration(500)}>
                <ConditionSummaryCard items={MOCK_DAILY} temperatureUnit={temperatureUnit} />
              </Animated.View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Today detail card ─────────────────────────────────────────────────────────

interface TodayDetailCardProps {
  sunrise: string;
  sunset: string;
  highTemp: number;
  lowTemp: number;
  unitLabel: string;
  humidity: number;
  windSpeed: number;
}

function TodayDetailCard({
  sunrise, sunset, highTemp, lowTemp, unitLabel, humidity, windSpeed,
}: TodayDetailCardProps) {
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
          right={{ emoji: '🌇', label: 'Sunset',  value: sunset }}
        />
        <Divider color={GlassColors.white10} />
        <DetailRow
          left={{ emoji: '🌡️', label: 'High', value: `${highTemp}${unitLabel}` }}
          right={{ emoji: '❄️', label: 'Low',  value: `${lowTemp}${unitLabel}` }}
        />
        <Divider color={GlassColors.white10} />
        <DetailRow
          left={{ emoji: '💧', label: 'Humidity', value: `${humidity}%` }}
          right={{ emoji: '💨', label: 'Wind',     value: `${(windSpeed * 3.6).toFixed(0)} km/h` }}
        />
      </View>
    </GlassCard>
  );
}

interface DetailCell { emoji: string; label: string; value: string }

function DetailRow({ left, right }: { left: DetailCell; right: DetailCell }) {
  return (
    <View style={styles.detailRow}>
      <DetailCell {...left} />
      <View style={styles.detailCellDivider} />
      <DetailCell {...right} />
    </View>
  );
}

function DetailCell({ emoji, label, value }: DetailCell) {
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
          const low  = convertTemperature(item.tempMin, temperatureUnit);
          const label = idx === 0 ? 'Today' : formatWeekday(item.date);
          const isNight = false;

          return (
            <View key={item.date} style={styles.summaryRow}>
              <Text variant="callout" weight="500" color="#FFFFFF"
                style={{ width: 72 }}>
                {label}
              </Text>

              <WeatherIcon
                condition={item.condition}
                isNight={isNight}
                size="sm"
              />

              {/* Rain chance */}
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
