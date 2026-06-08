export function formatTime(ts) {
  return new Date(ts).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
  })
}

export function daysAgo(ts) {
  const diff = Date.now() - ts
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  return `${days} days ago`
}

export function getLevelInfo(profile) {
  const xp = profile?.xp || 0
  const level = profile?.level || 'new'

  const levels = {
    new: {
      icon: '🌱',
      label: 'New Friend',
      color: '#4DD0B8',
      pct: Math.min(xp, 99) / 99,
      next: 'Close Friend at 100 XP',
    },
    close: {
      icon: '😊',
      label: 'Close Friend',
      color: '#9B8FFB',
      pct: Math.min(xp - 100, 199) / 199,
      next: 'Best Friend at 300 XP',
    },
    best: {
      icon: '😎',
      label: 'Best Friend',
      color: '#F06292',
      pct: 1,
      next: null,
    },
  }

  return levels[level] || levels.new
}

export function getCategoryEmoji(category) {
  const map = {
    exam: '📝',
    goal: '🎯',
    event: '📅',
    milestone: '🏆',
    preference: '❤️',
    relationship: '💛',
    general: '💭',
  }
  return map[category] || '💭'
}

export function spawnConfetti() {
  const colors = ['#7C6EFA', '#4DD0B8', '#F06292', '#FFB74D', '#fff', '#9B8FFB']
  for (let i = 0; i < 24; i++) {
    const el = document.createElement('div')
    Object.assign(el.style, {
      position: 'fixed',
      width: '8px',
      height: '8px',
      borderRadius: '2px',
      background: colors[Math.floor(Math.random() * colors.length)],
      left: Math.random() * 100 + 'vw',
      top: '-10px',
      zIndex: '9999',
      pointerEvents: 'none',
      animation: `confettiFall ${0.8 + Math.random() * 0.8}s ease-in ${Math.random() * 0.4}s forwards`,
      transform: `rotate(${Math.random() * 360}deg)`,
    })
    document.body.appendChild(el)
    setTimeout(() => el.remove(), 2000)
  }
}

// Inject confetti keyframes once
if (typeof document !== 'undefined' && !document.getElementById('confetti-style')) {
  const style = document.createElement('style')
  style.id = 'confetti-style'
  style.textContent = `
    @keyframes confettiFall {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; }
      100% { transform: translateY(80vh) rotate(720deg); opacity: 0; }
    }
  `
  document.head.appendChild(style)
}

export function showToast(message, duration = 2200) {
  const existing = document.getElementById('kai-toast')
  if (existing) existing.remove()

  const el = document.createElement('div')
  el.id = 'kai-toast'
  Object.assign(el.style, {
    position: 'fixed',
    bottom: '90px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#222840',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '0.6rem 1.1rem',
    fontSize: '13px',
    color: '#F0F2FF',
    zIndex: '9999',
    whiteSpace: 'nowrap',
    fontFamily: "'DM Sans', sans-serif",
    animation: 'toastIn 0.3s ease',
  })
  el.textContent = message

  if (!document.getElementById('toast-style')) {
    const s = document.createElement('style')
    s.id = 'toast-style'
    s.textContent = `
      @keyframes toastIn {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
    `
    document.head.appendChild(s)
  }

  document.body.appendChild(el)
  setTimeout(() => {
    el.style.opacity = '0'
    el.style.transition = 'opacity 0.3s ease'
    setTimeout(() => el.remove(), 350)
  }, duration)
}
