import React, { useState } from 'react'
import { motion } from 'framer-motion'
import ChatHeader from '../components/header/ChatHeader.jsx'
import RelationshipBar from '../components/header/RelationshipBar.jsx'
import KaiAvatar from '../components/avatar/KaiAvatar.jsx'
import ChatWindow from '../components/chat/ChatWindow.jsx'
import MessageInput from '../components/chat/MessageInput.jsx'
import MemoryPanel from '../components/memory/MemoryPanel.jsx'
import RenameModal from '../components/ui/RenameModal.jsx'
import { useAppStore } from '../store/appStore.js'
import { useChat } from '../hooks/useChat.js'

export default function Chat() {
  const [inputValue, setInputValue] = useState('')
  const messages = useAppStore((s) => s.messages)
  const isTyping = useAppStore((s) => s.isTyping)
  const currentEmotion = useAppStore((s) => s.currentEmotion)
  const profile = useAppStore((s) => s.profile)

  const { sendUserMessage } = useChat()

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text || isTyping) return
    setInputValue('')
    await sendUserMessage(text)
  }

  return (
    <div
      className="relative h-full flex flex-col overflow-hidden"
      style={{ background: '#0A0C12' }}
    >
      {/* Ambient background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 35% at 50% -5%, rgba(124,110,250,0.13) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <ChatHeader />

      {/* XP bar */}
      <RelationshipBar profile={profile} />

      {/* Avatar */}
      <div className="flex justify-center items-center pt-2 pb-1 flex-shrink-0 relative z-10">
        <motion.div
          key={currentEmotion}
          initial={{ scale: 0.95, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          <KaiAvatar emotion={currentEmotion} size={88} showGlow />
        </motion.div>
      </div>

      {/* Chat messages */}
      <ChatWindow messages={messages} isTyping={isTyping} />

      {/* Input footer */}
      <div
        className="flex-shrink-0 px-3 py-2.5 relative z-10 chat-footer-safe"
        style={{
          background: 'rgba(10,12,18,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <MessageInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          disabled={isTyping}
          placeholder={`message ${profile?.kaiName || 'Kai'}...`}
        />
      </div>

      {/* Overlays */}
      <MemoryPanel />
      <RenameModal />
    </div>
  )
}
