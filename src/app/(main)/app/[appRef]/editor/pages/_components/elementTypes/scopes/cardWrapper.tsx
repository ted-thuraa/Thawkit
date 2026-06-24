"use client";

import React, { useMemo } from "react";
import { cn, getCardSmartPalette, getSmartPalette } from "@/lib/utils";
import { PageTheme } from "@/stores/pageEditorStore/types";

interface ThemeScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  bgColor?: string; // The hex code that drives the scope
  theme?: PageTheme;
  as?: React.ElementType; // Polymorphic prop (render as div, section, button, etc)
}

export function CardWrapper({
  bgColor,
  children,
  className,
  style,
  theme,
  as: Component = "div",
  ...props
}: ThemeScopeProps) {
  // Memoize calculation to prevent recalculating on every render if color hasn't changed
  const dynamicVars = useMemo(() => {
    return getCardSmartPalette(bgColor);
  }, [bgColor]);

  return (
    <Component
      className={cn("themed-card transition-colors duration-200", className)}
      style={{
        borderRadius: theme?.design?.card?.roundness,
        boxShadow: theme?.design?.card?.shadow,
        borderWidth: theme?.design?.card?.border,
        borderColor: "var(--theme-border-color)",
        ...dynamicVars, // Inject the calculated variables
        ...style, // Allow standard style overrides
        backgroundColor: bgColor || style?.backgroundColor, // Ensure bg is applied
      }}
      {...props}
    >
      {children}
    </Component>
  );
}
