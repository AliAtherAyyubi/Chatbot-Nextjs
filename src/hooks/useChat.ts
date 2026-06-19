"use client";
import { useState, useCallback, useRef } from "react";
import type { Message, Conversation } from "@/types";
import { generateId } from "@/utils";

const MOCK_RESPONSES = [
  "That's a fascinating question! Let me think through this carefully. The intersection of technology and human creativity has always produced remarkable outcomes, and what you're describing touches on some deep principles.",
  "Absolutely! Here's a breakdown of the key concepts:\n\n**First**, consider the foundational aspects — these set the stage for everything that follows.\n\n**Second**, the implementation details matter enormously. Small choices compound over time into significant differences.\n\n**Finally**, iteration and feedback loops are your best friends in any complex system.",
  "I've analyzed your request and here's what I found: the pattern you're describing is actually quite common in distributed systems. The solution typically involves three steps — identify the bottleneck, isolate the component, and apply targeted optimization.",
  "Great point! To expand on that — the historical context here is rich. This approach was pioneered in the early 2000s but has seen a renaissance with modern tooling that makes it both more accessible and more powerful than ever before.",
  "Let me craft a response that addresses both the immediate question and the underlying concern. Short answer: yes, with caveats. Longer answer involves understanding the trade-offs between performance, maintainability, and developer experience.",
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  { id: "1", title: "Build a REST API with Node.js", lastMessage: "Here's the complete implementation...", timestamp: new Date(Date.now() - 3600000 * 2), pinned: true, messageCount: 12 },
  { id: "2", title: "Explain quantum entanglement", lastMessage: "Quantum entanglement is a phenomenon...", timestamp: new Date(Date.now() - 3600000 * 5), messageCount: 7 },
  { id: "3", title: "Writing a cover letter", lastMessage: "I've revised the opening paragraph...", timestamp: new Date(Date.now() - 86400000), messageCount: 4 },
  { id: "4", title: "React performance optimization", lastMessage: "Use useMemo and useCallback wisely...", timestamp: new Date(Date.now() - 86400000 * 2), messageCount: 18 },
  { id: "5", title: "Healthy meal prep ideas", lastMessage: "Here are 7 recipes for the week...", timestamp: new Date(Date.now() - 86400000 * 3), messageCount: 9 },
  { id: "6", title: "SQL query optimization tips", lastMessage: "Index your foreign keys and...", timestamp: new Date(Date.now() - 86400000 * 5), messageCount: 5 },
];

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const streamRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
    // Simulate loading past messages
    setMessages([
      {
        id: generateId(),
        role: "user",
        content: "Hey, can you help me with this?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: generateId(),
        role: "assistant",
        content: MOCK_RESPONSES[0],
        timestamp: new Date(Date.now() - 3590000),
      },
    ]);
  }, []);

  const newConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
  if (!content.trim() || isLoading) return;

  const userMessage: Message = {
    id: generateId(),
    role: "user",
    content,
    timestamp: new Date(),
  };

  setMessages((prev) => [...prev, userMessage]);
  setIsLoading(true);

  if (!activeConversationId) {
    const newConv: Conversation = {
      id: generateId(),
      title: content.slice(0, 40) + (content.length > 40 ? "…" : ""),
      lastMessage: content,
      timestamp: new Date(),
      messageCount: 1,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  }

  const assistantId = generateId();

  // ✅ Add bubble immediately with isStreaming: true (shows loading dots)
  setMessages((prev) => [...prev, {
    id: assistantId,
    role: "assistant",
    content: "",
    timestamp: new Date(),
    isStreaming: true,
  }]);

  try {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: content }),
    });

    if (!res.ok || !res.body) throw new Error("Stream failed");

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    // ✅ Read chunks and append to message content in real-time
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: m.content + chunk, isStreaming: true }
            : m
        )
      );
    }

    // ✅ Mark streaming done
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId ? { ...m, isStreaming: false } : m
      )
    );
  } catch (err) {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === assistantId
          ? { ...m, content: "Failed to connect to Gemini.", isStreaming: false }
          : m
      )
    );
  } finally {
    setIsLoading(false);
  }
}, [isLoading, activeConversationId]);

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    selectConversation,
    newConversation,
    sendMessage,
  };
}
