"use client";

import React from "react";
import { Pencil } from "lucide-react";

import { Label } from "@/components/ui/label";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import MediaPicker from "../helpers/mediaEditor";
import Image from "next/image";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { item: ElementNode };

const ListingEditor = ({ item }: Props) => {
  const { projectData, updateElementProperty } = usePageBuilderStore();

  const content = item.content as {
    title: string;
    description: string;
    price: number;
    href: string;
    image: string;
  };

  const settings = item.settings as {
    showItemPrice: boolean;
  };

  // Generic handler for text input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateElementProperty(item.id, `content.${name}`, value);
  };

  // Handler for the price, which needs to be a number
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateElementProperty(item.id, "content.price", parseFloat(value) || 0);
  };

  // Handler for the "Show Price" toggle switch
  const handleSwitchChange = (checked: boolean) => {
    updateElementProperty(item.id, "settings.showItemPrice", checked);
  };

  // Handler for image file selection
  const handleImageChange = (newImageUrl: string) => {
    updateElementProperty(item.id, "content.image", newImageUrl);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Left Side: Form Fields */}
      <div className="p-8 flex flex-col space-y-6">
        <div className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={content.title}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={content.description}
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={content.price}
                onChange={handlePriceChange}
                disabled={!settings.showItemPrice}
              />
            </div>
            <div className="flex flex-col justify-end items-start gap-2 pb-1">
              <div className="flex items-center space-x-2">
                <Switch
                  id="showPrice"
                  checked={settings.showItemPrice}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="showPrice" className="cursor-pointer">
                  Show Price
                </Label>
              </div>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="link">Product Link</Label>
            <Input
              id="link"
              name="href"
              placeholder="e.g., /products/basic-tee"
              value={content.href}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      {/* Right Side: Image Preview & Upload */}
      <div className="p-8 flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 rounded-l-lg">
        <Label
          htmlFor="image-upload"
          className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-4"
        >
          Product Image
        </Label>
        <div className="relative group w-full max-w-[250px] aspect-square rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-700 flex items-center justify-center cursor-pointer transition-colors hover:border-blue-500 dark:hover:border-blue-500">
          <MediaPicker
            workspaceId={projectData?.workspace.id as string}
            mediaType={"image"}
            mediaSource={"upload"}
            mediaSrc={content.image as string}
            mediaOptions={"image_only"}
            onMediaChange={(newSrc) => handleImageChange(newSrc)}
            editorTrigger={
              <div className="group/product_item_img relative">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/product_item_img:opacity-100 rounded-md z-[100]">
                  <Pencil className="h-4 w-4 text-white" />
                </div>
                <Image
                  src={
                    content.image
                      ? content.image
                      : "/assets/imageplaceholder.svg"
                  }
                  width={382}
                  height={216}
                  alt="image"
                  className="object-cover w-full h-full rounded-md"
                />
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(ListingEditor);
