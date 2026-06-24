"use client";

import * as React from "react";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import {
  Check,
  ChevronsUpDown,
  Minimize2,
  SquarePen,
  Trash,
  Maximize,
  Minimize,
  Expand,
  ImageOff,
  AlignHorizontalSpaceAround,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { toast } from "sonner";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import MediaPicker from "../../helpers/mediaEditor";

const mediaType = [
  {
    value: "image",
    label: "Image ",
  },
  {
    value: "video",
    label: "Video",
  },
];

const imageSubCategory = [
  {
    value: "normal_image",
    label: "Image upload or url",
  },
  {
    value: "ai_image",
    label: "Ai image",
  },
  {
    value: "gif",
    label: "Gifs from Giphy ",
  },
];

const videoSubCategory = [
  {
    value: "normal_video",
    label: "Video url",
  },
  {
    value: "youtube_video",
    label: "Youtube video",
  },
  {
    value: "vimeo_video",
    label: "Vimeo video",
  },
  {
    value: "loom_video",
    label: "Loom video ",
  },
];
// Define the possible object-fit values
const objectFitValues = ["cover", "contain", "fill", "none"] as const; // Use const assertion for type safety
const alignmentValues = ["left", "center", "right"] as const; // Use const assertion for type safety
type ObjectFitValue = (typeof objectFitValues)[number];
type AlignmentValue = (typeof alignmentValues)[number];

// Helper mapping for icons
const objectFitIcons: Record<ObjectFitValue, React.ElementType> = {
  cover: Maximize,
  contain: Minimize,
  fill: Expand,
  none: ImageOff,
};

const alignmentIcons: Record<AlignmentValue, React.ElementType> = {
  left: AlignLeft,
  center: AlignCenter,
  right: AlignRight,
};

type Props = { section: ElementNode };

const formSchema = z.object({
  link: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .or(z.literal(""))
    .optional(), // Allow empty string or make optional if upload is alternative
  //name: z.string().min(1, { message: "Name is required" }),
});

const MediaStylist = ({ section }: Props) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false); // Add loading state

  const {
    livemode,
    projectData,
    editorConfig,
    selectedSectionId,
    updateElementProperty,
    removeSection,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange", // Validate on change for immediate feedback on URL
    defaultValues: {
      link: !Array.isArray(section.content) ? section.content.src : "",
    },
  });

  // Memoize the current layout value
  const currentMediaType = React.useMemo(
    () => section.type || "",
    [section.type]
  );
  const currentMediaSubCategory = React.useMemo(
    () => section.settings?.mediaCategory || "",
    [section.settings?.mediaCategory] // Depend on the specific setting
  );

  // Determine which sub-category options to show
  const currentSubCategoryOptions = React.useMemo(() => {
    if (currentMediaType === "image") return imageSubCategory;
    if (currentMediaType === "video") return videoSubCategory;
    return []; // Return empty array if no main type is selected
  }, [currentMediaType]);

  const currentObjectFit = React.useMemo(
    () => (section.styles?.objectFit as ObjectFitValue) ?? "cover",
    [section.styles?.objectFit]
  );

  const currentAlignment = React.useMemo(
    () => (section.settings?.content_alignment as AlignmentValue) ?? "center",
    [section.settings?.content_alignment]
  );

  const handleMediaChange = useCallback(
    (newValue: string | undefined) => {
      console.log("handleMediaChange called with:", newValue);
      // Allow null or empty string
      const valueToUpdate = newValue || ""; // Use empty string if null/undefined
      // Update form state explicitly - useful if validation depends on it
      form.setValue("link", valueToUpdate, { shouldValidate: true });

      if (section.id) {
        updateElementProperty(
          section.id,
          "content.src",
          valueToUpdate, // Update store with empty string if needed
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, section.id, updateElementProperty, form] // Add form dependency
  );

  const getFileKeyFromUrl = (url: string): string | null => {
    if (!url) return null;
    try {
      const parts = new URL(url).pathname.split("/");
      // Assuming the key is the last part of the path after '/f/'
      // Example: https://utfs.io/f/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-yyyyyy.jpg -> xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-yyyyyy.jpg
      const fileKey = parts.pop();
      return fileKey || null; // Return null if split fails or key is empty
    } catch (error) {
      console.error("Invalid URL:", error);
      return null; // Handle invalid URLs gracefully
    }
  };

  // --- New Delete Handler ---
  const handleDelete = useCallback(async () => {
    if (!section.id || isDeleting) return;
    //handleMediaChange("");
    //return;

    const imageUrl = !Array.isArray(section.content)
      ? section.content.src
      : null;
    if (!imageUrl) {
      toast.error("No image URL found to delete.");
      return; // Nothing to delete
    }
    if (imageUrl === "/assets/roundArchitecture.jpg") {
      setIsDeleting(true);
      toast.loading("Deleting image...");
      handleMediaChange("");
      toast.success("Image deleted successfully!");
      setIsDeleting(false);
      toast.dismiss(); // Dismiss loading toast
      return;
    }

    const fileKey = getFileKeyFromUrl(imageUrl);
    if (!fileKey) {
      toast.error("Could not extract file key from URL.");
      // Optionally, still allow clearing the state if the key extraction fails but the user wants to remove the reference
      //handleMediaChange(""); // Uncomment if you want to clear state even if server deletion fails
      return;
    }

    setIsDeleting(true);
    toast.loading("Deleting image..."); // Show loading indicator

    try {
      // const response = await fetch("/api/uploadthing/delete", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ fileKey }),
      // });

      // if (!response.ok) {
      //   // Handle non-2xx responses
      //   const errorData = await response.json();
      //   throw new Error(
      //     errorData.error || `HTTP error! status: ${response.status}`
      //   );
      // }

      //const result = await response.json();
      const result = { success: true }; // Mock result for demonstration

      if (result.success) {
        // Clear the image URL in the state AFTER successful deletion
        handleMediaChange("");
        toast.success("Image deleted successfully!");
      } else {
        throw new Error("UploadThing reported deletion failed.");
      }
    } catch (error: any) {
      console.error("Failed to delete image:", error);
      toast.error(`Deletion failed: ${error.message || "Unknown error"}`);
      // Decide if you want to clear the state even on failure:
      // handleMediaChange("");
    } finally {
      setIsDeleting(false);
      toast.dismiss(); // Dismiss loading toast
    }
  }, [
    selectedSectionId,
    section.id,
    section.content,
    handleMediaChange, // Add handleMediaChange as dependency
    isDeleting,
  ]);

  // Reset form field when subcategory changes to avoid validation errors
  React.useEffect(() => {
    if (currentMediaSubCategory !== "image") {
      form.reset({
        link: !Array.isArray(section.content) ? section.content.src : "",
      }); // Reset or set to current non-URL src
    } else {
      // Ensure form value matches store value when switching back
      form.setValue(
        "link",
        !Array.isArray(section.content) ? section.content.src || "" : "",
        { shouldValidate: true }
      );
    }
  }, [currentMediaSubCategory, section.content, form]);

  const handleMediaTypeChange = useCallback(
    (newType: string) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "type",
          newType,
          selectedSectionId as string
        );
        const defaultSubCategory =
          newType === "image" ? "normal_image" : "normal_video";
        updateElementProperty(
          section.id,
          "settings.media_sub_category",
          defaultSubCategory,
          selectedSectionId as string
        );
        // Reset link in form state as well when type changes
        form.reset({ link: "" });
        updateElementProperty(
          section.id,
          "content",
          {
            src: "",
            height: newType === "image" ? 576 : "100%",
            width: newType === "image" ? 576 : "100%",
          },
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, section.id, updateElementProperty, form] // Add form dependency
  );

  const handleMediaSubCategoryChange = useCallback(
    (newSubCategory: string) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.media_sub_category",
          newSubCategory,
          selectedSectionId as string
        );
        // Reset link in form state when sub-category changes
        form.reset({ link: "" });
        // Update content.src to ensure it's also cleared in the store
        updateElementProperty(
          section.id,
          "content.src",
          "",
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, section.id, updateElementProperty, form] // Add form dependency
  );

  // Handler for changing the object-fit property
  const handleObjectFitChange = useCallback(
    (newFit: ObjectFitValue) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "styles.objectFit", // Target the style property
          newFit,
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, section.id, updateElementProperty]
  );

  const handleAlignmentChange = useCallback(
    (newFit: AlignmentValue) => {
      if (section.id) {
        updateElementProperty(
          section.id,
          "settings.content_alignment", // Target the style property
          newFit,
          selectedSectionId as string
        );
      }
    },
    [selectedSectionId, section.id, updateElementProperty]
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div onClick={(e) => e.stopPropagation()}>
        <div className=" text-gray-700 flex flex-row items-start justify-center space-x-1">
          <div className="relative">
            <DropdownMenu>
              <Tooltip>
                {/* The button now serves as the trigger for both */}
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className="h-6 px-3 min-w-10 border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md">
                      <AlignHorizontalSpaceAround className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Image Alignment</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent
                align="end"
                className="w-auto p-2 absolute z-[1500]"
              >
                {" "}
                {/* Adjusted width and padding */}
                <DropdownMenuGroup>
                  {/* Keep DropdownMenuItem for structure, but content changes */}
                  <DropdownMenuItem
                    className="focus:bg-transparent p-0" // Prevent item highlight on click
                    onSelect={(e) => e.preventDefault()} // Prevent menu closing on item click
                  >
                    <div className="flex flex-col space-y-1">
                      {" "}
                      {/* Use flex-col for layout */}
                      <p className="text-sm font-medium px-1">
                        Image Alignment
                      </p>{" "}
                      {/* Added padding */}
                      {/* --- Replace Toggle loop with ToggleGroup --- */}
                      <ToggleGroup
                        type="single"
                        size="sm" // Apply size to the group
                        variant="outline" // Apply variant to the group
                        value={currentAlignment} // Set current value
                        onValueChange={handleAlignmentChange} // Set handler
                        className="flex flex-row flex-nowrap justify-start gap-1" // Allow wrapping and add gap
                        aria-label="Image alignment"
                      >
                        {alignmentValues.map((alignValue) => {
                          // Get the corresponding icon component
                          const Icon = alignmentIcons[alignValue];
                          return (
                            <TooltipProvider
                              key={alignValue}
                              delayDuration={100}
                            >
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ToggleGroupItem
                                    value={alignValue}
                                    aria-label={`Set object-fit to ${alignValue}`}
                                    className="px-2 py-1 h-auto" // Adjust padding/height
                                  >
                                    {/* Render the Icon component */}
                                    <Icon className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Align: {alignValue}</p>
                                </TooltipContent>
                              </Tooltip>
                              <Separator
                                orientation="vertical"
                                className="h-5"
                              />
                            </TooltipProvider>
                          );
                        })}
                      </ToggleGroup>
                      {/* --- End ToggleGroup Implementation --- */}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div className="relative">
            <DropdownMenu>
              <Tooltip>
                {/* The button now serves as the trigger for both */}
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button className="h-6 px-3 min-w-10 border border-transparent bg-transparent hover:bg-accent hover:text-accent-foreground rounded-md">
                      <Minimize2 className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Image Fit</p>
                </TooltipContent>
              </Tooltip>

              <DropdownMenuContent align="end" className="w-auto p-2 absolute">
                {" "}
                {/* Adjusted width and padding */}
                <DropdownMenuGroup>
                  {/* Keep DropdownMenuItem for structure, but content changes */}
                  <DropdownMenuItem
                    className="focus:bg-transparent p-0" // Prevent item highlight on click
                    onSelect={(e) => e.preventDefault()} // Prevent menu closing on item click
                  >
                    <div className="flex flex-col space-y-1">
                      {" "}
                      {/* Use flex-col for layout */}
                      <p className="text-sm font-medium px-1">Image Fit</p>{" "}
                      {/* Added padding */}
                      {/* --- Replace Toggle loop with ToggleGroup --- */}
                      <ToggleGroup
                        type="single"
                        size="sm" // Apply size to the group
                        variant="outline" // Apply variant to the group
                        value={currentObjectFit} // Set current value
                        onValueChange={handleObjectFitChange} // Set handler
                        className="flex flex-row flex-nowrap justify-start gap-1" // Allow wrapping and add gap
                        aria-label="Image object fit"
                      >
                        {objectFitValues.map((fitValue) => {
                          // Get the corresponding icon component
                          const Icon = objectFitIcons[fitValue];
                          return (
                            <TooltipProvider key={fitValue} delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <ToggleGroupItem
                                    value={fitValue}
                                    aria-label={`Set object-fit to ${fitValue}`}
                                    className="px-2 py-1 h-auto" // Adjust padding/height
                                  >
                                    {/* Render the Icon component */}
                                    <Icon className="h-4 w-4" />
                                  </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>object-fit: {fitValue}</p>
                                </TooltipContent>
                              </Tooltip>
                              <Separator
                                orientation="vertical"
                                className="h-5"
                              />
                            </TooltipProvider>
                          );
                        })}
                      </ToggleGroup>
                      {/* --- End ToggleGroup Implementation --- */}
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <div>
            <MediaPicker
              organizationId={editorConfig?.organizationId as string}
              projectId={projectData?.id as string}
              mediaType={"image"}
              mediaSource={"upload"}
              mediaSrc={
                !Array.isArray(section.content)
                  ? (section.content.src as string)
                  : ""
              }
              mediaOptions={"All"}
              onMediaChange={(newSrc) =>
                //handleMediaUpdate(option.id, newSrc)
                handleMediaChange(newSrc)
              }
              editorTrigger={
                <Toggle
                  variant="outline"
                  aria-label="Toggle highlight"
                  className="h-6 border-transparent"
                >
                  <SquarePen className="h-4 w-4" />
                </Toggle>
              }
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default React.memo(MediaStylist);
