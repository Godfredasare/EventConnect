import React from 'react';
import { Stack } from 'expo-router';
import { useColors } from '@/hooks';

export default function AuthLayout() {
  const colors = useColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
      <Stack.Screen name="phone" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="user-type" />
      <Stack.Screen name="customer-onboarding" />
      <Stack.Screen name="vendor-onboarding" />
    </Stack>
  );
}
