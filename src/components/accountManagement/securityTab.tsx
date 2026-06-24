"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { authClient } from "@/lib/auth/auth-client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "../ui/password-input";
import { Checkbox } from "../ui/checkbox";
import { LoadingSwap } from "../ui/loading-swap";
import { BetterAuthActionButton } from "../auth/better-auth-action-button";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
  revokeOtherSessions: z.boolean(),
});

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function SecurityTab({
  email,
  isTwoFactorEnabled,
}: {
  email: string;
  isTwoFactorEnabled: boolean;
}) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  const form = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      revokeOtherSessions: true,
    },
  });

  const { isSubmitting } = form.formState;

  // ✅ Fetch linked accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setIsLoadingAccounts(true);
        const result = await authClient.listAccounts();

        // ✅ Correctly unwrap typed union
        if ("data" in result && Array.isArray(result.data)) {
          setAccounts(result.data);
        } else if ("error" in result && result.error) {
          toast.error(result.error.message || "Failed to load linked accounts");
          setAccounts([]);
        } else {
          setAccounts([]);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
        toast.error("Failed to load linked accounts");
        setAccounts([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    };

    fetchAccounts();
  }, []);

  console.log(accounts);

  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === "credential"
  );

  async function handlePasswordChange(data: ChangePasswordForm) {
    try {
      await authClient.changePassword(data, {
        onError: (error) => {
          toast.error(error.error.message || "Failed to change password");
        },
        onSuccess: () => {
          toast.success("Password changed successfully");
          form.reset();
        },
      });
    } catch (error) {
      console.error("Password change failed:", error);
      toast.error("Unexpected error changing password");
    }
  }

  if (isLoadingAccounts) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  return (
    <div>
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handlePasswordChange)}
                className="mt-2 space-y-8"
              >
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="revokeOtherSessions"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel>Log out other sessions</FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  <LoadingSwap isLoading={isSubmitting}>
                    Change Password
                  </LoadingSwap>
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will send you a password reset email to set up a password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BetterAuthActionButton
              variant="outline"
              successMessage="Password reset email sent"
              action={() => {
                return authClient.requestPasswordReset({
                  email,
                  redirectTo: "/auth/reset-password",
                });
              }}
            >
              Send Password Reset Email
            </BetterAuthActionButton>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
