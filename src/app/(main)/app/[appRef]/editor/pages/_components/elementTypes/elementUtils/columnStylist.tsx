import React from "react";
import {
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Replace, // Using Replace icon for column swap
  GitCompareArrows,
} from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type ColumnsStylistProps = {
  section: ElementNode;
};

const ColumnsStylist: React.FC<ColumnsStylistProps> = ({ section }) => {
  const { updateElementProperty, selectedSectionId } = usePageBuilderStore();

  const handleAlignmentChange = (value: "start" | "center" | "end") => {
    if (value) {
      // selectedSectionId might be the parent of ColumnsContainer, or ColumnsContainer itself
      // If ColumnsContainer is a top-level section, selectedSectionId === section.id
      // If ColumnsContainer is nested, we need to ensure we're updating the correct section.
      // For now, assuming 'section.id' is the ID of the ColumnsContainer element itself.
      updateElementProperty(
        section.id, // Element ID within the section (same as section ID for top-level properties)
        "settings.column_items_alignment",
        value,
        selectedSectionId as string // The ID of the ColumnsContainer section itself
      );
    }
  };

  const handleOrderToggle = () => {
    if (section.id) {
      updateElementProperty(
        section.id,
        "settings.column_reverse_order",
        !section.settings?.column_reverse_order,
        selectedSectionId as string
      );
    }
  };

  const currentAlignment = section.settings?.column_items_alignment || "start";
  const isOrderReversed = section.settings?.column_reverse_order || false;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-row items-center gap-1.5 ">
        {/* Vertical Align Group */}
        <ToggleGroup
          type="single"
          value={currentAlignment}
          onValueChange={(value: "start" | "center" | "end") => {
            if (value) handleAlignmentChange(value);
          }}
          aria-label="Column Vertical Alignment"
          className="flex items-center gap-0.5"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="start"
                aria-label="Align top"
                className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
              >
                <AlignVerticalJustifyStart className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Align Top</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="center"
                aria-label="Align middle"
                className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
              >
                <AlignVerticalJustifyCenter className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Align Middle</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <ToggleGroupItem
                value="end"
                aria-label="Align bottom"
                className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
              >
                <AlignVerticalJustifyEnd className="h-4 w-4" />
              </ToggleGroupItem>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Align Bottom</p>
            </TooltipContent>
          </Tooltip>
        </ToggleGroup>

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-1" />

        {/* Column Order Group */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost" // Changed to ghost for a more subtle look in a toolbar
              size="icon"
              onClick={handleOrderToggle}
              className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600 hover:bg-gray-100"
              // title={isOrderReversed ? "Set to Default Order" : "Reverse Column Order"}
            >
              <GitCompareArrows className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>
              {isOrderReversed
                ? "Switch to Default Order"
                : "Reverse Column Order"}
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ColumnsStylist;
