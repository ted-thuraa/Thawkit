import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import MediaPicker from "../helpers/mediaEditor";
import { ElementNode, QuestionField } from "@/stores/pageEditorStore/types";
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
  workspaceId: string;
}

const ImageChoiceComponent = ({
  element,
  question,
  livemode,
  previewMode,
  onOptionLabelBlur,
  onMediaChange,
  onAddOption,
  onDeleteOption,
  workspaceId,
}: SingleChoiceProps) => {
  if (!question) return null;
  const [optionEmojis, setOptionEmojis] = useState<{ [key: string]: string }>(
    {}
  );

  const handleMediaUpdate = (optionId: string, img: string) => {
    onMediaChange(optionId, "image", img);
  };

  // Controlled value for RadioGroup so we can style the active card border precisely
  const [value, setValue] = useState<string>(() => {
    return question?.options?.[0]?.id ?? "";
  });

  // Prevent clicks inside contentEditable areas (or EmojiPicker) from selecting the radio
  const stopToggle: React.MouseEventHandler<HTMLElement> = (e) => {
    e.stopPropagation();
  };
  return (
    <div className={cn("w-full relative ")}>
      <RadioGroup
        className={cn(
          "w-full gap-x-3 relative flex flex-col md:flex-row md:flex-wrap items-center justify-center"
        )}
        value={value}
        onValueChange={setValue}
      >
        {question.options.map((option) => {
          const isActive = value === option.id;

          return (
            <div
              key={option.id}
              role="button"
              tabIndex={0}
              onClick={() => setValue(option.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setValue(option.id);
                }
              }}
              className={cn(
                "group relative block max-w-[18rem] w-full items-start gap-3 rounded-xl border p-4 shadow-xs outline-none transition",
                "focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-input"
              )}
            >
              <div className="rounded-lg shadow-sm ">
                <MediaPicker
                  workspaceId={workspaceId}
                  mediaType={option.mediaType}
                  mediaSource={"upload"}
                  mediaSrc={option.mediaSrc as string}
                  mediaOptions={"image_only"}
                  onMediaChange={(newSrc) =>
                    handleMediaUpdate(option.id, newSrc)
                  }
                  editorTrigger={
                    <div className="group/img relative">
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/img:opacity-100 rounded-md z-[100]">
                        <Pencil className="h-4 w-4 text-white" />
                      </div>
                      <Image
                        src={option.mediaSrc || "/assets/imageplaceholder.svg"}
                        width={382}
                        height={216}
                        alt="image"
                        style={{
                          borderRadius: "8px",
                          objectFit: "cover",
                        }}
                        className="w-full"
                      />
                    </div>
                  }
                />
              </div>
              <div className="mt-4  flex w-full items-center flex-row flex-nowrap">
                {/* Keep the visible radio; do NOT overlay it with an after pseudo-element */}
                <RadioGroupItem
                  id={`${option.id}-radio`}
                  value={option.id}
                  className="mt-0.5"
                  aria-describedby={`${option.id}-desc`}
                />

                <div className="ml-2 flex grow items-start gap-3">
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
                    {/* <p
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
                      </p> */}
                  </div>
                </div>
              </div>

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

export default ImageChoiceComponent;
