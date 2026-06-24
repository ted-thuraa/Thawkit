"use client";
import React, { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";

import { useShallow } from "zustand/shallow";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { THEME_CLASSES, THEME_VARIABLES } from "@/lib/constants/theme";
import EmojiPickerComponent from "@/components/global/emoji-picker";

interface SingleChoiceProps {
  element: ElementNode;
  question: QuestionField | null;
  livemode: boolean;
  previewMode: boolean;
  onOptionLabelBlur: (optionId: string, newLabel: string) => void;
  onMediaChange: (
    optionId: string,
    mediaType: string,
    mediaSrc: string
  ) => void;
  onAddOption: () => void;
  onDeleteOption: (optionId: string) => void;
  /** Optional – if you want to persist description edits */
  onOptionDescriptionBlur?: (optionId: string, newDescription: string) => void;
}

const noop = () => {};

const useSingleChoiceComponentState = () =>
  usePageBuilderStore(
    useShallow((state) => ({
      livemode: state.livemode,
      previewMode: state.previewMode,
    }))
  );

const SingleChoiceComponent = ({
  element,
  question,
  livemode,
  previewMode,
  onOptionLabelBlur,
  onMediaChange,
  onAddOption,
  onDeleteOption,
  onOptionDescriptionBlur = noop,
}: SingleChoiceProps) => {
  if (!question) return null;
  // const { livemode, previewMode  } =useSingleChoiceComponentState();
  // Keep local emoji state unless you persist externally
  //const [optionEmojis, setOptionEmojis] = useState<string>({});

  // Controlled value for RadioGroup so we can style the active card border precisely
  const [value, setValue] = useState<string>(() => {
    return question?.options?.[0]?.id ?? "";
  });

  const handleEmojiUpdate = (optionId: string, emoji: string) => {
    onMediaChange(optionId, "emoji", emoji);
  };

  const getOptionsLayout = () => {
    switch (element.settings?.smart_layout_type) {
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch";
      case "row":
        return "grid grid-cols-1 gap-2";
      default:
        return "flex flex-col gap-2";
    }
  };

  // Prevent clicks inside contentEditable areas (or EmojiPicker) from selecting the radio
  const stopToggle: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={cn("w-full relative ")}>
      <RadioGroup
        className={cn(
          "w-full gap-2 relative bg-transparent",
          element.settings?.btn_style === "default" &&
            `data-[state=checked]:text-[var(--${THEME_VARIABLES.btnForeground})]`,
          element.settings?.btn_style === "outline" &&
            `data-[state=checked]:text-[var(--${THEME_VARIABLES.primary})]`,

          getOptionsLayout()
        )}
        value={value}
        onValueChange={setValue}
      >
        {question.options.map((option) => {
          const isActive = value === option.id;

          return (
            <div
              key={option.id}
              tabIndex={0}
              onClick={() => setValue(option.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl border p-3 shadow-xs outline-none transition",
                "focus-visible:ring-2 focus-visible:ring-ring",
                {
                  [THEME_CLASSES.button]:
                    element.settings?.btn_style === "default",
                  [THEME_CLASSES.buttonOutline]:
                    element.settings?.btn_style === "outline",
                },
                //THEME_CLASSES.button,
                isActive
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30"
                  : "border-input"
              )}
              style={element.styles}
            >
              <div className="flex grow items-center gap-3">
                {/* Emoji – ensure it's clickable/editable by stopping propagation */}
                {element.settings?.showIcons && (
                  <div className="relative">
                    <EmojiPickerComponent
                      emoji={option.mediaSrc || "🎟️"}
                      onEmojiSelect={(emoji: string) => {
                        handleEmojiUpdate(option.id, emoji);
                        // setOptionEmojis((prev) => ({
                        //   ...prev,
                        //   [option.id]: emoji,
                        // }));
                      }}
                    />
                  </div>
                )}

                <div className="grid grow gap-1.5">
                  {/* Label text – editable */}
                  <h3
                    //htmlFor={`${option.id}-radio`}
                    className="font-semibold text-base"
                  >
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onClick={stopToggle}
                      onMouseDown={stopToggle}
                      onBlur={(e) =>
                        onOptionLabelBlur(
                          option.id,
                          e.currentTarget.textContent || ""
                        )
                      }
                      className="inline-block min-w-6 cursor-text rounded-md px-1 outline-none hover:outline-dashed hover:outline-2 hover:outline-muted focus:outline-dashed focus:outline-2 focus:outline-muted"
                    >
                      {option.label}
                    </span>
                  </h3>

                  {/* Description – editable (persist with optional callback if provided) */}
                  {/* <p id={`${option.id}-desc`} className=" text-xs">
                    <span
                      contentEditable
                      suppressContentEditableWarning
                      onClick={stopToggle}
                      onMouseDown={stopToggle}
                      onBlur={(e) =>
                        onOptionDescriptionBlur(
                          option.id,
                          e.currentTarget.textContent || ""
                        )
                      }
                      className="inline-block cursor-text rounded px-1 outline-none hover:outline-dashed hover:outline-2 hover:outline-muted focus:outline-dashed focus:outline-2 focus:outline-muted"
                    >
                      {"You can use this card with a label and a description."}
                    </span>
                  </p> */}
                </div>
              </div>
              {/* Keep the visible radio; do NOT overlay it with an after pseudo-element */}
              <RadioGroupItem
                id={`${option.id}-radio`}
                value={option.id}
                className={`mt-0.5 data-[state=checked]:bg-[var(--${THEME_VARIABLES.btnForeground})] data-[state=checked]:border-[var(--${THEME_VARIABLES.btnForeground})]`}
                aria-describedby={`${option.id}-desc`}
              />
              {/* Delete icon – only show on hover to keep things clean */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteOption(option.id);
                }}
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Delete option"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>
          );
        })}
      </RadioGroup>
      {!livemode && !previewMode && (
        <Button
          onClick={onAddOption}
          variant="ghost"
          className="mt-4 px-[8px] py-[4px] max-w-[400px] min-h-[28px]  h-fit rounded-[6px] bg-transparent hover:bg-transparent text-[#5208db] hover:text-[#5208db]  font-semibold text-sm flex items-center justify-center"
        >
          <Plus className=" h-4 w-4" />
          Add Option
        </Button>
      )}
    </div>
  );
};

export default SingleChoiceComponent;
