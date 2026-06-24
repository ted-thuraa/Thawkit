import React, { useCallback, useState } from "react";

import { debounce } from "lodash";
import { cn } from "@/lib/utils";
import { RiImageEditFill } from "react-icons/ri";
import Image from "next/image";
import ReactPlayer from "react-player";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import MediaPicker from "@/app/(main)/app/[appRef]/editor/pages/_components/helpers/mediaEditor";

const ResultMediaChart = ({ section }: { section: ElementNode }) => {
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
  if (!section) return;

  const { id, content, styles, className, type, settings } = section;

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
  const mediaSrc =
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
    <>
      {section.settings?.chart_type === "image" ? (
        <div className="relative w-full h-full my-6 flex justify-center rounded-xl overflow-hidden">
          <MediaPicker
            workspaceId={projectData?.id as string}
            mediaType={"image"}
            mediaSource={"upload"}
            mediaSrc={mediaSrc as string}
            mediaOptions={"image_&_gif_only"}
            onMediaChange={(newSrc) => handleMediaUpdate(section.id, newSrc)}
            editorTrigger={
              <div className="group/individualScoreIllustarator w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/individualScoreIllustarator:opacity-100 rounded-md z-40">
                  <RiImageEditFill className="h-12 w-12 text-white" />
                </div>
                <Image
                  src={mediaSrc}
                  alt=""
                  width={600}
                  height={600}
                  priority
                  className="w-full h-full object-cover "
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
      ) : (
        <div className="relative w-full h-full my-6 flex justify-center rounded-xl overflow-hidden">
          <MediaPicker
            workspaceId={projectData?.id as string}
            mediaType={"image"}
            mediaSource={"upload"}
            mediaSrc={mediaSrc as string}
            mediaOptions={"image_&_gif_only"}
            onMediaChange={(newSrc) => handleMediaUpdate(section.id, newSrc)}
            editorTrigger={
              <div className="group/individualScoreIllustarator w-full h-full">
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover/individualScoreIllustarator:opacity-100 rounded-md z-40">
                  <RiImageEditFill className="h-4 w-4 text-white" />
                </div>
                <ReactPlayer
                  url={mediaSrc}
                  width="100%"
                  height="100%"
                  controls={true}
                  light={mediaSrc} // Optional thumbnail
                  playing={false} // Don't autoplay by default
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1 },
                    },
                    vimeo: {
                      playerOptions: { title: true },
                    },
                  }}
                />
              </div>
            }
          />
        </div>
      )}
    </>
  );
};

export default ResultMediaChart;
