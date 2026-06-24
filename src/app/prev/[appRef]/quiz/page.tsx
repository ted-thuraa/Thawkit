import React from "react";
import Image from "next/image";
import { fetchProjectEditorData } from "@/lib/querries/project";
import { redirect } from "next/navigation";
import { PageType } from "@/stores/pageEditorStore/types";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import PagePreviewMain from "../_components/pagePreviewMain";

type Props = {
  params: Promise<{ appRef: string }>;
};

const QuizPagePreview = async ({ params }: Props) => {
  const { appRef } = await params;

  const projectData = await fetchProjectEditorData({
    projectRefId: appRef,
    context: "Quiz_Page",
    //funnelPageId: pageId, // Required for Quiz_Page context
  });

  if (!projectData) {
    return;
  }

  const editorConfig = {
    pageType: "Quiz_Page" as PageType,
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

export default QuizPagePreview;
