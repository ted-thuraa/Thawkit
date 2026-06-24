import React, { useState, useEffect, useRef, useCallback } from "react";

type DateTimePickerProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (isoDate: string) => void;
  initialDate?: string;
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDate,
}) => {
  const [selectedDateTime, setSelectedDateTime] = useState<string>(
    initialDate || new Date().toISOString().slice(0, 16) // YYYY-MM-DDTHH:MM
  );
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedDateTime(initialDate || new Date().toISOString().slice(0, 16));
      setError(null);
      // Focus trapping
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements?.[0] as HTMLElement;
      firstElement?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          onClose();
        } else if (event.key === "Tab") {
          if (focusableElements && focusableElements.length > 0) {
            const lastElement = focusableElements[
              focusableElements.length - 1
            ] as HTMLElement;
            if (event.shiftKey) {
              if (document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
              }
            } else {
              if (document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
              }
            }
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, initialDate, onClose]);

  const handleSave = () => {
    const chosenDate = new Date(selectedDateTime);
    if (isNaN(chosenDate.getTime()) || chosenDate.getTime() <= Date.now()) {
      setError("Please select a date and time in the future.");
      return;
    }
    onSave(chosenDate.toISOString());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose} // Close on backdrop click
      data-testid="dialog-backdrop"
    >
      <div
        ref={dialogRef}
        className="bg-white p-6 rounded-lg shadow-lg relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside dialog
        data-testid="dialog"
      >
        <h2 id="dialog-title" className="text-xl font-bold mb-4">
          Set Countdown Target
        </h2>
        <div className="mb-4">
          <label
            htmlFor="datetime-input"
            className="block text-sm font-medium text-gray-700"
          >
            Target Date and Time
          </label>
          <input
            type="datetime-local"
            id="datetime-input"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={selectedDateTime}
            onChange={(e) => setSelectedDateTime(e.target.value)}
            data-testid="datetime-input"
          />
        </div>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={onClose}
            data-testid="cancel-button"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={!!error} // Disable save if there's an error
            data-testid="save-button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DateTimePicker;
