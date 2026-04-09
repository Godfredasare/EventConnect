// ============================================================
// EventConnect GH – Auth Store (Zustand)
// ============================================================
import { create } from 'zustand';
import type { UserProfile, VendorProfile, AuthState, OnboardingStep } from '@/types';

interface AuthStore extends AuthState {
  setUser: (user: UserProfile | null) => void;
  setVendor: (vendor: VendorProfile | null) => void;
  setSession: (session: any) => void;
  setLoading: (loading: boolean) => void;
  updateOnboardingStep: (step: OnboardingStep) => void;
  reset: () => void;
}

const initialState: AuthState = {
  user: null,
  vendor: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    });
  },

  setVendor: (vendor) => set({ vendor }),

  setSession: (session) => {
    set({ session, isAuthenticated: !!session, isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  updateOnboardingStep: (step) => {
    const { user } = get();
    if (user) {
      set({ user: { ...user, onboarding_step: step } });
    }
  },

  reset: () => set(initialState),
}));
