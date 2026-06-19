"use client";
import { motion } from "framer-motion";
import { Copy, ThumbsUp, ThumbsDown, RotateCcw, Check } from "lucide-react";
import { useState } from "react";
import { cn, formatTime } from "@/utils";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  index: number;
}

export default function MessageBubble({ message, index }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<"up" | "down" | null>(null);
  const isUser = message.role === "user";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render markdown-lite (bold, newlines)
  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={j} className="font-semibold text-white">{part.slice(2, -2)}</strong>
            ) : (
              <span key={j}>{part}</span>
            )
          )}
          {i < lines.length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 380, damping: 28 }}
      className={cn("flex gap-3 group", isUser ? "flex-row-reverse" : "flex-row")}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 mt-0.5">
        {isUser ? (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
          >
            A
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full flex items-center justify-center relative">
            <div
              className="absolute inset-0 rounded-full blur-sm opacity-70"
              style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
            />
            <div
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
              style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
            >
              N
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("flex flex-col max-w-[75%]", isUser ? "items-end" : "items-start")}>
        {/* Bubble */}
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl text-sm leading-relaxed",
            isUser
              ? "text-white rounded-tr-sm"
              : "text-zinc-200 rounded-tl-sm border border-white/8"
          )}
          style={
            isUser
              ? { background: "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 60%, #22D3EE 100%)", boxShadow: "0 4px 24px rgba(124,58,237,0.3)" }
              : {background: "var(--color-ai-bubble)", border: "1px solid var(--color-ai-bubble-border)" }
          }
        >
          {renderContent(message.content)}

          {/* Streaming cursor */}
          {/* REPLACE this block in your MessageBubble */}
{message.isStreaming && (
  <>
    {/* Show loading dots ONLY when content is empty (waiting for first chunk) */}
    {message.content === "" ? (
      <div className="flex items-center gap-1.5 py-1">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [-3, 3, -3], opacity: [0.4, 1, 0.4] }}
            transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.18, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full"
            style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
          />
        ))}
      </div>
    ) : (
      // Show blinking cursor while text is streaming in
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 0.7 }}
        className="inline-block w-0.5 h-4 bg-violet-400 ml-0.5 align-middle rounded-full"
      />
    )}
  </>
)}
        </div>

        {/* Meta row */}
        <div className={cn(
          "flex items-center gap-2 mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-zinc-600 text-[10px]">{formatTime(message.timestamp)}</span>

          {!isUser && !message.isStreaming && (
            <div className="flex items-center gap-1">
              <ActionButton onClick={handleCopy} title="Copy">
                {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              </ActionButton>
              <ActionButton onClick={() => setLiked(liked === "up" ? null : "up")} title="Good response">
                <ThumbsUp size={11} className={liked === "up" ? "text-violet-400" : ""} />
              </ActionButton>
              <ActionButton onClick={() => setLiked(liked === "down" ? null : "down")} title="Bad response">
                <ThumbsDown size={11} className={liked === "down" ? "text-rose-400" : ""} />
              </ActionButton>
              <ActionButton onClick={() => {}} title="Regenerate">
                <RotateCcw size={11} />
              </ActionButton>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ActionButton({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      title={title}
      className="p-1 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-white/8 transition-all"
    >
      {children}
    </motion.button>
  );
}
