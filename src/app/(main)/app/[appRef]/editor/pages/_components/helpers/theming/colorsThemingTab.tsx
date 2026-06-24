// File: src/app/(main)/app/[appRef]/editor/pages/_components/theme-fonts-editor.tsx
"use client";

import { Check, ChevronsUpDown, Undo2 } from "lucide-react";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { debounce } from "lodash";
import { cn, getBrightness, hexToRgb } from "@/lib/utils";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { PageTheme } from "@/stores/pageEditorStore/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fontsMap } from "@/lib/fonts/index";
import { ColorPicker } from "@/components/global/colorPicker";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import FileUpload from "@/components/global/file-upload";
const backgroundTypeOptions = [
  { value: "none", label: "None" },
  { value: "color", label: "Color" },
  //{ value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
  //{ value: "video", label: "Video" },
];
const ColorsThemingTab = () => {
  const { page, updatePage, theme, updateTheme } = usePageBuilderStore();

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

  return (
    <>
      <div className="relative ">
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Colors</h2>
        </div>
        <ScrollArea>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <h4 className=" text-base font-semibold">Background</h4>
                <div className="space-y-2 px-2">
                  <div className="mb-2">
                    <p className="mb-[0.5rem] text-xs  ">Page Background</p>
                    <div className=" flex items-center  mb-6">
                      <Select
                        value={currentBackgroundType}
                        onValueChange={handleBackgroundTypeChange}
                      >
                        <SelectTrigger className="w-[60%] h-9 text-xs">
                          <SelectValue placeholder="Select background type" />
                        </SelectTrigger>
                        <SelectContent>
                          {backgroundTypeOptions.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="text-xs"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {/* <ColorPicker
                                              color={theme.colors.background.page}
                                              onChange={handlePageBackgroundColorChange} // Use updated handler
                                              className="w-full bg-editor-background border border-editor-border"
                                            /> */}
                    </div>
                    <div>
                      {/* Conditional Inputs */}
                      {currentBackgroundType === "color" && (
                        <div className="flex items-center space-x-2">
                          <ColorPicker
                            color={
                              currentBackgroundSource ||
                              theme.colors.background.page
                            } // Use theme default if source is empty
                            onChange={handlePageBackgroundColorChange}
                            className="w-[60%] h-8 border border-editor-border"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-4 h-4"
                            //onClick={() => handleBackgroundSourceChange("")}
                          >
                            <Undo2 className="text-destructive w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      {currentBackgroundType === "gradient" && (
                        <FormControl>
                          <Input
                            placeholder="e.g., linear-gradient(...)"
                            className="h-8 text-xs"
                            value={currentBackgroundSource}
                            //onChange={(e) => handleBackgroundSourceChange(e.target.value)}
                          />
                        </FormControl>
                      )}
                      {currentBackgroundType === "image" && (
                        <div className="space-y-2">
                          <Form {...form}>
                            <FormField
                              control={form.control}
                              name="backgroundSource"
                              render={({ field }) => (
                                <FormItem className="text-xs">
                                  <FormLabel className="text-xs">
                                    Image URL
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      className="h-8 text-xs"
                                      placeholder="Paste image URL..."
                                      {...field} // Use RHF field props
                                      onChange={(e) => {
                                        field.onChange(e); // Update RHF
                                        handlePageBackgroundImageChange(
                                          e.target.value
                                        ); // Update store
                                      }}
                                    />
                                  </FormControl>
                                  <FormMessage className="text-xs" />
                                </FormItem>
                              )}
                            />
                            <div className="flex items-center space-x-2">
                              <Separator className="flex-1" />
                              <span className="text-xs text-muted-foreground">
                                OR
                              </span>
                              <Separator className="flex-1" />
                            </div>
                            <FormField
                              control={form.control}
                              name="backgroundSource" // Link to the same field
                              render={() => (
                                <FormItem className="text-xs">
                                  <FormLabel className="text-xs">
                                    Upload Image
                                  </FormLabel>
                                  <FormControl>
                                    <FileUpload
                                      apiEndpoint="media"
                                      onChange={(url: string | undefined) => {
                                        handlePageBackgroundImageChange(
                                          url as string
                                        );
                                      }}
                                      value={currentBackgroundSource}
                                      onDelete={() => {
                                        handlePageBackgroundImageChange("");
                                        return Promise.resolve();
                                      }}
                                    />
                                  </FormControl>
                                </FormItem>
                              )}
                            />
                          </Form>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="">
                    <p className="mb-[0.5rem] text-xs  ">Card Background</p>
                    <div className=" flex items-center  ">
                      <ColorPicker
                        color={theme.colors.background.card}
                        onChange={handleCardBackgroundColorChange}
                        className="w-[60%]  border border-editor-border"
                      />
                    </div>
                  </div>

                  <div className="">
                    <p className="mb-[0.5rem] text-xs ">Buttons</p>
                    <div className=" flex items-center  ">
                      <ColorPicker
                        color={theme.colors.palette.primary}
                        onChange={handlePrimaryColorChange} // Use updated handler
                        className="w-[60%]  border border-editor-border"
                      />
                    </div>
                  </div>
                  {/* <div className="">
                                            <h2 className="mb-[0.5rem] text-base/7  ">
                                              Secondary
                                            </h2>
                                            <div className=" flex items-center  ">
                                              <ColorPicker
                                                color={theme.colors.palette.secondary}
                                                onChange={(newColor) =>
                                                  debouncedUpdateTheme({
                                                    colors: {
                                                      ...theme.colors,
                                                      palette: {
                                                        ...theme.colors.palette,
                                                        secondary: newColor,
                                                      },
                                                    },
                                                  })
                                                }
                                                className="w-full bg-editor-background border border-editor-border"
                                              />
                                            </div>
                                          </div> */}
                </div>
              </div>

              <div className="space-y-2 ">
                <h4 className="text-base font-semibold">Text Colors</h4>
                <div className="space-y-2 px-2">
                  <div className="">
                    <p className="mb-[0.5rem] text-xs  ">Heading</p>
                    <div className=" flex items-center  ">
                      <ColorPicker
                        color={theme.colors.text.heading}
                        onChange={(newColor) =>
                          debouncedUpdateTheme({
                            colors: {
                              ...theme.colors,
                              text: {
                                ...theme.colors.text,
                                heading: newColor,
                              },
                            },
                          })
                        }
                        className="w-[60%] border border-editor-border"
                      />
                    </div>
                  </div>
                  <div className="">
                    <p className="mb-[0.5rem] text-xs  ">Body</p>
                    <div className=" flex items-center  ">
                      <ColorPicker
                        color={theme.colors.text.body}
                        onChange={(newColor) =>
                          debouncedUpdateTheme({
                            colors: {
                              ...theme.colors,
                              text: {
                                ...theme.colors.text,
                                body: newColor,
                              },
                            },
                          })
                        }
                        className="w-[60%]  border border-editor-border"
                      />
                    </div>
                  </div>

                  <div className="">
                    <p className="mb-[0.5rem] text-xs ">Button Text</p>
                    <div className=" flex items-center  ">
                      <ColorPicker
                        color={theme.colors.palette.btnForeground}
                        // Optionally allow manual override
                        onChange={(newColor) =>
                          debouncedUpdateTheme({
                            colors: {
                              ...theme.colors,
                              palette: {
                                ...theme.colors.palette,
                                btnForeground: newColor,
                              },
                            },
                          })
                        }
                        className="w-[60%]  border border-editor-border"
                      />
                    </div>
                  </div>
                  <div className="">
                    <p className="mb-[0.5rem] text-xs  ">Card heading</p>
                    <div className=" flex items-center  ">
                      <ColorPicker
                        color={theme.colors.text.card_heading_foreground} // Match theme structure
                        onChange={(newColor) =>
                          debouncedUpdateTheme({
                            colors: {
                              ...theme.colors,
                              text: {
                                ...theme.colors.text,
                                card_heading_foreground: newColor, // Match theme structure
                              },
                            },
                          })
                        }
                        className="w-[60%]  border border-editor-border"
                      />
                    </div>
                  </div>
                  {/* <div className="">
                                          <p className="mb-[0.5rem] text-xs  ">Card Body</p>
                                          <div className=" flex items-center  ">
                                            <ColorPicker
                                              color={theme.colors.text.card_body_foreground} // Match theme structure
                                              onChange={(newColor) =>
                                                debouncedUpdateTheme({
                                                  colors: {
                                                    ...theme.colors,
                                                    text: {
                                                      ...theme.colors.text,
                                                      card_body_foreground: newColor, // Match theme structure
                                                    },
                                                  },
                                                })
                                              }
                                              className="w-full bg-editor-background border border-editor-border"
                                            />
                                          </div>
                                        </div> */}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default ColorsThemingTab;
