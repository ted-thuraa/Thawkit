"use client";
import React, { useEffect } from "react";
import { z } from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { v4 } from "uuid";
import { CopyPlusIcon, Trash } from "lucide-react";

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
import { QuestionCategories } from "@/lib/types/project";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { toast } from "sonner";
import { useDialogWrapper } from "@/wrappers/dialog-wrapper";

interface CreateCategoryProps {
  defaultData?: QuestionCategories;
  toolId?: string;
  order?: number;
  onFinished?: () => void;
}

export const createCategorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

const CreateCategory: React.FC<CreateCategoryProps> = ({
  defaultData,
  toolId,
  order,
  onFinished,
}) => {
  const { categories, addCategory, updateCategory } = usePageBuilderStore();
  const router = useRouter();
  const { setOpen } = useDialogWrapper();

  //ch
  const form = useForm<z.infer<typeof createCategorySchema>>({
    resolver: zodResolver(createCategorySchema),
    mode: "onChange",
    defaultValues: {
      // Use || "" to ensure it is never undefined
      title: defaultData?.title || "",
      description: defaultData?.description || "",
    },
  });

  useEffect(() => {
    if (defaultData) {
      form.reset({
        title: defaultData.title || "",
        description: defaultData.description || "",
      });
    }
  }, [defaultData]);

  const onSubmit = async (values: z.infer<typeof createCategorySchema>) => {
    console.log("Submitting values:", values);
    if (defaultData) {
      // We are updating an existing category
      console.log("updating category", values);
      updateCategory(defaultData.id, values);
      setOpen(false);
      toast.success("Category updated.");
    } else {
      // We are creating a new category
      const newCategory = {
        ...values,
        id: v4(),
        order: categories.length + 1,
        icon: null,
      };
      console.log("creating category", values);
      addCategory(newCategory);
      setOpen(false);
      toast.success("Category created.");
    }

    if (onFinished) {
      onFinished();
    }
    //router.refresh();
  };

  return (
    <div className="w-full">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input required placeholder="Category Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="enter a brief description here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={form.formState.isSubmitting} type="submit">
              {form.formState.isSubmitting
                ? " Saving..."
                : defaultData
                  ? "Save Changes"
                  : "Create"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCategory;
