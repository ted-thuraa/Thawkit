"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import DateTimePicker from "./DateTimePicker";

type CountdownTimerProps = {
  id?: string;
  className?: string;
  targetDate?: string; // ISO string; optional—if absent, show "Set a date" CTA when editable
  liveMode: boolean;
  previewMode: boolean;
  onTargetDateChange?: (iso: string) => void;
  onComplete?: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "neutral" | "brand";
  showLabels?: boolean; // e.g., Days, Hrs, Min, Sec
  zeroPad?: number; // default 2
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  id,
  className,
  targetDate,
  liveMode,
  previewMode,
  onTargetDateChange,
  onComplete,
  size = "md",
  variant = "neutral",
  showLabels = false,
  zeroPad = 2,
}) => {
  const calculateTimeLeft = useCallback(() => {
    if (!targetDate)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    const difference = Math.max(0, new Date(targetDate).getTime() - Date.now());

    if (isNaN(difference)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, total: difference };
  }, [targetDate]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  useEffect(() => {
    if (liveMode || previewMode || !targetDate) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(calculateTimeLeft());
      return;
    }

    timerRef.current = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        onComplete?.();
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [targetDate, liveMode, previewMode, onComplete, calculateTimeLeft]);

  // Update timeLeft immediately if targetDate changes
  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
  }, [targetDate, calculateTimeLeft]);

  const pad = (num: number) => String(num).padStart(zeroPad, "0");

  const isEditable = !liveMode && !previewMode;
  const showSetDateCTA = isEditable && !targetDate;
  const isEnded = timeLeft.total <= 0 && targetDate !== undefined;

  const containerClasses = `relative flex items-center justify-center font-mono ${className || ""}`;
  const segmentClasses = `flex flex-col items-center mx-1`;
  const numberClasses = `text-4xl font-bold ${size === "sm" ? "text-2xl" : size === "lg" ? "text-6xl" : "text-4xl"}`;
  const labelClasses = `text-xs ${size === "sm" ? "text-xxs" : size === "lg" ? "text-sm" : "text-xs"}`;
  const separatorClasses = `text-4xl font-bold mx-1 ${size === "sm" ? "text-2xl" : size === "lg" ? "text-6xl" : "text-4xl"}`;

  const handleOpenPicker = () => {
    setIsPickerOpen(true);
  };

  const handleClosePicker = () => {
    setIsPickerOpen(false);
  };

  const handleSaveTargetDate = (isoDate: string) => {
    onTargetDateChange?.(isoDate);
  };

  // Overlay and Edit Button (only when isEditable)
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div
      id={id}
      className={containerClasses}
      onMouseEnter={() => isEditable && setShowOverlay(true)}
      onMouseLeave={() => isEditable && setShowOverlay(false)}
      onFocusCapture={() => isEditable && setShowOverlay(true)} // For keyboard focus
      onBlurCapture={() => isEditable && setShowOverlay(false)} // For keyboard focus
      data-testid="countdown-timer-root"
    >
      {showSetDateCTA ? (
        <button
          className="text-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2"
          onClick={handleOpenPicker}
          data-testid="set-date-cta"
        >
          Set countdown date
        </button>
      ) : isEnded ? (
        <div className="flex flex-col items-center">
          <span className={numberClasses}>00 : 00 : 00 : 00</span>
          <span className="text-sm mt-1">Time's up</span>
        </div>
      ) : (
        <>
          <div className={segmentClasses}>
            <span className={numberClasses}>{pad(timeLeft.days)}</span>
            {showLabels && <span className={labelClasses}>Days</span>}
          </div>
          <span className={separatorClasses}>:</span>
          <div className={segmentClasses}>
            <span className={numberClasses}>{pad(timeLeft.hours)}</span>
            {showLabels && <span className={labelClasses}>Hrs</span>}
          </div>
          <span className={separatorClasses}>:</span>
          <div className={segmentClasses}>
            <span className={numberClasses}>{pad(timeLeft.minutes)}</span>
            {showLabels && <span className={labelClasses}>Min</span>}
          </div>
          <span className={separatorClasses}>:</span>
          <div className={segmentClasses}>
            <span className={numberClasses}>{pad(timeLeft.seconds)}</span>
            {showLabels && <span className={labelClasses}>Sec</span>}
          </div>
        </>
      )}

      {isEditable && showOverlay && (
        <div
          className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 focus-within:opacity-100 transition"
          onClick={handleOpenPicker}
          data-testid="countdown-timer-overlay"
        >
          <button
            className="absolute top-2 right-2 inline-flex items-center justify-center rounded-xl bg-white/90 backdrop-blur px-2 py-1 text-sm shadow hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus:visible:ring-offset-2"
            aria-label="Edit countdown target"
            onClick={handleOpenPicker}
            data-testid="edit-button"
          >
            {/* Placeholder for edit icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.829z" />
            </svg>
          </button>
        </div>
      )}

      <DateTimePicker
        isOpen={isPickerOpen}
        onClose={handleClosePicker}
        onSave={handleSaveTargetDate}
        initialDate={targetDate}
      />
    </div>
  );
};

export default CountdownTimer;
