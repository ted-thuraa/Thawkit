// path: src/stores/use-layer-styles-store.ts

"use client";

import { create } from "zustand";
import type { LayerStyleRow } from "@/lib/editor/resolve-editor-bootstrap";

/**
 * Deliberately minimal port of Ycode's stores/useLayerStylesStore.ts (416
 * lines, github.com/ycode/ycode, MIT licensed) — same rationale as
 * use-components-store.ts. Ycode's CRUD (createStyle/updateStyle/
 * deleteStyle/restoreLayerStyles/renameStyle) is all async and REST-backed;
 * deferred to Phase 6 alongside the real style-editing UI.
 */

interface LayerStylesState {
  styles: LayerStyleRow[];
  error: string | null;
}

interface LayerStylesActions {
  setStyles: (styles: LayerStyleRow[]) => void;
  setError: (error: string | null) => void;
  hydrateFromBootstrap: (styles: LayerStyleRow[]) => void;
  getStyleById: (id: string) => LayerStyleRow | undefined;
  getStylesByGroup: (group: string) => LayerStyleRow[];
}

type LayerStylesStore = LayerStylesState & LayerStylesActions;

export const useLayerStylesStore = create<LayerStylesStore>((set, get) => ({
  styles: [],
  error: null,

  setStyles: (styles) => set({ styles }),
  setError: (error) => set({ error }),
  hydrateFromBootstrap: (styles) => set({ styles, error: null }),
  getStyleById: (id) => get().styles.find((s) => s.id === id),
  getStylesByGroup: (group) =>
    get().styles.filter((s) => s.styleGroup === group),
}));
