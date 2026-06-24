"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import GeneralSettings from "./generalSettings";
import {
  Bell,
  ClipboardEdit,
  Cog,
  GraduationCap,
  Mail,
  MousePointerClick,
  Palette,
  Share2,
} from "lucide-react";
import ScoreTierSettings from "./scoreTierSettings";
import LeadFormSettings from "./leadFormSettings";
import AppearanceSettings from "./appearanceSettings";
import ResultEmailSettings from "./resultEmailSetttings";
import NotificationsSettings from "./notificationsSettings";
import { FullProjectDataResponse } from "@/lib/querries/project";

type Props = {
  projectId: string;
  projectData: FullProjectDataResponse;
};

const SettingsClient = ({ projectId, projectData }: Props) => {
  const settingsNav = [
    {
      label: "General",
      value: "general",
      component: (
        <GeneralSettings projectId={projectId} projectData={projectData} />
      ),
      icon: Cog,
      isActive: true,
      items: [],
    },

    {
      label: "Share Appearance",
      value: "share_appearance",
      component: (
        <AppearanceSettings projectId={projectId} projectData={projectData} />
      ),
      icon: Share2,
      items: [],
    },
    // {
    //   label: "Tracking",
    //   value: "tracking",
    //   component: <TrackingSettings projectId={projectId} projectData={projectData} />,
    //   icon: MousePointerClick,
    //   items: [],
    // },
    {
      label: "Result Email",
      value: "result_email",
      component: (
        <ResultEmailSettings projectId={projectId} projectData={projectData} />
      ),
      icon: Mail,
      items: [],
    },
    {
      label: "Notifications",
      value: "notifications",
      component: (
        <NotificationsSettings
          projectId={projectId}
          projectData={projectData}
        />
      ),
      icon: Bell,
      items: [],
    },
  ];
  return (
    <div className="max-w-6xl ">
      <div className="my-2 px-4">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="w-full mt-6">
        <Tabs defaultValue={settingsNav[0].value}>
          <div className="">
            <div className="flex h-10 justify-start items-center gap-6 px-4 bg-transparent">
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
          </div>
          <div className="px-6 h-[70vh]">
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

export default SettingsClient;
