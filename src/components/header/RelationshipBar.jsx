import React from 'react'
import { motion } from 'framer-motion'
import { getLevelInfo } from '../../utils/helpers.js'

export default function RelationshipBar({ profile }) {
  const info = getLevelInfo(profile)
  const pct = Math.min(Math.max(info.pct * 100, 0), 100)

  return (
    <div className="px-4 pt-1 pb-0.5 flex-shrink-0">
      <div
        className="h-[3px] rounded-full overflow-hidden"
        style={{ background: '#222840' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #5B50D6, #4DD0B8)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-0.5" style={{ fontSize: 10, color: '#555D7A' }}>
        <span>
          {info.icon} {info.label}
        </span>
        <span>{profile?.xp || 0} xp</span>
      </div>
    </div>
  )
}
