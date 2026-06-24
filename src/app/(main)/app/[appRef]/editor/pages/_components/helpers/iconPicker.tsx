"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { LucideProps } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { RiImageEditFill } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";
import { ScrollArea } from "@/components/ui/scroll-area"; // Needed for large lists
import { lucideIcons, lucideIconNames } from "@/lib/lucideIconList"; // Adjust path
//import { useDebounce } from "@/hooks/use-debounce"; // Assuming you have a debounce hook
import { cn } from "@/lib/utils";
import { debounce } from "lodash";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  editorTrigger?: React.ReactNode;
  onClose?: () => void; // Optional: To close the sheet/modal
}

const IconPicker: React.FC<IconPickerProps> = ({
  value,
  onChange,
  editorTrigger,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  // --- Create a debounced function to update the filterQuery ---
  const debouncedSetFilterQuery = useMemo(
    () =>
      debounce((query: string) => {
        setFilterQuery(query);
      }, 300), // 300ms debounce delay
    [] // Empty dependency array means this is created only once
  );

  // --- Cleanup the debounced function on unmount ---
  useEffect(() => {
    // Cleanup function to cancel any pending debounced calls
    return () => {
      debouncedSetFilterQuery.cancel();
    };
  }, [debouncedSetFilterQuery]);

  const filteredIcons = useMemo(() => {
    // Use filterQuery here
    if (!filterQuery) {
      return lucideIconNames;
    }
    return lucideIconNames.filter((name) =>
      name.toLowerCase().includes(filterQuery.toLowerCase())
    );
  }, [filterQuery]); // Depend on filterQuery

  const handleSelect = useCallback(
    (iconName: string) => {
      onChange(iconName);

      onClose?.(); // Close if handler provided
    },
    [onChange, onClose]
  );

  const handleInputChange = (query: string) => {
    setSearchQuery(query); // Update input value immediately
    debouncedSetFilterQuery(query); // Call the debounced function to update filter query later
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild className="w-full">
        {editorTrigger}
        {/* <div className="group/individualScoreTextBlockIcon w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/individualScoreTextBlockIcon:opacity-100 rounded-md z-40">
            <BiEdit className="h-4 w-4 text-white" />
          </div>
          <DynamicLucideIcon
            name={value}
            className="w-14 h-14 md:w-20 md:h-20"
          />
        </div> */}
      </PopoverTrigger>
      <PopoverContent className="w-full max-h-60 p-0" align="start">
        <Command shouldFilter={false} className="h-[400px]">
          {" "}
          {/* Disable internal filtering, we do it manually */}
          <CommandInput
            value={searchQuery}
            onValueChange={handleInputChange}
            placeholder="Search icons..."
            aria-label="Search icons"
            className="h-8 mt-2"
          />
          <CommandList>
            <ScrollArea className="h-[320px] pr-2">
              {" "}
              {/* Wrap list in ScrollArea */}
              <CommandEmpty>No icons found.</CommandEmpty>
              {/* Consider using virtualization here for > 200 icons */}
              <div className="grid grid-cols-5 md:grid-cols-8 gap-2 p-2">
                {" "}
                {/* Grid layout */}
                {filteredIcons.map((iconName) => {
                  const IconComponent = lucideIcons[iconName];
                  if (!IconComponent) return null; // Should not happen with map

                  return (
                    <CommandItem
                      key={iconName}
                      value={iconName} // Important for Command navigation
                      onSelect={() => handleSelect(iconName)}
                      className={cn(
                        "flex flex-col items-center justify-center h-20 p-1 rounded-md cursor-pointer text-center", // Style the item
                        "hover:bg-accent hover:text-accent-foreground",
                        value === iconName && "bg-accent text-accent-foreground" // Highlight selected
                      )}
                      aria-label={iconName}
                    >
                      <IconComponent className="w-6 h-6 mb-1" />
                      <span className="text-xs truncate w-full">
                        {iconName}
                      </span>
                    </CommandItem>
                  );
                })}
              </div>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default IconPicker;
