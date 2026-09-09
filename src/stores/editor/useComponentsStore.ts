// path: src/stores/use-components-store.ts

"use client";

import { create } from "zustand";
import type { ComponentRow } from "@/lib/editor/resolve-editor-bootstrap";

/**
 * Deliberately minimal port of Ycode's stores/useComponentsStore.ts
 * (1,721 lines, github.com/ycode/ycode, MIT licensed). Ycode's version
 * owns variant CRUD, seven kinds of component variable CRUD
 * (addTextVariable/addImageVariable/addLinkVariable/...), per-variant
 * draft editing with dirty-tracking and debounced autosave, and deletion
 * previews that walk every page for affected instances — all of it async,
 * all of it calling REST endpoints that don't exist in this project yet.
 *
 * This store holds only what's needed before any of that UI exists: the
 * org's component library (hydrated once from resolve-editor-bootstrap.ts,
 * same as use-pages-store.ts) and a pure lookup. Everything else gets
 * built alongside the actual component-editing UI in Phase 6, as real
 * Server Actions — not guessed at here ahead of time.
 */

interface ComponentsState {
  components: ComponentRow[];
  error: string | null;
}

interface ComponentsActions {
  setComponents: (components: ComponentRow[]) => void;
  setError: (error: string | null) => void;
  hydrateFromBootstrap: (components: ComponentRow[]) => void;
  getComponentById: (id: string) => ComponentRow | undefined;
}

type ComponentsStore = ComponentsState & ComponentsActions;

export const useComponentsStore = create<ComponentsStore>((set, get) => ({
  components: [],
  error: null,

  setComponents: (components) => set({ components }),
  setError: (error) => set({ error }),
  hydrateFromBootstrap: (components) => set({ components, error: null }),
  getComponentById: (id) => get().components.find((c) => c.id === id),
}));
