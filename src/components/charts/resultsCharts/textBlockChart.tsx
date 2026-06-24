import React, { useCallback, useState } from "react";

import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { RiImageEditFill } from "react-icons/ri";
import { BiEdit } from "react-icons/bi";

import Image from "next/image";
import DynamicLucideIcon from "@/components/global/dynamicLucideIcon";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import IconPicker from "@/app/(main)/app/[appRef]/editor/pages/_components/helpers/iconPicker";

const ResultTextBlockChart = ({ section }: { section: ElementNode }) => {
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
  if (!section) return;

  const { id, content, styles, className, type, settings } = section;

  const [selectedTierId, setSelectedTierId] = useState<string | null>(null);
  const [activeEditableId, setActiveEditableId] = useState<string | null>(null);
  const [hoveredElementId, setHoveredElementId] = useState<string | null>(null);

  const description =
    !Array.isArray(content) && content.description
      ? content.description
      : "<p>Your score shows you are</p>";
  const title =
    !Array.isArray(content) && content.title
      ? content.title
      : "<h2>Brilliant</h2>";
  const icon =
    !Array.isArray(content) && content.icon ? content.icon : "HelpCircle";

  const containerId = `chartTextBlock-${id}`;
  const titleId = `chartTextBlock-title-${id}`;
  const descriptionId = `chartTextBlock-description-${id}`;
  const isEditable = !livemode && !previewMode;
  const isContainerActive = isEditable && activeElementId === containerId;
  const isContainerHovered = isEditable && hoveredElementId === containerId;

  // Title states
  const isTitleActive = isEditable && activeElementId === titleId;
  const isTitleHovered = isEditable && hoveredElementId === titleId;

  // Description states
  const isDescriptionActive = isEditable && activeElementId === descriptionId;
  const isDescriptionHovered = isEditable && hoveredElementId === descriptionId;

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

  const handleHtmlUpdate = useCallback(
    (newValue: string, property: string) => {
      const updater = createDebouncedPropertyUpdater(
        section.id,
        `content.${property}`
      );
      updater(newValue);
    },
    [createDebouncedPropertyUpdater]
  );

  const handleIconUpdate = (elementId: string, icon: string) => {
    //onMediaChange(optionId, "image", img);
    const updater = createDebouncedPropertyUpdater(elementId, "content.icon");
    updater(icon);
  };

  return (
    <div
      className={cn(
        "w-full h-40  mx-auto bg-gray-50 rounded-xl border border-gray-200 p-6 flex items-center  space-x-4 shadow-sm",
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
      {/* Icon */}
      {icon && (
        <div className="h-full w-[20%] flex items-center justify-center">
          <IconPicker
            value={icon || "HelpCircle"}
            onChange={(iconName) => handleIconUpdate(section.id, iconName)}
            editorTrigger={
              <div className="relative group/individualScoreTextBlockIcon w-full h-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/individualScoreTextBlockIcon:opacity-100 rounded-md z-40">
                  <BiEdit className="h-10 w-10 text-white" />
                </div>
                <DynamicLucideIcon
                  name={icon}
                  className="w-14 h-14 md:w-20 md:h-20"
                />
              </div>
            }
          />
        </div>
      )}

      {/* Text */}
      <div className="w-[80%] flex flex-col gap-y-2">
        <div
          className={cn(
            "focus:outline-none",
            !livemode &&
              "cursor-text transition-all duration-150 ease-in-out p-1",
            isEditable &&
              "cursor-text transition-all duration-150 ease-in-out p-1", // Edit mode styles
            // Hover vs. Active styling logic is identical to the container's.
            isDescriptionActive &&
              "outline outline-2 outline-indigo-600 rounded-sm",
            isDescriptionHovered &&
              !isDescriptionActive &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm"
          )}
          onClick={(e) => handleClick(e, descriptionId)}
          onMouseEnter={(e) => handleMouseEnter(e, descriptionId)}
          onMouseLeave={handleMouseLeave}
        >
          <div>{description}</div>
          {/* <EditableElement
            key={`${descriptionId}`}
            elementId={section.id}
            sectionId={selectedSectionId as string}
            element={section}
            value={description}
            fieldType="description"
            contentSource={settings?.contentIsDynamic ? "dynamic" : "static"}
            tierId={selectedTierId as string}
            className="text-sm text-gray-500"
            onHtmlUpdate={(val) => {
              if (!livemode) {
                handleHtmlUpdate(val, "description");
                //setEditingElementId(null);
              }
            }}
            htmlContent={description}
          /> */}
        </div>
        <div
          className={cn(
            "focus:outline-none",
            !livemode &&
              "cursor-text transition-all duration-150 ease-in-out p-1",
            isEditable &&
              "cursor-text transition-all duration-150 ease-in-out p-1", // Edit mode styles
            // Hover vs. Active styling logic is identical to the container's.
            isTitleActive && "outline outline-2 outline-indigo-600 rounded-sm",
            isTitleHovered &&
              !isTitleActive &&
              "outline-dashed outline-1 outline-indigo-600 rounded-sm"
          )}
          onClick={(e) => handleClick(e, titleId)}
          onMouseEnter={(e) => handleMouseEnter(e, titleId)}
          onMouseLeave={handleMouseLeave}
        >
          <div>{title}</div>
          {/* <EditableElement
            key={`${titleId}`}
            elementId={section.id}
            sectionId={selectedSectionId as string}
            element={section}
            value={title}
            fieldType="title"
            contentSource={settings?.contentIsDynamic ? "dynamic" : "static"}
            tierId={selectedTierId as string}
            className="text-2xl font-extrabold leading-tight text-gray-900"
            onHtmlUpdate={(val) => {
              if (!livemode) {
                handleHtmlUpdate(val, "title");
                //setEditingElementId(null);
              }
            }}
            htmlContent={title}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default ResultTextBlockChart;
