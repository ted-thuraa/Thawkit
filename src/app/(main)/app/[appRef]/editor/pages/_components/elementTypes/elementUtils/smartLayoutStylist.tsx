"use client";

import * as React from "react";
import { useCallback } from "react";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronsUpDown,
  Columns3, // Generic column/grid icon
  ListOrdered,
  Palette,
  Trash2, // Delete icon
  SquarePen, // Icon for layout type
  Image as ImageIcon,
  Baseline, // For Text Box
  ListChecks, // For Bullets
  Sparkles, // For Icon With Text (Placeholder)
  CalendarDays, // For Timeline (Placeholder)
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { debounce } from "lodash";
import { ColorPicker } from "@/components/global/colorPicker";
import { Separator } from "@/components/ui/separator";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

const smartLayoutTypeIcons: { [key: string]: React.ElementType } = {
  text_box: Baseline,
  bullets: ListChecks,
  icon_with_text: Sparkles,
  image_with_text: ImageIcon,
  timeline: CalendarDays,
  default: SquarePen,
};

const columnSizeOptions = [
  { value: 1, label: "S" }, // Small - 1 column
  { value: 2, label: "M" }, // Medium - 2 columns
  { value: 3, label: "L" }, // Large - 3 columns
  { value: 4, label: "XL" }, // Extra Large - 4 columns
];

const smartLayoutType = [
  {
    value: "text_box",
    label: "Text box",
  },
  {
    value: "bullets",
    label: "Bullets",
  },
  {
    value: "icon_with_text",
    label: "Icon With Text",
  },
  {
    value: "image_with_text",
    label: "Image With Text",
  },
  {
    value: "timeline",
    label: "Timeline",
  },

  // {
  //   value: "steps",
  //   label: "Steps",
  // },
];

type Props = { section: ElementNode };

const SmartLayoutStylist = ({ section }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [layoutTypeOpen, setLayoutTypeOpen] = React.useState(false);
  const [bgColorOpen, setBgColorOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const {
    selectedSectionId,
    updateElementProperty,
    removeSection, // To implement delete functionality
  } = usePageBuilderStore();

  // Memoize the current layout value
  const currentLayout = React.useMemo(
    () => section.settings?.smart_layout_type || "",
    [section.settings?.smart_layout_type]
  );
  const CurrentLayoutIcon =
    smartLayoutTypeIcons[currentLayout] || smartLayoutTypeIcons.default;

  const handleLayoutChange = React.useCallback(
    (newValue: string) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.smart_layout_type",
          newValue,
          selectedSectionId as string
        );
      }
      setOpen(false);
    },
    [section.id, updateElementProperty]
  );

  const handleGridColumnChange = useCallback(
    (value: string) => {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && section.id) {
        updateElementProperty(
          section.id,
          "settings.grid_columns", // Standardizing to grid_columns
          numValue,
          selectedSectionId as string
        );
      }
    },
    [section.id, updateElementProperty]
  );

  const handleItemsTextAlignmentChange = useCallback(
    (value: string) => {
      if (value && section.id) {
        updateElementProperty(
          section.id,
          "settings.itemsTextAlignment",
          value,
          selectedSectionId as string
        );
      }
    },
    [section.id, updateElementProperty]
  );

  const handleNumberingToggle = useCallback(
    (value: boolean) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.items_numbered",
          value,
          selectedSectionId as string
        );
      }
    },
    [section.id, updateElementProperty]
  );

  const debouncedUpdateCardBgColor = React.useCallback(
    debounce((newColor: string) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.smartLayout_cardBackgroundColor",
          newColor,
          selectedSectionId as string
        );
      }
    }, 300),
    [section.id, updateElementProperty]
  );

  const handleDeleteSection = useCallback(() => {
    if (selectedSectionId && section.id) {
      // Ensure the correct section ID is being passed for removal.
      // If this stylist is for the selectedSectionId itself:
      //removeSection(section.id);
    }
  }, [selectedSectionId, section.id, removeSection]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-row items-center gap-1 p-1.5 rounded-md bg-white shadow-lg border border-gray-200">
        {/* Layout Type Selector */}
        <Popover open={layoutTypeOpen} onOpenChange={setLayoutTypeOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  role="combobox"
                  aria-expanded={layoutTypeOpen}
                  className="h-8 px-2 text-xs justify-start w-auto min-w-[120px] max-w-[160px] hover:bg-gray-100"
                >
                  <CurrentLayoutIcon className="h-3.5 w-3.5 mr-1.5 text-gray-600 shrink-0" />
                  <span className="truncate">
                    {currentLayout
                      ? smartLayoutType.find(
                          (type) => type.value === currentLayout
                        )?.label
                      : "Select Layout"}
                  </span>
                  <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 opacity-40" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Change Layout Type</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-[180px] p-0">
            <Command>
              <CommandList>
                <CommandGroup>
                  {smartLayoutType.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={handleLayoutChange}
                      className="text-xs"
                    >
                      {type.label}
                      <Check
                        className={cn(
                          "ml-auto h-3.5 w-3.5",
                          currentLayout === type.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />

        {/* Column Size Selector */}
        <ToggleGroup
          type="single"
          value={String(section.settings?.grid_columns || 3)}
          onValueChange={handleGridColumnChange}
          aria-label="Column Size"
          className="flex items-center gap-0.5"
        >
          {columnSizeOptions.map((opt) => (
            <Tooltip key={opt.value}>
              <TooltipTrigger asChild>
                <ToggleGroupItem
                  value={String(opt.value)}
                  aria-label={`${opt.label} columns`}
                  className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600 text-xs"
                >
                  {/* Using text S,M,L,XL for now, could be icons */}
                  {opt.label}
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>
                  {opt.value} Column{opt.value > 1 ? "s" : ""}
                </p>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />

        {/* Background Color Picker Popover */}
        <Popover open={bgColorOpen} onOpenChange={setBgColorOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-1 hover:bg-gray-100"
                >
                  <Palette className="h-4 w-4 text-gray-600" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Card Background Color</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-2">
            <Label
              htmlFor="smartCardBgColorAll"
              className="text-xs text-gray-600 mb-1 block"
            >
              All Cards Background
            </Label>
            <ColorPicker
              //id="smartCardBgColorAll"
              color={section.settings?.smartLayout_cardBackgroundColor || ""}
              onChange={debouncedUpdateCardBgColor}
              className="w-full"
            />
          </PopoverContent>
        </Popover>

        {/* Conditional Text Alignment */}
        {currentLayout === "text_box" && (
          <>
            <Separator
              orientation="vertical"
              className="h-5 bg-gray-300 mx-0.5"
            />
            <ToggleGroup
              type="single"
              value={section.settings?.itemsTextAlignment || "left"}
              onValueChange={handleItemsTextAlignmentChange}
              aria-label="Text Alignment"
              className="flex items-center gap-0.5"
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="left"
                    aria-label="Align left"
                    className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Align Left</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="center"
                    aria-label="Align center"
                    className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
                  >
                    <AlignCenter className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Align Center</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value="right"
                    aria-label="Align right"
                    className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
                  >
                    <AlignRight className="h-4 w-4" />
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Align Right</p>
                </TooltipContent>
              </Tooltip>
            </ToggleGroup>
          </>
        )}

        {/* Conditional List Numbering */}
        {currentLayout === "bullets" && (
          <>
            <Separator
              orientation="vertical"
              className="h-5 bg-gray-300 mx-0.5"
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  variant="outline"
                  aria-label="Toggle numbering"
                  pressed={section.settings?.items_numbered || false}
                  onPressedChange={handleNumberingToggle}
                  className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600 border-gray-300 hover:bg-gray-100"
                >
                  <ListOrdered className="h-4 w-4" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>
                  {section.settings?.items_numbered
                    ? "Disable Numbering"
                    : "Enable Numbering"}
                </p>
              </TooltipContent>
            </Tooltip>
          </>
        )}

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />

        {/* Delete Button */}
      </div>
    </TooltipProvider>
  );
};

export default React.memo(SmartLayoutStylist);
