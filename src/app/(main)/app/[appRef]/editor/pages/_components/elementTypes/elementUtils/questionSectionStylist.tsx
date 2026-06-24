"use client";

import React, { useCallback } from "react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { BarChart, ChevronDownIcon, Trash } from "lucide-react";

import {
  ElementNode,
  QuestionField,
  SectionSettings,
} from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { MdColorLens, MdInvertColors } from "react-icons/md";
import { ColorPicker } from "@/components/global/colorPicker";
import { BsCardImage } from "react-icons/bs";
import MediaPicker from "../../helpers/mediaEditor";
import { Toggle } from "@/components/ui/toggle";

type Props = { question: QuestionField; section: ElementNode | null };

const QuestionStylist = ({ question, section }: Props) => {
  if (!question || !section) return null; // Return null instead of undefined for React

  const {
    editorConfig,
    theme,
    updateSection,
    updateElementProperty,
    selectedSectionId,
    updateQuestion,
  } = usePageBuilderStore();

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

  const handleShowProgressBar = useCallback(
    (value: boolean) => {
      updateElementProperty(
        section?.id as string,
        "settings.showQuizProgressBar",
        value,
        selectedSectionId as string
      );
    },
    [selectedSectionId, section?.id, updateElementProperty]
  );

  const updateQuestionProperty = (field: string, value: string) => {
    if (!question) return;
    updateQuestion(question.id, { [field]: value });
  };

  const updateQuestionSettings = (
    field: string,
    value: string | boolean | number
  ) => {
    if (!question) return;

    const updatedSettings = {
      ...question.settings,
      [field]: value,
    };

    updateQuestion(question.id, { ["settings"]: updatedSettings });
  };

  const updateAllowMedia = (val: boolean) => {
    updateQuestionSettings("media_type", "image");
    updateQuestionSettings("show_media", val);
  };

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

  // effective colors are not used in JSX but kept for completeness
  const effectiveBackgroundColor =
    section.styles.backgroundColor || theme.colors.background.page;
  const effectiveTextColor = section.styles.color || theme.colors.text.body;

  return (
    <div className="">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart className="w-5 h-5 text-muted-foreground" />
            <Label className="text-xs">Show Progress bar</Label>
          </div>
          <Switch
            checked={section?.settings?.showQuizProgressBar}
            onCheckedChange={(val) => handleShowProgressBar(val)}
            className="h-5 w-8 [&_span]:size-4 data-[state=checked]:[&_span]:translate-x-3 data-[state=checked]:[&_span]:rtl:-translate-x-3"
          />
        </div>
        <Separator />
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
            <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-8 rounded-md ">
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
                {backgroundType === "color" && (
                  <ColorPicker
                    color={backgroundValue}
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
                <div className=" inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 h-8 rounded-md ">
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
      </div>
    </div>
  );
};

export default React.memo(QuestionStylist);
