// /lib/validation.ts
import { z } from "zod";
import {
  LeadFormSchemaType,
  FormFieldSchema,
  RepeatedGroupSchema,
} from "./editorLeadFormSchema";

/**
 * Dynamically creates a Zod validation schema from a FormSchema definition.
 * @param schema The FormSchema object.
 * @returns A Zod object schema for validation.
 */
export const createEditorLeadFormZodSchema = (
  schema: LeadFormSchemaType
): z.ZodEffects<z.ZodObject<any>> => {
  const shape: { [key: string]: z.ZodTypeAny } = {};

  // Process standalone fields
  schema.fields.forEach((field) => {
    shape[field.name] = createZodValidator(field);
  });

  // Process repeated groups
  schema.groups?.forEach((group) => {
    const groupShape: { [key: string]: z.ZodTypeAny } = {};
    group.fields.forEach((field) => {
      groupShape[field.name] = createZodValidator(field);
    });

    shape[group.name] = z
      .array(z.object(groupShape))
      .min(
        group.validation.min,
        `You must add at least ${group.validation.min} item(s).`
      )
      .max(
        group.validation.max,
        `You can add at most ${group.validation.max} item(s).`
      )
      .optional();
  });

  // Refine the schema for conditional fields
  // Example: companySize is required only if industry is 'enterprise'
  return z.object(shape).superRefine((data, ctx) => {
    schema.fields.forEach((field) => {
      if (field.conditional && field.required) {
        const { dependsOn, hasValue } = field.conditional;
        if (data[dependsOn] === hasValue && !data[field.name]) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [field.name],
            message: `${field.ui.label} is required.`,
          });
        }
      }
    });
  });
};

/**
 * Creates a Zod validator for a single field based on its schema definition.
 * @param field The FormFieldSchema object.
 * @returns A Zod validator.
 */
function createZodValidator(field: FormFieldSchema): z.ZodTypeAny {
  let validator: z.ZodTypeAny;

  switch (field.type) {
    case "email":
      validator = z.string().email({ message: "Invalid email address." });
      break;
    case "tel":
      validator = z.string().min(1, { message: "Phone number is required." });
      if (field.validation.min !== undefined) {
        validator = (validator as z.ZodString).min(field.validation.min, {
          message:
            field.validation.customMessage ||
            `Must be at least ${field.validation.min} characters.`,
        });
      }
      break;
    case "checkbox":
      validator = z.boolean().default(field.defaultValue || false);
      break;
    case "file":
      const {
        maxSizeMB = 5,
        maxFiles = 1,
        acceptedTypes = [],
      } = field.ui.fileConstraints || {};
      const MAX_FILE_SIZE = maxSizeMB * 1024 * 1024;

      validator = z
        .any() // Using `any` because FileList comes from the browser
        .refine(
          (files: FileList) => !field.required || files?.length > 0,
          "File is required."
        )
        .refine(
          (files: FileList) => !files || files.length <= maxFiles,
          `Maximum of ${maxFiles} files allowed.`
        )
        .refine(
          (files: FileList) =>
            !files ||
            Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
          `Each file must be ${maxSizeMB}MB or less.`
        )
        .refine(
          (files: FileList) =>
            !files ||
            Array.from(files).every(
              (file) =>
                acceptedTypes.includes(file.type) ||
                acceptedTypes.includes(file.type.split("/")[0] + "/*")
            ),
          "Invalid file type."
        )
        .optional();
      break;
    case "text":
    case "select":
    //case "textarea":
    default:
      validator = z.string();
      if (field.validation.min !== undefined) {
        validator = (validator as z.ZodString).min(field.validation.min, {
          message:
            field.validation.customMessage ||
            `${field.ui.label} must be at least ${field.validation.min} characters.`,
        });
      }
      if (field.validation.max !== undefined) {
        validator = (validator as z.ZodString).max(field.validation.max, {
          message:
            field.validation.customMessage ||
            `${field.ui.label} must be no more than ${field.validation.max} characters.`,
        });
      }
      break;
  }

  if (field.isHoneypot) {
    validator = z
      .string()
      .max(0, { message: "This field must be empty." })
      .optional();
  } else if (!field.required && field.type !== "checkbox") {
    // Make non-required fields optional, allowing empty strings
    validator = validator.optional().or(z.literal(""));
  } else if (field.required && validator instanceof z.ZodString) {
    // For required strings, ensure they are not empty
    validator = validator.min(1, { message: `${field.ui.label} is required.` });
  }

  return validator;
}
