"use client";

import { useMemo } from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import { ConfidenceLevel } from "@/types/quiz";

export interface DashboardDataPoint {
  id: string;
  topic: string;
  questionText: string;
  userAnswerText: string;
  confidenceLevel: ConfidenceLevel;
  isCorrect: boolean;
}

interface MatrixDashboardProps {
  data: DashboardDataPoint[];
}

export default function MatrixDashboard({ data }: MatrixDashboardProps) {
  // Process data to add coordinates and jitter
  const chartData = useMemo(() => {
    return data.map((point) => {
      // Base values
      const baseX = point.isCorrect ? 1 : 0;
      let baseY = 0;
      if (point.confidenceLevel === "certain") baseY = 1;
      else if (point.confidenceLevel === "doubtful") baseY = 0.5;
      else if (point.confidenceLevel === "guessing") baseY = 0;

      // Add jitter to prevent overlap (random between -0.08 and 0.08)
      const jitterX = (Math.random() - 0.5) * 0.16;
      const jitterY = (Math.random() - 0.5) * 0.16;

      // Determine quadrant category for color coding
      let category = "";
      let color = "";
      let stateSummary = "";

      if (point.isCorrect && point.confidenceLevel === "certain") {
        category = "Mastery";
        color = "#22c55e"; // Green
        stateSummary = "You knew this and got it right!";
      } else if (!point.isCorrect && point.confidenceLevel === "certain") {
        category = "Danger Zone";
        color = "#ef4444"; // Crimson Red
        stateSummary = "You were confident but incorrect. High priority to review.";
      } else if (
        point.isCorrect &&
        (point.confidenceLevel === "guessing" || point.confidenceLevel === "doubtful")
      ) {
        category = "Lucky Guess";
        color = "#38bdf8"; // Light Blue
        stateSummary = "You got it right, but you were unsure.";
      } else {
        category = "Foundational Gap";
        color = "#9ca3af"; // Gray
        stateSummary = "You didn't know this and got it wrong.";
      }

      return {
        ...point,
        x: baseX + jitterX,
        y: baseY + jitterY,
        category,
        color,
        stateSummary,
      };
    });
  }, [data]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="max-w-xs rounded-xl border border-gray-200 bg-white/95 p-4 shadow-lg backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
          <div className="mb-2 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="font-semibold text-gray-900 dark:text-white">
              {p.category}
            </span>
          </div>
          <p className="mb-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
            {p.topic}
          </p>
          <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">
            "{p.questionText}"
          </p>
          <div className="mb-2 border-t border-gray-100 pt-2 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-400">Your Answer:</p>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
              {p.userAnswerText}
            </p>
          </div>
          <div className="rounded-md bg-gray-50 p-2 dark:bg-gray-900">
            <p className="text-xs italic text-gray-600 dark:text-gray-400">
              {p.stateSummary}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[500px] w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          {/* Subtle background quadrants using ReferenceArea */}
          <ReferenceArea x1={-0.2} x2={0.5} y1={0.75} y2={1.2} fill="#fee2e2" fillOpacity={0.15} className="dark:fill-red-900 dark:opacity-5" />
          <ReferenceArea x1={0.5} x2={1.2} y1={0.75} y2={1.2} fill="#dcfce7" fillOpacity={0.15} className="dark:fill-green-900 dark:opacity-5" />
          <ReferenceArea x1={-0.2} x2={0.5} y1={-0.2} y2={0.75} fill="#f3f4f6" fillOpacity={0.3} className="dark:fill-gray-800 dark:opacity-10" />
          <ReferenceArea x1={0.5} x2={1.2} y1={-0.2} y2={0.75} fill="#e0f2fe" fillOpacity={0.2} className="dark:fill-sky-900 dark:opacity-5" />

          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis
            type="number"
            dataKey="x"
            domain={[-0.2, 1.2]}
            ticks={[0, 1]}
            tickFormatter={(val) => (val === 0 ? "Incorrect" : "Correct")}
            axisLine={{ stroke: '#9ca3af', opacity: 0.5 }}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 500 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            domain={[-0.2, 1.2]}
            ticks={[0, 0.5, 1]}
            tickFormatter={(val) =>
              val === 0 ? "Guessing" : val === 0.5 ? "Doubtful" : "Certain"
            }
            axisLine={{ stroke: '#9ca3af', opacity: 0.5 }}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 14, fontWeight: 500 }}
          />
          
          <ReferenceLine x={0.5} stroke="#cbd5e1" strokeDasharray="4 4" className="dark:stroke-gray-700" />
          <ReferenceLine y={0.75} stroke="#cbd5e1" strokeDasharray="4 4" className="dark:stroke-gray-700" />
          
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', strokeOpacity: 0.5 }} />
          
          <Scatter data={chartData}>
            {chartData.map((entry, index) => (
              <circle
                key={`cell-${index}`}
                cx={0} // Scatter will handle positioning, but Recharts needs a shape definition if not using implicit dots. 
                // Actually Recharts Scatter automatically renders dots. We just provide `fill`.
                fill={entry.color}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
