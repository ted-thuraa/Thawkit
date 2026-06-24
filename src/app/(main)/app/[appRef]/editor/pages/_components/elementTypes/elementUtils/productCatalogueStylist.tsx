"use client";

import * as React from "react";
import { useCallback } from "react";

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
  CalendarDays,
  Pen, // For Timeline (Placeholder)
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
import { debounce } from "lodash";
import { ColorPicker } from "@/components/global/colorPicker";
import { Separator } from "@/components/ui/separator";
import {
  ElementNode,
  ProductCatalogType,
} from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import { ProductCatalogueDataTable } from "../../helpers/cms/productCatalogueTable";
import { toast } from "sonner";

const smartLayoutTypeIcons: { [key: string]: React.ElementType } = {
  text_box: Baseline,
  bullets: ListChecks,
  icon_with_text: Sparkles,
  image_with_text: ImageIcon,
  timeline: CalendarDays,
  default: SquarePen,
};

const columnSizeOptions = [
  { value: 1, label: "S" }, // Small - 1 column
  { value: 2, label: "M" }, // Medium - 2 columns
  { value: 3, label: "L" }, // Large - 3 columns
  { value: 4, label: "XL" }, // Extra Large - 4 columns
];

type Props = { section: ElementNode };

const ProductCatalogueStylist = ({ section }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [layoutTypeOpen, setLayoutTypeOpen] = React.useState(false);
  const [bgColorOpen, setBgColorOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const {
    productCatalog,
    selectedSectionId,
    updateGlobalProperty,
    updateElementProperty,
  } = usePageBuilderStore();

  // Memoize the current layout value
  const currentLayout = React.useMemo(
    () => section.settings?.smart_layout_type || "",
    [section.settings?.smart_layout_type]
  );
  const CurrentLayoutIcon =
    smartLayoutTypeIcons[currentLayout] || smartLayoutTypeIcons.default;

  const handleLayoutChange = React.useCallback(
    (newValue: string) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.smart_layout_type",
          newValue,
          selectedSectionId as string
        );
      }
      setOpen(false);
    },
    [section.id, updateElementProperty]
  );

  const handleGridColumnChange = useCallback(
    (value: string) => {
      const numValue = parseInt(value);
      if (!isNaN(numValue) && section.id) {
        updateElementProperty(
          section.id,
          "settings.grid_columns", // Standardizing to grid_columns
          numValue,
          selectedSectionId as string
        );
      }
    },
    [section.id, updateElementProperty]
  );

  const handleItemsTextAlignmentChange = useCallback(
    (value: string) => {
      if (value && section.id) {
        updateElementProperty(
          section.id,
          "settings.itemsTextAlignment",
          value,
          selectedSectionId as string
        );
      }
    },
    [section.id, updateElementProperty]
  );

  const debouncedUpdateCardBgColor = React.useCallback(
    debounce((newColor: string) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.smartLayout_cardBackgroundColor",
          newColor,
          selectedSectionId as string
        );
      }
    }, 300),
    [section.id, updateElementProperty]
  );

  const handleAddProduct = React.useCallback(
    (newProduct: ProductCatalogType) => {
      const newCatalog = [...productCatalog, newProduct];
      updateGlobalProperty("productCatalog", newCatalog);
    },
    [productCatalog, updateGlobalProperty]
  );
  const handleProductDelete = React.useCallback(
    (id: string) => {
      const newCatalog = productCatalog.filter((product) => product.id !== id);
      updateGlobalProperty("productCatalog", newCatalog);
      toast.success("Product deleted successfully.");
    },
    [productCatalog, updateGlobalProperty]
  );

  const handleProductUpdate = useCallback(
    (updatedProduct: ProductCatalogType) => {
      // 1. Create new array with updated item
      const newCatalog = productCatalog.map((p: ProductCatalogType) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );

      updateGlobalProperty("productCatalog", newCatalog);

      toast.success("Product updated successfully");
    },
    [productCatalog, updateGlobalProperty]
  );

  return (
    <>
      {" "}
      <TooltipProvider delayDuration={100}>
        <div className="flex flex-row items-center gap-1 p-1.5 rounded-md bg-white shadow-lg border border-gray-200">
          {/* Column Size Selector */}
          <ToggleGroup
            type="single"
            value={String(section.settings?.grid_columns || 3)}
            onValueChange={handleGridColumnChange}
            aria-label="Column Size"
            className="flex items-center gap-0.5"
          >
            {columnSizeOptions.map((opt) => (
              <Tooltip key={opt.value}>
                <TooltipTrigger asChild>
                  <ToggleGroupItem
                    value={String(opt.value)}
                    aria-label={`${opt.label} columns`}
                    className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600 text-xs"
                  >
                    {/* Using text S,M,L,XL for now, could be icons */}
                    {opt.label}
                  </ToggleGroupItem>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>
                    {opt.value} Column{opt.value > 1 ? "s" : ""}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </ToggleGroup>

          <Separator
            orientation="vertical"
            className="h-5 bg-gray-300 mx-0.5"
          />

          {/* Background Color Picker Popover */}
          <Popover open={bgColorOpen} onOpenChange={setBgColorOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 p-1 hover:bg-gray-100"
                  >
                    <Palette className="h-4 w-4 text-gray-600" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>Card Background Color</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent className="w-auto p-2">
              <Label
                htmlFor="smartCardBgColorAll"
                className="text-xs text-gray-600 mb-1 block"
              >
                All Cards Background
              </Label>
              <ColorPicker
                //id="smartCardBgColorAll"
                color={section.settings?.smartLayout_cardBackgroundColor || ""}
                onChange={debouncedUpdateCardBgColor}
                className="w-full"
              />
            </PopoverContent>
          </Popover>

          {/* Conditional Text Alignment */}
          {currentLayout === "text_box" && (
            <>
              <Separator
                orientation="vertical"
                className="h-5 bg-gray-300 mx-0.5"
              />

              <ToggleGroup
                type="single"
                value={section.settings?.itemsTextAlignment || "left"}
                onValueChange={handleItemsTextAlignmentChange}
                aria-label="Text Alignment"
                className="flex items-center gap-0.5"
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="left"
                      aria-label="Align left"
                      className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Align Left</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="center"
                      aria-label="Align center"
                      className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Align Center</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <ToggleGroupItem
                      value="right"
                      aria-label="Align right"
                      className="h-7 w-7 p-1 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-600"
                    >
                      <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Align Right</p>
                  </TooltipContent>
                </Tooltip>
              </ToggleGroup>
            </>
          )}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                className="w-8 h-8 rounded-full flex items-center justify-center text-white bg-indigo-500 hover:text-white hover:bg-indigo-600"
                onClick={() => setIsDialogOpen(true)}
              >
                <Pen className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Edit products</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
      <DialogWrapper
        controlledOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Product Catalogue Manager"
        description="Manage your product inventory, pricing, and details."
        className="max-w-[85rem] w-full h-[90vh] flex flex-col bg-white"
      >
        <div className="flex-1 overflow-hidden h-full w-full">
          {/* Passing store data and update handler to the table [cite: 1161] */}
          <ProductCatalogueDataTable
            data={productCatalog as ProductCatalogType[]}
            onUpdateProduct={handleProductUpdate}
            onAddProduct={handleAddProduct}
            onProductDelete={handleProductDelete}
          />
        </div>
      </DialogWrapper>
    </>
  );
};

export default React.memo(ProductCatalogueStylist);
