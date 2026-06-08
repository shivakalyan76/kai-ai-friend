import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MessageBubble from './MessageBubble.jsx'

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2 }}
      className="flex items-center gap-1.5 px-3.5 py-3 w-fit"
      style={{
        background: '#1A1E2E',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '18px 18px 18px 4px',
      }}
    >
      {[0, 0.18, 0.36].map((delay, i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: 7, height: 7, background: '#555D7A' }}
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 1.1, delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}

export default function ChatWindow({ messages, isTyping }) {
  const bottomRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isTyping])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto scrollbar-thin flex flex-col gap-1 px-4 py-3"
    >
      <AnimatePresence initial={false}>
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {isTyping && (
          <div className="flex items-end gap-2">
            <TypingIndicator />
          </div>
        )}
      </AnimatePresence>

      <div ref={bottomRef} />
    </div>
  )
}
