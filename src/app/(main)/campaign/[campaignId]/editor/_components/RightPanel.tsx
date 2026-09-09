"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEditorStore } from "@/stores/editor/useEditorStore";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Right-hand properties panel — VISUAL STUB ONLY, per this project's
 * explicit scope decision ("RightPanel components (styling controls, CMS
 * features, forms) — comment placeholders only" / confirmed as "a
 * rendered, empty" stub). No styling controls, settings forms, or
 * interaction editors are implemented here.
 *
 * ONE CORRECTION worth recording: earlier in this integration I described
 * RightPanel's tabs as "Design / Settings / Interactions" from memory,
 * before actually reading the source. Having now read both files: that
 * three-tab structure is real, but it lives in Ycode's RightSidebar.tsx
 * (3,245 lines), not RightPanel.tsx itself (70 lines) — RightPanel.tsx is
 * a thin wrapper adding a top-level "Human / Agent" switch ABOVE
 * RightSidebar, toggling between the manual editor and an AI chat panel.
 * Since AI features are excluded from this project entirely, that switch
 * has nothing to toggle to — this stub goes straight to the Design/
 * Settings/Interactions shell (the "Human" content) and drops the
 * Human/Agent layer rather than reproducing a toggle to a mode that
 * doesn't exist.
 *
 * Rendered by CampaignEditorMain.tsx as a third sibling alongside
 * EditorBody (left sidebar) and EditorBuilder (canvas) — matching Ycode's
 * actual LeftSidebar/CenterCanvas/RightPanel structure (three separate
 * components, not nested) — for "layers" and "component" route types,
 * where a layer selection is meaningful. Not shown in "page" (page
 * settings) mode, which is a distinct settings surface not yet designed.
 * ─────────────────────────────────────────────────────────────────────────
 */
export function RightPanel() {
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);

  return (
    <div className="w-64 shrink-0 bg-background border-l flex flex-col h-full overflow-hidden">
      <div className="px-4 pt-4 shrink-0">
        <Tabs defaultValue="design">
          <TabsList className="w-full">
            <TabsTrigger value="design" className="flex-1">
              Design
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex-1">
              Settings
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex-1">
              Interactions
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <hr className="mt-4" />
      </div>

      <div className="flex-1 min-h-0 flex items-center justify-center p-4 text-center text-sm text-muted-foreground">
        {selectedLayerId ? (
          <span>
            Styling controls, layer settings, and interaction editing for the
            selected layer are deferred — see this project&apos;s scope decision
            on RightPanel.
          </span>
        ) : (
          <span>Select a layer to see its properties.</span>
        )}
      </div>
    </div>
  );
}
