"use client";

import clsx from "clsx";
import React, { useCallback, useEffect, useState } from "react";
import { v4 } from "uuid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

import {
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
  ArrowDownToLine,
  ArrowDownFromLine,
  ArrowUpToLine,
  FoldVertical,
  RectangleHorizontalIcon,
  Columns2,
  X,
  RotateCcw,
  MoreHorizontal,
  GitFork,
  ChevronDown,
  Briefcase,
  LayoutList,
} from "lucide-react";
import { BsCardImage } from "react-icons/bs";
import { MdInvertColors } from "react-icons/md";
import { MdColorLens } from "react-icons/md";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SheetProvider } from "@/providers/sheet-provider";
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

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { ColorPicker } from "@/components/global/colorPicker";
import { Switch } from "@/components/ui/switch";
import {
  ElementNode,
  SectionVisibilityLogic,
  VisibilityLogicType,
} from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

type Props = { section: ElementNode };

const VisibilityLogicEditor = ({ section }: Props) => {
  const {
    selectedSectionId,
    theme,
    categories,
    updateElementProperty,
    updateSection,
    removeSection,
    setSelectedSectionId,
    duplicateSection,
    toggleSectionVisibility,
  } = usePageBuilderStore();
  const { id, content, name, className, type } = section;
  // Set default values for controlled components
  const currentLogic: SectionVisibilityLogic[] = section.settings
    ?.visibilityLogic
    ? section.settings?.visibilityLogic
    : [{ type: "ALWAYS_VISIBLE", categoryId: null }]; // The specific category to match against}];
  const logicType = currentLogic[0]?.type
    ? currentLogic[0]?.type
    : "ALWAYS_VISIBLE";
  const selectedCategoryId = currentLogic[0]?.categoryId ?? "";

  const handleTypeChange = (newType: VisibilityLogicType) => {
    const newLogic: SectionVisibilityLogic[] = [
      {
        type: newType,
        // If switching back to 'ALWAYS_VISIBLE', clear the categoryId.
        // Otherwise, preserve the previously selected category.
        categoryId: newType === "ALWAYS_VISIBLE" ? null : selectedCategoryId,
      },
    ];
    // Use the existing generic action to update the element's property
    updateElementProperty(id, "settings.visibilityLogic", newLogic);
  };

  const handleCategoryChange = (newCategoryId: string) => {
    // This handler can only be triggered when a logic type is already selected
    const newLogic: SectionVisibilityLogic[] = [
      {
        type: logicType,
        categoryId: newCategoryId,
      },
    ];
    updateElementProperty(id, "settings.visibilityLogic", newLogic);
  };

  return (
    <div className="w-full flex items-start justify-center ">
      {/* Body */}
      <div className="w-full p-4 flex flex-col gap-4">
        {/* Condition Type Selector */}
        <div className="flex items-center">
          <label
            htmlFor="condition-type"
            className="text-sm text-slate-700 w-1/3"
          >
            Show Section When
          </label>
          <div className="w-2/3">
            <Select
              value={logicType}
              onValueChange={(value: VisibilityLogicType) =>
                handleTypeChange(value)
              }
            >
              <SelectTrigger id={`visibility-type-${id}`}>
                <SelectValue placeholder="Select visibility rule..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALWAYS_VISIBLE">Always Visible</SelectItem>
                <SelectItem value="HIGHEST_SCORE_CATEGORY">
                  Is Highest Score Category
                </SelectItem>
                <SelectItem value="LOWEST_SCORE_CATEGORY">
                  Is Lowest Score Category
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Properties Section */}
        {logicType !== "ALWAYS_VISIBLE" && (
          <>
            <hr className="border-slate-200" />
            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-medium text-slate-500">
                  Condition
                </h2>
              </div>
              <div className="flex flex-col gap-3">
                <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm flex items-start gap-3">
                  <div className="flex-shrink-0 bg-slate-100 p-1.5 rounded-md">
                    <LayoutList size={16} className="text-slate-600" />
                  </div>
                  <div className="flex-grow flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-900">
                        Category
                      </span>
                      {/* <MoreHorizontal
                    size={16}
                    className="text-slate-400 cursor-pointer"
                  /> */}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md ring-1 ring-inset ring-slate-200">
                        is
                      </span>
                      <div className="w-28">
                        <Select
                          value={selectedCategoryId}
                          onValueChange={handleCategoryChange}
                          disabled={categories.length === 0}
                        >
                          <SelectTrigger id={`visibility-category-${id}`}>
                            <SelectValue placeholder="Select a category..." />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.length > 0 ? (
                              categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.title ?? "Untitled Category"}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem value="" disabled>
                                No quiz categories exist.
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
    // <div className="space-y-4 p-4 border-t">
    //   <div className="space-y-2">
    //     <Label htmlFor={`visibility-type-${id}`}>Show Section When</Label>
    //     <Select
    //       value={logicType}
    //       onValueChange={(value: VisibilityLogicType) =>
    //         handleTypeChange(value)
    //       }
    //     >
    //       <SelectTrigger id={`visibility-type-${id}`}>
    //         <SelectValue placeholder="Select visibility rule..." />
    //       </SelectTrigger>
    //       <SelectContent>
    //         <SelectItem value="ALWAYS_VISIBLE">Always Visible</SelectItem>
    //         <SelectItem value="HIGHEST_SCORE_CATEGORY">
    //           Is Highest Score Category
    //         </SelectItem>
    //         <SelectItem value="LOWEST_SCORE_CATEGORY">
    //           Is Lowest Score Category
    //         </SelectItem>
    //       </SelectContent>
    //     </Select>
    //   </div>

    //   {logicType !== "ALWAYS_VISIBLE" && (
    //     <div className="space-y-2">
    //       <Label htmlFor={`visibility-category-${id}`}>Which Category</Label>
    //       <Select
    //         value={selectedCategoryId}
    //         onValueChange={handleCategoryChange}
    //         disabled={categories.length === 0}
    //       >
    //         <SelectTrigger id={`visibility-category-${id}`}>
    //           <SelectValue placeholder="Select a category..." />
    //         </SelectTrigger>
    //         <SelectContent>
    //           {categories.length > 0 ? (
    //             categories.map((cat) => (
    //               <SelectItem key={cat.id} value={cat.id}>
    //                 {cat.title ?? "Untitled Category"}
    //               </SelectItem>
    //             ))
    //           ) : (
    //             <SelectItem value="" disabled>
    //               No quiz categories exist.
    //             </SelectItem>
    //           )}
    //         </SelectContent>
    //       </Select>
    //     </div>
    //   )}
    // </div>
  );
};

export default VisibilityLogicEditor;

export type ConditionOperator = "is" | "is not" | "is any of" | "is none of";
export type LogicGate = "And" | "Or";

export interface ConditionProperty {
  id: string;
  // Using a more specific 'type' can help determine which icon/control to render
  type: "date" | "team" | "position" | "department" | "nested-group";
  label: string;
  operator: ConditionOperator;
  value: string[];
  // For nested rules
  children?: {
    gate: LogicGate;
    conditions: ConditionProperty[];
  }[];
}

export interface PropertiesPanelProps {
  heading?: string; // "Condition"
  title?: string; // "Start date and team details"
  conditionType: string;
  conditionOptions: string[];
  properties: ConditionProperty[];
  // Callback for when any value changes
  onChange?: (updatedProperties: ConditionProperty[]) => void;
}

export const SampleProps: PropertiesPanelProps = {
  heading: "Condition",
  title: "Start date and team details",
  conditionType: "If / else",
  conditionOptions: ["If / else", "Switch", "Always true"],
  properties: [
    {
      id: "prop1",
      type: "date",
      label: "Start date",
      operator: "is",
      value: ["Tomorrow"],
    },
    {
      id: "prop2",
      type: "team",
      label: "Team",
      operator: "is any of",
      value: ["Design", "IT", "Research"],
      children: [
        {
          gate: "And",
          conditions: [
            {
              id: "prop2_child1",
              type: "position",
              label: "Position",
              operator: "is any of",
              value: ["Director", "Manager"],
            },
          ],
        },
        {
          gate: "Or",
          conditions: [
            {
              id: "prop2_child2",
              type: "department",
              label: "Department",
              operator: "is not",
              value: ["Management"],
            },
          ],
        },
      ],
    },
  ],
};

const Chip = ({ text }: { text: string }) => (
  <span className="inline-block px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md ring-1 ring-inset ring-slate-200">
    {text}
  </span>
);

const CustomSelect = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`relative ${className}`}>
    <select className="w-full pl-3 pr-8 py-1.5 text-sm text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
      {children}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
      <ChevronDown size={16} />
    </div>
  </div>
);

const LogicGateBadge = ({ gate }: { gate: LogicGate }) => (
  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 z-10">
    <span className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-full">
      {gate}
    </span>
  </div>
);

const PropertyCard = ({ property }: { property: ConditionProperty }) => {
  //const Icon = getIconForType(property.type);

  return (
    <div className="flex flex-col gap-3">
      {/* Main property card */}
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-sm flex items-start gap-3">
        <div className="flex-shrink-0 bg-slate-100 p-1.5 rounded-md">
          <Briefcase size={16} className="text-slate-600" />
        </div>
        <div className="flex-grow flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-900">
              {property.label}
            </span>
            <MoreHorizontal
              size={16}
              className="text-slate-400 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <CustomSelect className="w-28">
              <option>{property.operator}</option>
              <option>is</option>
              <option>is not</option>
            </CustomSelect>
            <div className="flex gap-1.5 flex-wrap">
              {property.value.map((val) => (
                <Chip key={val} text={val} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Nested children with connector lines */}
      {property.children && property.children.length > 0 && (
        <div className="ml-6 pl-6 border-l-2 border-slate-200 flex flex-col gap-4">
          {property.children.map((childGroup, index) => (
            <div key={index} className="relative flex flex-col gap-3">
              <LogicGateBadge gate={childGroup.gate} />
              {childGroup.conditions.map((cond) => (
                <PropertyCard key={cond.id} property={cond} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const PropertiesPanel = ({
  heading,
  title,
  conditionType,
  conditionOptions,
  properties,
}: PropertiesPanelProps) => {
  return (
    <div className="bg-slate-50 min-h-screen flex items-start justify-center p-4 sm:p-8">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-slate-200">
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <GitFork className="text-purple-600" size={20} />
          <div className="flex-grow">
            <h1 className="text-base font-semibold text-slate-900">
              {heading}
            </h1>
            <p className="text-sm text-slate-500">{title}</p>
          </div>
          <button aria-label="More options">
            <MoreHorizontal className="text-slate-500" size={20} />
          </button>
          <button aria-label="Close panel">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-slate-500"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <hr className="border-slate-200" />

        {/* Body */}
        <div className="p-4 flex flex-col gap-4">
          {/* Condition Type Selector */}
          <div className="flex items-center">
            <label
              htmlFor="condition-type"
              className="text-sm text-slate-700 w-1/3"
            >
              Show Section When
            </label>
            <div className="w-2/3">
              <CustomSelect>
                <option>{conditionType}</option>
                {conditionOptions
                  .filter((opt) => opt !== conditionType)
                  .map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
              </CustomSelect>
            </div>
          </div>
          <hr className="border-slate-200" />

          {/* Properties Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-medium text-slate-500">Properties</h2>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Check if / else
              </a>
            </div>
            <div className="flex flex-col gap-3">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
