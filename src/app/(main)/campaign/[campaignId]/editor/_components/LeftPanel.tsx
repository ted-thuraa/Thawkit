"use client";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Rebuilt from scratch against Ycode's LeftSidebar.tsx (github.com/ycode/
 * ycode, MIT licensed) — see YCODE_EDITOR_INTEGRATION_HANDOFF.md for the
 * project background. The previous version of this file was an
 * unadapted paste of Ycode's source: it referenced variables that were
 * never defined anywhere in the file (`editingComponentId`,
 * `layersForCurrentPage`, `handleLayerSelect`, `handleLayersReorder`,
 * `liveLayerUpdates`, `liveComponentUpdates`, `readOnly`, `pagesRef`,
 * `folders`, `setCurrentPageId`, `isResizing`, `handleResizeMouseDown`),
 * imported a `LeftSidebarPages` that was never imported, and rendered an
 * `ElementLibrary` whose file was empty — it would have thrown at runtime
 * on first render. Tab switching was inert (`onValueChange={() => {}}`).
 *
 * WHAT CHANGED FROM YCODE (collaboration/broadcasting removed, everything
 * else ported):
 *   - No `useLiveLayerUpdates`/`useLiveComponentUpdates`/resource-locking —
 *     this project has no real-time collaboration (see handoff doc §3).
 *     `useLayerUpdates` is this project's own already-neutered stand-in.
 *   - No folders in the Pages tab — PagesTree.tsx renders a flat, ordered
 *     list; folders were evaluated and explicitly rejected for this
 *     project (handoff doc §2/§9).
 *   - Page creation is scoped to this project's actual 3 page types
 *     (landing_page/normal_page/result_page) instead of Ycode's
 *     Regular/CMS/Folder menu — landing_page is capped at one per funnel
 *     since it's the only type that renders at "/".
 *   - Component variants are LOCAL-ONLY (not persisted) — see
 *     useComponentsStore.ts's file header for why.
 *   - The Element Library's Layouts/Components tabs are honest empty
 *     states rather than fabricated functionality — see ElementLibrary.tsx.
 *
 * OWNERSHIP: this component now owns everything the old EditorBody.tsx
 * used to hold (page/layer CRUD handlers, page-settings panel state,
 * resizable-sidebar state) — matching Ycode's own LeftSidebar, which reads
 * its stores directly rather than receiving mutation handlers prop-drilled
 * from a parent. EditorBody.tsx is now a thin pass-through, matching how
 * little Ycode's own top-level route components do.
 * ─────────────────────────────────────────────────────────────────────────
 */

import React, {
  Suspense,
  lazy,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAlertDialog } from "@/providers/alert-dialog-provider";
import { useCampaignEditorUrl, type SidebarTab } from "@/hooks/use-editor-url";
import { useLayerUpdates } from "@/hooks/use-layer-updates";
import { useResizableSidebar } from "@/hooks/use-resizable-sidebar";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { usePagesStore } from "@/stores/editor/usePagesStore";
import { useComponentsStore } from "@/stores/editor/useComponentsStore";
import type { Layer } from "@/types/editor/layerSchema";
import type { PageType } from "@/types/PageCMS/pageSchema";
import {
  createPageAction,
  deletePageAction,
  duplicatePageAction,
  reorderPagesAction,
  saveDraftLayersAction,
  updatePageAction,
} from "@/actions/editor/editor-actions";
import {
  getElementTemplateDefinitions,
  type EditorElementType,
} from "@/lib/editor/element-templates";
import LayerTree from "./LayerTree";
import PagesTree, { PAGE_TYPE_LABEL } from "./PagesTree";
import ComponentVariantsSection from "./ComponentVariantsSection";
import type { PageSettingsPanelHandle } from "./PageSettingsPanel";

const PageSettingsPanel = lazy(() => import("./PageSettingsPanel"));
const ElementLibrary = lazy(() => import("./ElementLibrary"));

interface LeftPanelProps {
  campaignId: string;
  readOnly?: boolean;
}

const LeftPanel = React.memo(function LeftPanel({
  campaignId,
  readOnly = false,
}: LeftPanelProps) {
  const { showAlertDialog } = useAlertDialog();
  const {
    urlState,
    navigateToLayers,
    navigateToPages,
    navigateToPageSettings,
  } = useCampaignEditorUrl(campaignId);

  const {
    width: sidebarWidth,
    isDragging: isResizing,
    handleMouseDown: handleResizeMouseDown,
  } = useResizableSidebar({ side: "left" });

  const [showElementLibrary, setShowElementLibrary] = useState(false);

  // ─── Store state ──────────────────────────────────────────────────────
  const currentPageId = useEditorStore((s) => s.currentPageId);
  const selectedLayerId = useEditorStore((s) => s.selectedLayerId);
  const setSelectedLayerId = useEditorStore((s) => s.setSelectedLayerId);
  const setActiveSidebarTab = useEditorStore((s) => s.setActiveSidebarTab);
  const editingComponentId = useEditorStore((s) => s.editingComponentId);
  const editingComponentVariantId = useEditorStore(
    (s) => s.editingComponentVariantId,
  );
  const setEditingComponentVariantId = useEditorStore(
    (s) => s.setEditingComponentVariantId,
  );

  const pages = usePagesStore((s) => s.pages);
  const setPages = usePagesStore((s) => s.setPages);
  const updatePageLocal = usePagesStore((s) => s.updatePageLocal);
  const removePageLocal = usePagesStore((s) => s.removePageLocal);
  const addLayerFromTemplate = usePagesStore((s) => s.addLayerFromTemplate);
  const setLayers = usePagesStore((s) => s.setLayers);

  const components = useComponentsStore((s) => s.components);
  const componentDrafts = useComponentsStore((s) => s.componentDrafts);
  const updateComponentDraft = useComponentsStore(
    (s) => s.updateComponentDraft,
  );
  const addVariant = useComponentsStore((s) => s.addVariant);
  const renameVariant = useComponentsStore((s) => s.renameVariant);
  const duplicateVariant = useComponentsStore((s) => s.duplicateVariant);
  const deleteVariant = useComponentsStore((s) => s.deleteVariant);
  const reorderVariants = useComponentsStore((s) => s.reorderVariants);

  const layerUpdates = useLayerUpdates(currentPageId);

  // Keep every draft variant seeded — ComponentVariantsSection and the
  // layers tree both read from `componentDrafts`, not straight from
  // `component.variants`, so a freshly-opened component needs its drafts
  // populated once before either can show anything.
  useEffect(() => {
    if (!editingComponentId) return;
    const component = components.find((c) => c.id === editingComponentId);
    if (!component) return;
    const existingDrafts = componentDrafts[editingComponentId];
    const variants =
      component.variants && component.variants.length > 0
        ? component.variants
        : [{ id: "default", name: "Default", layers: component.layers }];
    for (const variant of variants) {
      if (!existingDrafts?.[variant.id]) {
        updateComponentDraft(editingComponentId, variant.id, variant.layers);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingComponentId, components]);

  const activeTab: SidebarTab = urlState.sidebarTab;
  useEffect(() => {
    setActiveSidebarTab(urlState.sidebarTab);
  }, [urlState.sidebarTab, setActiveSidebarTab]);

  const currentPage = pages.find((p) => p.id === currentPageId) ?? null;
  const editingComponent = editingComponentId
    ? (components.find((c) => c.id === editingComponentId) ?? null)
    : null;

  const activeComponentVariantId = useMemo(() => {
    if (!editingComponentId) return null;
    const drafts = componentDrafts[editingComponentId];
    if (!drafts) return null;
    if (editingComponentVariantId && drafts[editingComponentVariantId])
      return editingComponentVariantId;
    return Object.keys(drafts)[0] ?? null;
  }, [editingComponentId, editingComponentVariantId, componentDrafts]);

  const layersForCurrentPage: Layer[] = useMemo(() => {
    if (editingComponentId && activeComponentVariantId) {
      return (
        componentDrafts[editingComponentId]?.[activeComponentVariantId] ?? []
      );
    }
    return currentPage?.layers ?? [];
  }, [
    editingComponentId,
    activeComponentVariantId,
    componentDrafts,
    currentPage,
  ]);

  // ─── Persistence ──────────────────────────────────────────────────────
  // No debounced autosave exists in this project yet (deliberately
  // deferred — see editor-actions.ts's file header), so this is a light
  // debounce rather than a full coalescing queue: enough to avoid firing a
  // Server Action on every intermediate render, not a replacement for
  // real autosave infrastructure. Component-draft edits are intentionally
  // NOT persisted here — see useComponentsStore.ts's file header.
  const previousLayersRef = useRef<{ pageId: string; layers: Layer[] } | null>(
    null,
  );

  const persistLayers = useCallback(
    async (pageId: string) => {
      const layers = usePagesStore
        .getState()
        .pages.find((p) => p.id === pageId)?.layers;
      if (!layers) return;
      useEditorStore.getState().setSaving(true);
      const result = await saveDraftLayersAction(campaignId, pageId, layers);
      useEditorStore.getState().setSaving(false);
      if (!result.success) toast.error(result.error);
    },
    [campaignId],
  );

  useEffect(() => {
    if (editingComponentId || !currentPageId || !currentPage) {
      previousLayersRef.current = null;
      return;
    }
    const prev = previousLayersRef.current;
    previousLayersRef.current = {
      pageId: currentPageId,
      layers: currentPage.layers,
    };
    if (!prev || prev.pageId !== currentPageId) return; // just switched/loaded pages — nothing to save yet
    if (prev.layers === currentPage.layers) return; // no structural change

    const timeout = setTimeout(() => {
      void persistLayers(currentPageId);
    }, 400);
    return () => clearTimeout(timeout);
  }, [currentPage, currentPageId, editingComponentId, persistLayers]);

  // ─── Layers tab handlers ──────────────────────────────────────────────
  const handleLayerSelect = useCallback(
    (layerId: string | null) => {
      setSelectedLayerId(layerId);
    },
    [setSelectedLayerId],
  );

  const handleLayersReorder = useCallback(
    (newLayers: Layer[]) => {
      if (editingComponentId && activeComponentVariantId) {
        updateComponentDraft(
          editingComponentId,
          activeComponentVariantId,
          newLayers,
        );
      } else if (currentPageId) {
        setLayers(currentPageId, newLayers);
      }
    },
    [
      editingComponentId,
      activeComponentVariantId,
      updateComponentDraft,
      currentPageId,
      setLayers,
    ],
  );

  const handleAddElement = useCallback(
    (elementType: EditorElementType) => {
      if (editingComponentId) {
        // addLayerFromTemplate only targets a page's layer tree today —
        // see ElementLibrary.tsx's file header. Honest limitation rather
        // than a silent no-op.
        toast.error(
          "Adding elements while editing a component isn't wired up yet.",
        );
        return;
      }
      if (!currentPage) return;
      const result = addLayerFromTemplate(
        currentPage.id,
        selectedLayerId,
        elementType,
      );
      if (!result) {
        toast.error("This element cannot be added at the selected location.");
        return;
      }
      setSelectedLayerId(result.newLayerId);
      if (result.parentToExpand) {
        window.dispatchEvent(
          new CustomEvent("expandLayer", {
            detail: { layerId: result.parentToExpand },
          }),
        );
      }
      setShowElementLibrary(false);
    },
    [
      editingComponentId,
      currentPage,
      addLayerFromTemplate,
      selectedLayerId,
      setSelectedLayerId,
    ],
  );

  const handleExitComponentEditing = useCallback(() => {
    // No "edit this component instance" entry point exists yet (see
    // BuilderMain.tsx's placeholder for the "component" route), so there's
    // no real return-to-page context to restore — falling back to the
    // funnel's first page is the honest, functional default for now.
    const target = pages[0]?.id;
    if (target) navigateToLayers(target);
  }, [pages, navigateToLayers]);

  // ─── Pages tab state & handlers ───────────────────────────────────────
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [settingsPageId, setSettingsPageId] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState<
    "general" | "seo" | "custom-code"
  >("general");
  const settingsRef = useRef<PageSettingsPanelHandle>(null);

  useEffect(() => {
    if (activeTab === "pages" && urlState.isEditingPage && currentPageId) {
      setSettingsPageId(currentPageId);
      setSettingsTab(urlState.editTab ?? "general");
    }
  }, [activeTab, currentPageId, urlState.editTab, urlState.isEditingPage]);

  const checkAndCloseSettings = useCallback(async (): Promise<boolean> => {
    if (settingsPageId && settingsRef.current) {
      const canProceed = await settingsRef.current.checkUnsavedChanges();
      if (!canProceed) return false;
    }
    setSettingsPageId(null);
    return true;
  }, [settingsPageId]);

  const hasLandingPage = pages.some((p) => p.pageType === "landing_page");

  async function handleCreatePage(pageType: PageType) {
    if (pageType === "landing_page" && hasLandingPage) {
      toast.error("This funnel already has a landing page.");
      return;
    }
    setIsCreatingPage(true);
    const title =
      pageType === "landing_page"
        ? "Landing Page"
        : `${PAGE_TYPE_LABEL[pageType]} ${pages.filter((p) => p.pageType === pageType).length + 1}`;
    const result = await createPageAction(campaignId, { title, pageType });
    setIsCreatingPage(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setPages([...usePagesStore.getState().pages, result.data]);
    navigateToLayers(result.data.id);
  }

  async function handleDuplicatePage(pageId: string) {
    const page = pages.find((p) => p.id === pageId);
    if (page?.pageType === "landing_page") {
      toast.error("Only one landing page is allowed per funnel.");
      return;
    }
    const result = await duplicatePageAction(campaignId, pageId);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setPages([...usePagesStore.getState().pages, result.data]);
    toast.success(`Duplicated ${result.data.title}`);
  }

  async function handleSavePageSettings(
    updates: Parameters<typeof updatePageAction>[2],
  ) {
    if (!settingsPageId) return;
    const result = await updatePageAction(campaignId, settingsPageId, updates);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    updatePageLocal(settingsPageId, result.data);
    setSettingsPageId(null);
    toast.success("Page settings saved");
  }

  async function handleCloseSettings() {
    if (!(await checkAndCloseSettings())) return;
  }

  async function handleSelectPage(pageId: string) {
    if (!(await checkAndCloseSettings())) return;
    navigateToLayers(pageId);
  }

  async function handleReorderPages(orderedPageIds: string[]) {
    const optimistic = orderedPageIds
      .map((id, index) => {
        const page = pages.find((p) => p.id === id);
        return page ? { ...page, order: index } : null;
      })
      .filter((p): p is (typeof pages)[number] => p !== null);
    setPages(optimistic);
    const result = await reorderPagesAction(campaignId, orderedPageIds);
    if (!result.success) {
      toast.error(result.error);
      setPages(pages);
    }
  }

  async function handleDeletePage(pageId: string) {
    if (settingsPageId === pageId && !(await checkAndCloseSettings())) return;
    if (pages.length <= 1) {
      toast.error("A funnel must have at least one page.");
      return;
    }
    const page = pages.find((p) => p.id === pageId);
    const confirmed = await showAlertDialog({
      title: `Delete "${page?.title ?? "this page"}"?`,
      description: "This action cannot be undone.",
      confirmText: "Delete",
      danger: true,
    });
    if (!confirmed) return;

    const result = await deletePageAction(campaignId, pageId);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    const remaining = pages
      .filter((p) => p.id !== pageId)
      .sort((a, b) => a.order - b.order);
    removePageLocal(pageId);
    if (pageId === currentPageId && remaining[0]) {
      navigateToLayers(remaining[0].id, { replace: true });
    }
  }

  // ─── Tab switching ────────────────────────────────────────────────────
  async function handleTabChange(value: string) {
    const newTab = value as SidebarTab;
    if (newTab === activeTab) return;
    if (activeTab === "pages" && settingsPageId) {
      const canProceed = await checkAndCloseSettings();
      if (!canProceed) return;
    }
    setShowElementLibrary(false);
    const targetPageId = currentPageId ?? pages[0]?.id;
    if (!targetPageId) return;
    if (newTab === "layers") navigateToLayers(targetPageId);
    else navigateToPages(targetPageId);
  }

  return (
    <div
      className="shrink-0 relative h-full flex flex-col border-r bg-background"
      style={{ width: sidebarWidth }}
    >
      <div className="flex-1 min-h-0 overflow-y-auto px-4">
        {editingComponent ? (
          <>
            <header className="py-5 flex items-center gap-2 shrink-0 sticky top-0 bg-linear-to-b from-background to-transparent z-20">
              <button
                type="button"
                onClick={handleExitComponentEditing}
                className="rounded-md p-1 -ml-1 hover:bg-secondary/50"
                aria-label="Back to page"
              >
                <Icon name="arrowLeft" className="size-3" />
              </button>
              <span className="font-medium truncate">
                {editingComponent.name}
              </span>
            </header>

            <ComponentVariantsSection
              component={editingComponent}
              activeVariantId={activeComponentVariantId}
              onSelectVariant={(id) => setEditingComponentVariantId(id)}
              onAddVariant={() => {
                const id = addVariant(
                  editingComponent.id,
                  activeComponentVariantId,
                );
                if (id) setEditingComponentVariantId(id);
              }}
              onRenameVariant={(id, name) =>
                renameVariant(editingComponent.id, id, name)
              }
              onDuplicateVariant={(id) => {
                const newId = duplicateVariant(editingComponent.id, id);
                if (newId) setEditingComponentVariantId(newId);
              }}
              onDeleteVariant={(id) => deleteVariant(editingComponent.id, id)}
              onReorderVariants={(ids) =>
                reorderVariants(editingComponent.id, ids)
              }
            />

            <LayerTree
              layers={layersForCurrentPage}
              onLayerSelect={handleLayerSelect}
              onReorder={handleLayersReorder}
              pageId={currentPageId ?? ""}
              LayerUpdates={layerUpdates}
            />
          </>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="h-full flex flex-col gap-0!"
          >
            <TabsList className="w-full shrink-0 sticky top-0 z-20 mt-3">
              <TabsTrigger value="layers">Layers</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>

            <TabsContent
              value="layers"
              className="flex-1 min-h-0 flex flex-col"
            >
              <header className="py-5 flex justify-between shrink-0 sticky top-0 bg-linear-to-b from-background to-transparent z-20">
                <span className="font-medium">Layers</span>
                {!readOnly && (
                  <Button
                    size="xs"
                    variant="secondary"
                    onClick={() => setShowElementLibrary((open) => !open)}
                    aria-label="Add element"
                  >
                    <Icon
                      name="plus"
                      className={
                        showElementLibrary
                          ? "rotate-45 transition-transform"
                          : "transition-transform"
                      }
                    />
                  </Button>
                )}
              </header>

              {currentPage ? (
                <LayerTree
                  layers={layersForCurrentPage}
                  onLayerSelect={handleLayerSelect}
                  onReorder={handleLayersReorder}
                  pageId={currentPage.id}
                  LayerUpdates={layerUpdates}
                />
              ) : (
                <Empty>
                  <EmptyTitle>No page selected</EmptyTitle>
                  <EmptyDescription>
                    Choose a page from the Pages tab to see its layers.
                  </EmptyDescription>
                </Empty>
              )}
            </TabsContent>

            <TabsContent value="pages" className="flex-1 min-h-0 flex flex-col">
              <header className="py-5 flex justify-between shrink-0 sticky top-0 bg-linear-to-b from-background to-transparent z-20">
                <span className="font-medium">Pages</span>
                {!readOnly && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="xs"
                        variant="secondary"
                        disabled={isCreatingPage}
                        aria-label="Add page"
                      >
                        <Icon name="plus" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        disabled={hasLandingPage}
                        onSelect={() => handleCreatePage("landing_page")}
                      >
                        <Icon name="homepage" className="size-3 opacity-60" />
                        Landing page
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleCreatePage("normal_page")}
                      >
                        <Icon name="page" className="size-3 opacity-60" />
                        Page
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleCreatePage("result_page")}
                      >
                        <Icon name="page" className="size-3 opacity-60" />
                        Result page
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </header>

              {pages.length === 0 ? (
                <Empty>
                  <EmptyTitle>No pages yet</EmptyTitle>
                  <EmptyDescription>
                    Create a page to get started.
                  </EmptyDescription>
                </Empty>
              ) : (
                <PagesTree
                  pages={pages}
                  currentPageId={currentPageId}
                  onPageSelect={handleSelectPage}
                  onPageSettings={(pageId) => {
                    setSettingsPageId(pageId);
                    setSettingsTab("general");
                    navigateToPageSettings(pageId, "general");
                  }}
                  onDuplicate={handleDuplicatePage}
                  onDelete={handleDeletePage}
                  onReorder={handleReorderPages}
                  readOnly={readOnly}
                />
              )}

              <Suspense fallback={null}>
                {settingsPageId &&
                  (() => {
                    const settingsPage = pages.find(
                      (p) => p.id === settingsPageId,
                    );
                    if (!settingsPage) return null;
                    return (
                      <PageSettingsPanel
                        ref={settingsRef}
                        page={settingsPage}
                        activeTab={settingsTab}
                        onTabChange={setSettingsTab}
                        onClose={handleCloseSettings}
                        onSave={handleSavePageSettings}
                      />
                    );
                  })()}
              </Suspense>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {!readOnly && (
        <Suspense fallback={null}>
          <ElementLibrary
            isOpen={showElementLibrary}
            onClose={() => setShowElementLibrary(false)}
            sidebarWidth={sidebarWidth}
            onAddElement={handleAddElement}
          />
        </Suspense>
      )}

      {/* Resize handle - wide hit area, thin visible line on hover */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute top-0 -right-1.5 w-3 h-full cursor-col-resize z-30 flex items-center justify-center group/resize"
      >
        <div
          className={
            "w-0.5 h-full transition-colors " +
            (isResizing
              ? "bg-primary/70"
              : "bg-transparent group-hover/resize:bg-primary/50")
          }
        />
      </div>
    </div>
  );
});

export default LeftPanel;
