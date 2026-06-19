"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquarePlus, Search, Pin, ChevronRight,
  Settings, HelpCircle, Zap, Star, Crown, LogOut, Bell
} from "lucide-react";
import { cn, formatDate } from "@/utils";
import type { Conversation, UserProfile } from "@/types";

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  collapsed: boolean;
  onToggle: () => void;
}

const USER: UserProfile = {
  id: "1",
  name: "Alex Rivera",
  email: "alex@studio.dev",
  plan: "pro",
};

const PLAN_BADGE = {
  free: { label: "Free", icon: null, color: "text-zinc-400 bg-zinc-800" },
  pro: { label: "Pro", icon: Zap, color: "text-violet-300 bg-violet-500/20" },
  enterprise: { label: "Enterprise", icon: Crown, color: "text-amber-300 bg-amber-500/20" },
};

export default function Sidebar({ conversations, activeId, onSelect, onNew, collapsed, onToggle }: SidebarProps) {
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const pinned = filtered.filter((c) => c.pinned);
  const recent = filtered.filter((c) => !c.pinned);
  const badge = PLAN_BADGE[USER.plan];

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="relative flex flex-col h-full overflow-hidden"
      style={{ background: "var(--color-sidebar)" }}
    >
      {/* Top edge glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

      {/* ── Header ── */}
      <div className={cn("flex items-center gap-3 px-4 py-5", collapsed && "justify-center px-0")}>
        {/* Logo mark */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 5 }}
          className="relative flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer"
          style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }}
          onClick={onToggle}
        >
          <span className="text-white font-black text-sm" style={{ fontFamily: "var(--font-syne)" }}>N</span>
          <div className="absolute inset-0 rounded-xl blur-sm opacity-60" style={{ background: "linear-gradient(135deg, #7C3AED, #22D3EE)" }} />
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex-1 overflow-hidden"
            >
              <p className="text-white font-bold text-base truncate" style={{ fontFamily: "var(--font-syne)" }}>
                Nexus AI
              </p>
              <p className="text-zinc-500 text-xs truncate">Intelligent assistant</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── New Chat Button ── */}
      <div className={cn("px-3 mb-3", collapsed && "px-2")}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={onNew}
          className={cn(
            "w-full flex items-center gap-2.5 rounded-xl text-sm font-semibold transition-all",
            "bg-violet-600 hover:bg-violet-500 text-white",
            collapsed ? "justify-center p-3" : "px-3.5 py-2.5"
          )}
          style={{ boxShadow: "0 0 20px rgba(124,58,237,0.4)" }}
        >
          <MessageSquarePlus size={16} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                New conversation
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* ── Search ── */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 mb-3"
          >
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations…"
                className="w-full bg-white/5 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/8 transition-all"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Conversations List ── */}
      <div className="flex-1 overflow-y-auto px-2 space-y-0.5 scrollbar-thin">
        {/* Pinned */}
        {pinned.length > 0 && !collapsed && (
          <>
            <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest px-2 pt-1 pb-1.5">
              Pinned
            </p>
            {pinned.map((c, i) => (
              <ConversationItem key={c.id} conv={c} active={c.id === activeId} onSelect={onSelect} collapsed={collapsed} index={i} />
            ))}
            <div className="h-px bg-white/5 my-2 mx-2" />
          </>
        )}

        {/* Recent */}
        {!collapsed && (
          <p className="text-zinc-600 text-[10px] font-semibold uppercase tracking-widest px-2 pt-1 pb-1.5">
            Recent
          </p>
        )}
        {recent.map((c, i) => (
          <ConversationItem key={c.id} conv={c} active={c.id === activeId} onSelect={onSelect} collapsed={collapsed} index={i} />
        ))}
      </div>

      {/* ── Footer / Profile ── */}
      <div className="border-t border-white/6 p-2">
        {/* Bottom nav icons */}
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-1 mb-2 px-1"
            >
              {[
                { icon: Bell, label: "Notifications" },
                { icon: HelpCircle, label: "Help" },
                { icon: Settings, label: "Settings" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  title={label}
                  className="flex-1 flex items-center justify-center py-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all"
                >
                  <Icon size={14} />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile card */}
        <motion.button
          whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          onClick={() => setShowProfile(!showProfile)}
          className={cn(
            "w-full flex items-center gap-3 rounded-xl p-2 transition-all",
            collapsed && "justify-center"
          )}
        >
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "var(--color-avatar)" }}>
              {USER.name[0]}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#111118]" />
          </div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="flex-1 text-left overflow-hidden"
              >
                <p className="text-zinc-200 text-xs font-semibold truncate">{USER.name}</p>
                <div className={cn("inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-md mt-0.5", badge.color)}>
                  {badge.icon && <badge.icon size={9} />}
                  {badge.label}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!collapsed && (
            <LogOut size={13} className="text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0" />
          )}
        </motion.button>
      </div>
    </motion.aside>
  );
}

function ConversationItem({
  conv, active, onSelect, collapsed, index,
}: {
  conv: Conversation; active: boolean; onSelect: (id: string) => void; collapsed: boolean; index: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 400, damping: 30 }}
      whileHover={{ x: 2 }}
      onClick={() => onSelect(conv.id)}
      className={cn(
        "w-full flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition-all group",
        active
          ? "bg-violet-500/15 border border-violet-500/25 text-white"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent",
        collapsed && "justify-center"
      )}
    >
      {/* Icon / indicator */}
      <div className={cn(
        "flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all",
        active ? "bg-violet-500/25 text-violet-300" : "bg-white/5 text-zinc-500 group-hover:text-zinc-400"
      )}>
        {conv.pinned ? <Star size={11} fill="currentColor" /> : <MessageSquarePlus size={11} />}
      </div>

      {!collapsed && (
        <div className="flex-1 overflow-hidden">
          <p className="text-xs font-medium truncate">{conv.title}</p>
          <p className="text-[10px] text-zinc-600 truncate mt-0.5">{formatDate(conv.timestamp)}</p>
        </div>
      )}

      {active && !collapsed && (
        <ChevronRight size={12} className="text-violet-400 flex-shrink-0" />
      )}
    </motion.button>
  );
}
