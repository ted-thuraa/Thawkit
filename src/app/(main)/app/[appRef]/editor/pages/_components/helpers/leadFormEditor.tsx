"use client";

import React, { useCallback, useMemo } from "react";
import { useDebouncedCallback } from "use-debounce";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  PlusCircle,
  Trash2,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  FormFieldSchema,
  LeadFormSchemaType,
  LeadFieldType,
} from "@/lib/pageEditor/editorLeadFormSchema";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

const fieldTypes: { value: LeadFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  // { value: "first_name", label: "First name" },
  // { value: "last_name", label: "Last name" },
  // { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "select", label: "Select (Dropdown)" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
  { value: "file", label: "File Upload" },
];

/**
 * Converts a string into a URL-friendly "kebab-case" slug.
 * Example: "First Name" -> "first-name"
 * @param str The string to convert.
 * @returns The kebab-cased string.
 */
export const slugify = (str: string): string => {
  return str
    .toLowerCase() // 1. Convert to lowercase
    .trim() // 2. Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, "") // 3. Remove all non-word, non-space, non-hyphen characters
    .replace(/[\s_-]+/g, "-") // 4. Replace all spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ""); // 5. Remove leading/trailing hyphens
};

/**
 * Main editor component for the Lead Form.
 * Uses tabs to separate field management from general form configuration.
 */
const LeadFormEditor = () => {
  const { projectData, updateTool } = usePageBuilderStore();
  const formSchema = projectData?.leadOptinForm as
    | LeadFormSchemaType
    | undefined;

  if (!formSchema) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Lead form data not found. Please configure it in your tool settings.
      </div>
    );
  }

  const handleFormConfigChange = (
    key: keyof NonNullable<LeadFormSchemaType["config"]>,
    value: any
  ) => {
    updateTool({
      ...projectData,
      leadOptinForm: {
        ...formSchema,
        config: {
          optin_type: "Implied", // Provide a default value
          leadform_entry: "after",
          ...formSchema.config,
          [key]: value,
        },
      },
    });
  };

  const handleFormNameChange = (newName: string) => {
    updateTool({
      ...projectData,
      leadOptinForm: {
        ...formSchema,
        formName: newName,
      },
    });
  };

  return (
    <div className=" bg-background h-full flex flex-col">
      <Tabs defaultValue="fields" className="h-full flex-grow flex flex-col">
        <TabsList className="grid w-full grid-cols-2 rounded-md">
          <TabsTrigger className="rounded-md" value="fields">
            Fields
          </TabsTrigger>
          <TabsTrigger className="rounded-md" value="config">
            Configuration
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="fields"
          className="h-full flex-grow mt-2 flex flex-col overflow-hidden"
        >
          <FieldListEditor schema={formSchema} />
        </TabsContent>
        <TabsContent
          value="config"
          className="h-full flex-grow mt-2 flex flex-col overflow-hidden"
        >
          {/* Header (fixed, non-scrollable) */}
          <div className="space-y-2 p-2">
            <h3 className="text-foreground text-sm leading-4 font-medium">
              Data protection settings
            </h3>
            <p className="text-sm">
              Control the visibility and functionality of the opt in checkbox
              shown on this lead form and link to your privacy policy
            </p>
          </div>
          <Separator />

          {/* Scrollable content */}
          <div className=" h-72 overflow-hidden overflow-y-auto pl-6 space-y-6 mt-4">
            <div className="space-y-2">
              <Label htmlFor="optin_type">Display</Label>
              <RadioGroup
                className="gap-6 mt-2"
                value={formSchema.config?.leadform_entry}
                onValueChange={(v) =>
                  handleFormConfigChange("leadform_entry", v)
                }
              >
                {/* Implied */}
                <div className="flex items-start gap-2">
                  <RadioGroupItem
                    value="before"
                    id="leadform_entry-before"
                    aria-describedby="leadform_entry-before-description"
                  />
                  <div className="grid grow gap-2">
                    <Label htmlFor="optin_type-implied">Before</Label>
                    <p
                      id="optin_type-implied-description"
                      className="text-muted-foreground text-xs"
                    >
                      Visitors will not be able to start without completing the
                      form first.
                    </p>
                  </div>
                </div>

                {/* Explicit (Optional) */}
                <div className="flex items-start gap-2">
                  <RadioGroupItem
                    value="after"
                    id="leadform_entry-after"
                    aria-describedby="leadform_entry-before-description"
                  />
                  <div className="grid grow gap-2">
                    <Label htmlFor="optin_type-explicit-optional">After</Label>
                    <p
                      id="optin_type-explicit-optional-description"
                      className="text-muted-foreground text-xs"
                    >
                      Visitors will be able to proceed without completing the
                      form.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="optin_type">OptinConsent Type</Label>
              <RadioGroup
                className="gap-6 mt-2"
                value={formSchema.config?.optin_type}
                onValueChange={(v) => handleFormConfigChange("optin_type", v)}
              >
                {/* Implied */}
                <div className="flex items-start gap-2">
                  <RadioGroupItem
                    value="Implied"
                    id="optin_type-implied"
                    aria-describedby="optin_type-implied-description"
                  />
                  <div className="grid grow gap-2">
                    <Label htmlFor="optin_type-implied">Implied Consent</Label>
                    <p
                      id="optin_type-implied-description"
                      className="text-muted-foreground text-xs"
                    >
                      Visitors will not see any optin checkbox.
                    </p>
                  </div>
                </div>

                {/* Explicit (Optional) */}
                <div className="flex items-start gap-2">
                  <RadioGroupItem
                    value="Explicit_Optional"
                    id="optin_type-explicit-optional"
                    aria-describedby="optin_type-explicit-optional-description"
                  />
                  <div className="grid grow gap-2">
                    <Label htmlFor="optin_type-explicit-optional">
                      Explicit Consent (Optional)
                    </Label>
                    <p
                      id="optin_type-explicit-optional-description"
                      className="text-muted-foreground text-xs"
                    >
                      Visitors will see an optin checkbox but will be able to
                      continue without optin in.
                    </p>
                  </div>
                </div>

                {/* Explicit (Required) */}
                <div className="flex items-start gap-2">
                  <RadioGroupItem
                    value="Explicit_Required"
                    id="optin_type-explicit-required"
                    aria-describedby="optin_type-explicit-required-description"
                  />
                  <div className="grid grow gap-2">
                    <Label htmlFor="optin_type-explicit-required">
                      Explicit Consent (Required)
                    </Label>
                    <p
                      id="optin_type-explicit-required-description"
                      className="text-muted-foreground text-xs"
                    >
                      Visitors will be required to optin to proceed.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>
            {formSchema.config?.optin_type !== "Implied" && (
              <div className="space-y-2 w-1/2">
                <Label htmlFor="privacy_wording">Optin Wording</Label>
                <Input
                  id="privacy_wording"
                  placeholder="e.g. receive updates via email."
                  value={formSchema.config?.privacy_wording}
                  onChange={(e) =>
                    handleFormConfigChange("privacy_wording", e.target.value)
                  }
                />
              </div>
            )}

            <div className="space-y-2 w-1/2">
              <Label htmlFor="privacy_statement">Privacy Statement</Label>
              <Textarea
                id="privacy_statement"
                placeholder="e.g. We respect your privacy."
                value={formSchema.config?.privacy_statement}
                onChange={(e) =>
                  handleFormConfigChange("privacy_statement", e.target.value)
                }
              />
            </div>

            <div className="space-y-2 w-1/2">
              <Label htmlFor="privacy_policy_url">Privacy Policy URL</Label>
              <Input
                id="privacy_policy_url"
                placeholder="https://yourcompany.com/privacy"
                value={formSchema.config?.privacy_policy_url}
                onChange={(e) =>
                  handleFormConfigChange("privacy_policy_url", e.target.value)
                }
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

/**
 * Manages the list of fields, including adding, deleting, and reordering.
 */
const FieldListEditor = ({ schema }: { schema: LeadFormSchemaType }) => {
  const { projectData, updateTool } = usePageBuilderStore();

  const handleAddField = () => {
    const newField: FormFieldSchema = {
      name: `newField${schema.fields.length + 1}`,
      type: "text",
      order: schema.fields.length + 1,
      enabled: true,
      required: false,
      ui: { label: "New Field", placeholder: "" },
      validation: {},
    };
    updateTool({
      ...projectData,
      leadOptinForm: {
        ...schema,
        fields: [
          ...schema.fields.filter((f) => !f.isHoneypot),
          newField,
          ...schema.fields.filter((f) => f.isHoneypot),
        ],
      },
    });
  };

  const handleUpdateField = useCallback(
    (index: number, updatedField: FormFieldSchema) => {
      const newFields = [...schema.fields];
      newFields[index] = updatedField;
      updateTool({
        ...projectData,
        leadOptinForm: { ...schema, fields: newFields },
      });
    },
    [schema, projectData, updateTool]
  );

  const handleDeleteField = useCallback(
    (index: number) => {
      const newFields = schema.fields.filter((_, i) => i !== index);
      updateTool({
        ...projectData,
        leadOptinForm: { ...schema, fields: newFields },
      });
    },
    [schema, projectData, updateTool]
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = schema.fields.findIndex((f) => f.name === active.id);
      const newIndex = schema.fields.findIndex((f) => f.name === over.id);
      const reorderedFields = arrayMove(schema.fields, oldIndex, newIndex);
      updateTool({
        ...projectData,
        leadOptinForm: {
          ...schema,
          fields: reorderedFields.map((f, i) => ({ ...f, order: i + 1 })),
        },
      });
    }
  };

  const fieldsWithoutHoneypot = useMemo(
    () => schema.fields.filter((f) => !f.isHoneypot),
    [schema.fields]
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-6 font-sans bg-gray-50 rounded-xl border border-gray-200">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={fieldsWithoutHoneypot.map((f) => f.name)}
          strategy={verticalListSortingStrategy}
        >
          <Accordion type="single" collapsible className="w-full space-y-3">
            {fieldsWithoutHoneypot.map((field, index) => (
              <SortableFieldItem
                key={field.name}
                field={field}
                index={index}
                onUpdate={handleUpdateField}
                onDelete={handleDeleteField}
              />
            ))}
          </Accordion>
        </SortableContext>
      </DndContext>
      <Button
        variant="outline"
        onClick={handleAddField}
        className="mt-4 px-4 py-2 text-sm font-semibold text-indigo-700 bg-indigo-100 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
      >
        <PlusCircle className="mr-2 h-4 w-4" /> Add Field
      </Button>
    </div>
  );
};

/**
 * A memoized, sortable component representing a single field in the editor.
 */
const SortableFieldItem = React.memo(
  ({
    field,
    index,
    onUpdate,
    onDelete,
  }: {
    field: FormFieldSchema;
    index: number;
    onUpdate: (index: number, field: FormFieldSchema) => void;
    onDelete: (index: number) => void;
  }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: field.name });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const debouncedUpdate = useDebouncedCallback(onUpdate, 300);

    const handleChange = (key: keyof FormFieldSchema, value: any) => {
      let updatedField = { ...field, [key]: value };
      // If label changes, update name slug
      if (key === "ui" && "label" in value) {
        const newName = slugify(value.label);
        // Check for uniqueness before assigning
        // (In a more complex app, you'd check against all other field names)
        if (newName) updatedField.name = newName;
      }
      // If type is first_name or last_name → set width = half
      if (key === "type" && (value === "first_name" || value === "last_name")) {
        updatedField.ui = { ...updatedField.ui, width: "half" };
      }
      debouncedUpdate(index, updatedField);
    };

    const handleUIChange = (key: keyof FormFieldSchema["ui"], value: any) => {
      handleChange("ui", { ...field.ui, [key]: value });
    };

    const handleValidationChange = (
      key: keyof FormFieldSchema["validation"],
      value: any
    ) => {
      handleChange("validation", { ...field.validation, [key]: value });
    };

    const specialTypes = ["first_name", "last_name", "email"];
    const isSpecialType = specialTypes.includes(field.type);

    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-lg shadow-sm"
      >
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          type="button"
          className="cursor-grab p-1 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Drag to reorder answer"
        >
          <GripVertical size={20} />
        </button>
        <AccordionItem
          value={field.name}
          className="flex-grow w-full bg-transparent border-none"
        >
          <AccordionTrigger className="px-2 py-1.5 hover:no-underline">
            <div className="flex items-center gap-2 w-full">
              <p className="font-normal text-sm">
                {field.ui.label || "(No Label)"}
              </p>

              {/* {field.required && (
                <span className="text-xs font-bold text-primary">Required</span>
              )} */}
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-background rounded-b-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor={`label-${index}`}>Label</Label>
                <Input
                  id={`label-${index}`}
                  value={field.ui.label}
                  onChange={(e) => handleUIChange("label", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`type-${index}`}>Field Type</Label>
                <Select
                  value={field.type}
                  onValueChange={(v) => handleChange("type", v)}
                >
                  <SelectTrigger id={`type-${index}`}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fieldTypes.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>
                        {ft.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`placeholder-${index}`}>Placeholder</Label>
                <Input
                  id={`placeholder-${index}`}
                  value={field.ui.placeholder}
                  onChange={(e) =>
                    handleUIChange("placeholder", e.target.value)
                  }
                />
              </div>
              <div className="col-span-2">
                {isSpecialType ? (
                  <div className="w-full col-span-2 flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label>Enabled</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Enable or Disable this field
                      </p>
                    </div>
                    <Switch
                      checked={field.enabled}
                      onCheckedChange={(c) => handleChange("enabled", c)}
                      className="h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3"
                    />
                  </div>
                ) : (
                  <div className="w-full col-span-2 flex items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <Label>Required</Label>
                      <p className="text-[0.8rem] text-muted-foreground">
                        Is this field mandatory for submission?
                      </p>
                    </div>
                    <Switch
                      checked={field.required}
                      onCheckedChange={(c) => handleChange("required", c)}
                      className="h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3"
                    />
                  </div>
                )}
              </div>

              {field.type === "select" && (
                <div className="col-span-2 space-y-2">
                  <Label>Options (one per line)</Label>
                  <Textarea
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    value={
                      field.ui.options?.map((o) => o.label).join("\n") || ""
                    }
                    onChange={(e) => {
                      const options = e.target.value
                        .split("\n")
                        .map((label) => ({ label, value: slugify(label) }));
                      handleUIChange("options", options);
                    }}
                  />
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        {/* Delete Button */}
        {!isSpecialType && (
          <button
            onClick={() => onDelete(index)}
            type="button"
            className="p-1 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
            aria-label="Delete answer"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    );
  }
);

SortableFieldItem.displayName = "SortableFieldItem";

export default LeadFormEditor;
