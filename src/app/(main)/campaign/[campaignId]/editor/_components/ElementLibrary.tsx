"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Element Library slide-out panel — adapted from Ycode's ElementLibrary.tsx
 * (1,756 lines, github.com/ycode/ycode, MIT licensed).
 *
 * Ycode's version is a 3-tab (Elements/Layouts/Components) library with
 * custom pointer-based cross-iframe drag-to-canvas, backed by
 * `lib/templates/blocks` (a large pre-built layout-blocks catalog),
 * `lib/asset-constants` (an asset system), and `componentsApi` (REST
 * component-instance insertion). None of the Layouts/Components backing
 * infrastructure exists in this project yet:
 *   - No layout-blocks catalog was ported (see usePagesStore.ts's file
 *     header — "Ycode's full starter-blocks/layout library... remains
 *     deferred until their project-specific catalog exists").
 *   - No Server Action or store method inserts a component INSTANCE onto a
 *     page yet (BuilderMain.tsx's "component" route is still a
 *     placeholder — there's nothing to preview a component into).
 * Rather than fabricate either, the Layouts and Components tabs render
 * honest empty states — same principle as "make them function with our
 * project" instead of faking functionality that isn't backed by anything.
 *
 * The Elements tab IS fully wired: `element-templates.ts` is the real,
 * working catalog already used by the "+" button in the Layers tab header,
 * so every item here inserts for real via the same `addLayerFromTemplate`
 * flow. Each item also starts a `useEditorStore` canvas-drag (the exact
 * same `startCanvasDrag`/`updateDragPosition`/`endCanvasDrag` state shape
 * Ycode's drag source writes to) so a future canvas drop-target handler in
 * EditorBuilder.tsx can pick this up without changes here — but since that
 * drop-target consumer doesn't exist yet (it's canvas-side, outside
 * LeftPanel's scope), click-to-insert is wired as the actually-functional
 * path today.
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Icon, { type IconProps } from "@/components/ui/icon";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { cn } from "@/lib/utils";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { useComponentsStore } from "@/stores/editor/useComponentsStore";
import {
  getElementTemplateDefinitions,
  type EditorElementType,
} from "@/lib/editor/element-templates";

const ELEMENT_ICON: Record<EditorElementType, IconProps["name"]> = {
  section: "section",
  div: "block",
  heading: "heading",
  text: "text",
  button: "cursor-default",
  link: "link",
  image: "image",
  video: "video",
  form: "form",
  input: "input",
  textarea: "textarea",
  select: "select",
  checkbox: "checkbox",
  hr: "separator",
};

interface ElementButtonProps {
  label: string;
  description: string;
  icon: IconProps["name"];
  onClick: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}

function ElementButton({
  label,
  description,
  icon,
  onClick,
  onDragStart,
}: ElementButtonProps) {
  return (
    <button
      type="button"
      title={description}
      onMouseDown={onDragStart}
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-transparent p-3 text-center hover:border-border hover:bg-secondary/50 transition-colors cursor-grab active:cursor-grabbing"
    >
      <Icon name={icon} className="size-4 opacity-70" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

interface ElementLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarWidth: number;
  onAddElement: (elementType: EditorElementType) => void;
}

export default function ElementLibrary({
  isOpen,
  onClose,
  sidebarWidth,
  onAddElement,
}: ElementLibraryProps) {
  const [activeTab, setActiveTab] = useState<
    "elements" | "layouts" | "components"
  >("elements");
  const [search, setSearch] = useState("");

  const startCanvasDrag = useEditorStore((state) => state.startCanvasDrag);
  const endCanvasDrag = useEditorStore((state) => state.endCanvasDrag);
  const components = useComponentsStore((state) => state.components);

  const definitions = useMemo(() => getElementTemplateDefinitions(), []);
  const filtered = useMemo(() => {
    if (!search.trim()) return definitions;
    const query = search.trim().toLowerCase();
    return definitions.filter(
      (def) =>
        def.label.toLowerCase().includes(query) ||
        def.type.toLowerCase().includes(query),
    );
  }, [definitions, search]);

  function handleElementDragStart(
    e: React.MouseEvent,
    elementType: EditorElementType,
    name: string,
  ) {
    startCanvasDrag(elementType, "elements", name, {
      x: e.clientX,
      y: e.clientY,
    });
    // No canvas drop-target consumer exists yet (see file header) — end the
    // drag state on mouseup so it never gets stuck "on" if a future
    // consumer isn't listening.
    const handleUp = () => {
      endCanvasDrag();
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mouseup", handleUp);
  }

  return (
    <div
      className={cn(
        "fixed top-0 h-full w-72 bg-background border-r shadow-lg z-40 transition-transform duration-200 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full pointer-events-none",
      )}
      style={{ left: sidebarWidth }}
    >
      <div className="flex items-center justify-between p-4 pb-2 shrink-0">
        <span className="font-medium">Add element</span>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 hover:bg-secondary/50"
          aria-label="Close element library"
        >
          <Icon name="x" className="size-3" />
        </button>
      </div>

      <div className="px-4 pb-3 shrink-0">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search elements…"
          className="h-8"
        />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) =>
          setActiveTab(value as "elements" | "layouts" | "components")
        }
        className="flex-1 min-h-0 flex flex-col gap-0!"
      >
        <TabsList className="w-full shrink-0 mx-4 w-[calc(100%-2rem)]">
          <TabsTrigger value="elements">Elements</TabsTrigger>
          <TabsTrigger value="layouts">Layouts</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>

        <TabsContent
          value="elements"
          className="flex-1 min-h-0 overflow-y-auto p-4 pt-3"
        >
          {filtered.length === 0 ? (
            <Empty>
              <EmptyTitle>No matching elements</EmptyTitle>
              <EmptyDescription>Try a different search term</EmptyDescription>
            </Empty>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {filtered.map((definition) => (
                <ElementButton
                  key={definition.type}
                  label={definition.label}
                  description={definition.description}
                  icon={ELEMENT_ICON[definition.type]}
                  onClick={() => onAddElement(definition.type)}
                  onDragStart={(e) =>
                    handleElementDragStart(e, definition.type, definition.label)
                  }
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent
          value="layouts"
          className="flex-1 min-h-0 overflow-y-auto p-4 pt-3"
        >
          <Empty>
            <EmptyTitle>No layout blocks yet</EmptyTitle>
            <EmptyDescription>
              A reusable layout-blocks library hasn&apos;t been built for this
              project yet — start from an element and build the layout by hand
              for now.
            </EmptyDescription>
          </Empty>
        </TabsContent>

        <TabsContent
          value="components"
          className="flex-1 min-h-0 overflow-y-auto p-4 pt-3"
        >
          {components.length === 0 ? (
            <Empty>
              <EmptyTitle>No components yet</EmptyTitle>
              <EmptyDescription>
                Components you create will show up here.
              </EmptyDescription>
            </Empty>
          ) : (
            <div className="flex flex-col gap-0.5">
              {components.map((component) => (
                <div
                  key={component.id}
                  className="flex items-center gap-2 rounded-lg px-2 h-8 text-xs font-medium text-muted-foreground"
                  title="Placing a component instance on a page isn't wired up yet"
                >
                  <Icon name="component" className="size-3 opacity-50" />
                  <span className="truncate">{component.name}</span>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
