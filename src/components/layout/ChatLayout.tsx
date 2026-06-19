"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import Sidebar from "@/components/sidebar/Sidebar";
import ChatArea from "@/components/chat/ChatArea";
import { useChat } from "@/hooks/useChat";
import { useTheme } from "@/hooks/useTheme"; 

export default function ChatLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { conversations, activeConversationId, messages, isLoading, selectConversation, newConversation, sendMessage } = useChat();
const { theme, toggleTheme } = useTheme();
  return (
    <div className="flex h-screen overflow-hidden "  style={{ background: "var(--color-bg)" }}>
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={selectConversation}
        onNew={newConversation}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Divider */}
      <div className="w-px  shrink-0" style={{ background: "var(--color-border)" }}/>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Collapse toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute top-4 left-4 z-10 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/8 transition-all"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={15} /> : <PanelLeftClose size={15} />}
        </motion.button>
{/* toggle button */}
<motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-lg transition-all"
          style={{
  color: "var(--color-text)",
  background: "var(--color-overlay)",
  border: "1px solid var(--color-border-hover)",
}}
        >
          <AnimatePresence mode="wait">
            {theme === "dark" ? (
              <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Sun size={15} />
              </motion.div>
            ) : (
              <motion.div key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Moon size={15} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>

{/*  */}
        <ChatArea
          messages={messages}
          isLoading={isLoading}
          onSend={sendMessage}
          activeConversationId={activeConversationId}
        />
      </div>
    </div>
  );
}
