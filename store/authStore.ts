import { authApi, ApiError } from '@/lib/api-client';
import { User, UserRole, LoginCredentials } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
    fetchUser: () => Promise<void>; 
    logout: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, 
      loading: false, 
      error: null,
      isAuthenticated: false,
      
      login: async (credentials: LoginCredentials, role: UserRole) => {
        set({ loading: true, error: null });
        try {
          await authApi.login(credentials.username, credentials.password, role);
          // After successful login, fetch user profile
          const user = await authApi.getProfile();
          set({ 
            user, 
            loading: false, 
            error: null, 
            isAuthenticated: true 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          set({ 
            loading: false, 
            error: errorMessage, 
            user: null, 
            isAuthenticated: false 
          });
          throw error;
        }
      },

      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const user = await authApi.getProfile();
          set({ 
            user, 
            loading: false, 
            error: null, 
            isAuthenticated: true 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
          console.error('Failed to fetch user profile:', error);
          set({ 
            loading: false, 
            error: errorMessage, 
            user: null, 
            isAuthenticated: false 
          });
        }
      },

      logout: async () => {
        console.log('Logging out - initiating logout flow');

        // First attempt to notify the server to clear auth cookies/session
        try {
          await authApi.logout();
          console.log('Logout API successful - cookies cleared');
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue to clear local state even if API fails
        }

        // Clear state immediately
        set({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
        });

        // Robustly clear persisted storage keys used by zustand/persist
        if (typeof window !== 'undefined') {
          try {
            // Standard key used by this persist middleware
            localStorage.removeItem('auth-storage');
            // Some environments prefix with 'persist:'
            localStorage.removeItem('persist:auth-storage');
            // Remove any other keys that explicitly reference auth-storage
            Object.keys(localStorage).forEach((k) => {
              if (k.includes('auth-storage') || k === 'persist:auth-storage') {
                try { localStorage.removeItem(k); } catch {}
              }
            });
          } catch (err) {
            console.warn('Failed to clear localStorage keys during logout', err);
          }

          // Notify other parts of the app (and other tabs) that logout occurred
          try {
            window.dispatchEvent(new CustomEvent('auth:logged-out'));
          } catch {}
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      }
    }),
    {
      name: 'auth-storage',
      // Only persist user and isAuthenticated, not loading/error states
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);

