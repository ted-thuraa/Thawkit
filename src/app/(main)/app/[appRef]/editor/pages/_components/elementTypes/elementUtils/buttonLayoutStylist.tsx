"use client";

import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
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
import { debounce } from "lodash";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { section: ElementNode };

const ButtonLayoutStylist = ({ section }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [layoutTypeOpen, setLayoutTypeOpen] = React.useState(false);

  const {
    livemode,
    previewMode,

    updateElementProperty,
  } = usePageBuilderStore();
  const { id, content, name, className, type } = section;

  const handleAlignmentChange = useCallback(
    (value: string) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.itemsHorizontalAlignment",
          value
        );
      }
    },
    [section.id, updateElementProperty]
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-row items-center gap-1 p-1.5 rounded-md bg-white shadow-lg border border-gray-200">
        <>
          <ToggleGroup
            type="single"
            size="sm"
            value={section.settings?.itemsHorizontalAlignment || "flex-start"}
            onValueChange={handleAlignmentChange}
            aria-label="Text Alignment"
            className="flex items-center gap-0.5"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="flex-start" aria-label="Left align">
                  <AlignLeft className="w-4 h-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Align Left</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="center" aria-label="Center align">
                  <AlignCenter className="w-4 h-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Align Center</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <ToggleGroupItem value="flex-end" aria-label="Right align">
                  <AlignRight className="w-4 h-4" />
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Align Right</p>
              </TooltipContent>
            </Tooltip>
          </ToggleGroup>
        </>
      </div>
    </TooltipProvider>
  );
};

export default ButtonLayoutStylist;
