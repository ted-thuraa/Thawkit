// src/components/ProgressHeader.tsx

import React from "react";

/**
 * Props for the ProgressHeader component.
 */
interface QuizProgressBarHeaderProps {
  /** The current step in the process (e.g., 2). */
  currentStep: number;
  /** The total number of steps in the process (e.g., 27). */
  totalSteps: number;
  /** The title text to display. */
  title: string;
  /** An optional click handler for the back button. The button is disabled if not provided. */
  onBack?: () => void;
}

/**
 * A reusable header component that displays a title, progress count,
 * and a visual progress bar.
 */
const QuizProgressBarHeader: React.FC<QuizProgressBarHeaderProps> = ({
  currentStep,
  totalSteps,
  title,
  onBack,
}) => {
  // Ensure currentStep is not greater than totalSteps for calculation
  const safeCurrentStep = Math.min(currentStep, totalSteps);

  // Calculate the progress percentage
  const progressPercentage =
    totalSteps > 0 ? (safeCurrentStep / totalSteps) * 100 : 0;

  return (
    <div className="w-full mx-auto font-sans p-4">
      {/* Top section: Back button, Title, and Step Count */}
      <div className="flex items-center justify-between mb-3">
        {/* Back Button */}
        <button
          onClick={onBack}
          disabled={!onBack}
          aria-label="Go back"
          className="p-1 rounded-full text-purple-500 transition-colors duration-200 enabled:hover:bg-purple-100 disabled:text-gray-300 disabled:cursor-not-allowed"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>

        {/* Title */}
        <h1 className="text-lg font-semibold text-gray-800 tracking-tight">
          {title}
        </h1>

        {/* Step Count Bubble */}
        <div className="flex items-center justify-center bg-purple-100 px-3 py-1 rounded-full">
          <span className="text-sm font-bold text-purple-700">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-purple-500 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercentage}%` }}
          role="progressbar"
          aria-valuenow={currentStep}
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-label={`Step ${currentStep} of ${totalSteps}`}
        ></div>
      </div>
    </div>
  );
};

export default QuizProgressBarHeader;
