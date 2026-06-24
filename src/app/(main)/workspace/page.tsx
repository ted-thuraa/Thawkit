import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowUpDown,
  ChevronDown,
  Grid3X3,
  LayoutGrid,
  List,
  MoreHorizontal,
  Plus,
  Search,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import { NewProjectButton } from "./_components/create-project";
import {
  BasicProjectListItem,
  getBasicProjectDetails,
  getOrganizationProjects,
} from "@/lib/querries/project";
import ProjectsList from "@/app/_components/projectsList";

type Props = {
  searchParams: {
    state: string;
    code: string;
    inviteWorkspace?: string; // Add this to handle invite redirects
  };
};

const WorkSpaceMainPage = async ({ searchParams }: Props) => {
  const projectsData = await getOrganizationProjects();

  // 2. Check the result structure (Error Handling)
  let projects: BasicProjectListItem[] = [];

  if (projectsData.success) {
    projects = projectsData.data;
  } else {
    // 3. Handle the error case (e.g., show an error message, log it)
    console.error("Error fetching projects:", projectsData.error);
    // You could render an error state component here instead of the list
    return null;
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between ">
          <h3 className="text-xl font-semibold text-gray-800">Projects</h3>
          <NewProjectButton />
        </div>

        <div className="mb-6 flex flex-row flex-nowrap items-center justify-between gap-6 ">
          <div className="flex flex-row items-center gap-x-4">
            {/* <h3 className="leading-none font-semibold">Filter by</h3> */}
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  <SelectItem value="apple">draft</SelectItem>
                  <SelectItem value="banana">published</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="px-2 ">
            <ToggleGroup
              type="single"
              variant="outline"
              className=" *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex text-primary"
            >
              <ToggleGroupItem value="list">
                <List className="w-4 h-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid">
                <Grid3X3 className="w-4 h-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>

        <div>
          <ProjectsList projects={projects} />
        </div>
      </div>
    </div>
  );
};

export default WorkSpaceMainPage;
