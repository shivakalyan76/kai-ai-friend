import React from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/appStore.js'

export default function ModeToggle() {
  const profile = useAppStore((s) => s.profile)
  const updateProfile = useAppStore((s) => s.updateProfile)

  if (!profile) return null

  const isBest = profile.mode === 'bestfriend'

  const toggle = () => {
    updateProfile({ mode: isBest ? 'friend' : 'bestfriend' })
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer select-none"
      style={{
        background: isBest
          ? 'rgba(240,98,146,0.15)'
          : 'rgba(124,110,250,0.15)',
        border: isBest
          ? '1px solid rgba(240,98,146,0.3)'
          : '1px solid rgba(124,110,250,0.3)',
        color: isBest ? '#F06292' : '#9B8FFB',
      }}
      title={`Switch to ${isBest ? 'Friend' : 'Best Friend'} mode`}
    >
      <span>{isBest ? '🔥' : '💙'}</span>
      <span className="hidden sm:inline">{isBest ? 'bestie' : 'friend'}</span>
    </button>
  )
}
