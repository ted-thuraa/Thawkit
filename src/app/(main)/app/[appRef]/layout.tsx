import React from "react";
import { getServerSession } from "@/lib/sessionServer";
import { redirect } from "next/navigation";
import {
  createOrganization,
  listOrganizations,
  setActiveOrganization,
} from "@/actions/organization";
import AppDashboardLayout from "./_components/appDashboardLayout";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ appRef: string }>;
}) {
  const { appRef } = await params;

  const data = await getServerSession();
  if (!data?.session) {
    return redirect("/login");
  }
  //console.log(data);

  const { session, user } = data;

  // 1️⃣ If there's already an active organization, just render the workspace
  if (!session.activeOrganizationId) {
    return redirect("/workspace");
  }

  return (
    <AppDashboardLayout user={user} appRef={appRef}>
      {children}
    </AppDashboardLayout>
  );
}
