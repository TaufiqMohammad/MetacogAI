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
  Cell,
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
        color = "#a8a29e"; // Stone Gray
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
        <div className="max-w-xs border-4 border-[var(--retro-gray)] bg-[#222] p-4 font-mono text-white shadow-xl">
          <div className="mb-2 flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-none border border-white"
              style={{ backgroundColor: p.color }}
            />
            <span className="font-bold uppercase text-white">
              {p.category}
            </span>
          </div>
          <p className="mb-1 text-xs font-bold text-[var(--retro-blue)] uppercase">
            {p.topic}
          </p>
          <p className="mb-3 text-sm text-gray-300">
            "{p.questionText}"
          </p>
          <div className="mb-2 border-t-2 border-[var(--retro-gray)] pt-2">
            <p className="text-xs text-gray-400 uppercase">Your Answer:</p>
            <p className="text-sm font-bold text-white">
              {p.userAnswerText}
            </p>
          </div>
          <div className="bg-black border border-[var(--retro-gray)] p-2">
            <p className="text-xs italic text-gray-300">
              {p.stateSummary}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full min-h-[400px] w-full flex-col border-4 border-[var(--retro-gray)] bg-black p-6 font-mono">
      <h3 className="mb-2 text-xl font-bold text-white uppercase">
        Scatter Plot Matrix
      </h3>
      <p className="mb-4 text-sm text-gray-400">
        Calibration index vs. Performance.
      </p>
      
      <div className="flex-1 w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            {/* Subtle background quadrants using ReferenceArea */}
            <ReferenceArea x1={-0.2} x2={0.5} y1={0.75} y2={1.2} fill="#ef4444" fillOpacity={0.08} />
            <ReferenceArea x1={0.5} x2={1.2} y1={0.75} y2={1.2} fill="#22c55e" fillOpacity={0.08} />
            <ReferenceArea x1={-0.2} x2={0.5} y1={-0.2} y2={0.75} fill="#78716c" fillOpacity={0.08} />
            <ReferenceArea x1={0.5} x2={1.2} y1={-0.2} y2={0.75} fill="#38bdf8" fillOpacity={0.08} />

            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[-0.2, 1.2]}
              ticks={[0, 1]}
              tickFormatter={(val) => (val === 0 ? "Incorrect" : "Correct")}
              axisLine={{ stroke: '#666', strokeWidth: 2 }}
              tickLine={false}
              tick={{ fill: '#ffffff', fontSize: 13, fontWeight: 700 }}
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[-0.2, 1.2]}
              ticks={[0, 0.5, 1]}
              tickFormatter={(val) =>
                val === 0 ? "Guessing" : val === 0.5 ? "Doubtful" : "Certain"
              }
              axisLine={{ stroke: '#666', strokeWidth: 2 }}
              tickLine={false}
              tick={{ fill: '#ffffff', fontSize: 13, fontWeight: 700 }}
            />
            
            <ReferenceLine x={0.5} stroke="#888" strokeWidth={2} strokeDasharray="4 4" />
            <ReferenceLine y={0.75} stroke="#888" strokeWidth={2} strokeDasharray="4 4" />
            
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', strokeOpacity: 0.5 }} />
            
            <Scatter data={chartData}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
