"use client";
import * as React from "react";
import { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { AiOutlineRadarChart } from "react-icons/ai";
import {
  Palette,
  AlignJustify,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Edit,
  PieChart,
  Target,
  BarChart,
  List,
  TrendingUp,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { LuGauge } from "react-icons/lu";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { parentElement: ElementNode; chartElement: ElementNode | null };

const ResultChartStylist = ({ parentElement, chartElement }: Props) => {
  const { updateElementProperty, selectedSectionId } = usePageBuilderStore();
  if (!parentElement) return;
  if (!chartElement) return;

  const handleChartTypeChange = useCallback(
    (value: string) => {
      if (!value) return;
      updateElementProperty(
        chartElement.id,
        "settings.chart_type",
        value,
        selectedSectionId as string
      );
    },
    [selectedSectionId, chartElement.id, updateElementProperty]
  );

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

  const handleStringStyleChange = useCallback(
    (property: string) => (value: string) => {
      if (!selectedSectionId) return;
      //   updateElementProperty(
      //     selectedSectionId,
      //     section.id,
      //     `styles.${property}`,
      //     value
      //   );
    },
    [selectedSectionId, chartElement.id, updateElementProperty]
  );

  const handleBooleanSettingChange = useCallback(
    (property: string, checked: boolean) => {
      updateElementProperty(chartElement.id, `settings.${property}`, checked);
    },
    [chartElement.id, updateElementProperty]
  );

  return (
    <div className="w-[280px] bg-white h-screen border-r border-gray-200 flex flex-col font-sans text-sm antialiased">
      {/* --- Header Tabs (shadcn/ui) --- */}
      <Tabs defaultValue="design" className="w-full flex flex-col">
        <div className="p-2 border-b border-gray-100">
          <TabsList className="w-full bg-gray-100/80 p-0.5 h-auto rounded-md grid grid-cols-3">
            {["design", "settings", "interactions"].map((tab) => (
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
          value="design"
          className="flex-1 flex flex-col mt-0 outline-none"
        >
          <Separator className="bg-gray-200 mx-3 mb-1" />

          {/* --- Settings List --- */}
          <div className="flex-1 overflow-y-auto px-3">
            <div
              className="
              py-3 px-1 flex items-center justify-between gap-2
              hover:no-underline group
              [&>svg:last-child]:hidden
            "
            >
              <ToggleGroup
                type="single"
                defaultValue={chartElement.settings?.chart_type || "pie"}
                onValueChange={handleChartTypeChange}
                className="w-full grid grid-cols-4 gap-1 p-1 border rounded-lg"
              >
                <ToggleGroupItem value="pie" aria-label="Pie chart">
                  <PieChart className="w-5 h-5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="radial" aria-label="radial chart">
                  <Target className="w-5 h-5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="gauge" aria-label="gauge chart">
                  <LuGauge className="w-5 h-5" />
                </ToggleGroupItem>
                <ToggleGroupItem value="radar" aria-label="Radar chart">
                  <AiOutlineRadarChart className="w-5 h-5" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {/* Show Categories */}
            <div
              className="
              py-3 px-1 flex items-center justify-between gap-2
              hover:no-underline group
              [&>svg:last-child]:hidden
            "
            >
              <Label className="text-[13px] font-medium text-gray-600">
                Show Categories
              </Label>
              <Switch
                checked={parentElement.settings?.showCategoryScores}
                onCheckedChange={handleShowCategories}
              />
            </div>

            {/* Show Labels */}
            <div
              className="
              py-3 px-1 flex items-center justify-between gap-2
              hover:no-underline group
              [&>svg:last-child]:hidden
            "
            >
              <Label className="text-[13px] font-medium text-gray-600">
                Show Labels
              </Label>
              <Switch
                checked={chartElement.settings?.showChartLabels}
                onCheckedChange={(val) =>
                  handleBooleanSettingChange("showChartLabels", val)
                }
              />
            </div>

            {/* Show Score Tiers */}
            <div
              className="
              py-3 px-1 flex items-center justify-between gap-2
              hover:no-underline group
              [&>svg:last-child]:hidden
            "
            >
              <Label className="text-[13px] font-medium text-gray-600">
                Show Score Tiers
              </Label>
              <Switch
                checked={chartElement.settings?.showScoreTiersLabels}
                onCheckedChange={(val) =>
                  handleBooleanSettingChange("showScoreTiersLabels", val)
                }
              />
            </div>
          </div>
        </TabsContent>

        {/* --- Other Tabs --- */}
        <TabsContent value="settings" className="mt-0" />
        <TabsContent value="interactions" className="mt-0" />
      </Tabs>
    </div>
  );
};

export default React.memo(ResultChartStylist);
