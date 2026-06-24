"use client";
import React from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import FileUpload from "../global/file-upload";
import { Button } from "../ui/button";

type Props = {
  organizationId: string;
};

const formSchema = z.object({
  link: z.string().min(1, { message: "Media File is required" }),
  //name: z.string().min(1, { message: "Name is required" }),
});

const UploadMediaForm = ({ organizationId }: Props) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      link: "",
      //name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      //const response = await createMedia(organizationId, values);
      // toast({ title: "Succes", description: "Uploaded media" });
      router.refresh();
    } catch (error) {
      console.log(error);
      // toast({
      //   variant: "destructive",
      //   title: "Failed",
      //   description: "Could not uploaded media",
      // });
    }
  }
  // New handler to submit the form when a file is selected
  const handleFileChange = async (url: string) => {
    form.setValue("link", url);
    await form.handleSubmit(onSubmit)();
  };
  return (
    <div className="w-full">
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your agency name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="link"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="media"
                      value={field.value}
                      onChange={handleFileChange as (url?: string) => void}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <Button type="submit" className="mt-4">
              Upload Media
            </Button> */}
          </form>
        </Form>
      </div>
    </div>
  );
};

export default UploadMediaForm;
