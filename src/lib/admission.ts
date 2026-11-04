import * as z from "zod";

/** Options and validation for the admission inquiry form — shared by the form (client) and /api/admission (server). */

export const GRADES = ["Playgroup", "Nursery", "LKG", "UKG", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8"] as const;

export const AGES = ["2-4 years", "4-6 years", "6-8 years", "8-10 years", "10+ years"] as const;

export const admissionSchema = z.object({
  full_name: z.string().trim().min(3, "Please enter the child’s full name").max(100),
  class: z.enum(GRADES, { error: "Please choose a grade" }),
  age: z.enum(AGES, { error: "Please choose an age group" }),
  address: z.string().trim().min(3, "Please enter your location").max(200),
  father_name: z.string().trim().min(3, "Please enter the parent’s name").max(100),
  f_cell: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{6,15}$/, "Please enter a valid mobile number (6–15 digits)"),
});

export type AdmissionData = z.infer<typeof admissionSchema>;
