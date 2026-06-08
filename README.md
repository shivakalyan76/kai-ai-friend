# Kai — "Not your assistant. Your friend."

A full-stack AI companion app with persistent memory, animated avatar, emotion detection, and relationship progression.

---

## Quick Start

### 1. Clone & configure

```bash
cp .env.example .env
# Add your Anthropic API key to .env
```

### 2. Frontend

```bash
cd kai          # root of project
npm install
npm run dev     # http://localhost:3000
```

### 3. Backend (optional — frontend works standalone via direct API)

```bash
cd backend
pip install -r requirements.txt
python app.py   # http://localhost:5000
```

---

## Architecture

```
kai/
├── backend/                   # Python Flask API
│   ├── app.py                 # Entry point
│   ├── database/db.py         # SQLite init & helpers
│   ├── routes/
│   │   ├── chat.py            # POST /api/chat
│   │   ├── memory.py          # GET/POST/DELETE /api/memory
│   │   └── profile.py         # GET/PATCH /api/profile
│   └── services/
│       ├── claude_service.py  # Anthropic API wrapper
│       ├── memory_service.py  # Extraction + retrieval
│       ├── prompt_builder.py  # Dynamic system prompt
│       └── relationship_service.py  # XP + friendship levels
│
└── src/                       # React + Tailwind + Framer Motion
    ├── pages/
    │   ├── Landing.jsx        # Mode selection
    │   └── Chat.jsx           # Main chat page
    ├── components/
    │   ├── avatar/KaiAvatar.jsx     # SVG avatar, blink, bounce, tremble
    │   ├── chat/ChatWindow.jsx      # Message list + typing indicator
    │   ├── chat/MessageBubble.jsx   # Individual messages + memory moments
    │   ├── chat/MessageInput.jsx    # Auto-resize textarea + send
    │   ├── header/ChatHeader.jsx    # Name, status, mode, actions
    │   ├── header/RelationshipBar.jsx  # XP bar
    │   ├── memory/MemoryPanel.jsx   # Slide-in memory drawer
    │   └── ui/RenameModal.jsx       # Rename modal
    ├── hooks/useChat.js         # Send message + all side effects
    ├── store/appStore.js        # Zustand persistent state
    └── utils/
        ├── api.js               # Claude API + prompt builder
        └── helpers.js           # XP, formatting, confetti, toast
```

---

## Features

- **Two modes** — Friend (warm, supportive) and Best Friend (funny, roasting, chaotic)
- **Animated SVG avatar** — blink, breathe, bounce (excited), tremble (fear), 7 expressions
- **Memory system** — pattern extraction + AI extraction, 💭 Remembered cards
- **Emotion detection** — local rules + Claude classification drives avatar
- **Relationship XP** — 🌱 New → 😊 Close → 😎 Best Friend
- **Rename** — "change your name to K" triggers in-character reaction
- **Silence awareness** — grief/loss gets 2 lines then stops, no advice
- **Confetti** — spawns on excited emotion (wins/achievements)
- **Persistent** — Zustand persisted to localStorage, SQLite on backend
