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
import { PiVideoBold } from "react-icons/pi";
import { PiVideoDuotone } from "react-icons/pi";
import { PiVideoFill } from "react-icons/pi";
import { RxVideo } from "react-icons/rx";
import { FaImage } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { BsCardImage } from "react-icons/bs";
import { RiTextBlock } from "react-icons/ri";
import { BsInputCursorText } from "react-icons/bs";
import { TbTextRecognition } from "react-icons/tb";
import { LuGauge } from "react-icons/lu";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { parentElement: ElementNode; chartElement: ElementNode | null };

const IndividualScoreStylist = ({ parentElement, chartElement }: Props) => {
  const { updateElementProperty, selectedSectionId } = usePageBuilderStore();
  if (!parentElement) return;
  if (!chartElement) return;

  const handleIndividualScoreLogic = useCallback(
    (value: string) => {
      if (!value) return;
      updateElementProperty(
        parentElement.id,
        "settings.individualScoreLogic",
        value,
        selectedSectionId as string
      );
    },
    [selectedSectionId, parentElement.id, updateElementProperty]
  );

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

  const handleParentElementSettingChange = useCallback(
    (property: string, checked: boolean) => {
      updateElementProperty(chartElement.id, `settings.${property}`, checked);
    },
    [chartElement.id, updateElementProperty]
  );

  return (
    <div className="p-4 space-y-4 bg-card text-card-foreground rounded-lg shadow-lg w-[320px]">
      <ToggleGroup
        type="single"
        defaultValue={chartElement.settings?.chart_type || "pie"}
        onValueChange={handleChartTypeChange}
        className="grid grid-cols-5 gap-1 p-1 border rounded-lg"
      >
        <ToggleGroupItem value="text_block" aria-label="radial chart">
          <TbTextRecognition className="w-5 h-5" />
          {/* <RiTextBlock className="w-5 h-5" />
          <BsInputCursorText className="w-5 h-5" /> */}
        </ToggleGroupItem>
        <ToggleGroupItem value="gauge" aria-label="gauge chart">
          <LuGauge className="w-5 h-5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="image" aria-label="Radar chart">
          <FaImage className="w-5 h-5" />
          {/* <FaRegImage className="w-5 h-5" />
          <IoImageOutline className="w-5 h-5" />
          <BsCardImage className="w-5 h-5" />
           */}
        </ToggleGroupItem>
        <ToggleGroupItem value="video" aria-label="Bar chart">
          <PiVideoBold className="w-5 h-5" />
          {/* <PiVideoDuotone className="w-5 h-5" />
          <PiVideoFill className="w-5 h-5" />
          <RxVideo className="w-5 h-5" />
           */}
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <Palette className="w-5 h-5 text-muted-foreground" /> */}
            <Label>Display Category</Label>
          </div>
          <Select
            onValueChange={handleIndividualScoreLogic}
            defaultValue={
              parentElement.settings?.individualScoreLogic ||
              "highest_score_cat"
            }
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest_score_cat">Highest score</SelectItem>
              <SelectItem value="lowest_score_cat">Lowest score</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <div className="flex items-center justify-center w-5 h-5 border rounded-sm">
              <span className="text-xs font-bold">AB</span>
            </div> */}
            <Label>Show Categories</Label>
          </div>
          <Switch
            //checked={parentElement.settings?.showCategoryScores}
            checked={false}
            // onCheckedChange={handleShowCategories}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <div className="flex items-center justify-center w-5 h-5 border rounded-sm">
              <span className="text-xs font-bold">AB</span>
            </div> */}
            <Label>Show labels</Label>
          </div>
          <Switch
            //checked={section.settings?.showLabels}
            checked={false}
            //onCheckedChange={handleBooleanSettingChange("showLabels")}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* <div className="flex items-center justify-center w-5 h-5 border rounded-sm">
              <span className="text-xs font-bold">12</span>
            </div> */}
            <Label>Show values</Label>
          </div>
          <Switch
            //checked={section.settings?.showValues}
            checked={false}
            //onCheckedChange={handleBooleanSettingChange("showValues")}
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(IndividualScoreStylist);
