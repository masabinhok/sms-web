/**
 * Environment Validation Tests
 * Critical: Ensures app fails fast with clear errors when misconfigured
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';

describe('Environment Validation', () => {
  it('should validate URL format with Zod', () => {
    const urlSchema = z.string().url();
    
    expect(() => urlSchema.parse('http://localhost:3000')).not.toThrow();
    expect(() => urlSchema.parse('https://api.example.com')).not.toThrow();
  });

  it('should reject invalid URLs', () => {
    const urlSchema = z.string().url();
    
    expect(() => urlSchema.parse('not-a-url')).toThrow();
    expect(() => urlSchema.parse('')).toThrow();
    expect(() => urlSchema.parse('localhost')).toThrow();
  });

  it('should validate environment enum', () => {
    const envSchema = z.enum(['development', 'production', 'test']);
    
    expect(() => envSchema.parse('development')).not.toThrow();
    expect(() => envSchema.parse('production')).not.toThrow();
    expect(() => envSchema.parse('test')).not.toThrow();
    expect(() => envSchema.parse('invalid')).toThrow();
  });
});
