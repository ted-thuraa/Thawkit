import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Eye, EyeOff, GripVertical, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

interface SortableItemProps {
  id: string;
  section: ElementNode;
  onRemove: (id: string) => void;
  onToggleVisibility: (id: string) => void;
}

export function SortableItem({
  id,
  section,
  onRemove,
  onToggleVisibility,
}: SortableItemProps) {
  const { selectedSectionId, setSelectedSectionId } = usePageBuilderStore();

  const [isHovered, setIsHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
  };

  const handleSectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedSectionId(section.id);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("w-full mb-1 flex flex-row items-center gap-x-1", {
        "opacity-50": isDragging,
      })}
      onClick={handleSectionClick}
    >
      <Card
        className={cn(
          "relative flex flex-row items-center w-full  px-1 py-2 gap-x-2 border text-editor-foreground border-none shadow rounded-sm cursor-pointer",
          selectedSectionId && selectedSectionId === id
            ? "border-indigo-600"
            : "border-input"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex items-center cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </div>
        <div className="flex items-center">
          <span className="text-sm font-medium truncate max-w-[100px]">
            {section.name}
          </span>
        </div>
        {isHovered && (
          <div className="absolute z-30 right-[2px] top-1 p-[0.4rem] bg-editor-component text-editor-foreground border-b border-editor-border shadow-md rounded-md">
            <div className="flex flex-row flex-nowrap space-x-1.5">
              <button
                className="rounded-md hover:bg-editor-button"
                onClick={() => onToggleVisibility(section.id)}
                title={
                  section.isHidden === false ? "Show section" : "Hide section"
                }
              >
                {section.isHidden === false ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                className="text-destructive"
                onClick={() => onRemove(section.id)}
              >
                <Trash className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
