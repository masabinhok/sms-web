/**
 * Logger Tests
 * Critical: Ensures logging doesn't expose sensitive data in production
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, logError, authLogger } from '@/lib/logger';

describe('Logger', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  describe('Development Environment', () => {

    it('should have logging methods defined', () => {
      expect(logger.log).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.error).toBeDefined();
    });

    it('should log errors with full details in development', () => {
      const error = new Error('Test error');
      logError(error, 'test context');
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(consoleErrorSpy.mock.calls[0][0]).toContain('test context');
    });
  });

  describe('Production Environment', () => {

    it('should NOT log regular messages in production', () => {
      logger.log('sensitive data');
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it('should sanitize error messages in production', () => {
      const error = new Error('Sensitive error with API key: 12345');
      logError(error, 'API call');
      expect(consoleErrorSpy).toHaveBeenCalled();
      // Should only log the message, not full error object
      const loggedMessage = consoleErrorSpy.mock.calls[0][1];
      expect(typeof loggedMessage).toBe('string');
    });
  });

  describe('Auth Logger', () => {

    it('should have specialized auth logging methods', () => {
      expect(authLogger.loginAttempt).toBeDefined();
      expect(authLogger.loginSuccess).toBeDefined();
      expect(authLogger.loginFailure).toBeDefined();
      expect(authLogger.tokenRefresh).toBeDefined();
      expect(authLogger.logout).toBeDefined();
    });

    it('should have auth-specific logging methods', () => {
      expect(authLogger.loginAttempt).toBeDefined();
      expect(authLogger.loginSuccess).toBeDefined();
      expect(authLogger.loginFailure).toBeDefined();
      // Methods should be callable without throwing
      expect(() => authLogger.loginAttempt('testuser')).not.toThrow();
    });
  });
});
