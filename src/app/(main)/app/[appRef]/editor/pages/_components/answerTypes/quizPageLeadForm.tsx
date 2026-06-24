// /components/lead-form-component.tsx
"use client";

import React, { useCallback, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import { Loader2, CheckCircle, PlusCircle, Trash2, Pencil } from "lucide-react";

// Our dynamic form and validation schema generators

//import { createZodSchema } from "@/lib/validation";

// Shadcn UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner"; // Using sonner for toasts
import { Label } from "@/components/ui/label";
import { DialogProvider } from "@/providers/dialog-provider";
import LeadFormEditor from "../helpers/leadFormEditor";

import { debounce } from "lodash";
import { ElementNode } from "@/stores/pageEditorStore/types";
import DialogWrapper from "@/wrappers/dialog-wrapper";

type Props = { section: ElementNode };

// A type for our dynamically generated form values
type DynamicFormValues = z.infer<
  ReturnType<typeof createEditorLeadFormZodSchema>
>;

// --- HELPER: Field Renderer Component ---
const renderField = (
  fieldConfig: FormFieldSchema,
  control: any,
  path: string,
  className?: string
) => {
  const { type, name, ui, enabled, required } = fieldConfig;
  const fieldName = path ? `${path}.${name}` : name;
  // Find the name fields

  return (
    <FormField
      control={control}
      name={fieldName}
      key={fieldName}
      render={({ field, fieldState }) => (
        <FormItem
          className={cn(
            className || (ui.width === "half" ? "w-1/2" : "w-full")
          )}
        >
          {/* {type !== "checkbox" && (
            <FormLabel>
              {ui.label}
              {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )} */}
          <FormControl>
            <div className="relative">
              {ui.leftIcon && (
                <ui.leftIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              )}
              {/* Using a switch to render the correct input type */}
              {(() => {
                switch (type) {
                  case "select":
                    return (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className={cn({ "pl-9": ui.leftIcon })}>
                          <SelectValue placeholder={ui.placeholder} />
                        </SelectTrigger>
                        <SelectContent>
                          {ui.options?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    );
                  case "checkbox":
                    return (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          id={fieldName}
                        />
                        <Label
                          htmlFor={fieldName}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {ui.label}
                        </Label>
                      </div>
                    );
                  case "file":
                    return (
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target.files)}
                        multiple={(ui.fileConstraints?.maxFiles ?? 1) > 1}
                        accept={ui.fileConstraints?.acceptedTypes.join(",")}
                        className={cn("peer ps-9 pt-2", {
                          "pl-9": ui.leftIcon,
                        })}
                      />
                    );
                  default:
                    return (
                      <Input
                        {...field}
                        type={type}
                        placeholder={ui.placeholder}
                        className={cn(
                          "w-full p-4 h-fit text-gray-700",
                          "border border-gray-200 rounded-lg resize-none",
                          "focus:outline-none focus:ring-2 focus-visible:ring-[var(--color-primary)] focus:border-transparent",
                          "placeholder:text-gray-400"
                        )}
                        onChange={(e) => field.onChange(e.target.value.trim())} // Trim input on change
                      />
                    );
                }
              })()}
            </div>
          </FormControl>
          {ui.helperText && <FormDescription>{ui.helperText}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface HeaderProps {
  headerSection: ElementNode;
}
const LeadFormHeader = ({ headerSection }: HeaderProps) => {
  const {
    livemode,
    selectedSectionId,
    previewMode,
    activeElementId,
    editingElementId,
    setEditingElementId,
    updateElementProperty,
    setActiveElementId,
  } = usePageBuilderStore();
  if (!headerSection) return;
  const { id, content, styles, className, type, settings } = headerSection;

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );

  const title =
    !Array.isArray(headerSection?.content) && headerSection?.content.innerText
      ? headerSection?.content.innerText
      : "Add text here";

  const createDebouncedPropertyUpdater = useCallback(
    (elementId: string, Path: string) =>
      debounce((newValue: string) => {
        const propertyPath = `${Path}`;
        console.log({ elementId, propertyPath, newValue });
        updateElementProperty(
          elementId,
          propertyPath,
          newValue,
          selectedSectionId as string
        );
      }, 500),
    [
      selectedSectionId,
      selectedTierId,
      settings?.contentIsDynamic,
      updateElementProperty,
    ]
  );

  const handleHtmlUpdate = useCallback(
    (newValue: string, elementId: string) => {
      const updater = createDebouncedPropertyUpdater(
        elementId,
        "content.innerText"
      );
      updater(newValue);
    },
    [createDebouncedPropertyUpdater]
  );

  return (
    <header className="mb-2 flex flex-col items-center gap-2">
      <div
        className={cn(
          "focus:outline-none",
          !livemode &&
            !previewMode &&
            "cursor-text transition-all duration-150 ease-in-out p-1",
          !livemode &&
            !previewMode &&
            hoveredEditableId === headerSection.id &&
            editingElementId !== headerSection.id &&
            "outline-dashed outline-1 outline-indigo-600 rounded-sm",
          !livemode &&
            !previewMode &&
            editingElementId === headerSection.id &&
            "outline outline-1 outline-indigo-600 rounded-sm"
        )}
        onClick={(e) => {
          if (!livemode || !previewMode) {
            e.stopPropagation();
            setEditingElementId(headerSection.id);
            setActiveElementId(headerSection.id);
          }
        }}
        onMouseEnter={(e) => {
          if (!livemode || !previewMode) {
            e.stopPropagation();
            setHoveredEditableId(headerSection.id);
          }
        }}
        onMouseLeave={(e) => {
          if (!livemode || !previewMode) {
            e.stopPropagation();
            setHoveredEditableId(null);
          }
        }}
      >
        <EditableElement
          key={`${headerSection.id}-title`}
          elementId={headerSection.id}
          sectionId={selectedSectionId as string}
          element={headerSection}
          value={title}
          fieldType="innerText"
          contentSource={settings?.contentIsDynamic ? "dynamic" : "static"}
          tierId={selectedTierId as string}
          style={styles}
          className="sm:text-center font-semibold leading-none tracking-tight "
          isCard={false}
          onHtmlUpdate={(val) => {
            if (!livemode || !previewMode) {
              handleHtmlUpdate(val, headerSection.id);
              setEditingElementId(null);
            }
          }}
          htmlContent={title}
        />
      </div>
    </header>
  );
};

// --- HELPER: Repeated Group Renderer ---
const RepeatedGroupRenderer = ({
  group,
  control,
}: {
  group: RepeatedGroupSchema;
  control: any;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: group.name,
  });

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <h3 className="text-lg font-medium">{group.label}</h3>
      {fields.map((item, index) => (
        <div
          key={item.id}
          className="flex items-start gap-4 rounded-md border p-4 relative"
        >
          <div className="flex flex-wrap gap-4 flex-grow">
            {group.fields
              .sort((a, b) => a.order - b.order)
              .map((fieldConfig) =>
                renderField(fieldConfig, control, `${group.name}.${index}`)
              )}
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
            className="flex-shrink-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {fields.length < group.validation.max && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const newGroup = group.fields.reduce(
              (acc, field) => {
                acc[field.name] = field.defaultValue ?? "";
                return acc;
              },
              {} as Record<string, any>
            );
            append(newGroup);
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add {group.label.slice(0, -1)}
        </Button>
      )}
    </div>
  );
};

// --- MAIN COMPONENT ---
const QuizPageLeadFormComponent = ({ section }: Props) => {
  const {
    pageType,
    livemode,
    toolData,
    selectedSectionId,
    updateQuestion,
    previewMode,
    activeElementId,
    editingElementId,
    setEditingElementId,
    updateElementProperty,
    setActiveElementId,
  } = usePageBuilderStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );
  const textSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "text")[0]
    : undefined;
  const title =
    !Array.isArray(textSection?.content) && textSection?.content.innerText
      ? textSection?.content.innerText
      : "Add text here";
  // 1. Generate Zod schema and default values from our single source of truth
  const formSchema = React.useMemo(
    () =>
      createEditorLeadFormZodSchema(
        toolData?.leadOptinForm as LeadFormSchemaType
      ),
    []
  );
  const defaultValues = React.useMemo(() => {
    const defaults: Record<string, any> = {};
    toolData?.leadOptinForm?.fields.forEach((field) => {
      defaults[field.name] = field.defaultValue ?? "";
    });
    toolData?.leadOptinForm?.groups?.forEach((group) => {
      defaults[group.name] = [];
    });
    return defaults;
  }, []);

  // 2. Initialize react-hook-form
  const form = useForm<DynamicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  });

  const { control, handleSubmit, watch } = form;

  // 3. Get watched values for conditional logic
  const watchedIndustry = watch("industry");

  // 4. Submission handler
  const onSubmit = async (values: DynamicFormValues) => {
    setIsSubmitting(true);
    toast.loading("Submitting your information...");

    // Generate a unique key for this submission attempt to prevent duplicates
    const idempotencyKey = uuidv4();

    // Create FormData for file uploads
    const formData = new FormData();
    formData.append("jsonData", JSON.stringify(values));

    if (values.attachments) {
      for (let i = 0; i < values.attachments.length; i++) {
        formData.append("attachments", values.attachments[i]);
      }
    }
  };

  const formFields = toolData?.leadOptinForm?.fields;
  if (!formFields) return null;
  const firstNameField = formFields.find((f) => f.type === "first_name");
  const lastNameField = formFields.find((f) => f.type === "last_name");

  // Filter out the name fields so they aren't rendered twice
  const otherFields = formFields.filter(
    (f) => f.type !== "first_name" && f.type !== "last_name"
  );

  return (
    <div className="flex w-full items-center justify-center">
      <div className=" flex max-w-lg w-full items-center justify-center p-6 md:p-8">
        <div className=" w-full  ">
          {/* <LeadFormHeader headerSection={textSection as ElementNode} /> */}

          <div className="w-full group/form relative">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/form:opacity-100 rounded-md z-[100]">
              <DialogWrapper
                trigger={
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 text-primary-foreground bg-primary hover:text-white hover:bg-primary"
                  >
                    <Pencil className="h-4 w-4 text-white" />
                    Edit form details
                  </Button>
                }
                title="Edit Form"
                description="Add fields or edit form configuration"
                className=" min-w-[50vw] max-w-md w-fit h-fit max-h-[90%] bg-editor-component text-editor-foreground border-b border-editor-border  rounded-xl shadow-md border border-slate-200"
              >
                <LeadFormEditor />
              </DialogWrapper>
            </div>
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className=" space-y-6">
                {/* Honeypot field rendered with styles to hide it effectively */}
                {toolData?.leadOptinForm?.fields
                  .filter((f) => f.isHoneypot)
                  .map((fieldConfig) => (
                    <FormField
                      key={fieldConfig.name}
                      control={control}
                      name={fieldConfig.name}
                      render={({ field }) => (
                        <FormItem className="hidden" aria-hidden="true">
                          <FormLabel>{fieldConfig.ui.label}</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="text"
                              tabIndex={-1}
                              autoComplete="off"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}

                {/* Render main form fields */}
                {/* Case 1: Both first_name and last_name are enabled -> render side-by-side */}
                {firstNameField?.enabled && lastNameField?.enabled && (
                  <div
                    className="flex w-full flex-col items-start space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
                    key="name_row"
                  >
                    {renderField(
                      firstNameField,
                      control,
                      "",
                      "w-full sm:w-1/2"
                    )}
                    {renderField(lastNameField, control, "", "w-full sm:w-1/2")}
                  </div>
                )}

                {/* Case 2: Only one of the name fields is enabled -> render it full-width */}
                {firstNameField?.enabled &&
                  !lastNameField?.enabled &&
                  renderField(firstNameField, control, "", "w-full")}
                {!firstNameField?.enabled &&
                  lastNameField?.enabled &&
                  renderField(lastNameField, control, "", "w-full")}
                <div className="w-full flex flex-col items-center justify-center gap-4">
                  {otherFields
                    .filter((f) => !f.isHoneypot)
                    .sort((a, b) => a.order - b.order)
                    .map((fieldConfig) => {
                      // Conditional logic check
                      if (fieldConfig.conditional) {
                        const { dependsOn, hasValue } = fieldConfig.conditional;
                        const watchedValue = watch(dependsOn as any);
                        if (watchedValue !== hasValue) {
                          return null; // Don't render if condition not met
                        }
                      }
                      if (!fieldConfig.enabled) return null;
                      return renderField(fieldConfig, control, "");
                    })}
                </div>

                {/* Render repeatable field groups */}
                {toolData?.leadOptinForm?.groups?.map((group) => (
                  <RepeatedGroupRenderer
                    key={group.name}
                    group={group}
                    control={control}
                  />
                ))}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg py-3 px-4 shadow-sm transition duration-150 ease-in-out focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizPageLeadFormComponent;

// Helper for class names, if not already in project
const cn = (...inputs: any[]) => {
  // A simple implementation, use `clsx` and `tailwind-merge` in a real project
  return inputs.filter(Boolean).join(" ");
};
