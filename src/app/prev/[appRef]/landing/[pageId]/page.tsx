import React from "react";
import Image from "next/image";
import { fetchProjectEditorData } from "@/lib/querries/project";
import { notFound, redirect } from "next/navigation";
import { PageType } from "@/stores/pageEditorStore/types";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import PagePreviewMain from "../../_components/pagePreviewMain";

type Props = {
  params: Promise<{ appRef: string; pageId: string }>;

  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const LandingPagePreview = async ({ params, searchParams }: Props) => {
  // 1. Await both params and searchParams
  const { appRef, pageId } = await params;

  //const headerList = await headers();
  //const secret = headerList.get("x-preview-secret");
  // 2. SECURITY CHECK
  // If the secret is missing or doesn't match the environment variable,
  // if (secret !== process.env.PLAYRIGHT_PREVIEW_SECRET_TOKEN) {
  //   return notFound();
  // }

  const projectData = await fetchProjectEditorData({
    projectRefId: appRef,
    context: "Landing_Page",
    funnelPageId: pageId, // Required for Landing_Page context
  });

  if (!projectData) {
    notFound();
  }

  const editorConfig = {
    pageType: "Landing_Page" as PageType,
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

export default LandingPagePreview;
