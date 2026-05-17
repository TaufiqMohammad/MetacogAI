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
    <div className="flex h-full min-h-[400px] w-full flex-col rounded-2xl glass-panel p-6 shadow-sm transition-all hover:shadow-indigo-500/10">
      <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
        Cognitive Skill Tree (Ability Map)
      </h3>
      <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
        Your dynamic XP distribution across different cognitive domains.
      </p>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={abilityData}>
            <PolarGrid stroke="#6366f1" strokeOpacity={0.3} />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: "#94a3b8", fontSize: 13, fontWeight: 600 }} 
            />
            <PolarRadiusAxis 
              angle={30} 
              domain={[0, 100]} 
              tick={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                borderColor: 'rgba(99, 102, 241, 0.2)', 
                borderRadius: '12px',
                color: '#fff'
              }}
              itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
            />
            <Radar
              name="Ability XP"
              dataKey="ability"
              stroke="#818cf8"
              strokeWidth={2}
              fill="url(#colorAbility)"
              fillOpacity={0.6}
            />
            <defs>
              <linearGradient id="colorAbility" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#c084fc" stopOpacity={0.2} />
              </linearGradient>
            </defs>
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
