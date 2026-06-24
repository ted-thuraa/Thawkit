import React from "react";
import Image from "next/image";
import { fetchProjectEditorData } from "@/lib/querries/project";
import { redirect } from "next/navigation";
import { PageType } from "@/stores/pageEditorStore/types";
import PageEditorMain from "../_components/pageEditorMainClient";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";

type Props = {
  params: Promise<{ appRef: string }>;
};

const QuizPageEditor = async ({ params }: Props) => {
  const { appRef } = await params;
  const sessionData = await auth.api.getSession({
    headers: await headers(),
  });
  if (!sessionData?.session) return redirect("/login");

  const projectData = await fetchProjectEditorData({
    projectRefId: appRef,
    context: "Quiz_Page",
    //funnelPageId: pageId, // Required for Quiz_Page context
  });

  if (!projectData) {
    return redirect(`/app/${appRef}/`);
  }

  const editorConfig = {
    pageType: "Quiz_Page" as PageType,
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

export default QuizPageEditor;
