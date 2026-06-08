import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const DEFAULT_PROFILE = null

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── Profile ──────────────────────────────────────────────────
      profile: DEFAULT_PROFILE,

      setProfile: (profile) => set({ profile }),

      updateProfile: (patch) =>
        set((s) => ({ profile: s.profile ? { ...s.profile, ...patch } : patch })),

      // ── Messages ─────────────────────────────────────────────────
      messages: [],

      addMessage: (msg) =>
        set((s) => {
          const next = [...s.messages, msg]
          // Keep last 80 messages
          return { messages: next.slice(-80) }
        }),

      setMessages: (messages) => set({ messages }),

      // ── Memories ─────────────────────────────────────────────────
      memories: [],

      addMemory: (memory) =>
        set((s) => {
          // Deduplicate by content prefix
          const prefix = memory.content.toLowerCase().slice(0, 40)
          const exists = s.memories.some((m) =>
            m.content.toLowerCase().startsWith(prefix)
          )
          if (exists) return s
          return { memories: [...s.memories, memory] }
        }),

      deleteMemory: (id) =>
        set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),

      // ── Emotion ──────────────────────────────────────────────────
      currentEmotion: 'neutral',

      setEmotion: (emotion) => set({ currentEmotion: emotion }),

      // ── UI state ─────────────────────────────────────────────────
      showMemoryPanel: false,
      setShowMemoryPanel: (v) => set({ showMemoryPanel: v }),

      showRenameModal: false,
      setShowRenameModal: (v) => set({ showRenameModal: v }),

      isTyping: false,
      setIsTyping: (v) => set({ isTyping: v }),

      // ── Relationship XP ──────────────────────────────────────────
      gainXP: (amount) =>
        set((s) => {
          if (!s.profile) return s
          const newXP = (s.profile.xp || 0) + amount
          let level = 'new'
          if (newXP >= 300) level = 'best'
          else if (newXP >= 100) level = 'close'
          return {
            profile: { ...s.profile, xp: newXP, level },
          }
        }),

      // ── Reset ────────────────────────────────────────────────────
      reset: () =>
        set({
          profile: null,
          messages: [],
          memories: [],
          currentEmotion: 'neutral',
          showMemoryPanel: false,
          showRenameModal: false,
          isTyping: false,
        }),
    }),
    {
      name: 'kai-storage',
      version: 1,
      // Exclude transient UI state — these should always reset on page load.
      // Without this, a crash mid-request leaves isTyping=true forever (input locked).
      partialize: (state) => ({
        profile: state.profile,
        messages: state.messages,
        memories: state.memories,
      }),
    }
  )
)
