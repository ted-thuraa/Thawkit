"use client";

import React, { useState, memo, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { ElementNode, MetaDynamicData } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = {
  element: ElementNode;
  selectedTierId: string | null;
  onTierChange: (value: string | null) => void;
};

const TextStylist = ({ element, selectedTierId, onTierChange }: Props) => {
  const [openBasedOn, setOpenBasedOn] = useState(false);
  const [openTier, setOpenTier] = useState(false);
  const [showDisableAlert, setShowDisableAlert] = useState(false);

  const { categories, scoretiers, selectedSectionId, updateElementProperty } =
    usePageBuilderStore();

  const { id, settings } = element;

  // Memoize options to prevent unnecessary re-renders
  const basedOnOptions = useMemo(
    () => [
      { value: "overall_score", label: "Overall score" },
      ...categories.map((cat) => ({
        value: cat.id as string,
        label: cat.title as string,
      })),
    ],
    [categories]
  );

  // --- ACTIONS ---

  const handleBasedOnChange = (val: string) => {
    if (!id) return;
    // 1. Update the "Based On" flag
    updateElementProperty(
      id,
      "settings.content_Dynamic_Based_On",
      val === "overall_score" ? "overall_score" : "category_score",
      selectedSectionId as string
    );

    // 2. Update the Category ID reference
    updateElementProperty(
      id,
      "settings.categoryId",
      val,
      selectedSectionId as string
    );
  };

  const enableDynamicContent = () => {
    if (!id || scoretiers.length === 0) return;

    const initialText = !Array.isArray(element.content)
      ? element.content.innerText || ""
      : "";

    // Generate initial structure for ALL tiers based on current content
    const newMetaDynamic: MetaDynamicData[] = scoretiers.map((tier) => ({
      score_tier_id: tier.id,
      tierName: tier.name,
      content: {
        innerText: initialText, // Copy current text to all tiers as a starting point
      },
    }));

    // Batch Updates:
    // 1. Enable Flag
    updateElementProperty(
      id,
      "settings.contentIsDynamic",
      true,
      selectedSectionId as string
    );
    // 2. Set Data Structure
    updateElementProperty(
      id,
      "content.metaDynamic",
      newMetaDynamic,
      selectedSectionId as string
    );
    // 3. Set Default "Based On" if missing
    if (!settings?.content_Dynamic_Based_On) {
      handleBasedOnChange("overall_score");
    }

    // 4. Update UI State immediately
    onTierChange(scoretiers[0].id);
  };

  const disableDynamicContent = () => {
    if (!id) return;

    // Batch Updates:
    // 1. Disable Flag
    updateElementProperty(
      id,
      "settings.contentIsDynamic",
      false,
      selectedSectionId as string
    );
    // 2. Wipe Data (As requested)
    updateElementProperty(
      id,
      "content.metaDynamic",
      [],
      selectedSectionId as string
    );

    // 3. Reset UI State
    onTierChange(null);
    setShowDisableAlert(false);
  };

  const onSwitchToggle = (checked: boolean) => {
    if (checked && !element.settings?.contentIsDynamic) {
      enableDynamicContent();
    } else {
      // Don't disable immediately; show alert
      setShowDisableAlert(true);
    }
  };
  //console.log(settings?.contentIsDynamic);
  return (
    <>
      <div
        className={cn(
          "bg-white  p-3 rounded-lg shadow-xl w-[280px] max-w-[300px] flex flex-col  border border-gray-200 ",
          settings?.contentIsDynamic ? "w-[280px]" : "w-auto"
        )}
      >
        {/* Row 1: Main Toggle */}
        <div className="flex items-center gap-x-4">
          <Label
            htmlFor="dynamic-content-switch"
            className="text-sm font-medium text-gray-700 dark:text-gray-200 select-none cursor-pointer"
          >
            Dynamic Content
          </Label>
          <Switch
            id="dynamic-content-switch"
            checked={settings?.contentIsDynamic || false}
            onCheckedChange={onSwitchToggle}
            className="data-[state=checked]:bg-blue-500"
          />
        </div>

        {/* Row 2: Conditional Settings */}
        <div
          className={cn(
            "flex flex-col gap-y-3.5 overflow-hidden transition-all duration-300 ease-in-out",
            settings?.contentIsDynamic
              ? "max-h-[200px] opacity-100 pt-1"
              : "max-h-0 opacity-0"
          )}
        >
          <Separator className="bg-gray-100 dark:bg-neutral-700" />

          <BasedOnSelector
            open={openBasedOn}
            setOpen={setOpenBasedOn}
            currentValue={settings?.categoryId || "overall_score"}
            options={basedOnOptions}
            onSelectionChange={handleBasedOnChange}
          />

          <TierSelector
            open={openTier}
            setOpen={setOpenTier}
            selectedTierId={selectedTierId || ""}
            scoretiers={scoretiers}
            onTierChange={onTierChange}
          />
        </div>
      </div>

      {/* Alert Modal */}
      <AlertDialog open={showDisableAlert} onOpenChange={setShowDisableAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disable Dynamic Content?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the content you have customized for
              specific tiers. The element will revert to displaying static text.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={disableDynamicContent}
            >
              Disable & Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// --- SUB COMPONENTS (Memoized for performance) ---

const SelectorRowLayout = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-center justify-between gap-x-3">
    <Label className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap select-none">
      {label}
    </Label>
    <div className="shrink-0">{children}</div>
  </div>
);

const TierSelector = memo(
  ({
    open,
    setOpen,
    selectedTierId,
    scoretiers,
    onTierChange,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedTierId: string;
    scoretiers: Array<{ id: string; name: string }>;
    onTierChange: (tierId: string) => void;
  }) => {
    const selectedTier = scoretiers.find((tier) => tier.id === selectedTierId);

    return (
      <SelectorRowLayout label="Editing Tier">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[140px] justify-between text-xs h-8 px-2 bg-gray-50 dark:bg-neutral-700 dark:text-gray-200 border-gray-200 dark:border-neutral-600"
            >
              <span className="truncate">
                {selectedTier?.name || "Select..."}
              </span>
              <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[140px] p-0 dark:bg-neutral-800 dark:border-neutral-700">
            <Command>
              <CommandList>
                <CommandGroup>
                  {scoretiers.map((tier) => (
                    <CommandItem
                      key={tier.id}
                      value={tier.id}
                      onSelect={() => {
                        onTierChange(tier.id);
                        setOpen(false);
                      }}
                      className="text-xs py-1.5 cursor-pointer"
                    >
                      <span className="truncate">{tier.name}</span>
                      <Check
                        className={cn(
                          "ml-auto h-3 w-3",
                          selectedTierId === tier.id
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
      </SelectorRowLayout>
    );
  }
);

const BasedOnSelector = memo(
  ({
    open,
    setOpen,
    currentValue,
    options,
    onSelectionChange,
  }: {
    open: boolean;
    setOpen: (open: boolean) => void;
    currentValue: string;
    options: Array<{ value: string; label: string }>;
    onSelectionChange: (value: string) => void;
  }) => {
    const selectedOption = options.find((op) => op.value === currentValue);

    return (
      <SelectorRowLayout label="Based on">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[140px] justify-between text-xs h-8 px-2 bg-gray-50 dark:bg-neutral-700 dark:text-gray-200 border-gray-200 dark:border-neutral-600"
            >
              <span className="truncate">
                {selectedOption?.label || "Overall score"}
              </span>
              <ChevronsUpDown className="ml-1 h-3 w-3 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[140px] p-0 dark:bg-neutral-800 dark:border-neutral-700">
            <Command>
              <CommandList>
                <CommandGroup>
                  {options.map((op) => (
                    <CommandItem
                      key={op.value}
                      value={op.value}
                      onSelect={() => {
                        onSelectionChange(op.value);
                        setOpen(false);
                      }}
                      className="text-xs py-1.5 cursor-pointer"
                    >
                      <span className="truncate">{op.label}</span>
                      <Check
                        className={cn(
                          "ml-auto h-3 w-3",
                          currentValue === op.value
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
      </SelectorRowLayout>
    );
  }
);

export default React.memo(TextStylist);
