"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "sonner";
import { X } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Custom Components & Providers
import { SheetProvider } from "@/providers/sheet-provider";
import { MediaType, SectionSettings } from "@/stores/pageEditorStore/types";
import MediaComponent from "@/components/media/mediaComponent";

// --- Types ---
type MediaOptions = "All" | "image_only" | "video_only" | "image_&_gif_only";

interface MediaPickerProps {
  organizationId: string;
  projectId: string;
  mediaType: SectionSettings["backgroundType"];
  mediaSource?: SectionSettings["backgroundSource"];
  mediaSrc: string;
  mediaOptions: MediaOptions;
  onMediaChange: (value: string) => void;
  onMediaTypeChange?: (type: SectionSettings["backgroundType"]) => void;
  onMediaSourceChange?: (source: SectionSettings["backgroundSource"]) => void;
  editorTrigger?: React.ReactNode;
}

// --- Constants ---
const mediaTypesOptions = [
  { value: "image", label: "Image" },
  { value: "video", label: "Video" },
];

const imageSubCategory = [
  { value: "url", label: "Enter image URL" },
  { value: "upload", label: "Upload Image" },
  { value: "ai_image", label: "AI Image" },
  { value: "gif", label: "GIFs from Giphy" },
];

const videoSubCategory = [
  { value: "url", label: "Video URL" },
  { value: "youtube", label: "YouTube Video" },
  { value: "vimeo", label: "Vimeo Video" },
  { value: "loom", label: "Loom Video" },
];

const formSchema = z.object({
  link: z
    .string()
    .url({ message: "Please enter a valid URL." })
    .or(z.literal("")),
});

// --- Component ---
const MediaPicker = ({
  organizationId,
  projectId,
  mediaType,
  mediaSource,
  mediaSrc,
  mediaOptions,
  onMediaChange,
  onMediaTypeChange,
  onMediaSourceChange,
  editorTrigger,
}: MediaPickerProps) => {
  // ✅ Initialize with correct mediaType on first render
  const getInitialMediaType = () => {
    if (mediaType) return mediaType;
    if (mediaOptions === "image_only" || mediaOptions === "image_&_gif_only")
      return "image";
    if (mediaOptions === "video_only") return "video";
    return "image"; // fallback default
  };

  const [selectedMediaType, setSelectedMediaType] = useState<
    SectionSettings["backgroundType"]
  >(() => getInitialMediaType());

  const [selectedMediaSource, setSelectedMediaSource] = useState<
    SectionSettings["backgroundSource"] | undefined
  >(mediaSource);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: { link: mediaSrc || "" },
  });

  // --- Memoized Options ---
  const filteredMediaTypes = useMemo(() => {
    if (mediaOptions === "image_&_gif_only") {
      return mediaTypesOptions.filter((opt) => opt.value === "image");
    }
    return mediaTypesOptions;
  }, [mediaOptions]);

  const mediaSourceOptions = useMemo(() => {
    if (selectedMediaType === "image") return imageSubCategory;
    if (selectedMediaType === "video") return videoSubCategory;
    return [];
  }, [selectedMediaType]);

  const showMediaTypeSelector = ["All", "image_&_gif_only"].includes(
    mediaOptions
  );

  // --- Handlers ---
  const handleMediaValueChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue) {
        form.setValue("link", newValue, { shouldValidate: true });
        onMediaChange(newValue);
      }
    },
    [form, onMediaChange]
  );

  const handleMediaTypeChange = (
    newType: SectionSettings["backgroundType"]
  ) => {
    setSelectedMediaType(newType);
    handleMediaSourceChange("url"); // reset to default source
    onMediaTypeChange?.(newType);
    handleMediaValueChange("");
  };

  const handleMediaSourceChange = (
    newSource: SectionSettings["backgroundSource"]
  ) => {
    setSelectedMediaSource(newSource);
    onMediaSourceChange?.(newSource);
    handleMediaValueChange("");
  };

  const handleDelete = useCallback(() => {
    handleMediaValueChange("");
    //toast.success("Media removed.");
  }, [handleMediaValueChange]);

  // --- Effects ---
  useEffect(() => {
    form.reset({ link: mediaSrc || "" });
  }, [mediaSrc, form]);

  useEffect(() => {
    setSelectedMediaType(getInitialMediaType());
    setSelectedMediaSource(mediaSource);
  }, [mediaOptions, mediaType, mediaSource]);

  // --- Renderers ---
  const renderMediaTypeSelector = () => (
    <div>
      <FormLabel>Media Type</FormLabel>
      <Select
        value={selectedMediaType}
        onValueChange={(val) =>
          handleMediaTypeChange(val as SectionSettings["backgroundType"])
        }
      >
        <SelectTrigger className="w-full mt-1">
          <SelectValue placeholder="Select media type" />
        </SelectTrigger>
        <SelectContent className="z-[9999]">
          {filteredMediaTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  const renderSubCategorySelector = () =>
    selectedMediaType &&
    mediaSourceOptions.length > 0 && (
      <div className="mt-4">
        <FormLabel>Source</FormLabel>
        <Select
          value={selectedMediaSource}
          onValueChange={(val) =>
            handleMediaSourceChange(val as SectionSettings["backgroundSource"])
          }
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select source type" />
          </SelectTrigger>
          <SelectContent className="z-[9999]">
            {mediaSourceOptions.map((subType) => (
              <SelectItem key={subType.value} value={subType.value}>
                {subType.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );

  const renderImageInputUI = () => (
    <div className="space-y-4 mt-6">
      {/* Image URL input */}

      {/* File Upload */}
      {mediaSrc ? (
        <div className="flex flex-col justify-center items-center">
          <div className="relative w-full h-40">
            <Image
              src={mediaSrc}
              alt="Uploaded media"
              className="object-contain rounded-md"
              fill
            />
          </div>
          <Button
            onClick={handleDelete}
            variant="ghost"
            type="button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white mt-4 text-sm"
          >
            <X className="h-4 w-4 mr-2" />
            Change Image
          </Button>
        </div>
      ) : (
        <div className="h-[400px] overflow-y-auto p-2 rounded-md mt-1">
          <MediaComponent
            projectId={projectId}
            organizationId={organizationId}
            onChange={handleMediaValueChange}
          />
        </div>
      )}
    </div>
  );

  const renderVideoInputUI = () => (
    <div className="space-y-4 mt-6">
      <FormLabel>Video URL</FormLabel>
      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem className="mt-1">
            <FormControl>
              <Input
                placeholder="Paste video URL"
                onChange={(e) => {
                  field.onChange(e);
                  handleMediaValueChange(e.target.value);
                }}
                value={field.value || ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <SheetProvider
      trigger={editorTrigger}
      title="Media Picker"
      description="Select, upload, or link your media content."
      className="px-4  sm:max-w-lg z-[9999]"
    >
      <div className="py-4">
        <Form {...form}>
          {showMediaTypeSelector && (
            <>
              {renderMediaTypeSelector()}
              {renderSubCategorySelector()}
            </>
          )}
          {selectedMediaType === "image" && renderImageInputUI()}
          {selectedMediaType === "video" && renderVideoInputUI()}
        </Form>
      </div>
    </SheetProvider>
  );
};

export default MediaPicker;
