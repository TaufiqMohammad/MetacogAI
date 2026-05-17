"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Cpu, Network, Database, Lock, Unlock, Zap, Activity } from "lucide-react";
import { audioSynth } from "@/utils/audio";

interface SkillNode {
  id: string;
  label: string;
  cost: number;
  icon: React.ReactNode;
  row: number;
  parents: string[];
}

const SKILL_NODES: SkillNode[] = [
  { id: "core", label: "COMP_SCI CORE", cost: 0, icon: <Cpu />, row: 1, parents: [] },
  { id: "ds", label: "DATA_STRUCTURES", cost: 200, icon: <Network />, row: 2, parents: ["core"] },
  { id: "algo", label: "ALGORITHMS", cost: 300, icon: <Activity />, row: 2, parents: ["core"] },
  { id: "db", label: "DATABASE_SYS", cost: 400, icon: <Database />, row: 3, parents: ["ds"] },
  { id: "os", label: "OPERATING_SYS", cost: 500, icon: <Cpu />, row: 3, parents: ["algo"] },
  { id: "ai", label: "NEURAL_NETS", cost: 1000, icon: <Zap />, row: 4, parents: ["db", "os"] },
];

export default function SkillTreePage() {
  const [mxp, setMxp] = useState(0);
  const [unlockedNodes, setUnlockedNodes] = useState<string[]>(["core"]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMxp = localStorage.getItem("metacog_mxp");
      if (storedMxp) setMxp(parseInt(storedMxp, 10));

      const storedNodes = localStorage.getItem("metacog_nodes");
      if (storedNodes) setUnlockedNodes(JSON.parse(storedNodes));
    }
  }, []);

  const handleUnlock = (node: SkillNode) => {
    // Check if affordable and parent is unlocked
    const canAfford = mxp >= node.cost;
    const parentUnlocked = node.parents.every(p => unlockedNodes.includes(p));

    if (canAfford && parentUnlocked && !unlockedNodes.includes(node.id)) {
      audioSynth.playSuccess();
      const newMxp = mxp - node.cost;
      const newNodes = [...unlockedNodes, node.id];
      
      setMxp(newMxp);
      setUnlockedNodes(newNodes);
      
      localStorage.setItem("metacog_mxp", newMxp.toString());
      localStorage.setItem("metacog_nodes", JSON.stringify(newNodes));
    } else {
      audioSynth.playBuzzer();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-12 border-b-4 border-[var(--retro-gray)] pb-6">
          <div>
            <h1 className="text-3xl font-bold uppercase">SKILL CARTOGRAPHY</h1>
            <p className="text-gray-400 mt-2">MAP YOUR EXPANSION USING MXP.</p>
          </div>
          <div className="flex gap-6">
            <div className="flex flex-col items-center bg-[#222] border-4 border-[var(--retro-gray)] p-2">
              <span className="text-xs uppercase text-gray-400 font-bold">AVAILABLE MXP</span>
              <div className="flex items-center gap-2 text-2xl font-bold text-[var(--retro-yellow)] text-glow-amber mt-1">
                <Zap className="fill-current" /> {mxp}
              </div>
            </div>
            <Link href="/" className="retro-btn flex items-center gap-2 px-4 py-2 uppercase font-bold text-sm h-fit self-center">
              <ArrowLeft className="h-4 w-4" /> RETREAT
            </Link>
          </div>
        </div>

        <div className="flex flex-col items-center gap-16 py-12">
          {[1, 2, 3, 4].map(row => (
            <div key={row} className="flex justify-center gap-16 w-full relative">
              {SKILL_NODES.filter(n => n.row === row).map(node => {
                const isUnlocked = unlockedNodes.includes(node.id);
                const parentUnlocked = node.parents.length === 0 || node.parents.every(p => unlockedNodes.includes(p));
                const canAfford = mxp >= node.cost;
                const isUnlockable = !isUnlocked && parentUnlocked && canAfford;

                return (
                  <button
                    key={node.id}
                    onClick={() => handleUnlock(node)}
                    disabled={isUnlocked || (!parentUnlocked && !isUnlocked)}
                    className={`relative flex flex-col items-center justify-center p-6 border-4 w-48 h-48 transition-all duration-300 ${
                      isUnlocked 
                        ? 'border-[var(--retro-blue)] bg-[var(--retro-blue)] text-white cursor-default' 
                        : isUnlockable
                          ? 'border-[var(--retro-yellow)] bg-[#222] text-[var(--retro-yellow)] hover:bg-[var(--retro-yellow)] hover:text-black cursor-pointer shadow-[0_0_15px_rgba(255,255,85,0.5)] animate-pulse'
                          : 'border-[var(--retro-darkgray)] bg-[#111] text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    <div className="mb-4 transform scale-150">
                      {node.icon}
                    </div>
                    <div className="font-bold text-sm text-center mb-2 uppercase">{node.label}</div>
                    
                    {!isUnlocked && (
                      <div className="flex items-center gap-1 text-xs font-bold mt-auto">
                        <Zap className="h-3 w-3" /> {node.cost} MXP
                      </div>
                    )}
                    
                    {isUnlocked && (
                      <div className="absolute top-2 right-2 text-white">
                        <Unlock className="h-4 w-4" />
                      </div>
                    )}
                    
                    {!isUnlocked && !parentUnlocked && (
                      <div className="absolute top-2 right-2 text-[var(--retro-red)]">
                        <Lock className="h-4 w-4" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
