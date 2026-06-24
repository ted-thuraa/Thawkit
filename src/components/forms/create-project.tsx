// app/components/forms/new-project-form.tsx (or your preferred path)
"use client";

import React, { useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { projectFormSchema, ProjectFormValues } from "@/lib/validators/project";
import { createOrUpdateProject } from "@/actions/project/project";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Define the component's props
interface NewProjectFormProps {
  // Pass defaultData to edit an existing project
  defaultData?: {
    id: string;
    title: string;
    description?: string | null;
  };
  organizationId: string;
  onSuccess: () => void; // A callback to run on success (e.g., close a modal)
}

const Loading = () => (
  <div className="flex justify-center items-center">
    <Loader2 className="animate-spin text-gray-500" size={22} />
  </div>
);

/**
 * A client-side form for creating or editing a project.
 * It validates input and calls a Server Action to persist changes.
 */
const NewProjectForm: React.FC<NewProjectFormProps> = ({
  defaultData,
  organizationId,
  onSuccess,
}) => {
  const router = useRouter();
  // useTransition hook manages loading state for server actions
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    mode: "onChange",
    defaultValues: {
      title: defaultData?.title || "",
      description: defaultData?.description || "",
    },
  });

  // Reset form if defaultData changes (e.g., when editing)
  useEffect(() => {
    if (defaultData) {
      form.reset({
        title: defaultData.title || "",
        description: defaultData.description || "",
      });
    }
  }, [defaultData, form]);

  // Handle form submission
  const onSubmit = async (values: ProjectFormValues) => {
    startTransition(async () => {
      // Call the server action
      const result = await createOrUpdateProject({
        ...values,
        organizationId: organizationId,
        id: defaultData?.id as string, // Pass the ID if we are editing
      });

      if (result) {
        if (result.success) {
          toast.success(
            defaultData ? "Project details updated!" : "Project created!"
          );
          onSuccess(); // Call the parent's success callback
          router.refresh(); // Refresh page data
          // Redirect to the new/updated project's page
          router.push(`/app/${result.data?.ref}`);
        } else {
          toast.error(`Error: ${result.error || "Could not save details."}`);
        }
      } else {
        toast.error(`Error: Failed to create`);
      }

      // Handle the response
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>
          {defaultData
            ? "Update your project's information."
            : "Give your new project a name and description."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              disabled={isPending}
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input required placeholder="My New Project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={isPending}
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="A brief description of what this project is for."
                      {...field}
                      value={field.value || ""} // Ensure value is not null/undefined
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isPending} type="submit">
              {isPending ? (
                <Loading />
              ) : defaultData ? (
                "Save Changes"
              ) : (
                "Create Project"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default NewProjectForm;
