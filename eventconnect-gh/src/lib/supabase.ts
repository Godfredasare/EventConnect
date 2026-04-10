// ============================================================
// EventConnect GH – Supabase Client
// ============================================================
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// ---------- Typed table helpers ----------

export const from = (table: string) => supabase.from(table);

// ---------- Convenience auth helpers ----------

export const authHelpers = {
  getSession: () => supabase.auth.getSession(),
  getUser: () => supabase.auth.getUser(),
  signInWithOtp: (phone: string) =>
    supabase.auth.signInWithOtp({
      phone,
    }),
  verifyOtp: (phone: string, token: string, type: any = 'sms') =>
    supabase.auth.verifyOtp({ phone, token, type }),
  signOut: () => supabase.auth.signOut(),
  onAuthStateChange: (callback: any) => supabase.auth.onAuthStateChange(callback),
};
