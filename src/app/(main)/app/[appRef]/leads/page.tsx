import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsPanel, TabsTab } from "@/components/ui/tabs";

import { TrendingUp } from "lucide-react";
import Image from "next/image";
import React from "react";
import {
  BasicProjectListItem,
  DetailedProjectQueryResponse,
  getBasicProjectDetails,
  getOrganizationProjects,
  getProjectWithDetails,
} from "@/lib/querries/project";
import ProjectsList from "@/app/_components/projectsList";
import { dummyProductCatalogue } from "@/stores/pageEditorStore/types";
import { LeadsDataTable } from "./_components/leadsTable";
import { getProjectLeadsWithDetails } from "@/lib/querries/leads";
import {
  prepareLeadsTableData,
  ProjectLeadsResponse,
} from "@/lib/utils/leads-table";

export default async function LeadsPage(props: {
  params: Promise<{ appRef: string }>;
}) {
  const { appRef } = await props.params; // 👈 must await
  const leadData = await getProjectLeadsWithDetails(appRef);

  console.log(leadData);
  // 2. Transform the data for the table
  const tableData = prepareLeadsTableData(leadData);

  return (
    <div className="min-h-screen p-4  md:py-6">
      <div className="mx-auto max-w-7xl">
        {/* Pass the transformed data to the table component */}
        {/* Replaces dummyProductCatalogue from [cite: 42] */}
        <LeadsDataTable data={tableData} />
      </div>
    </div>
  );
}
