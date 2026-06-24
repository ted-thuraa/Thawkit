"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { FullProjectDataResponse } from "@/lib/querries/project";
import { createOrUpdateProject } from "@/actions/project/project";
import { ProjectModel } from "@/lib/types/project";
import { toast } from "sonner";

const formSchema = z.object({
  metaTitle: z.string().min(2).max(50).optional().or(z.literal("")),
  metaDescription: z.string().optional(),
});

type ToolSettingsValues = z.infer<typeof formSchema>;

type Props = {
  projectId: string;
  projectData: FullProjectDataResponse;
};

const AppearanceSettings = ({ projectId, projectData }: Props) => {
  const router = useRouter();

  // Initialize form with existing settings if they exist
  const currentSettings = (projectData?.settings as Record<string, any>) || {};
  const socialSettings = currentSettings.socialMedia || {};

  const form = useForm<ToolSettingsValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metaTitle: socialSettings.metaTitle || "",
      metaDescription: socialSettings.metaDescription || "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ToolSettingsValues) {
    try {
      // Merge with new values
      const mergedSettings = {
        ...currentSettings, // Keep all other settings (e.g., email, questionOrder)
        socialMedia: {
          ...socialSettings, // Keep existing socialMedia keys if any
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
        },
      };

      const payload = {
        id: projectId,
        settings: mergedSettings,
      };

      const response = await createOrUpdateProject(payload);

      if (!response?.success) {
        throw new Error(response?.error || "Failed to update");
      }

      toast("Appearance updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="">
      <div className="mb-2">
        <h3 className="px-0 text-lg font-medium">Share appearance</h3>
        <p className="text-sm text-muted-foreground">
          Control how your scorecard appears when shared on social media
          platforms such as Facebook and LinkedIn
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Title
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="text-[0.8rem] text-muted-foreground">
                  Something to pique the interest of others on social media,
                  e.g. Discover your influence score
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription className="text-[0.8rem] text-muted-foreground">
                  A brief description of your scoreTool, usually between 2 and 4
                  sentences. This will be displayed for example below the title
                  of the post on Facebook.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AppearanceSettings;
