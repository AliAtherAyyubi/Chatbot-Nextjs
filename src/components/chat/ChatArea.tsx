"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Globe, Code2, BookOpen, Palette } from "lucide-react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import type { Message } from "@/types";

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onSend: (msg: string) => void;
  activeConversationId: string | null;
}

const CAPABILITIES = [
  { icon: Code2, label: "Code & debug", desc: "Write, review & fix code in any language" },
  { icon: Globe, label: "Research", desc: "Summarize, analyze, and fact-check" },
  { icon: BookOpen, label: "Writing", desc: "Draft emails, essays, stories & more" },
  { icon: Palette, label: "Creative", desc: "Brainstorm ideas and build concepts" },
];

export default function ChatArea({ messages, isLoading, onSend, activeConversationId }: ChatAreaProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isEmpty = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full" style={{
  background: `radial-gradient(ellipse at 50% 0%, rgba(124,58,237,0.08) 0%, var(--color-bg) 60%)`
}}>
      {/* Header */}
      {/* <div className="flex items-center justify-between px-6 py-4 border-b border-white/6">
        <div className="flex items-center gap-2">
          <Sparkles size={14} className="text-violet-400" />
          <span className="text-zinc-300 text-sm font-medium" style={{ fontFamily: "var(--font-syne)" }}>
            {activeConversationId ? "Active conversation" : "New conversation"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-2.5 py-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Online
          </div>
        </div>
      </div> */}

      {/* Messages / Empty state */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full px-6 py-12"
            >
              {/* Hero logo */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative mb-6 mt-5"
              >
                <div
                  className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black text-white relative z-10"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)", fontFamily: "var(--font-syne)" }}
                >
                  N
                </div>
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-50"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
                />
                {/* Orbiting dot */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                  className="absolute -inset-4"
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-violet-400 blur-sm" />
                </motion.div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-3xl font-bold text-white mb-2 text-center"
                style={{ fontFamily: "var(--font-syne)" }}
              >
                How can I help you?
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-zinc-500 text-sm text-center mb-10 max-w-sm"
              >
                I&apos;m Nexus — your intelligent AI assistant. Ask me anything.
              </motion.p>

              {/* Capability cards */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {CAPABILITIES.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.07, type: "spring" }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="p-4 rounded-2xl border border-white/8 bg-white/3 hover:border-violet-500/30 hover:bg-violet-500/5 transition-all cursor-pointer group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center mb-2.5 group-hover:bg-violet-500/25 transition-all">
                      <Icon size={15} className="text-violet-400" />
                    </div>
                    <p className="text-zinc-200 text-xs font-semibold mb-0.5">{label}</p>
                    <p className="text-zinc-600 text-[11px] leading-relaxed">{desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-4 py-6 space-y-5 max-w-3xl mx-auto w-full"
            >
              {messages.map((msg, i) => (
                <MessageBubble key={msg.id} message={msg} index={i} />
              ))}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="max-w-3xl mx-auto w-full">
        <ChatInput onSend={onSend} isLoading={isLoading} />
      </div>
    </div>
  );
}
