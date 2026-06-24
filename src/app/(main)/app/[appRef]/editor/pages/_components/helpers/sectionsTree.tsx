"use client";
import {
  Plus,
  LayoutGrid,
  Settings,
  Palette,
  ListOrdered,
  LayoutList,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Trash,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SortableItem } from "./sortableItem";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";

const SectionsTree = () => {
  const {
    livemode,
    sections,
    selectedSectionId,
    reorderSections,
    removeSection,
    toggleSectionVisibility,
    theme,
    updateTheme,
  } = usePageBuilderStore();

  // const handleToolClick = (action: string) => {
  //   if (action === "add") {
  //     setIsDialogOpen(true);
  //   }
  //   if (action === "theme") {
  //     setIsThemeDialogOpen(true);
  //   }
  //   // Handle other actions as needed
  // };

  const handleRemoveSection = (id: string) => {
    removeSection(id);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = sections.findIndex((section) => section.id === active.id);
    const newIndex = sections.findIndex((section) => section.id === over.id);

    const reorderedSections = arrayMove(sections, oldIndex, newIndex);
    reorderSections(reorderedSections);
  };

  return (
    <div>
      {!livemode && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((section) => section.id)}
            strategy={verticalListSortingStrategy}
          >
            {sections.map((section) => (
              <SortableItem
                key={section.id}
                id={section.id}
                section={section}
                onRemove={removeSection}
                onToggleVisibility={toggleSectionVisibility}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}

      {livemode &&
        sections.map((section) => (
          <div
            key={section.id}
            className="w-full flex flex-row items-center gap-x-1"
          >
            <div className="w-full flex flex-row items-center gap-x-1">
              <div className="flex items-center">
                <GripVertical className="h-4 w-4" />
              </div>
              <Card className="relative w-full bg-card p-1   gap-x-2">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{section.name}</span>
                </div>
                <div className="absolute z-30 right-0 top-1 p-1  bg-white shadow-md rounded-md">
                  <div className="flex flex-row flex-nowrap space-x-1.5 ">
                    <button
                      className=" rounded-md hover:bg-muted"
                      onClick={() => toggleSectionVisibility(section.id)}
                      title={
                        section.isHidden === false
                          ? "Show section"
                          : "Hide section"
                      }
                    >
                      {section.isHidden === false ? (
                        <Eye className={cn("w-3.5 h-3.5")} />
                      ) : (
                        <EyeOff className={cn("w-3.5 h-3.5")} />
                      )}
                    </button>
                    <button
                      className="  text-destructive"
                      onClick={() => handleRemoveSection(section.id)}
                    >
                      <Trash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}
    </div>
  );
};

export default SectionsTree;
