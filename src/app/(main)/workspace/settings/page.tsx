import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getServerSession } from "@/lib/sessionServer";
import { redirect } from "next/navigation";
import React from "react";
import { OrganizationBasicInfoUpdater } from "./_components/workspaceBasicSettings";
import { LayoutDashboard } from "lucide-react";
import { OrganizationConfig } from "./_components/defaultWorkspaceConfig";
import { RiTeamFill } from "react-icons/ri";
import { FaCogs } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MembersAndInvitesEditor } from "./_components/membersAndInvites";
import { getSubscriptionDetails } from "@/lib/querries/subscription";

type Props = {
  searchParams: {
    state: string;
    code: string;
    inviteWorkspace?: string; // Add this to handle invite redirects
  };
};
const WorkspaceSettingsPage = async ({ searchParams }: Props) => {
  const data = await getServerSession();
  const subscriptionDetails = await getSubscriptionDetails();

  if (!data?.session) {
    return redirect("/login");
  }

  const settingsNav = [
    {
      label: "Overview",
      value: "overview",
      component: (
        <OrganizationBasicInfoUpdater
          subscriptionDetails={subscriptionDetails}
        />
      ),
      icon: LayoutDashboard,
      isActive: true,
      items: [],
    },

    {
      label: "Team",
      value: "team",
      component: <MembersAndInvitesEditor />,
      icon: RiTeamFill,
      items: [],
    },
    {
      label: "Workspace defaults",
      value: "defaults",
      component: <OrganizationConfig />,
      icon: FaCogs,
      items: [],
    },
  ];
  return (
    <div className="">
      {/* <div className="mb-8">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900 md:text-2xl">
          Workspace Settings
        </h2>
      </div> */}
      <div>
        <Tabs defaultValue={settingsNav[0].value}>
          <div className="">
            <TabsList className="text-foreground mb-3 h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
              {settingsNav.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                >
                  <item.icon
                    className="-ms-0.5 me-1.5 opacity-60"
                    size={16}
                    aria-hidden="true"
                  />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <div className="px- h-[70vh]">
            <ScrollArea className="h-full">
              {settingsNav.map((item) => (
                <TabsContent key={item.value} value={item.value}>
                  {item.component}
                </TabsContent>
              ))}
            </ScrollArea>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default WorkspaceSettingsPage;
