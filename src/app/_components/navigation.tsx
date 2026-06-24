"use client";

import { useEffect, useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";
import { ChartPieIcon, ChevronDownIcon, Command, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BetterAuthActionButton } from "@/components/auth/better-auth-action-button";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasAdminPermission, setHasAdminPermission] = useState(false);
  const { data: session, isPending: loading } = authClient.useSession();

  useEffect(() => {
    authClient.admin
      .hasPermission({ permission: { user: ["list"] } })
      .then(({ data }) => {
        setHasAdminPermission(data?.success ?? false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="bg-transparent fixed inset-0 z-50 text-gray-700">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
      >
        <div className="flex lg:flex-1">
          <a
            href="#"
            className="-m-1.5 p-1.5 flex flex-row flex-nowrap gap-x-2 items-center"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-lg leading-tight">
              <span className=" font-bold ">Acme Inc</span>
            </div>
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          >
            <span className="sr-only">Open main menu</span>
            <Menu aria-hidden="true" className="size-6" />
          </button>
        </div>
        <div className="hidden lg:flex  lg:gap-x-12">
          <div className="flex flex-row space-x-2 ">
            <a
              href="#how-it-works"
              className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-700 hover:bg-white/5"
            >
              How it works
            </a>
            <a
              href="#who-is-it-for"
              className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-700 hover:bg-white/5"
            >
              Who its for
            </a>
            <a
              href="#why-us"
              className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-700 hover:bg-white/5"
            >
              Why us
            </a>
          </div>
        </div>

        <div className="hidden lg:flex flex-row items-center lg:flex-1 lg:justify-end gap-x-4">
          {session == null ? (
            <>
              <Button
                asChild
                variant={"outline"}
                className="  flex items-center rounded-lg px-3 py-2.5 text-base/7 font-semibold "
              >
                <Link href="/login">Login </Link>
              </Button>
              <Button
                asChild
                variant={"default"}
                className="  flex items-center rounded-lg px-3 py-2.5 text-base/7 font-semibold "
              >
                <Link href="/signup">Sign Up </Link>
              </Button>
            </>
          ) : (
            <>
              <BetterAuthActionButton
                //size="lg"
                variant="default"
                action={() => authClient.signOut()}
              >
                Sign Out
              </BetterAuthActionButton>
            </>
          )}
        </div>
      </nav>
      <div className="lg:hidden">
        <Dialog>
          <div className="fixed inset-0 z-50" />
          <DialogContent className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto"
                />
              </a>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="-m-2.5 rounded-md p-2.5 text-gray-400"
              >
                <span className="sr-only">Close menu</span>
                <X aria-hidden="true" className="size-6" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-2 py-6">
                  <a
                    href="how-it-works"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-700 hover:bg-white/5"
                  >
                    How it works
                  </a>
                  <a
                    href="who-is-it-for"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-700 hover:bg-white/5"
                  >
                    Who its for
                  </a>
                  <a
                    href="why-us"
                    className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-700 hover:bg-white/5"
                  >
                    Why us
                  </a>
                </div>
                <div className="py-6">
                  <a
                    href="#"
                    className="bg-primary text-primary-foreground -mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold "
                  >
                    Log in
                  </a>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
