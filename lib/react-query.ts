/**
 * React Query Configuration
 * Centralized data fetching, caching, and state management
 */

import { QueryClient, DefaultOptions } from '@tanstack/react-query';

// Default options for all queries and mutations
const queryConfig: DefaultOptions = {
  queries: {
    // Data considered fresh for 5 minutes
    staleTime: 5 * 60 * 1000,
    // Keep unused data in cache for 10 minutes
    gcTime: 10 * 60 * 1000,
    // Retry failed requests up to 3 times
    retry: 3,
    // Exponential backoff for retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    // Don't refetch on window focus in development (annoying)
    refetchOnWindowFocus: process.env.NODE_ENV === 'production',
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Refetch on mount if data is stale
    refetchOnMount: true,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
  },
};

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

// Query keys for consistent cache management
export const queryKeys = {
  // Auth
  auth: {
    user: ['auth', 'user'] as const,
    profile: ['auth', 'profile'] as const,
  },
  
  // Students
  students: {
    all: (params?: unknown) => ['students', params] as const,
    detail: (id: string) => ['students', id] as const,
    stats: ['students', 'stats'] as const,
  },
  
  // Teachers
  teachers: {
    all: (params?: unknown) => ['teachers', params] as const,
    detail: (id: string) => ['teachers', id] as const,
    stats: ['teachers', 'stats'] as const,
  },
  
  // Admins
  admins: {
    all: (params?: unknown) => ['admins', params] as const,
    detail: (id: string) => ['admins', id] as const,
    stats: ['admins', 'stats'] as const,
  },
  
  // Academics
  classes: {
    all: (params?: { academicYear?: string; isActive?: boolean }) => ['classes', params] as const,
    detail: (id: string) => ['classes', id] as const,
    subjects: (id: string) => ['classes', id, 'subjects'] as const,
  },
  
  subjects: {
    all: (params?: { category?: string; isActive?: boolean }) => ['subjects', params] as const,
    detail: (id: string) => ['subjects', id] as const,
  },
  
  // School
  school: {
    info: ['school', 'info'] as const,
  },
  
  // Activities
  activities: {
    all: (params?: unknown) => ['activities', params] as const,
    detail: (id: string) => ['activities', id] as const,
    stats: ['activities', 'stats'] as const,
  },
} as const;

// Type-safe query key helper
export type QueryKeys = typeof queryKeys;
