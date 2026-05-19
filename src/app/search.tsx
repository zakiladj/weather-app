import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Divider } from '@/components/ui/Divider';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassColors } from '@/design/tokens';
import { useLocationSearch } from '@/features/weather/hooks/use-location-search';
import type { WeatherLocation } from '@/features/weather/types';
import { useWeatherStore } from '@/store/weather.store';

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { setActiveLocation } = useWeatherStore();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => setDebouncedQuery(text), 400);
  }, []);

  const handleClear = useCallback(() => {
    setQuery('');
    setDebouncedQuery('');
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
  }, []);

  const { data: results = [], isLoading, isFetching } = useLocationSearch(debouncedQuery);

  const handleSelect = useCallback(
    (location: WeatherLocation) => {
      setActiveLocation(location);
      router.back();
    },
    [setActiveLocation],
  );

  const showSpinner =
    (isLoading || isFetching) && debouncedQuery.trim().length >= 2;
  const showEmpty =
    !showSpinner && results.length === 0 && debouncedQuery.trim().length >= 2;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar translucent barStyle="light-content" backgroundColor="transparent" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel="Go back"
          hitSlop={8}
        >
          <SymbolView
            name={{ ios: 'chevron.down', android: 'keyboard_arrow_down', web: 'expand_more' }}
            size={22}
            tintColor="#FFFFFF"
          />
        </Pressable>
        <Text variant="headline" weight="600" color="#FFFFFF">
          Search City
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Search input ── */}
      <View style={styles.inputWrapper}>
        <Input
          variant="glass"
          value={query}
          onChangeText={handleQueryChange}
          onClear={handleClear}
          placeholder="City name, e.g. Tokyo"
          autoFocus
          returnKeyType="search"
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      {/* ── Results ── */}
      {showSpinner ? (
        <View style={styles.centeredFeedback}>
          <ActivityIndicator color="#FFFFFF" size="large" />
        </View>
      ) : showEmpty ? (
        <View style={styles.centeredFeedback}>
          <Text variant="title2" color="#FFFFFF">🔍</Text>
          <Text variant="body" color={GlassColors.white50} style={styles.emptyText}>
            No cities found for "{debouncedQuery}"
          </Text>
        </View>
      ) : results.length > 0 ? (
        <Animated.View entering={FadeInUp.duration(300)} style={styles.resultsContainer}>
          <GlassCard padding={false} radius={20}>
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <Divider color={GlassColors.white10} />
              )}
              renderItem={({ item }) => (
                <ResultRow item={item} onPress={handleSelect} />
              )}
            />
          </GlassCard>
        </Animated.View>
      ) : null}

      {/* Prompt shown before user types */}
      {query.length === 0 && (
        <View style={styles.centeredFeedback}>
          <Text variant="title2" color={GlassColors.white30}>🌍</Text>
          <Text variant="body" color={GlassColors.white30} style={styles.emptyText}>
            Start typing to search for a city
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Result row ────────────────────────────────────────────────────────────────

function ResultRow({
  item,
  onPress,
}: {
  item: WeatherLocation;
  onPress: (l: WeatherLocation) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.resultItem, pressed && styles.resultItemPressed]}
      accessibilityRole="button"
    >
      <View style={styles.resultText}>
        <Text variant="body" weight="600" color="#FFFFFF">
          {item.name}
        </Text>
        <Text variant="caption1" color={GlassColors.white50}>
          {item.country}
        </Text>
      </View>
      <SymbolView
        name={{ ios: 'chevron.right', android: 'navigate_next', web: 'navigate_next' }}
        size={14}
        tintColor={GlassColors.white50}
      />
    </Pressable>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0C0A1E',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSpacer: {
    width: 36,
  },

  inputWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  resultsContainer: {
    marginHorizontal: 16,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  resultItemPressed: {
    backgroundColor: GlassColors.white10,
  },
  resultText: {
    gap: 2,
  },

  centeredFeedback: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 32,
    marginTop: -60,
  },
  emptyText: {
    textAlign: 'center',
  },
});
