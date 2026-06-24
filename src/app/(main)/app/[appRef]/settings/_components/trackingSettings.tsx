"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
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
import { Switch } from "@/components/ui/switch";
import { AllToolDetail } from "@/lib/types";
import { Tool } from "@prisma/client";
import { CreateLeadTool } from "@/actions/create-tool";
import { Textarea } from "@/components/ui/textarea";

const toolSettingsSchema = z.object({
  facebookPixelId: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not be longer than 50 characters.",
    })
    .optional(),
  conversionsApiEnabled: z.boolean().optional(),
  conversionsApiToken: z.string().optional(),
  googleAnalyticsCode: z.string().optional(),
  googleTagManager: z.string().optional(),
  customScriptBody: z.string().optional(),
  customScriptHead: z.string().optional(),
});

type ToolSettingsValues = z.infer<typeof toolSettingsSchema>;

type Props = {
  toolId: string;
  toolData: AllToolDetail;
};

const TrackingSettings = ({ toolId, toolData }: Props) => {
  const router = useRouter();

  const defaultTrackingSettings = toolData?.settings as {
    tracking?: {
      facebookPixelId?: string;
      conversionsApiEnabled?: boolean;
      conversionsApiToken?: string;
      googleAnalyticsCode?: string;
      googleTagManager?: string;
      customScriptBody?: string;
      customScriptHead?: string;
    };
  } | null;

  const form = useForm<ToolSettingsValues>({
    resolver: zodResolver(toolSettingsSchema),
    defaultValues: {
      facebookPixelId: defaultTrackingSettings?.tracking?.facebookPixelId || "",
      conversionsApiEnabled:
        defaultTrackingSettings?.tracking?.conversionsApiEnabled || false,
      conversionsApiToken:
        defaultTrackingSettings?.tracking?.conversionsApiToken || "",
      googleAnalyticsCode:
        defaultTrackingSettings?.tracking?.googleAnalyticsCode || "",
      googleTagManager:
        defaultTrackingSettings?.tracking?.googleTagManager || "",
      customScriptBody:
        defaultTrackingSettings?.tracking?.customScriptBody || "",
      customScriptHead:
        defaultTrackingSettings?.tracking?.customScriptHead || "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ToolSettingsValues) {
    try {
      const baseToolData = {
        ...toolData,
        settings: {
          ...toolData.settings,
          tracking: {
            facebookPixelId: data.facebookPixelId,
            conversionsApiEnabled: data.conversionsApiEnabled,
            conversionsApiToken: data.conversionsApiToken,
            googleAnalyticsCode: data.googleAnalyticsCode,
            googleTagManager: data.googleTagManager,
            customScriptBody: data.customScriptBody,
            customScriptHead: data.customScriptHead,
          },
        },
        updatedAt: new Date(),
      } as Tool;

      // Merge with new values
      const updatedTool = {
        ...baseToolData,
        ...data,
      } as Tool;

      const response = await CreateLeadTool(updatedTool, toolId);

      if (!response) {
        throw new Error("Failed to update settings");
      }

      toast({
        title: "Success",
        description: "Tool settings have been updated",
      });

      router.refresh();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update tool settings",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="">
      <div className="mb-2">
        <h3 className="px-0 text-lg font-medium">Tracking Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control how your scorecard appears when shared on social media
          platforms such as Facebook and LinkedIn
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="facebookPixelId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Facebook Pixel Id
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conversionsApiEnabled"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-x-2">
                  <FormLabel className="text-sm font-medium leading-none ">
                    Conversions Api
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>

                <FormDescription className="text-[0.8rem] text-muted-foreground">
                  A brief description of your scoreTool, usually between 2 and 4
                  sentences. This will be displayed for example below the title
                  of the post on Facebook.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="conversionsApiToken"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Conversions API Access Token
                </FormLabel>
                <FormControl>
                  <Input {...field} />
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

          <FormField
            control={form.control}
            name="googleAnalyticsCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Google Analytics
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription className="text-[0.8rem] text-muted-foreground">
                  Copy and paste your full Google analytics code and/or use
                  Google Tag Manager by entering your container ID. These will
                  be added to all landing pages, questions and result pages
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="googleTagManager"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Google Tag Manager
                </FormLabel>
                <FormControl>
                  <Input {...field} />
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

          <FormField
            control={form.control}
            name="customScriptBody"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Custom Script Body
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription className="text-[0.8rem] text-muted-foreground">
                  Use this to add custom scripts to your scorecard. They will be
                  added just before the closing &lt;/body&gt; tag on all landing
                  pages, questions and result pages
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="customScriptHead"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Custom Script Head
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormDescription className="text-[0.8rem] text-muted-foreground">
                  Use this to add custom scripts to your scorecard. They will be
                  added within the &lt;head&gt; on all landing pages, questions
                  and result pages
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

export default TrackingSettings;
