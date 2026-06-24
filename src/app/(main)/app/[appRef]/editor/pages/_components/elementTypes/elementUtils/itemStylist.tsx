"use client";

import * as React from "react";
import { useCallback } from "react";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  BookImage,
  Check,
  ChevronsUpDown,
  Columns2,
  Columns3,
  ListOrdered,
  SquarePen,
  Star,
  Trash,
  Trash2,
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

import { Separator } from "@/components/ui/separator";
import { ColorPicker } from "@/components/global/colorPicker";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { SheetProvider } from "@/providers/sheet-provider";
import FileUpload from "@/components/global/file-upload";

type Props = { section: ElementNode; item: ElementNode; index: number };
type MediaProps = { item: ElementNode; parentSectionId: string };

const ItemStylist = ({ section, item, index }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const {
    livemode,
    selectedSectionId,
    updateElementProperty,
    removeSmartLayoutItem,
  } = usePageBuilderStore();

  const smartLayoutType = section.settings?.smart_layout_type;

  const handleItemHighlight = useCallback(
    (value: boolean) => {
      if (item.id) {
        updateElementProperty(
          item.id,
          "settings.isHighlighted",
          value,
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, item.id, updateElementProperty]
  );

  const handleDelete = useCallback(() => {
    if (item.id) {
      removeSmartLayoutItem(section.id, item.id, selectedSectionId as string);
    }
  }, [selectedSectionId, section.id, item.id, removeSmartLayoutItem]);

  const handleIconChange = useCallback(
    (itemId: string, iconName: string) => {
      if (selectedSectionId && itemId) {
        // Need parent section ID too if updating nested
        // Assuming updateElementProperty can handle nested updates
        // Find the parent section ID if necessary, though for smart layout, section.id should work
        updateElementProperty(
          selectedSectionId, // The ID of the smart_layout container
          itemId, // The ID of the layout_item being changed
          "settings.iconName",
          iconName
        );
      }
      // Note: Sheet closing is handled within IconPicker's onSelect -> handleSelect
    },
    [selectedSectionId, section.id, updateElementProperty] // Add section.id dependency
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-row items-center gap-1 p-1.5 rounded-md bg-white shadow-lg border border-gray-200">
        {/* Layout Type Selector */}
        {smartLayoutType === "image_with_text" && (
          <>
            <Tooltip>
              <SheetProvider
                trigger={
                  <TooltipTrigger asChild>
                    <Toggle
                      size="sm"
                      variant="outline"
                      aria-label="Edit Image"
                      className="text-xs justify-start h-8 px-2 w-auto rounded border-transparent hover:bg-gray-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <BookImage className="w-3 h-3 mr-1.5 text-gray-600 shrink-0" />
                      <span className="truncate">Edit Image</span>
                    </Toggle>
                  </TooltipTrigger>
                }
                title="Edit Card Image"
                description="Modify the image for this card"
                className="sm:max-w-lg"
              >
                {/* Pass the item and parent section ID */}
                <MediaEditor item={item} parentSectionId={section.id} />
              </SheetProvider>

              <TooltipContent side="top">
                <p>Edit image</p>
              </TooltipContent>
            </Tooltip>

            <Separator
              orientation="vertical"
              className="h-5 bg-gray-300 mx-0.5"
            />
          </>
        )}

        {smartLayoutType === "icon_with_text" && (
          <>
            {/* <div>
              <Tooltip>
                
                <SheetProvider
                  trigger={
                    <TooltipTrigger asChild>
                      <Toggle
                        size="sm"
                        variant="outline"
                        aria-label="Change icon"
                        className="text-xs justify-start h-8 px-2 w-auto rounded border-transparent hover:bg-gray-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        
                        <SquarePen className="w-3 h-3 mr-1.5 text-gray-600 shrink-0" />
                        <span className="truncate">Edit Icon</span>
                      </Toggle>
                    </TooltipTrigger>
                  }
                  title="Pick an Icon"
                  description=""
                  className="sm:max-w-lg"
                >
                  <IconPicker
                    value={item.settings?.iconName}
                    onChange={(iconName) => handleIconChange(item.id, iconName)}
                  />
                </SheetProvider>

                <TooltipContent side="top">
                  <p>Edit icon</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <Separator
              orientation="vertical"
              className="h-5 bg-gray-300 mx-0.5"
            /> */}
          </>
        )}

        {/* Column Size Selector */}
        <div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                variant="outline"
                aria-label="Toggle highlight"
                pressed={item.settings?.isHighlighted}
                onPressedChange={handleItemHighlight}
                className="h-6 w-6 p-1  rounded border-transparent"
              >
                {item.settings?.isHighlighted ? (
                  <Star className="h-3 w-3 fill-gray-500" />
                ) : (
                  <Star className="h-3 w-3" />
                )}
              </Toggle>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Highlight</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />

        {/* Delete Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="h-7 w-7 p-1 text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Delete</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default React.memo(ItemStylist);

const MediaEditor = ({ item, parentSectionId }: MediaProps) => {
  const {
    selectedSectionId,
    theme,
    updateElementProperty,
    updateSection,
    removeSection,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();

  const formSchema = z.object({
    cardImageSource: z.string().optional(), // Schema for URL/Gradient/etc.
  });

  // State for background controls within the popover
  const [currentCardImageSource, setCurrentCardImageSource] = React.useState(
    item.settings?.cardImage ?? ""
  );

  // Reset form field when subcategory changes to avoid validation errors
  // Effect to update local state when the selected section changes
  React.useEffect(() => {
    setCurrentCardImageSource(item.settings?.cardImage ?? "");
  }, [item.settings?.cardImage]);
  // Handler for background type change

  const handleCardImageChange = useCallback(
    (newValue: string | undefined) => {
      const valueToUpdate = newValue || "";
      setCurrentCardImageSource(valueToUpdate); // Update local state immediately
      if (parentSectionId && item.id) {
        // Update the specific item's settings.cardImage
        updateElementProperty(
          parentSectionId, // The ID of the smart_layout
          item.id, // The ID of the layout_item
          "settings.cardImage",
          valueToUpdate
        );
      }
    },
    [
      parentSectionId, // Include dependency
      item.id, // Include dependency
      updateElementProperty,
    ]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      cardImageSource: currentCardImageSource,
    },
  });

  // Update form defaults when local state changes
  React.useEffect(() => {
    form.reset({
      cardImageSource: currentCardImageSource,
    });
  }, [currentCardImageSource, form]);

  return (
    <div className="py-4">
      {/* Add your image editing controls here */}
      <div className="space-y-3 border p-3 rounded-md">
        {" "}
        {/* Added padding */}
        <Label className="text-sm font-medium">Card Image</Label>
        {/* Only show Image URL/Upload */}
        <div className="space-y-2 pt-2">
          <Form {...form}>
            <FormField
              control={form.control}
              name="cardImageSource"
              render={({ field }) => (
                <FormItem className="text-xs">
                  <FormLabel className="text-xs">Image URL</FormLabel>
                  <FormControl>
                    <Input
                      className="h-8 text-xs"
                      placeholder="Paste image URL..."
                      {...field} // Use RHF field props
                      onChange={(e) => {
                        field.onChange(e); // Update RHF
                        handleCardImageChange(e.target.value); // Update store
                      }}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="flex items-center space-x-2">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="flex-1" />
            </div>
            <FormField
              control={form.control}
              name="cardImageSource" // Link to the same field
              render={() => (
                <FormItem className="text-xs">
                  <FormLabel className="text-xs">Upload Image</FormLabel>
                  <FormControl>
                    <FileUpload
                      apiEndpoint="media" // Adjust if needed
                      onChange={handleCardImageChange} // Updates store directly
                      value={currentCardImageSource} // Display current source
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </Form>
        </div>
      </div>
    </div>
  );
};
