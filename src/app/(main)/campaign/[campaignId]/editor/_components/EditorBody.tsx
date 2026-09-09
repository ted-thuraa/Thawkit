"use client";
import react, {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronsUpDown,
  ExternalLink,
  Eye,
  EyeIcon,
  Home,
  Loader2Icon,
  Plus,
  Save,
  SidebarIcon,
  Trash2,
  X,
} from "lucide-react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { BiLinkExternal } from "react-icons/bi";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { NavUser } from "@/app/(main)/workspace/_components/nav-user";
//import { DeviceType, ProjectData } from "@/stores/pageEditorStore/types";

import { toast } from "sonner";
import { SheetProvider } from "@/providers/sheet-provider";
import Link from "next/link";
import React from "react";
import { CiMobile2 } from "react-icons/ci";
import { HiMiniDeviceTablet } from "react-icons/hi2";
import { GoDeviceDesktop } from "react-icons/go";
import Icon from "@/components/ui/icon";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Empty, EmptyDescription, EmptyTitle } from "@/components/ui/empty";
import { SidebarTab, useCampaignEditorUrl } from "@/hooks/use-editor-url";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { usePagesStore } from "@/stores/editor/usePagesStore";
import { Layer } from "@/types/editor/layerSchema";
import { PageRow } from "@/lib/editor/resolve-editor-bootstrap";
import {
  getElementTemplateDefinitions,
  type EditorElementType,
} from "@/lib/editor/element-templates";
import {
  createPageAction,
  deletePageAction,
  duplicatePageAction,
  reorderPagesAction,
  updatePageAction,
  saveDraftLayersAction,
} from "@/actions/editor/editor-actions";
import LayerTree from "./LayerTree";
import LeftPanel from "./LeftPanel";
import { useLayerUpdates } from "@/hooks/use-layer-updates";

const PageSettingsPanel = lazy(() => import("./PageSettingsPanel"));

/**
 * The editor's left sidebar (Layers / Pages tree tabs).
 *
 * PHASE 6 UPDATE: both tabs now show real data and real mutations —
 * previously empty-state placeholders. Persistence strategy: every
 * mutation (add/delete a layer, create a page) immediately calls the
 * matching Server Action right after updating the local store, rather
 * than batching into a debounced autosave. Simpler to reason about for
 * this pass; a debounced autosave (watching the active page's `layers`
 * reference for changes) is a reasonable later improvement but adds real
 * complexity (coalescing rapid edits, retry-on-failure) not worth taking
 * on in the same pass as "does persistence exist at all yet."
 *
 * `sidebarTab` is optional and, when provided, makes the active tab
 * CONTROLLED by the caller — CampaignEditorMain passes
 * `urlState.sidebarTab` (inferred from the current route type). Tab clicks
 * navigate to the corresponding semantic editor route so the URL remains
 * the source of truth.
 */
export function EditorBody({
  campaignId,
  sidebarTab,
}: {
  campaignId: string;
  sidebarTab?: SidebarTab;
}) {
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const [localTab, setLocalTab] = useState<SidebarTab>("layers");
  const activeTab = sidebarTab ?? localTab;

  const { urlState, navigateToLayers, navigateToPageSettings } =
    useCampaignEditorUrl(campaignId);
  const currentPageId = useEditorStore((state) => state.currentPageId);
  const setCurrentPageId = useEditorStore((state) => state.setCurrentPageId);

  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const setSelectedLayerId = useEditorStore(
    (state) => state.setSelectedLayerId,
  );
  const pages = usePagesStore((state) => state.pages);
  const removePageLocal = usePagesStore((state) => state.removePageLocal);
  const updatePageLocal = usePagesStore((state) => state.updatePageLocal);
  const addLayerFromTemplate = usePagesStore(
    (state) => state.addLayerFromTemplate,
  );
  const deleteLayer = usePagesStore((state) => state.deleteLayer);
  const layerUpdates = useLayerUpdates(currentPageId);
  const currentPage = pages.find((p) => p.id === currentPageId) ?? null;
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [settingsPageId, setSettingsPageId] = useState<string | null>(null);
  const [settingsTab, setSettingsTab] = useState<
    "general" | "seo" | "custom-code"
  >("general");
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const settingsRef =
    useRef<import("./PageSettingsPanel").PageSettingsPanelHandle>(null);

  useEffect(() => {
    if (activeTab === "pages" && urlState.isEditingPage && currentPageId) {
      setSettingsPageId(currentPageId);
      setSettingsTab(urlState.editTab ?? "general");
    }
  }, [activeTab, currentPageId, urlState.editTab, urlState.isEditingPage]);

  async function persistLayers(pageId: string) {
    const layers = usePagesStore
      .getState()
      .pages.find((p) => p.id === pageId)?.layers;
    if (!layers) return;
    useEditorStore.getState().setSaving(true);
    const result = await saveDraftLayersAction(campaignId, pageId, layers);
    useEditorStore.getState().setSaving(false);
    if (!result.success) {
      toast.error(result.error);
    }
  }

  function handleAddLayer(elementType: EditorElementType) {
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
    void persistLayers(currentPage.id);
  }

  function handleDeleteLayer(layerId: string) {
    if (!currentPage) return;
    deleteLayer(currentPage.id, layerId);
    if (selectedLayerId === layerId) setSelectedLayerId(null);
    void persistLayers(currentPage.id);
  }

  async function handleCreatePage() {
    setIsCreatingPage(true);
    const title = `Page ${pages.length + 1}`;
    const result = await createPageAction(campaignId, {
      title,
      pageType: "normal_page",
    });
    setIsCreatingPage(false);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    usePagesStore
      .getState()
      .setPages([...usePagesStore.getState().pages, result.data]);
    navigateToLayers(result.data.id);
  }

  async function handleCreateResultPage() {
    setIsCreatingPage(true);
    const result = await createPageAction(campaignId, {
      title: `Result ${pages.filter((page) => page.pageType === "result_page").length + 1}`,
      pageType: "result_page",
    });
    setIsCreatingPage(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    usePagesStore
      .getState()
      .setPages([...usePagesStore.getState().pages, result.data]);
    navigateToLayers(result.data.id);
  }

  async function handleDuplicatePage(pageId: string) {
    const result = await duplicatePageAction(campaignId, pageId);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    usePagesStore
      .getState()
      .setPages([...usePagesStore.getState().pages, result.data]);
    toast.success(`Duplicated ${result.data.title}`);
  }

  async function handleSavePageSettings(
    pageId: string,
    updates: Parameters<typeof updatePageAction>[2],
  ) {
    const result = await updatePageAction(campaignId, pageId, updates);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    updatePageLocal(pageId, result.data);
    setSettingsPageId(null);
    toast.success("Page settings saved");
  }

  async function handleCloseSettings() {
    if (
      settingsRef.current &&
      !(await settingsRef.current.checkUnsavedChanges())
    )
      return;
    setSettingsPageId(null);
  }

  async function handleSelectPage(pageId: string) {
    if (
      settingsRef.current &&
      !(await settingsRef.current.checkUnsavedChanges())
    )
      return;
    setSettingsPageId(null);
    navigateToLayers(pageId);
  }

  async function handleReorderPage(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    const ordered = pages.slice().sort((a, b) => a.order - b.order);
    const sourceIndex = ordered.findIndex((page) => page.id === sourceId);
    const targetIndex = ordered.findIndex((page) => page.id === targetId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    const [source] = ordered.splice(sourceIndex, 1);
    ordered.splice(targetIndex, 0, source);
    const optimistic = ordered.map((page, index) => ({
      ...page,
      order: index,
    }));
    usePagesStore.getState().setPages(optimistic);
    const result = await reorderPagesAction(
      campaignId,
      optimistic.map((page) => page.id),
    );
    if (!result.success) {
      toast.error(result.error);
      usePagesStore.getState().setPages(pages);
    }
  }

  async function handleDeletePage(pageId: string) {
    if (
      settingsPageId === pageId &&
      settingsRef.current &&
      !(await settingsRef.current.checkUnsavedChanges())
    )
      return;
    if (pages.length <= 1) {
      toast.error("A funnel must have at least one page.");
      return;
    }
    const result = await deletePageAction(campaignId, pageId);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    const remaining = pages
      .filter((page) => page.id !== pageId)
      .sort((a, b) => a.order - b.order);
    removePageLocal(pageId);
    if (pageId === currentPageId && remaining[0]) {
      navigateToLayers(remaining[0].id, { replace: true });
    }
  }

  return (
    <div className="shrink-0 relative h-full" style={{ width: `256px` }}>
      {/* create a left side bar here. should contain the div below here */}
      <LeftPanel
        onLayerSelect={(layerId) => {
          setSelectedLayerId(layerId);

          useEditorStore.getState().setActiveSidebarTab("layers");
        }}
        currentPageId={currentPageId}
        onPageSelect={(pageId: string) => {
          setCurrentPageId(pageId);

          useEditorStore.getState().setActiveSidebarTab("layers");
        }}
        LayerUpdates={layerUpdates}
      />

      {/* Resize handle - wide hit area, thin visible line on hover */}
      <div
        //onMouseDown={handleResizeMouseDown}
        className="absolute top-0 -right-1.5 w-3 h-full cursor-col-resize z-30 flex items-center justify-center group/resize"
      >
        <div className="w-0.5 h-full bg-transparent group-hover/resize:bg-primary/50 group-active/resize:bg-primary/70 transition-colors" />
      </div>
    </div>
  );
}

/**
 * One row in the Layers tree, rendered recursively. No collapse state yet
 * (always expanded) and no drag-to-reorder — see the file-level comment
 * and LayerRenderer.tsx for the same, consistently applied deferral of
 * dnd-kit-based interactions across this phase.
 */
// function LayerTreeRow({
//   layer,
//   depth,
//   selectedLayerId,
//   onSelect,
//   onDelete,
// }: {
//   layer: Layer;
//   depth: number;
//   selectedLayerId: string | null;
//   onSelect: (id: string) => void;
//   onDelete: (id: string) => void;
// }) {
//   const isSelected = layer.id === selectedLayerId;
//   const isBody = layer.id === "body";
//   const hasChildren = (layer.children?.length ?? 0) > 0;

//   return (
//     <div>
//       <div
//         className={`group flex items-center gap-1 rounded-md px-1.5 py-1 text-sm cursor-pointer hover:bg-accent ${
//           isSelected ? "bg-accent text-accent-foreground" : ""
//         }`}
//         style={{ paddingLeft: `${depth * 14 + 6}px` }}
//         onClick={() => onSelect(layer.id)}
//       >
//         {hasChildren ? (
//           <ChevronDown className="size-3 shrink-0 opacity-60" />
//         ) : (
//           <span className="w-3 shrink-0" />
//         )}
//         <span className="truncate flex-1">
//           {layer.customName || layer.name}
//         </span>
//         {!isBody && (
//           <button
//             type="button"
//             className="opacity-0 group-hover:opacity-100 hover:text-destructive"
//             onClick={(e) => {
//               e.stopPropagation();
//               onDelete(layer.id);
//             }}
//             aria-label={`Delete ${layer.customName || layer.name}`}
//           >
//             <Trash2 className="size-3" />
//           </button>
//         )}
//       </div>
//       {layer.children?.map((child) => (
//         <LayerTreeRow
//           key={child.id}
//           layer={child}
//           depth={depth + 1}
//           selectedLayerId={selectedLayerId}
//           onSelect={onSelect}
//           onDelete={onDelete}
//         />
//       ))}
//     </div>
//   );
// }

const PAGE_TYPE_LABEL: Record<PageRow["pageType"], string> = {
  landing_page: "Landing",
  normal_page: "Regular",
  result_page: "Result",
};

function PageTreeRow({
  page,
  isActive,
  onSelect,
  onDelete,
  onDuplicate,
  onEdit,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  page: PageRow;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div
      className={`group relative flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-left hover:bg-accent ${
        isActive ? "bg-accent text-accent-foreground" : ""
      }`}
      draggable={draggable}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onContextMenu={(event) => {
        event.preventDefault();
        setMenuOpen(true);
      }}
    >
      <button
        type="button"
        onClick={onSelect}
        className="min-w-0 flex-1 text-left"
      >
        <span className="block truncate">{page.title}</span>
      </button>
      <span className="text-xs text-muted-foreground shrink-0">
        {PAGE_TYPE_LABEL[page.pageType]}
      </span>
      <button
        type="button"
        aria-label={`Page actions for ${page.title}`}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(event) => {
          event.stopPropagation();
          setMenuOpen((open) => !open);
        }}
      >
        <ChevronsUpDown className="size-3" />
      </button>
      <button
        type="button"
        aria-label={`Delete ${page.title}`}
        onClick={(event) => {
          event.stopPropagation();
          onDelete();
        }}
        className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
      >
        <Trash2 className="size-3" />
      </button>
      {menuOpen && (
        <div
          className="absolute z-50 mt-20 w-40 rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-accent"
            onClick={() => {
              setMenuOpen(false);
              onEdit();
            }}
          >
            Edit settings
          </button>
          <button
            type="button"
            className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-accent"
            onClick={() => {
              setMenuOpen(false);
              onDuplicate();
            }}
          >
            Duplicate
          </button>
          <button
            type="button"
            className="block w-full rounded px-2 py-1 text-left text-xs text-destructive hover:bg-accent"
            onClick={() => {
              setMenuOpen(false);
              onDelete();
            }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
