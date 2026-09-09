"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { PageRow } from "@/lib/editor/resolve-editor-bootstrap";
import type { PageType } from "@/types/PageCMS/pageSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface PageSettingsPanelHandle {
  checkUnsavedChanges: () => Promise<boolean>;
}

export interface PageSettingsPanelProps {
  page: PageRow;
  activeTab: "general" | "seo" | "custom-code";
  onTabChange: (tab: "general" | "seo" | "custom-code") => void;
  onClose: () => void;
  onSave: (
    updates: Partial<
      Pick<PageRow, "title" | "slug" | "pageType" | "seo" | "config">
    >,
  ) => Promise<void>;
}

function readSeo(page: PageRow) {
  const seo = (page.seo ?? {}) as Record<string, unknown>;
  return {
    title: typeof seo.title === "string" ? seo.title : "",
    description: typeof seo.description === "string" ? seo.description : "",
  };
}

const PageSettingsPanel = forwardRef<
  PageSettingsPanelHandle,
  PageSettingsPanelProps
>(function PageSettingsPanel(
  { page, activeTab, onTabChange, onClose, onSave },
  ref,
) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [pageType, setPageType] = useState<PageType>(page.pageType);
  const initialSeo = readSeo(page);
  const [seoTitle, setSeoTitle] = useState(initialSeo.title);
  const [seoDescription, setSeoDescription] = useState(initialSeo.description);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(page.title);
    setSlug(page.slug);
    setPageType(page.pageType);
    const seo = readSeo(page);
    setSeoTitle(seo.title);
    setSeoDescription(seo.description);
  }, [page.id, page.title, page.slug, page.pageType, page.seo]);

  const isDirty =
    title !== page.title ||
    slug !== page.slug ||
    pageType !== page.pageType ||
    seoTitle !== readSeo(page).title ||
    seoDescription !== readSeo(page).description;

  useImperativeHandle(
    ref,
    () => ({
      async checkUnsavedChanges() {
        if (!isDirty) return true;
        return window.confirm(
          "You have unsaved page settings. Discard your changes?",
        );
      },
    }),
    [isDirty],
  );

  async function save() {
    setIsSaving(true);
    try {
      await onSave({
        title: title.trim() || page.title,
        slug: slug.trim() || page.slug,
        pageType,
        seo: { title: seoTitle.trim(), description: seoDescription.trim() },
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section
      className="mt-3 rounded-lg border bg-background p-3 shadow-sm"
      aria-label="Page settings"
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Page settings</h3>
          <p className="text-xs text-muted-foreground">{page.title}</p>
        </div>
        <Button size="xs" variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>
      <Tabs
        value={activeTab}
        onValueChange={(value) => onTabChange(value as typeof activeTab)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
          <TabsTrigger value="custom-code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-3 pt-3">
          <label className="block space-y-1 text-xs">
            <span className="text-muted-foreground">Name</span>
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-xs">
            <span className="text-muted-foreground">Slug</span>
            <Input
              value={slug}
              onChange={(event) => setSlug(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-xs">
            <span className="text-muted-foreground">Page type</span>
            <select
              className="h-9 w-full rounded-md border bg-background px-2 text-sm"
              value={pageType}
              onChange={(event) => setPageType(event.target.value as PageType)}
            >
              <option value="landing_page">Landing page</option>
              <option value="normal_page">Regular page</option>
              <option value="result_page">Result page</option>
            </select>
          </label>
        </TabsContent>
        <TabsContent value="seo" className="space-y-3 pt-3">
          <label className="block space-y-1 text-xs">
            <span className="text-muted-foreground">SEO title</span>
            <Input
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
            />
          </label>
          <label className="block space-y-1 text-xs">
            <span className="text-muted-foreground">SEO description</span>
            <Textarea
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
              rows={4}
            />
          </label>
        </TabsContent>
        <TabsContent value="custom-code" className="pt-3">
          <p className="text-xs text-muted-foreground">
            Custom page code is not enabled in the current Thawkit schema.
          </p>
        </TabsContent>
      </Tabs>
      <div className="mt-3 flex justify-end gap-2 border-t pt-3">
        <Button size="sm" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" onClick={() => void save()} disabled={isSaving}>
          {isSaving ? "Saving…" : "Save"}
        </Button>
      </div>
    </section>
  );
});

export default PageSettingsPanel;
