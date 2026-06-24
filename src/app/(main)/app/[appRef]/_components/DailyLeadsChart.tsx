"use client";

import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { DailyLeadsData } from "@/lib/querries/campaignAnalytics";

const chartConfig = {
  completedLeads: {
    label: "Completed Leads",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

type Props = {
  dailyLeads: DailyLeadsData[];
  timeRange: string;
};

export function DailyLeadsChart({ dailyLeads, timeRange }: Props) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Daily Completed Leads ({timeRange})</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={dailyLeads}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                value > 999 ? `${(value / 1000).toFixed(1)}k` : value
              }
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <Bar
              dataKey="completedLeads"
              fill="var(--color-completedLeads)"
              radius={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
