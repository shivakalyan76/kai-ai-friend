import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore.js'
import { getCategoryEmoji, formatDate, daysAgo } from '../../utils/helpers.js'

function MemoryCard({ memory, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      transition={{ duration: 0.22 }}
      className="rounded-xl p-3 mb-2 group"
      style={{
        background: '#1A1E2E',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div
            className="text-xs font-semibold uppercase tracking-wider mb-1 flex items-center gap-1"
            style={{ color: '#9B8FFB' }}
          >
            <span>{getCategoryEmoji(memory.category)}</span>
            <span>{memory.category}</span>
          </div>
          <div className="text-sm leading-snug text-text1 break-words">
            {memory.content.slice(0, 110)}
            {memory.content.length > 110 ? '…' : ''}
          </div>
          <div className="mt-1.5 text-xs" style={{ color: '#555D7A' }}>
            {daysAgo(memory.created)}
          </div>
        </div>
        <button
          onClick={() => onDelete(memory.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-xs px-1.5 py-0.5 rounded flex-shrink-0"
          style={{ color: '#F06292', background: 'rgba(240,98,146,0.1)' }}
          title="Forget this"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

export default function MemoryPanel() {
  const showMemoryPanel = useAppStore((s) => s.showMemoryPanel)
  const setShowMemoryPanel = useAppStore((s) => s.setShowMemoryPanel)
  const memories = useAppStore((s) => s.memories)
  const deleteMemory = useAppStore((s) => s.deleteMemory)
  const profile = useAppStore((s) => s.profile)

  const sorted = [...memories].reverse()

  return (
    <AnimatePresence>
      {showMemoryPanel && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.55)' }}
            onClick={() => setShowMemoryPanel(false)}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 340, damping: 35 }}
            className="fixed top-0 right-0 h-full z-50 flex flex-col"
            style={{
              width: 'min(340px, 92vw)',
              background: '#12151F',
              borderLeft: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div>
                <div className="font-display font-bold text-base text-text1">
                  💭 Memories
                </div>
                <div className="text-xs mt-0.5" style={{ color: '#555D7A' }}>
                  Things {profile?.kaiName || 'Kai'} remembers about you
                </div>
              </div>
              <button
                onClick={() => setShowMemoryPanel(false)}
                className="text-xl leading-none cursor-pointer transition-colors duration-150"
                style={{ color: '#555D7A', background: 'none', border: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#F0F2FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#555D7A')}
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-3 py-3">
              {sorted.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full pb-16 text-center gap-3">
                  <div style={{ fontSize: 40 }}>🌱</div>
                  <div className="text-sm" style={{ color: '#8B92B8' }}>
                    nothing here yet
                  </div>
                  <div className="text-xs" style={{ color: '#555D7A' }}>
                    keep chatting — {profile?.kaiName || 'Kai'} will remember the important stuff
                  </div>
                </div>
              ) : (
                <AnimatePresence>
                  {sorted.map((mem) => (
                    <MemoryCard
                      key={mem.id}
                      memory={mem}
                      onDelete={deleteMemory}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer count */}
            {sorted.length > 0 && (
              <div
                className="px-4 py-2 text-xs flex-shrink-0"
                style={{
                  borderTop: '1px solid rgba(255,255,255,0.07)',
                  color: '#555D7A',
                }}
              >
                {sorted.length} {sorted.length === 1 ? 'memory' : 'memories'} stored
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
