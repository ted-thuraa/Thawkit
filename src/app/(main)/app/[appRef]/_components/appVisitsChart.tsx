"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DailyAnalyticsData,
  TimeRange,
} from "@/lib/querries/campaignAnalytics";

const chartConfig = {
  views: {
    label: "Total Views",
    color: "var(--primary)",
  },
  uniqueVisitors: {
    label: "Unique Visitors",
    color: "var(--secondary)",
  },
} satisfies ChartConfig;

type Props = {
  initialData: DailyAnalyticsData[];
  onTimeRangeChange: (range: TimeRange) => void;
  timeRange: TimeRange;
};

export function AppVisitsChart({
  initialData,
  onTimeRangeChange,
  timeRange,
}: Props) {
  const timeRangeLabel =
    timeRange === "7d"
      ? "Last 7 days"
      : timeRange === "30d"
        ? "Last 30 days"
        : "Last 3 months";

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Views & Unique Visitors</CardTitle>
        <CardDescription>Data for the {timeRangeLabel}</CardDescription>
        <CardAction>
          <Select
            value={timeRange}
            onValueChange={onTimeRangeChange as (value: string) => void}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate "
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={initialData}>
            <defs>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-views)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-views)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient
                id="fillUniqueVisitors"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-uniqueVisitors)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-uniqueVisitors)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="views"
              type="natural"
              fill="url(#fillViews)"
              stroke="var(--color-views)"
              stackId="a"
            />
            <Area
              dataKey="uniqueVisitors"
              type="natural"
              fill="url(#fillUniqueVisitors)"
              stroke="var(--color-uniqueVisitors)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
