"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Check,
  ChevronsUpDown,
  Columns3, // Generic column/grid icon
  ListOrdered,
  Palette,
  Trash2, // Delete icon
  SquarePen, // Icon for layout type
  Image as ImageIcon,
  Baseline, // For Text Box
  ListChecks, // For Bullets
  Sparkles, // For Icon With Text (Placeholder)
  CalendarDays,
  Ellipsis, // For Timeline (Placeholder)
} from "lucide-react";
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
import { Toggle } from "@/components/ui/toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Info, Pencil } from "lucide-react";
import React, { useCallback, useState } from "react";
import IndividualScoreStylist from "./elementUtils/individualScoreStylist";
import Image from "next/image";
import { debounce } from "lodash";
import MediaPicker from "../helpers/mediaEditor";
import { Separator } from "@/components/ui/separator";

import { ColorPicker } from "@/components/global/colorPicker";
import { Label } from "@/components/ui/label";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { SheetProvider } from "@/providers/sheet-provider";
import IconPicker from "../helpers/iconPicker";

type Props = { section: ElementNode };

const MemefiedIndividualScoreComponent = ({ section }: Props) => {
  const { livemode, previewMode, activeElementId, setActiveElementId } =
    usePageBuilderStore();

  const { id } = section;
  const [hoveredItemId, setHoveredItemId] = useState<string | number | null>(
    null
  );

  const level = 88;
  const headerSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "IndividualScoreHeader")[0]
    : undefined;
  const mediaSection: ElementNode | undefined = Array.isArray(section?.content)
    ? section?.content.filter((s) => s.type === "IndividualScoreChart")[0]
    : undefined;
  const alertBoxSection: ElementNode | undefined = Array.isArray(
    section?.content
  )
    ? section?.content.filter((s) => s.type === "IndividualScoreFeedback")[0]
    : undefined;
  const clampedLevel = Math.min(Math.max(level, 0), 100);
  const { name } = getLevelDetails({ level: clampedLevel });

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!livemode && !previewMode) {
      setActiveElementId(id);
    }
  };

  const handleMouseEnter = () => {
    if (!livemode && !previewMode) setHoveredItemId(id);
  };
  const handleMouseLeave = () => {
    if (!livemode && !previewMode) setHoveredItemId(null);
  };

  const isSelected = !livemode && !previewMode && activeElementId === id;
  const showEditorUI =
    !livemode && !previewMode && (hoveredItemId === id || isSelected);

  return (
    <div
      className={cn(
        "relative max-w-[44rem] flex items-center justify-center p-4 ",
        "focus:outline-none",
        !livemode && !previewMode && "p-1",
        !livemode &&
          !previewMode &&
          hoveredItemId === id &&
          activeElementId !== id &&
          "outline-dashed outline-1 outline-indigo-600 rounded-sm",
        !livemode &&
          !previewMode &&
          activeElementId === id &&
          "outline outline-2 outline-indigo-600 rounded-sm "
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {showEditorUI && (
        <div
          className={cn(
            "absolute z-50 right-2 top-3 left-2 -translate-y-1/3 transition-opacity",
            showEditorUI ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex flex-row flex-nowrap justify-between text-black">
            <div className="flex flex-row flex-nowrap space-x-1.5 bg-card shadow-md rounded-md">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-md hover:bg-muted">
                    <Info className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="absolute -left-4 p-4 bg-card text-card-foreground rounded-lg shadow-lg w-[320px]">
                  <IndividualScoreStylist section={section} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto bg-white rounded-3xl shadow-lg p-6 font-sans">
        {/* Header */}
        <IndividualScoreComponentHeader
          level={clampedLevel}
          headerSection={headerSection}
        />

        {/* Main Visual */}
        <MainVisualComponent visualSection={mediaSection} />

        {/* Slider */}
        {/* <div
        className="relative w-full"
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedLevel}
        aria-label={`Procrastination level: ${clampedLevel}% which is ${name}`}
      >
        <div
          className="absolute z-40 bottom-full mb-3 w-max"
          style={handlePositionStyle}
        >
          <div className="relative py-1 px-3 bg-gray-700 text-white text-sm font-semibold rounded-md">
            Your level
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-700" />
          </div>
        </div>
        <div className="h-2 w-full bg-gradient-to-r from-emerald-200 via-yellow-300 to-red-400 rounded-full" />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-2 border-gray-600 shadow-md"
          style={handlePositionStyle}
        />
      </div> */}

        {/* Labels */}
        {/* <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Low</span>
        <span>Normal</span>
        <span>Medium</span>
        <span>High</span>
      </div> */}

        {/* Alert Box */}
        <IndividualScoreComponentAlertBox
          level={clampedLevel}
          section={alertBoxSection}
        />
      </div>
    </div>
  );
};

export default React.memo(MemefiedIndividualScoreComponent);

/* -------------------------
   Helpers and Subcomponents
-------------------------- */
const getLevelDetails = ({ level }: { level: number }) => {
  if (level <= 25) {
    return {
      name: "Low",
      tagClasses:
        "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
      infoClasses: "bg-emerald-50 border-emerald-100",
    };
  }
  if (level <= 50) {
    return {
      name: "Normal",
      tagClasses: "bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-100",
      infoClasses: "bg-lime-50 border-lime-100",
    };
  }
  if (level <= 75) {
    return {
      name: "Medium",
      tagClasses:
        "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-100",
      infoClasses: "bg-orange-50 border-orange-100",
    };
  }
  return {
    name: "High",
    tagClasses: "bg-red-100 text-red-700 border-red-200 hover:bg-red-100 ",
    infoClasses: "bg-red-50 border-red-100",
  };
};

interface HeaderProps {
  level: number;
  headerSection: ElementNode | undefined;
}
const IndividualScoreComponentHeader: React.FC<HeaderProps> = ({
  level,
  headerSection,
}) => {
  const {
    livemode,
    selectedSectionId,
    previewMode,
    activeElementId,
    editingElementId,
    setEditingElementId,
    updateElementProperty,
    setActiveElementId,
  } = usePageBuilderStore();
  if (!headerSection) return;
  const { name, tagClasses } = getLevelDetails({ level });
  const { id, content, styles, className, type, settings } = headerSection;

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );

  const title =
    !Array.isArray(headerSection?.content) && headerSection?.content.innerText
      ? headerSection?.content.innerText
      : "Add text here";

  const createDebouncedPropertyUpdater = useCallback(
    (elementId: string, Path: string) =>
      debounce((newValue: string) => {
        if (!headerSection.settings?.contentIsDynamic && selectedTierId) {
          const propertyPath = `content.metaDynamic.${selectedTierId}.${Path}`;
          if (elementId) {
            updateElementProperty(
              elementId,
              propertyPath,
              newValue,
              selectedSectionId as string
            );
          } else {
            console.warn(
              `Cannot update property ${propertyPath} for element ${elementId}: selectedSectionId is ${selectedSectionId} or elementId is missing.`
            );
          }
        } else {
          const propertyPath = `${Path}`;
          console.log({ elementId, propertyPath, newValue });
          updateElementProperty(
            elementId,
            propertyPath,
            newValue,
            selectedSectionId as string
          );
        }
      }, 500),
    [
      selectedSectionId,
      selectedTierId,
      settings?.contentIsDynamic,
      updateElementProperty,
    ]
  );

  const handleHtmlUpdate = useCallback(
    (newValue: string, elementId: string) => {
      const updater = createDebouncedPropertyUpdater(
        elementId,
        "content.innerText"
      );
      updater(newValue);
    },
    [createDebouncedPropertyUpdater]
  );

  return (
    <header className="flex justify-between items-center">
      {/* <h1 className="flex-1 text-xl font-bold text-gray-800">{title}</h1> */}
      <div
        className={cn(
          "focus:outline-none",
          !livemode ||
            (!previewMode &&
              "cursor-text transition-all duration-150 ease-in-out p-1"),
          !livemode ||
            (!previewMode &&
              hoveredEditableId === headerSection.id &&
              editingElementId !== headerSection.id &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm"),
          !livemode ||
            (!previewMode &&
              editingElementId === headerSection.id &&
              "outline outline-2 outline-indigo-600 rounded-sm")
        )}
        onClick={(e) => {
          if (!livemode || !previewMode) {
            e.stopPropagation();
            setEditingElementId(headerSection.id);
            setActiveElementId(headerSection.id);
          }
        }}
        onMouseEnter={(e) => {
          if (!livemode || !previewMode) {
            e.stopPropagation();
            setHoveredEditableId(headerSection.id);
          }
        }}
        onMouseLeave={(e) => {
          if (!livemode || !previewMode) {
            e.stopPropagation();
            setHoveredEditableId(null);
          }
        }}
      >
        <EditableElement
          key={`${headerSection.id}-title`}
          elementId={headerSection.id}
          sectionId={selectedSectionId as string}
          element={headerSection}
          value={title}
          fieldType="innerText"
          contentSource={settings?.contentIsDynamic ? "dynamic" : "static"}
          tierId={selectedTierId as string}
          style={styles}
          className="flex-1 text-xl font-bold "
          isCard={false}
          onHtmlUpdate={(val) => {
            if (!livemode || !previewMode) {
              handleHtmlUpdate(
                val,
                Array.isArray(content) ? content[0].id : ""
              );
              //setEditingElementId(null);
            }
          }}
          htmlContent={title}
        />
      </div>

      <div className={`flex-1 flex justify-end`}>
        <Badge
          className={`w-fit px-3 py-1 text-sm font-semibold rounded-md border ${tagClasses}`}
        >
          <span>{name}</span>
        </Badge>
      </div>
    </header>
  );
};

interface MainVisualProps {
  visualSection: ElementNode | undefined;
}
const MainVisualComponent: React.FC<MainVisualProps> = ({ visualSection }) => {
  const {
    livemode,
    projectData,
    selectedSectionId,
    previewMode,
    activeElementId,
    editingElementId,
    setEditingElementId,
    updateElementProperty,
    setActiveElementId,
  } = usePageBuilderStore();
  if (!visualSection) return;

  const { id, content, styles, className, type, settings } = visualSection;

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [activeEditableId, setActiveEditableId] = useState<string | null>(null);
  const [hoveredEditableId, setHoveredEditableId] = useState<string | null>(
    null
  );

  const MAX_WORDS = 20;
  const text =
    !Array.isArray(content) && content.innerText
      ? content.innerText
      : "Add text here";
  const imgSrc =
    !Array.isArray(content) && content.src
      ? content.src
      : "/assets/tedInASuit.jpg";

  const createDebouncedPropertyUpdater = useCallback(
    (elementId: string, Path: string) =>
      debounce((newValue: string) => {
        const propertyPath = `${Path}`;
        updateElementProperty(
          elementId,
          propertyPath,
          newValue,
          selectedSectionId as string
        );
      }, 500),
    [selectedSectionId, settings?.contentIsDynamic, updateElementProperty]
  );

  const debouncedUpdateText = useCallback(
    (newValue: string, elementId: string) => {
      const updater = createDebouncedPropertyUpdater(
        elementId,
        "content.innerText"
      );
      updater(newValue);
    },
    [createDebouncedPropertyUpdater]
  );

  const handleMediaUpdate = (elementId: string, img: string) => {
    //onMediaChange(optionId, "image", img);
    const updater = createDebouncedPropertyUpdater(elementId, "content.src");
    updater(img);
  };

  // --- word count limiter ---
  const enforceWordLimit = (raw: string): string => {
    const words = raw.trim().replace(/\s+/g, " ").split(" ").filter(Boolean);

    if (words.length <= MAX_WORDS) return raw.trim();

    return words.slice(0, MAX_WORDS).join(" ");
  };

  // Utility to restore cursor at the end after truncating text
  function placeCaretAtEnd(el: HTMLElement) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  }

  return (
    <div className="relative aspect-video my-6 flex justify-center rounded-xl overflow-hidden">
      <MediaPicker
        workspaceId={projectData?.workspace.id as string}
        mediaType={"image"}
        mediaSource={"upload"}
        mediaSrc={imgSrc as string}
        mediaOptions={"image_&_gif_only"}
        onMediaChange={(newSrc) => handleMediaUpdate(visualSection.id, newSrc)}
        editorTrigger={
          <div className="group/individualScoreIllustarator">
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/individualScoreIllustarator:opacity-100 rounded-md z-40">
              <Pencil className="h-4 w-4 text-white" />
            </div>
            <Image
              src={imgSrc}
              alt=""
              fill
              priority
              className="object-contain "
            />
          </div>
        }
      />

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-40" />
      <div className="absolute bottom-0 left-0 right-0 z-[60]  max-h-20 w-full p-4 flex items-center justify-center">
        <p
          key={`${id}-illustrationText`}
          contentEditable={!livemode || !previewMode}
          suppressContentEditableWarning
          data-editable="true"
          onInput={(e) => {
            if (!livemode || !previewMode) {
              const el = e.currentTarget;
              const limited = enforceWordLimit(el.innerText);
              if (el.innerText !== limited) {
                el.innerText = limited; // truncate extra words immediately
                placeCaretAtEnd(el); // keep cursor at the end
              }
            }
          }}
          onBlur={(e) => {
            if (!livemode || !previewMode) {
              const limited = enforceWordLimit(e.currentTarget.innerText);
              debouncedUpdateText(limited, id);
              setActiveEditableId(null);
            }
          }}
          onClick={(e) => {
            if (!livemode || !previewMode) {
              e.stopPropagation();
              setActiveEditableId(`${id}-illustrationText`);
            }
          }}
          onMouseEnter={(e) => {
            if (!livemode || !previewMode) {
              e.stopPropagation();
              setHoveredEditableId(`${id}-illustrationText`);
            }
          }}
          onMouseLeave={(e) => {
            if (!livemode || !previewMode) {
              e.stopPropagation();
              setHoveredEditableId(null);
            }
          }}
          className={cn(
            "w-fit max-w-md text-white text-sm sm:text-base text-center focus:outline-none",
            !livemode &&
              !previewMode &&
              "cursor-text transition-all duration-150 ease-in-out p-1",
            !livemode &&
              !previewMode &&
              hoveredEditableId === `${id}-illustrationText` &&
              activeEditableId !== `${id}-illustrationText` &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm",
            !livemode &&
              !previewMode &&
              activeEditableId === `${id}-illustrationText` &&
              "outline outline-2 outline-indigo-600 rounded-sm"
          )}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

interface AlertBoxProps {
  level: number;
  section: ElementNode | undefined;
}

const IndividualScoreComponentAlertBox: React.FC<AlertBoxProps> = ({
  level,
  section,
}) => {
  // Global state from the store for mode and the single source of truth for active elements
  const {
    livemode,
    previewMode,
    activeElementId,
    setActiveElementId,
    selectedSectionId,
    updateElementProperty,
  } = usePageBuilderStore();

  // Local state to track which element is currently being hovered over.
  // This is kept local as hover state is transient and doesn't need to be global.
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  if (!section) return null;

  const { id, content } = section;

  // --- 1. Unique ID Generation ---
  // Derive unique, predictable IDs for each trackable element from the base section ID.
  // This is crucial for identifying which element is being hovered or clicked.
  const containerId = `alertbox-${id}`;
  const titleId = `alertbox-title-${id}`;
  const descriptionId = `alertbox-description-${id}`;

  // Helper to determine if we are in an editable mode (i.e., not live or preview)
  const isEditable = !livemode && !previewMode;

  // --- 2. Hover vs. Active State Determination ---
  // These booleans check the global activeElementId and local hoveredElementId
  // to determine the current state for each specific element. This avoids duplicate state hooks.

  // Container states
  const isContainerActive = isEditable && activeElementId === containerId;
  const isContainerHovered = isEditable && hoveredElementId === containerId;

  // Title states
  const isTitleActive = isEditable && activeElementId === titleId;
  const isTitleHovered = isEditable && hoveredElementId === titleId;

  // Description states
  const isDescriptionActive = isEditable && activeElementId === descriptionId;
  const isDescriptionHovered = isEditable && hoveredElementId === descriptionId;

  // Badge visibility is tied *only* to the container's state, as per requirements.
  const showBadge = isEditable && (isContainerHovered || isContainerActive);

  // --- 3. Single Source of Truth for Clicks ---
  // This generic click handler updates the single source of truth (activeElementId in the global store).
  // It stops propagation to prevent parent elements (like the container) from also being selected
  // when a child (like the title) is clicked.
  const handleClick = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (isEditable) {
      setActiveElementId(elementId);
    }
  };

  // Generic mouse enter handler to update the local hover state.
  const handleMouseEnter = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    if (isEditable) {
      setHoveredElementId(elementId);
    }
  };

  // Generic mouse leave handler to clear the local hover state.
  const handleMouseLeave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEditable) {
      setHoveredElementId(null);
    }
  };

  // Debounced functions for updating content (logic remains the same).
  const createDebouncedPropertyUpdater = useCallback(
    (elementId: string, path: string) =>
      debounce((newValue: string) => {
        updateElementProperty(
          elementId,
          path,
          newValue,
          selectedSectionId as string
        );
      }, 500),
    [selectedSectionId, updateElementProperty]
  );

  const debouncedUpdateTitle = useCallback(
    (newValue: string) => {
      createDebouncedPropertyUpdater(id, "content.title")(newValue);
    },
    [id, createDebouncedPropertyUpdater]
  );

  const debouncedUpdateDescription = useCallback(
    (newValue: string) => {
      createDebouncedPropertyUpdater(id, "content.description")(newValue);
    },
    [id, createDebouncedPropertyUpdater]
  );

  // Extract content safely
  const title =
    !Array.isArray(content) && content.title ? content.title : "Add text here";
  const description =
    !Array.isArray(content) && content.description
      ? content.description
      : "Add text here";

  const { infoClasses } = getLevelDetails({ level });

  return (
    <div
      // --- Container Element ---
      className={cn(
        `mt-8 px-4 py-6 rounded-lg flex items-start gap-3 relative`, // Base styles
        infoClasses,
        "focus:outline-none",
        isEditable && "p-1", // Padding adjustment for edit mode outlines
        // The active state (solid border) takes precedence over the hover state (dashed border).
        isContainerActive && "outline outline-2 outline-indigo-600 rounded-sm",
        isContainerHovered &&
          !isContainerActive &&
          "outline-dashed outline-1 outline-indigo-600 rounded-sm"
      )}
      onMouseEnter={(e) => handleMouseEnter(e, containerId)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => handleClick(e, containerId)}
    >
      {showBadge && (
        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 rounded-none rounded-t-lg z-20 bg-transparent hover:bg-transparent">
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="flex items-center justify-center w-6 border border-gray-600 h-4 rounded-md bg-gray-800 text-gray-100 "
                aria-label="Edit Item"
              >
                <Ellipsis className="w-3 h-3" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-max p-0 bg-transparent absolute left-1/2 -translate-x-1/2 -top-16">
              <AlertBoxStylist section={section} />
            </PopoverContent>
          </Popover>
        </Badge>
      )}

      <InfoIcon />

      <div>
        <h2
          // --- Title Element ---
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            if (isEditable) debouncedUpdateTitle(e.currentTarget.innerText);
          }}
          onMouseEnter={(e) => handleMouseEnter(e, titleId)}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => handleClick(e, titleId)}
          className={cn(
            "font-bold text-sm", // Base styles
            "focus:outline-none",
            isEditable &&
              "cursor-text transition-all duration-150 ease-in-out p-1", // Edit mode styles
            // Hover vs. Active styling logic is identical to the container's.
            isTitleActive && "outline outline-2 outline-indigo-600 rounded-sm",
            isTitleHovered &&
              !isTitleActive &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm"
          )}
        >
          {title}
        </h2>

        <p
          // --- Description Element ---
          contentEditable={isEditable}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            if (isEditable)
              debouncedUpdateDescription(e.currentTarget.innerText);
          }}
          onMouseEnter={(e) => handleMouseEnter(e, descriptionId)}
          onMouseLeave={handleMouseLeave}
          onClick={(e) => handleClick(e, descriptionId)}
          className={cn(
            "text-sm mt-1", // Base styles
            "focus:outline-none",
            isEditable &&
              "cursor-text transition-all duration-150 ease-in-out p-1", // Edit mode styles
            // Hover vs. Active styling logic is identical to the container's.
            isDescriptionActive &&
              "outline outline-2 outline-indigo-600 rounded-sm",
            isDescriptionHovered &&
              !isDescriptionActive &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm"
          )}
        >
          {description}
        </p>
      </div>
    </div>
  );
};

// The InfoIcon component remains unchanged, but is included for completeness.
const InfoIcon = () => (
  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-red-600"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
        clipRule="evenodd"
      />
    </svg>
  </div>
);

/* -------------------------
   Main Component
-------------------------- */
interface ProcrastinationLevelProps {
  section: ElementNode;
}
export const AlertBoxStylist: React.FC<ProcrastinationLevelProps> = ({
  section,
}) => {
  const {
    categories,
    scoretiers,
    selectedSectionId,
    updateElementProperty,
    removeSection, // To implement delete functionality
  } = usePageBuilderStore();
  const { id, content, name, className, type, settings } = section;
  const [bgColorOpen, setBgColorOpen] = React.useState(false);
  const debouncedUpdateCardBgColor = React.useCallback(
    debounce((newColor: string) => {
      if (id) {
        updateElementProperty(
          id,
          "settings.smartLayout_cardBackgroundColor",
          newColor,
          selectedSectionId as string
        );
      }
    }, 300),
    [selectedSectionId, id, updateElementProperty]
  );

  const handleIconChange = useCallback(
    (itemId: string, iconName: string) => {
      if (itemId) {
        // Need parent section ID too if updating nested
        // Assuming updateElementProperty can handle nested updates
        // Find the parent section ID if necessary, though for smart layout, section.id should work
        updateElementProperty(
          itemId, // The ID of the layout_item being changed
          "settings.iconName",
          iconName,
          selectedSectionId as string // The ID of the smart_layout container
        );
      }
      // Note: Sheet closing is handled within IconPicker's onSelect -> handleSelect
    },
    [selectedSectionId, id, updateElementProperty] // Add section.id dependency
  );
  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-row items-center gap-1 p-1.5 rounded-md bg-white shadow-lg border border-gray-200">
        {/* Layout Type Selector */}

        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />
        <Tooltip>
          <SheetProvider
            trigger={
              <TooltipTrigger asChild>
                <Toggle
                  size="sm"
                  variant="outline"
                  aria-label="Change icon"
                  className="text-xs justify-start h-8 px-2 w-auto rounded border-transparent hover:bg-gray-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Consider showing the current icon here or a generic icon */}
                  <SquarePen className="w-3 h-3 mr-1.5 text-gray-600 shrink-0" />
                  <span className="truncate">Edit Icon</span>
                </Toggle>
              </TooltipTrigger>
            }
            title="Pick an Icon"
            description=""
            className="sm:max-w-lg"
          >
            <IconPicker
              value={settings?.iconName as string}
              onChange={(iconName) => handleIconChange(id, iconName)}
            />
          </SheetProvider>

          <TooltipContent side="top">
            <p>Edit icon</p>
          </TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />

        {/* Background Color Picker Popover */}
        <Popover open={bgColorOpen} onOpenChange={setBgColorOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-1 hover:bg-gray-100"
                >
                  <Palette className="h-4 w-4 text-gray-600" />
                </Button>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Card Background Color</p>
            </TooltipContent>
          </Tooltip>
          <PopoverContent className="w-auto p-2">
            <Label
              htmlFor="smartCardBgColorAll"
              className="text-xs text-gray-600 mb-1 block"
            >
              All Cards Background
            </Label>
            <ColorPicker
              //id="smartCardBgColorAll"
              color={settings?.smartLayout_cardBackgroundColor || ""}
              onChange={debouncedUpdateCardBgColor}
              className="w-full"
            />
          </PopoverContent>
        </Popover>

        {/* <Separator orientation="vertical" className="h-5 bg-gray-300 mx-0.5" />
         */}
      </div>
    </TooltipProvider>
  );
};
