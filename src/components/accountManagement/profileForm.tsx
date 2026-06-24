"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
//import { updateProfile } from "@/app/actions/user";
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoadingSwap } from "../ui/loading-swap";

const profileFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  email: z.email().min(1),

  // phone: z
  //   .string()
  //   .min(10, {
  //     message: "Phone number must be at least 10 digits.",
  //   })
  //   .max(15, {
  //     message: "Phone number must not be longer than 15 digits.",
  //   })
  //   .regex(/^[0-9+\-\s()]*$/, {
  //     message: "Please enter a valid phone number.",
  //   })
  //   .optional()
  //   .or(z.literal("")), // Allow empty string
});

type ProfileUpdateForm = z.infer<typeof profileFormSchema>;

export function ProfileForm({
  user,
}: {
  user: {
    name: string;
    email: string;
    // phone: number
  };
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: user,
  });
  const { isSubmitting } = form.formState;

  async function handleProfileUpdate(data: ProfileUpdateForm) {
    const promises = [
      authClient.updateUser({
        name: data.name,
      }),
    ];

    if (data.email !== user.email) {
      promises.push(
        authClient.changeEmail({
          newEmail: data.email,
          callbackURL: "/profile",
        })
      );
    }

    const res = await Promise.all(promises);

    const updateUserResult = res[0];
    const emailResult = res[1] ?? { error: false };

    if (updateUserResult.error) {
      toast.error(updateUserResult.error.message || "Failed to update profile");
    } else if (emailResult.error) {
      toast.error(emailResult.error.message || "Failed to change email");
    } else {
      if (data.email !== user.email) {
        toast.success("Verify your new email address to complete the change.");
      } else {
        toast.success("Profile updated successfully");
      }
      router.refresh();
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-x-6">
          <Avatar className="size-16 rounded-lg">
            <AvatarImage src="/assets/blank-profile-picture.png" alt="John" />
            <AvatarFallback className="rounded-lg">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "CN"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-base/7 font-semibold tracking-tight text-gray-900">
              {user.name}
            </h3>
            <p className="text-sm/6 font- text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleProfileUpdate)}
            className="mt-2 space-y-8"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} disabled={isLoading} />
                  </FormControl>
                  {/* <FormDescription>
                    This is the name that will be displayed on your profile and
                    in emails.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input
                  type="tel"
                  placeholder="Enter your phone number"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                Your phone number will be used for account verification and
                notifications.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

            <Button type="submit" disabled={isSubmitting} className="w-full">
              <LoadingSwap isLoading={isSubmitting}>Update Profile</LoadingSwap>
            </Button>
            {/* <Button type="submit" disabled={isLoading}>
          {isLoading ? "Updating..." : "Update Profile"}
        </Button> */}
          </form>
        </Form>
      </div>
    </div>
  );
}
