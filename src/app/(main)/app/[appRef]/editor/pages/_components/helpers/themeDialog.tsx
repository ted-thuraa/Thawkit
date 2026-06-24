"use client";
import {
  Plus,
  LayoutGrid,
  Settings,
  Palette,
  ChevronsUpDown,
  Check,
  Trash,
  CaseSensitive,
  WandSparkles,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { debounce } from "lodash";
import { ColorPicker } from "@/components/global/colorPicker";
import { cn, getBrightness, hexToRgb } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { fontOptions } from "@/lib/fonts";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { PageTheme } from "@/stores/pageEditorStore/types";
import { getAccessibleTextColor } from "@/lib/utils/colors";
import FileUpload from "@/components/global/file-upload";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IframeContent } from "../iframeCanvas";
import { fontsMap } from "@/lib/fonts/index";
import FontsThemingTab from "./theming/fonts";
import ColorsThemingTab from "./theming/colorsThemingTab";

export const tools = [
  { icon: <Plus className="h-4 w-4" />, label: "Add Element", action: "add" },
  {
    icon: <Palette className="h-4 w-4" />,
    label: "Page theme",
    action: "theme",
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
    action: "settings",
  },
];

const themeMenu = [
  {
    name: "Colors",
    value: "colors",
    icon: (
      <Palette
        className="-ms-0.5 me-1.5 opacity-60"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
  {
    name: "Fonts",
    value: "fonts",
    icon: (
      <CaseSensitive
        className="-ms-0.5 me-1.5 opacity-60"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
  {
    name: "Design",
    value: "design",
    icon: (
      <WandSparkles
        className="-ms-0.5 me-1.5 opacity-60"
        size={16}
        strokeWidth={2}
        aria-hidden="true"
      />
    ),
  },
];

const roundnessOptions = [
  { value: "0px", label: "None", className: "rounded-none" },
  { value: "0.375rem", label: "Sm", className: "rounded" }, // Tailwind 'rounded'
  { value: "0.5rem", label: "Md", className: "rounded-md" },
  { value: "0.75rem", label: "Lg", className: "rounded-lg" },
  { value: "9999px", label: "Full", className: "rounded-full" },
];

const shadowOptions = [
  { value: "none", label: "None", className: "shadow-none" },
  {
    value: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    label: "Sm",
    className: "shadow-sm",
  },
  {
    value: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    label: "Md",
    className: "shadow-md",
  },
  {
    value: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    label: "Lg",
    className: "shadow-lg",
  },
];

const borderOptions = [
  { value: "0px", label: "None" },
  { value: "1px", label: "1px" },
  { value: "2px", label: "2px" },
  { value: "4px", label: "4px" },
];

const transparencyOptions = [
  { value: "1", label: "Opaque" }, // Opacity 100%
  { value: "0.75", label: "75%" }, // Opacity 75%
  { value: "0.5", label: "50%" }, // Opacity 50%
];

const backgroundTypeOptions = [
  { value: "none", label: "None" },
  { value: "color", label: "Color" },
  //{ value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
  //{ value: "video", label: "Video" },
];

const ThemeDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false);
  const [activeThemeMenu, setActiveThemeMenu] = useState("colors");
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const { page, updatePage, theme, updateTheme } = usePageBuilderStore();

  const setPreviewMode = usePageBuilderStore((state) => state.setPreviewMode);
  const formSchema = z.object({
    backgroundSource: z.string().optional(), // Simplified schema for URL/Gradient/etc.
    backgroundColor: z.string().optional(), // For the color picker specifically
  });
  const [currentBackgroundType, setCurrentBackgroundType] = useState(
    page?.settings?.backgroundType ?? "color" // Default to color
  );
  const [currentBackgroundSource, setCurrentBackgroundSource] = useState(
    page?.settings?.backgroundSource ?? ""
  );

  useEffect(() => {
    setPreviewMode(true);
    return () => {
      setPreviewMode(false);
    };
  }, [setPreviewMode]);

  const PAGE_WIDTH = 1280;

  useEffect(() => {
    const container = previewContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      const containerWidth = container.offsetWidth;
      setScale(containerWidth / PAGE_WIDTH);
    });

    observer.observe(container);

    // Initial scale calculation
    const containerWidth = container.offsetWidth;
    setScale(containerWidth / PAGE_WIDTH);

    return () => {
      observer.disconnect();
    };
  }, []);

  const debouncedUpdateTheme = useCallback(
    debounce((updates: Partial<PageTheme>) => {
      updateTheme(updates);
    }, 100),
    []
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      backgroundSource:
        currentBackgroundType === "image" || currentBackgroundType === "video"
          ? currentBackgroundSource
          : "",
      backgroundColor:
        currentBackgroundType === "color" ? currentBackgroundSource : "",
    },
  });

  // Update form defaults when local state changes
  useEffect(() => {
    setCurrentBackgroundType(page?.settings?.backgroundType ?? "color");
    setCurrentBackgroundSource(page?.settings?.backgroundSource ?? "");
    form.reset({
      backgroundSource:
        currentBackgroundType === "image" ||
        currentBackgroundType === "video" ||
        currentBackgroundType === "gradient"
          ? currentBackgroundSource
          : "",
      backgroundColor:
        currentBackgroundType === "color"
          ? currentBackgroundSource
          : theme.colors.background.page, // Use theme default if empty
    });
  }, [
    page,
    currentBackgroundType,
    currentBackgroundSource,
    form,
    theme.colors.background.page,
  ]);

  const handlePrimaryColorChange = (newPrimaryColor: string) => {
    const textColorOptions = ["#FFFFFF", "#000000"]; // Common accessible choices
    const newPrimaryColorHex = hexToRgb(newPrimaryColor);
    // const accessibleBtnForeground = getAccessibleTextColor(
    //   newPrimaryColor,
    //   textColorOptions,
    //   4.5
    // );

    const textColor =
      getBrightness(newPrimaryColorHex) > 128 || newPrimaryColorHex.a < 0.5
        ? "#000000"
        : "#FFFFFF";

    debouncedUpdateTheme({
      colors: {
        ...theme.colors,
        palette: {
          ...theme.colors.palette,
          primary: newPrimaryColor,
          // Update btnForeground only if accessible color is found
          ...(textColor && {
            btnForeground: textColor,
          }),
        },
      },
    });
  };

  const handleCardBackgroundColorChange = (newPageBgColor: string) => {
    const newPageBgColorHex = hexToRgb(newPageBgColor);

    const textColor =
      getBrightness(newPageBgColorHex) > 128 || newPageBgColorHex.a < 0.5
        ? "#000000"
        : "#FFFFFF";

    debouncedUpdateTheme({
      colors: {
        ...theme.colors,
        background: {
          ...theme.colors.background,
          card: newPageBgColor,
        },
        text: {
          ...theme.colors.text,
          ...(textColor && { card: textColor }),
        },
      },
    });
  };

  const handleBackgroundTypeChange = useCallback(
    (value: string) => {
      // Accept string from Select

      if (!page) return; // Ensure page exists
      const newPage = {
        ...page,
        settings: {
          ...page.settings,
          backgroundType: value,
        },
      };

      updatePage(newPage);
    },
    [page, currentBackgroundSource]
  );

  const handlePageBackgroundColorChange = (newPageBgColor: string) => {
    if (!page) return; // Ensure page exists
    const newPageBgColorHex = hexToRgb(newPageBgColor);
    const textColor =
      getBrightness(newPageBgColorHex) > 128 || newPageBgColorHex.a < 0.5
        ? "#000000"
        : "#FFFFFF";

    const newPage = {
      ...page,
      settings: {
        ...page.settings,
        backgroundSource: newPageBgColor,
      },
    };
    updatePage(newPage);
    debouncedUpdateTheme({
      colors: {
        ...theme.colors,
        background: {
          ...theme.colors.background,
          page: newPageBgColor,
        },
        text: {
          ...theme.colors.text,
          ...(textColor && { body: textColor }),
        },
      },
    });
  };

  const handlePageBackgroundImageChange = (newValue: string) => {
    console.log(newValue);
    setCurrentBackgroundSource(newValue);
    if (!page) return; // Ensure page exists
    const newPage = {
      ...page,
      settings: {
        ...page.settings,
        backgroundSource: newValue,
      },
    };
    console.log(newPage);
    updatePage(newPage);
  };
  console.log(fontsMap);

  return (
    <>
      <div className="flex w-full max-h-[100vh] ">
        <div className="w-1/2 space-y-1 border-r">
          <div
            className={cn(
              "px-4 py-4 w-full flex flex-col space-y-2 text-center sm:text-left border-b border-editor-border"
            )}
          >
            <h2 className="text-2xl font-bold">Theme Settings</h2>
            <p className="text-sm">Edit theme </p>
          </div>
          <div className="flex h-full min-h-[60vh] ">
            <Tabs
              value={activeThemeMenu}
              onValueChange={(value) => setActiveThemeMenu(value)}
              orientation="vertical"
              className="flex w-full "
            >
              {/* Filters */}

              <TabsList className="flex flex-col justify-start w-56 border-r bg-white p-2 rounded-none h-full   px-4 py-3  border-editor-border ">
                {themeMenu.map((menu) => (
                  <div
                    key={menu.value}
                    className="flex w-full min-w-0 flex-col gap-1"
                  >
                    <TabsTrigger
                      key={menu.name}
                      value={menu.value}
                      className="w-full text-foreground rounded-md justify-start data-[state=active]:bg-white data-[state=active]:text-primary"
                    >
                      {menu.icon}
                      {menu.name}
                    </TabsTrigger>
                  </div>
                ))}
              </TabsList>

              {/* Product grid */}
              <div className="w-full  flex-1 px-2 py-3  rounded-xl">
                <TabsContent value="colors">
                  <ColorsThemingTab />
                </TabsContent>
                <TabsContent value="fonts">
                  <FontsThemingTab />
                </TabsContent>
                <TabsContent value="design">
                  <div className="space-y-4 ">
                    <h2 className="text-lg font-semibold tracking-tight capitalize">
                      Design
                    </h2>
                    {/* <p className="text-sm text-muted-foreground">
                      Select a template to add to your page
                    </p> */}
                  </div>

                  <ScrollArea className="h-[30rem] overflow-hidden">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-4 mt-2">
                        <div className="space-y-2">
                          <h4 className="text-base font-semibold">Cards</h4>
                          <div className="space-y-6 p-2">
                            <div className="">
                              <p className="mb-2 text-sm  ">Roundness</p>
                              <div className=" flex items-center w-full ">
                                <ToggleGroup
                                  type="single"
                                  variant="outline"
                                  value={
                                    theme.design.card.roundness || "0.5rem"
                                  }
                                  onValueChange={(value) => {
                                    if (value)
                                      debouncedUpdateTheme({
                                        design: {
                                          ...theme.design,
                                          card: {
                                            ...theme.design.card,
                                            roundness: value,
                                          },
                                        },
                                      });
                                  }}
                                  className="w-full flex flex-row flex-nowrap items-center justify-start gap-2"
                                >
                                  {roundnessOptions.map((opt) => (
                                    <ToggleGroupItem
                                      key={opt.value}
                                      value={opt.value}
                                      aria-label={opt.label}
                                      className="h-10 w-10 p-0 bg-muted data-[state=on]:bg-transparent data-[state=on]:shadow-none data-[state=on]:border-blue-500 data-[state=on]:ring-1 data-[state=on]:ring-blue-500"
                                    >
                                      <div
                                        className={cn(
                                          "h-6 w-6 border-2 bg-white border-gray-300 ",
                                          opt.className
                                        )}
                                      ></div>
                                    </ToggleGroupItem>
                                  ))}
                                </ToggleGroup>
                              </div>
                            </div>
                            <div className="">
                              <p className="mb-2 text-sm  ">Card shadow</p>
                              <div className=" flex items-center  w-full ">
                                <ToggleGroup
                                  type="single"
                                  variant="outline"
                                  value={theme.design.card.shadow || "none"}
                                  onValueChange={(value) => {
                                    if (value)
                                      debouncedUpdateTheme({
                                        design: {
                                          ...theme.design,
                                          card: {
                                            ...theme.design.card,
                                            shadow: value,
                                          },
                                        },
                                      });
                                  }}
                                  className="w-full flex flex-row flex-nowrap items-center justify-start gap-2"
                                >
                                  {shadowOptions.map((opt) => (
                                    <ToggleGroupItem
                                      key={opt.value}
                                      value={opt.value}
                                      aria-label={opt.label}
                                      className="h-10 w-10 p-0 bg-muted data-[state=on]:bg-transparent data-[state=on]:shadow-none data-[state=on]:border-blue-500 data-[state=on]:ring-1 data-[state=on]:ring-blue-500"
                                    >
                                      <div
                                        className={cn(
                                          "h-6 w-6 border border-gray-200 bg-white rounded-md",
                                          opt.className // Applies the shadow class for visual cue
                                        )}
                                      ></div>
                                    </ToggleGroupItem>
                                  ))}
                                </ToggleGroup>
                              </div>
                            </div>
                            <div className="">
                              <p className="mb-2 text-sm font-medium text-gray-700">
                                Card border
                              </p>
                              <div className=" flex items-center  w-full ">
                                <ToggleGroup
                                  type="single"
                                  variant="outline"
                                  value={theme.design.card.border || "0px"}
                                  onValueChange={(value) => {
                                    if (value)
                                      debouncedUpdateTheme({
                                        design: {
                                          ...theme.design,
                                          card: {
                                            ...theme.design.card,
                                            border: value,
                                          },
                                        },
                                      });
                                  }}
                                  className="w-fit flex flex-row flex-nowrap items-center justify-start gap-0 rounded-lg border bg-gray-100 p-0.5"
                                >
                                  {borderOptions.map((opt) => (
                                    <ToggleGroupItem
                                      key={opt.value}
                                      value={opt.value}
                                      aria-label={opt.label}
                                      className="h-8 min-w-[2.5rem] rounded-[5px] border-none px-2 data-[state=on]:bg-white data-[state=on]:text-gray-800 data-[state=on]:shadow-sm"
                                    >
                                      {opt.label === "None" ? (
                                        <div className="flex items-center justify-center">
                                          <span className="text-lg text-gray-400">
                                            ø
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-center w-full h-full">
                                          <div
                                            className="bg-gray-500 w-4"
                                            style={{
                                              height:
                                                opt.value === "1px"
                                                  ? "1.5px"
                                                  : opt.value === "2px"
                                                    ? "2.5px"
                                                    : opt.value === "4px"
                                                      ? "3.5px"
                                                      : "1px",
                                            }}
                                          ></div>
                                        </div>
                                      )}
                                    </ToggleGroupItem>
                                  ))}
                                </ToggleGroup>
                              </div>
                            </div>

                            <div className="">
                              <p className="mb-[0.5rem] text-xs  ">
                                Border color
                              </p>
                              <div className=" flex items-center  ">
                                <ColorPicker
                                  color={
                                    theme.design.card.border_color || "#000000"
                                  }
                                  onChange={(newColor) =>
                                    debouncedUpdateTheme({
                                      design: {
                                        ...theme.design,
                                        card: {
                                          ...theme.design.card,
                                          border_color: newColor,
                                        },
                                      },
                                    })
                                  }
                                  className="w-full max-w-xs"
                                />
                              </div>
                            </div>

                            <div className="">
                              <p className="mb-[0.5rem] text-xs  ">
                                Card Transparency
                              </p>
                              <div className=" flex items-center  w-full ">
                                <ToggleGroup
                                  type="single"
                                  variant="outline"
                                  value={theme.design.card.transparency || "1"}
                                  onValueChange={(value) => {
                                    if (value)
                                      debouncedUpdateTheme({
                                        design: {
                                          ...theme.design,
                                          card: {
                                            ...theme.design.card,
                                            transparency: value,
                                          },
                                        },
                                      });
                                  }}
                                  className="w-full  flex flex-row flex-nowrap items-center justify-start gap-2"
                                >
                                  {transparencyOptions.map((opt) => (
                                    <ToggleGroupItem
                                      key={opt.value}
                                      value={opt.value}
                                      aria-label={opt.label}
                                      className="h-10 w-10 p-0 data-[state=on]:bg-indigo-100 data-[state=on]:text-indigo-700"
                                    >
                                      <div
                                        className={cn(
                                          "h-6 w-6 border-2 border-gray-300 rounded-sm bg-gray-100 flex items-center justify-center",
                                          theme.design.card.transparency ===
                                            opt.value &&
                                            "border-indigo-500 ring-2 ring-indigo-500"
                                        )}
                                        style={{
                                          opacity: parseFloat(opt.value),
                                        }}
                                      ></div>
                                    </ToggleGroupItem>
                                  ))}
                                </ToggleGroup>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
        <div className="w-1/2 p-4 " ref={previewContainerRef}>
          <div
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              width: `${PAGE_WIDTH}px`,
              height: "185vh",
            }}
          >
            <div className="relative h-full w-full">
              <IframeContent />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThemeDialog;
