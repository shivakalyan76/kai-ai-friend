import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import KaiAvatar from '../components/avatar/KaiAvatar.jsx'
import { patchProfile } from '../utils/api.js'
import { useAppStore } from '../store/appStore.js'

const WELCOME_MESSAGES = {
  friend: {
    content: "hey 😊 really glad you're here\n\ni'm Kai — think of me as a friend, not just some chatbot",
    emotion: 'happy',
  },
  bestfriend: {
    content: "yo!! finally 😭 was waiting for you to show up\n\nalright we're best friends now, let's get it 🔥",
    emotion: 'excited',
  },
}

export default function Landing() {
  const [selectedMode, setSelectedMode] = useState('friend')
  const [hoveredMode, setHoveredMode] = useState(null)
  const navigate = useNavigate()
  const { setProfile, addMessage, reset } = useAppStore()

  const handleStart = async () => {
    reset()

    const profile = {
      kaiName: 'Kai',
      mode: selectedMode,
      xp: 0,
      level: 'new',
      createdAt: Date.now(),
    }

    setProfile(profile)

    try {
      await patchProfile({ mode: selectedMode })
    } catch (error) {
      console.error('Failed to persist initial mode:', error)
    }

    const welcome = WELCOME_MESSAGES[selectedMode]
    addMessage({
      id: Date.now(),
      role: 'assistant',
      content: welcome.content,
      emotion: welcome.emotion,
      ts: Date.now(),
      memoryMoment: null,
    })

    navigate('/chat')
  }

  const avatarEmotion =
    hoveredMode === 'bestfriend'
      ? 'excited'
      : hoveredMode === 'friend'
      ? 'happy'
      : 'happy'

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center overflow-hidden bg-bg px-6">
      {/* Background effects */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 50% at 50% 5%, rgba(124,110,250,0.18) 0%, transparent 70%), radial-gradient(ellipse 40% 35% at 80% 85%, rgba(77,208,184,0.09) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse 85% 65% at 50% 50%, black 0%, transparent 100%)',
        }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center gap-0"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Avatar */}
        <motion.div
          className="mb-4"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity }}
        >
          <KaiAvatar emotion={avatarEmotion} size={110} showGlow />
        </motion.div>

        {/* Wordmark */}
        <motion.h1
          className="font-display text-[clamp(72px,14vw,130px)] font-black leading-none tracking-tight gradient-text mb-1"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Kai
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-text2 text-base italic mb-8 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          "Not your assistant. Your friend."
        </motion.p>

        {/* Mode cards */}
        <motion.div
          className="flex gap-4 flex-wrap justify-center mb-6"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          {[
            {
              key: 'friend',
              icon: '💙',
              name: 'Friend Mode',
              desc: 'Warm, caring, supportive',
              sub: 'Never judges, always there',
            },
            {
              key: 'bestfriend',
              icon: '🔥',
              name: 'Best Friend Mode',
              desc: 'Funny, playful, chaotic',
              sub: 'Roasts you, loves you anyway',
            },
          ].map((mode) => (
            <motion.button
              key={mode.key}
              onClick={() => setSelectedMode(mode.key)}
              onHoverStart={() => setHoveredMode(mode.key)}
              onHoverEnd={() => setHoveredMode(null)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="relative min-w-[160px] px-6 py-5 rounded-2xl text-center cursor-pointer transition-all duration-200"
              style={{
                background:
                  selectedMode === mode.key
                    ? 'linear-gradient(135deg, rgba(124,110,250,0.18), rgba(77,208,184,0.09))'
                    : 'rgba(18,21,31,1)',
                border:
                  selectedMode === mode.key
                    ? '1px solid rgba(124,110,250,0.55)'
                    : '1px solid rgba(255,255,255,0.08)',
                boxShadow:
                  selectedMode === mode.key
                    ? '0 0 28px rgba(124,110,250,0.2)'
                    : 'none',
              }}
            >
              {selectedMode === mode.key && (
                <motion.div
                  layoutId="mode-highlight"
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: 'rgba(124,110,250,0.06)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <div className="text-3xl mb-2">{mode.icon}</div>
              <div className="font-display font-bold text-sm text-text1 mb-1">{mode.name}</div>
              <div className="text-xs text-text2">{mode.desc}</div>
              <div className="text-xs text-text3 mt-1">{mode.sub}</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Start button */}
        <motion.button
          onClick={handleStart}
          whileHover={{ y: -2, boxShadow: '0 8px 36px rgba(124,110,250,0.45)' }}
          whileTap={{ scale: 0.97 }}
          className="btn-accent font-display font-bold text-base px-10 py-3 rounded-full tracking-wide"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          Start Chatting →
        </motion.button>

        {/* Disclaimer */}
        <motion.p
          className="text-text3 text-xs mt-5 text-center max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Kai remembers your conversations and grows with you over time.
        </motion.p>
      </motion.div>
    </div>
  )
}
