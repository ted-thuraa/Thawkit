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
import { ProjectModel } from "@/lib/types/project";
import { toast } from "sonner";

const formSchema = z.object({
  sendResultEmail: z.boolean().optional(),
  fromAddress: z.string().optional().or(z.literal("")),
  fromName: z.string().optional().or(z.literal("")),
  replyToEmail: z.string().optional().or(z.literal("")),
  emailSubject: z.string().optional().or(z.literal("")),
  emailContent: z.string().optional().or(z.literal("")),
});

type ToolSettingsValues = z.infer<typeof formSchema>;

type Props = {
  projectId: string;
  projectData: FullProjectDataResponse;
};

const ResultEmailSettings = ({ projectId, projectData }: Props) => {
  const router = useRouter();

  const currentSettings = (projectData?.settings as Record<string, any>) || {};
  // note: DB key is likely 'resultemail' based on previous code, ensure consistency!
  const emailSettings = currentSettings.resultemail || {};

  const form = useForm<ToolSettingsValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sendResultEmail: emailSettings.sendResultEmail ?? true,
      fromAddress: emailSettings.fromAddress || "",
      fromName: emailSettings.fromName || "",
      replyToEmail: emailSettings.replyToEmail || "",
      emailSubject: emailSettings.emailSubject || "",
      emailContent: emailSettings.emailContent || "",
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
        resultemail: {
          ...emailSettings, // Preserve hidden email fields if any
          sendResultEmail: data.sendResultEmail,
          fromAddress: data.fromAddress,
          fromName: data.fromName,
          replyToEmail: data.replyToEmail,
          emailSubject: data.emailSubject,
          emailContent: data.emailContent,
        },
      };

      // Merge with new values
      const payload = {
        id: projectId,
        settings: mergedSettings,
      };

      const response = await createOrUpdateProject(payload);

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
      <div className="mb-6">
        <h3 className="px-0 text-lg font-medium">Result Email Settings</h3>
        <p className="text-sm text-muted-foreground">Result email details</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="sendResultEmail"
            render={({ field }) => (
              <FormItem>
                <div className="border-b border-wedges-gray-100 py-3 lg:flex lg:items-start">
                  <div className="mb-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
                    <FormLabel className="px-0 text-sm font-medium leading-none ">
                      Send result email
                    </FormLabel>

                    <FormDescription className="max-w-[420px] text-[0.8rem] text-muted-foreground">
                      A brief description of your scoreTool, usually between 2
                      and 4 sentences.
                    </FormDescription>
                  </div>
                  <div className="lg:flex-grow">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-full cursor-pointer  ">
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-[18px] w-[30px]"
                          />
                        </FormControl>
                      </div>
                      {/* <label className="ml-2 cursor-pointer text-sm font-medium leading-none">
                        result emails
                      </label> */}
                    </div>
                  </div>
                </div>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="border-b border-wedges-gray-100 py-3 lg:flex lg:items-start">
            <div className="mb-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
              <p className="text-sm font-medium leading-none ">Email from</p>

              <p className="max-w-[420px] text-[0.8rem] text-muted-foreground">
                Customise who the email appears to be sent from
              </p>
            </div>
            <div className="lg:flex-grow">
              <div className="flex items-center">
                <div className="flex-shrink-0 block space-y-5 p-6    border border-gray-200 shadow-md  rounded-xl w-[90%] cursor-pointer  ">
                  <FormField
                    control={form.control}
                    name="fromAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" font-medium leading-none text-[0.8rem] ">
                          From Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="result@localhost.3000"
                            className="w-full placeholder:text-muted-foreground"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fromName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium leading-none text-[0.8rem] ">
                          From Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John Doe"
                            className="w-full placeholder:text-muted-foreground"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="replyToEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium leading-none text-[0.8rem] ">
                          Reply To Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="admin@localhost.3000"
                            className="w-full placeholder:text-muted-foreground"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-wedges-gray-100 py-3 lg:flex lg:items-start">
            <div className="mb-1 lg:mb-0 lg:mr-5 lg:w-2/5 lg:flex-shrink-0">
              <p className="text-sm font-medium leading-none ">
                Email emailContent
              </p>

              <p className="max-w-[420px] text-[0.8rem] text-muted-foreground">
                Write an email that links to further results, follow up, or
                offers etc
              </p>
            </div>
            <div className="lg:flex-grow">
              <div className="flex items-center">
                <div className="flex-shrink-0 block space-y-5 p-6    border border-gray-200 shadow-md  rounded-xl w-[90%] cursor-pointer  ">
                  <FormField
                    control={form.control}
                    name="emailSubject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className=" font-medium leading-none text-[0.8rem] ">
                          Subject
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Hi your results are in"
                            className="w-full placeholder:text-muted-foreground"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="emailContent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium leading-none text-[0.8rem] ">
                          Email Content
                        </FormLabel>
                        <FormControl>
                          <div className="w-full cursor-text [&_h1]:text-4xl [&_h1]:font-bold [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:text-2xl [&_h3]:font-bold">
                            {/* <BlockTextEditor
                              content={undefined}
                              min={0}
                              max={1000}
                              name="emailContent"
                              errors={form.formState.errors}
                              setTextContent={() => {}}
                              onEdit={true}
                              disabled={false}
                              htmlContent={field.value}
                              setHtmlContent={field.onChange}
                              isCard={false}
                              //editorContentStyles="px-4"
                            /> */}
                          </div>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ResultEmailSettings;
