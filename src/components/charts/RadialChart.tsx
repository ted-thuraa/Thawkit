"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import React, { useEffect, useRef, useState } from "react";
import { THEME_VARIABLES } from "@/constants/theme";
import { cn } from "@/lib/utils";

interface MetricProps {
  label: string;
  value: string;
  inRange: boolean;
}

interface SleepMetricsProps {
  metrics: MetricProps[];
  isLoaded: boolean;
}

function SleepMetrics({ metrics, isLoaded }: SleepMetricsProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setVisible(true);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [isLoaded]);

  return (
    <div
      className={`grid grid-cols-3 gap-4 p-8 pt-6 transition-opacity duration-700 ease-in-out ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {metrics.map((metric, index) => (
        <div key={index} className="flex flex-col items-center">
          <h3 className="text-gray-400 text-sm mb-1">{metric.label}</h3>
          <div className="flex items-center">
            <p className="text-white text-xl font-semibold">{metric.value}</p>
            {metric.inRange && (
              <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

interface CircularGaugeProps {
  score: number;
  maxScore?: number;
}

function CircularGauge({ score, maxScore = 100 }: CircularGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Draw the gauge on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // For high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.85;

    // Draw ticks
    const totalTicks = 100;
    const tickLength = 8;
    const gapSize = 30; // Degrees gap at the bottom
    const startAngle = (Math.PI / 180) * (270 - (360 - gapSize) / 2);
    const endAngle = (Math.PI / 180) * (270 + (360 - gapSize) / 2);
    const angleStep = (endAngle - startAngle) / (totalTicks - 1);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(120, 140, 230, 0.5)";

    for (let i = 0; i < totalTicks; i++) {
      const angle = startAngle + i * angleStep;
      const inner = radius - tickLength;
      const outer = radius;

      // Progressively light up ticks based on score
      const progressTicks = Math.floor((score / maxScore) * totalTicks);
      if (i <= progressTicks) {
        ctx.strokeStyle = "rgba(130, 150, 255, 0.9)";
      } else {
        ctx.strokeStyle = "rgba(70, 80, 120, 0.3)";
      }

      ctx.beginPath();
      ctx.moveTo(
        centerX + inner * Math.cos(angle),
        centerY + inner * Math.sin(angle)
      );
      ctx.lineTo(
        centerX + outer * Math.cos(angle),
        centerY + outer * Math.sin(angle)
      );
      ctx.stroke();
    }

    // Draw score
    ctx.fillStyle = " #000000";
    ctx.font = "bold 60px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(Math.round(score).toString(), centerX, centerY);
  }, [score, maxScore]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}

type Props = {};

export function RadialGaugeChart({}: Props) {
  const [score, setScore] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Animate the score on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Animate the score counting up
  useEffect(() => {
    if (!isLoaded) return;

    let currentScore = 0;
    const targetScore = 100;
    const interval = setInterval(() => {
      currentScore += 2;
      setScore(currentScore);

      if (currentScore >= targetScore) {
        setScore(targetScore);
        clearInterval(interval);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [isLoaded]);

  // Sleep data
  const sleepDate = "Saturday, Apr 26";
  const sleepMetrics = [
    { label: "Quality", value: "94%", inRange: true },
    { label: "Consistency", value: "93%", inRange: true },
    { label: "Time slept", value: "8h 3m", inRange: true },
  ];

  return (
    <main className="relative mt-4 mb-4 w-full h-full">
      <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out">
        <div className="p-8 pb-0 flex flex-col items-center">
          <CircularGauge score={score} />

          <div className="flex items-center mt-0.5 text-gray-600 text-sm">
            <h2 className="mt-4 mb-1 uppercase tracking-widest text-black text-sm font-medium">
              Overall Score
            </h2>
            <span className="ml-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </div>
        </div>

        {/* <SleepMetrics metrics={sleepMetrics} isLoaded={isLoaded} /> */}
      </div>
    </main>
  );
}
