import * as React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

interface SheetContextType {
  open: boolean;
  setOpen: (open: boolean) => void;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType>({
  open: false,
  setOpen: () => {},
  onOpenChange: () => {},
});

interface SheetProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  BtnclassName?: string;
  onOpenChange?: (open: boolean) => void;
  customCloseButton?: React.ReactNode;
  showDefaultClose?: boolean;
}

export function SheetProvider({
  children,
  defaultOpen = false,
  trigger,
  title,
  description,
  side = "right",
  className,
  BtnclassName,
  onOpenChange: onOpenChangeProp,
  customCloseButton,
  showDefaultClose = true,
}: SheetProviderProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const onOpenChange = React.useCallback(
    (open: boolean) => {
      setOpen(open);
      onOpenChangeProp?.(open);
    },
    [onOpenChangeProp]
  );

  const value = React.useMemo(
    () => ({
      open,
      setOpen,
      onOpenChange,
    }),
    [open, onOpenChange]
  );

  return (
    <SheetContext.Provider value={value}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent
          side={side}
          className={className}
          showclosebtn={showDefaultClose}
        >
          {customCloseButton && (
            <SheetClose asChild>{customCloseButton}</SheetClose>
          )}
          <SheetHeader>
            {/* If title exists, render it normally. 
                If not, render a hidden title to satisfy accessibility requirements. 
            */}
            {title ? (
              <SheetTitle>{title}</SheetTitle>
            ) : (
              <SheetTitle className="sr-only">Menu</SheetTitle>
            )}

            {description && <SheetDescription>{description}</SheetDescription>}
          </SheetHeader>
          {children}
        </SheetContent>
      </Sheet>
    </SheetContext.Provider>
  );
}

export const useSheet = () => {
  const context = React.useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a SheetProvider");
  }
  return context;
};
