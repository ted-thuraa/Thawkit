"use client";
import React, { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { House, Pencil, Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DialogProvider } from "@/providers/dialog-provider";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { debounce } from "lodash";

const settingsMenu = [
  {
    name: "General",
    value: "general",
    icon: (
      <House
        className="-ms-0.5 me-1.5 opacity-60"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
  {
    name: "Tracking",
    value: "tracking",
    icon: (
      <House
        className="-ms-0.5 me-1.5 opacity-60"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
];

// 1. Updated Schema to match FunnelPage interface (camelCase)
const generalFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  pathName: z.string().min(1, "Url is required"),
});

type GeneralFormValues = z.infer<typeof generalFormSchema>;

const trackingFormSchema = z.object({
  headScript: z
    .string()
    .refine(
      (script) => !script.includes("<script>") || script.includes("</script>"),
      {
        message: "Script tags must be properly closed",
      }
    )
    .refine((script) => !script.includes("document.write"), {
      message: "document.write is not allowed",
    }),
  bodyScript: z
    .string()
    .refine(
      (script) => !script.includes("<script>") || script.includes("</script>"),
      {
        message: "Script tags must be properly closed",
      }
    )
    .refine((script) => !script.includes("document.write"), {
      message: "document.write is not allowed",
    }),
});

// Component for General Settings Tab
const GeneralSettings = () => {
  const { page, updatePage } = usePageBuilderStore();

  // 2. Logic to determine if fields should be locked
  const isLandingPage = page?.type === "Landing_Page";

  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    mode: "onChange", // Validate on change
    defaultValues: {
      title: page?.title || "",
      metaTitle: page?.metaTitle || "", // Handle nulls safely
      metaDescription: page?.metaDescription || "",
      pathName: page?.pathName || "",
    },
  });

  // 3. Define the update logic
  const handleSave = (values: GeneralFormValues) => {
    if (!page) return;

    updatePage({
      title: values.title,
      // If it's a landing page, we ignore the pathName from the form to be safe
      pathName: isLandingPage ? page.pathName : values.pathName,
      metaTitle: values.metaTitle || null,
      metaDescription: values.metaDescription || null,
    });
  };

  // 4. Debounce the submit function to prevent Store thrashing on every keystroke
  // We use useCallback to ensure the debounce function isn't recreated on every render
  const debouncedSubmit = useCallback(
    debounce((values: GeneralFormValues) => {
      handleSave(values);
    }, 500),
    [page, updatePage, isLandingPage] // Dependencies
  );

  // 5. Watch for changes and trigger auto-save
  useEffect(() => {
    const subscription = form.watch((value) => {
      // Create a full object from partial watch values to satisfy types
      // or simply pass to handleSubmit which handles validation first
      form.handleSubmit((data) => debouncedSubmit(data))();
    });
    return () => subscription.unsubscribe();
  }, [form.watch, debouncedSubmit, form]);

  return (
    <Form {...form}>
      <form className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Page Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-editor-background border border-editor-border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pathName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Url{" "}
                {/* {isLandingPage && (
                  <span className="text-xs text-muted-foreground ml-2">
                    (Read-only for Landing Page)
                  </span>
                )} */}
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  // 6. Disable input if it is a Landing Page
                  disabled={isLandingPage}
                  readOnly={isLandingPage}
                  className={cn(
                    "bg-editor-background border border-editor-border",
                    isLandingPage && "opacity-50 cursor-not-allowed bg-muted"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metaTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title tag</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="bg-editor-background border border-editor-border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="metaDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meta description</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="bg-editor-background border border-editor-border"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

// Component for Tracking Scripts Tab
const TrackingSettings = () => {
  const { page, updatePage } = usePageBuilderStore();

  const form = useForm<z.infer<typeof trackingFormSchema>>({
    resolver: zodResolver(trackingFormSchema),
    defaultValues: {
      headScript: page?.scripts.headScript ?? "",
      bodyScript: page?.scripts.bodyScript ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof trackingFormSchema>) => {
    if (!page) return;
    const updatedScripts = {
      headScript: values.headScript,
      bodyScript: values.headScript,
    };
    updatePage({
      scripts: updatedScripts,
    });
  };

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="headScript"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Head Script</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter script to be inserted in head"
                  className="font-mono bg-editor-background border border-editor-border"
                  rows={6}
                />
              </FormControl>
              <FormDescription>
                This script will be inserted in the &lt;head&gt; element
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bodyScript"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Body Script</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Enter script to be inserted in body"
                  className="font-mono bg-editor-background border border-editor-border"
                  rows={6}
                />
              </FormControl>
              <FormDescription>
                This script will be inserted at the end of the &lt;body&gt;
                element
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

// Main Settings Modal Component
const PageSettingsModal: React.FC = () => {
  const [activeThemeMenu, setActiveThemeMenu] = useState("general");
  const { page, updatePage } = usePageBuilderStore();

  const handlePageSettingsUpdate = (field: string, value: boolean) => {
    if (page) {
      const newPage = {
        ...page,
        settings: {
          ...page.settings,
          [field]: value,
        },
      };
      updatePage(newPage);
    }
  };
  return (
    <div className="flex h-full min-h-[80vh] border-t border-editor-border">
      <Tabs
        value={activeThemeMenu}
        onValueChange={(value) => setActiveThemeMenu(value)}
        defaultValue="general"
        orientation="vertical"
        className="flex w-full "
      >
        <TabsList className=" flex flex-col justify-start w-56 border-r bg-white p-2 rounded-none h-full">
          {settingsMenu.map((menu) => (
            <div
              key={menu.value}
              className="flex w-full min-w-0 flex-col gap-1"
            >
              <TabsTrigger
                key={menu.name}
                value={menu.value}
                className="w-full h-12 rounded-md text-gray-700  justify-start data-[state=active]:bg-gray-100 data-[state=active]:text-foreground"
              >
                {menu.icon}
                {menu.name}
              </TabsTrigger>
            </div>
          ))}
        </TabsList>

        <div className="w-full ml-4 flex-1 px-6 pt-3 rounded-xl">
          <TabsContent value="general">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">General Settings</h2>

              <GeneralSettings />
            </div>
          </TabsContent>

          <TabsContent value="tracking">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Tracking Scripts</h2>
              <TrackingSettings />
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default PageSettingsModal;
