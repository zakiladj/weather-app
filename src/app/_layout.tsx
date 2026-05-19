import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';

import { AppProviders } from '@/providers/app-providers';
import { useAppTheme } from '@/hooks/use-app-theme';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isDark } = useAppTheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProviders>
      <RootLayoutNav />
    </AppProviders>
  );
}
