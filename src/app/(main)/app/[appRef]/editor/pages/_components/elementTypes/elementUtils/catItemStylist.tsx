"use client";

import React, { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { SheetProvider } from "@/providers/sheet-provider";
import IconPicker from "../../helpers/iconPicker";

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

type Props = {
  Item: ElementNode;
  index: number;
  onTierChange: (value: string | null) => void;
};

const CategoryScoresItemStylist = ({ Item, index, onTierChange }: Props) => {
  const {
    categories,
    scoretiers,
    selectedSectionId,
    updateElementProperty,
    removeSection, // To implement delete functionality
  } = usePageBuilderStore();
  const { id, content, name, className, type, settings } = Item;

  const [open, setOpen] = React.useState(false);
  const [layoutTypeOpen, setLayoutTypeOpen] = React.useState(false);
  const [bgColorOpen, setBgColorOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [tierSetterOpen, setTierSetterOpen] = React.useState(false);
  const [isScoreOptionsopen, setIsScoreOptionsOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.contentIsDynamic && scoretiers.length > 0) {
      const firstTierId = scoretiers[0].id;
      setSelectedTierId(firstTierId);
      //onTierChange(firstTierId);
    }
  }, [settings?.contentIsDynamic, scoretiers]);

  const basedOnOptions: Array<{ value: string; label: string }> = [
    {
      value: "overall_score",
      label: "Overall score",
    },
    ...categories.map((cat) => ({
      value: cat.id as string,
      label: cat.title as string,
    })),
  ];

  // Memoize the current layout value
  const currentLayout = React.useMemo(
    () => Item.settings?.smart_layout_type || "",
    [Item.settings?.smart_layout_type]
  );
  const CurrentLayoutIcon =
    smartLayoutTypeIcons[currentLayout] || smartLayoutTypeIcons.default;

  // Initialize dynamic content for all tiers
  const createDynamicContent = useCallback(
    (itemType: string, caTitle?: string) => {
      return scoretiers.map((tier) => ({
        score_tier_id: tier.id,
        tierName: tier.name,
        content: {
          innerText:
            itemType === "catItemTitle"
              ? caTitle
              : "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        },
      }));
    },
    [scoretiers, content]
  );

  const handleDynamicToggle = useCallback(
    (checked: boolean) => {
      if (!checked) {
        handleDisableDynamic();
        //setShowAlert(true);
        return;
      }

      if (id) {
        //Enable dynamic content
        updateElementProperty(
          id,
          "settings.contentIsDynamic",
          true,
          selectedSectionId as string
        );

        // Initialize dynamic content for all tiers
        // Check if content is an array before mapping

        if (Array.isArray(Item.content)) {
          Item.content.forEach((item) => {
            if (Array.isArray(item.content)) return null;
            if (item.type === "catItemTitle") {
              updateElementProperty(
                item.id,
                "content.metaDynamic",
                createDynamicContent(item.type, item.content.innerText),
                selectedSectionId as string
              );
            } else {
              updateElementProperty(
                item.id,
                "content.metaDynamic",
                createDynamicContent(item.type),
                selectedSectionId as string
              );
            }
          });
        }
      }
    },
    [selectedSectionId, id, createDynamicContent, updateElementProperty]
  );

  const handleDisableDynamic = useCallback(() => {
    if (id) {
      //Enable dynamic content
      updateElementProperty(
        id,
        "settings.contentIsDynamic",
        false,
        selectedSectionId as string
      );

      // Initialize dynamic content for all tiers
      // Check if content is an array before mapping

      if (Array.isArray(Item.content)) {
        Item.content.forEach((item) => {
          if (Array.isArray(item.content)) return null;
          if (item.type === "catItemTitle") {
            updateElementProperty(
              item.id,
              "content.metaDynamic",
              [],
              selectedSectionId as string
            );
          } else {
            updateElementProperty(
              item.id,
              "content.metaDynamic",
              [],
              selectedSectionId as string
            );
          }
        });
      }

      setSelectedTierId(null);
      onTierChange(null);
    }

    setShowAlert(false);
  }, [selectedSectionId, id, updateElementProperty]);

  const debouncedUpdateCardBgColor = React.useCallback(
    debounce((newColor: string) => {
      if (Item.id) {
        updateElementProperty(
          Item.id,
          "settings.smartLayout_cardBackgroundColor",
          newColor,
          selectedSectionId as string
        );
      }
    }, 300),
    [selectedSectionId, Item.id, updateElementProperty]
  );

  const handleDeleteSection = useCallback(() => {
    if (Item.id) {
      // Ensure the correct section ID is being passed for removal.
      // If this stylist is for the selectedSectionId itself:
      //removeSection(section.id);
    }
  }, [selectedSectionId, Item.id, removeSection]);

  const handleIconChange = useCallback(
    (itemId: string, iconName: string) => {
      if (itemId) {
        // Need parent section ID too if updating nested
        // Assuming updateElementProperty can handle nested updates
        // Find the parent section ID if necessary, though for smart layout, section.id should work
        updateElementProperty(
          itemId, // The ID of the layout_item being changed
          "settings.iconName",
          iconName,
          selectedSectionId as string // The ID of the smart_layout container
        );
      }
      // Note: Sheet closing is handled within IconPicker's onSelect -> handleSelect
    },
    [selectedSectionId, Item.id, updateElementProperty] // Add section.id dependency
  );

  const selectedTier = scoretiers.find(
    (tier: { id: string; name: string }) => tier.id === selectedTierId
  );
  const selectedOption = basedOnOptions.find(
    (op: { value: string; label: string }) => op.value === settings?.categoryId
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-row items-center gap-1 p-1.5 rounded-md bg-white shadow-lg border border-gray-200">
        {/* Layout Type Selector */}

        {!settings?.contentIsDynamic && (
          <>
            <div className="flex flex-row flex-nowrap items-center h-8 px-2 text-xs justify-start w-auto min-w-[120px]  ">
              <CurrentLayoutIcon className="h-3.5 w-3.5 mr-1.5 text-gray-600 shrink-0" />
              <span className="whitespace-nowrap">Dynamic Content</span>
              {/* <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 opacity-40" /> */}
              <Switch
                id="dynamic-content"
                className="h-[1.5rem] w-[2.5rem] scale-75 data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-200"
                checked={settings?.contentIsDynamic}
                onCheckedChange={handleDynamicToggle}
              />
            </div>
          </>
        )}
        {settings?.contentIsDynamic && (
          <>
            <Popover open={layoutTypeOpen} onOpenChange={setLayoutTypeOpen}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <PopoverTrigger asChild>
                    <div className="flex flex-row flex-nowrap items-center gap-x-1 h-8 px-2 text-xs justify-start w-auto min-w-[120px] max-w-full hover:bg-gray-100">
                      <CurrentLayoutIcon className="h-3.5 w-3.5  text-gray-600 shrink-0" />
                      <span className="whitespace-nowrap">
                        currently editing
                      </span>
                      {/* <ChevronsUpDown className="ml-auto h-3 w-3 shrink-0 opacity-40" /> */}
                      <span className="whitespace-nowrap">
                        {" "}
                        {selectedTier?.name}
                      </span>
                    </div>
                  </PopoverTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Change Layout Type</p>
                </TooltipContent>
              </Tooltip>
              <PopoverContent className="w-[380px] p-2">
                <>
                  <div className="pt-0 grid gap-3 mb-3">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label className="text-[0.8rem] font-medium leading-none">
                            Dynamic Content
                          </Label>
                        </div>
                      </div>
                      <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="dynamic-content"
                            className="h-[1.5rem] w-[2.5rem] scale-75 data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-gray-200"
                            checked={settings?.contentIsDynamic}
                            onCheckedChange={handleDisableDynamic}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-0 grid gap-3 mb-3">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label className="text-[0.8rem] font-medium leading-none">
                            You are currently editing
                          </Label>
                        </div>
                      </div>
                      <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
                        <div className="flex items-center space-x-2">
                          <Popover
                            open={tierSetterOpen}
                            onOpenChange={setTierSetterOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={tierSetterOpen}
                                className="w-[150px] justify-between"
                              >
                                {selectedTier?.name || "Select Tier..."}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[150px] p-0">
                              <Command>
                                <CommandList>
                                  <CommandGroup>
                                    {scoretiers.map((tier) => (
                                      <CommandItem
                                        key={tier.id}
                                        value={tier.id}
                                        onSelect={() => {
                                          setSelectedTierId(tier.id);
                                          onTierChange(tier.id);

                                          setTierSetterOpen(false);
                                        }}
                                      >
                                        {tier.name}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            selectedTierId === tier.id
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
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-0 grid gap-3">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center space-x-4">
                        <div>
                          <Label className="text-[0.8rem] font-medium leading-none">
                            Dynamic content based on
                          </Label>
                        </div>
                      </div>
                      <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
                        <div className="flex items-center space-x-2">
                          <Popover
                            open={isScoreOptionsopen}
                            onOpenChange={setIsScoreOptionsOpen}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={isScoreOptionsopen}
                                className="w-[150px] justify-between"
                              >
                                {selectedOption?.label || "Select Option..."}
                                <ChevronsUpDown className="opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[150px] p-0">
                              <Command>
                                <CommandList>
                                  <CommandGroup>
                                    {basedOnOptions.map((op) => (
                                      <CommandItem
                                        key={op.value}
                                        value={op.value}
                                        onSelect={() => {
                                          //contentBasedOnSelect(op.value);
                                          setIsScoreOptionsOpen(false);
                                        }}
                                      >
                                        {op.label}
                                        <Check
                                          className={cn(
                                            "ml-auto",
                                            settings?.categoryId === op.value
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
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              </PopoverContent>
            </Popover>
          </>
        )}

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />
        <Tooltip>
          <SheetProvider
            trigger={
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant="outline"
                  aria-label="Change icon"
                  className="text-xs justify-start h-8 px-2 w-auto rounded border-transparent hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Consider showing the current icon here or a generic icon */}
                  <SquarePen className="w-3 h-3 mr-1.5 text-gray-600 shrink-0" />
                  <span className="truncate">Edit Icon</span>
                </Toggle>
              </TooltipTrigger>
            }
            title="Pick an Icon"
            description=""
            className="sm:max-w-lg"
          >
            <IconPicker
              value={Item.settings?.iconName as string}
              onChange={(iconName) => handleIconChange(Item.id, iconName)}
            />
          </SheetProvider>

          <TooltipContent side="top">
            <p>Edit icon</p>
          </TooltipContent>
        </Tooltip>
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
              color={Item.settings?.smartLayout_cardBackgroundColor || ""}
              onChange={debouncedUpdateCardBgColor}
              className="w-full"
            />
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />

        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDeleteSection}
              className="h-7 w-7 p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Delete Layout</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default CategoryScoresItemStylist;
