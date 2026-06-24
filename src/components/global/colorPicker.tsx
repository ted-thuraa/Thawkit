"use client";

import { useState, useEffect } from "react";
import Sketch from "@uiw/react-color-sketch";
import { colord, extend } from "colord";
import namesPlugin from "colord/plugins/names";
extend([namesPlugin]);

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { Pipette } from "lucide-react";

type ColorMode = "hex" | "rgb" | "hsl";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  className?: string;
  initialColorMode?: ColorMode;
  size?: "default" | "lg" | "sm";
}

export const ColorPicker = ({
  color,
  onChange,
  className,
  initialColorMode = "hex",
}: ColorPickerProps) => {
  // Use a controlled state for the popover
  const [open, setOpen] = useState(false);

  const [hex, setHex] = useState("#fff");
  /** Sync with external color prop */
  useEffect(() => {
    setHex(color);
  }, []);

  return (
    // Make it a controlled component using 'open' and 'onOpenChange'
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {/* ... PopoverTrigger content ... (no change needed here) */}
        <div
          className={cn(
            "relative flex items-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors cursor-pointer",
            "hover:bg-accent hover:text-accent-foreground",
            className
          )}
        >
          {/** Color preview square */}
          {color && color !== "" && color !== "transparent" ? (
            <div
              className="h-4 w-4 rounded-full border border-zinc-200 mr-2 shrink-0 bg-cover"
              style={{
                backgroundColor: hex,
              }}
            />
          ) : (
            <div
              className="h-4 w-4 rounded-full border border-zinc-200 mr-2 shrink-0 bg-cover"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23f3f4f6'%3E%3Cpath d='M0 0h4v4H0zm4 4h4v4H4z'/%3E%3C/g%3E%3C/svg%3E\")",
                backgroundBlendMode: "multiply",
              }}
            />
          )}

          <span className="flex-1 truncate font-medium uppercase">{hex}</span>
        </div>
      </PopoverTrigger>

      <PopoverContent
        className="w-[280px] absolute p-0"
        align="start"
        onPointerDownOutside={(e) => {
          e.preventDefault();
        }}
        // Prevent closing when focus is lost (i.e., clicking another input/element)
        onCloseAutoFocus={(e) => {
          e.preventDefault();
        }}
        // Prevent closing when Escape key is pressed (Optional, remove if you want Escape to close)
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
        // Standard check to stop propagation of internal events
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
      >
        {/** MAIN COLOR PICKER */}
        <div className="w-full h-full">
          <Sketch
            color={hex}
            onChange={(newColor) => {
              setHex(newColor.hex);
              onChange(newColor.hex);
            }}
            presetColors={[]}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
