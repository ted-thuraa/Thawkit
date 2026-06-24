// File: src/components/IframeContent.tsx
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Frame from "react-frame-component";
import { defaultTheme, DeviceType } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { BASE_STYLES } from "@/lib/constants/theme";
import { fontsMap } from "@/lib/fonts/index";
import { EditorCanvas } from "./editorPageCanvas";
import { getThemeVariables } from "./helpers/iframeUtil";

export function IframeContent() {
  const { livemode, theme, device, previewMode } = usePageBuilderStore();
  const frameRef = useRef<any>(null); // Weak type here to access contentDocument easily
  const [frameKey, setFrameKey] = useState(Date.now());

  const initialContent = useMemo(() => {
    // Fallback to default if theme is missing properties
    const initialTheme = theme?.colors ? theme : defaultTheme;
    const { colors, typography, design } = initialTheme;

    // 1. GENERATE FONT VARIABLE DEFINITIONS FOR IFRAME
    // We explicitly define the CSS variables inside the iframe's root
    // to match the values provided by Next.js's font loaders.
    const fontDefinitions = Object.values(fontsMap)
      .map((font) => {
        // e.g. --font-inter: '__Inter_e66fe9', '__Inter_Fallback_e66fe9';
        // We use font.style.fontFamily because that is the resolved string from Next.js
        return `${font.variable}: ${font.style.fontFamily};`;
      })
      .join("\n");

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            :root {
              /* --- Bridge: Define Next.js Font Variables inside Iframe --- */
              ${fontDefinitions}

              /* --- Colors --- */
              --theme-primary-color: ${colors.palette.primary};
              --theme-bg-surface: ${colors.background.page};

              /* Text Mapping */
              --theme-heading-color: ${colors.text.heading};
              --theme-body-color: ${colors.text.body};
              --theme-muted-color: color-mix(in srgb, ${colors.text.body} 60%, transparent);

              /* Card Defaults */
              --theme-card-bg: ${colors.background.card};
              --theme-card-heading-color: ${colors.text.card_heading_foreground};
              --theme-card-body-color: ${colors.text.card_body_foreground}; // Assuming this exists in theme
                  
              /* Generated Defaults for Inputs/Borders (Fallback logic) */
              --theme-border-color: color-mix(in srgb, ${colors.text.body} 20%, transparent);
              --theme-input-bg: rgba(0, 0, 0, 0.05);
              --theme-input-text: ${colors.text.body};


              --theme-button-text: ${colors.palette.btnForeground};
              --color-secondary: ${colors.palette.secondary};
              --theme-heading-color: ${colors.text.heading};
              --theme-body-color: ${colors.text.body};
              --theme-page-bg: ${colors.background.page};
              
              --theme-card-heading-color: ${colors.text.card};
              --theme-card-body-color: ${colors.text.card};
              --theme-card-bg: ${colors.background.card};

              /* --- Typography --- */
              /* Now we map the theme selection (KEY) to the CSS Variable */
              /* Store has "inter", we want var(--font-inter) */
              --theme-heading-font: var(${fontsMap[typography.headings.fontFamily as keyof typeof fontsMap]?.variable || fontsMap.inter.variable});
              --theme-body-font: var(${fontsMap[typography.body.fontFamily as keyof typeof fontsMap]?.variable || fontsMap.inter.variable});
              
              --font-weight-headings: ${typography.headings.weight};
              --font-weight-body: ${typography.body.weight};

              /* --- Design --- */
              --theme-card-radius: ${design.card.roundness};
              --theme-card-shadow: ${design.card.shadow};
              --theme-card-border-width: ${design.card.border};
              --theme-card-border-color: ${design.card.border_color};
              --theme-card-transparency: ${design.card.transparency};

              /* --- Base/Fallback --- */
              --font-base: var(--font-inter);
              --font-size-base: 16px;
              --spacing-md: 1rem;
            }
            ${BASE_STYLES}
          </style>
          
          <link rel="stylesheet" href="${
            process.env.NODE_ENV === "development"
              ? "/iframe.css"
              : "/iframe.min.css"
          }">
        </head>
        <body><div id="mountHere"></div></body>
      </html>
    `;
  }, []); // Run once on mount

  const applyTheme = useCallback(() => {
    const doc = frameRef.current?.contentDocument;
    if (!doc) return;

    const root = doc.documentElement;
    // getThemeVariables now handles the Key -> Variable mapping safely
    const themeVariables = getThemeVariables(theme);

    Object.entries(themeVariables).forEach(([variable, value]) => {
      root.style.setProperty(variable, value as string);
    });
  }, [theme]);

  // Robust function to copy Next.js generated font styles to Iframe
  const copyNextFontStyles = useCallback(() => {
    const iframeDoc = frameRef.current?.contentDocument;
    if (!iframeDoc) return;

    const parentHead = document.head;
    const iframeHead = iframeDoc.head;

    // 1. Copy Next.js Font Style Tags (Contains @font-face definitions)
    const fontStyleTags = parentHead.querySelectorAll(
      'style[id^="__NEXT_FONT"]'
    );
    fontStyleTags.forEach((tag) => {
      // Avoid duplicates
      if (!iframeHead.querySelector(`style[id="${tag.id}"]`)) {
        iframeHead.appendChild(tag.cloneNode(true));
      }
    });

    // 2. Copy Font Preloads (Crucial for performance/avoiding FOUT)
    const preloadLinks = parentHead.querySelectorAll(
      'link[rel="preload"][as="font"]'
    );
    preloadLinks.forEach((link) => {
      if (
        !iframeHead.querySelector(`link[href="${link.getAttribute("href")}"]`)
      ) {
        iframeHead.appendChild(link.cloneNode(true));
      }
    });
  }, []);

  useEffect(() => {
    // Initial Sync
    const timer = setTimeout(() => {
      copyNextFontStyles();
      applyTheme();
    }, 100);
    return () => clearTimeout(timer);
  }, [copyNextFontStyles, applyTheme]);

  useEffect(() => {
    // Re-apply theme when store changes
    applyTheme();
  }, [theme, applyTheme]);

  useEffect(() => {
    setFrameKey(Date.now());
  }, []);

  // ... (Device scaling logic remains unchanged)
  const deviceWidths = {
    Desktop: "126.2%",
    Tablet: "768px",
    Mobile: "375px",
  };
  const getDeviceScale = (deviceType: DeviceType) => {
    if (deviceType === "Desktop") return 0.79845;
    if (deviceType === "Tablet") return 0.9;
    return 1;
  };

  const frameStyles = useMemo((): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: "absolute",
      top: 0,
      left: 0,
      border: "none",
      overflow: "hidden",
    };
    if (livemode || previewMode) {
      return {
        ...baseStyles,
        width: "100%",
        height: "100%",
        transform: "none",
        transformOrigin: "unset",
      };
    } else {
      const currentDevice = device as DeviceType;
      return {
        ...baseStyles,
        width: deviceWidths[currentDevice],
        height: "124%",
        transform: `scale(${getDeviceScale(currentDevice)})`,
        transformOrigin: "top left",
        margin: currentDevice !== "Desktop" ? "0 auto" : undefined,
        marginTop: "0",
        right: currentDevice !== "Desktop" ? 0 : undefined,
        maxWidth: deviceWidths[currentDevice],
      };
    }
  }, [livemode, device, previewMode]);

  return (
    <Frame
      key={frameKey}
      ref={frameRef}
      initialContent={initialContent}
      contentDidMount={() => {
        applyTheme();
        copyNextFontStyles();
      }}
      mountTarget="#mountHere"
      style={frameStyles}
    >
      <EditorCanvas />
    </Frame>
  );
}
