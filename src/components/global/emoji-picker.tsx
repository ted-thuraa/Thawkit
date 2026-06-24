"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import data from "@emoji-mart/data";

import { Pencil } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  emoji: string;
}

// export function EmojiPicker({ onEmojiSelect, emoji }: EmojiPickerProps) {
//   const [isOpen, setIsOpen] = React.useState(false);

//   return (
//     <Popover open={isOpen} onOpenChange={setIsOpen}>
//       <PopoverTrigger asChild>
//         <div className="group/emoji relative">
//           <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/emoji:opacity-100 rounded-md z-[100]">
//             <Pencil className="h-4 w-4 text-white" />
//           </div>
//           <div
//             className="text-zero cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
//             style={{ opacity: 1, width: "auto" }}
//           >
//             <span
//               style={{
//                 fontSize: "20px",
//                 fontFamily:
//                   'EmojiMart, "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"',
//               }}
//             >
//               {emoji}
//             </span>
//           </div>
//         </div>
//       </PopoverTrigger>
//       <PopoverContent className="w-full max-h-60 p-0" align="start">
//         <Picker
//           data={data}
//           onEmojiSelect={(emoji: any) => {
//             onEmojiSelect(emoji.native);
//             setIsOpen(false);
//           }}
//           theme="light"
//           set="native"
//           previewPosition="none"
//           skinTonePosition="none"
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }

export default function EmojiPickerComponent({
  onEmojiSelect,
  emoji,
}: EmojiPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex h-full  w-full items-center justify-center p-2">
      <Popover onOpenChange={setIsOpen} open={isOpen}>
        <PopoverTrigger asChild>
          <div className="group/emoji relative">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/emoji:opacity-100 rounded-md z-[100]">
              <Pencil className="h-4 w-4 text-white" />
            </div>
            <div
              className="text-zero cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
              style={{ opacity: 1, width: "auto" }}
            >
              <span
                style={{
                  fontSize: "20px",
                  fontFamily:
                    'EmojiMart, "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI", "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji", "Android Emoji"',
                }}
              >
                {emoji}
              </span>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-fit p-0">
          <EmojiPicker
            className="h-[342px]"
            onEmojiSelect={({ emoji }) => {
              onEmojiSelect(emoji);
              setIsOpen(false);
              console.log(emoji);
            }}
          >
            <EmojiPickerSearch />
            <EmojiPickerContent />
            <EmojiPickerFooter />
          </EmojiPicker>
        </PopoverContent>
      </Popover>
    </div>
  );
}
