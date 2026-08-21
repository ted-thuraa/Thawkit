// components/funnel/FunnelCard.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Container (chrome: border / radius / padding / selected state) ───────

const funnelCardContainerVariants = cva(
  "relative w-full rounded-[1.75rem] border transition-all duration-200",
  {
    variants: {
      variant: {
        /** Static display card — mini-results, category cards, panels. */
        display: "",
        /** Selectable option card — quiz choice buttons. */
        interactive:
          "cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      },
      padding: {
        sm: "p-6",
        md: "p-8 md:p-10",
        lg: "p-10 md:p-12",
      },
      selected: {
        true: "shadow-md",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "interactive",
        selected: false,
        className: "border-gray-200 hover:border-gray-400 hover:shadow-sm",
      },
    ],
    defaultVariants: { variant: "display", padding: "md", selected: false },
  },
);

export interface FunnelCardContainerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect" | "onClick">,
    VariantProps<typeof funnelCardContainerVariants> {
  /** Analytics/e2e query hook — independent of DOM `id`, safe to reuse across renders. */
  analyticsId?: string;
  /** Renders as a native <button type="button"> — keyboard focus/activation for free. */
  asButton?: boolean;
  onSelect?: () => void;
  onClick?: (e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>) => void;
}

export const FunnelCardContainer = React.forwardRef<
  HTMLDivElement | HTMLButtonElement,
  FunnelCardContainerProps
>(
  (
    {
      variant = "display",
      padding,
      selected,
      analyticsId,
      asButton = false,
      onSelect,
      onClick,
      className,
      style,
      children,
      ...rest
    },
    ref,
  ) => {
    const themeStyle: React.CSSProperties =
      variant === "interactive"
        ? selected
          ? {
              borderColor: "var(--tk-accent-primary)",
              backgroundColor: "var(--tk-accent-primary-bg)",
            }
          : { backgroundColor: "var(--tk-card-bg)" }
        : {
            backgroundColor: "var(--tk-card-bg)",
            borderColor: "var(--tk-accent-primary-border)",
          };

    const mergedClassName = cn(
      funnelCardContainerVariants({ variant, padding, selected }),
      className,
    );
    const mergedStyle = { ...themeStyle, ...style };
    const handleClick = (
      e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>,
    ) => {
      onClick?.(e);
      onSelect?.();
    };

    if (variant === "interactive" && asButton) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          aria-pressed={selected ? selected : undefined}
          data-tk-id={analyticsId}
          data-selected={selected ? "true" : undefined}
          className={mergedClassName}
          style={mergedStyle}
          onClick={handleClick}
          {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
        >
          {children}
        </button>
      );
    }

    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        data-tk-id={analyticsId}
        data-selected={selected ? "true" : undefined}
        className={mergedClassName}
        style={mergedStyle}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </div>
    );
  },
);
FunnelCardContainer.displayName = "FunnelCardContainer";

// ─── Content (typography/spacing slot) ─────────────────────────────────────

const funnelCardContentVariants = cva("flex flex-col", {
  variants: {
    spacing: { sm: "space-y-2", md: "space-y-4", lg: "space-y-6" },
    align: {
      start: "items-start text-left",
      center: "items-center text-center",
    },
  },
  defaultVariants: { spacing: "md", align: "start" },
});

export interface FunnelCardContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof funnelCardContentVariants> {}

export const FunnelCardContent = React.forwardRef<
  HTMLDivElement,
  FunnelCardContentProps
>(({ spacing, align, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(funnelCardContentVariants({ spacing, align }), className)}
    style={{ color: "var(--tk-text-body)" }}
    {...props}
  >
    {children}
  </div>
));
FunnelCardContent.displayName = "FunnelCardContent";
