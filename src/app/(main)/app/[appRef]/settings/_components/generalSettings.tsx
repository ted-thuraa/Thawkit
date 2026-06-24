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
import { Label } from "@/components/ui/label";
import { TrashIcon } from "lucide-react";
import { FullProjectDataResponse } from "@/lib/querries/project";
import { ProjectModel } from "@/lib/types/project";
import { toast } from "sonner";
import { createOrUpdateProject } from "@/actions/project/project";

const projectSettingsSchema = z.object({
  title: z
    .string()
    .min(2, {
      message: "Title must be at least 2 characters.",
    })
    .max(50, {
      message: "Title must not be longer than 50 characters.",
    }),
  domain: z.string().min(1, { message: "domain is required" }),

  showBrandingLogo: z.boolean(),
  draftMode: z.boolean(),
});

type ToolSettingsValues = z.infer<typeof projectSettingsSchema>;

type Props = {
  projectId: string;
  projectData: FullProjectDataResponse;
};

const GeneralSettings = ({ projectId, projectData }: Props) => {
  const router = useRouter();
  const form = useForm<ToolSettingsValues>({
    resolver: zodResolver(projectSettingsSchema),
    defaultValues: {
      title: projectData?.title || "",
      domain: projectData?.domain || "",
      showBrandingLogo: projectData?.showBrandingLogo || false,
      draftMode: projectData?.draftMode || false,
    },
    mode: "onChange",
  });

  async function onSubmit(data: ToolSettingsValues) {
    try {
      const baseprojectData = {
        id: projectData?.id,
        //type: projectData?.type,
        title: data?.title,
        //description: projectData?.description ?? "",
        thumbnail: projectData?.thumbnail ?? "",
        //domain: projectData?.domain,
        questionOrder: projectData?.questionOrder,
        showBrandingLogo: data?.showBrandingLogo,
        draftMode: data?.draftMode,
      };

      // Merge with new values
      const updatedProject = {
        ...baseprojectData,
        ...data,
      } as ProjectModel;

      const response = await createOrUpdateProject(baseprojectData);

      if (!response) {
        throw new Error("Failed to update settings");
      }

      toast("Changes have been updated");

      router.refresh();
    } catch (error) {
      toast.error("Failed to update");
    }
  }

  return (
    <Card className="p-0 border-none">
      {/* <p>General Settings</p> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="">
            <h3 className="font-semibold text-sm mb-4">Logo</h3>
            <div className="flex items-start gap-6">
              <div className="border border-dashed rounded-md p-1 w-[120px] h-[120px] flex items-center justify-center">
                <div className="bg-black rounded-full w-[100px] h-[100px] flex items-center justify-center">
                  <svg
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M25 10C35 15 40 25 35 35C25 40 15 35 10 25C15 15 25 10 25 10Z"
                      stroke="#4338ca"
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-md text-sm mb-3">
                  <TrashIcon size={16} />
                  Remove logo
                </button>
                <p className=" text-[12px]/[16px]  text-gray-600">
                  Upload a square image (PNG, JPG, GIF, or SVG)
                </p>
                <p className=" text-[12px]/[16px]  text-gray-600">
                  Max size: 2MB
                </p>
              </div>
            </div>
          </div>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <Label>Title</Label>
                  <p className="max-w-[60%] text-sm text-muted-foreground">
                    Control the visibility and functionality of the opt in
                    checkbox shown on this Scorecards lead form and link to your
                    privacy policy
                  </p>
                </div>

                <FormControl>
                  <Input {...field} className="max-w-[40%]" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <div className="mb-4">
                  <Label>Domain</Label>
                  <p className="max-w-[60%] text-sm text-muted-foreground">
                    Control the visibility and functionality of the opt in
                    checkbox shown on this Scorecards lead form and link to your
                    privacy policy
                  </p>
                </div>
                <FormControl>
                  <Input {...field} readOnly className="max-w-[40%]" />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showBrandingLogo"
            render={({ field }) => (
              <FormItem className="max-w-[60%] flex flex-row items-center justify-between rounded-lg  ">
                <div className="mb-4">
                  <Label>Remove branding</Label>
                  <p className=" text-sm text-muted-foreground">
                    Hide the powered by ScoreApp logo if your subscription
                    allows
                  </p>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-[18px] w-[30px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="draftMode"
            render={({ field }) => (
              <FormItem className="max-w-[60%] flex flex-row items-center justify-between rounded-lg ">
                <div className="mb-6">
                  <Label>Draft mode</Label>
                  <p className=" text-sm text-muted-foreground">
                    In draft mode only you'll have access to your tool
                  </p>
                </div>

                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-[18px] w-[30px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </Form>
    </Card>
  );
};

export default GeneralSettings;
