"use client"; // This must be a client component to use state and context.

import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useContext,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"; // Adjust this import path to your shadcn/ui setup

// Define the shape of the data needed to open a dialog
export interface DialogOptions {
  title?: ReactNode;
  description?: ReactNode;
  content: ReactNode; // The main component/content to render in the dialog body
  className?: string; // Optional class for <DialogContent>
}

// Define the shape of the context
interface DialogContextType {
  open: (options: DialogOptions) => void;
  close: () => void;
}

// Create the context
// We provide a default implementation that throws an error if used outside the provider.
export const DialogContext = createContext<DialogContextType>({
  open: () => {
    throw new Error("DialogProvider not found");
  },
  close: () => {
    throw new Error("DialogProvider not found");
  },
});

// Define the state for the provider
type DialogState = DialogOptions & {
  isOpen: boolean;
};

// The initial state when no dialog is open
const initialState: DialogState = {
  isOpen: false,
  content: null,
};

/**
 * The DialogProvider component wraps your application and provides
 * a global dialog instance.
 */
export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<DialogState>(initialState);

  // Memoize the 'open' function to prevent unnecessary re-renders
  const open = useCallback((options: DialogOptions) => {
    setState({
      ...options,
      isOpen: true,
    });
  }, []);

  // Memoize the 'close' function
  const close = useCallback(() => {
    // We reset the state completely when closing
    setState(initialState);
  }, []);

  // Handle the 'onOpenChange' event from the shadcn Dialog
  // This is crucial for closing the dialog via 'Esc' key or clicking outside.
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      close();
    }
  };

  return (
    <DialogContext.Provider value={{ open, close }}>
      {children}

      {/* This is the single, global Dialog instance.
        It's controlled entirely by the provider's state.
      */}
      <Dialog open={state.isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className={state.className}>
          {/* Conditionally render header if title or description is provided */}
          <DialogHeader>
            {state.title ? (
              <DialogTitle>{state.title}</DialogTitle>
            ) : (
              <DialogTitle className="sr-only">Menu</DialogTitle>
            )}
            {state.description && (
              <DialogDescription>{state.description}</DialogDescription>
            )}
          </DialogHeader>

          {/* Render the dynamic content */}
          {state.content}
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

/**
 * Custom hook `useDialog`
 *
 * This hook provides access to the global dialog context.
 * It's a simple wrapper around `useContext(DialogContext)`
 * that also includes a runtime check to ensure it's used
 * within a <DialogProvider>.
 *
 * @returns {object} An object containing `open` and `close` functions.
 * - `open(options)`: Opens the global dialog with the specified content.
 * - `close()`: Closes the global dialog.
 */
export const useDialog = () => {
  const context = useContext(DialogContext);

  // This check is crucial for catching errors early.
  // If a component uses this hook without being a descendant of
  // <DialogProvider>, this error will be thrown.
  if (context === undefined) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
};
