"use client";

import * as React from "react";
import { useCallback } from "react";

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BookImage,
  Check,
  ChevronsUpDown,
  Columns2,
  Columns3,
  LayoutGrid,
  ListOrdered,
  Palette,
  RectangleHorizontal,
  RotateCcw,
  Rows2,
  SquarePen,
  Star,
  Trash,
  Trash2,
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

import { btns, ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/global/colorPicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { debounce } from "lodash";
import { Switch } from "@/components/ui/switch";
import { getAccessibleTextColor } from "@/lib/utils/colors";

type Props = { element: ElementNode };
const layoutValues = ["row", "grid"] as const;
type LayoutValue = (typeof layoutValues)[number];
const layoutIcons: Record<LayoutValue, React.ElementType> = {
  row: Rows2,
  grid: LayoutGrid,
  //right: AlignRight,
};

const QuestionOptionsStylist = ({ element }: Props) => {
  const {
    livemode,
    theme,
    selectedSectionId,
    updateElementProperty,
    removeSmartLayoutItem,
  } = usePageBuilderStore();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [bgColorOpen, setBgColorOpen] = React.useState(false);
  const [btnStylerOpen, setBtnStylerOpen] = React.useState(false);
  const [currentBackgroundSource, setCurrentBackgroundSource] = React.useState(
    element.styles?.backgroundColor ?? ""
  );

  React.useEffect(() => {
    setCurrentBackgroundSource(element.styles?.backgroundColor ?? "");
  }, [element.styles?.backgroundColor]);

  const handleItemHighlight = useCallback(
    (value: boolean) => {
      if (element.id) {
        updateElementProperty(
          element.id,
          "settings.isHighlighted",
          value,
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, element.id, updateElementProperty]
  );

  const handleDefaultSettings = useCallback(() => {
    if (element.id) {
      updateElementProperty(element.id, "styles.backgroundColor", "");
      updateElementProperty(element.id, "styles.color", "");
      updateElementProperty(element.id, "settings.btn_style", "default");
    }
  }, [selectedSectionId, element.id, removeSmartLayoutItem]);

  const handleShowIcon = useCallback(
    (val: boolean) => {
      if (element) {
        updateElementProperty(
          element.id, // The ID of the layout_item being changed
          "settings.showIcons",
          val,
          selectedSectionId as string // The ID of the smart_layout container
        );
      }
      // Note: Sheet closing is handled within IconPicker's onSelect -> handleSelect
    },
    [element.id, updateElementProperty] // Add section.id dependency
  );
  const handleIconChange = useCallback(
    (itemId: string, iconName: string) => {
      if (itemId) {
        updateElementProperty(
          itemId, // The ID of the layout_item being changed
          "settings.iconName",
          iconName,
          selectedSectionId as string // The ID of the smart_layout container
        );
      }
      // Note: Sheet closing is handled within IconPicker's onSelect -> handleSelect
    },
    [selectedSectionId, updateElementProperty] // Add section.id dependency
  );
  const debouncedUpdateOptionsBgColor = React.useCallback(
    debounce((newColor: string) => {
      const valueToUpdate = newColor || "";
      const textColorOptions = ["#FFFFFF", "#000000"]; // Common accessible choices
      const accessibleBtnForeground = getAccessibleTextColor(
        valueToUpdate,
        textColorOptions,
        4.5
      ); // AA contrast for buttons is fine
      setCurrentBackgroundSource(valueToUpdate);
      if (element.id) {
        updateElementProperty(element.id, "styles.backgroundColor", newColor);
        updateElementProperty(
          element.id,
          "styles.color",
          accessibleBtnForeground
        );
      }
    }, 300),
    [element.id, updateElementProperty]
  );

  const handleBtnStyle = useCallback(
    (value: btns) => {
      if (element.id) {
        updateElementProperty(element.id, "settings.btn_style", value);
      }
    },
    [element.id, updateElementProperty]
  );

  const currentLayout = React.useMemo(
    () => (element.settings?.smart_layout_type as LayoutValue) ?? "row",
    [element.settings?.smart_layout_type]
  );
  console.log(currentLayout);
  const handleLayoutChange = useCallback(
    (newLayout: LayoutValue) => {
      console.log(newLayout);

      if (element.id) {
        updateElementProperty(
          element.id,
          "settings.smart_layout_type", // Target the style property
          newLayout,
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, element.id, updateElementProperty]
  );

  return (
    <TooltipProvider delayDuration={1}>
      <div className="flex flex-row items-center gap-1 p-1.5 rounded-md bg-white shadow-lg border border-gray-200">
        <div className="flex flex-row flex-nowrap items-center h-8 px-2 text-xs justify-start w-auto">
          {/* <ChevronsUpDown className="h-3.5 w-3.5  text-gray-600 shrink-0" /> */}
          <span className="whitespace-nowrap">Show Icon</span>
          {/* <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 opacity-40" /> */}
          <Switch
            id="show-icon"
            className="h-[1.5rem] w-[2.5rem] scale-75 data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-200"
            checked={element?.settings?.showIcons}
            onCheckedChange={handleShowIcon}
          />
        </div>

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />

        <ToggleGroup
          type="single"
          size="sm" // Apply size to the group
          // Apply variant to the group
          value={currentLayout} // Set current value
          onValueChange={handleLayoutChange} // Set handler
          className="flex flex-row flex-nowrap justify-start gap-1" // Allow wrapping and add gap
          aria-label="buttons layout"
        >
          {layoutValues.map((layoutValue) => {
            // Get the corresponding icon component
            const Icon = layoutIcons[layoutValue];
            return (
              <TooltipProvider key={layoutValue} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value={layoutValue}
                      aria-label={`Set object-fit to ${layoutValue}`}
                      className="px-2 py-1 h-auto" // Adjust padding/height
                    >
                      {/* Render the Icon component */}
                      <Icon className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Layout: {layoutValue}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </ToggleGroup>

        <Separator orientation="vertical" className="h-5" />
        {/* Background Color Picker Popover */}
        <Popover open={btnStylerOpen} onOpenChange={setBtnStylerOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-1 hover:bg-gray-100"
                >
                  <AlignJustify className="h-4 w-4 text-gray-600" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Buttons style</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-2">
            <Label
              htmlFor="smartCardBgColorAll"
              className="text-xs text-gray-600 mb-1 block"
            >
              Style
            </Label>
            <ToggleGroup
              type="single"
              size="sm"
              //defaultValue={section.styles?.horizontalAlignment || "center"}
              defaultValue=""
              value={element.settings?.btn_style || "default"}
              onValueChange={handleBtnStyle}
            >
              <ToggleGroupItem value="default" aria-label="solid">
                <RectangleHorizontal className="w-4 h-4 fill-gray-900" />
              </ToggleGroupItem>
              <ToggleGroupItem value="outline" aria-label="outline">
                <RectangleHorizontal className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </PopoverContent>
        </Popover>
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
              <p>Options Background Color</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-2">
            <Label
              htmlFor="smartCardBgColorAll"
              className="text-xs text-gray-600 mb-1 block"
            >
              All Options Background
            </Label>
            <ColorPicker
              //id="smartCardBgColorAll"
              color={currentBackgroundSource || theme.colors.palette.primary}
              onChange={debouncedUpdateOptionsBgColor}
              //color={"#000000"}
              className="w-full"
            />
          </PopoverContent>
        </Popover>

        <div className="flex flex-row flex-nowrap items-center h-8 px-2 text-xs justify-start w-auto min-w-[120px]  ">
          <Button
            variant={"outline"}
            size={"icon"}
            className="w-fit px-2 py-1.5"
            onClick={handleDefaultSettings}
          >
            <RotateCcw className="h-3.5 w-3.5 text-gray-600 shrink-0" />
            <span className="whitespace-nowrap">Reset</span>
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default React.memo(QuestionOptionsStylist);
