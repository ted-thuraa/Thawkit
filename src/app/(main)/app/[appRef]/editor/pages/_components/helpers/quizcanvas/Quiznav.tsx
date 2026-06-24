"use client";

import { Button } from "@/components/ui/button";
import { THEME_VARIABLES } from "@/lib/constants/theme";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import React from "react";

/**
 * Computes the progress percentage, clamped between 0 and 100.
 * Handles division by zero by returning 0 if total is 0 or less.
 * @param current - The current step.
 * @param total - The total number of steps.
 * @returns The progress percentage (0-100).
 */
export const computeProgress = (current: number, total: number): number => {
  if (total <= 0) {
    return 0;
  }
  // Clamp current value between 0 and total
  const clampedCurrent = Math.max(0, Math.min(current, total));
  return (clampedCurrent / total) * 100;
};

type QuizHeaderProps = {
  /** The main headline text displayed in the center. */
  title?: string;
  /** The current step number (e.g., 1). */
  current: number;
  /** The total number of steps (e.g., 27). */
  total: number;
  /** Optional CSS color string for the progress bar fill. Defaults to Tailwind's violet-400. */
  color?: string;
  /** Adjusts font sizes and heights. Defaults to 'md'. */
  size?: "sm" | "md" | "lg";
  /** Whether to display the 'current/total' fraction pill. Defaults to true. */
  showProgress?: boolean;
  /** An accessible label for the progress bar for screen readers. */
  ariaLabel?: string;
  /** Optional additional class names for the root container. */
  className?: string;
};

// Default prop values
const defaultProps = {
  //color: "#a78bfa", // Tailwind's `violet-400`, matching the image knob
  color: `var(${THEME_VARIABLES.primary})`, // Default button theme
  size: "md" as const,
  showProgress: true,
  ariaLabel: "Quiz progress",
  className: "",
};

// Size mappings for Tailwind classes
const sizeClasses = {
  sm: {
    wrapper: "gap-1.5",
    title: "text-lg font-medium",
    fraction: "text-xs px-2.5 py-0.5",
    bar: "h-1", // 4px
  },
  md: {
    wrapper: "gap-2",
    title: "text-xl font-medium",
    fraction: "text-sm px-3 py-1",
    bar: "h-1.5", // 6px (matches thin bar in image)
  },
  lg: {
    wrapper: "gap-2.5",
    title: "text-2xl font-medium",
    fraction: "text-base px-3.5 py-1.5",
    bar: "h-2", // 8px
  },
};

/**
 * A responsive and accessible progress header for quizzes,
 * matching the provided UI design.
 */
const QuizHeader: React.FC<QuizHeaderProps> = (props) => {
  const {
    //title,
    current,
    total,
    color = defaultProps.color,
    size = defaultProps.size,
    showProgress = defaultProps.showProgress,
    ariaLabel = defaultProps.ariaLabel,
    className = defaultProps.className,
  } = props;

  const progressPercentage = computeProgress(current, total);
  const s = sizeClasses[size];

  // Clamp value for display (e.g., 0/27, not -1/27)
  const displayCurrent = Math.max(0, Math.min(current, total));

  return (
    <div className={`max-w-[40rem] w-full mx-auto px-4 ${className}`}>
      <div className={`flex flex-col ${s.wrapper}`}>
        {/* Top Row: Title and Fraction */}
        <div className="flex justify-center items-center relative h-10">
          {/* back button */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="w-8 h-8 rounded-md p-0 hover:bg-transparent hover:text-editor-foreground"
            >
              <ChevronLeft className="h-6 w-6 " />
            </Button>
          </div>

          {/* Title */}
          <Image
            src={"/assets/editor/dummy_company_1_logo.svg"}
            width={100}
            height={100}
            alt={"App logo"}
            className="w-auto h-8 object-cover"
            //style={section.styles}
          />
          {/* <h2
            className={`w-full text-center text-sm text-gray-500 truncate px-12 ${s.title}`}
          >
            {title}
          </h2> */}

          {/* Fraction Pill */}
          {showProgress && (
            <div
              className={`absolute right-0 top-1/2 -translate-y-1/2 flex-shrink-0 rounded-full font-medium shadow-sm bg-violet-50 text-violet-600 ${s.fraction}`}
              // Hide from screen reader; info is in the progress bar's aria-valuetext
              aria-hidden="true"
            >
              {displayCurrent}/{total}
            </div>
          )}
        </div>

        {/* Bottom Row: Progress Bar */}
        {showProgress && (
          <div
            role="progressbar"
            aria-label={ariaLabel}
            aria-valuenow={progressPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            // Provide a human-readable value for screen readers
            aria-valuetext={`${displayCurrent} of ${total} steps completed`}
            className={`w-full overflow-hidden rounded-full bg-gray-200 ${s.bar}`}
          >
            {/* Progress Fill */}
            <div
              className={`h-full rounded-full transition-all duration-300 ease-in-out motion-reduce:transition-none`}
              style={{
                width: `${progressPercentage}%`,
                backgroundColor: color,
              }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

QuizHeader.displayName = "QuizHeader";

export default QuizHeader;

/*
// --- EXAMPLE USAGE ---
// (Save the component above as e.g., './components/QuizHeader.tsx')
// (Paste this example into a page.tsx or component to test)

"use client"; // Required for state and effects

import QuizHeader from './components/QuizHeader'; // Adjust path
import { useState, useEffect } from 'react';

export default function MyQuizPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 27;

  // Simulate progress for demonstration
  useEffect(() => {
    if (currentStep >= totalSteps) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : totalSteps));
    }, 800);

    return () => clearInterval(timer);
  }, [currentStep, totalSteps]);

  return (
    <div className="p-8 bg-white min-h-screen space-y-12">
      <QuizHeader
        title="Embrace your potential"
        current={currentStep}
        total={totalSteps}
      />

      <QuizHeader
        title="Small Size (Custom Color)"
        current={10}
        total={20}
        size="sm"
        color="#E11D48" // Rose-600
      />

      <QuizHeader
        title="Large Size (No Fraction)"
        current={5}
        total={10}
        size="lg"
        showProgress={false}
        color="#059669" // Emerald-600
      />
    </div>
  );
}
*/
