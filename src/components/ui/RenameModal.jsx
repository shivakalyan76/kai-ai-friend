import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../../store/appStore.js'
import { showToast } from '../../utils/helpers.js'

const RENAME_REACTIONS = [
  "damn got rebranded 😭",
  "alright new era 🔥",
  "oof new name hits different 😭",
  "ok ok that's a vibe",
  "ayyo new name?? let's go",
]

export default function RenameModal() {
  const showRenameModal = useAppStore((s) => s.showRenameModal)
  const setShowRenameModal = useAppStore((s) => s.setShowRenameModal)
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const addMessage = useAppStore((s) => s.addMessage)

  const [value, setValue] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (showRenameModal) {
      setValue(profile?.kaiName || '')
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [showRenameModal, profile?.kaiName])

  const handleRename = () => {
    const trimmed = value.trim()
    if (!trimmed || trimmed.length < 1 || trimmed.length > 20) return

    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
    updateProfile({ kaiName: capitalized })
    setShowRenameModal(false)
    showToast(`Name changed to ${capitalized} 🎉`)

    const reaction = RENAME_REACTIONS[Math.floor(Math.random() * RENAME_REACTIONS.length)]
    addMessage({
      id: Date.now(),
      role: 'assistant',
      content: `${reaction}\n\nalright ${capitalized} it is`,
      emotion: 'happy',
      ts: Date.now(),
      memoryMoment: null,
    })
  }

  const handleKey = (e) => {
    if (e.key === 'Enter') handleRename()
    if (e.key === 'Escape') setShowRenameModal(false)
  }

  return (
    <AnimatePresence>
      {showRenameModal && (
        <>
          {/* Backdrop */}
          <motion.div
            key="modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            onClick={() => setShowRenameModal(false)}
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.92, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 8 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="w-full max-w-sm rounded-2xl p-6"
              style={{
                background: '#12151F',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="font-display font-bold text-lg text-text1 mb-1">
                Rename your friend
              </div>
              <div className="text-sm mb-4" style={{ color: '#8B92B8' }}>
                What should they be called? (e.g. Alex, Bro, Ria, K)
              </div>

              <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKey}
                maxLength={20}
                placeholder="New name..."
                className="w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150"
                style={{
                  background: '#1A1E2E',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#F0F2FF',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                onFocus={(e) => (e.target.style.borderColor = 'rgba(124,110,250,0.6)')}
                onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setShowRenameModal(false)}
                  className="text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-150"
                  style={{
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#8B92B8',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                    e.currentTarget.style.color = '#F0F2FF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'none'
                    e.currentTarget.style.color = '#8B92B8'
                  }}
                >
                  cancel
                </button>
                <button
                  onClick={handleRename}
                  disabled={!value.trim()}
                  className="text-sm font-semibold px-4 py-2 rounded-lg cursor-pointer transition-all duration-150"
                  style={{
                    background: value.trim()
                      ? 'linear-gradient(135deg, #7C6EFA, #5B50D6)'
                      : 'rgba(255,255,255,0.06)',
                    border: 'none',
                    color: value.trim() ? '#fff' : '#555D7A',
                    cursor: value.trim() ? 'pointer' : 'not-allowed',
                  }}
                >
                  rename
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
