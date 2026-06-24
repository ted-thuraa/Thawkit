// ThawkitLogo.tsx
import React from "react";

// Define the shape of the props
interface ThawkitLogoProps {
  /**
   * Color variant for the logo, adapting to light or dark backgrounds.
   * 'light': Dark text/icon for a light background (default)
   * 'dark': Light text/icon for a dark background
   */
  variant?: "light" | "dark";
  /**
   * Size of the logo for different UI contexts.
   * 'sm': Small (e.g., sidebar header)
   * 'md': Medium (e.g., dashboard header)
   * 'lg': Large (e.g., landing page hero)
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional className to apply custom styles to the container.
   */
  className?: string;
}

/**
 * A sleek, responsive logo component for the Thawkit application.
 * Inspired by a minimalist, tech-modern (Stripe/Apple) aesthetic.
 * The icon subtly incorporates the 'thaw' concept using a vertical gradient.
 */
export const ThawkitLogo: React.FC<ThawkitLogoProps> = ({
  variant = "light",
  size = "md",
  className = "",
}) => {
  // --- Tailwind Class Mapping ---

  // 1. Text Color for Dark/Light Mode
  const textColorClass = variant === "dark" ? "text-white" : "text-gray-900";

  // 2. Size Mapping for Font and Icon
  let fontSizeClass;
  let iconSize;
  switch (size) {
    case "sm":
      fontSizeClass = "text-base font-semibold"; // ~1rem
      iconSize = 20;
      break;
    case "md":
      fontSizeClass = "text-xl font-bold"; // ~1.25rem
      iconSize = 24;
      break;
    case "lg":
      fontSizeClass = "text-3xl font-extrabold"; // ~1.875rem
      iconSize = 32;
      break;
  }

  // --- SVG Icon: Thaw Motif (Simple Melting Drop) ---
  // The subtle vertical gradient from a warmer color (bottom) to a colder color (top)
  // symbolizes the transition from cold/frozen to warm/flowing.
  const LogoIcon = (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true" // Decorative SVG
    >
      <defs>
        <linearGradient id="thawGradient" x1="0" y1="0" x2="0" y2="100%">
          {/* Top (Cold/Frozen) */}
          <stop offset="0%" stopColor="#4F46E5" /> {/* Indigo-600 */}
          {/* Bottom (Warm/Flowing) */}
          <stop offset="100%" stopColor="#EC4899" /> {/* Pink-500 */}
        </linearGradient>
      </defs>
      {/* Abstract drop/flow shape. d="M12 2C6.48 2 2 6.48 2 12c0 3.73 2.11 6.95 5.17 8.65L12 22l4.83-1.35C19.89 18.95 22 15.73 22 12c0-5.52-4.48-10-10-10z" */}
      <path
        d="M12 2.5C7.03125 2.5 3 6.53125 3 11.5C3 15.23 5.11 18.45 8.17 20.15L12 21.5L15.83 20.15C18.89 18.45 21 15.23 21 11.5C21 6.53125 16.9688 2.5 12 2.5ZM12 4.5C15.8625 4.5 19 7.6375 19 11.5C19 14.5 17.5 16.85 15.5 18.15L12 19.5L8.5 18.15C6.5 16.85 5 14.5 5 11.5C5 7.6375 8.1375 4.5 12 4.5Z"
        fill="url(#thawGradient)"
      />
    </svg>
  );

  return (
    // Semantic link tag, assuming the logo usually links to the home page
    <a
      href="/"
      className={`
        inline-flex items-center space-x-2
        transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        ${className}
      `}
      aria-label="Thawkit Home"
    >
      {/* 1. Icon */}
      <div className="flex-shrink-0">{LogoIcon}</div>

      {/* 2. Text/App Name */}
      <span
        className={`
          ${textColorClass}
          ${fontSizeClass}
          font-sans tracking-tight leading-none
          select-none
        `}
        // Ensure screen readers read the full name correctly
        role="img"
        aria-label="Thawkit Application Logo"
      >
        Thawkit
      </span>
    </a>
  );
};
