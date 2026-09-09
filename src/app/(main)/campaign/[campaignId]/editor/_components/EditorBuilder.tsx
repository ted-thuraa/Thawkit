"use client";

import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { LayerRenderer } from "@/components/editor/LayerRenderer";
import { useEditorStore } from "@/stores/editor/useEditorStore";
import { useLayerStylesStore } from "@/stores/editor/useLayerStylesStore";
import type { Layer } from "@/types/editor/layerSchema";
import type { Breakpoint } from "@/types/editor/layerSchema";

/**
 * ─────────────────────────────────────────────────────────────────────────
 * The canvas — an isolated iframe hosting its own React root, so the
 * rendered page's own styles/classes can never leak into (or be
 * overridden by) the editor chrome's styles, and vice versa. Adapted from
 * Ycode's Canvas.tsx (github.com/ycode/ycode, MIT licensed): an iframe,
 * loaded once, with Tailwind's CDN script running inside it doing
 * real-time JIT compilation of whatever classes appear in the rendered
 * HTML — no build step, no pre-generated stylesheet. See
 * canvas-render-utils.ts's file header for why this matters: `Layer`s
 * carry plain Tailwind class strings, and this CDN script is what turns
 * them into actual CSS.
 *
 * WHY srcDoc, NOT document.write(): the iframe's initial content is set
 * once via the `srcDoc` attribute (a static HTML string, defined below at
 * module scope). `document.write()` after initial load can behave
 * inconsistently across browsers (in some cases clearing content it
 * shouldn't) — `srcDoc` sidesteps that entirely, and its `load` event
 * fires exactly once, giving a single clean point to mount the React root.
 *
 * WHY THE IFRAME IS NEVER RECREATED ON RE-RENDER: recreating the iframe
 * element would reload the Tailwind CDN script from scratch on every
 * layer-tree change — a real, visible flash, and wasted network traffic.
 * Instead, the iframe mounts once (empty dependency array below), and
 * every subsequent update calls `root.render()` again on the SAME React
 * root, the same pattern any other React app uses to re-render — nothing
 * about being inside an iframe changes that, once the root exists.
 * ─────────────────────────────────────────────────────────────────────────
 */

const BREAKPOINT_WIDTHS: Record<Breakpoint, string> = {
  mobile: "390px",
  tablet: "768px",
  desktop: "100%",
};

const IFRAME_DOCUMENT = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      html, body { margin: 0; padding: 0; min-height: 100%; }
      * { box-sizing: border-box; }
    </style>
  </head>
  <body>
    <div id="canvas-root"></div>
  </body>
</html>`;

export function EditorBuilder({ layers }: { layers: Layer[] }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rootRef = useRef<Root | null>(null);
  const [isIframeReady, setIsIframeReady] = useState(false);

  const activeBreakpoint = useEditorStore((state) => state.activeBreakpoint);
  const selectedLayerId = useEditorStore((state) => state.selectedLayerId);
  const hoveredLayerId = useEditorStore((state) => state.hoveredLayerId);
  const setSelectedLayerId = useEditorStore(
    (state) => state.setSelectedLayerId,
  );
  const setHoveredLayerId = useEditorStore((state) => state.setHoveredLayerId);
  const layerStyles = useLayerStylesStore((state) => state.styles);

  // Mount the React root inside the iframe's own document once, on its
  // `load` event. See file header for why this only ever runs once per
  // EditorBuilder mount (empty dependency array) rather than per layers
  // change.
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const handleLoad = () => {
      const doc = iframe.contentDocument;
      const mountNode = doc?.getElementById("canvas-root");
      if (!doc || !mountNode) return;
      rootRef.current = createRoot(mountNode);
      setIsIframeReady(true);
    };

    iframe.addEventListener("load", handleLoad);
    return () => {
      iframe.removeEventListener("load", handleLoad);
      rootRef.current?.unmount();
      rootRef.current = null;
      setIsIframeReady(false);
    };
  }, []);

  // Re-render into the existing root on every relevant change. React's
  // event delegation for a root created via createRoot() binds to that
  // root's OWN owner document — since `mountNode` above belongs to the
  // iframe's contentDocument, click/hover handlers passed to LayerRenderer
  // fire correctly from inside the iframe without any extra plumbing.
  useEffect(() => {
    if (!isIframeReady || !rootRef.current) return;
    rootRef.current.render(
      <LayerRenderer
        layers={layers}
        layerStyles={layerStyles}
        selectedLayerId={selectedLayerId}
        hoveredLayerId={hoveredLayerId}
        onLayerClick={setSelectedLayerId}
        onLayerHover={setHoveredLayerId}
      />,
    );
  }, [
    isIframeReady,
    layers,
    layerStyles,
    selectedLayerId,
    hoveredLayerId,
    setSelectedLayerId,
    setHoveredLayerId,
  ]);

  return (
    <div className="flex h-full w-full items-start justify-center overflow-auto bg-muted/40 p-8">
      <iframe
        ref={iframeRef}
        srcDoc={IFRAME_DOCUMENT}
        title="Page canvas"
        className="h-full min-h-[600px] border bg-white shadow-sm transition-[width] duration-150"
        style={{ width: BREAKPOINT_WIDTHS[activeBreakpoint] }}
      />
    </div>
  );
}
