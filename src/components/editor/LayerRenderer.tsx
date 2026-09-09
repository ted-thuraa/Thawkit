"use client";

import { createElement, Fragment } from "react";
import type { MouseEvent } from "react";
import type { Layer } from "@/types/editor/layerSchema";
import type { LayerStyleRow } from "@/lib/editor/resolve-editor-bootstrap";
import {
  getLayerHtmlTag,
  resolveLayerClasses,
  TEXT_BEARING_LAYER_NAMES,
} from "@/lib/editor/canvas-render-utils";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * Recursive Layer -> DOM renderer. Pruned and adapted from Ycode's
 * components/LayerRenderer.tsx (3,803 lines, github.com/ycode/ycode, MIT
 * licensed) — that file's actual size is almost entirely CMS/collection
 * binding, localization, assets, sliders, maps, rich-text/tiptap editing,
 * real-time collaboration locks/presence, and dnd-kit drag-and-drop, none
 * of which apply here. What's ported is the durable core: Layer -> HTML
 * tag/class resolution (canvas-render-utils.ts) and recursive tree
 * rendering with click/hover wired to selection state.
 *
 * SELECTION/HOVER VISUAL TREATMENT — a deliberate simplification, not a
 * verified port: this renders selection/hover as a plain CSS outline
 * applied directly to the element inside the iframe. A production page
 * builder typically draws selection chrome (labels, resize handles) as a
 * SEPARATE overlay positioned outside the iframe via synced
 * getBoundingClientRect() calls, so the outline itself never affects the
 * page's actual layout/rendering. That's very likely closer to what Ycode
 * actually does, but building a position-synced overlay system (resize
 * observers, scroll syncing across the iframe boundary) is a real, sizable
 * chunk of work on its own — deferred as a visual-fidelity improvement.
 * Selection and hover both work correctly with this simpler approach;
 * they just look like a plain outline rather than polished floating
 * selection chrome.
 *
 * NOT RENDERED YET, deferred alongside their own subsystems (see this
 * project's exclusion list elsewhere): CMS-bound text/image content,
 * sliders, lightboxes, maps, rich text formatting (a richText layer's
 * `content` renders as plain text — no bold/links/etc. until the
 * canvas-text-editing sheet exists), forms' actual submit behavior
 * (renders as a plain `<form>`, no submit handler wired).
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface LayerRendererProps {
  layers: Layer[];
  layerStyles?: LayerStyleRow[];
  selectedLayerId?: string | null;
  hoveredLayerId?: string | null;
  onLayerClick?: (layerId: string) => void;
  onLayerHover?: (layerId: string | null) => void;
}

interface LayerNodeProps {
  layer: Layer;
  layerStylesById: Map<string, LayerStyleRow>;
  selectedLayerId?: string | null;
  hoveredLayerId?: string | null;
  onLayerClick?: (layerId: string) => void;
  onLayerHover?: (layerId: string | null) => void;
}

/** Attributes that render the same way for every leaf tag — kept intentionally small; the generic `layer.attributes` bag is spread on top for anything else the layer carries (custom `id`, media playback flags, etc. — see layerSchema.ts's `Layer.attributes`). */
function baseAttributesFor(layer: Layer): Record<string, unknown> {
  const attrs: Record<string, unknown> = { ...(layer.attributes ?? {}) };

  if (layer.name === "image") {
    attrs.src = attrs.src ?? "";
    attrs.alt = attrs.alt ?? "";
  }
  if (layer.name === "checkbox") attrs.type = "checkbox";
  if (layer.name === "radio") attrs.type = "radio";

  return attrs;
}

function LayerNode({
  layer,
  layerStylesById,
  selectedLayerId,
  hoveredLayerId,
  onLayerClick,
  onLayerHover,
}: LayerNodeProps) {
  const tag = getLayerHtmlTag(layer);
  const isSelected = layer.id === selectedLayerId;
  const isHovered = layer.id === hoveredLayerId && !isSelected;

  const className = [
    resolveLayerClasses(layer, layerStylesById),
    // Plain-outline selection/hover treatment — see file header.
    isSelected
      ? "outline outline-2 outline-offset-[-2px] outline-blue-500"
      : "",
    isHovered ? "outline outline-1 outline-offset-[-1px] outline-blue-300" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const handleClick = (event: MouseEvent) => {
    event.stopPropagation();
    onLayerClick?.(layer.id);
  };
  const handleMouseEnter = (event: MouseEvent) => {
    event.stopPropagation();
    onLayerHover?.(layer.id);
  };
  const handleMouseLeave = (event: MouseEvent) => {
    event.stopPropagation();
    onLayerHover?.(null);
  };

  const isTextBearing = TEXT_BEARING_LAYER_NAMES.includes(layer.name);
  const children = layer.children ?? [];

  const props: Record<string, unknown> = {
    key: layer.id,
    ...baseAttributesFor(layer),
    className: className || undefined,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    "data-layer-id": layer.id,
  };

  if (isTextBearing && children.length === 0) {
    // Static authored text only — see layerSchema.ts's `Layer.content`
    // doc comment. No rich formatting yet (plain string, even for
    // richText layers) until the canvas text-editing sheet exists.
    return createElement(tag, props, layer.content ?? "");
  }

  if (children.length > 0) {
    return createElement(
      tag,
      props,
      children.map((child) => (
        <LayerNode
          key={child.id}
          layer={child}
          layerStylesById={layerStylesById}
          selectedLayerId={selectedLayerId}
          hoveredLayerId={hoveredLayerId}
          onLayerClick={onLayerClick}
          onLayerHover={onLayerHover}
        />
      )),
    );
  }

  // Void-ish leaf with no content and no children (image, video, hr, input, ...).
  return createElement(tag, props);
}

export function LayerRenderer({
  layers,
  layerStyles = [],
  selectedLayerId,
  hoveredLayerId,
  onLayerClick,
  onLayerHover,
}: LayerRendererProps) {
  const layerStylesById = new Map(
    layerStyles.map((style) => [style.id, style]),
  );

  return (
    <Fragment>
      {layers.map((layer) => (
        <LayerNode
          key={layer.id}
          layer={layer}
          layerStylesById={layerStylesById}
          selectedLayerId={selectedLayerId}
          hoveredLayerId={hoveredLayerId}
          onLayerClick={onLayerClick}
          onLayerHover={onLayerHover}
        />
      ))}
    </Fragment>
  );
}
