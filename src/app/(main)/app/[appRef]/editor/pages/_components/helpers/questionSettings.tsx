"use client";

import * as React from "react";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Separator } from "@/components/ui/separator";
import { Field } from "@/components/ui/field";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "@/components/ui/number-field";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  HelpCircle,
  Shuffle,
  AlignLeft,
  AlignRight,
  AlignJustify,
  Image,
  ChevronDownIcon,
  ChevronsLeftRightEllipsis,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { QuestionField, Quiztypes } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { question: QuestionField };

const QuestionSettingsEditor = ({ question }: Props) => {
  const { updateQuestion } = usePageBuilderStore();

  if (!question) return null;

  const updateQuestionProperty = (field: keyof QuestionField, value: any) => {
    updateQuestion(question.id, { [field]: value });
  };

  const updateQuestionSettings = (field: string, value: any) => {
    if (!question.settings) return;

    const updatedSettings = { ...question.settings, [field]: value };
    updateQuestion(question.id, { settings: updatedSettings });
  };

  const updateNestedRangeLabel = (
    position: "left" | "center" | "right",
    value: string
  ) => {
    const current = question.settings?.rangeLabels ?? {
      left: "",
      center: "",
      right: "",
    };
    updateQuestionSettings("rangeLabels", {
      ...current,
      [position]: value,
    });
  };

  const updateAllowMedia = (val: boolean) => {
    updateQuestionSettings("show_media", val);
    if (val && !question.settings?.media_type) {
      updateQuestionSettings("media_type", "image");
    }
  };

  const settings = question.settings ?? {};

  return (
    <div className="space-y-4">
      {/* Quiz Type */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <HelpCircle className="w-5 h-5 text-muted-foreground" />
          <Label className="text-xs">Quiz Type</Label>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {Quiztypes.find((t) => t.type === question.type)?.name}
              <ChevronDownIcon
                className="-me-1 opacity-60"
                size={16}
                aria-hidden="true"
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value={question.type}
              onValueChange={(val) => updateQuestionProperty("type", val)}
            >
              {Quiztypes.map((type, index) => (
                <DropdownMenuRadioItem key={index} value={type.type as string}>
                  {type.name}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Required */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          <Label className="text-xs">Required</Label>
        </div>
        <Switch
          checked={settings.required}
          onCheckedChange={(val) => updateQuestionSettings("required", val)}
          className="w-8"
        />
      </div>

      {/* Show Description */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-5 h-5 text-muted-foreground" />
          <Label className="text-xs">Show Description</Label>
        </div>
        <Switch
          checked={settings.show_instruction}
          onCheckedChange={(val) =>
            updateQuestionSettings("show_instruction", val)
          }
          className="w-8"
        />
      </div>

      {/* TEXT Question Only */}
      {question.type === "TEXT" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlignLeft className="w-5 h-5 text-muted-foreground" />
            <Label className="text-xs">Enable multiple lines</Label>
          </div>
          <Switch
            checked={settings.multiple_line_text_input}
            onCheckedChange={(val) =>
              updateQuestionSettings("multiple_line_text_input", val)
            }
            className="w-8"
          />
        </div>
      )}

      {/* Randomize Answers */}
      {question.type !== "TEXT" && question.type !== "RANGE" && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shuffle className="w-5 h-5 text-muted-foreground" />
            <Label className="text-xs">Randomize answers order</Label>
          </div>
          <Switch
            checked={settings.randomize_answers}
            onCheckedChange={(val) =>
              updateQuestionSettings("randomize_answers", val)
            }
            className="w-8"
          />
        </div>
      )}

      {/* RANGE Question */}
      {question.type === "RANGE" && (
        <>
          {/* Score Range */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChevronsLeftRightEllipsis className="w-5 h-5 text-muted-foreground" />
              <Label className="text-xs">Score Range</Label>
            </div>
            <div className="flex flex-row items-center">
              <Field>
                <NumberField
                  value={settings.rangeMin ?? 0}
                  min={0}
                  max={100}
                  size="sm"
                  onValueChange={(val) =>
                    updateQuestionSettings("rangeMin", Number(val))
                  }
                  className="w-16"
                >
                  <NumberFieldGroup>
                    <NumberFieldDecrement iconSize={12} />
                    <NumberFieldInput />
                    <NumberFieldIncrement iconSize={12} />
                  </NumberFieldGroup>
                </NumberField>
              </Field>
              <span className="mx-2 text-sm">to</span>
              <Field>
                <NumberField
                  value={settings.rangeMax ?? 10}
                  min={1}
                  max={50}
                  size="sm"
                  onValueChange={(val) =>
                    updateQuestionSettings("rangeMax", Number(val))
                  }
                  className="w-16"
                >
                  <NumberFieldGroup>
                    <NumberFieldDecrement iconSize={12} />
                    <NumberFieldInput />
                    <NumberFieldIncrement iconSize={12} />
                  </NumberFieldGroup>
                </NumberField>
              </Field>
            </div>
          </div>

          {/* Starting Value */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ChevronsLeftRightEllipsis className="w-5 h-5 text-muted-foreground" />
              <Label className="text-xs">Starting Score</Label>
            </div>
            <Field>
              <NumberField
                value={settings.startingValue ?? 1}
                min={settings.rangeMin ?? 1}
                max={settings.rangeMax ?? 100}
                size="sm"
                onValueChange={(val) =>
                  updateQuestionSettings("startingValue", Number(val))
                }
                className="w-16"
              >
                <NumberFieldGroup>
                  <NumberFieldDecrement iconSize={12} />
                  <NumberFieldInput />
                  <NumberFieldIncrement iconSize={12} />
                </NumberFieldGroup>
              </NumberField>
            </Field>
          </div>

          <Separator />

          {/* Show Labels */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <Label className="text-xs">Show Labels</Label>
            </div>
            <Switch
              checked={settings.showLabels}
              onCheckedChange={(val) =>
                updateQuestionSettings("showLabels", val)
              }
              className="w-8"
            />
          </div>

          {/* Range Labels */}
          {settings.showLabels && (
            <>
              <div className="mt-2">
                <h3 className="font-bold text-base">Labels</h3>
              </div>
              <div className="grid gap-2">
                {(["left", "center", "right"] as const).map((pos) => (
                  <div
                    key={pos}
                    className="grid grid-cols-3 items-center gap-4"
                  >
                    <Label className="text-xs capitalize">{pos}</Label>
                    <Input
                      type="text"
                      value={settings.rangeLabels?.[pos] ?? ""}
                      placeholder={`Enter ${pos} label`}
                      onChange={(e) =>
                        updateNestedRangeLabel(pos, e.target.value)
                      }
                      className="col-span-2 h-8"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <Separator />

      {/* Media Settings */}
      <div className="mb-2">
        <h3 className="font-bold text-base">Media</h3>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image className="w-5 h-5 text-muted-foreground" />
          <Label className="text-xs">Image or Video</Label>
        </div>
        <Switch
          checked={settings.show_media}
          onCheckedChange={(val) => updateAllowMedia(val)}
        />
      </div>

      {settings.show_media && (
        <>
          {/* Media Type */}
          <div className="flex items-center justify-between">
            <Label className="text-xs">Media Type</Label>
            <Select
              value={settings.media_type ?? "image"}
              onValueChange={(val) => updateQuestionSettings("media_type", val)}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Media Placement */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlignJustify className="w-5 h-5 text-muted-foreground" />
              <Label className="text-xs">Media Placement</Label>
            </div>
            <ToggleGroup
              type="single"
              size="sm"
              value={settings.media_position}
              onValueChange={(val) =>
                updateQuestionSettings("media_position", val)
              }
            >
              <ToggleGroupItem value="left" aria-label="Left">
                <AlignLeft className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Right">
                <AlignRight className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </>
      )}
    </div>
  );
};

export default React.memo(QuestionSettingsEditor);
