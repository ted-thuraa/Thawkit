"use client";
import React, { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Cog } from "lucide-react";
import { cn } from "@/lib/utils";
import ColumnsStylist from "./elementUtils/columnStylist";
import Switcher from "../recursiveComponent";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Props = { section: ElementNode };

const ColumnsContainer = ({ section }: Props) => {
  const { previewMode, activeElementId, setActiveElementId, livemode } =
    usePageBuilderStore();
  const [isHovered, setIsHovered] = useState(false);

  const { id, content, styles, className, settings } = section;

  const handleMouseEnter = useCallback(() => {
    if (!livemode) {
      setIsHovered(true);
    }
  }, [livemode]);
  const handleMouseLeave = useCallback(() => {
    if (!livemode) {
      setIsHovered(false);
    }
  }, [livemode]);
  // Memoize children to prevent unnecessary recalculations
  const childSections = useMemo(() => {
    return Array.isArray(content) ? content : [];
  }, [content]);

  const handleElementClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!livemode) {
        setActiveElementId(id);
      }
    },
    [livemode, setActiveElementId, id]
  );

  const isSelected = !livemode && activeElementId === id;
  const showEditorUI = !livemode && (isHovered || isSelected);

  // Calculate alignment class once
  const alignmentClass = useMemo(() => {
    switch (settings?.column_items_alignment) {
      case "start":
        return "items-start";
      case "end":
        return "items-end";
      case "center":
      default:
        return "items-center"; // Default to center
    }
  }, [settings?.column_items_alignment]);

  // Handle reverse order via Flex direction instead of manual ordering
  const flexDirectionClass = settings?.column_reverse_order
    ? "md:flex-row-reverse"
    : "md:flex-row";

  return (
    <div
      style={styles}
      onClick={handleElementClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        // Layout Basics
        "relative flex flex-col flex-nowrap gap-5 lg:gap-[72px]",
        alignmentClass,
        flexDirectionClass,
        className,
        // Editor UI Helpers (Group allows child elements to react to parent hover)
        !livemode && "p-2",

        !livemode && !previewMode && "outline outline-2",
        {
          "outline-transparent": !showEditorUI && !isSelected,
          "outline-dashed outline-gray-400": showEditorUI && !isSelected,
          "outline-indigo-600": isSelected,
        }
      )}
    >
      {/* Editor Controls Badge */}
      {showEditorUI && (
        <Badge
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent p-0"
          onClick={(e) => e.stopPropagation()}
        >
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-6 h-4 rounded-md border border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-100 transition-colors"
                title="Column Settings"
              >
                <Cog className="w-3 h-3 text-gray-200" />
              </button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-1 z-[1500]"
              align="center"
              sideOffset={5}
            >
              <ColumnsStylist section={section} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}

      {/* Render Children */}
      {childSections.map((childsection) => (
        <div
          key={childsection.id}
          // flex-1 ensures equal width. min-w-0 prevents flex items from overflowing.
          className={cn("w-full md:flex-1 min-w-0", childsection.className)}
        >
          <Switcher section={childsection} />
        </div>
      ))}
    </div>
  );
};

export default React.memo(ColumnsContainer);

// "use client";
// import { Badge } from "@/components/ui/badge";
// import { EditorBtns, defaultStyles } from "@/lib/constants";
// import clsx from "clsx";
// import React, { useCallback, useMemo, useState } from "react";
// import { v4 } from "uuid";

// import {
//   Cog,
//   Copy,
//   Ellipsis,
//   Eye,
//   MoreHorizontal,
//   Palette,
//   Trash,
// } from "lucide-react";

// import { cn } from "@/lib/utils";
// import ColumnsStylist from "./elementUtils/columnStylist";
// import Switcher from "../recursiveComponent";
// import { ElementNode } from "@/stores/pageEditorStore/types";
// import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// type Props = { section: ElementNode };

// const ColumnsContainer = ({ section }: Props) => {
//   const {
//     selectedSectionId,
//     livemode,
//     activeElementId,
//     setActiveElementId,
//     updateElementProperty,
//   } = usePageBuilderStore();
//   const [isHovered, setIsHovered] = useState(false);
//   const { id, content, name, styles, className, settings } = section;

//   const childSections = useMemo(() => {
//     if (Array.isArray(content)) {
//       return content;
//     }
//     return [];
//   }, [content]);

//   const handleElementClick = useCallback(
//     (e: React.MouseEvent) => {
//       e.stopPropagation(); // Prevent bubbling
//       if (!livemode) {
//         setActiveElementId(id); // Set this element as active
//       }
//     },
//     [livemode, setActiveElementId, id]
//   );

//   const handleMouseEnter = useCallback(() => {
//     if (!livemode) {
//       setIsHovered(true);
//     }
//   }, [livemode]);

//   const handleMouseLeave = useCallback(() => {
//     if (!livemode) {
//       setIsHovered(false);
//     }
//   }, [livemode]);

//   const isSelected = !livemode && activeElementId === id;
//   const showEditorUI = !livemode && (isHovered || isSelected);

//   const alignmentClass = (() => {
//     switch (settings?.column_items_alignment) {
//       case "center":
//         return "items-center";
//       case "end":
//         return "items-end";
//       case "start":
//         return "items-start";
//       default:
//         return "items-center"; // Default to items-center
//     }
//   })();

//   return (
//     <div
//       style={styles}
//       className={cn(
//         "relative flex flex-col md:flex-row flex-nowrap gap-5  lg:gap-[72px]", // Base styles, adjusted gap
//         alignmentClass, // Dynamic vertical alignment
//         className,
//         " outline-1 ", // Always apply a 2px outline

//         {
//           "p-2": !livemode,
//           "outline-transparent": !showEditorUI && !isSelected, // Fully transparent when not hovered or selected
//           "outline-dashed outline-indigo-400": showEditorUI && !isSelected, // Lighter solid indigo on hover (but not selected)
//           " outline-indigo-600": isSelected, // Darker solid indigo when selected
//         }
//       )}
//       onClick={handleElementClick}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       {showEditorUI && (
//         <Badge
//           className={cn(
//             "absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent"
//           )}
//           // Prevent badge click from deselecting the container
//           onClick={(e) => e.stopPropagation()}
//         >
//           <Popover>
//             <PopoverTrigger asChild>
//               <button
//                 className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 hover:bg-gray-800 text-gray-100"
//                 title="Column Settings"
//               >
//                 <Cog className="w-4 h-4 text-gray-200" />
//               </button>
//             </PopoverTrigger>
//             <PopoverContent
//               className="w-auto p-1 z-[1500] visible absolute bottom-0 left-0 m-0 -translate-x-[100px] -translate-y-[24px] shadow-lg border border-gray-200"
//               // tooltipContent="Column Settings"
//               // side="top"
//             >
//               <ColumnsStylist section={section} />
//             </PopoverContent>
//           </Popover>
//         </Badge>
//       )}

//       {childSections.map((childsection, index) => (
//         <div
//           key={childsection.id}
//           className={cn(" w-full", {
//             "order-2": section.settings?.column_reverse_order && index === 0,
//             "order-1": section.settings?.column_reverse_order && index === 1,
//           })}
//         >
//           <Switcher section={childsection} />
//         </div>
//       ))}
//     </div>
//   );
// };

// export default React.memo(ColumnsContainer);
