/**
 * School Website Template Configuration
 * 
 * This file re-exports all constants from the organized constants folder
 * Import from '@/lib/constants' will continue to work as before
 * 
 * For new code, consider importing directly from specific constant files:
 * - import { SCHOOL_INFO } from '@/lib/constants/school-info'
 * - import { NAVIGATION_MENU } from '@/lib/constants/navigation'
 * - import { PROGRAMS } from '@/lib/constants/programs'
 * - etc.
 */

// Re-export everything from constants folder
export * from './constants';
export type { } from './constants/index';

// Also export CURRENT_YEAR and SCHOOL_CONFIG at top level for convenience
export { CURRENT_YEAR, SCHOOL_CONFIG } from './constants/index';

