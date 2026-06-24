import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { usePageBuilderStore } from "@/stores/pageEditorStore/store";
import { IframeContent } from "./iframeCanvas";

type PreviewPageProps = {};

const PreviewPageComponent: React.FC<PreviewPageProps> = () => {
  const setPreviewMode = usePageBuilderStore((state) => state.setPreviewMode);

  // useEffect(() => {
  //   setPreviewMode(true);
  //   return () => {
  //     setPreviewMode(false);
  //   };
  // }, [setPreviewMode]);

  return (
    <div className="relative h-full w-full">
      <IframeContent />
    </div>
  );
};

export default PreviewPageComponent;
