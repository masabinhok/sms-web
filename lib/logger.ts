/**
 * Production-safe logging utilities
 * Only logs in development, silent in production
 */

type LogLevel = 'log' | 'warn' | 'error' | 'info' | 'debug';

const isDevelopment = process.env.NODE_ENV === 'development';

function createLogger(level: LogLevel) {
  return (...args: unknown[]) => {
    if (isDevelopment) {
      console[level](...args);
    }
  };
}

export const logger = {
  log: createLogger('log'),
  warn: createLogger('warn'),
  error: createLogger('error'),
  info: createLogger('info'),
  debug: createLogger('debug'),
};

// Always log errors, but sanitize in production
export function logError(error: unknown, context?: string) {
  if (isDevelopment) {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error);
  } else {
    // In production, log minimal info (could send to external service)
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, error instanceof Error ? error.message : 'Unknown error');
  }
}

// For auth-specific logging
export const authLogger = {
  loginAttempt: (username: string) => {
    if (isDevelopment) {
      console.log(`[Auth] Login attempt for: ${username}`);
    }
  },
  loginSuccess: (role: string) => {
    if (isDevelopment) {
      console.log(`[Auth] Login successful for role: ${role}`);
    }
  },
  loginFailure: (reason: string) => {
    if (isDevelopment) {
      console.log(`[Auth] Login failed: ${reason}`);
    }
  },
  tokenRefresh: (success: boolean) => {
    if (isDevelopment) {
      console.log(`[Auth] Token refresh: ${success ? 'success' : 'failed'}`);
    }
  },
  logout: () => {
    if (isDevelopment) {
      console.log('[Auth] User logged out');
    }
  },
};
