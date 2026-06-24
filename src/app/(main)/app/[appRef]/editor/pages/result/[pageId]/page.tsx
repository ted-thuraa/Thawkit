import React from "react";
import Image from "next/image";
import { fetchProjectEditorData } from "@/lib/querries/project";
import { redirect } from "next/navigation";
import PageEditorMain from "../../_components/pageEditorMainClient";
import { PageType } from "@/stores/pageEditorStore/types";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ appRef: string; pageId: string }>;
};

const ResultPageEditor = async ({ params }: Props) => {
  const { appRef, pageId } = await params;
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  if (!sessionData?.session) return redirect("/login");

  const projectData = await fetchProjectEditorData({
    projectRefId: appRef,
    context: "Result_Page",
    funnelPageId: pageId, // Required for Result_Page context
  });

  if (!projectData) {
    return redirect(`/app/${appRef}/`);
  }

  const editorConfig = {
    pageType: "Result_Page" as PageType,
    organizationId: sessionData.session.activeOrganizationId as string,
    allowCustomSections: false,
    enableDynamicContent: false,
    dataDependencies: [],
  };

  return (
    <>
      <PageEditorMain
        editorData={projectData}
        appRef={appRef}
        editorConfig={editorConfig}
      />
    </>
  );
};

export default ResultPageEditor;
