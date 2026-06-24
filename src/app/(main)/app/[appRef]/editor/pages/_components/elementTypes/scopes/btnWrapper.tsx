"use client";

import React, { useMemo } from "react";
import { cn, getSmartPalette } from "@/lib/utils";

interface ThemeScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  bgColor?: string; // The hex code that drives the scope
  as?: React.ElementType; // Polymorphic prop (render as div, section, button, etc)
}

export function ButtonWrapper({
  bgColor,
  children,
  className,
  style,
  as: Component = "div",
  ...props
}: ThemeScopeProps) {
  // Memoize calculation to prevent recalculating on every render if color hasn't changed
  const dynamicVars = useMemo(() => {
    return getSmartPalette(bgColor);
  }, [bgColor]);

  return (
    <Component
      className={cn("transition-colors duration-200", className)}
      style={{
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
