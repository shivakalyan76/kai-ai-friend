import React from 'react'
import { motion } from 'framer-motion'
import { formatTime } from '../../utils/helpers.js'

function MemoryMomentCard({ text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex items-center gap-2 mb-1.5 max-w-xs"
      style={{
        background: 'rgba(124,110,250,0.09)',
        border: '1px solid rgba(124,110,250,0.22)',
        borderRadius: '10px',
        padding: '0.4rem 0.7rem',
      }}
    >
      <span className="text-sm">💭</span>
      <span className="text-xs text-accent2" style={{ color: '#9B8FFB', lineHeight: 1.4 }}>
        {text}
      </span>
    </motion.div>
  )
}

export default function MessageBubble({ message }) {
  const isKai = message.role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="flex flex-col"
    >
      {/* Memory moment card (Kai messages only) */}
      {isKai && message.memoryMoment && (
        <MemoryMomentCard text={message.memoryMoment} />
      )}

      {/* Message row */}
      <div className={`flex items-end gap-2 ${isKai ? '' : 'flex-row-reverse'}`}>
        <div
          className={`
            max-w-[72%] px-3.5 py-2.5 text-sm leading-relaxed
            ${isKai ? 'message-kai text-text1' : 'message-user text-white'}
          `}
          style={{ wordBreak: 'break-word' }}
        >
          {message.content.split('\n').map((line, i, arr) => (
            <React.Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Timestamp */}
      <div
        className={`text-[10px] mt-1 px-1 ${isKai ? 'text-left' : 'text-right'}`}
        style={{ color: '#555D7A' }}
      >
        {formatTime(message.ts)}
      </div>
    </motion.div>
  )
}
