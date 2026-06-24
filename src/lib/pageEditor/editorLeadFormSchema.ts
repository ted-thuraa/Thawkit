// /lib/form-schema.ts
import { z } from "zod";
import {
  User,
  Building,
  Briefcase,
  Globe,
  Phone,
  Mail,
  FileText,
  CheckSquare,
  Hash,
} from "lucide-react";

/**
 * @file This file defines the runtime schema for our dynamic lead form.
 * It serves as the single source of truth for generating the UI,
 * client-side validation, and server-side validation.
 *
 * Developer Experience: To add, remove, or modify a field, you only
 * need to edit the `leadFormSchema` object below. The rest of the
 * system (UI, validation, database) will adapt automatically.
 */

// --- TYPE DEFINITIONS ---

/** UI rendering hints for a form field. */
export interface FieldUIMetadata {
  label: string;
  placeholder?: string;
  helperText?: string;
  width?: "full" | "half"; // Grid width
  leftIcon?: React.ElementType;
  rightIcon?: React.ElementType;
  // For 'select' or 'radio' types
  options?: { label: string; value: string }[];
  // For 'file' type
  fileConstraints?: {
    acceptedTypes: string[]; // e.g., ['application/pdf', 'image/*']
    maxSizeMB: number;
    maxFiles: number;
  };
  // For inputs that need masking (e.g., phone, currency)
  inputMask?: string;
  // Aria attributes for accessibility
  ariaLabel?: string;
  ariaDescribedBy?: string;
}

/** Defines conditional visibility logic for a field. */
export interface ConditionalVisibility {
  // The name of the field to watch
  dependsOn: string;
  // The value the watched field must have for this field to be visible
  hasValue: string | number | boolean;
}

/** Represents a single field in the form schema. */
export type LeadFieldType =
  | "text"
  | "text_large"
  | "first_name"
  | "last_name"
  | "text"
  | "email"
  | "tel"
  | "select"
  | "file"
  | "checkbox"
  | "date"
  | "hidden";

/** Represents a single field in the form schema. */
export interface FormFieldSchema {
  name: string;
  type: LeadFieldType; // From Prisma Enum: text | email | tel | select | checkbox | file | textarea | hidden | date
  order: number;
  enabled: boolean;
  required: boolean;
  defaultValue?: any;
  ui: FieldUIMetadata;
  validation: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    customMessage?: string;
  };
  conditional?: ConditionalVisibility;
  isHoneypot?: boolean; // Security flag
  isReadOnly?: boolean;
}

/** Represents a group of fields that can be repeated (an array of objects). */
export interface RepeatedGroupSchema {
  name: string;
  order: number;
  label: string;
  fields: FormFieldSchema[];
  validation: {
    min: number; // Minimum number of groups
    max: number; // Maximum number of groups
  };
}

export interface LeadFormConfig {
  optin_type: "Implied" | "Explicit_Optional" | "Explicit_Required";
  leadform_entry: "before" | "after";
  privacy_statement?: string;
  privacy_wording?: string;
  privacy_policy_url?: string;
}

/** The complete form schema definition. */
export interface LeadFormSchemaType {
  id: string;
  formName: string;
  cta: string;
  fields: FormFieldSchema[];
  groups?: RepeatedGroupSchema[];
  config?: LeadFormConfig;
}

// --- SCHEMA IMPLEMENTATION ---

export const leadFormSchema: LeadFormSchemaType = {
  id: "lead-gen-v1",
  formName: "Where should we send your result",
  cta: "Send Results",
  fields: [
    {
      name: "firstName",
      type: "text",
      order: 1,
      enabled: true,
      required: true,
      ui: {
        label: "First Name",
        placeholder: "John",
        width: "half",
      },
      validation: {
        min: 2,
        max: 100,
        customMessage: "First name must be between 2 and 100 characters.",
      },
    },
    {
      name: "lastName",
      type: "text",
      order: 2,
      enabled: true,
      required: true,
      ui: {
        label: "Last Name",
        placeholder: "Doe",
        width: "half",
      },
      validation: {
        min: 2,
        max: 100,
        customMessage: "Last name must be between 2 and 100 characters.",
      },
    },
    {
      name: "email",
      type: "email",
      order: 3,
      enabled: true,
      required: true,
      ui: {
        label: "Email Address",
        placeholder: "john.doe@example.com",
        width: "full",
        //leftIcon: Mail,
      },
      validation: {},
    },
    // {
    //   name: "telephone",
    //   type: "tel",
    //   order: 4,
    //   required: true,
    //   ui: {
    //     label: "Phone Number",
    //     placeholder: "(555) 123-4567",
    //     width: "full",
    //     //leftIcon: Phone,
    //     inputMask: "(999) 999-9999", // Example mask hint
    //   },
    //   validation: {
    //     min: 10,
    //     customMessage: "Please enter a valid phone number.",
    //   },
    // },
    // {
    //   name: "country",
    //   type: "select",
    //   order: 5,
    //   required: false,
    //   ui: {
    //     label: "Country",
    //     placeholder: "Select your country",
    //     width: "full",
    //     leftIcon: Globe,
    //     options: [
    //       { label: "United States", value: "US" },
    //       { label: "Canada", value: "CA" },
    //       { label: "United Kingdom", value: "GB" },
    //       { label: "Kenya", value: "KE" },
    //     ],
    //   },
    //   validation: {},
    // },
    // {
    //   name: "industry",
    //   type: "select",
    //   order: 6,
    //   required: false,
    //   ui: {
    //     label: "Industry",
    //     placeholder: "Select your industry",
    //     width: "full",
    //     leftIcon: Briefcase,
    //     options: [
    //       { label: "Technology", value: "tech" },
    //       { label: "Healthcare", value: "health" },
    //       { label: "Finance", value: "finance" },
    //       { label: "Enterprise", value: "enterprise" },
    //     ],
    //   },
    //   validation: {},
    // },
    // {
    //   name: "companySize",
    //   type: "select",
    //   order: 7,
    //   required: true, // Conditionally required
    //   ui: {
    //     label: "Company Size",
    //     placeholder: "Select company size",
    //     width: "full",
    //     leftIcon: Building,
    //     options: [
    //       { label: "1-10 Employees", value: "1-10" },
    //       { label: "11-50 Employees", value: "11-50" },
    //       { label: "51-200 Employees", value: "51-200" },
    //       { label: "201+ Employees", value: "201+" },
    //     ],
    //   },
    //   validation: {},
    //   conditional: {
    //     dependsOn: "industry",
    //     hasValue: "enterprise",
    //   },
    // },
    // {
    //   name: "attachments",
    //   type: "file",
    //   order: 8,
    //   required: false,
    //   ui: {
    //     label: "Attachments",
    //     helperText: "PDFs or images up to 5MB each. Max 3 files.",
    //     width: "full",
    //     leftIcon: FileText,
    //     fileConstraints: {
    //       acceptedTypes: ["application/pdf", "image/*"],
    //       maxSizeMB: 5,
    //       maxFiles: 3,
    //     },
    //   },
    //   validation: {},
    // },
    {
      name: "subscribe",
      type: "checkbox",
      order: 9,
      enabled: true,
      required: false,
      defaultValue: true,
      ui: {
        label: "Subscribe to our newsletter for updates.",
        width: "full",
      },
      validation: {},
    },
    {
      name: "honeypot", // This name is intentionally generic
      type: "hidden",
      order: 99,
      enabled: true,
      required: false,
      isHoneypot: true,
      ui: {
        label: "Please leave this field blank",
      },
      validation: {
        max: 0, // Must be an empty string
      },
    },
  ],

  config: {
    optin_type: "Implied",
    leadform_entry: "before",
    privacy_statement: "I have read and agree to the privacy policy",
    privacy_wording: "receive updates via email",
    privacy_policy_url: "",
  },
};
