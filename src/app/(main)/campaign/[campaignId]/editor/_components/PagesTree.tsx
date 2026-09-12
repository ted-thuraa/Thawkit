"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Adapted from Ycode's PagesTree.tsx + its inner PageRow component
 * (github.com/ycode/ycode, MIT licensed). Ycode's version renders a real
 * FOLDER TREE (buildPageTree/flattenPageTree/rebuildPageTree), plus error
 * pages, CMS/dynamic pages, and publish/draft status badges — none of
 * which apply here:
 *   - Folders were evaluated and explicitly rejected for this project (see
 *     funnel-content-schema.ts's decision note on `pages.order`) — this
 *     project's pages are a flat, ordered list.
 *   - No error-page concept, no per-page CMS binding, no per-page
 *     publish/draft flag — see editor-actions.ts's file header: publishing
 *     works through `funnel_versions`, not a per-page toggle.
 *   - No live/collaborative broadcasting — see project scope decision.
 *
 * What's kept, matching Ycode's actual interaction pattern: dnd-kit
 * drag-to-reorder (swapped from Ycode's raw useDraggable/useDroppable to
 * @dnd-kit/sortable's SortableContext, since a flat list doesn't need
 * Ycode's above/below/inside drop-position math — that machinery exists
 * specifically for reparenting into folders), a hover-revealed row menu,
 * and a right-click context menu with the same actions (settings /
 * duplicate / delete).
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Icon, { type IconProps } from "@/components/ui/icon";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { PageRow } from "@/lib/editor/resolve-editor-bootstrap";

export const PAGE_TYPE_LABEL: Record<PageRow["pageType"], string> = {
  landing_page: "Landing",
  normal_page: "Regular",
  result_page: "Result",
};

const PAGE_TYPE_ICON: Record<PageRow["pageType"], IconProps["name"]> = {
  landing_page: "homepage",
  normal_page: "page",
  result_page: "page",
};

interface PagesTreeProps {
  pages: PageRow[];
  currentPageId: string | null;
  onPageSelect: (pageId: string) => void;
  onPageSettings: (pageId: string) => void;
  onDuplicate: (pageId: string) => void;
  onDelete: (pageId: string) => void;
  onReorder: (orderedPageIds: string[]) => void;
  readOnly?: boolean;
}

interface PageRowProps {
  page: PageRow;
  isActive: boolean;
  isMenuOpen: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onSettings: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMenuOpenChange: (open: boolean) => void;
  readOnly?: boolean;
}

const PageRow = React.memo(function PageRow({
  page,
  isActive,
  isMenuOpen,
  onSelect,
  onOpen,
  onSettings,
  onDuplicate,
  onDelete,
  onMenuOpenChange,
  readOnly,
}: PageRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: page.id,
    disabled: readOnly,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Only one page can render at "/" — the create menu already disables
  // creating a second landing page, but duplicating an existing one would
  // silently create a routing collision, so it's disabled here too.
  const canDuplicate = page.pageType !== "landing_page";

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...(!readOnly ? listeners : {})}
          className={cn(
            "group relative flex items-center gap-2 h-8 rounded-lg px-2 text-left w-full select-none",
            !isDragging && "hover:bg-secondary/50",
            isActive ? "bg-primary text-primary-foreground hover:bg-primary" : "text-secondary-foreground/80 dark:text-muted-foreground",
            !readOnly && "cursor-grab active:cursor-grabbing",
          )}
          onClick={onSelect}
          onDoubleClick={onOpen}
        >
          <Icon name={PAGE_TYPE_ICON[page.pageType]} className={cn("size-3 shrink-0", isActive ? "opacity-90" : "opacity-50")} />
          <span className="flex-1 min-w-0 text-xs font-medium truncate">{page.title}</span>
          <span className={cn("text-[10px] shrink-0", isActive ? "opacity-80" : "text-muted-foreground")}>
            {PAGE_TYPE_LABEL[page.pageType]}
          </span>

          {!readOnly && (
            <div className={cn("shrink-0", isMenuOpen ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
              <DropdownMenu open={isMenuOpen} onOpenChange={onMenuOpenChange}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="xs"
                    variant="ghost"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                    className={cn("-mr-1", isActive && "hover:bg-primary/70")}
                    aria-label={`Page actions for ${page.title}`}
                  >
                    <Icon name="more" className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onSelect={onSettings}>
                    <Icon name="settings" className="size-3 opacity-60" />
                    Edit settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={onDuplicate} disabled={!canDuplicate}>
                    <Icon name="copy" className="size-3 opacity-60" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onSelect={onDelete}>
                    <Icon name="trash" className="size-3 opacity-60" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      {!readOnly && (
        <ContextMenuContent className="w-40">
          <ContextMenuItem onSelect={onSettings}>Edit settings</ContextMenuItem>
          <ContextMenuItem onSelect={onDuplicate} disabled={!canDuplicate}>
            Duplicate
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive" onSelect={onDelete}>
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
});

export default function PagesTree({
  pages,
  currentPageId,
  onPageSelect,
  onPageSettings,
  onDuplicate,
  onDelete,
  onReorder,
  readOnly = false,
}: PagesTreeProps) {
  const [openMenuPageId, setOpenMenuPageId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
  );

  const sorted = [...pages].sort((a, b) => a.order - b.order);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((p) => p.id === active.id);
    const newIndex = sorted.findIndex((p) => p.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(sorted, oldIndex, newIndex).map((p) => p.id));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-0.5">
          {sorted.map((page) => (
            <PageRow
              key={page.id}
              page={page}
              isActive={page.id === currentPageId}
              isMenuOpen={openMenuPageId === page.id}
              onSelect={() => onPageSelect(page.id)}
              onOpen={() => onPageSelect(page.id)}
              onSettings={() => onPageSettings(page.id)}
              onDuplicate={() => onDuplicate(page.id)}
              onDelete={() => onDelete(page.id)}
              onMenuOpenChange={(open) => setOpenMenuPageId(open ? page.id : null)}
              readOnly={readOnly}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
