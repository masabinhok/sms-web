import { z } from "zod";

export const adminProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),
});

export type AdminProfileFormData = z.infer<typeof adminProfileSchema>;
