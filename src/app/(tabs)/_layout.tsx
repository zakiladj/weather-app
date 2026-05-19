import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React from 'react';

import { GlassColors } from '@/design/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.40)',
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: 'rgba(10, 12, 30, 0.82)',
          borderTopColor: GlassColors.white10,
          borderTopWidth: 0.5,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          letterSpacing: 0.2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Today',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'sun.max.fill', android: 'wb_sunny', web: 'wb_sunny' }}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="forecast"
        options={{
          title: 'Forecast',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'calendar', android: 'calendar_today', web: 'calendar_today' }}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <SymbolView
              name={{ ios: 'gearshape.fill', android: 'settings', web: 'settings' }}
              size={size}
              tintColor={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
