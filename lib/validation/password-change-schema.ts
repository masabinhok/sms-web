import { z } from 'zod';

/**
 * Password Change Schema
 * Matches the backend PasswordChangeDto validation rules
 * 
 * Requirements:
 * - At least 8 characters long
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (@$!%*?&)
 */

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .trim()
    .min(1, 'Current password is required'),
  
  newPassword: z
    .string()
    .trim()
    .min(8, 'New password must be at least 8 characters long')
    .regex(
      passwordRegex,
      'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'
    ),
  
  confirmPassword: z
    .string()
    .trim()
    .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;
