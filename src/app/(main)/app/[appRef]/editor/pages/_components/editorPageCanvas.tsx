// File: src/components/EditorCanvas.tsx
import { memo, useMemo } from "react";
import { cn } from "@/lib/utils";
import { ElementNode } from "@/stores/pageEditorStore/types";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import RecursiveElementRenderer from "./recursiveComponent";
import { getAllFontClasses } from "@/lib/fonts/index";
import NavContainer from "./elementTypes/navContainer";
// Assuming NavContainer is imported from your components folder

export const EditorCanvas = memo(() => {
  const { page, sections } = usePageBuilderStore();

  // Get all font classes for Next.js/Tailwind font variable loading
  const fontClasses = getAllFontClasses();

  // Separate the navigation section from the rest of the content
  const { navSection, contentSections } = useMemo(() => {
    const nav = sections.find(
      (section: ElementNode) => section.type === "navigation"
    );
    const others = sections.filter(
      (section: ElementNode) => section.type !== "navigation"
    );

    return {
      navSection: nav ? { ...nav, styles: { ...nav.styles } } : null,
      contentSections: others.map((section: ElementNode) => ({
        ...section,
        styles: { ...section.styles },
        content: section.content,
      })),
    };
  }, [sections]);

  return (
    <div
      className={cn(fontClasses, "max-w-full ", "bg-page antialiased")}
      style={
        page?.settings?.backgroundType === "image"
          ? {
              backgroundImage: `url(${page.settings.backgroundSource})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
      suppressHydrationWarning
    >
      {/* 1. Render the Navigation section if it exists */}
      {navSection && <NavContainer section={navSection} />}
      <main className={cn("w-full space-y-24 pt-8")}>
        {/* 2. Render the remaining content sections */}
        {Array.isArray(contentSections) &&
          contentSections.map((section) => (
            <RecursiveElementRenderer key={section.id} section={section} />
          ))}
      </main>
    </div>
  );
});

EditorCanvas.displayName = "EditorCanvas";
