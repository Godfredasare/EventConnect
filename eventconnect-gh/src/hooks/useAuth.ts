// ============================================================
// EventConnect GH – useAuth Hook
// ============================================================
import { useEffect, useCallback } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { supabase, authHelpers } from '@/lib';
import { useAuthStore } from '@/store';
import type { UserProfile, VendorProfile, OnboardingStep } from '@/types';

export function useAuth() {
  const router = useRouter();
  const segments = useSegments();
  const {
    user,
    vendor,
    session,
    isLoading,
    isAuthenticated,
    setUser,
    setVendor,
    setSession,
    setLoading,
    updateOnboardingStep,
    reset,
  } = useAuthStore();

  // Fetch user profile after auth state changes
  const fetchUserProfile = useCallback(async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(profile as UserProfile);

      // If vendor, fetch vendor profile too
      if (profile?.role === 'vendor') {
        const { data: vendorData } = await supabase
          .from('vendors')
          .select('*')
          .eq('user_id', userId)
          .single();
        if (vendorData) setVendor(vendorData as VendorProfile);
      }

      return profile as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, [setUser, setVendor]);

  // Listen to auth state changes
  useEffect(() => {
    setLoading(true);

    authHelpers.onAuthStateChange(async (event: string, session: any) => {
      setSession(session);

      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setVendor(null);
      }
    });

    // Initial session check
    authHelpers.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        await fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Route protection
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/welcome');
    } else if (isAuthenticated && user && !user.is_onboarded && !inAuthGroup) {
      const stepMap: Record<OnboardingStep, string> = {
        welcome: '/(auth)/welcome',
        phone: '/(auth)/phone',
        otp: '/(auth)/otp',
        user_type: '/(auth)/user-type',
        details: user.role === 'vendor' ? '/(auth)/vendor-onboarding' : '/(auth)/customer-onboarding',
        complete: '/(tabs)',
      };
      const nextRoute = stepMap[user.onboarding_step] || '/(auth)/user-type';
      router.replace(nextRoute as any);
    }
  }, [isAuthenticated, isLoading, segments, user, router]);

  const signOut = useCallback(async () => {
    await authHelpers.signOut();
    reset();
    router.replace('/(auth)/welcome');
  }, [reset, router]);

  const updateOnboarding = useCallback(
    async (step: OnboardingStep) => {
      const { user: currentUser } = useAuthStore.getState();
      if (!currentUser) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          onboarding_step: step,
          is_onboarded: step === 'complete',
        })
        .eq('id', currentUser.id);

      if (!error) {
        updateOnboardingStep(step);
      }
    },
    [updateOnboardingStep]
  );

  return {
    user,
    vendor,
    session,
    isLoading,
    isAuthenticated,
    signOut,
    updateOnboarding,
    fetchUserProfile,
  };
}
