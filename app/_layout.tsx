import React, { useEffect, useCallback } from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { SplashScreen } from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from '@/store';
import { useTheme } from '@/hooks';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 2,
    },
  },
});

function ThemeAwareLayout({ children }: { children: React.ReactNode }) {
  const { isDark, isLoaded } = useThemeStore();
  const { initTheme } = useTheme();

  useEffect(() => {
    initTheme().finally(() => SplashScreen.hideAsync());
  }, [initTheme]);

  if (!isLoaded) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      {children}
    </>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <ThemeAwareLayout>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: useThemeStore.getState().colors.background },
              }}
              initialRouteName="(auth)/welcome"
            >
              <Stack.Screen name="(tabs)" options={{ animation: 'none' }} />
              <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              <Stack.Screen
                name="(modals)"
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                  gestureEnabled: true,
                }}
              />
              <Stack.Screen name="vendor/[slug]" />
              <Stack.Screen name="booking/[id]" />
              <Stack.Screen name="chat/[id]" />
            </Stack>
          </ThemeAwareLayout>
        </SafeAreaProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
