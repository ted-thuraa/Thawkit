// lib/validators/project.ts
import { z } from "zod";

/**
 * This schema defines the shape of the data from our project form.
 * We'll use this on both the client and server for validation.
 */
export const projectFormSchema = z.object({
  title: z.string().min(1, { message: "Project title is required." }),
  description: z.string().optional(),
});

// We can infer the TypeScript type from the schema
export type ProjectFormValues = z.infer<typeof projectFormSchema>;

const socialMediaSchema = z.object({
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
});

const resultEmailSchema = z.object({
  sendResultEmail: z.boolean().optional(),
  fromAddress: z.string().optional(),
  fromName: z.string().optional(),
  replyToEmail: z.string().optional(),
  emailSubject: z.string().optional(),
  emailContent: z.string().optional(),
});

// The Main Update Schema
export const updateProjectSettingsSchema = z.object({
  id: z.string().min(1).optional(),
  organizationId: z.string().min(1).optional(),
  title: z.string().min(2).max(50).optional(),
  description: z.string().optional(),
  showBrandingLogo: z.boolean().optional(),
  draftMode: z.boolean().optional(),
  thumbnail: z.string().optional(),
  questionOrder: z.string().optional(),
  // JSON Settings fields (Optional wrappers)
  settings: z.record(z.string(), z.any()).optional(),
});
