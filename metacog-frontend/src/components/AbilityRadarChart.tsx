"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const abilityData = [
  { subject: "Data Structures", ability: 85, fullMark: 100 },
  { subject: "Algorithms", ability: 70, fullMark: 100 },
  { subject: "Operating Systems", ability: 45, fullMark: 100 },
  { subject: "Databases", ability: 60, fullMark: 100 },
  { subject: "Networking", ability: 55, fullMark: 100 },
  { subject: "System Design", ability: 80, fullMark: 100 },
];

export default function AbilityRadarChart() {
  return (
    <div className="flex h-full min-h-[400px] w-full flex-col border-4 border-[var(--retro-gray)] bg-black p-6 font-mono text-white">
      <h3 className="mb-2 text-xl font-bold text-white uppercase">
        Cognitive Skill Tree (Ability Map)
      </h3>
      <p className="mb-4 text-sm text-gray-400 uppercase">
        Your dynamic XP distribution across different cognitive domains.
      </p>
      
      <div className="flex-1 w-full h-full min-h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={abilityData}>
            <PolarGrid stroke="#888" strokeOpacity={0.4} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "#ffffff", fontSize: 12, fontWeight: 700 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#222', 
                borderColor: 'var(--retro-gray)', 
                borderWidth: '4px',
                borderRadius: '0px',
                fontFamily: 'monospace',
                color: '#fff'
              }}
              itemStyle={{ color: 'var(--retro-yellow)', fontWeight: 'bold' }}
            />
            <Radar
              name="Ability XP"
              dataKey="ability"
              stroke="var(--retro-yellow)"
              strokeWidth={3}
              fill="var(--retro-blue)"
              fillOpacity={0.6}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
