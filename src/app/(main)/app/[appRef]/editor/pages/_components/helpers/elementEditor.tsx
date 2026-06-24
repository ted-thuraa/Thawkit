import React, { useCallback, useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Zap,
  ChevronsUpDown,
} from "lucide-react";
// Assuming standard shadcn paths - adjust as necessary for your project structure
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

type Props = { parentElement: ElementNode; chartElement: ElementNode | null };

// Custom Triangle Icon to match the screenshot exactly (Solid wedge)
const TriangleIcon = ({ className }: { className?: string }) => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M8 5v14l11-7z" />
  </svg>
);

const ElementEditorSidebar = ({ parentElement, chartElement }: Props) => {
  const { updateElementProperty, selectedSectionId } = usePageBuilderStore();
  if (!parentElement) return;
  if (!chartElement) return;

  const handleShowCategories = useCallback(
    (value: boolean) => {
      console.log(value);
      updateElementProperty(
        parentElement.id,
        "settings.showCategoryScores",
        value,
        selectedSectionId as string
      );
    },
    [parentElement.id, updateElementProperty]
  );

  return (
    <div className="w-[280px] bg-white h-screen border-r border-gray-200 flex flex-col font-sans text-sm antialiased">
      {/* --- Header Tabs (shadcn/ui) --- */}
      <Tabs defaultValue="settings" className="w-full flex flex-col">
        <div className="p-2 border-b border-gray-100">
          <TabsList className="w-full bg-gray-100/80 p-0.5 h-auto rounded-md grid grid-cols-3">
            {["settings", "design", "interactions"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="
                  capitalize text-[12px] font-medium rounded-sm py-1 h-auto
                  data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm
                  text-gray-500 hover:text-gray-700
                "
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* --- Tab Content --- */}
        <TabsContent
          value="settings"
          className="flex-1 flex flex-col mt-0 outline-none"
        >
          <div className="px-3 pt-3 pb-1">
            {/* --- Neutral Selector --- */}
            <Button
              variant="ghost"
              className="w-full h-auto py-2 px-0 hover:bg-transparent flex items-center justify-between group"
            >
              <div className="flex items-center">
                <Zap size={14} className="text-gray-500 mr-2 fill-gray-500" />
                <span className="text-[13px] font-medium text-[#111827]">
                  Neutral
                </span>
              </div>
              <ChevronsUpDown
                size={14}
                className="text-gray-400 group-hover:text-gray-500"
              />
            </Button>
          </div>

          <Separator className="bg-gray-200 mx-3 mb-1" />

          {/* --- Accordion List (shadcn/ui) --- */}
          <div className="flex-1 overflow-y-auto px-3">
            <div
              className="
                      py-3 px-1 flex flex-row flex-nowrap items-center justify-between hover:no-underline  
                       gap-2 group
                      [&>svg:last-child]:hidden
                    "
            >
              <div className="flex items-center space-x-2">
                <Label className="text-[13px] font-medium text-gray-600">
                  Show Categories
                </Label>
              </div>
              <Switch
                checked={parentElement.settings?.showCategoryScores}
                //checked={false}
                onCheckedChange={handleShowCategories}
              />
            </div>
          </div>
        </TabsContent>

        {/* Placeholders for other tabs */}
        <TabsContent value="design" className="mt-0" />
        <TabsContent value="interactions" className="mt-0" />
      </Tabs>
    </div>
  );
};

export default ElementEditorSidebar;
