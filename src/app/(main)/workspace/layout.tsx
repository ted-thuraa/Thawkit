import React from "react";
import WorkspaceLayout from "./_components/workspaceLayout";
import { getServerSession } from "@/lib/sessionServer";
import { redirect } from "next/navigation";
import {
  createOrganization,
  listOrganizations,
  setActiveOrganization,
} from "@/actions/organization";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getServerSession();
  if (!data?.session) {
    return redirect("/login");
  }
  //console.log(data);

  const { session, user } = data;

  // 1️⃣ If there's already an active organization, just render the workspace
  if (session.activeOrganizationId) {
    return <WorkspaceLayout user={user}>{children}</WorkspaceLayout>;
  }

  // 2️⃣ No active org? Check if the user already has any
  const orgs = await listOrganizations();

  if (orgs && orgs.length > 0) {
    // 3️⃣ Pick the first one as default
    const firstOrg = orgs[0];
    await setActiveOrganization(firstOrg.id, firstOrg.slug);

    return <WorkspaceLayout user={user}>{children}</WorkspaceLayout>;
  }

  // 4️⃣ No orgs at all? Create a default organization for this user
  //const user = session.user;
  const defaultOrgName = `My Workspace`;
  const defaultSlug = defaultOrgName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-");

  const newOrg = await createOrganization({
    name: defaultOrgName,
    slug: defaultSlug,
    userId: session.userId,
    metadata: { autoCreated: true },
  });

  // 5️⃣ Set the newly created org as active
  if (newOrg) {
    await setActiveOrganization(newOrg.id, newOrg.slug);
  } else {
    return null;
  }

  return <WorkspaceLayout user={user}>{children}</WorkspaceLayout>;
}
