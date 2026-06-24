"use client";

import * as React from "react";
import { Loader2, Pencil } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/auth-client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { SubscriptionDetailsResult } from "@/lib/querries/subscription";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import { SubscriptionPlans } from "@/components/billing/subscription-management";

// ✅ Zod schema for form validation
const OrgUpdateSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name is too long"),
});

type OrgUpdateValues = z.infer<typeof OrgUpdateSchema>;

export function OrganizationBasicInfoUpdater({
  subscriptionDetails,
}: {
  subscriptionDetails: SubscriptionDetailsResult;
}) {
  const pathname = usePathname();
  const {
    data: activeOrganization,
    error,
    isPending,
  } = authClient.useActiveOrganization();

  const form = useForm<OrgUpdateValues>({
    resolver: zodResolver(OrgUpdateSchema),
    defaultValues: {
      name: activeOrganization?.name ?? "",
    },
    values: {
      name: activeOrganization?.name ?? "",
    },
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (values: OrgUpdateValues) => {
    if (!activeOrganization) return;
    const newName = values.name.trim();
    const newSlug = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      setIsSubmitting(true);

      const updatedOrgData = {
        name: values.name.trim(),
        slug: newSlug,
        logo: activeOrganization.logo ?? undefined,
        metadata: activeOrganization.metadata,
      };

      const res = await authClient.organization.update({
        data: updatedOrgData,
        organizationId: activeOrganization.id,
      });

      if (res.error) {
        toast.error(res.error.message || "Failed to update organization");
        return;
      }

      // Refresh active organization to reflect new data
      await authClient.organization.setActive({
        organizationId: res.data.id,
      });

      toast.success("Organization info updated successfully");
    } catch (error) {
      toast.error("Unexpected error while updating organization");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading State ---
  if (isPending || !activeOrganization) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <Loader2 className="animate-spin text-gray-500" size={22} />
      </div>
    );
  }

  console.log(subscriptionDetails);

  // --- Render ---
  return (
    <div className="">
      <h3 className="text-base font-semibold text-gray-800 mb-5">Basic info</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="">
          {/* --- Workspace Logo Section --- */}
          <div className="flex mb-8 flex-col md:flex-row items-center md:gap-x-40">
            {/* Text */}
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Workspace logo
              </p>
              <p className="text-xs text-gray-500">
                An image to represent your workspace
              </p>
            </div>

            {/* Logo */}
            <div className="relative w-[90px] h-[90px] rounded-full bg-[#a7d9f7] flex justify-center items-center ml-5 flex-shrink-0">
              <span className="text-[32px] font-bold text-white">
                {activeOrganization.name
                  ? activeOrganization.name.slice(0, 2).toUpperCase()
                  : "??"}
              </span>

              <div
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-gray-100 flex justify-center items-center cursor-pointer border-2 border-white hover:bg-gray-200 transition"
                title="Change logo"
              >
                <Pencil className="text-gray-600 w-4 h-4" />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          <div className="mt-8 flex flex-col md:flex-row items-start md:items-center md:gap-x-40">
            <div className="mb-3 md:mb-0">
              <p className="text-sm font-semibold text-gray-800 mb-1">
                Workspace name
              </p>
              <p className="text-xs text-gray-500 mb-2.5">
                e.g. your team or company name
              </p>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="My Workspace"
                      className="w-[300px] text-sm"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            size="sm"
            className="mt-8"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save changes
          </Button>
        </form>
      </Form>

      {/* --- Workspace Upgrade Section --- */}
      <div className="w-full   p-5 md:p-8">
        <div
          className={`
          relative
          overflow-hidden
          rounded-[28px]
          border-2 border-dashed border-sky-300/70
          p-6 md:p-8
          bg-[linear-gradient(90deg,#e6fbff_0%,#f8feff_45%,#ffffff_100%)]
          shadow-sm
        `}
          role="region"
          aria-describedby="cro-support-desc"
        >
          {/* Left content area */}
          <div className="flex flex-row flex-none items-center justify-between">
            <div className="flex flex-col gap-3 ">
              <h2
                id="cro-support-heading"
                className="text-slate-900 font-bold text-base   leading-tight"
                // visually matches bold prominent heading in the screenshot
              >
                You dont have any plan yet
              </h2>

              <p
                id="cro-support-desc"
                className="text-slate-600 text-sm max-w-lg"
              >
                You can get assistance from our customer success team to grow
                your business.
              </p>
            </div>

            <div className="">
              <DialogWrapper
                trigger={
                  <Button
                    className=" w-fit  bg-sky-600 text-white
                shadow-[0_6px_18px_rgba(14,165,233,0.18)]
                hover:bg-sky-700 active:translate-y-[1px]
                 transition-colors duration-150
                focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-200"
                    size="sm"
                  >
                    Upgrade
                  </Button>
                }
                // optional: title/description/className/onOpen/onClose
                // title="Add section"
                // description="Select a template to begin"
                className="bg-sidebar max-w-screen w-[100%] h-[100%] overflow-y-auto"
              >
                <SubscriptionPlans />
              </DialogWrapper>

              {/* <Button
                variant="outline"
                onClick={async () => {
                  try {
                    await authClient.customer.portal();
                  } catch (error) {
                    console.error("Failed to open customer portal:", error);
                  }
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Manage Subscription
              </Button> */}
            </div>
          </div>

          {/* Decorative small dashed inner border (thin) positioned to match screenshot feel */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[26px] border border-sky-50/40"
          />
        </div>
      </div>
    </div>
  );
}
