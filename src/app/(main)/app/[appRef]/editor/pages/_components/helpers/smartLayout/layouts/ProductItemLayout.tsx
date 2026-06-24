// File: src/components/SmartLayout/layouts/ProductItemLayout.tsx
"use client";

import React, { useMemo } from "react";
import { Pencil } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ElementNode } from "@/stores/pageEditorStore/types";
import DialogWrapper from "@/wrappers/dialog-wrapper";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { CardWrapper } from "../../../elementTypes/scopes/cardWrapper";
import { cn } from "@/lib/utils";

// Lazy-load heavy editor components (only loaded in edit mode)
const DialogProvider = dynamic(
  () => import("@/providers/dialog-provider").then((mod) => mod.DialogProvider),
  { ssr: false }
);

const ListingEditor = dynamic(
  () => import("../../../elementTypes/listingEditor"),
  {
    ssr: false,
  }
);

interface ProductItemLayoutProps {
  item: ElementNode;
  section: ElementNode;
}

/**
 * ProductItemLayout - Renders a product item card layout
 */
export const ProductItemLayout: React.FC<ProductItemLayoutProps> = React.memo(
  ({ item, section }) => {
    const {
      livemode,
      theme,
      selectedSectionId,
      updateElementProperty,
      removeSmartLayoutItem,
    } = usePageBuilderStore();

    // Early return if content is an array (product items should have object content)
    if (Array.isArray(item.content)) return null;

    // Memoize background color computation
    const effectiveBg = useMemo(
      () =>
        item.styles?.backgroundColor ||
        section.settings?.smartLayout_cardBackgroundColor ||
        theme.colors?.background?.card ||
        "#ffffff",
      [
        item.styles?.backgroundColor,
        section.settings?.smartLayout_cardBackgroundColor,
        theme.colors?.background?.card,
      ]
    );

    // Memoize style object
    const cardStyle = useMemo(
      () => ({
        ...section.styles,
      }),
      [section.styles]
    );

    // Memoize image source
    const imageSrc = useMemo(
      () =>
        !Array.isArray(item.content)
          ? item.content?.image || "/assets/imageplaceholder.svg"
          : "/assets/imageplaceholder.svg",
      [item.content?.image]
    );

    // Memoize product details
    const productDetails = useMemo(
      () =>
        !Array.isArray(item.content)
          ? {
              title: item.content?.title || "",
              description: item.content?.description || "",
              price: item.content?.price || 0,
              showPrice: item.settings?.showItemPrice,
            }
          : undefined,
      [
        item.content?.title,
        item.content?.description,
        item.content?.price,
        item.settings?.showItemPrice,
      ]
    );

    return (
      <CardWrapper
        bgColor={effectiveBg}
        className={cn(
          "themed-card w-full h-full p-5 flex flex-col gap-[32px]",
          item.className
        )}
        style={cardStyle}
        theme={theme}
      >
        <div className="group/product_item relative">
          {/* Edit overlay - only visible on hover in edit mode */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/product_item:opacity-100 rounded-md z-[100]">
            <DialogWrapper
              trigger={<Pencil className="h-4 w-4 text-white" />}
              title="Edit Item"
              description="Update the details for this item"
              className="bg-sidebar sm:max-w-[800px] "
            >
              <ListingEditor item={item} />
            </DialogWrapper>
          </div>

          {/* Product image and details */}
          <div className="relative">
            <Image
              className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
              src={imageSrc}
              alt="image"
              width={500}
              height={500}
            />

            <div className="mt-4 flex justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-700">
                  <a href="">
                    <span aria-hidden="true" className="absolute inset-0" />
                    {productDetails?.title}
                  </a>
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {productDetails?.description}
                </p>
              </div>
              {productDetails?.showPrice && (
                <p className="text-sm font-semibold text-gray-900">
                  ${productDetails?.price}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardWrapper>
    );
  }
);

ProductItemLayout.displayName = "ProductItemLayout";
