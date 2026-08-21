// components/funnel/FunnelSection.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const funnelSectionVariants = cva(
  "w-full flex flex-col animate-fadeIn mx-auto",
  {
    variants: {
      maxWidth: {
        sm: "max-w-md",
        md: "max-w-xl",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
        "2xl": "max-w-7xl",
        full: "max-w-none",
      },
      padding: {
        none: "px-0 py-0",
        sm: "px-4 py-8",
        md: "px-4 py-16",
        lg: "px-6 py-20",
      },
      gap: {
        none: "gap-0",
        sm: "gap-4",
        md: "gap-8",
        lg: "gap-10",
      },
      align: {
        start: "items-start text-left",
        center: "items-center text-center",
      },
      fullHeight: {
        true: "min-h-screen justify-center",
        false: "",
      },
    },
    defaultVariants: {
      maxWidth: "lg",
      padding: "md",
      gap: "md",
      align: "center",
      fullHeight: false,
    },
  },
);

export interface FunnelSectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof funnelSectionVariants> {
  /** Renders as <section> by default; use "main" for the page-root shell. */
  as?: "section" | "div" | "main";
  /**
   * Stable funnel-step identifier — distinct from schema page.id. Written to
   * both `id` (DOM) and `data-tk-step` (analytics/e2e query hook).
   */
  stepId?: string;
}

// `ref as React.Ref<any>` is a deliberate, contained simplification for the
// polymorphic `as` prop — the alternative (full generic element typing) adds
// substantial complexity for three fixed tag options.
export const FunnelSection = React.forwardRef<HTMLElement, FunnelSectionProps>(
  (
    {
      as: Comp = "section",
      stepId,
      maxWidth,
      padding,
      gap,
      align,
      fullHeight,
      className,
      id,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <Comp
        ref={ref as React.Ref<any>}
        id={id ?? stepId}
        data-tk-step={stepId}
        className={cn(
          funnelSectionVariants({ maxWidth, padding, gap, align, fullHeight }),
          className,
        )}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
FunnelSection.displayName = "FunnelSection";
