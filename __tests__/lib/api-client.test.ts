/**
 * API Client Tests
 * Critical: Tests authentication, token refresh, and error handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from '@/lib/api-client';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Client', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic HTTP Methods', () => {
    it('should make GET requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ data: 'test' })),
      });

      const result = await api.get('/test');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
      expect(result).toEqual({ data: 'test' });
    });

    it('should make POST requests with data', async () => {
      const testData = { username: 'test', password: 'pass' };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve(JSON.stringify({ success: true })),
      });

      await api.post('/auth/login', testData);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/auth/login'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(testData),
        })
      );
    });
  });

  describe('Error Handling', () => {
    it('should throw error on 400 response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        text: () => Promise.resolve(JSON.stringify({ message: 'Bad request' })),
      });

      await expect(api.get('/test')).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(api.get('/test')).rejects.toThrow('Network error');
    });

    it('should handle malformed JSON responses gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('not valid json'),
      });

      // Should not throw, should return null
      const result = await api.get('/test');
      expect(result).toBeNull();
    });
  });

  describe('Token Refresh Logic', () => {
    it('should attempt token refresh on 401', async () => {
      // First call fails with 401
      mockFetch
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          text: () => Promise.resolve(''),
        })
        // Refresh succeeds
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: () => Promise.resolve(JSON.stringify({ success: true })),
        })
        // Retry original request succeeds
        .mockResolvedValueOnce({
          ok: true,
          status: 200,
          text: () => Promise.resolve(JSON.stringify({ data: 'success' })),
        });

      const result = await api.get('/protected');
      
      // Should have made 3 calls: original, refresh, retry
      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ data: 'success' });
    });

    it('should not retry on 401 for login endpoint', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: () => Promise.resolve(JSON.stringify({ message: 'Invalid credentials' })),
      });

      await expect(api.post('/auth/login', {})).rejects.toThrow();
      
      // Should only make 1 call, no retry
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Request Configuration', () => {
    it('should include credentials in all requests', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      await api.get('/test');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          credentials: 'include',
        })
      );
    });

    it('should set Content-Type header', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        text: () => Promise.resolve('{}'),
      });

      await api.get('/test');
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });
  });
});
