/**
 * Auth Store Tests
 * Critical: Tests authentication state management and persistence
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useAuth } from '@/store/authStore';

// Mock the api-client
vi.mock('@/lib/api-client', () => ({
  authApi: {
    login: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
    changePassword: vi.fn(),
  },
  ApiError: class ApiError extends Error {},
}));

// Mock logger
vi.mock('@/lib/logger', () => ({
  logError: vi.fn(),
  authLogger: {
    loginFailure: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuth.setState({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      requiresPasswordChange: false,
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useAuth.getState();
      
      expect(state.user).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.requiresPasswordChange).toBe(false);
    });
  });

  describe('Login Flow', () => {
    it('should set loading state during login', async () => {
      const { authApi } = await import('@/lib/api-client');
      
      vi.mocked(authApi.login).mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve({ requiresPasswordChange: false }), 100))
      );
      vi.mocked(authApi.getProfile).mockResolvedValue({
        id: '1',
        username: 'test',
        email: 'test@example.com',
        role: 'ADMIN',
        passwordChangeCount: 1,
        requiresPasswordChange: false,
      } as any);

      const store = useAuth.getState();
      const loginPromise = store.login({ username: 'test', password: 'pass' }, 'ADMIN');
      
      // Should be loading
      expect(useAuth.getState().loading).toBe(true);
      
      await loginPromise;
      
      // Should not be loading after completion
      expect(useAuth.getState().loading).toBe(false);
    });

    it('should update state on successful login', async () => {
      const { authApi } = await import('@/lib/api-client');
      
      const mockUser = {
        id: '1',
        username: 'testuser',
        email: 'test@example.com',
        role: 'ADMIN' as const,
        passwordChangeCount: 1,
        requiresPasswordChange: false,
      };

      vi.mocked(authApi.login).mockResolvedValue({ requiresPasswordChange: false });
      vi.mocked(authApi.getProfile).mockResolvedValue(mockUser as any);

      const store = useAuth.getState();
      await store.login({ username: 'test', password: 'pass' }, 'ADMIN');
      
      const state = useAuth.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toMatchObject(mockUser);
      expect(state.error).toBeNull();
    });

    it('should handle login errors', async () => {
      const { authApi } = await import('@/lib/api-client');
      
      vi.mocked(authApi.login).mockRejectedValue(new Error('Invalid credentials'));

      const store = useAuth.getState();
      
      await expect(
        store.login({ username: 'test', password: 'wrong' }, 'ADMIN')
      ).rejects.toThrow('Invalid credentials');
      
      const state = useAuth.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.error).toBe('Invalid credentials');
    });
  });

  describe('Logout Flow', () => {
    it('should clear state on logout', async () => {
      const { authApi } = await import('@/lib/api-client');
      
      // Set initial authenticated state
      useAuth.setState({
        user: { id: '1', username: 'test' } as any,
        isAuthenticated: true,
        loading: false,
        error: null,
        requiresPasswordChange: false,
      });

      vi.mocked(authApi.logout).mockResolvedValue({ success: true });

      const store = useAuth.getState();
      await store.logout();
      
      const state = useAuth.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });
  });

  describe('Password Change Requirement', () => {
    it('should detect first-time login', async () => {
      const { authApi } = await import('@/lib/api-client');
      
      const mockUser = {
        id: '1',
        username: 'newuser',
        email: 'new@example.com',
        role: 'STUDENT' as const,
        passwordChangeCount: 0, // First time login
        requiresPasswordChange: true,
      };

      vi.mocked(authApi.login).mockResolvedValue({ 
        requiresPasswordChange: true,
        passwordChangeCount: 0 
      });
      vi.mocked(authApi.getProfile).mockResolvedValue(mockUser as any);

      const store = useAuth.getState();
      await store.login({ username: 'new', password: 'default' }, 'STUDENT');
      
      const state = useAuth.getState();
      expect(state.requiresPasswordChange).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should clear errors', () => {
      useAuth.setState({ error: 'Some error' });
      
      const store = useAuth.getState();
      store.clearError();
      
      expect(useAuth.getState().error).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      const { authApi } = await import('@/lib/api-client');
      
      vi.mocked(authApi.getProfile).mockRejectedValue(new Error('Network error'));

      const store = useAuth.getState();
      await store.fetchUser();
      
      const state = useAuth.getState();
      expect(state.error).toBe('Network error');
      expect(state.isAuthenticated).toBe(false);
    });
  });
});
