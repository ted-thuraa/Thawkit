"use client";
import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
import EmojiPickerComponent from "@/components/global/emoji-picker";

interface MultipleChoiceProps {
  element: ElementNode;
  question: QuestionField | null;
  livemode: boolean;
  previewMode: boolean;
  onOptionLabelBlur: (optionId: string, newLabel: string) => void;
  onAddOption: () => void;
  onDeleteOption: (optionId: string) => void;
  onOptionDescriptionBlur?: (optionId: string, newDescription: string) => void;
}

const noop = () => {};

const MultipleChoiceComponent = ({
  element,
  question,
  livemode,
  previewMode,
  onOptionLabelBlur,
  onAddOption,
  onDeleteOption,
  onOptionDescriptionBlur = noop,
}: MultipleChoiceProps) => {
  if (!question) return null;
  const [optionEmojis, setOptionEmojis] = useState<{ [key: string]: string }>(
    {}
  );
  const [value, setValue] = useState<string>(() => {
    return question?.options?.[0]?.id ?? "";
  });

  const getOptionsLayout = () => {
    switch (question.settings?.optionsLayout) {
      case "grid":
        return "grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch";
      case "column":
        return "grid grid-cols-1 gap-2";
      default:
        return "flex flex-col gap-2";
    }
  };

  // Prevent clicks inside contentEditable areas (or EmojiPickerComponent) from selecting the radio
  const stopToggle: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={cn("w-full relative  max-w-2xl", getOptionsLayout())}>
      {question.options.map((option) => (
        <div className="flex items-center p-4 rounded-[18px] shadow-soft cursor-pointer transition border-input has-data-[state=checked]:border-primary/50 relative  w-full  gap-2 border shadow-xs outline-none">
          <Checkbox
            id={option.id}
            className="order-1 after:absolute after:inset-0"
            aria-describedby={`${option.id}-description`}
          />
          <div className="p-2 mr-4 rounded-xl bg-[#34363B] text-white">
            <div onClick={stopToggle} onMouseDown={stopToggle}>
              <EmojiPickerComponent
                emoji={optionEmojis[option.id] || "🎟️"}
                onEmojiSelect={(emoji: string) => {
                  setOptionEmojis((prev) => ({
                    ...prev,
                    [option.id]: emoji,
                  }));
                }}
              />
            </div>
          </div>
          <div className="flex flex-col">
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
            <p
              id={`${option.id}-desc`}
              className="text-muted-foreground text-xs"
            >
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
            </p>
          </div>

          {/* Delete icon – only show on hover to keep things clean */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteOption(option.id);
            }}
            className="absolute bg-destructive text-destructive-foreground right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Delete option"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      {!livemode && !previewMode && (
        <Button
          onClick={onAddOption}
          variant="default"
          className="mt-4 px-[8px] py-[4px] max-w-[400px] min-h-[28px]  h-fit rounded-[6px] bg-transparent hover:bg-transparent text-[#5208db] hover:text-[#5208db]  font-semibold text-sm flex items-center justify-center"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Option
        </Button>
      )}
    </div>
  );
};

export default MultipleChoiceComponent;
