"use client";

import { useState, useEffect, useRef } from "react";
import { Question } from "@/types/quiz";
import { Lock, Unlock, Send, Radio } from "lucide-react";
import { audioSynth } from "@/utils/audio";

interface SocraticMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface SocraticInterventionProps {
  question: Question;
  selectedAnswerIndex: number;
  onClose: (solved: boolean) => void;
}

export default function SocraticIntervention({
  question,
  selectedAnswerIndex,
  onClose,
}: SocraticInterventionProps) {
  const [messages, setMessages] = useState<SocraticMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const selectedOptionText = question.options[selectedAnswerIndex];

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isSolved || isTyping) return;
    
    audioSynth.playTick();
    const userMsg: SocraticMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/quiz/socratic/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_text: question.questionText,
          options: question.options,
          correct_index: question.correctAnswerIndex,
          user_answer_index: selectedAnswerIndex,
          chat_history: messages,
          new_message: userMsg.content
        }),
      });

      if (!response.ok) throw new Error("Failed to chat");
      const data = await response.json();
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.response_text }]);
      
      if (data.is_solved) {
        setIsSolved(true);
        audioSynth.playSuccess();
      } else {
        audioSynth.playBuzzer();
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "system", content: "ERR: CONNECTION TO COMMAND LOST." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="flex h-full max-h-[600px] w-full max-w-2xl flex-col border-4 border-[var(--retro-red)] bg-black font-mono shadow-[0_0_20px_rgba(213,0,0,0.5)]">
        {/* Header */}
        <div className="flex items-center gap-3 border-b-4 border-[var(--retro-red)] bg-[var(--retro-red)] px-4 py-3 text-white">
          <Radio className="h-6 w-6 animate-pulse" />
          <div>
            <h2 className="text-lg font-bold">INCOMING TRANSMISSION: DANGER ZONE</h2>
            <p className="text-xs">DEBUG PROTOCOL - OVERRIDE REQUIRED</p>
          </div>
        </div>

        {/* Console Context */}
        <div className="border-b-4 border-[var(--retro-gray)] bg-[#222] px-4 py-3 text-sm text-gray-300">
          <p className="font-bold text-white mb-2">TARGET: {question.topic.toUpperCase()}</p>
          <p>You selected: "{selectedOptionText}" with MAXIMUM CONFIDENCE.</p>
          <p className="mt-2 text-[var(--retro-red)] font-bold animate-pulse">LOCKED OUT. AWAITING LOGIC DEBUG...</p>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black text-white">
          <div className="text-[var(--retro-yellow)]">
            <span className="font-bold">HQ&gt;</span> I noticed you were completely certain about that answer, but it's incorrect. Let's break down your logic. Why did you choose that option?
          </div>
          
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.role === "user" ? "text-white" : msg.role === "assistant" ? "text-[var(--retro-yellow)]" : "text-[var(--retro-red)]"}>
              <span className="font-bold">{msg.role === "user" ? "YOU" : "HQ"}&gt;</span> {msg.content}
            </div>
          ))}
          
          {isTyping && (
            <div className="text-[var(--retro-yellow)] animate-pulse">
              <span className="font-bold">HQ&gt;</span> receiving...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Action / Input */}
        <div className="border-t-4 border-[var(--retro-red)] p-4 bg-[#222]">
          {isSolved ? (
            <button
              onClick={() => {
                audioSynth.playHeal();
                onClose(true);
              }}
              className="retro-btn w-full flex items-center justify-center gap-2 px-4 py-3 text-xl bg-[var(--retro-blue)] text-white hover:text-black"
            >
              <Unlock className="h-5 w-5" />
              OVERRIDE SUCCESSFUL. RESUME COMBAT.
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-white font-bold">YOU&gt;</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-black text-white border-2 border-[var(--retro-gray)] p-2 outline-none focus:border-white"
                placeholder="Type your explanation..."
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="retro-btn px-4 py-2 disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onClose(false)}
                className="ml-2 text-xs border-2 border-[var(--retro-red)] bg-[var(--retro-red)] text-white px-2 py-2 hover:bg-white hover:text-[var(--retro-red)] font-bold"
              >
                ABORT (Lose Shield)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
