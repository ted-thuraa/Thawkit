"use client";

import * as React from "react";
import { Cell, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type Props = {
  rate: number; // Percentage (e.g., 25.5)
};

export function ConversionRateChart({ rate }: Props) {
  const converted = rate;
  const unconverted = 100 - rate;

  const chartData = [
    { name: "Converted", value: converted, fill: "var(--primary)" },
    { name: "Unconverted", value: unconverted, fill: "var(--muted)" },
  ];

  return (
    <Card className="@container/card">
      <CardHeader className="items-center pb-0">
        <CardTitle>Conversion Rate</CardTitle>
        <CardDescription>
          Calculated as Completed Leads / Total Views.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={{}}
          className="mx-auto aspect-square h-[200px] w-full max-w-sm"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  nameKey="name"
                  hideLabel
                  formatter={(value) => `${(value as number).toFixed(2)}%`}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              startAngle={90}
              endAngle={450}
            >
              <Cell fill="var(--primary)" />
              <Cell fill="var(--muted)" />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center">
        <div className="text-4xl font-bold tabular-nums text-primary">
          {rate.toFixed(2)}%
        </div>
        <p className="text-xs text-muted-foreground mt-1">Goal: 5.0%</p>
      </CardFooter>
    </Card>
  );
}
