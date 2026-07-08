"use client";
import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Message, Conversation } from "@/types";

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(true);
  const router = useRouter();

  type ConversationResponse = {
    id: string;
    title: string;
    messages?: { content: string }[];
    updated_at: string;
  };

  // ── Load all conversations from Supabase on mount ──
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch("/api/conversations");

        if (res.status === 401) {
          router.push("/login");
          return;
        }

        const data: ConversationResponse[] = await res.json();

        const mapped: Conversation[] = data.map((c) => ({
          id: c.id,
          title: c.title,
          lastMessage: c.messages?.at(-1)?.content ?? "",
          timestamp: new Date(c.updated_at),
          messageCount: c.messages?.length ?? 0,
          pinned: false,
        }));

        setConversations(mapped);
      } catch (err) {
        console.error("Failed to load conversations", err);
      } finally {
        setIsFetchingHistory(false);
      }
    };

    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Select a conversation and load its messages ──
  const selectConversation = useCallback(async (id: string) => {
    setActiveConversationId(id);
    setMessages([]);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/conversations/${id}/messages`);

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      type MessageData = {
        id: string;
        role: "user" | "assistant";
        content: string;
        created_at: string;
      };

      const mapped: Message[] = data.map((m: MessageData) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
        isStreaming: false,
      }));

      setMessages(mapped);
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── New conversation ──
  const newConversation = useCallback(() => {
    setActiveConversationId(null);
    setMessages([]);
  }, []);

  // ── Send message with real Gemini streaming ──
  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    let convId = activeConversationId;

    // 1. Create conversation in DB if none active
    if (!convId) {
      try {
        const res = await fetch("/api/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: content.slice(0, 40) + (content.length > 40 ? "…" : ""),
          }),
        });

        if (res.status === 401) {
          router.push("/login");
          setIsLoading(false);
          return;
        }

        const newConv = await res.json();
        convId = newConv.id;
        setActiveConversationId(convId);

        const mapped: Conversation = {
          id: newConv.id,
          title: newConv.title,
          lastMessage: content,
          timestamp: new Date(newConv.updated_at),
          messageCount: 0,
          pinned: false,
        };
        setConversations((prev) => [mapped, ...prev]);
      } catch (err) {
        console.error("Failed to create conversation", err);
        setIsLoading(false);
        return;
      }
    }

    // 2. Save user message to DB
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    await fetch(`/api/conversations/${convId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "user", content }),
    });

    // 3. Add empty streaming bubble
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    // 4. Stream Gemini response
    let fullResponse = "";

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + chunk, isStreaming: true }
              : m
          )
        );
      }

      // 5. Mark streaming done
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, isStreaming: false } : m))
      );

      // 6. Save assistant response to DB
      await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "assistant", content: fullResponse }),
      });

      // 7. Update sidebar conversation preview
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                lastMessage: fullResponse.slice(0, 60),
                timestamp: new Date(),
                messageCount: c.messageCount + 2,
              }
            : c
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, activeConversationId]);

  return {
    conversations,
    activeConversationId,
    messages,
    isLoading,
    isFetchingHistory,
    selectConversation,
    newConversation,
    sendMessage,
  };
}
