"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Paperclip, Mic, Sparkles, Globe, Image } from "lucide-react";
import { cn } from "@/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}
const SUGGESTIONS = [
  "Explain quantum computing simply",
  "Write a Python web scraper",
  "Help me plan my week",
  "Design a REST API schema",
];

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleSend = () => {
    if (value.trim() && !isLoading) {
      onSend(value.trim());
      setValue("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const canSend = value.trim().length > 0 && !isLoading;

  return (
    <div className="px-4 pb-4 pt-2">

      {/* Input container */}
      <motion.div
        animate={{
          boxShadow: focused ? "0 0 0 1px rgba(124,58,237,0.3), 0 8px 32px rgba(124,58,237,0.15)" : "0 0 0 0px transparent",
        }}
        transition={{ duration: 0.2 }}
        className="relative rounded-2xl border overflow-hidden"
        style={{
          background: "var(--color-input-bg)",
          borderColor: focused ? "rgba(124,58,237,0.6)" : "var(--color-border)",
        }}
      >
        {/* Toolbar top */}
        {/* <div className="flex items-center gap-1 px-3 pt-2.5 pb-1">
          {[
            { icon: Globe, label: "Web search" },
            { icon: Image, label: "Image" },
            { icon: Paperclip, label: "Attach file" },
          ].map(({ icon: Icon, label }) => (
            <motion.button
              key={label}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title={label}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "var(--color-icon)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-icon-hover)";
                e.currentTarget.style.background = "var(--color-hover-bg-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-icon)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={14} />
            </motion.button>
          ))}
        </div> */}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Ask Nexus anything…"
          rows={1}
          className="w-full bg-transparent px-4 py-2 text-sm resize-none focus:outline-none leading-relaxed placeholder:text-[var(--color-placeholder)]"
          style={{ color: "var(--color-text)", caretColor: "var(--color-accent)" }}
        />

        {/* Bottom bar */}
        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-2 text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            <Sparkles size={11} className="text-violet-500" />
            <span>Nexus 2.0</span>
            <span style={{ color: "var(--color-disabled)" }}>·</span>
            <span>Shift+Enter for new line</span>
          </div>

          <div className="flex items-center gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 rounded-lg transition-all"
              style={{ color: "var(--color-icon)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-icon-hover)";
                e.currentTarget.style.background = "var(--color-hover-bg-strong)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-icon)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Mic size={14} />
            </motion.button>

            <motion.button
              whileHover={canSend ? { scale: 1.05 } : {}}
              whileTap={canSend ? { scale: 0.95 } : {}}
              onClick={handleSend}
              disabled={!canSend}
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-xl transition-all",
                canSend ? "text-white cursor-pointer" : "cursor-not-allowed"
              )}
              style={canSend ? {
                background: "linear-gradient(135deg, #7C3AED, #22D3EE)",
                boxShadow: "0 0 16px rgba(124,58,237,0.5)",
              } : {
                color: "var(--color-disabled)",
                background: "var(--color-hover-bg)",
              }}
            >
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex gap-0.5"
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ repeat: Infinity, duration: 0.7, delay: i * 0.15 }}
                        className="w-1 h-1 rounded-full"
                        style={{ background: "var(--color-text-muted)" }}
                      />
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="send"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Send size={14} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-[10px] mt-2" style={{ color: "var(--color-text-muted)" }}>
        Nexus can make mistakes. Verify important information.
      </p>
    </div>
  );
}
