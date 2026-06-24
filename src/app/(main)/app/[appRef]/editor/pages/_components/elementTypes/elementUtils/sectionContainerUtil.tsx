"use client";

import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Separator } from "@/components/ui/separator";

import {
  Minimize2,
  SquarePen,
  Trash,
  ArrowDownToLine,
  ArrowDownFromLine,
  ArrowUpToLine,
  FoldVertical,
  RectangleHorizontalIcon,
  Columns2,
  X,
  RotateCcw,
  ChevronDownIcon,
  Plus,
  TextAlignJustifyIcon,
} from "lucide-react";
import { BsCardImage } from "react-icons/bs";
import { MdInvertColors } from "react-icons/md";
import { MdColorLens } from "react-icons/md";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import MediaPicker from "../../helpers/mediaEditor";
import { ElementNode, SectionSettings } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { section: ElementNode };

const SectionStylist = ({ section }: Props) => {
  const {
    selectedSectionId,
    theme,
    projectData,
    editorConfig,
    updateSection,
    removeSection,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const { id, content, name, className, type } = section;
  // --- Read values directly from props (store state) ---
  const backgroundType = section.settings?.backgroundType ?? "color";
  const backgroundSource = section.settings?.backgroundSource ?? "upload";
  const backgroundValue = section.settings?.backgroundValue ?? "";
  const overlayColor = section.settings?.overlayColor ?? "";
  const overlayEffect = section.settings?.overlayEffect ?? "none";

  const bgIsMedia = backgroundType === "image" || backgroundType === "video";
  // ---------------------------------------------------

  const overlayEffectOptions = [
    { value: "none", label: "None" },
    { value: "faded", label: "Faded" },
    { value: "frosted", label: "Frosted" },
  ];

  const handleOverlayColorChange = useCallback(
    (newValue: string | undefined) => {
      const valueToUpdate = newValue || "";
      if (section.id) {
        updateSection(section.id, {
          settings: {
            ...section.settings,
            overlayColor: valueToUpdate,
          },
        });
      }
    },
    [section.id, updateSection, section.settings]
  );

  const handleOverlayEffectChange = useCallback(
    (value: string) => {
      const newEffect = value as SectionSettings["overlayEffect"];
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

  const handleContentAlignmentChange = useCallback(
    (newValue: SectionSettings["itemsVerticalAlignment"]) => {
      if (!section.id) return;

      updateSection(section.id, {
        settings: {
          ...section.settings,
          itemsVerticalAlignment: newValue,
        },
      });
    },
    [selectedSectionId, section.id, updateSection]
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

  const handleBackgroundValueChange = useCallback(
    (value: string) => {
      if (section.id) {
        updateSection(section.id, {
          settings: {
            ...section.settings,
            backgroundValue: value,
          },
        });
      }
    },
    [section.id, updateSection, section.settings]
  );

  const handleBackgroundTypeChange = useCallback(
    (newValue: SectionSettings["backgroundType"]) => {
      if (section.id) {
        updateSection(section.id, {
          settings: {
            ...section.settings,
            backgroundType: newValue,
          },
        });
      }
    },
    [section.id, updateSection, section.settings]
  );

  const handleBackgroundSourceChange = useCallback(
    (newValue: SectionSettings["backgroundSource"]) => {
      if (newValue && section.id) {
        updateSection(section.id, {
          settings: {
            ...section.settings,
            backgroundSource: newValue,
          },
        });
      }
    },
    [section.id, updateSection, section.settings]
  );

  const handleResetEverything = useCallback(() => {
    // Clear all values by setting them to initial/default values in the store
    handleOverlayColorChange("");
    handleOverlayEffectChange("none");
    handleBackgroundValueChange("");
    handleBackgroundTypeChange("color");
    handleBackgroundSourceChange("upload");
  }, [
    handleOverlayColorChange,
    handleOverlayEffectChange,
    handleBackgroundValueChange,
    handleBackgroundTypeChange,
    handleBackgroundSourceChange,
  ]);

  const effectiveBackgroundColor =
    section.styles.backgroundColor || theme.colors.background.page;
  const effectiveTextColor = section.styles.color || theme.colors.text.body;

  return (
    <div className="grid gap-2">
      <div className="w-full flex flex-row items-center justify-between">
        <div className="text-[14px] font-semibold">
          <span>Section Appearance</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className=""
          //onClick={() => setOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {/* <div className="w-full flex flex-row items-center justify-start overflow-hidden">
        <div className="text-[12px] font-semibold">
          <span>Section Appearance</span>
        </div>
      </div> */}

      <div className="p-2 space-y-3">
        <div className="pt-0 grid gap-3">
          <div className="flex items-center justify-between ">
            <div className="flex items-center space-x-2">
              <div>
                <BsCardImage className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[12px] font-medium leading-none">
                  Background
                </span>
              </div>
            </div>
            <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0  h-8 rounded-md ">
              <div className="flex flex-row items-center gap-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size={"sm"}
                      className="rounded-lg px-2 py-1 h-8 text-sm "
                    >
                      {backgroundType}
                      <ChevronDownIcon
                        className="-me-1 opacity-60"
                        size={16}
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuRadioGroup
                      value={backgroundType}
                      onValueChange={(val) =>
                        handleBackgroundTypeChange(
                          val as SectionSettings["backgroundType"]
                        )
                      }
                    >
                      <DropdownMenuRadioItem value="color">
                        Color
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="image">
                        Image
                      </DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="video">
                        Video
                      </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                {backgroundType == "color" && (
                  <ColorPicker
                    color={backgroundValue || ""}
                    // color={
                    //   currentBackgroundSource || theme.colors.background.page
                    // }
                    onChange={handleBackgroundValueChange}
                    size="sm"
                    className="w-8 h-8 bg-editor-background border border-editor-border" // Adjust size
                  />
                )}
                {bgIsMedia && (
                  <MediaPicker
                    organizationId={editorConfig?.organizationId as string}
                    mediaType={backgroundType}
                    mediaSource={backgroundSource}
                    mediaSrc={backgroundValue}
                    mediaOptions={"All"}
                    onMediaChange={handleBackgroundValueChange}
                    onMediaTypeChange={handleBackgroundTypeChange}
                    onMediaSourceChange={handleBackgroundSourceChange}
                    editorTrigger={
                      <Toggle
                        variant="outline"
                        aria-label="Toggle highlight"
                        className="border-transparent hover:bg-transparent shadow-none ring-0 focus:ring-0 data-[state=open]:bg-transparent data-[state=open]:shadow-none"
                      >
                        <span className="text-indigo-600 font-medium">
                          Edit
                        </span>
                      </Toggle>
                    }
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {bgIsMedia && (
          <>
            <div className="pt-0 grid gap-3">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <MdColorLens className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium leading-none">
                      Overlay color
                    </span>
                  </div>
                </div>
                <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0  h-8 rounded-md ">
                  <ColorPicker
                    color={overlayColor}
                    onChange={handleOverlayColorChange}
                    size="sm"
                    className="w-8 h-8 bg-editor-background border border-editor-border"
                  />
                  {overlayColor && overlayColor !== "" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-4 h-5"
                      onClick={() => handleOverlayColorChange("")} // Clear color
                      disabled={!overlayColor} // Disable if no color set
                    >
                      <Trash className="text-destructive w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <div className="pt-0 grid gap-3">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <div>
                    <MdInvertColors className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[12px] font-medium leading-none">
                      Overlay effect
                    </span>
                  </div>
                </div>
                <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md ">
                  <Select
                    value={overlayEffect}
                    onValueChange={handleOverlayEffectChange}
                    disabled={!overlayColor} // Disable effect if no color is set
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div>
                <TextAlignJustifyIcon className="w-4 h-4" />
              </div>
              <div className=" truncate">
                <span className="text-[12px] font-medium leading-none">
                  Content alignment
                </span>
              </div>
            </div>
            <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 shadow-sm h-8 rounded-md">
              <div className="col-span-1 h-8 w-full flex flex-row items-center gap-x-2">
                <ToggleGroup
                  type="single"
                  defaultValue=""
                  value={
                    section.settings?.itemsVerticalAlignment || "flex-start"
                  }
                  onValueChange={(val) =>
                    handleContentAlignmentChange(
                      val as SectionSettings["itemsVerticalAlignment"]
                    )
                  }
                  variant="outline"
                  className="inline-flex"
                >
                  <ToggleGroupItem
                    value="flex-start"
                    aria-label="Toggle bold"
                    size="sm"
                  >
                    <ArrowUpToLine className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="center"
                    aria-label="Toggle italic"
                    size="sm"
                  >
                    <FoldVertical className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="flex-end"
                    aria-label="Toggle underline"
                    size="sm"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add reset buttons */}
      <div className="w-full flex justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleResetEverything()}
          className="hover:bg-transparent text-indigo-600 hover:text-indigo-700"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Styles</span>
        </Button>
      </div>
    </div>
  );
};

export default SectionStylist;
