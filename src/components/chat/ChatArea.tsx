"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Globe, BookOpen, Palette } from "lucide-react";
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
      {/* Messages / Empty state */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {isEmpty ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center h-full justify-center px-4"
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
                  style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
                >
                  N
                </div>
                <div
                  className="absolute inset-0 rounded-3xl blur-2xl opacity-50"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
                />
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
                className="text-3xl font-bold mb-2 text-center"
                style={{ color: "var(--color-text)" }}
              >
                How can I help you today?
              </motion.h1>
              {/* <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="text-sm text-center mb-10 max-w-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                I&apos;m Nexus — your intelligent AI assistant. Ask me anything.
              </motion.p> */}

              {/* Capability cards */}
              {/* <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                {CAPABILITIES.map(({ icon: Icon, label, desc }, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.07, type: "spring" }}
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="p-4 rounded-2xl transition-all cursor-pointer group"
                    style={{
                      background: "var(--color-card-bg)",
                      border: "1px solid var(--color-card-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(124,58,237,0.3)";
                      e.currentTarget.style.background = "rgba(124,58,237,0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--color-card-border)";
                      e.currentTarget.style.background = "var(--color-card-bg)";
                    }}
                  >
                    <div className="w-8 h-8 rounded-xl bg-violet-500/15 flex items-center justify-center mb-2.5 group-hover:bg-violet-500/25 transition-all">
                      <Icon size={15} className="text-violet-400" />
                    </div>
                    <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--color-text)" }}>{label}</p>
                    <p className="text-[11px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
                  </motion.div>
                ))}
              </div> */}
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
