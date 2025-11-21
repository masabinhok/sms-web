/**
 * Environment Variable Validation
 * Validates critical environment variables at application startup
 */

import { z } from 'zod';

const envSchema = z.object({
  // API Configuration (Required)
  NEXT_PUBLIC_API_URL: z.string().url('NEXT_PUBLIC_API_URL must be a valid URL'),
  
  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>;

// Validate environment variables
function validateEnv(): Env {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((err) => `  - ${err.path.join('.')}: ${err.message}`).join('\n');
      
      console.error('❌ Environment variable validation failed:\n');
      console.error(missingVars);
      console.error('\n💡 Please check your .env file and ensure all required variables are set.');
      console.error('📄 See .env.example for reference.\n');
      
      throw new Error('Invalid environment variables');
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv();

// Helper to safely access env vars with fallbacks
export function getApiUrl(): string {
  return env.NEXT_PUBLIC_API_URL;
}

export function isProd(): boolean {
  return env.NODE_ENV === 'production';
}

export function isDev(): boolean {
  return env.NODE_ENV === 'development';
}
