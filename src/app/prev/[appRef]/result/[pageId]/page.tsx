import React from "react";
import Image from "next/image";
import { fetchProjectEditorData } from "@/lib/querries/project";
import { redirect } from "next/navigation";
import { PageType } from "@/stores/pageEditorStore/types";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import PagePreviewMain from "../../_components/pagePreviewMain";

type Props = {
  params: Promise<{ appRef: string; pageId: string }>;
};

const ResultPagePreview = async ({ params }: Props) => {
  const { appRef, pageId } = await params;

  const projectData = await fetchProjectEditorData({
    projectRefId: appRef,
    context: "Result_Page",
    funnelPageId: pageId, // Required for Result_Page context
  });

  if (!projectData) {
    return;
  }

  const editorConfig = {
    pageType: "Result_Page" as PageType,
    organizationId: "",
    allowCustomSections: false,
    enableDynamicContent: false,
    dataDependencies: [],
  };

  return (
    <>
      <PagePreviewMain
        editorData={projectData}
        appRef={appRef}
        editorConfig={editorConfig}
      />
    </>
  );
};

export default ResultPagePreview;
