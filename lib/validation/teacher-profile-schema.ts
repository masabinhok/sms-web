import { z } from "zod";

export const teacherProfileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address"),

  gender: z
    .enum(["Male", "Female", "Other"])
    .refine((val) => ["Male", "Female", "Other"].includes(val), {
      message: "Gender must be Male, Female, or Other"
    }),

  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be at most 200 characters"),

  dob: z
    .string()
    .refine(
      (val) => !isNaN(Date.parse(val)),
      "Date of birth must be a valid ISO-8601 date"
    ),

  subjectIds: z
    .array(z.string().uuid("Each subject must be a valid UUID"))
    .optional(),

  classIds: z
    .array(z.string().uuid("Each class must be a valid UUID"))
    .optional(),
});

export type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>;
