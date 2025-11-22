import { authApi, ApiError } from '@/lib/api-client';
import { User, UserRole, LoginCredentials } from '@/types/auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { logError, authLogger } from '@/lib/logger';

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    requiresPasswordChange: boolean;
    login: (credentials: LoginCredentials, role: UserRole) => Promise<void>;
    fetchUser: () => Promise<void>; 
    logout: () => Promise<void>;
    clearError: () => void;
    setLoading: (loading: boolean) => void;
    setRequiresPasswordChange: (requires: boolean) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null, 
      loading: false, 
      error: null,
      isAuthenticated: false,
      requiresPasswordChange: false,
      
      login: async (credentials: LoginCredentials, role: UserRole) => {
        set({ loading: true, error: null });
        try {
          const loginResponse = await authApi.login(credentials.username, credentials.password, role);
          // After successful login, fetch user profile
          const user = await authApi.getProfile();
          
          // Check if password change is required
          const requiresPasswordChange = loginResponse.requiresPasswordChange || user.passwordChangeCount === 0;
          
          set({ 
            user: {
              ...user,
              passwordChangeCount: loginResponse.passwordChangeCount ?? user.passwordChangeCount,
              requiresPasswordChange
            }, 
            loading: false, 
            error: null, 
            isAuthenticated: true,
            requiresPasswordChange
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          authLogger.loginFailure(errorMessage);
          set({ 
            loading: false, 
            error: errorMessage, 
            user: null, 
            isAuthenticated: false,
            requiresPasswordChange: false
          });
          throw error;
        }
      },

      fetchUser: async () => {
        set({ loading: true, error: null });
        try {
          const user = await authApi.getProfile();
          const requiresPasswordChange = user.passwordChangeCount === 0;
          
          set({ 
            user: {
              ...user,
              requiresPasswordChange
            }, 
            loading: false, 
            error: null, 
            isAuthenticated: true,
            requiresPasswordChange
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user profile';
          logError(error, 'Fetch user profile');
          set({ 
            loading: false, 
            error: errorMessage, 
            user: null, 
            isAuthenticated: false,
            requiresPasswordChange: false
          });
        }
      },

      logout: async () => {
        authLogger.logout();

        // First attempt to notify the server to clear auth cookies/session
        try {
          await authApi.logout();
        } catch (error) {
          logError(error, 'Logout API call');
          // Continue to clear local state even if API fails
        }

        // Clear state immediately
        set({
          user: null,
          loading: false,
          error: null,
          isAuthenticated: false,
          requiresPasswordChange: false,
        });

        // Robustly clear persisted storage keys used by zustand/persist
        if (typeof window !== 'undefined') {
          try {
            // Clear access token for cross-domain authentication
            localStorage.removeItem('access_token');
            
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
            // Silent fail for localStorage cleanup
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
      },

      setRequiresPasswordChange: (requires: boolean) => {
        set({ requiresPasswordChange: requires });
      }
    }),
    {
      name: 'auth-storage',
      // Only persist user and isAuthenticated, not loading/error states
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated,
        requiresPasswordChange: state.requiresPasswordChange
      }),
    }
  )
);

