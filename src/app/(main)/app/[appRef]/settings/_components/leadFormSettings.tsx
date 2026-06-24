"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AllToolDetail } from "@/lib/types";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
//import { toast } from "@/components/hooks/use-toast"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { GripVertical, PencilIcon, PlusIcon, TrashIcon } from "lucide-react";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { CreateLeadTool } from "@/actions/create-tool";
import { useRouter } from "next/navigation";
import { DialogProvider } from "@/providers/dialog-provider";
import NewLeadFormField from "./addLeadFormField";

const profileFormSchema = z.object({
  formFields: z.array(
    z.object({
      enabled: z.boolean(),
      label: z.string(),
      type: z.string(),
      phoneCountry: z.string().optional(),
      required: z.boolean(),
      default: z.boolean().optional(),
    })
  ),
  optin_type: z.enum(["Implied", "Explicit_Optional", "Explicit_Required"], {
    required_error: "You need to select a notification type.",
  }),
  leadform_entry: z.enum(["before", "after"], {
    required_error: "You need to select a lead entry point.",
  }),
  privacy_statement: z
    .string()
    .refine((value) => value.length === 0 || value.length >= 2, {
      message: "privacy statement must be at least 2 characters.",
    })
    .optional(),
  privacy_wording: z
    .string()
    .refine((value) => value.length === 0 || value.length >= 2, {
      message: "privacy wording must be at least 2 characters.",
    })
    .optional(),

  privacy_policy_url: z.string().url().or(z.literal("")).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type LeadFormData = {
  formFields: Array<{
    enabled: boolean;
    label: string;
    type: string;
    required: boolean;
  }>;
  optin_type: "Implied" | "Explicit_Optional" | "Explicit_Required";
  leadform_entry: "before" | "after";
  privacy_statement?: string;
  privacy_wording?: string;
  privacy_policy_url?: string;
};

type Props = {
  toolId: string;
  toolData: AllToolDetail;
};

const LeadFormSettings = ({ toolId, toolData }: Props) => {
  const router = useRouter();

  const existingSettings = toolData?.settings as {
    leadForm?: {
      formFields?: any[];
      optin_type?: string;
      leadform_entry?: string;
      privacy_statement?: string;
      privacy_wording?: string;
      privacy_policy_url?: string;
    };
  } | null;

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      formFields: existingSettings?.leadForm?.formFields || [
        {
          enabled: true,
          label: "First name",
          type: "text",
          required: true,
          default: true,
        },
        {
          enabled: true,
          label: "Last name",
          type: "text",
          required: true,
          default: true,
        },
        {
          enabled: true,
          label: "Email",
          type: "email",
          required: true,
          default: true,
        },
      ],
      optin_type: (existingSettings?.leadForm?.optin_type as any) || "Implied",
      leadform_entry:
        (existingSettings?.leadForm?.leadform_entry as any) || "before",
      privacy_statement: existingSettings?.leadForm?.privacy_statement || "",
      privacy_wording: existingSettings?.leadForm?.privacy_wording || "",
      privacy_policy_url: existingSettings?.leadForm?.privacy_policy_url || "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    name: "formFields",
    control: form.control,
  });

  async function onSubmit(data: ProfileFormValues) {
    if (!toolData) {
      return;
    }
    try {
      const updatedTool = await CreateLeadTool(
        // @ts-ignore
        {
          ...toolData, // Spread existing tool data
          settings: {
            ...(typeof toolData.settings === "object" &&
            toolData.settings &&
            !Array.isArray(toolData.settings)
              ? toolData.settings
              : {}),
            leadForm: {
              formFields: data.formFields,
              optin_type: data.optin_type,
              leadform_entry: data.leadform_entry,
              privacy_statement: data.privacy_statement,
              privacy_wording: data.privacy_wording,
              privacy_policy_url: data.privacy_policy_url,
            },
          },
        },
        toolId
      );

      if (updatedTool) {
        toast({
          title: "Success",
          description: "Lead form settings updated successfully",
        });
        router.refresh();
      } else {
        throw new Error("Failed to update settings");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update lead form settings",
      });
    }
  }

  return (
    <Card className="p-0 border-none">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className=" max-w-[60%]">
            <Label>Fields</Label>
            <p className="text-sm text-muted-foreground">
              Add or remove fields to this Scorecard lead form. Name and email
              fields are included by default but you can adjust settings or
              disable as required.
            </p>
            <div className="mt-4">
              {fields.map((item, index) => (
                <div
                  key={item.id}
                  className={`min-h-[3rem] flex items-center `}
                  //className={`min-h-[3rem] flex items-center border-b-[0.5px] ${index === 0 ? "border-t-[0.5px]" : ""}`}
                >
                  <div className="flex-1 pr-[.333rem]">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div className="flex-[3_3_0%] pr-[.333rem]">
                    <FormField
                      control={form.control}
                      name={`formFields.${index}.label`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-[3_3_0%] px-[.333rem]">
                    <FormField
                      control={form.control}
                      name={`formFields.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input {...field} placeholder="e.g. text" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-[3_3_0%] px-[.333rem]">
                    <FormField
                      control={form.control}
                      name={`formFields.${index}.required`}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-[18px] w-[30px]"
                              thumbClassName="h-[14px] w-[14px] data-[state=checked]:translate-x-[13px] data-[state=unchecked]:translate-x-[2px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex-[2_2_0%] pl-[.333rem] flex items-center">
                    {!item.default && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              <DialogProvider
                trigger={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Field
                  </Button>
                }
                title="Add a new field"
                className="max-w-[100vw] w-[50vw] min-h-[300px] max-h-[95vh] bg-white flex flex-col"
              >
                <NewLeadFormField
                  onFieldAdd={(newField) => {
                    append(newField);
                  }}
                />
              </DialogProvider>
            </div>
          </div>
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="optin_type"
              render={({ field }) => (
                <FormItem className="">
                  <div className="mb-6">
                    <Label>Data protection settings</Label>
                    <p className="text-sm text-muted-foreground">
                      Control the visibility and functionality of the opt in
                      checkbox shown on this Scorecards lead form and link to
                      your privacy policy
                    </p>
                  </div>
                  <FormControl className="pl-2">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Implied" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Implied Consent -
                        </FormLabel>
                        <FormDescription>
                          {" "}
                          Your visitors will not see any optin checkbox.
                        </FormDescription>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Explicit_Optional" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Explicit Consent (Optional) -
                        </FormLabel>
                        <FormDescription>
                          {" "}
                          Your visitors will see an optin checkbox but will be
                          able to continue without opting in
                        </FormDescription>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Explicit_Required" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Explicit Consent (Required) -
                        </FormLabel>
                        <FormDescription>
                          {" "}
                          Your visitors will see an optin checkbox and will be
                          not able to continue without opting in
                        </FormDescription>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacy_wording"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <Label>Optin wording</Label>
                    <p className="text-sm text-muted-foreground">
                      Control the visibility and functionality of the opt in
                      checkbox shown on this Scorecards lead form and link to
                      your privacy policy
                    </p>
                  </div>
                  <FormControl>
                    <Input
                      placeholder="Opt in to receive updates via email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacy_statement"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <Label>privacy statement</Label>
                    <p className="text-sm text-muted-foreground">
                      Control the visibility and functionality of the opt in
                      checkbox shown on this Scorecards lead form and link to
                      your privacy policy
                    </p>
                  </div>

                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privacy_policy_url"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <Label>privacy policy url</Label>
                    <p className="text-sm text-muted-foreground">
                      Control the visibility and functionality of the opt in
                      checkbox shown on this Scorecards lead form and link to
                      your privacy policy
                    </p>
                  </div>

                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="leadform_entry"
              render={({ field }) => (
                <FormItem className="">
                  <div className="mb-4">
                    <Label>form behaviour</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose if you want to force sign up, and where in the
                      journey it should show
                    </p>
                  </div>

                  <FormControl className="pl-2">
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="before" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Before questions
                        </FormLabel>
                        <FormDescription className="">
                          People will not be able to start your questions
                          without completing the lead form first
                        </FormDescription>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="after" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          After questions
                        </FormLabel>
                        <FormDescription className="">
                          People will be able to answer your questions without
                          completing the lead form first. This allows you to
                          further control the lead form on your result pages
                        </FormDescription>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default LeadFormSettings;
