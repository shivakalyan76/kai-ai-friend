import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function MessageInput({ value, onChange, onSend, disabled, placeholder }) {
  const textareaRef = useRef(null)

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px'
  }, [value])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled && value.trim()) onSend()
    }
  }

  const canSend = !disabled && value.trim().length > 0

  return (
    <div
      className="flex items-end gap-2 transition-all duration-200"
      style={{
        background: '#1A1E2E',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '50px',
        padding: '0.45rem 0.45rem 0.45rem 1rem',
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = 'rgba(124,110,250,0.6)'
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
      }}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'say something...'}
        rows={1}
        className="flex-1 bg-transparent border-none outline-none resize-none text-sm leading-relaxed"
        style={{
          color: '#F0F2FF',
          fontFamily: "'DM Sans', sans-serif",
          maxHeight: '120px',
          paddingTop: '0.3rem',
          paddingBottom: '0.3rem',
        }}
        onFocus={(e) => {
          e.target.parentElement.style.borderColor = 'rgba(124,110,250,0.6)'
        }}
        onBlur={(e) => {
          e.target.parentElement.style.borderColor = 'rgba(255,255,255,0.1)'
        }}
      />

      <motion.button
        onClick={onSend}
        disabled={!canSend}
        whileHover={canSend ? { scale: 1.08 } : {}}
        whileTap={canSend ? { scale: 0.94 } : {}}
        className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200"
        style={{
          width: 38,
          height: 38,
          background: canSend
            ? 'linear-gradient(135deg, #7C6EFA, #5B50D6)'
            : 'rgba(255,255,255,0.06)',
          cursor: canSend ? 'pointer' : 'not-allowed',
          boxShadow: canSend ? '0 2px 12px rgba(124,110,250,0.35)' : 'none',
        }}
      >
        <svg
          width={16}
          height={16}
          viewBox="0 0 24 24"
          fill="none"
          stroke={canSend ? '#fff' : '#555D7A'}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13" />
          <polygon points="22 2 15 22 11 13 2 9 22 2" />
        </svg>
      </motion.button>
    </div>
  )
}
