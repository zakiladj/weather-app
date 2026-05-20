import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Divider } from '@/components/ui/Divider';
import { GlassCard } from '@/components/ui/GlassCard';
import { Input } from '@/components/ui/Input';
import { Text } from '@/components/ui/Text';
import { GlassColors, Radius } from '@/design/tokens';
import { useLocationSearch } from '@/features/weather/hooks/use-location-search';
import type { WeatherLocation } from '@/features/weather/types';
import { useWeatherStore } from '@/store/weather.store';

// ─── Screen ────────────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const {
    activeLocation,
    savedLocations,
    recentSearches,
    setActiveLocation,
    addSavedLocation,
    removeSavedLocation,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
  } = useWeatherStore();

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
      addRecentSearch(location);
      setActiveLocation(location);
      router.back();
    },
    [setActiveLocation, addRecentSearch],
  );

  const handleToggleSave = useCallback(
    (location: WeatherLocation) => {
      const isSaved = savedLocations.some((l) => l.id === location.id);
      if (isSaved) {
        removeSavedLocation(location.id);
      } else {
        addSavedLocation(location);
      }
    },
    [savedLocations, addSavedLocation, removeSavedLocation],
  );

  // ─── Derived state ───────────────────────────────────────────────────────────

  const isIdle = query.length === 0;
  const hasQuery = debouncedQuery.trim().length >= 2;
  const showSpinner = hasQuery && (isLoading || isFetching);
  const showEmpty = hasQuery && !isLoading && !isFetching && results.length === 0;
  const showResults = hasQuery && results.length > 0;

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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

        {/* ── Scrollable content ── */}
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Idle: saved cities + recent searches ── */}
          {isIdle && (
            <Animated.View entering={FadeInDown.duration(320)}>
              {savedLocations.length > 0 && (
                <>
                  <SectionHeader title="Saved Cities" />
                  <GlassCard padding={false} radius={20} colorScheme="dark" style={styles.card}>
                    {savedLocations.map((loc, idx) => (
                      <React.Fragment key={loc.id}>
                        {idx > 0 && <Divider color={GlassColors.white10} />}
                        <SavedRow
                          item={loc}
                          isActive={activeLocation?.id === loc.id}
                          onPress={handleSelect}
                          onRemove={() => removeSavedLocation(loc.id)}
                        />
                      </React.Fragment>
                    ))}
                  </GlassCard>
                </>
              )}

              {recentSearches.length > 0 && (
                <>
                  <SectionHeader
                    title="Recent"
                    action="Clear"
                    onAction={clearRecentSearches}
                  />
                  <GlassCard padding={false} radius={20} colorScheme="dark" style={styles.card}>
                    {recentSearches.map((loc, idx) => (
                      <React.Fragment key={loc.id}>
                        {idx > 0 && <Divider color={GlassColors.white10} />}
                        <RecentRow
                          item={loc}
                          isActive={activeLocation?.id === loc.id}
                          onPress={handleSelect}
                          onDelete={() => removeRecentSearch(loc.id)}
                        />
                      </React.Fragment>
                    ))}
                  </GlassCard>
                </>
              )}

              {savedLocations.length === 0 && recentSearches.length === 0 && (
                <View style={styles.feedback}>
                  <Text variant="title2" color={GlassColors.white30}>🌍</Text>
                  <Text variant="body" color={GlassColors.white30} style={styles.feedbackText}>
                    Start typing to search for a city
                  </Text>
                </View>
              )}
            </Animated.View>
          )}

          {/* ── Loading spinner ── */}
          {showSpinner && (
            <Animated.View entering={FadeInUp.duration(200)} style={styles.feedback}>
              <ActivityIndicator color="#FFFFFF" size="large" />
            </Animated.View>
          )}

          {/* ── Empty state ── */}
          {showEmpty && (
            <Animated.View entering={FadeInUp.duration(250)} style={styles.feedback}>
              <Text variant="title2" color="#FFFFFF">🔍</Text>
              <Text variant="body" color={GlassColors.white50} style={styles.feedbackText}>
                No cities found for "{debouncedQuery}"
              </Text>
            </Animated.View>
          )}

          {/* ── Search results ── */}
          {showResults && (
            <Animated.View entering={FadeInUp.duration(280)}>
              <SectionHeader title="Results" />
              <GlassCard padding={false} radius={20} colorScheme="dark" style={styles.card}>
                {results.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    {idx > 0 && <Divider color={GlassColors.white10} />}
                    <ResultRow
                      item={item}
                      isActive={activeLocation?.id === item.id}
                      isSaved={savedLocations.some((l) => l.id === item.id)}
                      onPress={handleSelect}
                      onToggleSave={handleToggleSave}
                    />
                  </React.Fragment>
                ))}
              </GlassCard>
            </Animated.View>
          )}
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

// ─── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text variant="caption1" weight="600" color={GlassColors.white50} style={styles.sectionTitle}>
        {title.toUpperCase()}
      </Text>
      {action && onAction && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text variant="caption1" color={GlassColors.white50}>
            {action}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Saved city row ────────────────────────────────────────────────────────────

function SavedRow({
  item,
  isActive,
  onPress,
  onRemove,
}: {
  item: WeatherLocation;
  isActive: boolean;
  onPress: (l: WeatherLocation) => void;
  onRemove: () => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
    >
      <View style={styles.rowLeading}>
        <SymbolView
          name={{ ios: 'location.fill', android: 'location_on', web: 'location_on' }}
          size={14}
          tintColor={isActive ? '#60A5FA' : GlassColors.white30}
        />
        <View style={styles.rowText}>
          <Text variant="body" weight={isActive ? '600' : '400'} color="#FFFFFF">
            {item.name}
          </Text>
          <Text variant="caption1" color={GlassColors.white50}>
            {item.isCurrentLocation ? `${item.country} · My Location` : item.country}
          </Text>
        </View>
      </View>
      <View style={styles.rowActions}>
        {isActive && (
          <SymbolView
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            size={17}
            tintColor="#60A5FA"
          />
        )}
        <Pressable
          onPress={onRemove}
          hitSlop={8}
          style={styles.circleButton}
          accessibilityLabel="Remove saved city"
        >
          <Text variant="caption2" weight="700" color={GlassColors.white50}>×</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

// ─── Recent search row ─────────────────────────────────────────────────────────

function RecentRow({
  item,
  isActive,
  onPress,
  onDelete,
}: {
  item: WeatherLocation;
  isActive: boolean;
  onPress: (l: WeatherLocation) => void;
  onDelete: () => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
    >
      <View style={styles.rowLeading}>
        <SymbolView
          name={{ ios: 'clock', android: 'history', web: 'history' }}
          size={14}
          tintColor={GlassColors.white30}
        />
        <View style={styles.rowText}>
          <Text variant="body" weight={isActive ? '600' : '400'} color="#FFFFFF">
            {item.name}
          </Text>
          <Text variant="caption1" color={GlassColors.white50}>
            {item.country}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={onDelete}
        hitSlop={8}
        style={styles.circleButton}
        accessibilityLabel="Remove from recents"
      >
        <Text variant="caption2" weight="700" color={GlassColors.white30}>×</Text>
      </Pressable>
    </Pressable>
  );
}

// ─── Search result row ─────────────────────────────────────────────────────────

function ResultRow({
  item,
  isActive,
  isSaved,
  onPress,
  onToggleSave,
}: {
  item: WeatherLocation;
  isActive: boolean;
  isSaved: boolean;
  onPress: (l: WeatherLocation) => void;
  onToggleSave: (l: WeatherLocation) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      accessibilityRole="button"
    >
      <View style={styles.rowLeading}>
        <View style={styles.rowText}>
          <Text variant="body" weight={isActive ? '600' : '400'} color="#FFFFFF">
            {item.name}
          </Text>
          <Text variant="caption1" color={GlassColors.white50}>
            {item.country}
          </Text>
        </View>
      </View>
      <View style={styles.rowActions}>
        {isActive && (
          <SymbolView
            name={{ ios: 'checkmark.circle.fill', android: 'check_circle', web: 'check_circle' }}
            size={16}
            tintColor="#60A5FA"
          />
        )}
        <Pressable
          onPress={() => onToggleSave(item)}
          hitSlop={8}
          accessibilityLabel={isSaved ? 'Remove from saved' : 'Save city'}
        >
          <SymbolView
            name={{
              ios: isSaved ? 'bookmark.fill' : 'bookmark',
              android: isSaved ? 'bookmark' : 'bookmark_border',
              web: isSaved ? 'bookmark' : 'bookmark_border',
            }}
            size={16}
            tintColor={isSaved ? '#60A5FA' : GlassColors.white50}
          />
        </Pressable>
        <SymbolView
          name={{ ios: 'chevron.right', android: 'navigate_next', web: 'navigate_next' }}
          size={12}
          tintColor={GlassColors.white30}
        />
      </View>
    </Pressable>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  root: {
    flex: 1,
    backgroundColor: '#0C0A1E',
  },

  // Header
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

  // Input
  inputWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // Scroll
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    flexGrow: 1,
  },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    letterSpacing: 0.6,
  },

  // Card container
  card: {
    marginBottom: 4,
  },

  // Row (shared base)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowPressed: {
    backgroundColor: GlassColors.white10,
  },
  rowLeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 8,
  },
  rowText: {
    gap: 2,
    flex: 1,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  circleButton: {
    width: 22,
    height: 22,
    borderRadius: Radius.full,
    backgroundColor: GlassColors.white10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Centered feedback states
  feedback: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 10,
    paddingHorizontal: 32,
  },
  feedbackText: {
    textAlign: 'center',
  },
});
