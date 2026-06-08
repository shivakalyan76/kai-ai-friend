import React from 'react'
import KaiAvatar from '../avatar/KaiAvatar.jsx'
import ModeToggle from './ModeToggle.jsx'
import { useAppStore } from '../../store/appStore.js'
import { getLevelInfo } from '../../utils/helpers.js'

export default function ChatHeader() {
  const profile = useAppStore((s) => s.profile)
  const currentEmotion = useAppStore((s) => s.currentEmotion)
  const setShowMemoryPanel = useAppStore((s) => s.setShowMemoryPanel)
  const setShowRenameModal = useAppStore((s) => s.setShowRenameModal)

  if (!profile) return null

  const levelInfo = getLevelInfo(profile)

  return (
    <div
      className="flex items-center gap-2.5 px-3 py-2 flex-shrink-0"
      style={{
        background: 'rgba(18,21,31,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        zIndex: 10,
      }}
    >
      {/* Mini avatar */}
      <div
        className="flex-shrink-0 rounded-full overflow-hidden"
        style={{
          width: 36,
          height: 36,
          border: '2px solid rgba(124,110,250,0.5)',
        }}
      >
        <KaiAvatar emotion={currentEmotion} size={36} showGlow={false} />
      </div>

      {/* Name + status */}
      <div className="flex-1 min-w-0">
        <div className="font-display font-bold text-sm text-text1 truncate">
          {profile.kaiName}
        </div>
        <div className="flex items-center gap-1.5" style={{ fontSize: 11, color: '#8B92B8' }}>
          <span
            className="rounded-full animate-status-pulse"
            style={{ width: 7, height: 7, background: '#4DD0B8', boxShadow: '0 0 5px #4DD0B8', display: 'inline-block' }}
          />
          online
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1.5">
        {/* Friendship badge */}
        <span
          title={levelInfo.label}
          className="cursor-default select-none"
          style={{ fontSize: 16 }}
        >
          {levelInfo.icon}
        </span>

        {/* Mode toggle */}
        <ModeToggle />

        {/* Memory button */}
        <button
          onClick={() => setShowMemoryPanel(true)}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#8B92B8',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
            e.currentTarget.style.color = '#F0F2FF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = '#8B92B8'
          }}
        >
          💭
          <span className="hidden sm:inline">memories</span>
        </button>

        {/* Rename button */}
        <button
          onClick={() => setShowRenameModal(true)}
          className="text-xs px-2 py-1 rounded-lg transition-all duration-150 cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.07)',
            color: '#8B92B8',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.09)'
            e.currentTarget.style.color = '#F0F2FF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
            e.currentTarget.style.color = '#8B92B8'
          }}
          title="Rename Kai"
        >
          ✏️
        </button>
      </div>
    </div>
  )
}
