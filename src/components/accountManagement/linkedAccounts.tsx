"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Plus,
  Shield,
  Trash2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import {
  SUPPORTED_OAUTH_PROVIDER_DETAILS,
  SUPPORTED_OAUTH_PROVIDERS,
  SupportedOAuthProvider,
} from "@/lib/auth/o-auth-providers";
import { BetterAuthActionButton } from "../auth/better-auth-action-button";
import { auth } from "@/lib/auth/auth";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Account = Awaited<ReturnType<typeof auth.api.listUserAccounts>>[number];

export function LinkedAccountsTab() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

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

  if (isLoadingAccounts) {
    return (
      <div className="flex justify-center items-center h-32">
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  const currentAccounts = accounts.filter((a) => a.providerId !== "credential");

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Linked Accounts</h3>

            {currentAccounts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-secondary-muted">
                  No linked accounts found
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {currentAccounts.map((account) => (
                  <AccountCard
                    key={account.id}
                    provider={account.providerId}
                    account={account}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Link Other Accounts</h3>
            <div className="grid gap-3">
              {SUPPORTED_OAUTH_PROVIDERS.filter(
                (provider) =>
                  !currentAccounts.find((acc) => acc.providerId === provider)
              ).map((provider) => (
                <AccountCard key={provider} provider={provider} />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AccountCard({
  provider,
  account,
}: {
  provider: string;
  account?: Account;
}) {
  const router = useRouter();

  const providerDetails = SUPPORTED_OAUTH_PROVIDER_DETAILS[
    provider as SupportedOAuthProvider
  ] ?? {
    name: provider,
    Icon: Shield,
  };

  function linkAccount() {
    return authClient.linkSocial({
      provider,
      callbackURL: "/profile",
    });
  }

  function unlinkAccount() {
    if (account == null) {
      return Promise.resolve({ error: { message: "Account not found" } });
    }
    return authClient.unlinkAccount(
      {
        accountId: account.accountId,
        providerId: provider,
      },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {<providerDetails.Icon className="size-5" />}
            <div>
              <p className="font-medium">{providerDetails.name}</p>
              {account == null ? (
                <p className="text-sm text-muted-foreground">
                  Connect your {providerDetails.name} account for easier sign-in
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Linked on {new Date(account.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          {account == null ? (
            <BetterAuthActionButton
              variant="outline"
              size="sm"
              action={linkAccount}
            >
              <Plus />
              Link
            </BetterAuthActionButton>
          ) : (
            <BetterAuthActionButton
              variant="destructive"
              size="sm"
              action={unlinkAccount}
            >
              <Trash2 />
              Unlink
            </BetterAuthActionButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
