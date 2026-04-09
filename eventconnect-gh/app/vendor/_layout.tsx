import React from 'react';
import { Stack } from 'expo-router';
import { useColors } from '@/hooks';

export default function VendorLayout() {
  const colors = useColors();
  return (
    <Stack screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: colors.background },
    }}>
      <Stack.Screen name="[slug]" />
    </Stack>
  );
}
