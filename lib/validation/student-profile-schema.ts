import { z } from "zod";

export const studentProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),

  dob: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Date of birth must be a valid ISO-8601 date"
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  gender: z
    .enum(["Male", "Female", "Other"])
    .optional(),

  class: z
    .string()
    .trim()
    .min(1, "Class is required"),

  section: z
    .string()
    .trim()
    .min(1, "Section must be at least 1 character")
    .max(5, "Section must be at most 5 characters"),

  rollNumber: z
    .string()
    .regex(/^[0-9]+$/, "Roll number must contain only numbers"),

  guardianName: z
    .string()
    .trim()
    .min(2, "Guardian name must be at least 2 characters")
    .max(100, "Guardian name must be at most 100 characters"),

  guardianContact: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Guardian contact must be 10-15 digits"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be at most 200 characters")
    .optional(),
});

export type StudentProfileFormData = z.infer<typeof studentProfileSchema>;
