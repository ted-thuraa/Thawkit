"use client";
import { getThemeVariables } from "@/app/(main)/app/[appRef]/editor/pages/_components/helpers/iframeUtil";
import { BASE_STYLES } from "@/lib/constants/theme";
import { PageTheme } from "@/stores/pageEditorStore/types";
import { useProjectPublicStore } from "@/stores/ProjectPublicAccessStore/store";
import { useCallback, useEffect, useRef } from "react";

export function ProjectPagesThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, pageType } = useProjectPublicStore();

  let activeTheme: PageTheme;
  if (pageType === "Landing_Page") {
    activeTheme = theme as PageTheme;
  } else if (pageType === "Result_Page") {
    activeTheme = theme as PageTheme;
  }
  const initialized = useRef(false);
  const styleSheetRef = useRef<HTMLStyleElement | null>(null);

  const applyTheme = useCallback(() => {
    const root = document.documentElement;
    const themeVariables = getThemeVariables(activeTheme);

    Object.entries(themeVariables).forEach(([variable, value]) => {
      root.style.setProperty(variable, value);
    });

    // Apply base styles if not already applied
    if (!styleSheetRef.current) {
      const styleSheet = document.createElement("style");
      styleSheet.textContent = BASE_STYLES;
      document.head.appendChild(styleSheet);
      styleSheetRef.current = styleSheet;
    }
  }, [theme, pageType]);

  useEffect(() => {
    applyTheme();
  }, [theme, pageType, applyTheme]);

  return <>{children}</>;
}
