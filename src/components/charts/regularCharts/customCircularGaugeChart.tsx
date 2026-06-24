import React, { useMemo, forwardRef } from "react";
import {
  ArrowRight,
  Bitcoin,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  Ellipsis,
  Eye,
  Gift,
  Info,
  LayoutGrid,
  Palette,
  Plus,
  Trash,
} from "lucide-react";

/**
 * CircularGauge Props
 */
interface CircularGaugeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Progress value (0-100, will be clamped) @default 60 */
  value?: number;
  /** Gauge size in pixels @default 160 */
  size?: number;
  /** Stroke thickness in pixels @default 14 */
  thickness?: number;
  /** Arc span in degrees (1-360) @default 270 */
  arcDeg?: number;
  /** Active arc color (hex) @default "#6FCF97" */
  color?: string;
  /** Background arc color (hex) @default "#566275" */
  backgroundColor?: string;
  /** Label text below percentage @default "chance" */
  label?: string;
  /** Enable smooth animations @default true */
  animate?: boolean;
  /** Animation duration in milliseconds @default 900 */
  animationDurationMs?: number;
}

/**
 * CircularGauge - A production-ready circular progress indicator component
 *
 * @component
 * @example
 * <CircularGauge value={81} size={160} thickness={14} label="chance" />
 *
 * A pixel-perfect circular gauge component that renders a partial circular arc
 * with animated progress indication. Features rounded end caps, smooth transitions,
 * and full accessibility support.
 */
const CircularGauge = forwardRef<HTMLDivElement, CircularGaugeProps>(
  (
    {
      value = 60,
      size = 160,
      thickness = 14,
      arcDeg = 270,
      color = "#6FCF97",
      backgroundColor = "#566275",
      label = "chance",
      animate = true,
      animationDurationMs = 900,
      className = "",
      ...props
    },
    ref
  ) => {
    // Memoize all geometry calculations to avoid recomputation on every render
    const geometry = useMemo(() => {
      // Clamp and validate inputs
      const clampedValue = Math.max(0, Math.min(100, value));
      const clampedArcDeg = Math.max(1, Math.min(360, arcDeg));
      const clampedThickness = Math.min(thickness, size / 2 - 2);

      // SVG circle geometry
      const center = size / 2;
      const radius = size / 2 - clampedThickness / 2;
      const circumference = 2 * Math.PI * radius;

      // Calculate arc length based on desired arc span
      const arcLength = (circumference * clampedArcDeg) / 360;

      // Calculate rotation to center the arc at the top
      // For 270° arc: starts at -135° and ends at +135°
      // We rotate by -(90 + arcDeg/2) to position it correctly
      const rotationDeg = -(90 + clampedArcDeg / 2);

      // Calculate stroke-dashoffset for the active arc
      // At 0% value, the arc is fully hidden (offset = arcLength)
      // At 100% value, the arc is fully visible (offset = 0)
      const activeOffset = arcLength * (1 - clampedValue / 100);

      return {
        center,
        radius,
        circumference,
        arcLength,
        rotationDeg,
        activeOffset,
        clampedValue,
        clampedThickness,
      };
    }, [value, size, thickness, arcDeg]);

    // Calculate responsive font sizes based on gauge size
    const percentageFontSize = Math.max(
      16,
      Math.min(56, geometry.center * 0.35)
    );
    const labelFontSize = Math.max(10, Math.min(14, geometry.center * 0.15));
    const labelSpacing = Math.max(2, Math.min(10, geometry.center * 0.08));

    // Animation style
    const animationStyle = animate
      ? {
          transition: `stroke-dashoffset ${animationDurationMs}ms cubic-bezier(0.2, 0.9, 0.2, 1)`,
        }
      : {};

    return (
      <div
        ref={ref}
        className={`flex items-center justify-center rounded-xl bg-[#1E2832] ${className}`}
        // style={{ width: size + 34, height: size + 34 }}
        {...props}
      >
        <div className="relative" style={{ width: size, height: size }}>
          {/* SVG Container */}
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="absolute inset-0"
            role="img"
            aria-label={`${label}: ${geometry.clampedValue}%`}
            aria-valuenow={geometry.clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {/* Group with rotation to center the arc */}
            <g
              transform={`translate(${geometry.center}, ${geometry.center}) rotate(${geometry.rotationDeg})`}
            >
              {/* Background Arc - muted color */}
              <circle
                cx="0"
                cy="0"
                r={geometry.radius}
                fill="none"
                stroke={backgroundColor}
                strokeWidth={geometry.clampedThickness}
                strokeDasharray={geometry.arcLength}
                strokeDashoffset="0"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />

              {/* Active Arc - progress indicator with animation */}
              <circle
                cx="0"
                cy="0"
                r={geometry.radius}
                fill="none"
                stroke={color}
                strokeWidth={geometry.clampedThickness}
                strokeDasharray={geometry.arcLength}
                strokeDashoffset={geometry.activeOffset}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={animationStyle}
              />
            </g>
          </svg>

          {/* Text Overlay - centered percentage and label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {/* Percentage Text */}
            <div
              style={{
                fontSize: `${percentageFontSize}px`,
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {geometry.clampedValue}%
            </div>

            {/* Label Text */}
            <div
              style={{
                fontSize: `${labelFontSize}px`,
                fontWeight: 500,
                color: "#9aa8b9",
                letterSpacing: "0.2px",
                marginTop: `${labelSpacing}px`,
              }}
            >
              {label}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

CircularGauge.displayName = "CircularGauge";

export default CircularGauge;

function CircularGauge2({
  value = 60,
  size = 140,
  thickness = 12,
  arcDeg = 180,
  color = "#6FCF97", // green-ish
  backgroundColor = "#566275", // muted bluish/gray
  label = "chance",
}) {
  // radius should fit inside viewbox accounting for stroke width
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  // length of the visible arc expressed in pixels
  const arcLength = (circumference * arcDeg) / 360;

  // strokeDasharray: draw arcLength then the rest of the circumference (so only arc shows)
  const strokeDasharray = `${arcLength} ${circumference}`;

  // strokeDashoffset for the *active* arc (how much of arc remains hidden)
  const activeOffset =
    arcLength * (1 - Math.max(0, Math.min(100, value)) / 100);

  // center point for circle
  const cx = size / 2;
  const cy = size / 2;

  // rotation to start arc at -135deg (so arc centers visually like a gauge)
  const rotation = -((360 - arcDeg) / 2) - 90; // simplifies to -135 when arcDeg=270

  return (
    <div className="inline-block">
      <div
        className="w-full h-full bg-transparent rounded-lg p-3"
        style={{ width: size, textAlign: "center" }}
      >
        <div
          className="relative inline-block"
          style={{ width: size, height: size }}
        >
          {/* SVG gauge */}
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <g transform={`rotate(${rotation} ${cx} ${cy})`}>
              {/* background arc (the muted remainder) */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={backgroundColor}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={0}
                vectorEffect="non-scaling-stroke"
                style={{
                  transition: "stroke-dashoffset 600ms ease, stroke 200ms",
                }}
              />

              {/* active arc (the green progress) */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill="transparent"
                stroke={color}
                strokeWidth={thickness}
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={activeOffset}
                vectorEffect="non-scaling-stroke"
                style={{
                  transition:
                    "stroke-dashoffset 900ms cubic-bezier(.2,.9,.2,1)",
                }}
              />
            </g>
          </svg>

          {/* centered percentage */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none"
            aria-hidden="true"
          >
            <div
              className="text-white text-base font-semibold leading-none"
              style={{ fontSize: size * 0.28 }}
            >
              {/* ensure integer percentage display */}
              {Math.round(value)}%
            </div>
            <div
              className="mt-1 text-sm font-medium"
              style={{ color: "#9aa8b9", letterSpacing: "0.2px" }}
            >
              {label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
