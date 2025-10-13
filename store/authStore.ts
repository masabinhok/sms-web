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
        console.log('Logging out - clearing state and cookies');
        
        // Clear state immediately
        set({ 
          user: null, 
          loading: false, 
          error: null, 
          isAuthenticated: false 
        });
        
        // Clear storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage');
        }
        
        // Wait for logout API to clear cookies
        try {
          await authApi.logout();
          console.log('Logout API successful - cookies cleared');
        } catch (error) {
          console.error('Logout API call failed:', error);
          // Continue even if API fails - state is already cleared
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

