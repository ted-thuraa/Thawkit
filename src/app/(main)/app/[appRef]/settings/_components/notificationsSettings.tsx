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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { FullProjectDataResponse } from "@/lib/querries/project";
import { createOrUpdateProject } from "@/actions/project/project";
import { toast } from "sonner";

const formSchema = z.object({
  sendNotifications: z.boolean().optional(),
  recipients: z.string().optional().or(z.literal("")),
  notificationTitle: z.string().optional().or(z.literal("")),
  notificationContent: z.string().optional().or(z.literal("")),
});

type ToolSettingsValues = z.infer<typeof formSchema>;

type Props = {
  projectId: string;
  projectData: FullProjectDataResponse;
};

const NotificationsSettings = ({ projectId, projectData }: Props) => {
  const router = useRouter();

  const currentSettings = (projectData?.settings as Record<string, any>) || {};
  // note: DB key is likely 'resultemail' based on previous code, ensure consistency!
  const notificationSettings = currentSettings.notifications || {};

  const form = useForm<ToolSettingsValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sendNotifications: notificationSettings.sendNotifications ?? true,
      recipients: notificationSettings.recipients || "",
      notificationTitle: notificationSettings.notificationTitle || "",
      notificationContent: notificationSettings.notificationContent || "",
    },
    mode: "onChange",
  });

  async function onSubmit(data: ToolSettingsValues) {
    if (!projectData) {
      return;
    }
    try {
      const mergedSettings = {
        ...currentSettings, // Preserve other settings
        notifications: {
          ...notificationSettings, // Preserve hidden email fields if any
          sendNotifications: data.sendNotifications,
          recipients: data.recipients,
          notificationTitle: data.notificationTitle,
          notificationContent: data.notificationContent,
        },
      };

      // Merge with new values
      const payload = {
        id: projectId,
        settings: mergedSettings,
      };
      const response = await createOrUpdateProject(payload);

      if (!response) {
        throw new Error("Failed to update settings");
      }

      if (!response?.success) {
        throw new Error(response?.error || "Failed to update");
      }

      toast("Email settings updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="">
      <div className="mb-2">
        <h3 className="px-0 text-lg font-medium">Notification Settings</h3>
        <p className="text-sm text-muted-foreground">
          Control how your scorecard appears when shared on social media
          platforms such as Facebook and LinkedIn
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="sendNotifications"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row items-center gap-x-2">
                  <FormLabel className="text-sm font-medium leading-none ">
                    Send Notifications
                  </FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recipients"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Recipients
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
            name="notificationTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Email Subject
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormDescription className="text-[0.8rem] text-muted-foreground">
                  Customise who the email appears to be sent from
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notificationContent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium leading-none ">
                  Email Content
                </FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>

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

export default NotificationsSettings;
