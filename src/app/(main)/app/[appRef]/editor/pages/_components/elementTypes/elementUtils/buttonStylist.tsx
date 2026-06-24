"use client";

import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import {
  AlignJustify,
  Check,
  ChevronsUpDown,
  Link2,
  MousePointerClick,
  Palette,
  X,
} from "lucide-react";

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
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  RectangleHorizontal,
  Trash,
} from "lucide-react";
import { ColorPicker } from "@/components/global/colorPicker";
import { debounce } from "lodash";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { btns, ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { getAccessibleTextColor } from "@/lib/utils/colors";

type Props = { section: ElementNode; btn: ElementNode; index: number };

const ButtonStylist = ({ section, btn, index }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const {
    livemode,
    previewMode,
    sections,
    theme,
    updateSection,
    selectedSectionId,
    updateElementProperty,
    removeSmartLayoutItem,
    removeSection,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  //const { id, content, name, className, type } = section;
  const [buttonText, setButtonText] = useState(
    !Array.isArray(btn.content) ? (btn.content?.innerText as string) : ""
  );

  const [currentBackgroundSource, setCurrentBackgroundSource] = useState(
    btn.styles?.backgroundColor ?? ""
  );

  // Effect to sync local state if global state changes
  useEffect(() => {
    if (!Array.isArray(btn.content)) {
      setButtonText(btn.content?.innerText || "");
    }
  }, [btn.content]);

  useEffect(() => {
    setCurrentBackgroundSource(btn.styles?.backgroundColor ?? "");
  }, [btn.styles?.backgroundColor]);

  const handleBtnTextUpdate = debounce((btn_Id: string, value: string) => {
    if (btn_Id && !previewMode) {
      updateElementProperty(
        btn_Id,
        "content.innerText",
        value,
        selectedSectionId as string
      );
    }
    return;
  }, 300);

  const handleBtnStyle = useCallback(
    (value: btns) => {
      if (btn.id) {
        updateElementProperty(btn.id, "settings.btn_style", value);
      }
    },
    [btn.id, updateElementProperty]
  );

  const handleBtnActionChange = useCallback(
    (value: string) => {
      if (btn.id) {
        if (value === "go_to_questions") {
          updateElementProperty(btn.id, "settings.btn_action", value);
          updateElementProperty(btn.id, "content.href", "/questions");
        } else {
          updateElementProperty(btn.id, "settings.btn_action", value);
          updateElementProperty(btn.id, "content.href", "");
        }
      }
    },
    [selectedSectionId, btn.id, updateElementProperty]
  );

  const handleBackgroundSourceChange = useCallback(
    (newValue: string | undefined) => {
      const valueToUpdate = newValue || "";
      //const textColorOptions = ["#FFFFFF", "#000000"]; // Common accessible choices
      //const accessibleBtnForeground = getAccessibleTextColor(
      //  valueToUpdate,
      //  textColorOptions,
      //  4.5
      //); // AA contrast for buttons is fine

      setCurrentBackgroundSource(valueToUpdate); // Update local state immediately
      if (btn.id) {
        updateElementProperty(btn.id, "styles.backgroundColor", newValue);
        updateElementProperty(btn.id, "styles.color", "");
      }
    },
    [selectedSectionId, btn.id, updateElementProperty]
  );

  const handleLinkChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log(event.target.value);
      if (btn.id) {
        updateElementProperty(btn.id, "content.href", event.target.value);
      }
    },
    [selectedSectionId, btn.id, updateElementProperty]
  );

  const handleLinkToSection = React.useCallback(
    (newValue: string) => {
      if (btn.id) {
        updateElementProperty(btn.id, "content.href", newValue);
      }
      setIsOpen(false);
    },
    [selectedSectionId, btn.id, updateElementProperty]
  );

  const handleDelete = useCallback(() => {
    if (btn.id && section.id) {
      removeSmartLayoutItem(section.id, btn.id, selectedSectionId as string);
    }
  }, [selectedSectionId, section.id, btn.id, removeSmartLayoutItem]);

  if (Array.isArray(btn.content)) return null;
  return (
    <>
      <div className=" space-y-4 bg-white text-card-foreground  w-full ">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MousePointerClick className="w-4 h-4 text-muted-foreground" />
              <Label className="text-xs">Button action</Label>
            </div>
            <Select
              value={btn.settings?.btn_action || "go_to_questions"}
              onValueChange={handleBtnActionChange}
            >
              <SelectTrigger className="w-[120px] h-8">
                <SelectValue placeholder="go_to_questions" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Actions</SelectLabel>
                  <SelectItem value="go_to_questions">
                    Go to questions
                  </SelectItem>
                  <SelectItem value="open_lead_form">Open lead form</SelectItem>
                  <SelectItem value="go_to_section">Go to section</SelectItem>
                  <SelectItem value="open_link">Open external link</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          {btn.settings?.btn_action === "open_link" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <Label className="text-xs">Link</Label>
              </div>
              <Input
                id="link"
                value={
                  !Array.isArray(btn.content)
                    ? (btn.content?.href as string)
                    : ""
                }
                onChange={handleLinkChange}
                defaultValue="http://localhost:3000"
                className="w-40 h-8"
              />
            </div>
          )}
          {btn.settings?.btn_action === "go_to_section" && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex items-center justify-center w-5 h-5 border rounded-sm">
                  <span className="text-xs font-bold">12</span>
                </div>
                <Label className="text-xs">Section</Label>
              </div>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={isOpen}
                    className="w-40 h-8 justify-between overflow-hidden"
                  >
                    {btn.content.href ? btn.content.href : "Select section..."}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                      <CommandEmpty>No framework found.</CommandEmpty>
                      <CommandGroup>
                        {sections.map((section) => (
                          <CommandItem
                            key={section.id}
                            value={section.id}
                            onSelect={handleLinkToSection}
                          >
                            {section.id}
                            <Check
                              className={cn(
                                "ml-auto",
                                !Array.isArray(btn.content) &&
                                  btn.content.href === section.id
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
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlignJustify className="w-4 h-4 text-muted-foreground" />
              <Label className="text-xs">Style</Label>
            </div>
            <ToggleGroup
              type="single"
              size="sm"
              //defaultValue={section.styles?.horizontalAlignment || "center"}
              defaultValue=""
              value={btn.settings?.btn_style || "default"}
              onValueChange={handleBtnStyle}
            >
              <ToggleGroupItem value="default" aria-label="solid">
                <RectangleHorizontal className="w-4 h-4 fill-gray-900" />
              </ToggleGroupItem>
              <ToggleGroupItem value="outline" aria-label="outline">
                <RectangleHorizontal className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <Label className="text-xs"> Color</Label>
            </div>
            <div>
              <ColorPicker
                color={currentBackgroundSource || theme.colors.palette.primary} // Use theme default if source is empty
                onChange={handleBackgroundSourceChange}
                className="w-40 h-8"
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="w-full flex items-center justify-center">
          <div className="flex items-center  text-red-500">
            <button
              onClick={handleDelete}
              className="p-1 hover:bg-gray-100 rounded-md"
            >
              <Trash className="w-4 h-4 " />
            </button>
            <Label>Delete</Label>
          </div>
        </div>
      </div>
    </>
  );
};

export default ButtonStylist;
