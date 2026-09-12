// path: src/stores/use-components-store.ts

"use client";

import { create } from "zustand";
import { cloneDeep } from "lodash";
import type { ComponentRow } from "@/lib/editor/resolve-editor-bootstrap";
import type { ComponentVariant } from "@/types/editor/layerSchema";
import {
  generateLayerId,
  regenerateIdsWithInteractionRemapping,
} from "@/lib/editor/layer-tree-utils";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Port of Ycode's stores/useComponentsStore.ts (1,721 lines,
 * github.com/ycode/ycode, MIT licensed), scoped to what LeftPanel.tsx's
 * ComponentVariantsSection needs. Ycode's version also owns seven kinds of
 * component-variable CRUD (addTextVariable/addImageVariable/...) and
 * deletion previews that walk every page for affected instances — neither
 * exists here since component-instance placement on a page isn't built yet
 * (RightPanel/BuilderMain still show a placeholder for the component
 * route) — nothing to preview or override against.
 *
 * VARIANT CRUD IS LOCAL-ONLY, NOT PERSISTED: Ycode's equivalents
 * (addVariant/renameVariant/duplicateVariant/deleteVariant/reorderVariants)
 * are async and call REST endpoints. No Server Action for component
 * mutation exists in this project yet — component editing overall is still
 * a placeholder (see CampaignEditorMain.tsx's "component" route branch).
 * Rather than block LeftPanel's variant switcher on that unbuilt
 * persistence layer, these mutate `components` (and `componentDrafts`, the
 * per-variant working copy — same relationship `usePagesStore.pages` has
 * to layer edits) in memory only, matching the exact
 * synchronous-now/persist-later precedent `usePagesStore.ts` already
 * established for layer mutations. A page refresh currently loses variant
 * edits, same as it would have lost page-layer edits before Phase 6 added
 * `saveDraftLayersAction`. Wiring real persistence is follow-up work once
 * component editing itself is built, not a LeftPanel concern.
 * ─────────────────────────────────────────────────────────────────────────
 */

interface ComponentsState {
  components: ComponentRow[];
  error: string | null;
  /** componentId -> variantId -> that variant's working layer tree. Mirrors usePagesStore's "the store IS the draft" approach. */
  componentDrafts: Record<string, Record<string, ComponentRow["layers"]>>;
}

interface ComponentsActions {
  setComponents: (components: ComponentRow[]) => void;
  setError: (error: string | null) => void;
  hydrateFromBootstrap: (components: ComponentRow[]) => void;
  getComponentById: (id: string) => ComponentRow | undefined;

  /** Update one variant's layer tree in the working draft (called from the layers tree while editing a component). Local-only — see file header. */
  updateComponentDraft: (
    componentId: string,
    variantId: string,
    layers: ComponentRow["layers"],
  ) => void;

  addVariant: (
    componentId: string,
    fromVariantId: string | null,
  ) => string | null;
  renameVariant: (componentId: string, variantId: string, name: string) => void;
  duplicateVariant: (componentId: string, variantId: string) => string | null;
  deleteVariant: (componentId: string, variantId: string) => void;
  reorderVariants: (componentId: string, orderedVariantIds: string[]) => void;
}

type ComponentsStore = ComponentsState & ComponentsActions;

/**
 * A component predates variants (older rows may have `variants: null`,
 * relying on the top-level `layers` column — see design-system-schema.ts's
 * comment on that column). Every mutation below normalizes to a real
 * variant list first so callers never have to special-case the "no
 * variants yet" state.
 */
function effectiveVariants(
  component: ComponentRow,
): NonNullable<ComponentRow["variants"]> {
  if (component.variants && component.variants.length > 0)
    return component.variants;
  return [{ id: "default", name: "Default", layers: component.layers }];
}

function withUpdatedComponent(
  components: ComponentRow[],
  componentId: string,
  variants: NonNullable<ComponentRow["variants"]>,
): ComponentRow[] {
  return components.map((c) =>
    c.id === componentId
      ? { ...c, variants, layers: variants[0]?.layers ?? c.layers }
      : c,
  );
}

export const useComponentsStore = create<ComponentsStore>((set, get) => ({
  components: [],
  error: null,
  componentDrafts: {},

  setComponents: (components) => set({ components }),
  setError: (error) => set({ error }),
  hydrateFromBootstrap: (components) => set({ components, error: null }),
  getComponentById: (id) => get().components.find((c) => c.id === id),

  updateComponentDraft: (componentId, variantId, layers) => {
    set((state) => ({
      componentDrafts: {
        ...state.componentDrafts,
        [componentId]: {
          ...state.componentDrafts[componentId],
          [variantId]: layers,
        },
      },
      components: state.components.map((c) => {
        if (c.id !== componentId) return c;
        const variants = effectiveVariants(c).map((v) =>
          v.id === variantId ? { ...v, layers } : v,
        );
        return { ...c, variants, layers: variants[0]?.layers ?? c.layers };
      }),
    }));
  },

  addVariant: (componentId, fromVariantId) => {
    const component = get().components.find((c) => c.id === componentId);
    if (!component) return null;

    const variants = effectiveVariants(component);
    const source =
      (fromVariantId && variants.find((v) => v.id === fromVariantId)) ||
      variants[0];

    const newVariant: ComponentVariant = {
      id: generateLayerId("var"),
      name: `Variant ${variants.length + 1}`,
      layers: source
        ? (cloneDeep(source.layers).map((layer) =>
            regenerateIdsWithInteractionRemapping(layer),
          ) as ComponentRow["layers"])
        : [],
    };

    const newVariants = [...variants, newVariant];
    set((state) => ({
      components: withUpdatedComponent(
        state.components,
        componentId,
        newVariants,
      ),
    }));
    return newVariant.id;
  },

  renameVariant: (componentId, variantId, name) => {
    const component = get().components.find((c) => c.id === componentId);
    if (!component) return;
    const newVariants = effectiveVariants(component).map((v) =>
      v.id === variantId ? { ...v, name } : v,
    );
    set((state) => ({
      components: withUpdatedComponent(
        state.components,
        componentId,
        newVariants,
      ),
    }));
  },

  duplicateVariant: (componentId, variantId) => {
    const component = get().components.find((c) => c.id === componentId);
    if (!component) return null;
    const variants = effectiveVariants(component);
    const source = variants.find((v) => v.id === variantId);
    if (!source) return null;

    const newVariant: ComponentVariant = {
      id: generateLayerId("var"),
      name: `${source.name} Copy`,
      layers: cloneDeep(source.layers).map((layer) =>
        regenerateIdsWithInteractionRemapping(layer),
      ) as ComponentRow["layers"],
    };

    const index = variants.findIndex((v) => v.id === variantId);
    const newVariants = [...variants];
    newVariants.splice(index + 1, 0, newVariant);

    set((state) => ({
      components: withUpdatedComponent(
        state.components,
        componentId,
        newVariants,
      ),
    }));
    return newVariant.id;
  },

  deleteVariant: (componentId, variantId) => {
    const component = get().components.find((c) => c.id === componentId);
    if (!component) return;
    const variants = effectiveVariants(component);
    if (variants.length <= 1) return; // matches ComponentVariantsSection's isOnlyVariant guard

    const newVariants = variants.filter((v) => v.id !== variantId);
    set((state) => {
      const drafts = { ...state.componentDrafts[componentId] };
      delete drafts[variantId];
      return {
        components: withUpdatedComponent(
          state.components,
          componentId,
          newVariants,
        ),
        componentDrafts: { ...state.componentDrafts, [componentId]: drafts },
      };
    });
  },

  reorderVariants: (componentId, orderedVariantIds) => {
    const component = get().components.find((c) => c.id === componentId);
    if (!component) return;
    const variants = effectiveVariants(component);
    const byId = new Map(variants.map((v) => [v.id, v]));
    const newVariants = orderedVariantIds
      .map((id) => byId.get(id))
      .filter((v): v is ComponentVariant => Boolean(v));
    if (newVariants.length !== variants.length) return; // id list didn't match — no-op rather than silently dropping variants
    set((state) => ({
      components: withUpdatedComponent(
        state.components,
        componentId,
        newVariants,
      ),
    }));
  },
}));
