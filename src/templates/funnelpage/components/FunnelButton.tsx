// components/funnel/FunnelButton.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Container (position: stack / inline / split, full-width row) ─────────

const funnelButtonContainerVariants = cva("flex w-full", {
  variants: {
    layout: {
      stack: "flex-col",
      inline: "flex-row",
      /** Stacked on mobile, inline from sm — matches result.tsx's action row. */
      responsive: "flex-col sm:flex-row",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    },
    gap: { sm: "gap-2", md: "gap-3", lg: "gap-4" },
    padding: {
      none: "",
      /** Matches funnelContainer.tsx's PageProceedButton wrapper exactly. */
      page: "px-4 pb-16 pt-4",
    },
  },
  defaultVariants: {
    layout: "inline",
    justify: "center",
    gap: "md",
    padding: "none",
  },
});

export interface FunnelButtonContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof funnelButtonContainerVariants> {
  maxWidth?: "xs" | "sm" | "md" | "lg" | "none";
}

const maxWidthClass: Record<
  NonNullable<FunnelButtonContainerProps["maxWidth"]>,
  string
> = {
  xs: "max-w-xs",
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  none: "",
};

export const FunnelButtonContainer = React.forwardRef<
  HTMLDivElement,
  FunnelButtonContainerProps
>(
  (
    {
      layout,
      justify,
      gap,
      padding,
      maxWidth = "none",
      className,
      children,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      className={cn(
        funnelButtonContainerVariants({ layout, justify, gap, padding }),
        maxWidthClass[maxWidth],
        maxWidth !== "none" && "mx-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
FunnelButtonContainer.displayName = "FunnelButtonContainer";

// ─── Button element (variant styling + loading/disabled state) ────────────

const funnelButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 hover:brightness-90 active:scale-95",
        secondary:
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-2 hover:brightness-95",
        outline:
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-2 bg-transparent hover:bg-black/[.02]",
        ghost:
          "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 underline underline-offset-2 font-medium",
        /**
         * Escape hatch for bespoke, one-off button designs (e.g. a hero
         * template authored in a different visual language) that shouldn't
         * inherit the token variant scale. Contributes zero utility classes —
         * appearance comes entirely from the caller's `className` + `style`.
         * Still gets loading/disabled handling, analyticsId, and ref
         * forwarding for free.
         */
        unstyled: "",
      },
      size: {
        sm: "text-sm px-5 py-2.5",
        md: "text-base px-8 py-3.5",
        lg: "text-base px-8 py-4",
        /** Pairs with variant="unstyled" — no token padding/text-size. */
        none: "",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", size: "md", fullWidth: false },
  },
);

export interface FunnelButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof funnelButtonVariants> {
  /** Analytics/e2e query hook, independent of DOM `id`. */
  analyticsId?: string;
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
}

function buttonThemeStyle(
  variant: NonNullable<FunnelButtonProps["variant"]>,
  disabled: boolean,
): React.CSSProperties {
  // unstyled owns 100% of its own appearance via the style/className the caller passes.
  if (variant === "unstyled") return {};
  if (disabled) return { backgroundColor: "#f3f4f6", color: "#9ca3af" };
  switch (variant) {
    case "primary":
      return {
        backgroundColor: "var(--tk-accent-primary)",
        color: "var(--tk-accent-primary-fg)",
        boxShadow: "0 10px 25px -8px var(--tk-accent-primary-border)",
      };
    case "secondary":
      return {
        borderColor: "var(--tk-accent-secondary)",
        color: "var(--tk-accent-secondary)",
        backgroundColor: "#fff",
      };
    case "outline":
      return {
        borderColor: "var(--tk-accent-primary-border)",
        color: "var(--tk-text-heading)",
      };
    case "ghost":
      return { color: "var(--tk-text-body)" };
  }
}

export const FunnelButton = React.forwardRef<
  HTMLButtonElement,
  FunnelButtonProps
>(
  (
    {
      variant = "primary",
      size,
      fullWidth,
      analyticsId,
      isLoading = false,
      loadingText,
      icon,
      disabled,
      type,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isDisabled = Boolean(disabled) || isLoading;
    return (
      <button
        ref={ref}
        data-tk-id={analyticsId}
        type={type ?? "button"}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        className={cn(
          funnelButtonVariants({ variant, size, fullWidth }),
          className,
        )}
        style={{ ...buttonThemeStyle(variant, isDisabled), ...style }}
        {...props}
      >
        {isLoading ? (
          <>
            {/* border-current so the spinner adapts to every variant's text color */}
            <span
              className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin"
              aria-hidden="true"
            />
            {loadingText ?? children}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  },
);
FunnelButton.displayName = "FunnelButton";
