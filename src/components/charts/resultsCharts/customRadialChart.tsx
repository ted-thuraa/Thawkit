"use client";

import React from "react";

// --- Type Definitions ---

interface RingData {
  id: string;
  value: number;
  thickness: number;
  gap: number;
  color: string;
  trackColor: string;
  icon?: "moon" | "diamond" | string;
}

interface CenterData {
  value: number;
  label: string;
  font: {
    size: number;
    weight: number;
  };
}

interface RadialChartProps {
  size: number;
  center: CenterData;
  rings: RingData[];
  /** The base size the font size was designed for. Default: 240 */
  baseSize?: number;
}

// --- SVG Helper Functions ---

/**
 * Converts polar coordinates (angle, radius) to Cartesian (x, y)
 * @param centerX - The x-coordinate of the circle's center
 * @param centerY - The y-coordinate of the circle's center
 * @param radius - The radius of the circle
 * @param angleInDegrees - The angle in degrees (0 is 12 o'clock)
 */
function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Describes an SVG arc path
 * @param x - Center x
 * @param y - Center y
 * @param radius - Arc radius
 * @param startAngle - Start angle (0 is 12 o'clock)
 * @param endAngle - End angle (clockwise)
 */
function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  // Clamp endAngle to avoid full circle rendering issues
  if (endAngle >= 360) {
    endAngle = 359.999;
  }
  if (endAngle <= startAngle) {
    return "";
  }

  const start = polarToCartesian(x, y, radius, startAngle);
  const end = polarToCartesian(x, y, radius, endAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  const d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    1,
    end.x,
    end.y,
  ].join(" ");

  return d;
}

// --- Icon Components ---

const MoonIcon = ({
  x,
  y,
  size,
  color,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
}) => (
  <svg
    x={x - size / 2}
    y={y - size / 2}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
  >
    <path d="M12 2.25a.75.75 0 01.75.75v.018C16.538 3.28 19.5 6.342 19.5 10.5 19.5 15.09 15.73 18.9 11.25 18.9c-2.97 0-5.59-.97-7.65-2.55a.75.75 0 01.6-1.3l.01-.002c1.8.84 3.84 1.35 6.04 1.35 3.31 0 6-2.01 6-4.5s-2.69-4.5-6-4.5c-.6 0-1.18.08-1.74.23a.75.75 0 01-.68-1.37A9.74 9.74 0 0111.25 3v-.018a.75.75 0 01.75-.75z" />
  </svg>
);

const DiamondIcon = ({
  x,
  y,
  size,
  color,
}: {
  x: number;
  y: number;
  size: number;
  color: string;
}) => (
  <svg
    x={x - size / 2}
    y={y - size / 2}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    stroke="none"
  >
    <path
      fillRule="evenodd"
      d="M11.99 2.2a1.2 1.2 0 01.85.35l8.65 8.66a1.2 1.2 0 010 1.7L12.84 21.56a1.2 1.2 0 01-1.7 0L2.5 12.9a1.2 1.2 0 010-1.7l8.65-8.65a1.2 1.2 0 01.84-.35z"
      clipRule="evenodd"
    />
  </svg>
);

// --- Main Component ---

export default function CustomRadialChart({
  size,
  center,
  rings,
  baseSize = 240,
}: RadialChartProps) {
  const centerCoord = size / 2;

  // Calculate scaling factor for fonts
  const fontScale = size / baseSize;
  const valueFontSize = center.font.size * fontScale;
  const labelFontSize = valueFontSize * 0.4; // Proportionally smaller

  let currentRadius = centerCoord;

  const tracks = [
    {
      id: "outer",
      value: 100,
      thickness: 24,
      gap: 6,
      color: "#6D28D9",
      trackColor: "rgba(255,255,255,0.04)",
      icon: "moon",
    },
    {
      id: "middle",
      value: 100,
      thickness: 24,
      gap: 6,
      color: "#EC4899",
      trackColor: "rgba(255,255,255,0.03)",
      icon: "diamond",
    },
  ];
  return (
    <div className="relative">
      <div className="">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <defs>
            {rings.map((ring) => (
              <filter key={`shadow-${ring.id}`} id={`shadow-${ring.id}`}>
                <feDropShadow
                  dx="0"
                  dy="0"
                  stdDeviation="3"
                  floodColor={ring.color}
                  floodOpacity="0.75"
                />
              </filter>
            ))}
          </defs>

          {rings.map((ring) => {
            // Move radius to the center of the current ring's stroke
            currentRadius -= ring.thickness / 2;

            const clampedValue = Math.max(0, Math.min(100, ring.value));
            const endAngle = clampedValue * 3.6;

            // --- Calculate Icon Position ---
            const iconPos = polarToCartesian(
              centerCoord,
              centerCoord,
              currentRadius,
              0
            );
            const iconSize = ring.thickness * 0.7; // Icon sized relative to ring

            const ringElements = (
              <g key={ring.id}>
                <path
                  d={describeArc(
                    centerCoord,
                    centerCoord,
                    currentRadius,
                    0,
                    359.999
                  )}
                  fill="none"
                  stroke={ring.trackColor}
                  strokeWidth={ring.thickness}
                />

                <path
                  d={describeArc(
                    centerCoord,
                    centerCoord,
                    currentRadius,
                    0,
                    endAngle
                  )}
                  fill="none"
                  stroke={ring.color}
                  strokeWidth={ring.thickness}
                  strokeLinecap="round"
                  filter={`url(#shadow-${ring.id})`}
                />

                {ring.icon === "moon" && (
                  <MoonIcon
                    x={iconPos.x}
                    y={iconPos.y}
                    size={iconSize}
                    color="#FFFFFF"
                  />
                )}
                {ring.icon === "diamond" && (
                  <DiamondIcon
                    x={iconPos.x}
                    y={iconPos.y}
                    size={iconSize}
                    color="#FFFFFF"
                  />
                )}
              </g>
            );

            // Decrement radius for the next ring
            currentRadius -= ring.thickness / 2 + ring.gap;

            return ringElements;
          })}

          <text
            x={centerCoord}
            y={centerCoord - valueFontSize * 0.1} // Slight v-adjust
            className="fill-white font-bold font-sans"
            fontSize={valueFontSize}
            fontWeight={center.font.weight}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {center.value}
          </text>
          <text
            x={centerCoord}
            y={centerCoord + labelFontSize * 1.1} // Position below value
            className="fill-gray-400 font-sans"
            fontSize={labelFontSize}
            fontWeight={400}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {center.label}
          </text>
        </svg>
      </div>
    </div>
  );
}
