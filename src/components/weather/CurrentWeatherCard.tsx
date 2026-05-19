import React from 'react';
import { View, type ViewStyle } from 'react-native';

import { Text } from '@/components/ui/Text';
import { GlassCard } from '@/components/ui/GlassCard';
import { Badge } from '@/components/ui/Badge';
import { WeatherIcon } from '@/components/weather/WeatherIcon';
import { GlassColors } from '@/design/tokens';
import { convertTemperature, convertWindSpeed } from '@/utils/weather';
import { formatTime } from '@/utils/format';
import type { CurrentWeather, WeatherLocation } from '@/features/weather/types';
import type { TemperatureUnit, WindSpeedUnit } from '@/types';

export interface CurrentWeatherCardProps {
  weather: CurrentWeather;
  location: WeatherLocation;
  isNight?: boolean;
  unit?: TemperatureUnit;
  windUnit?: WindSpeedUnit;
  style?: ViewStyle;
}

export function CurrentWeatherCard({
  weather,
  location,
  isNight = false,
  unit = 'celsius',
  windUnit = 'km/h',
  style,
}: CurrentWeatherCardProps) {
  const temp = convertTemperature(weather.temperature, unit);
  const feelsLike = convertTemperature(weather.feelsLike, unit);
  const wind = convertWindSpeed(weather.windSpeed, windUnit);
  const unitSymbol = unit === 'celsius' ? '°C' : '°F';
  const updatedAt = formatTime(weather.updatedAt, '12h');

  // Capitalise description
  const description =
    weather.description.charAt(0).toUpperCase() + weather.description.slice(1);

  return (
    <GlassCard
      padding={false}
      radius={32}
      style={[{ overflow: 'hidden' }, style]}
    >
      <View style={{ padding: 24, gap: 4 }}>
        {/* Location row */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          {location.isCurrentLocation && (
            <Text variant="footnote" style={{ lineHeight: 16 }}>📍</Text>
          )}
          <Text variant="headline" weight="600" color="#FFFFFF">
            {location.name}
          </Text>
          <Text variant="footnote" color={GlassColors.white50}>
            {location.country}
          </Text>
        </View>

        {/* Main temp + icon */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginTop: 8 }}>
          <View>
            <Text
              variant="display"
              weight="200"
              color="#FFFFFF"
              style={{ letterSpacing: -4 }}
            >
              {temp}°
            </Text>
            <Text variant="title3" weight="400" color={GlassColors.white50} style={{ marginTop: -4 }}>
              {description}
            </Text>
          </View>

          <WeatherIcon condition={weather.condition} isNight={isNight} size="xl" style={{ marginTop: 8 }} />
        </View>

        {/* Feels like + high/low strip */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 }}>
          <Badge
            label={`Feels ${feelsLike}${unitSymbol}`}
            variant="glass"
            color="white"
            size="sm"
          />
          <Badge
            label={`💨 ${wind} ${windUnit}`}
            variant="glass"
            color="white"
            size="sm"
          />
          <Badge
            label={`💧 ${weather.humidity}%`}
            variant="glass"
            color="white"
            size="sm"
          />
        </View>
      </View>

      {/* Bottom strip */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: GlassColors.white10,
          paddingHorizontal: 24,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Text variant="caption1" color={GlassColors.white50}>
          Updated {updatedAt}
        </Text>
        <Text variant="caption1" color={GlassColors.white50}>
          UV {weather.uvIndex} · {weather.visibility / 1000} km vis.
        </Text>
      </View>
    </GlassCard>
  );
}
