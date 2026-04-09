// ============================================================
// EventConnect GH – Environment Config
// ============================================================

export const ENV = {
  IS_DEV: __DEV__,
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  PAYSTACK_PUBLIC_KEY: process.env.EXPO_PUBLIC_PAYSTACK_KEY || '',
  GOOGLE_MAPS_KEY: process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '',
  API_URL: process.env.EXPO_PUBLIC_API_URL || '',
};
