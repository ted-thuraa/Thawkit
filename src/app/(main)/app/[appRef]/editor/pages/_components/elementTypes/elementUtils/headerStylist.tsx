"use client";

import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import {
  Minimize2,
  SquarePen,
  Trash,
  Maximize,
  Minimize,
  Expand,
  ImageOff,
  AlignHorizontalSpaceAround,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowDownToLine,
  ArrowDownFromLine,
  ArrowUpToLine,
  FoldVertical,
  RectangleHorizontalIcon,
  Columns2,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { ColorPicker } from "@/components/global/colorPicker";
import { Switch } from "@/components/ui/switch";
import {
  ElementNode,
  ItemsHorizontalAlignment,
  SectionLayout,
  SectionSettings,
} from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { SheetProvider } from "@/providers/sheet-provider";

type Props = { section: ElementNode };

const HeaderStylist = ({ section }: Props) => {
  const {
    selectedSectionId,
    theme,
    updateSection,
    removeSection,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const { id, content, name, className, type } = section;
  const [currentOverlayColor, setCurrentOverlayColor] = useState(
    section.settings?.overlayColor ?? ""
  );
  const [currentOverlayEffect, setCurrentOverlayEffect] = useState<
    SectionSettings["overlayEffect"]
  >(section.settings?.overlayEffect ?? "none");

  const overlayEffectOptions = [
    { value: "none", label: "None" },
    { value: "faded", label: "Faded" },
    { value: "frosted", label: "Frosted" },
  ];

  useEffect(() => {
    setCurrentOverlayColor(section.settings?.overlayColor ?? "");
    setCurrentOverlayEffect(section.settings?.overlayEffect ?? "none");
  }, [section.settings?.overlayColor, section.settings?.overlayEffect]);

  const handleOverlayColorChange = useCallback(
    (newValue: string | undefined) => {
      const valueToUpdate = newValue || ""; // Treat undefined as empty string
      setCurrentOverlayColor(valueToUpdate);
      if (section.id) {
        updateSection(section.id, {
          settings: {
            ...section.settings,
            overlayColor: valueToUpdate,
            // Ensure effect is not 'none' if color is set, default to 'faded'? Or let user choose.
            // overlayEffect: valueToUpdate && currentOverlayEffect === 'none' ? 'faded' : currentOverlayEffect,
          },
        });
      }
    },
    [section.id, updateSection, section.settings]
  );

  // New handler for overlay effect
  const handleOverlayEffectChange = useCallback(
    (value: string) => {
      // Accept string from Select
      const newEffect = value as SectionSettings["overlayEffect"]; // Cast to the specific type
      setCurrentOverlayEffect(newEffect);
      if (section.id) {
        updateSection(section.id, {
          settings: {
            ...section.settings,
            overlayEffect: newEffect,
          },
        });
      }
    },
    [section.id, updateSection, section.settings]
  );

  const handleSectionLayoutChange = useCallback(
    (newValue: SectionLayout) => {
      if (!section.id) return;

      updateSection(section.id, {
        settings: {
          ...section.settings,
          section_layout: newValue,
        },
      });
    },
    [section.id, updateSection]
  );

  const handleLogoAlignmentChange = useCallback(
    (newValue: ItemsHorizontalAlignment) => {
      if (!section.id) return;

      updateSection(section.id, {
        settings: {
          ...section.settings,
          itemsHorizontalAlignment: newValue,
        },
      });
    },
    [section.id, updateSection]
  );

  const handleFullBleedChange = useCallback(
    (checked: boolean) => {
      if (!section.id) return;

      updateSection(section.id, {
        settings: {
          ...section.settings,
          section_full_bleed: checked,
        },
      });
    },
    [section.id, updateSection]
  );

  const formSchema = z.object({
    overlayColor: z.string().optional(), // Add for overlay color picker potentially
  });
  const form = useForm<z.infer<typeof formSchema>>({
    // ... existing form setup ...
    defaultValues: {
      // ... existing defaults ...
      overlayColor: currentOverlayColor,
    },
  });

  // Effect to update form defaults
  useEffect(() => {
    form.reset({
      // ... existing resets ...
      overlayColor: currentOverlayColor,
    });
  }, [currentOverlayColor, form, theme.colors.background.page]);

  const showOverlayControls =
    section.settings?.backgroundType === "image" ||
    section.settings?.backgroundType === "video";

  // Get the effective colors (custom or theme)
  const effectiveBackgroundColor =
    section.styles.backgroundColor || theme.colors.background.page;
  const effectiveTextColor = section.styles.color || theme.colors.text.body;

  return (
    <div className="grid gap-2">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="font-semibold leading-none tracking-tight">
          Section styles
        </div>
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-2 space-y-3">
        <div className="pt-0 grid gap-3">
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-4">
              <div>
                <Label className="text-[0.8rem] font-medium leading-none">
                  Background
                </Label>
              </div>
            </div>
            <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
              <div className="flex flex-row items-center justify-between">
                <SheetProvider
                  trigger={
                    <Toggle
                      variant="outline"
                      aria-label="Toggle highlight"
                      className="border-transparent"
                    >
                      <span className="text-indigo-600">Edit</span>
                    </Toggle>
                  }
                  title="Media"
                  description="Modify image properties and settings"
                  className="sm:max-w-lg"
                >
                  <div>todo</div>
                  {/* <MediaEditor section={section} /> */}
                </SheetProvider>
              </div>
            </div>
          </div>
        </div>

        {showOverlayControls && (
          <>
            <div className="pt-0 grid gap-3">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label className="text-[0.8rem] font-medium leading-none">
                      Overlay color
                    </Label>
                  </div>
                </div>
                <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
                  <ColorPicker
                    color={currentOverlayColor}
                    onChange={handleOverlayColorChange}
                    className="w-auto h-8" // Adjust size
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-4 h-5"
                    onClick={() => handleOverlayColorChange("")} // Clear color
                    disabled={!currentOverlayColor} // Disable if no color set
                  >
                    <Trash className="text-destructive w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="pt-0 grid gap-3">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label className="text-[0.8rem] font-medium leading-none">
                      Overlay effect
                    </Label>
                  </div>
                </div>
                <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
                  <Select
                    value={currentOverlayEffect}
                    onValueChange={handleOverlayEffectChange}
                    disabled={!currentOverlayColor} // Disable effect if no color is set
                  >
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue placeholder="Select effect" />
                    </SelectTrigger>
                    <SelectContent>
                      {overlayEffectOptions.map((option) => (
                        <SelectItem
                          key={option.value}
                          value={option.value}
                          className="text-xs"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pt-0 grid gap-3">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div>
                <Label className="text-[0.8rem] font-medium leading-none">
                  Section layout
                </Label>
              </div>
            </div>
            <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
              <div className="col-span-1 h-8 w-full flex flex-row items-center gap-x-2">
                <ToggleGroup
                  type="single"
                  defaultValue=""
                  value={section.settings?.section_layout || "block"}
                  onValueChange={handleSectionLayoutChange}
                >
                  <ToggleGroupItem value="block" aria-label="Toggle bold">
                    <RectangleHorizontalIcon className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="2_columns" aria-label="Toggle italic">
                    <Columns2 className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
        {section.settings?.section_layout === "block" && (
          <>
            <div className="pt-0 grid gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div>
                    <Label className="text-[0.8rem] font-medium leading-none">
                      Logo alignment
                    </Label>
                  </div>
                </div>
                <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md">
                  <div className="col-span-1 h-8 w-full flex flex-row items-center gap-x-2">
                    <ToggleGroup
                      type="single"
                      defaultValue=""
                      value={
                        section.settings?.itemsHorizontalAlignment ||
                        "flex-start"
                      }
                      onValueChange={handleLogoAlignmentChange}
                    >
                      <ToggleGroupItem
                        value="flex-start"
                        aria-label="Toggle bold"
                      >
                        <AlignLeft className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="center"
                        aria-label="Toggle italic"
                      >
                        <AlignCenter className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value="flex-end"
                        aria-label="Toggle underline"
                      >
                        <AlignRight className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="pt-0 grid gap-3">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div>
                <Label className="text-[0.8rem] font-medium leading-none">
                  Section width
                </Label>
              </div>
            </div>
            <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
              <div className="col-span-1 h-8 w-full flex flex-row items-center gap-x-2">
                <ToggleGroup type="single" defaultValue="" value={"medium"}>
                  <ToggleGroupItem value="medium" aria-label="solid">
                    <span>M</span>
                  </ToggleGroupItem>
                  <ToggleGroupItem value="large" aria-label="outline">
                    <span>L</span>
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
        <div className="pt-0 grid gap-3">
          <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
              <div>
                <Label className="text-[0.8rem] font-medium leading-none">
                  Full Bleed (Edge-to-Edge)
                </Label>
              </div>
            </div>
            <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
              <div className="flex items-center space-x-2">
                <Switch
                  id="section_full_bleed"
                  className="w-8 h-4"
                  checked={section.settings?.section_full_bleed ?? false}
                  onCheckedChange={handleFullBleedChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add reset buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          //onClick={() => handleStyleChange("backgroundColor", "")}
        >
          Reset Background
        </Button>
        <Button
          variant="outline"
          size="sm"
          //onClick={() => handleStyleChange("color", "")}
        >
          Reset Text
        </Button>
      </div>
    </div>
  );
};

export default HeaderStylist;
