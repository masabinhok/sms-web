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
        set({ loading: true, error: null });
        try {
          await authApi.logout();
          set({ 
            user: null, 
            loading: false, 
            error: null, 
            isAuthenticated: false 
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Logout failed';
          console.error('Logout failed:', error);
          set({ 
            loading: false, 
            error: errorMessage 
          });
          // Even if logout fails on server, clear local state
          set({ 
            user: null, 
            isAuthenticated: false 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      setLoading: (loading: boolean) => {
        set({ loading });
      },

      refreshTokenIfExists: async () => {
        // Check if we have any authentication cookies
        const hasAuthCookie = document.cookie.includes('refresh_token=') || 
                             document.cookie.includes('refreshToken=') ||
                             document.cookie.includes('connect.sid=') ||
                             document.cookie.includes('session=') ||
                             document.cookie.includes('access_token=');

        if (!hasAuthCookie) {
          console.log('No authentication cookies found');
          return false;
        }

        set({ loading: true, error: null });
        
        try {
          // Try to refresh the token using the API client method
          const refreshSuccess = await authApi.checkAndRefreshToken();
          
          if (refreshSuccess) {
            // If refresh successful, fetch user profile
            const user = await authApi.getProfile();
            set({ 
              user, 
              loading: false, 
              error: null, 
              isAuthenticated: true 
            });
            
            console.log('Token refreshed and user profile fetched successfully');
            return true;
          } else {
            // Refresh failed
            set({ 
              loading: false, 
              error: null, // Don't show error for failed refresh
              user: null, 
              isAuthenticated: false 
            });
            return false;
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          set({ 
            loading: false, 
            error: null, // Don't show error for failed refresh on login page
            user: null, 
            isAuthenticated: false 
          });
          return false;
        }
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

