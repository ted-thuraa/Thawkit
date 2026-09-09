"use client";

import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  startTransition,
  Suspense,
  lazy,
} from "react";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SidebarTab, useCampaignEditorUrl } from "@/hooks/use-editor-url";
import { UseLayerUpdatesReturn } from "@/hooks/use-layer-updates";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import LayersTree from "./LayerTree";

interface LeftSidebarProps {
  onLayerSelect: (layerId: string | null) => void;
  currentPageId: string | null;
  onPageSelect: (pageId: string) => void;
  layerUpdates?: UseLayerUpdatesReturn | null;
  readOnly?: boolean;
}

const LeftPanel = React.memo(function LeftPanel({
  onLayerSelect,
  currentPageId,
  onPageSelect,
  LayerUpdates,
}: LeftSidebarProps) {
  const { sidebarTab } = useCampaignEditorUrl();
  const [showElementLibrary, setShowElementLibrary] = useState(false);
  const [localTab, setLocalTab] = useState<SidebarTab>("layers");
  const storeSidebarTab = useEditorStore((state) => state.activeSidebarTab);

  const activeTab = storeSidebarTab || sidebarTab;
  const sidebarWidth = 256;

  return (
    <>
      <div className="shrink-0 relative" style={{ width: `${sidebarWidth}px` }}>
        <div className="w-full h-full bg-background border-r flex overflow-hidden p-4 pb-0">
          {/* Tabs */}
          <div className="w-full">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {}}
              className="h-full overflow-hidden gap-0!"
            >
              <TabsList className="w-full shrink-0">
                <TabsTrigger value="layers">Layers</TabsTrigger>
                <TabsTrigger value="pages">Pages</TabsTrigger>
              </TabsList>

              <hr className="mt-4" />

              {/* Content - forceMount keeps all tabs mounted for instant switching */}
              <TabsContent
                value="layers"
                className="flex flex-col min-h-0"
                // forceMount
              >
                <header className="py-5 flex justify-between shrink-0 z-20">
                  <span className="font-medium"> Layers</span>

                  <div className="-my-1">
                    <Button
                      size="xs"
                      variant="secondary"
                      onClick={() => setShowElementLibrary((prev) => !prev)}
                    >
                      <Icon
                        name="plus"
                        className={`${showElementLibrary ? "rotate-45" : "rotate-0"} transition-transform duration-100`}
                      />
                    </Button>
                  </div>
                </header>

                <div
                  className="flex flex-col flex-1 min-h-0 overflow-y-auto overflow-x-auto no-scrollbar"
                  style={
                    {
                      "--tree-available-width": `${sidebarWidth - 33}px`,
                    } as React.CSSProperties
                  }
                >
                  {!currentPageId && !editingComponentId ? (
                    <Empty>
                      <EmptyTitle>No page selected</EmptyTitle>
                      <EmptyDescription>
                        Select a page from the Pages tab to start building
                      </EmptyDescription>
                    </Empty>
                  ) : layersForCurrentPage.length === 0 ? (
                    <Empty>
                      <EmptyTitle>No layers yet</EmptyTitle>
                      <EmptyDescription>
                        Click the + button above to add your first block
                      </EmptyDescription>
                    </Empty>
                  ) : (
                    <LayersTree
                      layers={layersForCurrentPage}
                      onLayerSelect={handleLayerSelect}
                      onReorder={handleLayersReorder}
                      pageId={currentPageId || ""}
                      liveLayerUpdates={liveLayerUpdates}
                      liveComponentUpdates={liveComponentUpdates}
                      readOnly={readOnly}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="pages"
                className="flex flex-col min-h-0 overflow-y-auto no-scrollbar"
                forceMount
              >
                <LeftSidebarPages
                  ref={pagesRef}
                  pages={pages}
                  folders={folders}
                  currentPageId={currentPageId}
                  onPageSelect={onPageSelect}
                  setCurrentPageId={setCurrentPageId}
                  readOnly={readOnly}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Resize handle - wide hit area, thin visible line on hover */}
        <div
          onMouseDown={handleResizeMouseDown}
          className="absolute top-0 -right-1.5 w-3 h-full cursor-col-resize z-30 flex items-center justify-center group/resize"
        >
          <div className="w-0.5 h-full bg-transparent group-hover/resize:bg-primary/50 group-active/resize:bg-primary/70 transition-colors" />
        </div>
      </div>

      {/* Invisible overlay during resize to prevent iframe from capturing mouse events */}
      {isResizing && <div className="fixed inset-0 z-50 cursor-col-resize" />}

      {/* Element Library Slide-Out (lazy loaded, always mounted to preserve state) */}
      <Suspense fallback={null}>
        <ElementLibrary
          isOpen={showElementLibrary}
          onClose={() => setShowElementLibrary(false)}
          liveLayerUpdates={liveLayerUpdates}
        />
      </Suspense>
    </>
  );
});

export default LeftPanel;
