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
import { AppVisitsChart } from "./_components/appVisitsChart";
import {
  AnalyticsDashboardData,
  getAnalyticsData,
  TimeRange,
} from "@/lib/querries/campaignAnalytics";
import { AppVisitsClientSideWrapper } from "./_components/appVisitsChartWrapper";
import { ConversionRateChart } from "./_components/ConversionRateChart";
import { DailyLeadsChart } from "./_components/DailyLeadsChart";

interface AppDashboardPageProps {
  params: { appRef: string };
  searchParams: { range?: string };
}

const formatNumber = (num: number) => num.toLocaleString();

export default async function AppDashboardPage({
  params,
  searchParams,
}: AppDashboardPageProps) {
  const { appRef } = await params; // 👈 must await
  const { range } = await searchParams; // 👈 must await
  const timeRange = (range || "90d") as TimeRange;

  // --- Data Fetching: Parallelize for Speed ---
  const [projectDataResult, analyticsDataResult] = await Promise.all([
    getProjectWithDetails(appRef), // Existing Project Details fetch
    getAnalyticsData(appRef, timeRange), // New Analytics Data fetch
  ]);

  if (!projectDataResult.success) {
    console.error("Error fetching project:", projectDataResult.error);
    return <div>Failed to load project details.</div>;
  }
  let project: DetailedProjectQueryResponse = projectDataResult.data;

  if (!analyticsDataResult.success) {
    console.error("Error fetching analytics:", analyticsDataResult.error);
    return <div>Failed to load analytics data.</div>;
  }
  const analyticsData: AnalyticsDashboardData = analyticsDataResult.data;

  const {
    totalViews,
    totalUniqueVisitors,
    totalLeadsStarted,
    totalLeadsCompleted,
    conversionRate,
    dailyVisits,
    dailyLeads,
  } = analyticsData;

  const timeRangeDisplay =
    timeRange === "7d"
      ? "Last 7 days"
      : timeRange === "30d"
        ? "Last 30 days"
        : "Last 3 months";

  return (
    <div className="min-h-screen p-4 md:py-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">
            Project Dashboard
          </h3>
        </div>
        <Tabs defaultValue="appvisits" className={"px-0 py-0 bg-transparent"}>
          <TabsList className="w-full px-0 py-0 bg-transparent gap-x-4">
            <TabsTab value="appvisits" className={"px-0 py-0 bg-transparent"}>
              <Card className="@container/card w-full py-4 gap-4">
                <CardHeader className="px-4">
                  <CardDescription className="text-card-foreground text-left font-normal">
                    Total Views
                  </CardDescription>
                  <CardTitle className="flex flex-row items-end gap-2 text-2xl font-semibold tabular-nums ">
                    {formatNumber(totalViews)}
                    <Badge variant="outline" className="">
                      <TrendingUp />
                      +12.5%
                    </Badge>
                  </CardTitle>
                  <div className="line-clamp-1 flex gap-2 text-xs text-muted-foreground font-normal">
                    Trending up this month
                  </div>
                </CardHeader>

                <CardFooter className="px-4 flex-col items-start gap-0 text-sm border-t [.border-t]:pt-2">
                  <div className="text-muted-foreground text-xs font-normal">
                    Total page views all time
                  </div>
                </CardFooter>
              </Card>
            </TabsTab>
            <TabsTab value="total-leads" className={"px-0 py-0 bg-transparent"}>
              <Card className="@container/card w-full py-4 gap-4">
                <CardHeader className="px-4">
                  <CardDescription className="text-card-foreground text-left font-normal">
                    Total Leads generated
                  </CardDescription>
                  <CardTitle className="flex flex-row items-end gap-2 text-2xl font-semibold tabular-nums ">
                    {formatNumber(totalLeadsCompleted)}
                    <Badge variant="outline" className="">
                      <TrendingUp />
                      +12.5%
                    </Badge>
                  </CardTitle>
                  <div className="line-clamp-1 flex gap-2 text-xs text-muted-foreground font-normal">
                    Completed leads all time
                  </div>
                </CardHeader>

                <CardFooter className="px-4 flex-col items-start gap-0 text-sm border-t [.border-t]:pt-2">
                  <div className="text-muted-foreground text-xs font-normal">
                    Visitors for the last 6 months
                  </div>
                </CardFooter>
              </Card>
            </TabsTab>
            <TabsTab value="daily-leads" className={"px-0 py-0 bg-transparent"}>
              <Card className="@container/card w-full py-4 gap-4">
                <CardHeader className="px-4">
                  <CardDescription className="text-card-foreground text-left font-normal">
                    Daily leads
                  </CardDescription>
                  <CardTitle className="flex flex-row items-end gap-2 text-2xl font-semibold tabular-nums ">
                    250{" "}
                    <Badge variant="outline" className="">
                      <TrendingUp />
                      +12.5%
                    </Badge>
                  </CardTitle>
                  <div className="line-clamp-1 flex gap-2 text-xs text-muted-foreground font-normal">
                    Trending up this month
                  </div>
                </CardHeader>

                <CardFooter className="px-4 flex-col items-start gap-0 text-sm border-t [.border-t]:pt-2">
                  <div className="text-muted-foreground text-xs font-normal">
                    Visitors for the last 6 months
                  </div>
                </CardFooter>
              </Card>
            </TabsTab>
          </TabsList>
          <TabsPanel
            value="appvisits"
            className={"w-full grid grid-cols-1 gap-4 lg:grid-cols-3"}
          >
            <div className="lg:col-span-2">
              <AppVisitsClientSideWrapper
                initialData={dailyVisits}
                timeRange={timeRange}
              />
            </div>
            <ConversionRateChart rate={conversionRate} />
          </TabsPanel>
          <TabsPanel value="total-leads">
            <p className="p-4 text-center text-xs text-muted-foreground">
              Tab 2 content
            </p>
          </TabsPanel>
          <TabsPanel value="daily-leads">
            <p className="p-4 text-center text-xs text-muted-foreground">
              Tab 3 content
            </p>
          </TabsPanel>
        </Tabs>
        <div className="mt-4">
          {/* Daily Leads Chart */}
          <div className="">
            <DailyLeadsChart
              dailyLeads={dailyLeads}
              timeRange={timeRangeDisplay}
            />
          </div>
        </div>
        {/* Detailed Leads Status Cards */}
        <div className="mt-6 grid grid-cols-1 gap-4 @xl/main:grid-cols-2">
          <Card className="@container/card py-4 gap-4">
            <CardHeader className="px-4">
              <CardDescription className="text-card-foreground">
                Leads Started
              </CardDescription>
              <CardTitle className="flex flex-row items-end gap-2 text-2xl font-semibold tabular-nums ">
                {formatNumber(totalLeadsStarted)}
              </CardTitle>
              <div className="line-clamp-1 flex gap-2 text-xs text-muted-foreground">
                Status: RECEIVED (started the quiz)
              </div>
            </CardHeader>
          </Card>
          <Card className="@container/card py-4 gap-4">
            <CardHeader className="px-4">
              <CardDescription className="text-card-foreground">
                Leads Completed
              </CardDescription>
              <CardTitle className="flex flex-row items-end gap-2 text-2xl font-semibold tabular-nums ">
                {formatNumber(totalLeadsCompleted)}
              </CardTitle>
              <div className="line-clamp-1 flex gap-2 text-xs text-muted-foreground">
                Status: COMPLETED (finished the quiz)
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
