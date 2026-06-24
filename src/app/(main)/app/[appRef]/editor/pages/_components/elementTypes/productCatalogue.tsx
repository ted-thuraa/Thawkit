"use client";
import { Badge } from "@/components/ui/badge";
import { EditorBtns, defaultStyles } from "@/lib/constants";
import clsx from "clsx";
import React, { useCallback, useMemo, useState } from "react";
import { v4 } from "uuid";
import Image from "next/image";
import { ArrowUpRight, CheckCircle2, Ellipsis } from "lucide-react";
import { Cog, Copy, Eye, Palette, Plus, Trash } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { debounce } from "lodash";
import ButtonStylist from "./elementUtils/buttonStylist";
import ButtonLayoutStylist from "./elementUtils/buttonLayoutStylist";
import {
  ElementNode,
  ProductCatalogType,
} from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { THEME_CLASSES } from "@/lib/constants/theme";
import ProductCatalogueStylist from "./elementUtils/productCatalogueStylist";

type Props = { section: ElementNode };

interface ProductCardProps {
  product: ProductCatalogType;
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex w-full flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50">
      {/* Top Header: Staff Pick & Action Button */}
      <div className="flex items-start justify-between">
        {product.isStaffPick && (
          <div className="flex items-center gap-1.5 text-amber-600">
            <CheckCircle2 className="h-4 w-4 fill-amber-600 text-white" />
            <span className="text-xs font-semibold tracking-wide text-amber-700/90">
              Staff Pick
            </span>
          </div>
        )}

        {/* Arrow Button */}
        <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900">
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>

      {/* Image Section with Animation */}
      <div className="relative my-6 flex h-48 w-full items-center justify-center overflow-hidden rounded-lg">
        {/* Using object-contain to ensure the whole product is visible 
           regardless of aspect ratio, matching the reference image.
        */}
        <div className="relative h-full w-full transition-transform duration-500 ease-out group-hover:-rotate-2 group-hover:scale-105">
          <Image
            src={product.image ? product.image : "/assets/imageplaceholder.svg"}
            alt={product.title}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Bottom Footer: Metadata & Price */}
      <div className="mt-auto flex items-end justify-between">
        <div className="flex flex-col gap-1">
          {/* Brand · Category */}
          <p className="text-sm font-medium text-gray-500">
            {product.brand} <span className="mx-1">·</span> {product.category}
          </p>
          {/* Product Title */}
          <h3 className="text-base font-semibold text-gray-900">
            {product.title}
          </h3>
        </div>

        {/* Price */}
        <p className="mb-[2px] font-mono text-sm font-semibold text-gray-900">
          {product.price}
        </p>
      </div>
    </div>
  );
}

const ProductCatalogueComponent: React.FC<Props> = ({ section }: Props) => {
  const {
    livemode,
    productCatalog,
    activeElementId,
    addLayoutItem,
    setActiveElementId,
    addBtnItem,
    updateElementProperty,
    previewMode,
    selectedSectionId,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const { id, content, name, styles, className, type, settings } = section;
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const isEditable = !livemode && !previewMode;

  // Singleton Logic: This element is ONLY active if it matches the global ID
  const isSelected = isEditable && activeElementId === id;
  const isHovered = isEditable && hoveredItemId === id;
  const showLayoutEditorUI = useMemo(
    () => isEditable && (isHovered || isSelected),
    [isEditable, isHovered, isSelected]
  );
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setActiveElementId(id);
    }
  };

  const handleMouseEnter = () => {
    if (!livemode && !previewMode) setHoveredItemId(id);
  };

  const handleMouseLeave = () => {
    if (!livemode && !previewMode) setHoveredItemId(null);
  };
  return (
    <div
      className="relative w-full   py-1 "
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <div
        className={cn(
          "absolute inset-0 z-0 overflow-hidden pointer-events-none",
          isHovered &&
            !isSelected &&
            "outline-dashed outline-1 outline-indigo-600 rounded-sm",

          isSelected && "outline outline-2 outline-indigo-600 rounded-sm"
        )}
      ></div>
      {showLayoutEditorUI && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100"
                aria-label="Edit Layout"
              >
                <Ellipsis className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto bg-transparent p-0 z-[50] absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] border-none">
              <ProductCatalogueStylist section={section} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}
      <div className="mx-auto max-w-7xl">
        {/* Grid Layout: 1 col mobile, 2 col tablet, 3 col desktop */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {productCatalog.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default React.memo(ProductCatalogueComponent);
