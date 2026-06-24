"use client";

import React, { useEffect, useCallback, useState } from "react";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronsUpDown,
  Columns2,
  Columns3,
  ListOrdered,
  Star,
  Trash,
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
import { Switch } from "@/components/ui/switch";
import { v4 } from "uuid";
import { debounce } from "lodash";
import { ColorPicker } from "@/components/global/colorPicker";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = {
  parentSection: ElementNode;
  item: ElementNode;
  index: number;
  onTierChange: (value: string) => void;
};

const CategoryScoreStylist = ({
  parentSection,
  item,
  onTierChange,
  index,
}: Props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const {
    livemode,
    selectedSectionId,
    scoretiers,
    categories,
    updateElementProperty,
    removeSmartLayoutItem,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const { id, settings } = item;

  useEffect(() => {
    if (settings?.contentIsDynamic === true) {
      setSelectedTierId(scoretiers[0].id);
      onTierChange(scoretiers[0].id);
    }
  }, [livemode, settings?.contentIsDynamic]);

  const selectedTier = scoretiers.find((tier) => tier.id === selectedTierId);

  const dynamicData = scoretiers.map((tier) => ({
    score_tier_id: tier.id,
    tierName: tier.name,
    content: {
      title: !Array.isArray(item.content) ? item.content.title : undefined,
      description: !Array.isArray(item.content)
        ? item.content.description
        : undefined,
    },
  }));

  const handleDelete = useCallback(() => {
    if (selectedSectionId && item.id) {
      //removeSmartLayoutItem(section.id, item.id);
    }
  }, [selectedSectionId, item.id, removeSmartLayoutItem]);

  const debouncedUpdateItemBgColor = React.useCallback(
    debounce((newColor: string) => {
      if (item.id) {
        // We are updating a style property of the 'item' (which is a Section itself)
        // The 'item' is found within the 'parentSectionSection.content' array.
        // updateElementProperty is designed to find an element by its ID within the store's main 'sections' array,
        // or find a nested element if the main section ID is provided and the path points to the nested property.

        // To update item.styles.backgroundColor:
        // parentSectionSection.id is the ID of the top-level section in the store.
        // item.id is the ID of the nested element (the card) we want to change.
        // 'styles.backgroundColor' is the path to the property on the 'item' element.
        updateElementProperty(
          selectedSectionId as string, // ID of the main section in the store (e.g., the "category_scores" section)
          item.id, // ID of the catItem whose style we are changing
          "styles.backgroundColor", // Path to the property on the item
          newColor
        );
      }
    }, 300),
    [selectedSectionId, parentSection.id, item.id, updateElementProperty]
  );

  return (
    <div className="rounded-md bg-white flex flex-col items-start space-y-2 p-2 w-[200px]">
      <Label htmlFor={`itemBgColor-${item.id}`}>Card Background</Label>
      <ColorPicker
        //id={`itemBgColor-${item.id}`}
        color={(item.styles?.backgroundColor as string) || ""}
        onChange={debouncedUpdateItemBgColor}
        className="w-full"
      />
      {/* All old UI elements (Popover for layout type, Select for columns, ToggleGroup for alignment, Toggle for numbering) are removed */}
    </div>
  );
};

export default CategoryScoreStylist;
