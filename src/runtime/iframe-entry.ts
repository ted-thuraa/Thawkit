// src/runtime/iframe-entry.ts
// Browser runtime entry: reads window.__unocss then initializes the runtime with chosen presets.
// This file will be bundled into a single runtime JS served to the iframe (self-hosted).

import initUnocssRuntime from "@unocss/runtime";
import { presetWind3, presetAttributify, presetIcons } from "unocss";
import transformerDirectives from "@unocss/transformer-directives";

// Merge user-provided runtime config (window.__unocss) with safe defaults.
// We intentionally keep sensible defaults to behave like Tailwind in the iframe.
function getRuntimeConfig() {
  // Accept a config previously injected (stringified) into iframe head via window.__unocss
  // and merge with our presets & transformers.
  const win: any = typeof window !== "undefined" ? window : {};
  const userCfg =
    win.__unocss && typeof win.__unocss === "object" ? win.__unocss : {};

  // Build base presets array (ensure presetWind3 is present)
  const basePresets = [
    presetWind3({ dark: userCfg.dark ?? "class" }),
    presetAttributify(),
    presetIcons(),
  ];

  const finalCfg = {
    ...userCfg,
    // if user provided presets, append them (user-provided should be functions/objects!)
    presets: Array.isArray(userCfg.presets)
      ? [...basePresets, ...userCfg.presets]
      : basePresets,
    transformers: Array.isArray(userCfg.transformers)
      ? [transformerDirectives(), ...userCfg.transformers]
      : [transformerDirectives()],
    // keep theme from user if present
    theme: userCfg.theme ?? {},
  };

  return finalCfg;
}

// Initialize the runtime. initUnocssRuntime returns a function or object depending on versions.
// We wrap in a try/catch to avoid breaking the host app if anything goes wrong.
try {
  const cfg = getRuntimeConfig();
  // initUnocssRuntime will attach itself to the document and observe DOM mutations
  // so it can generate CSS on the fly. It returns something (implementation detail)
  // but we don't rely on it — the runtime will patch document.head with styles.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const maybeInit: any = initUnocssRuntime;
  if (typeof maybeInit === "function") {
    maybeInit(cfg);
  } else if (maybeInit && typeof maybeInit.default === "function") {
    maybeInit.default(cfg);
  } else {
    // last resort: some runtime builds auto-init on load when window.__unocss exists.
    // if provided runtime matches that behavior, nothing to do.
  }
} catch (e) {
  // If runtime fails, fail gracefully and expose an error on window for diagnostics.
  // eslint-disable-next-line no-console
  console.error("[iframe-unocss-runtime] initialization failed", e);
  (window as any).__unocss_init_error = String(e);
}
