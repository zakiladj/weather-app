import React from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Text } from '@/components/ui/Text';
import { Divider } from '@/components/ui/Divider';
import { GlassCard } from '@/components/ui/GlassCard';

import { GlassColors } from '@/design/tokens';
import { useWeatherStore } from '@/store/weather.store';
import type { TemperatureUnit, WindSpeedUnit, ThemeMode } from '@/types';

// ─── Option definitions ────────────────────────────────────────────────────────

const TEMP_OPTIONS: { value: TemperatureUnit; label: string; symbol: string }[] = [
  { value: 'celsius',    label: 'Celsius',    symbol: '°C' },
  { value: 'fahrenheit', label: 'Fahrenheit', symbol: '°F' },
];

const WIND_OPTIONS: { value: WindSpeedUnit; label: string }[] = [
  { value: 'km/h', label: 'km/h' },
  { value: 'mph',  label: 'mph'  },
  { value: 'm/s',  label: 'm/s'  },
];

const THEME_OPTIONS: { value: ThemeMode; label: string; emoji: string }[] = [
  { value: 'light',  label: 'Light',  emoji: '☀️' },
  { value: 'dark',   label: 'Dark',   emoji: '🌙' },
  { value: 'system', label: 'System', emoji: '⚙️' },
];

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();

  const {
    temperatureUnit, setTemperatureUnit,
    windSpeedUnit, setWindSpeedUnit,
    themeMode, setThemeMode,
  } = useWeatherStore();

  return (
    <View style={styles.root}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* ── Page header ── */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <Text variant="largeTitle" weight="700" color="#FFFFFF">
            Settings
          </Text>
          <Text variant="callout" color={GlassColors.white50} style={{ marginTop: 2 }}>
            Preferences & display
          </Text>
        </Animated.View>

        <View style={styles.sections}>
          {/* ── Units section ── */}
          <Animated.View entering={FadeInUp.delay(60).duration(500)}>
            <SectionLabel emoji="🌡️" title="UNITS" />

            <GlassCard padding={false} radius={24}>
              {/* Temperature */}
              <SettingRow label="Temperature" emoji="🌡️">
                <SegmentedControl
                  options={TEMP_OPTIONS.map(o => ({ value: o.value, label: o.symbol }))}
                  selected={temperatureUnit}
                  onSelect={(v) => setTemperatureUnit(v as TemperatureUnit)}
                />
              </SettingRow>

              <Divider color={GlassColors.white10} />

              {/* Wind speed */}
              <SettingRow label="Wind Speed" emoji="💨">
                <SegmentedControl
                  options={WIND_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
                  selected={windSpeedUnit}
                  onSelect={(v) => setWindSpeedUnit(v as WindSpeedUnit)}
                />
              </SettingRow>
            </GlassCard>
          </Animated.View>

          {/* ── Appearance section ── */}
          <Animated.View entering={FadeInUp.delay(140).duration(500)}>
            <SectionLabel emoji="🎨" title="APPEARANCE" />

            <GlassCard padding={false} radius={24}>
              <SettingRow label="Theme" emoji="🎨">
                <SegmentedControl
                  options={THEME_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
                  selected={themeMode}
                  onSelect={(v) => setThemeMode(v as ThemeMode)}
                />
              </SettingRow>
            </GlassCard>
          </Animated.View>

          {/* ── About section ── */}
          <Animated.View entering={FadeInUp.delay(220).duration(500)}>
            <SectionLabel emoji="ℹ️" title="ABOUT" />

            <GlassCard padding={false} radius={24}>
              <AboutRow label="Version" value="1.0.0" />
              <Divider color={GlassColors.white10} />
              <AboutRow label="Data Source" value="OpenWeatherMap" />
              <Divider color={GlassColors.white10} />
              <AboutRow label="Refresh Interval" value="5 minutes" />
            </GlassCard>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function SectionLabel({ emoji, title }: { emoji: string; title: string }) {
  return (
    <View style={styles.sectionLabel}>
      <Text variant="caption2" style={{ fontSize: 11 }}>{emoji}</Text>
      <Text variant="caption2" weight="600" color={GlassColors.white50}
        style={{ letterSpacing: 0.8 }}>
        {title}
      </Text>
    </View>
  );
}

function SettingRow({
  label, emoji, children,
}: { label: string; emoji: string; children: React.ReactNode }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingRowLeft}>
        <Text variant="body" style={{ fontSize: 15 }}>{emoji}</Text>
        <Text variant="body" weight="500" color="#FFFFFF">
          {label}
        </Text>
      </View>
      {children}
    </View>
  );
}

function AboutRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.aboutRow}>
      <Text variant="body" weight="500" color="#FFFFFF">{label}</Text>
      <Text variant="body" color={GlassColors.white50}>{value}</Text>
    </View>
  );
}

// ─── Segmented control ─────────────────────────────────────────────────────────

interface SegmentOption { value: string; label: string }

function SegmentedControl({
  options, selected, onSelect,
}: {
  options: SegmentOption[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.segmented}>
      {options.map((opt, idx) => {
        const isActive = opt.value === selected;
        const isFirst  = idx === 0;
        const isLast   = idx === options.length - 1;

        return (
          <Pressable
            key={opt.value}
            onPress={() => onSelect(opt.value)}
            style={[
              styles.segment,
              isActive && styles.segmentActive,
              isFirst  && styles.segmentFirst,
              isLast   && styles.segmentLast,
            ]}
            accessibilityRole="radio"
            accessibilityState={{ checked: isActive }}
            accessibilityLabel={opt.label}
          >
            <Text
              variant="caption1"
              weight={isActive ? '600' : '400'}
              color={isActive ? '#FFFFFF' : GlassColors.white50}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0C0A1E',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  sections: {
    paddingHorizontal: 16,
    gap: 8,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 4,
    paddingBottom: 8,
    paddingTop: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: GlassColors.white10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: GlassColors.white10,
    overflow: 'hidden',
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  segmentActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.20)',
  },
  segmentFirst: {
    borderTopLeftRadius: 9,
    borderBottomLeftRadius: 9,
  },
  segmentLast: {
    borderTopRightRadius: 9,
    borderBottomRightRadius: 9,
  },
});
