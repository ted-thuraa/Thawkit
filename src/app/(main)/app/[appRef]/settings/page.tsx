import React from "react";
import { redirect } from "next/navigation";
import SettingsClient from "./_components/settingsMain";
import {
  FullProjectDataResponse,
  getProjectWithDetails,
} from "@/lib/querries/project";

type Props = {
  params: { appRef: string };
};

const SettingsPage = async ({ params }: Props) => {
  const { appRef } = await params;
  const fetchData = await getProjectWithDetails(appRef);
  let projectData: FullProjectDataResponse;
  if (fetchData.success) {
    projectData = fetchData.data;
  } else {
    // 3. Handle the error case (e.g., show an error message, log it)
    console.error("Error fetching projects:", fetchData.error);
    // You could render an error state component here instead of the list
    return null;
  }
  if (!projectData) {
    return redirect(`/workspace`);
  }
  return (
    <div className="">
      <SettingsClient projectId={projectData.id} projectData={projectData} />
    </div>
  );
};

export default SettingsPage;
