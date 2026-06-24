// File: src/app/(main)/app/[appRef]/editor/pages/_components/theme-fonts-editor.tsx
"use client";

import { Check, ChevronsUpDown } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { PageTheme } from "@/stores/pageEditorStore/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fontsMap } from "@/lib/fonts/index";

const FontsThemingTab = () => {
  const { theme, updateTheme } = usePageBuilderStore();

  const debouncedUpdateTheme = useCallback(
    debounce((updates: Partial<PageTheme>) => {
      updateTheme(updates);
    }, 100),
    []
  );

  return (
    <>
      <div className="relative ">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight capitalize">
            Font
          </h2>
        </div>
        <ScrollArea>
          <div className="grid grid-cols-1 gap-4">
            {/* --- HEADINGS SECTION --- */}
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <h4 className="text-base font-semibold">Headings</h4>
                <div className="space-y-2 px-2">
                  <div className="">
                    <p className="mb-[0.5rem] text-xs">Font Family</p>
                    <div className=" flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-[20rem] justify-between"
                          >
                            {theme.typography.headings.fontFamily
                              ? fontsMap[
                                  theme.typography.headings
                                    .fontFamily as keyof typeof fontsMap
                                ]?.name
                              : "Select font..."}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[20rem] p-0">
                          <Command>
                            <CommandInput placeholder="Search font..." />
                            <CommandList>
                              <CommandEmpty>No fonts found.</CommandEmpty>
                              <CommandGroup>
                                {Object.values(fontsMap).map((font) => (
                                  <CommandItem
                                    key={font.key}
                                    value={font.name} // Use name for search/display
                                    onSelect={() =>
                                      debouncedUpdateTheme({
                                        typography: {
                                          ...theme.typography,
                                          headings: {
                                            ...theme.typography.headings,
                                            // FIX: Save the KEY ("inter"), not the complex string
                                            fontFamily: font.key,
                                          },
                                        },
                                      })
                                    }
                                    className={cn(
                                      "cursor-pointer",
                                      font.className
                                    )}
                                    // Preview the font style
                                    style={font.style}
                                  >
                                    {font.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        theme.typography.headings.fontFamily ===
                                          font.key
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
                    </div>
                  </div>
                  <div className="">
                    <p className="mb-[0.5rem] text-xs">Font Weight</p>
                    <div className=" flex items-center">
                      <Select
                        value={theme.typography.headings.weight}
                        onValueChange={(value) =>
                          debouncedUpdateTheme({
                            typography: {
                              ...theme.typography,
                              headings: {
                                ...theme.typography.headings,
                                weight: value as "normal" | "medium" | "bold",
                              },
                            },
                          })
                        }
                      >
                        <SelectTrigger className="col-span-2">
                          <SelectValue placeholder="Select weight" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* --- BODY SECTION --- */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold">Body text</h4>
              <div className="space-y-2">
                <div className="">
                  <p className="mb-[0.5rem] text-xs  ">Font Family</p>
                  <div className=" flex items-center  ">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[20rem] justify-between"
                        >
                          {theme.typography.body.fontFamily
                            ? fontsMap[
                                theme.typography.body
                                  .fontFamily as keyof typeof fontsMap
                              ]?.name
                            : "Select font..."}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[20rem] p-0">
                        <Command>
                          <CommandInput placeholder="Search font..." />
                          <CommandList>
                            <CommandEmpty>No fonts found.</CommandEmpty>
                            <CommandGroup>
                              {Object.values(fontsMap).map((font) => (
                                <CommandItem
                                  key={font.key}
                                  value={font.name}
                                  onSelect={() =>
                                    debouncedUpdateTheme({
                                      typography: {
                                        ...theme.typography,
                                        body: {
                                          ...theme.typography.body,
                                          // FIX: Save the KEY
                                          fontFamily: font.key,
                                        },
                                      },
                                    })
                                  }
                                  className={cn(
                                    "cursor-pointer",
                                    font.className
                                  )}
                                  style={font.style}
                                >
                                  {font.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      theme.typography.body.fontFamily ===
                                        font.key
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
                  </div>
                </div>
                <div className="">
                  <p className="mb-[0.5rem] text-xs  ">Font Weight</p>
                  <div className=" flex items-center  ">
                    <Select
                      value={theme.typography.body.weight}
                      onValueChange={(value) =>
                        debouncedUpdateTheme({
                          typography: {
                            ...theme.typography,
                            body: {
                              ...theme.typography.body,
                              weight: value as "normal" | "medium",
                            },
                          },
                        })
                      }
                    >
                      <SelectTrigger className="col-span-2">
                        <SelectValue placeholder="Select weight" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  );
};

export default FontsThemingTab;
