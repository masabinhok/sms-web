import { z } from "zod";

export const Subject = {
  MATH: 'MATH',
  SCIENCE: 'SCIENCE',
  ENGLISH: 'ENGLISH',
  COMPUTER_SCIENCE: 'COMPUTER_SCIENCE',
  PHYSICS: 'PHYSICS',
  CHEMISTRY: 'CHEMISTRY',
  BIOLOGY: 'BIOLOGY',
  MUSIC: 'MUSIC',
  DANCE: 'DANCE',
  ART: 'ART',
  SOCIAL_STUDIES: 'SOCIAL_STUDIES',
} as const;

export const Class = {
  NURSERY: 'NURSERY',
  LKG: 'LKG',
  UKG: 'UKG',
  FIRST: 'FIRST',
  SECOND: 'SECOND',
  THIRD: 'THIRD',
  FOURTH: 'FOURTH',
  FIFTH: 'FIFTH',
  SIXTH: 'SIXTH',
  SEVENTH: 'SEVENTH',
  EIGHTH: 'EIGHTH',
  NINTH: 'NINTH',
  TENTH: 'TENTH',
  ELEVENTH: 'ELEVENTH',
  TWELFTH: 'TWELFTH',
} as const;

export type SubjectType = typeof Subject[keyof typeof Subject];
export type ClassType = typeof Class[keyof typeof Class];

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

  subjects: z
    .array(z.enum([
      'MATH',
      'SCIENCE',
      'ENGLISH',
      'COMPUTER_SCIENCE',
      'PHYSICS',
      'CHEMISTRY',
      'BIOLOGY',
      'MUSIC',
      'DANCE',
      'ART',
      'SOCIAL_STUDIES',
    ]))
    .optional(),

  classes: z
    .array(z.enum([
      'NURSERY',
      'LKG',
      'UKG',
      'FIRST',
      'SECOND',
      'THIRD',
      'FOURTH',
      'FIFTH',
      'SIXTH',
      'SEVENTH',
      'EIGHTH',
      'NINTH',
      'TENTH',
      'ELEVENTH',
      'TWELFTH',
    ]))
    .optional(),
});

export type TeacherProfileFormData = z.infer<typeof teacherProfileSchema>;
