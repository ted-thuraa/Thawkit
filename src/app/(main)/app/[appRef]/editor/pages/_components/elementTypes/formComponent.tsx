"use client";

import React, { useCallback, useMemo, useState } from "react";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode, ProjectData } from "@/stores/pageEditorStore/types";
import { THEME_CLASSES } from "@/lib/constants/theme";
import { cn } from "@/lib/utils";

// Shadcn UI
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
import { Label } from "@/components/ui/label";
import { createEditorLeadFormZodSchema } from "@/lib/pageEditor/editorLeadFormValidation";
import {
  FormFieldSchema,
  LeadFormSchemaType,
} from "@/lib/pageEditor/editorLeadFormSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import { Pencil } from "lucide-react";
import LeadFormEditor from "../helpers/leadFormEditor";
import z from "zod";
import { Textarea } from "@/components/ui/textarea";

interface FormSubComponentProps {
  section: ElementNode;
}

/**
 * HELPER: Extracts specific child elements from the section content
 */
const getFormElements = (section: ElementNode) => {
  const content = Array.isArray(section?.content) ? section.content : [];
  return {
    inputElement: content.find((s) => s.type === "input"),
    btnElement: content.find((s) => s.type === "button_item"),
  };
};

// --- EMAIL ONLY FORM ---
const EmailOnlyForm = ({ section }: FormSubComponentProps) => {
  const { livemode, previewMode, updateElementProperty } =
    usePageBuilderStore();
  const [isEditingCta, setIsEditingCta] = useState(false);
  const [email, setEmail] = useState("");

  const { inputElement, btnElement } = getFormElements(section);
  const formLayout = section.settings?.formLayout || "column";

  const btnText = (btnElement?.content as any)?.innerText || "Send";
  const isEditorMode = !livemode && !previewMode;

  const handleCtaChange = (newValue: string) => {
    if (!btnElement?.id) return;
    updateElementProperty(btnElement.id, "content", {
      ...(btnElement.content as object),
      innerText: newValue,
    });
  };

  return (
    <div
      className={cn(
        "relative w-full flex flex-col gap-3",
        formLayout === "row" ? "sm:flex-row items-center" : "items-stretch"
      )}
    >
      <Input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="johndoe@gmail.com"
        className={cn("h-12", inputElement?.className)}
      />

      <Button
        className={cn(
          "h-12 text-lg font-medium transition-all duration-200 rounded-lg",
          THEME_CLASSES.button,
          btnElement?.className
        )}
        style={btnElement?.styles}
        onClick={(e) => {
          if (isEditorMode) {
            e.preventDefault();
            setIsEditingCta(true);
          }
        }}
      >
        {isEditingCta ? (
          <input
            autoFocus
            className="w-full bg-transparent outline-none border-b border-white/40 text-center"
            defaultValue={btnText}
            onBlur={(e) => {
              handleCtaChange(e.target.value);
              setIsEditingCta(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          />
        ) : (
          <span>{btnText}</span>
        )}
      </Button>
    </div>
  );
};

type DynamicFormValues = z.infer<
  ReturnType<typeof createEditorLeadFormZodSchema>
>;

const formFieldsRenderer = (
  fieldItem: FormFieldSchema,
  control: any,
  path: string,
  className?: string
) => {
  const { type, name, ui, enabled, required } = fieldItem;
  const fieldName = path ? `${path}.${name}` : name;
  return (
    <FormField
      control={control}
      name={fieldName}
      key={fieldName}
      render={({ field, fieldState }) => (
        <FormItem className={cn(className)}>
          <FormControl>
            <div className="relative space-y-2">
              <Label className="text-sm font-medium ">{fieldName}</Label>
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
                        <SelectTrigger
                          className={cn(
                            "h-12 w-full px-4   border border-transparent",
                            "rounded-lg shadow-inner-dark placeholder:text-gray-500",
                            "focus:outline-none focus:ring-1 focus:ring-white/20",
                            "transition duration-150 cursor-pointer",
                            ui.leftIcon && "pl-9"
                          )}
                          style={{
                            boxShadow:
                              "inset 0 1px 3px rgba(0,0,0,0.5), inset 0 0 1px rgba(255,255,255,0.05)",
                          }}
                        >
                          <SelectValue placeholder={ui.placeholder} />
                        </SelectTrigger>

                        <SelectContent className="  rounded-lg shadow-md">
                          {ui.options?.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className=" cursor-pointer"
                            >
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
                  case "text_large":
                    return (
                      <Textarea
                        {...field}
                        placeholder={ui.placeholder}
                        onChange={(e) => field.onChange(e.target.value.trim())} // Trim input on change
                        className="w-full p-4 resize-none  border border-transparent rounded-lg shadow-inner-dark placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition duration-150"
                        style={{
                          boxShadow:
                            "inset 0 1px 3px rgba(0,0,0,0.5), inset 0 0 1px rgba(255,255,255,0.05)",
                        }}
                      />
                    );
                  default:
                    return (
                      <Input
                        {...field}
                        type={type}
                        placeholder={ui.placeholder}
                        onChange={(e) => field.onChange(e.target.value.trim())} // Trim input on change
                        className="w-full h-12 px-4  border border-editor-border rounded-lg  placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-white/20 transition duration-150"
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

// --- NORMAL FORM ---
const NormalForm = ({ section }: FormSubComponentProps) => {
  const {
    livemode,
    activeElementId,
    projectData,
    previewMode,
    updateTool,
    setActiveElementId,
  } = usePageBuilderStore();
  const [isHoveredId, setIsHoveredId] = useState<string | null>(null);
  const [isEditingCta, setIsEditingCta] = useState(false);
  const isEditorMode = !livemode && !previewMode;
  const titleId = `leadFormTitle-${section.id}`;

  const isEditing = isEditorMode && activeElementId === titleId;
  const isHovered = isEditorMode && isHoveredId === titleId;

  const ctaBtnSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "button_item")[0]
    : undefined;

  const leadFormConfig = projectData?.leadOptinForm;
  const optinType = leadFormConfig?.config?.optin_type;
  const showPrivacyCheckbox = optinType !== "Implied";
  const isPrivacyRequired = optinType === "Explicit_Required";
  const privacyStatement = leadFormConfig?.config?.privacy_statement;
  const privacyPolicyUrl = leadFormConfig?.config?.privacy_policy_url;

  const handleTitleChange = useCallback(
    (value: string) => {
      const trimmedValue = value.trim();
      if (trimmedValue.length > 400) return;
      updateTool({
        ...projectData,
        leadOptinForm: {
          ...projectData?.leadOptinForm,
          formName: value,
        } as ProjectData["leadOptinForm"],
      });
    },
    [titleId, updateTool]
  );
  const handleCtaChange = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (trimmed.length > 100) return;

      updateTool({
        ...projectData,
        leadOptinForm: {
          ...projectData?.leadOptinForm,
          cta: trimmed,
        } as ProjectData["leadOptinForm"],
      });
    },
    [projectData, updateTool]
  );

  // 1. Generate Zod schema and default values from our single source of truth
  const formSchema = useMemo(
    () =>
      createEditorLeadFormZodSchema(
        projectData?.leadOptinForm as LeadFormSchemaType
      ),
    [projectData?.leadOptinForm]
  );

  const defaultValues = React.useMemo(() => {
    const defaults: Record<string, any> = {};
    projectData?.leadOptinForm?.fields.forEach((field) => {
      defaults[field.name] = field.defaultValue ?? "";
    });
    projectData?.leadOptinForm?.groups?.forEach((group) => {
      defaults[group.name] = [];
    });
    return defaults;
  }, []);

  const form = useForm<DynamicFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: "onBlur",
  });

  const { control, handleSubmit, watch } = form;
  const headerTitle = projectData?.leadOptinForm?.formName;
  const cta = projectData?.leadOptinForm?.cta ?? "Send";
  const formFields = projectData?.leadOptinForm?.fields;
  if (!formFields) return null;
  const otherFields = formFields.filter(
    (f) => f.type !== "first_name" && f.type !== "last_name"
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      <Form {...form}>
        <form className=" relative space-y-2">
          <div className="group/form relative space-y-6">
            <div className="absolute inset-0 h-full flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/form:opacity-100 rounded-md z-[100]">
              <DialogWrapper
                trigger={
                  <Button
                    size="sm"
                    variant="default"
                    className="h-8 text-white bg-indigo-500 hover:text-white hover:bg-indigo-600"
                  >
                    <Pencil className="h-4 w-4 " />
                    Edit form details
                  </Button>
                }
                title="Edit Form"
                description="Add fields or edit form configuration"
                className=" min-w-[80vw] max-w-md w-fit h-full max-h-[90%] bg-white text-editor-foreground   rounded-xl shadow-md"
              >
                <LeadFormEditor />
              </DialogWrapper>
            </div>
            {/* Honeypot field rendered with styles to hide it effectively */}

            {projectData?.leadOptinForm?.fields
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
                return formFieldsRenderer(fieldConfig, control, "");
              })}

            {showPrivacyCheckbox && (
              <FormField
                control={control}
                name="privacyPolicyAccepted"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md  p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        required={isPrivacyRequired}
                        // Disable checkbox in editor mode to prevent accidental changes
                        disabled={isEditorMode}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {/* Render the statement as a link if a URL is provided */}
                        {privacyPolicyUrl ? (
                          <a
                            href={privacyPolicyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                            // Disable link in editor mode
                            onClick={(e) => isEditorMode && e.preventDefault()}
                          >
                            {privacyStatement ||
                              "I have read and agree to the privacy policy"}
                          </a>
                        ) : (
                          <>
                            {privacyStatement ||
                              "I agree to the terms and conditions"}
                          </>
                        )}
                        {isPrivacyRequired && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            )}
          </div>

          {/* Send Button */}
          <div
            className={cn(
              "relative inline-block w-full",
              isEditorMode && "cursor-text"
            )}
          >
            <Button
              className={cn(
                ctaBtnSection?.className,
                "w-full h-12 mt-8 text-lg font-medium transition-all duration-200 rounded-lg focus:outline-none",
                THEME_CLASSES.button
              )}
              style={ctaBtnSection?.styles}
              onClick={(e) => {
                if (isEditorMode) {
                  e.preventDefault();
                  setIsEditingCta(true);
                }
              }}
            >
              {isEditingCta ? (
                <input
                  autoFocus
                  type="text"
                  defaultValue={cta}
                  className="w-full bg-transparent outline-none border-b border-white/40 text-center"
                  onBlur={(e) => {
                    handleCtaChange(e.target.value);
                    setIsEditingCta(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      (e.target as HTMLInputElement).blur();
                    }
                  }}
                />
              ) : (
                <span>{cta}</span>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

// --- MAIN RENDERER ---
const LandingPageFormRenderer = ({ section }: FormSubComponentProps) => {
  const formType = section.settings?.formType;

  switch (formType) {
    case "email_only":
      return <EmailOnlyForm section={section} />;
    case "normal":
      return <NormalForm section={section} />;
    default:
      return null;
  }
};

export default React.memo(LandingPageFormRenderer);
