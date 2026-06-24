"use client";

import * as React from "react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import {
  Card,
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

export const description = "An interactive line chart";

interface LineChartInteractiveProps {
  data: any[];
  config: ChartConfig;
  title: string;
  description?: string;
  keys: string[];
  totalMetric?: string;
}

export function LineChartInteractive({
  data,
  config,
  title,
  description,
  keys,
  totalMetric,
}: LineChartInteractiveProps) {
  const [activeChart, setActiveChart] = React.useState(keys[0]);

  const total = React.useMemo(
    () =>
      keys.reduce(
        (acc, key) => {
          acc[key] = data.reduce((acc, curr) => acc + curr[key], 0);
          return acc;
        },
        {} as Record<string, number>
      ),
    [data, keys]
  );

  return (
    <Card className="py-4 sm:py-0 h-full border-none shadow-none">
      <CardHeader className="pl-0 flex flex-col items-stretch border-b  sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-0 pb-3 sm:pb-0">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}

          {totalMetric && (
            <div className="text-2xl font-bold">{totalMetric}</div>
          )}
        </div>
        {/* <div className="flex">
          {keys.map((key) => {
            const chart = key as keyof typeof config;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {config[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {(total[key as keyof typeof total] || 0).toLocaleString()}
                </span>
              </button>
            );
          })}
        </div> */}
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={config}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`hsl(var(--chart-1))`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
